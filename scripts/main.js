document.addEventListener("DOMContentLoaded", () => {
    // Loader
    const loader = document.getElementById("loader");
    setTimeout(() => {
        loader.style.display = "none";
    }, 1000);

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
            document.querySelector(".navbar").style.top = "0"; // Show navbar
        }
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // For Mobile or negative scrolling
    });

    // Hamburger Menu for Mobile
    const hamburgerMenu = document.querySelector(".hamburger-menu");
    const navLinks = document.querySelector(".nav-links");

    hamburgerMenu.addEventListener("click", () => {
        navLinks.classList.toggle("show");
    });

    document.querySelector('.hero-image img').addEventListener('mousemove', (e) => {
        const image = e.target;
        const rect = image.getBoundingClientRect(); // Get the image dimensions
        const mouseX = e.clientX - rect.left; // Mouse X relative to image
        const mouseY = e.clientY - rect.top;  // Mouse Y relative to image
    
        // Calculate rotation values based on mouse position
        const rotateX = ((mouseY / rect.height) - 0.5) * 20; // Range: -10 to 10
        const rotateY = ((mouseX / rect.width) - 0.5) * 20; // Range: -10 to 10
    
        // Apply the rotation to the image
        image.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    // Reset rotation when mouse leaves the image
    document.querySelector('.hero-image img').addEventListener('mouseleave', () => {
        const image = document.querySelector('.hero-image img');
        image.style.transform = `rotateX(0deg) rotateY(0deg)`; // Reset to original position
    });
    

    // Dark Mode Toggle
    const toggleDarkMode = document.createElement("button");
    toggleDarkMode.innerHTML = `<i class="fas fa-moon"></i>`;
    toggleDarkMode.classList.add("dark-mode-toggle");
    document.body.appendChild(toggleDarkMode);

    toggleDarkMode.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        toggleDarkMode.firstChild.classList.toggle("fa-sun");
    });


    // Ripple Effect for Buttons
    const buttons = document.querySelectorAll(".cta-button");
    buttons.forEach(button => {
        button.addEventListener("click", (e) => {
            const ripple = document.createElement("span");
            const rect = button.getBoundingClientRect();
            ripple.style.left = `${e.clientX - rect.left}px`;
            ripple.style.top = `${e.clientY - rect.top}px`;
            ripple.classList.add("ripple");
            button.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});
