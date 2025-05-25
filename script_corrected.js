document.addEventListener('DOMContentLoaded', function() {
    // Performance optimization - defer non-critical scripts
    const deferScripts = () => {
        const scripts = [
            'gsap.min.js',
            'ScrollTrigger.min.js'
        ];
        
        scripts.forEach(script => {
            const el = document.createElement('script');
            el.src = script;
            el.defer = true;
            document.head.appendChild(el);
        });
    };
    deferScripts();

    // Initialize GSAP ScrollTrigger with performance optimizations
    if (typeof gsap !== 'undefined' && gsap.registerPlugin) {
        gsap.registerPlugin(ScrollTrigger);
        ScrollTrigger.config({
            autoRefreshEvents: 'resize, orientationchange, visibilitychange',
            ignoreMobileResize: true
        });
    }

    // DOM Elements
    const header = document.getElementById('site-header');
    const mainNav = document.getElementById('main-nav');
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    const registerBtns = document.querySelectorAll('.register-btn');
    const registerModal = document.getElementById('register-modal');
    const closeRegisterModal = document.getElementById('close-register-modal');
    const registrationForm = document.getElementById('registration-form');
    const speakerModal = document.getElementById('speaker-modal');
    const closeModal = document.getElementById('close-modal');
    const modalBody = document.getElementById('modal-body');
    const speakerMoreBtns = document.querySelectorAll('.speaker-more');

    // Announcement Overlay Elements
    const announcementOverlay = document.getElementById('announcement-overlay');
    const closeAnnouncementBtn = document.getElementById('announcement-close');

    // Announcement Overlay functionality
    if (announcementOverlay) {
        announcementOverlay.style.opacity = '0';
        announcementOverlay.style.visibility = 'hidden';

        window.addEventListener('load', function() {
            setTimeout(function() {
                announcementOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }, 800);
        });

        if (closeAnnouncementBtn) {
            closeAnnouncementBtn.addEventListener('click', function() {
                announcementOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        announcementOverlay.addEventListener('click', function(e) {
            if (e.target === announcementOverlay) {
                announcementOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && announcementOverlay.classList.contains('active')) {
                announcementOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Show spinner immediately on DOMContentLoaded
    var spinner = document.getElementById('loading-spinner');
    if (spinner) {
        spinner.classList.add('active');
        spinner.style.display = 'flex';
    }

    // Header scroll effect
    function handleHeaderScroll() {
        const currentScroll = window.scrollY || document.documentElement.scrollTop;
        const scrollThreshold = 50;

        if (currentScroll > scrollThreshold) {
            header.classList.add('scrolled');
            if (window.innerWidth <= 768) {
                header.classList.add('collapsed');
            }
        } else {
            header.classList.remove('scrolled');
            header.classList.remove('collapsed');
        }

        ensureHeaderDateVisibility();
    }

    // Window resize handler
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            header.classList.remove('collapsed');
        } else if (window.scrollY > 50) {
            header.classList.add('collapsed');
        }
        ensureHeaderDateVisibility();
    });

    // Function to ensure the header date is visible on mobile
    function ensureHeaderDateVisibility() {
        const headerEventDate = document.querySelector('.header-event-date');
        if (!headerEventDate) return;

        if (window.innerWidth <= 768) {
            headerEventDate.style.display = 'block';
            headerEventDate.style.opacity = '1';
            if (header.classList.contains('collapsed')) {
                headerEventDate.style.top = '50%';
            }
        } else {
            headerEventDate.style.display = 'none';
        }
    }
    
    ensureHeaderDateVisibility();

    // Add click handler for the date links in header
    function setupDateLinkClick() {
        const dateElements = document.querySelectorAll('.header-event-date, .event-date');

        dateElements.forEach(element => {
            element.style.cursor = 'pointer';
            element.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href') || '#event-details';
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    if (mainNav && mainNav.classList.contains('active')) {
                        toggleMobileMenu();
                    }

                    const headerOffset = header.offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = targetPosition - headerOffset - 20;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    targetElement.classList.add('highlight-section');
                    setTimeout(() => {
                        targetElement.classList.remove('highlight-section');
                    }, 1500);
                }
            });
        });
    }
    
    setupDateLinkClick();

    // Scroll to top functionality
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Show/hide scroll to top button
    function toggleScrollTopBtn() {
        if (window.scrollY > 300) {
            scrollTopBtn.style.display = 'block';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    }

    // Open registration modal
    function openRegisterModal(e) {
        if (e) e.preventDefault();
        registerModal.style.display = 'block';
        document.body.classList.add('no-scroll');

        setTimeout(() => {
            const firstInput = registerModal.querySelector('input');
            if (firstInput) firstInput.focus();
        }, 100);
    }

    // Close registration modal
    function closeRegisterModalFunc() {
        registerModal.style.display = 'none';
        document.body.classList.remove('no-scroll');
    }

    // Handle registration form submission
    function handleRegistrationSubmit(e) {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const organization = document.getElementById('organization').value;

        console.log('Registration submitted:', { name, email, organization });
        alert(`Thank you for registering, ${name}! We'll send confirmation to ${email}.`);

        closeRegisterModalFunc();
        registrationForm.reset();
    }

    // Open speaker modal
    function openSpeakerModal(e) {
        const speakerCard = e.currentTarget.closest('.speaker-card');
        const speakerName = speakerCard.querySelector('h3').textContent;
        const speakerRole = speakerCard.querySelector('.speaker-role').textContent;
        const speakerBio = speakerCard.querySelector('.speaker-bio').textContent;
        const speakerImg = speakerCard.querySelector('img').src;

        modalBody.innerHTML = `
            <div class="speaker-modal-content">
                <div class="speaker-modal-image">
                    <img src="${speakerImg}" alt="${speakerName}">
                </div>
                <h2>${speakerName}</h2>
                <p class="speaker-modal-role">${speakerRole}</p>
                <div class="speaker-modal-bio">
                    <p>${speakerBio}</p>
                    <p>Additional information about ${speakerName}'s expertise and achievements in the tech industry.</p>
                </div>
                <div class="speaker-modal-social">
                    <a href="#" aria-label="${speakerName}'s LinkedIn"><i class="fab fa-linkedin-in"></i></a>
                    <a href="#" aria-label="${speakerName}'s Twitter"><i class="fab fa-twitter"></i></a>
                </div>
            </div>
        `;

        speakerModal.style.display = 'block';
        document.body.classList.add('no-scroll');
    }

    // Close speaker modal
    function closeSpeakerModal() {
        speakerModal.style.display = 'none';
        document.body.classList.remove('no-scroll');
    }

    // Close modal when clicking outside
    function closeModalOnOutsideClick(e) {
        if (e.target === registerModal) {
            closeRegisterModalFunc();
        } else if (e.target === speakerModal) {
            closeSpeakerModal();
        }
    }

    // Smooth scroll for navigation links
    function setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();

                if (mainNav.classList.contains('active')) {
                    toggleMobileMenu();
                }

                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerOffset = header.offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = targetPosition - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Update copyright year
    function updateCopyrightYear() {
        const copyrightEl = document.getElementById('footer-copyright');
        if (copyrightEl) {
            const currentYear = new Date().getFullYear();
            copyrightEl.innerHTML = `&copy; ${currentYear} BYTE CAMP. All rights reserved.`;
        }
    }

    // Setup animations with performance optimizations
    function setupAnimations() {
        if (typeof gsap === 'undefined') return;

        gsap.to('.section-title', {
            scrollTrigger: {
                trigger: '.section',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
        });

        gsap.utils.toArray('.speaker-card, .organizer-card').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 30,
                duration: 0.6,
                delay: i * 0.1
            });
        });

        gsap.to('.bg-particles', {
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: 'bottom bottom',
                scrub: true
            },
            y: '100%',
            ease: 'none'
        });
    }

    // Countdown Timer Functionality
    function initializeCountdownTimer() {
        console.log('Initializing countdown timer...');
        
        // Set the target date - May 29, 2025 at 10:00 AM
        const targetDate = new Date('2025-05-29T10:00:00').getTime();
        console.log('Target date:', new Date(targetDate));

        // Get countdown elements
        const daysElement = document.getElementById('days');
        const hoursElement = document.getElementById('hours');
        const minutesElement = document.getElementById('minutes');
        const secondsElement = document.getElementById('seconds');

        console.log('Countdown elements:', {
            days: daysElement,
            hours: hoursElement,
            minutes: minutesElement,
            seconds: secondsElement
        });

        if (!daysElement || !hoursElement || !minutesElement || !secondsElement) {
            console.error('Countdown elements not found!');
            return;
        }

        function updateCountdown() {
            const now = new Date().getTime();
            const timeLeft = targetDate - now;

            console.log('Time left:', timeLeft);

            if (timeLeft > 0) {
                // Calculate time units
                const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
                const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

                // Update the display with animation
                updateNumberWithAnimation(daysElement, days.toString().padStart(2, '0'));
                updateNumberWithAnimation(hoursElement, hours.toString().padStart(2, '0'));
                updateNumberWithAnimation(minutesElement, minutes.toString().padStart(2, '0'));
                updateNumberWithAnimation(secondsElement, seconds.toString().padStart(2, '0'));
            } else {
                // Event has started or passed
                daysElement.textContent = '00';
                hoursElement.textContent = '00';
                minutesElement.textContent = '00';
                secondsElement.textContent = '00';
                
                const countdownHeader = document.querySelector('.countdown-header h3');
                if (countdownHeader) {
                    countdownHeader.textContent = 'Event Has Started!';
                }
            }
        }

        function updateNumberWithAnimation(element, newValue) {
            if (element.textContent !== newValue) {
                element.classList.add('updated');
                element.textContent = newValue;
                
                setTimeout(() => {
                    element.classList.remove('updated');
                }, 500);
            }
        }

        // Update countdown immediately
        updateCountdown();

        // Update countdown every second
        const countdownInterval = setInterval(updateCountdown, 1000);
        window.countdownInterval = countdownInterval;
    }

    // Create background particles
    function createBackgroundParticles() {
        if (window.innerWidth <= 768) return;
        
        const particlesContainer = document.querySelector('.bg-particles');
        if (!particlesContainer) return;

        const particleCount = 50;
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            particle.style.cssText = `
                --x: ${Math.random() * 100}%;
                --y: ${Math.random() * 100}%;
                --size: ${Math.random() * 3 + 1}px;
                --opacity: ${Math.random() * 0.5 + 0.1};
                --duration: ${Math.random() * 20 + 10}s;
                --delay: ${Math.random() * 5}s;
            `;

            fragment.appendChild(particle);
        }

        particlesContainer.appendChild(fragment);
    }

    // Progressive/lazy loading for gallery images
    function progressiveGalleryImages() {
        const galleryImgs = document.querySelectorAll('.gallery-grid img[data-src]');
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        obs.unobserve(img);
                    }
                });
            }, { rootMargin: '200px' });
            galleryImgs.forEach(img => observer.observe(img));
        } else {
            galleryImgs.forEach(img => {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
            });
        }
    }

    // Event Listeners
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (!scrollTimeout) {
            scrollTimeout = requestAnimationFrame(() => {
                handleHeaderScroll();
                toggleScrollTopBtn();
                scrollTimeout = null;
            });
        }
    }, { passive: true });

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', scrollToTop);
    }

    if (registerBtns.length > 0) {
        registerBtns.forEach(btn => {
            btn.addEventListener('click', openRegisterModal);
        });
    }

    if (closeRegisterModal) {
        closeRegisterModal.addEventListener('click', closeRegisterModalFunc);
    }

    if (registrationForm) {
        registrationForm.addEventListener('submit', handleRegistrationSubmit);
    }

    if (closeModal) {
        closeModal.addEventListener('click', closeSpeakerModal);
    }

    speakerMoreBtns.forEach(btn => {
        btn.addEventListener('click', openSpeakerModal);
    });

    window.addEventListener('click', closeModalOnOutsideClick);

    // Initialize functions
    handleHeaderScroll();
    toggleScrollTopBtn();
    setupSmoothScroll();
    updateCopyrightYear();
    setupAnimations();
    createBackgroundParticles();

    // Initialize countdown timer
    initializeCountdownTimer();

    // Progressive gallery image loading
    progressiveGalleryImages();

    // Add keyboard navigation for modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (registerModal.style.display === 'block') {
                closeRegisterModalFunc();
            }
            if (speakerModal.style.display === 'block') {
                closeSpeakerModal();
            }
        }
    });

}); // End of main DOMContentLoaded

// Show loading spinner on page load and hide when ready
window.addEventListener('load', function() {
    var spinner = document.getElementById('loading-spinner');
    if (spinner) {
        spinner.classList.remove('active');
        spinner.style.display = 'none';
    }
});

// AOS library initialization
if (window.AOS) {
    AOS.init();
}
