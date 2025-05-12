/* style.css */

/* Hero Section Background Image */
.hero-bg-image {
    background-image: url('images/banner.jpeg');
    /* Replace with your banner */
    background-size: cover;
    background-position: center center;
}

/* Divisions Section Background Image */
.divisions-bg-image {
    background-image: url('images/banner2.jpeg');
    /* Replace with your banner */
    background-size: cover;
    background-position: center center;
    background-attachment: fixed;
    /* Parallax effect */
}

/* Scroll Animation Base State (Hidden) */
.scroll-target {
    opacity: 0;
    transform: translateY(30px);
    /* Start elements lower */
    transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}

/* Scroll Animation Visible State (Applied by JS) */
.scroll-target.visible {
    opacity: 1;
    transform: translateY(0);
}

/* Navbar shrink effect on scroll */
#navbar.scrolled {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    background-color: rgba(10, 25, 47, 0.95);
    /* More opaque bg */
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    /* shadow-md */
}

/* Style form focus states */
input:focus,
textarea:focus {
    /* Focus ring handled by Tailwind focus:ring-2 */
    border-color: theme('colors.orion-cyan');
    /* Ensure border color changes */
}

/* Glow effect for specific hover states if needed */
.hover\:glow-cyan:hover {
    text-shadow: 0 0 8px theme('colors.orion-cyan');
}

/* NEW: Apply animation to the faction emblem */
#faction-emblem {
    /* Uses animation defined in Tailwind config */
    animation-name: subtleFloat;
    animation-duration: 6s;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
}

/* Ensure high contrast for accessibility where needed,
   though the current dark bg/light text/cyan accent is generally good.
   Consider adding outlines or stronger shadows if specific elements lack contrast. */

/* Example: Ensuring links within dark cards are clearly visible */
/* .dark-card a {
    color: theme('colors.orion-cyan');
    text-decoration: underline;
} */