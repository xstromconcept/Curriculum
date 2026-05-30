/* ===== Chart.js Global Config ===== */
Chart.defaults.color = 'rgba(255, 255, 255, 0.55)';
Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.06)';
Chart.defaults.font.family = "'Inter', system-ui, sans-serif";

const accent = '#39ff14';
const accentDim = 'rgba(57, 255, 20, 0.15)';

/* ===== Radar Chart ===== */
function initRadarChart() {
  const ctx = document.getElementById('radarChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: [
        'Ligas Especiais',
        'Corrosão',
        'Soldagem',
        'Fundição',
        'Análise MEV',
        'Automação'
      ],
      datasets: [{
        label: 'Proficiência',
        data: [92, 85, 88, 94, 90, 76],
        backgroundColor: accentDim,
        borderColor: accent,
        borderWidth: 2,
        pointBackgroundColor: accent,
        pointBorderColor: '#0a0a0a',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: {
            stepSize: 20,
            backdropColor: 'transparent',
            font: { size: 10 }
          },
          grid: { color: 'rgba(255,255,255,0.06)' },
          angleLines: { color: 'rgba(255,255,255,0.06)' },
          pointLabels: {
            font: { size: 11, weight: '500' },
            color: 'rgba(255,255,255,0.7)'
          }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(10,10,10,0.9)',
          borderColor: accent,
          borderWidth: 1,
          titleFont: { weight: '600' },
          callbacks: {
            label: (ctx) => ` ${ctx.parsed.r}%`
          }
        }
      }
    }
  });
}

/* ===== Donut Chart ===== */
function initDonutChart() {
  const ctx = document.getElementById('donutChart');
  const legendEl = document.getElementById('donutLegend');
  if (!ctx) return;

  const labels = ['P&D', 'Produção', 'Qualidade', 'Consultoria'];
  const data = [35, 30, 20, 15];
  const colors = [
    accent,
    'rgba(57, 255, 20, 0.7)',
    'rgba(57, 255, 20, 0.45)',
    'rgba(57, 255, 20, 0.25)'
  ];

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors,
        borderColor: '#0a0a0a',
        borderWidth: 3,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(10,10,10,0.9)',
          borderColor: accent,
          borderWidth: 1,
          callbacks: {
            label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%`
          }
        }
      }
    }
  });

  if (legendEl) {
    legendEl.innerHTML = labels.map((label, i) =>
      `<li>
        <span class="donut-legend__dot" style="background:${colors[i]}"></span>
        ${label} — ${data[i]}%
      </li>`
    ).join('');
  }
}

/* ===== Animated Counters ===== */
function animateCounters() {
  document.querySelectorAll('.stat__value[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  });
}

/* ===== Skill Bars Animation ===== */
function animateSkillBars() {
  const bars = document.querySelectorAll('.skill-bar');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const bar = entry.target;
      const value = bar.dataset.value;
      const fill = bar.querySelector('.skill-bar__fill');
      if (fill) {
        setTimeout(() => {
          fill.style.width = value + '%';
        }, 150);
      }
      observer.unobserve(bar);
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
}

/* ===== Scroll Reveal ===== */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ===== Active Nav Link ===== */
function initNavHighlight() {
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('nav__link--active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(section => observer.observe(section));
}

/* ===== Parallax Watermark ===== */
function initParallax() {
  const watermark = document.querySelector('.hero__watermark');
  if (!watermark) return;

  window.addEventListener('scroll', () => {
    const scroll = window.scrollY;
    if (scroll < window.innerHeight) {
      watermark.style.transform = `translateX(-50%) translateY(${scroll * 0.15}px)`;
    }
  }, { passive: true });
}

/* ===== Card Tilt Effect ===== */
function initCardTilt() {
  if (window.matchMedia('(max-width: 1024px)').matches) return;

  document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ===== Init ===== */
document.addEventListener('DOMContentLoaded', () => {
  initRadarChart();
  initDonutChart();
  animateCounters();
  animateSkillBars();
  initScrollReveal();
  initNavHighlight();
  initParallax();
  initCardTilt();
});
