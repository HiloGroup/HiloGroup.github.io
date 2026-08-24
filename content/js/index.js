tailwind.config = { theme: { extend: { fontFamily: { sans: ['Be Vietnam Pro', 'sans-serif'] }, colors: { navy: '#1E3A8A', brand: '#2563EB' } } } };

document.querySelectorAll('.faq-button').forEach((button) => button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    document.querySelectorAll('.faq-item').forEach((faq) => { if (faq !== item) faq.classList.remove('open'); });
    item.classList.toggle('open');
}));
document.getElementById('btnReady').addEventListener('click', () => {
    window.location.href = 'pages/tien-ich/index.html';
});