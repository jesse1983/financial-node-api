import { z } from 'zod';
import { entryValidation } from '../validations';

export type EntryInput = z.infer<typeof entryValidation>;
