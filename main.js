document.addEventListener("DOMContentLoaded", () => {
  // ===== Matrix setup backgroound =====
  const canvas = document.getElementById("matrix");
  const ctx = canvas.getContext("2d");
  let fontSize = 16;
  let letters = "01ABCDEF$#%&*+-<>".split("");
  let columns;
  let drops;

  function setupCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops = Array(columns).fill(1);
  }

  function hexToRgba(hex, alpha = 1) {
    const [r, g, b] = hex.match(/\w\w/g).map((x) => parseInt(x, 16));
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function draw() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const isLight = currentTheme === "#f2f1e7" || currentTheme === "#f5f5dc";
    const styles = getComputedStyle(document.documentElement);
    const bgColor = styles.getPropertyValue("--bg-color").trim();
    ctx.fillStyle = hexToRgba(bgColor, 0.05);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = isLight ? "#004d66" : "#00ffff";
    ctx.font = fontSize + "px monospace";
    for (let i = 0; i < drops.length; i++) {
      const text = letters[Math.floor(Math.random() * letters.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975)
        drops[i] = 0;
      drops[i]++;
    }
  }

  setupCanvas();
  let animationInterval = setInterval(draw, 35);
  window.addEventListener("resize", setupCanvas);

  //  Theme toggle
  const themeSwitcher = document.getElementById("themeSwitcher");
  if (localStorage.getItem("theme") === "#f2f1e7") {
    document.documentElement.setAttribute("data-theme", "#f2f1e7");
    themeSwitcher.checked = true;
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    themeSwitcher.checked = false;
  }

  themeSwitcher.addEventListener("change", () => {
    if (themeSwitcher.checked) {
      document.documentElement.setAttribute("data-theme", "#f2f1e7");
      localStorage.setItem("theme", "#f2f1e7");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    }
    clearInterval(animationInterval);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    animationInterval = setInterval(draw, 35);
  });

  // ===== Navbar smooth scroll & active link =====
  const navlinks = document.querySelectorAll(".nav-links a");
  const navLinksContainer = document.getElementById("nav-links");

  function removeActive() {
    navlinks.forEach((l) => {
      l.classList.remove("active");
      l.style.textShadow = "none";
    });
  }

  navlinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      target.scrollIntoView({ behavior: "smooth" });
      removeActive();
      link.classList.add("active");
      link.style.textShadow = "0 0 5px var(--secondary-color)";
      navLinksContainer.classList.remove("show");
    });
  });

  window.addEventListener("scroll", () => {
    let scrollPos = window.scrollY + 100;
    navlinks.forEach((link) => {
      const section = document.querySelector(link.getAttribute("href"));
      if (
        section &&
        section.offsetTop <= scrollPos &&
        section.offsetTop + section.offsetHeight > scrollPos
      ) {
        removeActive();
        link.classList.add("active");
        link.style.textShadow = "0 0 5px var(--secondary-color)";
      }
    });
  });

  //  Search button
  const searchInput = document.querySelector(".nav-search input");
  const searchButton = document.querySelector(".nav-search button");

  searchButton.addEventListener("click", () => {
    const query = searchInput.value.trim().toLowerCase();
    const sections = document.querySelectorAll("section, footer");
    let found = false;

    sections.forEach((sec) => {
      const idMatch = sec.id && sec.id.toLowerCase().includes(query);
      const heading = sec.querySelector("h1, h2, h3");
      const headingMatch =
        heading && heading.innerText.toLowerCase().includes(query);

      if (idMatch || headingMatch) {
        sec.scrollIntoView({ behavior: "smooth" });
        found = true;
      }
    });

    if (!found) alert("No matching section found!");
  });

  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") searchButton.click();
  });

  //Mobile menu toggle
  const menuToggle = document.getElementById("menu-toggle");
  menuToggle.addEventListener("click", () => {
    navLinksContainer.classList.toggle("show");
  });

  // hover for mobile tap
  document.querySelectorAll(".card, .box, .footer-links a").forEach((el) => {
    el.addEventListener("touchstart", () => el.classList.add("hovered"));
    el.addEventListener("touchend", () => el.classList.remove("hovered"));
  });
});
