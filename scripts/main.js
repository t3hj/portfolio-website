window.addEventListener('DOMContentLoaded', () => {
  const revealItems = document.querySelectorAll('[data-reveal]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (revealItems.length > 0) {
    if (reducedMotion) {
      revealItems.forEach((item) => item.classList.add('is-visible'));
    } else {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.18 });

      revealItems.forEach((item) => observer.observe(item));
    }
  }

  const year = document.getElementById('year');
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const typingNode = document.querySelector('[data-typing]');
  if (typingNode && !reducedMotion) {
    const lines = [
      'building polished software for real users',
      'available for graduate software engineering roles',
      'shipping AI, automation, and web projects'
    ];
    let lineIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const tick = () => {
      const current = lines[lineIndex];
      typingNode.textContent = current.slice(0, charIndex);

      if (!deleting && charIndex < current.length) {
        charIndex += 1;
      } else if (deleting && charIndex > 0) {
        charIndex -= 1;
      }

      if (!deleting && charIndex === current.length) {
        deleting = true;
        window.setTimeout(tick, 1500);
        return;
      }

      if (deleting && charIndex === 0) {
        deleting = false;
        lineIndex = (lineIndex + 1) % lines.length;
      }

      window.setTimeout(tick, deleting ? 40 : 55);
    };

    tick();
  }

  const progressBar = document.querySelector('.scroll-progress span');
  const updateProgress = () => {
    if (!progressBar) {
      return;
    }

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;
  };

  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });

  const counters = document.querySelectorAll('[data-count]');
  if (counters.length > 0) {
    const animateCount = (element) => {
      const target = Number(element.getAttribute('data-count')) || 0;
      const duration = 1200;
      const startTime = performance.now();

      const step = (timestamp) => {
        const elapsed = timestamp - startTime;
        const ratio = Math.min(elapsed / duration, 1);
        const value = Math.floor(target * ratio);
        element.textContent = value.toString();

        if (ratio < 1) {
          requestAnimationFrame(step);
        } else {
          element.textContent = target.toString();
        }
      };

      requestAnimationFrame(step);
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    counters.forEach((counter) => counterObserver.observe(counter));
  }

  const graph = document.querySelector('[data-contrib-graph]');
  if (graph) {
    const levels = [0, 1, 1, 2, 0, 1, 2, 3, 1, 2, 0, 1, 4];

    for (let week = 0; week < 13; week += 1) {
      for (let day = 0; day < 7; day += 1) {
        const cell = document.createElement('span');
        cell.className = 'contrib-cell';
        const level = levels[(week + day) % levels.length];
        if (level > 0) {
          cell.classList.add(`level-${level}`);
        }
        cell.title = `Week ${week + 1}, Day ${day + 1}`;
        graph.appendChild(cell);
      }
    }
  }

  const filterButtons = document.querySelectorAll('[data-filter]');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterButtons.length > 0 && projectCards.length > 0) {
    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');

        filterButtons.forEach((item) => item.classList.remove('is-active'));
        button.classList.add('is-active');

        projectCards.forEach((card) => {
          const tags = (card.getAttribute('data-tags') || '').split(/\s+/).filter(Boolean);
          const shouldShow = filter === 'all' || tags.includes(filter);
          card.classList.toggle('is-hidden', !shouldShow);
        });
      });
    });
  }
});