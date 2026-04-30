import { booleanAttribute, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Router, NavigationEnd } from '@angular/router'; 
import { filter, map } from 'rxjs/operators';

import { addIcons } from 'ionicons'; 
import { personCircle, informationCircle, barChart, people, checkmarkCircle, closeCircle,
  mailOutline, calendarOutline, transgenderOutline, schoolOutline, locationOutline, add,
  chevronForwardOutline, mapOutline,
  book,
  barChartOutline,
  peopleOutline
 } from 'ionicons/icons'; 

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AppComponent {

    showTabs = true;
    constructor(private router: Router) {
    addIcons({ 
      'person-circle': personCircle,
      'person-circle-outline': personCircle,
      'map-outline': mapOutline,
      'bar-chart-outline': barChartOutline,
      'information-circle': informationCircle,
      'bar-chart': barChart,
      'people':people,
      'people-outline': peopleOutline,
      'checkmark-circle': checkmarkCircle,
      'close-circle': closeCircle,
      'mail-outline': mailOutline,
      'calendar-outline': calendarOutline,
      'transgender-outline': transgenderOutline,
      'school-outline': schoolOutline,
      'location-outline': locationOutline,
      'add': add,
      'log-out-outline': closeCircle,
      'chevron-forward-outline': chevronForwardOutline
    });

    
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const hideOnRoutes = ['/login', '/register'];
      
      this.showTabs = !hideOnRoutes.includes(event.urlAfterRedirects);
    });
  }

  
   
}