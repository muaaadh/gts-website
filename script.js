// ========================================
// GTS Maldives — Website Interactivity
// ========================================

document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile navigation ---
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navBackdrop = document.getElementById('navBackdrop');

    const closeMenu = () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        if (navBackdrop) navBackdrop.classList.remove('active');
        document.body.classList.remove('menu-open');
    };

    const openMenu = () => {
        navMenu.classList.add('active');
        navToggle.classList.add('active');
        if (navBackdrop) navBackdrop.classList.add('active');
        document.body.classList.add('menu-open');
    };

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (navMenu.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        if (navBackdrop) {
            navBackdrop.addEventListener('click', closeMenu);
        }

        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                closeMenu();
            }
        });

        // Close menu on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMenu();
        });
    }

    // --- HERO: Cinematic image carousel + Ken Burns + mouse parallax ---
    const heroBgs = document.querySelectorAll('.hero-bg');
    const heroDots = document.querySelectorAll('.hero-progress-dot');
    const heroBgStack = document.getElementById('heroBgStack');
    const heroSection = document.querySelector('.hero');

    if (heroBgs.length > 1) {
        let heroIndex = 0;
        let heroInterval = null;

        const showHeroImage = (index) => {
            heroBgs.forEach((bg, i) => {
                bg.classList.toggle('active', i === index);
                if (i === index) {
                    // Restart Ken Burns animation
                    bg.style.animation = 'none';
                    void bg.offsetWidth;
                    bg.style.animation = '';
                }
            });
            heroDots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
                if (i === index) {
                    // Restart progress fill animation
                    const after = dot;
                    after.style.animation = 'none';
                    void after.offsetWidth;
                    after.style.animation = '';
                }
            });
        };

        const advance = () => {
            heroIndex = (heroIndex + 1) % heroBgs.length;
            showHeroImage(heroIndex);
        };

        const startCycle = () => {
            stopCycle();
            heroInterval = setInterval(advance, 7000);
        };

        const stopCycle = () => {
            if (heroInterval) {
                clearInterval(heroInterval);
                heroInterval = null;
            }
        };

        // Click dots to jump
        heroDots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                heroIndex = i;
                showHeroImage(heroIndex);
                startCycle();
            });
        });

        startCycle();
    }

    // --- HERO: Mouse parallax (subtle feel, translate not translate3d to avoid GPU layer) ---
    if (heroBgStack && heroSection) {
        let targetX = 0, targetY = 0;
        let currentX = 0, currentY = 0;
        let rafId = null;

        const lerp = (start, end, t) => start + (end - start) * t;

        const animateParallax = () => {
            currentX = lerp(currentX, targetX, 0.08);
            currentY = lerp(currentY, targetY, 0.08);
            heroBgStack.style.setProperty('--px', `${currentX}px`);
            heroBgStack.style.setProperty('--py', `${currentY}px`);
            if (Math.abs(currentX - targetX) > 0.1 || Math.abs(currentY - targetY) > 0.1) {
                rafId = requestAnimationFrame(animateParallax);
            } else {
                rafId = null;
            }
        };

        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            targetX = -x * 20;
            targetY = -y * 20;
            if (!rafId) rafId = requestAnimationFrame(animateParallax);
        });

        heroSection.addEventListener('mouseleave', () => {
            targetX = 0;
            targetY = 0;
            if (!rafId) rafId = requestAnimationFrame(animateParallax);
        });
    }

    // --- HERO: Vertical scroll parallax ---
    if (heroBgStack) {
        const updateScrollParallax = () => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                heroBgStack.style.setProperty('--scroll-offset', `${scrolled * 0.2}px`);
            }
        };
        window.addEventListener('scroll', updateScrollParallax, { passive: true });
    }

    // --- Scroll animations (smoother, slower) ---
    const animatedElements = document.querySelectorAll('[data-animate]');

    if (animatedElements.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const parent = entry.target.parentElement;
                    const siblings = Array.from(parent.querySelectorAll('[data-animate]'));
                    const siblingIndex = siblings.indexOf(entry.target);
                    const delay = siblingIndex * 80;

                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay);

                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -60px 0px'
        });

        animatedElements.forEach(el => observer.observe(el));
    }

    // --- Container reveal (for stagger groups: stats) ---
    const containerReveals = document.querySelectorAll('.about-stats');
    if (containerReveals.length) {
        const containerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    containerObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        containerReveals.forEach(el => containerObserver.observe(el));
    }

    // --- Counter animation ---
    const stats = document.querySelectorAll('.stat-number[data-count]');

    if (stats.length) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.count, 10);
                    const duration = 2200;
                    const start = performance.now();

                    const animate = (now) => {
                        const elapsed = now - start;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 4);
                        el.textContent = Math.round(target * eased);

                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        }
                    };

                    requestAnimationFrame(animate);
                    counterObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        stats.forEach(stat => counterObserver.observe(stat));
    }

    // --- Portfolio cards staggered reveal ---
    const portfolioGrid = document.getElementById('portfolioGrid');
    if (portfolioGrid) {
        const portfolioObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    portfolioGrid.classList.add('revealed');
                    portfolioObserver.disconnect();
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
        portfolioObserver.observe(portfolioGrid);
    }

    // --- Resort Logos Slider (smooth JS-driven, slows on hover) ---
    const sliderTrack = document.getElementById('resortSliderTrack');
    const sliderWrap = document.querySelector('.resort-slider');

    if (sliderTrack && sliderWrap) {
        let position = 0;
        let baseSpeed = 0.5;       // pixels per frame at normal speed
        let currentSpeed = baseSpeed;
        let targetSpeed = baseSpeed;
        let lastTime = performance.now();
        let trackWidth = 0;
        let isPaused = false;

        const measureTrack = () => {
            // Track is duplicated content, so half the width is the loop length
            trackWidth = sliderTrack.scrollWidth / 2;
        };

        // Wait for images to load before measuring
        const imgs = sliderTrack.querySelectorAll('img');
        let loaded = 0;
        const onImgLoad = () => {
            loaded++;
            if (loaded >= imgs.length) measureTrack();
        };
        imgs.forEach(img => {
            if (img.complete) onImgLoad();
            else img.addEventListener('load', onImgLoad);
        });
        // Also measure on resize
        window.addEventListener('resize', measureTrack);
        // Initial measure
        setTimeout(measureTrack, 100);

        const lerp = (a, b, t) => a + (b - a) * t;

        const tick = (now) => {
            const dt = Math.min(now - lastTime, 50); // cap delta time
            lastTime = now;

            // Smoothly transition speed
            currentSpeed = lerp(currentSpeed, targetSpeed, 0.04);

            if (!isPaused && trackWidth > 0) {
                position -= currentSpeed * (dt / 16.67); // normalise to 60fps
                if (Math.abs(position) >= trackWidth) {
                    position += trackWidth;
                }
                sliderTrack.style.transform = `translate3d(${position}px, 0, 0)`;
            }

            requestAnimationFrame(tick);
        };

        // Slow down on hover
        sliderWrap.addEventListener('mouseenter', () => {
            targetSpeed = 0.12;
        });
        sliderWrap.addEventListener('mouseleave', () => {
            targetSpeed = baseSpeed;
        });

        // Pause when off-screen
        const sliderObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isPaused = !entry.isIntersecting;
            });
        }, { threshold: 0 });
        sliderObserver.observe(sliderWrap);

        requestAnimationFrame(tick);
    }

    // --- Contact form handling (Formspree via AJAX) ---
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const statusEl = document.getElementById('formStatus');
            const formAction = contactForm.getAttribute('action');
            const originalText = submitBtn.textContent;

            // If Formspree not configured, fall back to mailto
            if (!formAction || formAction.includes('YOUR_FORM_ID')) {
                const formData = new FormData(contactForm);
                const data = Object.fromEntries(formData);
                const subject = encodeURIComponent(`GTS Website Enquiry: ${data.subject || 'General'}`);
                const body = encodeURIComponent(
                    `Name: ${data.name}\nEmail: ${data.email}\nProperty: ${data.property || 'N/A'}\n\n${data.message}`
                );
                window.location.href = `mailto:sales@gts.com.mv?subject=${subject}&body=${body}`;
                return;
            }

            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            try {
                const response = await fetch(formAction, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    if (statusEl) {
                        statusEl.className = 'form-status success';
                        statusEl.textContent = 'Message sent successfully. We will get back to you shortly.';
                    }
                    contactForm.reset();
                    submitBtn.textContent = 'Sent!';

                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                        if (statusEl) statusEl.className = 'form-status';
                    }, 5000);
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (err) {
                if (statusEl) {
                    statusEl.className = 'form-status error';
                    statusEl.textContent = 'Something went wrong. Please email us directly at sales@gts.com.mv';
                }
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // --- Active nav link highlighting ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a:not(.nav-cta)');

    if (sections.length && navLinks.length) {
        const highlightNav = () => {
            const scrollY = window.scrollY + 100;

            sections.forEach(section => {
                const top = section.offsetTop;
                const height = section.offsetHeight;
                const id = section.getAttribute('id');

                if (scrollY >= top && scrollY < top + height) {
                    navLinks.forEach(link => {
                        link.style.color = '';
                        if (link.getAttribute('href') === `#${id}`) {
                            link.style.color = '#d44550';
                        }
                    });
                }
            });
        };

        window.addEventListener('scroll', highlightNav, { passive: true });
    }
});
