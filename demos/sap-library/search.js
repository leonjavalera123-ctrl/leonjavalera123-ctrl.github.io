/* ============================================================
   SAP S/4HANA Library — search engine
   ------------------------------------------------------------
   Fully client-side natural-language search over SAP_KB.
   Pipeline:
     1. normalise the query
     2. expand synonyms (SAP_SYNONYMS) into extra search terms
     3. tokenise + drop stopwords
     4. score every entry against a weighted searchable text
     5. rank, with code/number short-circuits on top
   No backend, no API — works offline.
   ============================================================ */
(function () {
  "use strict";

  var KB = window.SAP_KB || [];
  var SYN = window.SAP_SYNONYMS || {};

  var STOP = new Set([
    "a", "an", "the", "is", "are", "was", "were", "be", "to", "of", "in", "on",
    "for", "and", "or", "my", "i", "it", "this", "that", "with", "how", "do",
    "does", "did", "can", "could", "would", "should", "what", "whats", "why",
    "when", "where", "which", "who", "me", "you", "we", "us", "our", "if", "but",
    "as", "at", "by", "from", "into", "out", "up", "so", "get", "got", "need",
    "want", "im", "ive", "there", "their", "has", "have", "had", "not", "no"
  ]);

  function normalise(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/[’']/g, "'")
      .replace(/[^a-z0-9'\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function tokenise(s) {
    return normalise(s)
      .split(" ")
      .map(function (t) { return t.replace(/'/g, ""); })
      .filter(function (t) { return t && t.length > 1 && !STOP.has(t); });
  }

  /* Pre-build a weighted searchable string per entry, plus a token set.
     Weighting is done by repetition: high-signal fields are concatenated
     multiple times so token overlap scores them higher. */
  var DOCS = KB.map(function (e) {
    var code = e.code ? e.code + " " : "";
    var heavy = (e.title + " " + code + code + code + (e.keywords || []).join(" ") + " " + (e.keywords || []).join(" ")).toLowerCase();
    var medium = (e.summary + " " + (e.category || "")).toLowerCase();
    var light = String(e.body || "").replace(/<[^>]+>/g, " ").toLowerCase();
    var blob = heavy + " " + heavy + " " + medium + " " + light;
    return {
      entry: e,
      tokens: blob.split(/\s+/).filter(Boolean),
      tokenSet: new Set(tokenise(blob)),
      heavySet: new Set(tokenise(heavy + " " + medium)),
      code: (e.code || "").toLowerCase()
    };
  });

  /* Expand a normalised query into a weighted bag of terms.
     Original query tokens get full weight; synonym expansions get
     a smaller weight so they assist rather than dominate. */
  function buildTerms(rawQuery) {
    var q = normalise(rawQuery);
    var terms = Object.create(null); // term -> weight
    function add(t, w) {
      t = t.replace(/'/g, "");
      if (!t || t.length < 2 || STOP.has(t)) return;
      terms[t] = Math.max(terms[t] || 0, w);
    }

    // multi-word synonym phrases matched against the whole query
    Object.keys(SYN).forEach(function (phrase) {
      if (phrase.indexOf(" ") !== -1 && q.indexOf(phrase) !== -1) {
        SYN[phrase].forEach(function (exp) {
          tokenise(exp).forEach(function (t) { add(t, 0.7); });
        });
      }
    });

    // single tokens: full weight + per-word synonym expansion
    tokenise(q).forEach(function (t) {
      add(t, 1);
      if (SYN[t]) {
        SYN[t].forEach(function (exp) {
          tokenise(exp).forEach(function (x) { add(x, 0.7); });
        });
      }
    });

    return terms;
  }

  // Does the query read like a problem/question rather than a bare lookup?
  // If so, nudge troubleshooting + how-to entries up — that's the intent.
  var PROBLEM_HINT = /\b(why|cant|cannot|wont|how|fix|fixing|stuck|locked|help|error|problem|issue|broken|wrong|missing|won't|can't)\b/;

  function scoreDoc(doc, terms, rawTokens, problemQuery) {
    var score = 0;
    Object.keys(terms).forEach(function (t) {
      var w = terms[t];
      if (doc.heavySet.has(t)) score += 6 * w;        // title / code / keywords
      else if (doc.tokenSet.has(t)) score += 1.5 * w; // body only
      // partial / prefix help for longer tokens
      else if (t.length >= 5) {
        for (var i = 0; i < doc.tokens.length; i++) {
          if (doc.tokens[i].indexOf(t) === 0) { score += 0.8 * w; break; }
        }
      }
    });

    // exact code match short-circuit (e.g. "321", "mmbe")
    var hasCodeHit = false;
    rawTokens.forEach(function (t) {
      if (doc.code && t === doc.code) { score += 30; hasCodeHit = true; }
      if (doc.entry.rev && t === String(doc.entry.rev).toLowerCase()) { score += 20; hasCodeHit = true; }
    });

    // intent bias: on a problem-style query (and no exact code typed), favour
    // the entries written to answer problems.
    if (problemQuery && !hasCodeHit && score > 0) {
      if (doc.entry.type === "error") score *= 1.22;
      else if (doc.entry.type === "howto") score *= 1.12;
    }

    return score;
  }

  /* Public API: returns ranked [{ entry, score }] */
  function search(rawQuery, limit) {
    var q = String(rawQuery || "").trim();
    if (!q) return [];
    var terms = buildTerms(q);
    var rawTokens = tokenise(q);
    if (!Object.keys(terms).length) return [];
    var problemQuery = PROBLEM_HINT.test(normalise(q));

    var scored = DOCS.map(function (doc) {
      return { entry: doc.entry, score: scoreDoc(doc, terms, rawTokens, problemQuery) };
    }).filter(function (r) { return r.score > 0; });

    scored.sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      return a.entry.title.localeCompare(b.entry.title);
    });

    return typeof limit === "number" ? scored.slice(0, limit) : scored;
  }

  function getById(id) {
    for (var i = 0; i < KB.length; i++) if (KB[i].id === id) return KB[i];
    return null;
  }

  window.SAPSearch = { search: search, getById: getById };
})();
