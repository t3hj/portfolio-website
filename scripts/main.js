window.addEventListener('DOMContentLoaded', () => {

  const copyEmail = document.querySelector('[data-copy-email]');
  if (copyEmail && navigator.clipboard?.writeText) {
    copyEmail.hidden = false;
    copyEmail.addEventListener('click', async () => {
      const status = document.querySelector('.copy-status');
      try {
        await navigator.clipboard.writeText('tehjpatel@gmail.com');
        status.textContent = 'Email address copied.';
      } catch {
        status.textContent = 'Please select the email address above to copy it.';
      }
    });
  }

  const year = document.getElementById('year');
  if (year) {
    year.textContent = new Date().getFullYear();
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

  const otherProjects = document.querySelector('[data-other-projects]');
  const otherToggle = document.querySelector('.other-projects-toggle');
  const otherPanel = document.getElementById('otherProjectsPanel');

  if (otherToggle && otherPanel) {
    const countNode = document.querySelector('[data-other-count]');
    if (countNode) {
      const otherCount = otherPanel.querySelectorAll('.project-card').length;
      countNode.textContent = `(${otherCount})`;
    }

    const setOtherOpen = (open) => {
      otherToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      otherProjects.classList.toggle('is-open', open);
      otherPanel.inert = !open;
    };

    otherToggle.addEventListener('click', () => {
      const isOpen = otherToggle.getAttribute('aria-expanded') === 'true';
      setOtherOpen(!isOpen);
    });
  }


  const carousel = document.querySelector('[data-carousel]');
  let refreshCarousel = () => {};
  if (carousel) {
    const track = carousel.querySelector('.carousel-track');
    const previous = carousel.querySelector('[data-carousel-prev]');
    const next = carousel.querySelector('[data-carousel-next]');
    const controls = carousel.querySelector('[data-carousel-controls]');
    const position = carousel.querySelector('[data-carousel-position]');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const visibleCards = () => [...track.querySelectorAll('.project-card:not(.is-hidden)')];
    const cardLeft = (card) => card.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;
    const update = () => {
      const cards = visibleCards();
      const overflow = track.scrollWidth - track.clientWidth > 2;
      controls.hidden = !overflow || cards.length < 2;
      previous.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
      const bounds = track.getBoundingClientRect();
      const inView = cards.map((card, index) => ({card, index})).filter(({card}) => {
        const rect = card.getBoundingClientRect();
        return rect.left >= bounds.left - 2 && rect.right <= bounds.right + 2;
      });
      if (inView.length) {
        const first = inView[0].index + 1;
        const last = inView[inView.length - 1].index + 1;
        const label = first === last ? String(first) : first + '–' + last;
        const text = label + ' of ' + cards.length;
        if (position.textContent !== text) position.textContent = text;
      } else position.textContent = '';
    };
    const navigate = (direction) => {
      const cards = visibleCards();
      const left = track.scrollLeft;
      const target = direction > 0
        ? cards.find((card) => cardLeft(card) > left + 4)
        : [...cards].reverse().find((card) => cardLeft(card) < left - 4);
      if (target) track.scrollTo({left: cardLeft(target), behavior: reducedMotion.matches ? 'instant' : 'smooth'});
    };
    previous.addEventListener('click', () => navigate(-1));
    next.addEventListener('click', () => navigate(1));
    track.addEventListener('keydown', (event) => {
      if (event.target !== track) return;
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        navigate(event.key === 'ArrowRight' ? 1 : -1);
      } else if (event.key === 'Home' || event.key === 'End') {
        event.preventDefault();
        track.scrollTo({left: event.key === 'Home' ? 0 : track.scrollWidth, behavior: reducedMotion.matches ? 'instant' : 'smooth'});
      }
    });
    let frame;
    track.addEventListener('scroll', () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    }, {passive: true});
    refreshCarousel = () => {
      const hasCards = visibleCards().length > 0;
      carousel.hidden = !hasCards;
      const heading = carousel.previousElementSibling;
      if (heading?.classList.contains('project-section-heading')) heading.hidden = !hasCards;
      track.scrollTo({left: 0, behavior: 'instant'});
      requestAnimationFrame(update);
    };
    if ('ResizeObserver' in window) new ResizeObserver(update).observe(track);
    else window.addEventListener('resize', update);
    refreshCarousel();
  }

  const filterButtons = document.querySelectorAll('[data-filter]');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterButtons.length > 0 && projectCards.length > 0) {
    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');

        filterButtons.forEach((item) => item.classList.remove('is-active'));
        button.classList.add('is-active');
        filterButtons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));

        let matchesHiddenPanel = false;
        projectCards.forEach((card) => {
          const tags = (card.getAttribute('data-tags') || '').split(/\s+/).filter(Boolean);
          const shouldShow = filter === 'all' || tags.includes(filter);
          card.classList.toggle('is-hidden', !shouldShow);
          if (shouldShow && otherPanel && otherPanel.contains(card)) {
            matchesHiddenPanel = true;
          }
        });

        document.querySelectorAll('#projects .project-grid').forEach((grid) => {
          const hasMatches = [...grid.querySelectorAll('.project-card')].some((card) => !card.classList.contains('is-hidden'));
          grid.hidden = !hasMatches;
          const heading = grid.previousElementSibling;
          if (heading?.classList.contains('project-section-heading')) heading.hidden = !hasMatches;
        });
        refreshCarousel();
        if (otherProjects && otherPanel) {
          otherProjects.hidden = !matchesHiddenPanel;
        }

        if (otherToggle && otherPanel) {
          if (filter !== 'all' && matchesHiddenPanel) {
            otherToggle.setAttribute('aria-expanded', 'true');
            otherProjects.classList.add('is-open');
            otherPanel.inert = false;
          } else if (filter === 'all') {
            otherToggle.setAttribute('aria-expanded', 'false');
            otherProjects.classList.remove('is-open');
            otherPanel.inert = true;
          }
        }
      });
    });
  }

  const comingSoonControls = document.querySelectorAll('[data-coming-soon]');
  if (comingSoonControls.length > 0) {
    const message = document.createElement('div');
    message.className = 'coming-soon-message';
    message.setAttribute('role', 'status');
    message.setAttribute('aria-live', 'polite');
    message.hidden = true;
    document.body.appendChild(message);

    let dismissTimer;
    const showComingSoonMessage = () => {
      message.textContent = 'Live demo/video coming soon. This project is currently in progress.';
      message.hidden = false;
      window.clearTimeout(dismissTimer);
      dismissTimer = window.setTimeout(() => { message.hidden = true; }, 4500);
    };

    comingSoonControls.forEach((control) => control.addEventListener('click', showComingSoonMessage));
  }
});

