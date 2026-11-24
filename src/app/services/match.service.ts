import { Injectable, signal } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { type UserData } from '../models/user';
import { type MatchData, type MatchResult } from '../models/match';

@Injectable({
  providedIn: 'root',
})
export class MatchService {
  private readonly storageKey = 'match-history';
  private readonly historyState = signal<MatchData[]>([]);

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

