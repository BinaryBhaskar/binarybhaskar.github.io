const animateOnScroll = (element) => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    });

    observer.observe(element);
};

const animateOnHover = (element) => {
    element.addEventListener('mouseenter', () => {
        element.classList.add('hover-animate');
    });

    element.addEventListener('mouseleave', () => {
        element.classList.remove('hover-animate');
    });
};

export { animateOnScroll, animateOnHover };