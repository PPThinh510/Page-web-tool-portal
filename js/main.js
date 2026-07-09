/**
 * Core Logic Module - Core structural mechanics, UI bindings, native responsive navigation, 
 * modal dynamic viewports, counters and native element rendering.
 */

document.addEventListener("DOMContentLoaded", () => {
    dismissLoader();
    initNavbarScrolling();
    initMobileNav();
    initLightbox();
    initAccordion();
    initScrollSpy();
    triggerCounterAnimation();
    initEmailCopy();
});

/**
 * 1. Hides Preloader smoothly upon total assets fetching finish
 */
function dismissLoader() {
    const loader = document.getElementById("loader");
    if (!loader) return;
    
    window.addEventListener("load", () => {
        loader.style.opacity = "0";
        setTimeout(() => {
            loader.style.display = "none";
        }, 500);
    });
    
    // Safety Fallback if window load hooks freeze
    setTimeout(() => {
        if(loader.style.display !== "none") {
            loader.style.opacity = "0";
            setTimeout(() => loader.style.display = "none", 500);
        }
    }, 2000);
}

/**
 * 2. Window Scroll Listener tracking to morph standard Navbar into dynamic Glass panel
 */
function initNavbarScrolling() {
    const navbar = document.getElementById("navbar");
    if (!navbar) return;

    const handleScroll = () => {
        if (window.scrollY > 40) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Trigger immediately in case page is loaded scrolled down
}

/**
 * 3. Mobile Navigation Full Drawer Open/Dismiss Toggle
 */
function initMobileNav() {
    const toggle = document.getElementById("nav-toggle");
    const menu = document.getElementById("nav-menu-list");
    const links = document.querySelectorAll(".nav-link");

    if (!toggle || !menu) return;

    toggle.addEventListener("click", () => {
        const isOpen = menu.classList.toggle("open");
        toggle.setAttribute("aria-expanded", isOpen);
        
        const icon = toggle.querySelector("i");
        if (icon) {
            icon.classList.toggle("fa-bars");
            icon.classList.toggle("fa-xmark");
        }
    });

    // Auto close menu context once user taps link on Mobile view
    links.forEach(link => {
        link.addEventListener("click", () => {
            menu.classList.remove("open");
            toggle.setAttribute("aria-expanded", "false");
            const icon = toggle.querySelector("i");
            if (icon) {
                icon.classList.add("fa-bars");
                icon.classList.remove("fa-xmark");
            }
        });
    });
}

/**
 * 4. Lightbox Modal Gallery Overlay Configuration
 */
function initLightbox() {
    const modal = document.getElementById("lightbox-modal");
    const modalImg = document.getElementById("lightbox-img");
    const captionText = document.getElementById("lightbox-caption");
    const triggers = document.querySelectorAll(".lightbox-trigger");
    const closeBtn = document.getElementById("lightbox-close-btn");

    if (!modal || !modalImg) return;

    triggers.forEach(img => {
        img.addEventListener("click", function() {
            modal.style.display = "flex";
            modal.setAttribute("aria-hidden", "false");
            modalImg.src = this.src;
            captionText.textContent = this.alt || "";
            document.body.style.overflow = "hidden"; // Prevent background scroll
        });
    });

    const dismiss = () => {
        modal.style.display = "none";
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    };

    if (closeBtn) {
        closeBtn.addEventListener("click", dismiss);
    }
    
    modal.addEventListener("click", (e) => {
        if (e.target === modal || e.target.classList.contains("lightbox-wrapper")) {
            dismiss();
        }
    });

    // ESC key closes lightbox
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.style.display === "flex") {
            dismiss();
        }
    });
}

/**
 * 5. FAQ Accordion component with smooth max-height transitions
 */
function initAccordion() {
    const headers = document.querySelectorAll(".accordion-header");

    headers.forEach(header => {
        header.addEventListener("click", function() {
            const item = this.parentElement;
            const body = item.querySelector(".accordion-body");
            const isCurrentlyActive = item.classList.contains("active");

            // Close all items first for strict accordion behavior
            document.querySelectorAll(".accordion-item").forEach(el => {
                el.classList.remove("active");
                el.querySelector(".accordion-header").setAttribute("aria-expanded", "false");
                const b = el.querySelector(".accordion-body");
                b.style.maxHeight = null;
            });

            if (!isCurrentlyActive) {
                item.classList.add("active");
                this.setAttribute("aria-expanded", "true");
                body.style.maxHeight = body.scrollHeight + "px";
            }
        });
    });
}

/**
 * 6. Active ScrollSpy Track - Highlights current layout tier active node on Navbar links
 */
function initScrollSpy() {
    const sections = document.querySelectorAll("section, header");
    const navLinks = document.querySelectorAll(".nav-link");

    if (sections.length === 0 || navLinks.length === 0) return;

    window.addEventListener("scroll", () => {
        let currentSectionId = "";
        const scrollPosition = window.scrollY + 120; // threshold offset

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute("id");
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove("active");
                if (link.getAttribute("href") === `#${currentSectionId}`) {
                    link.classList.add("active");
                }
            });
        }
    });
}

/**
 * 7. Dynamic Software Build Target Version Count-Up Micro Animation
 */
function triggerCounterAnimation() {
    const versionNodes = document.querySelectorAll(".counter-version");
    if (versionNodes.length === 0) return;
    
    let currentVal = 0.0;
    const targetVal = 1.0; 
    
    const interval = setInterval(() => {
        currentVal += 0.1;
        if (currentVal >= targetVal) {
            versionNodes.forEach(node => {
                node.textContent = "1.0.4"; // Set final target version tag
            });
            clearInterval(interval);
        } else {
            versionNodes.forEach(node => {
                node.textContent = currentVal.toFixed(1) + ".0";
            });
        }
    }, 60);
}

/**
 * 8. Copy email to clipboard utility with interactive feedback
 */
function initEmailCopy() {
    const copyBtns = document.querySelectorAll(".copy-email-btn");
    
    copyBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const email = btn.getAttribute("data-email");
            if (!email) return;

            navigator.clipboard.writeText(email).then(() => {
                // Visual feedback
                const icon = btn.querySelector("i");
                if (icon) {
                    icon.className = "fa-solid fa-check";
                    btn.classList.add("copied");
                    btn.setAttribute("title", "Đã sao chép!");
                    
                    setTimeout(() => {
                        icon.className = "fa-regular fa-copy";
                        btn.classList.remove("copied");
                        btn.setAttribute("title", "Sao chép email");
                    }, 2000);
                }
            }).catch(err => {
                console.error("Failed to copy email: ", err);
            });
        });
    });
}