import { z as zod } from 'zod';

// registerationSchema
export const registerationSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required' }),
  email: zod.string().min(1, { message: 'Email is required' }).email(),
  password: zod.string().min(6, { message: 'Password should be at least 6 characters' }),
  phone: zod.string().min(6, { message: 'Phone Number is required' }),
  verificationMethod: zod.boolean().refine((value) => value, 'You must accept the verificaion Method'),
});

export type RegistrationFormValues = zod.infer<typeof registerationSchema>;

// registerDefaultValues
export const registerDefaultValues: RegistrationFormValues = {
  name: '',
  email: '',
  password: '',
  phone: '',
  verificationMethod: false,
};

export const loginSchema = zod.object({
  email: zod.string().min(1, { message: 'Email is required' }).email(),
  password: zod.string().min(1, { message: 'Password is required' }),
});

export type LoginFormValues = zod.infer<typeof loginSchema>;

export const loginDefaultValues = { email: '', password: '' } satisfies LoginFormValues;

export const resetSchema = zod
  .object({
    token: zod.string().min(1, { message: 'Token is required' }),
    password: zod.string().min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: zod.string().min(6, { message: 'Confirm Password is required' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ResetFormValues = zod.infer<typeof resetSchema>;

export const ResetDefaultValues: ResetFormValues = {
  token: '',
  password: '',
  confirmPassword: '',
};
