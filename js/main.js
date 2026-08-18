const CONFIG = {
  whatsapp: "51999999999",
  brand: "B&M DualCore",
};

const diagData = {
  title: "¿Qué equipo necesita soporte?",
  options: [
    {
      label: "Computadora de escritorio",
      next: {
        title: "¿Qué está pasando?",
        options: [
          { label: "No enciende o se apaga sola", result: "hardware" },
          { label: "Va lenta o se traba", result: "mantenimiento" },
          { label: "Quiero armar o mejorar el PC", result: "ensamblaje" },
          { label: "Programas o Windows", result: "software" },
        ],
      },
    },
    {
      label: "Laptop",
      next: {
        title: "¿Qué está pasando?",
        options: [
          { label: "No carga o no enciende", result: "hardware" },
          { label: "Se calienta o va lenta", result: "mantenimiento" },
          { label: "Pantalla, teclado o wifi", result: "hardware" },
          { label: "Instalar programas o formato", result: "software" },
        ],
      },
    },
    {
      label: "Cámaras de seguridad",
      next: {
        title: "¿Qué necesitas?",
        options: [
          { label: "Instalar cámaras nuevas", result: "camaras" },
          { label: "No graban o no se ven", result: "camaras" },
          { label: "Verlas desde el celular", result: "camaras" },
        ],
      },
    },
    {
      label: "Red, WiFi u otro",
      next: {
        title: "¿Qué necesitas?",
        options: [
          { label: "Internet inestable", result: "redes" },
          { label: "Impresora o red de oficina", result: "redes" },
          { label: "Otro soporte TI", result: "general" },
        ],
      },
    },
  ],
};

const results = {
  hardware: {
    title: "Caso de hardware",
    text: "Lo más seguro es una revisión física: fuente, disco, memoria o sobrecalentamiento. DualCore diagnostica primero y te cotiza antes de cambiar piezas.",
    servicio: "Computadoras y laptops",
    tiempo: "Diagnóstico el mismo día, reparación según pieza.",
  },
  mantenimiento: {
    title: "Mantenimiento y rendimiento",
    text: "Suele resolverse con limpieza, SSD, más RAM o una puesta a punto del sistema. Es de los casos más rápidos si el equipo aún enciende.",
    servicio: "Mantenimiento",
    tiempo: "De 2 a 24 horas, según si es remoto o en banco.",
  },
  software: {
    title: "Software e instalación",
    text: "Instalamos, configuramos o reinstalamos lo necesario sin dejar el equipo lleno de programas de más. Si hay archivos, se resguarda primero.",
    servicio: "Instalación de programas",
    tiempo: "Remoto en muchas veces el mismo día.",
  },
  ensamblaje: {
    title: "Ensamblaje a medida",
    text: "Armamos el equipo con piezas compatibles y lo entregamos probado: office, diseño o gaming. Te asesoramos el presupuesto antes de comprar.",
    servicio: "Ensamblaje de PCs",
    tiempo: "Cotización rápida. Armado según disponibilidad de piezas.",
  },
  camaras: {
    title: "Cámaras y vigilancia",
    text: "Revisamos cableado, DVR/NVR, red y app del celular. Si es instalación nueva, te proponemos puntos de cobertura antes de taladrar.",
    servicio: "Cámaras de seguridad",
    tiempo: "Visita de instalación o diagnóstico en sitio.",
  },
  redes: {
    title: "Redes y WiFi",
    text: "Mapeamos dónde se cae la señal, routers, repetidores y equipos compartidos. El objetivo es que trabaje toda la casa u oficina, no solo un rincón.",
    servicio: "Redes y WiFi",
    tiempo: "Ajuste remoto o visita corta, según el caso.",
  },
  general: {
    title: "Soporte TI general",
    text: "Cuéntanos el síntoma. Matías o Jesús toman el caso y el otro núcleo valida si hace falta una segunda mirada.",
    servicio: "Otro",
    tiempo: "Primera respuesta el mismo día hábil.",
  },
};

const header = document.getElementById("header");
const nav = document.getElementById("nav");
const menuBtn = document.getElementById("menuBtn");
const year = document.getElementById("year");
const diagOptions = document.getElementById("diagOptions");
const diagTitle = document.getElementById("diagTitle");
const diagLabel = document.getElementById("diagLabel");
const diagBar = document.getElementById("diagBar");
const diagResult = document.getElementById("diagResult");
const diagBack = document.getElementById("diagBack");
const diagReset = document.getElementById("diagReset");
const contactForm = document.getElementById("contactForm");
const formError = document.getElementById("formError");

year.textContent = new Date().getFullYear();

const diagState = {
  step: 1,
  node: diagData,
  history: [],
  equipo: "",
  detalle: "",
};

function whatsappUrl(text) {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
}

function renderDiag() {
  const isResult = Boolean(diagState.result);
  diagLabel.textContent = isResult ? "Recomendación DualCore" : `Paso ${diagState.step} de 3`;
  diagBar.style.width = `${(diagState.step / 3) * 100}%`;
  diagTitle.textContent = isResult ? results[diagState.result].title : diagState.node.title;
  diagBack.hidden = diagState.history.length === 0 || isResult;
  diagReset.hidden = !isResult;
  diagResult.classList.toggle("hidden", !isResult);
  diagOptions.classList.toggle("hidden", isResult);
  diagOptions.innerHTML = "";

  if (isResult) {
    const data = results[diagState.result];
    diagResult.innerHTML = `
      <p>${data.text}</p>
      <p><strong>Tiempo estimado:</strong> ${data.tiempo}</p>
      <a class="btn btn-primary" target="_blank" rel="noopener" href="${whatsappUrl(
        `Hola ${CONFIG.brand}, hice el diagnóstico DualCore.\nEquipo: ${diagState.equipo}\nDetalle: ${diagState.detalle}\nNecesito ayuda con: ${data.servicio}.`
      )}">Continuar por WhatsApp</a>
    `;
    return;
  }

  diagState.node.options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = option.label;
    button.addEventListener("click", () => chooseOption(option));
    diagOptions.appendChild(button);
  });
}

function chooseOption(option) {
  diagState.history.push({
    node: diagState.node,
    step: diagState.step,
    equipo: diagState.equipo,
    detalle: diagState.detalle,
  });

  if (diagState.step === 1) diagState.equipo = option.label;
  if (diagState.step === 2) diagState.detalle = option.label;

  if (option.result) {
    diagState.result = option.result;
    diagState.step = 3;
  } else {
    diagState.node = option.next;
    diagState.step += 1;
  }
  renderDiag();
}

diagBack.addEventListener("click", () => {
  const prev = diagState.history.pop();
  if (!prev) return;
  diagState.node = prev.node;
  diagState.step = prev.step;
  diagState.equipo = prev.equipo;
  diagState.detalle = prev.detalle;
  diagState.result = null;
  renderDiag();
});

diagReset.addEventListener("click", () => {
  diagState.step = 1;
  diagState.node = diagData;
  diagState.history = [];
  diagState.equipo = "";
  diagState.detalle = "";
  diagState.result = null;
  renderDiag();
});

renderDiag();

window.addEventListener("scroll", () => {
  header.classList.toggle("is-scrolled", window.scrollY > 8);
}, { passive: true });

menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  menuBtn.classList.toggle("is-open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    menuBtn.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded", "false");
  });
});

const counters = document.querySelectorAll("[data-count]");
const counterObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count);
    const duration = 1100;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - progress, 3)));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
    observer.unobserve(el);
  });
}, { threshold: 0.6 });

counters.forEach((el) => counterObserver.observe(el));

const quotes = [...document.querySelectorAll(".quote")];
const dotsWrap = document.getElementById("sliderDots");
let quoteIndex = 0;

quotes.forEach((_, index) => {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.setAttribute("aria-label", `Ver opinión ${index + 1}`);
  dot.addEventListener("click", () => showQuote(index));
  dotsWrap.appendChild(dot);
});

function showQuote(index) {
  quoteIndex = index;
  quotes.forEach((quote, i) => quote.classList.toggle("is-active", i === index));
  [...dotsWrap.children].forEach((dot, i) => dot.classList.toggle("is-active", i === index));
}

showQuote(0);
setInterval(() => showQuote((quoteIndex + 1) % quotes.length), 5600);

if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  document.querySelectorAll("[data-tilt]").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 10).toFixed(2)}deg) translateY(-4px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(contactForm));
  const fields = [...contactForm.querySelectorAll("input, select, textarea")];
  let valid = true;

  fields.forEach((field) => {
    const ok = field.checkValidity();
    field.classList.toggle("is-invalid", !ok);
    if (!ok) valid = false;
  });

  formError.classList.toggle("hidden", valid);
  if (!valid) return;

  const message = `Hola ${CONFIG.brand}, soy ${data.nombre}.
Teléfono: ${data.telefono}
Servicio: ${data.servicio}
Detalle: ${data.mensaje}`;

  window.open(whatsappUrl(message), "_blank", "noopener");
  contactForm.reset();
});
