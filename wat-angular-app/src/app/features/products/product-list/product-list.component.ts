import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h2 style="color: #003c78;">Zadanie 12 — ProductService z RxJS</h2>

    <!-- Filtry -->
    <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
      <select (change)="filterByCategory($event)" style="padding: 0.5rem; border-radius: 6px; border: 1px solid #ccc;">
        <option value="">Wszystkie kategorie</option>
        <option value="electronics">Electronics</option>
        <option value="jewelery">Jewelery</option>
        <option value="men's clothing">Men's clothing</option>
        <option value="women's clothing">Women's clothing</option>
      </select>
      <button (click)="loadProducts()" style="padding: 0.5rem 1rem; background: #003c78; color: white; border: none; border-radius: 6px; cursor: pointer;">
        Odśwież
      </button>
    </div>

    <!-- Błąd -->
    <p *ngIf="error" style="color: red;"> {{ error }}</p>

    <!-- Ładowanie -->
    <p *ngIf="loading">Ładowanie produktów...</p>

    <!-- Lista produktów -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-bottom: 3rem;">
      <div *ngFor="let p of products" style="background: white; border-radius: 8px; padding: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <img [src]="p.image" [alt]="p.title" style="width: 80px; height: 80px; object-fit: contain; display: block; margin: 0 auto 0.5rem;">
        <h3 style="font-size: 0.9rem; color: #003c78;">{{ p.title | slice:0:50 }}...</h3>
        <p style="color: #a07800; font-weight: bold;">{{ p.price | currency:'PLN':'symbol':'1.2-2' }}</p>
        <span style="font-size: 0.8rem; background: #dceeff; padding: 0.2rem 0.5rem; border-radius: 4px;">{{ p.category }}</span>
      </div>
    </div>

    <!-- Zadanie 13 — formularz rejestracji -->
    <h2 style="color: #003c78;">Zadanie 13 — Reactive Form z walidacją</h2>
    <div style="max-width: 400px; background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      
      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
        
        <!-- Username -->
        <div style="margin-bottom: 1rem;">
          <label style="display: block; font-weight: 600; margin-bottom: 0.3rem;">Nazwa użytkownika</label>
          <input formControlName="username" style="width: 100%; padding: 0.6rem; border: 1px solid #ccc; border-radius: 6px; box-sizing: border-box;"
            [style.border-color]="registerForm.get('username')?.invalid && registerForm.get('username')?.touched ? 'red' : '#ccc'"
          />
          <small *ngIf="registerForm.get('username')?.hasError('required') && registerForm.get('username')?.touched" style="color: red;">
            Pole wymagane
          </small>
          <small *ngIf="registerForm.get('username')?.hasError('minlength') && registerForm.get('username')?.touched" style="color: red;">
            Minimum 3 znaki
          </small>
          <small *ngIf="registerForm.get('username')?.hasError('usernameTaken')" style="color: red;">
            Ta nazwa jest już zajęta
          </small>
          <small *ngIf="registerForm.get('username')?.pending" style="color: #666;">
            Sprawdzanie dostępności...
          </small>
        </div>

        <!-- Email -->
        <div style="margin-bottom: 1rem;">
          <label style="display: block; font-weight: 600; margin-bottom: 0.3rem;">Email</label>
          <input formControlName="email" type="email" style="width: 100%; padding: 0.6rem; border: 1px solid #ccc; border-radius: 6px; box-sizing: border-box;"
            [style.border-color]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched ? 'red' : '#ccc'"
          />
          <small *ngIf="registerForm.get('email')?.hasError('required') && registerForm.get('email')?.touched" style="color: red;">
            Pole wymagane
          </small>
          <small *ngIf="registerForm.get('email')?.hasError('email') && registerForm.get('email')?.touched" style="color: red;">
            Nieprawidłowy email
          </small>
        </div>

        <!-- Hasło -->
        <div style="margin-bottom: 1.5rem;">
          <label style="display: block; font-weight: 600; margin-bottom: 0.3rem;">Hasło</label>
          <input formControlName="password" type="password" style="width: 100%; padding: 0.6rem; border: 1px solid #ccc; border-radius: 6px; box-sizing: border-box;"
            [style.border-color]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched ? 'red' : '#ccc'"
          />
          <small *ngIf="registerForm.get('password')?.hasError('required') && registerForm.get('password')?.touched" style="color: red;">
            Pole wymagane
          </small>
          <small *ngIf="registerForm.get('password')?.hasError('minlength') && registerForm.get('password')?.touched" style="color: red;">
            Minimum 8 znaków
          </small>
        </div>

        <button type="submit" [disabled]="registerForm.invalid || registerForm.pending"
          style="width: 100%; padding: 0.75rem; background: #003c78; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem;">
          {{ submitted ? '✅ Zarejestrowano!' : 'Zarejestruj się' }}
        </button>

        <div *ngIf="submitted" style="margin-top: 1rem; padding: 1rem; background: #dceeff; border-radius: 6px;">
          <strong>Dane formularza:</strong>
          <pre style="font-size: 0.8rem;">{{ registerForm.value | json }}</pre>
        </div>

      </form>
    </div>
  `
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService)
  private fb = inject(FormBuilder)

  products: any[] = []
  loading = false
  error = ''
  submitted = false

  registerForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)],
      [this.usernameValidator.bind(this)]  // walidator asynchroniczny
    ],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  })

  ngOnInit() {
    this.loadProducts()
  }

  loadProducts() {
    this.loading = true
    this.error = ''
    fetch('https://fakestoreapi.com/products?limit=6')
      .then(r => r.json())
      .then(data => {
        this.products = data
        this.loading = false
      })
      .catch(err => {
        this.error = err.message
        this.loading = false
      })
  }

  filterByCategory(event: Event) {
    const category = (event.target as HTMLSelectElement).value
    this.loading = true
    fetch(`https://fakestoreapi.com/products/category/${category || 'electronics'}`)
      .then(r => r.json())
      .then(data => {
        this.products = data
        this.loading = false
      })
  }

  usernameValidator(control: any) {
    if (!control.value || control.value.length < 3) {
      return of(null)
    }
    return new Promise(resolve => {
      setTimeout(() => {
        const takenNames = ['admin', 'root', 'user', 'test']
        if (takenNames.includes(control.value.toLowerCase())) {
          resolve({ usernameTaken: true })
        } else {
          resolve(null)
        }
      }, 600)
    })
  }

  onSubmit() {
    if (this.registerForm.valid) {
      console.log('Dane formularza:', this.registerForm.value)
      this.submitted = true
      setTimeout(() => this.submitted = false, 3000)
    } else {
      this.registerForm.markAllAsTouched()
    }
  }
}