const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");
            obs.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.14,
    rootMargin: "0px 0px -40px 0px"
});

revealElements.forEach(element => observer.observe(element));
