(function () {
  const id = new URLSearchParams(location.search).get("case");
  const idx = Math.max(0, CASES.findIndex((c) => c.id === id));
  const c = CASES[idx];

  document.documentElement.style.setProperty("--case-accent", c.accent);
  document.title = `${c.client} — кейс · ${SITE.name}`;

  $("#caseEyebrow").textContent = c.platforms.join(" · ");
  $("#caseTitle").textContent = c.client;
  $("#caseNiche").textContent = noWidows(c.niche);
  $("#caseMeta").innerHTML = `
    <div>Период<b>${esc(c.period)}</b></div>
    <div>Срок работы<b>${esc(c.duration)}</b></div>
    <div>Площадки<b>${esc(c.platforms.join(", "))}</b></div>
    ${c.agency ? `<div>Формат<b>в составе агентства</b></div>` : ""}`;

  $("#caseBig").innerHTML = `<span class="v">${esc(c.hero.value)}</span><span class="l">${esc(noWidows(c.hero.label))}</span>`;
  $("#metricPanel").innerHTML = c.metrics.map((m) =>
    `<div class="metric-card reveal"><span class="m-label">${esc(m.l)}</span><span class="m-value">${esc(m.v)}</span></div>`).join("");

  $("#caseTask").textContent = noWidows(c.task);
  $("#caseDone").innerHTML = c.done.map((d) => `<li>${esc(noWidows(d))}</li>`).join("");
  $("#caseResults").innerHTML = c.results.map((d) => `<li>${esc(noWidows(d))}</li>`).join("");
  if (c.beforeAfter) $("#caseBA").innerHTML = baHTML(c.beforeAfter);
  else $("#baBlock").remove();
  $("#caseInsight p").textContent = noWidows(c.insight);

  const prev = CASES[(idx - 1 + CASES.length) % CASES.length];
  const next = CASES[(idx + 1) % CASES.length];
  $("#prevCase").href = `case.html?case=${encodeURIComponent(prev.id)}`;
  $("#prevCase").textContent = `← ${prev.client}`;
  $("#nextCase").href = `case.html?case=${encodeURIComponent(next.id)}`;
  $("#nextCase").textContent = `${next.client} →`;

  observeReveals();
})();
