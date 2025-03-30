import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacistFormComponent } from './pharmacist-form.component';

describe('PharmacistFormComponent', () => {
  let component: PharmacistFormComponent;
  let fixture: ComponentFixture<PharmacistFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmacistFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PharmacistFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
