import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { DataService } from '../../../services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { MedecinFormComponent } from '../medecin-form/medecin-form.component';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-medecin-list',
  templateUrl: './medecin-list.component.html',
  styleUrls: ['./medecin-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ]
})
export class MedecinListComponent implements OnInit {
  medecins: any[] = [];
  displayedColumns: string[] = ['id', 'fullName', 'email', 'specialization', 'actions'];

  constructor(
    private dataService: DataService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadMedecins();
  }

  loadMedecins(): void {
    this.dataService.getMedecins().subscribe(
      (data: any) => {
        this.medecins = data.medecins || data; // Handle both nested and flat responses
      },
      error => {
        this.toastr.error('Failed to load medecins');
      }
    );
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(MedecinFormComponent, {
      width: '500px',
      data: { mode: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadMedecins();
      }
    });
  }

  openEditDialog(medecin: any): void {
    const dialogRef = this.dialog.open(MedecinFormComponent, {
      width: '500px',
      data: { medecin } // Pass medecin object directly
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadMedecins();
      }
    });
  }

  deleteMedecin(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { title: 'Confirm Delete', message: 'Are you sure you want to delete this medecin?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataService.deleteMedecin(id).subscribe(
          () => {
            this.toastr.success('Medecin deleted successfully');
            this.loadMedecins();
          },
          error => {
            this.toastr.error('Failed to delete medecin');
          }
        );
      }
    });
  }
}