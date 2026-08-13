document.documentElement.classList.add("js");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const banner = document.querySelector(".banner");
const menuButton = document.querySelector(".menu-icon");
let lastScrollTop = 0;

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  banner.classList.toggle("shrink", scrollTop >= 100);
  banner.classList.toggle("hidden", scrollTop > lastScrollTop && scrollTop > 100 && !document.body.classList.contains("menu-active"));
  lastScrollTop = Math.max(scrollTop, 0);
}, { passive: true });

menuButton.addEventListener("click", () => {
  const open = document.body.classList.toggle("menu-active");
  menuButton.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll(".dropdown-toggle").forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const dropdown = toggle.closest(".nav-dropdown");
    const open = !dropdown.classList.contains("open");
    document.querySelectorAll(".nav-dropdown.open").forEach((item) => {
      item.classList.remove("open");
      item.querySelector(".dropdown-toggle").setAttribute("aria-expanded", "false");
    });
    dropdown.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".nav-dropdown")) {
    document.querySelectorAll(".nav-dropdown.open").forEach((item) => {
      item.classList.remove("open");
      item.querySelector(".dropdown-toggle").setAttribute("aria-expanded", "false");
    });
  }
});

document.querySelectorAll("[data-btn-split] .btn-text").forEach((element) => {
  const text = element.textContent.trim();
  element.closest("[data-btn-split]").setAttribute("aria-label", text);
  const characters = Array.from(text).map((character) => character === " " ? "\u00a0" : character);
  const makeRow = (className) => {
    const row = document.createElement("span");
    row.className = `btn-row ${className}`;
    characters.forEach((character, index) => {
      const span = document.createElement("span");
      span.className = "char";
      span.textContent = character;
      span.style.transitionDelay = `${index * 18}ms`;
      row.appendChild(span);
    });
    return row;
  };
  element.textContent = "";
  element.append(makeRow("is-top"), makeRow("is-under"));
});

if (!reduceMotion && window.gsap && window.ScrollTrigger && window.SplitType) {
  gsap.registerPlugin(ScrollTrigger);
  document.querySelectorAll(".reveal-type").forEach((heading) => {
    const text = new SplitType(heading, { types: "chars, words" });
    gsap.from(text.chars, {
      scrollTrigger: {
        trigger: heading,
        start: "top 80%",
        end: "top 40%",
        scrub: true,
        markers: false
      },
      opacity: 0.2,
      stagger: 0.1
    });
  });
}

document.getElementById("year").textContent = new Date().getFullYear();
