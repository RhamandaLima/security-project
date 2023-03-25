import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationFormSecureComponent } from './registration-form-secure.component';

describe('RegistrationFormSecureComponent', () => {
  let component: RegistrationFormSecureComponent;
  let fixture: ComponentFixture<RegistrationFormSecureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrationFormSecureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrationFormSecureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
