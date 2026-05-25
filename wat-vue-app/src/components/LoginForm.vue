<!-- LoginForm.vue - formularz logowania używający Pinia store (zadanie 11) -->
<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true

  try {
    await new Promise(r => setTimeout(r, 800))

    if (email.value === 'admin@wat.pl' && password.value === 'haslo123') {
    auth.mockLogin(
        { name: 'Admin WAT', email: email.value, role: 'admin' },
        'fake-jwt-token-xyz'
    )
    } else if (email.value && password.value) {
    auth.mockLogin(
        { name: 'Student WAT', email: email.value, role: 'user' },
        'fake-jwt-token-user'
    )
    } else {
    throw new Error('Podaj email i hasło')
    }
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

function handleLogout() {
  auth.logout()
}
</script>

<template>
  <div style="max-width: 400px; margin: 0 auto; padding: 2rem; background: white; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,60,120,0.12);">

    <!-- Zalogowany -->
    <div v-if="auth.isAuthenticated">
      <h2 style="color: #003c78;">Zalogowany</h2>
      <p><strong>Użytkownik:</strong> {{ auth.user?.name }}</p>
      <p><strong>Email:</strong> {{ auth.user?.email }}</p>
      <p>
        <strong>Rola:</strong>
        <span :style="{ color: auth.isAdmin ? '#a07800' : '#333' }">
          {{ auth.isAdmin ? 'Administrator' : 'Użytkownik' }}
        </span>
      </p>
      <p><strong>Token:</strong> <code style="font-size: 0.75rem;">{{ auth.token }}</code></p>
      <button @click="handleLogout" style="width: 100%; padding: 0.75rem; background: #c0392b; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem;">
        Wyloguj
      </button>
    </div>

    <!-- Formularz logowania -->
    <div v-else>
      <h2 style="color: #003c78; margin-bottom: 1.5rem;">Logowanie</h2>

      <p style="font-size: 0.85rem; color: #666; background: #f5f7fc; padding: 0.75rem; border-radius: 6px; margin-bottom: 1rem;">
        Demo: <strong>admin@wat.pl</strong> / <strong>haslo123</strong> (admin)<br>
        lub dowolny email + hasło (zwykły użytkownik)
      </p>

      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.3rem; font-weight: 600;">Email</label>
        <input
          v-model="email"
          type="email"
          placeholder="admin@wat.pl"
          style="width: 100%; padding: 0.6rem; border: 1px solid #ccc; border-radius: 6px; box-sizing: border-box; font-size: 1rem;"
        />
      </div>

      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.3rem; font-weight: 600;">Hasło</label>
        <input
          v-model="password"
          type="password"
          placeholder="haslo123"
          style="width: 100%; padding: 0.6rem; border: 1px solid #ccc; border-radius: 6px; box-sizing: border-box; font-size: 1rem;"
        />
      </div>

      <p v-if="error" style="color: red; margin-bottom: 1rem;">{{ error }}</p>

      <button
        @click="handleLogin"
        :disabled="loading"
        style="width: 100%; padding: 0.75rem; background: #003c78; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem;"
      >
        {{ loading ? 'Logowanie...' : 'Zaloguj się' }}
      </button>
    </div>

  </div>
</template>