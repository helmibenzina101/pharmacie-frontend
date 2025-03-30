import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { DataService } from '../../../services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { PharmacistFormComponent } from '../pharmacist-form/pharmacist-form.component';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pharmacist-list',
  templateUrl: './pharmacist-list.component.html',
  styleUrls: ['./pharmacist-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ]
})
export class PharmacistListComponent implements OnInit {
  pharmacists: any[] = [];
  displayedColumns: string[] = ['id', 'fullName', 'pharmacyName', 'email', 'actions'];

  constructor(
    private dataService: DataService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadPharmacists();
  }

  loadPharmacists(): void {
    this.dataService.getPharmacists().subscribe(
      (data: any[]) => {
        this.pharmacists = data;
      },
      error => {
        this.toastr.error('Failed to load pharmacists');
      }
    );
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(PharmacistFormComponent, {
      width: '500px',
      data: { mode: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPharmacists();
      }
    });
  }

  openEditDialog(pharmacist: any): void {
    const dialogRef = this.dialog.open(PharmacistFormComponent, {
      width: '500px',
      data: { mode: 'edit', pharmacist }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPharmacists();
      }
    });
  }

  deletePharmacist(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { title: 'Confirm Delete', message: 'Are you sure you want to delete this pharmacist?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataService.deletePharmacist(id).subscribe(
          () => {
            this.toastr.success('Pharmacist deleted successfully');
            this.loadPharmacists();
          },
          error => {
            this.toastr.error('Failed to delete pharmacist');
          }
        );
      }
    });
  }
}