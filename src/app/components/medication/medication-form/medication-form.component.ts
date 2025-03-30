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
  selector: 'app-medication-form',
  templateUrl: './medication-form.component.html',
  styleUrls: ['./medication-form.component.scss'],
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
export class MedicationFormComponent implements OnInit {
  medicationForm!: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private dialogRef: MatDialogRef<MedicationFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.medicationForm = this.fb.group({
      name: ['', Validators.required],
      stockQuantity: ['', [Validators.required, Validators.min(0)]]
    });

    if (this.data.mode === 'edit') {
      this.isEditMode = true;
      this.medicationForm.patchValue(this.data.medication);
    }
  }

  onSubmit(): void {
    if (this.medicationForm.invalid) {
      return;
    }

    const medicationData = {
      id: this.data.medication?.id || 0,
      name: this.medicationForm.value.name,
      stockQuantity: this.medicationForm.value.stockQuantity
    };

    if (this.isEditMode) {
      this.dataService.updateMedication(this.data.medication.id, medicationData).subscribe(
        () => {
          this.toastr.success('Medication updated successfully');
          this.dialogRef.close(true);
        },
        error => {
          if (error.status === 404) {
            this.toastr.error('Medication not found');
          } else if (error.status === 400) {
            this.toastr.error('Invalid medication data');
          } else {
            this.toastr.error('Failed to update medication');
          }
        }
      );
    } else {
      this.dataService.createMedication(medicationData).subscribe(
        () => {
          this.toastr.success('Medication created successfully');
          this.dialogRef.close(true);
        },
        error => {
          this.toastr.error('Failed to create medication');
        }
      );
    }
  }
}