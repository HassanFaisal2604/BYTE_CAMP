document.addEventListener('DOMContentLoaded', function() {
    // Handle smooth scroll for the scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function(e) {
            e.preventDefault();

            // Find the first section after hero
            const nextSection = document.querySelector('.hero + .section');
            if (nextSection) {
                // Smooth scroll to the next section
                nextSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });

        // Hide scroll indicator when scrolled down
        window.addEventListener('scroll', function() {
            if (window.scrollY > window.innerHeight * 0.5) {
                scrollIndicator.style.opacity = '0';
            } else {
                scrollIndicator.style.opacity = '1';
            }
        });
    }
});