import { z } from 'zod';

export const profileFormSchema = z.object({
  display_name: z
    .string()
    .min(1, 'Display name cannot be empty.')
    .max(60, 'Display name must not exceed 60 characters.'),
  avatar_url: z
    .string()
    .url('Avatar must be a valid URL.')
    .or(z.literal(''))
    .optional(),
});
export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export const workspaceFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Workspace name must be at least 2 characters.')
    .max(60, 'Workspace name must not exceed 60 characters.'),
});
export type WorkspaceFormValues = z.infer<typeof workspaceFormSchema>;

export const passwordChangeSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters.').max(72),
    confirmPassword: z.string().min(8, 'Password must be at least 8 characters.').max(72),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });
export type PasswordChangeFormValues = z.infer<typeof passwordChangeSchema>;

export const deleteAccountFormSchema = z.object({
  confirmation: z.literal('DELETE', {
    errorMap: () => ({ message: 'You must type "DELETE" in capital letters to confirm.' }),
  }),
});
export type DeleteAccountFormValues = z.infer<typeof deleteAccountFormSchema>;

