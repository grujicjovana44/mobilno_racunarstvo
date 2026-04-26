import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { addIcons } from 'ionicons'; 
import { personCircle, informationCircle, barChart, people, checkmarkCircle, closeCircle,
  mailOutline, calendarOutline, transgenderOutline, schoolOutline, locationOutline, add,
  chevronForwardOutline
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
    constructor() {
    addIcons({ 
      'person-circle': personCircle,
      'information-circle': informationCircle,
      'bar-chart': barChart,
      'people':people,
      'checkmark-circle': checkmarkCircle,
      'close-circle': closeCircle,
      'mail-outline': mailOutline,
      'calendar-outline': calendarOutline,
      'transgender-outline': transgenderOutline,
      'school-outline': schoolOutline,
      'location-outline': locationOutline,
      'add': add,
      'chevron-forward-outline': chevronForwardOutline
    });

    
  }
}