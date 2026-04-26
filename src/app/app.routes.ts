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
  {
    path: 'statistics',
    loadComponent: () => import('./statistics/statistics.page').then( m => m.StatisticsPage)
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.page').then( m => m.ProfilePage)
  },
  {
    path: 'friends',
    loadComponent: () => import('./friends/friends.page').then( m => m.FriendsPage)
  },
  {
    path: 'friend-details',
    loadComponent: () => import('./friend-details/friend-details.page').then( m => m.FriendDetailsPage)
  },
  {
    path: 'requests',
    loadComponent: () => import('./requests/requests.page').then( m => m.RequestsPage)
  },
];
