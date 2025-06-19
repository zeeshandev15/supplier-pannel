import { z } from 'zod';

export const productSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.string().min(2, 'Price must be at least 2 characters'),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date'),
  image: z.instanceof(File).optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
export const ProductDefaultValues = {
  title: '',
  description: '',
  price: '',
  date: new Date().toISOString().split('T')[0],
};
