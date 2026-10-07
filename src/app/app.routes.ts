import { Routes } from '@angular/router';
import { SignupComponent } from './feature/auth/signup/signup.component';
import { DashboardComponent } from './feature/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: SignupComponent,
        title: 'Sign Up'
    },
    {
        path: 'signup', redirectTo: '', pathMatch: 'full'
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        title: 'Dashboard',
        canActivate: [authGuard]
    },
];
