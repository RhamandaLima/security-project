
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User, UserRequest } from './user';
import { UserLogin } from './user-login';

@Injectable({
  providedIn: 'root'
})
export class UserListService {

  constructor(private http: HttpClient) { }

  public postNewUser(body: User): Observable<User> {
    return this.http.post<User>('http://localhost:3000/users', body);
  }

  public login(body: UserLogin): Observable<UserRequest> {
    return this.http.post<UserRequest>('http://localhost:3000/Login', body);
  }

  public getUserData(id: number): Observable<User> {
    return this.http.get<User>(`http://localhost:3000/users/${id}`);
  }

  public getUsers(): Observable<any> {
    return this.http.get<any>('http://localhost:3000/users');
  }


  public updateUserData(id: number, name: string, birthday: string, cpf: string, phone: string, email: string, password: string, blocked: boolean): Observable<User> {
    const postUser: User = {
      name: name,
      birthday: birthday,
      cpf: cpf,
      phone: phone,
      email: email,
      password: password,
      id: id,
      blocked: blocked
    }

    return this.http.put<User>(`http://localhost:3000/users/${id}`, postUser);
  }
}
