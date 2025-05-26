import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  template: `
    <mat-toolbar color="primary">
      <a mat-button routerLink="/">Pharmacy Management</a>
      
      <ng-container *ngIf="authService.isAuthenticated()">
        <a mat-button routerLink="/prescriptions">Prescriptions</a>
        <a mat-button routerLink="/medications">Medications</a>
        <a mat-button routerLink="/patients">Patients</a>
        <a mat-button routerLink="/medecins">Doctors</a>
        <a mat-button routerLink="/pharmacists">Pharmacists</a>
      </ng-container>

      <span class="spacer"></span>

      <ng-container *ngIf="!authService.isAuthenticated(); else loggedIn">
        <a mat-button routerLink="/login">
          <mat-icon>login</mat-icon>
          Login
        </a>
      </ng-container>

      <ng-template #loggedIn>
        <button mat-button [matMenuTriggerFor]="userMenu">
          <mat-icon>account_circle</mat-icon>
          {{ authService.getUserRole() | titlecase }}
        </button>
        <mat-menu #userMenu="matMenu">
          <button mat-menu-item (click)="authService.logout()">
            <mat-icon>logout</mat-icon>
            Logout
          </button>
        </mat-menu>
      </ng-template>
    </mat-toolbar>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }
    mat-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
    }
  `]
})
export class NavbarComponent {
  constructor(public authService: AuthService) {}
}
