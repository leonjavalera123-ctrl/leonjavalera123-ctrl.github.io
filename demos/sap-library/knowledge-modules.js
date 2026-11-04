/* ============================================================
   SAP S/4HANA Library — cross-module expansion
   ------------------------------------------------------------
   Adds curated, high-value entries beyond the original
   Inventory/Warehouse core so the archive covers the whole
   S/4HANA picture for anyone with a question.

   This file APPENDS to window.SAP_KB (defined in knowledge.js)
   and merges extra synonyms. It must load AFTER knowledge.js
   and BEFORE search.js.

   Every entry here carries a `module` field. The original
   IC entries don't — app.js defaults those to their area.
   Scope note: curated, not exhaustive. Deepen any module on
   request; this is the map of the most-asked codes & concepts.
   ============================================================ */
(function () {
  "use strict";

  var MORE = [

    /* ===================================================
       FINANCE (FI)
       =================================================== */
    {
      id: "fi-concept-universal-journal", type: "concept", module: "Finance", category: "Finance",
      title: "The Universal Journal (ACDOCA)",
      summary: "S/4HANA's single source of financial truth — one table holds FI and CO together, no more reconciliation.",
      keywords: ["universal journal", "acdoca", "single source of truth", "fi co integration", "one line item table", "s4hana finance", "general ledger table", "real time finance"],
      body: "<p>The <strong>Universal Journal</strong> (table <strong>ACDOCA</strong>) is the heart of S/4HANA Finance. Instead of separate ledgers for General Ledger, Controlling, Asset Accounting and Material Ledger that had to be reconciled, every financial line item lands in <em>one</em> table. That's why S/4 reporting is real-time and why FI and CO are no longer two worlds.</p>",
      related: ["s4-concept-vs-ecc", "fi-fb03", "co-concept-objects"]
    },
    {
      id: "fi-fb03", type: "tcode", code: "FB03", module: "Finance", category: "Finance",
      title: "FB03 — Display Accounting Document",
      summary: "Open any posted finance document to read its line items, accounts and amounts.",
      keywords: ["display accounting document", "view a finance posting", "fb03", "look at a journal entry", "accounting document number", "open finance document"],
      body: "<p><strong>FB03</strong> displays a posted accounting document — the financial counterpart to MB03. Every goods movement with a value, every invoice and journal entry creates one. Use it to see which G/L accounts were hit and for how much.</p>",
      related: ["fi-fbl3n", "fi-fb50", "tcode-mb03"]
    },
    {
      id: "fi-fb50", type: "tcode", code: "FB50", module: "Finance", category: "Finance",
      title: "FB50 — Post a G/L Journal Entry",
      summary: "Enter a manual general-ledger posting (debits and credits) directly.",
      keywords: ["post journal entry", "manual posting", "gl posting", "fb50", "enter gl document", "debit credit", "journal entry"],
      body: "<p><strong>FB50</strong> posts a manual G/L journal entry — you key the accounts, debits and credits, and the document must balance to zero. The classic equivalent is F-02; FB50 is the simpler single-screen version.</p>",
      related: ["fi-fb03", "fi-concept-gl-account"]
    },
    {
      id: "fi-fb60", type: "tcode", code: "FB60", module: "Finance", category: "Finance",
      title: "FB60 / FB70 — Enter Vendor / Customer Invoice",
      summary: "Post an incoming (vendor) or outgoing (customer) invoice directly in finance.",
      keywords: ["enter vendor invoice", "fb60", "fb70", "customer invoice", "post invoice finance", "ap invoice", "ar invoice"],
      body: "<p><strong>FB60</strong> posts an incoming vendor invoice (Accounts Payable); <strong>FB70</strong> posts an outgoing customer invoice (Accounts Receivable). These are the finance-only route — purchasing invoices usually come through MIRO instead, tied to a PO.</p>",
      related: ["mm-miro", "fi-fbl3n"]
    },
    {
      id: "fi-fbl3n", type: "tcode", code: "FBL3N", module: "Finance", category: "Finance",
      title: "FBL1N / FBL3N / FBL5N — Line Item Display",
      summary: "List open and cleared line items for a vendor (1N), G/L account (3N) or customer (5N).",
      keywords: ["line item display", "fbl3n", "fbl1n", "fbl5n", "vendor line items", "customer balance", "gl account line items", "open items", "what's outstanding"],
      body: "<p>The line-item trio: <strong>FBL1N</strong> (vendor), <strong>FBL3N</strong> (G/L account) and <strong>FBL5N</strong> (customer). Each lists open, cleared or all line items with powerful filters — the everyday way accounting answers “what's posted / outstanding on this account?”.</p>",
      related: ["fi-fb03", "fi-concept-gl-account"]
    },
    {
      id: "fi-concept-gl-account", type: "concept", module: "Finance", category: "Finance",
      title: "G/L Accounts, Document Types & Posting Keys",
      summary: "The vocabulary of a finance posting: which account, what kind of document, debit or credit.",
      keywords: ["gl account", "general ledger account", "document type", "posting key", "chart of accounts", "debit credit basics", "what is a gl account"],
      body: "<p>A <strong>G/L account</strong> classifies value (cash, revenue, expense…). A <strong>document type</strong> labels the kind of posting (e.g. KR vendor invoice, SA G/L). A <strong>posting key</strong> says whether a line is a debit or credit and what it posts to. Together they make every finance document self-describing and auditable.</p>",
      related: ["fi-fb50", "fi-concept-universal-journal"]
    },

    /* ===================================================
       CONTROLLING (CO)
       =================================================== */
    {
      id: "co-concept-objects", type: "concept", module: "Controlling", category: "Controlling",
      title: "Cost Centers, Internal Orders & Profit Centers",
      summary: "The 'where did the cost land' objects — CO is about managing cost internally, not external books.",
      keywords: ["cost center", "internal order", "profit center", "what is controlling", "co module", "cost object", "where costs go", "management accounting"],
      body: "<p>Controlling (CO) tracks cost <em>internally</em>. A <strong>cost center</strong> is a place that incurs cost (a department, a line). An <strong>internal order</strong> collects cost for a specific job or event. A <strong>profit center</strong> measures profitability of an area. In S/4 these post into the same Universal Journal as FI.</p>",
      related: ["co-ks03", "fi-concept-universal-journal"]
    },
    {
      id: "co-ks03", type: "tcode", code: "KS03", module: "Controlling", category: "Controlling",
      title: "KS01 / KS02 / KS03 — Cost Center Master",
      summary: "Create, change or display a cost center.",
      keywords: ["cost center master", "ks03", "ks01", "display cost center", "create cost center", "cost center details"],
      body: "<p>The cost-center master trio: <strong>KS01</strong> create, <strong>KS02</strong> change, <strong>KS03</strong> display. The same create/change/display pattern (01/02/03) runs through most SAP master-data t-codes.</p>",
      related: ["co-ksb1", "co-concept-objects"]
    },
    {
      id: "co-ksb1", type: "tcode", code: "KSB1", module: "Controlling", category: "Controlling",
      title: "KSB1 — Cost Center Actual Line Items",
      summary: "See every actual cost posted to a cost center — the CO audit trail.",
      keywords: ["ksb1", "cost center line items", "actual costs", "what was charged to cost center", "co line items", "costs report"],
      body: "<p><strong>KSB1</strong> lists the actual cost line items posted to a cost center over a period — the report you run to answer “what got charged here, and from where?”. Pairs with KSB1's planning counterparts for budget-vs-actual.</p>",
      related: ["co-ks03", "co-concept-objects"]
    },

    /* ===================================================
       PROCUREMENT (MM — buying)
       =================================================== */
    {
      id: "mm-concept-p2p", type: "concept", module: "Procurement", category: "Procurement",
      title: "Procure-to-Pay & the Three-Way Match",
      summary: "The buy cycle: requisition → PO → goods receipt → invoice, with PO/GR/invoice matched before payment.",
      keywords: ["procure to pay", "p2p", "three way match", "purchasing process", "po gr invoice", "buying cycle", "how procurement works"],
      body: "<p><strong>Procure-to-pay</strong> is the spine of buying: a <em>purchase requisition</em> (need) becomes a <em>purchase order</em> (commitment), goods arrive as a <em>goods receipt</em> (101), and the <em>invoice</em> is verified against the PO and GR — the <strong>three-way match</strong>. Only a clean match pays. Mismatches block until resolved.</p>",
      related: ["mm-me23n", "mm-me53n", "mm-miro", "mv-101"]
    },
    {
      id: "mm-me23n", type: "tcode", code: "ME23N", module: "Procurement", category: "Procurement",
      title: "ME21N / ME22N / ME23N — Purchase Order",
      summary: "Create, change or display a purchase order — the commitment to buy from a supplier.",
      keywords: ["purchase order", "me23n", "me21n", "create po", "display po", "change po", "po details", "buying order"],
      body: "<p>The purchase-order trio: <strong>ME21N</strong> create, <strong>ME22N</strong> change, <strong>ME23N</strong> display. A PO lists what you're buying, from whom, at what price, delivered where and when. Goods are received against it with 101 and invoiced via MIRO.</p>",
      related: ["mm-me53n", "mm-miro", "mv-101", "mm-concept-p2p"]
    },
    {
      id: "mm-me53n", type: "tcode", code: "ME53N", module: "Procurement", category: "Procurement",
      title: "ME51N / ME53N — Purchase Requisition",
      summary: "Create or display a purchase requisition — the internal request that precedes a PO.",
      keywords: ["purchase requisition", "me53n", "me51n", "create requisition", "pr", "request to buy", "display requisition"],
      body: "<p><strong>ME51N</strong> creates and <strong>ME53N</strong> displays a purchase requisition — an internal “please buy this” that a buyer turns into a purchase order. Often raised automatically by MRP.</p>",
      related: ["mm-me23n", "pp-md04", "mm-concept-p2p"]
    },
    {
      id: "mm-miro", type: "tcode", code: "MIRO", module: "Procurement", category: "Procurement",
      title: "MIRO — Logistics Invoice Verification",
      summary: "Enter a supplier invoice against a PO/goods receipt; SAP runs the three-way match.",
      keywords: ["miro", "invoice verification", "post supplier invoice", "match invoice to po", "logistics invoice", "vendor invoice purchasing", "invoice against po"],
      body: "<p><strong>MIRO</strong> posts a supplier invoice tied to a purchase order, checking it against the PO price and the goods receipt. If the three values agree it posts and is ready to pay; if not, SAP blocks it for review. Display a posted one with MIR4.</p>",
      related: ["mm-me23n", "mv-101", "mm-concept-p2p", "fi-fb60"]
    },

    /* ===================================================
       SALES (SD)
       =================================================== */
    {
      id: "sd-concept-otc", type: "concept", module: "Sales", category: "Sales",
      title: "Order-to-Cash (the Sales Cycle)",
      summary: "Sell cycle: sales order → delivery → goods issue → billing → payment.",
      keywords: ["order to cash", "otc", "sales process", "how selling works", "sales cycle", "quote to cash", "sd process"],
      body: "<p><strong>Order-to-cash</strong> is the sell side: a <em>sales order</em> (VA01) captures the customer demand, an <em>outbound delivery</em> (VL01N) picks and ships it, the <em>goods issue</em> (601) removes stock, and a <em>billing document</em> (VF01) invoices the customer. The reverse mirror of procure-to-pay.</p>",
      related: ["sd-va03", "sd-vl03n", "sd-vf03", "mv-601"]
    },
    {
      id: "sd-va03", type: "tcode", code: "VA03", module: "Sales", category: "Sales",
      title: "VA01 / VA02 / VA03 — Sales Order",
      summary: "Create, change or display a sales order — the customer's demand on you.",
      keywords: ["sales order", "va03", "va01", "create sales order", "display sales order", "customer order", "order details"],
      body: "<p>The sales-order trio: <strong>VA01</strong> create, <strong>VA02</strong> change, <strong>VA03</strong> display. The order captures what the customer wants, at what price, shipped where and when. List many orders with VA05.</p>",
      related: ["sd-vl03n", "sd-concept-otc", "md-bp"]
    },
    {
      id: "sd-vl03n", type: "tcode", code: "VL03N", module: "Sales", category: "Sales",
      title: "VL01N / VL02N / VL03N — Outbound Delivery",
      summary: "Create, change or display the delivery that picks, packs and ships a sales order.",
      keywords: ["outbound delivery", "vl03n", "vl01n", "create delivery", "ship order", "picking", "delivery document", "post goods issue delivery"],
      body: "<p>The outbound-delivery trio: <strong>VL01N</strong> create, <strong>VL02N</strong> change (where you post the goods issue, 601), <strong>VL03N</strong> display. The delivery is the logistics step between the sales order and the invoice.</p>",
      related: ["sd-va03", "mv-601", "sd-vf03"]
    },
    {
      id: "sd-vf03", type: "tcode", code: "VF03", module: "Sales", category: "Sales",
      title: "VF01 / VF03 — Billing Document",
      summary: "Create or display the invoice that bills the customer for a delivery.",
      keywords: ["billing document", "vf01", "vf03", "create invoice sales", "customer billing", "invoice the customer", "bill"],
      body: "<p><strong>VF01</strong> creates and <strong>VF03</strong> displays a billing document — the customer invoice that closes order-to-cash and posts the receivable to finance.</p>",
      related: ["sd-vl03n", "sd-concept-otc"]
    },

    /* ===================================================
       PRODUCTION (PP)
       =================================================== */
    {
      id: "pp-concept-mrp", type: "concept", module: "Production", category: "Production",
      title: "MRP — Material Requirements Planning",
      summary: "The engine that compares demand to supply and proposes what to buy or make, and when.",
      keywords: ["mrp", "material requirements planning", "what is mrp", "planning run", "planned orders", "supply and demand", "how planning works"],
      body: "<p><strong>MRP</strong> looks at demand (orders, forecasts) against supply (stock, POs, production) and proposes the gap-fillers: <em>planned orders</em> (to make) and <em>purchase requisitions</em> (to buy). It's run with MD01/MD02 and reviewed in MD04, the stock/requirements list.</p>",
      related: ["pp-md04", "pp-co03", "mm-me53n"]
    },
    {
      id: "pp-md04", type: "tcode", code: "MD04", module: "Production", category: "Production",
      title: "MD04 — Stock / Requirements List",
      summary: "The live picture of supply vs demand for a material — the planner's home screen.",
      keywords: ["md04", "stock requirements list", "supply demand list", "mrp list", "what's coming in and going out", "material planning view", "pegging"],
      body: "<p><strong>MD04</strong> shows, in real time, every supply and demand element for a material in date order — stock, POs, planned orders, sales orders, reservations. It's where a planner checks whether a part will run short. (MD05 is the static MRP-run result; MD04 is live.)</p>",
      related: ["pp-concept-mrp", "tcode-mmbe", "pp-co03"]
    },
    {
      id: "pp-co03", type: "tcode", code: "CO01", module: "Production", category: "Production",
      title: "CO01 / CO02 — Production Order",
      summary: "Create or change a production order — the instruction to build, against which parts are issued.",
      keywords: ["production order", "co01", "co02", "create production order", "make order", "build order", "manufacturing order"],
      body: "<p><strong>CO01</strong> creates and <strong>CO02</strong> changes a production order (display is CO03, in the core archive). The order drives component issues (261), confirmations and the goods receipt of the finished product. COOIS is the order information system for lists.</p>",
      related: ["tcode-co03", "mv-261", "howto-parts-to-unit", "pp-concept-mrp"]
    },

    /* ===================================================
       QUALITY (QM)
       =================================================== */
    {
      id: "qm-concept-lot", type: "concept", module: "Quality", category: "Quality",
      title: "Inspection Lots & the Usage Decision",
      summary: "QM creates an inspection lot for stock to be checked; the usage decision releases or rejects it.",
      keywords: ["inspection lot", "usage decision", "ud", "quality inspection process", "qm module", "how quality works", "accept reject stock"],
      body: "<p>When a material needs checking, QM raises an <strong>inspection lot</strong> and the stock sits in Quality Inspection. Results are recorded, then a <strong>usage decision (UD)</strong> accepts or rejects the lot — an accept typically triggers the 321 release to Unrestricted, tying QM straight back to your stock states.</p>",
      related: ["qm-qa32", "mv-321", "concept-stock-types"]
    },
    {
      id: "qm-qa32", type: "tcode", code: "QA32", module: "Quality", category: "Quality",
      title: "QA32 — Manage Inspection Lots",
      summary: "The QM worklist: see inspection lots, record results and make the usage decision.",
      keywords: ["qa32", "inspection lot worklist", "manage quality lots", "record results", "make usage decision", "qm worklist", "quality stock to release"],
      body: "<p><strong>QA32</strong> is the inspection-lot worklist — the everyday QM screen to find lots, record results, and post the usage decision. QA01/QA02/QA03 handle individual lots; QE51N is the results-recording worklist.</p>",
      related: ["qm-concept-lot", "mv-321"]
    },

    /* ===================================================
       MAINTENANCE (PM / EAM)
       =================================================== */
    {
      id: "pm-concept", type: "concept", module: "Maintenance", category: "Maintenance",
      title: "Notifications vs Maintenance Orders",
      summary: "PM splits the problem report (notification) from the work to fix it (order).",
      keywords: ["plant maintenance", "pm module", "notification vs order", "maintenance process", "eam", "how maintenance works", "breakdown repair"],
      body: "<p>In Plant Maintenance a <strong>notification</strong> reports a problem (something's broken / needs attention). A <strong>maintenance order</strong> plans and executes the fix — its labour, parts and costs. Parts issued to a PM order leave inventory just like production issues.</p>",
      related: ["pm-iw23", "pm-iw33", "tcode-iq03"]
    },
    {
      id: "pm-iw23", type: "tcode", code: "IW23", module: "Maintenance", category: "Maintenance",
      title: "IW21 / IW22 / IW23 — Maintenance Notification",
      summary: "Create, change or display a maintenance notification (the problem report).",
      keywords: ["maintenance notification", "iw23", "iw21", "report a problem", "create notification", "breakdown report", "fault report"],
      body: "<p>The notification trio: <strong>IW21</strong> create, <strong>IW22</strong> change, <strong>IW23</strong> display. Lists are IW28/IW29. The notification captures what's wrong and where (the equipment / functional location).</p>",
      related: ["pm-iw33", "pm-concept"]
    },
    {
      id: "pm-iw33", type: "tcode", code: "IW33", module: "Maintenance", category: "Maintenance",
      title: "IW31 / IW32 / IW33 — Maintenance Order",
      summary: "Create, change or display the work order that plans and records the repair.",
      keywords: ["maintenance order", "iw33", "iw31", "work order", "create work order", "repair order", "pm order", "plan the fix"],
      body: "<p>The maintenance-order trio: <strong>IW31</strong> create, <strong>IW32</strong> change, <strong>IW33</strong> display. Lists are IW38/IW39. The order carries the operations, the spare parts (issued from stock), and the cost of the job.</p>",
      related: ["pm-iw23", "pm-concept"]
    },

    /* ===================================================
       MASTER DATA (general)
       =================================================== */
    {
      id: "md-bp", type: "tcode", code: "BP", module: "Master Data", category: "Master Data",
      title: "BP — Business Partner (Customers & Vendors)",
      summary: "S/4HANA's single master for customers and vendors — the big change from ECC's separate records.",
      keywords: ["business partner", "bp", "customer master", "vendor master", "supplier master", "create customer", "create vendor", "xd03 xk03 replacement", "who is the customer", "maintain partner"],
      body: "<p><strong>BP</strong> is the central Business Partner transaction. In S/4HANA, customers and vendors are no longer maintained in separate t-codes (XD0x / XK0x) — they're <em>roles</em> on one Business Partner record. This <em>Business Partner approach</em> is mandatory in S/4 and one of the most-felt differences from ECC. Old display codes (XD03/XK03/MK03) still open, but BP is the master.</p>",
      related: ["s4-concept-vs-ecc", "sd-va03", "mm-me23n"]
    },
    {
      id: "md-mm01", type: "tcode", code: "MM01", module: "Master Data", category: "Master Data",
      title: "MM01 / MM02 / MM03 — Material Master",
      summary: "Create, change or display a material — the definitive record of a part.",
      keywords: ["material master", "mm01", "mm02", "create material", "change material", "part master", "set up a material"],
      body: "<p>The material-master trio: <strong>MM01</strong> create, <strong>MM02</strong> change, <strong>MM03</strong> display (in the core archive). A material is built from <em>views</em> (Basic, Sales, Purchasing, MRP, Quality, Accounting…), each owned by a different team — which is why MM01 asks which views and which org levels.</p>",
      related: ["tcode-mm03", "md-bp"]
    },

    /* ===================================================
       BASIS & TECHNICAL
       =================================================== */
    {
      id: "tech-se16n", type: "tcode", code: "SE16N", module: "Basis & Technical", category: "Basis & Technical",
      title: "SE16N — Data Browser (view a table)",
      summary: "Look directly at the contents of any SAP table — the power-user's window behind the screens.",
      keywords: ["se16n", "se16", "data browser", "view a table", "table contents", "look at table data", "query a table", "which table", "raw data"],
      body: "<p><strong>SE16N</strong> (and the older SE16) shows the raw contents of an SAP table with filters — e.g. MARD for storage-location stock, MSEG for material-document lines, EKKO/EKPO for PO header/items. Invaluable for investigation, but read-only by design for most users.</p>",
      related: ["tech-concept-tables", "tcode-mb51"]
    },
    {
      id: "tech-sm37", type: "tcode", code: "SM37", module: "Basis & Technical", category: "Basis & Technical",
      title: "SM37 — Background Job Monitor",
      summary: "See scheduled/background jobs and their status — did that overnight run finish or fail?",
      keywords: ["sm37", "background job", "job monitor", "scheduled job", "batch job", "did the job run", "job failed", "job log", "sm36 schedule"],
      body: "<p><strong>SM37</strong> lists background (batch) jobs with their status and logs — the place to confirm a scheduled run (an MRP run, a report, an interface) finished or to read why it cancelled. SM36 is where jobs are scheduled.</p>",
      related: ["tech-st22", "tech-sm58"]
    },
    {
      id: "tech-su01", type: "tcode", code: "SU01", module: "Basis & Technical", category: "Basis & Technical",
      title: "SU01 / SU3 — User Maintenance",
      summary: "Maintain a user and their roles (SU01); edit your own defaults and parameters (SU3).",
      keywords: ["su01", "su3", "user maintenance", "create user", "user roles", "authorizations", "my user settings", "default parameters", "lock user"],
      body: "<p><strong>SU01</strong> maintains user accounts, roles and authorisations (an admin task). <strong>SU3</strong> is your own profile — set your default printer, date format, and parameter IDs that pre-fill fields like plant. Authorisation failures trace back to roles assigned here.</p>",
      related: ["tech-st22"]
    },
    {
      id: "tech-st22", type: "tcode", code: "ST22", module: "Basis & Technical", category: "Basis & Technical",
      title: "ST22 — ABAP Runtime Errors (Dumps)",
      summary: "When a transaction crashes with a 'short dump', ST22 holds the technical detail.",
      keywords: ["st22", "abap dump", "short dump", "runtime error", "transaction crashed", "system error detail", "dump analysis", "it asked for st22"],
      body: "<p><strong>ST22</strong> lists ABAP runtime errors (short dumps) — the technical crash report when a transaction fails hard. You usually won't fix these, but opening the dump and giving support the timestamp + user speeds up the diagnosis enormously.</p>",
      related: ["tech-sm37", "tech-sm58"]
    },
    {
      id: "tech-sm58", type: "tcode", code: "SM58", module: "Basis & Technical", category: "Basis & Technical",
      title: "SM58 / SMQ1 / SMQ2 — RFC & Queue Monitors",
      summary: "Stuck interface calls between systems live here — the cousin of BD87 for RFC/queues.",
      keywords: ["sm58", "smq1", "smq2", "trfc", "qrfc", "stuck queue", "interface stuck", "rfc failed", "outbound queue", "inbound queue"],
      body: "<p><strong>SM58</strong> shows transactional-RFC calls that didn't go through; <strong>SMQ1</strong> (outbound) and <strong>SMQ2</strong> (inbound) show stuck qRFC queues. Where BD87 is for IDocs, these are for RFC-based interfaces — another place a “the interface didn't work” problem can be sitting.</p>",
      related: ["tcode-bd87", "concept-idoc"]
    },
    {
      id: "tech-concept-tables", type: "concept", module: "Basis & Technical", category: "Basis & Technical",
      title: "Transactions vs Tables (and finding both)",
      summary: "A t-code is a screen; a table is where the data actually lives. F1 → technical info reveals both.",
      keywords: ["transaction vs table", "what table is this field in", "find the table", "technical information", "f1 help", "where is data stored", "table behind a screen"],
      body: "<p>A <strong>transaction (t-code)</strong> is a program/screen; a <strong>table</strong> is the database object holding the data. To find which table/field is behind any screen field, click it and press <strong>F1 → Technical Information</strong>. Then browse the data with SE16N. This single trick turns “where does this come from?” into an answerable question.</p>",
      related: ["tech-se16n", "nav-command-field"]
    },

    /* ===================================================
       NAVIGATION & FIORI
       =================================================== */
    {
      id: "nav-command-field", type: "concept", module: "Navigation & Fiori", category: "Navigation & Fiori",
      title: "The Command Field (/n, /o, /nex)",
      summary: "The little box top-left runs t-codes and session shortcuts — the fastest way around SAP GUI.",
      keywords: ["command field", "slash n", "/n", "/o", "/nex", "how to enter a t-code", "new session", "transaction shortcuts", "sap gui navigation", "close sap"],
      body: "<p>The <strong>command field</strong> (top-left in SAP GUI) is your shortcut bar:</p><ul><li><strong>/n</strong> + code — go to a transaction (ends the current one).</li><li><strong>/o</strong> + code — open it in a <em>new</em> session (keep both).</li><li><strong>/n</strong> alone — back to the main menu.</li><li><strong>/nend</strong> — log off with a prompt; <strong>/nex</strong> — log off immediately (no prompt).</li></ul><p>Just typing a code (no slash) only works from the menu screen.</p>",
      related: ["nav-fiori", "tech-concept-tables"]
    },
    {
      id: "nav-fiori", type: "concept", module: "Navigation & Fiori", category: "Navigation & Fiori",
      title: "Fiori Launchpad vs SAP GUI",
      summary: "S/4HANA's modern face is Fiori — tile-based apps in a browser — sitting over the same data as classic GUI.",
      keywords: ["fiori", "fiori launchpad", "tiles", "sap gui vs fiori", "web interface", "modern sap", "app finder", "where are the apps", "s4hana ui"],
      body: "<p><strong>SAP Fiori</strong> is the role-based, tile-driven web UI of S/4HANA. Each tile is an <em>app</em> (often a modern version of a classic transaction — “Manage Physical Inventory” wraps the MI* codes). The <strong>App Finder</strong> lists everything your role can open. Classic SAP GUI still exists underneath; many people use both. That's why this library lists a Fiori app name alongside each t-code.</p>",
      related: ["nav-command-field", "s4-concept-vs-ecc"]
    },

    /* ===================================================
       S/4HANA CONCEPTS (signature differences)
       =================================================== */
    {
      id: "s4-concept-vs-ecc", type: "concept", module: "S/4HANA Concepts", category: "S/4HANA Concepts",
      title: "S/4HANA vs ECC — What Actually Changed",
      summary: "Same business processes, big plumbing changes: HANA in-memory, the Universal Journal, Business Partner, Fiori.",
      keywords: ["s4hana vs ecc", "what changed", "difference from ecc", "why s4hana", "migration", "new sap", "simplification", "ecc to s4"],
      body: "<p>S/4HANA keeps the familiar processes but rebuilds the foundation:</p><ul><li><strong>HANA in-memory</strong> — columnar database, so reports run on live data and many aggregate/total tables were removed.</li><li><strong>Universal Journal (ACDOCA)</strong> — one finance line-item table, FI and CO unified.</li><li><strong>Business Partner</strong> — one master for customers and vendors.</li><li><strong>Fiori</strong> — the new role-based UI.</li><li><strong>Material number</strong> extended to 40 characters; MM-IM data consolidated into MATDOC.</li></ul>",
      related: ["s4-concept-hana", "fi-concept-universal-journal", "md-bp", "nav-fiori"]
    },
    {
      id: "s4-concept-hana", type: "concept", module: "S/4HANA Concepts", category: "S/4HANA Concepts",
      title: "Why HANA Makes It Fast (in-memory & no aggregates)",
      summary: "Data lives in memory, columnar — so totals are computed on the fly and old summary tables are gone.",
      keywords: ["hana", "in memory", "why is s4hana fast", "columnar database", "no aggregate tables", "real time reporting", "embedded analytics", "live data"],
      body: "<p><strong>HANA</strong> holds data in-memory in a columnar layout, so summing millions of line items is instant. That removed the need for pre-calculated total/index tables that ECC kept in sync (and that could drift). The payoff for users: real-time stock and finance figures, and <em>embedded analytics</em> — live reports built on CDS views right inside the apps.</p>",
      related: ["s4-concept-vs-ecc", "fi-concept-universal-journal"]
    }

  ];

  if (window.SAP_KB && window.SAP_KB.push) {
    window.SAP_KB.push.apply(window.SAP_KB, MORE);
  }

  /* -------- extra synonyms for the new modules -------- */
  var MORE_SYN = {
    // finance
    "invoice": ["miro", "fb60", "invoice", "billing"],
    "journal entry": ["fb50", "gl", "posting"],
    "gl": ["general ledger", "fb50", "fbl3n"],
    "ledger": ["universal journal", "gl", "fbl3n"],
    "payment": ["fbl1n", "fbl5n", "invoice"],
    "accounting document": ["fb03", "fbl3n"],
    // controlling
    "cost center": ["ks03", "cost center", "ksb1"],
    "internal order": ["controlling", "cost"],
    // procurement
    "purchase order": ["me23n", "purchase order", "po"],
    "po": ["me23n", "purchase order"],
    "requisition": ["me53n", "requisition"],
    "buy": ["me23n", "purchase order", "requisition"],
    "supplier": ["business partner", "bp", "vendor"],
    "vendor": ["business partner", "bp", "vendor"],
    // sales
    "sales order": ["va03", "sales order"],
    "delivery": ["vl03n", "delivery", "601"],
    "billing": ["vf03", "billing", "invoice"],
    "customer": ["business partner", "bp", "customer"],
    "ship to customer": ["vl03n", "601", "delivery"],
    // production
    "mrp": ["md04", "mrp", "planning"],
    "planning": ["md04", "mrp"],
    "production order": ["co03", "co01", "production order", "261"],
    "make": ["production order", "co01"],
    // quality
    "inspection": ["quality inspection", "qa32", "inspection lot"],
    "usage decision": ["qa32", "inspection lot", "321"],
    // maintenance
    "work order": ["iw33", "maintenance order"],
    "maintenance": ["iw33", "iw23", "maintenance order"],
    "breakdown": ["iw23", "notification"],
    "equipment": ["iq03", "maintenance"],
    // master data
    "business partner": ["bp", "business partner"],
    "master data": ["bp", "material master", "mm03"],
    // technical
    "table": ["se16n", "table"],
    "background job": ["sm37", "job"],
    "job failed": ["sm37", "st22"],
    "dump": ["st22", "runtime error"],
    "user": ["su01", "user"],
    "authorization": ["su01", "roles"],
    "authorisation": ["su01", "roles"],
    "queue": ["smq1", "smq2", "sm58"],
    // navigation
    "transaction code": ["command field", "navigation"],
    "new session": ["command field", "navigation"],
    "fiori": ["fiori", "launchpad", "tiles"],
    "tile": ["fiori", "launchpad"],
    "log off": ["command field", "nex"],
    // s4 concepts
    "hana": ["hana", "in memory", "s4hana"],
    "ecc": ["ecc", "s4hana", "migration"],
    "what changed": ["s4hana", "ecc", "vs"]
  };
  if (window.SAP_SYNONYMS) {
    Object.keys(MORE_SYN).forEach(function (k) {
      window.SAP_SYNONYMS[k] = MORE_SYN[k];
    });
  }
})();
