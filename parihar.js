const cursorDot = document.querySelector('.cursor-dot');
const cursorGlow = document.querySelector('.cursor-glow');
const cursorRing = document.querySelector('.cursor-ring');
const cursorTrail = document.querySelector('.cursor-trail');
const revealItems = document.querySelectorAll('.reveal');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const joinForm = document.getElementById('join-form');
const routeItems = document.querySelectorAll('.route-item');
const routeDetails = document.getElementById('routeDetails');
const counters = document.querySelectorAll('[data-count]');
const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let ringX = mouseX;
let ringY = mouseY;
let glowX = mouseX;
let glowY = mouseY;
let dotX = mouseX;
let dotY = mouseY;
let trailX = mouseX;
let trailY = mouseY;

const animateCursor = () => {
  ringX += (mouseX - ringX) * 0.06;
  ringY += (mouseY - ringY) * 0.06;
  glowX += (mouseX - glowX) * 0.13;
  glowY += (mouseY - glowY) * 0.13;
  dotX += (mouseX - dotX) * 0.35;
  dotY += (mouseY - dotY) * 0.35;
  trailX += (mouseX - trailX) * 0.02;
  trailY += (mouseY - trailY) * 0.02;

  cursorRing.style.left = `${ringX}px`;
  cursorRing.style.top = `${ringY}px`;
  cursorGlow.style.left = `${glowX}px`;
  cursorGlow.style.top = `${glowY}px`;
  cursorDot.style.left = `${dotX}px`;
  cursorDot.style.top = `${dotY}px`;
  cursorTrail.style.left = `${trailX}px`;
  cursorTrail.style.top = `${trailY}px`;

  requestAnimationFrame(animateCursor);
};

if (!isTouchDevice && cursorDot && cursorGlow && cursorRing && cursorTrail) {
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  document.querySelectorAll('a, button, .service-card, .route-item, .panel-card, .image-card, .contact-card').forEach((el) => {
    el.addEventListener('mouseenter', () => cursorGlow.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursorGlow.classList.remove('hovered'));
  });

  requestAnimationFrame(animateCursor);
}

const routeCompanies = {
  'Sojat City → Pali': [
    { name: 'Pushpak Cargo', phone: '9414120805' }
  ],
  'Sojat City → Jodhpur': [
    { name: 'Navrang Transport Company', phone: '02912748546' }
  ],
  'Sojat City → Jaipur': [
    { name: 'Shree Rajasthan Roadways (SRR)', phone: '9166653730' }
  ],
  'Sojat City → Sumerpur': [
    { name: 'New Nagneshi Roadlines', phone: '9667029949' }
  ],
  'Sojat City → Delhi': [
    { name: 'Xpress Cargo', phone: '9311026687' }
  ]
};

const animateCounter = (el) => {
  if (el.dataset.animated === 'true') return;

  const target = Number(el.dataset.count || 0);
  const suffix = el.dataset.suffix || '';
  const duration = 1200;
  const startTime = performance.now();

  const update = (currentTime) => {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(target * eased);
    el.textContent = `${value}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = `${target}${suffix}`;
      el.dataset.animated = 'true';
    }
  };

  requestAnimationFrame(update);
};

const renderRouteDetails = (route) => {
  const companies = routeCompanies[route] || [];
  routeItems.forEach((item) => {
    item.classList.toggle('active', item.dataset.route === route);
  });

  routeDetails.innerHTML = `
    <div class="route-detail-card">
      <h3>${route}</h3>
      <p>Connected transport companies for this route:</p>
      <div class="route-company-list">
        ${companies.map((company) => `
          <button type="button" class="route-company" data-phone="${company.phone}">
            <span class="route-company-name">${company.name}</span>
            <span class="route-company-arrow">↗</span>
            <span class="route-company-number">${company.phone}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;

  routeDetails.querySelectorAll('.route-company').forEach((card) => {
    card.addEventListener('click', () => {
      const isActive = card.classList.contains('active');
      routeDetails.querySelectorAll('.route-company').forEach((item) => item.classList.remove('active'));
      if (!isActive) {
        card.classList.add('active');
      }
    });
  });
};

routeItems.forEach((item) => {
  item.addEventListener('click', () => {
    renderRouteDetails(item.dataset.route);
  });
});

renderRouteDetails('Sojat City → Pali');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');

        if (entry.target.classList.contains('stats-grid')) {
          counters.forEach((counter) => animateCounter(counter));
        }

        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => observer.observe(item));

menuToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

joinForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const button = joinForm.querySelector('button');
  const originalText = button.textContent;
  button.textContent = 'Request Sent';
  joinForm.reset();
  setTimeout(() => {
    button.textContent = originalText;
  }, 2500);
});
