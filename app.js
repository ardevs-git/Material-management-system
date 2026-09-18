
// StockSense - High Performance Restaurant Inventory OS
const seed = {
  products: [
    {id:1,name:"Paneer",sku:"DAI-001",barcode:"8901001001",category:"Dairy",unit:"kg",stock:7.2,min:10,reorder:14,max:24,cost:11.8,purchaseCost:11.8,store:"Downtown Kitchen",expiry:"2026-09-22",icon:"🧀"},
    {id:2,name:"Tomato",sku:"VEG-001",barcode:"8901001002",category:"Vegetables",unit:"kg",stock:14,min:8,reorder:12,max:25,cost:3.4,purchaseCost:3.4,store:"Downtown Kitchen",expiry:"2026-09-28",icon:"🍅"},
    {id:3,name:"Butter",sku:"DAI-002",barcode:"8901001003",category:"Dairy",unit:"kg",stock:8.4,min:6,reorder:9,max:16,cost:8.5,purchaseCost:8.5,store:"Downtown Kitchen",expiry:"2026-10-04",icon:"🧈"},
    {id:4,name:"Cooking Cream",sku:"DAI-003",barcode:"8901001004",category:"Dairy",unit:"L",stock:4.8,min:5,reorder:8,max:14,cost:6.4,purchaseCost:6.4,store:"Downtown Kitchen",expiry:"2026-09-20",icon:"🥛"},
    {id:5,name:"Arabica Coffee Beans",sku:"BEV-001",barcode:"8901001005",category:"Beverages",unit:"kg",stock:18.5,min:12,reorder:16,max:30,cost:18.5,purchaseCost:18.5,store:"Downtown Kitchen",expiry:"2026-10-06",icon:"☕"},
    {id:6,name:"Basmati Rice",sku:"PAN-013",barcode:"8901001006",category:"Pantry",unit:"kg",stock:42,min:20,reorder:28,max:60,cost:3.4,purchaseCost:3.4,store:"Riverside Store",expiry:"2027-08-10",icon:"🍚"}
  ],
  transactions: [
    {id:"TX-1048",date:"2026-09-14T10:30:00",type:"Purchase",product:"Paneer",store:"Downtown Kitchen",qty:12,cost:11.8,user:"Alex Kim",ref:"GRN-00218"},
    {id:"TX-1047",date:"2026-09-14T09:15:00",type:"Consumption",product:"Tomato",store:"Downtown Kitchen",qty:-4.5,cost:3.4,user:"Maya Chen",ref:"CON-00821"},
    {id:"TX-1046",date:"2026-09-14T08:40:00",type:"Wastage",product:"Cooking Cream",store:"Downtown Kitchen",qty:-1.2,cost:6.4,user:"Maya Chen",ref:"WST-00092"},
    {id:"TX-1045",date:"2026-09-13T16:10:00",type:"Consumption",product:"Butter",store:"Downtown Kitchen",qty:-1.6,cost:8.5,user:"Maya Chen",ref:"CON-00820"},
    {id:"TX-1044",date:"2026-09-12T11:20:00",type:"Transfer out",product:"Basmati Rice",store:"Riverside Store",qty:-10,cost:3.4,user:"Alex Kim",ref:"TRF-00028"},
    {id:"TX-1043",date:"2026-09-12T12:05:00",type:"Transfer in",product:"Basmati Rice",store:"Downtown Kitchen",qty:10,cost:3.4,user:"Alex Kim",ref:"TRF-00028"}
  ],
  suppliers:[
    ["Fresh Foods Co.","Produce & dairy","orders@freshfoods.co",3,2180],
    ["Metro Provisions","Pantry & dry goods","sales@metroprovisions.com",5,1460],
    ["Green Valley Farms","Fresh produce","hello@greenvalley.co",2,890]
  ],
  stores:[
    ["Downtown Kitchen","Primary production store","Alex Kim",6],
    ["Riverside Store","Secondary storage","Maya Chen",1]
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
    decimals: 2,
    rounding: "normal",
    general: { company: "StockSense Kitchen", address: "124 Culinary Way", phone: "+1 (555) 234-8900", email: "inventory@stocksense.io", financialYear: "April", department: "Kitchen", location: "Downtown Kitchen", dateFormat: "DD-MM-YYYY", confirmDelete: true },
    inventory: { negative: false, adjustment: true, backdated: true, valuation: "Weighted average", unit: "kg", lowThreshold: 10, outWarning: true, recalculate: true, departmentTracking: true, multiLocation: true },
    transactions: { purchasePrefix: "GRN-", outwardPrefix: "OUT-", adjustmentPrefix: "ADJ-", autoNumber: true, manualNumber: false, edit: true, delete: true, backdatedPurchase: true, backdatedOutward: true, mode: "Keyboard first" },
    savedReports: []
  }
};

state.outwards = Array.isArray(state.outwards) ? state.outwards : [];
state.purchases = Array.isArray(state.purchases) ? state.purchases : [];
state.purchaseOrders = Array.isArray(state.purchaseOrders) ? state.purchaseOrders : [];
state.suppliers = Array.isArray(state.suppliers) && state.suppliers.length ? state.suppliers : seed.suppliers;
state.stores = Array.isArray(state.stores) && state.stores.length ? state.stores : seed.stores;
state.users = Array.isArray(state.users) && state.users.length ? state.users : [
  {name:"Alex Kim",role:"Owner",location:"All locations",active:true},
  {name:"Maya Chen",role:"Store manager",location:"Downtown Kitchen",active:true},
  {name:"Sam Rivera",role:"Inventory clerk",location:"Riverside Store",active:true}
];
state.currentUser = state.currentUser || "Alex Kim";
state.currentStore = state.currentStore || (state.stores[0] ? state.stores[0][0] : "Downtown Kitchen");

state.settings = state.settings || {};
state.settings.general = state.settings.general || { company: "StockSense Kitchen", location: "Downtown Kitchen", financialYear: "April" };
state.settings.inventory = state.settings.inventory || { negative: false, lowThreshold: 10, recalculate: true };
state.settings.transactions = state.settings.transactions || { purchasePrefix: "GRN-", outwardPrefix: "OUT-" };
state.settings.savedReports = Array.isArray(state.settings.savedReports) ? state.settings.savedReports : [];

const departments = ["Kitchen","Bar","Bakery","Housekeeping","Maintenance","Production","Office","Other"];

// Bootstrap closing stock import if available and fresh
const canBootstrap = !stored || (!state.transactions.length && !state.purchases.length && !state.outwards.length && state.products.length <= 6);
if (typeof closingStockImport !== "undefined" && canBootstrap && !state.imports?.closingAugust2026V2) {
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

const canManage = () => ["Owner","Admin"].includes(state.users.find(u => u.name === state.currentUser)?.role);

const today = new Date().toISOString().slice(0, 10);
const roundNumber = n => {
  const d = Math.max(0, Number(state.settings.decimals) || 0);
  const m = 10 ** d;
  const v = Number(n) || 0;
  return state.settings.rounding === "up" ? Math.ceil(v * m) / m :
         state.settings.rounding === "down" ? Math.floor(v * m) / m :
         state.settings.rounding === "none" ? v : Math.round(v * m) / m;
};
const numberValue = n => roundNumber(n).toLocaleString("en-US", {
  minimumFractionDigits: state.settings.rounding === "none" ? 0 : state.settings.decimals,
  maximumFractionDigits: state.settings.rounding === "none" ? 20 : state.settings.decimals
});
const money = n => "$" + numberValue(n);
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

const productByName = name => state.products.find(p => p.name === name);
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
  const role = state.users.find(u => u.name === state.currentUser)?.role || "User";
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

const titleCase = s => s.replace(/(^|[-_])(w)/g, (_, a, b) => " " + b.toUpperCase()).trim();
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
  p.innerHTML = `
    <div class="popover-header"><span>Switch Active Profile</span></div>
    ${state.users.map(u => `
      <button class="popover-item ${u.name === state.currentUser ? 'active' : ''}" onclick="switchUser('${u.name}')">
        <b>${u.name}</b> <small style="margin-left:auto;color:#64748b;">${u.role}</small>
      </button>
    `).join("")}
  `;
  p.classList.toggle("open");
}

function switchUser(name) {
  state.currentUser = name;
  save();
  closeAllPopovers();
  toast("Signed in as " + name);
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
document.addEventListener("click", () => closeAllPopovers());

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
        </tr>
      </thead>
      <tbody>
        ${rows.map(t => `
          <tr>
            <td><b>${t.ref || '—'}</b></td>
            <td><div class="product-cell"><span class="product-dot">${productByName(t.product)?.icon || "📦"}</span>${t.product}</div></td>
            <td><span class="tag">${t.type}</span></td>
            <td>${t.store || "Downtown Kitchen"}</td>
            <td class="num-cell" style="color:${t.qty < 0 ? "var(--red)" : "var(--green-text)"};font-weight:700">${t.qty > 0 ? "+" : ""}${numberValue(t.qty)}</td>
            <td class="num-cell">${money(t.cost)}</td>
            <td class="num-cell"><b>${money(Math.abs(t.qty) * (t.cost || 0))}</b></td>
            <td>${t.user || "Alex Kim"}</td>
            <td>${fmtDate(t.date)}</td>
          </tr>
        `).join("") || '<tr><td colspan="9" class="empty-state">No transactions found.</td></tr>'}
      </tbody>
    </table>
  `;
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
              <td>${p.store || "Downtown Kitchen"}</td>
              <td>${p.min || 0} / ${p.reorder || 0}</td>
              <td class="num-cell" style="font-weight:700;${p.stock < (p.min||10) ? 'color:var(--red);' : ''}">${numberValue(p.stock)} ${p.unit}</td>
              <td class="num-cell">${money(p.purchaseCost || p.cost || 0)}</td>
              <td class="num-cell"><b>${money((p.stock || 0) * (p.cost || 0))}</b></td>
              <td><span class="status ${statusClass}">${statusText}</span></td>
              <td style="text-align:right;">
                <button class="secondary" style="padding:4px 8px;font-size:11px;" onclick="viewItem(${p.id})">Details</button>
                <button class="secondary" style="padding:4px 8px;font-size:11px;" onclick="modifyItem(${p.id})">Edit</button>
                <button class="secondary" style="padding:4px 8px;font-size:11px;" onclick="filterLedgerForProductId(${p.id})">Ledger</button>
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
      <div><span style="color:#64748b;">Warehouse:</span> <b>${p.store || 'Downtown Kitchen'}</b></div>
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
        <label>Cost / Purchase Rate ($)</label>
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
    <button class="secondary" onclick="closeModal()">Cancel</button>
    <button class="primary" onclick="saveItemChanges(${id})">Save Changes</button>
  `);
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
let purchaseDraft = { date: today, supplier: "Fresh Foods Co.", store: "Downtown Kitchen", reference: "", remarks: "", items: [], isNew: true };
const nextPurchaseNo = () => `GRN-${String((state.purchases || []).length + 219).padStart(5, "0")}`;

function newPurchase() {
  purchaseDraft = {
    date: today,
    supplier: state.suppliers[0] ? state.suppliers[0][0] : "Fresh Foods Co.",
    store: state.currentStore,
    reference: "",
    remarks: "",
    items: [{ product: state.products[0]?.name || "", qty: 1, rate: state.products[0]?.purchaseCost || state.products[0]?.cost || 10 }],
    isNew: true
  };
  showView("purchasing");
}

function purchaseScreen() {
  const total = purchaseDraft.items.reduce((a, i) => a + (Number(i.qty) || 0) * (Number(i.rate) || 0), 0);
  return layout(
    "Goods Receipt Note (GRN)",
    "Record supplier deliveries and post stock into inventory.",
    `<button class="secondary" onclick="showView('purchasing')">Cancel</button>
     <button class="primary" onclick="savePurchase()">Save Purchase (F8)</button>`,
    `
      <div class="voucher-container">
        <div class="voucher-command-bar">
          <b>Goods Receipt Entry</b>
          <span>F5: Add row</span>
          <span>F8: Save</span>
          <span>F9: Print preview</span>
          <span>Esc: Cancel</span>
        </div>

        <div class="voucher-header-card">
          <div class="voucher-header-top">
            <div>
              <span style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;">Voucher No</span>
              <div class="voucher-no-badge">${purchaseDraft.no || nextPurchaseNo()}</div>
            </div>
            <span class="status ok">${purchaseDraft.no ? "POSTED" : "DRAFT"}</span>
          </div>

          <div class="voucher-grid-fields">
            <div class="voucher-field">
              <label>Purchase Date</label>
              <input type="date" value="${purchaseDraft.date}" onchange="purchaseDraft.date=this.value">
            </div>
            <div class="voucher-field">
              <label>Supplier</label>
              <select onchange="purchaseDraft.supplier=this.value">
                ${state.suppliers.map(s => `<option ${s[0] === purchaseDraft.supplier ? 'selected' : ''}>${s[0]}</option>`).join("")}
              </select>
            </div>
            <div class="voucher-field">
              <label>Receiving Warehouse</label>
              <select onchange="purchaseDraft.store=this.value">
                ${state.stores.map(s => `<option ${s[0] === purchaseDraft.store ? 'selected' : ''}>${s[0]}</option>`).join("")}
              </select>
            </div>
            <div class="voucher-field">
              <label>Invoice / Reference #</label>
              <input value="${purchaseDraft.reference || ''}" placeholder="e.g. INV-9902" oninput="purchaseDraft.reference=this.value">
            </div>
            <div class="voucher-field">
              <label>Remarks</label>
              <input value="${purchaseDraft.remarks || ''}" placeholder="Delivery notes..." oninput="purchaseDraft.remarks=this.value">
            </div>
          </div>
        </div>

        <div class="voucher-items-card">
          <div class="panel-head">
            <span class="panel-title">Received Items</span>
            <button class="primary" style="padding:4px 10px;font-size:12px;" onclick="addPurchaseRow()">＋ Add Item (F5)</button>
          </div>
          <div class="voucher-table-wrap">
            <table class="voucher-table">
              <thead>
                <tr>
                  <th style="width:40px;">#</th>
                  <th>Item Name</th>
                  <th style="width:120px;">Qty</th>
                  <th style="width:80px;">Unit</th>
                  <th style="width:140px;">Unit Rate ($)</th>
                  <th style="width:140px;">Amount ($)</th>
                  <th style="width:40px;"></th>
                </tr>
              </thead>
              <tbody id="purchase-items-body">
                ${renderPurchaseTableRows()}
              </tbody>
            </table>
          </div>
        </div>

        <div class="voucher-footer">
          <div class="validation-note valid">
            ✓ Items and values are recalculated automatically
          </div>
          <div class="total-box">
            <span>Total Items: <b id="purchase-total-items">${purchaseDraft.items.length}</b></span>
            <strong>Total Amount: <span id="purchase-total-val">${money(total)}</span></strong>
          </div>
        </div>
      </div>
    `
  );
}

function renderPurchaseTableRows() {
  return purchaseDraft.items.map((item, idx) => {
    const p = productByName(item.product);
    const amount = (Number(item.qty) || 0) * (Number(item.rate) || 0);
    return `
      <tr data-row="${idx}">
        <td>${idx + 1}</td>
        <td>
          <input list="products-datalist" value="${item.product || ''}" placeholder="Select item..." onchange="updatePurchaseItemName(${idx}, this.value)">
        </td>
        <td>
          <input type="number" step="0.01" min="0" value="${item.qty}" oninput="updatePurchaseItemQty(${idx}, this.value)">
        </td>
        <td style="color:#64748b;font-weight:600;">${p?.unit || 'unit'}</td>
        <td>
          <input type="number" step="0.01" min="0" value="${item.rate}" oninput="updatePurchaseItemRate(${idx}, this.value)">
        </td>
        <td class="num-cell" id="p-amount-${idx}" style="font-weight:700;">${money(amount)}</td>
        <td>
          <button class="row-delete" onclick="removePurchaseRow(${idx})">×</button>
        </td>
      </tr>
    `;
  }).join("") || '<tr><td colspan="7" class="empty-state">No items added. Click "+ Add Item" to begin.</td></tr>';
}

function updatePurchaseItemName(idx, name) {
  if (!purchaseDraft.items[idx]) return;
  purchaseDraft.items[idx].product = name;
  const p = productByName(name);
  if (p && !purchaseDraft.items[idx].rate) {
    purchaseDraft.items[idx].rate = p.purchaseCost || p.cost || 0;
  }
  const row = document.querySelector(`#purchase-items-body tr[data-row="${idx}"]`);
  if (row) {
    const unitCell = row.children[3];
    if (unitCell) unitCell.textContent = p?.unit || 'unit';
  }
  refreshPurchaseTotals();
}

function updatePurchaseItemQty(idx, val) {
  if (!purchaseDraft.items[idx]) return;
  purchaseDraft.items[idx].qty = Number(val) || 0;
  const amtCell = document.getElementById(`p-amount-${idx}`);
  if (amtCell) amtCell.textContent = money(purchaseDraft.items[idx].qty * (purchaseDraft.items[idx].rate || 0));
  refreshPurchaseTotals();
}

function updatePurchaseItemRate(idx, val) {
  if (!purchaseDraft.items[idx]) return;
  purchaseDraft.items[idx].rate = Number(val) || 0;
  const amtCell = document.getElementById(`p-amount-${idx}`);
  if (amtCell) amtCell.textContent = money((purchaseDraft.items[idx].qty || 0) * purchaseDraft.items[idx].rate);
  refreshPurchaseTotals();
}

function refreshPurchaseTotals() {
  const total = purchaseDraft.items.reduce((a, i) => a + (Number(i.qty) || 0) * (Number(i.rate) || 0), 0);
  const totalEl = document.getElementById("purchase-total-val");
  if (totalEl) totalEl.textContent = money(total);
  const countEl = document.getElementById("purchase-total-items");
  if (countEl) countEl.textContent = purchaseDraft.items.length;
}

function addPurchaseRow() {
  purchaseDraft.items.push({ product: state.products[0]?.name || "", qty: 1, rate: state.products[0]?.purchaseCost || state.products[0]?.cost || 0 });
  const tbody = document.getElementById("purchase-items-body");
  if (tbody) tbody.innerHTML = renderPurchaseTableRows();
  refreshPurchaseTotals();
}

function removePurchaseRow(idx) {
  purchaseDraft.items.splice(idx, 1);
  const tbody = document.getElementById("purchase-items-body");
  if (tbody) tbody.innerHTML = renderPurchaseTableRows();
  refreshPurchaseTotals();
}

function savePurchase() {
  if (!purchaseDraft.items.length) {
    toast("Please add at least one item");
    return;
  }
  const invalid = purchaseDraft.items.some(i => !i.product || !i.qty);
  if (invalid) {
    toast("Ensure all items have a name and quantity");
    return;
  }
  confirmModal("Post this Goods Receipt and update stock balances?", () => {
    const no = purchaseDraft.no || nextPurchaseNo();
    const items = purchaseDraft.items.map(i => ({
      ...i,
      unit: productByName(i.product)?.unit || "unit",
      amount: Number(i.qty) * Number(i.rate)
    }));
    const total = items.reduce((a, i) => a + i.amount, 0);

    items.forEach(i => {
      state.transactions.unshift({
        id: "TX-" + Date.now() + Math.random().toString(36).slice(2, 6),
        date: purchaseDraft.date + "T12:00:00",
        type: "Purchase",
        product: i.product,
        store: purchaseDraft.store,
        qty: Number(i.qty),
        cost: Number(i.rate),
        user: state.currentUser,
        ref: no
      });
      const p = productByName(i.product);
      if (p) {
        p.cost = Number(i.rate);
        p.purchaseCost = Number(i.rate);
      }
    });

    state.purchases.unshift({
      ...purchaseDraft,
      no,
      items,
      total,
      user: state.currentUser,
      status: "Posted",
      createdAt: new Date().toISOString()
    });

    rebuildStock();
    toast(no + " posted successfully!");
    purchaseDraft.isNew = false;
    showView("purchasing");
  });
}

function purchaseHistory() {
  return layout(
    "Purchases",
    "Goods Receipt Note register and supplier deliveries.",
    `<button class="secondary" onclick="showView('purchase-orders')">Purchase Orders</button>
     <button class="secondary" onclick="exportPurchasesCsv()">Export CSV</button>
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
                  <td>${v.store || "Downtown Kitchen"}</td>
                  <td>${v.items?.length || 0} items</td>
                  <td class="num-cell" style="font-weight:700;">${money(v.total)}</td>
                  <td>${v.user}</td>
                  <td><span class="status ok">${v.status || "Posted"}</span></td>
                  <td style="text-align:right;">
                    <button class="secondary" style="padding:4px 8px;font-size:11px;" onclick="printVoucherPreview('Purchase', '${v.no}')">Print / PDF</button>
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
                  <th>Rate ($)</th>
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
                    <td><button class="row-delete" onclick="poDraft.items.splice(${idx},1);refreshPOTotals();showView('purchase-orders')">×</button></td>
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
                      <button class="primary" style="padding:4px 8px;font-size:11px;" onclick="convertPOToPurchase('${po.no}')">Convert to Purchase</button>
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

function addPORow() {
  poDraft.items.push({ product: state.products[0]?.name || "", qty: 10, rate: state.products[0]?.purchaseCost || state.products[0]?.cost || 0 });
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
  state.purchaseOrders.unshift({
    ...poDraft,
    no,
    total,
    status: "Ordered",
    createdAt: new Date().toISOString()
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
let outwardDraft = { department: "Kitchen", store: "Downtown Kitchen", date: today, issuedTo: "", reference: "", remarks: "", items: [], isNew: true };
const nextOutwardNo = () => `OUT-${String(state.outwards.length + 1).padStart(5, "0")}`;

function newOutward() {
  outwardDraft = {
    department: "Kitchen",
    store: state.currentStore,
    date: today,
    issuedTo: "",
    reference: "",
    remarks: "",
    items: [{ product: state.products[0]?.name || "", qty: 1 }],
    isNew: true
  };
  showView("outward");
}

function outwardScreen() {
  const totalQty = outwardDraft.items.reduce((a, i) => a + (Number(i.qty) || 0), 0);
  return layout(
    "Stock Outward Voucher",
    "Issue stock to kitchen, bar or bakery with real-time stock validation.",
    `<button class="secondary" onclick="showView('outward')">Cancel</button>
     <button class="primary" id="btn-save-outward" onclick="saveOutward()">Save Outward (F8)</button>`,
    `
      <div class="voucher-container">
        <div class="voucher-command-bar">
          <b>Stock Issue Entry</b>
          <span>F5: Add line</span>
          <span>F8: Save issue</span>
          <span>Esc: Cancel</span>
        </div>

        <div class="voucher-header-card">
          <div class="voucher-header-top">
            <div>
              <span style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;">Voucher No</span>
              <div class="voucher-no-badge">${nextOutwardNo()}</div>
            </div>
            <span class="status expiry">DRAFT</span>
          </div>

          <div class="voucher-grid-fields">
            <div class="voucher-field">
              <label>Issue Date</label>
              <input type="date" value="${outwardDraft.date}" onchange="outwardDraft.date=this.value">
            </div>
            <div class="voucher-field">
              <label>Issuing Department</label>
              <select onchange="outwardDraft.department=this.value">
                ${departments.map(d => `<option ${d === outwardDraft.department ? 'selected' : ''}>${d}</option>`).join("")}
              </select>
            </div>
            <div class="voucher-field">
              <label>Source Warehouse</label>
              <select onchange="outwardDraft.store=this.value">
                ${state.stores.map(s => `<option ${s[0] === outwardDraft.store ? 'selected' : ''}>${s[0]}</option>`).join("")}
              </select>
            </div>
            <div class="voucher-field">
              <label>Issued To (Chef / Staff)</label>
              <input value="${outwardDraft.issuedTo || ''}" placeholder="Staff member..." oninput="outwardDraft.issuedTo=this.value">
            </div>
            <div class="voucher-field">
              <label>Remarks</label>
              <input value="${outwardDraft.remarks || ''}" placeholder="Recipe consumption..." oninput="outwardDraft.remarks=this.value">
            </div>
          </div>
        </div>

        <div class="voucher-items-card">
          <div class="panel-head">
            <span class="panel-title">Stock Outward Lines</span>
            <button class="primary" style="padding:4px 10px;font-size:12px;" onclick="addOutwardRow()">＋ Add Item (F5)</button>
          </div>
          <div class="voucher-table-wrap">
            <table class="voucher-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Item Name</th>
                  <th>Available Stock</th>
                  <th style="width:140px;">Issue Qty</th>
                  <th>Unit</th>
                  <th>Unit Rate</th>
                  <th>Amount</th>
                  <th></th>
                </tr>
              </thead>
              <tbody id="outward-items-body">
                ${renderOutwardTableRows()}
              </tbody>
            </table>
          </div>
        </div>

        <div class="voucher-footer">
          <div class="validation-note valid" id="outward-validation-box">
            ✓ Quantities verified against warehouse stock
          </div>
          <div class="total-box">
            <span>Total Units: <b id="outward-total-units">${numberValue(totalQty)}</b></span>
            <strong>Total Valuation: <span id="outward-total-amt">${money(outwardTotal())}</span></strong>
          </div>
        </div>
      </div>
    `
  );
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
    const isExceeded = item.qty > available;
    const amt = (Number(item.qty) || 0) * (Number(p?.cost) || 0);
    return `
      <tr data-row="${idx}">
        <td>${idx + 1}</td>
        <td>
          <input list="products-datalist" value="${item.product || ''}" placeholder="Select item..." onchange="updateOutwardItemName(${idx}, this.value)">
        </td>
        <td>
          <span class="pill" id="out-avail-${idx}" style="${available <= 0 ? 'background:var(--red-soft);color:var(--red);' : ''}">${numberValue(available)} ${p?.unit || 'unit'}</span>
        </td>
        <td>
          <input type="number" step="0.01" min="0" value="${item.qty}" oninput="updateOutwardItemQty(${idx}, this.value)" style="${isExceeded ? 'border-color:var(--red);' : ''}">
        </td>
        <td style="color:#64748b;font-weight:600;">${p?.unit || 'unit'}</td>
        <td class="num-cell">${money(p?.cost || 0)}</td>
        <td class="num-cell" id="out-amt-${idx}" style="font-weight:700;">${money(amt)}</td>
        <td>
          <button class="row-delete" onclick="removeOutwardRow(${idx})">×</button>
        </td>
      </tr>
    `;
  }).join("") || '<tr><td colspan="8" class="empty-state">No items. Click "+ Add Item" to issue stock.</td></tr>';
}

function updateOutwardItemName(idx, name) {
  if (!outwardDraft.items[idx]) return;
  outwardDraft.items[idx].product = name;
  const p = productByName(name);
  const row = document.querySelector(`#outward-items-body tr[data-row="${idx}"]`);
  if (row && p) {
    const availPill = document.getElementById(`out-avail-${idx}`);
    if (availPill) availPill.textContent = `${numberValue(p.stock)} ${p.unit}`;
  }
  refreshOutwardTotals();
}

function updateOutwardItemQty(idx, val) {
  if (!outwardDraft.items[idx]) return;
  outwardDraft.items[idx].qty = Number(val) || 0;
  const p = productByName(outwardDraft.items[idx].product);
  const amtCell = document.getElementById(`out-amt-${idx}`);
  if (amtCell) amtCell.textContent = money(outwardDraft.items[idx].qty * (p?.cost || 0));
  refreshOutwardTotals();
}

function refreshOutwardTotals() {
  const totalQty = outwardDraft.items.reduce((a, i) => a + (Number(i.qty) || 0), 0);
  const qtyEl = document.getElementById("outward-total-units");
  if (qtyEl) qtyEl.textContent = numberValue(totalQty);
  const valEl = document.getElementById("outward-total-amt");
  if (valEl) valEl.textContent = money(outwardTotal());

  const hasExceeded = outwardDraft.items.some(i => {
    const p = productByName(i.product);
    return !p || (i.qty > p.stock && !state.settings.inventory?.negative);
  });
  const vBox = document.getElementById("outward-validation-box");
  const saveBtn = document.getElementById("btn-save-outward");
  if (vBox) {
    vBox.className = "validation-note " + (hasExceeded ? "has-error" : "valid");
    vBox.textContent = hasExceeded ? "⚠ Some items exceed available warehouse stock" : "✓ Quantities verified against warehouse stock";
  }
  if (saveBtn) saveBtn.disabled = hasExceeded;
}

function addOutwardRow() {
  outwardDraft.items.push({ product: state.products[0]?.name || "", qty: 1 });
  const tbody = document.getElementById("outward-items-body");
  if (tbody) tbody.innerHTML = renderOutwardTableRows();
  refreshOutwardTotals();
}

function removeOutwardRow(idx) {
  outwardDraft.items.splice(idx, 1);
  const tbody = document.getElementById("outward-items-body");
  if (tbody) tbody.innerHTML = renderOutwardTableRows();
  refreshOutwardTotals();
}

function saveOutward() {
  if (!outwardDraft.items.length) { toast("Add at least one item to issue"); return; }
  const invalid = outwardDraft.items.some(i => {
    const p = productByName(i.product);
    return !p || !i.qty || (i.qty > p.stock && !state.settings.inventory?.negative);
  });
  if (invalid) {
    toast("Please resolve stock errors before saving");
    return;
  }
  confirmModal("Post Stock Outward voucher and deduct from inventory?", () => {
    const no = nextOutwardNo();
    const now = new Date().toISOString();
    const items = outwardDraft.items.map(i => {
      const p = productByName(i.product);
      return {
        ...i,
        unit: p?.unit || "unit",
        rate: p?.cost || 0,
        amount: Number(i.qty) * (p?.cost || 0)
      };
    });
    const total = items.reduce((a, i) => a + i.amount, 0);

    items.forEach(i => {
      state.transactions.unshift({
        id: "TX-" + Date.now() + Math.random().toString(36).slice(2, 6),
        date: outwardDraft.date + "T12:00:00",
        type: "Stock Outward",
        product: i.product,
        department: outwardDraft.department,
        store: outwardDraft.store,
        qty: -Number(i.qty),
        cost: Number(i.rate),
        user: state.currentUser,
        ref: no
      });
    });

    state.outwards.unshift({
      ...outwardDraft,
      no,
      items,
      total,
      user: state.currentUser,
      status: "Posted",
      createdAt: now
    });

    rebuildStock();
    toast(no + " posted successfully!");
    outwardDraft.isNew = false;
    showView("outward");
  });
}

function outwardHistory() {
  return layout(
    "Stock Outward",
    "Department issues, consumption records and outward registers.",
    `<button class="secondary" onclick="exportOutwardCsv()">Export CSV</button>
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
                  <td>${v.store || "Downtown Kitchen"}</td>
                  <td>${v.issuedTo || "—"}</td>
                  <td>${v.items?.length || 0}</td>
                  <td class="num-cell" style="font-weight:700;">${money(v.total)}</td>
                  <td>${v.user}</td>
                  <td><span class="status ok">${v.status || "Posted"}</span></td>
                  <td style="text-align:right;">
                    <button class="secondary" style="padding:4px 8px;font-size:11px;" onclick="printVoucherPreview('Outward', '${v.no}')">Print / PDF</button>
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
function printVoucherPreview(kind, no) {
  const isPurchase = kind === "Purchase";
  const voucher = isPurchase ? state.purchases.find(x => x.no === no) : state.outwards.find(x => x.no === no);
  if (!voucher) { toast("Voucher not found"); return; }

  const items = voucher.items || [];
  openInAppModal(`${isPurchase ? 'PURCHASE INVOICE' : 'STOCK ISSUE VOUCHER'} — ${voucher.no}`, `
    <div class="printable-voucher" id="print-area">
      <div class="pv-header">
        <div>
          <h1>${state.settings.general?.company || "StockSense Kitchen"}</h1>
          <p style="margin:2px 0;color:#64748b;">${state.settings.general?.address || "124 Culinary Way"} · ${state.settings.general?.phone || ""}</p>
        </div>
        <div style="text-align:right;">
          <h2>${isPurchase ? "GOODS RECEIPT NOTE" : "STOCK OUTWARD NOTE"}</h2>
          <div style="font-family:'Plus Jakarta Sans';font-weight:800;color:var(--blue);font-size:16px;">${voucher.no}</div>
          <span style="color:#64748b;font-size:12px;">${fmtDate(voucher.date)}</span>
        </div>
      </div>

      <div class="pv-meta">
        <div><b>Warehouse:</b> ${voucher.store || "Downtown Kitchen"}</div>
        <div><b>${isPurchase ? "Supplier:" : "Department:"}</b> ${isPurchase ? voucher.supplier : voucher.department}</div>
        <div><b>Recorded By:</b> ${voucher.user || state.currentUser}</div>
        ${voucher.reference ? `<div><b>Reference:</b> ${voucher.reference}</div>` : ''}
        ${voucher.issuedTo ? `<div><b>Issued To:</b> ${voucher.issuedTo}</div>` : ''}
        <div><b>Status:</b> ${voucher.status || "Posted"}</div>
      </div>

      <table class="table" style="margin-top:12px;">
        <thead>
          <tr>
            <th>#</th>
            <th>Item Description</th>
            <th style="text-align:right;">Quantity</th>
            <th>Unit</th>
            <th style="text-align:right;">Rate</th>
            <th style="text-align:right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${items.map((i, idx) => `
            <tr>
              <td>${idx + 1}</td>
              <td><b>${i.product}</b></td>
              <td class="num-cell" style="text-align:right;">${numberValue(i.qty)}</td>
              <td>${i.unit}</td>
              <td class="num-cell" style="text-align:right;">${money(i.rate)}</td>
              <td class="num-cell" style="text-align:right;"><b>${money(i.amount)}</b></td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <div style="display:flex;justify-content:flex-end;margin-top:20px;padding-top:12px;border-top:2px solid #e2e8f0;font-size:16px;">
        <div><b>Total: </b><span style="font-family:'JetBrains Mono';font-weight:800;color:var(--blue);margin-left:8px;">${money(voucher.total)}</span></div>
      </div>

      ${voucher.remarks ? `<div style="margin-top:16px;font-size:12px;color:#64748b;"><b>Remarks:</b> ${voucher.remarks}</div>` : ''}
    </div>
  `, `
    <button class="secondary" onclick="closeModal()">Close</button>
    <button class="primary" onclick="window.print()">Print Document</button>
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
                    <button class="secondary" style="padding:4px 8px;font-size:11px;" onclick="newPurchaseOrder([{product:state.products[0]?.name||'',qty:10,rate:10}])">Create PO</button>
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

// REPORTS & ANALYTICS
let reportFiltersState = { range: "This Month", department: "All", type: "All", search: "" };

function universalReports() {
  const types = ["All", "Purchase", "Stock Outward", "Transfer in", "Transfer out", "Adjustment", "Wastage", "Consumption"];
  const rows = getFilteredReportRows();

  const purchaseVal = rows.filter(t => t.type === "Purchase").reduce((a, t) => a + Math.abs(t.qty) * (t.cost || 0), 0);
  const issueVal = rows.filter(t => t.type === "Stock Outward" || t.type === "Consumption").reduce((a, t) => a + Math.abs(t.qty) * (t.cost || 0), 0);
  const qtyTotal = rows.reduce((a, t) => a + Math.abs(t.qty), 0);

  return layout(
    "Analytics & Reports",
    "Audited ledger transactions and comprehensive inventory activity.",
    `<button class="secondary" onclick="exportReportData()">Export Filtered CSV</button>
     <button class="secondary" onclick="window.print()">Print</button>`,
    `
      <div class="filterbar">
        <select onchange="reportFiltersState.range=this.value;showView('reports')">
          <option ${reportFiltersState.range === 'This Month' ? 'selected' : ''}>This Month</option>
          <option ${reportFiltersState.range === 'Today' ? 'selected' : ''}>Today</option>
          <option ${reportFiltersState.range === 'All Time' ? 'selected' : ''}>All Time</option>
        </select>
        <select onchange="reportFiltersState.type=this.value;showView('reports')">
          ${types.map(t => `<option ${reportFiltersState.type === t ? 'selected' : ''}>${t}</option>`).join("")}
        </select>
        <select onchange="reportFiltersState.department=this.value;showView('reports')">
          <option value="All">All Departments</option>
          ${departments.map(d => `<option ${reportFiltersState.department === d ? 'selected' : ''}>${d}</option>`).join("")}
        </select>
        <input placeholder="Search item or user..." value="${reportFiltersState.search}" oninput="reportFiltersState.search=this.value;showView('reports')">
      </div>

      <div class="metrics">
        ${metric("Matching Records", rows.length, "⌁", "blue", "Filtered transactions")}
        ${metric("Total Units", numberValue(qtyTotal), "▣", "green", "Movement quantity")}
        ${metric("Purchases Value", money(purchaseVal), "↗", "green", "Received into stock")}
        ${metric("Issues Value", money(issueVal), "↘", "amber", "Departmental usage")}
      </div>

      <div class="panel">
        <div class="panel-head">
          <span class="panel-title">Audit Ledger</span>
          <span class="pill">${rows.length} transactions</span>
        </div>
        <div class="view-table">
          ${ledgerRows(rows)}
        </div>
      </div>
    `
  );
}

function getFilteredReportRows() {
  const q = reportFiltersState.search.toLowerCase();
  return state.transactions.filter(t => {
    const matchQ = !q || t.product.toLowerCase().includes(q) || (t.user || "").toLowerCase().includes(q) || (t.ref || "").toLowerCase().includes(q);
    const matchType = reportFiltersState.type === "All" || t.type === reportFiltersState.type;
    const matchDept = reportFiltersState.department === "All" || t.department === reportFiltersState.department;
    let matchRange = true;
    if (reportFiltersState.range === "Today") matchRange = dateKey(t.date) === today;
    return matchQ && matchType && matchDept && matchRange;
  });
}

function exportReportData() {
  const rows = [
    ["Reference", "Date", "Transaction Type", "Item", "Warehouse", "Quantity", "Cost Rate", "Total Value", "User"],
    ...getFilteredReportRows().map(t => [t.ref || "", t.date, t.type, t.product, t.store || "", t.qty, t.cost || 0, (Math.abs(t.qty) * (t.cost || 0)).toFixed(2), t.user || ""])
  ];
  downloadCsv("stocksense-audit-report.csv", rows);
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
                    <td>${s[2] || "Alex Kim"}</td>
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
              ${state.users.map((u, idx) => `
                <tr>
                  <td>
                    <div class="product-cell">
                      <div class="avatar">${u.name.split(" ").map(w=>w[0]).join("").slice(0,2)}</div>
                      <div>
                        <b>${u.name}</b>
                        ${u.name === state.currentUser ? '<span class="tag" style="margin-left:6px;">Current User</span>' : ''}
                      </div>
                    </div>
                  </td>
                  <td>${u.role}</td>
                  <td>${u.location || "All locations"}</td>
                  <td><span class="status ok">${u.active ? "Active" : "Inactive"}</span></td>
                  <td style="text-align:right;">
                    <button class="secondary" style="padding:4px 8px;font-size:11px;" onclick="openModal('user', ${idx})">Edit</button>
                    ${u.name !== state.currentUser ? `<button class="secondary" style="padding:4px 8px;font-size:11px;" onclick="switchUser('${u.name}')">Switch to</button>` : ''}
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

// SETTINGS
function settingsScreen() {
  const g = state.settings.general || {};
  const inv = state.settings.inventory || {};
  const t = state.settings.transactions || {};

  return layout(
    "Settings",
    "Configure company identity, inventory decimals and system behaviors.",
    `<button class="primary" onclick="save();toast('Settings updated')">Save Changes</button>`,
    `
      <div class="settings-layout">
        <div class="settings-nav">
          <button class="active" onclick="document.getElementById('set-general').scrollIntoView({behavior:'smooth'})">General</button>
          <button onclick="document.getElementById('set-inventory').scrollIntoView({behavior:'smooth'})">Inventory Rules</button>
          <button onclick="document.getElementById('set-vouchers').scrollIntoView({behavior:'smooth'})">Vouchers</button>
          <button onclick="document.getElementById('set-backup').scrollIntoView({behavior:'smooth'})">Backup & Data</button>
        </div>

        <div class="settings-content">
          <div id="set-general" class="settings-section">
            <h2>Business & General Profile</h2>
            <p>Identity displayed on Goods Receipt and Outward vouchers.</p>
            <div class="settings-grid">
              <label class="setting-field">
                <span>Business Name</span>
                <input value="${g.company || ''}" onchange="setField('general.company', this.value);save()">
              </label>
              <label class="setting-field">
                <span>Phone</span>
                <input value="${g.phone || ''}" onchange="setField('general.phone', this.value);save()">
              </label>
              <label class="setting-field">
                <span>Email Address</span>
                <input value="${g.email || ''}" onchange="setField('general.email', this.value);save()">
              </label>
              <label class="setting-field">
                <span>Address</span>
                <input value="${g.address || ''}" onchange="setField('general.address', this.value);save()">
              </label>
            </div>
          </div>

          <div id="set-inventory" class="settings-section">
            <h2>Inventory & Calculations</h2>
            <p>Numeric precision and stock threshold controls.</p>
            <div class="settings-grid">
              <label class="setting-field">
                <span>Display Decimals</span>
                <select onchange="state.settings.decimals=Number(this.value);save()">
                  <option value="0" ${state.settings.decimals === 0 ? 'selected' : ''}>0 decimals (Whole units)</option>
                  <option value="1" ${state.settings.decimals === 1 ? 'selected' : ''}>1 decimal (0.1)</option>
                  <option value="2" ${state.settings.decimals === 2 ? 'selected' : ''}>2 decimals (0.01)</option>
                  <option value="3" ${state.settings.decimals === 3 ? 'selected' : ''}>3 decimals (0.001)</option>
                </select>
              </label>
              <label class="setting-field">
                <span>Default Low-Stock Threshold</span>
                <input type="number" value="${inv.lowThreshold || 10}" onchange="setField('inventory.lowThreshold', Number(this.value));save()">
              </label>
            </div>
            <label class="setting-toggle">
              <div>
                <b>Allow Negative Stock Issues</b>
                <small>Permit outward vouchers even when stock drops below 0</small>
              </div>
              <input type="checkbox" ${inv.negative ? 'checked' : ''} onchange="setField('inventory.negative', this.checked);save()">
              <i></i>
            </label>
          </div>

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
            </div>
          </div>

          <div id="set-backup" class="settings-section">
            <h2>Backup & Local Storage</h2>
            <p>Export your full StockSense database to JSON.</p>
            <div style="display:flex;gap:10px;">
              <button class="secondary" onclick="exportFullBackup()">Download Backup JSON</button>
              <button class="danger-btn" onclick="resetDefaults()">Reset to Defaults</button>
            </div>
          </div>
        </div>
      </div>
    `
  );
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
          <label>Cost Rate ($)</label>
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
    openInAppModal("Add New Supplier", `
      <div class="form-grid">
        <div class="form-field full">
          <label>Supplier Name *</label>
          <input id="m-sup-name" placeholder="e.g. Supreme Seafood Inc.">
        </div>
        <div class="form-field">
          <label>Category</label>
          <input id="m-sup-cat" placeholder="e.g. Seafood & Meats">
        </div>
        <div class="form-field">
          <label>Contact Email / Phone</label>
          <input id="m-sup-contact" placeholder="orders@supremeseafood.com">
        </div>
        <div class="form-field">
          <label>Lead Time (Days)</label>
          <input id="m-sup-lead" type="number" value="2">
        </div>
      </div>
    `, `
      <button class="secondary" onclick="closeModal()">Cancel</button>
      <button class="primary" onclick="submitNewSupplier()">Save Supplier</button>
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
            <option ${existing?.role === 'Owner' ? 'selected' : ''}>Owner</option>
            <option ${existing?.role === 'Store manager' ? 'selected' : ''}>Store manager</option>
            <option ${existing?.role === 'Inventory clerk' ? 'selected' : ''}>Inventory clerk</option>
            <option ${existing?.role === 'Chef' ? 'selected' : ''}>Chef</option>
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

function submitNewSupplier() {
  const name = document.getElementById("m-sup-name")?.value.trim();
  if (!name) { toast("Supplier name is required"); return; }
  const cat = document.getElementById("m-sup-cat")?.value.trim() || "General";
  const contact = document.getElementById("m-sup-contact")?.value.trim() || "";
  const lead = Number(document.getElementById("m-sup-lead")?.value) || 2;

  state.suppliers.push([name, cat, contact, lead, 0]);
  save();
  closeModal();
  showView("suppliers");
  toast("Supplier saved");
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
  else if (view === "suppliers") html = suppliersScreen();
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
    if (document.getElementById("modal-root")?.children.length) closeModal();
    else closeAllPopovers();
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
