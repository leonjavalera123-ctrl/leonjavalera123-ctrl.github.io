/* ============================================================
   SAP S/4HANA Library — UI wiring
   ============================================================ */
(function () {
  "use strict";

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var el = function (tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };
  var esc = function (s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  };

  var KB = window.SAP_KB || [];
  var Search = window.SAPSearch;

  var TYPE_LABEL = {
    tcode: "T-code", movement: "Movement", concept: "Concept",
    howto: "How-to", error: "Fix"
  };

  function badge(type) {
    return '<span class="badge badge--' + type + '">' + (TYPE_LABEL[type] || type) + "</span>";
  }

  // Module dimension. New entries carry `module`; the original IC entries
  // don't — default them by area so filtering covers the whole archive.
  var MODULE_ORDER = [
    "Inventory & Warehouse", "Procurement", "Sales", "Finance", "Controlling",
    "Production", "Quality", "Maintenance", "Master Data", "Integration",
    "Basis & Technical", "Navigation & Fiori", "S/4HANA Concepts"
  ];
  function moduleOf(e) {
    if (e.module) return e.module;
    if ((e.category || "").indexOf("Integration") >= 0 || e.id.indexOf("idoc") >= 0) return "Integration";
    return "Inventory & Warehouse";
  }
  function presentModules() {
    var present = {};
    KB.forEach(function (e) { present[moduleOf(e)] = true; });
    var ordered = MODULE_ORDER.filter(function (m) { return present[m]; });
    Object.keys(present).forEach(function (m) { if (ordered.indexOf(m) < 0) ordered.push(m); });
    return ordered;
  }

  /* ---------------- THEME ---------------- */
  var root = document.documentElement;
  try { var saved = localStorage.getItem("sap_lib_theme"); if (saved) root.setAttribute("data-theme", saved); } catch (e) {}
  $("#themeToggle").addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("sap_lib_theme", next); } catch (e) {}
  });

  /* ---------------- DRAWER ---------------- */
  var drawer = $("#drawer"), drawerBody = $("#drawer-body");
  var lastFocus = null;

  function relatedLink(id) {
    var e = Search.getById(id);
    if (!e) return "";
    var label = e.code ? e.code : e.title;
    return '<button class="rel-link" data-open="' + e.id + '">' + badge(e.type) + esc(label) + "</button>";
  }

  function openEntry(id) {
    var e = Search.getById(id);
    if (!e) return;
    lastFocus = document.activeElement;

    var modu = moduleOf(e);
    var cat = e.category || "";
    var catLine = cat && cat !== modu ? modu + " · " + cat : modu;
    var html = '<div class="dw-top">' + badge(e.type) +
      (e.code ? '<span class="code-pill">' + esc(e.code) + (e.rev ? " ⇄ " + esc(e.rev) : "") + "</span>" : "") +
      '<span class="dw-cat">' + esc(catLine) + "</span></div>";
    html += '<h2 class="dw-title" id="drawer-title">' + esc(e.title) + "</h2>";
    if (e.fiori) html += '<span class="dw-fiori"><b>Fiori app:</b> ' + esc(e.fiori) + "</span>";
    html += '<div class="dw-summary">' + esc(e.summary) + "</div>";
    html += '<div class="dw-body">' + (e.body || "") + "</div>";

    if (e.steps && e.steps.length) {
      html += '<div class="dw-steps"><h3>Step by step</h3><ol>';
      e.steps.forEach(function (s) { html += "<li>" + esc(s) + "</li>"; });
      html += "</ol></div>";
    }

    if (e.related && e.related.length) {
      var links = e.related.map(relatedLink).filter(Boolean).join("");
      if (links) html += '<div class="dw-related"><h3>Related</h3><div class="dw-related__list">' + links + "</div></div>";
    }

    drawerBody.innerHTML = html;
    drawer.hidden = false;
    document.body.style.overflow = "hidden";
    $("#drawer-close").focus();
  }

  function closeDrawer() {
    drawer.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  $("#drawer-close").addEventListener("click", closeDrawer);
  $("#drawer-scrim").addEventListener("click", closeDrawer);
  drawerBody.addEventListener("click", function (e) {
    var b = e.target.closest("[data-open]");
    if (b) { openEntry(b.getAttribute("data-open")); drawerBody.parentNode.scrollTop = 0; }
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !drawer.hidden) closeDrawer(); });

  /* ---------------- SEARCH / ASK ---------------- */
  var input = $("#ask-input"), clearBtn = $("#ask-clear");
  var results = $("#results"), resultsList = $("#results-list"), resultsTitle = $("#results-title");
  var browse = $("#browse");

  function highlightTerms(text, q) { return esc(text); } // reserved; summaries stay clean

  function renderResults(q) {
    var hits = Search.search(q, 12);
    results.hidden = false;
    resultsTitle.innerHTML = "Answers <span>· " + hits.length + ' for &ldquo;' + esc(q) + "&rdquo;</span>";

    if (!hits.length) {
      resultsList.innerHTML = '<div class="results__empty">No match for <strong>&ldquo;' + esc(q) + "&rdquo;</strong>.<br>Try a t-code (MMBE), a movement number (321), or describe the problem in plain words.</div>";
      return;
    }

    resultsList.innerHTML = hits.map(function (h, i) {
      var e = h.entry;
      var topMark = i === 0 ? '<span class="badge" style="border-color:color-mix(in srgb,var(--accent) 40%,transparent);color:var(--accent);background:color-mix(in srgb,var(--accent) 12%,transparent)">Best match</span>' : "";
      return '<button class="result" data-open="' + e.id + '">' +
        '<div class="result__top">' + badge(e.type) +
        (e.code ? '<span class="code-pill">' + esc(e.code) + "</span>" : "") +
        topMark +
        '<span class="result__title">' + esc(e.title) + "</span></div>" +
        '<p class="result__summary">' + esc(e.summary) + "</p>" +
        '<div class="result__bar">' + esc(e.category || "") + " &middot; open for detail &rarr;</div>" +
        "</button>";
    }).join("");
  }

  resultsList.addEventListener("click", function (e) {
    var b = e.target.closest("[data-open]");
    if (b) openEntry(b.getAttribute("data-open"));
  });

  var debounce;
  function runSearch() {
    var q = input.value.trim();
    clearBtn.hidden = !q;
    if (!q) { results.hidden = true; return; }
    renderResults(q);
  }
  input.addEventListener("input", function () {
    clearTimeout(debounce);
    debounce = setTimeout(runSearch, 110);
  });
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      clearTimeout(debounce); runSearch();
      var first = $(".result", resultsList);
      if (first) { results.scrollIntoView({ behavior: "smooth", block: "start" }); }
    }
  });

  function clearSearch() {
    input.value = "";
    clearBtn.hidden = true;
    results.hidden = true;
    input.focus();
  }
  clearBtn.addEventListener("click", clearSearch);
  $("#results-back").addEventListener("click", function () {
    clearSearch();
    browse.scrollIntoView({ behavior: "smooth" });
  });

  $$(".suggest").forEach(function (b) {
    b.addEventListener("click", function () {
      input.value = b.textContent;
      runSearch();
      results.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  /* ---------------- BROWSE GRID ---------------- */
  var browseGrid = $("#browse-grid");
  var moduleFilter = $("#module-filter"), typeFilter = $("#type-filter");
  var browseCount = $("#browse-count");
  var curModule = "All", curType = "All";

  function renderBrowse() {
    browseGrid.innerHTML = KB.map(function (e) {
      return '<button class="kb-card" data-open="' + e.id + '" data-type="' + e.type +
        '" data-module="' + esc(moduleOf(e)) + '">' +
        '<div class="kb-card__top">' + badge(e.type) +
        (e.code ? '<span class="code-pill">' + esc(e.code) + "</span>" : "") + "</div>" +
        '<div class="kb-card__title">' + esc(e.title) + "</div>" +
        '<p class="kb-card__summary">' + esc(e.summary) + "</p>" +
        "</button>";
    }).join("");
  }
  renderBrowse();

  function applyFilter() {
    var shown = 0;
    $$(".kb-card", browseGrid).forEach(function (card) {
      var okM = curModule === "All" || card.getAttribute("data-module") === curModule;
      var okT = curType === "All" || card.getAttribute("data-type") === curType;
      var hide = !(okM && okT);
      card.classList.toggle("is-hidden", hide);
      if (!hide) shown++;
    });
    if (browseCount) browseCount.textContent = "Showing " + shown + " of " + KB.length + " entries";
  }

  function buildChips(container, items, onPick, labelFn) {
    items.forEach(function (val, i) {
      var b = el("button", "filter-chip" + (i === 0 ? " is-active" : ""), labelFn ? labelFn(val) : val);
      b.type = "button";
      b.addEventListener("click", function () {
        $$(".filter-chip", container).forEach(function (x) { x.classList.remove("is-active"); });
        b.classList.add("is-active");
        onPick(val);
        applyFilter();
      });
      container.appendChild(b);
    });
  }

  buildChips(moduleFilter, ["All"].concat(presentModules()), function (m) { curModule = m; });
  buildChips(typeFilter, ["All", "tcode", "movement", "concept", "howto", "error"], function (t) { curType = t; }, function (t) {
    if (t === "All") return "All";
    return t === "error" ? "Fixes" : t === "tcode" ? "T-codes" : TYPE_LABEL[t] + "s";
  });
  applyFilter();

  browseGrid.addEventListener("click", function (e) {
    var b = e.target.closest("[data-open]");
    if (b) openEntry(b.getAttribute("data-open"));
  });

  /* ---------------- REFERENCE GRIDS ---------------- */
  var tcodeGroups = $("#tcode-groups"), mvtGrid = $("#mvt-grid");

  function tcodeButton(e) {
    var b = el("button", "ref");
    b.type = "button";
    b.innerHTML = '<span class="ref__copied">Copied ✓</span>' +
      '<span class="ref__code">' + esc(e.code) + "</span>" +
      '<span class="ref__desc">' + esc(e.summary) + "</span>";
    b.addEventListener("click", function () {
      // copy the code, then open the full card
      if (navigator.clipboard) navigator.clipboard.writeText(e.code).catch(function () {});
      b.classList.add("copied");
      setTimeout(function () { b.classList.remove("copied"); }, 900);
      setTimeout(function () { openEntry(e.id); }, 280);
    });
    return b;
  }

  presentModules().forEach(function (m) {
    var codes = KB.filter(function (e) { return e.type === "tcode" && moduleOf(e) === m; });
    if (!codes.length) return;
    var group = el("div", "ref-group");
    group.innerHTML = '<h3 class="ref-group__title">' + esc(m) +
      ' <span>' + codes.length + "</span></h3>";
    var grid = el("div", "ref-grid");
    codes.forEach(function (e) { grid.appendChild(tcodeButton(e)); });
    group.appendChild(grid);
    tcodeGroups.appendChild(group);
  });

  KB.filter(function (e) { return e.type === "movement"; }).forEach(function (e) {
    var b = el("button", "ref");
    b.type = "button";
    b.innerHTML = '<span class="ref__code">' + esc(e.code) +
      (e.rev ? '<span class="ref__rev">⇄ ' + esc(e.rev) + "</span>" : "") + "</span>" +
      '<span class="ref__desc">' + esc(e.summary) + "</span>";
    b.addEventListener("click", function () { openEntry(e.id); });
    mvtGrid.appendChild(b);
  });

  /* ---------------- SCROLL REVEAL ---------------- */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.08 });
    $$(".reveal").forEach(function (s) { io.observe(s); });
  } else {
    $$(".reveal").forEach(function (s) { s.classList.add("is-in"); });
  }
})();
