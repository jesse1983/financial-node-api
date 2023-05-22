import { z } from 'zod';
import { itemValidation } from './item-validation';
import { NegotiationType } from '@prisma/client';

export const entryValidation = z.object({
  negotiationType: z.enum([NegotiationType.CREDIT, NegotiationType.DEBIT]),
  date: z.string().datetime(),
  items: z.array(itemValidation).min(1),
  discount: z.number().gte(0).optional(),
  customerKey: z.string().min(1).max(64),
  customerName: z.string().min(1).max(128),
  accountId: z.number().gte(0)
});
