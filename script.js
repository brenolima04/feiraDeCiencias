(function () {
  const photoInput = document.getElementById("photo-input");
  const gallery = document.getElementById("gallery");
  const modal = document.getElementById("modal");
  const modalImg = modal.querySelector("img");
  const modalClose = document.getElementById("modal-close");
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;
  const tips = document.querySelectorAll(".tip-card");

  // Photo upload preview
  function createPhotoThumbnail(file) {
    const img = document.createElement("img");
    img.className = "photo-thumb";
    img.tabIndex = 0;
    img.alt = file.name || "Foto da turma";
    img.setAttribute("role", "button");
    img.setAttribute("aria-label", "Abrir foto " + img.alt);

    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);

    img.addEventListener("click", () => openModal(img.src, img.alt));
    img.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(img.src, img.alt);
      }
    });

    return img;
  }

  function openModal(src, alt) {
    modalImg.src = src;
    modalImg.alt = alt;
    modal.classList.add("open");
    modal.focus();
  }

  function closeModal() {
    modal.classList.remove("open");
    modalImg.src = "";
    modalImg.alt = "";
  }

  modalClose.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  modal.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
    }
  });

  photoInput.addEventListener("change", (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const thumb = createPhotoThumbnail(file);
      gallery.appendChild(thumb);
    });
    photoInput.value = "";
  });

  // Theme toggle logic
  function setTheme(theme) {
    if (theme === "dark") {
      body.classList.add("dark");
      themeToggle.classList.add("dark");
      themeToggle.setAttribute("aria-pressed", "true");
      themeToggle.setAttribute("title", "Alternar para tema claro");
    } else {
      body.classList.remove("dark");
      themeToggle.classList.remove("dark");
      themeToggle.setAttribute("aria-pressed", "false");
      themeToggle.setAttribute("title", "Alternar para tema escuro");
    }
    localStorage.setItem("theme", theme);
  }

  themeToggle.addEventListener("click", () => {
    setTheme(body.classList.contains("dark") ? "light" : "dark");
  });

  // Init theme from localStorage or prefers-color-scheme
  (function initTheme() {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      setTheme("dark");
    } else if (saved === "light") {
      setTheme("light");
    } else {
      // detect system preference if no saved
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  })();

  // Keyboard accessible tips (toggle aria-pressed on click and keyboard)
  tips.forEach((tip) => {
    tip.addEventListener("click", () => {
      const pressed = tip.getAttribute("aria-pressed") === "true";
      tip.setAttribute("aria-pressed", String(!pressed));
    });
    tip.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        tip.click();
      }
    });
  });

  // Scroll to tips on CTA click
  const scrollBtn = document.getElementById("scrollToTips");
  scrollBtn.addEventListener("click", () => {
    document.getElementById("tips").scrollIntoView({ behavior: "smooth" });
    scrollBtn.blur();
  });
})();
