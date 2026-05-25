// app.js - Menu hamburgera
const hamburger = document.querySelector('[data-hamburger]');
const navList = document.querySelector('.nav-list');

hamburger?.addEventListener('click', () => {
const isOpen = navList.classList.toggle('nav-open');
hamburger.setAttribute('aria-expanded', String(isOpen));
hamburger.setAttribute('aria-label', isOpen ? 'Zamknij menu' : 'Otwórz menu');
});

navList?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navList.classList.remove('nav-open');
        hamburger?.setAttribute('aria-expanded', 'false');
    });
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('header')) {
        navList?.classList.remove('nav-open');
        hamburger?.setAttribute('aria-expanded', 'false');
    }
});