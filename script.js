document.addEventListener('DOMContentLoaded', function() {
    // Initialize GSAP ScrollTrigger
    if (typeof gsap !== 'undefined' && gsap.registerPlugin) {
        gsap.registerPlugin(ScrollTrigger);
    }

    // DOM Elements
    const header = document.getElementById('site-header');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
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

    // Show spinner immediately on DOMContentLoaded (for slow connections)
    var spinner = document.getElementById('loading-spinner');
    if (spinner) {
        spinner.classList.add('active');
        spinner.style.display = 'flex';
    }

    // Header scroll effect
    function handleHeaderScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // Mobile menu toggle
    function toggleMobileMenu() {
        mobileMenuToggle.classList.toggle('active');
        mainNav.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    }

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
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.</p>
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

    // Setup animations
    function setupAnimations() {
        // Only run if GSAP is available
        if (typeof gsap === 'undefined') return;

        // Hero section animations
        gsap.from('.hero-content h1', {
            opacity: 0,
            y: 30,
            duration: 1,
            delay: 0.2
        });

        gsap.from('.hero-content p', {
            opacity: 0,
            y: 20,
            duration: 1,
            delay: 0.5
        });

        gsap.from('.hero-content .btn', {
            opacity: 0,
            y: 20,
            duration: 1,
            delay: 0.8
        });

        gsap.from('.tech-sphere', {
            opacity: 0,
            scale: 0.8,
            duration: 1.5,
            delay: 0.5
        });

        // Section animations
        gsap.utils.toArray('.section').forEach(section => {
            gsap.from(section.querySelector('.section-title'), {
                opacity: 0,
                y: 30,
                duration: 0.8,
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            });

            gsap.from(section.querySelector('.section-intro'), {
                opacity: 0,
                y: 30,
                duration: 0.8,
                delay: 0.2,
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // Feature cards animations
        gsap.utils.toArray('.feature-card').forEach((card, index) => {
            gsap.from(card, {
                opacity: 0,
                y: 50,
                duration: 0.6,
                delay: index * 0.1,
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // Timeline items animations
        gsap.utils.toArray('.timeline-item').forEach((item, index) => {
            gsap.from(item, {
                opacity: 0,
                x: -50,
                duration: 0.6,
                delay: index * 0.1,
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // Speaker cards animations
        gsap.utils.toArray('.speaker-card').forEach((card, index) => {
            gsap.from(card, {
                opacity: 0,
                y: 50,
                duration: 0.6,
                delay: index * 0.1,
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // Gallery items animations
        gsap.utils.toArray('.gallery-item').forEach((item, index) => {
            gsap.from(item, {
                opacity: 0,
                scale: 0.9,
                duration: 0.6,
                delay: index * 0.1,
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        });
    }

    // Create background particles
    function createBackgroundParticles() {
        const particlesContainer = document.querySelector('.bg-particles');
        if (!particlesContainer) return;

        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            // Random position
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;

            // Random size
            const size = Math.random() * 3 + 1;

            // Random opacity
            const opacity = Math.random() * 0.5 + 0.1;

            // Random animation duration
            const duration = Math.random() * 20 + 10;

            // Set styles
            particle.style.cssText = `
                position: absolute;
                top: ${posY}%;
                left: ${posX}%;
                width: ${size}px;
                height: ${size}px;
                background-color: var(--secondary-color);
                border-radius: 50%;
                opacity: ${opacity};
                animation: float ${duration}s infinite ease-in-out;
                animation-delay: ${Math.random() * 5}s;
            `;

            particlesContainer.appendChild(particle);
        }
    }

    // Event Listeners
    window.addEventListener('scroll', handleHeaderScroll);
    window.addEventListener('scroll', toggleScrollTopBtn);

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', scrollToTop);
    }

    // Add event listeners to all register buttons
    if (registerBtns.length > 0) {
        registerBtns.forEach(btn => {
            // Skip adding the modal trigger for Luma checkout buttons
            if (btn.classList.contains('luma-checkout--button') ||
                btn.hasAttribute('data-luma-action') ||
                btn.hasAttribute('data-luma-event-id')) {
                // Don't add the modal event listener for Luma buttons
                // This allows the Luma checkout process to work directly
            } else {
                // Only add event listener to non-Luma buttons
                btn.addEventListener('click', openRegisterModal);
            }
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
}); // END DOMContentLoaded

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
    const organizerImages = document.querySelectorAll('.organizer img');
    organizerImages.forEach(img => {
        img.addEventListener('mouseenter', function() {
            gsap.to(this, { scale: 1.1, boxShadow: "0 10px 20px rgba(0,0,0,0.3)", duration: 0.3 });
        });
        img.addEventListener('mouseleave', function() {
            gsap.to(this, { scale: 1, boxShadow: "none", duration: 0.3 });
        });
    });
}

function animateSponsors() {
    const sponsors = document.querySelectorAll('.sponsors-list .sponsor img, .sponsors-list .sponsor span');
    sponsors.forEach((sponsor) => {
        sponsor.addEventListener('mouseenter', function() {
            gsap.to(this, { scale: 1.1, filter: 'brightness(1.2)', duration: 0.3 });
        });
        sponsor.addEventListener('mouseleave', function() {
            gsap.to(this, { scale: 1, filter: 'brightness(1)', duration: 0.3 });
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

function enhanceSchedule() {
    const scheduleItems = document.querySelectorAll('.schedule-item');
    scheduleItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            // Optionally add hover effect
        });
        item.addEventListener('mouseleave', function() {
            // Optionally add hover effect
        });
    });
}

// function enhanceSpeakers() {
//     const speakersContainer = document.querySelector('.speakers-container');
//     if (!speakersContainer) return;

//     const speakers = speakersContainer.querySelectorAll('.speaker');
//     if (speakers.length === 0) return;

//     speakers.forEach((speaker) => {
//         const speakerNameEl = speaker.querySelector('.speaker-info h3');
//         const speakerImg = speaker.querySelector('.speaker-img img');
//         const speakerRoleEl = speaker.querySelector('.speaker-info .speaker-role');
//         const speakerBioEl = speaker.querySelector('.speaker-info .speaker-bio');

//         speaker.addEventListener('mouseenter', function() {
//             gsap.to(this, { y: -10, boxShadow: '0 12px 25px rgba(0,0,0,0.3)', duration: 0.3 });
//             if (speakerNameEl) gsap.to(speakerNameEl, { color: 'var(--secondary-color)', duration: 0.3 });
//         });
//         speaker.addEventListener('mouseleave', function() {
//             gsap.to(this, { y: 0, boxShadow: '0 5px 15px rgba(0,0,0,0.15)', duration: 0.3 });
//             if (speakerNameEl) gsap.to(speakerNameEl, { color: '', duration: 0.3 });
//         });

//         speaker.style.cursor = 'pointer';
//         speaker.addEventListener('click', function() {
//             const speakerName = speakerNameEl ? .textContent.trim() || 'Speaker Details';
//             const speakerImgSrc = speakerImg ? .src || '';
//             const speakerPosition = speakerRoleEl ?.textContent.trim() || '';
//             const speakerBio = speakerBioEl ?.innerHTML || '<p>More details coming soon.</p>';

//             if (document.querySelector('.speaker-modal')) return;

//             const modal = createModalElement();
//             const content = createModalContentElement();
//             const closeBtn = createModalCloseButton();

//             let innerHTML = '';
//             if (speakerImgSrc) {
//                 innerHTML += `<img src="${speakerImgSrc}" alt="${speakerName}" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin: 0 auto 20px; display: block; border: 3px solid var(--secondary-color);">`;
//             }
//             innerHTML += `<h2 style="text-align: center; color: var(--secondary-color); margin-bottom: 5px;">${speakerName}</h2>`;
//             if (speakerPosition) {
//                 innerHTML += `<p style="text-align: center; color: #bbb; margin-bottom: 25px; font-style: italic;">${speakerPosition}</p>`;
//             }
//             innerHTML += `<div class="bio-content" style="line-height: 1.7;">${speakerBio}</div>`;

//             content.innerHTML = innerHTML;
//             content.appendChild(closeBtn);
//             modal.appendChild(content);
//             document.body.appendChild(modal);
//             document.body.classList.add('no-scroll');

//             gsap.to(modal, { opacity: 1, duration: 0.3 });
//             gsap.fromTo(content, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, delay: 0.1, ease: 'back.out(1.7)' });

//             const closeModal = () => {
//                 document.body.classList.remove('no-scroll');
//                 gsap.to(content, { scale: 0.9, opacity: 0, duration: 0.3, ease: 'power1.in' });
//                 gsap.to(modal, {
//                     opacity: 0,
//                     duration: 0.3,
//                     delay: 0.1,
//                     onComplete: () => modal.remove()
//                 });
//             };
//             closeBtn.addEventListener('click', closeModal);
//             modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
//         });
//     });
// }

// --- Helper functions for Speaker Modal Creation ---
function createModalElement() {
    const modal = document.createElement('div');
    modal.className = 'speaker-modal';
    Object.assign(modal.style, {
        position: 'fixed',
        inset: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(10, 10, 10, 0.9)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: '1001',
        opacity: '0',
        padding: '20px'
    });
    return modal;
}

function createModalContentElement() {
    const content = document.createElement('div');
    content.className = 'speaker-modal-content';
    Object.assign(content.style, {
        backgroundColor: '#222',
        padding: '30px 40px',
        borderRadius: '10px',
        maxWidth: '650px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        transform: 'scale(0.9)',
        color: '#eee',
        border: '1px solid var(--secondary-color)',
        boxShadow: '0 5px 25px rgba(0,0,0,0.5)'
    });
    return content;
}

function createModalCloseButton() {
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    Object.assign(closeBtn.style, {
        position: 'absolute',
        top: '10px',
        right: '15px',
        background: 'transparent',
        border: 'none',
        fontSize: '30px',
        cursor: 'pointer',
        color: '#999',
        lineHeight: '1',
        padding: '5px'
    });
    closeBtn.onmouseover = () => closeBtn.style.color = '#fff';
    closeBtn.onmouseout = () => closeBtn.style.color = '#999';
    return closeBtn;
}
// --- End Speaker Modal Helpers ---


function addSocialIconHoverEffects() {
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
        const iTag = icon.querySelector('i');
        icon.addEventListener('mouseenter', () => {
            gsap.to(icon, { y: -5, scale: 1.1, backgroundColor: 'var(--secondary-color)', duration: 0.3, ease: 'power1.out' });
            if (iTag) gsap.to(iTag, { color: '#000', duration: 0.3 });
        });
        icon.addEventListener('mouseleave', () => {
            gsap.to(icon, { y: 0, scale: 1, backgroundColor: '#222', duration: 0.3, ease: 'power1.out' });
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
    const copyrightDiv = document.getElementById('footer-copyright');
    if (copyrightDiv) {
        const currentYear = new Date().getFullYear();
        copyrightDiv.innerHTML = `© ${currentYear} BYTE CAMP. All rights reserved.`;
    }
}

// Inject necessary styles dynamically (optional - better in CSS file)
function injectDynamicStyles() {
    const necessaryStyles = `
        .no-scroll { overflow: hidden !important; }

        .btn {
             display: inline-flex;
             align-items: center;
             justify-content: center;
             text-decoration: none;
        }
        .section-heading {
             position: relative;
             display: inline-block;
             padding-bottom: 15px;
         }
        .section-heading::after {
            content: "";
            position: absolute;
            left: 0;
            bottom: 0;
            width: 60px;
            height: 4px;
            background: linear-gradient(90deg, var(--secondary-color), var(--secondary-accent));
            border-radius: 2px;
        }
         .menu-overlay {
             position: fixed;
             top: 0;
             left: 0;
             width: 100%;
             height: 100%;
             background-color: rgba(0, 0, 0, 0.7);
             z-index: 8;
             opacity: 0;
             visibility: hidden;
             transition: opacity 0.3s ease, visibility 0.3s ease;
         }
         .speaker-modal { }
         .speaker-modal-content { }
         .speaker-modal-content .bio-content p { margin-bottom: 1em; }
         .speaker-modal-content .bio-content strong { color: var(--secondary-color); }

        /* Make the Luma checkout button stand out on dark bg */
        .luma-checkout--button.btn {
            display: inline-block;
            background-color: var(--secondary-accent);
            color: #fff;
            padding: 0.75rem 1.5rem;
            border-radius: 4px;
            text-decoration: none;
            font-weight: 600;
        }
        .luma-checkout--button.btn:hover {
            opacity: 0.9;
        }
    `;
    if (!document.getElementById('bytecamp-dynamic-styles')) {
        const styleSheet = document.createElement("style");
        styleSheet.id = 'bytecamp-dynamic-styles';
        styleSheet.type = "text/css";
        styleSheet.innerText = necessaryStyles;
        document.head.appendChild(styleSheet);
    }
}
injectDynamicStyles();