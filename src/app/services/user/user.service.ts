import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  createNewUser(payload) {
    return this.http.post<any>(`http://localhost:3001/users/register`, payload, {});
  }
  userLogin(payload) {
    return this.http.post<any>(`http://localhost:3001/users/login`, payload, {});
  }
  getProtectedData() {
    return this.http.get<any>(`http://localhost:3001/users`);
  }
  constructor(private http: HttpClient) { }
}