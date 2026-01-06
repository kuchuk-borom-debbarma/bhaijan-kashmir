'use server';

import { contactFormSchema, ContactFormData } from '@/lib/schemas';
import { checkRateLimit } from '@/lib/rate-limit';
import { headers } from 'next/headers';

export type ActionState = {
  success: boolean;
  message?: string;
  errors?: {
    [K in keyof ContactFormData]?: string[];
  };
};

export async function submitContactForm(prevState: ActionState, formData: FormData): Promise<ActionState> {
  // 1. Rate Limiting
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for') || 'unknown-ip';
  
  const isAllowed = await checkRateLimit(ip);
  if (!isAllowed) {
    return {
      success: false,
      message: 'Too many requests. Please try again in a minute.',
    };
  }

  // 2. Parse and Validate Data
  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
    subject: formData.get('subject'),
    message: formData.get('message'),
  };

  const validatedFields = contactFormSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please fix the errors below.',
    };
  }

  // 3. Process the valid data
  // In a real app, you would send an email here (e.g., via Resend or SendGrid)
  // or save it to the database.
  
  console.log('Valid Form Submission:', validatedFields.data);

  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    success: true,
    message: 'Thank you! Your message has been sent successfully.',
  };
}
