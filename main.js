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
  // Hero Carousel Slider Controller (Two Slides: Slide 1 & Slide 2 with IMG_4771.JPG)
  // ==========================================================================
  const heroSection = document.getElementById('heroSection');
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroDots = document.querySelectorAll('.hero-dot');
  const heroPrevBtn = document.getElementById('heroPrev');
  const heroNextBtn = document.getElementById('heroNext');

  if (heroSlides.length > 0) {
    let currentSlide = 0;
    let slideInterval = null;
    const totalSlides = heroSlides.length;

    const goToSlide = (index) => {
      heroSlides.forEach((slide, i) => {
        if (i === index) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });
      heroDots.forEach((dot, i) => {
        if (i === index) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
      currentSlide = index;
    };

    const nextSlide = () => {
      const next = (currentSlide + 1) % totalSlides;
      goToSlide(next);
    };

    const prevSlide = () => {
      const prev = (currentSlide - 1 + totalSlides) % totalSlides;
      goToSlide(prev);
    };

    if (heroNextBtn) {
      heroNextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        nextSlide();
        resetInterval();
      });
    }

    if (heroPrevBtn) {
      heroPrevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        prevSlide();
        resetInterval();
      });
    }

    heroDots.forEach((dot) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        const targetIndex = parseInt(e.currentTarget.getAttribute('data-index'), 10);
        if (!isNaN(targetIndex)) {
          goToSlide(targetIndex);
          resetInterval();
        }
      });
    });

    const startInterval = () => {
      clearInterval(slideInterval);
      slideInterval = setInterval(nextSlide, 6500);
    };

    const resetInterval = () => {
      clearInterval(slideInterval);
      startInterval();
    };

    startInterval();

    if (heroSection) {
      heroSection.addEventListener('mouseenter', () => clearInterval(slideInterval));
      heroSection.addEventListener('mouseleave', startInterval);

      // Touch swipe support on mobile devices
      let touchStartX = 0;
      let touchEndX = 0;
      heroSection.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches.length > 0) {
          touchStartX = e.touches[0].clientX;
        }
      }, { passive: true });

      heroSection.addEventListener('touchend', (e) => {
        if (e.changedTouches && e.changedTouches.length > 0) {
          touchEndX = e.changedTouches[0].clientX;
          const diff = touchStartX - touchEndX;
          if (Math.abs(diff) > 40) {
            if (diff > 0) {
              nextSlide();
            } else {
              prevSlide();
            }
            resetInterval();
          }
        }
      }, { passive: true });
    }
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
  // ==========================================================================
  // Product Detail Modal & Specifications System (Reference: Rel-Tex Style)
  // ==========================================================================
  const productsDatabase = {
    "single-jersey": {
      title: "Single Jersey Circular Knitting Machine",
      model: "YFSG-4T Series",
      keyword: "Single Jersey Circular Knitting Machine",
      classification: "Single Jersey High-Speed Series",
      video: "https://www.youtube.com/watch?v=GKJG2PKn-EM",
      section: "Circular Knitting Machinery",
      machineType: "High-Speed 4-Track Single Jersey Circular Knitting Machine",
      gauge: "6G - 40G (Customizable for Fine & Coarse Knits)",
      diameter: '12" - 50" Cylinder Diameter',
      productionCapacity: "3F - 6F / Inch (Up to 280 - 450 kg / 24 Hours)",
      application: "T-Shirt Jersey, Lycra Jersey, 3-Thread Fleece, Pique, Terry & Mesh Fabrics",
      automationLevel: "Fully Computerized with Inverter Drive, Auto-Stop Detectors & Central Stitch Control",
      image: "https://vedanturanchi.com/manshainternational/wp-content/uploads/2026/08/circular_knitting_machine_factory.webp",
      gallery: [
        "https://vedanturanchi.com/manshainternational/wp-content/uploads/2026/08/circular_knitting_machine_factory.webp",
        "IMG_4771.JPG",
        "https://vedanturanchi.com/manshainternational/wp-content/uploads/2026/08/Circular-Knitting-machine.jpeg",
        "our-promise.jpg"
      ],
      description: "Single Jersey textiles dominate global knitting demand. The YFSG High Speed 4 Track Single Jersey Circular Knitting Machine produces plain, pique, tuck, and miss designs with high multi-feeder capacity and exceptional fabric tension control.",
      functions: [
        "Oil-Bathed Structure: The oil-based frame structure prevents Gear Ring from rusting and further smoothens rotational performance.",
        "Concatenated Sinker Cam: Double sinker-track guidances prolong sinker lifespan and eliminate fabric defective lines.",
        "Yarn Carrier: Precision-made vertical yarn guides prevent needle collision and protect Lycra / Spandex elastane filaments.",
        "Cloth Rolling System: Smooth take-up roll eliminates center creasing lines and ensures uniform roll density.",
        "Central Stitch Adjustment: Precise digital graduations allow rapid adjustment of fabric GSM weight and stitch density.",
        "Lycra Feeding Unit: Integrated positive Lycra storage feeders deliver uniform elasticity for stretch knits."
      ]
    },
    "double-jersey": {
      title: "Double Jersey Interlock & Rib Machine",
      model: "YFDG-2T Interlock",
      keyword: "Double Jersey Circular Knitting Machine",
      classification: "Double Jersey / Rib Series",
      video: "https://www.youtube.com/watch?v=GKJG2PKn-EM",
      section: "Circular Knitting Machinery",
      machineType: "Dual Track Cylinder & Dial Double Jersey Circular Knitting Machine",
      gauge: "12G - 36G (Dual Bed Interlock & Rib)",
      diameter: '14" - 44" Cylinder Diameter',
      productionCapacity: "2F - 4F / Inch (Up to 240 - 380 kg / 24 Hours)",
      application: "Ribbing Collars, Interlock Underwear, Thermal Wear, Roman Cloth, Mattress Ticking & Sportswear",
      automationLevel: "Fully Automatic with Synchronized Dial-Cylinder Inverter & Digital Stitch Tuning",
      image: "https://vedanturanchi.com/manshainternational/wp-content/uploads/2026/08/Circular-Knitting-machine.jpeg",
      gallery: [
        "https://vedanturanchi.com/manshainternational/wp-content/uploads/2026/08/Circular-Knitting-machine.jpeg",
        "IMG_4771.JPG",
        "https://vedanturanchi.com/manshainternational/wp-content/uploads/2026/08/circular_knitting_machine_factory.webp",
        "our-promise.jpg"
      ],
      description: "Built for heavy-duty two-face knit structures, the YFDG Double Jersey series offers superior dimensional stability and high stitch density for thermal apparel, rib collars, cuffs, and technical textiles.",
      functions: [
        "Synchronized Dial & Cylinder Drives: Rigid heavy casting guarantees perfect synchronization between upper dial and lower cylinder.",
        "Double Track Cam Box: Allows independent needle trajectory for knit, tuck, and welt on both dial and cylinder.",
        "Positive Feeding System: Memminger-type storage feeders eliminate yarn tension fluctuations.",
        "Automatic Oiler System: Micro-mist electronic lubrication ensures low friction at high RPMs."
      ]
    },
    "open-width": {
      title: "Open-Width Circular Knitting Machine",
      model: "YFOW-30 Slitting Series",
      keyword: "Open Width Circular Knitting Machine",
      classification: "Open Width High-Elasticity Series",
      video: "https://www.youtube.com/watch?v=GKJG2PKn-EM",
      section: "Circular Knitting Machinery",
      machineType: "Open-Width Take-Up Circular Knitting Machine with Fabric Slitter",
      gauge: "18G - 44G Ultra-Fine Gauge",
      diameter: '30" - 38" Cylinder Diameter',
      productionCapacity: "72F - 108F Multi-Feeder (Up to 300 - 500 kg / 24 Hours)",
      application: "High-Elastic Spandex/Lycra Fabrics, Swimwear, Seamless Activewear, Shapewear & Lingerie",
      automationLevel: "Fully Automatic Rotary Fabric Slitter & Crease-Free Rolling System",
      image: "https://vedanturanchi.com/manshainternational/wp-content/uploads/2026/08/circular_knitting_machine_factory.webp",
      gallery: [
        "https://vedanturanchi.com/manshainternational/wp-content/uploads/2026/08/circular_knitting_machine_factory.webp",
        "IMG_4771.JPG",
        "https://vedanturanchi.com/manshainternational/wp-content/uploads/2026/08/Circular-Knitting-machine.jpeg",
        "knitting-partner.jpg"
      ],
      description: "Eliminate central creasing on Lycra fabrics with the YFOW Open-Width system. An integrated rotary blade slits the tubular cloth into open-width rolls during knitting, preparing flat fabric directly for stenter finishing.",
      functions: [
        "Zero Center Crease: Continuous online slitting mechanism rolls fabric completely flat without side marks.",
        "Ultra-Fine Needle Track: CNC hardened tracks permit fine-gauge 36G-44G high-density Lycra knitting.",
        "Automatic Tension Sensor: Maintains balanced rolling torque across varying roll diameters.",
        "Safety Interlock Guard: Automatic power cut-off if safety door or slitter shield is opened."
      ]
    },
    "glove-machine": {
      title: "Computerized Glove Knitting Machine",
      model: "MSG-7G / 10G / 13G Full Auto",
      keyword: "Computerized Glove Knitting Machine",
      classification: "Seamless Glove Series",
      video: "https://www.youtube.com/watch?v=GKJG2PKn-EM",
      section: "Cap & Gloves Machinery",
      machineType: "Computerized Seamless 5-Finger Glove Knitting Machine",
      gauge: "7G, 10G, 13G, 15G (Interchangeable Heads)",
      diameter: "Seamless Tubular 5-Finger Needle Bed",
      productionCapacity: "180 - 240 Pairs / 24 Hours (Continuous Automated Knitting)",
      application: "Work Safety Gloves, Industrial Dotting Gloves, Winter Warm Gloves, Magic Stretch Gloves",
      automationLevel: "100% Automatic Microprocessor Control with Auto-Crotch Stitching & Drop System",
      image: "https://vedanturanchi.com/manshainternational/wp-content/uploads/2026/08/2nd-352x199.webp",
      gallery: [
        "https://vedanturanchi.com/manshainternational/wp-content/uploads/2026/08/2nd-352x199.webp",
        "https://vedanturanchi.com/manshainternational/wp-content/uploads/2026/08/Cap-and-gloves-knitting-machines.jpeg",
        "https://vedanturanchi.com/manshainternational/wp-content/uploads/2026/08/Needles-and-spare-parts.jpeg"
      ],
      description: "The MSG Computerized Glove Knitting Machine produces seamless five-finger gloves in one uninterrupted automated process. Featuring sinker movement and digital finger dimension memory, it delivers consistent glove sizes with clean elastic cuffs.",
      functions: [
        "Precision Sinker Mechanism: Guarantees elastic, comfortable finger crotches without manual sewing.",
        "Digital Controller: Touch keyboard with LCD display stores multiple glove sizes and yarn settings.",
        "Auto-Stop Motion: Instantly detects needle breakage, yarn exhaustion, or fabric wrap-around.",
        "Centralized Lubrication: Automated oil supply to all needle slots and sinker tracks."
      ]
    },
    "cap-machine": {
      title: "Automatic Beanie & Cap Knitting Machine",
      model: "MCAP-35 Jacquard",
      keyword: "Automatic Cap Knitting Machine",
      classification: "Winter Headwear & Beanie Series",
      video: "https://www.youtube.com/watch?v=GKJG2PKn-EM",
      section: "Cap & Gloves Machinery",
      machineType: "High-Speed Circular Cap & Scarf Knitting Machine",
      gauge: "6G - 14G Circular Cylinder",
      diameter: '7" - 9" Cylinder Diameter',
      productionCapacity: "30 - 45 Caps / Hour (Depending on Pattern & Rib Structure)",
      application: "Winter Beanies, Jacquard Logo Caps, Cuffed Rib Caps, Pom-Pom Hats, Knitted Neck Warmers",
      automationLevel: "Fully Computerized with 2 to 6 Color Auto-Striper & Digital Jacquard Needle Selection",
      image: "https://vedanturanchi.com/manshainternational/wp-content/uploads/2026/08/Cap-and-gloves-knitting-machines.jpeg",
      gallery: [
        "https://vedanturanchi.com/manshainternational/wp-content/uploads/2026/08/Cap-and-gloves-knitting-machines.jpeg",
        "https://vedanturanchi.com/manshainternational/wp-content/uploads/2026/08/2nd-352x199.webp",
        "https://vedanturanchi.com/manshainternational/wp-content/uploads/2026/08/Needles-and-spare-parts.jpeg"
      ],
      description: "Specialized circular knitting technology for stylish, warm winter beanies, ski caps, and scarves. Features electronic needle selection for intricate jacquard logos, multicolor stripes, and auto-turned rib cuffs.",
      functions: [
        "Electronic Jacquard System: Unlimited multicolor pattern memory via USB input.",
        "Auto Cuffed Hem: Knits double-layer turn-up hems with internal elastic reinforcement.",
        "Multi-Color Striper: Up to 6 color yarn fingers for bold graphic stripes and patterns.",
        "Fast Cylinder Interchange: Allows quick changeover between standard adult and children sizes."
      ]
    },
    "safety-glove": {
      title: "Industrial Safety Glove Knitting Machine",
      model: "MS-PRO 10 Heavy Duty",
      keyword: "Safety Glove Knitting Machine",
      classification: "Heavy-Duty Protective Equipment",
      video: "https://www.youtube.com/watch?v=GKJG2PKn-EM",
      section: "Cap & Gloves Machinery",
      machineType: "Heavy-Duty Kevlar & Cut-Resistant Glove Knitting Machine",
      gauge: "7G & 10G Heavy Gauge",
      diameter: "Reinforced Tubular Glove Bed",
      productionCapacity: "160 - 200 Pairs / 24 Hours",
      application: "Cut-Resistant Kevlar Gloves, High-Grip Dotting Gloves, Chemical-Resistant Base Liners",
      automationLevel: "Fully Automatic Heavy-Yarn Infeed with Steel-Wire & HPPE Compatibility",
      image: "https://vedanturanchi.com/manshainternational/wp-content/uploads/2026/08/2nd-352x199.webp",
      gallery: [
        "https://vedanturanchi.com/manshainternational/wp-content/uploads/2026/08/2nd-352x199.webp",
        "https://vedanturanchi.com/manshainternational/wp-content/uploads/2026/08/Cap-and-gloves-knitting-machines.jpeg",
        "https://vedanturanchi.com/manshainternational/wp-content/uploads/2026/08/Needles-and-spare-parts.jpeg"
      ],
      description: "Engineered specifically for processing abrasive, high-strength industrial yarns such as HPPE, glass fiber, Kevlar, and steel-composite thread. Equipped with reinforced cam alloys and heavy-duty sinkers.",
      functions: [
        "Hardened Alloy Cam Tracks: Resistant to extreme friction from synthetic composite fibers.",
        "High-Tension Yarn Feeders: Delivers smooth feed for high-denier coated safety threads.",
        "Automatic Elastic Lock Stitch: Secures wrists against unraveling during heavy industrial use."
      ]
    },
    "circular-needles": {
      title: "Circular Knitting Machine Needles",
      model: "Vo-Spec German & Asian Standards",
      keyword: "Circular Knitting Machine Needles",
      classification: "Precision Needles Series",
      video: "https://www.youtube.com/watch?v=GKJG2PKn-EM",
      section: "Needles & Spare Parts",
      machineType: "High-Speed Cylinder & Dial Latch Needles",
      gauge: "E14 - E40 Fine & Coarse Gauges",
      diameter: "0.26mm - 0.70mm Wire Thickness",
      productionCapacity: "High-Speed Continuous Run (Rated up to 45+ RPM)",
      application: "Single Jersey, Lycra Knits, 3-Thread Fleece, Double Jersey & Pique Circular Machines",
      automationLevel: "Precision CNC Cold-Drawn German Tool Steel with Mirror Finish Spoon Latch",
      image: "https://vedanturanchi.com/manshainternational/wp-content/uploads/2026/08/Needles-and-spare-parts.jpeg",
      gallery: [
        "https://vedanturanchi.com/manshainternational/wp-content/uploads/2026/08/Needles-and-spare-parts.jpeg",
        "https://vedanturanchi.com/manshainternational/wp-content/uploads/2026/08/niddle-352x199.webp",
        "IMG_4771.JPG"
      ],
      description: "Mansha International supplies genuine latch needles designed to minimize latch impact, prevent drop-stitches, and lower yarn friction. Compatible with leading machine brands worldwide.",
      functions: [
        "Optimized Hook & Latch Geometry: Smooth yarn glide reduces filament breakage at high speeds.",
        "High Fatigue Strength: German cold-drawn alloy resists bending under high loop tension.",
        "Wear-Resistant Shank: Reduces slot wear in machine cylinders, extending cylinder life."
      ]
    },
    "dial-needles": {
      title: "Rib & Interlock Dial Needles",
      model: "RD-Spec Rib & Interlock",
      keyword: "Dial Latch Needles",
      classification: "Double Jersey Needle Series",
      video: "https://www.youtube.com/watch?v=GKJG2PKn-EM",
      section: "Needles & Spare Parts",
      machineType: "Dial Latch Needles for Rib & Interlock Circular Machines",
      gauge: "E12 - E32 Dual Bed Gauges",
      diameter: "0.35mm - 0.65mm Wire Thickness",
      productionCapacity: "High-Speed Multi-Track Heavy-Duty Knitting",
      application: "Rib Collars, Cuffs, Interlock Fabrics, Thermal Wear & Mattress Ticking",
      automationLevel: "Hardened Chrome Plating with Wear-Resistant Latch Spring Mechanism",
      image: "https://vedanturanchi.com/manshainternational/wp-content/uploads/2026/08/niddle-352x199.webp",
      gallery: [
        "https://vedanturanchi.com/manshainternational/wp-content/uploads/2026/08/niddle-352x199.webp",
        "https://vedanturanchi.com/manshainternational/wp-content/uploads/2026/08/Needles-and-spare-parts.jpeg",
        "IMG_4771.JPG"
      ],
      description: "Designed for dial cam races in double-jersey circular knitting machines. Ensures reliable loop transfer and clean stitch formation even when running coarse cotton and blended thermal yarns.",
      functions: [
        "Reinforced Needle Butt: Resists repetitive impact in rapid dial cam switching.",
        "Smooth Needle Cheek: Prevents yarn snagging during tight interlock loop formation.",
        "Accurate Length Tolerances: Ensures uniform loop height across all knitting feeds."
      ]
    },
    "glove-needles": {
      title: "Cap & Glove Machine Needles",
      model: "GNV-7G / 10G / 13G",
      keyword: "Glove Knitting Machine Needles",
      classification: "Glove & Headwear Needle Series",
      video: "https://www.youtube.com/watch?v=GKJG2PKn-EM",
      section: "Needles & Spare Parts",
      machineType: "Flat-Bed & Circular Glove Machine Needles",
      gauge: "7 Gauge to 15 Gauge",
      diameter: "7G, 10G, 13G Standard Shanks",
      productionCapacity: "Continuous 24-Hour Automated Glove Run",
      application: "Seamless 5-Finger Work Gloves, Winter Mittens, Beanie Caps & Jacquard Hats",
      automationLevel: "Precision Spring Latch with Anti-Friction Coating",
      image: "https://vedanturanchi.com/manshainternational/wp-content/uploads/2026/08/Needles-and-spare-parts.jpeg",
      gallery: [
        "https://vedanturanchi.com/manshainternational/wp-content/uploads/2026/08/Needles-and-spare-parts.jpeg",
        "https://vedanturanchi.com/manshainternational/wp-content/uploads/2026/08/2nd-352x199.webp",
        "https://vedanturanchi.com/manshainternational/wp-content/uploads/2026/08/niddle-352x199.webp"
      ],
      description: "Compatible with Shima Seiki, Matsuya, and all Asian automatic computerized glove and cap machines. Engineered to withstand heavy elastic yarn tension and Kevlar industrial thread without latch jamming.",
      functions: [
        "Heavy-Gauge Shank: Prevents needle flex during tight finger crotch knitting.",
        "Anti-Static Coating: Reduces lint accumulation in machine needle slots.",
        "Extended Service Life: Reduces needle replacement downtime by up to 35%."
      ]
    },
    "sinkers-spares": {
      title: "Precision Sinkers & Sinker Jacks",
      model: "SK-Series High Precision",
      keyword: "Knitting Machine Sinkers",
      classification: "Genuine Replacement Spares",
      video: "https://www.youtube.com/watch?v=GKJG2PKn-EM",
      section: "Needles & Spare Parts",
      machineType: "High-Wear Sinker & Sinker Jack Components",
      gauge: "18G - 36G Precision Thickness",
      diameter: "0.20mm - 0.40mm Sinker Thickness",
      productionCapacity: "Continuous Run at 40+ RPM",
      application: "Loop Formation, Plush & Fleece Loops, Spandex Inlay on Circular Machines",
      automationLevel: "High-Carbon Tool Steel with Polished Edge to Prevent Yarn Slicing",
      image: "https://vedanturanchi.com/manshainternational/wp-content/uploads/2026/08/niddle-352x199.webp",
      gallery: [
        "https://vedanturanchi.com/manshainternational/wp-content/uploads/2026/08/niddle-352x199.webp",
        "https://vedanturanchi.com/manshainternational/wp-content/uploads/2026/08/Needles-and-spare-parts.jpeg",
        "IMG_4771.JPG"
      ],
      description: "Precision-milled sinkers provide accurate loop holding and smooth knocking-over of knitted loops. Treated for maximum abrasion resistance against high-friction dyed and spun yarns.",
      functions: [
        "Mirror-Polished Sinker Throat: Prevents filament scratching and fabric streak lines.",
        "Strict Thickness Tolerances: Ensures smooth glide in sinker dial slots with minimal friction.",
        "Corrosion-Resistant Finish: Withstands synthetic knitting machine oils."
      ]
    },
    "feeders-spares": {
      title: "Positive Storage Feeders & Tensioners",
      model: "MPF-20 / Lycra MER Positive Feed",
      keyword: "Positive Yarn Storage Feeder",
      classification: "Electronic Knitting Attachments",
      video: "https://www.youtube.com/watch?v=GKJG2PKn-EM",
      section: "Needles & Spare Parts",
      machineType: "Electronic Positive Storage Feeder (Memminger Style)",
      gauge: "Universal Compatibility (6G to 44G)",
      diameter: "120mm / 140mm Yarn Storage Drum",
      productionCapacity: "Constant Yarn Speed up to 1200 m/min",
      application: "Cotton, Polyester, Lycra/Spandex, Nylon & Blended Yarn Feeding",
      automationLevel: "360-Degree Contact-Free Optical Stop-Motion with High-Luminance LED",
      image: "https://vedanturanchi.com/manshainternational/wp-content/uploads/2026/08/niddle-352x199.webp",
      gallery: [
        "https://vedanturanchi.com/manshainternational/wp-content/uploads/2026/08/niddle-352x199.webp",
        "https://vedanturanchi.com/manshainternational/wp-content/uploads/2026/08/circular_knitting_machine_factory.webp",
        "IMG_4771.JPG"
      ],
      description: "Ensures uniform yarn feeding tension across all machine feeds, eliminating horizontal fabric bars and striping defects in circular knit goods. Features magnetic tension ring and auto-stop sensor.",
      functions: [
        "Zero Tension Variation: Eliminates fabric stripe defects and uneven roll weight.",
        "Optical Stop Motion: Reacts in milliseconds to broken yarn ends to stop machine immediately.",
        "Low Power Consumption: Highly reliable brushless internal sensor circuitry."
      ]
    },
    "cams-spares": {
      title: "Cylinder & Dial Cams / Cam Segments",
      model: "CB-4T Precision CNC Cams",
      keyword: "Knitting Machine Cam Blocks",
      classification: "Mechanical Spare Parts",
      video: "https://www.youtube.com/watch?v=GKJG2PKn-EM",
      section: "Needles & Spare Parts",
      machineType: "Hardened Tool Steel Cam Blocks (Knit, Tuck, Miss)",
      gauge: "Precision Ground for 14G - 36G Needles",
      diameter: 'Compatible with 12" to 44" Machine Cylinders',
      productionCapacity: "High-Speed Multi-Track Needle Guidance",
      application: "Pattern Change, 4-Track Single Jersey, 3-Thread Fleece, Interlock & Rib Structures",
      automationLevel: "CNC Milled & Vacuum Heat-Treated to 60-62 HRC Hardness",
      image: "https://vedanturanchi.com/manshainternational/wp-content/uploads/2026/08/niddle-352x199.webp",
      gallery: [
        "https://vedanturanchi.com/manshainternational/wp-content/uploads/2026/08/niddle-352x199.webp",
        "IMG_4771.JPG",
        "https://vedanturanchi.com/manshainternational/wp-content/uploads/2026/08/Needles-and-spare-parts.jpeg"
      ],
      description: "Engineered cam segments manufactured from premium alloy tool steel. Hardened and precision-ground to guarantee smooth needle butt impact, minimal heat buildup, and zero track deflection.",
      functions: [
        "60-62 HRC Surface Hardness: Prevents groove wear and needle butt chipping.",
        "Interchangeable Cam System: Rapid conversion between plain, pique, fleece, and twill knits.",
        "Optimized Cam Angle: Smooth acceleration reduces needle latch bounce."
      ]
    },
    "refurbished-circular": {
      title: "Refurbished Single & Double Circular Machines",
      model: "Refurbished European & Asian Series",
      keyword: "Second Hand Circular Knitting Machine",
      classification: "Certified Pre-Owned Machinery",
      video: "https://www.youtube.com/watch?v=GKJG2PKn-EM",
      section: "Second-Hand Machinery",
      machineType: "Fully Overhauled Circular Knitting Machine (Mayer / Terrot / Asian)",
      gauge: "20G - 30G High Output",
      diameter: '30" - 34" Cylinder Diameter',
      productionCapacity: "250 - 400 kg / 24 Hours (Factory-Certified Run)",
      application: "T-Shirt Jersey, Lycra Knits, Pique Polo, Interlock Underwear & Ribbing",
      automationLevel: "Refurbished Inverter Drive, New Positive Feeders, Fresh Oiler & Digital Counter",
      image: "https://vedanturanchi.com/manshainternational/wp-content/uploads/2026/08/Circular-Knitting-machine.jpeg",
      gallery: [
        "https://vedanturanchi.com/manshainternational/wp-content/uploads/2026/08/Circular-Knitting-machine.jpeg",
        "https://vedanturanchi.com/manshainternational/wp-content/uploads/2026/08/circular_knitting_machine_factory.webp",
        "IMG_4771.JPG"
      ],
      description: "Mansha International sources certified pre-owned circular machines from top European and Asian manufacturers. Every machine is stripped down, ultrasonically cleaned, fitted with new needles and sinkers, and trial-knitted.",
      functions: [
        "100% Tested Cylinder & Cams: Zero track play and calibrated dial height.",
        "Significant Cost Savings: Save 40% to 50% compared to brand new machinery.",
        "Comprehensive Pre-Delivery Trial: 48-hour continuous fabric test roll before dispatch.",
        "Ready Spare Parts Backing: Fully supported with ready inventory in Ludhiana."
      ]
    },
    "refurbished-rib": {
      title: "Second-Hand Rib & Interlock Circular Machine",
      model: "Certified Pre-Owned Rib Interlock",
      keyword: "Second Hand Rib Circular Machine",
      classification: "Certified Pre-Owned Machinery",
      video: "https://www.youtube.com/watch?v=GKJG2PKn-EM",
      section: "Second-Hand Machinery",
      machineType: "Refurbished Double Jersey Interlock & Rib Circular Machine",
      gauge: "18G - 28G Rib & Interlock",
      diameter: '30" - 36" Cylinder Diameter',
      productionCapacity: "220 - 350 kg / 24 Hours",
      application: "Rib Collars, Cuffs, Thermal Wear, Interlock Sports Fabric",
      automationLevel: "Calibrated Central Stitch Adjustment, Rebuilt Take-Up Roll & Serviced Drive",
      image: "https://vedanturanchi.com/manshainternational/wp-content/uploads/2026/08/circular_knitting_machine_factory.webp",
      gallery: [
        "https://vedanturanchi.com/manshainternational/wp-content/uploads/2026/08/circular_knitting_machine_factory.webp",
        "https://vedanturanchi.com/manshainternational/wp-content/uploads/2026/08/Circular-Knitting-machine.jpeg",
        "IMG_4771.JPG"
      ],
      description: "Inspected double jersey machines delivering high-yield production for knitwear factories looking to expand capacity at an economical capital investment.",
      functions: [
        "Dial & Cylinder Alignment Check: Optical precision calibration for flawless interlock knitting.",
        "New Drive Belts & Bearings: Quiet, vibration-free operation under heavy workload.",
        "Installation & Technical Support: Supported by experienced Mansha engineers."
      ]
    },
    "refurbished-glove": {
      title: "Reconditioned Cap & Glove Knitting Machines",
      model: "Overhauled Shima Seiki / Matsuya Style",
      keyword: "Second Hand Glove Knitting Machine",
      classification: "Certified Pre-Owned Machinery",
      video: "https://www.youtube.com/watch?v=GKJG2PKn-EM",
      section: "Second-Hand Machinery",
      machineType: "Factory-Overhauled Computerized Seamless Glove Machine",
      gauge: "7G & 10G",
      diameter: "Seamless 5-Finger Glove Bed",
      productionCapacity: "180 - 220 Pairs / 24 Hours",
      application: "Industrial Safety Work Gloves, Winter Mittens & Touchscreen Knitted Gloves",
      automationLevel: "Fully Tested Computerized Microcontroller & Serviced Needle Beds",
      image: "https://vedanturanchi.com/manshainternational/wp-content/uploads/2026/08/2nd-352x199.webp",
      gallery: [
        "https://vedanturanchi.com/manshainternational/wp-content/uploads/2026/08/2nd-352x199.webp",
        "https://vedanturanchi.com/manshainternational/wp-content/uploads/2026/08/Cap-and-gloves-knitting-machines.jpeg",
        "https://vedanturanchi.com/manshainternational/wp-content/uploads/2026/08/Needles-and-spare-parts.jpeg"
      ],
      description: "Proven glove knitting workhorses tested for 24-hour continuous automated production. Includes full service of yarn fingers, cutter blades, and needle cams.",
      functions: [
        "Serviced Computer Box: Reliable size memory and stitch pitch control.",
        "Fresh Sinker Bed: Clean drop-stitch formation with no yarn piling.",
        "Complete Tool Kit: Includes essential replacement needles and yarn tension springs."
      ]
    }
  };

  // Helper to ensure the modal DOM element exists
  const ensureProductModalExists = () => {
    let modal = document.getElementById('productDetailModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'productDetailModal';
      modal.className = 'product-modal-overlay';
      modal.innerHTML = `
        <div class="product-modal-card">
          <button class="product-modal-close" id="pdmCloseBtn" aria-label="Close details"><i class="ri-close-line"></i></button>
          
          <!-- Top Section: Gallery & Meta Information -->
          <div class="product-modal-top">
            <!-- Left: Interactive Gallery -->
            <div class="product-gallery-wrap">
              <div class="product-gallery-main">
                <img id="pdmMainImg" src="" alt="Machine Preview">
                <div class="product-gallery-zoom-badge"><i class="ri-zoom-in-line"></i></div>
              </div>
              <div class="product-gallery-thumbs" id="pdmThumbsWrap"></div>
            </div>

            <!-- Right: Meta Data & Fast Actions -->
            <div class="product-meta-wrap">
              <div class="product-meta-section-tag" id="pdmSectionTag"><i class="ri-bookmark-3-line"></i> <span></span></div>
              <h2 class="product-meta-title" id="pdmTitle"></h2>
              
              <div class="product-meta-list">
                <div class="product-meta-item">
                  <span class="meta-label">Machine model:</span>
                  <span class="meta-value" id="pdmModel"></span>
                </div>
                <div class="product-meta-item">
                  <span class="meta-label">keyword:</span>
                  <span class="meta-value" id="pdmKeyword"></span>
                </div>
                <div class="product-meta-item">
                  <span class="meta-label">Classification:</span>
                  <span class="meta-value" id="pdmClassification"></span>
                </div>
                <div class="product-meta-item">
                  <span class="meta-label">Videos:</span>
                  <span class="meta-value">
                    <a href="#" target="_blank" rel="noopener noreferrer" class="product-video-link" id="pdmVideoLink">
                      <i class="ri-youtube-fill"></i> <span>https://www.youtube.com/watch?v=GKJG2PKn-EM</span>
                    </a>
                  </span>
                </div>
              </div>

              <div class="product-modal-actions">
                <button class="product-btn-quote" id="pdmGetQuoteBtn"><i class="ri-price-tag-3-fill"></i> Get Quote</button>
                <a href="#" target="_blank" rel="noopener noreferrer" class="product-btn-wa" id="pdmWaBtn">
                  <i class="ri-whatsapp-line"></i> WhatsApp Inquiry
                </a>
              </div>
            </div>
          </div>

          <!-- Middle Section: Product Description & Features -->
          <div class="product-modal-body-section">
            <h3 class="product-modal-heading"><i class="ri-file-text-line"></i> Product Description</h3>
            <p class="product-desc-text" id="pdmDescription"></p>
            
            <div class="product-functions-title">Machine Function:</div>
            <ul class="product-functions-list" id="pdmFunctionsList"></ul>
          </div>

          <!-- Bottom Section: Detailed Specifications Table -->
          <div class="product-specs-wrap">
            <h3 class="product-modal-heading"><i class="ri-table-line"></i> Technical Specifications</h3>
            <div class="product-specs-table-container">
              <table class="product-specs-table">
                <tbody>
                  <tr>
                    <th>Product Section</th>
                    <td id="pdmSpecSection"></td>
                  </tr>
                  <tr>
                    <th>Machine Type</th>
                    <td id="pdmSpecMachineType"></td>
                  </tr>
                  <tr>
                    <th>Gauge</th>
                    <td id="pdmSpecGauge"></td>
                  </tr>
                  <tr>
                    <th>Diameter</th>
                    <td id="pdmSpecDiameter"></td>
                  </tr>
                  <tr>
                    <th>Production Capacity</th>
                    <td id="pdmSpecCapacity"></td>
                  </tr>
                  <tr>
                    <th>Application</th>
                    <td id="pdmSpecApplication"></td>
                  </tr>
                  <tr>
                    <th>Automation level</th>
                    <td id="pdmSpecAutomation"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      // Close handlers
      const closeBtn = modal.querySelector('#pdmCloseBtn');
      const closeModal = () => {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      };

      if (closeBtn) closeBtn.addEventListener('click', closeModal);
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
          closeModal();
        }
      });
    }
    return modal;
  };

  // Open & Populate Product Detail Modal
  const openProductDetail = (productId) => {
    const product = productsDatabase[productId];
    if (!product) return;

    const modal = ensureProductModalExists();

    // Fill Top Meta
    const sectionTagSpan = modal.querySelector('#pdmSectionTag span');
    if (sectionTagSpan) sectionTagSpan.textContent = product.section;

    const titleEl = modal.querySelector('#pdmTitle');
    if (titleEl) titleEl.textContent = product.title;

    const modelEl = modal.querySelector('#pdmModel');
    if (modelEl) modelEl.textContent = product.model;

    const keywordEl = modal.querySelector('#pdmKeyword');
    if (keywordEl) keywordEl.textContent = product.keyword;

    const classEl = modal.querySelector('#pdmClassification');
    if (classEl) classEl.textContent = product.classification;

    const videoLink = modal.querySelector('#pdmVideoLink');
    if (videoLink) {
      videoLink.href = product.video;
      const span = videoLink.querySelector('span');
      if (span) span.textContent = product.video;
    }

    // WhatsApp Action
    const waBtn = modal.querySelector('#pdmWaBtn');
    if (waBtn) {
      const waMsg = encodeURIComponent(`Hello Mansha International, I am interested in ${product.title} (Model: ${product.model}). Please share quotation and technical specifications.`);
      waBtn.href = `https://wa.me/+918800335090?text=${waMsg}`;
    }

    // Get Quote Button handler: pre-fills the quote form with machine model and opens modal
    const getQuoteBtn = modal.querySelector('#pdmGetQuoteBtn');
    if (getQuoteBtn) {
      getQuoteBtn.onclick = () => {
        modal.classList.remove('open');
        document.body.style.overflow = '';

        const enquiryModal = document.getElementById('enquiryModal');
        if (enquiryModal) {
          enquiryModal.classList.add('open');
          document.body.style.overflow = 'hidden';

          // Pre-fill Product / Machine Select or Input if present
          const productSelect = enquiryModal.querySelector('select');
          if (productSelect) {
            let matched = false;
            for (let i = 0; i < productSelect.options.length; i++) {
              const optText = productSelect.options[i].text.toLowerCase();
              if (product.section.toLowerCase().includes('circular') && optText.includes('circular')) {
                productSelect.selectedIndex = i;
                matched = true;
                break;
              } else if (product.section.toLowerCase().includes('cap') && (optText.includes('cap') || optText.includes('glove'))) {
                productSelect.selectedIndex = i;
                matched = true;
                break;
              } else if (product.section.toLowerCase().includes('needles') && (optText.includes('needle') || optText.includes('spare'))) {
                productSelect.selectedIndex = i;
                matched = true;
                break;
              }
            }
          }

          // Also set placeholder or requirements textarea
          const reqTextarea = enquiryModal.querySelector('textarea');
          if (reqTextarea && !reqTextarea.value) {
            reqTextarea.value = `Inquiring for: ${product.title} (Model: ${product.model}, Gauge: ${product.gauge})`;
          }
        }
      };
    }

    // Gallery & Thumbnails
    const mainImg = modal.querySelector('#pdmMainImg');
    if (mainImg) {
      mainImg.src = product.image;
      mainImg.alt = product.title;
    }

    const thumbsWrap = modal.querySelector('#pdmThumbsWrap');
    if (thumbsWrap) {
      thumbsWrap.innerHTML = '';
      const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
      gallery.forEach((imgUrl, idx) => {
        const thumbBtn = document.createElement('button');
        thumbBtn.className = `product-thumb-btn ${idx === 0 ? 'active' : ''}`;
        thumbBtn.setAttribute('aria-label', `View image ${idx + 1}`);
        thumbBtn.innerHTML = `<img src="${imgUrl}" alt="${product.title} view ${idx + 1}">`;
        thumbBtn.addEventListener('click', () => {
          thumbsWrap.querySelectorAll('.product-thumb-btn').forEach(b => b.classList.remove('active'));
          thumbBtn.classList.add('active');
          if (mainImg) {
            mainImg.style.opacity = '0.4';
            setTimeout(() => {
              mainImg.src = imgUrl;
              mainImg.style.opacity = '1';
            }, 150);
          }
        });
        thumbsWrap.appendChild(thumbBtn);
      });
    }

    // Description & Functions
    const descEl = modal.querySelector('#pdmDescription');
    if (descEl) descEl.textContent = product.description;

    const funcsList = modal.querySelector('#pdmFunctionsList');
    if (funcsList) {
      funcsList.innerHTML = '';
      if (product.functions && product.functions.length > 0) {
        product.functions.forEach(fnText => {
          const li = document.createElement('li');
          li.textContent = fnText;
          funcsList.appendChild(li);
        });
      }
    }

    // Specifications Table (The 7 requested fields)
    const setField = (id, val) => {
      const el = modal.querySelector(id);
      if (el) el.textContent = val || '-';
    };

    setField('#pdmSpecSection', product.section);
    setField('#pdmSpecMachineType', product.machineType);
    setField('#pdmSpecGauge', product.gauge);
    setField('#pdmSpecDiameter', product.diameter);
    setField('#pdmSpecCapacity', product.productionCapacity);
    setField('#pdmSpecApplication', product.application);
    setField('#pdmSpecAutomation', product.automationLevel);

    // Open Modal
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  // Delegate click for any "View More" button
  document.addEventListener('click', (e) => {
    const viewMoreBtn = e.target.closest('.btn-view-more');
    if (viewMoreBtn) {
      e.preventDefault();
      const productId = viewMoreBtn.getAttribute('data-product-id');
      if (productId) {
        openProductDetail(productId);
      }
    }
  });
}

// Guarantee execution whether DOM is loading or already ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMansha);
} else {
  initMansha();
}

