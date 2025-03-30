import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators'; // Add this import
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service'; // Add this import

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService // Add this injection
  ) { }

  // Medecin endpoints
  getMedecins(): Observable<any> {
    return this.http.get(`${this.apiUrl}/medecin`);
  }

  getMedecin(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/medecin/${id}`);
  }

  createMedecin(medecin: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/medecin`, medecin);
  }

  updateMedecin(id: number, medecin: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/medecin/${id}`, medecin);
  }

  deleteMedecin(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/medecin/${id}`);
  }

  // Medication endpoints
  getMedications(): Observable<any> {
    return this.http.get(`${this.apiUrl}/medication`);
  }

  getMedication(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/medication/${id}`);
  }

  createMedication(medication: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/medication`, medication);
  }

  updateMedication(id: number, medication: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/medication/${id}`, medication);
  }

  deleteMedication(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/medication/${id}`);
  }

  // Patient endpoints
  getPatients(): Observable<any> {
    return this.http.get(`${this.apiUrl}/patient`);
  }

  getPatient(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/patient/${id}`);
  }

  createPatient(patient: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/patient`, patient);
  }

  updatePatient(id: number, patient: any): Observable<any> {
    if (!patient || patient.id !== id) {
      return throwError(() => new Error('Les données du patient sont incorrectes'));
    }

    const patientData = {
      id: patient.id,
      fullName: patient.fullName,
      address: patient.address
    };

    return this.http.put(`${this.apiUrl}/patient/${id}`, patientData).pipe(
      catchError((error) => {
        console.error('Failed to update patient:', error);
        return throwError(() => new Error('Failed to update patient. Please try again later.'));
      })
    );
  }

  deletePatient(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/patient/${id}`);
  }

  // Pharmacist endpoints
  getPharmacists(): Observable<any> {
    return this.http.get(`${this.apiUrl}/pharmacist`);
  }

  getPharmacist(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/pharmacist/${id}`);
  }

  createPharmacist(pharmacist: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/pharmacist`, pharmacist);
  }

  updatePharmacist(id: number, pharmacist: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/pharmacist/${id}`, pharmacist);
  }

  deletePharmacist(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/pharmacist/${id}`);
  }

  // Prescription endpoints remain unchanged
  getPrescriptions(): Observable<any> {
    if (!this.authService.canAccessPrescriptions()) {
      return throwError(() => new Error('Unauthorized access to prescriptions'));
    }
    return this.http.get(`${this.apiUrl}/prescription`);
  }

  getPrescription(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/prescription/${id}`);
  }

  createPrescription(prescription: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/prescription`, prescription);
  }

  updatePrescription(id: number, prescription: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/prescription/${id}`, prescription);
  }

  deletePrescription(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/prescription/${id}`);
  }
}