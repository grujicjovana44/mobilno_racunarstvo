import { Routes } from '@angular/router';
import { authGuard } from './auth/auth-guard';

export const routes: Routes = [
 
  {
    path: '',
    redirectTo: 'travel',
    pathMatch: 'full',
  },
  {
    path: 'travel',
    loadComponent: () => import('./travel/travel.page').then( m => m.TravelPage),
    canActivate: [authGuard]
  },
  {
    path: 'travel-details',
    loadComponent: () => import('./travel-details/travel-details.page').then( m => m.TravelDetailsPage),
    canActivate: [authGuard]
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
    loadComponent: () => import('./add-travel/add-travel.page').then( m => m.AddTravelPage),
    canActivate: [authGuard]
  },
  {
    path: 'travel/:id/edit',
    loadComponent: () => import('./add-travel/add-travel.page').then( m => m.AddTravelPage),
    canActivate: [authGuard]
  },
  {
    path: 'statistics',
    loadComponent: () => import('./statistics/statistics.page').then( m => m.StatisticsPage),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.page').then( m => m.ProfilePage),
    canActivate: [authGuard]
  },
  {
    path: 'friends',
    loadComponent: () => import('./friends/friends.page').then( m => m.FriendsPage),
    canActivate: [authGuard]
  },
  {
    path: 'friend-details',
    loadComponent: () => import('./friend-details/friend-details.page').then( m => m.FriendDetailsPage),
    canActivate: [authGuard]
  },
  {
    path: 'requests',
    loadComponent: () => import('./requests/requests.page').then( m => m.RequestsPage),
    canActivate: [authGuard]
  },
];
