document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Form submission handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Send the initial email to yourself
            emailjs.sendForm('service_oh8kue3', 'service_oh8kue3', this)
                .then(function() {
                    alert('Thank you for your message! I will get back to you soon.');
                }, function(error) {
                    alert('Failed to send message. Please try again later.');
                });

            // Send the auto-reply to the sender
            emailjs.send('service_oh8kue3', 'template_eblbzie', {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value
            });

            this.reset();
        });
    }

    // Add scroll animation for elements
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe all sections
    document.querySelectorAll('section').forEach((section) => {
        observer.observe(section);
    });
});
