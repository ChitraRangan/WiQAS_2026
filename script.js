const menuBtn = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

const current = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  const target = a.getAttribute('href');
  if (target === current) a.classList.add('active');
});

document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
