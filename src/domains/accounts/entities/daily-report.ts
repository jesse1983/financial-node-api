import { Entry } from '../../entries/entities';

export type DailyReport = {
  currentDailyValue: number;
  entries: Entry[];
};
