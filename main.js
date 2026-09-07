/* ==========================================================================
   MANSHA INTERNATIONAL - INTERACTIVE JAVASCRIPT
   Handles: Mobile Drawer, Submenu Toggles, Modal Popup, Form Handling & Counters
   ========================================================================== */

function initMansha() {
  // Mobile Drawer Elements
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerClose = document.getElementById('drawerClose');
  const drawerBackdrop = document.getElementById('drawerBackdrop');

  // Open Mobile Drawer
  const openDrawer = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (mobileDrawer) mobileDrawer.classList.add('open');
    if (drawerBackdrop) drawerBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  // Close Mobile Drawer
  const closeDrawer = (e) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    if (mobileDrawer) mobileDrawer.classList.remove('open');
    if (drawerBackdrop) drawerBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (mobileToggle) {
    mobileToggle.addEventListener('click', openDrawer);
    mobileToggle.addEventListener('touchend', (e) => {
      openDrawer(e);
    }, { passive: false });
  }

  if (drawerClose) {
    drawerClose.addEventListener('click', closeDrawer);
    drawerClose.addEventListener('touchend', (e) => {
      e.preventDefault();
      closeDrawer(e);
    }, { passive: false });
  }

  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', closeDrawer);
    drawerBackdrop.addEventListener('touchend', (e) => {
      e.preventDefault();
      closeDrawer(e);
    }, { passive: false });
  }

  // Auto-close drawer when clicking normal navigation links inside drawer
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link:not(.mobile-sub-toggle), .mobile-sub-item');
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // Handle browser back/forward (bfcache) navigation
  window.addEventListener('pageshow', () => {
    closeDrawer();
  });

  // Mobile Submenu Accordions
  const mobileSubToggles = document.querySelectorAll('.mobile-sub-toggle');
  mobileSubToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const parent = toggle.closest('.mobile-nav-item');
      const subMenu = parent.querySelector('.mobile-sub-menu');
      if (subMenu) {
        subMenu.classList.toggle('open');
        const icon = toggle.querySelector('i');
        if (icon) {
          icon.style.transform = subMenu.classList.contains('open') ? 'rotate(180deg)' : 'rotate(0)';
        }
      }
    });
  });

  // Modal Enquiry Popup
  const modalOverlay = document.getElementById('enquiryModal');
  const modalClose = document.getElementById('modalClose');
  const enquiryButtons = document.querySelectorAll('.trigger-enquiry');

  enquiryButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (modalOverlay) {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      if (modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Accordion Component (FAQs)
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      const content = item.querySelector('.accordion-content');
      const isOpen = item.classList.contains('active');

      // Close all accordions in same wrapper
      const parentWrapper = item.closest('.accordion-wrapper');
      if (parentWrapper) {
        parentWrapper.querySelectorAll('.accordion-item').forEach(otherItem => {
          otherItem.classList.remove('active');
          const otherContent = otherItem.querySelector('.accordion-content');
          if (otherContent) otherContent.style.maxHeight = null;
        });
      }

      if (!isOpen) {
        item.classList.add('active');
        if (content) {
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      }
    });
  });

  // Open first FAQ by default if present
  const firstAccordion = document.querySelector('.accordion-item');
  if (firstAccordion) {
    firstAccordion.classList.add('active');
    const content = firstAccordion.querySelector('.accordion-content');
    if (content) {
      content.style.maxHeight = content.scrollHeight + 'px';
    }
  }

  // Form Submissions & Toast
  const forms = document.querySelectorAll('.ajax-form');
  const toast = document.getElementById('toastNotification');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerText : '';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Sending...';
      }

      setTimeout(() => {
        form.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = originalText;
        }

        // Close modal if form is inside modal
        if (modalOverlay && modalOverlay.classList.contains('active')) {
          modalOverlay.classList.remove('active');
          document.body.style.overflow = '';
        }

        // Show Toast
        if (toast) {
          toast.classList.add('show');
          setTimeout(() => {
            toast.classList.remove('show');
          }, 4000);
        }
      }, 1000);
    });
  });

  // Animated Counter Effect
  const counters = document.querySelectorAll('.counter-number[data-target]');
  let hasAnimated = false;

  const animateCounters = () => {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const suffix = counter.getAttribute('data-suffix') || '';
      const prefix = counter.getAttribute('data-prefix') || '';
      let count = 0;
      const speed = target / 50;

      const updateCount = () => {
        count += speed;
        if (count < target) {
          counter.innerText = prefix + Math.ceil(count) + suffix;
          setTimeout(updateCount, 25);
        } else {
          counter.innerText = prefix + target + suffix;
        }
      };

      updateCount();
    });
  };

  // Trigger animation on scroll into view
  const counterSection = document.querySelector('.counter-section');
  if (counterSection) {
    window.addEventListener('scroll', () => {
      const rect = counterSection.getBoundingClientRect();
      if (rect.top <= window.innerHeight && rect.bottom >= 0 && !hasAnimated) {
        hasAnimated = true;
        animateCounters();
      }
    });
  }

  // Scroll to Top Button
  const scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==========================================================================
  // Rel-Tex Style Sticky Header Scroll State
  // ==========================================================================
  const header = document.querySelector('.header');
  if (header) {
    const handleHeaderScroll = () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll();
  }

  // ==========================================================================
  // Rel-Tex Style Scroll-Triggered Reveal Animations
  // ==========================================================================
  const revealElements = document.querySelectorAll(
    '.section-header, .cards-grid .card, .company-pillars-grid .company-pillar-card, .reltex-app-item, .features-grid .feature-card, .app-card, .cta-banner, .testimonials-grid .testimonial-card, .accordion-wrapper .accordion-item, .blog-grid .blog-card'
  );

  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reltex-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => {
      el.classList.add('reltex-reveal');
      revealObserver.observe(el);
    });
  } else {
    // Fallback: make all elements visible if observer is unavailable
    revealElements.forEach(el => el.classList.add('reltex-revealed'));
  }

  // ==========================================================================
  // Rel-Tex Style Hero Edge Arrow Clicks (Slide Transition Feedback)
  // ==========================================================================
  const heroLeftBtn = document.querySelector('.hero-side-arrow.arrow-left');
  const heroRightBtn = document.querySelector('.hero-side-arrow.arrow-right');
  const heroBgImg = document.querySelector('.hero-reference-bg img');

  if ((heroLeftBtn || heroRightBtn) && heroBgImg) {
    let isTransitioning = false;
    const triggerSlideEffect = (dir) => {
      if (isTransitioning) return;
      isTransitioning = true;
      heroBgImg.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.45s ease';
      heroBgImg.style.opacity = '0.55';
      heroBgImg.style.transform = dir === 'left' ? 'scale(0.96) translateX(15px)' : 'scale(0.96) translateX(-15px)';

      setTimeout(() => {
        heroBgImg.style.opacity = '1';
        heroBgImg.style.transform = '';
        setTimeout(() => {
          heroBgImg.style.transition = '';
          isTransitioning = false;
        }, 450);
      }, 300);
    };

    if (heroLeftBtn) heroLeftBtn.addEventListener('click', () => triggerSlideEffect('left'));
    if (heroRightBtn) heroRightBtn.addEventListener('click', () => triggerSlideEffect('right'));
  }

  // ==========================================================================
  // ==========================================================================
  // Parallax Scrolling Animations (Area of Application & CTA Banner)
  // ==========================================================================
  const parallaxBanners = document.querySelectorAll('.cta-banner');
  const appSection = document.querySelector('.reltex-app-section');
  const appBg = appSection ? appSection.querySelector('.reltex-app-bg') : null;
  const appGlow = appSection ? appSection.querySelector('.reltex-app-layer-glow') : null;

  if (parallaxBanners.length > 0 || appSection) {
    let ticking = false;

    const handleAllParallax = () => {
      const windowHeight = window.innerHeight;

      // 1. Area of Application Parallax
      if (appSection && appBg) {
        const rect = appSection.getBoundingClientRect();
        if (rect.top < windowHeight && rect.bottom > 0) {
          const sectionCenter = rect.top + rect.height / 2;
          const viewportCenter = windowHeight / 2;
          const diff = sectionCenter - viewportCenter;
          
          // Background moves relatively slow/fixed (parallax ratio 0.22)
          const offsetBg = diff * 0.22;
          appBg.style.transform = `translate3d(0, ${offsetBg.toFixed(2)}px, 0)`;

          // Layered secondary ambient glow moves at a different speed (0.09)
          if (appGlow) {
            const offsetGlow = diff * 0.09;
            appGlow.style.transform = `translate3d(0, ${offsetGlow.toFixed(2)}px, 0)`;
          }
        }
      }

      // 2. CTA Banners Parallax
      parallaxBanners.forEach(banner => {
        const bg = banner.querySelector('.cta-banner-parallax-bg');
        if (!bg) return;
        const rect = banner.getBoundingClientRect();
        if (rect.top < windowHeight && rect.bottom > 0) {
          const bannerCenter = rect.top + rect.height / 2;
          const viewportCenter = windowHeight / 2;
          const offset = (bannerCenter - viewportCenter) * 0.18;
          bg.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
        }
      });

      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(handleAllParallax);
        ticking = true;
      }
    }, { passive: true });

    handleAllParallax();
  }

  // ==========================================================================
  // Testimonials Slider / Carousel
  // ==========================================================================
  const track      = document.getElementById('testiTrack');
  const viewport   = document.getElementById('testiViewport');
  const prevBtn    = document.getElementById('testiPrev');
  const nextBtn    = document.getElementById('testiNext');
  const dotsWrap   = document.getElementById('testiDots');

  if (track && viewport && prevBtn && nextBtn && dotsWrap) {
    const slides     = Array.from(track.querySelectorAll('.testi-slide'));
    const AUTOPLAY_MS = 3500;
    let currentIndex = 0;
    let autoTimer    = null;

    // --- How many slides visible at a time (matches CSS) ---
    const visibleCount = () => window.innerWidth <= 640 ? 1 : window.innerWidth <= 1024 ? 2 : 3;

    // --- Total "steps" = total slides - visible ---
    const maxIndex = () => Math.max(0, slides.length - visibleCount());

    // --- Build dots ---
    const buildDots = () => {
      dotsWrap.innerHTML = '';
      const steps = maxIndex() + 1;
      for (let i = 0; i < steps; i++) {
        const dot = document.createElement('button');
        dot.className = 'testi-dot' + (i === currentIndex ? ' active' : '');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
      }
    };

    // --- Update dot highlight ---
    const syncDots = () => {
      dotsWrap.querySelectorAll('.testi-dot').forEach((d, i) => {
        d.classList.toggle('active', i === currentIndex);
      });
    };

    // --- Calculate pixel offset for a given index ---
    const getOffset = (idx) => {
      if (slides.length === 0) return 0;
      // Width of one slide + gap
      const slideEl   = slides[0];
      const slideW    = slideEl.getBoundingClientRect().width;
      const gap       = parseFloat(getComputedStyle(track).gap) || 24;
      return idx * (slideW + gap);
    };

    // --- Navigate to index ---
    const goTo = (idx) => {
      const max = maxIndex();
      currentIndex = Math.max(0, Math.min(idx, max));
      track.style.transform = `translateX(-${getOffset(currentIndex)}px)`;
      syncDots();
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex >= max;
    };

    // --- Auto-play ---
    const startAuto = () => {
      stopAuto();
      autoTimer = setInterval(() => {
        const max = maxIndex();
        goTo(currentIndex < max ? currentIndex + 1 : 0);
      }, AUTOPLAY_MS);
    };
    const stopAuto = () => { if (autoTimer) { clearInterval(autoTimer); autoTimer = null; } };

    // --- Arrow buttons ---
    prevBtn.addEventListener('click', () => { goTo(currentIndex - 1); startAuto(); });
    nextBtn.addEventListener('click', () => { goTo(currentIndex + 1); startAuto(); });

    // --- Pause on hover ---
    viewport.addEventListener('mouseenter', stopAuto);
    viewport.addEventListener('mouseleave', startAuto);
    viewport.addEventListener('focusin',    stopAuto);
    viewport.addEventListener('focusout',   startAuto);

    // --- Touch / swipe support ---
    let touchStartX = 0;
    viewport.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    viewport.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) { goTo(diff > 0 ? currentIndex + 1 : currentIndex - 1); startAuto(); }
    }, { passive: true });

    // --- Rebuild on resize (breakpoint changes visible count) ---
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const max = maxIndex();
        if (currentIndex > max) currentIndex = max;
        buildDots();
        goTo(currentIndex);
      }, 120);
    });

    // --- Initialise ---
    buildDots();
    goTo(0);
    startAuto();
  }

  // ==========================================================================
  // Blog Machine & Equipment Category Filtering
  // ==========================================================================
  const blogFilterBtns = document.querySelectorAll('.blog-filters .filter-btn');
  const blogCards = document.querySelectorAll('.blog-grid .blog-card');
  if (blogFilterBtns.length > 0 && blogCards.length > 0) {
    blogFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        blogFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter') || 'all';

        blogCards.forEach(card => {
          const category = card.getAttribute('data-category') || '';
          if (filter === 'all' || category.includes(filter)) {
            card.classList.remove('is-hidden');
            card.style.opacity = '0';
            card.style.transform = 'translateY(15px)';
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          } else {
            card.classList.add('is-hidden');
          }
        });
      });
    });
  }
}

// Guarantee execution whether DOM is loading or already ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMansha);
} else {
  initMansha();
}

