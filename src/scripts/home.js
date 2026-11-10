const cleanups = {};

function register(name, init) {
  if (cleanups[name]) cleanups[name]();
  const dispose = init();
  cleanups[name] = typeof dispose === "function" ? dispose : () => {};
}

function prefersReduced() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* Header: hidden over the intro, appears on scroll with glass */
function initHeader() {
  const bar = document.getElementById("home-topbar");
  if (!bar) return;
  const update = () => {
    bar.classList.toggle("is-hidden", window.scrollY < window.innerHeight * 0.4);
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
  return () => window.removeEventListener("scroll", update);
}

/* Horizontal sticky work section */
function initHwork() {
  const section = document.querySelector("[data-hwork]");
  const track = document.getElementById("hwork-track");
  const bar = document.getElementById("hwork-bar");
  if (!section || !track) return;

  if (prefersReduced()) {
    section.classList.remove("is-active");
    section.style.height = "";
    track.style.transform = "";
    return;
  }

  let distance = 0;
  let ticking = false;

  const measure = () => {
    distance = Math.max(track.scrollWidth - window.innerWidth + 48, 0);
    section.style.height = `${window.innerHeight + distance}px`;
    section.classList.add("is-active");
  };

  const update = () => {
    ticking = false;
    if (!distance) return;
    const rect = section.getBoundingClientRect();
    const progress = Math.min(Math.max(-rect.top / distance, 0), 1);
    track.style.transform = `translate3d(${-progress * distance}px, 0, 0)`;
    if (bar) bar.style.transform = `scaleX(${progress})`;
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };

  const onResize = () => {
    measure();
    update();
  };

  measure();
  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);

  return () => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onResize);
  };
}

/* Parallax on [data-par] elements */
function initParallax() {
  const nodes = document.querySelectorAll("[data-par]");
  if (!nodes.length || prefersReduced()) return;

  let ticking = false;
  const update = () => {
    ticking = false;
    const vh = window.innerHeight;
    nodes.forEach((node) => {
      const rect = node.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - vh / 2;
      const speed = parseFloat(node.dataset.par || "0");
      node.style.transform = `translate3d(0, ${(-center * speed).toFixed(2)}px, 0)`;
    });
  };
  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };
  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  return () => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
  };
}

/* Split headings [data-split] into words and reveal on scroll (preserves nested markup) */
function initSplit() {
  const headings = document.querySelectorAll("[data-split]");
  if (!headings.length) return;
  if (prefersReduced()) {
    headings.forEach((heading) => heading.classList.add("in"));
    return;
  }

  const observers = [];

  headings.forEach((heading) => {
    if (!heading.dataset.splitDone) {
      const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
      const textNodes = [];
      while (walker.nextNode()) textNodes.push(walker.currentNode);

      textNodes.forEach((node) => {
        const words = (node.textContent || "").split(/(\s+)/);
        if (!words.some((part) => part.trim())) return;
        const frag = document.createDocumentFragment();
        words.forEach((part) => {
          if (!part.trim()) {
            frag.appendChild(document.createTextNode(part));
            return;
          }
          const wrap = document.createElement("span");
          wrap.className = "w";
          const inner = document.createElement("i");
          inner.textContent = part;
          wrap.appendChild(inner);
          frag.appendChild(wrap);
        });
        node.parentNode.replaceChild(frag, node);
      });

      heading.querySelectorAll(".w > i").forEach((inner, index) => {
        inner.style.transitionDelay = `${Math.min(index * 70, 520)}ms`;
      });
      heading.dataset.splitDone = "true";
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          heading.classList.add("in");
          observer.disconnect();
        }
      });
    }, { threshold: 0.4 });
    observer.observe(heading);
    observers.push(observer);
  });

  return () => observers.forEach((observer) => observer.disconnect());
}

/* Animated stat counters */
function initCounters() {
  const nodes = document.querySelectorAll(".stat-number");
  if (!nodes.length) return;
  const reduced = prefersReduced();
  const animate = (node) => {
    const target = Number(node.dataset.target || 0);
    if (reduced || node.dataset.raw === "true") {
      node.textContent = String(target);
      return;
    }
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      node.textContent = String(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(step);
      else node.textContent = String(target);
    };
    requestAnimationFrame(step);
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  nodes.forEach((node) => observer.observe(node));
  return () => observer.disconnect();
}

/* Periodic table */
function initStack() {
  const grid = document.getElementById("pt-grid");
  if (!grid) return;
  const familyLabels = {
    languages: "Lenguajes",
    frontend: "Front-end",
    backend: "Back-end / Plataformas",
    tools: "Herramientas",
    data: "Datos",
    concepts: "Conceptos",
  };
  const sym = document.getElementById("pt-sym");
  const name = document.getElementById("pt-name");
  const fam = document.getElementById("pt-fam");
  const used = document.getElementById("pt-used");

  const select = (el) => {
    grid.querySelectorAll(".pt-el").forEach((node) => node.classList.toggle("on", node === el));
    sym.textContent = el.dataset.symbol;
    name.textContent = el.dataset.name;
    fam.textContent = familyLabels[el.dataset.family] || el.dataset.family;
    used.innerHTML = "";
    (el.dataset.used || "").split("|").filter(Boolean).forEach((item) => {
      const li = document.createElement("li");
      li.className = "rounded-pill bg-accent-teal-soft px-3 py-1";
      li.textContent = item;
      used.appendChild(li);
    });
    sym.classList.remove("pop");
    void sym.offsetWidth;
    sym.classList.add("pop");
  };

  grid.querySelectorAll(".pt-el").forEach((el) => {
    el.addEventListener("mouseenter", () => select(el));
    el.addEventListener("focus", () => select(el));
    el.addEventListener("click", () => select(el));
  });

  const chips = document.querySelectorAll(".pt-chip");
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const filter = chip.dataset.filter;
      chips.forEach((c) => {
        const active = c === chip;
        c.setAttribute("aria-pressed", active ? "true" : "false");
        c.classList.toggle("bg-ink", active);
        c.classList.toggle("text-light", active);
        c.classList.toggle("bg-light/60", !active);
      });
      grid.querySelectorAll(".pt-el").forEach((el) => {
        el.classList.toggle("dim", filter !== "all" && el.dataset.family !== filter);
      });
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        grid.classList.add("in");
        observer.disconnect();
      }
    });
  }, { threshold: 0.15 });
  observer.observe(grid);
  return () => observer.disconnect();
}

/* Business card flip */
function initCard() {
  const card = document.getElementById("home-card");
  if (!card) return;
  const toggle = () => card.classList.toggle("flipped");
  const onClick = () => toggle();
  const onKey = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggle();
    }
  };
  card.addEventListener("click", onClick);
  card.addEventListener("keydown", onKey);
  return () => {
    card.removeEventListener("click", onClick);
    card.removeEventListener("keydown", onKey);
  };
}

/* Hero typewriter */
function initTyper() {
  const el = document.getElementById("home-typer");
  if (!el) return;
  const roles = ["front-end developer", "diseñador UX/UI", "full stack", "producto digital"];
  if (prefersReduced()) {
    el.textContent = roles[0];
    return;
  }
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;
  let timer = 0;
  const tick = () => {
    const current = roles[roleIndex];
    charIndex += deleting ? -1 : 1;
    el.textContent = current.slice(0, charIndex);
    let delay = deleting ? 45 : 85;
    if (!deleting && charIndex === current.length) {
      delay = 1600;
      deleting = true;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 350;
    }
    timer = window.setTimeout(tick, delay);
  };
  tick();
  return () => window.clearTimeout(timer);
}

/* About typed headline */
function initAboutTyped() {
  const el = document.getElementById("about-typed");
  if (!el) return;
  const full = el.dataset.type || "";
  if (prefersReduced()) {
    el.textContent = full;
    return;
  }
  let started = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || started) return;
      started = true;
      let i = 0;
      const type = () => {
        el.textContent = full.slice(0, i);
        i += 1;
        if (i <= full.length) window.setTimeout(type, 28);
      };
      type();
      observer.disconnect();
    });
  }, { threshold: 0.5 });
  observer.observe(el);
  return () => observer.disconnect();
}

/* Contact form */
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form || form.dataset.bound) return;
  form.dataset.bound = "true";
  const submit = document.getElementById("submit-btn");
  const text = document.getElementById("btn-text");
  const spinner = document.getElementById("btn-spinner");
  const error = document.getElementById("contact-error");

  const notify = async () => {
    try {
      await fetch("/.netlify/functions/lead-email", { method: "POST", body: new FormData(form) });
    } catch {
      /* Netlify Forms already captured the lead */
    }
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    error.classList.add("hidden");
    text.textContent = "Enviando…";
    spinner.classList.remove("hidden");
    submit.disabled = true;
    submit.setAttribute("aria-busy", "true");
    submit.classList.add("opacity-70", "cursor-not-allowed");
    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(new FormData(form)).toString(),
      });
      if (!response.ok) throw new Error("fail");
      await notify();
      window.location.href = "/gracias/";
    } catch {
      text.textContent = "Intentar de nuevo";
      error.classList.remove("hidden");
      spinner.classList.add("hidden");
      submit.disabled = false;
      submit.removeAttribute("aria-busy");
      submit.classList.remove("opacity-70", "cursor-not-allowed");
    }
  });
}

/* Marquee that inverts direction based on scroll direction */
function initMarqueeDirection() {
  const marquee = document.querySelector(".marquee");
  if (!marquee || prefersReduced()) return;
  let last = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    if (Math.abs(y - last) < 2) return;
    marquee.classList.toggle("is-up", y < last);
    last = y;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}

/* Project modal */
function initProjectModal() {
  const dialog = document.getElementById("project-modal");
  const dataEl = document.getElementById("projects-data");
  const cards = document.querySelectorAll("[data-project]");
  if (!dialog || !dataEl || !cards.length) return;

  let list = [];
  try {
    list = JSON.parse(dataEl.textContent || "[]");
  } catch {
    return;
  }
  const bySlug = new Map(list.map((item) => [item.slug, item]));
  const q = (id) => document.getElementById(id);
  const coverEl = q("pm-cover");
  const metaEl = q("pm-meta");
  const titleEl = q("pm-title");
  const challengeEl = q("pm-challenge");
  const solutionEl = q("pm-solution");
  const resultEl = q("pm-result");
  const badgeEl = q("pm-badge");
  const techEl = q("pm-tech");
  const externalEl = q("pm-external");
  const internalEl = q("pm-internal");
  const closeEl = q("pm-close");
  let lastTrigger = null;

  const fill = (data) => {
    coverEl.src = data.cover;
    coverEl.alt = data.title;
    badgeEl.textContent = String(data.year);
    metaEl.textContent = `${data.client} · ${data.category}`;
    titleEl.textContent = data.title;
    challengeEl.textContent = data.challenge || "";
    solutionEl.textContent = data.solution || "";
    resultEl.textContent = data.result || "";
    techEl.innerHTML = "";
    (data.technologies || []).forEach((tech) => {
      const span = document.createElement("span");
      span.textContent = tech;
      techEl.appendChild(span);
    });
    if (data.url) {
      externalEl.href = data.url;
      externalEl.hidden = false;
    } else {
      externalEl.hidden = true;
    }
    internalEl.href = `/projects/${data.slug}`;
  };

  const onClick = (event) => {
    const slug = event.currentTarget.dataset.project;
    const data = bySlug.get(slug);
    if (!data) return;
    event.preventDefault();
    lastTrigger = event.currentTarget;
    fill(data);
    if (typeof dialog.showModal === "function") dialog.showModal();
    else window.location.href = `/projects/${slug}`;
  };

  cards.forEach((card) => card.addEventListener("click", onClick));

  const onBackdrop = (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    const inside =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;
    if (!inside) dialog.close();
  };
  const onClose = () => {
    if (lastTrigger) lastTrigger.focus();
  };
  const close = () => dialog.close();

  closeEl.addEventListener("click", close);
  dialog.addEventListener("click", onBackdrop);
  dialog.addEventListener("close", onClose);

  return () => {
    cards.forEach((card) => card.removeEventListener("click", onClick));
    closeEl.removeEventListener("click", close);
    dialog.removeEventListener("click", onBackdrop);
    dialog.removeEventListener("close", onClose);
  };
}

function runHome() {
  register("header", initHeader);
  register("hwork", initHwork);
  register("marquee", initMarqueeDirection);
  register("parallax", initParallax);
  register("split", initSplit);
  register("counters", initCounters);
  register("stack", initStack);
  register("card", initCard);
  register("typer", initTyper);
  register("aboutTyped", initAboutTyped);
  register("projectModal", initProjectModal);
  register("contactForm", initContactForm);
}

document.addEventListener("astro:page-load", runHome);
runHome();
