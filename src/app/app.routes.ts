import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { MedecinListComponent } from './components/medecin/medecin-list/medecin-list.component';
import { PatientListComponent } from './components/patient/patient-list/patient-list.component';
import { MedicationListComponent } from './components/medication/medication-list/medication-list.component';
import { PharmacistListComponent } from './components/pharmacist/pharmacist-list/pharmacist-list.component';
import { PrescriptionListComponent } from './components/prescription/prescription-list/prescription-list.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'medecins', component: MedecinListComponent, canActivate: [AuthGuard] },
  { path: 'patients', component: PatientListComponent, canActivate: [AuthGuard] },
  { path: 'medications', component: MedicationListComponent, canActivate: [AuthGuard] },
  { path: 'pharmacists', component: PharmacistListComponent, canActivate: [AuthGuard] },
  { path: 'prescriptions', component: PrescriptionListComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];