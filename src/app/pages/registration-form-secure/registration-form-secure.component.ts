import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-registration-form-secure',
  templateUrl: './registration-form-secure.component.html',
  styleUrls: ['./registration-form-secure.component.css']
})
export class RegistrationFormSecureComponent implements OnInit {

  registrationForm!: FormGroup;

  today = new Date();
  majority = new Date(
    this.today.getFullYear() - 18,
    this.today.getMonth(),
    this.today.getDate()
  );

  showPassword: boolean = false;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.createRegistrationForm();
  }

  public createRegistrationForm(): void {
    this.registrationForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      birthday: ['', Validators.required],
      cpf: ['', [Validators.required, this.validateCpf]],
      phone: ['', [Validators.required, Validators.maxLength(15)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(12), this.validatePassword]]
    })
  }

  public registerDataForm(): any {
    console.log(this.registrationForm)
  }

  private validateCpf(control: AbstractControl): ValidationErrors | null {

    const cpf = control.value;

    let sum: number = 0;
    let rest: number;
    let valid: boolean;

    const regex = new RegExp('[0-9]{11}');

    if (!cpf) {
      return null;
    }

    if (
      cpf == '00000000000' ||
      cpf == '11111111111' ||
      cpf == '22222222222' ||
      cpf == '33333333333' ||
      cpf == '44444444444' ||
      cpf == '55555555555' ||
      cpf == '66666666666' ||
      cpf == '77777777777' ||
      cpf == '88888888888' ||
      cpf == '99999999999' ||
      cpf == '012345678900' ||
      !regex.test(cpf)
    ) {
      valid = false;
    } else {
      for (let i = 1; i <= 9; i++)
        sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
      rest = (sum * 10) % 11;

      if (rest == 10 || rest == 11) rest = 0;
      if (rest != parseInt(cpf.substring(10, 11))) valid = false;
      valid = true;
    }

    if (valid) return null;

    return { cpfInvalid: true };
  }

  private validatePassword(control: AbstractControl): ValidationErrors | null {

    const password = control.value;
    const regex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,12}$');

    if (!password) {
      return null;
    }

    if (!regex.test(password)) {
      return { passwordInvalid: true }
    }

    return null
  }
}
