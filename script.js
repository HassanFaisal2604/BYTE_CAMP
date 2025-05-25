document.addEventListener('DOMContentLoaded', function() {
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
    }    // DOM Elements
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
        // Make sure announcement is initially hidden correctly
        announcementOverlay.style.opacity = '0';
        announcementOverlay.style.visibility = 'hidden';

        // Use window.onload to ensure the announcement displays after everything is ready
        window.addEventListener('load', function() {
            // Show the announcement after a brief delay
            setTimeout(function() {
                announcementOverlay.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            }, 800);
        });

        // Close announcement when the close button is clicked
        if (closeAnnouncementBtn) {
            closeAnnouncementBtn.addEventListener('click', function() {
                announcementOverlay.classList.remove('active');
                document.body.style.overflow = ''; // Restore scrolling
            });
        }

        // Also close when clicking outside the image (on the dark overlay)
        announcementOverlay.addEventListener('click', function(e) {
            if (e.target === announcementOverlay) {
                announcementOverlay.classList.remove('active');
                document.body.style.overflow = ''; // Restore scrolling
            }
        });

        // Close on ESC key press
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && announcementOverlay.classList.contains('active')) {
                announcementOverlay.classList.remove('active');
                document.body.style.overflow = ''; // Restore scrolling
            }
        });
    }

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

            // Add collapse functionality for mobile
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

                if (targetElement) {                    // Close mobile menu if open
                    if (mainNav && mainNav.classList.contains('active')) {
                        // Use the mobile menu close functionality
                        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
                        if (mobileMenuToggle) {
                            mobileMenuToggle.click();
                        }
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
    }    // Set up the date link click handler
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
                e.preventDefault();                // Close mobile menu if open
                if (mainNav.classList.contains('active')) {
                    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
                    if (mobileMenuToggle) {
                        mobileMenuToggle.click();
                    }
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
        ease: 'none'    });
}

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
        }    }, { passive: true });

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', scrollToTop);
    }

    // Add event listeners to all register buttons
    if (registerBtns.length > 0) {
        registerBtns.forEach(btn => {
            // Skip adding the modal trigger for Luma checkout buttons
            /*
            if (btn.classList.contains('luma-checkout--button') ||
                btn.hasAttribute('data-luma-action') ||
                btn.hasAttribute('data-luma-event-id')) {
                // Don't add the modal event listener for Luma buttons
                // This allows the Luma checkout process to work directly
                return;
            }
            */
            // Only add event listener to non-Luma buttons
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
    setupScrollToTop();    setupParallaxEffect();    setupDateLinkClick();

    // Countdown Timer Functionality
    function initializeCountdownTimer() {
        // Set the target date - May 29, 2025
        const targetDate = new Date('2025-05-29T10:00:00').getTime();

        // Get countdown elements
        const daysElement = document.getElementById('days');
        const hoursElement = document.getElementById('hours');
        const minutesElement = document.getElementById('minutes');
        const secondsElement = document.getElementById('seconds');

        if (!daysElement || !hoursElement || !minutesElement || !secondsElement) {
            console.warn('Countdown elements not found:', {
                days: !!daysElement,
                hours: !!hoursElement,
                minutes: !!minutesElement,
                seconds: !!secondsElement
            });
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
        
        console.log('Countdown timer initialized successfully');
    }

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
    `;
    document.head.appendChild(styleSheet);

    setupKeyboardFocusStyles();

    // Initialize the enhancements when document is ready
    document.addEventListener('DOMContentLoaded', function() {
        // Add these to your existing DOMContentLoaded handler
        setupGalleryView();
        enhanceInteractiveElements();        setupSpeakerModals();
        improveScrollToTopButton();
        setupKeyboardFocusStyles();
    });
}); // End of main DOMContentLoaded

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

// AOS library initialization (from index.html)
        if (window.AOS) {
            AOS.init();
        }

        // Luma Checkout Button Styling (from index.html)
        /*
        function applyLumaStyles() {
            document.querySelectorAll('.luma-checkout--button').forEach(function(btn) {
                // Luma styling code
            });
        }

        // Initial style fix for Luma
        applyLumaStyles();
        // Reapply styles after a delay to ensure they persist for Luma
        setTimeout(applyLumaStyles, 1000);
        */

        // Announcement Overlay Logic (from index.html)
        // This version directly shows the overlay. Ensure this is the desired behavior
        // versus the window.onload logic earlier in script.js.
        var announcementOverlay = document.getElementById('announcement-overlay');
        var closeAnnouncementBtn = document.getElementById('announcement-close');

        if (announcementOverlay) {
            // Force the overlay to be visible
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


    // Gallery Lightbox
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    document.body.appendChild(lightbox);

    const lightboxContent = document.createElement('div');
    lightboxContent.className = 'lightbox-content';
    lightbox.appendChild(lightboxContent);

    const lightboxImage = document.createElement('img');
    lightboxImage.className = 'lightbox-image';
    lightboxContent.appendChild(lightboxImage);

    const lightboxCaption = document.createElement('div');
    lightboxCaption.className = 'lightbox-caption';
    lightboxContent.appendChild(lightboxCaption);

    const closeButton = document.createElement('button');
    closeButton.className = 'lightbox-close';
    closeButton.innerHTML = '×';
    closeButton.setAttribute('aria-label', 'Close lightbox');
    lightbox.appendChild(closeButton);

    const prevButton = document.createElement('button');
    prevButton.className = 'lightbox-nav lightbox-nav-prev';
    prevButton.innerHTML = '←';
    prevButton.setAttribute('aria-label', 'Previous image');
    lightbox.appendChild(prevButton);

    const nextButton = document.createElement('button');
    nextButton.className = 'lightbox-nav lightbox-nav-next';
    nextButton.innerHTML = '→';
    nextButton.setAttribute('aria-label', 'Next image');
    lightbox.appendChild(nextButton);



    function openLightbox(index) {
        const item = galleryItems[index];
        const img = item.querySelector('img');
        const caption = item.querySelector('.gallery-caption');

        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
        lightboxCaption.innerHTML = caption.innerHTML;

        currentIndex = index;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Update navigation buttons
        prevButton.style.display = index === 0 ? 'none' : 'flex';
        nextButton.style.display = index === galleryItems.length - 1 ? 'none' : 'flex';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function navigateGallery(direction) {
        const newIndex = currentIndex + direction;
        if (newIndex >= 0 && newIndex < galleryItems.length) {
            openLightbox(newIndex);
        }
    }

    // Event Listeners
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(index);
            }
        });
    });

    closeButton.addEventListener('click', closeLightbox);
    prevButton.addEventListener('click', () => navigateGallery(-1));
    nextButton.addEventListener('click', () => navigateGallery(1));

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                navigateGallery(-1);
                break;
            case 'ArrowRight':
                navigateGallery(1);
                break;
        }    });

// Show loading spinner on page load and hide when ready
window.addEventListener('load', function() {
    var spinner = document.getElementById('loading-spinner');
    if (spinner) {
        spinner.classList.remove('active');
        spinner.style.display = 'none';
    }
});

// Enhance scroll-to-top button animation
(function enhanceScrollTopBtn() {
    var btn = document.getElementById('scrollTopBtn');
    if (!btn) return;
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            btn.classList.add('show');
            btn.classList.remove('hide');
        } else {
            btn.classList.remove('show');
            btn.classList.add('hide');
        }
    });
})();

// ==================================
// FUNCTION DEFINITIONS
// ==================================

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
        const element = document.createElement('div');
        Object.assign(element.style, {
            position: 'absolute',
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
            opacity: 0.1 + Math.random() * 0.3
        });

        if (Math.random() > 0.3) {
            Object.assign(element.style, {
                width: (10 + Math.random() * 80) + 'px',
                height: '1px',
                background: colors[Math.floor(Math.random() * colors.length)],
                transform: `rotate(${Math.random() * 360}deg)`
            });
        } else {
            const size = (2 + Math.random() * 3) + 'px';
            Object.assign(element.style, {
                width: size,
                height: size,
                background: colors[Math.floor(Math.random() * colors.length)],
                borderRadius: '50%'
            });
        }
        container.appendChild(element);
    }
    document.body.appendChild(container);
}

function addButtonHoverEffects() {
    document.addEventListener('mouseover', function(e) {
        const button = e.target.closest('.btn');
        if (button && !button.classList.contains('hover-active')) {
            button.classList.add('hover-active');
            gsap.to(button, { scale: 1.05, boxShadow: "0 8px 15px rgba(0,0,0,0.3)", duration: 0.3 });
        }
    });

    document.addEventListener('mouseout', function(e) {
        const button = e.target.closest('.btn');
        if (button && button.classList.contains('hover-active')) {
            button.classList.remove('hover-active');
            gsap.to(button, { scale: 1, boxShadow: "none", duration: 0.3, overwrite: true });
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
        if (!item.querySelector('i.fas')) {
            const icon = document.createElement('i');
            icon.className = `fas ${icons[index % icons.length]} fa-fw`;
            icon.style.color = 'var(--secondary-color)';
            icon.style.marginRight = '10px';
            icon.style.opacity = '0.8';
            item.prepend(icon);
        }

        if (!item.hasAttribute('data-aos')) {
            gsap.from(item, {
                opacity: 0,
                x: -30,
                duration: 0.6,
                scrollTrigger: {
                    trigger: item,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                },
                delay: index * 0.1
            });
        }
    });
}

function addOrganizerHoverEffects() {
    const organizerImages = document.querySelectorAll('.organizer-card .organizer-image img');
    organizerImages.forEach(img => {
        img.addEventListener('mouseenter', function() {
            gsap.to(this, { scale: 1.1, boxShadow: "0 10px 20px rgba(0,0,0,0.3)", duration: 0.3 });
        });
        img.addEventListener('mouseleave', function() {
            gsap.to(this, { scale: 1, boxShadow: "none", duration: 0.3 });
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
            gsap.to(this, { scale: 1.03, boxShadow: '0 10px 25px rgba(0,0,0,0.4)', zIndex: 10, duration: 0.3 });
            if (caption) gsap.to(caption, { y: '0%', duration: 0.3 });
        });
        item.addEventListener('mouseleave', function() {
            gsap.to(this, { scale: 1, boxShadow: '0 5px 15px rgba(0,0,0,0.2)', zIndex: 1, duration: 0.3 });
            if (caption) gsap.to(caption, { y: '100%', duration: 0.3 });
        });
    });
}

function addSocialIconHoverEffects() {
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
        const iTag = icon.querySelector('i');
        icon.addEventListener('mouseenter', () => {
            gsap.to(icon, { y: -5, scale: 1.1, backgroundColor: 'var(--secondary-color)', duration: 0.3, ease: 'power1.out' });
            if (iTag) gsap.to(iTag, { color: '#000', duration: 0.3 });
        });
        icon.addEventListener('mouseleave', () => {
            gsap.to(icon, { y: 0, scale: 1, backgroundColor: 'rgba(255,255,255,0.05)', duration: 0.3, ease: 'power1.out' });
            if (iTag) gsap.to(iTag, { color: 'var(--secondary-color)', duration: 0.3 });
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
        console.warn("Mobile menu toggle or main nav element not found.");
        return;
    }

    function toggleMenu(open) {
        const isActive = mainNav.classList.contains('active');
        if (open === isActive) return;

        mobileMenuToggle.classList.toggle('active', open);
        mainNav.classList.toggle('active', open);
        body.classList.toggle('no-scroll', open);

        if (open) {
            overlay.style.visibility = 'visible';
            overlay.style.opacity = '1';
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
            if (window.innerWidth <= 768 && mainNav.classList.contains('active')) {
                toggleMenu(false);
            }
        });
        link.addEventListener('mouseenter', function() {
            gsap.to(this, { color: 'var(--secondary-color)', paddingLeft: '10px', duration: 0.2 });
        });
        link.addEventListener('mouseleave', function() {
            gsap.to(this, { color: '', paddingLeft: '0px', duration: 0.2 });
        });
    });

    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && mainNav.classList.contains('active')) {
            toggleMenu(false);
            mainNav.style.transform = '';
        }
    });
}

function setupScrollToTop() {
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (!scrollTopBtn) return;

    window.addEventListener('scroll', function() {
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            if (scrollTopBtn.style.display !== "block") {
                gsap.fromTo(scrollTopBtn, { opacity: 0, y: 20 }, { display: 'block', opacity: 1, y: 0, duration: 0.3 });
            }
        } else {
            if (scrollTopBtn.style.display === "block") {
                gsap.to(scrollTopBtn, { opacity: 0, y: 20, duration: 0.3, onComplete: () => scrollTopBtn.style.display = 'none' });
            }
        }
    });

    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function updateCopyrightYear() {
    const copyrightEl = document.getElementById('footer-copyright');
    if (copyrightEl) {
        const currentYear = new Date().getFullYear();
        copyrightEl.innerHTML = `&copy; ${currentYear} BYTE CAMP. All rights reserved.`;
    }
}

// Add parallax scrolling effect for a more dynamic feel
function setupParallaxEffect() {
    const parallaxElements = [
        { element: '.bg-particles', speed: 0.05 },
    ];

    function updateParallaxPositions() {
        const scrollPosition = window.pageYOffset;
        parallaxElements.forEach(item => {
            document.querySelectorAll(item.element).forEach(element => {
                element.style.transform = `translateY(${scrollPosition * item.speed}px)`;
            });
        });
    }

    // Initial parallax position
    if (window.innerWidth > 768) updateParallaxPositions();
}

// Gallery view functionality - REMOVED DUPLICATE IMPLEMENTATION

    // Enhance hover effects for better interactive feedback
    function enhanceInteractiveElements() {
        // Add hover effects to buttons
        document.querySelectorAll('.btn, button:not([disabled]), .social-icon, .venue-link, .view-all-speakers, .view-all-gallery').forEach(element => {
            element.addEventListener('mouseenter', () => {
                if (typeof gsap !== 'undefined') {
                    gsap.to(element, { scale: 1.05, duration: 0.3, ease: 'power1.out' });
                } else {
                    element.style.transform = 'scale(1.05)';
                }
            });

            element.addEventListener('mouseleave', () => {
                if (typeof gsap !== 'undefined') {
                    gsap.to(element, { scale: 1, duration: 0.3, ease: 'power1.out' });
                } else {
                    element.style.transform = 'scale(1)';
                }
            });
        });

        // Make sure organizer cards with links have proper interactive states
        document.querySelectorAll('.organizer-card').forEach(card => {
            const link = card.querySelector('a');
            if (link) {
                card.style.cursor = 'pointer';
                card.addEventListener('click', (e) => {
                    if (e.target.tagName !== 'A' && e.target.parentElement.tagName !== 'A') {
                        link.click();
                    }
                });

                card.addEventListener('keydown', (e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && e.target === card) {
                        e.preventDefault();
                        link.click();
                    }
                });
            }
        });
    }

    // Implement speaker modal functionality
    function setupSpeakerModals() {
        const speakerCards = document.querySelectorAll('.speaker-card');
        if (!speakerCards.length) return;

        // Create modal container if needed
        let speakerModal = document.getElementById('speaker-modal');
        let modalBody = document.getElementById('modal-body');

        speakerCards.forEach(card => {
            // Make cards focusable
            card.setAttribute('tabindex', '0');

            // Find or create the button
            let moreBtn = card.querySelector('.speaker-more-btn');
            if (!moreBtn) {
                moreBtn = document.createElement('button');
                moreBtn.className = 'speaker-more-btn';
                moreBtn.innerHTML = '<span>Learn more</span><i class="fas fa-arrow-right"></i>';
                moreBtn.setAttribute('aria-label', `Learn more about ${card.querySelector('h3')?.textContent || 'this speaker'}`);
                card.querySelector('.speaker-info').appendChild(moreBtn);
            }

            // Handle click events
            card.addEventListener('click', (e) => {
                // Only trigger if not clicking on a specific element like social links
                const isLink = e.target.tagName === 'A' || e.target.parentElement.tagName === 'A';
                if (!isLink && e.target !== moreBtn && !moreBtn.contains(e.target)) {
                    openSpeakerModal(card);
                }
            });

            moreBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openSpeakerModal(card);
            });

            // Keyboard support
            card.addEventListener('keydown', (e) => {
                if ((e.key === 'Enter' || e.key === ' ') && e.target === card) {
                    e.preventDefault();
                    openSpeakerModal(card);
                }
            });
        });

        function openSpeakerModal(card) {
            if (!speakerModal) return;

            const speakerName = card.querySelector('h3').textContent;
            const speakerRole = card.querySelector('.speaker-role').textContent;
            const speakerBio = card.querySelector('.speaker-bio').textContent;
            const speakerImg = card.querySelector('img').src;

            // Create full bio content
            const fullBio = speakerBio + (speakerBio.length < 150 ?
                ` ${speakerName} is a valued contributor to the tech community, bringing insights and expertise to BYTE CAMP.` : '');

            // Populate modal
            modalBody.innerHTML = `
            <div class="speaker-modal-content">
                <div class="speaker-modal-image">
                    <img src="${speakerImg}" alt="${speakerName}" />
                </div>
                <h2>${speakerName}</h2>
                <p class="speaker-modal-role">${speakerRole}</p>
                <div class="speaker-modal-bio">
                    <p>${fullBio}</p>
                </div>
                <div class="speaker-modal-social">
                    <a href="#" aria-label="${speakerName}'s LinkedIn" class="social-icon">
                        <i class="fab fa-linkedin-in"></i>
                    </a>
                    <a href="#" aria-label="${speakerName}'s Twitter" class="social-icon">
                        <i class="fab fa-twitter"></i>
                    </a>
                </div>
            </div>
        `;

            // Show modal
            speakerModal.style.display = 'block';
            document.body.classList.add('no-scroll');

            // Focus on the close button for accessibility
            setTimeout(() => {
                document.getElementById('close-modal').focus();
            }, 100);
        }
    }

    // Improved scroll to top button
    function improveScrollToTopButton() {
        const scrollBtn = document.getElementById('scrollTopBtn');
        if (!scrollBtn) return;

        // Make sure it has an aria-label
        if (!scrollBtn.hasAttribute('aria-label')) {
            scrollBtn.setAttribute('aria-label', 'Scroll to top');
        }

        // Enhance visibility logic
        window.addEventListener('scroll', function() {
            if (document.documentElement.scrollTop > 300) {
                if (!scrollBtn.classList.contains('show')) {
                    scrollBtn.classList.add('show');
                    scrollBtn.classList.remove('hide');
                }
            } else {
                if (scrollBtn.classList.contains('show')) {
                    scrollBtn.classList.remove('show');
                    scrollBtn.classList.add('hide');
                }
            }
        });

        // Smooth scroll with focus management
        scrollBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // After scroll completes, set focus to the first focusable element in the header
            setTimeout(() => {
                const firstFocusable = document.querySelector('.site-header a, .site-header button');
                if (firstFocusable) {
                    firstFocusable.focus();
                }
            }, 1000);
        });
    }

    // Make focus outlines visible only when using keyboard
    function setupKeyboardFocusStyles() {
        // Add class to body on tab use
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-user');
            }
        });

        // Remove class on mouse use
        document.addEventListener('mousedown', function() {
            document.body.classList.remove('keyboard-user');
        });

        // Add CSS for keyboard focus styles
        if (!document.getElementById('keyboard-focus-styles')) {
            const style = document.createElement('style');
            style.id = 'keyboard-focus-styles';
            style.textContent = `
            body:not(.keyboard-user) *:focus {
                outline: none !important;
            }
            .keyboard-user *:focus {
                outline: 2px solid var(--focus-outline-color) !important;
                outline-offset: 3px !important;
            }
        `;
            document.head.appendChild(style);
        }
    }

    // Scripts moved from index.html

    // AOS library initialization
    if (window.AOS) {
        AOS.init();
    }

    // Announcement Overlay Logic (consolidated)
    var announcementOverlay = document.getElementById('announcement-overlay');
    var closeAnnouncementBtn = document.getElementById('announcement-close');

    function closePreviouslyAttachedAnnouncement() {
        if (announcementOverlay && announcementOverlay.style.visibility !== 'hidden') {
            announcementOverlay.style.opacity = '0';
            setTimeout(function() {
                announcementOverlay.style.visibility = 'hidden';
                if (document.body.classList.contains('announcement-active-no-scroll')) {
                    document.body.classList.remove('announcement-active-no-scroll');
                } else {
                    document.body.style.overflow = ''; // Fallback if class wasn't used
                }
            }, 300);
        }
    }

    if (announcementOverlay) {
        if (closeAnnouncementBtn) {
            if (!closeAnnouncementBtn.hasAttribute('data-inline-listener-attached')) {
                closeAnnouncementBtn.addEventListener('click', closePreviouslyAttachedAnnouncement);
                closeAnnouncementBtn.setAttribute('data-inline-listener-attached', 'true');
            }
        }        if (!announcementOverlay.hasAttribute('data-inline-click-listener-attached')) {
            announcementOverlay.addEventListener('click', function(e) {
                if (e.target === announcementOverlay) {
                    closePreviouslyAttachedAnnouncement();
                }
            });
            announcementOverlay.setAttribute('data-inline-click-listener-attached', 'true');
        }

}
})
