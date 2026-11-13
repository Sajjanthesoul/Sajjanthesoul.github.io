(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Load the focused backend portfolio styles without changing the existing design.
  const backendStyles = document.createElement("link");
  backendStyles.rel = "stylesheet";
  backendStyles.href = "assets/backend-section.css";
  document.head.appendChild(backendStyles);

  // Make the PHP / Laravel experience easy for recruiters to find.
  const nav = document.querySelector(".navlinks");
  if (nav && !nav.querySelector('a[href="#backend"]')) {
    const backendLink = document.createElement("a");
    backendLink.href = "#backend";
    backendLink.textContent = "PHP Work";
    const workLink = nav.querySelector('a[href="#work"]');
    if (workLink) workLink.insertAdjacentElement("afterend", backendLink);
    else nav.prepend(backendLink);
  }

  // A truthful backend-focused overview, based on professional experience.
  const modelsSection = document.getElementById("models");
  if (modelsSection && !document.getElementById("backend")) {
    const section = document.createElement("section");
    section.id = "backend";
    section.className = "section backend-section";
    section.innerHTML = `
      <div class="wrap">
        <div class="section-heading">
          <div><p class="eyebrow">02 / PHP & BACKEND EXPERIENCE</p><h2>Built for real<br><em>business workflows.</em></h2></div>
          <p class="section-lead">My core professional work is PHP-based application development, database-backed systems and practical web platforms.</p>
        </div>
        <p class="backend-intro">Selected experience highlights. Some employer systems and client deliverables are private, so this section explains the engineering context without exposing confidential screens, data or source code.</p>
        <div class="backend-grid">
          <article class="backend-card backend-card-primary">
            <span class="backend-card-index">01 / HEALTHCARE SYSTEMS</span>
            <h3>Hospital Management Information System</h3>
            <p>Contributed to a PHP and MySQL healthcare information system, working on application maintenance, operational workflows, reporting and data-driven features across a multi-branch environment.</p>
            <div class="backend-card-meta"><span>PHP</span><span>MySQL</span><span>HMIS</span><span>Reporting</span></div>
          </article>
          <article class="backend-card">
            <span class="backend-card-index">02 / WEB DEVELOPMENT</span>
            <h3>Business Web Platforms</h3>
            <p>Professional web development experience covering website functionality, interface implementation and ongoing improvements within a software team.</p>
            <div class="backend-card-meta"><span>PHP</span><span>JavaScript</span><span>Web Development</span></div>
          </article>
          <article class="backend-card">
            <span class="backend-card-index">03 / CMS & COMMERCE</span>
            <h3>WordPress & WooCommerce</h3>
            <p>Built and customised content-managed websites and e-commerce experiences, with attention to maintainability, responsive behaviour and client requirements.</p>
            <div class="backend-card-meta"><span>WordPress</span><span>WooCommerce</span><span>ACF</span><span>Elementor</span></div>
          </article>
        </div>
        <p class="backend-foot">PRIMARY STACK: PHP · LARAVEL · MYSQL · WORDPRESS <a href="#contact">LET'S DISCUSS A PROJECT ↗</a></p>
      </div>`;
    modelsSection.parentNode.insertBefore(section, modelsSection);
  }

  // Correct public Fiverr seller profile destination.
  const fiverrLink = document.querySelector('.freelance-platform a[href*="fiverr.com"]');
  if (fiverrLink) fiverrLink.href = "https://www.fiverr.com/sajjan_web_pro";

  // Accessible mobile navigation
  const menu = document.querySelector(".menu");
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

  // Reveal content as it enters the viewport, including the injected backend section.
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