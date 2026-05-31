/* 
   Sri Interiors - Luxury Interior Design Website
   Main JavaScript - Pure Vanilla JS (No GSAP)
*/

document.addEventListener("DOMContentLoaded", () => {

    // 1. Preloader Animation (CSS-driven with JS class toggles)
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        if (!preloader) return;

        // Phase 1: Logo fades in (CSS animation handles this)
        // Phase 2: Bar fills (CSS animation handles this)
        // Phase 3: After animations complete, slide preloader out
        setTimeout(() => {
            preloader.classList.add('preloader-done');
        }, 2200);

        // Phase 4: Remove from DOM after slide-out completes
        setTimeout(() => {
            preloader.style.display = 'none';
            // Trigger entrance animations on main content
            document.body.classList.add('page-loaded');
        }, 3000);
    });

    // 2. Custom Cursor Glow (fine-pointer only)
    const cursorGlow = document.querySelector('.cursor-glow');
    if (cursorGlow && window.matchMedia("(pointer: fine)").matches) {
        cursorGlow.style.display = 'block';

        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        });

        // Add hovered classes for links/buttons
        const interactiveElements = document.querySelectorAll('a, button, .portfolio-item, .interactive-el, input, textarea, select, .filter-btn');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursorGlow.classList.add('hovered'));
            el.addEventListener('mouseleave', () => cursorGlow.classList.remove('hovered'));
        });
    }

    // 3. Scroll Progress Bar
    const progressBar = document.querySelector('.scroll-progress-bar');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            progressBar.style.width = scrollPercent + '%';
        });
    }

    // 4. Sticky Glassmorphism Navbar
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        });
    }

    // 5. Magnetic CTA Buttons (vanilla JS transform)
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });

    // 6. Hero Background Image Scroll Parallax (vanilla)
    const heroBg = document.querySelector('.hero-bg');
    const heroSec = document.querySelector('.hero-sec');
    if (heroBg && heroSec) {
        window.addEventListener('scroll', () => {
            const rect = heroSec.getBoundingClientRect();
            if (rect.bottom > 0) {
                const scrolled = window.scrollY;
                heroBg.style.transform = `scale(1.1) translateY(${scrolled * 0.15}px)`;
            }
        });
    }

    // 7. IntersectionObserver for Scroll Reveal (.reveal-up)
    const reveals = document.querySelectorAll('.reveal-up');
    if (reveals.length) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        reveals.forEach(el => revealObserver.observe(el));
    }

    // 8. IntersectionObserver for Zoom Reveal Images
    const zoomRevealImgs = document.querySelectorAll('.zoom-reveal-img');
    if (zoomRevealImgs.length) {
        const zoomObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('zoom-revealed');
                    zoomObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        zoomRevealImgs.forEach(img => zoomObserver.observe(img));
    }

    // 9. Statistics Counter Animation (vanilla requestAnimationFrame)
    const statsSection = document.querySelector('.statistics-sec');
    if (statsSection) {
        let counterStarted = false;
        const counters = document.querySelectorAll('.counter-number[data-target]');

        const animateCounter = (counter) => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const startTime = performance.now();

            const updateCounter = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease-out quad
                const eased = 1 - (1 - progress) * (1 - progress);
                counter.textContent = Math.floor(eased * target);

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            requestAnimationFrame(updateCounter);
        };

        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !counterStarted) {
                    counterStarted = true;
                    counters.forEach(counter => animateCounter(counter));
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        statsObserver.observe(statsSection);
    }

    // 10. Process Timeline Vertical Line Drawing & Step Activation
    const timelineContainer = document.querySelector('.timeline-container');
    if (timelineContainer) {
        const timelineProgress = document.querySelector('.timeline-progress');
        const steps = document.querySelectorAll('.timeline-step');

        window.addEventListener('scroll', () => {
            const rect = timelineContainer.getBoundingClientRect();
            const containerTop = rect.top;
            const containerHeight = rect.height;
            const windowHeight = window.innerHeight;

            // Calculate progress based on scroll position
            const startOffset = windowHeight * 0.3;
            const endOffset = windowHeight * 0.7;
            const scrollProgress = (startOffset - containerTop) / (containerHeight - (windowHeight - startOffset - (windowHeight - endOffset)));
            const clampedProgress = Math.max(0, Math.min(1, scrollProgress));

            if (timelineProgress) {
                timelineProgress.style.height = (clampedProgress * 100) + '%';
            }

            // Activate steps
            steps.forEach(step => {
                const stepRect = step.getBoundingClientRect();
                if (stepRect.top < windowHeight * 0.55) {
                    step.classList.add('active');
                } else {
                    step.classList.remove('active');
                }
            });
        });
    }

    // 11. Before/After Interactive Slider
    const baContainer = document.querySelector('.before-after-container');
    if (baContainer) {
        const afterImg = baContainer.querySelector('.ba-after');
        const handle = baContainer.querySelector('.ba-handle');

        const dragSlider = (clientX) => {
            const rect = baContainer.getBoundingClientRect();
            let x = clientX - rect.left;
            if (x < 0) x = 0;
            if (x > rect.width) x = rect.width;
            const percentage = (x / rect.width) * 100;
            afterImg.style.width = `${percentage}%`;
            handle.style.left = `${percentage}%`;
        };

        baContainer.addEventListener('mousemove', (e) => dragSlider(e.clientX));
        baContainer.addEventListener('touchmove', (e) => {
            if (e.touches && e.touches[0]) {
                dragSlider(e.touches[0].clientX);
            }
        });
    }

    // 12. Portfolio / Gallery Grid Filter (CSS transitions)
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    if (filterBtns.length && portfolioItems.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterCategory = btn.getAttribute('data-filter');

                portfolioItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    if (filterCategory === 'all' || itemCategory === filterCategory) {
                        item.classList.remove('hidden');
                        item.classList.add('visible');
                    } else {
                        item.classList.remove('visible');
                        item.classList.add('hidden');
                    }
                });
            });
        });
    }

    // 13. Image Gallery Lightbox Modal (CSS transitions)
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxTriggers = document.querySelectorAll('.portfolio-view-btn');

    if (lightbox && lightboxImg && lightboxClose) {
        lightboxTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const item = trigger.closest('.portfolio-item');
                const img = item.querySelector('.portfolio-img');
                const title = item.querySelector('.portfolio-title').textContent;

                lightboxImg.src = img.src;
                lightboxCaption.textContent = title;
                lightbox.style.display = 'flex';
                // Trigger reflow then add active class for CSS transition
                lightbox.offsetHeight;
                lightbox.classList.add('active');
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            setTimeout(() => {
                lightbox.style.display = 'none';
            }, 400);
        };

        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // 14. Swiper Testimonials slider
    const swiperEl = document.querySelector('.testimonials-slider');
    if (swiperEl && typeof Swiper !== 'undefined') {
        new Swiper('.testimonials-slider', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 4500,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                },
                1200: {
                    slidesPerView: 3,
                }
            }
        });
    }

    // 15. Form Interaction Label Adjustments and Submission
    const inputs = document.querySelectorAll('.contact-input');
    inputs.forEach(input => {
        if (input.value !== "") {
            input.classList.add('valid');
        }
        input.addEventListener('blur', () => {
            if (input.value !== "") {
                input.classList.add('valid');
            } else {
                input.classList.remove('valid');
            }
        });
    });

    const contactForm = document.getElementById('luxuryContactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'SENDING...';
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.innerHTML = 'MESSAGE SENT SUCCESSFULLY';
                submitBtn.style.backgroundColor = '#D4AF37';
                submitBtn.style.color = '#07152D';

                contactForm.reset();
                inputs.forEach(input => input.classList.remove('valid'));

                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.style.color = '';
                    submitBtn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }

    // 16. Back to Top Smooth Scroll
    const bttBtn = document.querySelector('.back-to-top');
    if (bttBtn) {
        bttBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
