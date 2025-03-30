import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { DataService } from '../../../services/data.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class PatientFormComponent implements OnInit {
  patientForm!: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private dialogRef: MatDialogRef<PatientFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.patientForm = this.fb.group({
      fullName: ['', Validators.required],
      address: ['', Validators.required]
    });

    if (this.data.mode === 'edit') {
      this.isEditMode = true;
      this.patientForm.patchValue(this.data.patient);
    }
  }

  onSubmit(): void {
    if (this.patientForm.invalid) {
      return;
    }

    const patientData = {
      id: this.data.patient?.id || 0,
      fullName: this.patientForm.value.fullName,
      address: this.patientForm.value.address
    };

    if (this.isEditMode) {
      this.dataService.updatePatient(this.data.patient.id, patientData).subscribe(
        () => {
          this.toastr.success('Patient updated successfully');
          this.dialogRef.close(true);
        },
        error => {
          if (error.status === 404) {
            this.toastr.error('Patient not found');
          } else if (error.status === 400) {
            this.toastr.error('Invalid patient data');
          } else {
            this.toastr.error('Failed to update patient');
          }
        }
      );
    } else {
      this.dataService.createPatient(patientData).subscribe(
        () => {
          this.toastr.success('Patient created successfully');
          this.dialogRef.close(true);
        },
        error => {
          this.toastr.error('Failed to create patient');
        }
      );
    }
  }
}