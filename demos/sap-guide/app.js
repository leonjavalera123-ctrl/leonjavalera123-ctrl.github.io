/* ============================================================
   SAP S/4HANA IC Field Guide — interactions
   ============================================================ */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; };
  const esc = (s) => String(s).replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

  /* ---------------- DATA ---------------- */
  const TCODES = [
    { code: "MMBE", area: "Stock", desc: "Stock overview — one material across all locations & stock types.", fiori: "Stock – Single Material" },
    { code: "MB52", area: "Stock", desc: "Warehouse stock across many materials in a plant.", fiori: "Material Documents Overview" },
    { code: "MB51", area: "Docs", desc: "Material document list — a part's full movement history (your audit trail).", fiori: "Material Documents Overview" },
    { code: "MB03", area: "Docs", desc: "Display a single material document (one posting).", fiori: "Display Material Document" },
    { code: "MIGO", area: "Movement", desc: "The all-in-one goods movement screen — post any movement type here.", fiori: "Post Goods Movement" },
    { code: "MM03", area: "Master", desc: "Display the material master — what a part is.", fiori: "Display Material" },
    { code: "MI01", area: "Count", desc: "Create a physical inventory (count) document.", fiori: "Manage Physical Inventory" },
    { code: "MI04", area: "Count", desc: "Enter the counted quantity against a count document.", fiori: "Manage Physical Inventory" },
    { code: "MI20", area: "Count", desc: "List inventory differences — book vs counted.", fiori: "Manage Physical Inventory" },
    { code: "MI07", area: "Count", desc: "Post the difference — adjusts system stock (auto 701/702).", fiori: "Manage Physical Inventory" },
    { code: "CO03", area: "Quality", desc: "Display a production order — the as-built record of parts issued to a unit.", fiori: "Display Production Order" },
    { code: "CS03", area: "Quality", desc: "Display the BOM — what parts SHOULD be on the unit.", fiori: "Display Bill of Material" },
    { code: "IQ03", area: "Quality", desc: "Display a serial number — track one part individually.", fiori: "Serial Number" },
    { code: "MSC3", area: "Quality", desc: "Display a batch — track parts by lot.", fiori: "Manage Batches" },
  ];
  const MOVEMENTS = [
    { code: "101", rev: "102", fam: "Receipt", label: "Goods receipt for a purchase order." },
    { code: "201", rev: "202", fam: "Issue", label: "Goods issue to a cost center." },
    { code: "261", rev: "262", fam: "Issue", label: "Goods issue to a production order — parts going into a unit." },
    { code: "311", rev: "312", fam: "Transfer", label: "Transfer between storage locations (same plant)." },
    { code: "309", rev: "310", fam: "Transfer", label: "Material-to-material transfer (re-label part A as part B)." },
    { code: "321", rev: "322", fam: "Transfer", label: "Move Quality Inspection → Unrestricted (release inspected stock)." },
    { code: "343", rev: "344", fam: "Transfer", label: "Move Blocked → Unrestricted." },
    { code: "561", rev: "562", fam: "Receipt", label: "Initial stock entry when standing up a material." },
    { code: "601", rev: "602", fam: "Shipping", label: "Goods issue for an outbound delivery (shipping)." },
    { code: "701", rev: "702", fam: "Inventory", label: "Physical inventory gain / loss (auto-posted by MI07)." },
  ];
  const FAMILIES = { "1xx": "Receipt", "2xx": "Issue", "3xx": "Transfer", "6xx": "Shipping", "7xx": "Inventory" };
  const STOCK_TYPES = [
    { k: "ok", tag: "The good state", h: "Unrestricted", p: "Free to use or ship. Available for consumption and orders." },
    { k: "warn", tag: "Locked pending check", h: "Quality Inspection (QI)", p: "Physically there, but locked until QA releases it. Cannot be consumed yet." },
    { k: "bad", tag: "Quarantined", h: "Blocked", p: "On hold — damaged, suspect, or under investigation. Released only after sign-off." },
  ];
  const TROUBLE = [
    { sym: "Stock shows but can't be consumed", cause: "It's in QI or Blocked", fix: "Release with <span class='mono'>321</span> or <span class='mono'>343</span> after QA signs off" },
    { sym: "Part is in the wrong location", cause: "Stored in the wrong sloc", fix: "Transfer with <span class='mono'>311</span>" },
    { sym: "Count doesn't match the system", cause: "Physical vs book gap", fix: "Count cycle, post with <span class='mono'>MI07</span>" },
    { sym: "Wrong part number / mislabeled", cause: "Material mix-up", fix: "Material-to-material <span class='mono'>309</span>" },
    { sym: "Wrong part issued to an order", cause: "Bad 261 posting", fix: "Reverse <span class='mono'>262</span>, re-issue <span class='mono'>261</span>" },
    { sym: "Where did this qty go / who moved it?", cause: "Need the audit trail", fix: "List in <span class='mono'>MB51</span> by material + date" },
  ];
  const CHART_META = [
    { id: "chart1", name: "1 · Diagnose issue", cap: "Master triage — start here for almost any ticket; each branch routes to a specialized flow." },
    { id: "chart2", name: "2 · Release QI/Blocked", cap: "The QI/Blocked release flow, with the QA gate built in." },
    { id: "chart3", name: "3 · Cycle count", cap: "The count-and-reconcile loop, MI01 → MI07." },
    { id: "chart4", name: "4 · Parts-to-unit", cap: "Prove the as-built (CO03) matches the BOM (CS03)." },
    { id: "chart5", name: "5 · Movement router", cap: "Quick lookup — which movement type for which action." },
  ];

  /* ---------------- THEME ---------------- */
  const root = document.documentElement;
  try { const saved = localStorage.getItem("sap_theme"); if (saved) root.setAttribute("data-theme", saved); } catch (e) {}
  $("#themeToggle").addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("sap_theme", next); } catch (e) {}
  });

  /* ---------------- T-CODES ---------------- */
  const tcodeGrid = $("#tcodeGrid");
  function renderTcodes() {
    tcodeGrid.innerHTML = "";
    TCODES.forEach(t => {
      const c = el("button", "tcode");
      c.type = "button";
      c.dataset.area = t.area;
      c.dataset.search = (t.code + " " + t.desc + " " + t.fiori).toLowerCase();
      c.innerHTML = `<span class="tcode__copied">Copied ✓</span>
        <span class="tcode__top"><span class="tcode__code">${t.code}</span><span class="tcode__area">${t.area}</span></span>
        <span class="tcode__desc">${esc(t.desc)}</span>
        <span class="tcode__fiori"><b>Fiori:</b> ${esc(t.fiori)}</span>`;
      c.addEventListener("click", () => {
        navigator.clipboard?.writeText(t.code).catch(() => {});
        c.classList.add("copied");
        setTimeout(() => c.classList.remove("copied"), 1300);
      });
      tcodeGrid.appendChild(c);
    });
  }
  const AREAS = ["All", ...Array.from(new Set(TCODES.map(t => t.area)))];
  const tcodeFilter = $("#tcodeFilter");
  AREAS.forEach((a, i) => {
    const b = el("button", "filter-chip" + (i === 0 ? " is-active" : ""), a);
    b.type = "button";
    b.addEventListener("click", () => {
      $$(".filter-chip", tcodeFilter).forEach(x => x.classList.remove("is-active"));
      b.classList.add("is-active");
      $$(".tcode", tcodeGrid).forEach(card => {
        card.classList.toggle("is-hidden", a !== "All" && card.dataset.area !== a);
      });
    });
    tcodeFilter.appendChild(b);
  });
  renderTcodes();

  /* ---------------- MOVEMENTS ---------------- */
  const mvtGrid = $("#mvtGrid");
  MOVEMENTS.forEach(m => {
    const c = el("div", "mvt");
    c.id = "mvt-" + m.code;
    c.innerHTML = `<div class="mvt__head"><span class="mvt__code">${m.code}</span><span class="mvt__rev">⇄ ${m.rev}</span><span class="mvt__fam">${m.fam}</span></div>
      <div class="mvt__label">${esc(m.label)}</div>`;
    mvtGrid.appendChild(c);
  });

  /* ---------------- REVERSAL TOOL ---------------- */
  const revInput = $("#revInput"), revOut = $("#revOut");
  function lookupMovement(num) {
    let m = MOVEMENTS.find(x => x.code === num);
    let reversed = false;
    if (!m) { m = MOVEMENTS.find(x => x.rev === num); if (m) reversed = true; }
    return m ? { m, reversed } : null;
  }
  revInput.addEventListener("input", () => {
    const v = revInput.value.replace(/\D/g, "").slice(0, 3);
    revInput.value = v;
    if (v.length < 3) { revOut.innerHTML = `<p class="reversal-tool__hint">Enter a 3-digit movement type above.</p>`; return; }
    const hit = lookupMovement(v);
    if (!hit) {
      const fam = FAMILIES[v[0] + "xx"];
      revOut.innerHTML = `<p class="reversal-tool__hint">Not in the common list${fam ? ` — but <b>${v[0]}xx</b> means a <b>${fam}</b> movement. Its reversal is normally <b>${(parseInt(v) % 2 ? parseInt(v) + 1 : parseInt(v) - 1)}</b>.` : "."}</p>`;
      return;
    }
    const { m, reversed } = hit;
    const doCode = reversed ? m.rev : m.code, revCode = reversed ? m.code : m.rev;
    const lbl = reversed ? "Reversal of: " + m.label : m.label;
    revOut.innerHTML = `<p class="rev-name">${esc(lbl)}</p>
      <div class="rev-pair">
        <span class="chip chip--do">${doCode} · does it</span>
        <span class="arrow">→</span>
        <span class="chip chip--rev">${revCode} · reverses it</span>
        <span class="mvt__fam">${m.fam}</span>
      </div>`;
    const card = $("#mvt-" + m.code);
    if (card) { $$(".mvt").forEach(x => x.classList.remove("is-flash")); card.classList.add("is-flash"); }
  });

  /* ---------------- STOCK TYPE CARDS ---------------- */
  const stCards = $("#stockTypeCards");
  STOCK_TYPES.forEach(s => {
    stCards.appendChild(el("article", "stcard stcard--" + s.k,
      `<span class="stcard__tag">${s.tag}</span><h3>${s.h}</h3><p>${s.p}</p>`));
  });

  /* ---------------- TROUBLESHOOTING ---------------- */
  const tl = $("#troubleList");
  TROUBLE.forEach(t => {
    tl.appendChild(el("div", "trouble",
      `<div class="trouble__col trouble__col--sym"><span class="lbl">Symptom</span><span class="val">${esc(t.sym)}</span></div>
       <div class="trouble__col"><span class="lbl">Likely cause</span><span class="val">${esc(t.cause)}</span></div>
       <div class="trouble__col trouble__col--fix"><span class="lbl">Fix</span><span class="val">${t.fix}</span></div>`));
  });

  /* ---------------- SEARCH ---------------- */
  const search = $("#search"), results = $("#searchResults");
  const INDEX = [
    ...TCODES.map(t => ({ code: t.code, desc: t.desc, href: "#tcodes" })),
    ...MOVEMENTS.map(m => ({ code: m.code, desc: m.label, href: "#movements" })),
  ];
  search.addEventListener("input", () => {
    const q = search.value.trim().toLowerCase();
    if (!q) { results.hidden = true; return; }
    const hits = INDEX.filter(i => (i.code + " " + i.desc).toLowerCase().includes(q)).slice(0, 8);
    results.hidden = false;
    results.innerHTML = hits.length
      ? hits.map(h => `<a href="${h.href}"><span class="sr-code">${h.code}</span><span class="sr-desc">${esc(h.desc)}</span></a>`).join("")
      : `<div class="sr-empty">No match for “${esc(q)}”.</div>`;
  });
  $$("[data-focus-search]").forEach(b => b.addEventListener("click", () => { search.focus(); search.scrollIntoView({ block: "center" }); }));
  document.addEventListener("click", e => { if (!e.target.closest(".hero__search") && !e.target.closest(".search-results")) results.hidden = true; });
  results.addEventListener("click", () => { results.hidden = true; search.value = ""; });

  /* ---------------- STOCK SIMULATOR ---------------- */
  const START = () => ({
    "1000 / Main WH": { unr: 120, qi: 50, blk: 10 },
    "1000 / Line Side": { unr: 30, qi: 0, blk: 0 },
  });
  let stock = START();
  let undoStack = [];   // { mvt, undo } — real, reversible postings
  let log = [];         // { mvt, text, reversal } — display list
  const BUCKET = { unr: "Unrestricted", qi: "Quality Insp.", blk: "Blocked" };
  const simLocations = $("#simLocations"), simLoc = $("#simLoc"), simLog = $("#simLog"), simUndo = $("#simUndo");

  function renderStock(flash) {
    simLocations.innerHTML = "";
    Object.entries(stock).forEach(([name, b]) => {
      const loc = el("div", "sim__loc");
      loc.innerHTML = `<div class="sim__loc-name"><span class="dot"></span>${esc(name)}</div>
        <div class="sim__buckets">
          ${["unr", "qi", "blk"].map(k => `<div class="sim__bucket sim__bucket--${k}">
            <div class="sim__bucket-label">${BUCKET[k]}</div>
            <div class="sim__bucket-qty" data-q="${name}|${k}">${b[k]}</div></div>`).join("")}
        </div>`;
      simLocations.appendChild(loc);
    });
    if (flash) flash.forEach(key => { const n = $(`[data-q="${key}"]`); if (n) { n.classList.add("flash"); setTimeout(() => n.classList.remove("flash"), 700); } });
  }
  function renderLog() {
    simUndo.disabled = undoStack.length === 0;
    if (!log.length) { simLog.innerHTML = `<li class="sim__log-empty">No movements posted yet.</li>`; return; }
    simLog.innerHTML = log.slice().reverse().map(h =>
      `<li><span class="lg-mvt ${h.reversal ? "lg-rev" : ""}">${h.mvt}</span><span>${esc(h.text)}</span></li>`).join("");
  }
  function move(loc, from, to, qty, mvt, opts = {}) {
    const b = stock[loc];
    const amount = Math.min(qty, b[from]);
    if (amount <= 0 && !opts.allowZero) return false;
    b[from] -= amount; b[to] += amount;
    return amount;
  }
  function transfer(fromLoc, toLoc, bucket, qty) {
    const amount = Math.min(qty, stock[fromLoc][bucket]);
    if (amount <= 0) return 0;
    stock[fromLoc][bucket] -= amount; stock[toLoc][bucket] += amount;
    return amount;
  }
  const ACTIONS = [
    { mvt: "321", label: "Release QI → Unrestricted", run: (loc) => { const a = move(loc, "qi", "unr", 9999, "321"); return a ? { flash: [`${loc}|qi`, `${loc}|unr`], text: `Release ${a} QI → Unrestricted @ ${loc.split(" / ")[1]}`, rev: "322", undo: () => stock[loc] && (stock[loc].unr -= a, stock[loc].qi += a) } : null; } },
    { mvt: "343", label: "Release Blocked → Unrestricted", run: (loc) => { const a = move(loc, "blk", "unr", 9999, "343"); return a ? { flash: [`${loc}|blk`, `${loc}|unr`], text: `Release ${a} Blocked → Unrestricted @ ${loc.split(" / ")[1]}`, rev: "344", undo: () => (stock[loc].unr -= a, stock[loc].blk += a) } : null; } },
    { mvt: "344", label: "Block 10 Unrestricted", run: (loc) => { const a = move(loc, "unr", "blk", 10, "344"); return a ? { flash: [`${loc}|unr`, `${loc}|blk`], text: `Block ${a} Unrestricted @ ${loc.split(" / ")[1]}`, rev: "343", undo: () => (stock[loc].blk -= a, stock[loc].unr += a) } : null; } },
    { mvt: "311", label: "Transfer 20 → other location", run: (loc) => { const other = Object.keys(stock).find(k => k !== loc); const a = transfer(loc, other, "unr", 20); return a ? { flash: [`${loc}|unr`, `${other}|unr`], text: `Transfer ${a} Unrestricted → ${other.split(" / ")[1]}`, rev: "312", undo: () => (stock[other].unr -= a, stock[loc].unr += a) } : null; } },
  ];
  function refreshLocPicker() {
    const cur = simLoc.value;
    simLoc.innerHTML = Object.keys(stock).map(k => `<option value="${k}">${k}</option>`).join("");
    if (cur && stock[cur]) simLoc.value = cur;
  }
  const simActions = $("#simActions");
  ACTIONS.forEach(a => {
    const b = el("button", "btn btn--mvt", `<span class="b-code">${a.mvt}</span>${a.label}`);
    b.type = "button";
    b.addEventListener("click", () => {
      const loc = simLoc.value;
      const res = a.run(loc);
      if (!res) { b.animate([{ transform: "translateX(-4px)" }, { transform: "translateX(4px)" }, { transform: "none" }], { duration: 220 }); return; }
      undoStack.push({ mvt: a.mvt, undo: res.undo });
      log.push({ mvt: a.mvt, text: res.text, reversal: false });
      renderStock(res.flash); renderLog();
    });
    simActions.appendChild(b);
  });
  simUndo.addEventListener("click", () => {
    const last = undoStack.pop();
    if (!last) return;
    last.undo();
    const n = parseInt(last.mvt, 10);
    const revMvt = String(n % 2 ? n + 1 : n - 1);
    log.push({ mvt: revMvt, text: `Reversal of ${last.mvt} (the +1 rule)`, reversal: true });
    renderStock(); renderLog();
  });
  $("#simReset").addEventListener("click", () => { stock = START(); undoStack = []; log = []; refreshLocPicker(); renderStock(); renderLog(); });
  refreshLocPicker(); renderStock(); renderLog();

  /* ---------------- WIZARD ---------------- */
  const WIZ = {
    q1: { q: "Does the system quantity match the physical count?", opts: [{ t: "Yes", go: "q2" }, { t: "No", go: "rCount" }] },
    q2: { q: "Is the stock in the correct storage location?", opts: [{ t: "Yes", go: "q3" }, { t: "No", go: "rTransfer" }] },
    q3: { q: "Is the stock Unrestricted (not QI or Blocked)?", opts: [{ t: "Yes", go: "q4" }, { t: "No", go: "rRelease" }] },
    q4: { q: "Is the right part on the right unit?", opts: [{ t: "Yes", go: "rOk" }, { t: "No", go: "rParts" }] },
    rCount: { result: 1, title: "Run the cycle-count loop", body: "The book and physical disagree — count and reconcile.", chips: ["MI01", "MI04", "MI07"], chart: "chart3" },
    rTransfer: { result: 1, title: "Transfer it to the right location", body: "Stock is real and free, just in the wrong storage location.", chips: ["MIGO", "311"], chart: "chart1" },
    rRelease: { result: 1, title: "Release the QI / Blocked stock", body: "It's physically there but locked. Release only after QA signs off.", chips: ["321", "343"], chart: "chart2" },
    rParts: { result: 1, title: "Run the parts-to-unit check", body: "Compare the as-built production order against the BOM, then correct.", chips: ["CO03", "CS03", "262 → 261"], chart: "chart4" },
    rOk: { result: 1, title: "Check the audit trail, then resolve", body: "Everything reconciles — review who moved what, then close or escalate with evidence.", chips: ["MB51"], chart: "chart1" },
  };
  const wizCard = $("#wizCard"), wizStep = $("#wizStep"), wizBack = $("#wizBack");
  let wizPath = ["q1"];
  function renderWiz() {
    const key = wizPath[wizPath.length - 1], node = WIZ[key];
    wizBack.disabled = wizPath.length < 2;
    if (node.result) {
      wizStep.textContent = "Result";
      wizCard.innerHTML = `<div class="wiz-result">
        <span class="wiz-result__tag">→ Recommended action</span>
        <div class="wiz-result__title">${node.title}</div>
        <p class="wiz-result__body">${node.body}</p>
        <div class="wiz-result__chips">${node.chips.map(c => `<span class="chip">${c}</span>`).join("")}</div>
        <div class="wizard__controls"><button class="btn btn--text" data-gochart="${node.chart}">View the full flowchart →</button></div>
      </div>`;
      $("[data-gochart]", wizCard)?.addEventListener("click", e => { selectChart(e.target.dataset.gochart); $("#flowcharts").scrollIntoView({ behavior: "smooth" }); });
      return;
    }
    wizStep.textContent = "Step " + wizPath.filter(k => WIZ[k].q).length;
    wizCard.innerHTML = `<div class="wizard__q">${node.q}</div><div class="wizard__opts"></div>`;
    const opts = $(".wizard__opts", wizCard);
    node.opts.forEach(o => {
      const b = el("button", "btn", o.t); b.type = "button";
      b.addEventListener("click", () => { wizPath.push(o.go); renderWiz(); });
      opts.appendChild(b);
    });
  }
  wizBack.addEventListener("click", () => { if (wizPath.length > 1) { wizPath.pop(); renderWiz(); } });
  $("#wizRestart").addEventListener("click", () => { wizPath = ["q1"]; renderWiz(); });
  renderWiz();

  /* ---------------- FLOWCHARTS ---------------- */
  const D = window.SAP_DIAGRAMS || {};
  const chartTabs = $("#chartTabs"), chartCanvas = $("#chartCanvas"), chartCaption = $("#chartCaption");
  function selectChart(id) {
    const meta = CHART_META.find(c => c.id === id) || CHART_META[0];
    chartCanvas.innerHTML = D[meta.id] || "<p>Diagram unavailable.</p>";
    chartCaption.textContent = meta.cap;
    $$(".chart-tab", chartTabs).forEach(t => t.classList.toggle("is-active", t.dataset.id === meta.id));
  }
  CHART_META.forEach((c, i) => {
    const t = el("button", "chart-tab" + (i === 0 ? " is-active" : ""), c.name);
    t.type = "button"; t.dataset.id = c.id;
    t.addEventListener("click", () => selectChart(c.id));
    chartTabs.appendChild(t);
  });
  selectChart("chart1");

  /* ---------------- LIGHTBOX ---------------- */
  const lb = $("#lightbox"), lbInner = $("#lightboxInner");
  chartCanvas.addEventListener("click", () => { lbInner.innerHTML = chartCanvas.innerHTML; lb.hidden = false; });
  $("#lightboxClose").addEventListener("click", () => lb.hidden = true);
  lb.addEventListener("click", e => { if (e.target === lb) lb.hidden = true; });
  document.addEventListener("keydown", e => { if (e.key === "Escape") lb.hidden = true; });

  /* ---------------- SCROLL REVEAL ---------------- */
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((ents) => ents.forEach(e => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }), { threshold: 0.08 });
    $$(".reveal").forEach(s => io.observe(s));
  } else { $$(".reveal").forEach(s => s.classList.add("is-in")); }
})();
