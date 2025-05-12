document.addEventListener('DOMContentLoaded', () => {

    // --- Navbar Shrink on Scroll ---
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            // Add 'scrolled' class to navbar when page is scrolled down
            if (window.scrollY > 50) { // Adjust scroll distance threshold if needed
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // --- Mobile Menu Toggle ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            // Toggle the 'hidden' class on the mobile menu
            mobileMenu.classList.toggle('hidden');
            // Toggle icon between bars and X (times)
            const icon = mobileMenuButton.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Add event listener to close mobile menu when a link inside it is clicked
        const mobileMenuLinks = mobileMenu.querySelectorAll('a');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden'); // Hide menu
                // Reset the menu icon to 'bars'
                const icon = mobileMenuButton.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }


    // --- Scroll Animations using Intersection Observer ---
    const scrollTargets = document.querySelectorAll('.scroll-target');

    const observerOptions = {
        root: null, // Observe intersections relative to the viewport
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element becomes visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            // If the element is intersecting (visible)
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Unobserve the element after it has become visible once
                // observer.unobserve(entry.target);
            }
            // Optional: Remove the 'visible' class if the element scrolls out of view
            // else {
            //     entry.target.classList.remove('visible');
            // }
        });
    };

    // Create a new Intersection Observer instance
    const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);

    // Observe each target element
    scrollTargets.forEach(target => {
        scrollObserver.observe(target);
    });

    // --- Update Footer Year ---
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        // Set the text content to the current year
        const currentYear = new Date().getFullYear(); // Get current year dynamically
        currentYearSpan.textContent = currentYear;
    }


    // Initialize EmailJS (make sure to replace YOUR_USER_ID with your actual EmailJS user ID)
    emailjs.init("9H8J68bo5drm0Isre");

    document.querySelector('form').addEventListener('submit', function (e) {
        e.preventDefault(); // Prevents the form from submitting the default way

        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            callsign: document.getElementById('callsign').value,
            email: document.getElementById('email').value,
            reason: document.getElementById('reason').value
        };

        // Send the email using EmailJS
        emailjs.send('service_r4ibniz', 'template_oadi4x9', formData)
            .then(function (response) {
                console.log('SUCCESS!', response.status, response.text);
                alert('Thank you for signing up! Your form is being reviewed.');
                document.querySelector('form').reset(); // Reset the form after submission
            })
            .catch(function (error) {
                console.log('FAILED...', error);
                alert('Oops! Something went wrong. Please try again.');
            });
    });


}); // end DOMContentLoaded