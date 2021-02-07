import { FbAuthResponse } from './../../../shared/interfaces';
import { environment } from './../../../../environments/environment';
import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { User } from "../../../shared/interfaces";
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class AuthService {

  public error$: Subject<string> = new Subject<string>();

  constructor(private http: HttpClient) { }

  get token(): string | null {
    const fbTokenExp = localStorage.getItem('fb-token-exp');

    if (fbTokenExp) {
      const expDate = new Date(fbTokenExp);

      if (new Date() > expDate) {
        this.logout()
        return '';
      }
    }

    return localStorage.getItem('fb-token');
  }

  public login(user: User): Observable<FbAuthResponse> | Observable<any> {
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user).pipe(
      tap((response: any) => {
        this.setToken(response);
      }),
      catchError(this.handleError.bind(this))
    );
  }

  public logout() {
    this.setToken(null);
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  private handleError(error: HttpErrorResponse) {
    const { message } = error.error.error;

    switch (message) {
      case 'INVALID_EMAIL':
        this.error$.next('Неверный пароль или email');
        break;
      case 'INVALID_PASSWORD':
        this.error$.next('Неверный пароль или email');
        break;
      case 'EMAIL_NOT_FOUND':
        this.error$.next('Неверный пароль или email');
        break;
    }

    return throwError(error);
  }

  private setToken(response: FbAuthResponse | null) {
    if (response) {
      const expDate = new Date(new Date().getTime() + +response.expiresIn * 1000);
      localStorage.setItem('fb-token', response.idToken);
      localStorage.setItem('fb-token-exp', expDate.toString());
    } else {
      localStorage.clear();
    }
  }
}
