import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RegisterComponent } from './register/register.component';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import {VerifyEmailComponent} from './verify-email/verify-email.component';
import {ProfileComponent} from './profile/profile.component';
import {AuthGuardGuard} from './services/auth-guard.guard';
import {GatewayComponent} from './gateway/gateway.component';




const routes: Routes = [
  //authGuard to protect stupid user that want see data without login (no login no data easy)
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuardGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuardGuard] },
  { path: 'register-user', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'verify-email-address', component: VerifyEmailComponent },
  { path: 'about', component: AboutPageComponent },
  { path: 'analytics', component: AnalyticsComponent, canActivate: [AuthGuardGuard] },
  { path: 'gateway', component: GatewayComponent, canActivate: [AuthGuardGuard] },
  { path: '**', component: PageNotFoundComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
