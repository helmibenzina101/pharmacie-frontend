import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MedecinService {
  constructor(private http: HttpClient) {}

  getMedecins(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/medecin`);
  }

  getMedecinById(id: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/medecin/${id}`);
  }

  createMedecin(medecinData: any): Observable<any> {
    // Extract data from the nested structure if it exists
    const formattedData = medecinData.medecin ? {
      Email: medecinData.medecin.Email,
      FullName: medecinData.medecin.FullName,
      Specialization: medecinData.medecin.Specialization,
      UserId: medecinData.medecin.UserId
    } : medecinData; // Use as-is if not nested
    
    return this.http.post(`${environment.apiUrl}/medecin`, formattedData);
  }

  updateMedecin(id: number, medecinData: any): Observable<any> {
    // Extract data from the nested structure if it exists
    const formattedData = medecinData.medecin ? {
      Id: id,
      Email: medecinData.medecin.Email,
      FullName: medecinData.medecin.FullName,
      Specialization: medecinData.medecin.Specialization,
      UserId: medecinData.medecin.UserId
    } : medecinData; // Use as-is if not nested
    
    return this.http.put(`${environment.apiUrl}/medecin/${id}`, formattedData);
  }

  deleteMedecin(id: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/medecin/${id}`);
  }
}