/* ============================================================
   SAP S/4HANA Library — knowledge archive
   ------------------------------------------------------------
   Scope: Inventory Management / Warehouse (MM-IM, WM/EWM basics)
   for the Inventory Control desk. Each entry is one searchable
   "card". Keep `keywords` written the way a person would ASK —
   the search engine matches questions, not just terms.

   Entry shape:
     id        unique slug
     type      'tcode' | 'movement' | 'concept' | 'howto' | 'error'
     code      short badge (t-code or 3-digit movement)  [optional]
     rev       reversal movement number                  [movement only]
     title     headline shown on the card
     category  group label
     summary   one-line plain-English answer
     keywords  natural-language phrases people would type
     body      rich HTML — the real explanation
     steps     ordered list of clicks                    [optional]
     related   ids of related entries
     fiori     Fiori app name                            [tcode, optional]
   ============================================================ */
window.SAP_KB = [

  /* =======================================================
     T-CODES — STOCK & REPORTING
     ======================================================= */
  {
    id: "tcode-mmbe", type: "tcode", code: "MMBE", category: "Stock & Reporting",
    title: "MMBE — Stock Overview",
    summary: "See one material's stock across every plant, storage location, and stock type on one screen.",
    keywords: ["check stock", "how much stock", "stock overview", "where is my stock", "stock on hand", "availability", "is it in stock", "stock for a material", "single material stock", "how much do we have"],
    body: "<p><strong>MMBE</strong> is the fastest way to answer “how much of this part do we have, and where is it?”. It shows a single material broken down by <em>plant → storage location → stock type</em> (Unrestricted, Quality Inspection, Blocked, plus in-transit and reserved).</p><p>Use it as your first stop on almost any stock question. If a quantity looks unavailable, MMBE tells you which <strong>stock state</strong> it's trapped in.</p>",
    steps: ["Enter the Material number", "Optionally narrow by Plant / Storage location", "Execute (F8)", "Expand the plant and storage-location nodes to see each stock type"],
    related: ["tcode-mb52", "concept-stock-types", "tcode-mb51", "mv-321"],
    fiori: "Stock – Single Material"
  },
  {
    id: "tcode-mb52", type: "tcode", code: "MB52", category: "Stock & Reporting",
    title: "MB52 — Warehouse Stock (many materials)",
    summary: "List on-hand stock for many materials in a plant at once — the opposite zoom level of MMBE.",
    keywords: ["list all stock", "warehouse stock", "stock report", "all materials", "stock list", "what's in the warehouse", "bulk stock check", "stock by plant"],
    body: "<p><strong>MB52</strong> lists current stock for a <em>range</em> of materials in a plant/storage location — where MMBE is one part deep, MB52 is many parts wide. Great for a sloc audit, a shelf sweep, or exporting a stock snapshot to a spreadsheet.</p><p>It reads the same stock figures as MMBE; it just shows them as a flat, filterable, exportable list.</p>",
    steps: ["Enter Plant (and Storage location to narrow)", "Optionally enter a material range", "Execute", "Sort/filter the grid; export to spreadsheet if needed"],
    related: ["tcode-mmbe", "tcode-mb51", "tcode-mb5b"],
    fiori: "Material Documents Overview"
  },
  {
    id: "tcode-mb51", type: "tcode", code: "MB51", category: "Stock & Reporting",
    title: "MB51 — Material Document List (movement history)",
    summary: "The audit trail: every movement posted for a material — who, what, when, which movement type.",
    keywords: ["who moved the stock", "movement history", "audit trail", "history of a part", "what happened to this material", "track movements", "when did stock change", "list of postings", "where did the stock go", "trace a quantity"],
    body: "<p><strong>MB51</strong> answers “who moved this, when, and with which movement type?”. It lists every <em>material document</em> for your selection — each row is a posting with the date, user, movement type, quantity and the reference document.</p><p>This is your evidence trail. When a quantity disappears or a count is off, filter MB51 by material + date range and read the story line by line.</p>",
    steps: ["Enter Material (and Plant)", "Set a posting date range", "Optionally filter by Movement type", "Execute and read the postings chronologically"],
    related: ["tcode-mb03", "tcode-mmbe", "concept-material-document"],
    fiori: "Material Documents Overview"
  },
  {
    id: "tcode-mb03", type: "tcode", code: "MB03", category: "Stock & Reporting",
    title: "MB03 — Display a Material Document",
    summary: "Open one specific posting to read exactly what it did — line items, quantities, accounts.",
    keywords: ["display material document", "look at one posting", "view a goods movement", "material document number", "open a posting", "what did this document do"],
    body: "<p><strong>MB03</strong> opens a single material document (the unique number every goods movement creates). Use it to inspect one posting in full detail: every line, the movement type, the from/to stock, the storage locations, and the accounting documents behind it.</p><p>MB51 finds the document; MB03 reads it.</p>",
    steps: ["Enter the Material document number and Year", "Execute", "Review line items; use the buttons to jump to the accounting document"],
    related: ["tcode-mb51", "concept-material-document"],
    fiori: "Display Material Document"
  },
  {
    id: "tcode-mb5b", type: "tcode", code: "MB5B", category: "Stock & Reporting",
    title: "MB5B — Stock on a Past Date",
    summary: "Reconstruct what stock looked like on any historical date — opening/closing balances for a period.",
    keywords: ["stock on a date", "historical stock", "stock as of", "past stock balance", "what was the stock yesterday", "opening balance", "closing balance", "stock at month end"],
    body: "<p><strong>MB5B</strong> rebuilds stock as it stood on a chosen date by replaying the movements. Use it for month-end reconciliation, audits, or to prove what the book quantity was before a disputed adjustment.</p><p>Run it in <em>Storage location / stock type</em> mode for the level of detail IC usually needs.</p>",
    steps: ["Enter Plant and material range", "Choose the date range (opening → closing)", "Pick the valuation/stock-type radio option", "Execute"],
    related: ["tcode-mb51", "tcode-mb52"],
    fiori: "Material Documents Overview"
  },

  /* =======================================================
     T-CODES — POSTING & MASTER DATA
     ======================================================= */
  {
    id: "tcode-migo", type: "tcode", code: "MIGO", category: "Posting Movements",
    title: "MIGO — Post Any Goods Movement",
    summary: "The one screen to post receipts, issues, transfers and reversals — pick the action, enter the movement type.",
    keywords: ["post a movement", "goods movement", "how to move stock", "goods receipt", "goods issue", "transfer posting", "enter a movement type", "post stock", "do a movement"],
    body: "<p><strong>MIGO</strong> is the universal goods-movement cockpit. You choose an <em>action</em> (Goods Receipt, Goods Issue, Transfer Posting, Display, Cancel) and a reference, and SAP fills the matching movement type — or you type the 3-digit movement type directly.</p><p>It replaces the old MB1A/MB1B/MB1C screens. Whatever the movement, MIGO is almost always where you post it.</p>",
    steps: ["Pick the action (e.g. Transfer Posting) + reference", "Enter or confirm the Movement type", "Fill material, quantity, from/to storage location & stock type", "Check, then Post (the system returns a material document number)"],
    related: ["mv-101", "mv-311", "mv-321", "concept-stock-types"],
    fiori: "Post Goods Movement"
  },
  {
    id: "tcode-mm03", type: "tcode", code: "MM03", category: "Master Data",
    title: "MM03 — Display Material Master",
    summary: "Look up what a part actually is: description, unit of measure, type, plant data, batch/serial settings.",
    keywords: ["what is this part", "material master", "look up a material", "part details", "unit of measure", "material type", "display material", "material settings"],
    body: "<p><strong>MM03</strong> shows the <em>material master</em> — the definitive record of a part: its description, base unit of measure, material type, the plants it lives in, and whether it's batch- or serial-managed. When a movement is rejected because a field is required (batch, serial, sloc), MM03 tells you which settings are switched on.</p>",
    steps: ["Enter the Material number", "Select the views you need (Basic, Plant stock, Storage, Quality, Accounting)", "Enter Plant/Storage location when prompted", "Read the relevant view"],
    related: ["tcode-iq03", "tcode-msc3", "error-batch-required"],
    fiori: "Display Material"
  },
  {
    id: "tcode-iq03", type: "tcode", code: "IQ03", category: "Master Data",
    title: "IQ03 — Display Serial Number",
    summary: "Track a single physical unit by its serial number — its status, stock location and history.",
    keywords: ["serial number", "track one unit", "serialized part", "find a serial", "individual unit", "serial history", "where is serial"],
    body: "<p><strong>IQ03</strong> displays a serial number record — used when each physical unit is tracked individually (equipment, high-value or regulated parts). It shows the unit's current stock status and location, and links to its document history.</p>",
    steps: ["Enter Material + Serial number", "Execute", "Review the SerData / stock status; drill into history if needed"],
    related: ["tcode-mm03", "tcode-msc3", "concept-special-stock"],
    fiori: "Serial Number"
  },
  {
    id: "tcode-msc3", type: "tcode", code: "MSC3", category: "Master Data",
    title: "MSC3 — Display Batch",
    summary: "Inspect a batch (lot): its characteristics, status, expiry and stock by batch.",
    keywords: ["batch", "lot number", "display batch", "batch details", "expiry date", "batch status", "track by lot", "shelf life"],
    body: "<p><strong>MSC3</strong> displays a batch — a quantity of a material produced/received together and tracked as a lot. It shows the batch's characteristics, restricted/unrestricted status, and shelf-life/expiry where managed. Batch-managed materials force a batch entry on every movement.</p>",
    steps: ["Enter Material + Batch + Plant", "Execute", "Review classification, status and shelf-life data"],
    related: ["error-batch-required", "tcode-mm03"],
    fiori: "Manage Batches"
  },

  /* =======================================================
     T-CODES — PHYSICAL INVENTORY / CYCLE COUNT
     ======================================================= */
  {
    id: "tcode-mi01", type: "tcode", code: "MI01", category: "Physical Inventory",
    title: "MI01 — Create Physical Inventory Document",
    summary: "Open a count document that freezes the materials/bins you're about to count.",
    keywords: ["start a count", "create count document", "physical inventory", "begin cycle count", "open a stocktake", "set up a count"],
    body: "<p><strong>MI01</strong> creates the physical-inventory (count) document — the first step of the count loop. It lists the materials in a storage location to be counted and posts a <em>count freeze</em> so the book quantity is captured at that moment.</p><p>Flow: <strong>MI01</strong> create → <strong>MI04</strong> enter count → <strong>MI20</strong> review differences → <strong>MI07</strong> post.</p>",
    steps: ["Enter Plant + Storage location", "Add the materials to count (or use a count category)", "Post the count document — note the document number"],
    related: ["tcode-mi04", "tcode-mi20", "tcode-mi07", "howto-cycle-count"],
    fiori: "Manage Physical Inventory"
  },
  {
    id: "tcode-mi04", type: "tcode", code: "MI04", category: "Physical Inventory",
    title: "MI04 — Enter Count Result",
    summary: "Type the quantity you physically counted against the count document.",
    keywords: ["enter count", "record counted quantity", "input physical count", "key in count", "counted amount", "record the count"],
    body: "<p><strong>MI04</strong> is where you enter what you actually counted, line by line, against the MI01 document. SAP holds the book quantity hidden so the count stays honest. Anything you leave blank can be flagged as zero or recounted.</p>",
    steps: ["Enter the Physical inventory document number + Year", "Key the counted quantity for each line", "Post the count entry"],
    related: ["tcode-mi01", "tcode-mi20", "tcode-mi07", "howto-cycle-count"],
    fiori: "Manage Physical Inventory"
  },
  {
    id: "tcode-mi20", type: "tcode", code: "MI20", category: "Physical Inventory",
    title: "MI20 — List Inventory Differences",
    summary: "See book vs counted side by side and the gap before you commit any adjustment.",
    keywords: ["count difference", "book vs counted", "inventory variance", "differences list", "count mismatch", "review differences", "stock discrepancy"],
    body: "<p><strong>MI20</strong> lists the difference between book and counted quantity for each line — the variance you're about to post. Review it here <em>before</em> MI07: a large gap often means a miscount, a wrong unit of measure, or an un-posted movement, not a real loss.</p>",
    steps: ["Enter the count document or selection", "Execute", "Investigate any large variances before posting"],
    related: ["tcode-mi07", "tcode-mi04", "error-count-mismatch", "howto-cycle-count"],
    fiori: "Manage Physical Inventory"
  },
  {
    id: "tcode-mi07", type: "tcode", code: "MI07", category: "Physical Inventory",
    title: "MI07 — Post Inventory Difference",
    summary: "Commit the count: SAP adjusts system stock to match the count (auto-posts 701/702).",
    keywords: ["post count difference", "adjust stock to count", "fix the count", "commit inventory", "reconcile stock", "post the variance", "make stock match"],
    body: "<p><strong>MI07</strong> posts the difference — the step that actually changes system stock to match what you counted. Behind the scenes SAP posts a <strong>701</strong> (gain) or <strong>702</strong> (loss) automatically. This is the only count step that touches real stock, so confirm the variance in MI20 first.</p>",
    steps: ["Enter the count document number + Year", "Review the differences one last time", "Post — system stock now equals the count"],
    related: ["mv-701", "tcode-mi20", "howto-cycle-count"],
    fiori: "Manage Physical Inventory"
  },

  /* =======================================================
     T-CODES — QUALITY / PARTS-TO-UNIT
     ======================================================= */
  {
    id: "tcode-co03", type: "tcode", code: "CO03", category: "Quality & Orders",
    title: "CO03 — Display Production Order",
    summary: "The as-built record: which parts were actually issued to a unit.",
    keywords: ["production order", "what was built", "as built", "parts issued to order", "display order", "components consumed", "what went into the unit"],
    body: "<p><strong>CO03</strong> displays a production order — the record of what was <em>actually</em> built and which components were issued (via 261). To verify a unit got the right parts, compare CO03 (as-built) against the BOM in CS03 (as-designed).</p>",
    steps: ["Enter the Production order number", "Open the Components / Documented goods movements view", "Compare issued parts against the BOM (CS03)"],
    related: ["tcode-cs03", "mv-261", "howto-parts-to-unit"],
    fiori: "Display Production Order"
  },
  {
    id: "tcode-cs03", type: "tcode", code: "CS03", category: "Quality & Orders",
    title: "CS03 — Display Bill of Material",
    summary: "The as-designed spec: which parts SHOULD be on a unit, and how many.",
    keywords: ["bill of material", "BOM", "what parts should be on", "as designed", "components list", "recipe", "structure of a product"],
    body: "<p><strong>CS03</strong> displays the bill of material — the engineering list of components that <em>should</em> go into a product, with quantities. It's the reference you check the as-built (CO03) against during a parts-to-unit quality check.</p>",
    steps: ["Enter Material + Plant + BOM usage", "Execute", "Read the component list and quantities"],
    related: ["tcode-co03", "howto-parts-to-unit"],
    fiori: "Display Bill of Material"
  },

  /* =======================================================
     MOVEMENT TYPES — RECEIPTS (1xx)
     ======================================================= */
  {
    id: "mv-101", type: "movement", code: "101", rev: "102", category: "Movement Types",
    title: "101 — Goods Receipt for a PO",
    summary: "Receive purchased stock against a purchase order; it lands in your warehouse.",
    keywords: ["goods receipt", "receive a delivery", "incoming stock", "receive purchase order", "book in stock", "GR against PO", "stock arrived", "receiving"],
    body: "<p><strong>101</strong> books a goods receipt against a purchase order — incoming stock arrives and is added to inventory (usually Unrestricted, or Quality Inspection if the material requires inspection). Its reversal is <strong>102</strong>.</p>",
    related: ["mv-321", "tcode-migo", "concept-stock-types"]
  },
  {
    id: "mv-561", type: "movement", code: "561", rev: "562", category: "Movement Types",
    title: "561 — Initial Stock Entry",
    summary: "Load opening stock when standing up a material with no purchase history.",
    keywords: ["initial stock", "load opening stock", "first stock entry", "set starting quantity", "stock upload", "enter beginning balance", "no PO receipt"],
    body: "<p><strong>561</strong> enters initial stock — a starting balance for a material that isn't tied to a purchase order (e.g. data load, new site, or correcting a never-received balance). Use sparingly; it bypasses procurement. Reversal is <strong>562</strong>.</p>",
    related: ["mv-101", "tcode-migo"]
  },

  /* MOVEMENT TYPES — ISSUES (2xx) */
  {
    id: "mv-201", type: "movement", code: "201", rev: "202", category: "Movement Types",
    title: "201 — Goods Issue to a Cost Center",
    summary: "Consume stock to a cost center (e.g. shop supplies, maintenance use).",
    keywords: ["issue to cost center", "consume stock", "use up parts", "goods issue cost center", "charge to department", "supplies used"],
    body: "<p><strong>201</strong> issues stock to a cost center — the part leaves inventory and is expensed to a department or activity. Reversal is <strong>202</strong>.</p>",
    related: ["mv-261", "tcode-migo"]
  },
  {
    id: "mv-261", type: "movement", code: "261", rev: "262", category: "Movement Types",
    title: "261 — Goods Issue to a Production Order",
    summary: "Issue components into a production order — parts going into a unit being built.",
    keywords: ["issue to production", "parts into a unit", "consume components", "goods issue to order", "build a unit", "components to production", "feed the line"],
    body: "<p><strong>261</strong> issues components to a production order — the parts physically go into the unit being assembled. If the wrong part was issued, reverse with <strong>262</strong> and re-issue the correct part with 261. This pair is central to parts-to-unit quality fixes.</p>",
    related: ["mv-262", "tcode-co03", "howto-parts-to-unit", "tcode-migo"]
  },
  {
    id: "mv-262", type: "movement", code: "262", rev: "261", category: "Movement Types",
    title: "262 — Reverse Goods Issue to Production",
    summary: "Pull a wrongly-issued component back out of a production order.",
    keywords: ["reverse 261", "undo production issue", "wrong part issued", "take part back from order", "cancel goods issue to production", "fix wrong component"],
    body: "<p><strong>262</strong> reverses a 261 — it returns a component from a production order back to inventory. The standard fix for a mis-issued part is: <strong>262</strong> to take it back, then <strong>261</strong> to issue the correct one.</p>",
    related: ["mv-261", "howto-parts-to-unit"]
  },

  /* MOVEMENT TYPES — TRANSFERS (3xx) */
  {
    id: "mv-311", type: "movement", code: "311", rev: "312", category: "Movement Types",
    title: "311 — Transfer Between Storage Locations",
    summary: "Move stock from one storage location to another within the same plant.",
    keywords: ["transfer stock", "move to another location", "wrong location", "wrong bin", "relocate stock", "change storage location", "move between slocs", "put it in the right place"],
    body: "<p><strong>311</strong> transfers stock between two storage locations in the same plant — the part is physically fine and free, it's just in the wrong place. One-step move; reversal is <strong>312</strong>. (Across plants, you'd use a stock transport order instead.)</p>",
    related: ["mv-309", "concept-two-step-transfer", "tcode-migo"]
  },
  {
    id: "mv-309", type: "movement", code: "309", rev: "310", category: "Movement Types",
    title: "309 — Material-to-Material Transfer",
    summary: "Re-label stock from one part number to another (fix a mislabeled or reclassified part).",
    keywords: ["material to material", "wrong part number", "re-label part", "change material number", "reclassify stock", "convert part number", "mislabeled material"],
    body: "<p><strong>309</strong> transfers a quantity from material A to material B — effectively re-numbering stock without physically moving it. Use it when a part was received under the wrong material number, or to convert between interchangeable part numbers. Reversal is <strong>310</strong>.</p>",
    related: ["mv-311", "tcode-migo"]
  },
  {
    id: "mv-321", type: "movement", code: "321", rev: "322", category: "Movement Types",
    title: "321 — Quality Inspection → Unrestricted",
    summary: "Release inspected stock so it can finally be used or shipped.",
    keywords: ["release qi", "release quality stock", "quality to unrestricted", "approve stock", "passed inspection", "unlock quality stock", "stock stuck in inspection", "free up qi stock", "release inspection"],
    body: "<p><strong>321</strong> moves stock from <em>Quality Inspection</em> to <em>Unrestricted</em> — the release that makes inspected stock usable. Post it only after QA signs off. This is the single most common “my stock won't consume” fix when the stock is sitting in QI. Reversal (back to QI) is <strong>322</strong>.</p>",
    related: ["mv-343", "concept-stock-types", "howto-release-stock", "error-cannot-consume"]
  },
  {
    id: "mv-343", type: "movement", code: "343", rev: "344", category: "Movement Types",
    title: "343 — Blocked → Unrestricted",
    summary: "Release blocked/quarantined stock back to usable once it's cleared.",
    keywords: ["release blocked", "blocked to unrestricted", "unblock stock", "clear quarantine", "free blocked stock", "stock is blocked", "release quarantine"],
    body: "<p><strong>343</strong> moves stock from <em>Blocked</em> to <em>Unrestricted</em> — used when quarantined/held stock has been cleared for use. Reversal (block it again) is <strong>344</strong>. Together 321 and 343 are the two “unlock my stock” movements.</p>",
    related: ["mv-321", "concept-stock-types", "howto-release-stock", "error-cannot-consume"]
  },
  {
    id: "mv-344", type: "movement", code: "344", rev: "343", category: "Movement Types",
    title: "344 — Unrestricted → Blocked",
    summary: "Quarantine usable stock — put it on hold pending investigation.",
    keywords: ["block stock", "quarantine stock", "put on hold", "unrestricted to blocked", "hold stock", "freeze stock", "suspect part"],
    body: "<p><strong>344</strong> moves stock from <em>Unrestricted</em> to <em>Blocked</em> — quarantine a part that's damaged, suspect, or under investigation so it can't be consumed or shipped. Release it again with <strong>343</strong> once cleared.</p>",
    related: ["mv-343", "concept-stock-types"]
  },

  /* MOVEMENT TYPES — SHIPPING / INVENTORY (6xx, 7xx) */
  {
    id: "mv-601", type: "movement", code: "601", rev: "602", category: "Movement Types",
    title: "601 — Goods Issue for a Delivery (Shipping)",
    summary: "Ship stock out against an outbound delivery — it leaves your inventory.",
    keywords: ["ship stock", "goods issue delivery", "outbound delivery", "send to customer", "shipping", "dispatch stock", "stock leaving"],
    body: "<p><strong>601</strong> posts the goods issue for an outbound delivery — stock physically ships and leaves inventory, usually driven from the delivery (VL01N/VL02N) rather than typed by hand. Reversal is <strong>602</strong>.</p>",
    related: ["tcode-migo", "concept-stock-types"]
  },
  {
    id: "mv-701", type: "movement", code: "701", rev: "702", category: "Movement Types",
    title: "701 / 702 — Inventory Gain / Loss",
    summary: "The adjustment SAP auto-posts when you commit a count difference in MI07.",
    keywords: ["inventory gain", "inventory loss", "count adjustment", "stock correction", "701 702", "physical inventory difference posting", "write off difference"],
    body: "<p><strong>701</strong> (gain) and <strong>702</strong> (loss) are the physical-inventory difference movements. You rarely type them by hand — <strong>MI07</strong> posts them automatically when you commit a count variance. Seeing 701/702 in MB51 means a count adjustment happened there.</p>",
    related: ["tcode-mi07", "tcode-mi20", "howto-cycle-count"]
  },

  /* =======================================================
     CONCEPTS
     ======================================================= */
  {
    id: "concept-stock-types", type: "concept", category: "Core Concepts",
    title: "The Three Stock States",
    summary: "Every quantity sits in exactly one state: Unrestricted, Quality Inspection, or Blocked.",
    keywords: ["stock types", "stock states", "unrestricted", "quality inspection", "blocked stock", "why can't I use this stock", "stock status", "qi vs blocked", "stock categories"],
    body: "<p>Most “it's in stock but I can't use it” tickets are simply stock in the wrong <em>state</em>:</p><ul><li><strong>Unrestricted</strong> — free to use or ship. The good state.</li><li><strong>Quality Inspection (QI)</strong> — physically there but locked until QA releases it (movement <strong>321</strong>).</li><li><strong>Blocked</strong> — quarantined: damaged, suspect, or under investigation. Released with <strong>343</strong> after sign-off.</li></ul><p>A quantity is always in exactly one state. To make QI/Blocked stock usable you don't “find more stock” — you <em>release</em> it.</p>",
    related: ["mv-321", "mv-343", "error-cannot-consume", "tcode-mmbe"]
  },
  {
    id: "concept-material-document", type: "concept", category: "Core Concepts",
    title: "Material Documents — the Audit Trail",
    summary: "Every goods movement creates a numbered, permanent material document. That's your evidence.",
    keywords: ["material document", "what is a material document", "audit trail", "posting record", "movement record", "document number", "proof of movement"],
    body: "<p>Every posted movement creates a <strong>material document</strong> — a permanent, numbered record of what moved, when, by whom, and which movement type. They can't be deleted, only reversed with a counter-posting. This is why SAP is auditable: the trail is the truth.</p><p>List them with <strong>MB51</strong>; open one with <strong>MB03</strong>.</p>",
    related: ["tcode-mb51", "tcode-mb03", "concept-reversal-rule"]
  },
  {
    id: "concept-reversal-rule", type: "concept", category: "Core Concepts",
    title: "The Reversal (+1) Rule",
    summary: "You never delete a posting — you reverse it. The reversal movement is almost always +1.",
    keywords: ["reverse a movement", "undo a posting", "reversal rule", "cancel a movement", "reversal movement type", "plus one rule", "how to reverse", "fix a wrong posting"],
    body: "<p>SAP doesn't let you delete a movement — you post its <strong>reversal</strong>, which leaves both the original and the correction in the audit trail. The reversal movement type is almost always the original <strong>+1</strong>: 101→102, 261→262, 311→312, 321→322, 701→702.</p><p>So if you posted the wrong thing, don't panic — post the reverse, then post it correctly.</p>",
    related: ["concept-material-document", "mv-262", "tcode-migo"]
  },
  {
    id: "concept-two-step-transfer", type: "concept", category: "Core Concepts",
    title: "One-Step vs Two-Step Transfers",
    summary: "Some moves post in one step; others go through an in-transit state needing a second posting.",
    keywords: ["two step transfer", "one step transfer", "in transit", "stock in transit", "transfer in process", "303 305", "removal and placement", "transfer not complete"],
    body: "<p>A <strong>one-step</strong> transfer (e.g. 311) removes and places stock in a single posting. A <strong>two-step</strong> transfer splits it: a removal (e.g. 303) sends stock into an <em>in-transit / in-transfer</em> state, and a second placement (305) completes it at the destination.</p><p>If stock seems to “disappear” mid-move, check for an in-transit quantity in MMBE — the second step was never posted.</p>",
    related: ["mv-311", "tcode-mmbe", "concept-stock-types"]
  },
  {
    id: "concept-special-stock", type: "concept", category: "Core Concepts",
    title: "Plant, Storage Location & Special Stock",
    summary: "Stock lives at plant → storage location, and may carry a special-stock indicator (consignment, project, etc.).",
    keywords: ["plant", "storage location", "sloc", "special stock", "consignment", "project stock", "where does stock live", "stock organization", "vendor consignment"],
    body: "<p>Stock is organised as <strong>plant → storage location (sloc)</strong>. A plant is a site; a sloc is an area/bin grouping within it. On top of that, a <strong>special-stock indicator</strong> can mark stock that isn't plain owned inventory — e.g. vendor <em>consignment</em>, <em>project</em> stock, or returnable packaging. MMBE shows these as separate buckets, which is often why a quantity “isn't there” in normal stock.</p>",
    related: ["tcode-mmbe", "concept-stock-types"]
  },
  {
    id: "concept-posting-period", type: "concept", category: "Core Concepts",
    title: "Posting Periods",
    summary: "Movements must post into an open period; a closed period blocks the posting until finance opens it.",
    keywords: ["posting period", "period closed", "open period", "month end close", "period not open", "MM period", "can't post wrong date"],
    body: "<p>Every movement posts into a financial <strong>posting period</strong> (month). Finance opens and closes these; only the current and (usually) previous period accept postings. If a movement is rejected for a posting-date/period reason, the period is closed — change the date to an open period or ask finance to open it.</p>",
    related: ["error-posting-period", "tcode-migo"]
  },

  /* =======================================================
     HOW-TO PLAYBOOKS
     ======================================================= */
  {
    id: "howto-release-stock", type: "howto", category: "How-To",
    title: "How to release stock that won't consume",
    summary: "Stock shows on hand but can't be used? It's in QI or Blocked — release it after QA signs off.",
    keywords: ["how to release stock", "stock won't consume", "can't use stock", "release inspection stock", "free up stock", "stock stuck", "make stock usable", "how do I release qi"],
    body: "<p>If MMBE shows the quantity exists but it can't be consumed or shipped, it's almost always sitting in <strong>Quality Inspection</strong> or <strong>Blocked</strong>.</p>",
    steps: ["Open MMBE and confirm which state the quantity is in (QI or Blocked)", "Get QA sign-off — never release on your own judgement", "In MIGO post 321 (QI → Unrestricted) or 343 (Blocked → Unrestricted)", "Re-check MMBE: the quantity should now be Unrestricted"],
    related: ["mv-321", "mv-343", "concept-stock-types", "error-cannot-consume"]
  },
  {
    id: "howto-cycle-count", type: "howto", category: "How-To",
    title: "How to run a cycle count",
    summary: "Create a count document, enter what you counted, review the variance, then post the adjustment.",
    keywords: ["how to cycle count", "do a count", "physical inventory steps", "count process", "stocktake steps", "reconcile stock", "count and adjust", "counting procedure"],
    body: "<p>The count loop is four transactions. Never skip the MI20 review — most large variances are miscounts or un-posted movements, not real loss.</p>",
    steps: ["MI01 — create the count document for the sloc/materials", "MI04 — enter the physically counted quantities", "MI20 — review book vs counted; investigate big gaps first", "MI07 — post the difference (auto 701/702) so system stock matches the count"],
    related: ["tcode-mi01", "tcode-mi04", "tcode-mi20", "tcode-mi07", "error-count-mismatch"]
  },
  {
    id: "howto-find-who-moved", type: "howto", category: "How-To",
    title: "How to find who moved stock (or where it went)",
    summary: "Use MB51 to replay every movement for a material and read the audit trail.",
    keywords: ["who moved my stock", "where did stock go", "find a movement", "trace stock", "audit who", "missing stock investigation", "stock disappeared", "track a posting"],
    body: "<p>When a quantity changed unexpectedly, the material document trail has the answer — every posting records the user, date and movement type.</p>",
    steps: ["Open MB51 and enter the Material (and Plant)", "Set a posting-date range around when it changed", "Execute and read the rows chronologically — note movement type + user", "Open any suspicious posting in MB03 for full detail"],
    related: ["tcode-mb51", "tcode-mb03", "concept-material-document"]
  },
  {
    id: "howto-fix-wrong-location", type: "howto", category: "How-To",
    title: "How to move stock to the right location",
    summary: "Stock is fine but in the wrong storage location — transfer it with 311.",
    keywords: ["wrong location fix", "move stock to correct sloc", "relocate stock how to", "stock in wrong bin", "transfer between locations how", "put stock in right place"],
    body: "<p>If the part is real and unrestricted but sitting in the wrong storage location, you don't adjust quantities — you transfer it.</p>",
    steps: ["Confirm in MMBE which sloc holds it and the target sloc", "Open MIGO → Transfer Posting", "Enter movement 311, the material, quantity, from-sloc and to-sloc", "Post; verify the new location in MMBE"],
    related: ["mv-311", "tcode-migo", "tcode-mmbe"]
  },
  {
    id: "howto-parts-to-unit", type: "howto", category: "How-To",
    title: "How to verify parts-to-unit (as-built vs BOM)",
    summary: "Prove the right parts went into a unit by comparing the production order to the BOM.",
    keywords: ["parts to unit", "as built vs bom", "verify components", "check what was built", "wrong part on unit", "quality check parts", "production order vs bom"],
    body: "<p>To confirm a unit was built with the correct parts, compare what was <em>issued</em> (CO03) with what was <em>specified</em> (CS03), and correct any mismatch with the 262→261 pair.</p>",
    steps: ["Open CO03 and list the components issued to the production order", "Open CS03 for the same material and read the BOM", "Compare part numbers and quantities line by line", "For any wrong part: reverse with 262, then re-issue the correct part with 261"],
    related: ["tcode-co03", "tcode-cs03", "mv-261", "mv-262"]
  },

  /* =======================================================
     ERRORS / TROUBLESHOOTING
     ======================================================= */
  {
    id: "error-cannot-consume", type: "error", category: "Troubleshooting",
    title: "“Stock shows but can't be consumed / shipped”",
    summary: "The quantity exists but is in Quality Inspection or Blocked — release it, don't re-order.",
    keywords: ["can't consume stock", "stock not available", "shows in stock but unavailable", "won't let me issue", "stock not usable", "available but blocked", "can't ship it", "stock there but locked"],
    body: "<p><strong>Cause:</strong> the quantity is in <em>QI</em> or <em>Blocked</em>, not Unrestricted.</p><p><strong>Fix:</strong> confirm the state in MMBE, get QA sign-off, then release with <strong>321</strong> (from QI) or <strong>343</strong> (from Blocked). Don't raise a new order — the stock is already there, just locked.</p>",
    related: ["concept-stock-types", "mv-321", "mv-343", "howto-release-stock"]
  },
  {
    id: "error-deficit", type: "error", category: "Troubleshooting",
    title: "“Deficit of unrestricted stock” (M7 021 / posting blocked)",
    summary: "You're trying to issue/transfer more than is free in that exact sloc & stock type.",
    keywords: ["deficit of stock", "M7 021", "not enough stock", "negative stock", "stock shortage error", "can't post not enough", "insufficient stock", "deficit unrestricted"],
    body: "<p><strong>Cause:</strong> the movement would drive the Unrestricted quantity in that specific plant/sloc/stock-type below zero — there genuinely isn't enough <em>free</em> stock there, even if total stock looks fine (the rest may be in QI, Blocked, another sloc, or in-transit).</p><p><strong>Fix:</strong> check MMBE for where the stock actually sits. Release QI/Blocked (321/343), transfer it into the right sloc (311), or reduce the quantity. If a receipt is genuinely missing, post it properly first.</p>",
    related: ["concept-stock-types", "mv-311", "mv-321", "tcode-mmbe"]
  },
  {
    id: "error-posting-period", type: "error", category: "Troubleshooting",
    title: "“Posting period not open / posting only possible in periods…”",
    summary: "Your posting date falls in a closed financial period.",
    keywords: ["posting period not open", "period closed error", "posting only possible in periods", "wrong date posting", "can't post date", "month end blocked", "period error"],
    body: "<p><strong>Cause:</strong> the document's posting date is in a period finance has closed; only the open period(s) accept postings.</p><p><strong>Fix:</strong> set the posting date into the current open period, or ask finance/your key user to open the period (MM period maintenance). Don't backdate into a closed month to force it.</p>",
    related: ["concept-posting-period", "tcode-migo"]
  },
  {
    id: "error-batch-required", type: "error", category: "Troubleshooting",
    title: "“Batch required / enter a batch”",
    summary: "The material is batch-managed, so every movement needs a batch number.",
    keywords: ["batch required", "enter a batch", "batch field mandatory", "batch managed error", "needs a lot number", "missing batch", "batch is required"],
    body: "<p><strong>Cause:</strong> the material master has batch management switched on (check MM03), so SAP won't post a movement without a valid batch.</p><p><strong>Fix:</strong> enter the correct batch on the movement. If you don't know it, find it via MMBE (stock by batch) or MSC3, or get the batch from the physical label/packaging.</p>",
    related: ["tcode-msc3", "tcode-mm03", "tcode-mmbe"]
  },
  {
    id: "error-movement-not-allowed", type: "error", category: "Troubleshooting",
    title: "“Movement type not allowed / not defined”",
    summary: "The movement type isn't permitted for this material, stock type, or your config.",
    keywords: ["movement type not allowed", "movement not defined", "not permitted movement", "wrong movement type", "movement type error", "can't use this movement"],
    body: "<p><strong>Cause:</strong> you're using a movement type that isn't valid for that material type, stock state, or your plant's configuration (or you typed a non-standard number).</p><p><strong>Fix:</strong> confirm you've picked the right movement for the job (use the movement reference in this library), and the right source stock state. If a standard movement is genuinely blocked at your plant, it's a config/customizing matter for your key user.</p>",
    related: ["tcode-migo", "concept-reversal-rule"]
  },
  {
    id: "error-count-mismatch", type: "error", category: "Troubleshooting",
    title: "“Count doesn't match the system”",
    summary: "Book vs physical disagree — investigate before adjusting; it's often a miscount or un-posted move.",
    keywords: ["count mismatch", "count doesn't match", "physical not matching system", "stock discrepancy", "variance too big", "book vs physical wrong", "count off"],
    body: "<p><strong>Cause:</strong> the counted quantity differs from the book quantity — could be a real loss/gain, a miscount, a wrong unit of measure, or a movement that wasn't posted yet.</p><p><strong>Fix:</strong> in MI20 review the variance; check MB51 for recent or pending movements; recount large gaps. Only when you trust the count, post the adjustment with MI07 (auto 701/702).</p>",
    related: ["tcode-mi20", "tcode-mi07", "tcode-mb51", "howto-cycle-count"]
  },
  {
    id: "error-wrong-part-issued", type: "error", category: "Troubleshooting",
    title: "“Wrong part issued to an order”",
    summary: "A bad 261 posting put the wrong component on a unit — reverse and re-issue.",
    keywords: ["wrong part issued", "wrong component on order", "mis-issued part", "fix wrong production issue", "took wrong part", "reverse wrong issue"],
    body: "<p><strong>Cause:</strong> a 261 issued the wrong component (or wrong quantity) to a production order.</p><p><strong>Fix:</strong> reverse the issue with <strong>262</strong>, then issue the correct part with <strong>261</strong>. Verify against the BOM (CS03) so the as-built (CO03) now matches.</p>",
    related: ["mv-262", "mv-261", "howto-parts-to-unit"]
  },

  /* =======================================================
     INTEGRATION & IDOCS
     ======================================================= */
  {
    id: "concept-idoc", type: "concept", category: "Integration & IDocs",
    title: "IDocs — How SAP Talks to Other Systems",
    summary: "An IDoc is the container SAP uses to exchange data with another system; when one fails it waits to be fixed, it isn't lost.",
    keywords: ["what is an idoc", "idoc", "interface", "intermediate document", "edi", "data exchange", "system interface", "how sap connects", "message type", "ale"],
    body: "<p>An <strong>IDoc</strong> (Intermediate Document) is the standard container SAP uses to move data in and out — to a warehouse control system, a 3PL, an EDI partner, or another SAP box. A goods movement, a delivery, or an order can all travel as an IDoc.</p><p>The key thing for the desk: when an IDoc <em>fails</em>, the data isn't gone — it's parked with an <strong>error status</strong> and can be fixed and reprocessed. Each IDoc carries a status code that tells you exactly where it stopped.</p>",
    related: ["tcode-bd87", "tcode-we02", "error-idoc-failed"]
  },
  {
    id: "tcode-bd87", type: "tcode", code: "BD87", category: "Integration & IDocs",
    title: "BD87 — IDoc Status Monitor & Reprocess",
    summary: "Monitor, analyse and reprocess failed IDocs — the screen behind most “BD87 errors”.",
    keywords: ["bd87", "bd87 error", "idoc failed", "reprocess idoc", "idoc error", "interface error", "idoc stuck", "status 51", "didn't post", "did not post", "reprocess", "edi failed", "idoc monitor", "push idoc through", "interface didn't work"],
    body: "<p><strong>BD87</strong> isn't an error — it's a transaction. When someone says “I got a BD87 error”, they mean <em>an IDoc failed and is sitting in BD87 waiting to be fixed</em>. It's the status monitor where you analyse a failed interface message and reprocess it.</p><p>IDocs are grouped by <strong>status code</strong>. The ones you'll meet most:</p><ul><li><strong>51</strong> — inbound, application document <em>not posted</em> (the data arrived but couldn't post). The most common one.</li><li><strong>64</strong> — inbound, ready to post (no error, just needs a push).</li><li><strong>56</strong> — IDoc added with errors (often partner-profile / config).</li><li><strong>02</strong> — outbound, error passing to the port (link to the other system).</li><li><strong>68</strong> — error, no further processing (manually closed).</li></ul><p>A status-51 failure is usually a normal IM problem wearing an integration costume — a deficit, a closed period, a missing batch, the wrong movement type. Fix that root cause, then reprocess; you rarely need the source system to re-send.</p>",
    steps: ["Open BD87 and filter by date / message type / status", "Drill into the failed IDoc and read the status records at the bottom — that's the real error message", "Fix the root cause (often a stock state, period, batch or movement-type issue)", "Select the IDoc and choose Process / reprocess — confirm it moves to status 53 (posted)"],
    related: ["concept-idoc", "tcode-we02", "tcode-we19", "error-idoc-failed"],
    fiori: "Monitor IDocs (status overview)"
  },
  {
    id: "tcode-we02", type: "tcode", code: "WE02", category: "Integration & IDocs",
    title: "WE02 / WE05 — Display IDocs",
    summary: "List and read IDocs in detail — the data segments, the status trail, and the partner.",
    keywords: ["we02", "we05", "display idoc", "view idoc", "read idoc", "idoc list", "idoc contents", "look at an idoc", "find an idoc"],
    body: "<p><strong>WE02</strong> (and the near-identical <strong>WE05</strong>) lists and displays IDocs so you can read one in full: its data segments (what it was trying to post), the control record (sender/receiver, message type), and the full status history. Use it to investigate <em>why</em> an IDoc failed before you reprocess it in BD87.</p>",
    steps: ["Open WE02, filter by date, direction, message type or IDoc number", "Execute and open the IDoc", "Read the data records (the payload) and the status records (the error trail)"],
    related: ["tcode-bd87", "tcode-we19", "concept-idoc"],
    fiori: "Monitor IDocs"
  },
  {
    id: "tcode-we19", type: "tcode", code: "WE19", category: "Integration & IDocs",
    title: "WE19 — IDoc Test Tool",
    summary: "Copy a failed IDoc, tweak the data, and test-post it to prove a fix before reprocessing the real one.",
    keywords: ["we19", "idoc test tool", "test an idoc", "replay idoc", "edit idoc", "simulate idoc", "fix idoc data", "reprocess with changes"],
    body: "<p><strong>WE19</strong> is the IDoc test tool. It clones an existing IDoc so you can adjust a field and post the copy — handy when the failure is in the IDoc's own data and you want to confirm the corrected values post cleanly before touching the real message. Powerful, so it's usually a key-user / support tool rather than everyday desk work.</p>",
    steps: ["Open WE19 and reference the failed IDoc number", "Edit the segment/field that caused the failure", "Run the inbound process to test-post the copy", "If it posts, apply the same fix (master data/config) and reprocess the original in BD87"],
    related: ["tcode-bd87", "tcode-we02", "concept-idoc"],
    fiori: "Test IDoc"
  },
  {
    id: "error-idoc-failed", type: "error", category: "Troubleshooting",
    title: "“IDoc failed to post” (BD87 / status 51)",
    summary: "An inbound interface message couldn't post — read the status text, fix the root cause, reprocess.",
    keywords: ["idoc failed", "idoc didn't post", "status 51", "bd87 error", "interface failed", "edi didn't post", "idoc stuck in error", "reprocess failed idoc", "goods movement idoc failed", "delivery idoc error"],
    body: "<p><strong>Cause:</strong> an inbound IDoc reached SAP but the application post was rejected — status <strong>51</strong>. The IDoc's status text holds the actual reason, and it's nearly always an ordinary IM problem: a deficit of unrestricted stock, a closed posting period, a missing/invalid batch, or a movement type that isn't allowed.</p><p><strong>Fix:</strong> open the IDoc (WE02 or directly in BD87) and read the status records. Resolve the underlying issue — release/transfer stock, open the period, supply the batch, correct the movement — then select the IDoc in <strong>BD87</strong> and reprocess. A clean post moves it to status 53. The source system does not need to re-send.</p>",
    related: ["tcode-bd87", "tcode-we02", "error-deficit", "error-posting-period", "error-batch-required"]
  }
];

/* ============================================================
   SYNONYM MAP — natural language → archive vocabulary
   Keys are phrases/words a person types; values are the
   canonical terms the engine also searches for. Multi-word
   keys are matched against the whole query first.
   ============================================================ */
window.SAP_SYNONYMS = {
  // states / "stuck" stock
  "stuck": ["quality inspection", "blocked", "release"],
  "locked": ["quality inspection", "blocked", "release"],
  "frozen": ["quality inspection", "blocked"],
  "held": ["blocked", "quality inspection"],
  "on hold": ["blocked"],
  "can't use": ["quality inspection", "blocked", "release", "unrestricted"],
  "cant use": ["quality inspection", "blocked", "release"],
  "cannot use": ["quality inspection", "blocked", "release"],
  "won't release": ["quality inspection", "blocked", "release"],
  "not available": ["quality inspection", "blocked", "deficit"],
  "unavailable": ["quality inspection", "blocked"],
  "quarantine": ["blocked"],
  "qi": ["quality inspection"],
  "inspection": ["quality inspection"],
  // counting
  "count": ["physical inventory", "cycle count"],
  "counting": ["physical inventory", "cycle count"],
  "stocktake": ["physical inventory"],
  "stock take": ["physical inventory"],
  "recount": ["physical inventory"],
  "variance": ["physical inventory", "difference"],
  "discrepancy": ["physical inventory", "difference", "count mismatch"],
  // movement / transfer
  "move": ["transfer", "311"],
  "relocate": ["transfer", "311"],
  "wrong location": ["transfer", "311", "storage location"],
  "wrong bin": ["transfer", "311", "storage location"],
  "wrong place": ["transfer", "311"],
  // reverse
  "undo": ["reverse", "reversal"],
  "cancel": ["reverse", "reversal"],
  "mistake": ["reverse", "reversal"],
  "wrong posting": ["reverse", "reversal"],
  "fix": ["reverse", "release", "transfer"],
  // receive / issue
  "receive": ["goods receipt", "101"],
  "receiving": ["goods receipt", "101"],
  "incoming": ["goods receipt", "101"],
  "arrived": ["goods receipt", "101"],
  "consume": ["goods issue", "261", "201"],
  "use up": ["goods issue", "261"],
  "ship": ["goods issue", "601", "delivery"],
  "dispatch": ["goods issue", "601"],
  // history / audit
  "who moved": ["material document", "mb51", "audit"],
  "history": ["material document", "mb51"],
  "audit": ["material document", "mb51"],
  "disappeared": ["material document", "mb51", "deficit"],
  "missing": ["material document", "mb51", "deficit"],
  "track": ["material document", "mb51", "serial"],
  "trace": ["material document", "mb51"],
  // shortage
  "shortage": ["deficit"],
  "not enough": ["deficit"],
  "negative": ["deficit"],
  "insufficient": ["deficit"],
  // serial / batch
  "serial": ["serial number", "iq03"],
  "lot": ["batch", "msc3"],
  // period
  "period": ["posting period"],
  "closed period": ["posting period"],
  "month end": ["posting period", "physical inventory"],
  // integration / idocs
  "idoc": ["idoc", "bd87", "interface"],
  "interface": ["idoc", "bd87"],
  "edi": ["idoc", "bd87"],
  "status 51": ["idoc", "bd87", "not posted"],
  "didn't post": ["idoc", "bd87", "deficit"],
  "did not post": ["idoc", "bd87"],
  "stuck in queue": ["idoc", "bd87"],
  "failed to post": ["idoc", "bd87"],
  // parts to unit
  "build": ["production order", "261", "bom"],
  "as built": ["production order", "co03"],
  "recipe": ["bom", "cs03"],
  "components": ["bom", "261", "production order"]
};
