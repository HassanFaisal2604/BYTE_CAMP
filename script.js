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

    // Register button functionality
    registerBtn.addEventListener('click', function() {
        // Display a simple registration form alert
        alert('Registration will open soon! Check back later.');

        // In a real implementation, this would open a modal or redirect to a registration page
        console.log('Register button clicked');
    });

    // Modal functionality
    const modal = document.getElementById('register-modal');
    const closeModal = document.getElementById('close-modal');
    const modalForm = document.getElementById('modal-form');
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
});