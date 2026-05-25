// api.js- Modul pobierania danych

const API_BASE = 'https://jsonplaceholder.typicode.com';

async function fetchWithCache(url, ttl = 300_000) {
    const cacheKey = `cache_${url}`;
    const cacheData = sessionStorage.getItem(cacheKey);

    if (cacheData) {
        const { data, timestamp } = JSON.parse(cacheData);
        if (Date.now()- timestamp < ttl) return data;
    }

    const res = await fetch(`${API_BASE}${url}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.
    statusText}`);

    const data = await res.json();
    sessionStorage.setItem(cacheKey, JSON.stringify({ data, timestamp
    : Date.now() }));
    return data;
}

async function loadProducts() {
    const grid = document.querySelector('.card-grid');
    if (!grid) return;

    grid.innerHTML = Array.from({ length: 3 }, () => `
        <div class="card skeleton-card">
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text" style="width:80%"></div>
        </div>
    `).join('');

    try {
        const posts = await fetchWithCache('/posts?_limit=3');
        grid.innerHTML = posts.map(post => `
        <article class="card" data-id="${post.id}">
            <h3>${post.title.slice(0, 40)}...</h3>
            <p>${post.body.slice(0, 100)}...</p>
            <button class="btn btn-primary" onclick="showDetails(${post
            .id})">Szczegoly</button>
        </article>
        `).join('');
    } catch (err) {
        grid.innerHTML = `<p class="error">Blad ladowania: ${err.
        message}</p>`;
        console.error('Blad API:', err);
    }
}
document.addEventListener('DOMContentLoaded', loadProducts);
export { fetchWithCache, loadProducts };