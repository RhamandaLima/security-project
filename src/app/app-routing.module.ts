import { ListComponent } from './components/list/list.component';
import { RegistrationConfirmationComponent } from './pages/registration-confirmation/registration-confirmation.component';
import { RegistrationFormSecureComponent } from './pages/registration-form-secure/registration-form-secure.component';
import { WelcomePageComponent } from './pages/welcome-page/welcome-page.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        component: WelcomePageComponent,
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'secure-registration-form',
        component: RegistrationFormSecureComponent,
      },
      {
        path: 'confirm-registration',
        component: RegistrationConfirmationComponent,
      },
      {
        path: 'list',
        component: ListComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
