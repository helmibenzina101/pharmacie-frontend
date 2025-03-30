import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MedecinService } from '../../../services/medecin.service';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-medecin-form',
  templateUrl: './medecin-form.component.html',
  styleUrls: ['./medecin-form.component.scss'],
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
export class MedecinFormComponent implements OnInit {
  medecinForm: FormGroup;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private medecinService: MedecinService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<MedecinFormComponent>,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.medecinForm = this.fb.group({
      id: [''],
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      specialization: ['', Validators.required],
      userId: ['']
    });

    if (this.data?.medecin) {
      this.isEditMode = true;
      this.medecinForm.patchValue(this.data.medecin);
    }
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.medecinForm.invalid) return;

    const formData = this.medecinForm.value;
    const medecinData = {
      medecin: { // Wrap fields inside a medecin object
        Id: this.isEditMode ? this.data.medecin.id : parseInt(formData.id, 10), // Ensure Id is an integer
        Email: formData.email,
        FullName: formData.fullName,
        Specialization: formData.specialization,
        UserId: this.authService.getUserId()
      }
    };
    
    if (this.isEditMode) {
      this.medecinService.updateMedecin(this.data.medecin.id, medecinData).subscribe({
        next: () => {
          this.toastr.success('Doctor updated successfully');
          this.dialogRef.close(true);
        },
        error: (error) => {
          const errorMessage = error.error?.message || error.message || 'Failed to update doctor';
          this.toastr.error(errorMessage);
        }
      });
    } else {
      this.medecinService.createMedecin(medecinData).subscribe({
        next: () => {
          this.toastr.success('Doctor created successfully');
          this.dialogRef.close(true);
        },
        error: (error) => {
          const errorMessage = error.error?.message || error.message || 'Failed to create doctor';
          this.toastr.error(errorMessage);
        }
      });
    }
  }
}