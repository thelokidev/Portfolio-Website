import { Background } from './background.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize 3D background
    const background = new Background();

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    block: 'start'
                });
            }
        });
    });


});
