document.addEventListener('DOMContentLoaded', function() {
    // Make sure register button is visible by default
    const registerBtn = document.getElementById('register-btn');
    if (registerBtn) {
        registerBtn.style.opacity = 1;
    }

    // GSAP Animation for the arrow
    gsap.registerPlugin(ScrollTrigger);

    // Arrow animation with scrolling - making it follow the entire page scroll
    gsap.to("#arrowPath", {
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5,
            markers: false,
        },
        strokeDashoffset: 0,
        ease: "power1.inOut",
        duration: 3
    });

    // Animate the sections with GSAP on scroll
    gsap.utils.toArray('.section').forEach(section => {
        gsap.from(section, {
            opacity: 0,
            y: 50,
            duration: 1,
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });
    });

    // Animate the hero section
    gsap.from('.hero h1', {
        opacity: 0,
        y: -30,
        duration: 1,
        delay: 0.2
    });

    gsap.from('.hero p', {
        opacity: 0,
        y: -20,
        duration: 1,
        delay: 0.4
    });

    // Modified animation for register button to ensure it always appears
    gsap.fromTo('#register-btn', { opacity: 0.5, y: 20 }, { opacity: 1, y: 0, duration: 1, delay: 0.6 });

    // Animate 'What is BYTE CAMP' section
    gsap.from('.what-is-byte-camp h2', {
        opacity: 0,
        y: 40,
        duration: 1,
        scrollTrigger: {
            trigger: '.what-is-byte-camp',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });
    gsap.from('.bytecamp-info li', {
        opacity: 0,
        x: -40,
        duration: 0.7,
        stagger: 0.2,
        scrollTrigger: {
            trigger: '.what-is-byte-camp',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });

    // Animate sponsors
    gsap.from('.sponsor', {
        opacity: 0,
        scale: 0.7,
        duration: 0.7,
        stagger: 0.15,
        scrollTrigger: {
            trigger: '.sponsors-list',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        }
    });

    // Replace Register Now button with Luma checkout button
    const registerNowBtn = document.getElementById('register-btn');
    let lumaBtn = null;
    if (registerNowBtn) {
        lumaBtn = document.createElement('a');
        lumaBtn.href = 'https://lu.ma/event/evt-tQyH6djijkje6Gw';
        lumaBtn.className = 'luma-checkout--button btn';
        lumaBtn.setAttribute('data-luma-action', 'checkout');
        lumaBtn.setAttribute('data-luma-event-id', 'evt-tQyH6djijkje6Gw');
        lumaBtn.textContent = 'Register for Event';
        registerNowBtn.parentNode.replaceChild(lumaBtn, registerNowBtn);
    }
    // Replace header Register Yourself button with Luma checkout button
    const headerBtn = document.querySelector('.header-btn');
    if (headerBtn) {
        const lumaBtn2 = document.createElement('a');
        lumaBtn2.href = 'https://lu.ma/event/evt-tQyH6djijkje6Gw';
        lumaBtn2.className = 'luma-checkout--button btn header-btn';
        lumaBtn2.setAttribute('data-luma-action', 'checkout');
        lumaBtn2.setAttribute('data-luma-event-id', 'evt-tQyH6djijkje6Gw');
        lumaBtn2.textContent = 'Register for Event';
        headerBtn.parentNode.replaceChild(lumaBtn2, headerBtn);
    }
    // Inject Luma script if not already present
    if (!document.getElementById('luma-checkout')) {
        const lumaScript = document.createElement('script');
        lumaScript.id = 'luma-checkout';
        lumaScript.src = 'https://embed.lu.ma/checkout-button.js';
        document.body.appendChild(lumaScript);
    }

    // Modal functionality (only attach if registerBtn and modal exist and not replaced)
    const modal = document.getElementById('register-modal');
    const closeModal = document.getElementById('close-modal');
    const modalForm = document.getElementById('modal-form');
    if (registerBtn && modal && closeModal && modalForm) {
        registerBtn.addEventListener('click', function() {
            modal.style.display = 'block';
        });
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
        });
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        };
        modalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            modal.style.display = 'none';
            Toastify({
                text: "Thank you for registering!",
                duration: 3000,
                gravity: "top",
                position: "center",
                backgroundColor: "linear-gradient(90deg, #9bfd21, #baff33)",
            }).showToast();
        });
    }

    // Scroll to Top Button functionality
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    window.onscroll = function() {
        if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
            scrollTopBtn.style.display = 'block';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    };
    scrollTopBtn.onclick = function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Smooth scroll for arrow (if you want to scroll to hero section)
    const arrowSection = document.getElementById('arrowSection');
    if (arrowSection) {
        arrowSection.addEventListener('click', function() {
            document.querySelector('.hero').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Update copyright year automatically
    const footerYear = document.querySelector('footer');
    const currentYear = new Date().getFullYear();
    footerYear.innerHTML = `&copy; ${currentYear} BYTE CAMP. All rights reserved.`;

    // Add a simple animation to organizer images on hover
    const organizerImages = document.querySelectorAll('.organizer img');

    organizerImages.forEach(img => {
        img.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.transition = 'transform 0.3s ease';
        });

        img.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Initialize AOS for organizer images
    if (window.AOS) {
        AOS.init();
    }

    // Gallery image effects
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        gsap.from(item, {
            opacity: 0,
            y: 30,
            duration: 0.8,
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    });

    // Schedule items animation
    gsap.utils.toArray('.schedule-item').forEach((item, index) => {
        gsap.from(item, {
            opacity: 0,
            x: -50,
            duration: 0.6,
            delay: index * 0.1,
            scrollTrigger: {
                trigger: '.schedule-container',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    // Speakers animation
    gsap.utils.toArray('.speaker').forEach((speaker, index) => {
        gsap.from(speaker, {
            opacity: 0,
            y: 50,
            duration: 0.7,
            delay: index * 0.15,
            scrollTrigger: {
                trigger: '.speakers-container',
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    // Social media icons hover effect
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            gsap.to(icon, {
                scale: 1.2,
                duration: 0.3,
                ease: 'power1.out'
            });
        });

        icon.addEventListener('mouseleave', () => {
            gsap.to(icon, {
                scale: 1,
                duration: 0.3,
                ease: 'power1.out'
            });
        });
    });

    // Add Font Awesome for social icons
    if (!document.getElementById('font-awesome')) {
        const fontAwesome = document.createElement('link');
        fontAwesome.id = 'font-awesome';
        fontAwesome.rel = 'stylesheet';
        fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
        document.head.appendChild(fontAwesome);
    }
});