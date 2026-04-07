// ========================================
// GTS Maldives — Website Interactivity
// ========================================

document.addEventListener('DOMContentLoaded', () => {

    // --- Navbar scroll effect ---
    const navbar = document.getElementById('navbar');
    if (navbar) {
        const handleScroll = () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }

    // --- Mobile navigation ---
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }

    // --- Hero parallax (subtle) ---
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        const updateParallax = () => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                heroBg.style.transform = `scale(1.05) translateY(${scrolled * 0.3}px)`;
            }
        };
        window.addEventListener('scroll', updateParallax, { passive: true });
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

    // --- Resort Spotlight (interactive showcase) ---
    const spotlightItems = document.querySelectorAll('.spotlight-item');
    const spotlightImages = document.querySelectorAll('.spotlight-image');
    const spotlightName = document.getElementById('spotlightName');
    const spotlightList = document.getElementById('spotlightList');

    if (spotlightItems.length && spotlightImages.length) {
        let activeIndex = 0;
        let autoPlayInterval = null;
        let userInteracted = false;

        const setActive = (resortKey, name) => {
            spotlightItems.forEach(item => {
                item.classList.toggle('active', item.dataset.resort === resortKey);
            });
            spotlightImages.forEach(img => {
                img.classList.toggle('active', img.dataset.resort === resortKey);
            });
            if (spotlightName && name) {
                spotlightName.innerHTML = name;
            }
        };

        const cycleNext = () => {
            activeIndex = (activeIndex + 1) % spotlightItems.length;
            const item = spotlightItems[activeIndex];
            setActive(item.dataset.resort, item.dataset.name);
            // Auto-scroll only within the spotlight list (not the page)
            if (spotlightList) {
                const itemTop = item.offsetTop - spotlightList.offsetTop;
                const itemBottom = itemTop + item.offsetHeight;
                const listScroll = spotlightList.scrollTop;
                const listHeight = spotlightList.clientHeight;
                if (itemTop < listScroll) {
                    spotlightList.scrollTo({ top: itemTop - 8, behavior: 'smooth' });
                } else if (itemBottom > listScroll + listHeight) {
                    spotlightList.scrollTo({ top: itemBottom - listHeight + 8, behavior: 'smooth' });
                }
            }
        };

        const startAutoPlay = () => {
            stopAutoPlay();
            autoPlayInterval = setInterval(cycleNext, 3500);
        };

        const stopAutoPlay = () => {
            if (autoPlayInterval) {
                clearInterval(autoPlayInterval);
                autoPlayInterval = null;
            }
        };

        spotlightItems.forEach((item, index) => {
            const onActivate = () => {
                userInteracted = true;
                stopAutoPlay();
                activeIndex = index;
                setActive(item.dataset.resort, item.dataset.name);
            };
            item.addEventListener('mouseenter', onActivate);
            item.addEventListener('click', onActivate);
            item.addEventListener('focus', onActivate);
        });

        // Resume autoplay when mouse leaves the section
        const spotlightSection = document.querySelector('.spotlight-section');
        if (spotlightSection) {
            spotlightSection.addEventListener('mouseleave', () => {
                if (userInteracted) {
                    startAutoPlay();
                }
            });
        }

        // Start autoplay when section enters viewport
        const spotlightObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startAutoPlay();
                } else {
                    stopAutoPlay();
                }
            });
        }, { threshold: 0.3 });

        if (spotlightSection) {
            spotlightObserver.observe(spotlightSection);
        }
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
                            link.style.color = '#b5313a';
                        }
                    });
                }
            });
        };

        window.addEventListener('scroll', highlightNav, { passive: true });
    }
});
