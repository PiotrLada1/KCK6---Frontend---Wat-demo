// App.jsx - główny plik aplikacji React
import { useState } from 'react'
import { ProductCard } from './components/ProductCard'
import { useCartStore } from './store/cartStore'
import { useFetch } from './hooks/useFetch'

function App() {
  const { data: products, loading, error } = useFetch(
    'https://fakestoreapi.com/products?limit=3'
  )

  const { items, clearCart, getTotal, getCount } = useCartStore()

  return (
    <div style={{ fontFamily: 'system-ui', maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      
      {/* Nagłówek z licznikiem koszyka */}
      <header style={{ background: '#003c78', color: 'white', padding: '1rem 2rem', borderRadius: '8px', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>WAT React Demo</h1>
        <div>
          🛒 Koszyk: {getCount()} produktów | {getTotal().toFixed(2)} zł
          {items.length > 0 && (
            <button onClick={clearCart} style={{ marginLeft: '1rem', padding: '0.3rem 0.8rem', cursor: 'pointer' }}>
              Wyczyść
            </button>
          )}
        </div>
      </header>

      {/* Stan ładowania */}
      {loading && <p>Ładowanie produktów...</p>}
      {error && <p style={{ color: 'red' }}>Błąd: {error}</p>}

      {/* Siatka kart produktów*/}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {products?.map(product => (
          <ProductCard
            key={product.id}
            id={product.id}
            title={product.title}
            price={product.price}
            image={product.image}
            description={product.description}
          />
        ))}
      </div>

      {/* Lista produktów w koszyku */}
      {items.length > 0 && (
        <div style={{ marginTop: '2rem', padding: '1rem', background: '#f5f7fc', borderRadius: '8px' }}>
          <h2>Zawartość koszyka:</h2>
          {items.map(item => (
            <div key={item.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #ddd' }}>
              {item.title.slice(0, 40)}... — {item.qty} szt. × {item.price} zł
            </div>
          ))}
          <strong>Suma: {getTotal().toFixed(2)} zł</strong>
        </div>
      )}
    </div>
  )
}

export default App