<script setup>
import { ref } from 'vue'
import DataTable from './components/DataTable.vue'
import LoginForm from './components/LoginForm.vue'

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Nazwa' },
  { key: 'category', label: 'Kategoria' },
  { key: 'price', label: 'Cena (zł)' },
  { key: 'stock', label: 'Stan magazynu' }
]

const products = ref([
  { id: 1, name: 'Laptop Dell XPS', category: 'Elektronika', price: 4999, stock: 15 },
  { id: 2, name: 'Mysz Logitech MX', category: 'Akcesoria', price: 299, stock: 42 },
  { id: 3, name: 'Monitor LG 27"', category: 'Elektronika', price: 1899, stock: 8 },
  { id: 4, name: 'Klawiatura Keychron', category: 'Akcesoria', price: 549, stock: 23 },
  { id: 5, name: 'Słuchawki Sony WH', category: 'Audio', price: 1299, stock: 31 },
  { id: 6, name: 'Kamera Logitech C920', category: 'Akcesoria', price: 449, stock: 17 },
  { id: 7, name: 'Dysk SSD Samsung 1TB', category: 'Elektronika', price: 399, stock: 55 },
  { id: 8, name: 'Hub USB-C Anker', category: 'Akcesoria', price: 189, stock: 60 },
  { id: 9, name: 'Głośnik JBL Flip', category: 'Audio', price: 599, stock: 28 },
  { id: 10, name: 'Tablet iPad Air', category: 'Elektronika', price: 3299, stock: 12 },
  { id: 11, name: 'Podkładka XXL', category: 'Akcesoria', price: 89, stock: 75 },
  { id: 12, name: 'Kabel HDMI 2.1', category: 'Akcesoria', price: 49, stock: 100 },
])
</script>

<template>
  <div style="font-family: system-ui; max-width: 1200px; margin: 0 auto; padding: 2rem;">
    
    <header style="background: #003c78; color: white; padding: 1rem 2rem; border-radius: 8px; margin-bottom: 2rem;">
      <h1 style="margin: 0;">WAT Vue 3 Demo</h1>
      <p style="margin: 0.5rem 0 0; opacity: 0.8;">Zadanie 10 — DataTable z sortowaniem, filtrowaniem i paginacją</p>
    </header>
    <h2 style="color: #003c78;">Zadanie 11 — Uwierzytelnienie (Pinia)</h2>
    <LoginForm />
    <h2 style="color: #003c78; margin-top: 3rem;">Zadanie 10 — Tabela produktów</h2>
    <DataTable :data="products" :columns="columns" :per-page="5" />

  </div>
</template>