import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Chart, registerables } from 'chart.js';
import { StatsService, StatsData } from '../services/stats.service';
import { AuthService } from '../auth/auth';

Chart.register(...registerables);

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class StatisticsPage implements OnInit, OnDestroy {
  @ViewChild('activityChart') chartCanvas!: ElementRef;

  stats: StatsData | null = null;
  loading = true;
  private chart: Chart | null = null;

  constructor(
    private statsService: StatsService,
    private authService: AuthService
  ) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    const uid = this.authService.currentUid;
    if (!uid) return;

    this.loading = true;
    this.stats = await this.statsService.getMyStats(uid);
    this.loading = false;

    // Daj DOM-u da se renderuje pre nego što crtamo chart
    setTimeout(() => this.buildChart(), 100);
  }

  ionViewWillLeave() {
    this.chart?.destroy();
    this.chart = null;
  }

  ngOnDestroy() {
    this.chart?.destroy();
  }

  private buildChart() {
    if (!this.chartCanvas || !this.stats) return;

    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const labels = this.stats.monthlyLabels.length > 0
      ? this.stats.monthlyLabels
      : ['Nema podataka'];
    const data = this.stats.monthlyValues.length > 0
      ? this.stats.monthlyValues
      : [0];

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Putovanja',
          data,
          backgroundColor: '#d7abab',
          borderColor: '#c49090',
          borderWidth: 1,
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 }
          }
        }
      }
    });
  }
}
