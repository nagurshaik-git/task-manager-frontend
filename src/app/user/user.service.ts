import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { User, IUser } from './class/user';
import { Observable, throwError, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { map, catchError, tap, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { UserUpdateOpts } from './class/user-update-opts';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private API_URL = environment.taskApi.url;
  private USER_SIGNUP = environment.taskApi.endpoint.signup;
  private USER_UPDATE = environment.taskApi.endpoint.user.patch;
  private EMAIL_EXISTS = environment.taskApi.endpoint.emailExists;

  constructor(
    private http: HttpClient,
    private authService: AuthService) {}

  signup$(name: string, email: string, password: string): Observable<User | string> {
    return this.http.post<IUser>(
      this.API_URL + this.USER_SIGNUP,
      {
        name,
        email: {
          address: email,
        },
        password,
      }
    ).pipe(
      catchError(this.handleError),
      map((user) => {
        if (user) {
          return new User(user.name, user.email.address, user._id);
        }

        return null;
      })
    );
  }

  checkEmailExists$(email: string): Observable<boolean | string> {
    return this.http.post<{ emailExists: boolean }>(
      this.API_URL + this.EMAIL_EXISTS,
      {
        email,
      }
    ).pipe(
      catchError(this.handleError),
      map(({emailExists}) => {
        return emailExists;
      }),
    );
  }

  update$(userUpdateOpts: UserUpdateOpts, token: string): Observable<User | string> {
    return this.http.patch<IUser>(
      this.API_URL + this.USER_UPDATE,
      userUpdateOpts
    ).pipe(
      catchError(this.handleError),
      map((user: IUser) => {
        if (!user) {
          return null;
        }

        return new User(user.name, user.email.address, user._id, token);
      }),
      tap((user: User) => {
        this.authService.userSubject.next(user);
      }),
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let err = '';
    if (error.error instanceof ErrorEvent) {
      // TODO: Handle client / network error
      err = `An error occurred: ${error.error.message}`;
    } else {
      // TODO: backend returned error
      err = `API Error: ${JSON.stringify(error.error)}, Status Code: ${error.status}`;
    }

    return throwError(err);
  }
}
