import { NewUserStoreService } from 'src/app/store/new-user-store.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UserListService } from 'src/app/services/user-list.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;

  showPassword: boolean = false;

  public userData2!: any;

  public searchObjectBlocked: any;
  public blocked: boolean = false;
  public status: boolean = false;

  public message: string = '';
  public description: string = '';

  constructor(private newUserStore: NewUserStoreService, private fb: FormBuilder, private userService: UserListService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.createLoginForm();
  }

  public createLoginForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email,]],
      password: ['', [Validators.required]]
    })
  }

  public Login(): any {
    this.verifyBlock(this.loginForm.value.email);
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  private verifyBlock(email: string): void {
    this.userService.getUsers().subscribe((value) => {
      this.userData2 = value;
      this.searchObjectBlocked = this.userData2.find((user: any) => user.email == email);

      if (this.searchObjectBlocked.blocked === true) {
        this.blocked = true;
        this.checkBlocked(this.blocked);

      } else {
        this.blocked = false;
        this.checkBlocked(this.blocked);

      }
    });
  }

  public checkBlocked(status: boolean): void {
    this.status = status;

    this.sendLogin();
  }

  public sendLogin(): void {
    if (this.status === true) {
      this.message = 'Foram realizadas 3 tentativas incorretas de senha.';
      this.description = 'Portanto, seu usuário está bloqueado. Entre em contato com o administrador.';
      this.openDialogBlocked(this.message, this.description);

    } else {
      this.newUserStore.setFormLoginValue(this.loginForm.value);
    }
  }

  public openDialogBlocked(message: string, description: string): void {
    this.dialog.open(DialogComponent, {
      data: { message: message, description: description }
    })
  }
}
