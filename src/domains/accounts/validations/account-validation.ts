import { z } from 'zod';

export const accountValidation = z.object({
  title: z.string().datetime(),
  currentValue: z.number().default(0)
});
