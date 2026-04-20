/* Uma Sacola — vanilla JS interactivity */
(function () {
  "use strict";

  /* =====================================================
     Pricing data (mirrors src/_data/products.js)
     ===================================================== */
  const PRICE_TABLE = {
    PP: { 50: 149.90, 100: 279.90, 500: 1349.90, 1000: 2599.90 },
    P:  { 50: 199.90, 100: 379.90, 500: 1799.90, 1000: 3499.90 },
    M:  { 50: 399.90, 100: 789.90, 500: 3845.90, 1000: 7490.90 },
    G:  { 50: 599.90, 100: 1179.90, 500: 5749.90, 1000: 11190.90 },
  };

  function priceFor(size, qty) {
    const table = PRICE_TABLE[size];
    const breakpoints = [50, 100, 500, 1000];
    if (qty <= 50) return (table[50] / 50) * qty;
    for (let i = 0; i < breakpoints.length - 1; i++) {
      const a = breakpoints[i], b = breakpoints[i + 1];
      if (qty >= a && qty <= b) {
        const pa = table[a] / a, pb = table[b] / b;
        const t = (qty - a) / (b - a);
        return (pa + (pb - pa) * t) * qty;
      }
    }
    return (table[1000] / 1000) * qty;
  }

  const ptNumber = (n) => Number(n).toLocaleString("pt-BR");
  const formatBRL = (v) => "R$ " + v.toFixed(2).replace(".", ",");

  /* =====================================================
     Catalog filter tabs
     ===================================================== */
  function initCatalog() {
    const tabsRoot = document.querySelector("[data-cat-tabs]");
    const grid = document.querySelector("[data-cat-grid]");
    if (!tabsRoot || !grid) return;

    const tabs = tabsRoot.querySelectorAll("[data-filter]");
    const cards = grid.querySelectorAll("[data-size]");

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const filter = tab.dataset.filter;
        tabs.forEach((t) => t.classList.toggle("active", t === tab));
        cards.forEach((card) => {
          const visible = filter === "Todos" || card.dataset.size === filter;
          card.style.display = visible ? "" : "none";
        });
      });
    });
  }

  /* =====================================================
     FAQ accordion
     ===================================================== */
  function initFaq() {
    const root = document.querySelector("[data-faq]");
    if (!root) return;
    const items = root.querySelectorAll("[data-faq-item]");
    items.forEach((item) => {
      const header = item.querySelector("[data-faq-toggle]");
      header.addEventListener("click", () => {
        const isOpen = item.classList.contains("open");
        items.forEach((i) => i.classList.remove("open"));
        if (!isOpen) item.classList.add("open");
      });
    });
  }

  /* =====================================================
     Quote calculator
     ===================================================== */
  function initCalculator() {
    const root = document.querySelector("[data-calc]");
    if (!root) return;

    const state = { size: "M", orientation: "Horizontal", qty: 250 };

    const sizeButtons = root.querySelectorAll("[data-size]");
    const orientButtons = root.querySelectorAll("[data-orientation]");
    const orientField = root.querySelector("[data-orient-field]");
    const presets = root.querySelectorAll("[data-preset]");

    const sizeVal = root.querySelector("[data-size-val]");
    const orientationVal = root.querySelector("[data-orientation-val]");
    const qtyVal = root.querySelector("[data-qty-val]");
    const previewImg = root.querySelector("[data-preview-img]");
    const summaryLine = root.querySelector("[data-summary-line]");
    const summaryQty = root.querySelector("[data-summary-qty]");
    const unitPrice = root.querySelector("[data-unit-price]");
    const totalInt = root.querySelector("[data-total-int]");
    const totalDec = root.querySelector("[data-total-dec]");
    const calcCta = root.querySelector("[data-from-calc]");

    function previewSrc() {
      const horiz = state.orientation === "Horizontal";
      switch (state.size) {
        case "PP": return "/images/sacola-pp-foto.jpeg";
        case "P":  return horiz ? "/images/sacola-p-horizontal-foto.jpeg" : "/images/sacola-p-vertical-foto.jpeg";
        case "M":  return horiz ? "/images/sacola-m-horizontal-foto.jpeg" : "/images/sacola-m-hero.jpeg";
        case "G":  return "/images/sacola-m-hero.jpeg";
        default:   return "/images/sacola-m-hero.jpeg";
      }
    }

    function render() {
      const total = priceFor(state.size, state.qty);
      const unit = total / state.qty;
      const [intPart, decPart] = total.toFixed(2).split(".");

      sizeVal.textContent = state.size;
      if (orientationVal) orientationVal.textContent = state.orientation;
      qtyVal.textContent = ptNumber(state.qty) + " un.";
      previewImg.src = previewSrc();

      summaryLine.textContent = "Sacola " + state.size + (state.size !== "PP" ? " · " + state.orientation : "");
      summaryQty.textContent = ptNumber(state.qty);
      unitPrice.textContent = formatBRL(unit);
      totalInt.textContent = ptNumber(Number(intPart));
      totalDec.textContent = decPart;

      if (orientField) orientField.style.display = state.size === "PP" ? "none" : "";

      sizeButtons.forEach((b) => b.classList.toggle("active", b.dataset.size === state.size));
      orientButtons.forEach((b) => b.classList.toggle("active", b.dataset.orientation === state.orientation));
      presets.forEach((b) => b.classList.toggle("active", Number(b.dataset.preset) === state.qty));

      if (calcCta) {
        calcCta.dataset.presetSize = state.size;
        calcCta.dataset.presetOrientation = state.size === "PP" ? "" : state.orientation;
        calcCta.dataset.presetQty = String(state.qty);
        calcCta.dataset.presetTotal = total.toFixed(2);
        calcCta.dataset.presetUnit = unit.toFixed(2);
      }
    }

    sizeButtons.forEach((b) => {
      b.addEventListener("click", () => {
        state.size = b.dataset.size;
        render();
      });
    });
    orientButtons.forEach((b) => {
      b.addEventListener("click", () => {
        state.orientation = b.dataset.orientation;
        render();
      });
    });
    presets.forEach((b) => {
      b.addEventListener("click", () => {
        state.qty = Number(b.dataset.preset);
        render();
      });
    });

    render();
  }

  /* =====================================================
     Mockup generator
     ===================================================== */
  const BAG_PHOTOS = {
    PP: { src: "/images/bag-pp2.jpeg",  w: 800, h: 1220, logo: { x: 260, y: 540, w: 360, h: 460 }, dims: "10 × 17 × 3,5 cm" },
    P:  { src: "/images/bag-p2.jpeg",   w: 560, h: 1060, logo: { x: 150, y: 450, w: 300, h: 360 }, dims: "13,5 × 20 × 5 cm" },
    M:  { src: "/images/bag-m2.jpeg",   w: 650, h: 540,  logo: { x: 130, y: 220, w: 310, h: 200 }, dims: "28 × 20 × 10 cm" },
  };
  const BAG_COLORS = {
    white: { tint: "none" },
    kraft: { tint: "sepia(0.55) saturate(1.15) hue-rotate(-10deg) brightness(0.92)" },
    navy:  { tint: "brightness(0.35) contrast(1.4) hue-rotate(195deg) saturate(2.5)" },
    black: { tint: "brightness(0.25) contrast(1.2) grayscale(0.9)" },
  };

  function initMockup() {
    const root = document.querySelector("[data-mockup]");
    if (!root) return;

    const state = { size: "M", color: "white", scale: 1, logoSrc: null, logoName: "" };

    const drop = root.querySelector("[data-drop]");
    const fileInput = root.querySelector("[data-file-input]");
    const emptyState = root.querySelector("[data-empty-state]");
    const loadedState = root.querySelector("[data-loaded-state]");
    const logoThumb = root.querySelector("[data-logo-thumb]");
    const logoName = root.querySelector("[data-logo-name]");
    const clearBtn = root.querySelector("[data-clear-logo]");
    const sizeButtons = root.querySelectorAll("[data-mockup-size]");
    const colorButtons = root.querySelectorAll("[data-mockup-color]");
    const scaleSlider = root.querySelector("[data-scale-slider]");
    const scaleVal = root.querySelector("[data-scale-val]");
    const stage = root.querySelector("[data-bag-stage]");
    const bagBase = root.querySelector("[data-bag-base]");
    const bagLogo = root.querySelector("[data-bag-logo]");
    const placeholder = root.querySelector("[data-bag-placeholder]");
    const metaSize = root.querySelector("[data-meta-size]");
    const metaDims = root.querySelector("[data-meta-dims]");
    const downloadBtn = root.querySelector("[data-download]");
    const mockupCta = root.querySelector("[data-from-mockup]");

    function render() {
      const bag = BAG_PHOTOS[state.size];
      const colorDef = BAG_COLORS[state.color];

      stage.style.aspectRatio = bag.w + " / " + bag.h;
      bagBase.src = bag.src;
      bagBase.style.filter = colorDef.tint === "none" ? "none" : colorDef.tint;

      const logoW = bag.logo.w * state.scale;
      const logoH = bag.logo.h * state.scale;
      const logoX = bag.logo.x + (bag.logo.w - logoW) / 2;
      const logoY = bag.logo.y + (bag.logo.h - logoH) / 2;
      const isDark = state.color === "navy" || state.color === "black";

      const left = (logoX / bag.w) * 100 + "%";
      const top = (logoY / bag.h) * 100 + "%";
      const width = (logoW / bag.w) * 100 + "%";
      const height = (logoH / bag.h) * 100 + "%";

      if (state.logoSrc) {
        bagLogo.src = state.logoSrc;
        bagLogo.style.left = left;
        bagLogo.style.top = top;
        bagLogo.style.width = width;
        bagLogo.style.height = height;
        bagLogo.style.mixBlendMode = isDark ? "screen" : "multiply";
        bagLogo.hidden = false;
        placeholder.hidden = true;
      } else {
        bagLogo.hidden = true;
        placeholder.hidden = false;
        placeholder.style.left = (bag.logo.x / bag.w) * 100 + "%";
        placeholder.style.top = (bag.logo.y / bag.h) * 100 + "%";
        placeholder.style.width = (bag.logo.w / bag.w) * 100 + "%";
        placeholder.style.height = (bag.logo.h / bag.h) * 100 + "%";
        placeholder.style.color = isDark ? "rgba(255,255,255,0.6)" : "rgba(11,46,92,0.45)";
        placeholder.style.borderColor = isDark ? "rgba(255,255,255,0.35)" : "rgba(11,46,92,0.22)";
      }

      sizeButtons.forEach((b) => b.classList.toggle("active", b.dataset.mockupSize === state.size));
      colorButtons.forEach((b) => b.classList.toggle("active", b.dataset.mockupColor === state.color));
      scaleVal.textContent = String(Math.round(state.scale * 100));
      metaSize.textContent = state.size;
      metaDims.textContent = bag.dims;
      downloadBtn.disabled = !state.logoSrc;
    }

    function readFile(file) {
      if (!file || !file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        state.logoSrc = ev.target.result;
        state.logoName = file.name;
        logoThumb.src = state.logoSrc;
        logoName.textContent = state.logoName;
        emptyState.hidden = true;
        loadedState.hidden = false;
        render();
      };
      reader.readAsDataURL(file);
    }

    drop.addEventListener("click", () => fileInput.click());
    drop.addEventListener("dragover", (e) => { e.preventDefault(); drop.classList.add("over"); });
    drop.addEventListener("dragleave", () => drop.classList.remove("over"));
    drop.addEventListener("drop", (e) => {
      e.preventDefault();
      drop.classList.remove("over");
      if (e.dataTransfer.files && e.dataTransfer.files[0]) readFile(e.dataTransfer.files[0]);
    });
    fileInput.addEventListener("change", (e) => {
      if (e.target.files && e.target.files[0]) readFile(e.target.files[0]);
    });
    clearBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      state.logoSrc = null;
      state.logoName = "";
      fileInput.value = "";
      emptyState.hidden = false;
      loadedState.hidden = true;
      render();
    });
    sizeButtons.forEach((b) => b.addEventListener("click", () => { state.size = b.dataset.mockupSize; render(); }));
    colorButtons.forEach((b) => b.addEventListener("click", () => { state.color = b.dataset.mockupColor; render(); }));
    scaleSlider.addEventListener("input", (e) => { state.scale = Number(e.target.value); render(); });

    downloadBtn.addEventListener("click", () => {
      if (!state.logoSrc) return;
      const bag = BAG_PHOTOS[state.size];
      const colorDef = BAG_COLORS[state.color];
      const bagImg = new Image();
      bagImg.crossOrigin = "anonymous";
      bagImg.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = bag.w;
        canvas.height = bag.h;
        const ctx = canvas.getContext("2d");
        if (colorDef.tint !== "none") ctx.filter = colorDef.tint;
        ctx.drawImage(bagImg, 0, 0, bag.w, bag.h);
        ctx.filter = "none";
        const logoImg = new Image();
        logoImg.onload = () => {
          const lw = bag.logo.w * state.scale;
          const lh = bag.logo.h * state.scale;
          const lx = bag.logo.x + (bag.logo.w - lw) / 2;
          const ly = bag.logo.y + (bag.logo.h - lh) / 2;
          const isDark = state.color === "navy" || state.color === "black";
          ctx.globalCompositeOperation = isDark ? "screen" : "multiply";
          const ratio = Math.min(lw / logoImg.width, lh / logoImg.height);
          const fw = logoImg.width * ratio;
          const fh = logoImg.height * ratio;
          ctx.drawImage(logoImg, lx + (lw - fw) / 2, ly + (lh - fh) / 2, fw, fh);
          canvas.toBlob((blob) => {
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "uma-sacola-mockup-" + state.size.toLowerCase() + ".png";
            a.click();
          }, "image/png");
        };
        logoImg.src = state.logoSrc;
      };
      bagImg.src = bag.src;
    });

    if (mockupCta) {
      mockupCta.dataset.presetSize = state.size;
      mockupCta.dataset.presetOrientation = "Horizontal";
      mockupCta.dataset.presetQty = "100";
    }

    render();
  }

  /* =====================================================
     Examples carousel (Swiper)
     ===================================================== */
  function initExamples() {
    const el = document.querySelector("[data-examples-swiper]");
    if (!el || typeof window.Swiper === "undefined") return;
    new window.Swiper(el, {
      slidesPerView: "auto",
      spaceBetween: 18,
      loop: true,
      loopAdditionalSlides: 4,
      speed: 5000,
      allowTouchMove: true,
      grabCursor: true,
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      freeMode: {
        enabled: true,
        momentum: false,
      },
    });
  }

  /* =====================================================
     Testimonials carousel (Swiper)
     ===================================================== */
  function initTestimonialsCarousel() {
    const el = document.querySelector("[data-testimonials-swiper]");
    if (!el || typeof window.Swiper === "undefined") return;
    const swiper = new window.Swiper(el, {
      slidesPerView: 1.1,
      spaceBetween: 16,
      loop: true,
      centeredSlides: true,
      speed: 600,
      grabCursor: true,
      observer: true,
      observeParents: true,
      resizeObserver: true,
      watchOverflow: true,
      autoplay: {
        delay: 6500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      pagination: {
        el: el.querySelector(".swiper-pagination"),
        clickable: true,
      },
      navigation: {
        prevEl: el.querySelector(".swiper-button-prev"),
        nextEl: el.querySelector(".swiper-button-next"),
      },
      keyboard: { enabled: true },
      breakpoints: {
        560: { slidesPerView: 1.4, spaceBetween: 20, centeredSlides: true },
        820: { slidesPerView: 2.2, spaceBetween: 20, centeredSlides: true },
        1200: { slidesPerView: 3.2, spaceBetween: 24, centeredSlides: true },
        1600: { slidesPerView: 3.4, spaceBetween: 28, centeredSlides: true },
      },
      on: {
        afterInit(s) { requestAnimationFrame(() => s.update()); },
      },
    });
    const forceUpdate = () => swiper.update();
    if (document.readyState === "complete") {
      requestAnimationFrame(forceUpdate);
    } else {
      window.addEventListener("load", forceUpdate, { once: true });
    }
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(forceUpdate);
    }
  }

  /* =====================================================
     WhatsApp quote
     ===================================================== */
  const WHATSAPP_NUMBER = "5541987425892";

  function buildWhatsAppMessage(preset) {
    if (!preset || !preset.size) {
      return "Olá! Gostaria de pedir um orçamento de sacolas personalizadas.";
    }
    const lines = ["Olá! Gostaria de comprar:"];
    lines.push("• Modelo: Sacola " + preset.size);
    if (preset.orientation) lines.push("• Orientação: " + preset.orientation);
    if (preset.qty) lines.push("• Quantidade: " + ptNumber(Number(preset.qty)) + " un.");
    if (preset.unit) lines.push("• Valor por unidade: " + formatBRL(Number(preset.unit)));
    if (preset.total) lines.push("• Total estimado: " + formatBRL(Number(preset.total)));
    lines.push("", "Pode me passar prazo e formas de pagamento?");
    return lines.join("\n");
  }

  function openWhatsApp(preset) {
    const text = encodeURIComponent(buildWhatsAppMessage(preset));
    const url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + text;
    window.open(url, "_blank", "noopener");
  }

  function initWhatsApp() {
    document.querySelectorAll("[data-open-quote]").forEach((trigger) => {
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        const preset = {
          size: trigger.dataset.presetSize || null,
          orientation: trigger.dataset.presetOrientation || null,
          qty: trigger.dataset.presetQty || null,
          unit: trigger.dataset.presetUnit || null,
          total: trigger.dataset.presetTotal || null,
        };
        openWhatsApp(preset.size ? preset : null);
      });
    });
  }

  /* =====================================================
     Boot
     ===================================================== */
  document.addEventListener("DOMContentLoaded", () => {
    initCatalog();
    initFaq();
    initCalculator();
    initMockup();
    initExamples();
    initTestimonialsCarousel();
    initWhatsApp();
  });
})();
