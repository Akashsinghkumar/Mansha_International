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
  // Mansha Style Sticky Header Scroll State
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
  // Mansha Style Scroll-Triggered Reveal Animations
  // ==========================================================================
  const revealElements = document.querySelectorAll(
    '.section-header, .cards-grid .card, .company-pillars-grid .company-pillar-card, .mansha-app-item, .features-grid .feature-card, .app-card, .cta-banner, .testimonials-grid .testimonial-card, .accordion-wrapper .accordion-item, .blog-grid .blog-card'
  );

  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('mansha-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => {
      el.classList.add('mansha-reveal');
      revealObserver.observe(el);
    });
  } else {
    // Fallback: make all elements visible if observer is unavailable
    revealElements.forEach(el => el.classList.add('mansha-revealed'));
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
  const appSection = document.querySelector('.mansha-app-section');
  const appBg = appSection ? appSection.querySelector('.mansha-app-bg') : null;
  const appGlow = appSection ? appSection.querySelector('.mansha-app-layer-glow') : null;

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
  // Product Detail Modal & Specifications System (Reference: Mansha Style)
  // ==========================================================================
  const productsDatabase = {
    "single-jersey": {
      title: "Single Jersey Circular Knitting Machine",
      model: "YFSG-4T Series",
      keyword: "Single Jersey Circular Knitting Machine",
      classification: "Single Jersey High-Speed Series",
      video: "",
      section: "Circular Knitting Machinery",
      machineType: "High-Speed 4-Track Single Jersey Circular Knitting Machine",
      gauge: "6G - 40G (Customizable for Fine & Coarse Knits)",
      diameter: '12" - 50" Cylinder Diameter',
      productionCapacity: "3F - 6F / Inch (Up to 280 - 450 kg / 24 Hours)",
      application: "T-Shirt Jersey, Lycra Jersey, 3-Thread Fleece, Pique, Terry & Mesh Fabrics",
      automationLevel: "Fully Computerized with Inverter Drive, Auto-Stop Detectors & Central Stitch Control",
      image: "images/single-jersey-main.jpg",
      gallery: [
        "images/single-jersey-main.jpg",
        "images/single-jersey-standard.png",
        "IMG_4771.JPG",
        "our-promise.jpg"
      ],
      description: "Single Jersey textiles always dominate the major trend in knitting industry. In order to meet these tremendous needs, the YFSG High Speed 4 Track Single Jersey Circular Knitting Machine is engineered to knit plain and pique design fabrics easily by arranging the 4-track cylinder cams—knit, tuck, and miss—for many different kinds of patterns with exceptional fabric tension control and high productivity.",
      functions: [
        "Oil-Bathed Structure: The oil-based frame structure prevents Gear Ring from rusting and further smoothes rotational performance.",
        "Concatenated Sinker Cam: New design of the doubled sinker-track guidances prolongs the service life of sinker. It reduces friction between the sinker and the sinker cam, eliminating defective lines on the fabric.",
        "Yarn Carrier: Tailor-made vertical yarn guide wheels prevent needle collision and damage while applying Lycra / Spandex and reduce lint accumulation.",
        "Cloth Rolling System: Smooth take-up roll eliminates center creasing lines and ensures uniform roll density with automatic safety stop device.",
        "Central Stitch Adjustment: Precise digital graduations allow rapid and precise adjustment of fabric density and gram weight (GSM).",
        "Lycra Feeding Unit: Integrated positive Lycra storage feeders deliver uniform elasticity for stretch knits."
      ],
      fabricsApplicationTitle: "Fabrics Application:",
      fabricsApplication: "The needles and cams can be arranged to produce a variety of patterns and thickness of fabrics. The knitted fabrics include single jersey plain fabrics, single jersey with Lycra, pique fabrics, two-thread and three-thread fleece, terry fabrics, mesh eyelet cloth, and striped fashion fabrics for sportswear and casual apparel."
    },
    "single-jersey-bodysize": {
      title: "Mansha Bodysize Single Jersey Circular Knitting Machine",
      model: "YFSG-BS Seamless Series",
      keyword: "Bodysize Single Jersey Machine, Seamless Tubular Circular Machine",
      classification: "Single Jersey Bodysize Series",
      video: "",
      section: "Circular Knitting Machinery",
      machineType: "High-Precision Bodysize Single Jersey Circular Knitting Machine",
      gauge: "16G - 32G (Seamless Fine & Coarse Knits)",
      diameter: '14" - 22" Small-Diameter Cylinder',
      productionCapacity: "2.4F - 3.2F / Inch (Up to 150 - 260 kg / 24 Hours)",
      application: "Seamless T-shirts, Underwear, Tank Tops, Sportswear, Shapewear & Medical Body Bandages",
      automationLevel: "Fully Computerized Inverter Drive with Central Stitch Adjustment & Automatic Take-Down",
      image: "images/single-jersey-bodysize.png",
      gallery: [
        "images/single-jersey-bodysize.png",
        "images/single-jersey-main.jpg",
        "IMG_4771.JPG"
      ],
      description: "This series of small-diameter, high-precision circular knitting machines is specially designed for the efficient production of seamless tubular fabrics for underwear, bodysuits, tank tops, and athletic wear without side seams. Eliminates side-seam stitching, minimizes material waste, and enhances wearer comfort.",
      functions: [
        "Compact Small Diameter: Precision cylinder options from 14 to 22 inches for seamless bodywear without cut waste.",
        "Central Stitch Adjustment: Precise digital calibrated adjustment for quick fabric weight and density setting.",
        "Spraying Oiler & Lint Blower: Keeps needles and cams dust-free and lubricated for continuous high-speed running.",
        "Multi-Feeder High Output: Maximizes feed count per inch for elevated production yield in 24-hour continuous operation."
      ],
      fabricsApplicationTitle: "Seamless Garments Application:",
      fabricsApplication: "■ Seamless Bodywear: Men's and women's seamless undershirts, vests, camisoles, and boxer briefs.\n■ Activewear & Shapewear: Compression tank tops, yoga tops, seamless thermal base layers, and tubular shapewear.\n■ Medical & Technical: Tubular orthopedic bandages, elastic sleeves, and seamless compression support tubes."
    },
    "single-jersey-open-width": {
      title: "Mansha Open Width Single Jersey Circular Knitting Machine",
      model: "YFSG-OW Crease-Free Series",
      keyword: "Open Width Single Jersey Machine, Lycra Crease-Free Circular Machine",
      classification: "Single Jersey Open Width Series",
      video: "",
      section: "Circular Knitting Machinery",
      machineType: "Open Width Single Jersey Circular Knitting Machine with Rotary Fabric Slitter",
      gauge: "18G - 40G High-Precision Gauge",
      diameter: '30" - 38" Cylinder Diameter',
      productionCapacity: "3F - 4F / Inch (Up to 280 - 450 kg / 24 Hours)",
      application: "Lycra Jersey, Spandex Single Knit, High-Elastic Swimwear, Activewear & Pique",
      automationLevel: "Fully Automatic Fabric Slitter & Crease-Free Take-Up Roller with Electronic Synchronization",
      image: "images/single-jersey-open-width.png",
      gallery: [
        "images/single-jersey-open-width.png",
        "images/single-jersey-open-width-speed.png",
        "images/single-jersey-main.jpg"
      ],
      description: "Engineered specifically to eliminate central creasing lines on Lycra, Spandex, and synthetic elastane fabrics. Features an oil-bathed gear structure, double-push sinker cam track, and automatic rotary slitter to unroll smooth, flat fabric ready for direct stenter finishing.",
      functions: [
        "Oil-Bathed Structure: The oil-bathed frame structure prevents Gear Ring from rusting and further smoothes rotational performance.",
        "Double Push Sinker Cam: New design of doubled sinker-track guidance prolongs sinker service life and eliminates fabric line defects.",
        "Zero Center Crease: Continuous rotary cutter slits tubular fabric on the fly and winds it into flat, crease-free open rolls.",
        "Advanced Computer Control: Digital touchscreen interface with intelligent stop-motion yarn detectors and inverter speed control."
      ],
      fabricsApplicationTitle: "High-Elasticity Knits Application:",
      fabricsApplication: "■ Stretch Knits: High-percentage Lycra single jersey, 4-way stretch cycling wear, and compressive activewear leggings.\n■ Fashion & Casual: Pique polo shirts, lightweight modal knits, viscose jersey, and drape-sensitive casualwear.\n■ Swimwear & Intimates: High-density polyamide/elastane fabrics with zero streak defects and flawless finish."
    },
    "single-jersey-fleece": {
      title: "High Speed Three Thread Fleece Circular Knitting Machine",
      model: "YFSG-3TF Fleece Master Series",
      keyword: "Three Thread Fleece Knitting Machine, Sweatshirt Fabric Circular Machine",
      classification: "Single Jersey Fleece Series",
      video: "",
      section: "Circular Knitting Machinery",
      machineType: "High-Speed 4-Track Three-Thread Fleece Circular Knitting Machine",
      gauge: "14G - 24G Fleece Gauges",
      diameter: '30" - 36" Cylinder Diameter',
      productionCapacity: "3F / Inch Heavy-Duty High-Output (Up to 320 - 480 kg / 24 Hours)",
      application: "Hoodies, Sweatshirts, Winter Fleece, Heavy Joggers, Brushed Polar Fabric & French Terry",
      automationLevel: "Precision 4-Track Cam System with Central Stitch Control & Heavy Fabric Take-Up",
      image: "images/single-jersey-fleece.png",
      gallery: [
        "images/single-jersey-fleece.png",
        "images/single-jersey-main.jpg",
        "IMG_4771.JPG"
      ],
      description: "Single Jersey Three Thread Fleece Circular Knitting Machine. Engineered with 4-track cams, Groz-Beckert needles, central stitch adjustment, and a precision ball-bearing system for easy operation. Knits face yarn, ground yarn, and backing inlay yarn simultaneously with zero missing loops, producing heavy, uniform fleece ideal for brushing, raising, and sheared hoodies.",
      functions: [
        "Four Track Cams System: Dedicated camming tracks for face, tie-in, and heavy inlay fleece yarns guarantee high loop density.",
        "Groz-Beckert Needles: Premium German needles and sinkers ensure longevity and zero latch bounce at high speeds.",
        "Central Stitch Adjustment: Simple and fast weight control across all knitting feeds for consistent fabric GSM.",
        "Ball Bearing Drive: Heavy vibration-dampened frame with low-friction ball bearing system ensures light, smooth driving and saves energy."
      ],
      fabricsApplicationTitle: "Winter & Fleece Wear Application:",
      fabricsApplication: "■ Winter Streetwear: Heavyweight hoodies, zip-up jackets, warm sweatpants, and ribbed joggers.\n■ Brushed Knits: Single-side and double-side brushed fleece, polar fleece blankets, and thermal inner-fleece layers.\n■ French Terry: Unbrushed loop-back French terry for casual loungewear and premium tracksuits."
    },
    "single-jersey-terry": {
      title: "Terry Circular Knitting Machine (Face & Reverse Terry)",
      model: "YFSG-TR Plush & Towel Series",
      keyword: "Terry Circular Knitting Machine, Towel Circular Machine, Velvet Knitting Machine",
      classification: "Single Jersey Terry Series",
      video: "",
      section: "Circular Knitting Machinery",
      machineType: "High-Speed Single Jersey Terry & Plush Circular Knitting Machine",
      gauge: "16G - 28G Loop Gauges",
      diameter: '26" - 38" Cylinder Diameter',
      productionCapacity: "2.4F - 3.2F / Inch (Up to 240 - 380 kg / 24 Hours)",
      application: "Bath Towels, Polar Fleece, Velvet, Bathrobes, Babywear & Sports Wristbands",
      automationLevel: "Dual Interchangeable Cam Tracks with Micrometer Central Stitch Tuning",
      image: "images/single-jersey-terry.png",
      gallery: [
        "images/single-jersey-terry.png",
        "images/single-jersey-main.jpg",
        "IMG_4771.JPG"
      ],
      description: "Face Terry Circular Knitting Machine for Polar Fleece and Reverse Terry Circular Knitting Machine for Velvet. Terry machines are equipped with Central Stitch adjustment, dynamic sinker control, and a precision Ball Bearing system. Delivers upright, plush, uniform loop heights without loop pull-out.",
      functions: [
        "Dual Terry Modality: Convertible between Face Terry (for polar fleece) and Reverse Terry (for plush velvet).",
        "Central Stitch Adjustment: Dial calibrations allow instant loop height adjustments without stopping line production.",
        "Ball Bearing System: Reduces mechanical friction, ensures light and smooth running, and saves factory energy expense.",
        "High-Wear Sinker Cams: Smooth knocking-over action protects delicate cotton and microfiber yarns from shearing."
      ],
      fabricsApplicationTitle: "Plush & Terry Knits Application:",
      fabricsApplication: "■ Velvet & Velour: High-density reverse-terry velvet for eveningwear, upholstery, tracksuits, and baby clothing.\n■ Polar Fleece: Fluffy face-terry fabrics engineered for thermal outdoor jackets, pullovers, and blankets.\n■ Toweling Products: Highly absorbent bath towels, bathrobes, spa wraps, and sports sweatbands."
    },
    "single-jersey-open-width-speed": {
      title: "Mansha High Speed Open Width Single Jersey Circular Knitting Machine",
      model: "YFSG-OW High Speed Pro",
      keyword: "High Speed Open Width Machine, Industrial Single Jersey Slitting Machine",
      classification: "Single Jersey Open Width High-Speed Series",
      video: "",
      section: "Circular Knitting Machinery",
      machineType: "Industrial Heavy-Duty Open-Width Single Jersey Circular Machine",
      gauge: "18G - 36G High-Precision",
      diameter: '30" - 38" Cylinder Diameter',
      productionCapacity: "3F - 4F / Inch (Up to 300 - 500 kg / 24 Hours)",
      application: "Continuous Open-Width Lycra Knits, Pique Polo Fabrics, Interlock-Look Jersey & High-Resilience Sportswear",
      automationLevel: "Heavy-Duty Ergonomic 2-Step Base Platform, Top/Cylinder Lint Blowers & Spraying Oiler",
      image: "images/single-jersey-open-width-speed.png",
      gallery: [
        "images/single-jersey-open-width-speed.png",
        "images/single-jersey-open-width.png",
        "images/single-jersey-main.jpg"
      ],
      description: "Built for industrial high-yield output in modern continuous textile mills. Equipped with 2-step heavy pedals (each bearing 300 KG) on the base for safe operator access, top and cylinder lint blowers for clean fabric production, and a high-efficiency spraying-type oiler to ensure high-speed operation even in warm tropical climates.",
      functions: [
        "2 Step Pedals: Equipped on the base of the machine, each pedal bearing weight 300 KG for easy operator surveillance.",
        "Dual Lint Blower Fans: High-flow blowers on top creel and on cylinder eliminate lint accumulation and fabric holes.",
        "Spraying Type Oiler: Micro-mist electronic lubrication ensures needles and cams run smoothly at high RPMs in all climates.",
        "Crease-Free Slitting Roller: Electronically synchronized blade slits the tubular cloth into open-width rolls without tension marks."
      ],
      fabricsApplicationTitle: "Continuous Fabric Mill Application:",
      fabricsApplication: "■ Mass Apparel: Round-the-clock mass production of T-shirt jersey, modal knits, and blended elastane fabrics.\n■ Pique Polo Goods: Single and double pique knits with crisp honeycomb textures for brand sportswear.\n■ Technical Stretch Fabrics: Crease-free elastane knits ready for automated stenter drying and digital sublimation printing."
    },
    "single-jersey-standard": {
      title: "Mansha High-Speed Single Jersey Circular Knitting Machine",
      model: "YFSG-4T Expert Series",
      keyword: "Single Jersey Circular Knitting Machine, 4 Track Single Jersey",
      classification: "Single Jersey Standard Series",
      video: "",
      section: "Circular Knitting Machinery",
      machineType: "High-Speed 4-Track Single Jersey Circular Knitting Machine",
      gauge: "12G - 40G Versatile Gauge",
      diameter: '12" - 44" Cylinder Diameter',
      productionCapacity: "3F - 6F / Inch (Up to 300 - 520 kg / 24 Hours)",
      application: "T-Shirt Jersey, Lycra Jersey, Pique, 2-Thread Fleece, Terry & Mesh Fabrics",
      automationLevel: "Fully Computerized Inverter Drive, Ball Bearing System & Central Stitch Adjustment",
      image: "images/single-jersey-main.jpg",
      gallery: [
        "images/single-jersey-main.jpg",
        "IMG_4771.JPG",
        "our-promise.jpg"
      ],
      description: "Our expert Single Jersey Circular Knitting Machine features Central stitch adjustment, easy to operate and fast setting of the machine. The machine is engineered with precision ball bearings, so the machine is light and ensures smooth driving. Less noise and saves your energy expense.",
      functions: [
        "Central Stitch Adjustment: Centralized calibrated dials allow effortless GSM tuning and loop density setting in seconds.",
        "Ball Bearing System: The machine is light and ensures smooth driving, minimal friction, less noise, and saves energy expense.",
        "4-Track Cylinder Camming: Easily arrange knit, tuck, and miss cams for plain jersey, pique, twill, and mesh patterns.",
        "Positive Feeder Network: Uniform yarn delivery eliminates horizontal striping and fabric barre defects."
      ],
      fabricsApplicationTitle: "Versatile Single Jersey Application:",
      fabricsApplication: "■ Everyday Knitted Apparel: Cotton single jersey T-shirts, underwear, nightwear, and casual leisurewear.\n■ Textured & Pique Knits: Golf shirts, pique collared shirts, honeycomb knit polo shirts, and honeycomb mesh.\n■ Blended & Elastic Knits: Cotton-poly blends, viscose rayon, Lycra stretch knits, and 2-thread lightweight fleece."
    },
    "double-jersey": {
      title: "Mansha Sames SD-R2 & SD-I4 Interlock & Rib Circular Knitting Machine",
      model: "SD-R2 / SD-I4 Korean Technology Series",
      keyword: "Interlock & Rib Circular Machine, Double Jersey Knitting Machine, Sames Circular Machine",
      classification: "Double Jersey Interlock & Rib Series",
      video: "",
      section: "Circular Knitting Machinery",
      machineType: "Dual-Track Dial & 4-Track Cylinder Double Jersey Circular Knitting Machine",
      gauge: "14G - 40G (Fine & Heavy Interlock/Rib Gauges)",
      diameter: '30" - 36" (Customizable 14" to 44")',
      productionCapacity: "2F - 4F / Inch (Up to 260 - 420 kg / 24 Hours)",
      application: "Thermal Wear, Heavy Interlock, 1x1 & 2x2 Rib Fabric, Roman Cloth, Sports Apparel, Mattress Ticking",
      automationLevel: "Korean Precision 2-Cam Ring Height Adjustment, Upper/Lower Dual Ball Race, Zirconia Guides & 10\" Touch Panel",
      image: "images/double-jersey-interlock.png",
      gallery: [
        "images/double-jersey-interlock.png",
        "images/double-jersey-wp.jpg",
        "IMG_4771.JPG",
        "our-promise.jpg"
      ],
      description: "Engineered in technical partnership with South Korean machinery standards, the Mansha Sames SD-R2 & SD-I4 series provides exceptional concentricity and stitch precision. Features a structural design with two cam rings that allow height adjustment of the cylinder cam box, upper and lower dual ball race bearings to eliminate cylinder clearance, and three counter gears in the transmission to eliminate backlash clearance between cylinder and dial.",
      functions: [
        "Dual Cam Rings Height Adjustment: Structural design with two cam rings allows height adjustment of the cylinder cam box for knitting diverse fabric materials.",
        "Dual Ball Race Bearings: Upper and lower ball race bearings eliminate cylinder clearance for flawless concentricity and longevity.",
        "Keyless Top Gear & Main Shaft: Keyless structural integration preserves concentricity and planarity under heavy production loads.",
        "Three Counter Gears Transmission: Eliminates clearance between cylinder and dial, ensuring perfect timing without needle collisions.",
        "Zirconia Ceramic Yarn Guides: Ultra-low friction guides prevent filament snagging even with fine micro-denier yarns.",
        "10-Inch Touch Panel Monitor: Industrial digital touchscreen console with real-time output monitoring and diagnostic telemetry."
      ],
      fabricsApplicationTitle: "Double-Knit & Interlock Application:",
      fabricsApplication: "■ Heavy Interlock Knits: Thermal base layers, underwear, Roman cloth, double-face cotton jersey, and tracksuit fabrics.\n■ Ribbed Goods: 1x1, 2x2 rib collars, jacket cuffs, elastic waistbands, and drop-stitch rib outerwear.\n■ Technical & Home Textiles: Anti-pilling mattress ticking, compression sportswear, and double-knit fleece."
    },
    "double-jersey-sames-interlock": {
      title: "Mansha Sames SD-R2 & SD-I4 Interlock & Rib Circular Knitting Machine",
      model: "SD-R2 / SD-I4 Korean Technology Series",
      keyword: "Interlock & Rib Circular Machine, Double Jersey Knitting Machine, Sames Circular Machine",
      classification: "Double Jersey Interlock & Rib Series",
      video: "",
      section: "Circular Knitting Machinery",
      machineType: "Dual-Track Dial & 4-Track Cylinder Double Jersey Circular Knitting Machine",
      gauge: "14G - 40G (Fine & Heavy Interlock/Rib Gauges)",
      diameter: '30" - 36" (Customizable 14" to 44")',
      productionCapacity: "2F - 4F / Inch (Up to 260 - 420 kg / 24 Hours)",
      application: "Thermal Wear, Heavy Interlock, 1x1 & 2x2 Rib Fabric, Roman Cloth, Sports Apparel, Mattress Ticking",
      automationLevel: "Korean Precision 2-Cam Ring Height Adjustment, Upper/Lower Dual Ball Race, Zirconia Guides & 10\" Touch Panel",
      image: "images/sd-r2-01.jpg",
      gallery: [
        "images/sd-r2-01.jpg",
        "images/sd-r2-04.jpg",
        "images/sd-r2-03.jpg",
        "images/sd-r2-08.jpg",
        "images/sd-r2-07.jpg",
        "images/sd-r2-06.jpg",
        "images/sd-r2-05.jpg",
        "images/sd-r2-02.jpg"
      ],
      description: "Engineered in technical partnership with South Korean machinery standards, the Mansha Sames SD-R2 & SD-I4 series provides exceptional concentricity and stitch precision. Features a structural design with two cam rings that allow height adjustment of the cylinder cam box, upper and lower dual ball race bearings to eliminate cylinder clearance, and three counter gears in the transmission to eliminate backlash clearance between cylinder and dial.",
      functions: [
        "Dual Cam Rings Height Adjustment: Structural design with two cam rings allows height adjustment of the cylinder cam box for knitting diverse fabric materials.",
        "Dual Ball Race Bearings: Upper and lower ball race bearings eliminate cylinder clearance for flawless concentricity and longevity.",
        "Keyless Top Gear & Main Shaft: Keyless structural integration preserves concentricity and planarity under heavy production loads.",
        "Three Counter Gears Transmission: Eliminates clearance between cylinder and dial, ensuring perfect timing without needle collisions.",
        "Zirconia Ceramic Yarn Guides: Ultra-low friction guides prevent filament snagging even with fine micro-denier yarns.",
        "10-Inch Touch Panel Monitor: Industrial digital touchscreen console with real-time output monitoring and diagnostic telemetry."
      ],
      fabricsApplicationTitle: "Double-Knit & Interlock Application:",
      fabricsApplication: "■ Heavy Interlock Knits: Thermal base layers, underwear, Roman cloth, double-face cotton jersey, and tracksuit fabrics.\n■ Ribbed Goods: 1x1, 2x2 rib collars, jacket cuffs, elastic waistbands, and drop-stitch rib outerwear.\n■ Technical & Home Textiles: Anti-pilling mattress ticking, compression sportswear, and double-knit fleece."
    },
    "double-jersey-open-width": {
      title: "Mansha Sames SD-I4 OT Open-Width Double Jersey Machine",
      model: "SD-I4 OT Open Width Series",
      keyword: "SD-I4 OT Open Width Machine, Double Jersey Crease-Free Circular Machine",
      classification: "Double Jersey Open Width Series",
      video: "",
      section: "Circular Knitting Machinery",
      machineType: "Open-Width Take-Up Double Jersey Circular Knitting Machine with Motorized Slitter",
      gauge: "18G - 42G High-Precision Gauge",
      diameter: '30" - 36" Cylinder Diameter',
      productionCapacity: "72F - 126F Multi-Feeder (Up to 320 - 520 kg / 24 Hours)",
      application: "Neoprene Knits, Air Cushion Spacer, Crease-Free Lycra Double Jersey, Scuba Fabric & Sportswear",
      automationLevel: "Motor-Driven Fabric Cutting System, 2 Cam Rings Height Adjustment & 10-Inch Touch Panel",
      image: "images/single-jersey-open-width.png",
      gallery: [
        "images/single-jersey-open-width.png",
        "images/sames-cambox-hd.png",
        "IMG_4771.JPG"
      ],
      description: "Equipped with an advanced motor-driven fabric slitter and open-width take-up frame, the SD-I4 OT completely eliminates center creases. Designed specifically for technical textiles, neoprene, air cushion spacer knits, and high-elasticity Spandex double-jersey fabrics.",
      functions: [
        "Motor-Driven Slitter: Cuts tubular knit continuously and rolls it completely flat without center creasing lines.",
        "Two Cam Rings Height Adjustment: Allows precise height adjustment of the cylinder cam box for knitting versatile fabric materials.",
        "Dual Ball Race Bearings: Upper and lower ball race arrangement blocks cylinder clearance for maximum concentricity.",
        "Three Counter Gears Transmission: Prevents transmission clearance between cylinder and dial.",
        "10-Inch Touch Panel Console: High-resolution digital touchscreen with computerized speed and lubrication telemetry."
      ],
      fabricsApplicationTitle: "Crease-Free Technical Knits Application:",
      fabricsApplication: "■ Technical & Neoprene Fabrics: Air cushion spacer fabrics, scuba sportswear, and diving suit liners.\n■ Stretch Double Knits: Crease-free Spandex/Lycra leggings, compression garments, and yoga activewear.\n■ Automotive & Upholstery: Anti-crease double jersey for car seat covers and acoustic panelling."
    },
    "double-jersey-sames-open-width-ot": {
      title: "Mansha Sames SD-I4 OT Open-Width Double Jersey Machine",
      model: "SD-I4 OT Open Width Series",
      keyword: "SD-I4 OT Open Width Machine, Double Jersey Crease-Free Circular Machine",
      classification: "Double Jersey Open Width Series",
      video: "",
      section: "Circular Knitting Machinery",
      machineType: "Open-Width Take-Up Double Jersey Circular Knitting Machine with Motorized Slitter",
      gauge: "18G - 42G High-Precision Gauge",
      diameter: '30" - 36" Cylinder Diameter',
      productionCapacity: "72F - 126F Multi-Feeder (Up to 320 - 520 kg / 24 Hours)",
      application: "Neoprene Knits, Air Cushion Spacer, Crease-Free Lycra Double Jersey, Scuba Fabric & Sportswear",
      automationLevel: "Motor-Driven Fabric Cutting System, 2 Cam Rings Height Adjustment & 10-Inch Touch Panel",
      image: "images/single-jersey-open-width.png",
      gallery: [
        "images/single-jersey-open-width.png",
        "images/sames-cambox-hd.png",
        "IMG_4771.JPG"
      ],
      description: "Equipped with an advanced motor-driven fabric slitter and open-width take-up frame, the SD-I4 OT completely eliminates center creases. Designed specifically for technical textiles, neoprene, air cushion spacer knits, and high-elasticity Spandex double-jersey fabrics.",
      functions: [
        "Motor-Driven Slitter: Cuts tubular knit continuously and rolls it completely flat without center creasing lines.",
        "Two Cam Rings Height Adjustment: Allows precise height adjustment of the cylinder cam box for knitting versatile fabric materials.",
        "Dual Ball Race Bearings: Upper and lower ball race arrangement blocks cylinder clearance for maximum concentricity.",
        "Three Counter Gears Transmission: Prevents transmission clearance between cylinder and dial.",
        "10-Inch Touch Panel Console: High-resolution digital touchscreen with computerized speed and lubrication telemetry."
      ],
      fabricsApplicationTitle: "Crease-Free Technical Knits Application:",
      fabricsApplication: "■ Technical & Neoprene Fabrics: Air cushion spacer fabrics, scuba sportswear, and diving suit liners.\n■ Stretch Double Knits: Crease-free Spandex/Lycra leggings, compression garments, and yoga activewear.\n■ Automotive & Upholstery: Anti-crease double jersey for car seat covers and acoustic panelling."
    },
    "double-jersey-sames-double-faced-df": {
      title: "Mansha Sames SD-DF Double Faced Interlock Machine",
      model: "SD-DF Double Faced Series",
      keyword: "SD-DF Double Faced Machine, Double Faced Interlock Circular Machine",
      classification: "Double Faced Interlock Series",
      video: "",
      section: "Circular Knitting Machinery",
      machineType: "High-Speed Double-Faced Interlock Circular Knitting Machine",
      gauge: "14G - 32G Dual Bed Gauges",
      diameter: '30" - 36" Cylinder Diameter',
      productionCapacity: "Dial 3-Track & Cylinder 7-Track High-Yield Architecture",
      application: "Double Faced Outerwear, Heavy Interlock, Fleece Replacement & Bonding Fabric Alternative",
      automationLevel: "Dial 3-Track / Cylinder 7-Track Needles, 2 Cam Rings System & Zirconia Yarn Guides",
      image: "images/double-jersey-main.jpg",
      gallery: [
        "images/double-jersey-main.jpg",
        "images/sames-cambox-hd.png",
        "IMG_4771.JPG"
      ],
      description: "The SD-DF Double Faced Interlock Machine utilizes dial 3-track and cylinder 7-track needles to knit heavy double-faced fabrics. It is widely recognized for improving the factory working environment and operational efficiency by directly replacing traditional fleece or bonding fabric production with a single seamless knitting process.",
      functions: [
        "Fleece & Bonding Replacement: Knits double-faced composite fabric directly, eliminating environmental bonding and brushing steps.",
        "Dial 3-Track & Cylinder 7-Track: High-density multi-track needle distribution creates rich structural dimension and weight.",
        "Two Cam Rings Adjustment: Unique patented height adjustment of cylinder cam box for diverse yarn blends.",
        "Zirconia Ceramic Yarn Guides: Eliminates static friction and protects expensive dyed and synthetic yarn filament.",
        "Dual Ball Race Bearings: Blocks cylinder clearance and guarantees smooth rotational torque."
      ],
      fabricsApplicationTitle: "Double-Faced & Heavy Composite Knits Application:",
      fabricsApplication: "■ Heavyweight Winter Knits: Dual-face thermal jackets, composite casual coats, and double-knit outerwear.\n■ Bonding Fabric Replacement: Seamless laminated-feel apparel with zero chemical glue bonding required.\n■ Reversible Outerwear: Dual-color reversible sports hoodies, luxury blankets, and high-insulation activewear."
    },
    "double-jersey-reversible": {
      title: "Mansha Reversible & 8-Lock Double Jersey Circular Machine",
      model: "YFDG-8L Reversible Series",
      keyword: "8 Lock Circular Knitting Machine, Reversible Double Jersey Machine",
      classification: "Reversible & 8-Lock Series",
      video: "",
      section: "Circular Knitting Machinery",
      machineType: "Multi-Track Reversible 8-Lock Double Jersey Circular Knitting Machine",
      gauge: "16G - 32G Dual Bed Gauges",
      diameter: '30" - 36" Cylinder Diameter',
      productionCapacity: "2.8F - 3.6F / Inch (Up to 280 - 450 kg / 24 Hours)",
      application: "Reversible Double-Face Fabric, Punto-di-Roma, Milan Rib, Interlock Pique, Waffle Knits",
      automationLevel: "Multi-Track Dial & Cylinder Cam Arrangement with Central Stitch Synchronizer",
      image: "images/double-jersey-main.jpg",
      gallery: [
        "images/double-jersey-main.jpg",
        "images/double-jersey-wp.jpg",
        "IMG_4771.JPG"
      ],
      description: "Designed for premium structured fabrics including Punto Roma, Milano ribs, waffle knits, and reversible double-face textiles. Interchangeable cam blocks provide flexible conversion between interlock and rib structures.",
      functions: [
        "8-Lock Versatility: High-flexibility cam architecture knits wide arrays of structured double knits.",
        "Double-Faced Surface: Flawless finish on both face and reverse fabric sides without flaws.",
        "Central Calibrated Stitch Dials: Quick adjustment of loop tension for fast lot turnaround.",
        "Advanced Yarn Feeding: Even yarn release across all cone packages."
      ],
      fabricsApplicationTitle: "Structured Fashion Knits Application:",
      fabricsApplication: "■ Punto di Roma & Milano: Heavy structured blazer fabrics, tailored knit pants, and shift dresses.\n■ Reversible Two-Color Fabrics: Dual-color jackets, scarves, and contrast-face garments.\n■ Textured Waffle & Pique: Thermal waffle knits, pique polo double knits, and ottoman textures."
    },
    "jacquard-link": {
      title: "Link Jacquard Computer Electronic Jacquard Circular Knitting Machine",
      model: "YF-LJ Chuangda Series",
      keyword: "Link Jacquard Circular Machine, Electronic Jacquard Circular Machine, Chuangda Jacquard System",
      classification: "Jacquard Circular Machinery",
      video: "",
      section: "Circular Knitting Machinery",
      machineType: "Computer Electronic Jacquard Circular Knitting Machine (3-Way Selection)",
      gauge: "14G - 32G Jacquard Gauges",
      diameter: '30" - 38" Cylinder Diameter',
      productionCapacity: "1.8F - 2.8F / Inch (Up to 220 - 360 kg / 24 Hours)",
      application: "Relief Jacquard Fabrics, Fashion Knitwear, Mattress Ticking & Engineered Shoe Uppers",
      automationLevel: "3-Way Chuangda Electronic Jacquard Computer System with 3-Yarn Synchronized Feeders",
      image: "images/jacquard-link.png",
      gallery: [
        "images/jacquard-link.png",
        "images/jacquard-main.jpg",
        "images/jacquard-single.png",
        "images/jacquard-double.png"
      ],
      description: "LINK JACQUARD Computer Electronic Jacquard Circular knitting machines equipped with 3-way Chuangda Electronic jacquard computer system and special yarn guide supporting 3 yarn feeding at the same time.",
      functions: [
        "Machine 3-Way Chuangda Electronic Jacquard Computer System: Microsecond actuator response for high-definition pattern fidelity.",
        "Special Yarn Guide: Possible for 3 yarn feeding at the same time, enabling rich multi-color jacquards.",
        "Piezoelectric Ceramic Actuators: 3-way needle selection (knit, tuck, miss) with exceptional reliability and low power draw.",
        "Intuitive Touchscreen Controller: Real-time graphical diagnostic display with USB pattern input and auto-stop sensors."
      ],
      fabricsApplicationTitle: "Jacquard Knits Application:",
      fabricsApplication: "■ Fashion Knitwear: Relief jacquard garments, luxury textured apparel, and geometric patterned sportswear.\n■ Home Textiles: Decorative mattress ticking, upholstery, jacquard drapery, and cushion fabrics.\n■ Technical Knits: Breathable shoe-upper jacquards and athletic compression wear."
    },
    "jacquard-single": {
      title: "Single Jersey Computer Electronic Jacquard Knitting Machine",
      model: "YF-SJ Single Jacquard Series",
      keyword: "Single Jacquard Circular Knitting Machine, Electronic Jacquard Machine",
      classification: "Jacquard Circular Machinery",
      video: "",
      section: "Circular Knitting Machinery",
      machineType: "High-Speed Single Jersey Electronic Jacquard Machine",
      gauge: "16G - 36G High-Resolution Gauges",
      diameter: '30" - 38" Cylinder Diameter',
      productionCapacity: "2.0F - 3.0F / Inch (Up to 240 - 380 kg / 24 Hours)",
      application: "Patterned T-Shirt Jersey, Lycra Fashion Jacquard, Sports Mesh & Mattress Fabrics",
      automationLevel: "Piezoelectric Ceramic 3-Way Cylinder Actuators with Color Touch Control",
      image: "images/jacquard-single.png",
      gallery: [
        "images/jacquard-single.png",
        "images/jacquard-link.png",
        "images/jacquard-double.png"
      ],
      description: "Full computerized Single Jersey Electronic Jacquard circular machine with 3-way cylinder needle selection for intricate jacquard t-shirt fabrics, athletic wear, and mattress ticking.",
      functions: [
        "3-Way Needle Selection: Knit, tuck, and miss needle control on cylinder for boundless pattern combinations.",
        "High-Speed Precision Actuators: Ultra-fast response ceramic selection units ensure clean stitch definition.",
        "Central Stitch Adjustment: Calibrated micro-meter stitch tuning for rapid GSM optimization.",
        "Dual Lint Blower: Integrated fans prevent fluff build-up around electronic selector boxes."
      ],
      fabricsApplicationTitle: "Single Jacquard Knits Application:",
      fabricsApplication: "■ Fashion Tops: Engineered jacquard t-shirts, polo shirts, and seamless pattern garments.\n■ Activewear: Zoned breathable mesh jacquards, running shirts, and cycling jerseys.\n■ Bedding: High-thread-count jacquard mattress fabrics and pillow covers."
    },
    "jacquard-double": {
      title: "Double Jersey Computer Electronic Jacquard Knitting Machine",
      model: "YF-DJ Double Jacquard Series",
      keyword: "Double Jacquard Circular Knitting Machine, Electronic Double Jersey Jacquard",
      classification: "Jacquard Circular Machinery",
      video: "",
      section: "Circular Knitting Machinery",
      machineType: "Dial & Cylinder Computerized Double Jersey Jacquard Machine",
      gauge: "14G - 32G Double Bed Gauges",
      diameter: '30" - 38" Cylinder Diameter',
      productionCapacity: "1.6F - 2.4F / Inch (Up to 200 - 320 kg / 24 Hours)",
      application: "Double Face Jacquard, Heavy Winter Jacquard Knits, Quilted Fabrics & Luxury Upholstery",
      automationLevel: "Dual-Bed Electronic Jacquard Needle Selection with Network Telemetry",
      image: "images/jacquard-double.png",
      gallery: [
        "images/jacquard-double.png",
        "images/jacquard-link.png",
        "images/jacquard-rib-transfer.png"
      ],
      description: "Advanced Double Jersey Computer Electronic Jacquard Circular Knitting Machine with dial and cylinder pattern selection for high-end double face jacquards, multi-color relief patterns, and jacquard quilts.",
      functions: [
        "Dual-Bed Computerized Selection: Independent pattern actuators on both cylinder and dial for heavy structured jacquards.",
        "Reversible Double Face Capability: Creates multi-color reversible designs with perfect stitch clarity on both sides.",
        "Heavy Frame Vibration Dampening: Rigid industrial cast base absorbs torsional stress during high RPM jacquard production.",
        "Digital Yarn Feeding Synchronizer: Uniform tension delivery avoids pattern distortion and horizontal bar marks."
      ],
      fabricsApplicationTitle: "Double Jacquard Knits Application:",
      fabricsApplication: "■ Outerwear Knits: Heavy jacquard sweaters, blazers, winter coats, and reversible cardigans.\n■ Home Textiles: Premium upholstery, jacquard mattress covers, and decorative throws.\n■ Automotive Fabrics: High-durability vehicle seat covers and interior panel trim."
    },
    "jacquard-terry": {
      title: "Single Terry Computer Electronic Jacquard Knitting Machine",
      model: "YF-TJ Terry Jacquard Series",
      keyword: "Terry Jacquard Circular Machine, Velvet Jacquard Machine, Towel Jacquard Machine",
      classification: "Jacquard Circular Machinery",
      video: "",
      section: "Circular Knitting Machinery",
      machineType: "Plush, Towel & Velvet Electronic Jacquard Circular Knitting Machine",
      gauge: "16G - 28G Plush Gauges",
      diameter: '26" - 38" Cylinder Diameter',
      productionCapacity: "1.8F - 2.6F / Inch (Up to 200 - 340 kg / 24 Hours)",
      application: "Sculpted Velvet, Jacquard Bath Towels, Patterned Polar Fleece, Baby Blankets & Bathrobes",
      automationLevel: "Electronic Jacquard Sinker & Needle Control with Dynamic Loop Calibrator",
      image: "images/jacquard-terry.png",
      gallery: [
        "images/jacquard-terry.png",
        "images/single-jersey-terry.png",
        "images/jacquard-link.png"
      ],
      description: "Plush, Towel & Velvet Electronic Jacquard Circular Knitting Machine engineered for sculpted velvet, jacquard bath towels, and patterned polar fleece with loop-height control.",
      functions: [
        "Sculpted Plush Jacquards: Knits multi-height relief terry loops and flat jacquard zones in the same fabric piece.",
        "Zero Yarn Shear: Hardened high-wear sinker cams protect delicate cotton, bamboo, and micro-denier yarns.",
        "Quick Terry Conversion: Rapid switch between face-terry fleece and reverse-terry plush velvet settings.",
        "Ball Bearing Drive: Ensures light, smooth rotation and reduced electric power expenditure."
      ],
      fabricsApplicationTitle: "Plush & Terry Jacquard Knits Application:",
      fabricsApplication: "■ Sculpted Towels: Luxury hotel bath towels with raised geometric logos, borders, and reliefs.\n■ Fashion Velour: Embossed velvet jackets, leisure tracksuits, and baby clothing.\n■ Outdoor Knits: Patterned polar fleece pullovers, blankets, and thermal winter vests."
    },
    "jacquard-rib-transfer": {
      title: "Double Jacquard Rib Transfer Circular Knitting Machine",
      model: "YF-RT Rib Transfer Series",
      keyword: "Rib Transfer Circular Machine, Eyelet Jacquard Machine, Transfer Jacquard Machine",
      classification: "Jacquard Circular Machinery",
      video: "",
      section: "Circular Knitting Machinery",
      machineType: "Advanced Rib & Interlock Stitch Transfer Jacquard Machine",
      gauge: "12G - 20G Transfer Gauges",
      diameter: '30" - 36" Cylinder Diameter',
      productionCapacity: "1.4F - 2.0F / Inch (Up to 160 - 260 kg / 24 Hours)",
      application: "Open-Work Eyelet Knits, Pointelle Apparel, Drop-Stitch Fashion Ribs & Women's Knitwear",
      automationLevel: "Computerized Cylinder-to-Dial Stitch Transfer Cams with Micro-Positioning",
      image: "images/jacquard-rib-transfer.png",
      gallery: [
        "images/jacquard-rib-transfer.png",
        "images/jacquard-double.png",
        "images/jacquard-link.png"
      ],
      description: "High-precision circular knitting machine with needle transfer capabilities between cylinder and dial for eyelet jacquard, drop-stitch patterns, and open-work knitwear.",
      functions: [
        "Stitch Transfer Mechanics: High-precision transfer cams shift loops between cylinder and dial needles without dropped stitches.",
        "Pointelle & Open-Mesh: Produces delicate lace-look eyelets and open-work breathable knit designs.",
        "Oil-Bathed Structure: Submerged gears minimize friction, noise, and mechanical backlash for decade-long precision.",
        "Full Electronic Diagnostics: Touchscreen system displays transfer timing, sensor status, and production yields."
      ],
      fabricsApplicationTitle: "Rib Transfer Jacquard Knits Application:",
      fabricsApplication: "■ Pointelle Knitwear: Delicate lace-effect summer tops, cardigans, and women's fashion sweaters.\n■ Eyelet Underwear: Thermal base layers and breathable underwear with decorative eyelet mesh.\n■ Technical Open-Work: Ventilation-mapped athletic wear and breathable compression garments."
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
      image: "images/circular-knitting-main.jpg",
      gallery: [
        "images/circular-knitting-main.jpg",
        "IMG_4771.JPG",
        "images/single-jersey-main.jpg",
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
    "flat-sweater-machine": {
      title: "Computerized Sweater & Cardigan Flat Knitting Machine",
      model: "MF-52C / MF-72C Dual System High-Speed Series",
      keyword: "Computerized Flat Knitting Machine, Sweater Knitting Machine, Jacquard Flat Knitting Machine",
      classification: "Computerized Flat Knitting Machinery Series",
      video: "",
      section: "Flat Knitting Machinery",
      machineType: "Fully Computerized Dual System Flat Knitting Machine with Dynamic Stitch & Motorized Racking",
      gauge: "3G, 5G, 7G, 12G, 14G, 16G & Multi-Gauge Options (Customizable for Fine & Chunky Knits)",
      diameter: '52" (132 cm) / 72" (183 cm) Precision Hardened Needle Bed',
      productionCapacity: "Continuous High-Yield Operation (Max Speed 1.6 m/sec with Rapid Carriage Return)",
      application: "Sweaters, Pullovers, Cardigans, Fully Fashioned Garments, Intarsia Knits, Cable Patterns, Shaped Panels",
      automationLevel: "100% Fully Computerized CNC Control with Electronic Needle Selection, USB CAD Pattern Input & Digital Stitch Stepper",
      image: "images/flat-knitting-main.jpg",
      gallery: [
        "images/flat-knitting-main.jpg",
        "images/flat-knitting-carriage.jpg",
        "images/flat-knitting-collar.jpg",
        "images/flat-knitting-samples.jpg"
      ],
      description: "Mansha International's Fully Computerized Sweater & Cardigan Flat Knitting Machine is an industrial-grade, high-productivity solution engineered for the manufacturing of premium sweaters, pullovers, cardigans, and fully fashioned knit garments. Built with precision dual-carriage systems, hardened alloy needle beds, and high-response electronic needle actuators, the MF-52C / MF-72C series delivers flawless stitch quality across intricate cable designs, pointelle, tuck loops, transfer stitches, and multi-color Jacquard graphics.\n\nEquipped with a computerized color touchscreen CNC interface, programmable stitch stepping motors, dynamic electronic sinker control, and 16-color motorized yarn carrier bars, operators can rapidly switch pattern programs via standard USB CAD files. Its heavy vibration-dampened frame ensures quiet high-speed traversing up to 1.6 m/s, offering exceptional dimensional consistency across wool, cashmere, cotton, acrylic, viscose, and blended yarns.",
      functions: [
        "Dual System High-Speed Carriage: Precision dual cam carriage allows simultaneous knitting, transferring, tucking, and missing in a single traversing pass, boosting output by up to 35%.",
        "Precision Electronic Needle Selection: High-speed ceramic piezo actuators select every individual latch needle with zero missed stitches, supporting complex multi-gauge Jacquard patterns.",
        "Dynamic Stitch Motor Control: High-torque digital stepper motors adjust loop length on each needle line independently for anatomical 3D shaping and refined knit structure.",
        "Electronic Sinker & Take-Down Roller: Programmable torque-regulated roller and dynamic movable sinkers guarantee clean stitch release and uniform tension without drop stitches.",
        "16-Color Motorized Yarn Carrier System: 4 double-sided guide rails support 16 yarn feeders for intricate multicolor Intarsia, plating, and striping with automatic electronic tension compensators.",
        "Intelligent Multi-Sensor Safety Motion: Millisecond-response sensors immediately detect yarn breakages, yarn runout, needle damage, fabric winding, and carriage overload.",
        "Industrial CNC Touchscreen Console: High-resolution graphical touchscreen displays real-time carriage RPM, active stitch diagram, piece output counter, and diagnostic telemetry."
      ],
      fabricsApplicationTitle: "Knitwear & Fashion Applications:",
      fabricsApplication: "The computerized needle beds and programmable cam systems are engineered to produce a vast range of high-end fashion and technical knitwear:\n■ Winter Knitwear & Sweaters: Full-fashion crewneck sweaters, V-neck pullovers, buttoned cardigans, turtleneck knitwear, cable-knit outerwear, and chunky knit winter wear.\n■ Structural & Shaped Components: Shaped garment panels, front plackets, seamless armholes, raglan sleeves, pockets, and ribbed hem trims with zero cutting waste.\n■ Fine & Complex Patterns: Intarsia blocks, multi-color Jacquard graphics, Pointelle openwork lace, Aran cables, Milano ribs, half-cardigan ribs, and 3D textured knitwear."
    },
    "flat-collar-machine": {
      title: "Automatic Collar & Cuff Flat Knitting Machine",
      model: "MFC-40 Single System High-Speed Collar Series",
      keyword: "Collar Knitting Machine, Cuff Flat Knitting Machine, Polo Rib Flat Machine",
      classification: "Rib & Trim Flat Knitting Series",
      video: "",
      section: "Flat Knitting Machinery",
      machineType: "High-Speed Computerized Single System Flat Knitting Machine for Polo Collars & Rib Trims",
      gauge: "12G, 14G, 16G, 18G Fine Gauge",
      diameter: '36" / 40" / 52" Compact Needle Bed',
      productionCapacity: "80 - 120 Finished Collars / Hour (High-Speed Continuous Production)",
      application: "T-Shirt Polo Collars, Sleeve Cuffs, Waistbands, Jacket Trims, V-Neck Rib Bands, Striped Edgings",
      automationLevel: "Fully Automatic Electronic Color Change, Auto-Striper, Digital Tension & Self-Locking Hemming",
      image: "images/flat-knitting-collar.jpg",
      gallery: [
        "images/flat-knitting-collar.jpg",
        "images/flat-knitting-main.jpg",
        "images/flat-knitting-carriage.jpg",
        "images/flat-knitting-samples.jpg"
      ],
      description: "Engineered specifically for high-efficiency mass production of polo collars, sleeve cuffs, pocket edges, and ribbed waistbands. The MFC-40 combines compact dimensions with high carriage traverse speeds, electronic color striping, and automatic turn-up lock-stitch hemming. Its rapid pattern turnover and intuitive operator interface maximize daily throughput for commercial garment factories.",
      functions: [
        "Ultra-Fast Compact Carriage: Lightweight carriage frame achieves rapid acceleration and turning with speeds up to 1.4 m/s.",
        "Multi-Color Striping Feeders: 6 to 8 color automated yarn carriers deliver crisp collar tipping stripes and contrast edge borders.",
        "Integrated Anti-Roll Elastic Inlay: Specialized yarn feeder feeds Lycra/Spandex elastic yarn into collar edges to prevent curling and maintain crisp shape.",
        "Precision Cam Stitch Density: Digital stepping motor controls collar edge sharpness and elasticity with micrometer accuracy.",
        "Automatic Thread Trimmer & Clamping: Clean pneumatic yarn cutters eliminate post-production manual trimming."
      ],
      fabricsApplicationTitle: "Garment Trims Application:",
      fabricsApplication: "■ Polo Shirt Collars: Solid-color ribbed collars, contrast tipping stripe collars, Jacquard knitted brand logos on collar wings, and textured herringbone collar structures.\n■ Sleeve Cuffs & Waistband Ribs: High-elasticity 1x1 and 2x2 ribbed cuffs for bomber jackets, hoodies, tracksuits, polo shirts, and winter jackets.\n■ Fashion Knit Accessories: Ribbed scarves, headband ear-warmers, knitted pocket welts, and placket strips."
    },
    "flat-intarsia-machine": {
      title: "3D Shaping & Intarsia Flat Knitting Machine",
      model: "MF-PRO 3D Shaping & Multi-Gauge Series",
      keyword: "3D Shaping Flat Knitting Machine, Intarsia Knitting Machine, Flyknit Shoe Upper Machine",
      classification: "Advanced 3D & Intarsia Series",
      video: "",
      section: "Flat Knitting Machinery",
      machineType: "Fully Computerized Multi-Gauge 3D Shaping & Intarsia Flat Knitting Machine",
      gauge: "5.2G, 7.2G, 12G & Multi-Gauge Conversion (Knits multiple gauges on single bed)",
      diameter: '52" (132 cm) Precision Hardened Needle Bed with Motorized Feeder Bars',
      productionCapacity: "Continuous Precision Complex Patterning with Independent Servo Feeder Traversing",
      application: "Intarsia Sweaters, 3D Flyknit Shoe Uppers, Seamless Knitwear, Shaped Technical Textiles, Gradient Knits",
      automationLevel: "100% Fully Computerized with 16 Independent Motorized Autonomously Driven Yarn Feeders & 3D Stitch Camming",
      image: "images/flat-knitting-carriage.jpg",
      gallery: [
        "images/flat-knitting-carriage.jpg",
        "images/flat-knitting-main.jpg",
        "images/flat-knitting-collar.jpg",
        "images/flat-knitting-samples.jpg"
      ],
      description: "The MF-PRO Series represents the state-of-the-art in flat knitting technology, featuring motorized yarn carriers that move independently of the carriage for true high-definition Intarsia blocks without reverse-side floating threads. Designed for avant-garde fashion knitwear, 3D seamless garment engineering, and engineered sports footwear uppers, this machine allows freeform needle transfer, inverse plating, and multi-gauge stitch blending on a single garment piece.",
      functions: [
        "Independent Motorized Yarn Feeders: 16 motorized autotracking yarn carriers traverse precisely to yarn color boundaries without carriage drag.",
        "True Multi-Gauge Stitch Capability: Specially profiled latch needles and sinkers allow fine and coarse gauges to be knitted seamlessly in the same garment.",
        "Dynamic 3D Stitch Camming: Enables complex 3D spherical shaping, contoured cups, elbows, and ergonomic shoe upper contours directly off the needle bed.",
        "Inverse Plating Device: Instantly reverses face and back yarn positions for dramatic color-shifting optical surface textures.",
        "High-Definition CAD Compatibility: Seamless integration with leading knit CAD systems (Stoll, Shima Seiki, Raynen) for rapid prototype sampling."
      ],
      fabricsApplicationTitle: "3D Shaping & Advanced Knitwear Application:",
      fabricsApplication: "■ High-Definition Intarsia Fashion: Luxury geometric Intarsia sweaters, pictorial artwork knits, color-block cardigans, and zero-float graphic knitwear.\n■ 3D Engineered Footwear Uppers: Seamless, breathable 3D Flyknit athletic shoe uppers with zoned breathability, integrated lace eyelets, and reinforced heel cups.\n■ Technical & Shaped Textiles: Orthopedic compression braces, automotive seat covers, architectural acoustic panels, and contoured ergonomic knit components."
    },
    // Compatibility aliases
    "glove-machine": {
      title: "Computerized Sweater & Cardigan Flat Knitting Machine",
      model: "MF-52C / MF-72C Dual System High-Speed Series",
      keyword: "Computerized Flat Knitting Machine, Sweater Knitting Machine, Jacquard Flat Knitting Machine",
      classification: "Computerized Flat Knitting Machinery Series",
      video: "",
      section: "Flat Knitting Machinery",
      machineType: "Fully Computerized Dual System Flat Knitting Machine with Dynamic Stitch & Motorized Racking",
      gauge: "3G, 5G, 7G, 12G, 14G, 16G & Multi-Gauge Options (Customizable for Fine & Chunky Knits)",
      diameter: '52" (132 cm) / 72" (183 cm) Precision Hardened Needle Bed',
      productionCapacity: "Continuous High-Yield Operation (Max Speed 1.6 m/sec with Rapid Carriage Return)",
      application: "Sweaters, Pullovers, Cardigans, Fully Fashioned Garments, Intarsia Knits, Cable Patterns, Shaped Panels",
      automationLevel: "100% Fully Computerized CNC Control with Electronic Needle Selection, USB CAD Pattern Input & Digital Stitch Stepper",
      image: "images/flat-knitting-main.jpg",
      gallery: [
        "images/flat-knitting-main.jpg",
        "images/flat-knitting-carriage.jpg",
        "images/flat-knitting-collar.jpg",
        "images/flat-knitting-samples.jpg"
      ],
      description: "Mansha International's Fully Computerized Sweater & Cardigan Flat Knitting Machine is an industrial-grade, high-productivity solution engineered for the manufacturing of premium sweaters, pullovers, cardigans, and fully fashioned knit garments. Built with precision dual-carriage systems, hardened alloy needle beds, and high-response electronic needle actuators, the MF-52C / MF-72C series delivers flawless stitch quality across intricate cable designs, pointelle, tuck loops, transfer stitches, and multi-color Jacquard graphics.\n\nEquipped with a computerized color touchscreen CNC interface, programmable stitch stepping motors, dynamic electronic sinker control, and 16-color motorized yarn carrier bars, operators can rapidly switch pattern programs via standard USB CAD files. Its heavy vibration-dampened frame ensures quiet high-speed traversing up to 1.6 m/s, offering exceptional dimensional consistency across wool, cashmere, cotton, acrylic, viscose, and blended yarns.",
      functions: [
        "Dual System High-Speed Carriage: Precision dual cam carriage allows simultaneous knitting, transferring, tucking, and missing in a single traversing pass, boosting output by up to 35%.",
        "Precision Electronic Needle Selection: High-speed ceramic piezo actuators select every individual latch needle with zero missed stitches, supporting complex multi-gauge Jacquard patterns.",
        "Dynamic Stitch Motor Control: High-torque digital stepper motors adjust loop length on each needle line independently for anatomical 3D shaping and refined knit structure.",
        "Electronic Sinker & Take-Down Roller: Programmable torque-regulated roller and dynamic movable sinkers guarantee clean stitch release and uniform tension without drop stitches.",
        "16-Color Motorized Yarn Carrier System: 4 double-sided guide rails support 16 yarn feeders for intricate multicolor Intarsia, plating, and striping with automatic electronic tension compensators.",
        "Intelligent Multi-Sensor Safety Motion: Millisecond-response sensors immediately detect yarn breakages, yarn runout, needle damage, fabric winding, and carriage overload.",
        "Industrial CNC Touchscreen Console: High-resolution graphical touchscreen displays real-time carriage RPM, active stitch diagram, piece output counter, and diagnostic telemetry."
      ],
      fabricsApplicationTitle: "Knitwear & Fashion Applications:",
      fabricsApplication: "The computerized needle beds and programmable cam systems are engineered to produce a vast range of high-end fashion and technical knitwear:\n■ Winter Knitwear & Sweaters: Full-fashion crewneck sweaters, V-neck pullovers, buttoned cardigans, turtleneck knitwear, cable-knit outerwear, and chunky knit winter wear.\n■ Structural & Shaped Components: Shaped garment panels, front plackets, seamless armholes, raglan sleeves, pockets, and ribbed hem trims with zero cutting waste.\n■ Fine & Complex Patterns: Intarsia blocks, multi-color Jacquard graphics, Pointelle openwork lace, Aran cables, Milano ribs, half-cardigan ribs, and 3D textured knitwear."
    },
    "cap-machine": {
      title: "Automatic Collar & Cuff Flat Knitting Machine",
      model: "MFC-40 Single System High-Speed Collar Series",
      keyword: "Collar Knitting Machine, Cuff Flat Knitting Machine, Polo Rib Flat Machine",
      classification: "Rib & Trim Flat Knitting Series",
      video: "",
      section: "Flat Knitting Machinery",
      machineType: "High-Speed Computerized Single System Flat Knitting Machine for Polo Collars & Rib Trims",
      gauge: "12G, 14G, 16G, 18G Fine Gauge",
      diameter: '36" / 40" / 52" Compact Needle Bed',
      productionCapacity: "80 - 120 Finished Collars / Hour (High-Speed Continuous Production)",
      application: "T-Shirt Polo Collars, Sleeve Cuffs, Waistbands, Jacket Trims, V-Neck Rib Bands, Striped Edgings",
      automationLevel: "Fully Automatic Electronic Color Change, Auto-Striper, Digital Tension & Self-Locking Hemming",
      image: "images/flat-knitting-collar.jpg",
      gallery: [
        "images/flat-knitting-collar.jpg",
        "images/flat-knitting-main.jpg",
        "images/flat-knitting-carriage.jpg",
        "images/flat-knitting-samples.jpg"
      ],
      description: "Engineered specifically for high-efficiency mass production of polo collars, sleeve cuffs, pocket edges, and ribbed waistbands. The MFC-40 combines compact dimensions with high carriage traverse speeds, electronic color striping, and automatic turn-up lock-stitch hemming. Its rapid pattern turnover and intuitive operator interface maximize daily throughput for commercial garment factories.",
      functions: [
        "Ultra-Fast Compact Carriage: Lightweight carriage frame achieves rapid acceleration and turning with speeds up to 1.4 m/s.",
        "Multi-Color Striping Feeders: 6 to 8 color automated yarn carriers deliver crisp collar tipping stripes and contrast edge borders.",
        "Integrated Anti-Roll Elastic Inlay: Specialized yarn feeder feeds Lycra/Spandex elastic yarn into collar edges to prevent curling and maintain crisp shape.",
        "Precision Cam Stitch Density: Digital stepping motor controls collar edge sharpness and elasticity with micrometer accuracy.",
        "Automatic Thread Trimmer & Clamping: Clean pneumatic yarn cutters eliminate post-production manual trimming."
      ],
      fabricsApplicationTitle: "Garment Trims Application:",
      fabricsApplication: "■ Polo Shirt Collars: Solid-color ribbed collars, contrast tipping stripe collars, Jacquard knitted brand logos on collar wings, and textured herringbone collar structures.\n■ Sleeve Cuffs & Waistband Ribs: High-elasticity 1x1 and 2x2 ribbed cuffs for bomber jackets, hoodies, tracksuits, polo shirts, and winter jackets.\n■ Fashion Knit Accessories: Ribbed scarves, headband ear-warmers, knitted pocket welts, and placket strips."
    },
    "safety-glove": {
      title: "3D Shaping & Intarsia Flat Knitting Machine",
      model: "MF-PRO 3D Shaping & Multi-Gauge Series",
      keyword: "3D Shaping Flat Knitting Machine, Intarsia Knitting Machine, Flyknit Shoe Upper Machine",
      classification: "Advanced 3D & Intarsia Series",
      video: "",
      section: "Flat Knitting Machinery",
      machineType: "Fully Computerized Multi-Gauge 3D Shaping & Intarsia Flat Knitting Machine",
      gauge: "5.2G, 7.2G, 12G & Multi-Gauge Conversion (Knits multiple gauges on single bed)",
      diameter: '52" (132 cm) Precision Hardened Needle Bed with Motorized Feeder Bars',
      productionCapacity: "Continuous Precision Complex Patterning with Independent Servo Feeder Traversing",
      application: "Intarsia Sweaters, 3D Flyknit Shoe Uppers, Seamless Knitwear, Shaped Technical Textiles, Gradient Knits",
      automationLevel: "100% Fully Computerized with 16 Independent Motorized Autonomously Driven Yarn Feeders & 3D Stitch Camming",
      image: "images/flat-knitting-carriage.jpg",
      gallery: [
        "images/flat-knitting-carriage.jpg",
        "images/flat-knitting-main.jpg",
        "images/flat-knitting-collar.jpg",
        "images/flat-knitting-samples.jpg"
      ],
      description: "The MF-PRO Series represents the state-of-the-art in flat knitting technology, featuring motorized yarn carriers that move independently of the carriage for true high-definition Intarsia blocks without reverse-side floating threads. Designed for avant-garde fashion knitwear, 3D seamless garment engineering, and engineered sports footwear uppers, this machine allows freeform needle transfer, inverse plating, and multi-gauge stitch blending on a single garment piece.",
      functions: [
        "Independent Motorized Yarn Feeders: 16 motorized autotracking yarn carriers traverse precisely to yarn color boundaries without carriage drag.",
        "True Multi-Gauge Stitch Capability: Specially profiled latch needles and sinkers allow fine and coarse gauges to be knitted seamlessly in the same garment.",
        "Dynamic 3D Stitch Camming: Enables complex 3D spherical shaping, contoured cups, elbows, and ergonomic shoe upper contours directly off the needle bed.",
        "Inverse Plating Device: Instantly reverses face and back yarn positions for dramatic color-shifting optical surface textures.",
        "High-Definition CAD Compatibility: Seamless integration with leading knit CAD systems (Stoll, Shima Seiki, Raynen) for rapid prototype sampling."
      ],
      fabricsApplicationTitle: "3D Shaping & Advanced Knitwear Application:",
      fabricsApplication: "■ High-Definition Intarsia Fashion: Luxury geometric Intarsia sweaters, pictorial artwork knits, color-block cardigans, and zero-float graphic knitwear.\n■ 3D Engineered Footwear Uppers: Seamless, breathable 3D Flyknit athletic shoe uppers with zoned breathability, integrated lace eyelets, and reinforced heel cups.\n■ Technical & Shaped Textiles: Orthopedic compression braces, automotive seat covers, architectural acoustic panels, and contoured ergonomic knit components."
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
      image: "images/niddle-352x199.webp",
      gallery: [
        "images/niddle-352x199.webp",
        "images/sames-cambox-hd.png",
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
      image: "images/niddle-352x199.webp",
      gallery: [
        "images/niddle-352x199.webp",
        "images/sames-cambox-hd.png",
        "IMG_4771.JPG"
      ],
      description: "Designed for dial cam races in double-jersey circular knitting machines. Ensures reliable loop transfer and clean stitch formation even when running coarse cotton and blended thermal yarns.",
      functions: [
        "Reinforced Needle Butt: Resists repetitive impact in rapid dial cam switching.",
        "Smooth Needle Cheek: Prevents yarn snagging during tight interlock loop formation.",
        "Accurate Length Tolerances: Ensures uniform loop height across all knitting feeds."
      ]
    },
    "flat-needles": {
      title: "Flat Knitting Machine Needles & Jacks",
      model: "FNV-3G to 18G High Speed Series",
      keyword: "Flat Knitting Machine Needles, Latch Needles, Transfer Needles",
      classification: "Flat Knitting Needle & Jack Series",
      video: "",
      section: "Needles & Spare Parts",
      machineType: "Computerized Flat-Bed Precision Latch & Transfer Needles",
      gauge: "3G, 5G, 7G, 12G, 14G, 16G, 18G Standard & Multi-Gauge Shanks",
      diameter: "Precision CNC Hardened German & Asian Standards",
      productionCapacity: "Continuous 24-Hour Automated Full-Fashion Knitwear Production",
      application: "Sweaters, Cardigans, Pullovers, Polo Collars, Cuffs, and Shaped Fashion Knitwear",
      automationLevel: "Precision Flexible Latch with Anti-Friction Ceramic Coating & High Wear Resistance",
      image: "images/flat-knitting-carriage.jpg",
      gallery: [
        "images/flat-knitting-carriage.jpg",
        "images/flat-knitting-main.jpg",
        "images/niddle-352x199.webp"
      ],
      description: "Precision engineered latch needles, transfer needles, selector jacks, and sinkers compatible with Stoll, Shima Seiki, and modern computerized flat knitting machines. Manufactured from ultra-pure alloy tool steel with mirror-polished needle cheeks to prevent yarn snagging and latch fatigue under high carriage traverse speeds up to 1.6 m/s.",
      functions: [
        "Hardened Needle Hook & Butt: Resists repetitive cam impact during high-speed multi-system knitting.",
        "Mirror-Finished Needle Cheek: Ensures smooth loop movement and clean stitch release without yarn friction.",
        "Precision Spring Latch: Guaranteed smooth latch flip action without bounce, preventing dropped stitches.",
        "Extended Fatigue Life: Reduces needle replacement downtime by up to 40% under continuous operation."
      ]
    },
    "glove-needles": {
      title: "Flat Knitting Machine Needles & Jacks",
      model: "FNV-3G to 18G High Speed Series",
      keyword: "Flat Knitting Machine Needles, Latch Needles, Transfer Needles",
      classification: "Flat Knitting Needle & Jack Series",
      video: "",
      section: "Needles & Spare Parts",
      machineType: "Computerized Flat-Bed Precision Latch & Transfer Needles",
      gauge: "3G, 5G, 7G, 12G, 14G, 16G, 18G Standard & Multi-Gauge Shanks",
      diameter: "Precision CNC Hardened German & Asian Standards",
      productionCapacity: "Continuous 24-Hour Automated Full-Fashion Knitwear Production",
      application: "Sweaters, Cardigans, Pullovers, Polo Collars, Cuffs, and Shaped Fashion Knitwear",
      automationLevel: "Precision Flexible Latch with Anti-Friction Ceramic Coating & High Wear Resistance",
      image: "images/flat-knitting-carriage.jpg",
      gallery: [
        "images/flat-knitting-carriage.jpg",
        "images/flat-knitting-main.jpg",
        "images/niddle-352x199.webp"
      ],
      description: "Precision engineered latch needles, transfer needles, selector jacks, and sinkers compatible with Stoll, Shima Seiki, and modern computerized flat knitting machines. Manufactured from ultra-pure alloy tool steel with mirror-polished needle cheeks to prevent yarn snagging and latch fatigue under high carriage traverse speeds up to 1.6 m/s.",
      functions: [
        "Hardened Needle Hook & Butt: Resists repetitive cam impact during high-speed multi-system knitting.",
        "Mirror-Finished Needle Cheek: Ensures smooth loop movement and clean stitch release without yarn friction.",
        "Precision Spring Latch: Guaranteed smooth latch flip action without bounce, preventing dropped stitches.",
        "Extended Fatigue Life: Reduces needle replacement downtime by up to 40% under continuous operation."
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
      image: "images/niddle-352x199.webp",
      gallery: [
        "images/niddle-352x199.webp",
        "images/sames-cambox-hd.png",
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
      image: "images/niddle-352x199.webp",
      gallery: [
        "images/niddle-352x199.webp",
        "images/circular-knitting-main.jpg",
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
      image: "images/sames-cambox-hd.png",
      gallery: [
        "images/sames-cambox-hd.png",
        "images/niddle-352x199.webp",
        "IMG_4771.JPG"
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
      image: "images/single-jersey-main.jpg",
      gallery: [
        "images/single-jersey-main.jpg",
        "images/circular-knitting-main.jpg",
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
      image: "images/circular-knitting-main.jpg",
      gallery: [
        "images/circular-knitting-main.jpg",
        "images/single-jersey-main.jpg",
        "IMG_4771.JPG"
      ],
      description: "Inspected double jersey machines delivering high-yield production for knitwear factories looking to expand capacity at an economical capital investment.",
      functions: [
        "Dial & Cylinder Alignment Check: Optical precision calibration for flawless interlock knitting.",
        "New Drive Belts & Bearings: Quiet, vibration-free operation under heavy workload.",
        "Installation & Technical Support: Supported by experienced Mansha engineers."
      ]
    },
    "refurbished-flat": {
      title: "Reconditioned Computerized Flat Knitting Machines",
      model: "Factory-Overhauled Shima Seiki / Stoll & Premium Series",
      keyword: "Second Hand Flat Knitting Machine, Refurbished Sweater Machine",
      classification: "Certified Pre-Owned Machinery",
      video: "",
      section: "Second-Hand Machinery",
      machineType: "Factory-Overhauled Computerized Flat Knitting Machine",
      gauge: "7G, 12G, 14G Multi-Gauge",
      diameter: '52" (132 cm) Serviced Precision Needle Bed',
      productionCapacity: "Tested for 24/7 Continuous Production (Max Speed 1.4 m/s)",
      application: "Sweaters, Pullovers, Cardigans, Polo Collars, Cuffs, and Fashion Knitwear",
      automationLevel: "Fully Tested Computerized CNC Controller, Recalibrated Cam Tracks & New Needles",
      image: "images/flat-knitting-main.jpg",
      gallery: [
        "images/flat-knitting-main.jpg",
        "images/flat-knitting-carriage.jpg",
        "images/flat-knitting-samples.jpg"
      ],
      description: "High-precision certified pre-owned computerized flat knitting machines thoroughly inspected, serviced, and recalibrated by Mansha International's technical team in Ludhiana. Includes renewed needle beds, serviced carriage cam boxes, fresh latch needles, and upgraded CNC control memory.",
      functions: [
        "Serviced Computer Console: Reliable pattern memory and stepper stitch pitch control.",
        "Fresh Needle Bed: Clean drop-stitch formation and uniform stitch tension.",
        "Complete Tool Kit: Includes essential replacement needles and yarn tension springs."
      ]
    },
    "refurbished-glove": {
      title: "Reconditioned Computerized Flat Knitting Machines",
      model: "Factory-Overhauled Shima Seiki / Stoll & Premium Series",
      keyword: "Second Hand Flat Knitting Machine, Refurbished Sweater Machine",
      classification: "Certified Pre-Owned Machinery",
      video: "",
      section: "Second-Hand Machinery",
      machineType: "Factory-Overhauled Computerized Flat Knitting Machine",
      gauge: "7G, 12G, 14G Multi-Gauge",
      diameter: '52" (132 cm) Serviced Precision Needle Bed',
      productionCapacity: "Tested for 24/7 Continuous Production (Max Speed 1.4 m/s)",
      application: "Sweaters, Pullovers, Cardigans, Polo Collars, Cuffs, and Fashion Knitwear",
      automationLevel: "Fully Tested Computerized CNC Controller, Recalibrated Cam Tracks & New Needles",
      image: "images/flat-knitting-main.jpg",
      gallery: [
        "images/flat-knitting-main.jpg",
        "images/flat-knitting-carriage.jpg",
        "images/flat-knitting-samples.jpg"
      ],
      description: "High-precision certified pre-owned computerized flat knitting machines thoroughly inspected, serviced, and recalibrated by Mansha International's technical team in Ludhiana. Includes renewed needle beds, serviced carriage cam boxes, fresh latch needles, and upgraded CNC control memory.",
      functions: [
        "Serviced Computer Console: Reliable pattern memory and stepper stitch pitch control.",
        "Fresh Needle Bed: Clean drop-stitch formation and uniform stitch tension.",
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
              <div class="product-gallery-main" id="pdmGalleryMain">
                <img id="pdmMainImg" src="" alt="Machine Preview">
                <div class="product-magnifier-lens" id="pdmMagnifierLens"></div>
                <div class="product-gallery-zoom-badge" title="Hover over machine parts to magnify (3x)"><i class="ri-zoom-in-line"></i></div>
                <!-- Circular Navigation Buttons matching reference screenshot -->
                <button type="button" class="gallery-circular-arrow circular-arrow-prev" id="pdmPrevBtn" aria-label="Previous photo"><i class="ri-arrow-left-s-line"></i></button>
                <button type="button" class="gallery-circular-arrow circular-arrow-next" id="pdmNextBtn" aria-label="Next photo"><i class="ri-arrow-right-s-line"></i></button>
              </div>
              <div class="product-gallery-thumbs" id="pdmThumbsWrap"></div>
            </div>

            <!-- Side Zoom Inspection Window -->
            <div class="product-zoom-window" id="pdmZoomWindow"></div>

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
                <div class="product-meta-item" id="pdmVideoItem">
                  <span class="meta-label">Videos:</span>
                  <span class="meta-value">
                    <a href="#" target="_blank" rel="noopener noreferrer" class="product-video-link" id="pdmVideoLink">
                      <i class="ri-youtube-fill"></i> <span></span>
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
            <div class="product-desc-text" id="pdmDescription"></div>
            
            <div class="product-functions-title" id="pdmFunctionsTitle">Machine Function:</div>
            <ul class="product-functions-list" id="pdmFunctionsList"></ul>

            <!-- Fabrics & Product Application (matching reference layout) -->
            <div class="product-app-desc-wrap" id="pdmAppDescWrap" style="margin-top: 1.5rem;">
              <div class="product-functions-title" id="pdmAppDescTitle">Fabrics Application:</div>
              <div class="product-desc-text" id="pdmAppDescText" style="margin-bottom: 0; white-space: pre-line;"></div>
            </div>
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

    const videoItem = modal.querySelector('#pdmVideoItem');
    const videoLink = modal.querySelector('#pdmVideoLink');
    if (videoItem && videoLink) {
      if (product.video && product.video.trim() !== '') {
        videoItem.style.display = 'grid';
        videoLink.href = product.video;
        const span = videoLink.querySelector('span');
        if (span) span.textContent = product.video;
      } else {
        videoItem.style.display = 'none';
      }
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

    // Gallery & Thumbnails with Interactive Magnifier (Side Zoom)
    const galleryMain = modal.querySelector('#pdmGalleryMain');
    const mainImg = modal.querySelector('#pdmMainImg');
    const lens = modal.querySelector('#pdmMagnifierLens');
    const zoomWindow = modal.querySelector('#pdmZoomWindow');
    const thumbsWrap = modal.querySelector('#pdmThumbsWrap');

    const updateZoomSource = (src) => {
      if (zoomWindow) {
        zoomWindow.style.backgroundImage = `url("${src}")`;
      }
    };

    if (mainImg) {
      mainImg.src = product.image;
      mainImg.alt = product.title;
      updateZoomSource(product.image);
    }

    // Set up Magnifier on cursor hover
    if (galleryMain && zoomWindow && lens && mainImg) {
      const handleZoomMove = (e) => {
        const rect = galleryMain.getBoundingClientRect();
        const clientX = e.touches && e.touches.length ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches && e.touches.length ? e.touches[0].clientY : e.clientY;

        let x = clientX - rect.left;
        let y = clientY - rect.top;

        x = Math.max(0, Math.min(x, rect.width));
        y = Math.max(0, Math.min(y, rect.height));

        const pctX = (x / rect.width) * 100;
        const pctY = (y / rect.height) * 100;

        if (window.innerWidth <= 860) {
          // Mobile inner zoom
          galleryMain.style.setProperty('--zoom-x', `${pctX}%`);
          galleryMain.style.setProperty('--zoom-y', `${pctY}%`);
        } else {
          // Desktop side zoom with tracking lens
          const lensW = lens.offsetWidth || 90;
          const lensH = lens.offsetHeight || 90;
          let lensLeft = x - lensW / 2;
          let lensTop = y - lensH / 2;

          lensLeft = Math.max(0, Math.min(lensLeft, rect.width - lensW));
          lensTop = Math.max(0, Math.min(lensTop, rect.height - lensH));

          lens.style.left = `${lensLeft}px`;
          lens.style.top = `${lensTop}px`;

          zoomWindow.style.backgroundPosition = `${pctX}% ${pctY}%`;
          zoomWindow.style.backgroundSize = `${rect.width * 2.8}px ${rect.height * 2.8}px`;
        }
      };

      const handleZoomEnter = (e) => {
        if (window.innerWidth <= 860) {
          galleryMain.classList.add('mobile-zoomed');
        } else {
          zoomWindow.classList.add('active');
          lens.classList.add('active');
        }
        handleZoomMove(e);
      };

      const handleZoomLeave = () => {
        zoomWindow.classList.remove('active');
        lens.classList.remove('active');
        galleryMain.classList.remove('mobile-zoomed');
      };

      galleryMain.onmouseenter = handleZoomEnter;
      galleryMain.onmousemove = handleZoomMove;
      galleryMain.onmouseleave = handleZoomLeave;

      galleryMain.ontouchstart = (e) => { handleZoomEnter(e); };
      galleryMain.ontouchmove = (e) => { handleZoomMove(e); };
      galleryMain.ontouchend = handleZoomLeave;
      galleryMain.ontouchcancel = handleZoomLeave;
    }

    if (thumbsWrap) {
      thumbsWrap.innerHTML = '';
      const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
      let currentIdx = 0;

      const setModalImage = (newIdx) => {
        currentIdx = (newIdx + gallery.length) % gallery.length;
        const imgUrl = gallery[currentIdx];
        thumbsWrap.querySelectorAll('.product-thumb-btn').forEach((b, i) => {
          b.classList.toggle('active', i === currentIdx);
        });
        if (mainImg) {
          mainImg.style.opacity = '0.35';
          setTimeout(() => {
            mainImg.src = imgUrl;
            updateZoomSource(imgUrl);
            mainImg.style.opacity = '1';
          }, 100);
        }
      };

      gallery.forEach((imgUrl, idx) => {
        const thumbBtn = document.createElement('button');
        thumbBtn.className = `product-thumb-btn ${idx === 0 ? 'active' : ''}`;
        thumbBtn.setAttribute('aria-label', `View image ${idx + 1}`);
        thumbBtn.innerHTML = `<img src="${imgUrl}" alt="${product.title} view ${idx + 1}">`;
        thumbBtn.addEventListener('click', () => {
          setModalImage(idx);
        });
        thumbsWrap.appendChild(thumbBtn);
      });

      const pdmPrevBtn = modal.querySelector('#pdmPrevBtn');
      const pdmNextBtn = modal.querySelector('#pdmNextBtn');
      if (pdmPrevBtn) {
        pdmPrevBtn.style.display = gallery.length > 1 ? 'flex' : 'none';
        pdmPrevBtn.onclick = (e) => {
          e.stopPropagation();
          setModalImage(currentIdx - 1);
        };
      }
      if (pdmNextBtn) {
        pdmNextBtn.style.display = gallery.length > 1 ? 'flex' : 'none';
        pdmNextBtn.onclick = (e) => {
          e.stopPropagation();
          setModalImage(currentIdx + 1);
        };
      }
    }

    // Description & Functions
    const descEl = modal.querySelector('#pdmDescription');
    if (descEl) {
      if (product.description && product.description.includes('\n\n')) {
        descEl.innerHTML = product.description.split('\n\n').map(p => `<p style="margin-bottom: 0.9rem;">${p}</p>`).join('');
      } else {
        descEl.textContent = product.description || '';
      }
    }

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

    // Fabrics & Product Application Section
    const appWrap = modal.querySelector('#pdmAppDescWrap');
    const appTitle = modal.querySelector('#pdmAppDescTitle');
    const appText = modal.querySelector('#pdmAppDescText');
    if (appWrap && appText) {
      if (product.fabricsApplication && product.fabricsApplication.trim() !== '') {
        appWrap.style.display = 'block';
        if (appTitle) appTitle.textContent = product.fabricsApplicationTitle || 'Fabrics Application:';
        appText.textContent = product.fabricsApplication;
      } else {
        appWrap.style.display = 'none';
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


