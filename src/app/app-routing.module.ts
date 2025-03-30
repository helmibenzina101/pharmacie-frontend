import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Correct the import path based on your actual directory structure
import { MedecinFormComponent } from './components/medecin/medecin-form/medecin-form.component'; // Example correction
import { PrescriptionListComponent } from './components/prescription/prescription-list/prescription-list.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'medecin-form', component: MedecinFormComponent },
  { path: 'prescriptions', component: PrescriptionListComponent, canActivate: [AuthGuard] },
  // ... other routes ...
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }