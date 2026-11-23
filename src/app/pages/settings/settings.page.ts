import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButton, IonCard, IonCardContent, IonContent, IonHeader, IonIcon, IonInput, IonTitle, IonToggle, IonToolbar } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  personOutline,
  fingerPrintOutline,
  bluetoothOutline
} from 'ionicons/icons';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonCardContent, IonCard, IonInput, IonButton, IonToggle, IonIcon],
})
export class SettingsPage implements OnInit {
  constructor() {
    addIcons({
      personOutline,
      fingerPrintOutline,
      bluetoothOutline
    });
  }

  ngOnInit() { }
}
