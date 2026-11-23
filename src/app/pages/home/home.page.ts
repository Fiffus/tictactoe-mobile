import { Component, OnInit } from '@angular/core';
import { IonButton, IonCard, IonCardContent, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonCardContent, IonCard],
})
export class HomePage implements OnInit {
  constructor() { }

  ngOnInit() { }
}
