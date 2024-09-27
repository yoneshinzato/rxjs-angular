import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../model/user';
import { map, shareReplay, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthStore {
  private subject = new BehaviorSubject<User>(null); // null means not logged in

  user$: Observable<User> = this.subject.asObservable();

  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;

  constructor(private http: HttpClient) {
    this.isLoggedIn$ = this.user$.pipe(map(user => !!user)) // !!user means not null

    this.isLoggedOut$ = this.isLoggedIn$.pipe(map(loggedIn => !loggedIn))
  }
  
  login(email: string, password: string): Observable<User> {
    return this.http.post<User>('/api/login', { email, password })
      .pipe(
        tap(user => this.subject.next(user)), // save user in subject
        shareReplay()
      )
  }

  logout() {
    this.subject.next(null); // null means not logged in
  }

}
