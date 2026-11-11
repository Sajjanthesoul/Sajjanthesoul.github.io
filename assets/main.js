(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Accessible mobile navigation
  const menu = document.querySelector(".menu");
  const nav = document.querySelector(".navlinks");
  const closeMenu = () => {
    if (!menu || !nav) return;
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-label", "Open navigation");
  };
  if (menu && nav) {
    menu.addEventListener("click", () => {
      const open = !nav.classList.contains("open");
      nav.classList.toggle("open", open);
      menu.setAttribute("aria-expanded", String(open));
      menu.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
    document.addEventListener("click", event => {
      if (!nav.contains(event.target) && !menu.contains(event.target)) closeMenu();
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        closeMenu();
        menu.focus();
      }
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 700) closeMenu();
    });
  }

  // Scroll progress indicator
  const progress = document.querySelector(".scroll-progress");
  let ticking = false;
  const updateProgress = () => {
    if (!progress) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const amount = max > 0 ? (window.scrollY / max) * 100 : 0;
    progress.style.width = amount + "%";
    ticking = false;
  };
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }, { passive: true });
  updateProgress();

  // Reveal content as it enters the viewport
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("visible"));
  }

  // Rotating focus line — keeps the wording factual and skill-based
  const role = document.getElementById("rotatingRole");
  if (role && !reduceMotion) {
    const roles = [
      "PHP & Laravel Development",
      "WordPress & WooCommerce",
      "MySQL & Web Applications",
      "Three.js & Interactive 3D"
    ];
    let index = 0;
    window.setInterval(() => {
      role.classList.add("role-changing");
      window.setTimeout(() => {
        index = (index + 1) % roles.length;
        role.textContent = roles[index];
        role.classList.remove("role-changing");
      }, 180);
    }, 2800);
  }

  // Project category filters
  const filters = document.querySelectorAll(".filter");
  const projects = document.querySelectorAll(".project[data-category]");
  filters.forEach(button => {
    button.addEventListener("click", () => {
      const selected = button.dataset.filter;
      filters.forEach(item => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      projects.forEach(project => {
        const show = selected === "all" || project.dataset.category === selected;
        project.classList.toggle("hidden", !show);
      });
    });
  });

  // Gentle pointer parallax on the hero artwork (desktop only)
  const art = document.querySelector(".hero-art");
  if (art && window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reduceMotion) {
    art.addEventListener("pointermove", event => {
      const rect = art.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      art.style.setProperty("--pointer-x", (x * 9).toFixed(2) + "px");
      art.style.setProperty("--pointer-y", (y * 9).toFixed(2) + "px");
    });
    art.addEventListener("pointerleave", () => {
      art.style.setProperty("--pointer-x", "0px");
      art.style.setProperty("--pointer-y", "0px");
    });
  }
})();