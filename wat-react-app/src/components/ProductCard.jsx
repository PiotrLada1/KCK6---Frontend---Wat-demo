// components/ProductCard.jsx
import { useState, useCallback } from 'react';
import { useCartStore } from '../store/cartStore';

export function ProductCard({ id, title, price, image, description}) 
{
    const [added, setAdded] = useState(false);
    const [loading, setLoading] = useState(false);
    const addToCart = useCartStore(s => s.addItem);

    const handleAddToCart = useCallback(async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 300)); // animacja
    addToCart({ id, title, price, image });
    setAdded(true);
    setLoading(false);
    setTimeout(() => setAdded(false), 2000);
    }, [id, title, price, image, addToCart]);

    return (
        <article className={`card ${added ? 'card--added' : ''}`}>
            <img src={image} alt={title} className="card__img" loading="
            lazy" />
            <div className="card__body">
                <h3 className="card__title">{title}</h3>
                <p className="card__desc">{description}</p>
                <div className="card__footer">
                <span className="card__price">{price.toFixed(2)} zl</span>
                    <button
                    className={`btn ${added ? 'btn-success' : 'btn-primary'
                    }`}
                    onClick={handleAddToCart}
                    disabled={loading}
                    aria-busy={loading}
                    >
                    {loading ? 'Dodawanie...' : added ? 'Dodano!' : 'Do koszyka'}
                    </button>
                </div>
            </div>
        </article>
    );
}