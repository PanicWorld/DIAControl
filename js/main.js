const menuButton = document.getElementById("menuButton");
const sideMenu = document.getElementById("sideMenu");
const sideClose = document.getElementById("sideClose");
const menuBackdrop = document.getElementById("menuBackdrop");
const navbar = document.getElementById("navbar");
const menuLinks = document.querySelectorAll(".side-links-v9 a");

const FOCUSABLE = "a[href], button:not([disabled])";

function openMenu() {
    sideMenu.classList.add("active");
    menuBackdrop.classList.add("active");
    document.body.classList.add("menu-open");
    sideMenu.setAttribute("aria-hidden", "false");
    menuButton.setAttribute("aria-expanded", "true");
    sideClose.focus();
}

function closeMenu({ restoreFocus = true } = {}) {
    if (!sideMenu.classList.contains("active")) return;
    sideMenu.classList.remove("active");
    menuBackdrop.classList.remove("active");
    document.body.classList.remove("menu-open");
    sideMenu.setAttribute("aria-hidden", "true");
    menuButton.setAttribute("aria-expanded", "false");
    if (restoreFocus) menuButton.focus();
}

menuButton.addEventListener("click", openMenu);
sideClose.addEventListener("click", () => closeMenu());
menuBackdrop.addEventListener("click", () => closeMenu());

// Al elegir una seccion el foco sigue al contenido, no vuelve al boton.
menuLinks.forEach(link => {
    link.addEventListener("click", () => closeMenu({ restoreFocus: false }));
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeMenu();
        return;
    }

    // Con el menu abierto el tabulador no debe salirse hacia la pagina de atras.
    if (event.key !== "Tab" || !sideMenu.classList.contains("active")) return;

    const items = [...sideMenu.querySelectorAll(FOCUSABLE)];
    if (!items.length) return;

    const first = items[0];
    const last = items[items.length - 1];

    if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
    }
});

window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 20);
}, { passive: true });

// Marca en el menu la seccion que se esta viendo.
const sections = [...menuLinks]
    .map(link => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

if (sections.length && "IntersectionObserver" in window) {
    const spy = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            menuLinks.forEach(link => {
                link.classList.toggle(
                    "is-current",
                    link.getAttribute("href") === "#" + entry.target.id
                );
            });
        });
    }, { rootMargin: "-45% 0px -50% 0px" });

    sections.forEach(section => spy.observe(section));
}
