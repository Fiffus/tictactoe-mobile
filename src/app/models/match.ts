import { type UserData } from './user';

export type MatchResult = 'win' | 'loss' | 'draw';

export interface MatchData {
  id: string;
  local: UserData;
  adversary: UserData;
  result: MatchResult;
  playedAt: number;
}
