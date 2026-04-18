import { Routes } from '@angular/router';

export const routes: Routes = [
 
  {
    path: '',
    redirectTo: 'travel',
    pathMatch: 'full',
  },
  {
    path: 'travel',
    loadComponent: () => import('./travel/travel.page').then( m => m.TravelPage)
  },
  {
    path: 'travel-details',
    loadComponent: () => import('./travel-details/travel-details.page').then( m => m.TravelDetailsPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'add-travel',
    loadComponent: () => import('./add-travel/add-travel.page').then( m => m.AddTravelPage)
  },
  {
    path: 'travel/:id/edit',
    loadComponent: () => import('./add-travel/add-travel.page').then( m => m.AddTravelPage)
  },
];
