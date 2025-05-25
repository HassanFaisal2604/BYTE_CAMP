// ==================================
// MAIN INITIALIZATION
// ==================================

document.addEventListener('DOMContentLoaded', function() {
    // Performance optimization - defer non-critical scripts
    const deferScripts = () => {
        const scripts = [
            'gsap.min.js',
            'ScrollTrigger.min.js',
            'script.js'
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

    // Show spinner immediately on DOMContentLoaded (for slow connections)
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

        // Ensure date visibility is properly set based on new header state
        ensureHeaderDateVisibility();
    }

    // Add window resize handler to manage collapsed state on width change
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            header.classList.remove('collapsed');
        } else if (window.scrollY > 50) {
            header.classList.add('collapsed');
        }

        // Make sure header date is visible on mobile
        ensureHeaderDateVisibility();
    });

    // Function to ensure the header date is visible on mobile
    function ensureHeaderDateVisibility() {
        const headerEventDate = document.querySelector('.header-event-date');
        if (!headerEventDate) return;

        if (window.innerWidth <= 768) {
            headerEventDate.style.display = 'block';
            headerEventDate.style.opacity = '1';

            // If header is collapsed, adjust the date position if needed
            if (header.classList.contains('collapsed')) {
                headerEventDate.style.top = '50%';
            }
        } else {
            headerEventDate.style.display = 'none';
        }
    }
    
    // Run this on page load
    ensureHeaderDateVisibility();

    // Add click handler for the date links in header (both mobile and desktop)
    function setupDateLinkClick() {
        // Target both the mobile and desktop date elements
        const dateElements = document.querySelectorAll('.header-event-date, .event-date');

        dateElements.forEach(element => {
            element.style.cursor = 'pointer'; // Make it look clickable

            element.addEventListener('click', function(e) {
                e.preventDefault();

                // Get the target from href, or default to #event-details
                const targetId = this.getAttribute('href') || '#event-details';
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    // Close mobile menu if open
                    if (mainNav && mainNav.classList.contains('active')) {
                        toggleMobileMenu();
                    }

                    // Get header height for offset
                    const headerOffset = header.offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = targetPosition - headerOffset - 20; // Added extra 20px padding

                    // Smooth scroll to the target
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Visual feedback
                    targetElement.classList.add('highlight-section');
                    setTimeout(() => {
                        targetElement.classList.remove('highlight-section');
                    }, 1500);
                }
            });
        });
    }
    
    // Set up the date link click handler
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

    // Open registration modal for any register button
    function openRegisterModal(e) {
        if (e) e.preventDefault();
        registerModal.style.display = 'block';
        document.body.classList.add('no-scroll');

        // Focus on first input for accessibility
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

        // Get form data
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const organization = document.getElementById('organization').value;

        // Here you would typically send this data to your server
        console.log('Registration submitted:', { name, email, organization });

        // Show success message
        alert(`Thank you for registering, ${name}! We'll send confirmation to ${email}.`);

        // Close modal
        closeRegisterModalFunc();

        // Reset form
        registrationForm.reset();
    }

    // Open speaker modal
    function openSpeakerModal(e) {
        const speakerCard = e.currentTarget.closest('.speaker-card');
        const speakerName = speakerCard.querySelector('h3').textContent;
        const speakerRole = speakerCard.querySelector('.speaker-role').textContent;
        const speakerBio = speakerCard.querySelector('.speaker-bio').textContent;
        const speakerImg = speakerCard.querySelector('img').src;

        // Populate modal content
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

        // Show modal
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

                // Close mobile menu if open
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
        // Smooth scroll animations
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

        // Card animations with stagger
        gsap.utils.toArray('.speaker-card, .organizer-card').forEach((card) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 30,
                duration: 0.6,
                stagger: 0.1
            });
        });

        // Parallax effect on scroll
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

    // Announcement Overlay functionality
    if (announcementOverlay) {
        // Make sure announcement is initially hidden correctly
        announcementOverlay.style.opacity = '0';
        announcementOverlay.style.visibility = 'hidden';

        // Use window.onload to ensure the announcement displays after everything is ready
        window.addEventListener('load', function() {
            setTimeout(function() {
                // Check if user has already seen this announcement
                if (!localStorage.getItem('announcementSeen') && !announcementOverlay.getAttribute('data-inline-click-listener-attached')) {
                    announcementOverlay.style.opacity = '1';
                    announcementOverlay.style.visibility = 'visible';
                    document.body.style.overflow = 'hidden'; // Prevent scrolling

                    function closeInlineAnnouncement() {
                        announcementOverlay.style.opacity = '0';
                        setTimeout(function() {
                            announcementOverlay.style.visibility = 'hidden';
                            document.body.style.overflow = ''; // Restore scrolling
                        }, 300); // Match the transition duration
                    }

                    if (closeAnnouncementBtn) {
                        closeAnnouncementBtn.addEventListener('click', closeInlineAnnouncement);
                    }

                    announcementOverlay.addEventListener('click', function(e) {
                        if (e.target === announcementOverlay) {
                            closeInlineAnnouncement();
                        }
                    });

                    document.addEventListener('keydown', function(e) {
                        if (e.key === 'Escape') {
                            // Check if the overlay is still visible before trying to close
                            if (announcementOverlay.style.visibility === 'visible') {
                                closeInlineAnnouncement();
                            }
                        }
                    });
                }
            }, 1000); // 1 second delay
        });
    }

    // Event Listeners
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (!scrollTimeout) {
            scrollTimeout = requestAnimationFrame(() => {
                handleHeaderScroll();
                toggleScrollTopBtn();
                if (window.innerWidth > 768) updateParallaxPositions();
                scrollTimeout = null;
            });
        }
    }, { passive: true });

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', scrollToTop);
    }

    // Add event listeners to all register buttons
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

    // Add these new function calls
    createSubtleTexture();
    addTechMotifs();
    addButtonHoverEffects();
    animateWhatIsByteCamp();
    addOrganizerHoverEffects();
    enhanceGallery();
    addSocialIconHoverEffects();
    setupMobileMenu();
    setupScrollToTop();
    setupParallaxEffect();
    setupDateLinkClick();

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

    // Setup gallery lightbox
    setupGalleryLightbox();
    
    // Setup keyboard focus styles
    setupKeyboardFocusStyles();

    // AOS library initialization
    if (window.AOS) {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }

}); // End of main DOMContentLoaded

// ==================================
// COUNTDOWN TIMER FUNCTIONALITY
// ==================================

function initializeCountdownTimer() {
    // Set the target date - May 29, 2025
    const targetDate = new Date('2025-05-29T10:00:00').getTime();

    // Get countdown elements
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');

    if (!daysElement || !hoursElement || !minutesElement || !secondsElement) {
        console.log('Countdown elements not found');
        return; // Exit if elements don't exist
    }

    function updateCountdown() {
        const now = new Date().getTime();
        const timeLeft = targetDate - now;

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
            
            // Optional: Show "Event Started" message
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
            
            // Remove animation class after animation completes
            setTimeout(() => {
                element.classList.remove('updated');
            }, 500);
        }
    }

    // Update countdown immediately
    updateCountdown();

    // Update countdown every second
    const countdownInterval = setInterval(updateCountdown, 1000);

    // Store interval ID for potential cleanup
    window.countdownInterval = countdownInterval;
}

// ==================================
// UTILITY FUNCTIONS
// ==================================

// Create background particles
function createBackgroundParticles() {
    // Don't create particles on mobile devices
    if (window.innerWidth <= 768) return;
    
    const particlesContainer = document.querySelector('.bg-particles');
    if (!particlesContainer) return;

    // Only create particles on desktop
    const particleCount = 50;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Use CSS custom properties for better performance
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
        // Fallback: load all images
        galleryImgs.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
        });
    }
}

function createSubtleTexture() {
    if (document.querySelector('.bg-texture')) return;
    const texture = document.createElement('div');
    texture.className = 'bg-texture';
    Object.assign(texture.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: '-2',
        background: 'url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.02\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M5 0h1L0 6V5zM6 5v1H5z\'/%3E%3C/g%3E%3C/svg%3E")'
    });
    document.body.appendChild(texture);
}

function addTechMotifs() {
    if (document.querySelector('.tech-motifs')) return;
    const container = document.createElement('div');
    container.className = 'tech-motifs';
    Object.assign(container.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: '-1',
        opacity: '0.06'
    });

    const motifsCount = 25;
    const colors = ['#9bfd21', '#4361ee', '#ffffff'];

    for (let i = 0; i < motifsCount; i++) {
        const motif = document.createElement('div');
        const size = Math.random() * 20 + 10;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        Object.assign(motif.style, {
            position: 'absolute',
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: color,
            borderRadius: '50%',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${Math.random() * 20 + 10}s infinite linear`
        });

        container.appendChild(motif);
    }
    document.body.appendChild(container);
}

function addButtonHoverEffects() {
    document.addEventListener('mouseover', function(e) {
        if (e.target.matches('.btn, .register-btn, .speaker-more-btn')) {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 4px 15px rgba(155, 253, 33, 0.3)';
        }
    });

    document.addEventListener('mouseout', function(e) {
        if (e.target.matches('.btn, .register-btn, .speaker-more-btn')) {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '';
        }
    });
}

function animateWhatIsByteCamp() {
    const listContainer = document.querySelector('.what-is-byte-camp .bytecamp-info ul');
    if (!listContainer) return;

    const infoItems = listContainer.querySelectorAll('li');
    if (infoItems.length === 0) return;

    const icons = ['fa-laptop-code', 'fa-cogs', 'fa-chalkboard-teacher', 'fa-users'];

    infoItems.forEach((item, index) => {
        if (!item.hasAttribute('data-aos')) {
            item.setAttribute('data-aos', 'fade-up');
            item.setAttribute('data-aos-delay', (index * 100).toString());

            const iconClass = icons[index % icons.length];
            const icon = document.createElement('i');
            icon.className = `fas ${iconClass}`;
            item.insertBefore(icon, item.firstChild);
        }
    });
}

function addOrganizerHoverEffects() {
    const organizerImages = document.querySelectorAll('.organizer-card .organizer-image img');
    organizerImages.forEach(img => {
        img.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.filter = 'brightness(1.1)';
        });
        img.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.filter = 'brightness(1)';
        });
    });
}

function enhanceGallery() {
    const galleryContainer = document.querySelector('.gallery-container');
    if (!galleryContainer) return;
    
    const galleryItems = galleryContainer.querySelectorAll('.gallery-item');
    galleryItems.forEach((item) => {
        const caption = item.querySelector('.gallery-caption');
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            if (caption) caption.style.opacity = '1';
        });
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            if (caption) caption.style.opacity = '0.8';
        });
    });
}

function addSocialIconHoverEffects() {
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
        const iTag = icon.querySelector('i');
        icon.addEventListener('mouseenter', () => {
            if (iTag) {
                iTag.style.transform = 'scale(1.2) rotate(5deg)';
                iTag.style.color = '#9bfd21';
            }
        });
        icon.addEventListener('mouseleave', () => {
            if (iTag) {
                iTag.style.transform = 'scale(1) rotate(0deg)';
                iTag.style.color = '';
            }
        });
    });
}

function setupMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const body = document.body;
    let overlay = document.querySelector('.menu-overlay');

    if (!overlay && mobileMenuToggle && mainNav) {
        overlay = document.createElement('div');
        overlay.className = 'menu-overlay';
        Object.assign(overlay.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: '8',
            opacity: '0',
            visibility: 'hidden',
            transition: 'opacity 0.3s ease, visibility 0.3s ease'
        });
        body.appendChild(overlay);
    } else if (!mobileMenuToggle || !mainNav) {
        return;
    }

    function toggleMenu(open) {
        const isActive = mainNav.classList.contains('active');
        if (open === isActive) return;

        mobileMenuToggle.classList.toggle('active', open);
        mainNav.classList.toggle('active', open);
        body.classList.toggle('no-scroll', open);

        if (open) {
            overlay.style.opacity = '1';
            overlay.style.visibility = 'visible';
        } else {
            overlay.style.opacity = '0';
            overlay.style.visibility = 'hidden';
        }
    }

    mobileMenuToggle.addEventListener('click', () => toggleMenu(!mainNav.classList.contains('active')));
    if (overlay) {
        overlay.addEventListener('click', () => toggleMenu(false));
    }

    const navLinks = mainNav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            setTimeout(() => toggleMenu(false), 100);
        });
        link.addEventListener('mouseenter', function() {
            this.style.color = '#9bfd21';
        });
        link.addEventListener('mouseleave', function() {
            this.style.color = '';
        });
    });

    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && mainNav.classList.contains('active')) {
            toggleMenu(false);
        }
    });
}

function setupScrollToTop() {
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (!scrollTopBtn) return;

    window.addEventListener('scroll', function() {
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            scrollTopBtn.style.display = 'block';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    });

    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function setupParallaxEffect() {
    const parallaxElements = [
        { element: '.bg-particles', speed: 0.05 },
    ];

    function updateParallaxPositions() {
        const scrollPosition = window.pageYOffset;
        parallaxElements.forEach(item => {
            document.querySelectorAll(item.element).forEach(element => {
                const yPos = -(scrollPosition * item.speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }

    window.updateParallaxPositions = updateParallaxPositions;
    
    // Initial parallax position
    if (window.innerWidth > 768) updateParallaxPositions();
}

function setupGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (!galleryItems.length) return;

    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: none;
        z-index: 1000;
        justify-content: center;
        align-items: center;
    `;
    document.body.appendChild(lightbox);

    const lightboxContent = document.createElement('div');
    lightboxContent.className = 'lightbox-content';
    lightbox.appendChild(lightboxContent);

    const lightboxImage = document.createElement('img');
    lightboxImage.className = 'lightbox-image';
    lightboxImage.style.maxWidth = '90%';
    lightboxImage.style.maxHeight = '90%';
    lightboxContent.appendChild(lightboxImage);

    const closeButton = document.createElement('button');
    closeButton.className = 'lightbox-close';
    closeButton.innerHTML = '×';
    closeButton.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        background: none;
        border: none;
        color: white;
        font-size: 30px;
        cursor: pointer;
    `;
    lightbox.appendChild(closeButton);

    let currentIndex = 0;

    function openLightbox(index) {
        const item = galleryItems[index];
        const img = item.querySelector('img');
        
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
        
        currentIndex = index;
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
    }

    // Event Listeners
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    closeButton.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'flex' && e.key === 'Escape') {
            closeLightbox();
        }
    });
}

function setupKeyboardFocusStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .focus-visible-only { outline: none; }
        .focus-visible-only:focus-visible { outline: 2px solid #9bfd21; }
    `;
    document.head.appendChild(style);

    document.querySelectorAll('a, button, [tabindex]').forEach(el => {
        el.classList.add('focus-visible-only');
    });
}

// ==================================
// STANDALONE EVENT LISTENERS
// ==================================

// Show loading spinner on page load and hide when ready
window.addEventListener('load', function() {
    var spinner = document.getElementById('loading-spinner');
    if (spinner) {
        spinner.classList.remove('active');
        spinner.style.display = 'none';
    }
});

// Add CSS animation for particles
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes float {
        0%, 100% {
            transform: translateY(0) translateX(0);
        }
        25% {
            transform: translateY(-20px) translateX(10px);
        }
        50% {
            transform: translateY(0) translateX(20px);
        }
        75% {
            transform: translateY(20px) translateX(10px);
        }
    }
    .countdown-number.updated {
        animation: numberPulse 0.5s ease-in-out;
    }
    @keyframes numberPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); color: #9bfd21; }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(styleSheet);
