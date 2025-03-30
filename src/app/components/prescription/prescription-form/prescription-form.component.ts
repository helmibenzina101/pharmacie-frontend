import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { DataService } from '../../../services/data.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

// Move interface before the component
interface Prescription {
  id?: number;
  patientId: number;
  medecinId: number;
  pharmacistId: number;
  dateIssued: Date;
  medications: number[];
  patient?: any;
  medecin?: any;
  pharmacist?: any;
}

@Component({
  selector: 'app-prescription-form',
  templateUrl: './prescription-form.component.html',
  styleUrls: ['./prescription-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatIconModule,
    MatSelectModule
  ]
})
export class PrescriptionFormComponent implements OnInit {
  prescriptionForm!: FormGroup;
  isEditMode = false;
  patients: any[] = [];
  medecins: any[] = [];
  pharmacists: any[] = [];
  medications: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private dialogRef: MatDialogRef<PrescriptionFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { isEditMode: boolean; prescription?: any },
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.prescriptionForm = this.fb.group({
      patientId: ['', Validators.required],
      medecinId: ['', Validators.required],
      pharmacistId: ['', Validators.required],
      dateIssued: [new Date(), Validators.required],
      medications: [[], Validators.required]
    });

    this.loadData();

    if (this.data?.isEditMode) {
      this.isEditMode = true;
      this.prescriptionForm.patchValue({
        patientId: this.data.prescription.patientId,
        medecinId: this.data.prescription.medecinId,
        pharmacistId: this.data.prescription.pharmacistId,
        dateIssued: new Date(this.data.prescription.dateIssued),
        medications: this.data.prescription.medications.map((m: any) => m.id)
      });
    }
  }

  loadData(): void {
    this.dataService.getPatients().subscribe({
      next: (data) => this.patients = data,
      error: () => this.toastr.error('Failed to load patients')
    });

    this.dataService.getMedecins().subscribe({
      next: (data) => this.medecins = data,
      error: () => this.toastr.error('Failed to load doctors')
    });

    this.dataService.getPharmacists().subscribe({
      next: (data) => this.pharmacists = data,
      error: () => this.toastr.error('Failed to load pharmacists')
    });

    this.dataService.getMedications().subscribe({
      next: (data) => this.medications = data,
      error: () => this.toastr.error('Failed to load medications')
    });
  }

  onSubmit(): void {
    if (this.prescriptionForm.invalid) {
      this.toastr.warning('Please fill all required fields');
      return;
    }

    const formValue = this.prescriptionForm.value;
    const prescriptionData: Prescription = {
      patientId: formValue.patientId,
      medecinId: formValue.medecinId,
      pharmacistId: formValue.pharmacistId,
      dateIssued: formValue.dateIssued,
      medications: formValue.medications,
      patient: this.patients.find(p => p.id === formValue.patientId),
      medecin: this.medecins.find(m => m.id === formValue.medecinId),
      pharmacist: this.pharmacists.find(p => p.id === formValue.pharmacistId)
    };

    if (this.isEditMode) {
      prescriptionData.id = this.data.prescription.id;
      this.dataService.updatePrescription(this.data.prescription.id, prescriptionData).subscribe(
        () => {
          this.toastr.success('Prescription updated successfully');
          this.dialogRef.close(true);
        },
        error => {
          this.toastr.error('Failed to update prescription');
        }
      );
    } else {
      this.dataService.createPrescription(prescriptionData).subscribe(
        () => {
          this.toastr.success('Prescription created successfully');
          this.dialogRef.close(true);
        },
        error => {
          this.toastr.error('Failed to create prescription');
        }
      );
    }
  }
}