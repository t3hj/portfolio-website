document.addEventListener("DOMContentLoaded", () => {
    // Typing Animation
    const typingText = document.getElementById('typing-text');
    if (typingText) {
        const text = "Welcome to My Portfolio";
        let i = 0;

        function typeWriter() {
            if (i < text.length) {
                typingText.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }

        typeWriter();
    }

    // Theme Toggle Functionality
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        let currentTheme = localStorage.getItem('theme') || 'custom'; // Default theme

        // Set the initial theme
        document.body.setAttribute('data-theme', currentTheme);
        themeToggle.className = `theme-toggle ${currentTheme}`;

        themeToggle.addEventListener('click', () => {
            // Toggle themes in sequence
            if (currentTheme === 'dark') {
                currentTheme = 'custom';
            } else if (currentTheme === 'light') {
                currentTheme = 'dark';
            } else {
                currentTheme = 'light';
            }

            // Apply the theme
            document.body.setAttribute('data-theme', currentTheme);
            themeToggle.className = `theme-toggle ${currentTheme}`;
            localStorage.setItem('theme', currentTheme); // Save the theme
        });
    }

    // Profile Card 3D Effect
    const profileCard = document.querySelector('.profile-card');
    
    if (profileCard) {
        profileCard.addEventListener('mousemove', (e) => {
            const rect = profileCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = -(x - centerX) / 10;
            
            profileCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        profileCard.addEventListener('mouseleave', () => {
            profileCard.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Intersection Observer for fade-in effect
    const fadeElems = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    fadeElems.forEach(elem => observer.observe(elem));
});