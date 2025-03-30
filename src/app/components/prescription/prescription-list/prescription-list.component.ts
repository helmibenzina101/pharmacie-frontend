import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from '../../../services/data.service';
import { PrescriptionFormComponent } from '../prescription-form/prescription-form.component';
import { ToastrService } from 'ngx-toastr';
import jsPDF from 'jspdf';

interface Prescription {
  id: number;
  dateIssued: string;
  patient?: { fullName: string };
  medecin?: { fullName: string, specialization?: string };
  pharmacist?: { fullName: string, pharmacyName?: string };
  medications: number[]; // Use medications as an array of IDs
  // Remove medicationIds if not used
}

@Component({
  selector: 'app-prescription-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="container">
      <div class="header">
        <h2>Prescriptions</h2>
        <button mat-raised-button color="primary" (click)="openAddDialog()">
          <mat-icon>add</mat-icon> Add Prescription
        </button>
      </div>

      <div class="prescriptions-grid">
        <mat-card *ngFor="let prescription of prescriptions" class="prescription-card">
          <mat-card-header>
            <mat-card-title>Prescription #{{prescription.id}}</mat-card-title>
            <mat-card-subtitle>{{prescription.dateIssued | date}}</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <p><strong>Patient:</strong> {{prescription.patient?.fullName}}</p>
            <p><strong>Doctor:</strong> {{prescription.medecin?.fullName}}</p>
            <p><strong>Pharmacist:</strong> {{prescription.pharmacist?.fullName}}</p>
            <div class="medications">
              <strong>Medications:</strong>
              <ul>
                <li *ngFor="let medicationId of prescription.medications"> <!-- Use 'medications' instead of 'medicationIds' -->
                  {{getMedicationName(medicationId)}}
                </li>
              </ul>
            </div>
          </mat-card-content>

          <mat-card-actions align="end">
            <button mat-button color="accent" (click)="printPrescription(prescription)">
              <mat-icon>print</mat-icon> Print
            </button>
            <button mat-button color="primary" (click)="openEditDialog(prescription)">
              <mat-icon>edit</mat-icon> Edit
            </button>
            <button mat-button color="warn" (click)="deletePrescription(prescription.id)">
              <mat-icon>delete</mat-icon> Delete
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .prescriptions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    .prescription-card {
      margin-bottom: 16px;
    }
    .medications ul {
      margin: 8px 0;
      padding-left: 20px;
    }
    mat-card-actions {
      padding: 16px;
    }
  `]
})
export class PrescriptionListComponent implements OnInit {
  prescriptions: Prescription[] = [];
  medicationsMap: { [key: number]: any } = {};

  constructor(
    private dialog: MatDialog,
    private dataService: DataService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadPrescriptions();
  }

  loadPrescriptions(): void {
    this.dataService.getPrescriptions().subscribe({
      next: (prescriptions: Prescription[]) => {
        this.prescriptions = prescriptions;
        prescriptions.forEach((prescription: Prescription) => {
          if (prescription.medications && prescription.medications.length > 0) {
            prescription.medications.forEach((medicationId: number) => {
              if (!this.medicationsMap[medicationId]) {
                this.dataService.getMedication(medicationId).subscribe({
                  next: (medication) => {
                    this.medicationsMap[medicationId] = medication;
                    this.prescriptions = [...this.prescriptions]; // Ensure change detection
                  },
                  error: () => this.toastr.error(`Failed to load medication ${medicationId}`)
                });
              }
            });
          } else {
            this.toastr.warning(`No medication IDs found for prescription #${prescription.id}`);
          }
        });
      },
      error: () => this.toastr.error('Failed to load prescriptions')
    });
  }

  getMedicationName(medicationId: number): string {
    const medication = this.medicationsMap[medicationId];
    return medication ? medication.name : 'Loading...';
  }

  printPrescription(prescription: Prescription): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFontSize(20);
    doc.text('Prescription', pageWidth/2, 20, { align: 'center' });

    // Prescription details
    doc.setFontSize(12);
    doc.text(`Date: ${new Date(prescription.dateIssued).toLocaleDateString()}`, 20, 40);
    doc.text(`Prescription #${prescription.id}`, 20, 50);

    // Patient info
    doc.text('Patient Information:', 20, 70);
    doc.text(`Name: ${prescription.patient?.fullName}`, 30, 80);

    // Doctor info
    doc.text('Doctor Information:', 20, 100);
    doc.text(`Name: ${prescription.medecin?.fullName}`, 30, 110);
    doc.text(`Specialization: ${prescription.medecin?.specialization || 'N/A'}`, 30, 120);

    // Medications
    doc.text('Prescribed Medications:', 20, 140);
    if (prescription.medications && prescription.medications.length > 0) { // Use 'medications' instead of 'medicationIds'
      prescription.medications.forEach((medicationId: number, index: number) => {
        const medicationName = this.getMedicationName(medicationId);
        doc.text(`- ${medicationName}`, 30, 150 + (index * 10));
      });
    } else {
      doc.text('No medications listed.', 30, 150);
    }

    // Pharmacist info
    doc.text('Pharmacist Information:', 20, 200);
    doc.text(`Name: ${prescription.pharmacist?.fullName}`, 30, 210);
    doc.text(`Pharmacy: ${prescription.pharmacist?.pharmacyName || 'N/A'}`, 30, 220);

    // Save the PDF
    doc.save(`prescription-${prescription.id}.pdf`);
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(PrescriptionFormComponent, {
      width: '600px',
      data: { isEditMode: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPrescriptions();
      }
    });
  }

  openEditDialog(prescription: Prescription): void {
    const dialogRef = this.dialog.open(PrescriptionFormComponent, {
      width: '600px',
      data: { isEditMode: true, prescription }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPrescriptions();
      }
    });
  }

  deletePrescription(id: number) {
    if (confirm('Are you sure you want to delete this prescription?')) {
      this.dataService.deletePrescription(id).subscribe({
        next: () => {
          this.toastr.success('Prescription deleted successfully');
          this.loadPrescriptions();
        },
        error: () => this.toastr.error('Failed to delete prescription')
      });
    }
  }
}