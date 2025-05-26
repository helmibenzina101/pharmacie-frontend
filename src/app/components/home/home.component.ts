import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';

// Import Chart.js directly
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class HomeComponent implements OnInit {
  welcomeMessage = 'Welcome to Pharmacy Management System';
  
  // Chart objects
  doctorChart: any;
  medicationChart: any;
  pharmacyChart: any;

  constructor(
    public authService: AuthService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    if (this.authService.getUserRole() === 'master') {
      setTimeout(() => this.loadChartData(), 100);
    }
  }

  loadChartData() {
    // Load prescriptions per doctor
    this.dataService.getPrescriptions().subscribe(prescriptions => {
      const doctorCounts = this.countPrescriptionsByProperty(prescriptions, 'medecin');
      this.createDoctorChart(doctorCounts);
      
      // Load prescriptions per pharmacy
      const pharmacyCounts = this.countPrescriptionsByProperty(prescriptions, 'pharmacist', 'pharmacyName');
      this.createPharmacyChart(pharmacyCounts);
      
      // For medications, we need to fetch additional data, so we handle it separately
      this.loadMedicationChartData(prescriptions);
    });
  }

  loadMedicationChartData(prescriptions: any[]) {
    // Load medications directly
    this.dataService.getMedications().subscribe(medications => {
      const medicationsMap: {[id: number]: string} = {};
      const counts: {[key: string]: number} = {};
      
      medications.forEach((med: any) => {
        medicationsMap[med.id] = med.name;
      });
      
      // Then count prescriptions by medication
      prescriptions.forEach(prescription => {
        if (prescription.medications && prescription.medications.length) {
          prescription.medications.forEach((medId: number) => {
            const medName = medicationsMap[medId] || `Medication #${medId}`;
            counts[medName] = (counts[medName] || 0) + 1;
          });
        }
      });
      
      // Create the chart with the data
      this.createMedicationChart(counts);
    });
  }

  createDoctorChart(doctorCounts: {[key: string]: number}) {
    const canvas = document.getElementById('doctorChart') as HTMLCanvasElement;
    if (canvas) {
      this.doctorChart = new Chart(canvas, {
        type: 'bar',
        data: {
          labels: Object.keys(doctorCounts),
          datasets: [{
            label: 'Prescriptions',
            data: Object.values(doctorCounts),
            backgroundColor: this.generateColors(Object.keys(doctorCounts).length)
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            }
          }
        }
      });
    }
  }

  createMedicationChart(medicationCounts: {[key: string]: number}) {
    const canvas = document.getElementById('medicationChart') as HTMLCanvasElement;
    if (canvas) {
      this.medicationChart = new Chart(canvas, {
        type: 'pie',
        data: {
          labels: Object.keys(medicationCounts),
          datasets: [{
            data: Object.values(medicationCounts),
            backgroundColor: this.generateColors(Object.keys(medicationCounts).length)
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            }
          }
        }
      });
    }
  }

  createPharmacyChart(pharmacyCounts: {[key: string]: number}) {
    const canvas = document.getElementById('pharmacyChart') as HTMLCanvasElement;
    if (canvas) {
      this.pharmacyChart = new Chart(canvas, {
        type: 'doughnut',
        data: {
          labels: Object.keys(pharmacyCounts),
          datasets: [{
            data: Object.values(pharmacyCounts),
            backgroundColor: this.generateColors(Object.keys(pharmacyCounts).length)
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            }
          }
        }
      });
    }
  }

  countPrescriptionsByProperty(prescriptions: any[], property: string, subProperty?: string): {[key: string]: number} {
    const counts: {[key: string]: number} = {};
    
    prescriptions.forEach(prescription => {
      if (prescription[property]) {
        const key = subProperty ? 
          prescription[property][subProperty] || 'Unknown' : 
          prescription[property].fullName || 'Unknown';
        
        counts[key] = (counts[key] || 0) + 1;
      }
    });
    
    return counts;
  }

  countPrescriptionsByMedications(prescriptions: any[]): {[key: string]: number} {
    // This is now just a placeholder that returns an empty object
    // The actual work is done in loadMedicationChartData
    return {};
  }

  generateColors(count: number): string[] {
    const colors = [
      '#4285F4', '#EA4335', '#FBBC05', '#34A853', // Google colors
      '#3F51B5', '#F44336', '#FFEB3B', '#4CAF50', // Material colors
      '#2196F3', '#FF9800', '#9C27B0', '#00BCD4'  // More Material colors
    ];
    
    // If we need more colors than in our predefined array, generate them
    if (count > colors.length) {
      for (let i = colors.length; i < count; i++) {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        colors.push(`rgb(${r}, ${g}, ${b})`);
      }
    }
    
    return colors.slice(0, count);
  }
}
