
// StockSense - High Performance Restaurant Inventory OS
const seed = {
  products: [
    {id:1,name:"Paneer",sku:"DAI-001",barcode:"8901001001",category:"Dairy",unit:"kg",stock:7.2,min:10,reorder:14,max:24,cost:11.8,purchaseCost:11.8,store:"Main Store",expiry:"2026-09-22",icon:"🧀"},
    {id:2,name:"Tomato",sku:"VEG-001",barcode:"8901001002",category:"Vegetables",unit:"kg",stock:14,min:8,reorder:12,max:25,cost:3.4,purchaseCost:3.4,store:"Main Store",expiry:"2026-09-28",icon:"🍅"},
    {id:3,name:"Butter",sku:"DAI-002",barcode:"8901001003",category:"Dairy",unit:"kg",stock:8.4,min:6,reorder:9,max:16,cost:8.5,purchaseCost:8.5,store:"Main Store",expiry:"2026-10-04",icon:"🧈"},
    {id:4,name:"Cooking Cream",sku:"DAI-003",barcode:"8901001004",category:"Dairy",unit:"L",stock:4.8,min:5,reorder:8,max:14,cost:6.4,purchaseCost:6.4,store:"Main Store",expiry:"2026-09-20",icon:"🥛"},
    {id:5,name:"Arabica Coffee Beans",sku:"BEV-001",barcode:"8901001005",category:"Beverages",unit:"kg",stock:18.5,min:12,reorder:16,max:30,cost:18.5,purchaseCost:18.5,store:"Main Store",expiry:"2026-10-06",icon:"☕"},
    {id:6,name:"Basmati Rice",sku:"PAN-013",barcode:"8901001006",category:"Pantry",unit:"kg",stock:42,min:20,reorder:28,max:60,cost:3.4,purchaseCost:3.4,store:"Cold Store",expiry:"2027-08-10",icon:"🍚"}
  ],
  transactions: [
    {id:"TX-1048",date:"2026-09-14T10:30:00",type:"Purchase",product:"Paneer",store:"Main Store",qty:12,cost:11.8,user:"Akash Kumar",ref:"GRN-00218"},
    {id:"TX-1047",date:"2026-09-14T09:15:00",type:"Consumption",product:"Tomato",store:"Main Store",qty:-4.5,cost:3.4,user:"Deepu Kumar",ref:"CON-00821"},
    {id:"TX-1046",date:"2026-09-14T08:40:00",type:"Wastage",product:"Cooking Cream",store:"Main Store",qty:-1.2,cost:6.4,user:"Deepu Kumar",ref:"WST-00092"},
    {id:"TX-1045",date:"2026-09-13T16:10:00",type:"Consumption",product:"Butter",store:"Main Store",qty:-1.6,cost:8.5,user:"Deepu Kumar",ref:"CON-00820"},
    {id:"TX-1044",date:"2026-09-12T11:20:00",type:"Transfer out",product:"Basmati Rice",store:"Cold Store",qty:-10,cost:3.4,user:"Akash Kumar",ref:"TRF-00028"},
    {id:"TX-1043",date:"2026-09-12T12:05:00",type:"Transfer in",product:"Basmati Rice",store:"Main Store",qty:10,cost:3.4,user:"Akash Kumar",ref:"TRF-00028"}
  ],
  suppliers:[
    ["Fresh Foods Co.","Produce & dairy","orders@freshfoods.co",3,2180],
    ["Metro Provisions","Pantry & dry goods","sales@metroprovisions.com",5,1460],
    ["Green Valley Farms","Fresh produce","hello@greenvalley.co",2,890]
  ],
  stores:[
    ["Main Store","Primary material & inventory warehouse","Akash Kumar",6],
    ["Cold Store","Chilled storage, dairy, perishables & frozen stock","Deepu Kumar",2]
  ]
};

let stored = null;
try { stored = JSON.parse(localStorage.getItem("stocksense-data") || "null"); } catch(e){}

const state = stored && typeof stored === "object" ? stored : {
  ...seed,
  schemaVersion: 2,
  outwards: [],
  purchases: [],
  purchaseOrders: [],
  settings: {
    decimals: 0,
    rounding: "nearest-integer",
    general: {
      company: "Hotel Rajmudra",
      address: "Marunji Gaon Marunji, Road, near Rajmudra Petrol Pump, Hinjawadi, Pune, Maharashtra 411057",
      phone: "9507543741",
      email: "RajmudraStores@gmail.com",
      website: "http://www.hotelrajmudra.com/",
      financialYear: "April",
      department: "Kitchen",
      location: "Main Store",
      dateFormat: "DD-MM-YYYY",
      confirmDelete: true
    },
    inventory: { negative: false, adjustment: true, backdated: true, valuation: "Weighted average", unit: "kg", lowThreshold: 10, outWarning: true, recalculate: true, departmentTracking: true, multiLocation: true },
    transactions: { purchasePrefix: "GRN-", outwardPrefix: "OUT-", adjustmentPrefix: "ADJ-", autoNumber: true, manualNumber: false, edit: true, delete: true, backdatedPurchase: true, backdatedOutward: true, mode: "Keyboard first" },
    savedReports: []
  }
};

const defaultPurchases = [
  {
    no: "GRN-00218",
    date: "2026-09-14",
    supplier: "Fresh Foods Co.",
    store: "Main Store",
    reference: "INV-90214",
    remarks: "Weekly dairy delivery",
    items: [
      { product: "Paneer", qty: 12, rate: 11.8, unit: "kg", amount: 141.6 },
      { product: "Butter", qty: 10, rate: 8.5, unit: "kg", amount: 85.0 }
    ],
    total: 226.6,
    user: "Akash Kumar",
    status: "Posted",
    createdAt: "2026-09-14T10:30:00.000Z"
  },
  {
    no: "GRN-00217",
    date: "2026-09-06",
    supplier: "Metro Provisions",
    store: "Main Store",
    reference: "INV-84190",
    remarks: "Dry goods & beans restock",
    items: [
      { product: "Arabica Coffee Beans", qty: 15, rate: 18.5, unit: "kg", amount: 277.5 },
      { product: "Basmati Rice", qty: 25, rate: 3.4, unit: "kg", amount: 85.0 }
    ],
    total: 362.5,
    user: "Akash Kumar",
    status: "Posted",
    createdAt: "2026-09-06T11:15:00.000Z"
  },
  {
    no: "GRN-00216",
    date: "2026-08-24",
    supplier: "Green Valley Farms",
    store: "Main Store",
    reference: "INV-77120",
    remarks: "End of month produce delivery",
    items: [
      { product: "Tomato", qty: 40, rate: 3.4, unit: "kg", amount: 136.0 }
    ],
    total: 136.0,
    user: "Deepu Kumar",
    status: "Posted",
    createdAt: "2026-08-24T09:40:00.000Z"
  }
];

const defaultOutwards = [
  {
    no: "OUT-00084",
    date: "2026-09-14",
    department: "Kitchen",
    store: "Main Store",
    issuedTo: "Executive Chef",
    remarks: "Lunch prep & curry service",
    items: [
      { product: "Tomato", qty: 4.5, rate: 3.4, unit: "kg", amount: 15.3 }
    ],
    total: 15.3,
    user: "Deepu Kumar",
    status: "Issued",
    createdAt: "2026-09-14T09:15:00.000Z"
  },
  {
    no: "OUT-00083",
    date: "2026-09-13",
    department: "Bakery",
    store: "Main Store",
    issuedTo: "Pastry Chef",
    remarks: "Morning croissant & bakery production",
    items: [
      { product: "Butter", qty: 1.6, rate: 8.5, unit: "kg", amount: 13.6 }
    ],
    total: 13.6,
    user: "Deepu Kumar",
    status: "Issued",
    createdAt: "2026-09-13T16:10:00.000Z"
  },
  {
    no: "OUT-00082",
    date: "2026-09-10",
    department: "Bar",
    store: "Main Store",
    issuedTo: "Bar Manager",
    remarks: "Espresso & cold brew bar prep",
    items: [
      { product: "Arabica Coffee Beans", qty: 3.5, rate: 18.5, unit: "kg", amount: 64.75 }
    ],
    total: 64.75,
    user: "Akash Kumar",
    status: "Issued",
    createdAt: "2026-09-10T14:20:00.000Z"
  }
];

const defaultPayments = [
  { id: "PAY-00101", date: "2026-09-08", supplier: "Fresh Foods Co.", amount: 1500, mode: "Bank Transfer", ref: "NEFT-7829104", notes: "Settlement for weekly dairy supplies", recordedBy: "Akash Kumar" },
  { id: "PAY-00102", date: "2026-09-05", supplier: "Metro Provisions", amount: 1000, mode: "Cheque", ref: "CHQ-004812", notes: "Monthly grocery clearance", recordedBy: "Akash Kumar" },
  { id: "PAY-00103", date: "2026-08-28", supplier: "Green Valley Farms", amount: 650, mode: "UPI / Card", ref: "UPI-9182310", notes: "Produce batch settlement", recordedBy: "Deepu Kumar" }
];

const isFirstRun = !stored;

if (isFirstRun) {
  state.outwards = defaultOutwards;
  state.purchases = defaultPurchases;
  state.payments = defaultPayments;
  state.transactions = Array.isArray(seed.transactions) ? seed.transactions : [];
  state.isInitialized = true;
} else {
  state.outwards = Array.isArray(state.outwards) ? state.outwards : [];
  state.purchases = Array.isArray(state.purchases) ? state.purchases : [];
  state.payments = Array.isArray(state.payments) ? state.payments : [];
  state.transactions = Array.isArray(state.transactions) ? state.transactions : [];
  state.products = Array.isArray(state.products) ? state.products : [];
}
state.purchaseOrders = Array.isArray(state.purchaseOrders) ? state.purchaseOrders : [];
state.suppliers = Array.isArray(state.suppliers) && state.suppliers.length ? state.suppliers : seed.suppliers;
state.stores = Array.isArray(state.stores) && state.stores.length ? state.stores : seed.stores;

// Ensure Store 1 is Main Store and Store 2 is Cold Store
if (state.stores.length > 0) {
  state.stores[0][0] = "Main Store";
  if (!state.stores[0][1]) state.stores[0][1] = "Primary material & inventory warehouse";
  if (!state.stores[0][2]) state.stores[0][2] = "Akash Kumar";
}
if (state.stores.length > 1) {
  state.stores[1][0] = "Cold Store";
  if (!state.stores[1][1]) state.stores[1][1] = "Chilled storage, dairy, perishables & frozen stock";
  if (!state.stores[1][2]) state.stores[1][2] = "Deepu Kumar";
} else {
  state.stores.push(["Cold Store", "Chilled storage, dairy, perishables & frozen stock", "Deepu Kumar", 2]);
}

state.users = [
  { name: "Akash Kumar", role: "Owner", location: "All locations", active: true, email: "RajmudraStores@gmail.com", phone: "9507543741" },
  { name: "Akash Kumar", role: "Store Manager", location: "All locations", active: true, email: "RajmudraStores@gmail.com", phone: "9507543741" },
  { name: "Deepu Kumar", role: "Store Keeper", location: "Main Store", active: true, email: "RajmudraStores@gmail.com", phone: "9507543741" }
];

state.currentUser = (state.currentUser && state.currentUser !== "Alex Kim" && state.users.some(u => u.name === state.currentUser)) ? state.currentUser : "Akash Kumar";
state.currentUserRole = state.currentUserRole || (state.users.find(u => u.name === state.currentUser)?.role || "Owner");

const isStore1Name = s => !s || s === "Hotel Rajmudra - Main Store" || s === "Downtown Kitchen" || s === "Main Store";
const isStore2Name = s => s === "Kitchen Store" || s === "Cold Store";

state.currentStore = isStore2Name(state.currentStore) ? "Cold Store" : "Main Store";

state.settings = state.settings || {};
state.settings.general = {
  financialYear: "April",
  department: "Kitchen",
  dateFormat: "DD-MM-YYYY",
  confirmDelete: true,
  ...(state.settings.general || {}),
  company: "Hotel Rajmudra",
  address: "Marunji Gaon Marunji, Road, near Rajmudra Petrol Pump, Hinjawadi, Pune, Maharashtra 411057",
  phone: "9507543741",
  email: "RajmudraStores@gmail.com",
  website: "http://www.hotelrajmudra.com/",
  location: isStore2Name(state.settings.general?.location) ? "Cold Store" : "Main Store"
};

// Migrate historical records referencing old store names or users
if (Array.isArray(state.products)) {
  state.products.forEach(p => {
    if (isStore1Name(p.store)) p.store = "Main Store";
    else if (isStore2Name(p.store)) p.store = "Cold Store";
  });
}
if (Array.isArray(state.purchases)) {
  state.purchases.forEach(p => {
    if (isStore1Name(p.store)) p.store = "Main Store";
    else if (isStore2Name(p.store)) p.store = "Cold Store";
    if (p.user === "Alex Kim") p.user = "Akash Kumar";
    if (p.user === "Maya Chen") p.user = "Deepu Kumar";
  });
}
if (Array.isArray(state.outwards)) {
  state.outwards.forEach(o => {
    if (isStore1Name(o.store)) o.store = "Main Store";
    else if (isStore2Name(o.store)) o.store = "Cold Store";
    if (o.user === "Alex Kim") o.user = "Akash Kumar";
    if (o.user === "Maya Chen") o.user = "Deepu Kumar";
  });
}
if (Array.isArray(state.purchaseOrders)) {
  state.purchaseOrders.forEach(po => {
    if (isStore1Name(po.store)) po.store = "Main Store";
    else if (isStore2Name(po.store)) po.store = "Cold Store";
  });
}
if (Array.isArray(state.transactions)) {
  state.transactions.forEach(t => {
    if (isStore1Name(t.store)) t.store = "Main Store";
    else if (isStore2Name(t.store)) t.store = "Cold Store";
    if (t.user === "Alex Kim") t.user = "Akash Kumar";
    if (t.user === "Maya Chen") t.user = "Deepu Kumar";
  });
}
state.settings.inventory = state.settings.inventory || { negative: false, lowThreshold: 10, recalculate: true };
state.settings.transactions = state.settings.transactions || { purchasePrefix: "GRN-", outwardPrefix: "OUT-", auditPrefix: "AUD-" };
state.settings.savedReports = Array.isArray(state.settings.savedReports) ? state.settings.savedReports : [];
state.stockAudits = Array.isArray(state.stockAudits) ? state.stockAudits : [];

// Initialize departments in state so they can be added, modified or deleted
state.departments = Array.isArray(state.departments) && state.departments.length
  ? state.departments
  : ["Kitchen", "Bar", "Bakery", "Housekeeping", "Maintenance", "Production", "Office", "Other"];
let departments = state.departments;

// Default to 0 decimals for clean rounded figures (e.g. 2 instead of 2.00)
if (state.settings.decimals === undefined || state.settings.decimals === 2) {
  state.settings.decimals = 0;
}
if (!state.settings.rounding || state.settings.rounding === "normal") {
  state.settings.rounding = "nearest-integer";
}

// Bootstrap closing stock import on initial first run only
if (isFirstRun && typeof closingStockImport !== "undefined" && !state.imports?.closingAugust2026V2) {
  state.products = closingStockImport.map(p => ({
    ...p,
    icon: p.icon === "?" ? (p.category === "Dairy" ? "🧀" : p.category === "Veg" ? "🥦" : p.category === "Non Veg" ? "🥩" : p.category === "Fuel" ? "🔥" : "📦") : (p.icon || "📦")
  }));
  state.openingStock = Object.fromEntries(state.products.map(p => [p.name, p.stock]));
  state.imports = { ...(state.imports || {}), closingAugust2026V2: { source: "Closing August-26.xlsx", importedAt: new Date().toISOString(), items: state.products.length } };
}

if (!state.openingStock) {
  state.openingStock = {};
  state.products.forEach(p => {
    const net = state.transactions.filter(t => t.product === p.name).reduce((a, t) => a + Number(t.qty || 0), 0);
    state.openingStock[p.name] = p.stock - net;
  });
}

const save = () => {
  state.schemaVersion = 2;
  try {
    localStorage.setItem("stocksense-data", JSON.stringify(state));
    localStorage.setItem("stocksense-purchases", JSON.stringify(state.purchases || []));
  } catch (e) {
    console.error("Save error:", e);
    toast("Storage limit reached or local storage disabled");
  }
  updateSidebarMeta();
};

if (isFirstRun) {
  save();
}

const canManage = () => ["Owner","Admin"].includes(state.users.find(u => u.name === state.currentUser)?.role);

const today = new Date().toISOString().slice(0, 10);
const monthKey = d => String(d || today).slice(0, 7);
const monthName = m => {
  if (!m) return "";
  const parts = String(m).split("-");
  if (parts.length < 2) return m;
  const dt = new Date(Number(parts[0]), Number(parts[1]) - 1, 1);
  return dt.toLocaleDateString("en-US", { month: "long", year: "numeric" });
};

const roundNumber = (n, methodOverride, decimalsOverride) => {
  const method = methodOverride || state.settings?.rounding || "nearest-integer";
  const d = decimalsOverride !== undefined ? decimalsOverride : (state.settings?.decimals !== undefined ? Math.max(0, Number(state.settings.decimals)) : 0);
  const m = 10 ** d;
  const v = Number(n) || 0;

  if (method === "none") return v;
  if (method === "up" || method === "ceil") return Math.ceil(v * m) / m;
  if (method === "down" || method === "floor") return Math.floor(v * m) / m;
  if (method === "nearest-05") return Math.round(v * 20) / 20;
  if (method === "nearest-50") return Math.round(v * 2) / 2;
  if (method === "nearest-integer") return Math.round(v);
  if (method === "bankers") {
    // Banker's Rounding (Round half to nearest even)
    const shifted = v * m;
    const floor = Math.floor(shifted);
    const diff = shifted - floor;
    if (Math.abs(diff - 0.5) < 1e-9) {
      return (floor % 2 === 0 ? floor : floor + 1) / m;
    }
    return Math.round(shifted) / m;
  }
  // Default: Standard Half-Up
  return Math.round(v * m) / m;
};

const numberValue = (n, forcedDecimals) => {
  const d = forcedDecimals !== undefined ? forcedDecimals : (state.settings?.decimals !== undefined ? Math.max(0, Number(state.settings.decimals)) : 0);
  const val = roundNumber(n, undefined, d);
  const isNone = state.settings?.rounding === "none";
  // Clean numbers without forced .00 decimals (e.g. 2 instead of 2.00)
  return val.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: isNone ? 20 : d
  });
};
const money = n => numberValue(n);

const escapeHtml = s => String(s ?? "")
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#39;");

function highlightMatch(text, query) {
  if (!text) return "";
  const str = String(text);
  const q = (query || "").trim();
  if (!q) return escapeHtml(str);

  const lowerStr = str.toLowerCase();
  const lowerQ = q.toLowerCase();
  const idx = lowerStr.indexOf(lowerQ);
  if (idx !== -1) {
    const before = str.slice(0, idx);
    const match = str.slice(idx, idx + q.length);
    const after = str.slice(idx + q.length);
    return `${escapeHtml(before)}<mark class="search-match">${escapeHtml(match)}</mark>${escapeHtml(after)}`;
  }

  // Word or char matching fallback
  let res = "";
  let qI = 0;
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    if (qI < lowerQ.length && c.toLowerCase() === lowerQ[qI]) {
      res += `<mark class="search-match">${escapeHtml(c)}</mark>`;
      qI++;
    } else {
      res += escapeHtml(c);
    }
  }
  return res;
}

// ADVANCED PRODUCT SEARCH & RECOMMENDATION POPOVER SYSTEM
let currentSearchPopover = {
  input: null,
  query: "",
  items: [],
  activeIndex: 0,
  onSelect: null
};

function openProductSearchPopover(inputEl, query, onSelect) {
  const popover = document.getElementById("product-search-popover");
  if (!popover) return;
  const q = (query || "").trim().toLowerCase();
  if (!q) {
    closeProductSearchPopover();
    return;
  }

  // Filter products by name, sku, barcode, category
  const matches = state.products.map(p => {
    const nameLower = (p.name || "").toLowerCase();
    const skuLower = (p.sku || "").toLowerCase();
    const catLower = (p.category || "").toLowerCase();
    const barLower = (p.barcode || "").toLowerCase();

    let score = 0;
    if (nameLower.startsWith(q)) score = 100;
    else if (nameLower.split(/\s+/).some(w => w.startsWith(q))) score = 80;
    else if (nameLower.includes(q)) score = 60;
    else if (skuLower.includes(q) || catLower.includes(q) || barLower.includes(q)) score = 40;

    return { product: p, score };
  })
  .filter(item => item.score > 0)
  .sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name))
  .slice(0, 10);

  currentSearchPopover = {
    input: inputEl,
    query: q,
    items: matches.map(m => m.product),
    activeIndex: 0,
    onSelect
  };

  renderSearchPopover();

  const rect = inputEl.getBoundingClientRect();
  popover.style.top = (rect.bottom + window.scrollY + 4) + "px";
  popover.style.left = (rect.left + window.scrollX) + "px";
  popover.style.width = Math.max(380, rect.width) + "px";
  popover.style.display = "block";
}

function renderSearchPopover() {
  const popover = document.getElementById("product-search-popover");
  if (!popover) return;
  const { query, items, activeIndex } = currentSearchPopover;

  let html = `
    <div class="popover-header-hint">
      <span>Matching items for "${escapeHtml(query)}"</span>
      <span><kbd>↑</kbd><kbd>↓</kbd> navigate · <kbd>↵</kbd> select</span>
    </div>
  `;

  if (!items.length) {
    html += `
      <div class="popover-empty">No products matching "<b>${escapeHtml(query)}</b>"</div>
      <div class="popover-quick-add" onclick="quickAddProductFromSearch('${escapeQuote(query)}')">
        ＋ Quick create item "${escapeHtml(query)}" and select
      </div>
    `;
  } else {
    html += items.map((p, idx) => {
      const isSelected = idx === activeIndex;
      const stock = Number(p.stock) || 0;
      const min = Number(p.min) || 5;
      const stockStatus = stock <= 0 ? "out" : stock <= min ? "low" : "ok";
      const stockLabel = stock <= 0 ? "Out of Stock" : `${numberValue(stock)} ${p.unit || 'unit'}`;
      const highlightedName = highlightMatch(p.name, query);
      const highlightedCat = highlightMatch(p.category || 'General', query);
      const highlightedSku = highlightMatch(p.sku || '', query);
      const rate = p.purchaseCost || p.cost || 0;

      return `
        <div class="search-rec-item ${isSelected ? 'active' : ''}" data-idx="${idx}"
             onmousedown="selectSearchPopoverItem(${idx})">
          <div class="rec-left">
            <span class="rec-icon">${p.icon || '📦'}</span>
            <div class="rec-details">
              <span class="rec-name">${highlightedName}</span>
              <div class="rec-meta">
                <span class="rec-cat-pill">${highlightedCat}</span>
                ${p.sku ? `<span>SKU: ${highlightedSku}</span>` : ''}
              </div>
            </div>
          </div>
          <div class="rec-right">
            <span class="rec-stock-pill ${stockStatus}">${stockLabel}</span>
            <span class="rec-rate">Rate: ${money(rate)}</span>
          </div>
        </div>
      `;
    }).join("");
  }

  popover.innerHTML = html;
}

function closeProductSearchPopover() {
  const popover = document.getElementById("product-search-popover");
  if (popover) popover.style.display = "none";
  currentSearchPopover = { input: null, query: "", items: [], activeIndex: 0, onSelect: null };
}

function selectSearchPopoverItem(idx) {
  const { items, onSelect } = currentSearchPopover;
  const selected = items[idx];
  if (selected && onSelect) {
    onSelect(selected);
  }
  closeProductSearchPopover();
}

function quickAddProductFromSearch(name) {
  const trimmed = (name || "").trim();
  if (!trimmed) return;
  const newProd = {
    id: Date.now(),
    name: trimmed,
    sku: "ITEM-" + String(state.products.length + 1).padStart(3, "0"),
    category: "General",
    unit: "unit",
    stock: 0,
    min: 5,
    cost: 10,
    purchaseCost: 10,
    store: state.currentStore,
    icon: "📦"
  };
  state.products.push(newProd);
  save();
  if (currentSearchPopover.onSelect) {
    currentSearchPopover.onSelect(newProd);
  }
  closeProductSearchPopover();
  toast(`Created and selected "${trimmed}"`);
}
const dateKey = d => String(d).slice(0, 10);
const fmtDate = d => {
  if (!d) return "—";
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? d : dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const toast = msg => {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2800);
};

const productByName = name => {
  if (!name || typeof name !== "string") return undefined;
  const trimmed = name.trim();
  if (!trimmed) return undefined;
  const exact = state.products.find(p => p.name === trimmed);
  if (exact) return exact;
  const lower = trimmed.toLowerCase();
  const caseMatch = state.products.find(p => (p.name || "").trim().toLowerCase() === lower);
  if (caseMatch) return caseMatch;
  return state.products.find(p => (p.sku && p.sku.toLowerCase() === lower) || (p.barcode && p.barcode === trimmed));
};
const stockValue = () => state.products.reduce((sum, p) => sum + (Number(p.stock) || 0) * (Number(p.cost) || 0), 0);

function rebuildStock() {
  state.products.forEach(p => {
    p.stock = Number(state.openingStock[p.name] !== undefined ? state.openingStock[p.name] : p.stock);
  });
  state.transactions.slice().sort((a, b) => new Date(a.date) - new Date(b.date)).forEach(t => {
    const p = productByName(t.product);
    if (p) p.stock += Number(t.qty || 0);
  });
  save();
}

function updateSidebarMeta() {
  const storeEl = document.getElementById("sidebar-current-store");
  if (storeEl) storeEl.textContent = state.currentStore;
  const userEl = document.getElementById("sidebar-user-name");
  if (userEl) userEl.textContent = state.currentUser;
  const userRoleEl = document.getElementById("sidebar-user-role");
  const role = state.currentUserRole || state.users.find(u => u.name === state.currentUser)?.role || "Owner";
  if (userRoleEl) userRoleEl.textContent = role;
  const avatarEl = document.getElementById("sidebar-avatar");
  if (avatarEl) avatarEl.textContent = state.currentUser.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const lowCount = state.products.filter(p => p.stock < (p.min || state.settings.inventory?.lowThreshold || 5)).length;
  const badge = document.getElementById("stock-badge");
  if (badge) {
    badge.textContent = lowCount;
    badge.style.display = lowCount > 0 ? "inline-block" : "none";
  }
  const notifDot = document.getElementById("notif-badge");
  if (notifDot) notifDot.classList.toggle("show", lowCount > 0);
}

// Fixed setField to safely mutate any setting depth without crashing
function setField(path, value) {
  let parts = path.split(".");
  if (parts[0] === "settings") parts.shift();
  let obj = state.settings;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!obj[parts[i]]) obj[parts[i]] = {};
    obj = obj[parts[i]];
  }
  obj[parts[parts.length - 1]] = value;
}

const titleCase = s => String(s || '').split(/[-_]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
const escapeQuote = s => String(s).replace(/'/g, "\\'");

function layout(title, subtitle, actions = "", body = "") {
  return `
    <div class="page">
      <div class="page-head">
        <div>
          <div class="eyebrow">STOCKSENSE / ${title.toUpperCase()}</div>
          <h1>${title}</h1>
          <p class="subtitle">${subtitle}</p>
        </div>
        <div class="head-actions">${actions}</div>
      </div>
      ${body}
    </div>
  `;
}

function metric(label, value, icon, colour, detail = "") {
  return `
    <div class="metric-card">
      <div class="metric-top">
        <span>${label}</span>
        <span class="metric-icon ${colour}">${icon}</span>
      </div>
      <div class="metric-value">${value}</div>
      <div class="metric-bottom">${detail}</div>
    </div>
  `;
}

// Popover helpers
function toggleStoreDropdown(e) {
  e?.stopPropagation();
  closeAllPopovers("store-dropdown");
  const p = document.getElementById("store-dropdown");
  if (!p) return;
  p.innerHTML = `
    <div class="popover-header"><span>Select Active Warehouse</span></div>
    ${state.stores.map(s => `
      <button class="popover-item ${s[0] === state.currentStore ? 'active' : ''}" onclick="switchStore('${s[0]}')">
        <span>⌂</span> ${s[0]}
      </button>
    `).join("")}
    <div style="border-top:1px solid #e2e8f0; margin-top:6px; padding-top:6px;">
      <button class="popover-item" onclick="openModal('store')">＋ Add new location</button>
    </div>
  `;
  p.classList.toggle("open");
}

function switchStore(store) {
  state.currentStore = store;
  save();
  closeAllPopovers();
  showView(document.querySelector(".nav-item.active")?.dataset.view || "dashboard");
  toast("Active warehouse switched to " + store);
}

function toggleUserDropdown(e) {
  e?.stopPropagation();
  closeAllPopovers("user-dropdown");
  const p = document.getElementById("user-dropdown");
  if (!p) return;
  const currentRole = state.currentUserRole || state.users.find(u => u.name === state.currentUser)?.role;
  p.innerHTML = `
    <div class="popover-header"><span>Switch Active Profile</span></div>
    ${state.users.map(u => {
      const isActive = u.name === state.currentUser && (!currentRole || u.role === currentRole);
      return `
        <button class="popover-item ${isActive ? 'active' : ''}" onclick="switchUser('${escapeQuote(u.name)}', '${escapeQuote(u.role)}')">
          <div style="text-align:left;">
            <b>${escapeHtml(u.name)}</b>
            <div style="font-size:11px;color:#64748b;">${escapeHtml(u.role)}</div>
          </div>
          ${isActive ? '<span class="status ok" style="margin-left:auto;font-size:10px;padding:1px 6px;">Active</span>' : ''}
        </button>
      `;
    }).join("")}
  `;
  p.classList.toggle("open");
}

function switchUser(name, role) {
  state.currentUser = name;
  if (role) {
    state.currentUserRole = role;
  } else {
    const found = state.users.find(u => u.name === name);
    state.currentUserRole = found ? found.role : "Owner";
  }
  save();
  updateSidebarMeta();
  closeAllPopovers();
  toast(`Signed in as ${name} (${state.currentUserRole})`);
  if (document.querySelector(".nav-item.active")?.dataset.view === "users") {
    showView("users");
  }
}

function toggleNotifDropdown(e) {
  e?.stopPropagation();
  closeAllPopovers("notif-dropdown");
  const p = document.getElementById("notif-dropdown");
  if (!p) return;
  const low = state.products.filter(p => p.stock < (p.min || 5));
  const expiring = state.products.filter(p => p.expiry && new Date(p.expiry) <= new Date(Date.now() + 30 * 86400000));
  p.innerHTML = `
    <div class="popover-header">
      <span>Inventory Alerts (${low.length + expiring.length})</span>
      <button class="panel-link" onclick="closeAllPopovers();showView('inventory')">View all</button>
    </div>
    ${low.length === 0 && expiring.length === 0 ? '<div style="padding:14px;color:#64748b;font-size:12px;text-align:center;">All stock balances are healthy.</div>' : ''}
    ${low.slice(0, 5).map(item => `
      <div class="list-row" style="padding:8px 4px;">
        <span class="status low">Low</span>
        <div class="list-main">
          <b>${item.name}</b>
          <span>${item.stock} ${item.unit} (Min: ${item.min || 5})</span>
        </div>
        <button class="secondary" style="padding:4px 8px;font-size:11px;" onclick="closeAllPopovers();orderLowStockItem(${item.id})">PO</button>
      </div>
    `).join("")}
  `;
  p.classList.toggle("open");
}

function closeAllPopovers(exceptId) {
  document.querySelectorAll(".header-popover").forEach(el => {
    if (el.id !== exceptId) el.classList.remove("open");
  });
}
document.addEventListener("click", e => {
  closeAllPopovers();
  if (!e.target.closest("#product-search-popover") && !e.target.closest(".vfs-search-cell-wrap")) {
    closeProductSearchPopover();
  }
});

function openHelpModal() {
  openInAppModal("Keyboard Shortcuts & Guide", `
    <div style="font-size:13px;">
      <p style="color:#64748b;margin-bottom:16px;">Fast navigation and voucher entry shortcuts for StockSense:</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;background:#f8fafc;padding:16px;border-radius:8px;">
        <div><kbd>⌘ K</kbd> or <kbd>Ctrl+K</kbd> — Global search</div>
        <div><kbd>F2</kbd> — Focus voucher date</div>
        <div><kbd>F5</kbd> or <kbd>Ctrl+A</kbd> — Add voucher row</div>
        <div><kbd>F7</kbd> or <kbd>Ctrl+D</kbd> — Remove voucher row</div>
        <div><kbd>F8</kbd> or <kbd>Ctrl+S</kbd> — Save voucher</div>
        <div><kbd>F9</kbd> — Print voucher preview</div>
        <div><kbd>Esc</kbd> — Close modal / Cancel</div>
        <div><kbd>Enter</kbd> — Advance to next row</div>
      </div>
      <p style="margin-top:16px;color:#64748b;font-size:12px;">Data is automatically persisted to local storage and exports are available in CSV and printable PDF formats.</p>
    </div>
  `, `<button class="primary" onclick="closeModal()">Got it</button>`);
}

// Ledger Rows Rendering
function ledgerRows(rows) {
  return `
    <table class="table">
      <thead>
        <tr>
          <th>Reference</th>
          <th>Item</th>
          <th>Transaction</th>
          <th>Warehouse</th>
          <th>Quantity</th>
          <th>Unit Cost</th>
          <th>Value</th>
          <th>User</th>
          <th>Date</th>
          <th style="text-align:right;">Actions</th>
        </tr>
      </thead>
      <tbody>
        ${rows.map(t => `
          <tr>
            <td><b>${t.ref || '—'}</b></td>
            <td><div class="product-cell"><span class="product-dot">${productByName(t.product)?.icon || "📦"}</span>${t.product}</div></td>
            <td><span class="tag">${t.type}</span></td>
            <td>${t.store || "Main Store"}</td>
            <td class="num-cell" style="color:${t.qty < 0 ? "var(--red)" : "var(--green-text)"};font-weight:700">${t.qty > 0 ? "+" : ""}${numberValue(t.qty)}</td>
            <td class="num-cell">${money(t.cost)}</td>
            <td class="num-cell"><b>${money(Math.abs(t.qty) * (t.cost || 0))}</b></td>
            <td>${t.user || "Akash Kumar"}</td>
            <td>${fmtDate(t.date)}</td>
            <td style="text-align:right;">
              <div class="table-action-btns">
                <button type="button" class="secondary" onclick="editTransaction('${t.id || t.ref}')">Edit</button>
                <button type="button" class="danger-btn" onclick="deleteTransaction('${t.id || t.ref}')">Delete</button>
              </div>
            </td>
          </tr>
        `).join("") || '<tr><td colspan="10" class="empty-state">No transactions found.</td></tr>'}
      </tbody>
    </table>
  `;
}

function editTransaction(idOrRef) {
  const t = state.transactions.find(x => x.id === idOrRef || x.ref === idOrRef);
  if (!t) { toast("Transaction not found"); return; }
  openInAppModal("Edit Transaction — " + (t.ref || t.id), `
    <div class="form-grid">
      <div class="form-field full">
        <label>Item / Product *</label>
        <select id="et-product">
          ${state.products.map(p => `<option value="${escapeQuote(p.name)}" ${p.name === t.product ? 'selected' : ''}>${escapeHtml(p.name)}</option>`).join("")}
        </select>
      </div>
      <div class="form-field">
        <label>Transaction Type *</label>
        <select id="et-type">
          ${["Purchase","Stock Outward","Consumption","Adjustment","Wastage","Transfer in","Transfer out"].map(tp => `<option ${tp === t.type ? 'selected' : ''}>${tp}</option>`).join("")}
        </select>
      </div>
      <div class="form-field">
        <label>Date *</label>
        <input id="et-date" type="datetime-local" value="${(t.date || today).slice(0, 16)}">
      </div>
      <div class="form-field">
        <label>Quantity (positive for inward, negative for outward) *</label>
        <input id="et-qty" type="number" step="0.01" value="${t.qty}">
      </div>
      <div class="form-field">
        <label>Unit Cost Rate *</label>
        <input id="et-cost" type="number" step="0.01" value="${t.cost || 0}">
      </div>
      <div class="form-field">
        <label>Warehouse</label>
        <select id="et-store">
          ${state.stores.map(s => `<option ${s[0] === (t.store || state.currentStore) ? 'selected' : ''}>${escapeHtml(s[0])}</option>`).join("")}
        </select>
      </div>
      <div class="form-field">
        <label>Department</label>
        <select id="et-dept">
          ${["", ...departments].map(d => `<option value="${d}" ${d === (t.department || "") ? 'selected' : ''}>${escapeHtml(d || "None")}</option>`).join("")}
        </select>
      </div>
      <div class="form-field full">
        <label>Voucher / Reference #</label>
        <input id="et-ref" value="${escapeHtml(t.ref || '')}">
      </div>
      <div class="form-field full">
        <label>Remarks</label>
        <input id="et-remarks" value="${escapeHtml(t.remarks || '')}">
      </div>
    </div>
  `, `
    <button class="danger-btn" onclick="closeModal();deleteTransaction('${t.id || t.ref}')">Delete Transaction</button>
    <button class="secondary" onclick="closeModal()">Cancel</button>
    <button class="primary" onclick="saveTransactionEdit('${t.id || t.ref}')">Save Changes</button>
  `);
}

function saveTransactionEdit(idOrRef) {
  const t = state.transactions.find(x => x.id === idOrRef || x.ref === idOrRef);
  if (!t) return;
  const prod = document.getElementById("et-product")?.value;
  const type = document.getElementById("et-type")?.value;
  const dateVal = document.getElementById("et-date")?.value;
  const qty = Number(document.getElementById("et-qty")?.value) || 0;
  const cost = Number(document.getElementById("et-cost")?.value) || 0;
  const store = document.getElementById("et-store")?.value;
  const dept = document.getElementById("et-dept")?.value;
  const ref = document.getElementById("et-ref")?.value.trim();
  const remarks = document.getElementById("et-remarks")?.value.trim();

  if (!prod) { toast("Please select a product"); return; }
  if (qty === 0) { toast("Quantity cannot be zero"); return; }

  t.product = prod;
  t.type = type;
  t.date = dateVal ? (dateVal.length === 16 ? dateVal + ":00" : dateVal) : t.date;
  t.qty = qty;
  t.cost = cost;
  t.store = store;
  t.department = dept;
  t.ref = ref;
  t.remarks = remarks;

  save();
  rebuildStock();
  closeModal();
  toast("Transaction updated");
  if (currentReportType === "ledger") showView("reports");
  else showView("inventory-ledger");
}

function deleteTransaction(idOrRef) {
  const t = state.transactions.find(x => x.id === idOrRef || x.ref === idOrRef);
  if (!t) return;
  confirmModal(`Permanently delete transaction "${t.ref || t.id} — ${t.product}"? Stock will be recalculated automatically.`, () => {
    state.transactions = state.transactions.filter(x => x !== t);
    save();
    rebuildStock();
    toast("Transaction deleted");
    if (currentReportType === "ledger") showView("reports");
    else showView("inventory-ledger");
  });
}

// DASHBOARD
function dashboard() {
  const low = state.products.filter(p => p.stock > 0 && p.stock < (p.min || 10));
  const out = state.products.filter(p => p.stock <= 0);
  const thirtyDaysAhead = new Date(Date.now() + 30 * 86400000);
  const expiry = state.products.filter(p => p.expiry && new Date(p.expiry) <= thirtyDaysAhead).length;
  
  const purchasesToday = state.transactions.filter(t => dateKey(t.date) === today && t.type === "Purchase").reduce((a, t) => a + Math.abs(t.qty) * (t.cost || 0), 0);
  const consToday = state.transactions.filter(t => dateKey(t.date) === today && (t.type === "Consumption" || t.type === "Stock Outward")).reduce((a, t) => a + Math.abs(t.qty) * (t.cost || 0), 0);
  const wasteToday = state.transactions.filter(t => dateKey(t.date) === today && t.type === "Wastage").reduce((a, t) => a + Math.abs(t.qty) * (t.cost || 0), 0);

  const totalStockQty = state.products.reduce((a, p) => a + Number(p.stock || 0), 0);
  const curStoreItems = state.products.filter(p => !p.store || p.store === state.currentStore);

  return layout(
    "Good " + (new Date().getHours() < 12 ? "morning" : "afternoon") + ", " + state.currentUser.split(" ")[0],
    "Real-time inventory overview for " + state.currentStore + ".",
    `<button class="secondary" onclick="openModal('adjust')">＋ Stock adjustment</button>
     <button class="primary" onclick="newPurchase()">＋ New purchase</button>`,
    `
      <div class="metrics">
        ${metric("Total Stock Value", money(stockValue()), "📦", "blue", state.products.length + " active items")}
        ${metric("Units On Hand", numberValue(totalStockQty), "◈", "green", curStoreItems.length + " in " + state.currentStore)}
        ${metric("Low Stock Alerts", low.length, "!", "red", "Needs replenishment")}
        ${metric("Out of Stock", out.length, "×", "red", "Immediate PO required")}
        ${metric("Expiring Soon", expiry, "◷", "amber", "Within next 30 days")}
        ${metric("Today's Purchases", money(purchasesToday), "↗", "green", "Received into stock")}
        ${metric("Today's Issues", money(consToday), "↘", "blue", "Department consumption")}
        ${metric("Today's Wastage", money(wasteToday), "♲", "amber", "Spoiled / expired")}
      </div>

      <div class="grid-2">
        <div class="panel">
          <div class="panel-head">
            <span class="panel-title">Stock Movements Trend</span>
            <span class="pill">${fmtDate(today)}</span>
          </div>
          <div style="padding: 20px;">
            <div class="chart">
              <div class="bar-wrap">
                <div class="bar secondary-bar" style="height: 65%;"></div>
                <div class="bar primary-bar" style="height: 40%;"></div>
                <span class="day-label">Opening</span>
              </div>
              <div class="bar-wrap">
                <div class="bar secondary-bar" style="height: 80%;"></div>
                <div class="bar primary-bar" style="height: 60%;"></div>
                <span class="day-label">Week Avg</span>
              </div>
              <div class="bar-wrap">
                <div class="bar secondary-bar" style="height: ${Math.min(95, Math.max(15, purchasesToday > 0 ? 80 : 30))}%;"></div>
                <div class="bar primary-bar" style="height: ${Math.min(95, Math.max(15, consToday > 0 ? 65 : 20))}%;"></div>
                <span class="day-label">Today</span>
              </div>
            </div>
            <div class="legend">
              <span><i style="background:var(--blue)"></i>Stock In (${money(purchasesToday)})</span>
              <span><i style="background:#93c5fd"></i>Stock Out (${money(consToday)})</span>
            </div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-head">
            <span class="panel-title">Reorder Queue</span>
            <button class="panel-link" onclick="showView('inventory')">View inventory →</button>
          </div>
          <div style="padding: 4px 0;">
            ${low.length === 0 ? '<div style="padding:30px;text-align:center;color:#64748b;">No items currently below minimum threshold.</div>' :
              low.slice(0, 4).map(p => {
                const buy = Math.max(1, (p.reorder || p.min || 10) - p.stock);
                return `
                  <div class="list-row">
                    <div class="list-icon red">${p.icon || "📦"}</div>
                    <div class="list-main">
                      <b>${p.name}</b>
                      <span>${numberValue(p.stock)} ${p.unit} on hand · Min ${p.min} ${p.unit}</span>
                    </div>
                    <button class="primary" style="padding:4px 10px;font-size:12px;" onclick="orderLowStockItem(${p.id})">Order ${numberValue(buy)}</button>
                  </div>
                `;
              }).join("")
            }
          </div>
        </div>
      </div>

      <div class="panel">
        <div class="panel-head">
          <span class="panel-title">Recent Stock Ledger</span>
          <button class="panel-link" onclick="showView('inventory-ledger')">Full ledger →</button>
        </div>
        <div class="view-table">
          ${ledgerRows(state.transactions.slice(0, 8))}
        </div>
      </div>
    `
  );
}

// INVENTORY & STOCK
let inventoryFilters = { search: "", department: "All", category: "All", store: "All", status: "All", page: 1, pageSize: 25 };

function inventory() {
  const totalQty = state.products.reduce((a, p) => a + Number(p.stock || 0), 0);
  const low = state.products.filter(p => p.stock > 0 && p.stock < (p.min || 10)).length;
  const out = state.products.filter(p => p.stock <= 0).length;

  const categories = [...new Set(state.products.map(p => p.category).filter(Boolean))];
  const depts = [...new Set(state.products.map(p => p.department).filter(Boolean))];

  return layout(
    "Stock Master",
    "Real-time item balances, unit rates and inventory valuations.",
    `<button class="secondary" onclick="openModal('adjust')">＋ Stock adjustment</button>
     <button class="secondary" onclick="exportStockCsv()">Export CSV</button>
     <button class="primary" onclick="openModal('product')">＋ Add new item</button>`,
    `
      <div class="metrics">
        ${metric("Total Items", state.products.length, "◈", "blue", "Active catalogue")}
        ${metric("Units On Hand", numberValue(totalQty), "▣", "green", "Total warehouse units")}
        ${metric("Low Stock", low, "!", "red", "Below reorder level")}
        ${metric("Out of Stock", out, "×", "red", "Zero inventory")}
        ${metric("Valuation", money(stockValue()), "◆", "amber", "Current ledger cost")}
      </div>

      <div class="filterbar">
        <input id="inv-search" placeholder="Search item, brand, SKU..." value="${inventoryFilters.search}" oninput="updateInventoryFilter('search', this.value)">
        <select onchange="updateInventoryFilter('department', this.value)">
          <option value="All" ${inventoryFilters.department === 'All' ? 'selected' : ''}>All Departments</option>
          ${depts.map(d => `<option value="${d}" ${inventoryFilters.department === d ? 'selected' : ''}>${d}</option>`).join("")}
        </select>
        <select onchange="updateInventoryFilter('category', this.value)">
          <option value="All" ${inventoryFilters.category === 'All' ? 'selected' : ''}>All Categories</option>
          ${categories.map(c => `<option value="${c}" ${inventoryFilters.category === c ? 'selected' : ''}>${c}</option>`).join("")}
        </select>
        <select onchange="updateInventoryFilter('store', this.value)">
          <option value="All" ${inventoryFilters.store === 'All' ? 'selected' : ''}>All Warehouses</option>
          ${state.stores.map(s => `<option value="${s[0]}" ${inventoryFilters.store === s[0] ? 'selected' : ''}>${s[0]}</option>`).join("")}
        </select>
        <select onchange="updateInventoryFilter('status', this.value)">
          <option value="All" ${inventoryFilters.status === 'All' ? 'selected' : ''}>All Stock Status</option>
          <option value="healthy" ${inventoryFilters.status === 'healthy' ? 'selected' : ''}>Healthy Stock</option>
          <option value="low" ${inventoryFilters.status === 'low' ? 'selected' : ''}>Low Stock</option>
          <option value="out" ${inventoryFilters.status === 'out' ? 'selected' : ''}>Out of Stock</option>
        </select>
      </div>

      <div class="panel">
        <div class="panel-head">
          <span class="panel-title">Stock Overview</span>
          <span class="pill" id="inv-count-pill">${state.products.length} items</span>
        </div>
        <div class="view-table" id="inventory-table-container">
          ${renderInventoryTable()}
        </div>
      </div>
    `
  );
}

function updateInventoryFilter(key, val) {
  inventoryFilters[key] = val;
  inventoryFilters.page = 1;
  const container = document.getElementById("inventory-table-container");
  if (container) container.innerHTML = renderInventoryTable();
}

function getFilteredProducts() {
  const q = inventoryFilters.search.toLowerCase();
  return state.products.filter(p => {
    const matchQ = !q || p.name.toLowerCase().includes(q) || (p.brand || "").toLowerCase().includes(q) || (p.category || "").toLowerCase().includes(q);
    const matchDept = inventoryFilters.department === "All" || p.department === inventoryFilters.department;
    const matchCat = inventoryFilters.category === "All" || p.category === inventoryFilters.category;
    const matchStore = inventoryFilters.store === "All" || p.store === inventoryFilters.store;
    let matchStatus = true;
    if (inventoryFilters.status === "healthy") matchStatus = p.stock >= (p.min || 10);
    else if (inventoryFilters.status === "low") matchStatus = p.stock > 0 && p.stock < (p.min || 10);
    else if (inventoryFilters.status === "out") matchStatus = p.stock <= 0;
    return matchQ && matchDept && matchCat && matchStore && matchStatus;
  });
}

function renderInventoryTable() {
  const filtered = getFilteredProducts();
  const pill = document.getElementById("inv-count-pill");
  if (pill) pill.textContent = `${filtered.length} items`;

  const start = (inventoryFilters.page - 1) * inventoryFilters.pageSize;
  const pageItems = filtered.slice(start, start + inventoryFilters.pageSize);
  const totalPages = Math.ceil(filtered.length / inventoryFilters.pageSize) || 1;

  return `
    <table class="table">
      <thead>
        <tr>
          <th>Item Name</th>
          <th>Category</th>
          <th>Warehouse</th>
          <th>Min / Reorder</th>
          <th>On Hand</th>
          <th>Unit Rate</th>
          <th>Stock Value</th>
          <th>Status</th>
          <th style="text-align:right;">Actions</th>
        </tr>
      </thead>
      <tbody>
        ${pageItems.map(p => {
          const statusClass = p.stock <= 0 ? "low" : p.stock < (p.min || 10) ? "expiry" : "ok";
          const statusText = p.stock <= 0 ? "Out of Stock" : p.stock < (p.min || 10) ? "Low Stock" : "Healthy";
          return `
            <tr>
              <td>
                <div class="product-cell">
                  <span class="product-dot">${p.icon || "📦"}</span>
                  <div>
                    <b>${p.name}</b>
                    <span style="display:block;font-size:11px;color:#64748b;">${p.brand ? p.brand + " · " : ""}${p.unit}</span>
                  </div>
                </div>
              </td>
              <td>${p.category || "—"}</td>
              <td>${p.store || "Main Store"}</td>
              <td>${p.min || 0} / ${p.reorder || 0}</td>
              <td class="num-cell" style="font-weight:700;${p.stock < (p.min||10) ? 'color:var(--red);' : ''}">${numberValue(p.stock)} ${p.unit}</td>
              <td class="num-cell">${money(p.purchaseCost || p.cost || 0)}</td>
              <td class="num-cell"><b>${money((p.stock || 0) * (p.cost || 0))}</b></td>
              <td><span class="status ${statusClass}">${statusText}</span></td>
              <td style="text-align:right;">
                <div class="table-action-btns">
                  <button type="button" class="secondary" onclick="viewItem(${p.id})">Details</button>
                  <button type="button" class="secondary" onclick="modifyItem(${p.id})">Edit</button>
                  <button type="button" class="secondary" onclick="filterLedgerForProductId(${p.id})">Ledger</button>
                  <button type="button" class="danger-btn" onclick="deleteItem(${p.id})">Delete</button>
                </div>
              </td>
            </tr>
          `;
        }).join("") || '<tr><td colspan="9" class="empty-state">No matching products found.</td></tr>'}
      </tbody>
    </table>

    <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-top:1px solid #e2e8f0;">
      <span style="font-size:12px;color:#64748b;">Showing ${Math.min(filtered.length, start + 1)} - ${Math.min(filtered.length, start + inventoryFilters.pageSize)} of ${filtered.length}</span>
      <div style="display:flex;gap:6px;">
        <button class="secondary" style="padding:4px 10px;font-size:12px;" ${inventoryFilters.page <= 1 ? 'disabled' : ''} onclick="inventoryFilters.page--;document.getElementById('inventory-table-container').innerHTML = renderInventoryTable();">Previous</button>
        <span style="display:grid;place-items:center;padding:0 8px;font-size:12px;font-weight:600;">${inventoryFilters.page} / ${totalPages}</span>
        <button class="secondary" style="padding:4px 10px;font-size:12px;" ${inventoryFilters.page >= totalPages ? 'disabled' : ''} onclick="inventoryFilters.page++;document.getElementById('inventory-table-container').innerHTML = renderInventoryTable();">Next</button>
      </div>
    </div>
  `;
}

function exportStockCsv() {
  const filtered = getFilteredProducts();
  const rows = [
    ["Item Name", "Brand", "Category", "Department", "Unit", "On Hand", "Cost Rate", "Total Value", "Min Level", "Warehouse"],
    ...filtered.map(p => [p.name, p.brand || "", p.category || "", p.department || "", p.unit, p.stock, p.cost || 0, (p.stock * (p.cost || 0)).toFixed(2), p.min || 0, p.store || ""])
  ];
  downloadCsv("stocksense-inventory.csv", rows);
}

function filterLedgerForProduct(productName) {
  ledgerFilterItem = productName;
  showView("inventory-ledger");
  toast("Showing ledger for " + productName);
}

function filterLedgerForProductId(id) {
  const p = state.products.find(x => x.id === id);
  if (p) filterLedgerForProduct(p.name);
}

function orderLowStockItem(id) {
  const p = state.products.find(x => x.id === id);
  if (!p) return;
  const buy = Math.max(1, (p.reorder || p.min || 10) - p.stock);
  newPurchaseOrder([{ product: p.name, qty: buy, rate: p.purchaseCost || p.cost || 0 }]);
}

// IN-APP MODAL HELPER
function openInAppModal(title, bodyHtml, actionsHtml = "") {
  const root = document.getElementById("modal-root");
  if (!root) return;
  root.innerHTML = `
    <div class="modal-backdrop" onclick="if(event.target===this)closeModal()">
      <div class="modal">
        <div class="modal-head">
          <h2>${title}</h2>
          <button class="modal-close" onclick="closeModal()">×</button>
        </div>
        <div>${bodyHtml}</div>
        <div class="modal-actions">
          ${actionsHtml || '<button class="secondary" onclick="closeModal()">Close</button>'}
        </div>
      </div>
    </div>
  `;
}

function closeModal() {
  const root = document.getElementById("modal-root");
  if (root) root.innerHTML = "";
}

function confirmModal(message, onConfirm) {
  openInAppModal("Confirmation Required", `
    <p style="margin:8px 0 16px;color:#334155;font-size:14px;">${message}</p>
  `, `
    <button class="secondary" onclick="closeModal()">Cancel</button>
    <button class="primary" id="modal-confirm-btn">Confirm</button>
  `);
  document.getElementById("modal-confirm-btn").onclick = () => {
    closeModal();
    onConfirm();
  };
}

function viewItem(id) {
  const p = state.products.find(x => x.id === id);
  if (!p) return;
  openInAppModal(p.name, `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:13px;margin-bottom:12px;">
      <div><span style="color:#64748b;">Category:</span> <b>${p.category || '—'}</b></div>
      <div><span style="color:#64748b;">Department:</span> <b>${p.department || '—'}</b></div>
      <div><span style="color:#64748b;">Unit:</span> <b>${p.unit}</b></div>
      <div><span style="color:#64748b;">Warehouse:</span> <b>${p.store || 'Main Store'}</b></div>
      <div><span style="color:#64748b;">Current Stock:</span> <b style="font-size:15px;color:var(--blue);">${numberValue(p.stock)} ${p.unit}</b></div>
      <div><span style="color:#64748b;">Cost Rate:</span> <b>${money(p.cost || 0)}</b></div>
      <div><span style="color:#64748b;">Min Level:</span> <b>${p.min || 0}</b></div>
      <div><span style="color:#64748b;">Reorder Level:</span> <b>${p.reorder || 0}</b></div>
    </div>
    <div style="background:#f8fafc;padding:12px;border-radius:8px;font-size:12px;color:#64748b;">
      Total stock valuation for this item: <b>${money((p.stock || 0) * (p.cost || 0))}</b>
    </div>
  `, `
    <button class="secondary" onclick="closeModal()">Close</button>
    <button class="secondary" onclick="closeModal();modifyItem(${p.id})">Edit Item</button>
    <button class="primary" onclick="closeModal();filterLedgerForProductId(${p.id})">View Ledger</button>
  `);
}

function modifyItem(id) {
  const p = state.products.find(x => x.id === id);
  if (!p) return;
  openInAppModal("Edit Item — " + p.name, `
    <div class="form-grid">
      <div class="form-field full">
        <label>Item Name</label>
        <input id="edit-name" value="${p.name}">
      </div>
      <div class="form-field">
        <label>Brand</label>
        <input id="edit-brand" value="${p.brand || ''}">
      </div>
      <div class="form-field">
        <label>Category</label>
        <input id="edit-category" value="${p.category || ''}">
      </div>
      <div class="form-field">
        <label>Department</label>
        <select id="edit-department">
          ${departments.map(d => `<option ${d === (p.department || 'Kitchen') ? 'selected' : ''}>${d}</option>`).join("")}
        </select>
      </div>
      <div class="form-field">
        <label>Unit</label>
        <select id="edit-unit">
          ${["kg","L","piece","gram","ml","case","unit"].map(u => `<option ${u === p.unit ? 'selected' : ''}>${u}</option>`).join("")}
        </select>
      </div>
      <div class="form-field">
        <label>Cost / Purchase Rate</label>
        <input id="edit-cost" type="number" step="0.01" value="${p.purchaseCost || p.cost || 0}">
      </div>
      <div class="form-field">
        <label>Min Stock</label>
        <input id="edit-min" type="number" value="${p.min || 0}">
      </div>
      <div class="form-field">
        <label>Reorder Level</label>
        <input id="edit-reorder" type="number" value="${p.reorder || 0}">
      </div>
    </div>
  `, `
    <button class="danger-btn" onclick="closeModal();deleteItem(${id})">Delete Item</button>
    <button class="secondary" onclick="closeModal()">Cancel</button>
    <button class="primary" onclick="saveItemChanges(${id})">Save Changes</button>
  `);
}

function deleteItem(id) {
  const p = state.products.find(x => x.id === id);
  if (!p) return;
  confirmModal(`Permanently delete "${p.name}" from catalog? This will remove the item record.`, () => {
    state.products = state.products.filter(x => x.id !== id);
    delete state.openingStock[p.name];
    rebuildStock();
    save();
    toast(`Item "${p.name}" deleted`);
    if (currentReportType === "stock") showView("reports");
    else showView("inventory");
  });
}

function saveItemChanges(id) {
  const p = state.products.find(x => x.id === id);
  if (!p) return;
  const newName = document.getElementById("edit-name")?.value.trim();
  if (!newName) { toast("Item name is required"); return; }
  const oldName = p.name;
  p.name = newName;
  p.brand = document.getElementById("edit-brand")?.value.trim() || "";
  p.category = document.getElementById("edit-category")?.value.trim() || "";
  p.department = document.getElementById("edit-department")?.value || "Kitchen";
  p.unit = document.getElementById("edit-unit")?.value || "unit";
  p.cost = Number(document.getElementById("edit-cost")?.value) || 0;
  p.purchaseCost = p.cost;
  p.min = Number(document.getElementById("edit-min")?.value) || 0;
  p.reorder = Number(document.getElementById("edit-reorder")?.value) || 0;

  if (oldName !== newName) {
    state.transactions.forEach(t => { if (t.product === oldName) t.product = newName; });
    if (state.openingStock[oldName] !== undefined) {
      state.openingStock[newName] = state.openingStock[oldName];
      delete state.openingStock[oldName];
    }
  }
  save();
  closeModal();
  showView("inventory");
  toast("Item saved successfully");
}

// PURCHASING & GOODS RECEIPT
let purchaseDraft = { date: today, supplier: "Fresh Foods Co.", store: "Main Store", reference: "", remarks: "", items: [], isNew: false };
const nextPurchaseNo = () => `GRN-${String((state.purchases || []).length + 219).padStart(5, "0")}`;

function newPurchase() {
  purchaseDraft = {
    no: nextPurchaseNo(),
    date: today,
    supplier: state.suppliers[0] ? state.suppliers[0][0] : "Fresh Foods Co.",
    store: state.currentStore,
    reference: "",
    remarks: "",
    items: [{ product: "", qty: 1, rate: 0, gstRate: 0, gstAmount: 0, amount: 0 }],
    isNew: true
  };
  showView("purchasing");
  setTimeout(() => {
    const firstInput = document.getElementById("p-search-0");
    if (firstInput) {
      firstInput.focus();
      firstInput.select();
    }
  }, 60);
}

function exitPurchaseFullscreen() {
  purchaseDraft.isNew = false;
  closeProductSearchPopover();
  showView("purchasing");
}

function purchaseScreen() {
  const totalTaxable = purchaseDraft.items.reduce((a, i) => a + (Number(i.qty) || 0) * (Number(i.rate) || 0), 0);
  const totalGst = purchaseDraft.items.reduce((a, i) => {
    const taxable = (Number(i.qty) || 0) * (Number(i.rate) || 0);
    const gRate = Number(i.gstRate) || 0;
    return a + roundNumber(taxable * (gRate / 100));
  }, 0);
  const grandTotal = totalTaxable + totalGst;
  const totalQty = purchaseDraft.items.reduce((a, i) => a + (Number(i.qty) || 0), 0);
  const vNo = purchaseDraft.no || nextPurchaseNo();

  return `
    <div class="voucher-fullscreen" id="purchase-fullscreen">
      <!-- Fullscreen Command Topbar -->
      <div class="vfs-topbar">
        <div class="vfs-topbar-left">
          <button type="button" class="vfs-back-btn" onclick="exitPurchaseFullscreen()" title="Return to Register">
            ← Exit Register <kbd>Esc</kbd>
          </button>
          <div class="vfs-title-group">
            <span class="vfs-type-icon">📥</span>
            <h2 class="vfs-heading">Goods Receipt Note (GRN)</h2>
            <span class="vfs-badge">${vNo}</span>
            <span class="vfs-status-pill">${purchaseDraft.no ? "POSTED" : "DRAFT ENTRY"}</span>
          </div>
        </div>

        <div class="vfs-shortcuts-bar">
          <span class="vfs-shortcut-chip"><kbd>↵ Enter</kbd> Next Field</span>
          <span class="vfs-shortcut-chip"><kbd>F5</kbd> Add Line</span>
          <span class="vfs-shortcut-chip"><kbd>F8</kbd> Save Voucher</span>
          <span class="vfs-shortcut-chip"><kbd>Esc</kbd> Exit</span>
        </div>

        <div class="vfs-topbar-actions">
          <button type="button" class="vfs-btn-secondary" onclick="exitPurchaseFullscreen()">Cancel</button>
          <button type="button" class="vfs-btn-secondary" onclick="addPurchaseRow()">＋ Add Item (F5)</button>
          <button type="button" class="vfs-btn-primary" id="btn-save-purchase" onclick="savePurchase()">✓ Post & Save (F8)</button>
        </div>
      </div>

      <!-- Master Details Card -->
      <div class="vfs-master-card">
        <div class="vfs-master-grid">
          <div class="vfs-field-group">
            <label>Purchase Date</label>
            <input type="date" class="vfs-master-input" value="${purchaseDraft.date}" onchange="purchaseDraft.date=this.value">
          </div>
          <div class="vfs-field-group">
            <label>Supplier / Vendor</label>
            <select class="vfs-master-select" onchange="purchaseDraft.supplier=this.value">
              ${state.suppliers.map(s => `<option ${s[0] === purchaseDraft.supplier ? 'selected' : ''}>${escapeHtml(s[0])}</option>`).join("")}
            </select>
          </div>
          <div class="vfs-field-group">
            <label>Receiving Warehouse</label>
            <select class="vfs-master-select" onchange="purchaseDraft.store=this.value;refreshPurchaseTableStock();">
              ${state.stores.map(s => `<option ${s[0] === purchaseDraft.store ? 'selected' : ''}>${escapeHtml(s[0])}</option>`).join("")}
            </select>
          </div>
          <div class="vfs-field-group">
            <label>Invoice / Challan #</label>
            <input class="vfs-master-input" value="${escapeHtml(purchaseDraft.reference || '')}" placeholder="e.g. INV-9902" oninput="purchaseDraft.reference=this.value">
          </div>
          <div class="vfs-field-group">
            <label>Delivery Remarks / Batch Notes</label>
            <input class="vfs-master-input" value="${escapeHtml(purchaseDraft.remarks || '')}" placeholder="Delivery remarks, batch info..." oninput="purchaseDraft.remarks=this.value">
          </div>
        </div>
      </div>

      <!-- Items Grid -->
      <div class="vfs-grid-scroll">
        <div class="vfs-table-container">
          <table class="vfs-table">
            <thead>
              <tr>
                <th style="width:36px;text-align:center;">#</th>
                <th style="min-width:280px;">Item Name (Type to search)</th>
                <th style="width:130px;">On Hand Stock</th>
                <th style="width:105px;" class="th-num">Qty</th>
                <th style="width:70px;">Unit</th>
                <th style="width:115px;" class="th-num">Rate</th>
                <th style="width:90px;" class="th-num">GST %</th>
                <th style="width:110px;" class="th-num">GST Amt</th>
                <th style="width:125px;" class="th-num">Total Amount</th>
                <th style="width:40px;text-align:center;"></th>
              </tr>
            </thead>
            <tbody id="purchase-items-body">
              ${renderPurchaseTableRows()}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Docked Bottom Bar -->
      <div class="vfs-docked-footer">
        <div class="vfs-footer-left">
          <div class="vfs-stat-item">
            <span>Items:</span>
            <b id="purchase-total-items">${purchaseDraft.items.length}</b>
          </div>
          <div class="vfs-stat-item">
            <span>Total Units:</span>
            <b id="purchase-total-qty">${numberValue(totalQty)}</b>
          </div>
          <div class="vfs-stat-item">
            <span>Taxable Subtotal:</span>
            <b id="purchase-total-taxable">${money(totalTaxable)}</b>
          </div>
          <div class="vfs-stat-item">
            <span>Total GST:</span>
            <b id="purchase-total-gst">${money(totalGst)}</b>
          </div>
          <span class="vfs-footer-validation valid">
            ✓ Recalculated live with GST · Press [F5] to add line items
          </span>
        </div>

        <div class="vfs-footer-right">
          <div class="vfs-grand-total">
            <span>Grand Total:</span>
            <strong id="purchase-total-val">${money(grandTotal)}</strong>
          </div>
          <div class="vfs-footer-actions">
            <button type="button" class="vfs-btn-secondary" onclick="addPurchaseRow()">＋ Add Row (F5)</button>
            <button type="button" class="vfs-btn-primary" id="btn-save-purchase-docked" onclick="savePurchase()">✓ Post & Save (F8)</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderPurchaseTableRows() {
  return purchaseDraft.items.map((item, idx) => {
    const p = productByName(item.product);
    const available = p?.stock || 0;
    const min = p?.min || 5;
    const sCls = !p ? '' : available <= 0 ? 'out-stock' : available <= min ? 'low-stock' : 'in-stock';
    const qty = Number(item.qty) || 0;
    const rate = Number(item.rate) || 0;
    const gstRate = Number(item.gstRate) || 0;
    const taxable = qty * rate;
    const gstAmt = roundNumber(taxable * (gstRate / 100));
    const totalAmount = taxable + gstAmt;

    return `
      <tr data-row="${idx}">
        <td class="vfs-row-index">${idx + 1}</td>
        <td>
          <div class="vfs-search-cell-wrap">
            <input id="p-search-${idx}" class="vfs-item-input" value="${escapeHtml(item.product || '')}"
              placeholder="Type 1-2 letters to search item..." autocomplete="off"
              oninput="handlePurchaseSearchInput(event, ${idx})"
              onfocus="handlePurchaseSearchFocus(event, ${idx})"
              onkeydown="handlePurchaseSearchKeydown(event, ${idx})">
          </div>
        </td>
        <td>
          <span class="vfs-stock-pill ${sCls}" id="p-stock-${idx}">
            ${p ? `${numberValue(available)} ${p.unit || 'unit'}` : '—'}
          </span>
        </td>
        <td style="width:105px;">
          <input type="number" id="p-qty-${idx}" class="vfs-num-input" step="1" min="0" value="${item.qty ?? 1}"
            oninput="updatePurchaseItemQty(${idx}, this.value)"
            onkeydown="handlePurchaseQtyKeydown(event, ${idx})">
        </td>
        <td class="vfs-unit-tag" id="p-unit-${idx}">${p?.unit || 'unit'}</td>
        <td style="width:115px;">
          <input type="number" id="p-rate-${idx}" class="vfs-num-input" step="1" min="0" value="${item.rate ?? 0}"
            oninput="updatePurchaseItemRate(${idx}, this.value)"
            onkeydown="handlePurchaseRateKeydown(event, ${idx})">
        </td>
        <td style="width:90px;">
          <input type="number" id="p-gst-${idx}" class="vfs-num-input vfs-gst-input" step="1" min="0" max="100" placeholder="0" value="${item.gstRate ?? 0}"
            oninput="updatePurchaseItemGst(${idx}, this.value)"
            onkeydown="handlePurchaseGstKeydown(event, ${idx})">
        </td>
        <td class="vfs-amount-cell" id="p-gstamt-${idx}">${money(gstAmt)}</td>
        <td class="vfs-amount-cell" id="p-amount-${idx}">${money(totalAmount)}</td>
        <td style="width:40px;text-align:center;">
          <button type="button" class="vfs-del-btn" onclick="removePurchaseRow(${idx})" title="Delete row">×</button>
        </td>
      </tr>
    `;
  }).join("") || `
    <tr>
      <td colspan="10" class="empty-state" style="padding:24px;text-align:center;color:var(--muted);">
        No items added. Press <kbd style="background:#e2e8f0;padding:2px 6px;border-radius:3px;">F5</kbd> or click "+ Add Item" to begin.
      </td>
    </tr>
  `;
}

function handlePurchaseSearchInput(e, idx) {
  if (!purchaseDraft.items[idx]) return;
  purchaseDraft.items[idx].product = e.target.value;
  const q = e.target.value.trim();
  if (q.length >= 1) {
    openProductSearchPopover(e.target, q, (selectedProd) => onSelectPurchaseItem(idx, selectedProd));
  } else {
    closeProductSearchPopover();
  }
}

function handlePurchaseSearchFocus(e, idx) {
  const q = e.target.value.trim();
  if (q.length >= 1) {
    openProductSearchPopover(e.target, q, (selectedProd) => onSelectPurchaseItem(idx, selectedProd));
  }
}

function handlePurchaseSearchKeydown(e, idx) {
  const popover = document.getElementById("product-search-popover");
  const isOpen = popover && popover.style.display !== "none" && currentSearchPopover.items.length > 0;

  if (isOpen) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      currentSearchPopover.activeIndex = (currentSearchPopover.activeIndex + 1) % currentSearchPopover.items.length;
      renderSearchPopover();
      const activeEl = popover.querySelector(`.search-rec-item[data-idx="${currentSearchPopover.activeIndex}"]`);
      if (activeEl) activeEl.scrollIntoView({ block: "nearest" });
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      currentSearchPopover.activeIndex = (currentSearchPopover.activeIndex - 1 + currentSearchPopover.items.length) % currentSearchPopover.items.length;
      renderSearchPopover();
      const activeEl = popover.querySelector(`.search-rec-item[data-idx="${currentSearchPopover.activeIndex}"]`);
      if (activeEl) activeEl.scrollIntoView({ block: "nearest" });
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      selectSearchPopoverItem(currentSearchPopover.activeIndex);
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      closeProductSearchPopover();
      return;
    }
  } else {
    if (e.key === "Enter") {
      e.preventDefault();
      const qtyEl = document.getElementById(`p-qty-${idx}`);
      if (qtyEl) {
        qtyEl.focus();
        qtyEl.select();
      }
    }
  }
}

function handlePurchaseQtyKeydown(e, idx) {
  if (e.key === "Enter") {
    e.preventDefault();
    updatePurchaseItemQty(idx, e.target.value);
    const rateEl = document.getElementById(`p-rate-${idx}`);
    if (rateEl) {
      rateEl.focus();
      rateEl.select();
    }
  }
}

function handlePurchaseRateKeydown(e, idx) {
  if (e.key === "Enter") {
    e.preventDefault();
    updatePurchaseItemRate(idx, e.target.value);
    const gstEl = document.getElementById(`p-gst-${idx}`);
    if (gstEl) {
      gstEl.focus();
      gstEl.select();
    }
  }
}

function handlePurchaseGstKeydown(e, idx) {
  if (e.key === "Enter") {
    e.preventDefault();
    updatePurchaseItemGst(idx, e.target.value);
    if (idx < purchaseDraft.items.length - 1) {
      const nextSearch = document.getElementById(`p-search-${idx + 1}`);
      if (nextSearch) {
        nextSearch.focus();
        nextSearch.select();
      }
    }
  }
}

function onSelectPurchaseItem(idx, product) {
  if (!purchaseDraft.items[idx]) return;
  purchaseDraft.items[idx].product = product.name;
  if (!purchaseDraft.items[idx].rate) {
    purchaseDraft.items[idx].rate = product.purchaseCost || product.cost || 0;
  }
  if (product.gstRate !== undefined && purchaseDraft.items[idx].gstRate === 0) {
    purchaseDraft.items[idx].gstRate = Number(product.gstRate) || 0;
  }

  const searchInput = document.getElementById(`p-search-${idx}`);
  if (searchInput) searchInput.value = product.name;

  const stockPill = document.getElementById(`p-stock-${idx}`);
  if (stockPill) {
    const s = Number(product.stock) || 0;
    const sCls = s <= 0 ? 'out-stock' : s <= (product.min || 5) ? 'low-stock' : 'in-stock';
    stockPill.className = `vfs-stock-pill ${sCls}`;
    stockPill.textContent = `${numberValue(s)} ${product.unit || 'unit'}`;
  }

  const unitCell = document.getElementById(`p-unit-${idx}`);
  if (unitCell) unitCell.textContent = product.unit || 'unit';

  const rateInput = document.getElementById(`p-rate-${idx}`);
  if (rateInput && !Number(rateInput.value)) {
    rateInput.value = purchaseDraft.items[idx].rate;
  }

  const gstInput = document.getElementById(`p-gst-${idx}`);
  if (gstInput && purchaseDraft.items[idx].gstRate) {
    gstInput.value = purchaseDraft.items[idx].gstRate;
  }

  recalcPurchaseItemRow(idx);
  refreshPurchaseTotals();

  // Advance focus to Qty field
  setTimeout(() => {
    const qtyInput = document.getElementById(`p-qty-${idx}`);
    if (qtyInput) {
      qtyInput.focus();
      qtyInput.select();
    }
  }, 30);
}

function updatePurchaseItemName(idx, name) {
  if (!purchaseDraft.items[idx]) return;
  purchaseDraft.items[idx].product = name;
  const p = productByName(name);
  if (p && !purchaseDraft.items[idx].rate) {
    purchaseDraft.items[idx].rate = p.purchaseCost || p.cost || 0;
  }
  const stockPill = document.getElementById(`p-stock-${idx}`);
  if (stockPill && p) {
    const s = Number(p.stock) || 0;
    const sCls = s <= 0 ? 'out-stock' : s <= (p.min || 5) ? 'low-stock' : 'in-stock';
    stockPill.className = `vfs-stock-pill ${sCls}`;
    stockPill.textContent = `${numberValue(s)} ${p.unit || 'unit'}`;
  }
  const unitCell = document.getElementById(`p-unit-${idx}`);
  if (unitCell) unitCell.textContent = p?.unit || 'unit';
  const rateInput = document.getElementById(`p-rate-${idx}`);
  if (rateInput && p && !Number(rateInput.value)) rateInput.value = purchaseDraft.items[idx].rate;
  recalcPurchaseItemRow(idx);
  refreshPurchaseTotals();
}

function recalcPurchaseItemRow(idx) {
  const item = purchaseDraft.items[idx];
  if (!item) return;
  const qty = Number(item.qty) || 0;
  const rate = Number(item.rate) || 0;
  const gstRate = Number(item.gstRate) || 0;
  const taxable = qty * rate;
  const gstAmt = roundNumber(taxable * (gstRate / 100));
  item.taxableAmount = taxable;
  item.gstAmount = gstAmt;
  item.amount = taxable + gstAmt;

  const gstAmtCell = document.getElementById(`p-gstamt-${idx}`);
  if (gstAmtCell) gstAmtCell.textContent = money(gstAmt);
  const amtCell = document.getElementById(`p-amount-${idx}`);
  if (amtCell) amtCell.textContent = money(item.amount);
}

function updatePurchaseItemQty(idx, val) {
  if (!purchaseDraft.items[idx]) return;
  purchaseDraft.items[idx].qty = Number(val) || 0;
  recalcPurchaseItemRow(idx);
  refreshPurchaseTotals();
}

function updatePurchaseItemRate(idx, val) {
  if (!purchaseDraft.items[idx]) return;
  purchaseDraft.items[idx].rate = Number(val) || 0;
  recalcPurchaseItemRow(idx);
  refreshPurchaseTotals();
}

function updatePurchaseItemGst(idx, val) {
  if (!purchaseDraft.items[idx]) return;
  purchaseDraft.items[idx].gstRate = Math.max(0, Number(val) || 0);
  recalcPurchaseItemRow(idx);
  refreshPurchaseTotals();
}

function refreshPurchaseTotals() {
  const totalTaxable = purchaseDraft.items.reduce((a, i) => a + (Number(i.qty) || 0) * (Number(i.rate) || 0), 0);
  const totalGst = purchaseDraft.items.reduce((a, i) => {
    const taxable = (Number(i.qty) || 0) * (Number(i.rate) || 0);
    const gRate = Number(i.gstRate) || 0;
    return a + roundNumber(taxable * (gRate / 100));
  }, 0);
  const grandTotal = totalTaxable + totalGst;
  const totalQty = purchaseDraft.items.reduce((a, i) => a + (Number(i.qty) || 0), 0);

  const totalEl = document.getElementById("purchase-total-val");
  if (totalEl) totalEl.textContent = money(grandTotal);
  const taxableEl = document.getElementById("purchase-total-taxable");
  if (taxableEl) taxableEl.textContent = money(totalTaxable);
  const gstEl = document.getElementById("purchase-total-gst");
  if (gstEl) gstEl.textContent = money(totalGst);
  const countEl = document.getElementById("purchase-total-items");
  if (countEl) countEl.textContent = purchaseDraft.items.length;
  const qtyEl = document.getElementById("purchase-total-qty");
  if (qtyEl) qtyEl.textContent = numberValue(totalQty);
}

function refreshPurchaseTableStock() {
  purchaseDraft.items.forEach((item, idx) => {
    const p = productByName(item.product);
    const stockPill = document.getElementById(`p-stock-${idx}`);
    if (stockPill && p) {
      const s = Number(p.stock) || 0;
      const sCls = s <= 0 ? 'out-stock' : s <= (p.min || 5) ? 'low-stock' : 'in-stock';
      stockPill.className = `vfs-stock-pill ${sCls}`;
      stockPill.textContent = `${numberValue(s)} ${p.unit || 'unit'}`;
    }
  });
}

function addPurchaseRow() {
  purchaseDraft.items.push({ product: "", qty: 1, rate: 0, gstRate: 0, gstAmount: 0, amount: 0 });
  const tbody = document.getElementById("purchase-items-body");
  if (tbody) tbody.innerHTML = renderPurchaseTableRows();
  refreshPurchaseTotals();
  const newIdx = purchaseDraft.items.length - 1;
  setTimeout(() => {
    const newSearch = document.getElementById(`p-search-${newIdx}`);
    if (newSearch) {
      newSearch.focus();
      newSearch.select();
    }
  }, 40);
}

function removePurchaseRow(idx) {
  purchaseDraft.items.splice(idx, 1);
  if (!purchaseDraft.items.length) {
    purchaseDraft.items.push({ product: "", qty: 1, rate: 0, gstRate: 0, gstAmount: 0, amount: 0 });
  }
  const tbody = document.getElementById("purchase-items-body");
  if (tbody) tbody.innerHTML = renderPurchaseTableRows();
  refreshPurchaseTotals();
}

function syncPurchaseDraftFromDOM() {
  const dateEl = document.getElementById("vfs-p-date");
  if (dateEl && dateEl.value) purchaseDraft.date = dateEl.value;
  const supEl = document.getElementById("vfs-p-supplier");
  if (supEl) purchaseDraft.supplier = supEl.value;
  const storeEl = document.getElementById("vfs-p-store");
  if (storeEl) purchaseDraft.store = storeEl.value;
  const refEl = document.getElementById("vfs-p-ref");
  if (refEl) purchaseDraft.reference = refEl.value.trim();
  const remEl = document.getElementById("vfs-p-remarks");
  if (remEl) purchaseDraft.remarks = remEl.value.trim();

  purchaseDraft.items.forEach((item, idx) => {
    const sEl = document.getElementById(`p-search-${idx}`);
    if (sEl) item.product = sEl.value.trim();
    const qEl = document.getElementById(`p-qty-${idx}`);
    if (qEl && qEl.value !== "") item.qty = Number(qEl.value);
    const rEl = document.getElementById(`p-rate-${idx}`);
    if (rEl && rEl.value !== "") item.rate = Number(rEl.value);
    const gEl = document.getElementById(`p-gst-${idx}`);
    if (gEl && gEl.value !== "") item.gstRate = Number(gEl.value);
  });
}

function savePurchase() {
  syncPurchaseDraftFromDOM();

  // Collect only valid items that have a product name entered
  const validItems = [];
  purchaseDraft.items.forEach(i => {
    const prodName = (i.product || "").trim();
    if (prodName) {
      const qty = Number(i.qty);
      const rate = Number(i.rate);
      const gstRate = Number(i.gstRate) || 0;
      validItems.push({
        ...i,
        product: prodName,
        qty: isNaN(qty) || qty <= 0 ? 1 : qty,
        rate: isNaN(rate) || rate < 0 ? 0 : rate,
        gstRate: isNaN(gstRate) || gstRate < 0 ? 0 : gstRate
      });
    }
  });

  if (!validItems.length) {
    toast("Please enter or select at least one item to save");
    const firstInput = document.getElementById("p-search-0");
    if (firstInput) {
      firstInput.focus();
      firstInput.select();
    }
    return;
  }

  const isEditing = Boolean(purchaseDraft.isEditing);
  const no = purchaseDraft.no || nextPurchaseNo();

  const processedItems = validItems.map(i => {
    let p = productByName(i.product);
    if (!p) {
      // Auto-create newly purchased product in catalog
      p = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        name: i.product,
        sku: "ITEM-" + String(state.products.length + 1).padStart(3, "0"),
        barcode: "",
        category: "General",
        department: "Kitchen",
        unit: i.unit || "unit",
        stock: 0,
        min: 5,
        reorder: 10,
        max: 50,
        cost: Number(i.rate) || 0,
        purchaseCost: Number(i.rate) || 0,
        store: purchaseDraft.store || state.currentStore,
        icon: "📦",
        active: true
      };
      state.products.push(p);
      if (!state.openingStock) state.openingStock = {};
      if (state.openingStock[p.name] === undefined) {
        state.openingStock[p.name] = 0;
      }
    } else {
      // Canonical product name from catalog
      i.product = p.name;
      if (Number(i.rate) > 0) {
        p.cost = Number(i.rate);
        p.purchaseCost = Number(i.rate);
      }
    }

    const qty = Number(i.qty) || 1;
    const rate = Number(i.rate) || 0;
    const gstRate = Number(i.gstRate) || 0;
    const taxableAmount = qty * rate;
    const gstAmount = roundNumber(taxableAmount * (gstRate / 100));

    return {
      product: i.product,
      unit: p?.unit || i.unit || "unit",
      qty,
      rate,
      gstRate,
      gstAmount,
      taxableAmount,
      amount: taxableAmount + gstAmount
    };
  });

  const subtotal = processedItems.reduce((a, i) => a + i.taxableAmount, 0);
  const gstTotal = processedItems.reduce((a, i) => a + i.gstAmount, 0);
  const total = subtotal + gstTotal;

  // If editing, clear existing transactions and previous purchase record
  if (isEditing) {
    state.transactions = state.transactions.filter(t => t.ref !== no);
    state.purchases = state.purchases.filter(p => p.no !== no);
  }

  const voucherDate = (purchaseDraft.date || today) + "T12:00:00";
  processedItems.forEach(i => {
    state.transactions.unshift({
      id: "TX-" + Date.now() + Math.random().toString(36).slice(2, 6),
      date: voucherDate,
      type: "Purchase",
      product: i.product,
      store: purchaseDraft.store || state.currentStore,
      qty: Number(i.qty),
      cost: Number(i.rate),
      user: state.currentUser,
      ref: no
    });
  });

  state.purchases.unshift({
    no,
    date: purchaseDraft.date || today,
    supplier: purchaseDraft.supplier || (state.suppliers[0] ? state.suppliers[0][0] : "Fresh Foods Co."),
    store: purchaseDraft.store || state.currentStore,
    reference: purchaseDraft.reference || "",
    remarks: purchaseDraft.remarks || "",
    items: processedItems,
    subtotal,
    gstTotal,
    total,
    user: state.currentUser,
    status: "Posted",
    createdAt: purchaseDraft.createdAt || new Date().toISOString()
  });

  save();
  rebuildStock();
  ensureProductsDatalist();
  toast(no + (isEditing ? " updated successfully!" : " posted successfully!"));
  purchaseDraft = { date: today, supplier: "Fresh Foods Co.", store: state.currentStore, reference: "", remarks: "", items: [], isNew: false, isEditing: false };
  closeProductSearchPopover();
  showView("purchasing");
}

function editPurchaseVoucher(no) {
  const v = state.purchases.find(p => p.no === no);
  if (!v) { toast("Purchase voucher not found"); return; }
  purchaseDraft = {
    ...v,
    items: (v.items || []).map(i => ({ ...i })),
    isNew: true,
    isEditing: true
  };
  showView("purchasing");
}

function deletePurchaseVoucher(no) {
  confirmModal(`Permanently delete purchase voucher ${no}? Received stock will be rolled back from inventory.`, () => {
    state.purchases = state.purchases.filter(p => p.no !== no);
    state.transactions = state.transactions.filter(t => t.ref !== no);
    rebuildStock();
    save();
    toast(`Purchase voucher ${no} deleted`);
    if (currentReportType === "purchase") showView("reports");
    else if (document.querySelector('.nav-item.active')?.dataset?.view === 'accounts') showView("accounts");
    else showView("purchasing");
  });
}

function clearAllPurchases() {
  if (!state.purchases.length) { toast("No purchase vouchers to delete"); return; }
  confirmModal(`⚠️ Are you sure you want to delete ALL ${state.purchases.length} purchase vouchers? Received quantities will be rolled back from warehouse inventory.`, () => {
    const purchaseRefs = new Set(state.purchases.map(p => p.no));
    state.transactions = state.transactions.filter(t => !purchaseRefs.has(t.ref) && t.type !== "Purchase");
    state.purchases = [];
    rebuildStock();
    save();
    toast("All purchase entries have been deleted");
    showView("purchasing");
  });
}

function purchaseHistory() {
  return layout(
    "Purchases",
    "Goods Receipt Note register and supplier deliveries.",
    `<button class="secondary" onclick="showView('purchase-orders')">Purchase Orders</button>
     <button class="secondary" onclick="exportPurchasesCsv()">Export CSV</button>
     <button class="danger-btn" onclick="clearAllPurchases()">Delete All Purchases</button>
     <button class="primary" onclick="newPurchase()">⊕ New Purchase</button>`,
    `
      <div class="panel">
        <div class="panel-head">
          <span class="panel-title">Purchase Invoices (${state.purchases.length})</span>
        </div>
        <div class="view-table">
          <table class="table">
            <thead>
              <tr>
                <th>Voucher #</th>
                <th>Date</th>
                <th>Supplier</th>
                <th>Warehouse</th>
                <th>Items</th>
                <th>Total Value</th>
                <th>User</th>
                <th>Status</th>
                <th style="text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${state.purchases.map(v => `
                <tr>
                  <td><b>${v.no}</b></td>
                  <td>${fmtDate(v.date)}</td>
                  <td>${v.supplier}</td>
                  <td>${v.store || "Main Store"}</td>
                  <td>${v.items?.length || 0} items</td>
                  <td class="num-cell" style="font-weight:700;">${money(v.total)}</td>
                  <td>${v.user}</td>
                  <td><span class="status ok">${v.status || "Posted"}</span></td>
                  <td style="text-align:right;">
                    <div class="table-action-btns">
                      <button type="button" class="secondary" onclick="viewVoucher('${v.no}', true)">View</button>
                      <button type="button" class="secondary" onclick="editPurchaseVoucher('${v.no}')">Edit</button>
                      <button type="button" class="secondary" onclick="printVoucherPreview('Purchase', '${v.no}')">Print</button>
                      <button type="button" class="danger-btn" onclick="deletePurchaseVoucher('${v.no}')">Delete</button>
                    </div>
                  </td>
                </tr>
              `).join("") || '<tr><td colspan="9" class="empty-state">No purchases recorded yet.</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    `
  );
}

function exportPurchasesCsv() {
  const rows = [
    ["Voucher No", "Date", "Supplier", "Store", "Items Count", "Total Amount", "User"],
    ...state.purchases.map(p => [p.no, p.date, p.supplier, p.store || "", p.items?.length || 0, p.total, p.user])
  ];
  downloadCsv("stocksense-purchases.csv", rows);
}

// PURCHASE ORDERS
let poDraft = { date: today, supplier: "Fresh Foods Co.", expectedDate: today, department: "Kitchen", items: [], status: "Draft", remarks: "" };
const nextPONo = () => `PO-${String(state.purchaseOrders.length + 1).padStart(5, "0")}`;

function newPurchaseOrder(items = []) {
  poDraft = {
    no: nextPONo(),
    date: today,
    supplier: state.suppliers[0] ? state.suppliers[0][0] : "Fresh Foods Co.",
    expectedDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
    department: "Kitchen",
    items: items.length ? items.map(i => ({ ...i })) : [{ product: state.products[0]?.name || "", qty: 10, rate: state.products[0]?.purchaseCost || state.products[0]?.cost || 0 }],
    status: "Draft",
    remarks: ""
  };
  showView("purchase-orders");
}

function purchaseOrdersScreen() {
  const total = poDraft.items.reduce((a, i) => a + (Number(i.qty) || 0) * (Number(i.rate) || 0), 0);
  return layout(
    "Purchase Orders",
    "Supplier requisitions and purchase orders before receipt.",
    `<button class="secondary" onclick="showView('purchasing')">Purchase Register</button>
     <button class="primary" onclick="savePurchaseOrder()">Save PO</button>`,
    `
      <div class="voucher-container">
        <div class="voucher-header-card">
          <div class="voucher-header-top">
            <div class="voucher-no-badge">${poDraft.no}</div>
            <span class="status expiry">${poDraft.status}</span>
          </div>
          <div class="voucher-grid-fields">
            <div class="voucher-field">
              <label>PO Date</label>
              <input type="date" value="${poDraft.date}" onchange="poDraft.date=this.value">
            </div>
            <div class="voucher-field">
              <label>Supplier</label>
              <select onchange="poDraft.supplier=this.value">
                ${state.suppliers.map(s => `<option ${s[0] === poDraft.supplier ? 'selected' : ''}>${s[0]}</option>`).join("")}
              </select>
            </div>
            <div class="voucher-field">
              <label>Expected Delivery</label>
              <input type="date" value="${poDraft.expectedDate}" onchange="poDraft.expectedDate=this.value">
            </div>
            <div class="voucher-field">
              <label>Department</label>
              <select onchange="poDraft.department=this.value">
                ${departments.map(d => `<option ${d === poDraft.department ? 'selected' : ''}>${d}</option>`).join("")}
              </select>
            </div>
          </div>
        </div>

        <div class="voucher-items-card">
          <div class="panel-head">
            <span class="panel-title">Order Lines</span>
            <button class="primary" style="padding:4px 10px;font-size:12px;" onclick="addPORow()">＋ Add Item</button>
          </div>
          <div class="voucher-table-wrap">
            <table class="voucher-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product</th>
                  <th>Order Qty</th>
                  <th>Rate</th>
                  <th>Amount</th>
                  <th></th>
                </tr>
              </thead>
              <tbody id="po-items-body">
                ${poDraft.items.map((i, idx) => `
                  <tr>
                    <td>${idx + 1}</td>
                    <td><input list="products-datalist" value="${i.product}" onchange="poDraft.items[${idx}].product=this.value;refreshPOTotals()"></td>
                    <td><input type="number" value="${i.qty}" oninput="poDraft.items[${idx}].qty=Number(this.value)||0;refreshPOTotals()"></td>
                    <td><input type="number" step="0.01" value="${i.rate}" oninput="poDraft.items[${idx}].rate=Number(this.value)||0;refreshPOTotals()"></td>
                    <td class="num-cell" id="po-amt-${idx}">${money((i.qty || 0) * (i.rate || 0))}</td>
                    <td><button type="button" class="row-delete" onclick="removePORow(${idx})">×</button></td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>

        <div class="voucher-footer">
          <div class="validation-note valid">✓ Purchase orders do not modify live stock until converted to a purchase</div>
          <div class="total-box">
            <strong>Estimated Total: <span id="po-total">${money(total)}</span></strong>
          </div>
        </div>

        <div class="panel" style="margin-top:24px;">
          <div class="panel-head">
            <span class="panel-title">Purchase Order Register (${state.purchaseOrders.length})</span>
          </div>
          <div class="view-table">
            <table class="table">
              <thead>
                <tr>
                  <th>PO #</th>
                  <th>Date</th>
                  <th>Supplier</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th style="text-align:right;">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${state.purchaseOrders.map(po => `
                  <tr>
                    <td><b>${po.no}</b></td>
                    <td>${fmtDate(po.date)}</td>
                    <td>${po.supplier}</td>
                    <td>${po.items?.length || 0}</td>
                    <td class="num-cell">${money(po.total)}</td>
                    <td><span class="status ok">${po.status}</span></td>
                    <td style="text-align:right;">
                      <div class="table-action-btns">
                        <button type="button" class="primary" onclick="convertPOToPurchase('${po.no}')">Convert</button>
                        <button type="button" class="secondary" onclick="editPurchaseOrder('${po.no}')">Edit</button>
                        <button type="button" class="danger-btn" onclick="deletePurchaseOrder('${po.no}')">Delete</button>
                      </div>
                    </td>
                  </tr>
                `).join("") || '<tr><td colspan="7" class="empty-state">No purchase orders created yet.</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `
  );
}

function editPurchaseOrder(no) {
  const po = state.purchaseOrders.find(x => x.no === no);
  if (!po) { toast("Purchase order not found"); return; }
  poDraft = {
    ...po,
    items: (po.items || []).map(i => ({ ...i }))
  };
  showView("purchase-orders");
  toast("Loaded " + no + " for editing");
}

function deletePurchaseOrder(no) {
  confirmModal(`Permanently delete Purchase Order ${no}?`, () => {
    state.purchaseOrders = state.purchaseOrders.filter(x => x.no !== no);
    save();
    toast(`Purchase Order ${no} deleted`);
    showView("purchase-orders");
  });
}

function addPORow() {
  poDraft.items.push({ product: state.products[0]?.name || "", qty: 10, rate: state.products[0]?.purchaseCost || state.products[0]?.cost || 0 });
  showView("purchase-orders");
}

function removePORow(idx) {
  if (!poDraft || !Array.isArray(poDraft.items)) return;
  poDraft.items.splice(idx, 1);
  if (poDraft.items.length === 0) {
    poDraft.items.push({ product: state.products[0]?.name || "", qty: 1, rate: 0 });
  }
  refreshPOTotals();
  showView("purchase-orders");
}

function refreshPOTotals() {
  const total = poDraft.items.reduce((a, i) => a + (Number(i.qty) || 0) * (Number(i.rate) || 0), 0);
  const totalEl = document.getElementById("po-total");
  if (totalEl) totalEl.textContent = money(total);
  poDraft.items.forEach((i, idx) => {
    const el = document.getElementById(`po-amt-${idx}`);
    if (el) el.textContent = money((i.qty || 0) * (i.rate || 0));
  });
}

function savePurchaseOrder() {
  if (!poDraft.items.length) { toast("Add at least one item"); return; }
  const no = poDraft.no || nextPONo();
  const total = poDraft.items.reduce((a, i) => a + (Number(i.qty) || 0) * (Number(i.rate) || 0), 0);
  state.purchaseOrders = state.purchaseOrders.filter(x => x.no !== no);
  state.purchaseOrders.unshift({
    ...poDraft,
    no,
    total,
    status: "Ordered",
    createdAt: poDraft.createdAt || new Date().toISOString()
  });
  save();
  toast(no + " saved successfully");
  newPurchaseOrder();
}

function convertPOToPurchase(poNo) {
  const po = state.purchaseOrders.find(x => x.no === poNo);
  if (!po) return;
  purchaseDraft = {
    date: today,
    supplier: po.supplier,
    store: state.currentStore,
    reference: po.no,
    remarks: "Received against " + po.no,
    items: po.items.map(i => ({ product: i.product, qty: i.qty, rate: i.rate })),
    isNew: true
  };
  po.status = "Converted";
  save();
  showView("purchasing");
  toast("Converted " + poNo + " to Goods Receipt Note");
}

// STOCK OUTWARD (ISSUES)
let outwardDraft = { department: "Kitchen", store: "Main Store", date: today, issuedTo: "", reference: "", remarks: "", items: [], isNew: false };
const nextOutwardNo = () => `OUT-${String(state.outwards.length + 1).padStart(5, "0")}`;

function newOutward(prefilledItems = []) {
  outwardDraft = {
    no: nextOutwardNo(),
    department: "Kitchen",
    store: state.currentStore,
    date: today,
    issuedTo: "",
    reference: "",
    remarks: "",
    items: Array.isArray(prefilledItems) && prefilledItems.length ? prefilledItems.map(i => ({ product: i.product || "", qty: Number(i.qty) || 1, rate: Number(i.rate) || 0 })) : [{ product: "", qty: 1 }],
    isNew: true
  };
  showView("outward");
  setTimeout(() => {
    const firstInput = document.getElementById("out-search-0");
    if (firstInput) {
      firstInput.focus();
      firstInput.select();
    }
  }, 60);
}

function newOutwardDraft(prefilledItems) {
  newOutward(prefilledItems);
}

function exitOutwardFullscreen() {
  outwardDraft.isNew = false;
  closeProductSearchPopover();
  showView("outward");
}

function outwardScreen() {
  const totalQty = outwardDraft.items.reduce((a, i) => a + (Number(i.qty) || 0), 0);
  const totalVal = outwardTotal();
  const vNo = outwardDraft.no || nextOutwardNo();

  return `
    <div class="voucher-fullscreen" id="outward-fullscreen">
      <!-- Fullscreen Command Topbar -->
      <div class="vfs-topbar">
        <div class="vfs-topbar-left">
          <button type="button" class="vfs-back-btn" onclick="exitOutwardFullscreen()" title="Return to Register">
            ← Exit Register <kbd>Esc</kbd>
          </button>
          <div class="vfs-title-group">
            <span class="vfs-type-icon">📤</span>
            <h2 class="vfs-heading">Stock Outward Voucher</h2>
            <span class="vfs-badge">${vNo}</span>
            <span class="vfs-status-pill" style="background:#fef3c7;color:#92400e;border-color:#fde68a;">ISSUE ENTRY</span>
          </div>
        </div>

        <div class="vfs-shortcuts-bar">
          <span class="vfs-shortcut-chip"><kbd>↵ Enter</kbd> Next / Auto-Row</span>
          <span class="vfs-shortcut-chip"><kbd>F5</kbd> Add Line</span>
          <span class="vfs-shortcut-chip"><kbd>F8</kbd> Save Issue</span>
          <span class="vfs-shortcut-chip"><kbd>Esc</kbd> Exit</span>
        </div>

        <div class="vfs-topbar-actions">
          <button type="button" class="vfs-btn-secondary" onclick="exitOutwardFullscreen()">Cancel</button>
          <button type="button" class="vfs-btn-secondary" onclick="addOutwardRow()">＋ Add Line (F5)</button>
          <button type="button" class="vfs-btn-primary" id="btn-save-outward" onclick="saveOutward()">✓ Post Issue (F8)</button>
        </div>
      </div>

      <!-- Master Details Card -->
      <div class="vfs-master-card">
        <div class="vfs-master-grid">
          <div class="vfs-field-group">
            <label>Issue Date</label>
            <input type="date" class="vfs-master-input" value="${outwardDraft.date}" onchange="outwardDraft.date=this.value">
          </div>
          <div class="vfs-field-group">
            <label>Target Department / Station</label>
            <select class="vfs-master-select" onchange="outwardDraft.department=this.value">
              ${departments.map(d => `<option ${d === outwardDraft.department ? 'selected' : ''}>${escapeHtml(d)}</option>`).join("")}
            </select>
          </div>
          <div class="vfs-field-group">
            <label>Source Warehouse</label>
            <select class="vfs-master-select" onchange="outwardDraft.store=this.value;refreshOutwardTableStock();">
              ${state.stores.map(s => `<option ${s[0] === outwardDraft.store ? 'selected' : ''}>${escapeHtml(s[0])}</option>`).join("")}
            </select>
          </div>
          <div class="vfs-field-group">
            <label>Issued To (Chef / Staff)</label>
            <input class="vfs-master-input" value="${escapeHtml(outwardDraft.issuedTo || '')}" placeholder="e.g. Chef Marco / Head Bartender" oninput="outwardDraft.issuedTo=this.value">
          </div>
          <div class="vfs-field-group">
            <label>Purpose / Recipe Remarks</label>
            <input class="vfs-master-input" value="${escapeHtml(outwardDraft.remarks || '')}" placeholder="Menu prep, event consumption, wastage..." oninput="outwardDraft.remarks=this.value">
          </div>
        </div>
      </div>

      <!-- Items Grid -->
      <div class="vfs-grid-scroll">
        <div class="vfs-table-container">
          <table class="vfs-table">
            <thead>
              <tr>
                <th style="width:40px;text-align:center;">#</th>
                <th style="min-width:320px;">Item Name (Type 1-2 letters to search)</th>
                <th style="width:160px;">Available Stock</th>
                <th style="width:150px;" class="th-num">Issue Qty</th>
                <th style="width:80px;">Unit</th>
                <th style="width:140px;" class="th-num">Valuation Rate</th>
                <th style="width:150px;" class="th-num">Amount</th>
                <th style="width:44px;text-align:center;"></th>
              </tr>
            </thead>
            <tbody id="outward-items-body">
              ${renderOutwardTableRows()}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Docked Bottom Bar -->
      <div class="vfs-docked-footer">
        <div class="vfs-footer-left">
          <div class="vfs-stat-item">
            <span>Lines:</span>
            <b id="outward-total-lines">${outwardDraft.items.length}</b>
          </div>
          <div class="vfs-stat-item">
            <span>Total Units Issued:</span>
            <b id="outward-total-units">${numberValue(totalQty)}</b>
          </div>
          <span class="vfs-footer-validation valid" id="outward-validation-box">
            ✓ Quantities verified against warehouse stock · Press [Enter] on Issue Qty to auto-insert row
          </span>
        </div>

        <div class="vfs-footer-right">
          <div class="vfs-grand-total">
            <span>Total Issue Valuation:</span>
            <strong id="outward-total-amt">${money(totalVal)}</strong>
          </div>
          <div class="vfs-footer-actions">
            <button type="button" class="vfs-btn-secondary" onclick="addOutwardRow()">＋ Add Line (F5)</button>
            <button type="button" class="vfs-btn-primary" id="btn-save-outward-docked" onclick="saveOutward()">✓ Post Issue (F8)</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function outwardTotal() {
  return outwardDraft.items.reduce((a, i) => {
    const p = productByName(i.product);
    return a + (Number(i.qty) || 0) * (Number(p?.cost) || 0);
  }, 0);
}

function renderOutwardTableRows() {
  return outwardDraft.items.map((item, idx) => {
    const p = productByName(item.product);
    const available = p?.stock || 0;
    const min = p?.min || 5;
    const isExceeded = p && Number(item.qty) > available && !state.settings.inventory?.negative;
    const sCls = !p ? '' : available <= 0 ? 'out-stock' : available <= min ? 'low-stock' : 'in-stock';
    const rate = p?.cost || 0;
    const amt = (Number(item.qty) || 0) * rate;

    return `
      <tr data-row="${idx}">
        <td class="vfs-row-index">${idx + 1}</td>
        <td>
          <div class="vfs-search-cell-wrap">
            <input id="out-search-${idx}" class="vfs-item-input" value="${escapeHtml(item.product || '')}"
              placeholder="Type 1-2 letters to search item..." autocomplete="off"
              oninput="handleOutwardSearchInput(event, ${idx})"
              onfocus="handleOutwardSearchFocus(event, ${idx})"
              onkeydown="handleOutwardSearchKeydown(event, ${idx})">
          </div>
        </td>
        <td>
          <span class="vfs-stock-pill ${sCls}" id="out-avail-${idx}">
            ${p ? `${numberValue(available)} ${p.unit || 'unit'}` : '—'}
          </span>
        </td>
        <td style="width:150px;">
          <input type="number" id="out-qty-${idx}" class="vfs-num-input ${isExceeded ? 'has-error' : ''}"
            step="0.01" min="0" value="${item.qty ?? 1}"
            oninput="updateOutwardItemQty(${idx}, this.value)"
            onkeydown="handleOutwardQtyKeydown(event, ${idx})">
        </td>
        <td class="vfs-unit-tag" id="out-unit-${idx}">${p?.unit || 'unit'}</td>
        <td class="vfs-amount-cell" id="out-rate-${idx}">${money(rate)}</td>
        <td class="vfs-amount-cell" id="out-amt-${idx}">${money(amt)}</td>
        <td style="width:44px;text-align:center;">
          <button type="button" class="vfs-del-btn" onclick="removeOutwardRow(${idx})" title="Delete row">×</button>
        </td>
      </tr>
    `;
  }).join("") || `
    <tr>
      <td colspan="8" class="empty-state" style="padding:24px;text-align:center;color:var(--muted);">
        No items. Press <kbd style="background:#e2e8f0;padding:2px 6px;border-radius:3px;">F5</kbd> or click "+ Add Line" to issue stock.
      </td>
    </tr>
  `;
}

function handleOutwardSearchInput(e, idx) {
  if (!outwardDraft.items[idx]) return;
  outwardDraft.items[idx].product = e.target.value;
  const q = e.target.value.trim();
  if (q.length >= 1) {
    openProductSearchPopover(e.target, q, (selectedProd) => onSelectOutwardItem(idx, selectedProd));
  } else {
    closeProductSearchPopover();
  }
}

function handleOutwardSearchFocus(e, idx) {
  const q = e.target.value.trim();
  if (q.length >= 1) {
    openProductSearchPopover(e.target, q, (selectedProd) => onSelectOutwardItem(idx, selectedProd));
  }
}

function handleOutwardSearchKeydown(e, idx) {
  const popover = document.getElementById("product-search-popover");
  const isOpen = popover && popover.style.display !== "none" && currentSearchPopover.items.length > 0;

  if (isOpen) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      currentSearchPopover.activeIndex = (currentSearchPopover.activeIndex + 1) % currentSearchPopover.items.length;
      renderSearchPopover();
      const activeEl = popover.querySelector(`.search-rec-item[data-idx="${currentSearchPopover.activeIndex}"]`);
      if (activeEl) activeEl.scrollIntoView({ block: "nearest" });
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      currentSearchPopover.activeIndex = (currentSearchPopover.activeIndex - 1 + currentSearchPopover.items.length) % currentSearchPopover.items.length;
      renderSearchPopover();
      const activeEl = popover.querySelector(`.search-rec-item[data-idx="${currentSearchPopover.activeIndex}"]`);
      if (activeEl) activeEl.scrollIntoView({ block: "nearest" });
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      selectSearchPopoverItem(currentSearchPopover.activeIndex);
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      closeProductSearchPopover();
      return;
    }
  } else {
    if (e.key === "Enter") {
      e.preventDefault();
      const qtyEl = document.getElementById(`out-qty-${idx}`);
      if (qtyEl) {
        qtyEl.focus();
        qtyEl.select();
      }
    }
  }
}

function handleOutwardQtyKeydown(e, idx) {
  if (e.key === "Enter") {
    e.preventDefault();
    updateOutwardItemQty(idx, e.target.value);
    if (idx < outwardDraft.items.length - 1) {
      const nextSearch = document.getElementById(`out-search-${idx + 1}`);
      if (nextSearch) {
        nextSearch.focus();
        nextSearch.select();
      }
    }
  }
}

function onSelectOutwardItem(idx, product) {
  if (!outwardDraft.items[idx]) return;
  outwardDraft.items[idx].product = product.name;

  const searchInput = document.getElementById(`out-search-${idx}`);
  if (searchInput) searchInput.value = product.name;

  const availPill = document.getElementById(`out-avail-${idx}`);
  if (availPill) {
    const s = Number(product.stock) || 0;
    const sCls = s <= 0 ? 'out-stock' : s <= (product.min || 5) ? 'low-stock' : 'in-stock';
    availPill.className = `vfs-stock-pill ${sCls}`;
    availPill.textContent = `${numberValue(s)} ${product.unit || 'unit'}`;
  }

  const unitCell = document.getElementById(`out-unit-${idx}`);
  if (unitCell) unitCell.textContent = product.unit || 'unit';

  const rateCell = document.getElementById(`out-rate-${idx}`);
  if (rateCell) rateCell.textContent = money(product.cost || 0);

  const amtCell = document.getElementById(`out-amt-${idx}`);
  if (amtCell) amtCell.textContent = money((outwardDraft.items[idx].qty || 0) * (product.cost || 0));

  refreshOutwardTotals();

  // Advance focus to Qty field
  setTimeout(() => {
    const qtyInput = document.getElementById(`out-qty-${idx}`);
    if (qtyInput) {
      qtyInput.focus();
      qtyInput.select();
    }
  }, 30);
}

function updateOutwardItemName(idx, name) {
  if (!outwardDraft.items[idx]) return;
  outwardDraft.items[idx].product = name;
  const p = productByName(name);
  if (p) {
    const availPill = document.getElementById(`out-avail-${idx}`);
    if (availPill) {
      const s = Number(p.stock) || 0;
      const sCls = s <= 0 ? 'out-stock' : s <= (p.min || 5) ? 'low-stock' : 'in-stock';
      availPill.className = `vfs-stock-pill ${sCls}`;
      availPill.textContent = `${numberValue(s)} ${p.unit || 'unit'}`;
    }
    const unitCell = document.getElementById(`out-unit-${idx}`);
    if (unitCell) unitCell.textContent = p.unit || 'unit';
    const rateCell = document.getElementById(`out-rate-${idx}`);
    if (rateCell) rateCell.textContent = money(p.cost || 0);
  }
  refreshOutwardTotals();
}

function updateOutwardItemQty(idx, val) {
  if (!outwardDraft.items[idx]) return;
  outwardDraft.items[idx].qty = Number(val) || 0;
  const p = productByName(outwardDraft.items[idx].product);
  const amtCell = document.getElementById(`out-amt-${idx}`);
  if (amtCell) amtCell.textContent = money(outwardDraft.items[idx].qty * (p?.cost || 0));

  const qtyInput = document.getElementById(`out-qty-${idx}`);
  const isExceeded = p && outwardDraft.items[idx].qty > p.stock && !state.settings.inventory?.negative;
  if (qtyInput) {
    if (isExceeded) qtyInput.classList.add("has-error");
    else qtyInput.classList.remove("has-error");
  }

  refreshOutwardTotals();
}

function refreshOutwardTotals() {
  const totalQty = outwardDraft.items.reduce((a, i) => a + (Number(i.qty) || 0), 0);
  const qtyEl = document.getElementById("outward-total-units");
  if (qtyEl) qtyEl.textContent = numberValue(totalQty);
  const valEl = document.getElementById("outward-total-amt");
  if (valEl) valEl.textContent = money(outwardTotal());
  const linesEl = document.getElementById("outward-total-lines");
  if (linesEl) linesEl.textContent = outwardDraft.items.length;

  const hasExceeded = outwardDraft.items.some(i => {
    if (!i.product || !i.product.trim()) return false;
    const p = productByName(i.product);
    return p && (Number(i.qty) > Number(p.stock) && !state.settings.inventory?.negative);
  });
  const vBox = document.getElementById("outward-validation-box");
  const saveBtn = document.getElementById("btn-save-outward");
  const saveBtnDocked = document.getElementById("btn-save-outward-docked");

  if (vBox) {
    vBox.className = "vfs-footer-validation " + (hasExceeded ? "has-error" : "valid");
    vBox.textContent = hasExceeded
      ? "⚠ Some items exceed warehouse on-hand stock (confirmation will be requested on save)"
      : "✓ Quantities verified against warehouse stock · Press [F5] to add line items";
  }
  // Keep save buttons enabled so clicks provide interactive feedback
  if (saveBtn) saveBtn.disabled = false;
  if (saveBtnDocked) saveBtnDocked.disabled = false;
}

function refreshOutwardTableStock() {
  outwardDraft.items.forEach((item, idx) => {
    const p = productByName(item.product);
    const availPill = document.getElementById(`out-avail-${idx}`);
    if (availPill && p) {
      const s = Number(p.stock) || 0;
      const sCls = s <= 0 ? 'out-stock' : s <= (p.min || 5) ? 'low-stock' : 'in-stock';
      availPill.className = `vfs-stock-pill ${sCls}`;
      availPill.textContent = `${numberValue(s)} ${p.unit || 'unit'}`;
    }
  });
}

function addOutwardRow() {
  outwardDraft.items.push({ product: "", qty: 1 });
  const tbody = document.getElementById("outward-items-body");
  if (tbody) tbody.innerHTML = renderOutwardTableRows();
  refreshOutwardTotals();
  const newIdx = outwardDraft.items.length - 1;
  setTimeout(() => {
    const newSearch = document.getElementById(`out-search-${newIdx}`);
    if (newSearch) {
      newSearch.focus();
      newSearch.select();
    }
  }, 40);
}

function removeOutwardRow(idx) {
  outwardDraft.items.splice(idx, 1);
  if (!outwardDraft.items.length) {
    outwardDraft.items.push({ product: "", qty: 1 });
  }
  const tbody = document.getElementById("outward-items-body");
  if (tbody) tbody.innerHTML = renderOutwardTableRows();
  refreshOutwardTotals();
}

function syncOutwardDraftFromDOM() {
  const dateEl = document.getElementById("vfs-out-date");
  if (dateEl && dateEl.value) outwardDraft.date = dateEl.value;
  const deptEl = document.getElementById("vfs-out-dept");
  if (deptEl) outwardDraft.department = deptEl.value;
  const storeEl = document.getElementById("vfs-out-store");
  if (storeEl) outwardDraft.store = storeEl.value;
  const toEl = document.getElementById("vfs-out-issuedto");
  if (toEl) outwardDraft.issuedTo = toEl.value.trim();
  const remEl = document.getElementById("vfs-out-remarks");
  if (remEl) outwardDraft.remarks = remEl.value.trim();

  outwardDraft.items.forEach((item, idx) => {
    const sEl = document.getElementById(`out-search-${idx}`);
    if (sEl) item.product = sEl.value.trim();
    const qEl = document.getElementById(`out-qty-${idx}`);
    if (qEl && qEl.value !== "") item.qty = Number(qEl.value);
  });
}

function saveOutward() {
  syncOutwardDraftFromDOM();

  // Collect only valid items that have a product name entered
  const validItems = [];
  outwardDraft.items.forEach(i => {
    const prodName = (i.product || "").trim();
    if (prodName) {
      const qty = Number(i.qty);
      validItems.push({
        ...i,
        product: prodName,
        qty: isNaN(qty) || qty <= 0 ? 1 : qty
      });
    }
  });

  if (!validItems.length) {
    toast("Please enter or select at least one item to issue");
    const firstInput = document.getElementById("out-search-0");
    if (firstInput) {
      firstInput.focus();
      firstInput.select();
    }
    return;
  }

  // Verify products exist and check stock levels
  const unknownProducts = [];
  const exceededStockItems = [];

  const processedItems = validItems.map(i => {
    const p = productByName(i.product);
    if (!p) {
      unknownProducts.push(i.product);
      return {
        product: i.product,
        unit: "unit",
        qty: Number(i.qty) || 1,
        rate: 0,
        amount: 0
      };
    }

    const qty = Number(i.qty) || 1;
    const available = Number(p.stock) || 0;
    if (qty > available && !state.settings.inventory?.negative) {
      exceededStockItems.push({ name: p.name, qty, available, unit: p.unit || "unit" });
    }

    return {
      product: p.name,
      unit: p.unit || "unit",
      qty,
      rate: Number(p.cost) || 0,
      amount: qty * (Number(p.cost) || 0)
    };
  });

  if (unknownProducts.length > 0) {
    toast(`Item "${unknownProducts[0]}" not found in stock catalog. Please select an existing item.`);
    return;
  }

  // If some items exceed warehouse stock and negative inventory is disabled
  if (exceededStockItems.length > 0) {
    const first = exceededStockItems[0];
    const warnMsg = `Stock warning: "${first.name}" issue qty (${first.qty} ${first.unit}) exceeds on-hand stock (${first.available} ${first.unit}). Post anyway as negative balance?`;
    confirmModal(warnMsg, () => {
      executeSaveOutward(processedItems);
    });
    return;
  }

  executeSaveOutward(processedItems);
}

function executeSaveOutward(processedItems) {
  const isEditing = Boolean(outwardDraft.isEditing);
  const no = outwardDraft.no || nextOutwardNo();
  const total = processedItems.reduce((a, i) => a + i.amount, 0);

  // If editing, clear existing transactions and previous outward record
  if (isEditing) {
    state.transactions = state.transactions.filter(t => t.ref !== no);
    state.outwards = state.outwards.filter(o => o.no !== no);
  }

  const voucherDate = (outwardDraft.date || today) + "T12:00:00";
  processedItems.forEach(i => {
    state.transactions.unshift({
      id: "TX-" + Date.now() + Math.random().toString(36).slice(2, 6),
      date: voucherDate,
      type: "Stock Outward",
      product: i.product,
      department: outwardDraft.department || "Kitchen",
      store: outwardDraft.store || state.currentStore,
      qty: -Number(i.qty),
      cost: Number(i.rate),
      user: state.currentUser,
      ref: no
    });
  });

  state.outwards.unshift({
    no,
    date: outwardDraft.date || today,
    department: outwardDraft.department || "Kitchen",
    store: outwardDraft.store || state.currentStore,
    issuedTo: outwardDraft.issuedTo || "",
    remarks: outwardDraft.remarks || "",
    items: processedItems,
    total,
    user: state.currentUser,
    status: "Posted",
    createdAt: outwardDraft.createdAt || new Date().toISOString()
  });

  save();
  rebuildStock();
  toast(no + (isEditing ? " updated successfully!" : " posted successfully!"));
  outwardDraft = { department: "Kitchen", store: state.currentStore, date: today, issuedTo: "", reference: "", remarks: "", items: [], isNew: false, isEditing: false };
  closeProductSearchPopover();
  showView("outward");
}

function editOutwardVoucher(no) {
  const v = state.outwards.find(o => o.no === no);
  if (!v) { toast("Outward voucher not found"); return; }
  outwardDraft = {
    ...v,
    items: (v.items || []).map(i => ({ ...i })),
    isNew: true,
    isEditing: true
  };
  showView("outward");
}

function deleteOutwardVoucher(no) {
  confirmModal(`Permanently delete outward voucher ${no}? Issued stock quantities will be restored back to warehouse.`, () => {
    state.outwards = state.outwards.filter(o => o.no !== no);
    state.transactions = state.transactions.filter(t => t.ref !== no);
    rebuildStock();
    save();
    toast(`Outward voucher ${no} deleted`);
    if (currentReportType === "outward") showView("reports");
    else showView("outward");
  });
}

function clearAllOutwards() {
  if (!state.outwards.length) { toast("No outward vouchers to delete"); return; }
  confirmModal(`⚠️ Are you sure you want to delete ALL ${state.outwards.length} outward vouchers? Issued quantities will be restored to warehouse inventory.`, () => {
    const outwardRefs = new Set(state.outwards.map(o => o.no));
    state.transactions = state.transactions.filter(t => !outwardRefs.has(t.ref) && t.type !== "Stock Outward");
    state.outwards = [];
    rebuildStock();
    save();
    toast("All outward entries have been deleted");
    showView("outward");
  });
}

function outwardHistory() {
  return layout(
    "Stock Outward",
    "Department issues, consumption records and outward registers.",
    `<button class="secondary" onclick="exportOutwardCsv()">Export CSV</button>
     <button class="danger-btn" onclick="clearAllOutwards()">Delete All Outwards</button>
     <button class="primary" onclick="newOutward()">⊕ New Outward</button>`,
    `
      <div class="panel">
        <div class="panel-head">
          <span class="panel-title">Outward Vouchers (${state.outwards.length})</span>
        </div>
        <div class="view-table">
          <table class="table">
            <thead>
              <tr>
                <th>Voucher #</th>
                <th>Date</th>
                <th>Department</th>
                <th>Warehouse</th>
                <th>Issued To</th>
                <th>Items Count</th>
                <th>Total Value</th>
                <th>User</th>
                <th>Status</th>
                <th style="text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${state.outwards.map(v => `
                <tr>
                  <td><b>${v.no}</b></td>
                  <td>${fmtDate(v.date)}</td>
                  <td>${v.department}</td>
                  <td>${v.store || "Main Store"}</td>
                  <td>${v.issuedTo || "—"}</td>
                  <td>${v.items?.length || 0}</td>
                  <td class="num-cell" style="font-weight:700;">${money(v.total)}</td>
                  <td>${v.user}</td>
                  <td><span class="status ok">${v.status || "Posted"}</span></td>
                  <td style="text-align:right;">
                    <div class="table-action-btns">
                      <button type="button" class="secondary" onclick="viewVoucher('${v.no}', false)">View</button>
                      <button type="button" class="secondary" onclick="editOutwardVoucher('${v.no}')">Edit</button>
                      <button type="button" class="secondary" onclick="printVoucherPreview('Outward', '${v.no}')">Print</button>
                      <button type="button" class="danger-btn" onclick="deleteOutwardVoucher('${v.no}')">Delete</button>
                    </div>
                  </td>
                </tr>
              `).join("") || '<tr><td colspan="10" class="empty-state">No outward vouchers posted yet.</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    `
  );
}

function exportOutwardCsv() {
  const rows = [
    ["Voucher No", "Date", "Department", "Warehouse", "Issued To", "Items Count", "Total Value", "User"],
    ...state.outwards.map(o => [o.no, o.date, o.department, o.store || "", o.issuedTo || "", o.items?.length || 0, o.total, o.user])
  ];
  downloadCsv("stocksense-outward.csv", rows);
}

// IN-APP PRINT & PDF PREVIEW
function viewVoucher(no, isPurchase) {
  printVoucherPreview(isPurchase ? "Purchase" : "Outward", no);
}

function generateVoucherPrintDocument(voucher, isPurchase, autoPrint = false) {
  const items = voucher.items || [];
  const hasGst = isPurchase && items.some(i => Number(i.gstRate) > 0 || Number(i.gstAmount) > 0);
  const totalQty = items.reduce((a, i) => a + (Number(i.qty) || 0), 0);
  const taxableSubtotal = items.reduce((a, i) => a + (Number(i.taxableAmount) || ((Number(i.qty) || 0) * (Number(i.rate) || 0))), 0);
  const totalGst = items.reduce((a, i) => a + (Number(i.gstAmount) || 0), 0);
  const docTitle = isPurchase ? `GRN_${voucher.no}` : `OUTWARD_${voucher.no}`;
  const nowStr = new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
  const isPosted = !voucher.status || voucher.status.toLowerCase() === "posted" || voucher.status.toLowerCase() === "received";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${docTitle}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm 12mm;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-size: 12.5px;
      line-height: 1.4;
      color: #0f172a;
      background: #ffffff;
    }
    .print-sheet {
      width: 100%;
      max-width: 100%;
      margin: 0 auto;
    }
    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2.5px solid #0284c7;
      padding-bottom: 12px;
      margin-bottom: 12px;
    }
    .company-name {
      font-size: 21px;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 3px 0;
      text-transform: uppercase;
      letter-spacing: -0.01em;
    }
    .company-sub {
      font-size: 11.5px;
      color: #475569;
      margin: 1px 0;
    }
    .doc-type-block {
      text-align: right;
    }
    .doc-type-badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 3px 9px;
      border-radius: 4px;
      margin-bottom: 4px;
      ${isPurchase ? 'background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe;' : 'background: #f5f3ff; color: #6d28d9; border: 1px solid #ddd6fe;'}
    }
    .doc-no {
      font-family: "JetBrains Mono", "Courier New", Courier, monospace;
      font-size: 18px;
      font-weight: 800;
      color: #0284c7;
      margin: 1px 0;
    }
    .doc-date {
      font-size: 11.5px;
      color: #475569;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 6px 14px;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 9px 12px;
      margin-bottom: 12px;
      font-size: 11.5px;
    }
    .meta-field span {
      color: #64748b;
      margin-right: 6px;
    }
    .meta-field b {
      color: #0f172a;
      font-weight: 600;
    }
    .status-pill {
      display: inline-block;
      font-size: 10px;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 999px;
      text-transform: uppercase;
      ${isPosted ? 'background: #dcfce7; color: #15803d; border: 1px solid #86efac;' : 'background: #fef3c7; color: #b45309; border: 1px solid #fcd34d;'}
    }
    table.v-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 12px;
      font-size: 11.5px;
    }
    table.v-table th {
      background: #f1f5f9;
      color: #1e293b;
      font-weight: 700;
      text-align: left;
      padding: 7px 9px;
      border-bottom: 2px solid #cbd5e1;
      border-top: 2px solid #0284c7;
      text-transform: uppercase;
      font-size: 10.5px;
      letter-spacing: 0.03em;
    }
    table.v-table td {
      padding: 6px 9px;
      border-bottom: 1px solid #e2e8f0;
      color: #1e293b;
      vertical-align: middle;
    }
    table.v-table tr:nth-child(even) td {
      background: #fbfcfd;
    }
    .num {
      text-align: right;
      font-family: "JetBrains Mono", "Courier New", Courier, monospace;
    }
    .gst-text {
      color: #0284c7;
      font-family: "JetBrains Mono", "Courier New", Courier, monospace;
    }
    .bottom-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-top: 12px;
      gap: 16px;
      page-break-inside: avoid;
    }
    .notes-side {
      flex: 1;
      font-size: 11.5px;
      color: #475569;
    }
    .notes-box {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-left: 3.5px solid #0284c7;
      border-radius: 6px;
      padding: 7px 10px;
      margin-top: 5px;
    }
    .totals-side {
      width: 250px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      background: #f8fafc;
      padding: 9px 12px;
      font-size: 11.5px;
    }
    .t-row {
      display: flex;
      justify-content: space-between;
      padding: 2.5px 0;
      color: #475569;
    }
    .t-row b {
      font-family: "JetBrains Mono", "Courier New", Courier, monospace;
    }
    .t-row.grand {
      border-top: 2px solid #0f172a;
      margin-top: 5px;
      padding-top: 5px;
      font-size: 14.5px;
      font-weight: 800;
      color: #0f172a;
    }
    .t-row.grand .grand-val {
      color: #1d4ed8;
      font-size: 16px;
      font-family: "JetBrains Mono", "Courier New", Courier, monospace;
    }
    .signatures-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-top: 36px;
      padding-top: 6px;
      page-break-inside: avoid;
    }
    .sig-box {
      border-top: 1.5px dashed #94a3b8;
      padding-top: 5px;
      text-align: center;
      font-size: 10.5px;
      color: #475569;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    .footer-note {
      margin-top: 20px;
      border-top: 1px solid #e2e8f0;
      padding-top: 6px;
      display: flex;
      justify-content: space-between;
      font-size: 9.5px;
      color: #94a3b8;
    }
    @media print {
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="print-sheet">
    <div class="header-row">
      <div>
        <h1 class="company-name">${escapeHtml(state.settings.general?.company || "Hotel Rajmudra")}</h1>
        <div class="company-sub">${escapeHtml(state.settings.general?.address || "Marunji Gaon Marunji, Road, near Rajmudra Petrol Pump, Hinjawadi, Pune, Maharashtra 411057")}</div>
        <div class="company-sub">
          ${state.settings.general?.phone ? `<span>Tel: <b>${escapeHtml(state.settings.general.phone)}</b></span>` : ''}
          ${state.settings.general?.email ? ` · <span>Email: <b>${escapeHtml(state.settings.general.email)}</b></span>` : ''}
          ${state.settings.general?.website ? ` · <span>Web: <b>${escapeHtml(state.settings.general.website)}</b></span>` : ''}
        </div>
      </div>
      <div class="doc-type-block">
        <div class="doc-type-badge">${isPurchase ? "Goods Receipt Note (GRN)" : "Stock Outward Note"}</div>
        <div class="doc-no">${escapeHtml(voucher.no)}</div>
        <div class="doc-date">Date: <b>${fmtDate(voucher.date)}</b></div>
      </div>
    </div>

    <div class="meta-grid">
      <div class="meta-field"><span>Warehouse:</span> <b>${escapeHtml(voucher.store || state.currentStore || "Main Warehouse")}</b></div>
      <div class="meta-field"><span>${isPurchase ? "Supplier:" : "Department:"}</span> <b style="color:${isPurchase ? '#1d4ed8' : '#6d28d9'};">${escapeHtml(isPurchase ? voucher.supplier : voucher.department)}</b></div>
      <div class="meta-field"><span>Recorded By:</span> <b>${escapeHtml(voucher.user || state.currentUser)}</b></div>
      ${voucher.reference ? `<div class="meta-field"><span>Ref / Inv #:</span> <b>${escapeHtml(voucher.reference)}</b></div>` : ''}
      ${voucher.issuedTo ? `<div class="meta-field"><span>Issued To:</span> <b>${escapeHtml(voucher.issuedTo)}</b></div>` : ''}
      <div class="meta-field"><span>Status:</span> <span class="status-pill">${escapeHtml(voucher.status || (isPurchase ? "Posted" : "Issued"))}</span></div>
    </div>

    <table class="v-table">
      <thead>
        <tr>
          <th style="width:34px;text-align:center;">#</th>
          <th>Item Description</th>
          <th class="num" style="width:85px;">Quantity</th>
          <th style="width:60px;">Unit</th>
          <th class="num" style="width:90px;">Rate</th>
          ${hasGst ? `
            <th class="num" style="width:70px;">GST %</th>
            <th class="num" style="width:85px;">GST Amt</th>
          ` : ''}
          <th class="num" style="width:105px;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${items.map((i, idx) => {
          const qty = Number(i.qty) || 0;
          const rate = Number(i.rate) || 0;
          const gRate = Number(i.gstRate) || 0;
          const gAmt = Number(i.gstAmount) || roundNumber((qty * rate) * (gRate / 100));
          const lineTotal = Number(i.amount) || ((qty * rate) + (hasGst ? gAmt : 0));
          return `
            <tr>
              <td style="text-align:center;color:#64748b;">${idx + 1}</td>
              <td><b>${escapeHtml(i.product)}</b></td>
              <td class="num"><b>${numberValue(qty)}</b></td>
              <td>${escapeHtml(i.unit || 'unit')}</td>
              <td class="num">${money(rate)}</td>
              ${hasGst ? `
                <td class="num gst-text">${gRate}%</td>
                <td class="num gst-text">${money(gAmt)}</td>
              ` : ''}
              <td class="num" style="font-weight:700;color:#0f172a;">${money(lineTotal)}</td>
            </tr>
          `;
        }).join("")}
      </tbody>
    </table>

    <div class="bottom-row">
      <div class="notes-side">
        <div>Total Line Items: <b>${items.length}</b> &nbsp;·&nbsp; Total Units: <b>${numberValue(totalQty)}</b></div>
        ${voucher.remarks ? `
          <div class="notes-box">
            <b style="color:#0f172a;">Notes / Remarks:</b><br>${escapeHtml(voucher.remarks)}
          </div>
        ` : ''}
      </div>

      <div class="totals-side">
        ${hasGst ? `
          <div class="t-row">
            <span>Taxable Subtotal:</span>
            <b>${money(taxableSubtotal)}</b>
          </div>
          <div class="t-row" style="color:#0284c7;">
            <span>Total GST:</span>
            <b>${money(totalGst)}</b>
          </div>
        ` : ''}
        <div class="t-row grand">
          <span>Grand Total:</span>
          <span class="grand-val">${money(voucher.total)}</span>
        </div>
      </div>
    </div>

    <div class="signatures-row">
      <div class="sig-box">Prepared By (Clerk)</div>
      <div class="sig-box">Storekeeper / Verified By</div>
      <div class="sig-box">Authorized / Receiver</div>
    </div>

    <div class="footer-note">
      <span>StockSense Material Management OS · Audit Verified</span>
      <span>Voucher: <b>${escapeHtml(voucher.no)}</b> · Printed: ${nowStr}</span>
    </div>
  </div>
  ${autoPrint ? `<script>window.onload = function() { setTimeout(function() { window.print(); }, 200); };</script>` : ''}
</body>
</html>`;
}

function triggerCleanPrint(kind, no) {
  const isPurchase = kind === "Purchase";
  const voucher = isPurchase ? state.purchases.find(x => x.no === no) : state.outwards.find(x => x.no === no);
  if (!voucher) {
    toast("Voucher not found");
    return;
  }

  // Synchronous, direct print invocation
  try {
    window.print();
  } catch (err) {
    console.warn("Direct window.print() failed, opening document view:", err);
    openVoucherPrintTab(kind, no);
  }
}

function openVoucherPrintTab(kind, no) {
  const isPurchase = kind === "Purchase";
  const voucher = isPurchase ? state.purchases.find(x => x.no === no) : state.outwards.find(x => x.no === no);
  if (!voucher) {
    toast("Voucher not found");
    return;
  }

  const printHtml = generateVoucherPrintDocument(voucher, isPurchase, true);
  const blob = new Blob([printHtml], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  let newWin = null;
  try {
    newWin = window.open(url, "_blank");
  } catch (e) {
    newWin = null;
  }

  if (!newWin || newWin.closed || typeof newWin.closed === "undefined") {
    // If popup blocked in sandboxed iframe, fallback to downloading file so user can view/print
    downloadVoucherDocument(kind, no);
  }
}

function downloadVoucherDocument(kind, no) {
  const isPurchase = kind === "Purchase";
  const voucher = isPurchase ? state.purchases.find(x => x.no === no) : state.outwards.find(x => x.no === no);
  if (!voucher) {
    toast("Voucher not found");
    return;
  }

  const printHtml = generateVoucherPrintDocument(voucher, isPurchase, false);
  const blob = new Blob([printHtml], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${isPurchase ? "GRN" : "OUTWARD"}_${voucher.no}.html`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    a.remove();
    URL.revokeObjectURL(url);
  }, 2000);
  toast("Document saved. Open in browser to print / save as PDF.");
}

function printVoucherPreview(kind, no) {
  const isPurchase = kind === "Purchase";
  const voucher = isPurchase ? state.purchases.find(x => x.no === no) : state.outwards.find(x => x.no === no);
  if (!voucher) { toast("Voucher not found"); return; }

  const items = voucher.items || [];
  const hasGst = isPurchase && items.some(i => Number(i.gstRate) > 0 || Number(i.gstAmount) > 0);
  const totalQty = items.reduce((a, i) => a + (Number(i.qty) || 0), 0);
  const taxableSubtotal = items.reduce((a, i) => a + (Number(i.taxableAmount) || ((Number(i.qty) || 0) * (Number(i.rate) || 0))), 0);
  const totalGst = items.reduce((a, i) => a + (Number(i.gstAmount) || 0), 0);
  const isPosted = !voucher.status || voucher.status.toLowerCase() === "posted" || voucher.status.toLowerCase() === "received";

  openInAppModal(`${isPurchase ? 'PURCHASE INVOICE' : 'STOCK ISSUE VOUCHER'} — ${voucher.no}`, `
    <!-- Dedicated Print Trigger Banner -->
    <div class="pv-top-bar no-print" style="display:flex;align-items:center;justify-content:space-between;background:#f8fafc;padding:10px 14px;border-radius:8px;border:1px solid #cbd5e1;margin-bottom:14px;flex-wrap:wrap;gap:10px;">
      <div style="display:flex;align-items:center;gap:10px;">
        <span style="font-size:20px;">🖨️</span>
        <div>
          <div style="font-weight:700;font-size:13px;color:#0f172a;">Print & PDF Export</div>
          <div style="font-size:12px;color:#64748b;">Formatted for clean A4 printing with colored font styling and no UI chrome.</div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <button type="button" class="secondary" id="btn-open-pdf-window" onclick="openVoucherPrintTab('${isPurchase ? 'Purchase' : 'Outward'}', '${voucher.no}')" title="Open formatted document in a standalone page" style="display:inline-flex;align-items:center;gap:5px;font-size:12px;padding:6px 10px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          Open A4 Tab
        </button>
        <button type="button" class="secondary" id="btn-download-voucher-pdf" onclick="downloadVoucherDocument('${isPurchase ? 'Purchase' : 'Outward'}', '${voucher.no}')" title="Download formatted HTML/PDF file" style="display:inline-flex;align-items:center;gap:5px;font-size:12px;padding:6px 10px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          Download
        </button>
        <button type="button" class="primary" id="btn-print-voucher-top" onclick="triggerCleanPrint('${isPurchase ? 'Purchase' : 'Outward'}', '${voucher.no}')" style="display:inline-flex;align-items:center;gap:6px;padding:6px 16px;font-size:13px;font-weight:700;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
          Print / PDF
        </button>
      </div>
    </div>

    <!-- Printable Voucher Sheet -->
    <div class="printable-voucher" id="print-area">
      <div class="pv-header">
        <div>
          <h1 class="pv-company-name">${escapeHtml(state.settings.general?.company || "Hotel Rajmudra")}</h1>
          <p class="pv-company-sub">${escapeHtml(state.settings.general?.address || "Marunji Gaon Marunji, Road, near Rajmudra Petrol Pump, Hinjawadi, Pune, Maharashtra 411057")}${state.settings.general?.phone ? ` · Tel: <b>${escapeHtml(state.settings.general.phone)}</b>` : ''}</p>
          ${(state.settings.general?.email || state.settings.general?.website) ? `<p class="pv-company-sub">${state.settings.general?.email ? `Email: <b>${escapeHtml(state.settings.general.email)}</b>` : ''}${state.settings.general?.website ? ` · Web: <a href="${escapeHtml(state.settings.general.website)}" target="_blank" style="color:#0284c7;text-decoration:none;font-weight:600;">${escapeHtml(state.settings.general.website)}</a>` : ''}</p>` : ''}
        </div>
        <div style="text-align:right;">
          <div class="pv-doc-type-badge ${isPurchase ? 'purchase' : 'outward'}">${isPurchase ? "GOODS RECEIPT NOTE (GRN)" : "STOCK OUTWARD NOTE"}</div>
          <div class="pv-voucher-no">${escapeHtml(voucher.no)}</div>
          <div class="pv-voucher-date">Date: <b style="color:#0f172a;">${fmtDate(voucher.date)}</b></div>
        </div>
      </div>

      <div class="pv-meta-card">
        <div class="pv-meta-item"><span>Warehouse:</span> <b>${escapeHtml(voucher.store || state.currentStore || "Main Warehouse")}</b></div>
        <div class="pv-meta-item"><span>${isPurchase ? "Supplier:" : "Department:"}</span> <b class="${isPurchase ? 'supplier-val' : 'dept-val'}">${escapeHtml(isPurchase ? voucher.supplier : voucher.department)}</b></div>
        <div class="pv-meta-item"><span>Recorded By:</span> <b>${escapeHtml(voucher.user || state.currentUser)}</b></div>
        ${voucher.reference ? `<div class="pv-meta-item"><span>Ref / Inv #:</span> <b>${escapeHtml(voucher.reference)}</b></div>` : ''}
        ${voucher.issuedTo ? `<div class="pv-meta-item"><span>Issued To:</span> <b>${escapeHtml(voucher.issuedTo)}</b></div>` : ''}
        <div class="pv-meta-item"><span>Status:</span> <span class="pv-status-badge ${isPosted ? 'posted' : 'issued'}">${escapeHtml(voucher.status || (isPurchase ? "Posted" : "Issued"))}</span></div>
      </div>

      <div class="pv-table-wrap">
        <table class="pv-table">
          <thead>
            <tr>
              <th style="width:36px;text-align:center;">#</th>
              <th>Item Description</th>
              <th class="num-col" style="width:90px;">Quantity</th>
              <th style="width:70px;">Unit</th>
              <th class="num-col" style="width:100px;">Rate</th>
              ${hasGst ? `
                <th class="num-col gst-col" style="width:75px;">GST %</th>
                <th class="num-col gst-col" style="width:95px;">GST Amt</th>
              ` : ''}
              <th class="num-col" style="width:115px;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${items.map((i, idx) => {
              const qty = Number(i.qty) || 0;
              const rate = Number(i.rate) || 0;
              const gRate = Number(i.gstRate) || 0;
              const gAmt = Number(i.gstAmount) || roundNumber((qty * rate) * (gRate / 100));
              const lineTotal = Number(i.amount) || ((qty * rate) + (hasGst ? gAmt : 0));
              return `
                <tr>
                  <td style="text-align:center;color:#64748b;">${idx + 1}</td>
                  <td><b>${escapeHtml(i.product)}</b></td>
                  <td class="num-col"><b>${numberValue(qty)}</b></td>
                  <td>${escapeHtml(i.unit || 'unit')}</td>
                  <td class="num-col">${money(rate)}</td>
                  ${hasGst ? `
                    <td class="num-col gst-col">${gRate}%</td>
                    <td class="num-col gst-col">${money(gAmt)}</td>
                  ` : ''}
                  <td class="num-col total">${money(lineTotal)}</td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>

      <div class="pv-bottom-row">
        <div class="pv-notes-box">
          <div style="font-size:12.5px;color:#475569;">Total Line Items: <b style="color:#0f172a;">${items.length}</b> &nbsp;·&nbsp; Total Units: <b style="color:#0f172a;">${numberValue(totalQty)}</b></div>
          ${voucher.remarks ? `
            <div class="pv-notes-inner">
              <b style="color:#0f172a;">Notes / Remarks:</b><br>${escapeHtml(voucher.remarks)}
            </div>
          ` : ''}
        </div>

        <div class="pv-summary-card">
          ${hasGst ? `
            <div class="pv-summary-row">
              <span>Taxable Subtotal:</span>
              <b>${money(taxableSubtotal)}</b>
            </div>
            <div class="pv-summary-row gst">
              <span>Total GST:</span>
              <b>${money(totalGst)}</b>
            </div>
          ` : ''}
          <div class="pv-summary-row grand-total">
            <span>Grand Total:</span>
            <span class="amt">${money(voucher.total)}</span>
          </div>
        </div>
      </div>

      <!-- Formal Authorization Signatures Block -->
      <div class="pv-signatures">
        <div class="pv-sig-box">Prepared By (Clerk)</div>
        <div class="pv-sig-box">Storekeeper / Verified By</div>
        <div class="pv-sig-box">Authorized / Receiver</div>
      </div>

      <div class="pv-footer-info">
        <span>StockSense Material Management OS · Audit Verified</span>
        <span>Voucher: <b>${escapeHtml(voucher.no)}</b></span>
      </div>
    </div>
  `, `
    <button class="secondary" onclick="closeModal()">Close</button>
    <button class="secondary" onclick="closeModal();${isPurchase ? `editPurchaseVoucher('${voucher.no}')` : `editOutwardVoucher('${voucher.no}')`}">Edit / Modify</button>
    <button class="danger-btn" onclick="closeModal();${isPurchase ? `deletePurchaseVoucher('${voucher.no}')` : `deleteOutwardVoucher('${voucher.no}')`}">Delete</button>
    <button class="primary" id="btn-print-voucher-bottom" onclick="triggerCleanPrint('${isPurchase ? 'Purchase' : 'Outward'}', '${voucher.no}')" style="display:inline-flex;align-items:center;gap:6px;">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
      Print / PDF
    </button>
  `);
}

// SUPPLIERS
function suppliersScreen() {
  return layout(
    "Suppliers",
    "Manage vendor profiles, delivery lead times and balances.",
    `<button class="primary" onclick="openModal('supplier')">＋ Add Supplier</button>`,
    `
      <div class="panel">
        <div class="panel-head">
          <span class="panel-title">Approved Vendors (${state.suppliers.length})</span>
        </div>
        <div class="view-table">
          <table class="table">
            <thead>
              <tr>
                <th>Supplier</th>
                <th>Category</th>
                <th>Contact</th>
                <th>Lead Time</th>
                <th>Outstanding Balance</th>
                <th>Status</th>
                <th style="text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${state.suppliers.map((s, idx) => `
                <tr>
                  <td><b>${s[0]}</b></td>
                  <td>${s[1] || "General"}</td>
                  <td>${s[2] || "—"}</td>
                  <td>${s[3]} days</td>
                  <td class="num-cell"><b>${money(s[4] || 0)}</b></td>
                  <td><span class="status ok">Active</span></td>
                  <td style="text-align:right;">
                    <div class="table-action-btns">
                      <button type="button" class="secondary" onclick="openModal('supplier', ${idx})">Edit</button>
                      <button type="button" class="secondary" onclick="newPurchaseOrder([{product:state.products[0]?.name||'',qty:10,rate:10}])">Create PO</button>
                      <button type="button" class="danger-btn" onclick="deleteSupplier(${idx})">Delete</button>
                    </div>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `
  );
}

// ==========================================
// ACCOUNTS & SUPPLIER DUES MANAGEMENT
// ==========================================

let accountsFilterState = {
  month: "current", // "current", "last", "all", or "YYYY-MM"
  supplier: "All",
  status: "All",
  search: ""
};

function getSupplierFinancials(supplierName) {
  const sup = state.suppliers.find(s => s[0] === supplierName);
  const openingDue = Number(sup?.[4] || 0);
  const curMonth = monthKey(today);

  const supPurchases = state.purchases.filter(p => p.supplier === supplierName);
  const totalInvoiced = supPurchases.reduce((sum, p) => sum + Number(p.total || 0), 0);
  const currentMonthInvoiced = supPurchases
    .filter(p => monthKey(p.date) === curMonth)
    .reduce((sum, p) => sum + Number(p.total || 0), 0);

  const supPayments = (state.payments || []).filter(p => p.supplier === supplierName);
  const totalPaid = supPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const currentMonthPaid = supPayments
    .filter(p => monthKey(p.date) === curMonth)
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const netDue = openingDue + totalInvoiced - totalPaid;

  return {
    supplier: supplierName,
    category: sup?.[1] || "General",
    contact: sup?.[2] || "—",
    leadTime: sup?.[3] || 3,
    openingDue,
    currentMonthInvoiced,
    currentMonthPaid,
    totalInvoiced,
    totalPaid,
    netDue,
    status: netDue <= 0 ? "settled" : (totalPaid > 0 ? "partial" : "pending")
  };
}

function onPaymentSupplierChange(supplierName) {
  const amtInput = document.getElementById("m-pay-amount");
  if (!amtInput) return;
  const fin = getSupplierFinancials(supplierName);
  amtInput.value = fin.netDue > 0 ? fin.netDue : "";
}

function submitPayment() {
  const supplier = document.getElementById("m-pay-supplier")?.value;
  const date = document.getElementById("m-pay-date")?.value || today;
  const amount = Number(document.getElementById("m-pay-amount")?.value) || 0;
  const mode = document.getElementById("m-pay-mode")?.value || "Bank Transfer";
  const ref = document.getElementById("m-pay-ref")?.value.trim() || ("TXN-" + Date.now().toString().slice(-6));
  const notes = document.getElementById("m-pay-notes")?.value.trim() || "";

  if (!supplier) { toast("Please select a supplier"); return; }
  if (amount <= 0) { toast("Please enter a valid payment amount"); return; }

  const id = "PAY-" + String((state.payments.length + 101)).padStart(5, "0");
  state.payments.unshift({
    id,
    date,
    supplier,
    amount,
    mode,
    ref,
    notes,
    recordedBy: state.currentUser,
    createdAt: new Date().toISOString()
  });

  save();
  closeModal();
  toast(`Payment of ${money(amount)} recorded for ${supplier}`);
  showView("accounts");
}

function deletePayment(payId) {
  confirmModal("Are you sure you want to void / delete payment voucher " + payId + "?", () => {
    state.payments = state.payments.filter(p => p.id !== payId);
    save();
    toast("Payment voucher " + payId + " voided");
    showView("accounts");
  });
}

function editPayment(payId) {
  const p = state.payments.find(x => x.id === payId);
  if (!p) { toast("Payment voucher not found"); return; }
  openInAppModal("Edit Payment Voucher — " + p.id, `
    <div class="form-grid">
      <div class="form-field full">
        <label>Supplier *</label>
        <select id="m-pay-edit-supplier">
          ${state.suppliers.map(s => `<option value="${escapeQuote(s[0])}" ${s[0] === p.supplier ? 'selected' : ''}>${escapeHtml(s[0])}</option>`).join("")}
        </select>
      </div>
      <div class="form-field">
        <label>Payment Date *</label>
        <input id="m-pay-edit-date" type="date" value="${(p.date || today).slice(0, 10)}">
      </div>
      <div class="form-field">
        <label>Amount Paid *</label>
        <input id="m-pay-edit-amount" type="number" step="0.01" value="${p.amount}">
      </div>
      <div class="form-field">
        <label>Payment Mode</label>
        <select id="m-pay-edit-mode">
          ${["Bank Transfer", "Cheque", "Cash", "UPI / Card", "NEFT / RTGS"].map(m => `<option ${m === p.mode ? 'selected' : ''}>${m}</option>`).join("")}
        </select>
      </div>
      <div class="form-field">
        <label>Ref / Cheque / UTR #</label>
        <input id="m-pay-edit-ref" value="${escapeHtml(p.ref || '')}">
      </div>
      <div class="form-field full">
        <label>Notes / Remarks</label>
        <input id="m-pay-edit-notes" value="${escapeHtml(p.notes || '')}">
      </div>
    </div>
  `, `
    <button class="danger-btn" onclick="closeModal();deletePayment('${p.id}')">Delete Voucher</button>
    <button class="secondary" onclick="closeModal()">Cancel</button>
    <button class="primary" onclick="savePaymentEdit('${p.id}')">Save Changes</button>
  `);
}

function savePaymentEdit(payId) {
  const p = state.payments.find(x => x.id === payId);
  if (!p) return;
  const supplier = document.getElementById("m-pay-edit-supplier")?.value;
  const date = document.getElementById("m-pay-edit-date")?.value;
  const amount = Number(document.getElementById("m-pay-edit-amount")?.value) || 0;
  const mode = document.getElementById("m-pay-edit-mode")?.value;
  const ref = document.getElementById("m-pay-edit-ref")?.value.trim();
  const notes = document.getElementById("m-pay-edit-notes")?.value.trim();

  if (!supplier) { toast("Please select a supplier"); return; }
  if (amount <= 0) { toast("Amount must be greater than zero"); return; }

  p.supplier = supplier;
  p.date = date;
  p.amount = amount;
  p.mode = mode;
  p.ref = ref;
  p.notes = notes;

  save();
  closeModal();
  toast("Payment voucher updated");
  showView("accounts");
}

function editSupplierByName(name) {
  const idx = state.suppliers.findIndex(s => s[0] === name);
  if (idx >= 0) openModal("supplier", idx);
}

function deleteSupplierByName(name) {
  const idx = state.suppliers.findIndex(s => s[0] === name);
  if (idx >= 0) deleteSupplier(idx);
}

function viewSupplierStatement(supplierName) {
  const fin = getSupplierFinancials(supplierName);
  const supPurchases = state.purchases.filter(p => p.supplier === supplierName).map(p => ({
    date: p.date,
    type: "Bill (GRN)",
    ref: p.no,
    notes: p.reference ? `Invoice Ref: ${p.reference}` : (p.remarks || "Goods Receipt Note"),
    debit: Number(p.total || 0),
    credit: 0
  }));

  const supPayments = (state.payments || []).filter(p => p.supplier === supplierName).map(p => ({
    date: p.date,
    type: "Payment",
    ref: p.id + (p.ref ? ` (${p.ref})` : ""),
    notes: `${p.mode} - ${p.notes || "Supplier Disbursement"}`,
    debit: 0,
    credit: Number(p.amount || 0)
  }));

  const rows = [
    { date: "Opening", type: "Opening Balance", ref: "—", notes: "Initial Supplier Opening Balance", debit: fin.openingDue, credit: 0 },
    ...supPurchases,
    ...supPayments
  ].sort((a, b) => (a.date === "Opening" ? -1 : b.date === "Opening" ? 1 : new Date(a.date) - new Date(b.date)));

  let running = 0;
  const computedRows = rows.map(r => {
    running = running + r.debit - r.credit;
    return { ...r, running };
  });

  openInAppModal(`Statement — ${supplierName}`, `
    <div style="margin-bottom:16px;">
      <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:#f8fafc;border-radius:8px;border:1px solid var(--line);">
        <div>
          <b style="font-size:15px;color:#0f172a;">${supplierName}</b>
          <div style="color:#64748b;font-size:12px;margin-top:2px;">Category: ${fin.category} · Credit Terms: ${fin.leadTime} days</div>
        </div>
        <div style="text-align:right;">
          <span style="font-size:11px;color:#64748b;display:block;">Current Outstanding Due:</span>
          <b style="font-size:18px;font-family:'JetBrains Mono';color:${fin.netDue > 0 ? 'var(--red)' : 'var(--green-text)'}">${money(fin.netDue)}</b>
        </div>
      </div>
    </div>
    <div style="max-height:360px;overflow-y:auto;border:1px solid var(--line);border-radius:6px;">
      <table class="table" style="font-size:12px;">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Reference</th>
            <th>Particulars</th>
            <th style="text-align:right;">Billed (Debit)</th>
            <th style="text-align:right;">Paid (Credit)</th>
            <th style="text-align:right;">Balance</th>
          </tr>
        </thead>
        <tbody>
          ${computedRows.map(r => `
            <tr>
              <td>${r.date === "Opening" ? "Opening" : fmtDate(r.date)}</td>
              <td><span class="tag">${r.type}</span></td>
              <td><b>${r.ref}</b></td>
              <td>${escapeHtml(r.notes)}</td>
              <td class="num-cell">${r.debit ? money(r.debit) : "—"}</td>
              <td class="num-cell" style="color:var(--green-text);font-weight:600;">${r.credit ? money(r.credit) : "—"}</td>
              <td class="num-cell" style="font-weight:700;color:${r.running > 0 ? 'var(--red)' : 'var(--green-text)'}">${money(r.running)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `, `
    <button class="secondary" onclick="window.print()">Print Statement</button>
    <button class="primary" onclick="closeModal();openModal('payment', '${escapeQuote(supplierName)}')">Record Payment</button>
  `);
}

function exportAccountsCsv() {
  const curMonth = monthKey(today);
  const rows = [
    ["Supplier", "Category", "Contact", "Credit Terms (Days)", "Opening Due", "Current Month Purchases", "Total Invoiced", "Total Paid", "Net Due Balance", "Status"],
    ...state.suppliers.map(s => {
      const f = getSupplierFinancials(s[0]);
      return [s[0], f.category, f.contact, f.leadTime, f.openingDue.toFixed(2), f.currentMonthInvoiced.toFixed(2), f.totalInvoiced.toFixed(2), f.totalPaid.toFixed(2), f.netDue.toFixed(2), f.status];
    })
  ];
  downloadCsv("stocksense-accounts-statement.csv", rows);
}

function accountsScreen() {
  const curMonth = monthKey(today);
  const prevDate = new Date();
  prevDate.setMonth(prevDate.getMonth() - 1);
  const lastMonth = monthKey(prevDate.toISOString());

  // Determine active month filter key
  let selectedMonthKey = "";
  if (accountsFilterState.month === "current") selectedMonthKey = curMonth;
  else if (accountsFilterState.month === "last") selectedMonthKey = lastMonth;
  else if (accountsFilterState.month === "all") selectedMonthKey = "";
  else selectedMonthKey = accountsFilterState.month;

  const q = accountsFilterState.search.toLowerCase().trim();

  // Compute supplier financials
  const allSuppliersFin = state.suppliers.map(s => {
    const name = s[0];
    const openingDue = Number(s[4] || 0);

    const purchases = state.purchases.filter(p => p.supplier === name);
    const totalPurchases = purchases.reduce((sum, p) => sum + Number(p.total || 0), 0);
    const periodPurchases = selectedMonthKey
      ? purchases.filter(p => monthKey(p.date) === selectedMonthKey).reduce((sum, p) => sum + Number(p.total || 0), 0)
      : totalPurchases;

    const payments = (state.payments || []).filter(p => p.supplier === name);
    const totalPayments = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
    const periodPayments = selectedMonthKey
      ? payments.filter(p => monthKey(p.date) === selectedMonthKey).reduce((sum, p) => sum + Number(p.amount || 0), 0)
      : totalPayments;

    const netDue = openingDue + totalPurchases - totalPayments;
    const status = netDue <= 0 ? "settled" : (totalPayments > 0 ? "partial" : "pending");

    return {
      name,
      category: s[1] || "General",
      contact: s[2] || "—",
      leadTime: s[3] || 3,
      openingDue,
      periodPurchases,
      totalPurchases,
      periodPayments,
      totalPayments,
      netDue,
      status
    };
  });

  // Filtered suppliers
  const filteredSuppliers = allSuppliersFin.filter(s => {
    const matchSup = accountsFilterState.supplier === "All" || s.name === accountsFilterState.supplier;
    const matchStatus = accountsFilterState.status === "All" ||
      (accountsFilterState.status === "due" && s.netDue > 0) ||
      (accountsFilterState.status === "settled" && s.netDue <= 0);
    const matchSearch = !q || s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q) || s.contact.toLowerCase().includes(q);
    return matchSup && matchStatus && matchSearch;
  });

  // Overall KPIs
  const totalDueAcrossAll = allSuppliersFin.reduce((sum, s) => sum + Math.max(0, s.netDue), 0);
  const periodPurchasesTotal = filteredSuppliers.reduce((sum, s) => sum + s.periodPurchases, 0);
  const totalPaidOverall = (state.payments || [])
    .filter(p => accountsFilterState.supplier === "All" || p.supplier === accountsFilterState.supplier)
    .filter(p => !selectedMonthKey || monthKey(p.date) === selectedMonthKey)
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const dueSuppliersCount = allSuppliersFin.filter(s => s.netDue > 0).length;

  // Filtered Payments ledger
  const filteredPayments = (state.payments || []).filter(p => {
    const matchSup = accountsFilterState.supplier === "All" || p.supplier === accountsFilterState.supplier;
    const matchMonth = !selectedMonthKey || monthKey(p.date) === selectedMonthKey;
    const matchSearch = !q || p.supplier.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || (p.ref || "").toLowerCase().includes(q);
    return matchSup && matchMonth && matchSearch;
  });

  // Filtered Invoices
  const filteredInvoices = state.purchases.filter(p => {
    const matchSup = accountsFilterState.supplier === "All" || p.supplier === accountsFilterState.supplier;
    const matchMonth = !selectedMonthKey || monthKey(p.date) === selectedMonthKey;
    const matchSearch = !q || p.supplier.toLowerCase().includes(q) || p.no.toLowerCase().includes(q) || (p.reference || "").toLowerCase().includes(q);
    return matchSup && matchMonth && matchSearch;
  });

  const periodLabel = selectedMonthKey ? monthName(selectedMonthKey) : "All Time";

  return layout(
    "Accounts & Supplier Dues",
    "Track supplier due amounts, monthly purchase totals with active filters, and settlement payments.",
    `<button class="secondary" onclick="exportAccountsCsv()">Export Accounts CSV</button>
     <button class="secondary" onclick="window.print()">Print</button>
     <button class="primary" onclick="openModal('payment')">＋ Record Supplier Payment</button>`,
    `
      <div class="metrics">
        ${metric("Supplier Due Amount", money(totalDueAcrossAll), "💳", totalDueAcrossAll > 0 ? "amber" : "green", `${dueSuppliersCount} vendors with pending balance`)}
        ${metric("Purchases (" + periodLabel + ")", money(periodPurchasesTotal), "↗", "blue", "Total bills in selected filter")}
        ${metric("Total Paid Amount", money(totalPaidOverall), "✓", "green", "Disbursed settlements in period")}
        ${metric("Active Suppliers", state.suppliers.length, "🚚", "neutral", `${dueSuppliersCount} pending dues`)}
      </div>

      <div class="filterbar">
        <select onchange="accountsFilterState.month=this.value;showView('accounts')">
          <option value="current" ${accountsFilterState.month === 'current' ? 'selected' : ''}>Current Month (${monthName(curMonth)})</option>
          <option value="last" ${accountsFilterState.month === 'last' ? 'selected' : ''}>Last Month (${monthName(lastMonth)})</option>
          <option value="all" ${accountsFilterState.month === 'all' ? 'selected' : ''}>All Time</option>
        </select>
        <select onchange="accountsFilterState.supplier=this.value;showView('accounts')">
          <option value="All">All Suppliers</option>
          ${state.suppliers.map(s => `<option value="${escapeQuote(s[0])}" ${accountsFilterState.supplier === s[0] ? 'selected' : ''}>${s[0]}</option>`).join("")}
        </select>
        <select onchange="accountsFilterState.status=this.value;showView('accounts')">
          <option value="All" ${accountsFilterState.status === 'All' ? 'selected' : ''}>All Statuses</option>
          <option value="due" ${accountsFilterState.status === 'due' ? 'selected' : ''}>Pending Dues Only</option>
          <option value="settled" ${accountsFilterState.status === 'settled' ? 'selected' : ''}>Fully Settled Only</option>
        </select>
        <input placeholder="Search supplier, bill ref, or voucher..." value="${escapeHtml(accountsFilterState.search)}" oninput="accountsFilterState.search=this.value;showView('accounts')">
      </div>

      <div class="panel" style="margin-bottom:24px;">
        <div class="panel-head">
          <span class="panel-title">Supplier Balances & Dues Matrix</span>
          <span class="pill">${filteredSuppliers.length} suppliers</span>
        </div>
        <div class="view-table">
          <table class="table">
            <thead>
              <tr>
                <th>Supplier</th>
                <th>Category</th>
                <th>Credit Terms</th>
                <th style="text-align:right;">Opening Due</th>
                <th style="text-align:right;">${periodLabel} Bills</th>
                <th style="text-align:right;">Total Invoiced</th>
                <th style="text-align:right;">Total Paid</th>
                <th style="text-align:right;">Outstanding Due</th>
                <th>Status</th>
                <th style="text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${filteredSuppliers.map(s => `
                <tr>
                  <td>
                    <b>${s.name}</b>
                    <div style="font-size:11px;color:#64748b;">${s.contact}</div>
                  </td>
                  <td>${s.category}</td>
                  <td>${s.leadTime} days</td>
                  <td class="num-cell">${money(s.openingDue)}</td>
                  <td class="num-cell"><b>${money(s.periodPurchases)}</b></td>
                  <td class="num-cell">${money(s.totalPurchases)}</td>
                  <td class="num-cell" style="color:var(--green-text);font-weight:600;">${money(s.totalPayments)}</td>
                  <td class="num-cell" style="font-weight:800;color:${s.netDue > 0 ? 'var(--red)' : 'var(--green-text)'}">
                    ${money(s.netDue)}
                  </td>
                  <td>
                    <span class="due-badge ${s.status}">
                      ${s.status === 'settled' ? '✓ Settled' : s.status === 'partial' ? '◐ Partial' : '● Due'}
                    </span>
                  </td>
                  <td style="text-align:right;">
                    <div class="table-action-btns">
                      <button type="button" class="primary" onclick="openModal('payment', '${escapeQuote(s.name)}')">Pay</button>
                      <button type="button" class="secondary" onclick="viewSupplierStatement('${escapeQuote(s.name)}')">Statement</button>
                      <button type="button" class="secondary" onclick="editSupplierByName('${escapeQuote(s.name)}')">Edit</button>
                      <button type="button" class="danger-btn" onclick="deleteSupplierByName('${escapeQuote(s.name)}')">Delete</button>
                    </div>
                  </td>
                </tr>
              `).join("") || '<tr><td colspan="10" class="empty-state">No matching suppliers found.</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1.1fr 1fr;gap:20px;">
        <div class="panel">
          <div class="panel-head">
            <span class="panel-title">Payment Vouchers History</span>
            <span class="pill">${filteredPayments.length} records</span>
          </div>
          <div class="view-table">
            <table class="table" style="font-size:12px;">
              <thead>
                <tr>
                  <th>Voucher #</th>
                  <th>Date</th>
                  <th>Supplier</th>
                  <th>Mode</th>
                  <th>Ref / UTR</th>
                  <th style="text-align:right;">Amount Paid</th>
                  <th style="text-align:right;">Action</th>
                </tr>
              </thead>
              <tbody>
                ${filteredPayments.map(p => `
                  <tr>
                    <td><b>${p.id}</b></td>
                    <td>${fmtDate(p.date)}</td>
                    <td><b>${p.supplier}</b></td>
                    <td><span class="payment-mode-tag">${p.mode}</span></td>
                    <td>${p.ref || '—'}</td>
                    <td class="num-cell" style="font-weight:700;color:var(--green-text);">${money(p.amount)}</td>
                    <td style="text-align:right;">
                      <div class="table-action-btns">
                        <button type="button" class="secondary" onclick="editPayment('${p.id}')">Edit</button>
                        <button type="button" class="danger-btn" onclick="deletePayment('${p.id}')">Void</button>
                      </div>
                    </td>
                  </tr>
                `).join("") || '<tr><td colspan="7" class="empty-state">No payments found in this period.</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>

        <div class="panel">
          <div class="panel-head">
            <span class="panel-title">Purchase Invoices (${periodLabel})</span>
            <span class="pill">${filteredInvoices.length} GRNs</span>
          </div>
          <div class="view-table">
            <table class="table" style="font-size:12px;">
              <thead>
                <tr>
                  <th>GRN #</th>
                  <th>Date</th>
                  <th>Supplier</th>
                  <th>Reference</th>
                  <th style="text-align:right;">Bill Amount</th>
                  <th style="text-align:right;">Action</th>
                </tr>
              </thead>
              <tbody>
                ${filteredInvoices.map(p => `
                  <tr>
                    <td><b>${p.no}</b></td>
                    <td>${fmtDate(p.date)}</td>
                    <td><b>${p.supplier}</b></td>
                    <td>${p.reference || '—'}</td>
                    <td class="num-cell"><b>${money(p.total)}</b></td>
                    <td style="text-align:right;">
                      <div class="table-action-btns">
                        <button type="button" class="secondary" onclick="viewVoucher('${p.no}', true)">View</button>
                        <button type="button" class="secondary" onclick="editPurchaseVoucher('${p.no}')">Edit</button>
                        <button type="button" class="danger-btn" onclick="deletePurchaseVoucher('${p.no}')">Delete</button>
                      </div>
                    </td>
                  </tr>
                `).join("") || '<tr><td colspan="6" class="empty-state">No purchase bills found in this period.</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `
  );
}

// ==========================================
// 6-REPORT SYSTEM (REPORTS TAB NAVIGATION)
// ==========================================

let currentReportType = "stock"; // "stock", "ledger", "purchase", "outward", "consumption", "deadstock"
let reportFilters = {
  stock: { category: "All", store: "All", status: "All", search: "" },
  ledger: { product: "All", store: "All", range: "This Month", type: "All", search: "" },
  purchase: { supplier: "All", store: "All", range: "This Month", search: "" },
  outward: { department: "All", store: "All", range: "This Month", search: "" },
  consumption: { department: "All", store: "All", range: "This Month" },
  deadstock: { days: 30, store: "All", category: "All", search: "" }
};

function setReportType(type) {
  currentReportType = type;
  showView("reports");
}

function universalReports() {
  let contentHtml = "";
  if (currentReportType === "stock") contentHtml = renderStockReport();
  else if (currentReportType === "ledger") contentHtml = renderStockLedgerReport();
  else if (currentReportType === "purchase") contentHtml = renderPurchaseReport();
  else if (currentReportType === "outward") contentHtml = renderOutwardReport();
  else if (currentReportType === "consumption") contentHtml = renderDepartmentConsumptionReport();
  else if (currentReportType === "deadstock") contentHtml = renderDeadStockReport();
  else contentHtml = renderStockReport();

  return layout(
    "Reports & Analytics",
    "Comprehensive inventory statements, valuation audits, movement ledgers, and dead stock analysis.",
    `<button class="secondary" onclick="exportCurrentReportCsv()">Export Active CSV</button>
     <button class="secondary" onclick="window.print()">Print Report</button>`,
    `
      <div class="report-types-bar">
        <button class="report-type-btn ${currentReportType === 'stock' ? 'active' : ''}" onclick="setReportType('stock')">
          <span class="rt-icon">📦</span> Stock Report
          <span class="rt-count">${state.products.length}</span>
        </button>
        <button class="report-type-btn ${currentReportType === 'ledger' ? 'active' : ''}" onclick="setReportType('ledger')">
          <span class="rt-icon">📑</span> Stock Ledger
          <span class="rt-count">${state.transactions.length}</span>
        </button>
        <button class="report-type-btn ${currentReportType === 'purchase' ? 'active' : ''}" onclick="setReportType('purchase')">
          <span class="rt-icon">🛒</span> Purchase Report
          <span class="rt-count">${state.purchases.length}</span>
        </button>
        <button class="report-type-btn ${currentReportType === 'outward' ? 'active' : ''}" onclick="setReportType('outward')">
          <span class="rt-icon">📤</span> Outward Report
          <span class="rt-count">${state.outwards.length}</span>
        </button>
        <button class="report-type-btn ${currentReportType === 'consumption' ? 'active' : ''}" onclick="setReportType('consumption')">
          <span class="rt-icon">🏢</span> Department Consumption
        </button>
        <button class="report-type-btn ${currentReportType === 'deadstock' ? 'active' : ''}" onclick="setReportType('deadstock')">
          <span class="rt-icon">⏳</span> Dead Stock
        </button>
      </div>

      ${contentHtml}
    `
  );
}

// 1. Stock Report
function renderStockReport() {
  const f = reportFilters.stock;
  const categories = [...new Set(state.products.map(p => p.category || "General"))];
  const q = f.search.toLowerCase().trim();

  const filtered = state.products.filter(p => {
    const matchCat = f.category === "All" || (p.category || "General") === f.category;
    const matchStore = f.store === "All" || (p.store || state.currentStore) === f.store;
    let matchStatus = true;
    if (f.status === "low") matchStatus = p.stock > 0 && p.stock <= (p.min || 10);
    else if (f.status === "reorder") matchStatus = p.stock <= (p.reorder || p.min || 10);
    else if (f.status === "out") matchStatus = p.stock <= 0;
    else if (f.status === "ok") matchStatus = p.stock > (p.min || 10);
    const matchSearch = !q || p.name.toLowerCase().includes(q) || (p.category || "").toLowerCase().includes(q);
    return matchCat && matchStore && matchStatus && matchSearch;
  });

  const totalUnits = filtered.reduce((a, b) => a + (Number(b.stock) || 0), 0);
  const totalValuation = filtered.reduce((a, b) => a + ((Number(b.stock) || 0) * (Number(b.cost) || 0)), 0);
  const lowStockCount = filtered.filter(p => p.stock <= (p.min || 10)).length;

  return `
    <div class="metrics">
      ${metric("Catalog Items", filtered.length, "📦", "blue", "Matching inventory items")}
      ${metric("Physical Quantity", numberValue(totalUnits), "▣", "green", "Total units on hand")}
      ${metric("Stock Valuation", money(totalValuation), "$", "green", "Total asset value on floor")}
      ${metric("Low / Out of Stock", lowStockCount, "⚠", lowStockCount > 0 ? "amber" : "green", "Requires vendor replenishment")}
    </div>

    <div class="filterbar">
      <select onchange="reportFilters.stock.category=this.value;showView('reports')">
        <option value="All">All Categories</option>
        ${categories.map(c => `<option value="${escapeQuote(c)}" ${f.category === c ? 'selected' : ''}>${c}</option>`).join("")}
      </select>
      <select onchange="reportFilters.stock.store=this.value;showView('reports')">
        <option value="All">All Warehouses</option>
        ${state.stores.map(s => `<option value="${escapeQuote(s[0])}" ${f.store === s[0] ? 'selected' : ''}>${s[0]}</option>`).join("")}
      </select>
      <select onchange="reportFilters.stock.status=this.value;showView('reports')">
        <option value="All" ${f.status === 'All' ? 'selected' : ''}>All Stock Statuses</option>
        <option value="ok" ${f.status === 'ok' ? 'selected' : ''}>Healthy Stock (> Min)</option>
        <option value="low" ${f.status === 'low' ? 'selected' : ''}>Low Stock (≤ Min)</option>
        <option value="reorder" ${f.status === 'reorder' ? 'selected' : ''}>Reorder Point Reached</option>
        <option value="out" ${f.status === 'out' ? 'selected' : ''}>Out of Stock (0)</option>
      </select>
      <input placeholder="Search item name or SKU..." value="${escapeHtml(f.search)}" oninput="reportFilters.stock.search=this.value;showView('reports')">
    </div>

    <div class="panel">
      <div class="panel-head">
        <span class="panel-title">Current Stock Valuation Report</span>
        <span class="pill">${filtered.length} products listed</span>
      </div>
      <div class="view-table">
        <table class="table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Category</th>
              <th>Warehouse</th>
              <th style="text-align:right;">Stock On Hand</th>
              <th style="text-align:right;">Min Level</th>
              <th style="text-align:right;">Reorder Pt</th>
              <th style="text-align:right;">Cost Rate</th>
              <th style="text-align:right;">Total Valuation</th>
              <th>Status</th>
              <th style="text-align:right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map(p => {
              const val = (Number(p.stock) || 0) * (Number(p.cost) || 0);
              const isOut = p.stock <= 0;
              const isLow = p.stock <= (p.min || 10);
              return `
                <tr>
                  <td>
                    <span style="margin-right:6px;">${p.icon || '📦'}</span>
                    <b>${p.name}</b>
                  </td>
                  <td>${p.category || 'General'}</td>
                  <td>${p.store || state.currentStore}</td>
                  <td class="num-cell"><b>${numberValue(p.stock)}</b> ${p.unit}</td>
                  <td class="num-cell">${numberValue(p.min || 0)}</td>
                  <td class="num-cell">${numberValue(p.reorder || ((p.min || 0) + 5))}</td>
                  <td class="num-cell">${money(p.cost || 0)}</td>
                  <td class="num-cell" style="font-weight:700;">${money(val)}</td>
                  <td>
                    <span class="status ${isOut ? 'danger' : isLow ? 'warning' : 'ok'}">
                      ${isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'Healthy'}
                    </span>
                  </td>
                  <td style="text-align:right;">
                    <div class="table-action-btns">
                      <button type="button" class="secondary" onclick="modifyItem('${p.id}')">Edit</button>
                      <button type="button" class="danger-btn" onclick="deleteItem('${p.id}')">Delete</button>
                    </div>
                  </td>
                </tr>
              `;
            }).join("") || '<tr><td colspan="10" class="empty-state">No matching stock records found.</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// 2. Stock Ledger
function renderStockLedgerReport() {
  const f = reportFilters.ledger;
  const types = ["All", "Purchase", "Stock Outward", "Transfer in", "Transfer out", "Adjustment", "Wastage", "Consumption"];
  const q = f.search.toLowerCase().trim();

  const filtered = state.transactions.filter(t => {
    const matchProd = f.product === "All" || t.product === f.product;
    const matchType = f.type === "All" || t.type === f.type;
    const matchStore = f.store === "All" || (t.store || state.currentStore) === f.store;
    let matchRange = true;
    if (f.range === "Today") matchRange = dateKey(t.date) === today;
    else if (f.range === "This Month") matchRange = monthKey(t.date) === monthKey(today);
    else if (f.range === "Last Month") {
      const prevDate = new Date();
      prevDate.setMonth(prevDate.getMonth() - 1);
      matchRange = monthKey(t.date) === monthKey(prevDate.toISOString());
    }
    const matchSearch = !q || t.product.toLowerCase().includes(q) || (t.ref || "").toLowerCase().includes(q) || (t.user || "").toLowerCase().includes(q) || (t.remarks || "").toLowerCase().includes(q);
    return matchProd && matchType && matchStore && matchRange && matchSearch;
  });

  const inwardQty = filtered.filter(t => t.qty > 0).reduce((a, t) => a + t.qty, 0);
  const outwardQty = filtered.filter(t => t.qty < 0).reduce((a, t) => a + Math.abs(t.qty), 0);
  const inwardVal = filtered.filter(t => t.qty > 0).reduce((a, t) => a + t.qty * (t.cost || 0), 0);
  const outwardVal = filtered.filter(t => t.qty < 0).reduce((a, t) => a + Math.abs(t.qty) * (t.cost || 0), 0);

  return `
    <div class="metrics">
      ${metric("Transactions", filtered.length, "📑", "blue", "Matching ledger rows")}
      ${metric("Total Inward", `+${numberValue(inwardQty)}`, "↗", "green", money(inwardVal) + " received")}
      ${metric("Total Outward", `-${numberValue(outwardQty)}`, "↘", "amber", money(outwardVal) + " disbursed")}
      ${metric("Net Movement", numberValue(inwardQty - outwardQty), "▣", "neutral", "Net change in units")}
    </div>

    <div class="filterbar">
      <select onchange="reportFilters.ledger.product=this.value;showView('reports')">
        <option value="All">All Items (Catalog)</option>
        ${state.products.map(p => `<option value="${escapeQuote(p.name)}" ${f.product === p.name ? 'selected' : ''}>${p.name}</option>`).join("")}
      </select>
      <select onchange="reportFilters.ledger.type=this.value;showView('reports')">
        ${types.map(t => `<option value="${escapeQuote(t)}" ${f.type === t ? 'selected' : ''}>${t === 'All' ? 'All Movement Types' : t}</option>`).join("")}
      </select>
      <select onchange="reportFilters.ledger.range=this.value;showView('reports')">
        <option ${f.range === 'This Month' ? 'selected' : ''}>This Month</option>
        <option ${f.range === 'Today' ? 'selected' : ''}>Today</option>
        <option ${f.range === 'Last Month' ? 'selected' : ''}>Last Month</option>
        <option ${f.range === 'All Time' ? 'selected' : ''}>All Time</option>
      </select>
      <select onchange="reportFilters.ledger.store=this.value;showView('reports')">
        <option value="All">All Warehouses</option>
        ${state.stores.map(s => `<option value="${escapeQuote(s[0])}" ${f.store === s[0] ? 'selected' : ''}>${s[0]}</option>`).join("")}
      </select>
      <input placeholder="Search ref, user, remarks..." value="${escapeHtml(f.search)}" oninput="reportFilters.ledger.search=this.value;showView('reports')">
    </div>

    <div class="panel">
      <div class="panel-head">
        <span class="panel-title">Stock Movement Ledger</span>
        <span class="pill">${filtered.length} audited records</span>
      </div>
      <div class="view-table">
        <table class="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Voucher Ref</th>
              <th>Type</th>
              <th>Product</th>
              <th>Warehouse</th>
              <th>Party / Dept</th>
              <th style="text-align:right;">Inward (+)</th>
              <th style="text-align:right;">Outward (-)</th>
              <th style="text-align:right;">Rate</th>
              <th style="text-align:right;">Total Value</th>
              <th>User</th>
              <th style="text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map(t => `
              <tr>
                <td>${fmtDate(t.date)}</td>
                <td><b>${t.ref || '—'}</b></td>
                <td><span class="tag ${t.type.toLowerCase().replace(/\s+/g,'-')}">${t.type}</span></td>
                <td><b>${t.product}</b></td>
                <td>${t.store || state.currentStore}</td>
                <td>${t.department || '—'}</td>
                <td class="num-cell" style="color:var(--green-text);font-weight:600;">${t.qty > 0 ? `+${numberValue(t.qty)}` : '—'}</td>
                <td class="num-cell" style="color:var(--red);font-weight:600;">${t.qty < 0 ? `-${numberValue(Math.abs(t.qty))}` : '—'}</td>
                <td class="num-cell">${money(t.cost || 0)}</td>
                <td class="num-cell"><b>${money(Math.abs(t.qty) * (t.cost || 0))}</b></td>
                <td>${t.user || 'System'}</td>
                <td style="text-align:right;">
                  <div class="table-action-btns">
                    <button type="button" class="secondary" onclick="editTransaction('${t.id || t.ref}')">Edit</button>
                    <button type="button" class="danger-btn" onclick="deleteTransaction('${t.id || t.ref}')">Delete</button>
                  </div>
                </td>
              </tr>
            `).join("") || '<tr><td colspan="12" class="empty-state">No matching transactions found in this period.</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// 3. Purchase Report
function renderPurchaseReport() {
  const f = reportFilters.purchase;
  const q = f.search.toLowerCase().trim();

  const filtered = state.purchases.filter(p => {
    const matchSup = f.supplier === "All" || p.supplier === f.supplier;
    const matchStore = f.store === "All" || (p.store || state.currentStore) === f.store;
    let matchRange = true;
    if (f.range === "Today") matchRange = dateKey(p.date) === today;
    else if (f.range === "This Month") matchRange = monthKey(p.date) === monthKey(today);
    else if (f.range === "Last Month") {
      const prevDate = new Date();
      prevDate.setMonth(prevDate.getMonth() - 1);
      matchRange = monthKey(p.date) === monthKey(prevDate.toISOString());
    }
    const matchSearch = !q || p.supplier.toLowerCase().includes(q) || p.no.toLowerCase().includes(q) || (p.reference || "").toLowerCase().includes(q);
    return matchSup && matchStore && matchRange && matchSearch;
  });

  const totalValue = filtered.reduce((a, b) => a + Number(b.total || 0), 0);
  const totalUnits = filtered.reduce((a, b) => a + (b.items || []).reduce((sub, it) => sub + Number(it.qty || 0), 0), 0);

  // Top supplier by spend
  const supplierSpend = {};
  filtered.forEach(p => {
    supplierSpend[p.supplier] = (supplierSpend[p.supplier] || 0) + Number(p.total || 0);
  });
  let topSupplier = "—";
  let topSupplierSpend = 0;
  Object.entries(supplierSpend).forEach(([sup, amt]) => {
    if (amt > topSupplierSpend) { topSupplierSpend = amt; topSupplier = sup; }
  });

  return `
    <div class="metrics">
      ${metric("Purchases Value", money(totalValue), "↗", "green", "Total billed spend")}
      ${metric("GRN Invoices", filtered.length, "🛒", "blue", "Goods received vouchers")}
      ${metric("Units Received", numberValue(totalUnits), "▣", "green", "Total product quantity")}
      ${metric("Top Supplier", topSupplier, "🚚", "neutral", topSupplierSpend > 0 ? money(topSupplierSpend) + " spend" : "No orders")}
    </div>

    <div class="filterbar">
      <select onchange="reportFilters.purchase.supplier=this.value;showView('reports')">
        <option value="All">All Suppliers</option>
        ${state.suppliers.map(s => `<option value="${escapeQuote(s[0])}" ${f.supplier === s[0] ? 'selected' : ''}>${s[0]}</option>`).join("")}
      </select>
      <select onchange="reportFilters.purchase.range=this.value;showView('reports')">
        <option ${f.range === 'This Month' ? 'selected' : ''}>This Month</option>
        <option ${f.range === 'Today' ? 'selected' : ''}>Today</option>
        <option ${f.range === 'Last Month' ? 'selected' : ''}>Last Month</option>
        <option ${f.range === 'All Time' ? 'selected' : ''}>All Time</option>
      </select>
      <select onchange="reportFilters.purchase.store=this.value;showView('reports')">
        <option value="All">All Warehouses</option>
        ${state.stores.map(s => `<option value="${escapeQuote(s[0])}" ${f.store === s[0] ? 'selected' : ''}>${s[0]}</option>`).join("")}
      </select>
      <input placeholder="Search GRN, invoice ref, supplier..." value="${escapeHtml(f.search)}" oninput="reportFilters.purchase.search=this.value;showView('reports')">
    </div>

    <div class="panel">
      <div class="panel-head">
        <span class="panel-title">Goods Receipt Notes (GRN Purchase Vouchers)</span>
        <span class="pill">${filtered.length} vouchers</span>
      </div>
      <div class="view-table">
        <table class="table">
          <thead>
            <tr>
              <th>GRN #</th>
              <th>Date</th>
              <th>Supplier</th>
              <th>Invoice Ref</th>
              <th>Warehouse</th>
              <th>Items Received</th>
              <th style="text-align:right;">Total Qty</th>
              <th style="text-align:right;">Invoice Total</th>
              <th>User</th>
              <th style="text-align:right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map(p => {
              const itemsCount = p.items?.length || 0;
              const unitsCount = (p.items || []).reduce((acc, it) => acc + Number(it.qty || 0), 0);
              const summaryText = (p.items || []).map(it => `${it.product} (${it.qty} ${it.unit})`).slice(0, 2).join(", ") + (itemsCount > 2 ? ` +${itemsCount - 2} more` : "");
              return `
                <tr>
                  <td><b>${p.no}</b></td>
                  <td>${fmtDate(p.date)}</td>
                  <td><b>${p.supplier}</b></td>
                  <td>${p.reference || '—'}</td>
                  <td>${p.store || state.currentStore}</td>
                  <td><span style="font-size:12px;color:#334155;">${escapeHtml(summaryText)}</span></td>
                  <td class="num-cell"><b>${numberValue(unitsCount)}</b></td>
                  <td class="num-cell" style="font-weight:700;color:var(--navy);">${money(p.total)}</td>
                  <td>${p.user || 'Akash Kumar'}</td>
                  <td style="text-align:right;">
                    <div class="table-action-btns">
                      <button type="button" class="secondary" onclick="viewVoucher('${p.no}', true)">View</button>
                      <button type="button" class="secondary" onclick="editPurchaseVoucher('${p.no}')">Edit</button>
                      <button type="button" class="danger-btn" onclick="deletePurchaseVoucher('${p.no}')">Delete</button>
                    </div>
                  </td>
                </tr>
              `;
            }).join("") || '<tr><td colspan="10" class="empty-state">No purchase vouchers found for this filter.</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// 4. Outward Report
function renderOutwardReport() {
  const f = reportFilters.outward;
  const q = f.search.toLowerCase().trim();

  const filtered = state.outwards.filter(o => {
    const matchDept = f.department === "All" || o.department === f.department;
    const matchStore = f.store === "All" || (o.store || state.currentStore) === f.store;
    let matchRange = true;
    if (f.range === "Today") matchRange = dateKey(o.date) === today;
    else if (f.range === "This Month") matchRange = monthKey(o.date) === monthKey(today);
    else if (f.range === "Last Month") {
      const prevDate = new Date();
      prevDate.setMonth(prevDate.getMonth() - 1);
      matchRange = monthKey(o.date) === monthKey(prevDate.toISOString());
    }
    const matchSearch = !q || (o.department || "").toLowerCase().includes(q) || o.no.toLowerCase().includes(q) || (o.issuedTo || "").toLowerCase().includes(q) || (o.remarks || "").toLowerCase().includes(q);
    return matchDept && matchStore && matchRange && matchSearch;
  });

  const totalValue = filtered.reduce((a, b) => a + Number(b.total || 0), 0);
  const totalUnits = filtered.reduce((a, b) => a + (b.items || []).reduce((sub, it) => sub + Number(it.qty || 0), 0), 0);

  // Leading department
  const deptSpend = {};
  filtered.forEach(o => {
    deptSpend[o.department] = (deptSpend[o.department] || 0) + Number(o.total || 0);
  });
  let topDept = "—";
  let topDeptVal = 0;
  Object.entries(deptSpend).forEach(([dept, amt]) => {
    if (amt > topDeptVal) { topDeptVal = amt; topDept = dept; }
  });

  return `
    <div class="metrics">
      ${metric("Outward Valuation", money(totalValue), "↘", "amber", "Value of stock issued")}
      ${metric("Units Issued", numberValue(totalUnits), "▣", "blue", "Total physical units")}
      ${metric("Issue Vouchers", filtered.length, "📤", "neutral", "Dispatched requisitions")}
      ${metric("Top Department", topDept, "🏢", "neutral", topDeptVal > 0 ? money(topDeptVal) + " issued" : "None")}
    </div>

    <div class="filterbar">
      <select onchange="reportFilters.outward.department=this.value;showView('reports')">
        <option value="All">All Departments</option>
        ${departments.map(d => `<option value="${escapeQuote(d)}" ${f.department === d ? 'selected' : ''}>${d}</option>`).join("")}
      </select>
      <select onchange="reportFilters.outward.range=this.value;showView('reports')">
        <option ${f.range === 'This Month' ? 'selected' : ''}>This Month</option>
        <option ${f.range === 'Today' ? 'selected' : ''}>Today</option>
        <option ${f.range === 'Last Month' ? 'selected' : ''}>Last Month</option>
        <option ${f.range === 'All Time' ? 'selected' : ''}>All Time</option>
      </select>
      <select onchange="reportFilters.outward.store=this.value;showView('reports')">
        <option value="All">All Warehouses</option>
        ${state.stores.map(s => `<option value="${escapeQuote(s[0])}" ${f.store === s[0] ? 'selected' : ''}>${s[0]}</option>`).join("")}
      </select>
      <input placeholder="Search voucher #, chef, department..." value="${escapeHtml(f.search)}" oninput="reportFilters.outward.search=this.value;showView('reports')">
    </div>

    <div class="panel">
      <div class="panel-head">
        <span class="panel-title">Stock Outward & Kitchen Issue Register</span>
        <span class="pill">${filtered.length} issues</span>
      </div>
      <div class="view-table">
        <table class="table">
          <thead>
            <tr>
              <th>Voucher #</th>
              <th>Date</th>
              <th>Department</th>
              <th>Issued To</th>
              <th>Warehouse</th>
              <th>Items Issued</th>
              <th style="text-align:right;">Total Qty</th>
              <th style="text-align:right;">Valuation</th>
              <th>Remarks</th>
              <th style="text-align:right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map(o => {
              const itemsCount = o.items?.length || 0;
              const unitsCount = (o.items || []).reduce((acc, it) => acc + Number(it.qty || 0), 0);
              const summaryText = (o.items || []).map(it => `${it.product} (${it.qty} ${it.unit})`).slice(0, 2).join(", ") + (itemsCount > 2 ? ` +${itemsCount - 2} more` : "");
              return `
                <tr>
                  <td><b>${o.no}</b></td>
                  <td>${fmtDate(o.date)}</td>
                  <td><span class="tag">${o.department}</span></td>
                  <td><b>${o.issuedTo || 'Staff'}</b></td>
                  <td>${o.store || state.currentStore}</td>
                  <td><span style="font-size:12px;color:#334155;">${escapeHtml(summaryText)}</span></td>
                  <td class="num-cell"><b>${numberValue(unitsCount)}</b></td>
                  <td class="num-cell" style="font-weight:700;color:var(--amber);">${money(o.total)}</td>
                  <td style="font-size:12px;color:#64748b;">${escapeHtml(o.remarks || '—')}</td>
                  <td style="text-align:right;">
                    <div class="table-action-btns">
                      <button type="button" class="secondary" onclick="viewVoucher('${o.no}', false)">View</button>
                      <button type="button" class="secondary" onclick="editOutwardVoucher('${o.no}')">Edit</button>
                      <button type="button" class="danger-btn" onclick="deleteOutwardVoucher('${o.no}')">Delete</button>
                    </div>
                  </td>
                </tr>
              `;
            }).join("") || '<tr><td colspan="10" class="empty-state">No outward vouchers found for this filter.</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// 5. Department Consumption Report
function renderDepartmentConsumptionReport() {
  const f = reportFilters.consumption;

  // Filter outwards
  const filteredOutwards = state.outwards.filter(o => {
    const matchDept = f.department === "All" || o.department === f.department;
    const matchStore = f.store === "All" || (o.store || state.currentStore) === f.store;
    let matchRange = true;
    if (f.range === "Today") matchRange = dateKey(o.date) === today;
    else if (f.range === "This Month") matchRange = monthKey(o.date) === monthKey(today);
    else if (f.range === "Last Month") {
      const prevDate = new Date();
      prevDate.setMonth(prevDate.getMonth() - 1);
      matchRange = monthKey(o.date) === monthKey(prevDate.toISOString());
    }
    return matchDept && matchStore && matchRange;
  });

  // Calculate department aggregates
  const deptStats = {};
  const itemizedByDept = {};
  let overallConsumptionVal = 0;

  filteredOutwards.forEach(o => {
    const dept = o.department || "Kitchen";
    deptStats[dept] = deptStats[dept] || { name: dept, requisitions: 0, units: 0, cost: 0, items: {} };
    deptStats[dept].requisitions += 1;

    (o.items || []).forEach(it => {
      const q = Number(it.qty || 0);
      const c = Number(it.amount || (q * (it.rate || 0)));
      deptStats[dept].units += q;
      deptStats[dept].cost += c;
      overallConsumptionVal += c;
      deptStats[dept].items[it.product] = (deptStats[dept].items[it.product] || 0) + c;

      // Itemized
      itemizedByDept[dept] = itemizedByDept[dept] || [];
      const existing = itemizedByDept[dept].find(x => x.product === it.product);
      if (existing) {
        existing.qty += q;
        existing.cost += c;
      } else {
        itemizedByDept[dept].push({ product: it.product, unit: it.unit || 'unit', qty: q, cost: c, rate: it.rate || 0 });
      }
    });
  });

  const sortedDepts = Object.values(deptStats).sort((a, b) => b.cost - a.cost);
  const leadingDept = sortedDepts[0]?.name || "—";
  const totalRequisitions = filteredOutwards.length;

  return `
    <div class="metrics">
      ${metric("Kitchen Consumption", money(overallConsumptionVal), "🏢", "amber", "Total ingredient consumption value")}
      ${metric("Issue Batches", totalRequisitions, "📤", "blue", "Requisitions processed")}
      ${metric("Leading Department", leadingDept, "👨‍🍳", "neutral", sortedDepts[0] ? money(sortedDepts[0].cost) + " consumed" : "None")}
      ${metric("Active Departments", sortedDepts.length, "🏷", "green", "Requesting kitchen sections")}
    </div>

    <div class="filterbar">
      <select onchange="reportFilters.consumption.range=this.value;showView('reports')">
        <option ${f.range === 'This Month' ? 'selected' : ''}>This Month</option>
        <option ${f.range === 'Today' ? 'selected' : ''}>Today</option>
        <option ${f.range === 'Last Month' ? 'selected' : ''}>Last Month</option>
        <option ${f.range === 'All Time' ? 'selected' : ''}>All Time</option>
      </select>
      <select onchange="reportFilters.consumption.department=this.value;showView('reports')">
        <option value="All">All Departments</option>
        ${departments.map(d => `<option value="${escapeQuote(d)}" ${f.department === d ? 'selected' : ''}>${d}</option>`).join("")}
      </select>
      <select onchange="reportFilters.consumption.store=this.value;showView('reports')">
        <option value="All">All Warehouses</option>
        ${state.stores.map(s => `<option value="${escapeQuote(s[0])}" ${f.store === s[0] ? 'selected' : ''}>${s[0]}</option>`).join("")}
      </select>
    </div>

    <div class="panel" style="margin-bottom:24px;">
      <div class="panel-head">
        <span class="panel-title">Department Consumption Summary</span>
        <span class="pill">${sortedDepts.length} departments</span>
      </div>
      <div class="view-table">
        <table class="table">
          <thead>
            <tr>
              <th>Department</th>
              <th>Requisitions</th>
              <th style="text-align:right;">Physical Units</th>
              <th style="text-align:right;">Total Cost</th>
              <th style="min-width:180px;">Share of Kitchen Usage</th>
              <th>Top Consumed Ingredient</th>
            </tr>
          </thead>
          <tbody>
            ${sortedDepts.map(d => {
              const pct = overallConsumptionVal > 0 ? Math.round((d.cost / overallConsumptionVal) * 100) : 0;
              let topItem = "—";
              let topItemVal = 0;
              Object.entries(d.items || {}).forEach(([pName, pVal]) => {
                if (pVal > topItemVal) { topItemVal = pVal; topItem = pName; }
              });
              return `
                <tr>
                  <td><b>${d.name}</b></td>
                  <td>${d.requisitions} vouchers</td>
                  <td class="num-cell"><b>${numberValue(d.units)}</b></td>
                  <td class="num-cell" style="font-weight:700;color:var(--amber);">${money(d.cost)}</td>
                  <td>
                    <div style="display:flex;align-items:center;gap:8px;">
                      <div class="consumption-bar-track" style="flex:1;">
                        <div class="consumption-bar-fill" style="width:${pct}%;"></div>
                      </div>
                      <span style="font-size:11px;font-weight:700;min-width:32px;">${pct}%</span>
                    </div>
                  </td>
                  <td><b>${topItem}</b> <span style="font-size:11px;color:#64748b;">(${money(topItemVal)})</span></td>
                </tr>
              `;
            }).join("") || '<tr><td colspan="6" class="empty-state">No departmental consumption recorded in this period.</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>

    <div class="panel">
      <div class="panel-head">
        <span class="panel-title">Itemized Ingredient Usage by Department</span>
      </div>
      <div class="view-table">
        <table class="table" style="font-size:12px;">
          <thead>
            <tr>
              <th>Department</th>
              <th>Ingredient Item</th>
              <th style="text-align:right;">Total Consumed</th>
              <th style="text-align:right;">Avg Cost Rate</th>
              <th style="text-align:right;">Subtotal Usage Value</th>
            </tr>
          </thead>
          <tbody>
            ${Object.entries(itemizedByDept).flatMap(([deptName, items]) => 
              items.map(it => `
                <tr>
                  <td><b>${deptName}</b></td>
                  <td>${it.product}</td>
                  <td class="num-cell"><b>${numberValue(it.qty)}</b> ${it.unit}</td>
                  <td class="num-cell">${money(it.rate)}</td>
                  <td class="num-cell" style="font-weight:700;">${money(it.cost)}</td>
                </tr>
              `)
            ).join("") || '<tr><td colspan="5" class="empty-state">No itemized consumption details found.</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// 6. Dead Stock Report
function renderDeadStockReport() {
  const f = reportFilters.deadstock;
  const categories = [...new Set(state.products.map(p => p.category || "General"))];
  const q = f.search.toLowerCase().trim();
  const thresholdDays = Number(f.days) || 30;

  // Calculate inactivity for each product
  const deadStockItems = [];
  const now = Date.now();

  state.products.forEach(p => {
    if (p.stock <= 0) return; // only evaluate products with capital on hand

    // find most recent outward or consumption movement
    const recentTx = state.transactions
      .filter(t => t.product === p.name && (t.type === "Stock Outward" || t.type === "Consumption" || t.qty < 0))
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

    let daysInactive = 999;
    let lastDateStr = "Never Issued";

    if (recentTx && recentTx.date) {
      const txTime = new Date(recentTx.date).getTime();
      if (!isNaN(txTime)) {
        daysInactive = Math.max(0, Math.floor((now - txTime) / 86400000));
        lastDateStr = fmtDate(recentTx.date);
      }
    }

    if (daysInactive >= thresholdDays) {
      const frozenCapital = Number(p.stock || 0) * Number(p.cost || 0);

      let rec = "Chef's Daily Special Feature";
      if (daysInactive >= 90) rec = "Vendor Return or Stock Liquidation";
      else if (daysInactive >= 60) rec = "Transfer to High-Volume Warehouse or Markdown";
      else if (daysInactive >= 30) rec = "Kitchen Recipe Promotion / Menu Feature";

      deadStockItems.push({
        ...p,
        daysInactive,
        lastDateStr,
        frozenCapital,
        recommendation: rec
      });
    }
  });

  // Filter
  const filtered = deadStockItems.filter(p => {
    const matchCat = f.category === "All" || (p.category || "General") === f.category;
    const matchStore = f.store === "All" || (p.store || state.currentStore) === f.store;
    const matchSearch = !q || p.name.toLowerCase().includes(q) || (p.category || "").toLowerCase().includes(q);
    return matchCat && matchStore && matchSearch;
  }).sort((a, b) => b.frozenCapital - a.frozenCapital);

  const totalFrozenVal = filtered.reduce((sum, p) => sum + p.frozenCapital, 0);
  const totalFloorValuation = state.products.reduce((sum, p) => sum + (Number(p.stock || 0) * Number(p.cost || 0)), 0);
  const tiedUpPct = totalFloorValuation > 0 ? Math.round((totalFrozenVal / totalFloorValuation) * 100) : 0;
  const oldestItem = filtered.sort((a, b) => b.daysInactive - a.daysInactive)[0];

  return `
    <div class="metrics">
      ${metric("Trapped Capital", money(totalFrozenVal), "⏳", totalFrozenVal > 0 ? "danger" : "green", "Frozen capital in dormant inventory")}
      ${metric("Dead Stock Items", filtered.length, "📦", filtered.length > 0 ? "amber" : "green", `Zero outward movement for ≥ ${thresholdDays} days`)}
      ${metric("Tied-Up %", `${tiedUpPct}%`, "📊", tiedUpPct > 15 ? "danger" : "neutral", "Percentage of total store valuation")}
      ${metric("Oldest Dormant Item", oldestItem ? oldestItem.name : "None", "⚠", "neutral", oldestItem ? `${oldestItem.daysInactive} days inactive` : "All items moving")}
    </div>

    <div class="filterbar">
      <select onchange="reportFilters.deadstock.days=Number(this.value);showView('reports')">
        <option value="30" ${thresholdDays === 30 ? 'selected' : ''}>30+ Days Inactive</option>
        <option value="60" ${thresholdDays === 60 ? 'selected' : ''}>60+ Days Inactive</option>
        <option value="90" ${thresholdDays === 90 ? 'selected' : ''}>90+ Days Inactive (Critical Dead Stock)</option>
        <option value="999" ${thresholdDays === 999 ? 'selected' : ''}>Never Issued / Zero Movement</option>
      </select>
      <select onchange="reportFilters.deadstock.category=this.value;showView('reports')">
        <option value="All">All Categories</option>
        ${categories.map(c => `<option value="${escapeQuote(c)}" ${f.category === c ? 'selected' : ''}>${c}</option>`).join("")}
      </select>
      <select onchange="reportFilters.deadstock.store=this.value;showView('reports')">
        <option value="All">All Warehouses</option>
        ${state.stores.map(s => `<option value="${escapeQuote(s[0])}" ${f.store === s[0] ? 'selected' : ''}>${s[0]}</option>`).join("")}
      </select>
      <input placeholder="Search dormant item or category..." value="${escapeHtml(f.search)}" oninput="reportFilters.deadstock.search=this.value;showView('reports')">
    </div>

    <div class="panel">
      <div class="panel-head">
        <span class="panel-title">Dead Stock & Dormancy Audit</span>
        <span class="pill">${filtered.length} stagnant items</span>
      </div>
      <div class="view-table">
        <table class="table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Category</th>
              <th>Warehouse</th>
              <th style="text-align:right;">Stock On Hand</th>
              <th style="text-align:right;">Cost Rate</th>
              <th style="text-align:right;">Trapped Capital</th>
              <th>Last Movement</th>
              <th>Inactivity</th>
              <th>Recommended Action</th>
              <th style="text-align:right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map(p => {
              const isDanger = p.daysInactive >= 90;
              return `
                <tr>
                  <td>
                    <span style="margin-right:6px;">${p.icon || '📦'}</span>
                    <b>${p.name}</b>
                  </td>
                  <td>${p.category || 'General'}</td>
                  <td>${p.store || state.currentStore}</td>
                  <td class="num-cell"><b>${numberValue(p.stock)}</b> ${p.unit}</td>
                  <td class="num-cell">${money(p.cost || 0)}</td>
                  <td class="num-cell" style="font-weight:800;color:var(--red);">${money(p.frozenCapital)}</td>
                  <td style="font-size:12px;color:#64748b;">${p.lastDateStr}</td>
                  <td>
                    <span class="dormancy-badge ${isDanger ? 'danger' : 'warning'}">
                      ${p.daysInactive >= 999 ? 'Zero Movement' : `${p.daysInactive} days dormant`}
                    </span>
                  </td>
                  <td><span class="tag" style="background:#f1f5f9;color:#334155;font-weight:600;">${p.recommendation}</span></td>
                  <td style="text-align:right;">
                    <button class="secondary" style="padding:4px 8px;font-size:11px;" onclick="newOutwardDraft([{product:p.name,qty:Math.min(p.stock, 5),rate:p.cost}])">Issue Out</button>
                  </td>
                </tr>
              `;
            }).join("") || '<tr><td colspan="10" class="empty-state">No dead stock identified! All inventory items have active movement within the selected period.</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// Universal Report CSV Exporters
function exportCurrentReportCsv() {
  if (currentReportType === "stock") exportStockReportCsv();
  else if (currentReportType === "ledger") exportStockLedgerCsv();
  else if (currentReportType === "purchase") exportPurchaseReportCsv();
  else if (currentReportType === "outward") exportOutwardReportCsv();
  else if (currentReportType === "consumption") exportDepartmentConsumptionCsv();
  else if (currentReportType === "deadstock") exportDeadStockCsv();
}

function exportStockReportCsv() {
  const rows = [
    ["Item", "Category", "Warehouse", "Stock on Hand", "Unit", "Min Level", "Reorder Level", "Cost Rate", "Stock Valuation", "Status"],
    ...state.products.map(p => [
      p.name,
      p.category || "General",
      p.store || state.currentStore,
      p.stock,
      p.unit,
      p.min || 0,
      p.reorder || ((p.min || 0) + 5),
      (p.cost || 0).toFixed(2),
      ((p.stock || 0) * (p.cost || 0)).toFixed(2),
      p.stock <= 0 ? "Out of Stock" : p.stock <= (p.min || 10) ? "Low Stock" : "Healthy"
    ])
  ];
  downloadCsv("stocksense-stock-report.csv", rows);
}

function exportStockLedgerCsv() {
  const rows = [
    ["Date", "Voucher Ref", "Type", "Product", "Warehouse", "Department", "Quantity", "Rate", "Total Value", "User"],
    ...state.transactions.map(t => [
      t.date,
      t.ref || "",
      t.type,
      t.product,
      t.store || state.currentStore,
      t.department || "",
      t.qty,
      (t.cost || 0).toFixed(2),
      (Math.abs(t.qty) * (t.cost || 0)).toFixed(2),
      t.user || ""
    ])
  ];
  downloadCsv("stocksense-stock-ledger.csv", rows);
}

function exportReportData() {
  exportStockLedgerCsv();
}

function exportPurchaseReportCsv() {
  const rows = [
    ["GRN No", "Date", "Supplier", "Reference", "Warehouse", "Items Count", "Total Value", "User"],
    ...state.purchases.map(p => [
      p.no,
      p.date,
      p.supplier,
      p.reference || "",
      p.store || state.currentStore,
      p.items?.length || 0,
      (p.total || 0).toFixed(2),
      p.user || ""
    ])
  ];
  downloadCsv("stocksense-purchase-report.csv", rows);
}

function exportOutwardReportCsv() {
  const rows = [
    ["Voucher No", "Date", "Department", "Issued To", "Warehouse", "Items Count", "Total Value", "Remarks"],
    ...state.outwards.map(o => [
      o.no,
      o.date,
      o.department,
      o.issuedTo || "",
      o.store || state.currentStore,
      o.items?.length || 0,
      (o.total || 0).toFixed(2),
      o.remarks || ""
    ])
  ];
  downloadCsv("stocksense-outward-report.csv", rows);
}

function exportDepartmentConsumptionCsv() {
  const deptStats = {};
  state.outwards.forEach(o => {
    const dept = o.department || "Kitchen";
    deptStats[dept] = deptStats[dept] || { requisitions: 0, units: 0, cost: 0 };
    deptStats[dept].requisitions += 1;
    (o.items || []).forEach(it => {
      deptStats[dept].units += Number(it.qty || 0);
      deptStats[dept].cost += Number(it.amount || (it.qty * (it.rate || 0)));
    });
  });

  const rows = [
    ["Department", "Requisitions Count", "Total Units Consumed", "Total Valuation Spend"],
    ...Object.entries(deptStats).map(([dept, data]) => [dept, data.requisitions, data.units.toFixed(2), data.cost.toFixed(2)])
  ];
  downloadCsv("stocksense-department-consumption.csv", rows);
}

function exportDeadStockCsv() {
  const now = Date.now();
  const rows = [
    ["Item", "Category", "Warehouse", "Stock on Hand", "Unit", "Cost Rate", "Trapped Capital", "Days Inactive", "Recommendation"],
    ...state.products.filter(p => p.stock > 0).map(p => {
      const recentTx = state.transactions
        .filter(t => t.product === p.name && (t.type === "Stock Outward" || t.type === "Consumption" || t.qty < 0))
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
      const days = recentTx ? Math.max(0, Math.floor((now - new Date(recentTx.date).getTime()) / 86400000)) : 999;
      return [
        p.name,
        p.category || "General",
        p.store || state.currentStore,
        p.stock,
        p.unit,
        (p.cost || 0).toFixed(2),
        ((p.stock || 0) * (p.cost || 0)).toFixed(2),
        days >= 999 ? "Never Issued" : days,
        days >= 90 ? "Vendor Return or Stock Liquidation" : days >= 60 ? "Transfer or Markdown" : "Menu Feature"
      ];
    })
  ];
  downloadCsv("stocksense-dead-stock-report.csv", rows);
}

// STORES / WAREHOUSES
function storesScreen() {
  return layout(
    "Stores & Locations",
    "Manage kitchen outlets, cold rooms and dry storage warehouses.",
    `<button class="primary" onclick="openModal('store')">＋ Add Location</button>`,
    `
      <div class="panel">
        <div class="panel-head">
          <span class="panel-title">Warehouse Directory (${state.stores.length})</span>
        </div>
        <div class="view-table">
          <table class="table">
            <thead>
              <tr>
                <th>Location Name</th>
                <th>Description</th>
                <th>Manager</th>
                <th>Products Stored</th>
                <th style="text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${state.stores.map((s, idx) => {
                const count = state.products.filter(p => p.store === s[0]).length;
                return `
                  <tr>
                    <td><b>${s[0]}</b></td>
                    <td>${s[1] || "—"}</td>
                    <td>${s[2] || "Akash Kumar"}</td>
                    <td>${count} items</td>
                    <td style="text-align:right;">
                      <button class="secondary" style="padding:4px 8px;font-size:11px;" onclick="openModal('store', ${idx})">Edit</button>
                      <button class="danger-btn" style="padding:4px 8px;font-size:11px;" onclick="deleteStore(${idx})">Delete</button>
                    </td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `
  );
}

function deleteStore(idx) {
  const s = state.stores[idx];
  if (!s) return;
  if (state.stores.length <= 1) { toast("At least one warehouse is required"); return; }
  confirmModal("Delete warehouse " + s[0] + "?", () => {
    state.stores.splice(idx, 1);
    if (state.currentStore === s[0]) state.currentStore = state.stores[0][0];
    save();
    showView("stores");
    toast("Warehouse removed");
  });
}

// DEPARTMENTS
function departmentsScreen() {
  const totalItems = state.products.length;
  const totalOutwardVal = state.outwards.reduce((a, o) => a + (Number(o.total) || 0), 0);

  return layout(
    "Departments",
    "Add, modify or organize cost centers, production units and stock issue destinations.",
    `<button class="primary" onclick="openDepartmentModal()">＋ Add Department</button>`,
    `
      <div class="metrics-grid" style="margin-bottom:20px;">
        <div class="card metric-card">
          <div class="metric-top">
            <span class="metric-title">Configured Units</span>
            <span class="metric-badge green">Active</span>
          </div>
          <div class="metric-value">${state.departments.length}</div>
          <div class="metric-sub">Operational cost centers</div>
        </div>
        <div class="card metric-card">
          <div class="metric-top">
            <span class="metric-title">Catalog Assignment</span>
            <span class="metric-badge blue">Products</span>
          </div>
          <div class="metric-value">${totalItems}</div>
          <div class="metric-sub">Items mapped to departments</div>
        </div>
        <div class="card metric-card">
          <div class="metric-top">
            <span class="metric-title">Total Consumption</span>
            <span class="metric-badge purple">Outward Value</span>
          </div>
          <div class="metric-value">${money(totalOutwardVal)}</div>
          <div class="metric-sub">Issued across all departments</div>
        </div>
      </div>

      <div class="panel">
        <div class="panel-head">
          <span class="panel-title">Department Directory (${state.departments.length})</span>
          <span class="pill">${state.departments.length} units</span>
        </div>
        <div class="view-table">
          <table class="table">
            <thead>
              <tr>
                <th style="width:40px;text-align:center;">#</th>
                <th>Department Name</th>
                <th>Assigned Items</th>
                <th>Outward Vouchers</th>
                <th>Consumption Value</th>
                <th style="text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${state.departments.map((dept, idx) => {
                const prodCount = state.products.filter(p => p.department === dept).length;
                const deptOutwards = state.outwards.filter(o => o.department === dept);
                const outCount = deptOutwards.length;
                const outVal = deptOutwards.reduce((a, o) => a + (Number(o.total) || 0), 0);

                return `
                  <tr>
                    <td style="text-align:center;color:#64748b;">${idx + 1}</td>
                    <td>
                      <div style="display:flex;align-items:center;gap:8px;">
                        <span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:6px;background:#f1f5f9;color:#334155;font-weight:700;font-size:12px;">🏢</span>
                        <b style="font-size:14px;color:var(--text);">${escapeHtml(dept)}</b>
                      </div>
                    </td>
                    <td><span class="pill" style="font-weight:600;">${prodCount} items</span></td>
                    <td>${outCount} vouchers</td>
                    <td><b style="color:var(--blue);font-family:'JetBrains Mono';">${money(outVal)}</b></td>
                    <td style="text-align:right;">
                      <button class="secondary" style="padding:4px 10px;font-size:12px;" onclick="openDepartmentModal('${escapeQuote(dept)}')">Modify / Rename</button>
                      <button class="danger-btn" style="padding:4px 10px;font-size:12px;margin-left:4px;" onclick="deleteDepartment('${escapeQuote(dept)}')">Remove</button>
                    </td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `
  );
}

function openDepartmentModal(deptName) {
  const isEdit = Boolean(deptName);
  openInAppModal(isEdit ? "Modify Department" : "Add New Department", `
    <div class="form-grid">
      <div class="form-field full">
        <label>Department / Unit Name *</label>
        <input id="m-dept-name" value="${isEdit ? escapeHtml(deptName) : ''}" placeholder="e.g. Kitchen, Bakery, Banquets, Service Bar" autocomplete="off">
      </div>
      ${isEdit ? `
        <div class="form-field full" style="font-size:12px;color:#64748b;background:#f8fafc;padding:10px 12px;border-radius:6px;border:1px solid #e2e8f0;">
          ℹ Modifying this department will automatically update linked inventory items, stock outward notes, and ledger transactions.
        </div>
      ` : ''}
    </div>
  `, `
    <button class="secondary" onclick="closeModal()">Cancel</button>
    <button class="primary" onclick="submitDepartment(${isEdit ? `'${escapeQuote(deptName)}'` : 'null'})">${isEdit ? "Save Changes" : "Create Department"}</button>
  `);

  setTimeout(() => {
    const input = document.getElementById("m-dept-name");
    if (input) {
      input.focus();
      input.select();
    }
  }, 40);
}

function submitDepartment(oldName) {
  const input = document.getElementById("m-dept-name");
  const newName = (input?.value || "").trim();

  if (!newName) {
    toast("Department name cannot be empty");
    return;
  }

  if (!Array.isArray(state.departments)) state.departments = [];

  const exists = state.departments.some(d => d.toLowerCase() === newName.toLowerCase() && d.toLowerCase() !== (oldName || "").toLowerCase());
  if (exists) {
    toast("A department with this name already exists");
    return;
  }

  if (oldName) {
    const idx = state.departments.indexOf(oldName);
    if (idx !== -1) {
      state.departments[idx] = newName;
    } else {
      state.departments.push(newName);
    }

    state.products.forEach(p => {
      if (p.department === oldName) p.department = newName;
    });
    state.outwards.forEach(o => {
      if (o.department === oldName) o.department = newName;
    });
    state.transactions.forEach(t => {
      if (t.department === oldName) t.department = newName;
    });
    if (outwardDraft.department === oldName) outwardDraft.department = newName;

    departments = state.departments;
    save();
    closeModal();
    toast(`Department renamed to "${newName}"`);
    showView("departments");
  } else {
    state.departments.push(newName);
    departments = state.departments;
    save();
    closeModal();
    toast(`Department "${newName}" added successfully`);
    showView("departments");
  }
}

function deleteDepartment(deptName) {
  if (!state.departments || state.departments.length <= 1) {
    toast("At least one department must remain active");
    return;
  }

  const prodCount = state.products.filter(p => p.department === deptName).length;
  const outCount = state.outwards.filter(o => o.department === deptName).length;

  const fallback = state.departments.find(d => d !== deptName) || "Other";
  const extraWarning = (prodCount > 0 || outCount > 0)
    ? ` (${prodCount} items and ${outCount} vouchers will be reassigned to "${fallback}")`
    : "";

  confirmModal(`Remove department "${deptName}"?${extraWarning}`, () => {
    state.departments = state.departments.filter(d => d !== deptName);
    departments = state.departments;

    state.products.forEach(p => {
      if (p.department === deptName) p.department = fallback;
    });
    state.outwards.forEach(o => {
      if (o.department === deptName) o.department = fallback;
    });
    state.transactions.forEach(t => {
      if (t.department === deptName) t.department = fallback;
    });
    if (outwardDraft.department === deptName) outwardDraft.department = fallback;

    save();
    toast(`Department "${deptName}" removed`);
    showView("departments");
  });
}

// USERS
function usersScreen() {
  return layout(
    "Team & Security",
    "User roles, permissions and active session switching.",
    `<button class="primary" onclick="openModal('user')">＋ Add Team Member</button>`,
    `
      <div class="panel">
        <div class="panel-head">
          <span class="panel-title">Active Team Members (${state.users.length})</span>
        </div>
        <div class="view-table">
          <table class="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Location Access</th>
                <th>Status</th>
                <th style="text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${state.users.map((u, idx) => {
                const currentRole = state.currentUserRole || state.users.find(x => x.name === state.currentUser)?.role;
                const isCurrent = u.name === state.currentUser && (!currentRole || u.role === currentRole);
                return `
                <tr>
                  <td>
                    <div class="product-cell">
                      <div class="avatar">${escapeHtml(u.name.split(" ").map(w=>w[0]).join("").slice(0,2))}</div>
                      <div>
                        <b>${escapeHtml(u.name)}</b>
                        ${isCurrent ? '<span class="tag" style="margin-left:6px;background:#dbeafe;color:#1e40af;border:1px solid #bfdbfe;">Active Profile</span>' : ''}
                      </div>
                    </div>
                  </td>
                  <td><span class="status ok" style="font-weight:600;">${escapeHtml(u.role)}</span></td>
                  <td>${escapeHtml(u.location || "All locations")}</td>
                  <td><span class="status ok">${u.active ? "Active" : "Inactive"}</span></td>
                  <td style="text-align:right;">
                    <div class="table-action-btns">
                      <button type="button" class="secondary" onclick="openModal('user', ${idx})">Edit</button>
                      ${!isCurrent ? `<button type="button" class="secondary" onclick="switchUser('${escapeQuote(u.name)}', '${escapeQuote(u.role)}')">Switch</button>` : ''}
                      ${!isCurrent ? `<button type="button" class="danger-btn" onclick="deleteUser(${idx})">Delete</button>` : ''}
                    </div>
                  </td>
                </tr>
              `;}).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `
  );
}

function deleteUser(idx) {
  const u = state.users[idx];
  if (!u) return;
  const currentRole = state.currentUserRole || state.users.find(x => x.name === state.currentUser)?.role;
  const isCurrent = u.name === state.currentUser && (!currentRole || u.role === currentRole);
  if (isCurrent) { toast("Cannot delete current logged-in user profile"); return; }
  confirmModal(`Permanently delete team member "${u.name}" (${u.role})?`, () => {
    state.users.splice(idx, 1);
    save();
    toast(`User "${u.name}" deleted`);
    showView("users");
  });
}

// SETTINGS & TABBED MANAGEMENT
let currentSettingsTab = "general";

function switchSettingsTab(tab) {
  currentSettingsTab = tab;
  showView("settings");
}

function renderSuppliersSettingsContent() {
  const totalDue = state.suppliers.reduce((a, s) => a + (Number(s[4]) || 0), 0);
  const avgLead = state.suppliers.length ? Math.round(state.suppliers.reduce((a, s) => a + (Number(s[3]) || 0), 0) / state.suppliers.length) : 0;

  return `
    <div class="metrics-grid" style="margin-bottom:20px;">
      <div class="card metric-card">
        <div class="metric-top">
          <span class="metric-title">Approved Vendors</span>
          <span class="metric-badge green">Active</span>
        </div>
        <div class="metric-value">${state.suppliers.length}</div>
        <div class="metric-sub">Registered food & supply partners</div>
      </div>
      <div class="card metric-card">
        <div class="metric-top">
          <span class="metric-title">Outstanding Payables</span>
          <span class="metric-badge ${totalDue > 0 ? 'red' : 'green'}">Balance</span>
        </div>
        <div class="metric-value">${money(totalDue)}</div>
        <div class="metric-sub">Pending vendor payments</div>
      </div>
      <div class="card metric-card">
        <div class="metric-top">
          <span class="metric-title">Average Lead Time</span>
          <span class="metric-badge blue">Procurement</span>
        </div>
        <div class="metric-value">${avgLead} <span style="font-size:14px;color:var(--muted);font-weight:500;">days</span></div>
        <div class="metric-sub">Delivery cycle turnaround</div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-head" style="justify-content:space-between;align-items:center;">
        <div style="display:flex;align-items:center;gap:10px;">
          <span class="panel-title">Approved Vendors (${state.suppliers.length})</span>
          <span class="pill">${state.suppliers.length} vendors</span>
        </div>
        <button class="primary" style="padding:6px 14px;font-size:12px;" onclick="openModal('supplier')">＋ Add Supplier</button>
      </div>
      <div class="view-table">
        <table class="table">
          <thead>
            <tr>
              <th>Supplier Name</th>
              <th>Category</th>
              <th>Contact / Email</th>
              <th>Lead Time</th>
              <th class="num-cell">Outstanding Balance</th>
              <th>Status</th>
              <th style="text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${state.suppliers.map((s, idx) => `
              <tr>
                <td>
                  <div style="display:flex;align-items:center;gap:8px;">
                    <span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:6px;background:#f1f5f9;font-size:13px;">🚚</span>
                    <b style="font-size:13px;color:var(--text);">${escapeHtml(s[0])}</b>
                  </div>
                </td>
                <td><span class="pill">${escapeHtml(s[1] || "General")}</span></td>
                <td>${escapeHtml(s[2] || "—")}</td>
                <td>${s[3]} days</td>
                <td class="num-cell" style="font-weight:700;">${money(s[4] || 0)}</td>
                <td><span class="status ok">Active</span></td>
                <td style="text-align:right;">
                  <div class="table-action-btns">
                    <button type="button" class="secondary" onclick="openModal('supplier', ${idx})">Edit</button>
                    <button type="button" class="secondary" onclick="newPurchaseOrder([{product:state.products[0]?.name||'',qty:10,rate:10}])">Create PO</button>
                    <button type="button" class="danger-btn" onclick="deleteSupplier(${idx})">Delete</button>
                  </div>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderDepartmentsSettingsContent() {
  const totalItems = state.products.length;
  const totalOutwardVal = state.outwards.reduce((a, o) => a + (Number(o.total) || 0), 0);

  return `
    <div class="metrics-grid" style="margin-bottom:20px;">
      <div class="card metric-card">
        <div class="metric-top">
          <span class="metric-title">Configured Units</span>
          <span class="metric-badge green">Active</span>
        </div>
        <div class="metric-value">${state.departments.length}</div>
        <div class="metric-sub">Operational cost centers</div>
      </div>
      <div class="card metric-card">
        <div class="metric-top">
          <span class="metric-title">Catalog Assignment</span>
          <span class="metric-badge blue">Products</span>
        </div>
        <div class="metric-value">${totalItems}</div>
        <div class="metric-sub">Items mapped to departments</div>
      </div>
      <div class="card metric-card">
        <div class="metric-top">
          <span class="metric-title">Total Consumption</span>
          <span class="metric-badge purple">Outward Value</span>
        </div>
        <div class="metric-value">${money(totalOutwardVal)}</div>
        <div class="metric-sub">Issued across all departments</div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-head" style="justify-content:space-between;align-items:center;">
        <div style="display:flex;align-items:center;gap:10px;">
          <span class="panel-title">Department Directory (${state.departments.length})</span>
          <span class="pill">${state.departments.length} units</span>
        </div>
        <button class="primary" style="padding:6px 14px;font-size:12px;" onclick="openDepartmentModal()">＋ Add Department</button>
      </div>
      <div class="view-table">
        <table class="table">
          <thead>
            <tr>
              <th style="width:40px;text-align:center;">#</th>
              <th>Department Name</th>
              <th>Assigned Items</th>
              <th>Outward Vouchers</th>
              <th>Consumption Value</th>
              <th style="text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${state.departments.map((dept, idx) => {
              const prodCount = state.products.filter(p => p.department === dept).length;
              const deptOutwards = state.outwards.filter(o => o.department === dept);
              const outCount = deptOutwards.length;
              const outVal = deptOutwards.reduce((a, o) => a + (Number(o.total) || 0), 0);

              return `
                <tr>
                  <td style="text-align:center;color:#64748b;">${idx + 1}</td>
                  <td>
                    <div style="display:flex;align-items:center;gap:8px;">
                      <span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:6px;background:#f1f5f9;color:#334155;font-weight:700;font-size:12px;">🏢</span>
                      <b style="font-size:14px;color:var(--text);">${escapeHtml(dept)}</b>
                    </div>
                  </td>
                  <td><span class="pill" style="font-weight:600;">${prodCount} items</span></td>
                  <td>${outCount} vouchers</td>
                  <td><b style="color:var(--blue);font-family:'JetBrains Mono';">${money(outVal)}</b></td>
                  <td style="text-align:right;">
                    <button class="secondary" style="padding:4px 10px;font-size:12px;" onclick="openDepartmentModal('${escapeQuote(dept)}')">Modify / Rename</button>
                    <button class="danger-btn" style="padding:4px 10px;font-size:12px;margin-left:4px;" onclick="deleteDepartment('${escapeQuote(dept)}')">Remove</button>
                  </td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// SETTINGS SCREEN
function settingsScreen() {
  const g = state.settings.general || {};
  const inv = state.settings.inventory || {};
  const t = state.settings.transactions || {};

  let mainBody = "";

  if (currentSettingsTab === "suppliers") {
    mainBody = renderSuppliersSettingsContent();
  } else if (currentSettingsTab === "departments") {
    mainBody = renderDepartmentsSettingsContent();
  } else if (currentSettingsTab === "inventory") {
    mainBody = `
      <div id="set-inventory" class="settings-section">
        <h2>Inventory & Calculations</h2>
        <p>Numeric precision, rounding strategy, and stock threshold controls.</p>
        <div class="settings-grid">
          <label class="setting-field">
            <span>Display Decimals</span>
            <select onchange="state.settings.decimals=Number(this.value);save();showView('settings')">
              <option value="0" ${state.settings.decimals === 0 ? 'selected' : ''}>0 decimals (Whole units)</option>
              <option value="1" ${state.settings.decimals === 1 ? 'selected' : ''}>1 decimal (0.1)</option>
              <option value="2" ${state.settings.decimals === 2 ? 'selected' : ''}>2 decimals (0.01)</option>
              <option value="3" ${state.settings.decimals === 3 ? 'selected' : ''}>3 decimals (0.001)</option>
            </select>
          </label>
          <label class="setting-field">
            <span>Rounding Method</span>
            <select onchange="state.settings.rounding=this.value;save();showView('settings');toast('Rounding method updated to ' + this.value)">
              <option value="normal" ${(state.settings.rounding || 'normal') === 'normal' ? 'selected' : ''}>Normal (Half-Up / Standard Math)</option>
              <option value="none" ${state.settings.rounding === 'none' ? 'selected' : ''}>None (Exact decimals)</option>
              <option value="up" ${state.settings.rounding === 'up' ? 'selected' : ''}>Round Up (Ceiling / Math.ceil)</option>
              <option value="down" ${state.settings.rounding === 'down' ? 'selected' : ''}>Round Down (Floor / Math.floor)</option>
              <option value="nearest-05" ${state.settings.rounding === 'nearest-05' ? 'selected' : ''}>Nearest 0.05 (Cash / Nickel Rounding)</option>
              <option value="nearest-50" ${state.settings.rounding === 'nearest-50' ? 'selected' : ''}>Nearest 0.50 (Half-Unit Rounding)</option>
              <option value="nearest-integer" ${state.settings.rounding === 'nearest-integer' ? 'selected' : ''}>Nearest Integer (Whole Currency Unit)</option>
              <option value="bankers" ${state.settings.rounding === 'bankers' ? 'selected' : ''}>Banker's Rounding (Round Half to Even)</option>
            </select>
          </label>
          <label class="setting-field">
            <span>Default Low-Stock Threshold</span>
            <input type="number" value="${inv.lowThreshold || 10}" onchange="setField('inventory.lowThreshold', Number(this.value));save()">
          </label>
          <label class="setting-field">
            <span>Live Rounding Preview</span>
            <div class="rounding-preview-box">
              <div>Preview for 12.3456: <b style="color:var(--blue);">${money(12.3456)}</b></div>
              <div style="margin-top:2px;">Preview for 9.875: <b style="color:var(--green-text);">${money(9.875)}</b></div>
            </div>
          </label>
        </div>
        <label class="setting-toggle" style="margin-top:16px;">
          <div>
            <b>Allow Negative Stock Issues</b>
            <small>Permit outward vouchers even when stock drops below 0</small>
          </div>
          <input type="checkbox" ${inv.negative ? 'checked' : ''} onchange="setField('inventory.negative', this.checked);save()">
          <i></i>
        </label>
      </div>
    `;
  } else if (currentSettingsTab === "vouchers") {
    mainBody = `
      <div id="set-vouchers" class="settings-section">
        <h2>Transaction Numbering</h2>
        <p>Prefix formats for automatic voucher sequencing.</p>
        <div class="settings-grid">
          <label class="setting-field">
            <span>Purchase GRN Prefix</span>
            <input value="${t.purchasePrefix || 'GRN-'}" onchange="setField('transactions.purchasePrefix', this.value);save()">
          </label>
          <label class="setting-field">
            <span>Stock Outward Prefix</span>
            <input value="${t.outwardPrefix || 'OUT-'}" onchange="setField('transactions.outwardPrefix', this.value);save()">
          </label>
          <label class="setting-field">
            <span>Physical Stock Audit Prefix</span>
            <input value="${t.auditPrefix || 'AUD-'}" onchange="setField('transactions.auditPrefix', this.value);save()">
          </label>
        </div>
      </div>
    `;
  } else if (currentSettingsTab === "backup") {
    mainBody = `
      <div id="set-backup" class="settings-section">
        <h2>Backup & Local Storage</h2>
        <p>Export your full StockSense database to JSON or reset store records.</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px;">
          <button class="secondary" onclick="exportFullBackup()">Download Backup JSON</button>
          <button class="danger-btn" onclick="resetDefaults()">Reset to Defaults</button>
        </div>
      </div>
    `;
  } else {
    // Default: General
    mainBody = `
      <div id="set-general" class="settings-section">
        <h2>Business & General Profile</h2>
        <p>Identity displayed on Goods Receipt, Outward vouchers and Stock count sheets.</p>
        <div class="settings-grid">
          <label class="setting-field">
            <span>Business Name</span>
            <input value="${escapeHtml(g.company || 'Hotel Rajmudra')}" onchange="setField('general.company', this.value);save()">
          </label>
          <label class="setting-field">
            <span>Primary Active Warehouse</span>
            <select onchange="state.currentStore=this.value;setField('general.location', this.value);save();updateSidebarMeta();toast('Active warehouse set to ' + this.value)">
              ${state.stores.map(s => `
                <option value="${s[0]}" ${s[0] === state.currentStore ? 'selected' : ''}>${s[0]}</option>
              `).join("")}
            </select>
          </label>
          <label class="setting-field">
            <span>Website</span>
            <input value="${escapeHtml(g.website || 'http://www.hotelrajmudra.com/')}" placeholder="http://www.hotelrajmudra.com/" onchange="setField('general.website', this.value);save()">
          </label>
          <label class="setting-field">
            <span>Phone</span>
            <input value="${escapeHtml(g.phone || '9507543741')}" onchange="setField('general.phone', this.value);save()">
          </label>
          <label class="setting-field">
            <span>Email Address</span>
            <input value="${escapeHtml(g.email || 'RajmudraStores@gmail.com')}" onchange="setField('general.email', this.value);save()">
          </label>
          <label class="setting-field" style="grid-column: 1 / -1;">
            <span>Address</span>
            <input value="${escapeHtml(g.address || 'Marunji Gaon Marunji, Road, near Rajmudra Petrol Pump, Hinjawadi, Pune, Maharashtra 411057')}" onchange="setField('general.address', this.value);save()">
          </label>
        </div>
      </div>
    `;
  }

  return layout(
    "Settings & Configuration",
    "Configure company identity, vendor accounts, department centers and inventory behaviors.",
    `<button class="primary" onclick="save();toast('Settings updated')">Save Changes</button>`,
    `
      <div class="settings-layout">
        <div class="settings-nav">
          <button class="${currentSettingsTab === 'general' ? 'active' : ''}" onclick="switchSettingsTab('general')">🏢 General Profile</button>
          <button class="${currentSettingsTab === 'suppliers' ? 'active' : ''}" onclick="switchSettingsTab('suppliers')">🚚 Supplier Management</button>
          <button class="${currentSettingsTab === 'departments' ? 'active' : ''}" onclick="switchSettingsTab('departments')">🏢 Department Management</button>
          <button class="${currentSettingsTab === 'inventory' ? 'active' : ''}" onclick="switchSettingsTab('inventory')">⚖ Inventory Rules</button>
          <button class="${currentSettingsTab === 'vouchers' ? 'active' : ''}" onclick="switchSettingsTab('vouchers')">📑 Voucher Prefixes</button>
          <button class="${currentSettingsTab === 'backup' ? 'active' : ''}" onclick="switchSettingsTab('backup')">💾 Backup & Data</button>
        </div>

        <div class="settings-content">
          ${mainBody}
        </div>
      </div>
    `
  );
}

// PHYSICAL STOCK AUDIT & VERIFICATION MODULE
let physicalStockState = {
  store: "Main Store",
  category: "all",
  search: "",
  counts: {}, // productId -> numeric count
  reasons: {}, // productId -> string reason
  showHistory: false
};

function changePhysicalStockStore(store) {
  physicalStockState.store = store;
  physicalStockState.counts = {};
  physicalStockState.reasons = {};
  showView("physical-stock");
}

function changePhysicalStockCategory(cat) {
  physicalStockState.category = cat;
  showView("physical-stock");
}

function searchPhysicalStock(val) {
  physicalStockState.search = val;
  showView("physical-stock");
}

function togglePhysicalStockHistory() {
  physicalStockState.showHistory = !physicalStockState.showHistory;
  showView("physical-stock");
}

function setPhysicalCountToBook(id) {
  const p = state.products.find(x => x.id === id);
  if (!p) return;
  const input = document.getElementById(`phys-input-${id}`);
  if (input) {
    input.value = p.stock || 0;
  }
  onPhysicalInputChange(id, p.stock || 0);
}

function fillAllWithSystemStock() {
  const store = physicalStockState.store || state.currentStore || "Main Store";
  state.products.filter(p => p.store === store).forEach(p => {
    physicalStockState.counts[p.id] = Number(p.stock || 0);
  });
  toast(`Matched all floor counts to book stock for ${store}`);
  showView("physical-stock");
}

function clearAllPhysicalStockInputs() {
  physicalStockState.counts = {};
  physicalStockState.reasons = {};
  toast("Cleared all physical count inputs");
  showView("physical-stock");
}

function onPhysicalInputChange(id, val) {
  const p = state.products.find(x => x.id === id);
  if (!p) return;

  const raw = String(val).trim();
  if (raw === "") {
    delete physicalStockState.counts[id];
  } else {
    physicalStockState.counts[id] = Number(raw);
  }

  const bookStock = Number(p.stock || 0);
  const isEntered = physicalStockState.counts[id] !== undefined && physicalStockState.counts[id] !== null;
  const physVal = isEntered ? Number(physicalStockState.counts[id]) : bookStock;
  const diff = isEntered ? (physVal - bookStock) : 0;
  const rate = Number(p.cost || p.purchaseCost || 0);
  const vVal = diff * rate;

  const badgeEl = document.getElementById(`var-badge-${id}`);
  const valEl = document.getElementById(`var-val-${id}`);
  const inputEl = document.getElementById(`phys-input-${id}`);

  if (badgeEl) {
    let badgeClass = "match";
    let badgeText = "Match (" + numberValue(bookStock) + " " + p.unit + ")";
    if (isEntered) {
      if (diff > 0.0001) {
        badgeClass = "surplus";
        badgeText = "+" + numberValue(diff) + " " + p.unit + " (Surplus)";
      } else if (diff < -0.0001) {
        badgeClass = "deficit";
        badgeText = numberValue(diff) + " " + p.unit + " (Deficit)";
      } else {
        badgeClass = "match";
        badgeText = "0.00 " + p.unit + " (Match)";
      }
    }
    badgeEl.className = `variance-badge ${badgeClass}`;
    badgeEl.textContent = badgeText;
  }

  if (valEl) {
    valEl.textContent = diff !== 0 ? ((diff > 0 ? '+' : '') + money(vVal)) : '₹0';
    valEl.style.color = diff > 0 ? 'var(--green-text)' : diff < 0 ? 'var(--red)' : '#64748b';
  }

  if (inputEl) {
    inputEl.style.borderColor = isEntered && Math.abs(diff) > 0.0001 ? (diff > 0 ? '#86efac' : '#fca5a5') : '#cbd5e1';
    inputEl.style.backgroundColor = isEntered && Math.abs(diff) > 0.0001 ? (diff > 0 ? '#f0fdf4' : '#fef2f2') : '#fff';
  }

  // Update top-level metrics without re-rendering the whole page (smooth typing!)
  updatePhysicalStockLiveMetrics();
}

function updatePhysicalStockLiveMetrics() {
  const store = physicalStockState.store || state.currentStore || "Main Store";
  const storeProducts = state.products.filter(p => p.store === store);

  let totalAudited = 0;
  let surplusCount = 0;
  let deficitCount = 0;
  let surplusVal = 0;
  let deficitVal = 0;
  let netVal = 0;

  storeProducts.forEach(p => {
    if (physicalStockState.counts[p.id] !== undefined && physicalStockState.counts[p.id] !== null) {
      totalAudited++;
      const current = Number(p.stock || 0);
      const phys = Number(physicalStockState.counts[p.id]);
      const diff = phys - current;
      const rate = Number(p.cost || p.purchaseCost || 0);
      const vVal = diff * rate;
      if (diff > 0.0001) {
        surplusCount++;
        surplusVal += vVal;
        netVal += vVal;
      } else if (diff < -0.0001) {
        deficitCount++;
        deficitVal += Math.abs(vVal);
        netVal += vVal;
      }
    }
  });

  const progEl = document.getElementById("phys-metric-progress");
  if (progEl) progEl.textContent = `${totalAudited} / ${storeProducts.length}`;
  const discEl = document.getElementById("phys-metric-discrepancies");
  if (discEl) {
    discEl.textContent = `${surplusCount + deficitCount} items`;
    discEl.style.color = (surplusCount + deficitCount) > 0 ? 'var(--red)' : 'var(--green-text)';
  }
  const surpEl = document.getElementById("phys-metric-surplus");
  if (surpEl) surpEl.textContent = `+${money(surplusVal)}`;
  const defEl = document.getElementById("phys-metric-deficit");
  if (defEl) defEl.textContent = money(deficitVal);
  const netEl = document.getElementById("phys-metric-net");
  if (netEl) {
    netEl.textContent = `${netVal > 0 ? '+' : ''}${money(netVal)}`;
    netEl.style.color = netVal >= 0 ? 'var(--green-text)' : 'var(--red)';
  }
}

function reconcilePhysicalStock() {
  const store = physicalStockState.store || state.currentStore || "Main Store";
  const storeProducts = state.products.filter(p => p.store === store);

  const adjustments = [];
  let surplusVal = 0;
  let deficitVal = 0;
  let totalNetVal = 0;

  storeProducts.forEach(p => {
    if (physicalStockState.counts[p.id] !== undefined && physicalStockState.counts[p.id] !== null) {
      const physical = Number(physicalStockState.counts[p.id]);
      const current = Number(p.stock || 0);
      const diff = physical - current;
      const rate = Number(p.cost || p.purchaseCost || 0);
      const varianceVal = diff * rate;

      if (Math.abs(diff) > 0.0001) {
        adjustments.push({
          product: p,
          oldStock: current,
          newStock: physical,
          diff: diff,
          rate: rate,
          value: varianceVal,
          reason: physicalStockState.reasons[p.id] || "Physical stock count verification"
        });
        if (diff > 0) surplusVal += varianceVal;
        else deficitVal += Math.abs(varianceVal);
        totalNetVal += varianceVal;
      }
    }
  });

  if (adjustments.length === 0) {
    toast("No stock variances detected to reconcile.");
    return;
  }

  openInAppModal("Confirm Stock Reconciliation", `
    <div style="text-align:left;">
      <p style="margin-bottom:12px;font-size:14px;color:#334155;">
        You are about to reconcile <b>${adjustments.length} item(s)</b> in <b>${store}</b>:
      </p>
      <div style="background:#f8fafc;padding:14px;border-radius:8px;border:1px solid #e2e8f0;font-size:13px;display:flex;flex-direction:column;gap:8px;">
        <div style="display:flex;justify-content:space-between;">
          <span style="color:#64748b;">Surplus additions (+stock):</span>
          <b style="color:var(--green-text);">+${money(surplusVal)}</b>
        </div>
        <div style="display:flex;justify-content:space-between;">
          <span style="color:#64748b;">Deficit write-offs (-loss):</span>
          <b style="color:var(--red);">${money(deficitVal)}</b>
        </div>
        <div style="display:flex;justify-content:space-between;border-top:1px solid #e2e8f0;padding-top:8px;">
          <span style="font-weight:700;color:#0f172a;">Net inventory adjustment:</span>
          <b style="font-weight:700;color:${totalNetVal >= 0 ? 'var(--green-text)' : 'var(--red)'};">${(totalNetVal > 0 ? '+' : '') + money(totalNetVal)}</b>
        </div>
      </div>
      <div style="margin-top:12px;font-size:12px;color:#64748b;">
        ℹ Updating will write verified physical counts directly into the database, record detailed transaction adjustments in the Stock Ledger, and log an audit voucher.
      </div>
    </div>
  `, `
    <button class="secondary" onclick="closeModal()">Cancel</button>
    <button class="primary" onclick="executePhysicalStockReconciliation()">Confirm & Update Stock</button>
  `);
}

function executePhysicalStockReconciliation() {
  const store = physicalStockState.store || state.currentStore || "Main Store";
  const storeProducts = state.products.filter(p => p.store === store);

  const adjustments = [];
  let surplusVal = 0;
  let deficitVal = 0;
  let totalNetVal = 0;

  storeProducts.forEach(p => {
    if (physicalStockState.counts[p.id] !== undefined && physicalStockState.counts[p.id] !== null) {
      const physical = Number(physicalStockState.counts[p.id]);
      const current = Number(p.stock || 0);
      const diff = physical - current;
      const rate = Number(p.cost || p.purchaseCost || 0);
      const varianceVal = diff * rate;

      if (Math.abs(diff) > 0.0001) {
        adjustments.push({
          product: p,
          oldStock: current,
          newStock: physical,
          diff: diff,
          rate: rate,
          value: varianceVal,
          reason: physicalStockState.reasons[p.id] || "Physical stock count verification"
        });
        if (diff > 0) surplusVal += varianceVal;
        else deficitVal += Math.abs(varianceVal);
        totalNetVal += varianceVal;
      }
    }
  });

  if (adjustments.length === 0) {
    closeModal();
    toast("No stock variances detected.");
    return;
  }

  const prefix = state.settings.transactions?.auditPrefix || "AUD-";
  const auditId = `${prefix}${String((state.stockAudits || []).length + 101).padStart(5, "0")}`;
  const now = new Date().toISOString();

  adjustments.forEach(adj => {
    // 1. Update product stock on hand
    adj.product.stock = Number(adj.newStock.toFixed(state.settings.decimals !== undefined ? state.settings.decimals : 2));

    // 2. Add Stock Ledger adjustment record
    const tx = {
      id: "TX-" + String(state.transactions.length + 1050),
      date: now,
      type: "Stock Adjustment",
      product: adj.product.name,
      store: store,
      qty: Number(adj.diff.toFixed(state.settings.decimals !== undefined ? state.settings.decimals : 2)),
      cost: adj.rate,
      user: state.currentUser,
      ref: auditId,
      remarks: adj.reason
    };
    state.transactions.unshift(tx);
  });

  // 3. Save stock audit voucher log
  if (!Array.isArray(state.stockAudits)) state.stockAudits = [];
  state.stockAudits.unshift({
    id: auditId,
    date: now,
    store: store,
    user: state.currentUser,
    itemCount: storeProducts.length,
    adjustedCount: adjustments.length,
    surplusVal: surplusVal,
    deficitVal: deficitVal,
    netVal: totalNetVal,
    adjustments: adjustments.map(a => ({
      product: a.product.name,
      unit: a.product.unit,
      oldStock: a.oldStock,
      newStock: a.newStock,
      diff: a.diff,
      rate: a.rate,
      value: a.value,
      reason: a.reason
    }))
  });

  save();
  closeModal();
  physicalStockState.counts = {};
  physicalStockState.reasons = {};
  toast(`Physical stock updated successfully (${adjustments.length} items reconciled)`);
  showView("physical-stock");
}

function physicalStockScreen() {
  const store = physicalStockState.store || state.currentStore || "Main Store";
  physicalStockState.store = store;

  if (physicalStockState.showHistory) {
    return renderPhysicalStockHistoryView();
  }

  let items = state.products.filter(p => p.store === store);
  if (physicalStockState.category && physicalStockState.category !== "all") {
    items = items.filter(p => p.category === physicalStockState.category);
  }
  if (physicalStockState.search) {
    const q = physicalStockState.search.toLowerCase().trim();
    items = items.filter(p => 
      p.name.toLowerCase().includes(q) || 
      (p.sku && p.sku.toLowerCase().includes(q)) ||
      (p.barcode && p.barcode.toLowerCase().includes(q))
    );
  }

  const categories = [...new Set(state.products.filter(p => p.store === store).map(p => p.category).filter(Boolean))];

  let totalAudited = 0;
  let surplusCount = 0;
  let deficitCount = 0;
  let surplusVal = 0;
  let deficitVal = 0;
  let netVal = 0;

  state.products.filter(p => p.store === store).forEach(p => {
    if (physicalStockState.counts[p.id] !== undefined && physicalStockState.counts[p.id] !== null) {
      totalAudited++;
      const current = Number(p.stock || 0);
      const phys = Number(physicalStockState.counts[p.id]);
      const diff = phys - current;
      const rate = Number(p.cost || p.purchaseCost || 0);
      const vVal = diff * rate;
      if (diff > 0.0001) {
        surplusCount++;
        surplusVal += vVal;
        netVal += vVal;
      } else if (diff < -0.0001) {
        deficitCount++;
        deficitVal += Math.abs(vVal);
        netVal += vVal;
      }
    }
  });

  const hasAdjustments = (surplusCount + deficitCount) > 0;

  return layout(
    "Physical Stock Audit & Count",
    "Enter real verified physical stock on hand to reconcile book inventory, calculate variances and maintain balance precision.",
    `
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button class="secondary" onclick="togglePhysicalStockHistory()">📋 Audit History (${(state.stockAudits || []).length})</button>
        <button class="secondary" onclick="printPhysicalStockSheet()">🖨 Print Count Sheet</button>
        <button class="secondary" onclick="fillAllWithSystemStock()">↺ Match Book Stock</button>
        <button class="primary" onclick="reconcilePhysicalStock()" id="btn-reconcile-stock">
          ✓ Confirm & Update Stock
        </button>
      </div>
    `,
    `
      <div class="panel" style="margin-bottom:16px;padding:16px;">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:14px;">
          <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;">
            <label style="display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600;color:#334155;">
              <span>Warehouse:</span>
              <select style="padding:6px 12px;border:1px solid #cbd5e1;border-radius:6px;font-size:13px;font-weight:600;background:#fff;" onchange="changePhysicalStockStore(this.value)">
                ${state.stores.map(s => `
                  <option value="${s[0]}" ${s[0] === store ? 'selected' : ''}>${s[0]}</option>
                `).join("")}
              </select>
            </label>

            <label style="display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600;color:#334155;">
              <span>Category:</span>
              <select style="padding:6px 12px;border:1px solid #cbd5e1;border-radius:6px;font-size:13px;background:#fff;" onchange="changePhysicalStockCategory(this.value)">
                <option value="all" ${physicalStockState.category === 'all' ? 'selected' : ''}>All Categories</option>
                ${categories.map(c => `
                  <option value="${c}" ${c === physicalStockState.category ? 'selected' : ''}>${c}</option>
                `).join("")}
              </select>
            </label>
          </div>

          <div style="display:flex;align-items:center;gap:10px;flex-grow:1;max-width:360px;">
            <input type="text" placeholder="Search item name, SKU, or barcode..." value="${escapeHtml(physicalStockState.search)}" oninput="searchPhysicalStock(this.value)" style="width:100%;padding:7px 12px;font-size:13px;border:1px solid #cbd5e1;border-radius:6px;">
          </div>
        </div>
      </div>

      <div class="metrics-grid" style="margin-bottom:20px;">
        <div class="card metric-card">
          <div class="metric-top">
            <span class="metric-title">Stock Take Progress</span>
            <span class="metric-badge blue">Counted</span>
          </div>
          <div class="metric-value" id="phys-metric-progress">${totalAudited} / ${state.products.filter(p => p.store === store).length}</div>
          <div class="metric-sub">Items entered for ${store}</div>
        </div>

        <div class="card metric-card">
          <div class="metric-top">
            <span class="metric-title">Discrepancies Found</span>
            <span class="metric-badge ${hasAdjustments ? 'red' : 'green'}">Variances</span>
          </div>
          <div class="metric-value" id="phys-metric-discrepancies" style="color:${hasAdjustments ? 'var(--red)' : 'var(--green-text)'};">${surplusCount + deficitCount} items</div>
          <div class="metric-sub">${surplusCount} surplus, ${deficitCount} deficit</div>
        </div>

        <div class="card metric-card">
          <div class="metric-top">
            <span class="metric-title">Surplus Valuation</span>
            <span class="metric-badge green">+Stock</span>
          </div>
          <div class="metric-value" id="phys-metric-surplus" style="color:var(--green-text);">+${money(surplusVal)}</div>
          <div class="metric-sub">Physical exceeds recorded</div>
        </div>

        <div class="card metric-card">
          <div class="metric-top">
            <span class="metric-title">Deficit / Shrinkage</span>
            <span class="metric-badge red">-Loss</span>
          </div>
          <div class="metric-value" id="phys-metric-deficit" style="color:var(--red);">${money(deficitVal)}</div>
          <div class="metric-sub">Missing or unrecorded loss</div>
        </div>

        <div class="card metric-card">
          <div class="metric-top">
            <span class="metric-title">Net Financial Impact</span>
            <span class="metric-badge ${netVal >= 0 ? 'green' : 'red'}">Net Reconcile</span>
          </div>
          <div class="metric-value" id="phys-metric-net" style="color:${netVal >= 0 ? 'var(--green-text)' : 'var(--red)'};">${(netVal > 0 ? '+' : '') + money(netVal)}</div>
          <div class="metric-sub">Net stock balance adjustment</div>
        </div>
      </div>

      <div class="panel">
        <div class="panel-head" style="justify-content:space-between;align-items:center;">
          <div style="display:flex;align-items:center;gap:10px;">
            <span class="panel-title">Physical Count Sheet — ${store}</span>
            <span class="pill">${items.length} items shown</span>
          </div>
          <div style="font-size:12px;color:#64748b;">
            💡 Type actual floor count into the <b>Physical Count</b> field. Live variance updates automatically.
          </div>
        </div>

        <div class="view-table">
          <table class="table">
            <thead>
              <tr>
                <th style="width:36px;text-align:center;">#</th>
                <th>Item Details</th>
                <th>Category</th>
                <th class="num-cell" style="text-align:right;">Book (System) Stock</th>
                <th style="width:200px;text-align:center;">Actual Physical Stock</th>
                <th style="width:190px;text-align:center;">Variance (Qty)</th>
                <th class="num-cell" style="text-align:right;width:120px;">Variance Value</th>
                <th style="min-width:180px;">Variance Reason / Notes</th>
              </tr>
            </thead>
            <tbody>
              ${items.length === 0 ? `
                <tr>
                  <td colspan="8" style="text-align:center;padding:36px;color:#64748b;">
                    No inventory items found matching your filter criteria in <b>${store}</b>.
                  </td>
                </tr>
              ` : items.map((p, idx) => {
                const bookStock = Number(p.stock || 0);
                const isEntered = physicalStockState.counts[p.id] !== undefined && physicalStockState.counts[p.id] !== null;
                const physicalStock = isEntered ? Number(physicalStockState.counts[p.id]) : bookStock;
                const diff = isEntered ? (physicalStock - bookStock) : 0;
                const rate = Number(p.cost || p.purchaseCost || 0);
                const varianceVal = diff * rate;

                let badgeClass = "match";
                let badgeText = "Match (" + numberValue(bookStock) + " " + p.unit + ")";
                if (isEntered) {
                  if (diff > 0.0001) {
                    badgeClass = "surplus";
                    badgeText = "+" + numberValue(diff) + " " + p.unit + " (Surplus)";
                  } else if (diff < -0.0001) {
                    badgeClass = "deficit";
                    badgeText = numberValue(diff) + " " + p.unit + " (Deficit)";
                  } else {
                    badgeClass = "match";
                    badgeText = "0.00 " + p.unit + " (Match)";
                  }
                }

                const currentReason = physicalStockState.reasons[p.id] || "Physical Count Verification";

                return `
                  <tr id="phys-row-${p.id}">
                    <td style="text-align:center;color:#64748b;">${idx + 1}</td>
                    <td>
                      <div class="product-cell">
                        <span class="product-dot">${p.icon || '📦'}</span>
                        <div>
                          <b>${escapeHtml(p.name)}</b>
                          <div style="font-size:11px;color:#64748b;margin-top:2px;">
                            SKU: <b>${escapeHtml(p.sku || '—')}</b> | Rate: <b>${money(rate)}/${p.unit}</b>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td><span class="pill">${escapeHtml(p.category || 'General')}</span></td>
                    <td class="num-cell" style="font-size:14px;font-weight:700;color:var(--ink);">
                      ${numberValue(bookStock)} <span style="font-size:12px;font-weight:500;color:#64748b;">${p.unit}</span>
                    </td>
                    <td>
                      <div class="phys-input-wrap" style="display:flex;align-items:center;gap:6px;justify-content:center;">
                        <input 
                          type="number" 
                          step="any" 
                          min="0" 
                          id="phys-input-${p.id}"
                          value="${isEntered ? physicalStock : ''}" 
                          placeholder="${numberValue(bookStock)}" 
                          oninput="onPhysicalInputChange(${p.id}, this.value)"
                          style="width:110px;padding:6px 8px;font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:700;border:1.5px solid ${isEntered && Math.abs(diff) > 0.0001 ? (diff > 0 ? '#86efac' : '#fca5a5') : '#cbd5e1'};border-radius:6px;background:${isEntered && Math.abs(diff) > 0.0001 ? (diff > 0 ? '#f0fdf4' : '#fef2f2') : '#fff'};"
                        >
                        <span style="font-size:12px;font-weight:600;color:#64748b;">${p.unit}</span>
                        <button type="button" title="Set to book stock" onclick="setPhysicalCountToBook(${p.id})" style="border:1px solid #cbd5e1;background:#f8fafc;border-radius:4px;padding:4px 6px;font-size:11px;cursor:pointer;">↺</button>
                      </div>
                    </td>
                    <td style="text-align:center;">
                      <span id="var-badge-${p.id}" class="variance-badge ${badgeClass}">${badgeText}</span>
                    </td>
                    <td class="num-cell" id="var-val-${p.id}" style="font-weight:700;color:${diff > 0 ? 'var(--green-text)' : diff < 0 ? 'var(--red)' : '#64748b'};">
                      ${diff !== 0 ? (diff > 0 ? '+' : '') + money(varianceVal) : '₹0'}
                    </td>
                    <td>
                      <select 
                        id="phys-reason-${p.id}"
                        style="width:100%;padding:4px 8px;font-size:11.5px;border:1px solid #cbd5e1;border-radius:5px;background:#fff;"
                        onchange="physicalStockState.reasons[${p.id}] = this.value"
                      >
                        <option value="Physical Count Verification" ${currentReason === 'Physical Count Verification' ? 'selected' : ''}>Physical Count Verification</option>
                        <option value="Normal Kitchen Spoilage / Wastage" ${currentReason === 'Normal Kitchen Spoilage / Wastage' ? 'selected' : ''}>Normal Kitchen Spoilage / Wastage</option>
                        <option value="Portion / Prep Variance" ${currentReason === 'Portion / Prep Variance' ? 'selected' : ''}>Portion / Prep Variance</option>
                        <option value="Breakage / Handling Damage" ${currentReason === 'Breakage / Handling Damage' ? 'selected' : ''}>Breakage / Handling Damage</option>
                        <option value="Unrecorded Goods Receipt Correction" ${currentReason === 'Unrecorded Goods Receipt Correction' ? 'selected' : ''}>Unrecorded GRN Correction</option>
                        <option value="Inventory Initial Count Correction" ${currentReason === 'Inventory Initial Count Correction' ? 'selected' : ''}>Initial Count Correction</option>
                        <option value="Other Discrepancy" ${currentReason === 'Other Discrepancy' ? 'selected' : ''}>Other Discrepancy</option>
                      </select>
                    </td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>

        <div style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:16px 20px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;border-bottom-left-radius:8px;border-bottom-right-radius:8px;">
          <div style="font-size:13px;color:#475569;">
            Active warehouse: <b>${store}</b> | Total items with discrepancies: <b style="color:${hasAdjustments ? 'var(--red)' : 'var(--green-text)'};">${surplusCount + deficitCount}</b>
          </div>
          <div style="display:flex;gap:10px;align-items:center;">
            <button class="secondary" onclick="clearAllPhysicalStockInputs()">Clear Counts</button>
            <button class="primary" onclick="reconcilePhysicalStock()" style="padding:9px 20px;font-weight:700;">
              ✓ Reconcile & Update Physical Stock
            </button>
          </div>
        </div>
      </div>
    `
  );
}

function renderPhysicalStockHistoryView() {
  const audits = state.stockAudits || [];

  return layout(
    "Physical Stock Audit History",
    "Comprehensive log of historical physical counts, stock variance reconciliations and adjustments.",
    `
      <button class="secondary" onclick="togglePhysicalStockHistory()">← Back to Stock Count</button>
      <button class="secondary" onclick="exportAuditHistoryCsv()">Export CSV</button>
    `,
    `
      <div class="panel">
        <div class="panel-head">
          <span class="panel-title">Audit Reconciliation Logs (${audits.length})</span>
        </div>
        <div class="view-table">
          <table class="table">
            <thead>
              <tr>
                <th>Audit Ref</th>
                <th>Date & Time</th>
                <th>Warehouse</th>
                <th>Audited By</th>
                <th>Items Audited</th>
                <th>Reconciled Items</th>
                <th class="num-cell">Net Variance</th>
                <th>Status</th>
                <th style="text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${audits.length === 0 ? `
                <tr>
                  <td colspan="9" style="text-align:center;padding:36px;color:#64748b;">
                    No physical count audits recorded yet. Complete a physical stock count to generate reconciliation logs.
                  </td>
                </tr>
              ` : audits.map(a => `
                <tr>
                  <td><b>${a.id}</b></td>
                  <td>${fmtDate(a.date)}</td>
                  <td><b>${escapeHtml(a.store || 'Main Store')}</b></td>
                  <td>${escapeHtml(a.user || 'Akash Kumar')}</td>
                  <td>${a.itemCount || '—'}</td>
                  <td><span class="pill" style="font-weight:700;">${a.adjustedCount || (a.adjustments?.length || 0)} adjustments</span></td>
                  <td class="num-cell" style="font-weight:700;color:${(a.netVal || 0) >= 0 ? 'var(--green-text)' : 'var(--red)'};">
                    ${(a.netVal || 0) > 0 ? '+' : ''}${money(a.netVal || 0)}
                  </td>
                  <td><span class="status ok">Reconciled</span></td>
                  <td style="text-align:right;">
                    <button class="secondary" onclick="viewAuditDetails('${a.id}')">View Details</button>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `
  );
}

function viewAuditDetails(auditId) {
  const a = (state.stockAudits || []).find(x => x.id === auditId);
  if (!a) return;

  openInAppModal(`Audit Reconciliation — ${a.id}`, `
    <div style="font-size:13px;margin-bottom:14px;display:grid;grid-template-columns:1fr 1fr;gap:10px;background:#f8fafc;padding:12px;border-radius:6px;border:1px solid #e2e8f0;">
      <div>Warehouse: <b>${escapeHtml(a.store)}</b></div>
      <div>Date: <b>${fmtDate(a.date)}</b></div>
      <div>Audited By: <b>${escapeHtml(a.user)}</b></div>
      <div>Net Variance: <b style="color:${(a.netVal || 0) >= 0 ? 'var(--green-text)' : 'var(--red)'};">${(a.netVal || 0) > 0 ? '+' : ''}${money(a.netVal || 0)}</b></div>
    </div>
    <div style="max-height:360px;overflow-y:auto;border:1px solid #e2e8f0;border-radius:6px;">
      <table class="table" style="font-size:12px;margin:0;">
        <thead>
          <tr>
            <th>Product</th>
            <th class="num-cell">Old Book</th>
            <th class="num-cell">Physical</th>
            <th class="num-cell">Diff</th>
            <th class="num-cell">Value</th>
            <th>Reason</th>
          </tr>
        </thead>
        <tbody>
          ${(a.adjustments || []).map(adj => `
            <tr>
              <td><b>${escapeHtml(adj.product)}</b></td>
              <td class="num-cell">${numberValue(adj.oldStock)} ${adj.unit || ''}</td>
              <td class="num-cell" style="font-weight:700;">${numberValue(adj.newStock)} ${adj.unit || ''}</td>
              <td class="num-cell" style="font-weight:700;color:${adj.diff > 0 ? 'var(--green-text)' : 'var(--red)'};">
                ${adj.diff > 0 ? '+' : ''}${numberValue(adj.diff)}
              </td>
              <td class="num-cell"><b>${money(adj.value)}</b></td>
              <td style="font-size:11px;color:#64748b;">${escapeHtml(adj.reason || 'Count reconciliation')}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `, `
    <button class="secondary" onclick="closeModal()">Close</button>
  `);
}

function exportAuditHistoryCsv() {
  const audits = state.stockAudits || [];
  if (audits.length === 0) {
    toast("No audit logs to export");
    return;
  }
  const headers = ["Audit ID", "Date", "Warehouse", "Audited By", "Items Audited", "Adjusted Items", "Net Impact"];
  const rows = [
    headers,
    ...audits.map(a => [
      a.id,
      fmtDate(a.date),
      a.store,
      a.user,
      a.itemCount || 0,
      a.adjustedCount || 0,
      (a.netVal || 0).toFixed(2)
    ])
  ];
  downloadCsv("stocksense-physical-stock-audits.csv", rows);
}

function printPhysicalStockSheet() {
  const store = physicalStockState.store || state.currentStore || "Main Store";
  const items = state.products.filter(p => p.store === store);

  openInAppModal(`Physical Stock Count Sheet — ${store}`, `
    <div id="print-stock-sheet-content" style="padding:4px;font-family:sans-serif;">
      <div style="border-bottom:2px solid #0f172a;padding-bottom:8px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:flex-end;">
        <div>
          <h2 style="margin:0;font-size:17px;color:#0f172a;">Hotel Rajmudra — Physical Stock Take Sheet</h2>
          <div style="color:#64748b;font-size:12px;margin-top:2px;">Location: <b>${escapeHtml(store)}</b> | Date: <b>${fmtDate(today)}</b></div>
        </div>
        <div style="text-align:right;font-size:11px;color:#64748b;line-height:1.4;">
          Counted by: ____________________<br>Verified by: ____________________
        </div>
      </div>
      <div style="max-height:400px;overflow-y:auto;border:1px solid #e2e8f0;border-radius:6px;">
        <table class="table" style="width:100%;font-size:11.5px;margin:0;">
          <thead>
            <tr style="background:#f8fafc;">
              <th style="width:30px;text-align:center;">#</th>
              <th>Item Name</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Unit</th>
              <th class="num-cell" style="text-align:right;">Book Stock</th>
              <th style="text-align:center;width:120px;background:#f1f5f9;">Physical Count</th>
              <th style="width:130px;">Remarks</th>
            </tr>
          </thead>
          <tbody>
            ${items.map((p, idx) => `
              <tr style="border-bottom:1px solid #e2e8f0;">
                <td style="text-align:center;color:#64748b;">${idx + 1}</td>
                <td><b>${escapeHtml(p.name)}</b></td>
                <td>${escapeHtml(p.sku || '—')}</td>
                <td>${escapeHtml(p.category || '—')}</td>
                <td>${escapeHtml(p.unit)}</td>
                <td class="num-cell" style="font-weight:700;">${numberValue(p.stock)}</td>
                <td style="text-align:center;border-left:1px dashed #cbd5e1;border-right:1px dashed #cbd5e1;background:#fafafa;">&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `, `
    <button class="secondary" onclick="closeModal()">Close</button>
    <button class="primary" onclick="window.print()">Print Count Sheet</button>
  `);
}

function exportFullBackup() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "stocksense-backup-" + today + ".json";
  a.click();
  toast("Backup downloaded");
}

function resetDefaults() {
  confirmModal("Restore default sample data and clear changes?", () => {
    localStorage.removeItem("stocksense-data");
    localStorage.removeItem("stocksense-purchases");
    location.reload();
  });
}

// MODAL DISPATCHER
function openModal(type, index) {
  if (type === "adjust") {
    openInAppModal("Stock Adjustment", `
      <div class="form-grid">
        <div class="form-field full">
          <label>Item</label>
          <select id="m-product">
            ${state.products.map(p => `<option value="${p.name}">${p.name} (${p.stock} ${p.unit} on hand)</option>`).join("")}
          </select>
        </div>
        <div class="form-field">
          <label>Adjustment Type</label>
          <select id="m-adj-type">
            <option value="in">Add Stock (+)</option>
            <option value="out">Deduct Stock (-)</option>
          </select>
        </div>
        <div class="form-field">
          <label>Quantity</label>
          <input id="m-qty" type="number" step="0.01" value="1" min="0.01">
        </div>
        <div class="form-field full">
          <label>Reason / Notes</label>
          <input id="m-reason" placeholder="Cycle count, damage, recipe correction...">
        </div>
      </div>
    `, `
      <button class="secondary" onclick="closeModal()">Cancel</button>
      <button class="primary" onclick="submitStockAdjustment()">Apply Adjustment</button>
    `);
  } else if (type === "product") {
    openInAppModal("Add New Product", `
      <div class="form-grid">
        <div class="form-field full">
          <label>Item Name *</label>
          <input id="m-prod-name" placeholder="e.g. Saffron Strands">
        </div>
        <div class="form-field">
          <label>Brand</label>
          <input id="m-prod-brand" placeholder="e.g. Premium">
        </div>
        <div class="form-field">
          <label>Category</label>
          <input id="m-prod-cat" placeholder="e.g. Spices">
        </div>
        <div class="form-field">
          <label>Department</label>
          <select id="m-prod-dept">
            ${departments.map(d => `<option>${d}</option>`).join("")}
          </select>
        </div>
        <div class="form-field">
          <label>Unit</label>
          <select id="m-prod-unit">
            <option>kg</option><option>L</option><option>piece</option><option>gram</option><option>ml</option><option>case</option><option>unit</option>
          </select>
        </div>
        <div class="form-field">
          <label>Cost Rate</label>
          <input id="m-prod-cost" type="number" step="0.01" value="5">
        </div>
        <div class="form-field">
          <label>Min Stock Level</label>
          <input id="m-prod-min" type="number" value="10">
        </div>
        <div class="form-field">
          <label>Opening Stock</label>
          <input id="m-prod-stock" type="number" step="0.01" value="0">
        </div>
      </div>
    `, `
      <button class="secondary" onclick="closeModal()">Cancel</button>
      <button class="primary" onclick="submitNewProduct()">Save Product</button>
    `);
  } else if (type === "supplier") {
    const existing = (index !== undefined && index !== null && index !== "") ? state.suppliers[index] : null;
    openInAppModal(existing ? "Edit Supplier — " + existing[0] : "Add New Supplier", `
      <div class="form-grid">
        <div class="form-field full">
          <label>Supplier Name *</label>
          <input id="m-sup-name" value="${existing ? escapeHtml(existing[0]) : ''}" placeholder="e.g. Supreme Seafood Inc.">
        </div>
        <div class="form-field">
          <label>Category</label>
          <input id="m-sup-cat" value="${existing ? escapeHtml(existing[1] || '') : ''}" placeholder="e.g. Seafood & Meats">
        </div>
        <div class="form-field">
          <label>Contact Email / Phone</label>
          <input id="m-sup-contact" value="${existing ? escapeHtml(existing[2] || '') : ''}" placeholder="orders@supremeseafood.com">
        </div>
        <div class="form-field">
          <label>Lead Time (Days)</label>
          <input id="m-sup-lead" type="number" value="${existing ? (existing[3] || 2) : 2}">
        </div>
        <div class="form-field">
          <label>Outstanding / Opening Balance</label>
          <input id="m-sup-due" type="number" step="0.01" value="${existing ? (existing[4] || 0) : 0}">
        </div>
      </div>
    `, `
      ${existing ? `<button class="danger-btn" onclick="closeModal();deleteSupplier(${index})">Delete Supplier</button>` : ''}
      <button class="secondary" onclick="closeModal()">Cancel</button>
      <button class="primary" onclick="submitSupplier(${index !== undefined && index !== null ? index : "null"})">${existing ? "Update Supplier" : "Save Supplier"}</button>
    `);
  } else if (type === "store") {
    const existing = index !== undefined ? state.stores[index] : null;
    openInAppModal(existing ? "Edit Warehouse" : "Add Warehouse", `
      <div class="form-grid">
        <div class="form-field full">
          <label>Warehouse Name *</label>
          <input id="m-store-name" value="${existing ? existing[0] : ''}" placeholder="e.g. Cold Storage Room A">
        </div>
        <div class="form-field full">
          <label>Description</label>
          <input id="m-store-desc" value="${existing ? existing[1] : ''}" placeholder="Location notes...">
        </div>
        <div class="form-field full">
          <label>Manager</label>
          <input id="m-store-mgr" value="${existing ? existing[2] : state.currentUser}">
        </div>
      </div>
    `, `
      <button class="secondary" onclick="closeModal()">Cancel</button>
      <button class="primary" onclick="submitStore(${index})">Save Warehouse</button>
    `);
  } else if (type === "user") {
    const existing = index !== undefined ? state.users[index] : null;
    openInAppModal(existing ? "Edit Team Member" : "Add Team Member", `
      <div class="form-grid">
        <div class="form-field full">
          <label>Full Name *</label>
          <input id="m-user-name" value="${existing ? existing.name : ''}">
        </div>
        <div class="form-field">
          <label>Role</label>
          <select id="m-user-role">
            <option ${(existing?.role || '').toLowerCase() === 'owner' ? 'selected' : ''}>Owner</option>
            <option ${(existing?.role || '').toLowerCase() === 'store manager' ? 'selected' : ''}>Store Manager</option>
            <option ${(existing?.role || '').toLowerCase() === 'store keeper' ? 'selected' : ''}>Store Keeper</option>
            <option ${(existing?.role || '').toLowerCase() === 'inventory clerk' ? 'selected' : ''}>Inventory Clerk</option>
            <option ${(existing?.role || '').toLowerCase() === 'chef' ? 'selected' : ''}>Chef</option>
          </select>
        </div>
        <div class="form-field">
          <label>Warehouse Access</label>
          <input id="m-user-loc" value="${existing?.location || 'All locations'}">
        </div>
      </div>
    `, `
      <button class="secondary" onclick="closeModal()">Cancel</button>
      <button class="primary" onclick="submitUser(${index})">Save Member</button>
    `);
  } else if (type === "payment") {
    const defaultSup = (typeof index === "string" ? index : "") || (state.suppliers[0] ? state.suppliers[0][0] : "");
    const stats = defaultSup ? getSupplierFinancials(defaultSup) : null;
    const defaultAmt = stats && stats.netDue > 0 ? stats.netDue : "";
    openInAppModal("Record Supplier Payment", `
      <div class="form-grid">
        <div class="form-field full">
          <label>Supplier *</label>
          <select id="m-pay-supplier" onchange="onPaymentSupplierChange(this.value)">
            ${state.suppliers.map(s => `<option value="${escapeQuote(s[0])}" ${s[0] === defaultSup ? 'selected' : ''}>${s[0]} (Due: ${money(getSupplierFinancials(s[0]).netDue)})</option>`).join("")}
          </select>
        </div>
        <div class="form-field">
          <label>Payment Date *</label>
          <input id="m-pay-date" type="date" value="${today}">
        </div>
        <div class="form-field">
          <label>Amount Paid *</label>
          <input id="m-pay-amount" type="number" step="0.01" value="${defaultAmt}" placeholder="Enter amount to disburse">
        </div>
        <div class="form-field">
          <label>Payment Mode</label>
          <select id="m-pay-mode">
            <option>Bank Transfer</option>
            <option>Cheque</option>
            <option>Cash</option>
            <option>UPI / Card</option>
            <option>NEFT / RTGS</option>
          </select>
        </div>
        <div class="form-field">
          <label>Reference / Cheque / UTR #</label>
          <input id="m-pay-ref" placeholder="e.g. UTR-9182301">
        </div>
        <div class="form-field full">
          <label>Remarks / Notes</label>
          <input id="m-pay-notes" placeholder="e.g. Settlement for dairy supplies invoice...">
        </div>
      </div>
    `, `
      <button class="secondary" onclick="closeModal()">Cancel</button>
      <button class="primary" onclick="submitPayment()">Save Payment</button>
    `);
  }
}

function submitStockAdjustment() {
  const prodName = document.getElementById("m-product")?.value;
  const type = document.getElementById("m-adj-type")?.value;
  const qty = Number(document.getElementById("m-qty")?.value) || 0;
  const reason = document.getElementById("m-reason")?.value.trim() || "Stock Adjustment";
  if (!prodName || qty <= 0) { toast("Select item and valid quantity"); return; }

  const signed = type === "in" ? qty : -qty;
  const p = productByName(prodName);
  if (!p) return;

  p.stock += signed;
  state.transactions.unshift({
    id: "TX-" + Date.now(),
    date: new Date().toISOString(),
    type: "Adjustment",
    product: p.name,
    store: state.currentStore,
    qty: signed,
    cost: p.cost || 0,
    user: state.currentUser,
    ref: "ADJ-" + Date.now().toString().slice(-5),
    remarks: reason
  });

  save();
  closeModal();
  toast("Adjustment posted: " + (signed > 0 ? "+" : "") + signed + " " + p.unit + " for " + p.name);
  showView(document.querySelector(".nav-item.active")?.dataset.view || "dashboard");
}

function submitNewProduct() {
  const name = document.getElementById("m-prod-name")?.value.trim();
  if (!name) { toast("Item name is required"); return; }
  const brand = document.getElementById("m-prod-brand")?.value.trim() || "";
  const category = document.getElementById("m-prod-cat")?.value.trim() || "General";
  const department = document.getElementById("m-prod-dept")?.value || "Kitchen";
  const unit = document.getElementById("m-prod-unit")?.value || "unit";
  const cost = Number(document.getElementById("m-prod-cost")?.value) || 0;
  const min = Number(document.getElementById("m-prod-min")?.value) || 0;
  const stock = Number(document.getElementById("m-prod-stock")?.value) || 0;

  const id = Math.max(0, ...state.products.map(p => Number(p.id) || 0)) + 1;
  const newProd = {
    id,
    name,
    brand,
    category,
    department,
    unit,
    stock,
    cost,
    purchaseCost: cost,
    min,
    reorder: min + 5,
    max: min * 3,
    store: state.currentStore,
    icon: category === "Dairy" ? "🧀" : category === "Veg" ? "🥦" : "📦"
  };

  state.products.push(newProd);
  state.openingStock[name] = stock;
  if (stock > 0) {
    state.transactions.unshift({
      id: "TX-" + Date.now(),
      date: new Date().toISOString(),
      type: "Adjustment",
      product: name,
      store: state.currentStore,
      qty: stock,
      cost,
      user: state.currentUser,
      ref: "INIT-001"
    });
  }

  save();
  closeModal();
  showView("inventory");
  toast("Product added to catalogue");
}

function submitSupplier(index) {
  const name = document.getElementById("m-sup-name")?.value.trim();
  if (!name) { toast("Supplier name is required"); return; }
  const cat = document.getElementById("m-sup-cat")?.value.trim() || "General";
  const contact = document.getElementById("m-sup-contact")?.value.trim() || "";
  const lead = Number(document.getElementById("m-sup-lead")?.value) || 2;
  const due = Number(document.getElementById("m-sup-due")?.value) || 0;

  if (index === undefined || index === null || index === "") {
    state.suppliers.push([name, cat, contact, lead, due]);
  } else {
    const oldName = state.suppliers[index][0];
    state.suppliers[index] = [name, cat, contact, lead, due];
    if (oldName !== name) {
      state.purchases.forEach(p => { if (p.supplier === oldName) p.supplier = name; });
      (state.payments || []).forEach(p => { if (p.supplier === oldName) p.supplier = name; });
      (state.purchaseOrders || []).forEach(p => { if (p.supplier === oldName) p.supplier = name; });
    }
  }

  save();
  closeModal();
  if (document.querySelector('.nav-item.active')?.dataset?.view === 'accounts') showView("accounts");
  else showView("suppliers");
  toast(index === undefined || index === null || index === "" ? "Supplier saved" : "Supplier updated");
}

function submitNewSupplier() {
  submitSupplier(null);
}

function deleteSupplier(idx) {
  const s = state.suppliers[idx];
  if (!s) return;
  confirmModal(`Permanently delete supplier "${s[0]}"?`, () => {
    state.suppliers.splice(idx, 1);
    save();
    toast(`Supplier "${s[0]}" deleted`);
    if (document.querySelector('.nav-item.active')?.dataset?.view === 'accounts') showView("accounts");
    else showView("suppliers");
  });
}

function submitStore(index) {
  const name = document.getElementById("m-store-name")?.value.trim();
  if (!name) { toast("Warehouse name is required"); return; }
  const desc = document.getElementById("m-store-desc")?.value.trim() || "";
  const mgr = document.getElementById("m-store-mgr")?.value.trim() || state.currentUser;

  if (index === undefined || index === null) {
    state.stores.push([name, desc, mgr, 0]);
  } else {
    state.stores[index] = [name, desc, mgr, state.stores[index][3] || 0];
  }

  save();
  closeModal();
  showView("stores");
  toast(index === undefined ? "Warehouse created" : "Warehouse updated");
}

function submitUser(index) {
  const name = document.getElementById("m-user-name")?.value.trim();
  if (!name) { toast("User name is required"); return; }
  const role = document.getElementById("m-user-role")?.value;
  const loc = document.getElementById("m-user-loc")?.value.trim() || "All locations";

  if (index === undefined || index === null) {
    state.users.push({ name, role, location: loc, active: true });
  } else {
    state.users[index] = { ...state.users[index], name, role, location: loc };
  }

  save();
  closeModal();
  showView("users");
  toast(index === undefined ? "Team member added" : "Team member updated");
}

function downloadCsv(filename, rows) {
  const csvContent = rows.map(r => r.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(",")).join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csvContent], { type: "text/csv" }));
  a.download = filename;
  a.click();
  toast(filename + " downloaded");
}

// NAVIGATION DISPATCHER
let ledgerFilterItem = null;

function showView(view) {
  document.querySelectorAll(".nav-item").forEach(b => b.classList.toggle("active", b.dataset.view === view));
  const titleEl = document.getElementById("page-title");
  if (titleEl) titleEl.textContent = titleCase(view);

  let html = "";
  if (view === "dashboard") html = dashboard();
  else if (view === "inventory") html = inventory();
  else if (view === "inventory-ledger") {
    let rows = state.transactions;
    if (ledgerFilterItem) {
      rows = rows.filter(t => t.product === ledgerFilterItem);
    }
    html = layout(
      "Stock Ledger" + (ledgerFilterItem ? " — " + ledgerFilterItem : ""),
      "Chronological record of stock movements and valuation history.",
      `<button class="secondary" onclick="ledgerFilterItem=null;showView('inventory-ledger')">Show All Items</button>
       <button class="secondary" onclick="exportReportData()">Export CSV</button>`,
      `<div class="panel"><div class="panel-head"><span class="panel-title">Transaction Ledger</span><span class="pill">${rows.length} records</span></div><div class="view-table">${ledgerRows(rows)}</div></div>`
    );
  }
  else if (view === "purchasing") html = purchaseDraft.isNew ? purchaseScreen() : purchaseHistory();
  else if (view === "purchase-orders") html = purchaseOrdersScreen();
  else if (view === "outward") html = outwardDraft.isNew ? outwardScreen() : outwardHistory();
  else if (view === "physical-stock") html = physicalStockScreen();
  else if (view === "departments") { currentSettingsTab = "departments"; html = settingsScreen(); }
  else if (view === "suppliers") { currentSettingsTab = "suppliers"; html = settingsScreen(); }
  else if (view === "accounts") html = accountsScreen();
  else if (view === "reports") html = universalReports();
  else if (view === "stores") html = storesScreen();
  else if (view === "users") html = usersScreen();
  else if (view === "audit") html = universalReports();
  else if (view === "settings") html = settingsScreen();
  else html = dashboard();

  const content = document.getElementById("app-content");
  if (content) content.innerHTML = html;

  updateSidebarMeta();
}

// GLOBAL EVENT LISTENERS & SHORTCUTS
document.addEventListener("click", e => {
  const btn = e.target.closest(".nav-item[data-view]");
  if (btn) {
    if (btn.dataset.view === "purchasing") purchaseDraft.isNew = false;
    if (btn.dataset.view === "outward") outwardDraft.isNew = false;
    showView(btn.dataset.view);
  }
});

const globalSearchInput = document.getElementById("global-search");
if (globalSearchInput) {
  globalSearchInput.addEventListener("keydown", e => {
    if (e.key === "Enter" && e.target.value) {
      inventoryFilters.search = e.target.value;
      showView("inventory");
    }
  });
}

document.addEventListener("keydown", e => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    document.getElementById("global-search")?.focus();
  }
  if (e.key === "Escape") {
    if (document.getElementById("modal-root")?.children.length) {
      closeModal();
    } else if (document.getElementById("product-search-popover")?.style.display === "block") {
      closeProductSearchPopover();
    } else if (purchaseDraft.isNew) {
      exitPurchaseFullscreen();
    } else if (outwardDraft.isNew) {
      exitOutwardFullscreen();
    } else {
      closeAllPopovers();
    }
  }
  if (e.key === "F8" || (e.ctrlKey && e.key.toLowerCase() === "s")) {
    if (document.getElementById("purchase-items-body")) { e.preventDefault(); savePurchase(); }
    else if (document.getElementById("outward-items-body")) { e.preventDefault(); saveOutward(); }
  }
  if (e.key === "F5" || (e.ctrlKey && e.key.toLowerCase() === "a")) {
    if (document.getElementById("purchase-items-body")) { e.preventDefault(); addPurchaseRow(); }
    else if (document.getElementById("outward-items-body")) { e.preventDefault(); addOutwardRow(); }
  }
});

// DATALIST INJECTION FOR PRODUCT AUTOCOMPLETE
function ensureProductsDatalist() {
  let dl = document.getElementById("products-datalist");
  if (!dl) {
    dl = document.createElement("datalist");
    dl.id = "products-datalist";
    document.body.appendChild(dl);
  }
  dl.innerHTML = state.products.map(p => `<option value="${p.name}">${p.brand ? p.brand + ' · ' : ''}${p.category} (${numberValue(p.stock)} ${p.unit})</option>`).join("");
}

window.addEventListener("DOMContentLoaded", () => {
  ensureProductsDatalist();
  updateSidebarMeta();
  showView("dashboard");
});

ensureProductsDatalist();
updateSidebarMeta();
showView("dashboard");
