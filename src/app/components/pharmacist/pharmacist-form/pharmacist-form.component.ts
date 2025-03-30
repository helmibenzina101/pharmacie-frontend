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
  selector: 'app-pharmacist-form',
  templateUrl: './pharmacist-form.component.html',
  styleUrls: ['./pharmacist-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  providers: [ToastrService]  // Add ToastrService to providers
})
export class PharmacistFormComponent implements OnInit {
  pharmacistForm!: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private dialogRef: MatDialogRef<PharmacistFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.pharmacistForm = this.fb.group({
      fullName: ['', Validators.required],
      pharmacyName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    if (this.data.mode === 'edit') {
      this.isEditMode = true;
      this.pharmacistForm.patchValue(this.data.pharmacist);
    }
  }

  onSubmit(): void {
    if (this.pharmacistForm.invalid) {
      return;
    }

    const pharmacistData = {
      id: this.data.pharmacist?.id || 0,
      fullName: this.pharmacistForm.value.fullName,
      pharmacyName: this.pharmacistForm.value.pharmacyName,
      email: this.pharmacistForm.value.email
    };

    if (this.isEditMode) {
      this.dataService.updatePharmacist(this.data.pharmacist.id, pharmacistData).subscribe(
        () => {
          this.toastr.success('Pharmacist updated successfully');
          this.dialogRef.close(true);
        },
        error => {
          if (error.status === 404) {
            this.toastr.error('Pharmacist not found');
          } else if (error.status === 400) {
            this.toastr.error('Invalid pharmacist data');
          } else {
            this.toastr.error('Failed to update pharmacist');
          }
        }
      );
    } else {
      this.dataService.createPharmacist(pharmacistData).subscribe(
        () => {
          this.toastr.success('Pharmacist created successfully');
          this.dialogRef.close(true);
        },
        error => {
          this.toastr.error('Failed to create pharmacist');
        }
      );
    }
  }
}