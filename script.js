/* ============================================================
   DHARSHINI SRIDHAR — PORTFOLIO
   ============================================================ */
(() => {
  'use strict';

  /* ----------------------------------------------------------
     1. PAGE ROUTER (Home / Projects / Contact)
     ---------------------------------------------------------- */
  const pages = document.querySelectorAll('.page');
  const navLinks = document.querySelectorAll('[data-page]');

  function showPage(pageId) {
    pages.forEach(p => {
      p.classList.toggle('active', p.id === `page-${pageId}`);
    });

    // Highlight active nav link
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.classList.toggle('active', a.dataset.page === pageId);
    });

    // Update URL hash without jumping
    if (history.replaceState) {
      history.replaceState(null, '', `#${pageId}`);
    }

    // Close mobile menu
    navLinksContainer.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');

    // Re-run reveals on the newly visible page
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      revealObserver.disconnect();
      document.querySelectorAll('.page.active .reveal').forEach(el => revealObserver.observe(el));
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const pageId = link.dataset.page;
      if (pageId) showPage(pageId);
    });
  });

  // Handle initial hash
  window.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash.replace('#', '');
    if (['home', 'projects', 'contact'].includes(hash)) {
      showPage(hash);
    }
  });

  /* ----------------------------------------------------------
     2. MOBILE NAV TOGGLE
     ---------------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const navLinksContainer = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    const isOpen = navLinksContainer.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (
      navLinksContainer.classList.contains('open') &&
      !navLinksContainer.contains(e.target) &&
      !navToggle.contains(e.target)
    ) {
      navLinksContainer.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });

  /* ----------------------------------------------------------
     3. SCROLL REVEAL
     ---------------------------------------------------------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ----------------------------------------------------------
     4. HERO CANVAS — interactive node network
     ---------------------------------------------------------- */
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height, dpr;

    // Mouse tracking
    const mouse = { x: -9999, y: -9999 };

    // Node configuration
    const NODE_COUNT = 34;
    const CONNECT_DIST = 130;
    const MOUSE_RADIUS = 150;

    let nodes = [];

    // Colour palette
    const colours = ['#00e6ff', '#a855f7', '#f472b6'];

    function resize() {
      dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      createNodes();
    }

    function createNodes() {
      nodes = [];
      for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: 1.2 + Math.random() * 1.8,
          colour: colours[Math.floor(Math.random() * colours.length)],
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // Move nodes
      nodes.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;

        // Bounce
        if (n.x < 0 || n.x > width)  n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        // Mouse repulsion
        const dx = n.x - mouse.x;
        const dy = n.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
          n.x += (dx / dist) * force * 1.8;
          n.y += (dy / dist) * force * 1.8;
        }
      });

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < CONNECT_DIST) {
            const opacity = (1 - dist / CONNECT_DIST) * 0.45;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(0, 230, 255, ${opacity})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.colour;
        ctx.shadowBlur = 12;
        ctx.shadowColor = n.colour;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      requestAnimationFrame(draw);
    }

    // Mouse / touch tracking
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => {
      mouse.x = -9999;
      mouse.y = -9999;
    });

    canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;
      }
    }, { passive: true });

    canvas.addEventListener('touchend', () => {
      mouse.x = -9999;
      mouse.y = -9999;
    });

    window.addEventListener('resize', resize);

    // Respect reduced-motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    resize();
    if (prefersReduced) {
      // Draw one static frame
      ctx.clearRect(0, 0, width, height);
      nodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.colour;
        ctx.fill();
      });
    } else {
      draw();
    }
  }

  /* ----------------------------------------------------------
     5. CONTACT FORM — validate + mailto
     ---------------------------------------------------------- */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name    = form.name.value.trim();
      const email   = form.email.value.trim();
      const subject = form.subject.value.trim();
      const message = form.message.value.trim();

      // Simple validation
      if (!name || !email || !subject || !message) {
        alert('Please fill in every field before continuing.');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
      }

      const to = 'dharshini.sridhar36@gmail.com';
      const mailSubject = encodeURIComponent(`[Portfolio] ${subject}`);
      const bodyLines = [
        `Hi Dharshini,`,
        ``,
        message,
        ``,
        `—`,
        `From: ${name}`,
        `Email: ${email}`,
      ];
      const mailBody = encodeURIComponent(bodyLines.join('\n'));

      window.location.href = `mailto:${to}?subject=${mailSubject}&body=${mailBody}`;
    });
  }

  /* ----------------------------------------------------------
     6. PROJECT CARDS → navigate to Projects page
     ---------------------------------------------------------- */
  document.querySelectorAll('.project-card[data-page]').forEach(card => {
    card.addEventListener('click', () => showPage(card.dataset.page));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        showPage(card.dataset.page);
      }
    });
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
  });

})();
