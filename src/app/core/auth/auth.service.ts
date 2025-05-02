import { Injectable, signal } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly #isLoggedIn = signal(false);
  readonly isloggedIn = this.#isLoggedIn.asReadonly();

  login(name: string, password: string): Observable<boolean> {
    const isLoggedIn = name == 'Pikachu' && password == 'Pikachu#';

    this.#isLoggedIn.set(isLoggedIn);
    return of(isLoggedIn).pipe(delay(1000));
  }
}
