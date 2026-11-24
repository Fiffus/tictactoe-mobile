import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButton, IonCard, IonCardContent, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';
import { MatchService } from '../../services/match.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonCard, IonCardContent, DatePipe, TitleCasePipe],
})
export class StatisticsPage {
  private readonly matchService = inject(MatchService);

  get history() {
    return this.matchService.history();
  }

  get totalGames() {
    return this.matchService.totalGames;
  }

  get totalWins() {
    return this.matchService.totalWins;
  }

  get winRate() {
    return this.matchService.winRate;
  }
}
