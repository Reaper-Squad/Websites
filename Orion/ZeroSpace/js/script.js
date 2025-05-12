document.addEventListener('DOMContentLoaded', () => {

    // --- Smooth Scrolling for Nav Links ---
    document.querySelectorAll('header nav a[href^="#"], a.cta-button[href^="#"], a[href="#about"].animate-bounce').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Calculate offset if fixed header exists
                const headerOffset = document.querySelector('header.fixed')?.offsetHeight || 0;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });

                // Close mobile menu if open (add if you implement a mobile menu)
            }
        });
    });

    // --- Lightbox Functionality ---
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightboxBtn = document.getElementById('closeLightbox');

    if (lightbox && lightboxImg && closeLightboxBtn) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                lightboxImg.src = item.src;
                lightbox.classList.remove('hidden');
                document.body.style.overflow = 'hidden'; // Prevent background scroll
            });
        });

        const closeLightbox = () => {
            lightbox.classList.add('hidden');
            lightboxImg.src = ""; // Clear src
            document.body.style.overflow = ''; // Restore scroll
        };

        closeLightboxBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => { // Close on backdrop click
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // --- Lore Accordion Arrow Rotation ---
    const detailsElements = document.querySelectorAll('.lore-panel');
    detailsElements.forEach(details => {
        details.addEventListener('toggle', function () {
            const icon = this.querySelector('summary .fa-chevron-down');
            // Tailwind handles the class toggling based on [open] state
            // We just ensure the base style and transition are set in CSS
        });
    });

    // --- Countdown Timer ---
    const countdownElement = document.getElementById('countdown-timer');
    if (countdownElement) {
        // Set the date we're counting down to (Example: Dec 31, 2024)
        const countDownDate = new Date("Dec 31, 2024 15:30:00").getTime();

        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = countDownDate - now;

            // Time calculations for days, hours, minutes and seconds
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Display the result
            countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;

            // If the count down is finished, write some text
            if (distance < 0) {
                clearInterval(interval);
                const countdownParent = document.getElementById('countdown');
                if (countdownParent) countdownParent.innerHTML = "<span class='text-neon-blue'>Launched! Join Now!</span>";
            }
        }

        // Update the count down every 1 second
        const interval = setInterval(updateCountdown, 1000);
        updateCountdown(); // Initial call
    }

    // --- Terminal Modal ---
    const openTerminalBtn = document.getElementById('openTerminalBtn');
    const closeTerminalBtn = document.getElementById('closeTerminalBtn');
    const terminalModal = document.getElementById('terminalModal');
    const terminalOutput = document.getElementById('terminalOutput');
    const terminalInput = document.getElementById('terminalInput'); // Span for typing effect

    if (openTerminalBtn && closeTerminalBtn && terminalModal && terminalOutput && terminalInput) {
        const openModal = () => {
            terminalModal.classList.remove('hidden');
            terminalModal.classList.add('flex');
            document.body.style.overflow = 'hidden';
            // Optional: Start typing simulation
            simulateTyping();
        };

        const closeModal = () => {
            terminalModal.classList.add('hidden');
            terminalModal.classList.remove('flex');
            document.body.style.overflow = '';
            // Optional: Reset terminal state if needed
            if (typingTimeout) clearTimeout(typingTimeout);
            terminalInput.textContent = '';
        };

        openTerminalBtn.addEventListener('click', openModal);
        closeTerminalBtn.addEventListener('click', closeModal);
        terminalModal.addEventListener('click', (e) => { // Close on backdrop click
            if (e.target === terminalModal) {
                closeModal();
            }
        });

        // Simple typing simulation (Example)
        let typingTimeout;
        function simulateTyping() {
            const commands = ["help", "status", "scan nearby", "connect --ship=ISV_Odyssey"];
            const randomCommand = commands[Math.floor(Math.random() * commands.length)];
            let i = 0;
            terminalInput.textContent = ''; // Clear previous

            function typeChar() {
                if (i < randomCommand.length) {
                    terminalInput.textContent += randomCommand.charAt(i);
                    i++;
                    typingTimeout = setTimeout(typeChar, 100 + Math.random() * 100); // Random delay
                } else {
                    // Optionally add a response after typing
                    const response = document.createElement('p');
                    response.textContent = `Executing: ${randomCommand}... Access Denied. Requires higher clearance.`;
                    response.classList.add('text-red-500', 'mt-2');
                    terminalOutput.appendChild(response);
                    terminalOutput.scrollTop = terminalOutput.scrollHeight; // Scroll to bottom
                }
            }
            typeChar();
        }
    }

    // --- Scroll Animations ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: Unobserve after animation to save resources
                // observer.unobserve(entry.target);
            } else {
                // Optional: Remove class to re-animate on scroll up
                entry.target.classList.remove('is-visible');
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    // Observe elements with the .animate-on-scroll class
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });

}); // End DOMContentLoaded