document.addEventListener("DOMContentLoaded", () => {
    // Smooth Scrolling Back to Top Button
    const backToTopButton = document.querySelector(".back-to-top");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 200) {
            backToTopButton.style.display = "block";
        } else {
            backToTopButton.style.display = "none";
        }
    });

    backToTopButton.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // Navbar Scroll Effect
    let lastScrollTop = 0;
    window.addEventListener("scroll", () => {
        let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        if (currentScroll > lastScrollTop) {
            document.querySelector(".navbar").style.top = "-80px"; // Hide navbar
        } else {
            document.querySelector(".navbar").style.top = "20px"; // Show navbar
        }
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // For Mobile or negative scrolling
    });

    // Hamburger Menu for Mobile
    const hamburgerMenu = document.querySelector(".hamburger-menu");
    const navLinks = document.querySelector(".nav-links");

    if (hamburgerMenu) {
        hamburgerMenu.addEventListener("click", () => {
            navLinks.classList.toggle("show");
        });
    }

    // Theme Toggle Functionality
    const themeToggle = document.querySelector('.theme-toggle');
    let currentTheme = localStorage.getItem('theme') || 'custom'; // Default theme

    // Set the initial theme
    document.body.setAttribute('data-theme', currentTheme);
    themeToggle.className = `theme-toggle ${currentTheme}`;

    themeToggle.addEventListener('click', () => {
        // Toggle themes in sequence
        if (currentTheme === 'custom') {
            currentTheme = 'light';
        } else if (currentTheme === 'light') {
            currentTheme = 'dark';
        } else {
            currentTheme = 'custom';
        }

        // Apply the theme
        document.body.setAttribute('data-theme', currentTheme);
        themeToggle.className = `theme-toggle ${currentTheme}`;
        localStorage.setItem('theme', currentTheme); // Save the theme
    });

    // Smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
