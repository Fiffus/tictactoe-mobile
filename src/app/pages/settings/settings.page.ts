
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonButton,
  IonInput,
  IonIcon,
  IonToggle
} from '@ionic/angular';

import { addIcons } from 'ionicons';
import {
  personOutline,
  fingerPrintOutline,
  bluetoothOutline
} from 'ionicons/icons';

import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardContent,
    IonButton,
    IonInput,
    IonIcon,
    IonToggle
  ],
})
export class SettingsPage implements OnInit {
  readonly userService = inject(UserService);

  playerName = '';
  saving = false;

  constructor() {
    addIcons({
      personOutline,
      fingerPrintOutline,
      bluetoothOutline
    });
  }

  async ngOnInit(): Promise<void> {
    await this.userService.initialize();

    this.playerName = this.userService.user()?.name ?? '';
  }

  async saveName(): Promise<void> {
    const name = this.playerName.trim();

    if (!name || this.saving) {
      return;
    }

    this.saving = true;

    try {
      await this.userService.new(name);
      this.playerName = this.userService.user()?.name ?? '';
    } catch (error) {
      console.error('Could not save player name.', error);
    } finally {
      this.saving = false;
    }
  }
}

