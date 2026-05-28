import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { FirebaseService } from './firebase.service';

export interface StatsData {
  total: number;
  ownCount: number;
  sharedCount: number;
  topDestination: { name: string; count: number } | null;
  buddies: { name: string; count: number }[];
  monthlyLabels: string[];
  monthlyValues: number[];
}

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  constructor(private firebaseService: FirebaseService) {}

  async getMyStats(myUid: string): Promise<StatsData> {
    const [ownTravels, sharedTravels] = await Promise.all([
      firstValueFrom(this.firebaseService.getMyTravelsOnce(myUid)),
      firstValueFrom(this.firebaseService.getSharedTravelsOnce(myUid))
    ]);

    const allTravels = [...ownTravels, ...sharedTravels];

    const total = allTravels.length;
    const ownCount = ownTravels.length;
    const sharedCount = sharedTravels.length;

    const destMap = new Map<string, number>();
    for (const t of allTravels) {
      const dest = `${t.grad}, ${t.drzava}`;
      destMap.set(dest, (destMap.get(dest) || 0) + 1);
    }
    let topDestination: { name: string; count: number } | null = null;
    destMap.forEach((count, name) => {
      if (!topDestination || count > topDestination.count) {
        topDestination = { name, count };
      }
    });

    const buddyMap = new Map<string, number>();
    for (const t of ownTravels) {
      const participants: string[] = t.participants || [];
      for (const uid of participants) {
        buddyMap.set(uid, (buddyMap.get(uid) || 0) + 1);
      }
    }

    const topBuddyUids = [...buddyMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const buddies = await Promise.all(
      topBuddyUids.map(async ([uid, count]) => {
        const profile = (await firstValueFrom(
          this.firebaseService.getUserProfile(uid)
        )) as any;
        return { name: profile?.name || 'Nepoznat', count };
      })
    );

    const monthMap = new Map<string, number>();
    for (const t of allTravels) {
      const monthKey = this.parseMonthKey(t.datumOd);
      if (monthKey) {
        monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + 1);
      }
    }

    const sortedMonths = [...monthMap.entries()].sort(
      (a, b) => this.monthKeyToSortable(a[0]) - this.monthKeyToSortable(b[0])
    );

    const monthlyLabels = sortedMonths.map(([key]) => this.formatMonthLabel(key));
    const monthlyValues = sortedMonths.map(([, count]) => count);

    return { total, ownCount, sharedCount, topDestination, buddies, monthlyLabels, monthlyValues };
  }

  private parseMonthKey(dateStr: string): string | null {
    if (!dateStr) return null;
    const parts = dateStr.split('.');
    if (parts.length < 3) return null;
    const month = parts[1].padStart(2, '0');
    const year = parts[2];
    if (!month || !year || year.length < 4) return null;
    return `${month}.${year}`;
  }

  private monthKeyToSortable(key: string): number {
    const [mm, yyyy] = key.split('.');
    return parseInt(yyyy) * 100 + parseInt(mm);
  }

  private formatMonthLabel(key: string): string {
    const [mm, yyyy] = key.split('.');
    const names = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Avg', 'Sep', 'Okt', 'Nov', 'Dec'];
    return `${names[parseInt(mm) - 1]} ${yyyy}`;
  }
}
