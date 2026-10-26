(function () {
  let activePlatform = "all";
  let activeNiche = "all";

  /* Заголовок с подсветкой слова */
  const title = esc(noWidows(SITE.heroTitle)).replace(/\n/g, "<br>");
  $("#heroTitle").innerHTML = SITE.heroHighlight
    ? title.replace(esc(noWidows(SITE.heroHighlight)), `<span class="accent-word">${esc(noWidows(SITE.heroHighlight))}</span>`)
    : title;
  document.title = `${SITE.name} — ${SITE.tagline}`;

  /* Фото или инициалы */
  const frame = $("#photoFrame");
  const img = new Image();
  img.alt = SITE.name;
  img.onload = () => frame.appendChild(img);
  img.onerror = () => { frame.classList.add("is-empty"); frame.textContent = SITE.name.split(" ").map((w) => w[0]).join("").slice(0, 2); };
  img.src = SITE.photo;

  /* Карточка с цифрами */
  $("#tiltRows").innerHTML = SITE.stats.map((s) =>
    `<div class="tilt-row"><span class="value${s.accent ? " accent" : ""}">${esc(s.v)}</span><span class="label">${esc(s.l)}</span></div>`).join("");

  /* 3D-наклон карточки за курсором */
  const wrap = $("#heroVisual"), card = $("#tiltCard");
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    wrap.addEventListener("mousemove", (e) => {
      const r = wrap.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
    });
    wrap.addEventListener("mouseleave", () => (card.style.transform = ""));
  }

  /* Бегущая строка */
  const items = CASES.map((c) => `<span>${esc(c.client)} — <b>${esc(c.hero.value)}</b></span>`).join("");
  $("#tickerTrack").innerHTML = items + items;

  /* О себе и ниши */
  $("#aboutBody").innerHTML = SITE.about.map((p) => `<p>${esc(noWidows(p))}</p>`).join("");
  $("#nicheTags").innerHTML = SITE.niches.map((n) => `<span class="tag">${esc(n)}</span>`).join("");
  $("#skillTags").innerHTML = SITE.skills.map((n) => `<span class="tag">${esc(n)}</span>`).join("");
  $("#painList").innerHTML = SITE.pains.map((p) => `<li>«${esc(p)}»</li>`).join("");
  if (SITE.photo2) $("#aboutPhoto").innerHTML = `<img src="${esc(SITE.photo2)}" alt="${esc(SITE.name)}" loading="lazy" onerror="this.parentNode.remove()">`;
  else $("#aboutPhoto").remove();

  /* Подход */
  $("#processList").innerHTML = SITE.process.map((s, i) =>
    `<li class="reveal"><i>0${i + 1}</i><b>${esc(s.t)}</b><span>${esc(noWidows(s.d))}</span></li>`).join("");

  /* Площадки */
  $("#platformGrid").innerHTML = PLATFORMS.map((p) => {
    const n = CASES.filter((c) => c.platforms.includes(p.name)).length;
    return `<div class="platform-badge" style="--p1:${p.c1};--p2:${p.c2}">
      <span class="platform-dot"></span><span>${esc(p.name)}</span>
      <small>${n} ${plural(n, ["кейс", "кейса", "кейсов"])}</small></div>`;
  }).join("");

  $("#casesTitle").textContent = `${CASES.length} ${plural(CASES.length, ["кейс", "кейса", "кейсов"])}, разные ниши, один подход к цифрам`;

  /* Фильтры */
  function renderFilters() {
    const plats = [{ id: "all", label: "Все" }, ...PLATFORMS.filter((p) => CASES.some((c) => c.platforms.includes(p.name))).map((p) => ({ id: p.name, label: p.name }))];
    const niches = [{ id: "all", label: "Все" }, ...NICHES.filter((n) => CASES.some((c) => c.category === n.id))];
    $("#platformFilters").innerHTML = `<span class="filter-group-label">Площадка</span>` +
      plats.map((p) => `<button class="filter-btn${p.id === activePlatform ? " active" : ""}" data-p="${esc(p.id)}">${esc(p.label)}</button>`).join("");
    $("#nicheFilters").innerHTML = `<span class="filter-group-label">Ниша</span>` +
      niches.map((n) => `<button class="filter-btn${n.id === activeNiche ? " active" : ""}" data-n="${esc(n.id)}">${esc(n.label)}</button>`).join("");
  }
  $(".filter-block").addEventListener("click", (e) => {
    const b = e.target.closest(".filter-btn"); if (!b) return;
    if (b.dataset.p) activePlatform = b.dataset.p;
    if (b.dataset.n) activeNiche = b.dataset.n;
    renderFilters(); renderCases();
  });

  /* Карточки кейсов */
  function renderCases() {
    const list = CASES.filter((c) =>
      (activePlatform === "all" || c.platforms.includes(activePlatform)) &&
      (activeNiche === "all" || c.category === activeNiche));
    const grid = $("#caseGrid");
    if (!list.length) { grid.innerHTML = `<div class="empty-state">Кейсов с таким сочетанием фильтров пока нет.</div>`; return; }
    grid.innerHTML = list.map((c) => `
      <a href="case.html?case=${encodeURIComponent(c.id)}" class="case-card reveal" style="--ca:${c.accent}">
        <div class="case-card-top">
          <div class="case-platforms">${c.platforms.map((p) => `<span class="case-platform"><i style="background:${platformColor(p)}"></i>${esc(p)}</span>`).join("")}</div>
          ${c.agency ? `<span class="case-agency">в агентстве</span>` : `<span class="case-niche-dot"></span>`}
        </div>
        <div>
          <h3>${esc(c.client)}</h3>
          <div class="niche">${esc(noWidows(c.niche))}</div>
        </div>
        <div class="case-hero-metric">
          <span class="v">${esc(c.hero.value)}</span>
          <span class="l">${esc(noWidows(c.hero.label))}</span>
        </div>
        ${c.metrics.slice(0, 2).map((m) => `<div class="case-metric-row"><span class="m-label">${esc(m.l)}</span><span class="m-value">${esc(m.v)}</span></div>`).join("")}
        <div class="case-card-cta">Открыть кейс <span class="arrow">→</span></div>
      </a>`).join("");
    observeReveals();
  }

  renderFilters();
  renderCases();
  observeReveals();
})();
