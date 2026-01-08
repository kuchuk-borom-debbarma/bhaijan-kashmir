'use server';

import { signUpSchema, completeRegistrationSchema, SignUpFormData, CompleteRegistrationFormData } from '@/lib/schemas';
import { prisma } from '@/lib/prisma';
import { createMagicLinkToken, verifyMagicLinkToken } from '@/lib/auth-token';
import { notificationService } from '@/lib/notifications';
import bcrypt from 'bcryptjs';
import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';

export async function signOutAction() {
  await signOut({ redirectTo: '/' });
}

export type AuthActionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export async function authenticate(prevState: AuthActionState, formData: FormData): Promise<AuthActionState> {
  try {
    await signIn('credentials', {
      ...Object.fromEntries(formData),
      redirectTo: '/',
    });
    return { success: true };
  } catch (error) {

    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { success: false, message: 'Invalid credentials.' };
        default:
          return { success: false, message: 'Something went wrong.' };
      }
    }
    throw error; // Re-throw non-AuthErrors (like NEXT_REDIRECT)
  }
}

export async function signUpAction(prevState: AuthActionState, formData: FormData): Promise<AuthActionState> {

  const rawData = {
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    username: formData.get('username'),
    email: formData.get('email'),
  };

  const validated = signUpSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      message: 'Please fix the errors below.',
    };
  }

  const { email, username, firstName, lastName } = validated.data;

  // Check if user already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        { username },
      ],
    },
  });

  if (existingUser) {
    return {
      success: false,
      message: 'User with this email or username already exists.',
    };
  }

  // Generate Magic Link Token
  const token = await createMagicLinkToken({ firstName, lastName, username, email });

  // Construct Link (Assumes localhost for now, should be env var in prod)
  // In production, use process.env.NEXT_PUBLIC_APP_URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const magicLink = `${baseUrl}/auth/verify?token=${token}`;

  // Send Notification
  await notificationService.sendMagicLink(email, magicLink);

  return {
    success: true,
    message: 'A verification link has been sent to your email. Please check your inbox (and console).',
  };
}

export async function completeRegistrationAction(prevState: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const rawData = {
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
    token: formData.get('token'),
  };

  const validated = completeRegistrationSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      message: 'Please fix the errors below.',
    };
  }

  const { password, token } = validated.data;

  // Verify Token
  const payload = await verifyMagicLinkToken(token);
  if (!payload) {
    return {
      success: false,
      message: 'Invalid or expired verification link. Please sign up again.',
    };
  }

  const { firstName, lastName, username, email } = payload;

  // Double check if user exists (race condition)
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        { username },
      ],
    },
  });

  if (existingUser) {
    return {
      success: false,
      message: 'User already exists.',
    };
  }

  // Hash Password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create User
  try {
    await prisma.user.create({
      data: {
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
        role: 'USER',
      },
    });
  } catch (error) {
    console.error('Registration Error:', error);
    return {
      success: false,
      message: 'Failed to create account. Please try again.',
    };
  }

  return {
    success: true,
    message: 'Account created successfully! You can now log in.',
  };
}
