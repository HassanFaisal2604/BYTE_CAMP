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

    // Show spinner immediately on DOMContentLoaded (for slow connections)
    var spinner = document.getElementById('loading-spinner');
    if (spinner) {
        spinner.classList.add('active');
        spinner.style.display = 'flex';
    }    // Announcement Overlay Elements
    const announcementOverlay = document.getElementById('announcement-overlay');
    const closeAnnouncementBtn = document.getElementById('announcement-close');
    
    // CodeCruise Elements and State - declare early to avoid scoping issues
    const codecruiseAlert = document.getElementById('codecruise-alert');
    const codecruiseClose = document.getElementById('codecruise-close');
    const codecruiseLater = document.getElementById('codecruise-later');
    let codecruiseModalOpen = false; // Track modal state

    // Announcement Overlay functionality
    if (announcementOverlay) {
        // Make sure announcement is initially hidden correctly
        announcementOverlay.style.opacity = '0';
        announcementOverlay.style.visibility = 'hidden';

        // Use window.onload to ensure the announcement displays after everything is ready
        window.addEventListener('load', function() {
            // Show the announcement after a brief delay
            setTimeout(function() {
                announcementOverlay.style.opacity = '1';
                announcementOverlay.style.visibility = 'visible';
                announcementOverlay.classList.add('show');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            }, 800);
        });

        // Function to show CodeCruise alert after announcement is closed
        function showCodeCruiseAfterAnnouncement() {
            setTimeout(function() {
                const codecruiseAlert = document.getElementById('codecruise-alert');
                if (codecruiseAlert) {
                    const lastShown = localStorage.getItem('codecruise-alert-shown');
                    const today = new Date().toDateString();
                    
                    if (lastShown !== today) {
                        codecruiseAlert.classList.add('show');
                        codecruiseModalOpen = true;
                        document.body.style.overflow = 'hidden';
                    }
                }
            }, 1000); // Show CodeCruise alert 1 second after announcement is closed
        }

        // Close announcement when close button is clicked
        if (closeAnnouncementBtn) {
            closeAnnouncementBtn.addEventListener('click', function() {
                announcementOverlay.classList.remove('show');
                setTimeout(function() {
                    announcementOverlay.style.opacity = '0';
                    announcementOverlay.style.visibility = 'hidden';
                    document.body.style.overflow = '';
                }, 300);
                showCodeCruiseAfterAnnouncement();
            });
        }

        // Close announcement when clicking outside the modal content
        announcementOverlay.addEventListener('click', function(e) {
            if (e.target === announcementOverlay) {
                announcementOverlay.classList.remove('show');
                setTimeout(function() {
                    announcementOverlay.style.opacity = '0';
                    announcementOverlay.style.visibility = 'hidden';
                    document.body.style.overflow = '';
                }, 300);
                showCodeCruiseAfterAnnouncement();
            }
        });

        // Close announcement with ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && announcementOverlay.classList.contains('show')) {
                announcementOverlay.classList.remove('show');
                setTimeout(function() {
                    announcementOverlay.style.opacity = '0';
                    announcementOverlay.style.visibility = 'hidden';
                    document.body.style.overflow = '';
                }, 300);
                showCodeCruiseAfterAnnouncement();
            }
        });
    }    // CodeCruise Subscription Alert functionality
    if (codecruiseAlert) {
        console.log('CodeCruise alert element found');
        
        // Show CodeCruise alert only if no announcement overlay exists (fallback)
        const announcementExists = document.getElementById('announcement-overlay');
        console.log('Announcement exists:', !!announcementExists);
          if (!announcementExists) {
            // Show the modal immediately on page load
            console.log('Showing CodeCruise alert...');
            codecruiseAlert.classList.add('show');
            codecruiseModalOpen = true;
            document.body.style.overflow = 'hidden';
            console.log('CodeCruise modal opened, state:', codecruiseModalOpen);
        } else {
            console.log('Announcement overlay exists, CodeCruise modal will show after announcement is closed');
        }// Function to close CodeCruise modal
        function closeCodeCruiseModal() {
            console.log('Closing CodeCruise modal...');
            console.log('Modal open state before closing:', codecruiseModalOpen);
            if (codecruiseModalOpen) {
                codecruiseAlert.classList.remove('show');
                codecruiseModalOpen = false;
                document.body.style.overflow = '';
                const today = new Date().toDateString();
                localStorage.setItem('codecruise-alert-shown', today);
                console.log('CodeCruise modal closed and marked as shown for today');
            }
        }

        // Close alert when the close button is clicked
        if (codecruiseClose) {
            codecruiseClose.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                closeCodeCruiseModal();
            });
        }

        // Close alert when "Maybe Later" is clicked
        if (codecruiseLater) {
            codecruiseLater.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                closeCodeCruiseModal();
            });
        }

        // Close when clicking outside the modal (but not on the modal content)
        codecruiseAlert.addEventListener('click', function(e) {
            if (e.target === codecruiseAlert && codecruiseModalOpen) {
                closeCodeCruiseModal();
            }
        });

        // Prevent modal from closing when clicking inside the modal content
        const codecruiseModal = codecruiseAlert.querySelector('.codecruise-modal');
        if (codecruiseModal) {
            codecruiseModal.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }

        // Close on ESC key press
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && codecruiseModalOpen) {
                closeCodeCruiseModal();
            }
        });
    }

    // Header scroll effect
    function handleHeaderScroll() {
        if (!header) return;
        
        let lastScrollTop = 0;
        const scrollThreshold = 100;
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        if (currentScroll > scrollThreshold) {
            header.classList.add('scrolled');
            
            if (currentScroll > lastScrollTop && currentScroll > scrollThreshold * 2) {
                header.classList.add('hidden');
            } else {
                header.classList.remove('hidden');
            }
            
            if (window.innerWidth <= 768) {
                header.classList.add('collapsed');
            }
        } else {
            header.classList.remove('scrolled', 'hidden', 'collapsed');
        }
        
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
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
        if (!scrollTopBtn) return;
        
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
            scrollTopBtn.style.display = 'block';
        } else {
            scrollTopBtn.classList.remove('visible');
            scrollTopBtn.style.display = 'none';
        }
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

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

    // Registration modal functionality
    if (registerModal) {
        registerBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                registerModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            });
        });

        if (closeRegisterModal) {
            closeRegisterModal.addEventListener('click', function() {
                registerModal.style.display = 'none';
                document.body.style.overflow = '';
            });
        }

        window.addEventListener('click', function(e) {
            if (e.target === registerModal) {
                registerModal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }

    // Speaker modal functionality
    if (speakerModal && modalBody) {
        const speakers = {
            'dr-nouman': {
                name: 'Dr. Nouman Azam',
                title: 'Professor, University of Manitoba',
                bio: 'Dr. Nouman Azam is a Professor in the Department of Computer Science at the University of Manitoba, Canada. His research interests include machine learning, data mining, and artificial intelligence.',
                image: 'Speakers/Nouman.webp'
            },
            'awais-ahmed': {
                name: 'Awais Ahmed',
                title: 'Co-Founder & CTO, Defang',
                bio: 'Awais Ahmed is the Co-Founder and CTO of Defang, bringing extensive experience in cloud infrastructure and software development.',
                image: 'Speakers/Awais.webp'
            },
            'usman-aslam': {
                name: 'Mr. Usman Aslam',
                title: 'Senior Software Engineer',
                bio: 'Usman Aslam is a seasoned software engineer with expertise in AI and product development.',
                image: 'Speakers/Usman.jpg'
            },
            'samsor-rehman': {
                name: 'Mr. Samsor Rehman',
                title: 'DevOps Engineer',
                bio: 'Samsor Rehman specializes in DevOps practices and GitHub Actions automation.',
                image: 'Speakers/Samsor.jpg'
            },
            'saad-hasnain': {
                name: 'Mr. Saad Hasnain',
                title: 'No-Code/Low-Code Expert',
                bio: 'Saad Hasnain is an expert in no-code and low-code development platforms.',
                image: 'Speakers/saad.jpg'
            },
            'abdul-mateen': {
                name: 'Abdul Mateen',
                title: 'Hackathon Champion',
                bio: 'Abdul Mateen is a renowned hackathon participant and coding competition expert.',
                image: 'Speakers/mateen.webp'
            },
            'usman-asif': {
                name: 'Mr. Usman Asif',
                title: 'Freelance Expert',
                bio: 'Usman Asif helps developers secure their first clients in the freelance market.',
                image: 'Speakers/usmanasif.jpg'
            },
            'faizan-asim': {
                name: 'Mr. Faizan Asim',
                title: 'Developer Relations Expert',
                bio: 'Faizan Asim specializes in developer relations and community building.',
                image: 'Speakers/Dr-faiza.png'
            }
        };

        speakerMoreBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const speakerId = this.getAttribute('data-speaker');
                const speaker = speakers[speakerId];
                
                if (speaker) {
                    modalBody.innerHTML = `
                        <div class="speaker-modal-content">
                            <img src="${speaker.image}" alt="${speaker.name}" class="speaker-modal-image">
                            <div class="speaker-modal-info">
                                <h3>${speaker.name}</h3>
                                <p class="speaker-modal-title">${speaker.title}</p>
                                <p class="speaker-modal-bio">${speaker.bio}</p>
                            </div>
                        </div>
                    `;
                    speakerModal.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        if (closeModal) {
            closeModal.addEventListener('click', function() {
                speakerModal.style.display = 'none';
                document.body.style.overflow = '';
            });
        }

        window.addEventListener('click', function(e) {
            if (e.target === speakerModal) {
                speakerModal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }    // Initialize functions
    handleHeaderScroll();
    toggleScrollTopBtn();

    // Countdown Timer functionality - moved from inline script
    setTimeout(function() {
        const daysElement = document.getElementById('days');
        const hoursElement = document.getElementById('hours');
        const minutesElement = document.getElementById('minutes');
        const secondsElement = document.getElementById('seconds');
        
        console.log('Countdown elements found:', {
            days: !!daysElement,
            hours: !!hoursElement,
            minutes: !!minutesElement,
            seconds: !!secondsElement
        });
        
        if (daysElement && hoursElement && minutesElement && secondsElement) {
            // Simple manual countdown for May 29, 2025
            function updateTimer() {
                const targetDate = new Date('2025-05-29T10:00:00').getTime();
                const now = new Date().getTime();
                const timeLeft = targetDate - now;
                
                if (timeLeft > 0) {
                    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
                    
                    daysElement.textContent = days.toString().padStart(2, '0');
                    hoursElement.textContent = hours.toString().padStart(2, '0');
                    minutesElement.textContent = minutes.toString().padStart(2, '0');
                    secondsElement.textContent = seconds.toString().padStart(2, '0');
                } else {
                    daysElement.textContent = '00';
                    hoursElement.textContent = '00';
                    minutesElement.textContent = '00';
                    secondsElement.textContent = '00';
                }
            }
            
            // Update immediately and then every second
            updateTimer();
            setInterval(updateTimer, 1000);
            console.log('Countdown timer started successfully');
        } else {
            console.error('Countdown elements not found');
        }
    }, 100);
});

// Show loading spinner on page load and hide when ready
window.addEventListener('load', function() {
    var spinner = document.getElementById('loading-spinner');
    if (spinner) {
        spinner.classList.remove('active');
        spinner.style.display = 'none';
    }
});