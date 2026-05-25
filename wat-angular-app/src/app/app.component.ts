import { Component } from '@angular/core';
import { ProductListComponent } from './features/products/product-list/product-list.component';
import { RegisterComponent } from './features/auth/register-component'; 
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ProductListComponent, RegisterComponent],
  template: `
    <div style="font-family: system-ui; max-width: 1200px; margin: 0 auto; padding: 2rem;">
      <header style="background: #003c78; color: white; padding: 1rem 2rem; border-radius: 8px; margin-bottom: 2rem;">
        <h1 style="margin: 0;">WAT Angular 17 Demo</h1>
        <p style="margin: 0.5rem 0 0; opacity: 0.8;">Zadania 12-13 — ProductService + Reactive Form</p>
      </header>
      <app-product-list />
      <hr style="margin: 2rem 0;">
      <app-register />
    </div>
  `
})
export class AppComponent {}