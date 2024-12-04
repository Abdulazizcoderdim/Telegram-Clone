import { z } from 'zod';

export const emailSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
});

export const otpSchema = z
  .object({
    otp: z.string().min(6, {
      message: 'Your one-time password must be 6 characters.',
    }),
  })
  .merge(emailSchema);

export const messageSchema = z.object({
  text: z.string().min(1, { message: 'Please enter a message.' }),
  image: z.string().optional(),
});
