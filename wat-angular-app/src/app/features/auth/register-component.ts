// features/auth/register.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { AsyncValidatorFn } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { map, catchError, debounceTime, switchMap, of } from 'rxjs';

function uniqueUsernameValidator(http: HttpClient): AsyncValidatorFn {
  return (ctrl: AbstractControl) => {
    if (!ctrl.value || ctrl.value.length < 3) return of(null);
    return of(ctrl.value).pipe(
      debounceTime(400),
      switchMap(val => {
        const takenNames = ['admin', 'root', 'user', 'test']
        const available = !takenNames.includes(val.toLowerCase())
        return of({ available })
      }),
      map(res => res.available ? null : { usernameTaken: true }),
      catchError(() => of(null))
    );
  };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div style="max-width: 400px; background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <h3 style="color: #003c78; margin-bottom: 1rem;">Rejestracja (zadanie 13)</h3>

      <form [formGroup]="form" (ngSubmit)="onSubmit()">

        <div style="margin-bottom: 1rem;">
          <label style="display: block; font-weight: 600; margin-bottom: 0.3rem;">Nazwa użytkownika</label>
          <input formControlName="username" style="width: 100%; padding: 0.6rem; border: 1px solid #ccc; border-radius: 6px; box-sizing: border-box;" />
          <small *ngIf="form.get('username')?.hasError('required') && form.get('username')?.touched" style="color: red;">
            Pole wymagane
          </small>
          <small *ngIf="form.get('username')?.hasError('minlength') && form.get('username')?.touched" style="color: red;">
            Minimum 3 znaki
          </small>
          <small *ngIf="form.get('username')?.hasError('usernameTaken')" style="color: red;">
            Ta nazwa jest już zajęta (spróbuj: admin, root, user, test)
          </small>
          <small *ngIf="form.get('username')?.pending" style="color: #666;">
            Sprawdzanie dostępności...
          </small>
        </div>

        <div style="margin-bottom: 1rem;">
          <label style="display: block; font-weight: 600; margin-bottom: 0.3rem;">Email</label>
          <input formControlName="email" type="email" style="width: 100%; padding: 0.6rem; border: 1px solid #ccc; border-radius: 6px; box-sizing: border-box;" />
          <small *ngIf="form.get('email')?.hasError('required') && form.get('email')?.touched" style="color: red;">
            Pole wymagane
          </small>
          <small *ngIf="form.get('email')?.hasError('email') && form.get('email')?.touched" style="color: red;">
            Nieprawidłowy email
          </small>
        </div>

        <div style="margin-bottom: 1.5rem;">
          <label style="display: block; font-weight: 600; margin-bottom: 0.3rem;">Hasło</label>
          <input formControlName="password" type="password" style="width: 100%; padding: 0.6rem; border: 1px solid #ccc; border-radius: 6px; box-sizing: border-box;" />
          <small *ngIf="form.get('password')?.hasError('required') && form.get('password')?.touched" style="color: red;">
            Pole wymagane
          </small>
          <small *ngIf="form.get('password')?.hasError('minlength') && form.get('password')?.touched" style="color: red;">
            Minimum 8 znaków
          </small>
        </div>

        <button type="submit" [disabled]="form.invalid || form.pending"
          style="width: 100%; padding: 0.75rem; background: #003c78; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem;">
          Zarejestruj
        </button>

        <div *ngIf="submitted" style="margin-top: 1rem; padding: 1rem; background: #dceeff; border-radius: 6px;">
          <strong>Zarejestrowano:</strong>
          <pre style="font-size: 0.8rem;">{{ form.value | json }}</pre>
        </div>

      </form>
    </div>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder)
  private http = inject(HttpClient)
  submitted = false

  form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)],
      [uniqueUsernameValidator(this.http)]
    ],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  })

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value)
      this.submitted = true
      setTimeout(() => this.submitted = false, 3000)
    } else {
      this.form.markAllAsTouched()
    }
  }
}