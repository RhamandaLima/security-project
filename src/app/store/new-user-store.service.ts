import { DialogComponent } from './../components/dialog/dialog.component';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  debounceTime,
  filter,
} from 'rxjs';
import { UserListService } from '../services/user-list.service';
import { UserLogin } from '../services/user-login';
import { User } from '../services/user';
import { MatDialog } from '@angular/material/dialog';


@Injectable({
  providedIn: 'root',
})
export class NewUserStoreService {
  public userData!: User;
  public userData2!: any;

  public searchObjectBlocked: any;
  public blocked: boolean = false;

  private userSubject!: BehaviorSubject<User>;
  private FormListenerSubject!: BehaviorSubject<User>;
  private FormLoginListenerSubject!: BehaviorSubject<UserLogin>;

  public loginAttempt: number = 0;
  public attempt: number = 3;
  public message: string = '';
  public description: string = '';

  constructor(private userService: UserListService, private router: Router, public dialog: MatDialog) {
    this.FormListenerSubject = new BehaviorSubject<User>({} as User);
    this.FormLoginListenerSubject = new BehaviorSubject<UserLogin>({} as UserLogin);
    this.userSubject = new BehaviorSubject<User>({} as User);

    this.initFormListener();
    this.LoginListener();
  }

  get userSubject$() {
    return this.userSubject.asObservable();
  }

  private initFormListener(): void {
    this.FormListenerSubject.pipe(
      debounceTime(500),
      filter((task) => !!task.email),
    ).subscribe((formValue) => {
      this.userService.postNewUser(formValue).subscribe({
        next: () => {
          this.router.navigate(["/confirm-registration"])
        },
        error: (err) => {
          alert("Usuario não cadastrado");
        },
      });
    });
  }

  private LoginListener(): void {
    this.FormLoginListenerSubject.pipe(
      debounceTime(500),
      filter((task) => !!task.email),
    ).subscribe((formValue) => {
      this.userService.login(formValue).subscribe({
        next: (request) => {
          localStorage.setItem("token", request.accessToken);
          localStorage.setItem("id", JSON.stringify(request.user.id));

          this.router.navigate(["/dashboard"])
        },
        error: (err) => {
          if (err.error === 'Incorrect password') {
            this.loginAttempt += 1;
          }

          if (err.error === 'Incorrect password' && this.loginAttempt < 3) {
            this.attempt -= 1;
            this.message = 'Senha incorreta.';
            this.openDialogRetry(this.message, this.attempt);
          }

          if (err.error === 'Incorrect password' && this.loginAttempt >= 3) {
            this.message = 'Foram realizadas 3 tentativas incorretas de senha.';
            this.description = 'Seu usuário foi bloqueado. Entre em contato com o administrador.';
            this.blockUser(formValue.email);
            this.openDialogBlocked(this.message, this.description);
            this.loginAttempt = 0;
          }

          if (err.error === 'Cannot find user') {
            this.message = 'Usuário não localizado.';
            this.description = 'Verifique o campo de e-mail e tente novamente.';;
            this.openDialogBlocked(this.message, this.description);
          }
        },
      });
    });
  }

  public getUserData(): void {
    const id: number = Number(localStorage.getItem('id'))

    this.userService.getUserData(id).subscribe((value) => {
      this.userSubject.next(value)
    });
  }

  public blockUser(email: string): void {
    const blocked: boolean = true;

    this.userService.getUsers().subscribe((value) => {
      this.userData2 = value;

      const searchObject = this.userData2.find((user: any) => user.email == email);

      this.userService.updateUserData(searchObject.id, searchObject.name, searchObject.birthday, searchObject.cpf, searchObject.phone, searchObject.email, searchObject.password, blocked).subscribe((value) => {
        this.userSubject.next(value)
      });
    });
  }

  public logOut(): void {
    localStorage.clear();
    this.router.navigate(["/login"])
  }

  public setFormValue(formValue: User): void {
    this.FormListenerSubject.next(formValue);
  }

  public setFormLoginValue(formValue: UserLogin): void {
    this.FormLoginListenerSubject.next(formValue);
  }

  public openDialogBlocked(message: string, description: string): void {
    this.dialog.open(DialogComponent, {
      data: { message: message, description: description }
    })
  }

  public openDialogRetry(message: string, attempts: number): void {
    this.dialog.open(DialogComponent, {
      data: { message: message, attempts: attempts }
    })
  }

  private verifyBlock(email: string): boolean {
    this.userService.getUsers().subscribe((value) => {
      this.userData2 = value;
      this.searchObjectBlocked = this.userData2.find((user: any) => user.email == email);

      if (this.searchObjectBlocked.blocked === true) {
        this.blocked = true;
      } else {
        this.blocked = false;
      }
    });
    return this.blocked;
  }
}
