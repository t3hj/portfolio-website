document.addEventListener('DOMContentLoaded', function() {
    // Improved Parallax effect
    window.addEventListener('scroll', function() {
        const parallaxGroups = document.querySelectorAll('.parallax-group');
        parallaxGroups.forEach((group) => {
            const distance = window.pageYOffset - group.offsetTop;
            const parallaxBack = group.querySelector('.parallax-layer-back');
            if (parallaxBack) {
                parallaxBack.style.transform = `translateY(${distance * -0.5}px) scale(2)`;
            }
        });
    });

    // Fade-in animation
    const fadeElems = document.querySelectorAll('.animate-fade-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    fadeElems.forEach(elem => observer.observe(elem));
});