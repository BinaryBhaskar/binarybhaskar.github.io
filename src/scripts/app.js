// This file contains the main JavaScript code for the portfolio website.
// It handles interactivity, such as animations and event listeners for user interactions.

document.addEventListener('DOMContentLoaded', () => {
    // Initialize animations or any interactive elements here
    console.log('Portfolio website loaded');

    // Example of adding a scroll event listener for animations
    window.addEventListener('scroll', () => {
        // Logic to trigger animations on scroll
        console.log('Scrolling detected');
    });

    // Example of adding a hover event listener for elements
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            // Logic to trigger hover animations
            item.classList.add('hovered');
        });

        item.addEventListener('mouseleave', () => {
            // Logic to remove hover animations
            item.classList.remove('hovered');
        });
    });
});