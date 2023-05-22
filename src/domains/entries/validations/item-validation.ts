import { z } from 'zod';

export const itemValidation = z.object({
  referenceKey: z.string().min(1).max(64),
  title: z.string().min(1).max(128),
  price: z.number().min(0),
  discount: z.number().min(0).optional(),
  comments: z.string().optional()
});
