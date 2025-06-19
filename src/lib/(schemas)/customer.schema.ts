import { z } from 'zod';

export const customerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  location: z.string().min(3, 'Location is required'),
  joinedDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date'),
  image: z.instanceof(File).optional(),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;

export const CustomerDefaultValues = {
  name: '',
  email: '',
  phone: '',
  location: '',
  joinedDate: new Date().toISOString().split('T')[0],
};
