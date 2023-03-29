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


@Injectable({
  providedIn: 'root',
})
export class NewUserStoreService {
  private userSubject!: BehaviorSubject<User>;
  private FormListenerSubject!: BehaviorSubject<User>;
  private FormLoginListenerSubject!: BehaviorSubject<UserLogin>;


  constructor(private userService: UserListService, private router: Router) {
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
          // A propriedade localStorage permite acessar/alterar um objeto Storage local
          // Para alterar um item no localStorage basta usar a função setItem, que recebera a chave e valor
          localStorage.setItem("token", request.accessToken);
          localStorage.setItem("id", JSON.stringify(request.user.id));

          this.router.navigate(["/dashboard"])
        },
        error: (err) => {
          alert("Usuario não encontrado");
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
}
