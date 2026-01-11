import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters long." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters long." }).max(1000, { message: "Message cannot exceed 1000 characters." }),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export const signUpSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  username: z.string().min(3, { message: "Username must be at least 3 characters." })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;

export const completeRegistrationSchema = z.object({
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string(),
  token: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type CompleteRegistrationFormData = z.infer<typeof completeRegistrationSchema>;

export const checkoutSchema = z.object({
  address: z.string().min(10, { message: "Please provide a complete shipping address (at least 10 characters)." }),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;