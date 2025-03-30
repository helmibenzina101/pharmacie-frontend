import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DataService } from '../../../services/data.service';
import { ToastrService } from 'ngx-toastr';
import { PatientFormComponent } from '../patient-form/patient-form.component';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ]
})
export class PatientListComponent implements OnInit {
  patients: any[] = [];
  displayedColumns: string[] = ['id', 'fullName', 'address', 'actions'];

  constructor(
    private dataService: DataService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.dataService.getPatients().subscribe(
      (data: any[]) => {
        this.patients = data;
      },
      error => {
        this.toastr.error('Failed to load patients');
      }
    );
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(PatientFormComponent, {
      width: '500px',
      data: { mode: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPatients();
      }
    });
  }

  openEditDialog(patient: any): void {
    const dialogRef = this.dialog.open(PatientFormComponent, {
      width: '500px',
      data: { mode: 'edit', patient }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPatients();
      }
    });
  }

  deletePatient(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { title: 'Confirm Delete', message: 'Are you sure you want to delete this patient?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataService.deletePatient(id).subscribe(
          () => {
            this.toastr.success('Patient deleted successfully');
            this.loadPatients();
          },
          error => {
            this.toastr.error('Failed to delete patient');
          }
        );
      }
    });
  }
}