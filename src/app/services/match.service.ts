import { Injectable, signal } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { type UserData } from '../models/user';
import { type MatchData, type MatchResult } from '../models/match';

@Injectable({
  providedIn: 'root',
})
export class MatchService {
  private readonly storageKey = 'match-history';
  private readonly historyState = signal<MatchData[]>([
    {
      id: 'match-001',
      local: { id: 'player-001', name: 'Alex' },
      adversary: { id: 'player-002', name: 'Daniel' },
      result: 'win',
      playedAt: Date.now() - 1000 * 60 * 10,
    },
    {
      id: 'match-002',
      local: { id: 'player-001', name: 'Alex' },
      adversary: { id: 'player-003', name: 'Sophie' },
      result: 'loss',
      playedAt: Date.now() - 1000 * 60 * 60,
    },
    {
      id: 'match-003',
      local: { id: 'player-001', name: 'Alex' },
      adversary: { id: 'player-004', name: 'Michael' },
      result: 'draw',
      playedAt: Date.now() - 1000 * 60 * 60 * 3,
    },
    {
      id: 'match-004',
      local: { id: 'player-001', name: 'Alex' },
      adversary: { id: 'player-005', name: 'Emma' },
      result: 'win',
      playedAt: Date.now() - 1000 * 60 * 60 * 24,
    },
    {
      id: 'match-005',
      local: { id: 'player-001', name: 'Alex' },
      adversary: { id: 'player-006', name: 'Oliver' },
      result: 'win',
      playedAt: Date.now() - 1000 * 60 * 60 * 48,
    },
    {
      id: 'match-006',
      local: { id: 'player-001', name: 'Alex' },
      adversary: { id: 'player-007', name: 'Charlotte' },
      result: 'loss',
      playedAt: Date.now() - 1000 * 60 * 60 * 72,
    },
  ]);

  readonly history = this.historyState.asReadonly();

  async initialize(): Promise<void> {
    await this.load();
  }

  async update(
    local: UserData,
    adversary: UserData,
    result: MatchResult
  ): Promise<void> {
    const match: MatchData = {
      id: crypto.randomUUID(),
      local,
      adversary,
      result,
      playedAt: Date.now(),
    };

    this.historyState.update(history => [
      match,
      ...history,
    ]);

    await this.persist();
  }

  get totalGames(): number {
    return this.history().length;
  }

  get totalWins(): number {
    return this.history().filter(
      match => match.result === 'win'
    ).length;
  }

  get totalLosses(): number {
    return this.history().filter(
      match => match.result === 'loss'
    ).length;
  }

  get totalDraws(): number {
    return this.history().filter(
      match => match.result === 'draw'
    ).length;
  }

  get winRate(): number {
    const games = this.totalGames;

    if (games === 0) return 0;

    return Math.round((this.totalWins / games) * 100);
  }

  async clearHistory(): Promise<void> {
    this.historyState.set([]);

    await Preferences.remove({
      key: this.storageKey,
    });
  }

  private async load(): Promise<void> {
    try {
      const { value } = await Preferences.get({
        key: this.storageKey,
      });

      if (!value) return;

      const parsed: MatchData[] = JSON.parse(value);

      if (Array.isArray(parsed)) {
        this.historyState.set(parsed);
      }
    } catch (error) {
      console.error('Could not load match history.', error);
    }
  }

  private async persist(): Promise<void> {
    await Preferences.set({
      key: this.storageKey,
      value: JSON.stringify(this.historyState()),
    });
  }
}

