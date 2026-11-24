import { Injectable, signal } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { type UserData } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class User {
  private readonly storageKey = 'user';

  private readonly userState = signal<UserData | null>(null);
  private readonly initializedState = signal(false);

  readonly user = this.userState.asReadonly();
  readonly initialized = this.initializedState.asReadonly();

  async initialize(): Promise<void> {
    if (this.initialized()) {
      return;
    }

    await this.load();
    this.initializedState.set(true);
  }

  private async createId(username: string): Promise<string> {
    const timestamp = Date.now();
    const input = `${username.trim().toLowerCase()}-${timestamp}`;

    const data = new TextEncoder().encode(input);
    const hash = await crypto.subtle.digest('SHA-256', data);

    const hashArray = Array.from(new Uint8Array(hash));
    const hashString = hashArray
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');

    return hashString;
  }

  async new(username: string): Promise<void> {
    const name = username.trim();

    if (!name) {
      return;
    }

    await this.initialize();

    const existingUser = this.userState();

    const user: UserData = {
      id: existingUser?.id ?? await this.createId(name),
      name,
    };

    this.userState.set(user);

    await this.persist();
  }

  private async load(): Promise<void> {
    try {
      const { value } = await Preferences.get({
        key: this.storageKey,
      });

      if (!value) {
        return;
      }

      const parsed: UserData = JSON.parse(value);

      if (
        typeof parsed.id === 'string' &&
        typeof parsed.name === 'string' &&
        parsed.id.length > 0 &&
        parsed.name.length > 0
      ) {
        this.userState.set(parsed);
      }
    } catch (error) {
      console.error('Could not load user.', error);
    }
  }

  private async persist(): Promise<void> {
    const user = this.userState();

    if (!user) {
      return;
    }

    try {
      await Preferences.set({
        key: this.storageKey,
        value: JSON.stringify(user),
      });
    } catch (error) {
      console.error('Could not save user.', error);
    }
  }
}

