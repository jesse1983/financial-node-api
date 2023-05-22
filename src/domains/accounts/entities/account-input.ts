import { z } from 'zod';
import { accountValidation } from '../validations';

export type AccountInput = z.infer<typeof accountValidation>;
