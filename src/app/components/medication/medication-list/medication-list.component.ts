import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { DataService } from '../../../services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { MedicationFormComponent } from '../medication-form/medication-form.component';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-medication-list',
  templateUrl: './medication-list.component.html',
  styleUrls: ['./medication-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ]
})
export class MedicationListComponent implements OnInit {
  medications: any[] = [];
  displayedColumns: string[] = ['id', 'name', 'stockQuantity', 'actions'];

  constructor(
    private dataService: DataService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadMedications();
  }

  loadMedications(): void {
    this.dataService.getMedications().subscribe(
      (data: any[]) => {
        this.medications = data;
      },
      error => {
        this.toastr.error('Failed to load medications');
      }
    );
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(MedicationFormComponent, {
      width: '500px',
      data: { mode: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadMedications();
      }
    });
  }

  openEditDialog(medication: any): void {
    const dialogRef = this.dialog.open(MedicationFormComponent, {
      width: '500px',
      data: { mode: 'edit', medication }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadMedications();
      }
    });
  }

  deleteMedication(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { title: 'Confirm Delete', message: 'Are you sure you want to delete this medication?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataService.deleteMedication(id).subscribe(
          () => {
            this.toastr.success('Medication deleted successfully');
            this.loadMedications();
          },
          error => {
            this.toastr.error('Failed to delete medication');
          }
        );
      }
    });
  }
}