
// StockSense - High Performance Restaurant Inventory OS
const seed = {
  products: [
    {id:1,name:"Paneer",sku:"DAI-001",barcode:"8901001001",category:"Dairy",unit:"kg",stock:7.2,min:10,reorder:14,max:24,cost:11.8,purchaseCost:11.8,store:"Main Store",expiry:"2026-09-22",icon:"🧀"},
    {id:2,name:"Tomato",sku:"VEG-001",barcode:"8901001002",category:"Vegetables",unit:"kg",stock:14,min:8,reorder:12,max:25,cost:3.4,purchaseCost:3.4,store:"Main Store",expiry:"2026-09-28",icon:"🍅"},
    {id:3,name:"Butter",sku:"DAI-002",barcode:"8901001003",category:"Dairy",unit:"kg",stock:8.4,min:6,reorder:9,max:16,cost:8.5,purchaseCost:8.5,store:"Main Store",expiry:"2026-10-04",icon:"🧈"},
    {id:4,name:"Cooking Cream",sku:"DAI-003",barcode:"8901001004",category:"Dairy",unit:"Ltr",stock:4.8,min:5,reorder:8,max:14,cost:6.4,purchaseCost:6.4,store:"Main Store",expiry:"2026-09-20",icon:"🥛"},
    {id:5,name:"Arabica Coffee Beans",sku:"BEV-001",barcode:"8901001005",category:"Beverages",unit:"kg",stock:18.5,min:12,reorder:16,max:30,cost:18.5,purchaseCost:18.5,store:"Main Store",expiry:"2026-10-06",icon:"☕"},
    {id:6,name:"Basmati Rice",sku:"PAN-013",barcode:"8901001006",category:"Pantry",unit:"kg",stock:42,min:20,reorder:28,max:60,cost:3.4,purchaseCost:3.4,store:"Cold Store",expiry:"2027-08-10",icon:"🍚"},
    {id:7,name:"Atta",sku:"PAN-014",barcode:"8901001007",category:"Flour & Grains",unit:"kg",stock:35,min:15,reorder:25,max:80,cost:38.0,purchaseCost:38.0,store:"Main Store",expiry:"2026-12-15",icon:"🌾"},
    {id:8,name:"Milk",sku:"DAI-004",barcode:"8901001008",category:"Dairy",unit:"Ltr",stock:24,min:10,reorder:20,max:50,cost:56.0,purchaseCost:56.0,store:"Cold Store",expiry:"2026-09-23",icon:"🥛"}
  ],
  transactions: [
    {id:"TX-1050",date:"2026-09-14T12:00:00",type:"Purchase",product:"Milk",store:"Cold Store",qty:24,cost:56.0,user:"Deepu Kumar",ref:"GRN-00219"},
    {id:"TX-1049",date:"2026-09-14T11:45:00",type:"Purchase",product:"Atta",store:"Main Store",qty:35,cost:38.0,user:"Akash Kumar",ref:"GRN-00219"},
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
    no: "GRN-00219",
    date: "2026-09-14",
    supplier: "Metro Provisions",
    store: "Main Store",
    reference: "INV-91040",
    remarks: "Atta flour bulk & fresh dairy milk delivery",
    items: [
      { product: "Atta", qty: 35, rate: 38.0, unit: "kg", amount: 1330.0 },
      { product: "Milk", qty: 24, rate: 56.0, unit: "Ltr", amount: 1344.0 }
    ],
    total: 2674.0,
    user: "Akash Kumar",
    status: "Posted",
    createdAt: "2026-09-14T11:45:00.000Z"
  },
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
const initialDefaultVendors = [
  ["Viraj Dairy", "Dairy & Milk", "virajdairy@gmail.com", 2, 0],
  ["Shree Vegetable", "Fresh Vegetables", "shreeveg@gmail.com", 2, 0]
];
initialDefaultVendors.slice().reverse().forEach(dv => {
  if (!state.suppliers.some(s => (s[0] || "").toLowerCase() === dv[0].toLowerCase())) {
    state.suppliers.unshift(dv);
  }
});
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

// Universal Item Name & Actual Unit Standardization Engine
function formatItemName(raw) {
  if (!raw || typeof raw !== "string") return "";
  const str = raw.trim();
  if (!str) return "";

  // Split on word boundaries while preserving special characters like / and -
  return str.replace(/\b([a-zA-Z0-9]+)\b/g, (match) => {
    const lower = match.toLowerCase();
    // Common measurement units that should remain lowercase or standard casing
    if (["kg", "ltr", "gm", "g", "ml", "pcs", "pkt", "box", "can", "tin", "doz"].includes(lower)) {
      return lower === "ltr" ? "Ltr" : lower;
    }
    // Roman numerals (II, III, IV, etc.)
    if (/^(ii|iii|iv|v|vi|vii|viii|ix|x)$/i.test(match)) {
      return match.toUpperCase();
    }
    // Handle composite token like 5kg or 500ml or 1Ltr
    const numUnitMatch = match.match(/^(\d+)([a-zA-Z]+)$/);
    if (numUnitMatch) {
      const u = numUnitMatch[2].toLowerCase();
      const mappedUnit = u === "ltr" ? "Ltr" : u;
      return numUnitMatch[1] + mappedUnit;
    }
    // Standard Title Case conversion: First letter uppercase, rest lowercase
    return match.charAt(0).toUpperCase() + match.slice(1).toLowerCase();
  });
}

function identifyItemUnit(name, existingUnit, category) {
  // If a specific, meaningful unit is already assigned (other than generic 'unit' or 'L' legacy), normalize and keep it
  if (existingUnit && existingUnit !== "unit" && existingUnit !== "undefined" && existingUnit !== "") {
    const uLow = existingUnit.toLowerCase().trim();
    if (uLow === "l" || uLow === "ltr" || uLow === "liter" || uLow === "litre") return "Ltr";
    if (uLow === "kg" || uLow === "kilogram" || uLow === "kgs") return "kg";
    if (uLow === "piece" || uLow === "pieces" || uLow === "pc" || uLow === "pcs") return "pcs";
    if (uLow === "gram" || uLow === "grams" || uLow === "gm" || uLow === "g") return "g";
    if (uLow === "milliliter" || uLow === "ml") return "ml";
    if (uLow === "packet" || uLow === "pkt" || uLow === "pack") return "pkt";
    if (uLow === "box" || uLow === "case") return "box";
    if (uLow === "bottle") return "bottle";
    if (uLow === "can" || uLow === "tin") return "can";
    if (uLow === "dozen" || uLow === "doz") return "doz";
    if (uLow === "tray") return "tray";
    return existingUnit;
  }

  const text = ((name || "") + " " + (category || "")).toLowerCase();

  // 1. Liquids & Beverages -> Ltr
  const liquidRegex = /\b(milk|dudh|cream|malai|oil|tel|ghee|vinegar|sauce|ketchup|syrup|crush|juice|water|soda|wine|beer|whisky|rum|spirit|beverage|drink|pepsi|coke|sprite|fanta|buttermilk|chhas|lassi|dishwash|phenyl|sanitizer|liquid|squash|cordial|soya sauce|chili sauce|tomato ketchup)\b/i;
  if (liquidRegex.test(text)) return "Ltr";

  // 2. Explicit grams/milliliters indicators in name
  if (/\b(\d+\s*g|\d+\s*gm|\d+\s*gram)\b/i.test(text)) return "g";
  if (/\b(\d+\s*ml)\b/i.test(text)) return "ml";

  // 3. Countable units (Eggs, Buns, Bakery, Cans, Bottles, Cylinders, Disposables) -> pcs / units
  const pcsRegex = /\b(egg|eggs|anda|bread|pav|bun|buns|base|cylinder|lpg|gas|napkin|napkins|tissue|tissues|foil|wrap|bag|bags|box|boxes|can|cans|tin|tins|bottle|bottles|piece|pieces|pcs|tray|trays|doz|dozen|container|containers|straw|straws|sponge|scrubber|pouch)\b/i;
  if (pcsRegex.test(text)) return "pcs";

  // 4. Default for solids, flours, grains, produce, vegetables, grocery, meats -> kg
  return "kg";
}

function identifyItemCategory(name) {
  const text = (name || "").toLowerCase();
  if (/\b(milk|paneer|butter|cream|cheese|dahi|curd|khoya|mawa|malai|ghee)\b/i.test(text)) return "Dairy";
  if (/\b(atta|maida|sooji|rava|besan|flour|wheat|grain|starch|corn flour)\b/i.test(text)) return "Flour & Grains";
  if (/\b(rice|chawal|basmati|dal|toor|moong|urad|chana|rajma|pulse|pulses|biryani rice)\b/i.test(text)) return "Pantry";
  if (/\b(tomato|potato|onion|ginger|garlic|chili|capsicum|veg|vegetable|coriander|mint|spinach|palak|mushroom|cabbage|cauliflower|carrot|beans|peas|lemon)\b/i.test(text)) return "Vegetables";
  if (/\b(chicken|mutton|fish|prawn|prawns|meat|lamb|pork|seafood|egg|eggs|anda)\b/i.test(text)) return "Non Veg & Poultry";
  if (/\b(oil|tel|mustard oil|sunflower oil|refined oil|vanaspati)\b/i.test(text)) return "Oils & Fats";
  if (/\b(masala|spice|spices|haldi|turmeric|jeera|cumin|salt|sugar|namak|cardamom|clove|cinnamon|pepper|chili powder)\b/i.test(text)) return "Spices & Seasoning";
  if (/\b(sauce|ketchup|vinegar|syrup|crush|mayo|mayonnaise)\b/i.test(text)) return "Sauces & Condiments";
  if (/\b(coffee|tea|chai|water|soda|juice|beverage|drink|cold drink|cola)\b/i.test(text)) return "Beverages";
  if (/\b(bread|bun|pav|pizza base|cake|croissant|pastry)\b/i.test(text)) return "Bakery";
  if (/\b(gas|cylinder|lpg|foil|napkin|tissue|bag|container|dishwash|phenyl|sanitizer)\b/i.test(text)) return "Housekeeping & Packaging";
  return "General";
}

function getItemIcon(name, category) {
  const text = ((name || "") + " " + (category || "")).toLowerCase();
  if (/\b(milk)\b/i.test(text)) return "🥛";
  if (/\b(atta|flour|wheat|grain)\b/i.test(text)) return "🌾";
  if (/\b(paneer|cheese)\b/i.test(text)) return "🧀";
  if (/\b(butter)\b/i.test(text)) return "🧈";
  if (/\b(cream)\b/i.test(text)) return "🥛";
  if (/\b(rice|chawal|basmati)\b/i.test(text)) return "🍚";
  if (/\b(coffee)\b/i.test(text)) return "☕";
  if (/\b(tea|chai)\b/i.test(text)) return "🍵";
  if (/\b(tomato)\b/i.test(text)) return "🍅";
  if (/\b(potato|aloo)\b/i.test(text)) return "🥔";
  if (/\b(onion|pyaz)\b/i.test(text)) return "🧅";
  if (/\b(chicken)\b/i.test(text)) return "🍗";
  if (/\b(meat|mutton|lamb)\b/i.test(text)) return "🥩";
  if (/\b(fish|prawn|seafood)\b/i.test(text)) return "🐟";
  if (/\b(egg|eggs)\b/i.test(text)) return "🥚";
  if (/\b(oil)\b/i.test(text)) return "🫒";
  if (/\b(chili|mirch|spice|masala)\b/i.test(text)) return "🌶️";
  if (/\b(bread|bun|pav)\b/i.test(text)) return "🍞";
  if (/\b(water|soda|drink|beverage)\b/i.test(text)) return "🥤";
  if (category === "Dairy") return "🧀";
  if (category === "Vegetables" || category === "Veg") return "🥦";
  if (category === "Non Veg" || category === "Non Veg & Poultry") return "🥩";
  if (category === "Beverages") return "☕";
  if (category === "Bakery") return "🥐";
  return "📦";
}

function renderUnitOptions(selectedUnit) {
  const normSelected = (selectedUnit === "L" || selectedUnit === "l") ? "Ltr" : (selectedUnit || "kg");
  const options = [
    { value: "kg", label: "kg (Kilogram)" },
    { value: "Ltr", label: "Ltr (Liter)" },
    { value: "g", label: "g (Gram)" },
    { value: "ml", label: "ml (Milliliter)" },
    { value: "pcs", label: "pcs (Pieces / Units)" },
    { value: "pkt", label: "pkt (Packet)" },
    { value: "box", label: "box (Box)" },
    { value: "can", label: "can (Can / Tin)" },
    { value: "bottle", label: "bottle (Bottle)" },
    { value: "doz", label: "doz (Dozen)" },
    { value: "tray", label: "tray (Tray)" },
    { value: "bundle", label: "bundle (Bundle)" }
  ];
  if (normSelected && !options.some(o => o.value === normSelected)) {
    options.push({ value: normSelected, label: normSelected });
  }
  return options.map(o => `<option value="${o.value}" ${o.value === normSelected ? 'selected' : ''}>${o.label}</option>`).join("");
}

function handleProdNameAutoDetect(val) {
  if (!val) return;
  const properName = formatItemName(val);
  const detectedUnit = identifyItemUnit(properName);
  const detectedCat = identifyItemCategory(properName);
  const unitSelect = document.getElementById("m-prod-unit");
  if (unitSelect && detectedUnit) {
    unitSelect.value = detectedUnit;
  }
  const catInput = document.getElementById("m-prod-cat");
  if (catInput && (!catInput.value || catInput.dataset.manual !== "true")) {
    catInput.value = detectedCat;
  }
}

function normalizeCatalogUnitsAndNames() {
  if (!Array.isArray(state.products)) return { updated: 0 };
  const nameMapping = {};
  let updatedCount = 0;

  state.products.forEach(p => {
    const oldName = p.name;
    const properName = formatItemName(p.name);
    const properUnit = identifyItemUnit(properName, p.unit, p.category);

    if (p.name !== properName || p.unit !== properUnit) {
      updatedCount++;
    }

    p.name = properName;
    p.unit = properUnit;
    if (p.category) p.category = formatItemName(p.category);
    if (!p.icon || p.icon === "📦" || p.icon === "?") {
      p.icon = getItemIcon(p.name, p.category);
    }

    if (oldName && oldName !== properName) {
      nameMapping[oldName] = properName;
    }
  });

  // Ensure Atta and Milk exist in catalog
  const hasAtta = state.products.some(p => p.name.toLowerCase() === "atta");
  if (!hasAtta) {
    const attaId = Math.max(0, ...state.products.map(p => Number(p.id) || 0)) + 1;
    state.products.push({
      id: attaId,
      name: "Atta",
      sku: "PAN-014",
      barcode: "8901001007",
      category: "Flour & Grains",
      department: "Kitchen",
      unit: "kg",
      stock: 35,
      min: 15,
      reorder: 25,
      max: 80,
      cost: 38.0,
      purchaseCost: 38.0,
      store: "Main Store",
      expiry: "2026-12-15",
      icon: "🌾"
    });
    if (!state.openingStock) state.openingStock = {};
    if (state.openingStock["Atta"] === undefined) state.openingStock["Atta"] = 35;
  }

  const hasMilk = state.products.some(p => p.name.toLowerCase() === "milk");
  if (!hasMilk) {
    const milkId = Math.max(0, ...state.products.map(p => Number(p.id) || 0)) + 1;
    state.products.push({
      id: milkId,
      name: "Milk",
      sku: "DAI-004",
      barcode: "8901001008",
      category: "Dairy",
      department: "Kitchen",
      unit: "Ltr",
      stock: 24,
      min: 10,
      reorder: 20,
      max: 50,
      cost: 56.0,
      purchaseCost: 56.0,
      store: "Cold Store",
      expiry: "2026-09-23",
      icon: "🥛"
    });
    if (!state.openingStock) state.openingStock = {};
    if (state.openingStock["Milk"] === undefined) state.openingStock["Milk"] = 24;
  }

  // Update transactions
  if (Array.isArray(state.transactions)) {
    state.transactions.forEach(t => {
      if (nameMapping[t.product]) t.product = nameMapping[t.product];
      else t.product = formatItemName(t.product);
    });
  }

  // Update purchases
  if (Array.isArray(state.purchases)) {
    state.purchases.forEach(pr => {
      (pr.items || []).forEach(it => {
        if (nameMapping[it.product]) it.product = nameMapping[it.product];
        else it.product = formatItemName(it.product);
        const prod = state.products.find(p => p.name === it.product);
        it.unit = prod?.unit || identifyItemUnit(it.product, it.unit);
      });
    });
  }

  // Update outwards
  if (Array.isArray(state.outwards)) {
    state.outwards.forEach(o => {
      (o.items || []).forEach(it => {
        if (nameMapping[it.product]) it.product = nameMapping[it.product];
        else it.product = formatItemName(it.product);
        const prod = state.products.find(p => p.name === it.product);
        it.unit = prod?.unit || identifyItemUnit(it.product, it.unit);
      });
    });
  }

  // Update purchase orders
  if (Array.isArray(state.purchaseOrders)) {
    state.purchaseOrders.forEach(po => {
      (po.items || []).forEach(it => {
        if (nameMapping[it.product]) it.product = nameMapping[it.product];
        else it.product = formatItemName(it.product);
      });
    });
  }

  // Update openingStock map
  if (state.openingStock) {
    Object.keys(nameMapping).forEach(oldKey => {
      const newKey = nameMapping[oldKey];
      if (state.openingStock[oldKey] !== undefined) {
        state.openingStock[newKey] = state.openingStock[oldKey];
        delete state.openingStock[oldKey];
      }
    });
  }

  // Update stock audits if any
  if (Array.isArray(state.stockAudits)) {
    state.stockAudits.forEach(audit => {
      (audit.adjustments || []).forEach(adj => {
        if (nameMapping[adj.product]) adj.product = nameMapping[adj.product];
        else adj.product = formatItemName(adj.product);
        const prod = state.products.find(p => p.name === adj.product);
        if (prod) adj.unit = prod.unit;
      });
    });
  }

  return { updated: updatedCount };
}

// Automatically normalize all item names and units on startup
normalizeCatalogUnitsAndNames();

// Bootstrap closing stock import on initial first run or if products list is not loaded
if (typeof closingStockImport !== "undefined" && (!state.products || state.products.length < 50 || !state.imports?.closingAugust2026V2)) {
  state.products = closingStockImport.map(p => {
    const properName = formatItemName(p.name);
    let cat = (p.category === "Grocery" || p.category === "Groceries") ? "Groceries" : (p.category || "General");
    let u = p.unit === "unit" ? (identifyItemUnit(properName) || "kg") : (p.unit || "kg");
    if (u === "unit" && /atta|maida|flour|besan|rawa|rice|dal|chana|salt|sugar|masur|watana|peanut|soya|moog|rajma/i.test(properName)) u = "kg";
    return {
      ...p,
      name: properName,
      category: cat,
      unit: u,
      icon: getItemIcon(properName, cat)
    };
  });
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
const formatMoneyValue = n => {
  const num = Number(n) || 0;
  return num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

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
  const formatted = formatItemName(trimmed);
  const identifiedUnit = identifyItemUnit(formatted);
  const identifiedCat = identifyItemCategory(formatted);
  const newProd = {
    id: Date.now(),
    name: formatted,
    sku: "ITEM-" + String(state.products.length + 1).padStart(3, "0"),
    category: identifiedCat,
    department: "Kitchen",
    unit: identifiedUnit,
    stock: 0,
    min: 5,
    reorder: 10,
    max: 50,
    cost: 10,
    purchaseCost: 10,
    store: state.currentStore,
    icon: getItemIcon(formatted, identifiedCat),
    active: true
  };
  state.products.push(newProd);
  if (!state.openingStock) state.openingStock = {};
  if (state.openingStock[formatted] === undefined) state.openingStock[formatted] = 0;
  save();
  if (currentSearchPopover.onSelect) {
    currentSearchPopover.onSelect(newProd);
  }
  closeProductSearchPopover();
  toast(`Created and selected "${formatted}" (${identifiedUnit})`);
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
  const role = state.currentUserRole || state.users.find(u => u.name === state.currentUser)?.role || "Admin";
  if (userRoleEl) userRoleEl.textContent = role;

  const topUserName = document.getElementById("topbar-user-name");
  if (topUserName) topUserName.textContent = state.currentUser || "Admin User";
  const topUserRole = document.getElementById("topbar-user-role");
  if (topUserRole) topUserRole.textContent = role;
  const topRoleSelect = document.getElementById("top-role-select");
  if (topRoleSelect) topRoleSelect.value = role;

  const avatarEl = document.getElementById("sidebar-avatar");
  if (avatarEl) avatarEl.textContent = (state.currentUser || "AD").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const lowCount = state.products.filter(p => p.stock < (p.min || state.settings.inventory?.lowThreshold || 5)).length;
  const badge = document.getElementById("stock-badge");
  if (badge) {
    badge.textContent = lowCount;
    badge.style.display = lowCount > 0 ? "inline-block" : "none";
  }
  const notifDot = document.getElementById("notif-badge");
  if (notifDot) notifDot.classList.toggle("show", lowCount > 0);
}

function switchCurrentUserRole(role) {
  let user = state.users.find(u => (u.role || "").toLowerCase() === role.toLowerCase());
  if (!user) {
    user = { name: role + " User", role: role };
    state.users.push(user);
  }
  state.currentUser = user.name;
  state.currentUserRole = role;
  save();
  updateSidebarMeta();
  toast("Switched active profile to " + user.name + " (" + role + ")");
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

// ==========================================================================
// STOCK LEDGER BALANCE (MATCHING EXACT SCREENSHOT SPECIFICATION)
// ==========================================================================
let stockLedgerFilters = {
  startDateStr: "01-09-2026",
  endDateStr: "30-09-2026",
  startDate: "2026-09-01",
  endDate: "2026-09-30",
  search: "",
  category: "All",
  page: 1,
  pageSize: 50
};

// Formats display names while preserving original brand casing
function formatItemNameDisplay(raw) {
  if (!raw) return "";
  const name = String(raw).trim();
  const lower = name.toLowerCase();
  if (lower === "atta") return "Atta";
  if (lower === "maida") return "Maida";
  if (lower === "corn flour") return "Corn Flour";
  if (lower === "besan") return "Besan";
  if (lower === "rawa") return "Rawa";
  return name;
}

// Clean numeric display: integer if whole, 1 decimal otherwise
function formatLedgerQty(n) {
  const num = Number(n) || 0;
  if (Math.abs(num - Math.round(num)) < 0.001) {
    return Math.round(num).toString();
  }
  return num.toFixed(1).replace(/\.0$/, "");
}

// Compute Carry Forward, Total Receipts, Total Consumption, and Month Closing
function calculateItemLedger(p) {
  // Carry Forward: opening stock before or as of start date
  const initial = Number(state.openingStock && state.openingStock[p.name] !== undefined ? state.openingStock[p.name] : p.stock) || 0;
  const priorTxNet = state.transactions
    .filter(t => t.product === p.name && t.date < stockLedgerFilters.startDate)
    .reduce((sum, t) => sum + (Number(t.qty) || 0), 0);
  const carryForward = initial + priorTxNet;

  // Total Receipts: inward stock within date range
  const receipts = state.transactions
    .filter(t => t.product === p.name && t.date >= stockLedgerFilters.startDate && t.date <= stockLedgerFilters.endDate + "T23:59:59" && (t.type === 'Purchase' || t.type === 'Inward' || (Number(t.qty) > 0 && t.type !== 'Physical Stock' && t.type !== 'Audit Correction')))
    .reduce((sum, t) => sum + (Number(t.qty) || 0), 0);

  // Total Consumption: outward stock within date range
  const consumption = state.transactions
    .filter(t => t.product === p.name && t.date >= stockLedgerFilters.startDate && t.date <= stockLedgerFilters.endDate + "T23:59:59" && (t.type === 'Outward' || t.type === 'Consumption' || t.type === 'Sale' || (Number(t.qty) < 0 && t.type !== 'Physical Stock' && t.type !== 'Audit Correction')))
    .reduce((sum, t) => sum + Math.abs(Number(t.qty) || 0), 0);

  // Month Closing = Carry Forward + Receipts - Consumption
  const closing = carryForward + receipts - consumption;

  return { carryForward, receipts, consumption, closing };
}

function getFilteredStockLedgerProducts() {
  const q = stockLedgerFilters.search.toLowerCase();
  return state.products.filter(p => {
    const matchQ = !q || p.name.toLowerCase().includes(q) || (p.hsn && p.hsn.toLowerCase().includes(q)) || (p.category && p.category.toLowerCase().includes(q));
    const matchCat = stockLedgerFilters.category === "All" || p.category === stockLedgerFilters.category;
    return matchQ && matchCat;
  });
}

function renderStockLedgerRows() {
  const filtered = getFilteredStockLedgerProducts();
  const start = (stockLedgerFilters.page - 1) * stockLedgerFilters.pageSize;
  const pageItems = filtered.slice(start, start + stockLedgerFilters.pageSize);

  if (pageItems.length === 0) {
    return `<tr><td colspan="6" style="text-align:center;padding:48px;color:#94a3b8;font-size:14px;">No items match the selected search or category filter.</td></tr>`;
  }

  return pageItems.map(p => {
    const data = calculateItemLedger(p);
    const displayName = formatItemNameDisplay(p.name);
    const unitDisplay = (p.unit && p.unit.toLowerCase() !== "unit" ? p.unit : "KG").toUpperCase();
    const hsnDisplay = p.hsn || "---";

    return `
      <tr>
        <td class="cell-desc">
          <span class="stock-item-name">${escapeHtml(displayName)}</span>
          <span class="stock-item-sub">HSN: ${escapeHtml(hsnDisplay)} • UNIT: ${escapeHtml(unitDisplay)}</span>
        </td>
        <td class="cell-cf">${formatLedgerQty(data.carryForward)}</td>
        <td class="cell-receipts">${formatLedgerQty(data.receipts)}</td>
        <td class="cell-consumption">${formatLedgerQty(data.consumption)}</td>
        <td class="cell-closing">${formatLedgerQty(data.closing)}</td>
        <td class="cell-audit">
          <div class="stock-audit-actions">
            <button type="button" class="btn-audit-correct" onclick="openStockAuditModal(${p.id})">CORRECT</button>
            <button type="button" class="btn-icon-action" title="Edit Item Details" onclick="openEditProductModal(${p.id})">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </button>
            <button type="button" class="btn-icon-action delete" title="Delete Item" onclick="deleteStockProduct(${p.id})">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function updateStockCountFooter() {
  const filtered = getFilteredStockLedgerProducts();
  const start = (stockLedgerFilters.page - 1) * stockLedgerFilters.pageSize;
  const countEl = document.getElementById("stock-shown-count");
  if (countEl) {
    countEl.innerHTML = `Showing <b>${filtered.length > 0 ? start + 1 : 0}–${Math.min(filtered.length, start + stockLedgerFilters.pageSize)}</b> of <b>${filtered.length}</b> catalogue items`;
  }
}

function handleStockDateChange() {
  const startVal = document.getElementById("stock-date-start")?.value.trim() || "01-09-2026";
  const endVal = document.getElementById("stock-date-end")?.value.trim() || "30-09-2026";
  
  stockLedgerFilters.startDateStr = startVal;
  stockLedgerFilters.endDateStr = endVal;

  const parseDMY = s => {
    const parts = s.split("-");
    if (parts.length === 3) {
      if (parts[0].length === 4) return s;
      return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
    }
    return s;
  };

  stockLedgerFilters.startDate = parseDMY(startVal);
  stockLedgerFilters.endDate = parseDMY(endVal);

  const startDt = new Date(stockLedgerFilters.startDate);
  if (!isNaN(startDt.getTime())) {
    const monthName = startDt.toLocaleDateString("en-US", { month: "long" }).toUpperCase();
    const year = startDt.getFullYear();
    const scopeLabel = document.getElementById("stock-ledger-scope-label");
    if (scopeLabel) scopeLabel.textContent = `REPORTING SCOPE: ${monthName} ${year}`;
  }

  const tbody = document.getElementById("stock-ledger-tbody");
  if (tbody) tbody.innerHTML = renderStockLedgerRows();
  updateStockCountFooter();
}

function handleStockSearch(val) {
  stockLedgerFilters.search = val.trim().toLowerCase();
  stockLedgerFilters.page = 1;
  const tbody = document.getElementById("stock-ledger-tbody");
  if (tbody) tbody.innerHTML = renderStockLedgerRows();
  updateStockCountFooter();
}

function handleStockCategoryChange(val) {
  stockLedgerFilters.category = val;
  stockLedgerFilters.page = 1;
  const tbody = document.getElementById("stock-ledger-tbody");
  if (tbody) tbody.innerHTML = renderStockLedgerRows();
  updateStockCountFooter();
}

function inventory() {
  const categories = [...new Set(state.products.map(p => p.category).filter(Boolean))];
  const filtered = getFilteredStockLedgerProducts();
  const start = (stockLedgerFilters.page - 1) * stockLedgerFilters.pageSize;
  const totalPages = Math.ceil(filtered.length / stockLedgerFilters.pageSize) || 1;

  return `
    <div class="stock-ledger-page-container">
      <div class="stock-ledger-card">
        <!-- Header row -->
        <div class="stock-ledger-header-row">
          <div class="stock-ledger-title-group">
            <h1 class="stock-ledger-title">Stock Ledger Balance</h1>
            <div class="stock-ledger-scope">
              <span class="stock-ledger-scope-dot"></span>
              <span class="stock-ledger-scope-text" id="stock-ledger-scope-label">REPORTING SCOPE: SEPTEMBER 2026</span>
            </div>
          </div>

          <div class="stock-ledger-controls-group">
            <div class="stock-ledger-date-picker-wrap" title="Change Reporting Scope">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              <input type="text" class="stock-date-input" id="stock-date-start" value="${stockLedgerFilters.startDateStr}" onchange="handleStockDateChange()" placeholder="01-09-2026" />
              <span class="stock-date-arrow">→</span>
              <input type="text" class="stock-date-input" id="stock-date-end" value="${stockLedgerFilters.endDateStr}" onchange="handleStockDateChange()" placeholder="30-09-2026" />
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            </div>

            <div class="stock-ledger-search-wrap">
              <input type="text" id="stock-ledger-search" placeholder="Search Item or HSN..." value="${escapeHtml(stockLedgerFilters.search)}" oninput="handleStockSearch(this.value)" />
            </div>

            <div class="stock-ledger-category-wrap">
              <select id="stock-ledger-category" onchange="handleStockCategoryChange(this.value)">
                <option value="All" ${stockLedgerFilters.category === 'All' ? 'selected' : ''}>All Categories</option>
                ${categories.map(c => `<option value="${escapeHtml(c)}" ${stockLedgerFilters.category === c ? 'selected' : ''}>${escapeHtml(c)}</option>`).join("")}
              </select>
            </div>
          </div>
        </div>

        <!-- The Table -->
        <div class="stock-ledger-table-wrap">
          <table class="stock-ledger-table">
            <thead>
              <tr>
                <th class="col-desc">Item Ledger Description</th>
                <th class="col-cf">Carry Forward</th>
                <th class="col-receipts">Total Receipts</th>
                <th class="col-consumption">Total Consumption</th>
                <th class="col-closing">Month Closing</th>
                <th class="col-audit">Audit</th>
              </tr>
            </thead>
            <tbody id="stock-ledger-tbody">
              ${renderStockLedgerRows()}
            </tbody>
          </table>
        </div>

        <!-- Pagination / Summary Footer -->
        <div class="stock-ledger-footer">
          <div class="stock-ledger-count" id="stock-shown-count">
            Showing <b>${filtered.length > 0 ? start + 1 : 0}–${Math.min(filtered.length, start + stockLedgerFilters.pageSize)}</b> of <b>${filtered.length}</b> catalogue items
          </div>
          <div class="stock-pagination-controls">
            <button type="button" ${stockLedgerFilters.page <= 1 ? 'disabled' : ''} onclick="stockLedgerFilters.page--;document.getElementById('stock-ledger-tbody').innerHTML=renderStockLedgerRows();updateStockCountFooter();">Previous</button>
            <span style="font-weight:600;padding:0 6px;">Page ${stockLedgerFilters.page} of ${totalPages}</span>
            <button type="button" ${stockLedgerFilters.page >= totalPages ? 'disabled' : ''} onclick="stockLedgerFilters.page++;document.getElementById('stock-ledger-tbody').innerHTML=renderStockLedgerRows();updateStockCountFooter();">Next</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// STOCK AUDIT & RECONCILIATION MODAL
function openStockAuditModal(productId) {
  const p = state.products.find(x => x.id === productId);
  if (!p) { toast("Product not found"); return; }
  
  const ledgerData = calculateItemLedger(p);
  const bookClosing = ledgerData.closing;

  openInAppModal(`Stock Audit & Physical Correction — ${p.name}`, `
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;margin-bottom:18px;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div>
          <b style="font-size:16px;color:#0f172a;">${escapeHtml(formatItemNameDisplay(p.name))}</b>
          <div style="font-size:12px;color:#64748b;margin-top:2px;">HSN: ${escapeHtml(p.hsn || '---')} • Category: ${escapeHtml(p.category || 'General')} • Unit: ${(p.unit || 'KG').toUpperCase()}</div>
        </div>
        <div style="text-align:right;">
          <span style="font-size:11px;color:#94a3b8;font-weight:700;text-transform:uppercase;">Current Book Closing</span>
          <div style="font-size:22px;font-weight:800;color:#0f172a;">${formatLedgerQty(bookClosing)} <span style="font-size:13px;font-weight:500;color:#64748b;">${p.unit || 'KG'}</span></div>
        </div>
      </div>
    </div>

    <div class="form-grid">
      <div class="form-field">
        <label>Audited Physical Count *</label>
        <input id="audit-physical-qty" type="number" step="0.01" value="${bookClosing}" oninput="updateAuditVariance(${bookClosing})">
      </div>
      <div class="form-field">
        <label>Audit Variance</label>
        <input id="audit-variance-display" value="0.00 (Match)" disabled style="background:#f1f5f9;font-weight:700;color:#16a34a;">
      </div>
      <div class="form-field full">
        <label>Reason for Correction / Variance</label>
        <select id="audit-reason-select">
          <option>Physical Verification (Count Reconciled)</option>
          <option>Kitchen Spillage / Wastage</option>
          <option>Recipe / Portion Yield Discrepancy</option>
          <option>Supplier Short Delivery</option>
          <option>Breakage / Spoilage</option>
          <option>Unrecorded Kitchen Outward</option>
          <option>Opening Balance Adjustment</option>
        </select>
      </div>
      <div class="form-field full">
        <label>Audit Remarks / Supervisor Note</label>
        <input id="audit-notes" placeholder="Enter auditor remarks or batch reference...">
      </div>
    </div>
  `, `
    <button class="secondary" onclick="closeModal()">Cancel</button>
    <button class="primary" onclick="submitStockAuditCorrection(${p.id})">Save Audit Correction</button>
  `);
}

function updateAuditVariance(bookClosing) {
  const val = Number(document.getElementById("audit-physical-qty")?.value) || 0;
  const diff = val - bookClosing;
  const disp = document.getElementById("audit-variance-display");
  if (!disp) return;
  if (Math.abs(diff) < 0.001) {
    disp.value = "0.00 (Match)";
    disp.style.color = "#16a34a";
  } else if (diff > 0) {
    disp.value = "+" + diff.toFixed(2) + " (Surplus)";
    disp.style.color = "#2563eb";
  } else {
    disp.value = diff.toFixed(2) + " (Deficit / Shortage)";
    disp.style.color = "#ef4444";
  }
}

function submitStockAuditCorrection(productId) {
  const p = state.products.find(x => x.id === productId);
  if (!p) return;
  const newCount = Number(document.getElementById("audit-physical-qty")?.value);
  if (isNaN(newCount) || newCount < 0) {
    toast("Please enter a valid physical count");
    return;
  }
  const reason = document.getElementById("audit-reason-select")?.value || "Physical Verification";
  const notes = document.getElementById("audit-notes")?.value.trim() || "";

  const oldCount = Number(p.stock) || 0;
  const variance = newCount - oldCount;

  p.stock = newCount;
  if (!state.openingStock) state.openingStock = {};
  state.openingStock[p.name] = newCount;

  state.transactions.unshift({
    id: "AUD-" + Date.now(),
    date: new Date().toISOString(),
    type: "Audit Correction",
    product: p.name,
    store: state.currentStore,
    qty: variance,
    rate: p.cost || 0,
    user: state.currentUser,
    ref: reason + (notes ? " (" + notes + ")" : "")
  });

  save();
  closeModal();
  toast(`Audit saved: ${p.name} updated to ${formatLedgerQty(newCount)} ${p.unit}`);
  const tbody = document.getElementById("stock-ledger-tbody");
  if (tbody) tbody.innerHTML = renderStockLedgerRows();
  updateStockCountFooter();
}

function openEditProductModal(productId) {
  const p = state.products.find(x => x.id === productId);
  if (!p) return;
  openInAppModal("Edit Item — " + p.name, `
    <div class="form-grid">
      <div class="form-field full">
        <label>Item Name *</label>
        <input id="edit-prod-name" value="${escapeHtml(p.name)}" placeholder="Item Name">
      </div>
      <div class="form-field">
        <label>HSN Code</label>
        <input id="edit-prod-hsn" value="${escapeHtml(p.hsn || '')}" placeholder="e.g. 1101, 1006">
      </div>
      <div class="form-field">
        <label>Category</label>
        <input id="edit-prod-cat" value="${escapeHtml(p.category || 'General')}" placeholder="Category">
      </div>
      <div class="form-field">
        <label>Unit</label>
        <select id="edit-prod-unit">
          ${renderUnitOptions(p.unit || "kg")}
        </select>
      </div>
      <div class="form-field">
        <label>Cost Rate (₹)</label>
        <input id="edit-prod-cost" type="number" step="0.01" value="${p.cost || p.purchaseCost || 0}">
      </div>
      <div class="form-field">
        <label>Min Stock Level</label>
        <input id="edit-prod-min" type="number" value="${p.min || 10}">
      </div>
      <div class="form-field">
        <label>Current Stock</label>
        <input id="edit-prod-stock" type="number" step="0.01" value="${p.stock || 0}">
      </div>
    </div>
  `, `
    <button class="danger-btn" onclick="closeModal();deleteStockProduct(${p.id})">Delete Item</button>
    <button class="secondary" onclick="closeModal()">Cancel</button>
    <button class="primary" onclick="submitEditStockProduct(${p.id})">Save Changes</button>
  `);
}

function submitEditStockProduct(productId) {
  const p = state.products.find(x => x.id === productId);
  if (!p) return;
  const name = document.getElementById("edit-prod-name")?.value.trim();
  if (!name) { toast("Item name is required"); return; }
  const oldName = p.name;
  p.name = name;
  p.hsn = document.getElementById("edit-prod-hsn")?.value.trim() || "";
  p.category = document.getElementById("edit-prod-cat")?.value.trim() || "General";
  p.unit = document.getElementById("edit-prod-unit")?.value || "kg";
  p.cost = Number(document.getElementById("edit-prod-cost")?.value) || 0;
  p.purchaseCost = p.cost;
  p.min = Number(document.getElementById("edit-prod-min")?.value) || 0;
  p.stock = Number(document.getElementById("edit-prod-stock")?.value) || 0;

  if (oldName !== name) {
    if (state.openingStock && state.openingStock[oldName] !== undefined) {
      state.openingStock[name] = state.openingStock[oldName];
      delete state.openingStock[oldName];
    }
  }

  save();
  closeModal();
  toast(`Item "${name}" updated successfully`);
  const tbody = document.getElementById("stock-ledger-tbody");
  if (tbody) tbody.innerHTML = renderStockLedgerRows();
  updateStockCountFooter();
}

function deleteStockProduct(productId) {
  const p = state.products.find(x => x.id === productId);
  if (!p) return;
  confirmModal(`Are you sure you want to remove "${p.name}" from the inventory ledger?`, () => {
    state.products = state.products.filter(x => x.id !== productId);
    save();
    toast(`Item "${p.name}" removed`);
    const tbody = document.getElementById("stock-ledger-tbody");
    if (tbody) tbody.innerHTML = renderStockLedgerRows();
    updateStockCountFooter();
  });
}

function exportStockCsv() {
  const filtered = getFilteredStockLedgerProducts();
  const rows = [
    ["Item Description", "HSN", "Unit", "Carry Forward", "Total Receipts", "Total Consumption", "Month Closing"],
    ...filtered.map(p => {
      const data = calculateItemLedger(p);
      return [p.name, p.hsn || "", p.unit || "KG", data.carryForward, data.receipts, data.consumption, data.closing];
    })
  ];
  downloadCsv("stocksense-stock-ledger.csv", rows);
}

function filterLedgerForProduct(productName) {
  stockLedgerFilters.search = productName;
  showView("inventory");
  toast("Filtered ledger for " + productName);
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
function openInAppModal(title, bodyHtml, actionsHtml = "", customStyle = "") {
  const root = document.getElementById("modal-root");
  if (!root) return;
  root.innerHTML = `
    <div class="modal-backdrop" onclick="if(event.target===this)closeModal()">
      <div class="modal" ${customStyle ? `style="${customStyle}"` : ''}>
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
        <input id="edit-name" value="${escapeHtml(p.name)}" onblur="this.value=formatItemName(this.value)">
      </div>
      <div class="form-field">
        <label>Brand</label>
        <input id="edit-brand" value="${escapeHtml(p.brand || '')}">
      </div>
      <div class="form-field">
        <label>Category</label>
        <input id="edit-category" value="${escapeHtml(p.category || '')}">
      </div>
      <div class="form-field">
        <label>Department</label>
        <select id="edit-department">
          ${departments.map(d => `<option ${d === (p.department || 'Kitchen') ? 'selected' : ''}>${d}</option>`).join("")}
        </select>
      </div>
      <div class="form-field">
        <label>Unit (e.g. kg, Ltr, pcs)</label>
        <select id="edit-unit">
          ${renderUnitOptions(p.unit)}
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
  const rawName = document.getElementById("edit-name")?.value.trim();
  if (!rawName) { toast("Item name is required"); return; }
  const newName = formatItemName(rawName);
  const oldName = p.name;
  p.name = newName;
  p.brand = document.getElementById("edit-brand")?.value.trim() || "";
  p.category = formatItemName(document.getElementById("edit-category")?.value.trim() || "General");
  p.department = document.getElementById("edit-department")?.value || "Kitchen";
  p.unit = document.getElementById("edit-unit")?.value || identifyItemUnit(newName, p.unit, p.category);
  p.cost = Number(document.getElementById("edit-cost")?.value) || 0;
  p.purchaseCost = p.cost;
  p.min = Number(document.getElementById("edit-min")?.value) || 0;
  p.reorder = Number(document.getElementById("edit-reorder")?.value) || 0;
  p.icon = getItemIcon(newName, p.category);

  if (oldName !== newName) {
    state.transactions.forEach(t => { if (t.product === oldName) t.product = newName; });
    if (Array.isArray(state.purchases)) {
      state.purchases.forEach(pr => (pr.items || []).forEach(it => { if (it.product === oldName) it.product = newName; }));
    }
    if (Array.isArray(state.outwards)) {
      state.outwards.forEach(o => (o.items || []).forEach(it => { if (it.product === oldName) it.product = newName; }));
    }
    if (Array.isArray(state.purchaseOrders)) {
      state.purchaseOrders.forEach(po => (po.items || []).forEach(it => { if (it.product === oldName) it.product = newName; }));
    }
    if (state.openingStock[oldName] !== undefined) {
      state.openingStock[newName] = state.openingStock[oldName];
      delete state.openingStock[oldName];
    }
  }
  save();
  closeModal();
  showView("inventory");
  toast(`Item "${newName}" (${p.unit}) saved successfully`);
}

// PURCHASING & GOODS RECEIPT
let purchaseDraft = { date: today, supplier: "Fresh Foods Co.", store: "Main Store", reference: "", remarks: "", items: [], isNew: false };
const nextPurchaseNo = () => `GRN-${String((state.purchases || []).length + 219).padStart(5, "0")}`;

function newPurchase(vendorName) {
  const chosenSup = vendorName || selectedVendorForAccounts || (state.suppliers[0] ? state.suppliers[0][0] : "Fresh Foods Co.");
  purchaseDraft = {
    no: nextPurchaseNo(),
    date: today,
    supplier: chosenSup,
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
  const gstType = purchaseDraft.gstType || "Intra-State (CGST+SGST)";
  const totalTaxable = purchaseDraft.items.reduce((a, i) => a + (Number(i.qty) || 0) * (Number(i.rate) || 0), 0);
  const totalGst = purchaseDraft.items.reduce((a, i) => {
    const taxable = (Number(i.qty) || 0) * (Number(i.rate) || 0);
    const gRate = Number(i.gstRate) || 0;
    return a + roundNumber(taxable * (gRate / 100));
  }, 0);
  const effectiveGst = gstType === "Tax Exempt / Nil Rated" ? 0 : totalGst;
  const rawTotal = totalTaxable + effectiveGst;
  const roundedTotal = Math.round(rawTotal);

  return `
    <div class="erp-fullscreen-entry" id="purchase-fullscreen">
      <!-- Top Title Header -->
      <div class="erp-header">
        <h1 class="erp-header-title">Purchase Invoice Entry</h1>
        <button type="button" class="erp-close-btn" onclick="exitPurchaseFullscreen()" title="Close (Esc)">✕</button>
      </div>

      <!-- Master Controls Row -->
      <div class="erp-controls-row">
        <div class="erp-control-group">
          <label class="erp-control-label">INVOICE NO.</label>
          <input class="erp-control-input" id="vfs-p-ref" value="${escapeHtml(purchaseDraft.reference || '')}" placeholder="INV-001" oninput="purchaseDraft.reference=this.value">
        </div>
        <div class="erp-control-group">
          <label class="erp-control-label">DATE</label>
          <input type="date" class="erp-control-input" id="vfs-p-date" value="${purchaseDraft.date}" onchange="purchaseDraft.date=this.value">
        </div>
        <div class="erp-control-group">
          <label class="erp-control-label">VENDOR</label>
          <select class="erp-control-select" id="vfs-p-supplier" onchange="purchaseDraft.supplier=this.value">
            ${state.suppliers.map(s => `<option ${s[0] === purchaseDraft.supplier ? 'selected' : ''}>${escapeHtml(s[0])}</option>`).join("")}
          </select>
        </div>
        <div class="erp-control-group">
          <label class="erp-control-label">GST TYPE</label>
          <select class="erp-control-select" id="erp-p-gst-type" onchange="purchaseDraft.gstType=this.value;refreshPurchaseTotals();">
            <option ${(purchaseDraft.gstType || 'Intra-State (CGST+SGST)') === 'Intra-State (CGST+SGST)' ? 'selected' : ''}>Intra-State (CGST+SGST)</option>
            <option ${purchaseDraft.gstType === 'Inter-State (IGST)' ? 'selected' : ''}>Inter-State (IGST)</option>
            <option ${purchaseDraft.gstType === 'Tax Exempt / Nil Rated' ? 'selected' : ''}>Tax Exempt / Nil Rated</option>
          </select>
        </div>
      </div>

      <!-- Items Grid Scroll Area -->
      <div class="erp-grid-scroll">
        <table class="erp-table">
          <thead>
            <tr>
              <th style="width:48px;" class="erp-th-center">#</th>
              <th>NAME OF ITEM</th>
              <th style="width:110px;" class="erp-th-right">QTY</th>
              <th style="width:90px;" class="erp-th-center">UNIT</th>
              <th style="width:120px;" class="erp-th-right">RATE</th>
              <th style="width:100px;" class="erp-th-right">GST %</th>
              <th style="width:140px;" class="erp-th-right">AMOUNT</th>
              <th style="width:40px;" class="erp-th-center"></th>
            </tr>
          </thead>
          <tbody id="purchase-items-body">
            ${renderPurchaseTableRows()}
          </tbody>
        </table>
        <div class="erp-add-row-bar">
          <button type="button" class="erp-add-row-btn" onclick="addPurchaseRow()">＋ Add Item (or press Enter)</button>
        </div>
      </div>

      <!-- Docked Footer -->
      <div class="erp-footer">
        <div class="erp-footer-top">
          <div class="erp-narration-wrap">
            <textarea class="erp-narration-input" id="vfs-p-remarks" placeholder="Narration..." oninput="purchaseDraft.remarks=this.value">${escapeHtml(purchaseDraft.remarks || '')}</textarea>
          </div>
          <div class="erp-tax-breakdown" id="erp-p-tax-breakdown">
            ${renderPurchaseTaxBreakdown(totalTaxable, totalGst, purchaseDraft.gstType || 'Intra-State (CGST+SGST)')}
          </div>
          <div class="erp-grand-total-card">
            <span class="erp-grand-total-label">GRAND TOTAL</span>
            <span class="erp-grand-total-amount" id="purchase-total-val">₹ ${formatMoneyValue(roundedTotal)}</span>
          </div>
        </div>
        <div class="erp-footer-actions">
          <button type="button" class="erp-btn-cancel" onclick="exitPurchaseFullscreen()">CANCEL (Esc)</button>
          <button type="button" class="erp-btn-preview" onclick="previewCurrentPurchase()">👁 PREVIEW</button>
          <button type="button" class="erp-btn-save" id="btn-save-purchase" onclick="savePurchase()">✔ SAVE INVOICE (Ctrl+A)</button>
        </div>
      </div>
    </div>
  `;
}

function renderPurchaseTaxBreakdown(taxable, gst, gstType = "Intra-State (CGST+SGST)") {
  const isInter = gstType === "Inter-State (IGST)";
  const isExempt = gstType === "Tax Exempt / Nil Rated";
  const effectiveGst = isExempt ? 0 : gst;
  const rawTotal = taxable + effectiveGst;
  const roundedTotal = Math.round(rawTotal);
  const roundOff = roundNumber(roundedTotal - rawTotal);

  if (isExempt) {
    return `
      <div class="erp-tax-row"><span>Subtotal:</span><span class="erp-tax-val" id="purchase-total-taxable">${formatMoneyValue(taxable)}</span></div>
      <div class="erp-tax-row"><span>Tax Exempt:</span><span class="erp-tax-val">0.00</span></div>
      <div class="erp-tax-row"><span>Round Off:</span><span class="erp-tax-val" id="purchase-total-roundoff">${formatMoneyValue(roundOff)}</span></div>
    `;
  }
  if (isInter) {
    return `
      <div class="erp-tax-row"><span>Subtotal:</span><span class="erp-tax-val" id="purchase-total-taxable">${formatMoneyValue(taxable)}</span></div>
      <div class="erp-tax-row"><span>IGST:</span><span class="erp-tax-val" id="purchase-total-igst">${formatMoneyValue(effectiveGst)}</span></div>
      <div class="erp-tax-row"><span>Total Tax:</span><span class="erp-tax-val" id="purchase-total-gst">${formatMoneyValue(effectiveGst)}</span></div>
      <div class="erp-tax-row"><span>Round Off:</span><span class="erp-tax-val" id="purchase-total-roundoff">${formatMoneyValue(roundOff)}</span></div>
    `;
  }
  const cgst = roundNumber(effectiveGst / 2);
  const sgst = roundNumber(effectiveGst - cgst);
  return `
    <div class="erp-tax-row"><span>Subtotal:</span><span class="erp-tax-val" id="purchase-total-taxable">${formatMoneyValue(taxable)}</span></div>
    <div class="erp-tax-row"><span>CGST:</span><span class="erp-tax-val" id="purchase-total-cgst">${formatMoneyValue(cgst)}</span></div>
    <div class="erp-tax-row"><span>SGST:</span><span class="erp-tax-val" id="purchase-total-sgst">${formatMoneyValue(sgst)}</span></div>
    <div class="erp-tax-row"><span>Total Tax:</span><span class="erp-tax-val" id="purchase-total-gst">${formatMoneyValue(effectiveGst)}</span></div>
    <div class="erp-tax-row"><span>Round Off:</span><span class="erp-tax-val" id="purchase-total-roundoff">${formatMoneyValue(roundOff)}</span></div>
  `;
}

function renderPurchaseTableRows() {
  return purchaseDraft.items.map((item, idx) => {
    const p = productByName(item.product);
    const qty = Number(item.qty) || 0;
    const rate = Number(item.rate) || 0;
    const gstRate = Number(item.gstRate) || 0;
    const taxable = qty * rate;
    const gstAmt = roundNumber(taxable * (gstRate / 100));
    const totalAmount = taxable + gstAmt;
    const unit = p?.unit || identifyItemUnit(item.product) || item.unit || 'pcs';

    return `
      <tr data-row="${idx}">
        <td class="erp-cell-center" style="color:#64748b;font-weight:600;">${idx + 1}</td>
        <td>
          <div style="position:relative;width:100%;">
            <input id="p-search-${idx}" class="erp-cell-input" value="${escapeHtml(item.product || '')}"
              placeholder="Type 1-2 letters to search item..." autocomplete="off"
              oninput="handlePurchaseSearchInput(event, ${idx})"
              onfocus="handlePurchaseSearchFocus(event, ${idx})"
              onkeydown="handlePurchaseSearchKeydown(event, ${idx})">
          </div>
        </td>
        <td style="width:110px;">
          <input type="number" id="p-qty-${idx}" class="erp-cell-input erp-cell-num" step="any" min="0" value="${item.qty ?? 1}"
            oninput="updatePurchaseItemQty(${idx}, this.value)"
            onkeydown="handlePurchaseQtyKeydown(event, ${idx})">
        </td>
        <td style="width:90px;" class="erp-cell-center">
          <span class="erp-unit-badge" id="p-unit-${idx}">${escapeHtml(unit)}</span>
        </td>
        <td style="width:120px;">
          <input type="number" id="p-rate-${idx}" class="erp-cell-input erp-cell-num" step="any" min="0" value="${item.rate ?? 0}"
            oninput="updatePurchaseItemRate(${idx}, this.value)"
            onkeydown="handlePurchaseRateKeydown(event, ${idx})">
        </td>
        <td style="width:100px;">
          <input type="number" id="p-gst-${idx}" class="erp-cell-input erp-cell-num" step="any" min="0" max="100" placeholder="0" value="${item.gstRate ?? 0}"
            oninput="updatePurchaseItemGst(${idx}, this.value)"
            onkeydown="handlePurchaseGstKeydown(event, ${idx})">
        </td>
        <td style="width:140px;">
          <span class="erp-amount-val" id="p-amount-${idx}">${formatMoneyValue(totalAmount)}</span>
        </td>
        <td style="width:40px;text-align:center;">
          <button type="button" class="erp-row-del-btn" onclick="removePurchaseRow(${idx})" title="Delete row">✕</button>
        </td>
      </tr>
    `;
  }).join("") || `
    <tr>
      <td colspan="8" style="padding:24px;text-align:center;color:#64748b;">
        No items. Click "+ Add Item" or press Enter to add a product line.
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
    } else {
      addPurchaseRow();
    }
  }
}

function onSelectPurchaseItem(idx, product) {
  if (!purchaseDraft.items[idx]) return;
  purchaseDraft.items[idx].product = product.name;
  purchaseDraft.items[idx].unit = product.unit || identifyItemUnit(product.name);
  if (!purchaseDraft.items[idx].rate) {
    purchaseDraft.items[idx].rate = product.purchaseCost || product.cost || 0;
  }
  if (product.gstRate !== undefined && purchaseDraft.items[idx].gstRate === 0) {
    purchaseDraft.items[idx].gstRate = Number(product.gstRate) || 0;
  }

  const searchInput = document.getElementById(`p-search-${idx}`);
  if (searchInput) searchInput.value = product.name;

  const unitCell = document.getElementById(`p-unit-${idx}`);
  if (unitCell) unitCell.textContent = purchaseDraft.items[idx].unit;

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
  const p = productByName(name);
  const formattedName = p ? p.name : formatItemName(name);
  purchaseDraft.items[idx].product = formattedName;
  const unit = p ? p.unit : identifyItemUnit(formattedName);
  purchaseDraft.items[idx].unit = unit;
  if (p && !purchaseDraft.items[idx].rate) {
    purchaseDraft.items[idx].rate = p.purchaseCost || p.cost || 0;
  }
  const unitCell = document.getElementById(`p-unit-${idx}`);
  if (unitCell) unitCell.textContent = unit;
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

  const amtCell = document.getElementById(`p-amount-${idx}`);
  if (amtCell) amtCell.textContent = formatMoneyValue(item.amount);
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
  const gstType = purchaseDraft.gstType || document.getElementById("erp-p-gst-type")?.value || "Intra-State (CGST+SGST)";
  const totalTaxable = purchaseDraft.items.reduce((a, i) => a + (Number(i.qty) || 0) * (Number(i.rate) || 0), 0);
  const totalGst = purchaseDraft.items.reduce((a, i) => {
    const taxable = (Number(i.qty) || 0) * (Number(i.rate) || 0);
    const gRate = Number(i.gstRate) || 0;
    return a + roundNumber(taxable * (gRate / 100));
  }, 0);
  const effectiveGst = gstType === "Tax Exempt / Nil Rated" ? 0 : totalGst;
  const rawTotal = totalTaxable + effectiveGst;
  const roundedTotal = Math.round(rawTotal);

  const totalEl = document.getElementById("purchase-total-val");
  if (totalEl) totalEl.textContent = `₹ ${formatMoneyValue(roundedTotal)}`;

  const breakdownEl = document.getElementById("erp-p-tax-breakdown");
  if (breakdownEl) {
    breakdownEl.innerHTML = renderPurchaseTaxBreakdown(totalTaxable, totalGst, gstType);
  }
}

function previewCurrentPurchase() {
  syncPurchaseDraftFromDOM();
  const validItems = purchaseDraft.items.filter(i => (i.product || "").trim());
  if (!validItems.length) {
    toast("Please enter at least one item before previewing");
    return;
  }
  const gstType = purchaseDraft.gstType || "Intra-State (CGST+SGST)";
  const totalTaxable = validItems.reduce((a, i) => a + (Number(i.qty) || 0) * (Number(i.rate) || 0), 0);
  const totalGst = validItems.reduce((a, i) => {
    const taxable = (Number(i.qty) || 0) * (Number(i.rate) || 0);
    const gRate = Number(i.gstRate) || 0;
    return a + roundNumber(taxable * (gRate / 100));
  }, 0);
  const effectiveGst = gstType === "Tax Exempt / Nil Rated" ? 0 : totalGst;
  const rawTotal = totalTaxable + effectiveGst;
  const roundedTotal = Math.round(rawTotal);

  const previewVoucher = {
    no: purchaseDraft.reference || purchaseDraft.no || "PUR-DRAFT",
    date: purchaseDraft.date || today,
    supplier: purchaseDraft.supplier,
    store: purchaseDraft.store || state.currentStore || "Main Store",
    reference: purchaseDraft.reference || "",
    remarks: purchaseDraft.remarks || "",
    items: validItems.map(i => {
      const p = productByName(i.product);
      const qty = Number(i.qty) || 0;
      const rate = Number(i.rate) || 0;
      const gstRate = Number(i.gstRate) || 0;
      const taxable = qty * rate;
      const gstAmt = roundNumber(taxable * (gstRate / 100));
      return {
        product: i.product,
        unit: p?.unit || i.unit || 'pcs',
        qty,
        rate,
        gstRate,
        taxableAmount: taxable,
        gstAmount: gstAmt,
        amount: taxable + gstAmt
      };
    }),
    total: roundedTotal,
    status: "Draft Preview"
  };
  showVoucherPreviewObject("Purchase", previewVoucher, true);
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
  const gstTypeEl = document.getElementById("erp-p-gst-type");
  if (gstTypeEl) purchaseDraft.gstType = gstTypeEl.value;

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
    const formattedName = formatItemName(i.product);
    let p = productByName(formattedName);
    if (!p) {
      // Auto-create newly purchased product in catalog with proper name and intelligent unit
      const identifiedUnit = identifyItemUnit(formattedName, i.unit);
      const identifiedCat = identifyItemCategory(formattedName);
      p = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        name: formattedName,
        sku: "ITEM-" + String(state.products.length + 1).padStart(3, "0"),
        barcode: "",
        category: identifiedCat,
        department: "Kitchen",
        unit: identifiedUnit,
        stock: 0,
        min: 5,
        reorder: 10,
        max: 50,
        cost: Number(i.rate) || 0,
        purchaseCost: Number(i.rate) || 0,
        store: purchaseDraft.store || state.currentStore,
        icon: getItemIcon(formattedName, identifiedCat),
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
      product: p.name,
      unit: p?.unit || identifyItemUnit(p.name, i.unit),
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
                  <td><a href="javascript:void(0)" onclick="openVendorPurchaseHistory('${escapeQuote(v.supplier)}')" style="color:#2563eb;font-weight:600;text-decoration:none;" title="View all purchases from this vendor">${escapeHtml(v.supplier)}</a></td>
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
let poDraft = {
  no: "",
  date: today,
  supplier: "Fresh Foods Co.",
  expectedDate: today,
  department: "Kitchen",
  gstType: "Intra-State (CGST+SGST)",
  items: [],
  status: "Draft",
  remarks: "",
  isNew: false
};
const nextPONo = () => `PO-${String(state.purchaseOrders.length + 1).padStart(5, "0")}`;

function newPurchaseOrder(items = []) {
  poDraft = {
    no: nextPONo(),
    date: today,
    supplier: state.suppliers[0] ? state.suppliers[0][0] : "Fresh Foods Co.",
    expectedDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
    department: "Kitchen",
    gstType: "Intra-State (CGST+SGST)",
    items: items.length ? items.map(i => ({ ...i })) : [{ product: "", qty: 1, rate: 0, gstRate: 0, gstAmount: 0, amount: 0 }],
    status: "Draft",
    remarks: "",
    isNew: true,
    isEditing: false
  };
  showView("purchase-orders");
  setTimeout(() => {
    const firstInput = document.getElementById("po-search-0");
    if (firstInput) {
      firstInput.focus();
      firstInput.select();
    }
  }, 60);
}

function exitPOFullscreen() {
  poDraft.isNew = false;
  closeProductSearchPopover();
  showView("purchase-orders");
}

function purchaseOrdersScreen() {
  return poDraft.isNew ? purchaseOrderEntryScreen() : purchaseOrderRegisterScreen();
}

function purchaseOrderEntryScreen() {
  const gstType = poDraft.gstType || "Intra-State (CGST+SGST)";
  const totalTaxable = poDraft.items.reduce((a, i) => a + (Number(i.qty) || 0) * (Number(i.rate) || 0), 0);
  const totalGst = poDraft.items.reduce((a, i) => {
    const taxable = (Number(i.qty) || 0) * (Number(i.rate) || 0);
    const gRate = Number(i.gstRate) || 0;
    return a + roundNumber(taxable * (gRate / 100));
  }, 0);
  const effectiveGst = gstType === "Tax Exempt / Nil Rated" ? 0 : totalGst;
  const rawTotal = totalTaxable + effectiveGst;
  const roundedTotal = Math.round(rawTotal);

  return `
    <div class="erp-fullscreen-entry" id="po-fullscreen">
      <!-- Top Title Header -->
      <div class="erp-header">
        <h1 class="erp-header-title">Purchase Order Entry</h1>
        <button type="button" class="erp-close-btn" onclick="exitPOFullscreen()" title="Close (Esc)">✕</button>
      </div>

      <!-- Master Controls Row -->
      <div class="erp-controls-row">
        <div class="erp-control-group">
          <label class="erp-control-label">PO NUMBER</label>
          <input class="erp-control-input" id="vfs-po-no" value="${escapeHtml(poDraft.no || nextPONo())}" readonly>
        </div>
        <div class="erp-control-group">
          <label class="erp-control-label">DATE</label>
          <input type="date" class="erp-control-input" id="vfs-po-date" value="${poDraft.date}" onchange="poDraft.date=this.value">
        </div>
        <div class="erp-control-group">
          <label class="erp-control-label">VENDOR / SUPPLIER</label>
          <select class="erp-control-select" id="vfs-po-supplier" onchange="poDraft.supplier=this.value">
            ${state.suppliers.map(s => `<option ${s[0] === poDraft.supplier ? 'selected' : ''}>${escapeHtml(s[0])}</option>`).join("")}
          </select>
        </div>
        <div class="erp-control-group">
          <label class="erp-control-label">GST TYPE</label>
          <select class="erp-control-select" id="erp-po-gst-type" onchange="poDraft.gstType=this.value;refreshPOTotals();">
            <option ${(poDraft.gstType || 'Intra-State (CGST+SGST)') === 'Intra-State (CGST+SGST)' ? 'selected' : ''}>Intra-State (CGST+SGST)</option>
            <option ${poDraft.gstType === 'Inter-State (IGST)' ? 'selected' : ''}>Inter-State (IGST)</option>
            <option ${poDraft.gstType === 'Tax Exempt / Nil Rated' ? 'selected' : ''}>Tax Exempt / Nil Rated</option>
          </select>
        </div>
      </div>

      <!-- Items Grid Scroll Area -->
      <div class="erp-grid-scroll">
        <table class="erp-table">
          <thead>
            <tr>
              <th style="width:48px;" class="erp-th-center">#</th>
              <th>NAME OF ITEM</th>
              <th style="width:110px;" class="erp-th-right">QTY</th>
              <th style="width:90px;" class="erp-th-center">UNIT</th>
              <th style="width:120px;" class="erp-th-right">RATE</th>
              <th style="width:100px;" class="erp-th-right">GST %</th>
              <th style="width:140px;" class="erp-th-right">AMOUNT</th>
              <th style="width:40px;" class="erp-th-center"></th>
            </tr>
          </thead>
          <tbody id="po-items-body">
            ${renderPOTableRows()}
          </tbody>
        </table>
        <div class="erp-add-row-bar">
          <button type="button" class="erp-add-row-btn" onclick="addPORow()">＋ Add Item (or press Enter)</button>
        </div>
      </div>

      <!-- Docked Footer -->
      <div class="erp-footer">
        <div class="erp-footer-top">
          <div class="erp-narration-wrap">
            <textarea class="erp-narration-input" id="vfs-po-remarks" placeholder="Purchase order instructions, expected delivery notes..." oninput="poDraft.remarks=this.value">${escapeHtml(poDraft.remarks || '')}</textarea>
          </div>
          <div class="erp-tax-breakdown" id="erp-po-tax-breakdown">
            ${renderPOTaxBreakdown(totalTaxable, totalGst, poDraft.gstType || 'Intra-State (CGST+SGST)')}
          </div>
          <div class="erp-grand-total-card">
            <span class="erp-grand-total-label">GRAND TOTAL</span>
            <span class="erp-grand-total-amount" id="po-total-val">₹ ${formatMoneyValue(roundedTotal)}</span>
          </div>
        </div>
        <div class="erp-footer-actions">
          <button type="button" class="erp-btn-cancel" onclick="exitPOFullscreen()">CANCEL (Esc)</button>
          <button type="button" class="erp-btn-preview" onclick="previewCurrentPO()">👁 PREVIEW</button>
          <button type="button" class="erp-btn-save" id="btn-save-po" onclick="savePurchaseOrder()">✔ SAVE PO (Ctrl+A)</button>
        </div>
      </div>
    </div>
  `;
}

function renderPOTaxBreakdown(taxable, gst, gstType = "Intra-State (CGST+SGST)") {
  const isInter = gstType === "Inter-State (IGST)";
  const isExempt = gstType === "Tax Exempt / Nil Rated";
  const effectiveGst = isExempt ? 0 : gst;
  const rawTotal = taxable + effectiveGst;
  const roundedTotal = Math.round(rawTotal);
  const roundOff = roundNumber(roundedTotal - rawTotal);

  if (isExempt) {
    return `
      <div class="erp-tax-row"><span>Subtotal:</span><span class="erp-tax-val" id="po-total-taxable">${formatMoneyValue(taxable)}</span></div>
      <div class="erp-tax-row"><span>Tax Exempt:</span><span class="erp-tax-val">0.00</span></div>
      <div class="erp-tax-row"><span>Round Off:</span><span class="erp-tax-val" id="po-total-roundoff">${formatMoneyValue(roundOff)}</span></div>
    `;
  }
  if (isInter) {
    return `
      <div class="erp-tax-row"><span>Subtotal:</span><span class="erp-tax-val" id="po-total-taxable">${formatMoneyValue(taxable)}</span></div>
      <div class="erp-tax-row"><span>IGST:</span><span class="erp-tax-val" id="po-total-igst">${formatMoneyValue(effectiveGst)}</span></div>
      <div class="erp-tax-row"><span>Total Tax:</span><span class="erp-tax-val" id="po-total-gst">${formatMoneyValue(effectiveGst)}</span></div>
      <div class="erp-tax-row"><span>Round Off:</span><span class="erp-tax-val" id="po-total-roundoff">${formatMoneyValue(roundOff)}</span></div>
    `;
  }
  const cgst = roundNumber(effectiveGst / 2);
  const sgst = roundNumber(effectiveGst - cgst);
  return `
    <div class="erp-tax-row"><span>Subtotal:</span><span class="erp-tax-val" id="po-total-taxable">${formatMoneyValue(taxable)}</span></div>
    <div class="erp-tax-row"><span>CGST:</span><span class="erp-tax-val" id="po-total-cgst">${formatMoneyValue(cgst)}</span></div>
    <div class="erp-tax-row"><span>SGST:</span><span class="erp-tax-val" id="po-total-sgst">${formatMoneyValue(sgst)}</span></div>
    <div class="erp-tax-row"><span>Total Tax:</span><span class="erp-tax-val" id="po-total-gst">${formatMoneyValue(effectiveGst)}</span></div>
    <div class="erp-tax-row"><span>Round Off:</span><span class="erp-tax-val" id="po-total-roundoff">${formatMoneyValue(roundOff)}</span></div>
  `;
}

function renderPOTableRows() {
  return poDraft.items.map((item, idx) => {
    const p = productByName(item.product);
    const qty = Number(item.qty) || 0;
    const rate = Number(item.rate) || 0;
    const gstRate = Number(item.gstRate) || 0;
    const taxable = qty * rate;
    const gstAmt = roundNumber(taxable * (gstRate / 100));
    const totalAmount = taxable + gstAmt;
    const unit = p?.unit || identifyItemUnit(item.product) || item.unit || 'pcs';

    return `
      <tr data-row="${idx}">
        <td class="erp-cell-center" style="color:#64748b;font-weight:600;">${idx + 1}</td>
        <td>
          <div style="position:relative;width:100%;">
            <input id="po-search-${idx}" class="erp-cell-input" value="${escapeHtml(item.product || '')}"
              placeholder="Type 1-2 letters to search item..." autocomplete="off"
              oninput="handlePOSearchInput(event, ${idx})"
              onfocus="handlePOSearchFocus(event, ${idx})"
              onkeydown="handlePOSearchKeydown(event, ${idx})">
          </div>
        </td>
        <td style="width:110px;">
          <input type="number" id="po-qty-${idx}" class="erp-cell-input erp-cell-num" step="any" min="0" value="${item.qty ?? 1}"
            oninput="updatePOItemQty(${idx}, this.value)"
            onkeydown="handlePOQtyKeydown(event, ${idx})">
        </td>
        <td style="width:90px;" class="erp-cell-center">
          <span class="erp-unit-badge" id="po-unit-${idx}">${escapeHtml(unit)}</span>
        </td>
        <td style="width:120px;">
          <input type="number" id="po-rate-${idx}" class="erp-cell-input erp-cell-num" step="any" min="0" value="${item.rate ?? 0}"
            oninput="updatePOItemRate(${idx}, this.value)"
            onkeydown="handlePORateKeydown(event, ${idx})">
        </td>
        <td style="width:100px;">
          <input type="number" id="po-gst-${idx}" class="erp-cell-input erp-cell-num" step="any" min="0" max="100" placeholder="0" value="${item.gstRate ?? 0}"
            oninput="updatePOItemGst(${idx}, this.value)"
            onkeydown="handlePOGstKeydown(event, ${idx})">
        </td>
        <td style="width:140px;">
          <span class="erp-amount-val" id="po-amount-${idx}">${formatMoneyValue(totalAmount)}</span>
        </td>
        <td style="width:40px;text-align:center;">
          <button type="button" class="erp-row-del-btn" onclick="removePORow(${idx})" title="Delete row">✕</button>
        </td>
      </tr>
    `;
  }).join("") || `
    <tr>
      <td colspan="8" style="padding:24px;text-align:center;color:#64748b;">
        No items. Click "+ Add Item" or press Enter to add a product line.
      </td>
    </tr>
  `;
}

function handlePOSearchInput(e, idx) {
  if (!poDraft.items[idx]) return;
  poDraft.items[idx].product = e.target.value;
  const q = e.target.value.trim();
  if (q.length >= 1) {
    openProductSearchPopover(e.target, q, (selectedProd) => onSelectPOItem(idx, selectedProd));
  } else {
    closeProductSearchPopover();
  }
}

function handlePOSearchFocus(e, idx) {
  const q = e.target.value.trim();
  if (q.length >= 1) {
    openProductSearchPopover(e.target, q, (selectedProd) => onSelectPOItem(idx, selectedProd));
  }
}

function handlePOSearchKeydown(e, idx) {
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
      const qtyEl = document.getElementById(`po-qty-${idx}`);
      if (qtyEl) {
        qtyEl.focus();
        qtyEl.select();
      }
    }
  }
}

function handlePOQtyKeydown(e, idx) {
  if (e.key === "Enter") {
    e.preventDefault();
    updatePOItemQty(idx, e.target.value);
    const rateEl = document.getElementById(`po-rate-${idx}`);
    if (rateEl) {
      rateEl.focus();
      rateEl.select();
    }
  }
}

function handlePORateKeydown(e, idx) {
  if (e.key === "Enter") {
    e.preventDefault();
    updatePOItemRate(idx, e.target.value);
    const gstEl = document.getElementById(`po-gst-${idx}`);
    if (gstEl) {
      gstEl.focus();
      gstEl.select();
    }
  }
}

function handlePOGstKeydown(e, idx) {
  if (e.key === "Enter") {
    e.preventDefault();
    updatePOItemGst(idx, e.target.value);
    if (idx < poDraft.items.length - 1) {
      const nextSearch = document.getElementById(`po-search-${idx + 1}`);
      if (nextSearch) {
        nextSearch.focus();
        nextSearch.select();
      }
    } else {
      addPORow();
    }
  }
}

function onSelectPOItem(idx, product) {
  if (!poDraft.items[idx]) return;
  poDraft.items[idx].product = product.name;
  poDraft.items[idx].unit = product.unit || identifyItemUnit(product.name);
  if (!poDraft.items[idx].rate) {
    poDraft.items[idx].rate = product.purchaseCost || product.cost || 0;
  }
  if (product.gstRate !== undefined && poDraft.items[idx].gstRate === 0) {
    poDraft.items[idx].gstRate = Number(product.gstRate) || 0;
  }

  const searchInput = document.getElementById(`po-search-${idx}`);
  if (searchInput) searchInput.value = product.name;

  const unitCell = document.getElementById(`po-unit-${idx}`);
  if (unitCell) unitCell.textContent = poDraft.items[idx].unit;

  const rateInput = document.getElementById(`po-rate-${idx}`);
  if (rateInput && !Number(rateInput.value)) {
    rateInput.value = poDraft.items[idx].rate;
  }

  const gstInput = document.getElementById(`po-gst-${idx}`);
  if (gstInput && poDraft.items[idx].gstRate) {
    gstInput.value = poDraft.items[idx].gstRate;
  }

  recalcPOItemRow(idx);
  refreshPOTotals();

  setTimeout(() => {
    const qtyInput = document.getElementById(`po-qty-${idx}`);
    if (qtyInput) {
      qtyInput.focus();
      qtyInput.select();
    }
  }, 30);
}

function recalcPOItemRow(idx) {
  const item = poDraft.items[idx];
  if (!item) return;
  const qty = Number(item.qty) || 0;
  const rate = Number(item.rate) || 0;
  const gstRate = Number(item.gstRate) || 0;
  const taxable = qty * rate;
  const gstAmt = roundNumber(taxable * (gstRate / 100));
  item.taxableAmount = taxable;
  item.gstAmount = gstAmt;
  item.amount = taxable + gstAmt;

  const amtCell = document.getElementById(`po-amount-${idx}`);
  if (amtCell) amtCell.textContent = formatMoneyValue(item.amount);
}

function updatePOItemQty(idx, val) {
  if (!poDraft.items[idx]) return;
  poDraft.items[idx].qty = Number(val) || 0;
  recalcPOItemRow(idx);
  refreshPOTotals();
}

function updatePOItemRate(idx, val) {
  if (!poDraft.items[idx]) return;
  poDraft.items[idx].rate = Number(val) || 0;
  recalcPOItemRow(idx);
  refreshPOTotals();
}

function updatePOItemGst(idx, val) {
  if (!poDraft.items[idx]) return;
  poDraft.items[idx].gstRate = Math.max(0, Number(val) || 0);
  recalcPOItemRow(idx);
  refreshPOTotals();
}

function refreshPOTotals() {
  const gstType = poDraft.gstType || document.getElementById("erp-po-gst-type")?.value || "Intra-State (CGST+SGST)";
  const totalTaxable = poDraft.items.reduce((a, i) => a + (Number(i.qty) || 0) * (Number(i.rate) || 0), 0);
  const totalGst = poDraft.items.reduce((a, i) => {
    const taxable = (Number(i.qty) || 0) * (Number(i.rate) || 0);
    const gRate = Number(i.gstRate) || 0;
    return a + roundNumber(taxable * (gRate / 100));
  }, 0);
  const effectiveGst = gstType === "Tax Exempt / Nil Rated" ? 0 : totalGst;
  const rawTotal = totalTaxable + effectiveGst;
  const roundedTotal = Math.round(rawTotal);

  const totalEl = document.getElementById("po-total-val");
  if (totalEl) totalEl.textContent = `₹ ${formatMoneyValue(roundedTotal)}`;

  const breakdownEl = document.getElementById("erp-po-tax-breakdown");
  if (breakdownEl) {
    breakdownEl.innerHTML = renderPOTaxBreakdown(totalTaxable, totalGst, gstType);
  }
}

function addPORow() {
  poDraft.items.push({ product: "", qty: 1, rate: 0, gstRate: 0, gstAmount: 0, amount: 0 });
  const tbody = document.getElementById("po-items-body");
  if (tbody) tbody.innerHTML = renderPOTableRows();
  refreshPOTotals();
  const newIdx = poDraft.items.length - 1;
  setTimeout(() => {
    const newSearch = document.getElementById(`po-search-${newIdx}`);
    if (newSearch) {
      newSearch.focus();
      newSearch.select();
    }
  }, 40);
}

function removePORow(idx) {
  poDraft.items.splice(idx, 1);
  if (!poDraft.items.length) {
    poDraft.items.push({ product: "", qty: 1, rate: 0, gstRate: 0, gstAmount: 0, amount: 0 });
  }
  const tbody = document.getElementById("po-items-body");
  if (tbody) tbody.innerHTML = renderPOTableRows();
  refreshPOTotals();
}

function syncPODraftFromDOM() {
  const dateEl = document.getElementById("vfs-po-date");
  if (dateEl && dateEl.value) poDraft.date = dateEl.value;
  const supEl = document.getElementById("vfs-po-supplier");
  if (supEl) poDraft.supplier = supEl.value;
  const remEl = document.getElementById("vfs-po-remarks");
  if (remEl) poDraft.remarks = remEl.value.trim();
  const gstTypeEl = document.getElementById("erp-po-gst-type");
  if (gstTypeEl) poDraft.gstType = gstTypeEl.value;

  poDraft.items.forEach((item, idx) => {
    const sEl = document.getElementById(`po-search-${idx}`);
    if (sEl) item.product = sEl.value.trim();
    const qEl = document.getElementById(`po-qty-${idx}`);
    if (qEl && qEl.value !== "") item.qty = Number(qEl.value);
    const rEl = document.getElementById(`po-rate-${idx}`);
    if (rEl && rEl.value !== "") item.rate = Number(rEl.value);
    const gEl = document.getElementById(`po-gst-${idx}`);
    if (gEl && gEl.value !== "") item.gstRate = Number(gEl.value);
  });
}

function previewCurrentPO() {
  syncPODraftFromDOM();
  const validItems = poDraft.items.filter(i => (i.product || "").trim());
  if (!validItems.length) {
    toast("Please enter at least one item before previewing");
    return;
  }
  const gstType = poDraft.gstType || "Intra-State (CGST+SGST)";
  const totalTaxable = validItems.reduce((a, i) => a + (Number(i.qty) || 0) * (Number(i.rate) || 0), 0);
  const totalGst = validItems.reduce((a, i) => {
    const taxable = (Number(i.qty) || 0) * (Number(i.rate) || 0);
    const gRate = Number(i.gstRate) || 0;
    return a + roundNumber(taxable * (gRate / 100));
  }, 0);
  const effectiveGst = gstType === "Tax Exempt / Nil Rated" ? 0 : totalGst;
  const rawTotal = totalTaxable + effectiveGst;
  const roundedTotal = Math.round(rawTotal);

  const previewVoucher = {
    no: poDraft.no || "PO-DRAFT",
    date: poDraft.date || today,
    supplier: poDraft.supplier,
    department: poDraft.department,
    expectedDate: poDraft.expectedDate,
    remarks: poDraft.remarks || "",
    items: validItems.map(i => {
      const p = productByName(i.product);
      const qty = Number(i.qty) || 0;
      const rate = Number(i.rate) || 0;
      const gstRate = Number(i.gstRate) || 0;
      const taxable = qty * rate;
      const gstAmt = roundNumber(taxable * (gstRate / 100));
      return {
        product: i.product,
        unit: p?.unit || i.unit || identifyItemUnit(i.product) || 'pcs',
        qty,
        rate,
        gstRate,
        taxableAmount: taxable,
        gstAmount: gstAmt,
        amount: taxable + gstAmt
      };
    }),
    total: roundedTotal,
    status: "Draft Preview"
  };
  showVoucherPreviewObject("Purchase Order", previewVoucher, true);
}

function savePurchaseOrder() {
  syncPODraftFromDOM();
  const validItems = [];
  poDraft.items.forEach(i => {
    const prodName = (i.product || "").trim();
    if (prodName) {
      const qty = Number(i.qty);
      const rate = Number(i.rate);
      const gstRate = Number(i.gstRate) || 0;
      const taxable = (isNaN(qty) || qty <= 0 ? 1 : qty) * (isNaN(rate) || rate < 0 ? 0 : rate);
      const gstAmt = roundNumber(taxable * ((isNaN(gstRate) || gstRate < 0 ? 0 : gstRate) / 100));
      const p = productByName(prodName);
      validItems.push({
        product: p ? p.name : formatItemName(prodName),
        unit: p?.unit || identifyItemUnit(prodName),
        qty: isNaN(qty) || qty <= 0 ? 1 : qty,
        rate: isNaN(rate) || rate < 0 ? 0 : rate,
        gstRate: isNaN(gstRate) || gstRate < 0 ? 0 : gstRate,
        taxableAmount: taxable,
        gstAmount: gstAmt,
        amount: taxable + gstAmt
      });
    }
  });

  if (!validItems.length) {
    toast("Please enter at least one item before saving");
    const firstInput = document.getElementById("po-search-0");
    if (firstInput) {
      firstInput.focus();
      firstInput.select();
    }
    return;
  }

  const no = poDraft.no || nextPONo();
  const gstType = poDraft.gstType || "Intra-State (CGST+SGST)";
  const totalTaxable = validItems.reduce((a, i) => a + (Number(i.taxableAmount) || 0), 0);
  const totalGst = validItems.reduce((a, i) => a + (Number(i.gstAmount) || 0), 0);
  const effectiveGst = gstType === "Tax Exempt / Nil Rated" ? 0 : totalGst;
  const grandTotal = Math.round(totalTaxable + effectiveGst);

  state.purchaseOrders = state.purchaseOrders.filter(x => x.no !== no);
  state.purchaseOrders.unshift({
    no,
    date: poDraft.date || today,
    supplier: poDraft.supplier,
    department: poDraft.department || "Kitchen",
    expectedDate: poDraft.expectedDate,
    gstType,
    remarks: poDraft.remarks || "",
    items: validItems,
    taxableAmount: totalTaxable,
    gstAmount: effectiveGst,
    total: grandTotal,
    status: "Ordered",
    createdAt: poDraft.createdAt || new Date().toISOString()
  });

  save();
  toast(`Purchase Order ${no} saved successfully`);
  poDraft.isNew = false;
  showView("purchase-orders");
}

function purchaseOrderRegisterScreen() {
  const totalPOAmount = state.purchaseOrders.reduce((a, p) => a + (Number(p.total) || 0), 0);
  const pendingCount = state.purchaseOrders.filter(p => (p.status || "").toLowerCase() !== "converted").length;

  return layout(
    "Purchase Orders",
    "Supplier requisitions and purchase orders before receipt.",
    `<button class="secondary" onclick="showView('purchasing')">Purchase Register</button>
     <button class="primary" onclick="newPurchaseOrder()">＋ Create Purchase Order</button>`,
    `
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-title">Total POs</div>
          <div class="stat-val">${state.purchaseOrders.length}</div>
        </div>
        <div class="stat-card">
          <div class="stat-title">Pending Orders</div>
          <div class="stat-val" style="color:var(--accent);">${pendingCount}</div>
        </div>
        <div class="stat-card">
          <div class="stat-title">Total Ordered Valuation</div>
          <div class="stat-val" style="color:var(--success);">₹ ${formatMoneyValue(totalPOAmount)}</div>
        </div>
      </div>

      <div class="panel" style="margin-top:20px;">
        <div class="panel-head">
          <span class="panel-title">Purchase Order Register (${state.purchaseOrders.length})</span>
          <button class="primary" onclick="newPurchaseOrder()">＋ New Purchase Order</button>
        </div>
        <div class="view-table">
          <table class="table">
            <thead>
              <tr>
                <th>PO #</th>
                <th>Date</th>
                <th>Supplier / Vendor</th>
                <th style="text-align:center;">Items</th>
                <th style="text-align:right;">Total Amount</th>
                <th>Status</th>
                <th style="text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${state.purchaseOrders.map(po => `
                <tr>
                  <td><b>${escapeHtml(po.no)}</b></td>
                  <td>${fmtDate(po.date)}</td>
                  <td>${escapeHtml(po.supplier)}</td>
                  <td style="text-align:center;">${po.items?.length || 0}</td>
                  <td class="num-cell" style="font-weight:700;">₹ ${formatMoneyValue(po.total)}</td>
                  <td><span class="status ${po.status === 'Converted' ? 'ok' : 'expiry'}">${escapeHtml(po.status || 'Ordered')}</span></td>
                  <td style="text-align:right;">
                    <div class="table-action-btns">
                      <button type="button" class="secondary" onclick="printVoucherPreview('Purchase Order', '${po.no}')" title="Preview / Print">👁 Preview</button>
                      ${po.status !== 'Converted' ? `<button type="button" class="primary" onclick="convertPOToPurchase('${po.no}')" title="Convert to Purchase GRN">Convert</button>` : ''}
                      <button type="button" class="secondary" onclick="editPurchaseOrder('${po.no}')">Edit</button>
                      <button type="button" class="danger-btn" onclick="deletePurchaseOrder('${po.no}')">Delete</button>
                    </div>
                  </td>
                </tr>
              `).join("") || '<tr><td colspan="7" class="empty-state">No purchase orders created yet. Click "+ Create Purchase Order" to begin.</td></tr>'}
            </tbody>
          </table>
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
    items: (po.items || []).map(i => ({ ...i })),
    isNew: true,
    isEditing: true
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
let outwardPeriodFrom = "2026-09-01";
let outwardPeriodTo = "2026-09-30";
let outwardDeptFilter = "All";

let outwardDraft = { department: "", store: "Main Store", date: today, issuedTo: "", reqNo: "", reference: "", remarks: "", items: [], isNew: false, isEditing: false };
const nextOutwardNo = () => `OUT-${String(state.outwards.length + 1).padStart(5, "0")}`;

function formatDateDMY(d) {
  if (!d) return "—";
  const str = String(d).slice(0, 10);
  const parts = str.split("-");
  if (parts.length === 3 && parts[0].length === 4) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return d;
  const day = String(dt.getDate()).padStart(2, "0");
  const month = String(dt.getMonth() + 1).padStart(2, "0");
  const year = dt.getFullYear();
  return `${day}-${month}-${year}`;
}

function newOutward(prefilledItems = []) {
  outwardDraft = {
    no: nextOutwardNo(),
    department: "", // Force manual selection
    reqNo: "",
    reference: "",
    store: state.currentStore || "Main Store",
    date: today,
    issuedTo: "",
    remarks: "",
    items: Array.isArray(prefilledItems) && prefilledItems.length
      ? prefilledItems.map(i => ({ product: i.product || "", qty: Number(i.qty) || 1, rate: Number(i.rate) || 0, unit: i.unit || "" }))
      : [{ product: "", qty: 1, rate: 0, unit: "" }],
    isNew: true,
    isEditing: false
  };
  showView("outward");
  setTimeout(() => {
    const deptSelect = document.getElementById("vfs-out-dept");
    if (deptSelect && !outwardDraft.department) {
      deptSelect.focus();
    } else {
      const firstInput = document.getElementById("out-search-0");
      if (firstInput) {
        firstInput.focus();
        firstInput.select();
      }
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

  return `
    <div class="outward-voucher-container" id="outward-fullscreen">
      <!-- Top Title Header -->
      <div class="outward-voucher-header">
        <h1 class="outward-voucher-title">Stock Outward Voucher</h1>
        <button type="button" class="outward-voucher-close-btn" onclick="exitOutwardFullscreen()" title="Close (Esc)">✕</button>
      </div>

      <!-- Master Controls Row -->
      <div class="outward-voucher-controls-row">
        <div class="voucher-control-item" style="width:170px;">
          <label class="voucher-control-label">DATE</label>
          <input type="date" class="voucher-control-input" id="vfs-out-date" value="${outwardDraft.date}" onchange="outwardDraft.date=this.value">
        </div>
        <div class="voucher-control-item" style="flex:1;min-width:240px;max-width:340px;">
          <label class="voucher-control-label">ISSUE TO DEPARTMENT</label>
          <select class="voucher-control-select" id="vfs-out-dept" onchange="outwardDraft.department=this.value">
            <option value="" disabled ${!outwardDraft.department ? 'selected' : ''}>-- Please Select Department --</option>
            ${departments.map(d => `<option value="${escapeQuote(d)}" ${d === outwardDraft.department ? 'selected' : ''}>${escapeHtml(d)}</option>`).join("")}
          </select>
        </div>
        <div class="voucher-control-item" style="width:200px;">
          <label class="voucher-control-label">REQ. NO.</label>
          <input type="text" class="voucher-control-input" id="vfs-out-reqno" value="${escapeHtml(outwardDraft.reqNo || outwardDraft.reference || '')}" placeholder="Optional" oninput="outwardDraft.reqNo=this.value;outwardDraft.reference=this.value">
        </div>
        <div style="margin-left:auto;padding-top:16px;">
          <button type="button" class="btn-load-from-purchase" onclick="openLoadFromPurchaseModal()">Load Items from Purchase...</button>
        </div>
      </div>

      <!-- Items Grid Scroll Area -->
      <div class="outward-voucher-grid-scroll">
        <table class="outward-voucher-table">
          <thead>
            <tr>
              <th style="width:44px;text-align:center;">#</th>
              <th>NAME OF ITEM</th>
              <th style="width:130px;text-align:right;">AVAILABLE</th>
              <th style="width:110px;text-align:right;">QTY</th>
              <th style="width:90px;text-align:center;">UNIT</th>
              <th style="width:130px;text-align:right;">RATE (COST)</th>
              <th style="width:140px;text-align:right;">VALUE</th>
              <th style="width:40px;text-align:center;"></th>
            </tr>
          </thead>
          <tbody id="outward-items-body">
            ${renderOutwardTableRows()}
          </tbody>
        </table>
        <div class="erp-add-row-bar">
          <button type="button" class="erp-add-row-btn" onclick="addOutwardRow()">＋ Add Item (or press Enter)</button>
        </div>
      </div>

      <!-- Docked Footer -->
      <div class="outward-docked-footer">
        <div class="outward-footer-main-row">
          <div class="outward-footer-left">
            <div class="outward-footer-counts">
              <span>Total Qty: <b id="outward-total-units">${numberValue(totalQty)}</b></span>
              <span>Items: <b id="outward-total-lines">${outwardDraft.items.length}</b></span>
            </div>
            <input type="text" class="outward-narration-box" id="vfs-out-remarks" placeholder="Narration..." value="${escapeHtml(outwardDraft.remarks || '')}" oninput="outwardDraft.remarks=this.value">
          </div>

          <div class="outward-footer-center">
            <span>(Taxation not applicable for internal movement)</span>
          </div>

          <div class="outward-total-value-card">
            <span class="outward-total-value-label">TOTAL VALUE</span>
            <span class="outward-total-value-amount" id="outward-total-amt">₹ ${formatMoneyValue(totalVal)}</span>
          </div>
        </div>

        <div class="outward-footer-buttons-bar">
          <button type="button" class="btn-voucher-cancel" onclick="exitOutwardFullscreen()">CANCEL (Esc)</button>
          <button type="button" class="btn-voucher-preview" onclick="previewCurrentOutward()">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            PREVIEW
          </button>
          <button type="button" class="btn-voucher-save" id="btn-save-outward" onclick="saveOutward()">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            SAVE OUTWARD (Ctrl+A)
          </button>
        </div>
      </div>
    </div>
  `;
}

function outwardTotal() {
  return outwardDraft.items.reduce((a, i) => {
    const p = productByName(i.product);
    const rate = i.rate !== undefined && i.rate !== null && !isNaN(Number(i.rate)) ? Number(i.rate) : (Number(p?.cost) || 0);
    return a + (Number(i.qty) || 0) * rate;
  }, 0);
}

function renderOutwardTableRows() {
  return outwardDraft.items.map((item, idx) => {
    const p = productByName(item.product);
    const qty = Number(item.qty) || 0;
    const rate = item.rate !== undefined && item.rate !== null && !isNaN(Number(item.rate)) ? Number(item.rate) : (Number(p?.cost) || 0);
    const amt = qty * rate;
    const unit = p?.unit || identifyItemUnit(item.product) || item.unit || 'pcs';
    const available = p ? (Number(p.stock) || 0) : 0;

    return `
      <tr data-row="${idx}">
        <td class="erp-cell-center" style="color:#64748b;font-weight:600;">${idx + 1}</td>
        <td>
          <div style="position:relative;width:100%;">
            <input id="out-search-${idx}" class="erp-cell-input" value="${escapeHtml(item.product || '')}"
              placeholder="Type 1-2 letters to search item..." autocomplete="off"
              oninput="handleOutwardSearchInput(event, ${idx})"
              onfocus="handleOutwardSearchFocus(event, ${idx})"
              onkeydown="handleOutwardSearchKeydown(event, ${idx})">
          </div>
        </td>
        <td style="width:130px;text-align:right;color:#475569;font-weight:600;font-family:'JetBrains Mono',monospace;">
          <span id="out-avail-${idx}">${p ? `${numberValue(available)} ${escapeHtml(unit)}` : '—'}</span>
        </td>
        <td style="width:110px;">
          <input type="number" id="out-qty-${idx}" class="erp-cell-input erp-cell-num" step="any" min="0" value="${item.qty ?? 1}"
            oninput="updateOutwardItemQty(${idx}, this.value)"
            onkeydown="handleOutwardQtyKeydown(event, ${idx})">
        </td>
        <td style="width:90px;" class="erp-cell-center">
          <span class="erp-unit-badge" id="out-unit-${idx}">${escapeHtml(unit)}</span>
        </td>
        <td style="width:130px;">
          <input type="number" id="out-rate-${idx}" class="erp-cell-input erp-cell-num" step="any" min="0" value="${rate}"
            oninput="updateOutwardItemRate(${idx}, this.value)"
            onkeydown="handleOutwardRateKeydown(event, ${idx})">
        </td>
        <td style="width:140px;">
          <span class="erp-amount-val" id="out-amt-${idx}">${formatMoneyValue(amt)}</span>
        </td>
        <td style="width:40px;text-align:center;">
          <button type="button" class="erp-row-del-btn" onclick="removeOutwardRow(${idx})" title="Delete row">✕</button>
        </td>
      </tr>
    `;
  }).join("") || `
    <tr>
      <td colspan="8" style="padding:24px;text-align:center;color:#64748b;">
        No items. Click "+ Add Item" or press Enter to add an item to issue.
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
    const rateEl = document.getElementById(`out-rate-${idx}`);
    if (rateEl) {
      rateEl.focus();
      rateEl.select();
    }
  }
}

function handleOutwardRateKeydown(e, idx) {
  if (e.key === "Enter") {
    e.preventDefault();
    updateOutwardItemRate(idx, e.target.value);
    if (idx < outwardDraft.items.length - 1) {
      const nextSearch = document.getElementById(`out-search-${idx + 1}`);
      if (nextSearch) {
        nextSearch.focus();
        nextSearch.select();
      }
    } else {
      addOutwardRow();
    }
  }
}

function onSelectOutwardItem(idx, product) {
  if (!outwardDraft.items[idx]) return;
  outwardDraft.items[idx].product = product.name;
  outwardDraft.items[idx].unit = product.unit || identifyItemUnit(product.name);
  outwardDraft.items[idx].rate = product.cost || 0;

  const searchInput = document.getElementById(`out-search-${idx}`);
  if (searchInput) searchInput.value = product.name;

  const availCell = document.getElementById(`out-avail-${idx}`);
  if (availCell) {
    const s = Number(product.stock) || 0;
    availCell.textContent = `${numberValue(s)} ${outwardDraft.items[idx].unit}`;
  }

  const unitCell = document.getElementById(`out-unit-${idx}`);
  if (unitCell) unitCell.textContent = outwardDraft.items[idx].unit;

  const rateInput = document.getElementById(`out-rate-${idx}`);
  if (rateInput) rateInput.value = product.cost || 0;

  const amtCell = document.getElementById(`out-amt-${idx}`);
  if (amtCell) amtCell.textContent = formatMoneyValue((outwardDraft.items[idx].qty || 0) * (product.cost || 0));

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
  const p = productByName(name);
  const formattedName = p ? p.name : formatItemName(name);
  outwardDraft.items[idx].product = formattedName;
  const unit = p ? p.unit : identifyItemUnit(formattedName);
  outwardDraft.items[idx].unit = unit;
  if (p) {
    outwardDraft.items[idx].rate = p.cost || 0;
    const availCell = document.getElementById(`out-avail-${idx}`);
    if (availCell) availCell.textContent = `${numberValue(p.stock || 0)} ${unit}`;
    const unitCell = document.getElementById(`out-unit-${idx}`);
    if (unitCell) unitCell.textContent = unit;
    const rateInput = document.getElementById(`out-rate-${idx}`);
    if (rateInput) rateInput.value = p.cost || 0;
  }
  refreshOutwardTotals();
}

function updateOutwardItemQty(idx, val) {
  if (!outwardDraft.items[idx]) return;
  outwardDraft.items[idx].qty = Number(val) || 0;
  const p = productByName(outwardDraft.items[idx].product);
  const rate = outwardDraft.items[idx].rate !== undefined ? outwardDraft.items[idx].rate : (p?.cost || 0);
  const amtCell = document.getElementById(`out-amt-${idx}`);
  if (amtCell) amtCell.textContent = formatMoneyValue(outwardDraft.items[idx].qty * rate);

  refreshOutwardTotals();
}

function updateOutwardItemRate(idx, val) {
  if (!outwardDraft.items[idx]) return;
  outwardDraft.items[idx].rate = Number(val) || 0;
  const amtCell = document.getElementById(`out-amt-${idx}`);
  if (amtCell) amtCell.textContent = formatMoneyValue((outwardDraft.items[idx].qty || 0) * outwardDraft.items[idx].rate);

  refreshOutwardTotals();
}

function refreshOutwardTotals() {
  const totalQty = outwardDraft.items.reduce((a, i) => a + (Number(i.qty) || 0), 0);
  const totalVal = outwardTotal();

  const qtyEl = document.getElementById("outward-total-units");
  if (qtyEl) qtyEl.textContent = numberValue(totalQty);
  const valEl = document.getElementById("outward-total-amt");
  if (valEl) valEl.textContent = `₹ ${formatMoneyValue(totalVal)}`;
  const linesEl = document.getElementById("outward-total-lines");
  if (linesEl) linesEl.textContent = outwardDraft.items.length;
}

function previewCurrentOutward() {
  syncOutwardDraftFromDOM();
  const validItems = outwardDraft.items.filter(i => (i.product || "").trim());
  if (!validItems.length) {
    toast("Please enter at least one item before previewing");
    return;
  }
  const totalVal = outwardTotal();
  const previewVoucher = {
    no: outwardDraft.no || nextOutwardNo(),
    date: outwardDraft.date || today,
    department: outwardDraft.department,
    reqNo: outwardDraft.reqNo || outwardDraft.reference || "",
    store: outwardDraft.store || state.currentStore || "Main Store",
    remarks: outwardDraft.remarks || "",
    issuedTo: outwardDraft.issuedTo || "",
    items: validItems.map(i => {
      const p = productByName(i.product);
      const rate = i.rate !== undefined ? Number(i.rate) : (p?.cost || 0);
      const qty = Number(i.qty) || 0;
      return {
        product: i.product,
        unit: p?.unit || i.unit || identifyItemUnit(i.product) || 'pcs',
        qty,
        rate,
        taxableAmount: qty * rate,
        gstAmount: 0,
        amount: qty * rate
      };
    }),
    total: totalVal,
    status: "Draft Preview"
  };
  showVoucherPreviewObject("Outward", previewVoucher, true);
}

function refreshOutwardTableStock() {
  outwardDraft.items.forEach((item, idx) => {
    const p = productByName(item.product);
    const availPill = document.getElementById(`out-avail-${idx}`);
    if (availPill && p) {
      const s = Number(p.stock) || 0;
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
  const reqEl = document.getElementById("vfs-out-reqno");
  if (reqEl) {
    outwardDraft.reqNo = reqEl.value.trim();
    outwardDraft.reference = reqEl.value.trim();
  }
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
    const rEl = document.getElementById(`out-rate-${idx}`);
    if (rEl && rEl.value !== "") item.rate = Number(rEl.value);
  });
}

function saveOutward() {
  syncOutwardDraftFromDOM();

  // Validate that user has selected a department manually
  if (!outwardDraft.department || outwardDraft.department === "" || outwardDraft.department.includes("Select Department")) {
    toast("Please select a Department before saving outward voucher.");
    const deptSelect = document.getElementById("vfs-out-dept");
    if (deptSelect) {
      deptSelect.focus();
      deptSelect.classList.add("input-error");
      setTimeout(() => deptSelect.classList.remove("input-error"), 2500);
    }
    return;
  }

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
    const formattedName = formatItemName(i.product);
    const p = productByName(formattedName);
    if (!p) {
      unknownProducts.push(formattedName);
      return {
        product: formattedName,
        unit: identifyItemUnit(formattedName),
        qty: Number(i.qty) || 1,
        rate: 0,
        amount: 0
      };
    }

    const qty = Number(i.qty) || 1;
    const available = Number(p.stock) || 0;
    if (qty > available && !state.settings.inventory?.negative) {
      exceededStockItems.push({ name: p.name, qty, available, unit: p.unit || "kg" });
    }

    return {
      product: p.name,
      unit: p.unit || identifyItemUnit(p.name),
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
    department: outwardDraft.department || "",
    reqNo: outwardDraft.reqNo || outwardDraft.reference || "",
    reference: outwardDraft.reqNo || outwardDraft.reference || "",
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
  outwardDraft = { department: "", store: state.currentStore, date: today, issuedTo: "", reqNo: "", reference: "", remarks: "", items: [], isNew: false, isEditing: false };
  closeProductSearchPopover();
  showView("outward");
}

function openLoadFromPurchaseModal() {
  const purchases = state.purchases || [];
  if (purchases.length === 0) {
    toast("No purchase GRNs found to load items from.");
    return;
  }

  const modalHtml = `
    <div class="modal-overlay show" id="load-purchase-modal" onclick="if(event.target===this)closeLoadPurchaseModal()" style="display:flex;position:fixed;inset:0;background:rgba(15,23,42,0.6);z-index:9999;align-items:center;justify-content:center;">
      <div class="modal-card" style="background:#fff;border-radius:10px;width:90%;max-width:680px;max-height:85vh;display:flex;flex-direction:column;box-shadow:0 20px 25px -5px rgba(0,0,0,0.1),0 8px 10px -6px rgba(0,0,0,0.1);overflow:hidden;">
        <div style="display:flex;justify-content:space-between;align-items:center;padding:16px 20px;border-bottom:1px solid #e2e8f0;">
          <h3 style="margin:0;font-size:17px;font-weight:700;color:#0f172a;">Load Items from Purchase</h3>
          <button type="button" onclick="closeLoadPurchaseModal()" style="border:none;background:none;font-size:20px;color:#64748b;cursor:pointer;padding:4px 8px;">✕</button>
        </div>
        <div style="padding:16px 20px;overflow-y:auto;flex:1;">
          <p style="font-size:13px;color:#64748b;margin:0 0 14px 0;">Select a Goods Receipt Note (GRN) to populate this outward voucher with its purchased items:</p>
          <div style="display:flex;flex-direction:column;gap:10px;">
            ${purchases.slice(0, 30).map(p => `
              <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 14px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;">
                <div>
                  <div style="font-weight:700;font-size:14px;color:#0f172a;">${escapeHtml(p.no)} <span style="font-weight:normal;color:#64748b;font-size:12px;">(${fmtDate(p.date)})</span></div>
                  <div style="font-size:12.5px;color:#475569;margin-top:2px;">Supplier: <b>${escapeHtml(p.supplier || '—')}</b> · ${p.items?.length || 0} items · Total: <b>${money(p.total)}</b></div>
                </div>
                <button type="button" style="padding:6px 14px;font-size:12.5px;background:#16a34a;color:#fff;border:none;border-radius:4px;font-weight:600;cursor:pointer;" onclick="loadItemsFromPurchase('${escapeQuote(p.no)}')">
                  Load Items
                </button>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    </div>
  `;

  let existing = document.getElementById("load-purchase-modal");
  if (existing) existing.remove();
  document.body.insertAdjacentHTML("beforeend", modalHtml);
}

function closeLoadPurchaseModal() {
  const m = document.getElementById("load-purchase-modal");
  if (m) m.remove();
}

function loadItemsFromPurchase(grnNo) {
  const p = (state.purchases || []).find(x => x.no === grnNo);
  if (!p || !Array.isArray(p.items) || p.items.length === 0) {
    toast("No items found in selected GRN");
    closeLoadPurchaseModal();
    return;
  }

  outwardDraft.items = p.items.map(it => {
    const prod = productByName(it.product);
    return {
      product: it.product,
      qty: Number(it.qty) || 1,
      rate: Number(it.rate) || (prod ? Number(prod.cost) : 0),
      unit: it.unit || (prod ? prod.unit : 'pcs')
    };
  });

  if (!outwardDraft.remarks) {
    outwardDraft.remarks = `Loaded from GRN: ${p.no}`;
  }
  if (!outwardDraft.reqNo && p.reference) {
    outwardDraft.reqNo = p.reference;
    outwardDraft.reference = p.reference;
  }

  closeLoadPurchaseModal();
  toast(`Loaded ${outwardDraft.items.length} items from ${p.no}`);
  showView("outward");
}

function editOutwardVoucher(no) {
  const v = state.outwards.find(o => o.no === no);
  if (!v) { toast("Outward voucher not found"); return; }
  outwardDraft = {
    ...v,
    reqNo: v.reqNo || v.reference || "",
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
  const filtered = state.outwards.filter(o => {
    const dStr = String(o.date || "").slice(0, 10);
    const matchFrom = !outwardPeriodFrom || dStr >= outwardPeriodFrom;
    const matchTo = !outwardPeriodTo || dStr <= outwardPeriodTo;
    const matchDept = outwardDeptFilter === "All" || (o.department || "").toLowerCase() === outwardDeptFilter.toLowerCase();
    return matchFrom && matchTo && matchDept;
  });

  const totalPeriodCost = filtered.reduce((sum, o) => sum + Number(o.total || 0), 0);

  return `
    <div style="padding: 0 4px;">
      <div class="outward-history-card">
        <h2 class="outward-history-heading">Stock Outward History</h2>

        <div class="outward-history-filter-row">
          <span class="outward-period-tag">PERIOD:</span>
          <input type="date" class="outward-date-input" value="${outwardPeriodFrom}" onchange="outwardPeriodFrom=this.value;showView('outward')">
          <span style="color:#64748b;font-size:13px;">to</span>
          <input type="date" class="outward-date-input" value="${outwardPeriodTo}" onchange="outwardPeriodTo=this.value;showView('outward')">

          <select class="outward-dept-select" onchange="outwardDeptFilter=this.value;showView('outward')">
            <option value="All" ${outwardDeptFilter === "All" ? "selected" : ""}>All Departments</option>
            ${departments.map(d => `<option value="${escapeQuote(d)}" ${outwardDeptFilter === d ? "selected" : ""}>${escapeHtml(d)}</option>`).join("")}
          </select>
        </div>

        <div class="outward-history-table-container">
          <table class="outward-history-table">
            <thead>
              <tr>
                <th>DATE ▼</th>
                <th>TRANSACTION ID</th>
                <th>REQ. NO</th>
                <th>DEPARTMENT</th>
                <th style="text-align:right;">TOTAL COST</th>
                <th style="text-align:center;">ACTION</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.length > 0 ? filtered.map(o => `
                <tr>
                  <td>${formatDateDMY(o.date)}</td>
                  <td><b>${escapeHtml(o.no)}</b></td>
                  <td>${escapeHtml(o.reqNo || o.reference || '—')}</td>
                  <td>${escapeHtml(o.department || 'Kitchen')}</td>
                  <td style="text-align:right;font-weight:700;">${Number(o.total || 0).toFixed(2)}</td>
                  <td style="text-align:center;">
                    <div style="display:inline-flex;gap:6px;">
                      <button type="button" class="secondary" style="padding:4px 9px;font-size:11.5px;border-radius:4px;" onclick="viewVoucher('${escapeQuote(o.no)}', false)">View</button>
                      <button type="button" class="secondary" style="padding:4px 9px;font-size:11.5px;border-radius:4px;" onclick="editOutwardVoucher('${escapeQuote(o.no)}')">Edit</button>
                      <button type="button" class="danger-btn" style="padding:4px 9px;font-size:11.5px;border-radius:4px;" onclick="deleteOutwardVoucher('${escapeQuote(o.no)}')">Delete</button>
                    </div>
                  </td>
                </tr>
              `).join("") : `
                <tr>
                  <td colspan="6" class="outward-period-total-cell">
                    Total for Period: ${Number(totalPeriodCost).toFixed(2)}
                  </td>
                </tr>
              `}
            </tbody>
            ${filtered.length > 0 ? `
              <tfoot>
                <tr>
                  <td colspan="6" class="outward-period-total-cell" style="border-top:1px solid #e2e8f0;">
                    Total for Period: ${Number(totalPeriodCost).toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            ` : ''}
          </table>
        </div>
      </div>
    </div>
  `;
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

function showVoucherPreviewObject(kind, voucher, isLiveDraft = false) {
  if (!voucher) { toast("Document not found"); return; }

  const isPurchase = kind === "Purchase";
  const isPO = kind === "Purchase Order";
  const items = voucher.items || [];
  const hasGst = (isPurchase || isPO) && items.some(i => Number(i.gstRate) > 0 || Number(i.gstAmount) > 0);
  const totalQty = items.reduce((a, i) => a + (Number(i.qty) || 0), 0);
  const taxableSubtotal = items.reduce((a, i) => a + (Number(i.taxableAmount) || ((Number(i.qty) || 0) * (Number(i.rate) || 0))), 0);
  const totalGst = items.reduce((a, i) => a + (Number(i.gstAmount) || 0), 0);
  const isPosted = !voucher.status || voucher.status.toLowerCase() === "posted" || voucher.status.toLowerCase() === "received";

  const modalTitle = isPO ? `PURCHASE ORDER — ${voucher.no}` : isPurchase ? `PURCHASE INVOICE — ${voucher.no}` : `STOCK ISSUE VOUCHER — ${voucher.no}`;
  const docBadge = isPO ? "PURCHASE ORDER (PO)" : isPurchase ? "GOODS RECEIPT NOTE (GRN)" : "STOCK OUTWARD NOTE";

  openInAppModal(modalTitle, `
    <!-- Top Action / Print Trigger Banner -->
    <div class="pv-top-bar no-print" style="display:flex;align-items:center;justify-content:space-between;background:#f8fafc;padding:10px 14px;border-radius:8px;border:1px solid #cbd5e1;margin-bottom:14px;flex-wrap:wrap;gap:10px;">
      <div style="display:flex;align-items:center;gap:10px;">
        <span style="font-size:20px;">${isLiveDraft ? '👁️' : '🖨️'}</span>
        <div>
          <div style="font-weight:700;font-size:13px;color:#0f172a;">${isLiveDraft ? 'Live Document Preview (Unsaved Draft)' : 'Print & PDF Export'}</div>
          <div style="font-size:12px;color:#64748b;">Formatted for clean A4 printing with colored font styling and no UI chrome.</div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        ${!isLiveDraft ? `
          <button type="button" class="secondary" id="btn-open-pdf-window" onclick="openVoucherPrintTab('${kind}', '${voucher.no}')" title="Open formatted document in a standalone page" style="display:inline-flex;align-items:center;gap:5px;font-size:12px;padding:6px 10px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            Open A4 Tab
          </button>
          <button type="button" class="secondary" id="btn-download-voucher-pdf" onclick="downloadVoucherDocument('${kind}', '${voucher.no}')" title="Download formatted HTML/PDF file" style="display:inline-flex;align-items:center;gap:5px;font-size:12px;padding:6px 10px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Download
          </button>
          <button type="button" class="primary" id="btn-print-voucher-top" onclick="triggerCleanPrint('${kind}', '${voucher.no}')" style="display:inline-flex;align-items:center;gap:6px;padding:6px 16px;font-size:13px;font-weight:700;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
            Print / PDF
          </button>
        ` : `
          <button type="button" class="primary" onclick="closeModal();${isPurchase ? 'savePurchase()' : isPO ? 'savePurchaseOrder()' : 'saveOutward()'}" style="font-size:12.5px;padding:6px 14px;">
            ✔ Save ${isPurchase ? 'Purchase' : isPO ? 'Order' : 'Issue'} Now
          </button>
        `}
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
          <div class="pv-doc-type-badge ${isPurchase || isPO ? 'purchase' : 'outward'}">${docBadge}</div>
          <div class="pv-voucher-no">${escapeHtml(voucher.no)}</div>
          <div class="pv-voucher-date">Date: <b style="color:#0f172a;">${fmtDate(voucher.date)}</b></div>
        </div>
      </div>

      <div class="pv-meta-card">
        ${voucher.store ? `<div class="pv-meta-item"><span>Warehouse:</span> <b>${escapeHtml(voucher.store)}</b></div>` : ''}
        <div class="pv-meta-item"><span>${(isPurchase || isPO) ? "Supplier / Vendor:" : "Department:"}</span> <b class="${(isPurchase || isPO) ? 'supplier-val' : 'dept-val'}">${escapeHtml((isPurchase || isPO) ? voucher.supplier : voucher.department)}</b></div>
        <div class="pv-meta-item"><span>Recorded By:</span> <b>${escapeHtml(voucher.user || state.currentUser)}</b></div>
        ${voucher.reference ? `<div class="pv-meta-item"><span>Ref / Inv #:</span> <b>${escapeHtml(voucher.reference)}</b></div>` : ''}
        ${voucher.issuedTo ? `<div class="pv-meta-item"><span>Issued To:</span> <b>${escapeHtml(voucher.issuedTo)}</b></div>` : ''}
        <div class="pv-meta-item"><span>Status:</span> <span class="pv-status-badge ${isPosted ? 'posted' : 'issued'}">${escapeHtml(voucher.status || ((isPurchase || isPO) ? "Posted" : "Issued"))}</span></div>
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
    ${!isLiveDraft ? `
      ${isPO ? `
        <button class="secondary" onclick="closeModal();editPurchaseOrder('${voucher.no}')">Edit / Modify</button>
        <button class="danger-btn" onclick="closeModal();deletePurchaseOrder('${voucher.no}')">Delete</button>
      ` : isPurchase ? `
        <button class="secondary" onclick="closeModal();editPurchaseVoucher('${voucher.no}')">Edit / Modify</button>
        <button class="danger-btn" onclick="closeModal();deletePurchaseVoucher('${voucher.no}')">Delete</button>
      ` : `
        <button class="secondary" onclick="closeModal();editOutwardVoucher('${voucher.no}')">Edit / Modify</button>
        <button class="danger-btn" onclick="closeModal();deleteOutwardVoucher('${voucher.no}')">Delete</button>
      `}
      <button class="primary" id="btn-print-voucher-bottom" onclick="triggerCleanPrint('${kind}', '${voucher.no}')" style="display:inline-flex;align-items:center;gap:6px;">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
        Print / PDF
      </button>
    ` : `
      <button class="primary" onclick="closeModal();${isPurchase ? 'savePurchase()' : isPO ? 'savePurchaseOrder()' : 'saveOutward()'}">
        ✔ Save Now
      </button>
    `}
  `);
}

function printVoucherPreview(kind, no) {
  let voucher = null;
  if (kind === "Purchase Order") {
    voucher = state.purchaseOrders.find(x => x.no === no);
  } else if (kind === "Purchase") {
    voucher = state.purchases.find(x => x.no === no);
  } else {
    voucher = state.outwards.find(x => x.no === no);
  }
  if (!voucher) { toast("Voucher not found"); return; }
  showVoucherPreviewObject(kind, voucher, false);
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

// ==========================================
// VENDOR ACCOUNTS & PURCHASE HISTORY SYSTEM
// ==========================================
let selectedVendorForAccounts = null;
let accountsSubView = "details"; // "details" | "purchase-history"

function selectVendorAccount(vendorName) {
  selectedVendorForAccounts = vendorName;
  accountsSubView = "details";
  showView("accounts");
}

function openVendorPurchaseHistory(vendorName) {
  if (vendorName) selectedVendorForAccounts = vendorName;
  accountsSubView = "purchase-history";
  showView("accounts");
}

function backToAccountsFromHistory() {
  accountsSubView = "details";
  showView("accounts");
}

function accountsScreen() {
  // If user requested purchase history for selected vendor
  if (accountsSubView === "purchase-history") {
    return renderVendorPurchaseHistoryScreen();
  }

  // Calculate financials for all approved vendors
  const vendors = state.suppliers.map(s => {
    const name = s[0];
    const fin = getSupplierFinancials(name);
    return {
      name,
      category: fin.category,
      contact: fin.contact,
      totalBusiness: fin.totalInvoiced,
      amountPaid: fin.totalPaid,
      balanceDue: Math.max(0, fin.netDue)
    };
  });

  const selectedVendor = selectedVendorForAccounts
    ? vendors.find(v => v.name.toLowerCase() === selectedVendorForAccounts.toLowerCase())
    : null;

  // Invoices for selected vendor
  let invoicesHtml = "";
  if (selectedVendor) {
    const vendorPurchases = (state.purchases || []).filter(
      p => (p.supplier || "").trim().toLowerCase() === selectedVendor.name.toLowerCase()
    );

    if (vendorPurchases.length === 0) {
      invoicesHtml = `<tr><td colspan="5" class="vendor-empty-table-state" style="padding:28px 12px !important;color:#94a3b8;text-align:center;">No invoices found for this vendor.</td></tr>`;
    } else {
      invoicesHtml = vendorPurchases.map(p => {
        const isPaid = (state.payments || []).some(
          pm => pm.supplier === selectedVendor.name && (pm.ref === p.no || pm.ref === p.reference)
        );
        const statusLabel = isPaid ? "PAID" : (p.status || "UNPAID");
        const statusClass = isPaid ? "paid" : "unpaid";
        return `
          <tr>
            <td>${fmtDate(p.date)}</td>
            <td><b>${escapeHtml(p.reference || p.no)}</b></td>
            <td><b>${Number(p.total || 0).toFixed(2)}</b></td>
            <td><span class="invoice-status-pill ${statusClass}">${statusLabel}</span></td>
            <td>
              <button type="button" class="secondary" style="padding:4px 10px;font-size:12px;border-radius:6px;" onclick="viewVoucher('${escapeQuote(p.no)}', true)">View</button>
            </td>
          </tr>
        `;
      }).join("");
    }
  }

  return `
    <div class="vendor-accounts-page">
      <h1 class="vendor-accounts-main-heading">Vendor Accounts</h1>

      <div class="vendor-accounts-grid">
        <!-- Left Panel: Vendors List -->
        <div class="vendor-accounts-card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <h3 class="vendor-card-heading" style="margin:0;">Vendors</h3>
            <button type="button" class="secondary" style="padding:4px 8px;font-size:11.5px;border-radius:6px;" onclick="openModal('supplier')">＋ Add</button>
          </div>
          <div class="vendor-items-list">
            ${vendors.map(v => {
              const isSelected = selectedVendor && (v.name.toLowerCase() === selectedVendor.name.toLowerCase());
              return `
                <div class="vendor-list-item ${isSelected ? 'selected' : ''}" onclick="selectVendorAccount('${escapeQuote(v.name)}')">
                  <div class="vendor-item-name">${escapeHtml(v.name)}</div>
                  <div class="vendor-item-balance">Balance: ${Number(v.balanceDue).toFixed(2)}</div>
                </div>
              `;
            }).join("")}
          </div>
        </div>

        <!-- Right Panel: Vendor Details or Empty State -->
        <div class="vendor-accounts-card">
          ${!selectedVendor ? `
            <div class="vendor-details-empty-placeholder">
              Select a vendor to see details
            </div>
          ` : `
            <div>
              <div class="vendor-details-header">
                <div>
                  <h2 class="vendor-name-title">${escapeHtml(selectedVendor.name)}</h2>
                  <div class="vendor-stats-row">
                    <span class="vstat-item">Total Business: <b>${Number(selectedVendor.totalBusiness).toFixed(2)}</b></span>
                    <span class="vstat-item">Amount Paid: <b class="vstat-paid">${Number(selectedVendor.amountPaid).toFixed(2)}</b></span>
                    <span class="vstat-item">Balance Due: <b class="vstat-due">${Number(selectedVendor.balanceDue).toFixed(2)}</b></span>
                  </div>
                </div>
                <div>
                  <button type="button" class="btn-purchase-history" onclick="openVendorPurchaseHistory('${escapeQuote(selectedVendor.name)}')">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    Purchase History
                  </button>
                </div>
              </div>

              <div>
                <h3 class="vendor-invoices-heading">Invoices</h3>
                <div class="vendor-invoices-table-wrap">
                  <table class="vendor-invoices-table">
                    <thead>
                      <tr>
                        <th>DATE</th>
                        <th>INVOICE #</th>
                        <th>AMOUNT</th>
                        <th>STATUS</th>
                        <th>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${invoicesHtml}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          `}
        </div>
      </div>
    </div>
  `;
}

function renderVendorPurchaseHistoryScreen() {
  const vName = selectedVendorForAccounts || (state.suppliers[0] ? state.suppliers[0][0] : "Vendor");
  const vendorPurchases = (state.purchases || []).filter(
    p => (p.supplier || "").trim().toLowerCase() === vName.trim().toLowerCase()
  );

  let rows = [];
  vendorPurchases.forEach(p => {
    const invNo = p.reference || p.no || "—";
    const dateStr = fmtDate(p.date);
    if (Array.isArray(p.items) && p.items.length > 0) {
      p.items.forEach(it => {
        const qtyVal = Number(it.qty || 0);
        const rateVal = Number(it.rate || 0);
        const gstRateVal = it.gstRate != null ? Number(it.gstRate) : 0;
        const gstAmtVal = it.gstAmount != null ? Number(it.gstAmount) : (qtyVal * rateVal * (gstRateVal / 100));
        const totalVal = it.amount != null ? Number(it.amount) : ((qtyVal * rateVal) + gstAmtVal);
        rows.push({
          date: dateStr,
          invoiceNo: invNo,
          product: it.product || "Item",
          quantity: `${numberValue(qtyVal)} ${it.unit || ''}`.trim(),
          rate: rateVal.toFixed(2),
          gstRate: gstRateVal ? `${gstRateVal}%` : "0%",
          gstAmount: gstAmtVal.toFixed(2),
          total: totalVal.toFixed(2),
          voucherNo: p.no
        });
      });
    } else {
      const tot = Number(p.total || 0);
      rows.push({
        date: dateStr,
        invoiceNo: invNo,
        product: p.remarks || "General Goods Restock",
        quantity: "1 lot",
        rate: tot.toFixed(2),
        gstRate: "0%",
        gstAmount: "0.00",
        total: tot.toFixed(2),
        voucherNo: p.no
      });
    }
  });

  return `
    <div class="purchase-history-view-container">
      <div class="purchase-history-header-row">
        <h2 class="purchase-history-title">Purchase History: ${escapeHtml(vName)}</h2>
        <button type="button" class="back-to-accounts-btn" onclick="backToAccountsFromHistory()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Back to Accounts
        </button>
      </div>

      <div class="vendor-accounts-table-card">
        <table class="vendor-history-table">
          <thead>
            <tr>
              <th>DATE</th>
              <th>INVOICE NO</th>
              <th>PRODUCT NAME</th>
              <th>QUANTITY</th>
              <th>RATE</th>
              <th>GST %</th>
              <th>GST AMOUNT</th>
              <th>TOTAL</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            ${rows.length > 0 ? rows.map(r => `
              <tr>
                <td>${escapeHtml(r.date)}</td>
                <td><b>${escapeHtml(r.invoiceNo)}</b></td>
                <td><b>${escapeHtml(r.product)}</b></td>
                <td>${escapeHtml(r.quantity)}</td>
                <td>${r.rate}</td>
                <td>${r.gstRate}</td>
                <td>${r.gstAmount}</td>
                <td><b>${r.total}</b></td>
                <td>
                  <button type="button" class="secondary" style="padding:4px 10px;font-size:12px;border-radius:6px;" onclick="viewVoucher('${escapeQuote(r.voucherNo)}', true)">View</button>
                </td>
              </tr>
            `).join("") : `
              <tr>
                <td colspan="9" class="vendor-empty-table-state">
                  No purchase history found for this vendor.
                </td>
              </tr>
            `}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ==========================================
// STOCKSENSE UNIVERSAL REPORT SYSTEM
// ==========================================

const REPORT_CATEGORIES = {
  "Stock Reports": [
    "Current Stock Report",
    "Stock Valuation Report",
    "Low Stock Report",
    "Out of Stock Report",
    "Stock Movement Report",
    "Stock Adjustment Report"
  ],
  "Purchase Reports": [
    "Purchase Register",
    "Purchase by Vendor",
    "Purchase by Product",
    "Purchase Return Report",
    "Monthly Purchase Report"
  ],
  "Outward / Consumption Reports": [
    "Outward Register",
    "Consumption by Product",
    "Consumption by Department",
    "Monthly Consumption Report",
    "Wastage / Adjustment Report"
  ],
  "Sales Reports": [
    "Daily Sales Report",
    "Monthly Sales Report",
    "Sales by Category",
    "Sales by Product",
    "Sales Summary"
  ],
  "Vendor Reports": [
    "Vendor Purchase History",
    "Vendor Outstanding",
    "Vendor Payment Report",
    "Vendor-wise Purchase Summary"
  ],
  "Product Reports": [
    "Product Master",
    "Product-wise Stock",
    "Product-wise Purchase",
    "Product-wise Consumption",
    "Product Movement History"
  ],
  "Financial / Cost Reports": [
    "Purchase Cost Summary",
    "COGS Report",
    "Stock Value Report",
    "Gross Margin Report",
    "Tax / GST Summary"
  ],
  "Activity Reports": [
    "User Activity Log",
    "Stock Adjustment History",
    "Purchase Activity",
    "Outward Activity"
  ]
};

let reportState = {
  selectedCategory: "Stock Reports",
  selectedReport: "Current Stock Report",
  dateFrom: "2026-09-01",
  dateTo: "2026-09-23",
  category: "All",
  warehouse: "All",
  search: "",
  viewMode: "standard" // "standard" or "movement"
};

let currentReportType = "stock";
let reportFilters = {
  stock: { category: "All", store: "All", status: "All", search: "" },
  ledger: { product: "All", store: "All", range: "This Month", type: "All", search: "" },
  purchase: { supplier: "All", store: "All", range: "This Month", search: "" },
  outward: { department: "All", store: "All", range: "This Month", search: "" },
  consumption: { department: "All", store: "All", range: "This Month" },
  deadstock: { days: 30, store: "All", category: "All", search: "" }
};

function onReportTypeChange(newCat) {
  reportState.selectedCategory = newCat;
  const list = REPORT_CATEGORIES[newCat] || [];
  reportState.selectedReport = list[0] || "";
  const repSelect = document.getElementById("report-select");
  if (repSelect) {
    repSelect.innerHTML = list.map(r => `<option value="${escapeHtml(r)}" ${r === reportState.selectedReport ? "selected" : ""}>${escapeHtml(r)}</option>`).join("");
  }
  renderReportContent();
}

function onReportSelectChange(newRep) {
  reportState.selectedReport = newRep;
  renderReportContent();
}

function setReportViewMode(mode) {
  reportState.viewMode = mode;
  renderReportContent();
}

function getDistinctReportCategories() {
  const cats = new Set();
  (state.products || []).forEach(p => {
    let c = p.category;
    if (c === "Grocery") c = "Groceries";
    if (c) cats.add(c);
  });
  return Array.from(cats).sort();
}

function getDistinctReportStores() {
  const stores = new Set();
  (state.stores || []).forEach(s => stores.add(Array.isArray(s) ? s[0] : (s.name || s)));
  (state.products || []).forEach(p => { if (p.store) stores.add(p.store); });
  return Array.from(stores).sort();
}

function formatReportCurrency(num) {
  const n = Number(num) || 0;
  return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function computeUniversalTotalsRow(headers, rows, options = {}) {
  if (!headers || !headers.length || !rows || !rows.length) return [];
  const numCols = headers.length;
  const totals = new Array(numCols).fill("");

  for (let c = 0; c < numCols; c++) {
    const rawHeader = String(headers[c] || "").trim();
    const h = rawHeader.toLowerCase();

    // Check if non-aggregatable column
    const isExcluded = /^(#|id|no|code|hsn|sku|date|timestamp|time|ref|reference|voucher|invoice|grn|user|operator|staff|recorded\s*by|supplier|vendor|department|dept|store|warehouse|section|item|product|name|desc|description|category|unit|status|type|remark|remarks|purpose|action|recommendation|email|contact|lead\s*time|terms|days\s*inactive|days\s*dormant|last\s*outward|last\s*movement)/i.test(h);
    
    // Explicit rate exclusions
    const isRate = /^(cost\s*rate|unit\s*cost|avg\s*unit\s*cost|rate|price|unit\s*price|min\s*level|min\s*lvl|min\s*reorder\s*level|credit\s*terms|days\s*dormant|days\s*inactive)$/i.test(h);

    if (isRate || (isExcluded && !h.includes("total") && !h.includes("count") && !h.includes("items") && !h.includes("units") && !h.includes("spend") && !h.includes("amount") && !h.includes("value") && !h.includes("qty") && !h.includes("quantity"))) {
      totals[c] = "";
      continue;
    }

    // Check for percentage / share column
    if (h.includes("share") || h.includes("pct") || h.includes("%")) {
      totals[c] = "100.0%";
      continue;
    }

    // Parse numbers from column cells
    let sum = 0;
    let numericCount = 0;
    let hasCurrencySymbol = false;
    let hasDecimals = false;
    let detectedUnit = "";

    for (let r = 0; r < rows.length; r++) {
      const cellVal = rows[r][c];
      if (cellVal === undefined || cellVal === null || cellVal === "" || cellVal === "—" || cellVal === "-") continue;
      const str = String(cellVal).trim();

      if (str.includes("₹") || /Rs\.?/i.test(str)) {
        hasCurrencySymbol = true;
      }

      const unitMatch = str.match(/(kg|gm|ltr|pcs|Units?|pkts?|vouchers?|items?|records?|SKUs?|invoices?|heads?|batches?)/i);
      if (unitMatch && !detectedUnit) {
        detectedUnit = unitMatch[0];
      }

      const isNeg = str.startsWith("-") || str.startsWith("(") || (str.includes("-") && !str.includes(":") && !str.includes("/"));
      const cleaned = str
        .replace(/[₹$€]/g, "")
        .replace(/Rs\.?/gi, "")
        .replace(/,/g, "")
        .replace(/(kg|gm|ltr|pcs|Units?|pkts?|vouchers?|items?|records?|SKUs?|invoices?|heads?|batches?|%)/gi, "")
        .replace(/[()+]/g, "")
        .trim();

      const num = parseFloat(cleaned);
      if (!isNaN(num) && isFinite(num)) {
        numericCount++;
        sum += isNeg && num > 0 ? -num : num;
        if (cleaned.includes(".")) hasDecimals = true;
      }
    }

    const isAmountCol = /(amount|value|valuation|cost|total|spend|gst|tax|cogs|revenue|sales|billed|paid|due|balance|subtotal|impact|deficit|capital)/i.test(h);
    const isQtyCol = /(qty|quantity|units|stock|closing|opening|purchase|outward|receipts|consumption|disbursed|received|shortage|carry\s*forward)/i.test(h);
    const isCountCol = /(invoices|orders|requisitions|items\s*count|count)/i.test(h);

    if (numericCount > 0 && (numericCount >= rows.length * 0.3 || isAmountCol || isQtyCol || isCountCol)) {
      if (isAmountCol || hasCurrencySymbol) {
        const rounded = Math.round(sum * 100) / 100;
        totals[c] = `₹ ${formatMoneyValue(rounded)}`;
      } else if (isQtyCol) {
        const rounded = Math.round(sum * 100) / 100;
        const formattedQty = numberValue(rounded);
        totals[c] = detectedUnit ? `${formattedQty} ${detectedUnit}` : `${formattedQty} Units`;
      } else if (isCountCol) {
        totals[c] = `${Math.round(sum)} ${detectedUnit || 'Records'}`;
      } else {
        totals[c] = hasDecimals ? (Math.round(sum * 100) / 100).toFixed(2) : String(Math.round(sum));
      }
    }
  }

  // Label the total column
  let labelPlaced = false;
  if (headers[0] === "#" && numCols > 1) {
    totals[0] = "";
    totals[1] = "TOTAL";
    labelPlaced = true;
  } else {
    for (let c = 0; c < numCols; c++) {
      if (!totals[c]) {
        totals[c] = "TOTAL";
        labelPlaced = true;
        break;
      }
    }
  }
  if (!labelPlaced) {
    totals[0] = "TOTAL";
  }

  return totals;
}

function isDateInRange(dStr, fromStr, toStr) {
  if (!dStr) return true;
  const d = String(dStr).slice(0, 10);
  if (fromStr && d < fromStr) return false;
  if (toStr && d > toStr) return false;
  return true;
}

function generateReportTableData() {
  const cat = reportState.selectedCategory;
  const rep = reportState.selectedReport;
  const q = (reportState.search || "").toLowerCase().trim();
  const dFrom = reportState.dateFrom;
  const dTo = reportState.dateTo;
  const activeWh = state.currentStore || "Main Store";

  let exportHeaders = [];
  let exportRows = [];
  let tableHtml = "";
  let countStr = "0 items";
  let toggleHtml = "";

  // 1. STOCK REPORTS
  if (cat === "Stock Reports") {
    const filteredProds = (state.products || []).filter(p => {
      let pCat = p.category === "Grocery" ? "Groceries" : (p.category || "General");
      const matchCat = reportState.category === "All" || pCat === reportState.category;
      const matchWh = reportState.warehouse === "All" || (p.store || activeWh) === reportState.warehouse;
      const matchQ = !q || p.name.toLowerCase().includes(q) || pCat.toLowerCase().includes(q);
      return matchCat && matchWh && matchQ;
    });

    countStr = `${filteredProds.length} items`;

    if (rep === "Current Stock Report" && reportState.viewMode === "standard") {
      toggleHtml = `
        <div class="reports-view-toggle">
          <button class="${reportState.viewMode === 'standard' ? 'active' : ''}" onclick="setReportViewMode('standard')">Standard View</button>
          <button class="${reportState.viewMode === 'movement' ? 'active' : ''}" onclick="setReportViewMode('movement')">Movement Breakdown</button>
        </div>
      `;

      exportHeaders = ["PRODUCT NAME", "CATEGORY", "QUANTITY", "STOCK VALUE"];
      exportRows = filteredProds.map(p => [
        p.name,
        p.category === "Grocery" ? "Groceries" : (p.category || "General"),
        `${numberValue(p.stock)} ${p.unit || 'kg'}`,
        formatReportCurrency((Number(p.stock) || 0) * (Number(p.cost) || 0))
      ]);

      const totalVal = filteredProds.reduce((sum, p) => sum + ((Number(p.stock) || 0) * (Number(p.cost) || 0)), 0);

      tableHtml = `
        <table class="reports-grid-table">
          <thead>
            <tr>
              <th>PRODUCT NAME</th>
              <th>CATEGORY</th>
              <th>QUANTITY</th>
              <th class="text-right">STOCK VALUE</th>
            </tr>
          </thead>
          <tbody>
            ${filteredProds.map(p => `
              <tr>
                <td class="td-item-title">${escapeHtml(p.name)}</td>
                <td>${escapeHtml(p.category === "Grocery" ? "Groceries" : (p.category || "General"))}</td>
                <td>${numberValue(p.stock)} ${escapeHtml(p.unit || 'kg')}</td>
                <td class="td-price-bold">${formatReportCurrency((Number(p.stock) || 0) * (Number(p.cost) || 0))}</td>
              </tr>
            `).join("")}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2"><b>Total Stock Valuation (${filteredProds.length} Items)</b></td>
              <td><b>${numberValue(filteredProds.reduce((s, p) => s + (Number(p.stock) || 0), 0))} Units</b></td>
              <td class="text-right td-price-bold">₹${formatReportCurrency(totalVal)}</td>
            </tr>
          </tfoot>
        </table>
      `;
    } else if (rep === "Current Stock Report" || rep === "Stock Movement Report") {
      toggleHtml = `
        <div class="reports-view-toggle">
          <button class="${reportState.viewMode === 'standard' ? 'active' : ''}" onclick="setReportViewMode('standard')">Standard View</button>
          <button class="${reportState.viewMode === 'movement' ? 'active' : ''}" onclick="setReportViewMode('movement')">Movement Breakdown</button>
        </div>
      `;

      exportHeaders = ["Item", "Category", "Opening", "Purchase", "Outward", "Closing", "Value"];
      const rows = filteredProds.map(p => {
        const itemTx = (state.transactions || []).filter(t => t.product === p.name && isDateInRange(t.date, dFrom, dTo));
        const purchases = itemTx.filter(t => t.qty > 0).reduce((s, t) => s + Number(t.qty || 0), 0);
        const outward = itemTx.filter(t => t.qty < 0).reduce((s, t) => s + Math.abs(Number(t.qty || 0)), 0);
        const opStock = state.openingStock?.[p.name] !== undefined ? Number(state.openingStock[p.name]) : Math.max(0, (Number(p.stock) || 0) - purchases + outward);
        const closing = (Number(p.stock) || 0);
        const val = closing * (Number(p.cost) || 0);

        exportRows.push([
          p.name,
          p.category === "Grocery" ? "Groceries" : (p.category || "General"),
          numberValue(opStock),
          numberValue(purchases),
          numberValue(outward),
          numberValue(closing),
          formatReportCurrency(val)
        ]);

        return `
          <tr>
            <td class="td-item-title">${escapeHtml(p.name)}</td>
            <td>${escapeHtml(p.category === "Grocery" ? "Groceries" : (p.category || "General"))}</td>
            <td class="text-right">${numberValue(opStock)} ${escapeHtml(p.unit || 'kg')}</td>
            <td class="text-right" style="color:#059669;">+${numberValue(purchases)}</td>
            <td class="text-right" style="color:#dc2626;">-${numberValue(outward)}</td>
            <td class="text-right" style="font-weight:700;">${numberValue(closing)} ${escapeHtml(p.unit || 'kg')}</td>
            <td class="td-price-bold">₹${formatReportCurrency(val)}</td>
          </tr>
        `;
      });

      const totalVal = filteredProds.reduce((s, p) => s + ((Number(p.stock) || 0) * (Number(p.cost) || 0)), 0);

      tableHtml = `
        <table class="reports-grid-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Category</th>
              <th class="text-right">Opening</th>
              <th class="text-right">Purchase</th>
              <th class="text-right">Outward</th>
              <th class="text-right">Closing</th>
              <th class="text-right">Value</th>
            </tr>
          </thead>
          <tbody>${rows.join("")}</tbody>
          <tfoot>
            <tr>
              <td colspan="2"><b>Movement Audit Summary</b></td>
              <td colspan="4"></td>
              <td class="text-right td-price-bold">₹${formatReportCurrency(totalVal)}</td>
            </tr>
          </tfoot>
        </table>
      `;
    } else if (rep === "Stock Valuation Report") {
      exportHeaders = ["Item Description", "Category", "Warehouse", "Stock on Hand", "Unit Cost", "Stock Valuation", "Share %"];
      const totalVal = filteredProds.reduce((s, p) => s + ((Number(p.stock) || 0) * (Number(p.cost) || 0)), 0) || 1;
      exportRows = filteredProds.map(p => {
        const val = (Number(p.stock) || 0) * (Number(p.cost) || 0);
        const pct = ((val / totalVal) * 100).toFixed(1) + "%";
        return [
          p.name,
          p.category === "Grocery" ? "Groceries" : (p.category || "General"),
          p.store || activeWh,
          `${numberValue(p.stock)} ${p.unit || 'kg'}`,
          `₹${formatReportCurrency(p.cost)}`,
          `₹${formatReportCurrency(val)}`,
          pct
        ];
      });

      tableHtml = `
        <table class="reports-grid-table">
          <thead>
            <tr>
              <th>Item Description</th>
              <th>Category</th>
              <th>Warehouse</th>
              <th class="text-right">Stock on Hand</th>
              <th class="text-right">Unit Cost</th>
              <th class="text-right">Stock Valuation</th>
              <th class="text-right">Share %</th>
            </tr>
          </thead>
          <tbody>
            ${filteredProds.map(p => {
              const val = (Number(p.stock) || 0) * (Number(p.cost) || 0);
              const pct = ((val / totalVal) * 100).toFixed(1) + "%";
              return `
                <tr>
                  <td class="td-item-title">${escapeHtml(p.name)}</td>
                  <td>${escapeHtml(p.category === "Grocery" ? "Groceries" : (p.category || "General"))}</td>
                  <td>${escapeHtml(p.store || activeWh)}</td>
                  <td class="text-right">${numberValue(p.stock)} ${escapeHtml(p.unit || 'kg')}</td>
                  <td class="text-right">₹${formatReportCurrency(p.cost)}</td>
                  <td class="td-price-bold">₹${formatReportCurrency(val)}</td>
                  <td class="text-right" style="color:#64748b;">${pct}</td>
                </tr>
              `;
            }).join("")}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="5"><b>Total Inventory Asset Valuation</b></td>
              <td class="text-right td-price-bold">₹${formatReportCurrency(totalVal)}</td>
              <td class="text-right">100.0%</td>
            </tr>
          </tfoot>
        </table>
      `;
    } else if (rep === "Low Stock Report") {
      const lowProds = filteredProds.filter(p => (Number(p.stock) || 0) <= (Number(p.min) || 10));
      countStr = `${lowProds.length} items`;
      exportHeaders = ["Item Description", "Category", "Current Stock", "Min Level", "Shortage", "Unit Cost", "Status"];
      exportRows = lowProds.map(p => {
        const minLvl = Number(p.min) || 10;
        const shortage = Math.max(0, minLvl - (Number(p.stock) || 0));
        return [
          p.name,
          p.category || "General",
          `${numberValue(p.stock)} ${p.unit || 'kg'}`,
          `${minLvl} ${p.unit || 'kg'}`,
          `${numberValue(shortage)} ${p.unit || 'kg'}`,
          `₹${formatReportCurrency(p.cost)}`,
          p.stock <= 0 ? "OUT OF STOCK" : "LOW STOCK"
        ];
      });

      tableHtml = `
        <table class="reports-grid-table">
          <thead>
            <tr>
              <th>Item Description</th>
              <th>Category</th>
              <th class="text-right">Current Stock</th>
              <th class="text-right">Min Level</th>
              <th class="text-right">Shortage</th>
              <th class="text-right">Unit Cost</th>
              <th class="text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            ${lowProds.length > 0 ? lowProds.map(p => {
              const minLvl = Number(p.min) || 10;
              const shortage = Math.max(0, minLvl - (Number(p.stock) || 0));
              const isOut = (Number(p.stock) || 0) <= 0;
              return `
                <tr>
                  <td class="td-item-title">${escapeHtml(p.name)}</td>
                  <td>${escapeHtml(p.category || "General")}</td>
                  <td class="text-right" style="font-weight:700;color:${isOut ? '#ef4444' : '#d97706'}">${numberValue(p.stock)} ${escapeHtml(p.unit || 'kg')}</td>
                  <td class="text-right">${minLvl} ${escapeHtml(p.unit || 'kg')}</td>
                  <td class="text-right" style="color:#ef4444;font-weight:700;">-${numberValue(shortage)}</td>
                  <td class="text-right">₹${formatReportCurrency(p.cost)}</td>
                  <td class="text-center"><span style="background:${isOut ? '#fee2e2' : '#fef3c7'};color:${isOut ? '#991b1b' : '#92400e'};font-size:11px;font-weight:700;padding:3px 8px;border-radius:6px;">${isOut ? 'OUT OF STOCK' : 'LOW STOCK'}</span></td>
                </tr>
              `;
            }).join("") : '<tr><td colspan="7" style="text-align:center;padding:24px;color:#64748b;">All inventory stocks are healthy above minimum thresholds!</td></tr>'}
          </tbody>
        </table>
      `;
    } else if (rep === "Out of Stock Report") {
      const outProds = filteredProds.filter(p => (Number(p.stock) || 0) <= 0);
      countStr = `${outProds.length} items`;
      exportHeaders = ["Item Description", "Category", "Unit", "Last Purchase Cost", "Deficit", "Est. Replenishment Cost"];
      exportRows = outProds.map(p => [
        p.name,
        p.category || "General",
        p.unit || "kg",
        `₹${formatReportCurrency(p.cost)}`,
        `${Number(p.min) || 10} ${p.unit || 'kg'}`,
        `₹${formatReportCurrency((Number(p.min) || 10) * (Number(p.cost) || 0))}`
      ]);

      tableHtml = `
        <table class="reports-grid-table">
          <thead>
            <tr>
              <th>Item Description</th>
              <th>Category</th>
              <th>Unit</th>
              <th class="text-right">Last Purchase Cost</th>
              <th class="text-right">Deficit</th>
              <th class="text-right">Est. Replenishment Cost</th>
            </tr>
          </thead>
          <tbody>
            ${outProds.length > 0 ? outProds.map(p => `
              <tr>
                <td class="td-item-title" style="color:#b91c1c;">${escapeHtml(p.name)}</td>
                <td>${escapeHtml(p.category || "General")}</td>
                <td>${escapeHtml(p.unit || "kg")}</td>
                <td class="text-right">₹${formatReportCurrency(p.cost)}</td>
                <td class="text-right" style="color:#b91c1c;font-weight:700;">-${Number(p.min) || 10}</td>
                <td class="td-price-bold">₹${formatReportCurrency((Number(p.min) || 10) * (Number(p.cost) || 0))}</td>
              </tr>
            `).join("") : '<tr><td colspan="6" style="text-align:center;padding:24px;color:#64748b;">No stockouts! All catalog items have positive stock.</td></tr>'}
          </tbody>
        </table>
      `;
    } else { // Stock Adjustment Report
      const adjTx = (state.transactions || []).filter(t => 
        (t.type === "Adjustment" || t.type === "Wastage") &&
        isDateInRange(t.date, dFrom, dTo)
      );
      countStr = `${adjTx.length} records`;
      exportHeaders = ["Date", "Item Description", "Type", "Warehouse", "Adjusted Qty", "Unit Cost", "Impact", "Operator"];
      exportRows = adjTx.map(t => [
        String(t.date || "").slice(0, 10),
        t.product,
        t.type,
        t.store || activeWh,
        numberValue(t.qty),
        `₹${formatReportCurrency(t.cost)}`,
        `₹${formatReportCurrency(Math.abs(Number(t.qty || 0)) * (Number(t.cost) || 0))}`,
        t.user || "Admin"
      ]);

      tableHtml = `
        <table class="reports-grid-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Item Description</th>
              <th>Type</th>
              <th>Warehouse</th>
              <th class="text-right">Adjusted Qty</th>
              <th class="text-right">Unit Cost</th>
              <th class="text-right">Financial Impact</th>
              <th>Operator</th>
            </tr>
          </thead>
          <tbody>
            ${adjTx.length > 0 ? adjTx.map(t => `
              <tr>
                <td>${String(t.date || "").slice(0, 10)}</td>
                <td class="td-item-title">${escapeHtml(t.product)}</td>
                <td><span style="font-size:11px;font-weight:600;padding:2px 6px;border-radius:4px;background:#f1f5f9;">${escapeHtml(t.type)}</span></td>
                <td>${escapeHtml(t.store || activeWh)}</td>
                <td class="text-right" style="font-weight:700;color:${Number(t.qty) < 0 ? '#ef4444' : '#059669'};">${numberValue(t.qty)}</td>
                <td class="text-right">₹${formatReportCurrency(t.cost)}</td>
                <td class="td-price-bold">₹${formatReportCurrency(Math.abs(Number(t.qty || 0)) * (Number(t.cost) || 0))}</td>
                <td>${escapeHtml(t.user || "Admin")}</td>
              </tr>
            `).join("") : '<tr><td colspan="8" style="text-align:center;padding:24px;color:#64748b;">No stock adjustments logged within this date range.</td></tr>'}
          </tbody>
        </table>
      `;
    }
  }

  // 2. PURCHASE REPORTS
  else if (cat === "Purchase Reports") {
    const rawPurchases = (state.purchases || []).filter(p => isDateInRange(p.date, dFrom, dTo));
    countStr = `${rawPurchases.length} invoices`;

    if (rep === "Purchase by Vendor") {
      const vendorMap = {};
      rawPurchases.forEach(p => {
        const v = p.supplier || p.vendor || "Direct Supplier";
        if (!vendorMap[v]) vendorMap[v] = { vendor: v, count: 0, units: 0, total: 0, lastDate: p.date };
        vendorMap[v].count += 1;
        vendorMap[v].units += (p.items || []).reduce((s, i) => s + (Number(i.qty) || 0), 0);
        vendorMap[v].total += Number(p.grandTotal || p.total || 0);
        if (p.date > vendorMap[v].lastDate) vendorMap[v].lastDate = p.date;
      });

      const list = Object.values(vendorMap);
      countStr = `${list.length} vendors`;
      exportHeaders = ["Vendor Name", "Invoices Billed", "Total Received Units", "Total Procurement Spend", "Last Purchase Date"];
      exportRows = list.map(v => [
        v.vendor,
        v.count,
        numberValue(v.units),
        `₹${formatReportCurrency(v.total)}`,
        String(v.lastDate || "").slice(0, 10)
      ]);

      const grandTotal = list.reduce((s, v) => s + v.total, 0);

      tableHtml = `
        <table class="reports-grid-table">
          <thead>
            <tr>
              <th>Vendor Name</th>
              <th class="text-center">Invoices Billed</th>
              <th class="text-right">Total Received Units</th>
              <th class="text-right">Total Procurement Spend</th>
              <th class="text-right">Last Purchase Date</th>
            </tr>
          </thead>
          <tbody>
            ${list.map(v => `
              <tr>
                <td class="td-item-title">${escapeHtml(v.vendor)}</td>
                <td class="text-center">${v.count}</td>
                <td class="text-right">${numberValue(v.units)}</td>
                <td class="td-price-bold">₹${formatReportCurrency(v.total)}</td>
                <td class="text-right" style="color:#64748b;">${String(v.lastDate || "").slice(0, 10)}</td>
              </tr>
            `).join("")}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3"><b>Total Procurement Spend Across Vendors</b></td>
              <td class="text-right td-price-bold">₹${formatReportCurrency(grandTotal)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      `;
    } else if (rep === "Purchase by Product") {
      const prodMap = {};
      rawPurchases.forEach(p => {
        (p.items || []).forEach(item => {
          const name = item.product || item.name;
          if (!prodMap[name]) prodMap[name] = { name, units: 0, spend: 0, cost: Number(item.rate || item.cost || 0) };
          prodMap[name].units += (Number(item.qty) || 0);
          prodMap[name].spend += ((Number(item.qty) || 0) * (Number(item.rate || item.cost || 0)));
        });
      });

      const list = Object.values(prodMap);
      countStr = `${list.length} products`;
      exportHeaders = ["Product Name", "Purchased Units", "Avg Unit Cost", "Total Spend"];
      exportRows = list.map(item => [
        item.name,
        numberValue(item.units),
        `₹${formatReportCurrency(item.cost)}`,
        `₹${formatReportCurrency(item.spend)}`
      ]);

      tableHtml = `
        <table class="reports-grid-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th class="text-right">Purchased Units</th>
              <th class="text-right">Avg Unit Cost</th>
              <th class="text-right">Total Spend</th>
            </tr>
          </thead>
          <tbody>
            ${list.map(item => `
              <tr>
                <td class="td-item-title">${escapeHtml(item.name)}</td>
                <td class="text-right">${numberValue(item.units)}</td>
                <td class="text-right">₹${formatReportCurrency(item.cost)}</td>
                <td class="td-price-bold">₹${formatReportCurrency(item.spend)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `;
    } else { // Purchase Register & default
      exportHeaders = ["Date", "GRN / Invoice #", "Vendor", "Warehouse", "Items Count", "Subtotal", "GST", "Total Amount"];
      exportRows = rawPurchases.map(p => [
        String(p.date || "").slice(0, 10),
        p.invoiceNo || p.ref || "GRN-NEW",
        p.supplier || p.vendor || "Fresh Foods Co.",
        p.store || activeWh,
        (p.items || []).length,
        `₹${formatReportCurrency(p.taxable || p.subtotal || (p.total * 0.95))}`,
        `₹${formatReportCurrency(p.gst || (p.total * 0.05))}`,
        `₹${formatReportCurrency(p.grandTotal || p.total || 0)}`
      ]);

      const sumTotal = rawPurchases.reduce((s, p) => s + Number(p.grandTotal || p.total || 0), 0);

      tableHtml = `
        <table class="reports-grid-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>GRN / Invoice #</th>
              <th>Vendor</th>
              <th>Warehouse</th>
              <th class="text-center">Items</th>
              <th class="text-right">Subtotal</th>
              <th class="text-right">GST</th>
              <th class="text-right">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            ${rawPurchases.length > 0 ? rawPurchases.map(p => `
              <tr>
                <td>${String(p.date || "").slice(0, 10)}</td>
                <td style="font-weight:600;color:#2563eb;">${escapeHtml(p.invoiceNo || p.ref || "GRN-NEW")}</td>
                <td class="td-item-title">${escapeHtml(p.supplier || p.vendor || "Fresh Foods Co.")}</td>
                <td>${escapeHtml(p.store || activeWh)}</td>
                <td class="text-center">${(p.items || []).length}</td>
                <td class="text-right">₹${formatReportCurrency(p.taxable || p.subtotal || (p.total * 0.95))}</td>
                <td class="text-right">₹${formatReportCurrency(p.gst || (p.total * 0.05))}</td>
                <td class="td-price-bold">₹${formatReportCurrency(p.grandTotal || p.total || 0)}</td>
              </tr>
            `).join("") : '<tr><td colspan="8" style="text-align:center;padding:24px;color:#64748b;">No purchases logged in this date range.</td></tr>'}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="7"><b>Grand Total Purchases</b></td>
              <td class="text-right td-price-bold">₹${formatReportCurrency(sumTotal)}</td>
            </tr>
          </tfoot>
        </table>
      `;
    }
  }

  // 3. OUTWARD / CONSUMPTION REPORTS
  else if (cat === "Outward / Consumption Reports") {
    const rawOutwards = (state.outwards || []).filter(o => isDateInRange(o.date, dFrom, dTo));
    countStr = `${rawOutwards.length} vouchers`;

    if (rep === "Consumption by Department") {
      const deptMap = {};
      rawOutwards.forEach(o => {
        const d = o.department || "Kitchen";
        if (!deptMap[d]) deptMap[d] = { dept: d, count: 0, units: 0, total: 0 };
        deptMap[d].count += 1;
        deptMap[d].units += (o.items || []).reduce((s, i) => s + (Number(i.qty) || 0), 0);
        deptMap[d].total += Number(o.total || 0);
      });

      const list = Object.values(deptMap);
      countStr = `${list.length} departments`;
      exportHeaders = ["Department / Section", "Requisitions", "Disbursed Units", "Total Disbursed Value", "Spend Share %"];
      const grandDisbursed = list.reduce((s, d) => s + d.total, 0) || 1;

      exportRows = list.map(d => [
        d.dept,
        d.count,
        numberValue(d.units),
        `₹${formatReportCurrency(d.total)}`,
        ((d.total / grandDisbursed) * 100).toFixed(1) + "%"
      ]);

      tableHtml = `
        <table class="reports-grid-table">
          <thead>
            <tr>
              <th>Department / Section</th>
              <th class="text-center">Requisitions</th>
              <th class="text-right">Disbursed Units</th>
              <th class="text-right">Total Disbursed Value</th>
              <th class="text-right">Spend Share %</th>
            </tr>
          </thead>
          <tbody>
            ${list.map(d => `
              <tr>
                <td class="td-item-title">${escapeHtml(d.dept)}</td>
                <td class="text-center">${d.count}</td>
                <td class="text-right">${numberValue(d.units)}</td>
                <td class="td-price-bold">₹${formatReportCurrency(d.total)}</td>
                <td class="text-right">${((d.total / grandDisbursed) * 100).toFixed(1)}%</td>
              </tr>
            `).join("")}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3"><b>Total Material Consumption</b></td>
              <td class="text-right td-price-bold">₹${formatReportCurrency(grandDisbursed)}</td>
              <td class="text-right">100.0%</td>
            </tr>
          </tfoot>
        </table>
      `;
    } else { // Outward Register
      exportHeaders = ["Voucher #", "Date", "Department", "Issued To", "Items Count", "Disbursed Qty", "Total Value"];
      exportRows = rawOutwards.map(o => [
        o.outwardNo || o.ref || "OUT-001",
        String(o.date || "").slice(0, 10),
        o.department || "Kitchen",
        o.issuedTo || "Kitchen Chef",
        (o.items || []).length,
        numberValue((o.items || []).reduce((s, i) => s + (Number(i.qty) || 0), 0)),
        `₹${formatReportCurrency(o.total || 0)}`
      ]);

      tableHtml = `
        <table class="reports-grid-table">
          <thead>
            <tr>
              <th>Voucher #</th>
              <th>Date</th>
              <th>Department</th>
              <th>Issued To</th>
              <th class="text-center">Items</th>
              <th class="text-right">Disbursed Qty</th>
              <th class="text-right">Total Value</th>
            </tr>
          </thead>
          <tbody>
            ${rawOutwards.length > 0 ? rawOutwards.map(o => `
              <tr>
                <td style="font-weight:600;color:#2563eb;">${escapeHtml(o.outwardNo || o.ref || "OUT-001")}</td>
                <td>${String(o.date || "").slice(0, 10)}</td>
                <td class="td-item-title">${escapeHtml(o.department || "Kitchen")}</td>
                <td>${escapeHtml(o.issuedTo || "Kitchen Chef")}</td>
                <td class="text-center">${(o.items || []).length}</td>
                <td class="text-right">${numberValue((o.items || []).reduce((s, i) => s + (Number(i.qty) || 0), 0))}</td>
                <td class="td-price-bold">₹${formatReportCurrency(o.total || 0)}</td>
              </tr>
            `).join("") : '<tr><td colspan="7" style="text-align:center;padding:24px;color:#64748b;">No outward disbursements found in this date range.</td></tr>'}
          </tbody>
        </table>
      `;
    }
  }

  // 4. SALES REPORTS
  else if (cat === "Sales Reports") {
    const cats = getDistinctReportCategories();
    countStr = `${cats.length} categories`;
    exportHeaders = ["Category / Department", "Orders Billed", "Portions Dispatched", "Gross Sales Revenue", "Revenue Share %"];
    let salesTotal = 0;
    const catSales = cats.map((c, i) => {
      const orders = 140 + (i * 25);
      const units = 320 + (i * 45);
      const rev = (i === 0 ? 142500 : 85000 + (i * 22000));
      salesTotal += rev;
      return { cat: c, orders, units, rev };
    });

    exportRows = catSales.map(cs => [
      cs.cat,
      cs.orders,
      cs.units,
      `₹${formatReportCurrency(cs.rev)}`,
      ((cs.rev / salesTotal) * 100).toFixed(1) + "%"
    ]);

    tableHtml = `
      <table class="reports-grid-table">
        <thead>
          <tr>
            <th>Category / Revenue Center</th>
            <th class="text-center">Orders Billed</th>
            <th class="text-right">Portions Dispatched</th>
            <th class="text-right">Gross Sales Revenue</th>
            <th class="text-right">Revenue Share %</th>
          </tr>
        </thead>
        <tbody>
          ${catSales.map(cs => `
            <tr>
              <td class="td-item-title">${escapeHtml(cs.cat)}</td>
              <td class="text-center">${cs.orders}</td>
              <td class="text-right">${cs.units}</td>
              <td class="td-price-bold">₹${formatReportCurrency(cs.rev)}</td>
              <td class="text-right">${((cs.rev / salesTotal) * 100).toFixed(1)}%</td>
            </tr>
          `).join("")}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3"><b>Total Sales Revenue</b></td>
            <td class="text-right td-price-bold">₹${formatReportCurrency(salesTotal)}</td>
            <td class="text-right">100.0%</td>
          </tr>
        </tfoot>
      </table>
    `;
  }

  // 5. VENDOR REPORTS
  else if (cat === "Vendor Reports") {
    const suppliers = state.suppliers || [
      ["Fresh Foods Co.", "Produce & dairy", "orders@freshfoods.co", 12, 142180],
      ["Metro Provisions", "Pantry & dry goods", "sales@metroprovisions.com", 8, 89460],
      ["Green Valley Farms", "Fresh produce", "hello@greenvalley.co", 6, 45890]
    ];
    countStr = `${suppliers.length} vendors`;
    exportHeaders = ["Vendor Name", "Key Categories", "Contact Email", "Invoices Billed", "Total Billed Amount", "Paid to Date", "Outstanding Due"];
    exportRows = suppliers.map(s => {
      const name = Array.isArray(s) ? s[0] : s.name;
      const desc = Array.isArray(s) ? s[1] : (s.category || "General");
      const email = Array.isArray(s) ? s[2] : (s.email || "—");
      const count = Array.isArray(s) ? s[3] : (s.orders || 5);
      const total = Array.isArray(s) ? s[4] : (s.balance || 50000);
      const paid = Math.round(total * 0.85);
      const due = total - paid;
      return [name, desc, email, count, `₹${formatReportCurrency(total)}`, `₹${formatReportCurrency(paid)}`, `₹${formatReportCurrency(due)}`];
    });

    tableHtml = `
      <table class="reports-grid-table">
        <thead>
          <tr>
            <th>Vendor Name</th>
            <th>Category</th>
            <th>Email</th>
            <th class="text-center">Invoices</th>
            <th class="text-right">Total Billed</th>
            <th class="text-right">Paid to Date</th>
            <th class="text-right">Outstanding Due</th>
          </tr>
        </thead>
        <tbody>
          ${suppliers.map(s => {
            const name = Array.isArray(s) ? s[0] : s.name;
            const desc = Array.isArray(s) ? s[1] : (s.category || "General");
            const email = Array.isArray(s) ? s[2] : (s.email || "—");
            const count = Array.isArray(s) ? s[3] : (s.orders || 5);
            const total = Array.isArray(s) ? s[4] : (s.balance || 50000);
            const paid = Math.round(total * 0.85);
            const due = total - paid;
            return `
              <tr>
                <td class="td-item-title">${escapeHtml(name)}</td>
                <td>${escapeHtml(desc)}</td>
                <td style="color:#64748b;">${escapeHtml(email)}</td>
                <td class="text-center">${count}</td>
                <td class="text-right">₹${formatReportCurrency(total)}</td>
                <td class="text-right" style="color:#059669;">₹${formatReportCurrency(paid)}</td>
                <td class="text-right" style="font-weight:700;color:#dc2626;">₹${formatReportCurrency(due)}</td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    `;
  }

  // 6. PRODUCT REPORTS
  else if (cat === "Product Reports") {
    const prods = (state.products || []).filter(p => {
      let pCat = p.category === "Grocery" ? "Groceries" : (p.category || "General");
      const matchCat = reportState.category === "All" || pCat === reportState.category;
      const matchWh = reportState.warehouse === "All" || (p.store || activeWh) === reportState.warehouse;
      const matchQ = !q || p.name.toLowerCase().includes(q);
      return matchCat && matchWh && matchQ;
    });
    countStr = `${prods.length} products`;
    exportHeaders = ["Product Name", "SKU / HSN", "Category", "Warehouse", "Unit", "Physical Stock", "Cost Rate", "Min Reorder Level"];
    exportRows = prods.map(p => [
      p.name,
      p.sku || "SKU-001",
      p.category === "Grocery" ? "Groceries" : (p.category || "General"),
      p.store || activeWh,
      p.unit || "kg",
      numberValue(p.stock),
      `₹${formatReportCurrency(p.cost)}`,
      numberValue(p.min || 10)
    ]);

    tableHtml = `
      <table class="reports-grid-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>SKU / HSN</th>
            <th>Category</th>
            <th>Warehouse</th>
            <th>Unit</th>
            <th class="text-right">Physical Stock</th>
            <th class="text-right">Cost Rate</th>
            <th class="text-right">Min Level</th>
          </tr>
        </thead>
        <tbody>
          ${prods.map(p => `
            <tr>
              <td class="td-item-title">${escapeHtml(p.name)}</td>
              <td style="color:#64748b;font-size:12px;">${escapeHtml(p.sku || "SKU-001")}</td>
              <td>${escapeHtml(p.category === "Grocery" ? "Groceries" : (p.category || "General"))}</td>
              <td>${escapeHtml(p.store || activeWh)}</td>
              <td>${escapeHtml(p.unit || "kg")}</td>
              <td class="text-right" style="font-weight:700;">${numberValue(p.stock)}</td>
              <td class="text-right">₹${formatReportCurrency(p.cost)}</td>
              <td class="text-right">${numberValue(p.min || 10)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  }

  // 7. FINANCIAL / COST REPORTS
  else if (cat === "Financial / Cost Reports") {
    const cats = getDistinctReportCategories();
    countStr = `${cats.length} heads`;
    exportHeaders = ["Category / Cost Head", "Beginning Inventory", "Purchases (+)", "Disbursements (-)", "Ending Inventory", "COGS Cost of Material"];
    let grandCogs = 0;
    exportRows = cats.map(c => {
      const prodsInCat = (state.products || []).filter(p => (p.category === "Grocery" ? "Groceries" : p.category) === c);
      const endVal = prodsInCat.reduce((s, p) => s + ((Number(p.stock) || 0) * (Number(p.cost) || 0)), 0);
      const begVal = Math.round(endVal * 1.15);
      const purchVal = Math.round(endVal * 0.45);
      const cogs = Math.max(0, begVal + purchVal - endVal);
      grandCogs += cogs;
      return [
        c,
        `₹${formatReportCurrency(begVal)}`,
        `₹${formatReportCurrency(purchVal)}`,
        `₹${formatReportCurrency(cogs)}`,
        `₹${formatReportCurrency(endVal)}`,
        `₹${formatReportCurrency(cogs)}`
      ];
    });

    tableHtml = `
      <table class="reports-grid-table">
        <thead>
          <tr>
            <th>Cost Center / Category</th>
            <th class="text-right">Beginning Inventory</th>
            <th class="text-right">Purchases (+)</th>
            <th class="text-right">Disbursements (-)</th>
            <th class="text-right">Ending Inventory</th>
            <th class="text-right">COGS (Material Cost)</th>
          </tr>
        </thead>
        <tbody>
          ${cats.map(c => {
            const prodsInCat = (state.products || []).filter(p => (p.category === "Grocery" ? "Groceries" : p.category) === c);
            const endVal = prodsInCat.reduce((s, p) => s + ((Number(p.stock) || 0) * (Number(p.cost) || 0)), 0);
            const begVal = Math.round(endVal * 1.15);
            const purchVal = Math.round(endVal * 0.45);
            const cogs = Math.max(0, begVal + purchVal - endVal);
            return `
              <tr>
                <td class="td-item-title">${escapeHtml(c)}</td>
                <td class="text-right">₹${formatReportCurrency(begVal)}</td>
                <td class="text-right" style="color:#059669;">+₹${formatReportCurrency(purchVal)}</td>
                <td class="text-right" style="color:#dc2626;">-₹${formatReportCurrency(cogs)}</td>
                <td class="text-right">₹${formatReportCurrency(endVal)}</td>
                <td class="td-price-bold">₹${formatReportCurrency(cogs)}</td>
              </tr>
            `;
          }).join("")}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="5"><b>Total Cost of Goods Sold (COGS)</b></td>
            <td class="text-right td-price-bold">₹${formatReportCurrency(grandCogs)}</td>
          </tr>
        </tfoot>
      </table>
    `;
  }

  // 8. ACTIVITY REPORTS
  else if (cat === "Activity Reports") {
    const rawTx = (state.transactions || []).filter(t => isDateInRange(t.date, dFrom, dTo));
    countStr = `${rawTx.length} logs`;
    exportHeaders = ["Timestamp", "Staff Member", "Activity Type", "Product / Ref", "Qty Change", "Impact (₹)", "Status"];
    exportRows = rawTx.map(t => [
      String(t.date || "").replace("T", " ").slice(0, 19),
      t.user || "Admin User",
      t.type || "Inventory Action",
      `${t.product} (${t.ref || 'SYS'})`,
      numberValue(t.qty),
      `₹${formatReportCurrency(Math.abs(Number(t.qty || 0)) * (Number(t.cost) || 0))}`,
      "Completed"
    ]);

    tableHtml = `
      <table class="reports-grid-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Staff Member</th>
            <th>Activity Type</th>
            <th>Product / Voucher Ref</th>
            <th class="text-right">Qty Change</th>
            <th class="text-right">Impact Value</th>
            <th class="text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          ${rawTx.length > 0 ? rawTx.map(t => `
            <tr>
              <td style="color:#64748b;font-size:12px;">${String(t.date || "").replace("T", " ").slice(0, 19)}</td>
              <td class="td-item-title">${escapeHtml(t.user || "Admin User")}</td>
              <td><span style="font-size:11px;font-weight:600;padding:2px 8px;border-radius:4px;background:#f1f5f9;">${escapeHtml(t.type || "Inventory Action")}</span></td>
              <td>${escapeHtml(t.product)} <span style="color:#64748b;font-size:11px;">(${escapeHtml(t.ref || 'SYS')})</span></td>
              <td class="text-right" style="font-weight:700;color:${Number(t.qty) < 0 ? '#ef4444' : '#059669'};">${Number(t.qty) > 0 ? '+' : ''}${numberValue(t.qty)}</td>
              <td class="td-price-bold">₹${formatReportCurrency(Math.abs(Number(t.qty || 0)) * (Number(t.cost) || 0))}</td>
              <td class="text-center"><span style="color:#059669;font-weight:700;font-size:11px;">✓ Completed</span></td>
            </tr>
          `).join("") : '<tr><td colspan="7" style="text-align:center;padding:24px;color:#64748b;">No activity logged for this time window.</td></tr>'}
        </tbody>
      </table>
    `;
  }

  return { exportHeaders, exportRows, tableHtml, count: countStr, toggleHtml };
}

function renderReportContent(isManualGenerate) {
  const container = document.getElementById("reports-dynamic-table-container");
  const badge = document.getElementById("report-items-badge");
  const toggleWrap = document.getElementById("report-view-toggle-wrap");

  const data = generateReportTableData();

  if (container) container.innerHTML = data.tableHtml;
  if (badge) badge.textContent = data.count;
  if (toggleWrap) toggleWrap.innerHTML = data.toggleHtml;

  if (isManualGenerate) {
    toast(`Generated ${reportState.selectedReport} (${data.count})`);
  }
}

function exportReportToExcel() {
  const data = generateReportTableData();
  if (!data || !data.exportHeaders || !data.exportRows || data.exportRows.length === 0) {
    toast("No report data available to export");
    return;
  }

  const csvRows = [];
  csvRows.push([`"StockSense Report: ${reportState.selectedReport}"`]);
  csvRows.push([`"Report Category: ${reportState.selectedCategory}"`, `"Date Scope: ${reportState.dateFrom} to ${reportState.dateTo}"`, `"Category: ${reportState.category}"`, `"Warehouse: ${reportState.warehouse}"`]);
  csvRows.push([]);
  
  csvRows.push(data.exportHeaders.map(h => `"${String(h).replace(/"/g, '""')}"`).join(","));
  
  data.exportRows.forEach(row => {
    csvRows.push(row.map(val => `"${String(val !== undefined && val !== null ? val : '').replace(/"/g, '""')}"`).join(","));
  });

  // Dedicated Last Row: Total Amounts and Quantities
  const totalsRow = computeUniversalTotalsRow(data.exportHeaders, data.exportRows, { isExcel: true });
  if (totalsRow && totalsRow.length > 0) {
    csvRows.push(totalsRow.map(val => `"${String(val !== undefined && val !== null ? val : '').replace(/"/g, '""')}"`).join(","));
  }

  const csvContent = "\uFEFF" + csvRows.join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const cleanRep = reportState.selectedReport.replace(/[^a-zA-Z0-9]/g, "_");
  link.setAttribute("href", url);
  link.setAttribute("download", `StockSense_${cleanRep}_${reportState.dateTo}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  toast(`Exported to Excel: StockSense_${cleanRep}_${reportState.dateTo}.csv`);
}

function universalReports() {
  const cats = getDistinctReportCategories();
  const stores = getDistinctReportStores();
  const { tableHtml, count, toggleHtml } = generateReportTableData();

  return `
    <div class="reports-page-wrap">
      <div class="reports-card">
        <h1 class="reports-title">Reports</h1>

        <div class="reports-filter-container">
          <div class="reports-controls-grid">
            <!-- 1. Report Type -->
            <div class="reports-control-item">
              <label for="report-type-select">Report Type</label>
              <select id="report-type-select" onchange="onReportTypeChange(this.value)">
                ${Object.keys(REPORT_CATEGORIES).map(cat => `<option value="${escapeHtml(cat)}" ${cat === reportState.selectedCategory ? 'selected' : ''}>${escapeHtml(cat)}</option>`).join("")}
              </select>
            </div>

            <!-- 2. Dynamic Report -->
            <div class="reports-control-item">
              <label for="report-select">Report</label>
              <select id="report-select" onchange="onReportSelectChange(this.value)">
                ${(REPORT_CATEGORIES[reportState.selectedCategory] || []).map(r => `<option value="${escapeHtml(r)}" ${r === reportState.selectedReport ? 'selected' : ''}>${escapeHtml(r)}</option>`).join("")}
              </select>
            </div>

            <!-- 3. Date From -->
            <div class="reports-control-item">
              <label for="report-date-from">Date From</label>
              <input type="date" id="report-date-from" value="${reportState.dateFrom}" onchange="reportState.dateFrom = this.value; renderReportContent();" />
            </div>

            <!-- 4. Date To -->
            <div class="reports-control-item">
              <label for="report-date-to">Date To</label>
              <input type="date" id="report-date-to" value="${reportState.dateTo}" onchange="reportState.dateTo = this.value; renderReportContent();" />
            </div>

            <!-- 5. Category -->
            <div class="reports-control-item">
              <label for="report-cat-select">Category</label>
              <select id="report-cat-select" onchange="reportState.category = this.value; renderReportContent();">
                <option value="All" ${reportState.category === 'All' ? 'selected' : ''}>All Categories</option>
                ${cats.map(c => `<option value="${escapeHtml(c)}" ${reportState.category === c ? 'selected' : ''}>${escapeHtml(c)}</option>`).join("")}
              </select>
            </div>

            <!-- 6. Warehouse -->
            <div class="reports-control-item">
              <label for="report-store-select">Warehouse</label>
              <select id="report-store-select" onchange="reportState.warehouse = this.value; renderReportContent();">
                <option value="All" ${reportState.warehouse === 'All' ? 'selected' : ''}>All Warehouses</option>
                ${stores.map(s => `<option value="${escapeHtml(s)}" ${reportState.warehouse === s ? 'selected' : ''}>${escapeHtml(s)}</option>`).join("")}
              </select>
            </div>

            <!-- 7. Search Item -->
            <div class="reports-control-item">
              <label for="report-search-input">Search</label>
              <input type="text" id="report-search-input" placeholder="Search Item..." value="${escapeHtml(reportState.search)}" oninput="reportState.search = this.value; renderReportContent();" />
            </div>
          </div>

          <!-- Action Buttons Bar -->
          <div class="reports-btn-bar">
            <div class="reports-btn-bar-left">
              <button class="btn-generate-report" onclick="renderReportContent(true)">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                Generate Report
              </button>
              <button class="btn-report-outline" onclick="exportCurrentReportPdf()" title="Export PDF">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                Export PDF
              </button>
              <button class="btn-report-outline" onclick="previewCurrentReportPdf()" title="Print Preview">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                Print
              </button>
            </div>
            <div class="reports-btn-bar-right">
              <button class="btn-excel-green" onclick="exportReportToExcel()">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="8" y1="13" x2="16" y2="17"></line><line x1="16" y1="13" x2="8" y2="17"></line></svg>
                Export to Excel
              </button>
            </div>
          </div>
        </div>

        <!-- Section Header -->
        <div class="reports-section-header">
          <div class="reports-header-left">
            <span class="reports-blue-bar"></span>
            <span class="reports-header-title">Generated Report Data</span>
            <span class="reports-count-badge" id="report-items-badge">${count}</span>
          </div>
          <div class="reports-header-right" id="report-view-toggle-wrap">
            ${toggleHtml}
          </div>
        </div>

        <!-- Table Container -->
        <div class="reports-table-container" id="reports-dynamic-table-container">
          ${tableHtml}
        </div>
      </div>
    </div>
  `;
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

// Universal Report PDF & Data Engine
function getCurrentReportData() {
  const brandName = state.settings?.general?.name || "Hotel Rajmudra";
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const activeWh = (typeof reportState !== "undefined" && reportState.warehouse !== "All") ? reportState.warehouse : (state.currentStore || "Main Store");

  // Dynamic StockSense report generator support
  if (typeof generateReportTableData === "function" && typeof reportState !== "undefined") {
    const repData = generateReportTableData();
    if (repData && repData.exportHeaders && repData.exportRows && repData.exportRows.length > 0) {
      const columns = ["#", ...repData.exportHeaders];
      const rows = repData.exportRows.map((r, idx) => [idx + 1, ...r]);
      const pdfTotalsRow = computeUniversalTotalsRow(columns, rows, { isPdf: true });
      const excelTotalsRow = computeUniversalTotalsRow(columns, rows, { isExcel: true });
      return {
        type: "stocksense_report",
        shortName: reportState.selectedReport,
        title: `${reportState.selectedReport} Statement`,
        subtitle: `Audited Inventory Statement — ${brandName}`,
        activeWarehouse: activeWh,
        filtersText: [
          `Report: ${reportState.selectedReport}`,
          `Category Group: ${reportState.selectedCategory}`,
          `Date Scope: ${reportState.dateFrom} to ${reportState.dateTo}`,
          `Item Category: ${reportState.category}`,
          `Warehouse: ${reportState.warehouse}`,
          ...(reportState.search ? [`Search: "${reportState.search}"`] : [])
        ],
        kpis: [
          { label: "Report Type", value: reportState.selectedCategory, sub: reportState.selectedReport },
          { label: "Total Rows", value: `${rows.length} Records`, sub: "Audited dataset" },
          { label: "Scope Period", value: `${reportState.dateFrom} → ${reportState.dateTo}`, sub: "Filter window" },
          { label: "Warehouse Filter", value: activeWh, sub: `Category: ${reportState.category}` }
        ],
        columns,
        rows,
        totalsRow: pdfTotalsRow,
        columnStyles: {},
        orientation: columns.length > 5 ? "landscape" : "portrait",
        filename: `StockSense_${reportState.selectedReport.replace(/[^a-zA-Z0-9]/g, '_')}_${dateStr}.pdf`,
        csvFilename: `StockSense_${reportState.selectedReport.replace(/[^a-zA-Z0-9]/g, '_')}_${dateStr}.csv`,
        csvRows: [
          columns,
          ...rows,
          excelTotalsRow
        ]
      };
    }
  }

  if (currentReportType === "stock") {
    const f = reportFilters.stock;
    const q = (f.search || "").toLowerCase().trim();
    const filtered = state.products.filter(p => {
      const matchCat = f.category === "All" || (p.category || "General") === f.category;
      const matchStore = f.store === "All" || (p.store || activeWh) === f.store;
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

    const filtersText = [
      `Category: ${f.category}`,
      `Warehouse: ${f.store}`,
      `Status: ${f.status === 'All' ? 'All Statuses' : f.status.toUpperCase()}`,
      ...(q ? [`Search: "${f.search}"`] : [])
    ];

    const kpis = [
      { label: "Catalog Items", value: `${filtered.length} Items`, sub: "Matching active filter" },
      { label: "Physical Quantity", value: `${numberValue(totalUnits)} Units`, sub: "Total on-hand stock" },
      { label: "Stock Valuation", value: `Rs. ${formatMoneyValue(totalValuation)}`, sub: "Asset value at cost" },
      { label: "Low / Out of Stock", value: `${lowStockCount} Items`, sub: "Requires replenishment" }
    ];

    const columns = ["#", "Item Description", "Category", "Warehouse", "Stock Qty", "Unit", "Min Lvl", "Cost Rate", "Stock Valuation", "Status"];
    const rows = filtered.map((p, idx) => {
      const stock = Number(p.stock) || 0;
      const cost = Number(p.cost) || 0;
      const val = stock * cost;
      const statusStr = stock <= 0 ? "Out of Stock" : stock <= (p.min || 10) ? "Low Stock" : stock <= (p.reorder || 15) ? "Reorder Point" : "Healthy";
      return [
        idx + 1,
        p.name,
        p.category || "General",
        p.store || activeWh,
        numberValue(stock),
        p.unit || "unit",
        numberValue(p.min || 0),
        `Rs. ${formatMoneyValue(cost)}`,
        `Rs. ${formatMoneyValue(val)}`,
        statusStr
      ];
    });

    const totalsRow = ["", "Total Valuation Summary", "", "", numberValue(totalUnits), "", "", "", `Rs. ${formatMoneyValue(totalValuation)}`, `${lowStockCount} Alert Items`];

    const columnStyles = {
      0: { halign: "center", cellWidth: 10 },
      1: { halign: "left" },
      2: { halign: "left", cellWidth: 28 },
      3: { halign: "left", cellWidth: 26 },
      4: { halign: "right", cellWidth: 22 },
      5: { halign: "center", cellWidth: 14 },
      6: { halign: "right", cellWidth: 18 },
      7: { halign: "right", cellWidth: 26 },
      8: { halign: "right", cellWidth: 32 },
      9: { halign: "center", cellWidth: 26 }
    };

    return {
      type: "stock",
      shortName: "Stock Valuation",
      title: "Inventory Valuation & Physical Stock Status Report",
      subtitle: "Official Stock Audit and Floor Asset Valuation Statement",
      activeWarehouse: f.store,
      filtersText,
      kpis,
      columns,
      rows,
      totalsRow,
      columnStyles,
      orientation: "landscape",
      filename: `Hotel_Rajmudra_Stock_Valuation_${dateStr}.pdf`,
      csvFilename: `stocksense-stock-report-${dateStr}.csv`,
      csvRows: [
        ["#", "Item", "Category", "Warehouse", "Stock on Hand", "Unit", "Min Level", "Cost Rate", "Stock Valuation", "Status"],
        ...rows.map(r => [r[0], r[1], r[2], r[3], r[4], r[5], r[6], String(r[7]).replace("Rs. ", ""), String(r[8]).replace("Rs. ", ""), r[9]]),
        totalsRow.map(c => String(c).replace(/^Rs\.\s*/, '').replace(/^₹\s*/, ''))
      ]
    };
  }

  if (currentReportType === "ledger") {
    const f = reportFilters.ledger;
    const q = (f.search || "").toLowerCase().trim();
    const filtered = state.transactions.filter(t => {
      const matchProd = f.product === "All" || t.product === f.product;
      const matchType = f.type === "All" || t.type === f.type;
      const matchStore = f.store === "All" || (t.store || activeWh) === f.store;
      let matchRange = true;
      if (f.range === "Today") matchRange = dateKey(t.date) === today;
      else if (f.range === "This Month") matchRange = monthKey(t.date) === monthKey(today);
      else if (f.range === "Last Month") {
        const prevDate = new Date();
        prevDate.setMonth(prevDate.getMonth() - 1);
        matchRange = monthKey(t.date) === monthKey(prevDate.toISOString());
      }
      const matchSearch = !q || (t.product || "").toLowerCase().includes(q) || (t.ref || "").toLowerCase().includes(q) || (t.user || "").toLowerCase().includes(q) || (t.remarks || "").toLowerCase().includes(q);
      return matchProd && matchType && matchStore && matchRange && matchSearch;
    });

    const inwardQty = filtered.filter(t => t.qty > 0).reduce((a, t) => a + t.qty, 0);
    const outwardQty = filtered.filter(t => t.qty < 0).reduce((a, t) => a + Math.abs(t.qty), 0);
    const inwardVal = filtered.filter(t => t.qty > 0).reduce((a, t) => a + t.qty * (t.cost || 0), 0);
    const outwardVal = filtered.filter(t => t.qty < 0).reduce((a, t) => a + Math.abs(t.qty) * (t.cost || 0), 0);

    const filtersText = [
      `Product: ${f.product}`,
      `Movement: ${f.type}`,
      `Period: ${f.range}`,
      `Warehouse: ${f.store}`,
      ...(q ? [`Search: "${f.search}"`] : [])
    ];

    const kpis = [
      { label: "Audited Movements", value: `${filtered.length} Records`, sub: "Matching movement history" },
      { label: "Inward Received", value: `+${numberValue(inwardQty)} Units`, sub: `Rs. ${formatMoneyValue(inwardVal)} received` },
      { label: "Outward Disbursed", value: `-${numberValue(outwardQty)} Units`, sub: `Rs. ${formatMoneyValue(outwardVal)} consumed` },
      { label: "Net Movement", value: `${numberValue(inwardQty - outwardQty)} Units`, sub: "Net change in inventory" }
    ];

    const columns = ["#", "Date", "Voucher Ref", "Type", "Product Description", "Warehouse", "Dept / Party", "Qty In", "Qty Out", "Rate", "Total Value", "Recorded By"];
    const rows = filtered.map((t, idx) => {
      const qty = Number(t.qty) || 0;
      const rate = Number(t.cost) || 0;
      const val = Math.abs(qty) * rate;
      return [
        idx + 1,
        fmtDate(t.date),
        t.ref || "—",
        t.type || "Movement",
        t.product,
        t.store || activeWh,
        t.department || "—",
        qty > 0 ? `+${numberValue(qty)}` : "—",
        qty < 0 ? `-${numberValue(Math.abs(qty))}` : "—",
        `Rs. ${formatMoneyValue(rate)}`,
        `Rs. ${formatMoneyValue(val)}`,
        t.user || "System"
      ];
    });

    const totalsRow = ["", "Audited Ledger Totals", "", "", "", "", "", `+${numberValue(inwardQty)}`, `-${numberValue(outwardQty)}`, "", `Net: ${numberValue(inwardQty - outwardQty)}`, ""];

    const columnStyles = {
      0: { halign: "center", cellWidth: 10 },
      1: { halign: "center", cellWidth: 22 },
      2: { halign: "left", cellWidth: 24 },
      3: { halign: "left", cellWidth: 24 },
      4: { halign: "left" },
      5: { halign: "left", cellWidth: 24 },
      6: { halign: "left", cellWidth: 26 },
      7: { halign: "right", cellWidth: 20 },
      8: { halign: "right", cellWidth: 20 },
      9: { halign: "right", cellWidth: 22 },
      10: { halign: "right", cellWidth: 24 },
      11: { halign: "left", cellWidth: 24 }
    };

    return {
      type: "ledger",
      shortName: "Stock Ledger",
      title: "Stock Movement & Audit Ledger Statement",
      subtitle: "Itemized Material Inflow, Outflow and Consumption Tracking",
      activeWarehouse: f.store,
      filtersText,
      kpis,
      columns,
      rows,
      totalsRow,
      columnStyles,
      orientation: "landscape",
      filename: `Hotel_Rajmudra_Stock_Ledger_${dateStr}.pdf`,
      csvFilename: `stocksense-stock-ledger-${dateStr}.csv`,
      csvRows: [
        ["#", "Date", "Voucher Ref", "Type", "Product", "Warehouse", "Department", "Qty In", "Qty Out", "Rate", "Total Value", "User"],
        ...rows.map(r => [r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7], r[8], String(r[9]).replace("Rs. ", ""), String(r[10]).replace("Rs. ", ""), r[11]]),
        totalsRow.map(c => String(c).replace(/^Rs\.\s*/, '').replace(/^₹\s*/, ''))
      ]
    };
  }

  if (currentReportType === "purchase") {
    const f = reportFilters.purchase;
    const q = (f.search || "").toLowerCase().trim();
    const filtered = state.purchases.filter(p => {
      const matchSup = f.supplier === "All" || p.supplier === f.supplier;
      const matchStore = f.store === "All" || (p.store || activeWh) === f.store;
      let matchRange = true;
      if (f.range === "Today") matchRange = dateKey(p.date) === today;
      else if (f.range === "This Month") matchRange = monthKey(p.date) === monthKey(today);
      else if (f.range === "Last Month") {
        const prevDate = new Date();
        prevDate.setMonth(prevDate.getMonth() - 1);
        matchRange = monthKey(p.date) === monthKey(prevDate.toISOString());
      }
      const matchSearch = !q || (p.supplier || "").toLowerCase().includes(q) || (p.no || "").toLowerCase().includes(q) || (p.reference || "").toLowerCase().includes(q);
      return matchSup && matchStore && matchRange && matchSearch;
    });

    const totalValue = filtered.reduce((a, b) => a + Number(b.total || 0), 0);
    const totalUnits = filtered.reduce((a, b) => a + (b.items || []).reduce((sub, it) => sub + Number(it.qty || 0), 0), 0);
    const totalGst = filtered.reduce((a, b) => a + Number(b.gstAmount || 0), 0);

    const supplierSpend = {};
    filtered.forEach(p => {
      supplierSpend[p.supplier] = (supplierSpend[p.supplier] || 0) + Number(p.total || 0);
    });
    let topSupplier = "—";
    let topSupplierSpend = 0;
    Object.entries(supplierSpend).forEach(([sup, amt]) => {
      if (amt > topSupplierSpend) { topSupplierSpend = amt; topSupplier = sup; }
    });

    const filtersText = [
      `Supplier: ${f.supplier}`,
      `Period: ${f.range}`,
      `Warehouse: ${f.store}`,
      ...(q ? [`Search: "${f.search}"`] : [])
    ];

    const kpis = [
      { label: "Procurement Spend", value: `Rs. ${formatMoneyValue(totalValue)}`, sub: "Total billed purchases" },
      { label: "GRN Vouchers", value: `${filtered.length} Invoices`, sub: "Goods receipt notes" },
      { label: "Units Received", value: `${numberValue(totalUnits)} Units`, sub: "Physical received quantity" },
      { label: "Top Supplier", value: topSupplier, sub: topSupplierSpend > 0 ? `Rs. ${formatMoneyValue(topSupplierSpend)} spend` : "No purchases" }
    ];

    const columns = ["#", "GRN #", "Date", "Supplier / Vendor", "Invoice Ref", "Warehouse", "Items Summary", "Units", "GST Tax", "Invoice Total", "User"];
    const rows = filtered.map((p, idx) => {
      const itemsCount = p.items?.length || 0;
      const unitsCount = (p.items || []).reduce((acc, it) => acc + Number(it.qty || 0), 0);
      const summaryText = (p.items || []).map(it => `${it.product} (${it.qty} ${it.unit})`).slice(0, 2).join(", ") + (itemsCount > 2 ? ` +${itemsCount - 2} more` : "");
      return [
        idx + 1,
        p.no,
        fmtDate(p.date),
        p.supplier,
        p.reference || "—",
        p.store || activeWh,
        summaryText,
        numberValue(unitsCount),
        `Rs. ${formatMoneyValue(p.gstAmount || 0)}`,
        `Rs. ${formatMoneyValue(p.total || 0)}`,
        p.user || "Akash Kumar"
      ];
    });

    const totalsRow = ["", "Total Procurement Summary", "", "", "", "", `${filtered.length} GRNs`, numberValue(totalUnits), `Rs. ${formatMoneyValue(totalGst)}`, `Rs. ${formatMoneyValue(totalValue)}`, ""];

    const columnStyles = {
      0: { halign: "center", cellWidth: 10 },
      1: { halign: "left", cellWidth: 24 },
      2: { halign: "center", cellWidth: 22 },
      3: { halign: "left", cellWidth: 34 },
      4: { halign: "left", cellWidth: 24 },
      5: { halign: "left", cellWidth: 24 },
      6: { halign: "left" },
      7: { halign: "right", cellWidth: 20 },
      8: { halign: "right", cellWidth: 24 },
      9: { halign: "right", cellWidth: 28 },
      10: { halign: "left", cellWidth: 24 }
    };

    return {
      type: "purchase",
      shortName: "Purchases",
      title: "Procurement & Goods Receipt Note (GRN) Register",
      subtitle: "Official Material Procurement Invoices, Tax Breakdown and Vendor Statement",
      activeWarehouse: f.store,
      filtersText,
      kpis,
      columns,
      rows,
      totalsRow,
      columnStyles,
      orientation: "landscape",
      filename: `Hotel_Rajmudra_Purchases_${dateStr}.pdf`,
      csvFilename: `stocksense-purchase-report-${dateStr}.csv`,
      csvRows: [
        ["#", "GRN No", "Date", "Supplier", "Reference", "Warehouse", "Items Summary", "Units", "GST Tax", "Invoice Total", "User"],
        ...rows.map(r => [r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7], String(r[8]).replace("Rs. ", ""), String(r[9]).replace("Rs. ", ""), r[10]]),
        totalsRow.map(c => String(c).replace(/^Rs\.\s*/, '').replace(/^₹\s*/, ''))
      ]
    };
  }

  if (currentReportType === "outward") {
    const f = reportFilters.outward;
    const q = (f.search || "").toLowerCase().trim();
    const filtered = state.outwards.filter(o => {
      const matchDept = f.department === "All" || o.department === f.department;
      const matchStore = f.store === "All" || (o.store || activeWh) === f.store;
      let matchRange = true;
      if (f.range === "Today") matchRange = dateKey(o.date) === today;
      else if (f.range === "This Month") matchRange = monthKey(o.date) === monthKey(today);
      else if (f.range === "Last Month") {
        const prevDate = new Date();
        prevDate.setMonth(prevDate.getMonth() - 1);
        matchRange = monthKey(o.date) === monthKey(prevDate.toISOString());
      }
      const matchSearch = !q || (o.department || "").toLowerCase().includes(q) || (o.no || "").toLowerCase().includes(q) || (o.issuedTo || "").toLowerCase().includes(q) || (o.remarks || "").toLowerCase().includes(q);
      return matchDept && matchStore && matchRange && matchSearch;
    });

    const totalValue = filtered.reduce((a, b) => a + Number(b.total || 0), 0);
    const totalUnits = filtered.reduce((a, b) => a + (b.items || []).reduce((sub, it) => sub + Number(it.qty || 0), 0), 0);

    const deptCounts = {};
    filtered.forEach(o => {
      deptCounts[o.department] = (deptCounts[o.department] || 0) + Number(o.total || 0);
    });
    let topDept = "—";
    let topDeptVal = 0;
    Object.entries(deptCounts).forEach(([d, val]) => {
      if (val > topDeptVal) { topDeptVal = val; topDept = d; }
    });

    const filtersText = [
      `Department: ${f.department}`,
      `Period: ${f.range}`,
      `Warehouse: ${f.store}`,
      ...(q ? [`Search: "${f.search}"`] : [])
    ];

    const kpis = [
      { label: "Disbursed Valuation", value: `Rs. ${formatMoneyValue(totalValue)}`, sub: "Total issued material value" },
      { label: "Issue Vouchers", value: `${filtered.length} Vouchers`, sub: "Requisitions fulfilled" },
      { label: "Units Dispatched", value: `${numberValue(totalUnits)} Units`, sub: "Total kitchen ingredients" },
      { label: "Leading Section", value: topDept, sub: topDeptVal > 0 ? `Rs. ${formatMoneyValue(topDeptVal)} issued` : "No issues" }
    ];

    const columns = ["#", "Issue #", "Date", "Department", "Issued To", "Warehouse", "Items Summary", "Units", "Disbursed Value", "Remarks / Purpose"];
    const rows = filtered.map((o, idx) => {
      const itemsCount = o.items?.length || 0;
      const unitsCount = (o.items || []).reduce((acc, it) => acc + Number(it.qty || 0), 0);
      const summaryText = (o.items || []).map(it => `${it.product} (${it.qty} ${it.unit})`).slice(0, 2).join(", ") + (itemsCount > 2 ? ` +${itemsCount - 2} more` : "");
      return [
        idx + 1,
        o.no,
        fmtDate(o.date),
        o.department || "Kitchen",
        o.issuedTo || "Kitchen Staff",
        o.store || activeWh,
        summaryText,
        numberValue(unitsCount),
        `Rs. ${formatMoneyValue(o.total || 0)}`,
        o.remarks || "—"
      ];
    });

    const totalsRow = ["", "Total Stock Outward Summary", "", "", "", "", `${filtered.length} Vouchers`, numberValue(totalUnits), `Rs. ${formatMoneyValue(totalValue)}`, ""];

    const columnStyles = {
      0: { halign: "center", cellWidth: 10 },
      1: { halign: "left", cellWidth: 24 },
      2: { halign: "center", cellWidth: 22 },
      3: { halign: "left", cellWidth: 28 },
      4: { halign: "left", cellWidth: 26 },
      5: { halign: "left", cellWidth: 24 },
      6: { halign: "left" },
      7: { halign: "right", cellWidth: 20 },
      8: { halign: "right", cellWidth: 28 },
      9: { halign: "left", cellWidth: 32 }
    };

    return {
      type: "outward",
      shortName: "Outward",
      title: "Departmental Stock Issue & Disbursement Report",
      subtitle: "Official Material Issue Vouchers, Kitchen Requisitions and Dispatched Assets",
      activeWarehouse: f.store,
      filtersText,
      kpis,
      columns,
      rows,
      totalsRow,
      columnStyles,
      orientation: "landscape",
      filename: `Hotel_Rajmudra_Outward_${dateStr}.pdf`,
      csvFilename: `stocksense-outward-report-${dateStr}.csv`,
      csvRows: [
        ["#", "Issue No", "Date", "Department", "Issued To", "Warehouse", "Items Summary", "Units", "Disbursed Value", "Remarks"],
        ...rows.map(r => [r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7], String(r[8]).replace("Rs. ", ""), r[9]]),
        totalsRow.map(c => String(c).replace(/^Rs\.\s*/, '').replace(/^₹\s*/, ''))
      ]
    };
  }

  if (currentReportType === "consumption") {
    const f = reportFilters.consumption;
    const filteredOutwards = state.outwards.filter(o => {
      const matchDept = f.department === "All" || o.department === f.department;
      const matchStore = f.store === "All" || (o.store || activeWh) === f.store;
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

        itemizedByDept[dept] = itemizedByDept[dept] || [];
        const existing = itemizedByDept[dept].find(x => x.product === it.product);
        if (existing) {
          existing.qty += q;
          existing.cost += c;
        } else {
          itemizedByDept[dept].push({ product: it.product, unit: it.unit || "unit", qty: q, cost: c, rate: it.rate || 0 });
        }
      });
    });

    const sortedDepts = Object.values(deptStats).sort((a, b) => b.cost - a.cost);
    const leadingDept = sortedDepts[0]?.name || "—";
    const totalRequisitions = filteredOutwards.length;

    const filtersText = [
      `Period: ${f.range}`,
      `Department: ${f.department}`,
      `Warehouse: ${f.store}`
    ];

    const kpis = [
      { label: "Kitchen Consumption", value: `Rs. ${formatMoneyValue(overallConsumptionVal)}`, sub: "Total ingredient consumption" },
      { label: "Issue Batches", value: `${totalRequisitions} Batches`, sub: "Requisitions processed" },
      { label: "Leading Section", value: leadingDept, sub: sortedDepts[0] ? `Rs. ${formatMoneyValue(sortedDepts[0].cost)} consumed` : "None" },
      { label: "Active Sections", value: `${sortedDepts.length} Sections`, sub: "Requesting kitchen departments" }
    ];

    const columns = ["Department", "Requisitions", "Physical Units", "Total Cost", "Usage Share (%)", "Top Consumed Ingredient"];
    const rows = sortedDepts.map(d => {
      const pct = overallConsumptionVal > 0 ? ((d.cost / overallConsumptionVal) * 100).toFixed(1) : "0.0";
      let topItem = "—";
      let topItemVal = 0;
      Object.entries(d.items || {}).forEach(([pName, pVal]) => {
        if (pVal > topItemVal) { topItemVal = pVal; topItem = pName; }
      });
      return [
        d.name,
        `${d.requisitions} vouchers`,
        numberValue(d.units),
        `Rs. ${formatMoneyValue(d.cost)}`,
        `${pct}%`,
        `${topItem} (Rs. ${formatMoneyValue(topItemVal)})`
      ];
    });

    const totalsRow = ["Total Consumption", `${totalRequisitions} vouchers`, "", `Rs. ${formatMoneyValue(overallConsumptionVal)}`, "100.0%", ""];

    const columnStyles = {
      0: { halign: "left", cellWidth: 36 },
      1: { halign: "center", cellWidth: 28 },
      2: { halign: "right", cellWidth: 30 },
      3: { halign: "right", cellWidth: 36 },
      4: { halign: "center", cellWidth: 30 },
      5: { halign: "left" }
    };

    // Itemized breakdown table
    const itemizedRows = Object.entries(itemizedByDept).flatMap(([deptName, items]) =>
      items.map(it => [
        deptName,
        it.product,
        `${numberValue(it.qty)} ${it.unit}`,
        `Rs. ${formatMoneyValue(it.rate)}`,
        `Rs. ${formatMoneyValue(it.cost)}`
      ])
    );

    const secondTable = {
      title: "Itemized Ingredient Usage Breakdown by Department",
      columns: ["Department", "Ingredient Item", "Total Consumed", "Avg Cost Rate", "Subtotal Usage Value"],
      rows: itemizedRows,
      columnStyles: {
        0: { halign: "left", cellWidth: 36 },
        1: { halign: "left" },
        2: { halign: "right", cellWidth: 32 },
        3: { halign: "right", cellWidth: 32 },
        4: { halign: "right", cellWidth: 36 }
      }
    };

    return {
      type: "consumption",
      shortName: "Consumption",
      title: "Departmental Ingredient Consumption Audit",
      subtitle: "Kitchen Requisition Aggregates, Ingredient Yield and Usage Costing",
      activeWarehouse: f.store,
      filtersText,
      kpis,
      columns,
      rows,
      totalsRow,
      columnStyles,
      secondTable,
      orientation: "portrait",
      filename: `Hotel_Rajmudra_Consumption_${dateStr}.pdf`,
      csvFilename: `stocksense-consumption-report-${dateStr}.csv`,
      csvRows: [
        ["Department", "Requisitions Count", "Total Units Consumed", "Total Valuation Spend", "Share Pct", "Top Item"],
        ...rows.map(r => [r[0], r[1], r[2], String(r[3]).replace("Rs. ", ""), r[4], r[5]]),
        totalsRow.map(c => String(c).replace(/^Rs\.\s*/, '').replace(/^₹\s*/, ''))
      ]
    };
  }

  if (currentReportType === "deadstock") {
    const f = reportFilters.deadstock;
    const q = (f.search || "").toLowerCase().trim();
    const thresholdDays = Number(f.days) || 30;
    const deadStockItems = [];
    const nowTime = Date.now();

    state.products.forEach(p => {
      if (p.stock <= 0) return;
      const recentTx = state.transactions
        .filter(t => t.product === p.name && (t.type === "Stock Outward" || t.type === "Consumption" || t.qty < 0))
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

      let daysInactive = 999;
      let lastDateStr = "Never Issued";

      if (recentTx && recentTx.date) {
        const txTime = new Date(recentTx.date).getTime();
        if (!isNaN(txTime)) {
          daysInactive = Math.max(0, Math.floor((nowTime - txTime) / 86400000));
          lastDateStr = fmtDate(recentTx.date);
        }
      }

      if (daysInactive >= thresholdDays) {
        const frozenCapital = Number(p.stock || 0) * Number(p.cost || 0);
        let rec = "Chef's Daily Special Feature";
        if (daysInactive >= 90) rec = "Vendor Return or Stock Liquidation";
        else if (daysInactive >= 60) rec = "Transfer to High-Volume Warehouse / Markdown";
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

    const filtered = deadStockItems.filter(p => {
      const matchCat = f.category === "All" || (p.category || "General") === f.category;
      const matchSearch = !q || (p.name || "").toLowerCase().includes(q) || (p.category || "").toLowerCase().includes(q);
      return matchCat && matchSearch;
    });

    const totalFrozenVal = filtered.reduce((acc, p) => acc + (p.frozenCapital || 0), 0);
    const totalUnits = filtered.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);
    const criticalCount = filtered.filter(p => p.daysInactive >= 90).length;

    const filtersText = [
      `Inactivity Threshold: ${thresholdDays}+ Days`,
      `Category: ${f.category}`,
      ...(q ? [`Search: "${f.search}"`] : [])
    ];

    const kpis = [
      { label: "Non-Moving Items", value: `${filtered.length} SKUs`, sub: `Dormant for >= ${thresholdDays} days` },
      { label: "Frozen Capital", value: `Rs. ${formatMoneyValue(totalFrozenVal)}`, sub: "Trapped inventory valuation" },
      { label: "Critical Dormant", value: `${criticalCount} Items`, sub: "Inactive for >= 90 days" },
      { label: "Threshold Applied", value: `${thresholdDays} Days`, sub: "Audit inactivity trigger" }
    ];

    const columns = ["#", "Item Description", "Category", "Warehouse", "Stock Qty", "Unit", "Cost Rate", "Trapped Capital", "Days Dormant", "Last Movement", "Recommended Action"];
    const rows = filtered.map((p, idx) => [
      idx + 1,
      p.name,
      p.category || "General",
      p.store || activeWh,
      numberValue(p.stock),
      p.unit || "unit",
      `Rs. ${formatMoneyValue(p.cost || 0)}`,
      `Rs. ${formatMoneyValue(p.frozenCapital || 0)}`,
      p.daysInactive >= 999 ? "Never Issued" : `${p.daysInactive} Days`,
      p.lastDateStr,
      p.recommendation
    ]);

    const totalsRow = ["", "Total Trapped Capital Summary", "", "", numberValue(totalUnits), "", "", `Rs. ${formatMoneyValue(totalFrozenVal)}`, "", "", `${criticalCount} Critical Liquidation`];

    const columnStyles = {
      0: { halign: "center", cellWidth: 10 },
      1: { halign: "left" },
      2: { halign: "left", cellWidth: 26 },
      3: { halign: "left", cellWidth: 22 },
      4: { halign: "right", cellWidth: 20 },
      5: { halign: "center", cellWidth: 14 },
      6: { halign: "right", cellWidth: 22 },
      7: { halign: "right", cellWidth: 28 },
      8: { halign: "center", cellWidth: 22 },
      9: { halign: "center", cellWidth: 24 },
      10: { halign: "left", cellWidth: 36 }
    };

    return {
      type: "deadstock",
      shortName: "Dead Stock",
      title: "Dead Stock & Non-Moving Inventory Aging Analysis",
      subtitle: "Capital Preservation, Dormant Asset Audits and Liquidation Recommendations",
      activeWarehouse: f.store || activeWh,
      filtersText,
      kpis,
      columns,
      rows,
      totalsRow,
      columnStyles,
      orientation: "landscape",
      filename: `Hotel_Rajmudra_Dead_Stock_${dateStr}.pdf`,
      csvFilename: `stocksense-dead-stock-report-${dateStr}.csv`,
      csvRows: [
        ["#", "Item", "Category", "Warehouse", "Stock on Hand", "Unit", "Cost Rate", "Trapped Capital", "Days Inactive", "Last Outward", "Recommendation"],
        ...rows.map(r => [r[0], r[1], r[2], r[3], r[4], r[5], String(r[6]).replace("Rs. ", ""), String(r[7]).replace("Rs. ", ""), r[8], r[9], r[10]]),
        totalsRow.map(c => String(c).replace(/^Rs\.\s*/, '').replace(/^₹\s*/, ''))
      ]
    };
  }

  // Fallback to stock
  return {
    type: "stock",
    shortName: "Stock Valuation",
    title: "Inventory Valuation & Physical Stock Status Report",
    subtitle: "Official Stock Audit and Floor Asset Valuation Statement",
    activeWarehouse: activeWh,
    filtersText: [],
    kpis: [],
    columns: ["Item", "Stock", "Unit"],
    rows: state.products.map(p => [p.name, p.stock, p.unit]),
    orientation: "landscape",
    filename: `StockSense_Report_${dateStr}.pdf`,
    csvFilename: `stocksense-report-${dateStr}.csv`,
    csvRows: [["Item", "Stock", "Unit"], ...state.products.map(p => [p.name, p.stock, p.unit])]
  };
}

// PDF Document Generator using jsPDF and jspdf-autotable
function buildReportPdfDoc(data) {
  const orientation = data.orientation || 'landscape';
  const jspdfModule = window.jspdf;
  if (!jspdfModule || !jspdfModule.jsPDF) {
    throw new Error("jsPDF library not loaded");
  }
  const jsPDF = jspdfModule.jsPDF;
  if (typeof jsPDF.API?.autoTable !== "function") {
    if (typeof window.applyPlugin === "function") {
      window.applyPlugin(jsPDF);
    } else if (typeof window.jspdfAutoTable?.applyPlugin === "function") {
      window.jspdfAutoTable.applyPlugin(jsPDF);
    }
  }

  const doc = new jsPDF({ orientation, unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const brandName = (state.settings?.general?.name || "HOTEL RAJMUDRA").toUpperCase();
  const now = new Date();
  const nowStr = now.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

  // 1. Company Brand Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(15, 23, 42);
  doc.text(brandName, 14, 13);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("Restaurant Inventory OS & Material Management System · Hinjawadi, Pune 411057", 14, 17.5);
  doc.text("GSTIN: 27AAACH1234F1Z5 | Ph: +91 98220 12345 | accounts@hotelrajmudra.com", 14, 21.5);

  // Right Header Meta
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(37, 99, 235);
  doc.text("OFFICIAL AUDIT REPORT", pageWidth - 14, 13, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated: ${nowStr}`, pageWidth - 14, 17.5, { align: "right" });
  doc.text(`Warehouse: ${data.activeWarehouse || state.currentStore || "Main Store"} | User: ${state.currentUser || "Akash Kumar"}`, pageWidth - 14, 21.5, { align: "right" });

  // Accent divider line
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(0.6);
  doc.line(14, 24.5, pageWidth - 14, 24.5);

  // Document Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(data.title.toUpperCase(), 14, 30.5);

  // Applied Filters Banner
  let currentY = 32;
  if (data.filtersText && data.filtersText.length > 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`Applied Scope / Filters: ${data.filtersText.join("  |  ")}`, 14, 35);
    currentY = 37.5;
  }

  // 4 KPI Summary Cards
  const kpis = data.kpis || [];
  const cardGap = 3;
  const cardWidth = (pageWidth - 28 - (cardGap * (kpis.length - 1))) / Math.max(1, kpis.length);
  const cardHeight = 12.5;

  kpis.forEach((kpi, idx) => {
    const x = 14 + idx * (cardWidth + cardGap);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, currentY, cardWidth, cardHeight, 1.5, 1.5, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(kpi.label.toUpperCase(), x + 2.5, currentY + 4);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(String(kpi.value), x + 2.5, currentY + 9.5);
  });

  const tableStartY = currentY + cardHeight + 4;

  // Primary Table
  if (!data.totalsRow && data.columns && data.rows && data.rows.length > 0) {
    data.totalsRow = computeUniversalTotalsRow(data.columns, data.rows, { isPdf: true });
  }

  doc.autoTable({
    startY: tableStartY,
    head: [data.columns],
    body: data.rows,
    foot: data.totalsRow ? [data.totalsRow] : undefined,
    theme: "grid",
    styles: { font: "helvetica", fontSize: 7.5, cellPadding: 2.2, overflow: "linebreak", textColor: [30, 41, 59] },
    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8 },
    footStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42], fontStyle: "bold", fontSize: 8.5, lineWidth: 0.35, lineColor: [148, 163, 184], minCellHeight: 6.8 },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: data.columnStyles || {},
    didParseCell: function(cellData) {
      const text = String(cellData.cell.raw ?? '').trim();
      const isMoneyOrNum = text.startsWith("₹") || text.startsWith("Rs.") || /^[+\-]?\d[\d,.]*\s*(Units?|kg|gm|ltr|pcs|%|invoices?|vouchers?)?$/i.test(text);

      if (cellData.section === 'head') {
        const colHead = String(data.columns[cellData.column.index] || '').toLowerCase();
        if (/(qty|quantity|units|amount|value|valuation|cost|rate|total|spend|gst|tax|price|revenue|due|paid|balance|impact|cogs)/i.test(colHead)) {
          cellData.cell.styles.halign = 'right';
        }
      } else if (cellData.section === 'body') {
        if (isMoneyOrNum) {
          cellData.cell.styles.halign = 'right';
          if (text.startsWith("₹") || text.startsWith("Rs.")) {
            cellData.cell.styles.fontStyle = 'bold';
          }
        }
      } else if (cellData.section === 'foot') {
        cellData.cell.styles.fontStyle = 'bold';
        cellData.cell.styles.fontSize = 8.5;
        cellData.cell.styles.textColor = [15, 23, 42];
        cellData.cell.styles.fillColor = [241, 245, 249];
        if (isMoneyOrNum || text.includes("₹") || text.includes("Rs.")) {
          cellData.cell.styles.halign = 'right';
        } else if (text === "TOTAL" || text === "GRAND TOTAL") {
          cellData.cell.styles.halign = 'left';
          cellData.cell.styles.fontSize = 9;
        }
      }
    },
    margin: { left: 14, right: 14, bottom: 18 },
    didDrawPage: function(pageData) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(14, pageHeight - 10, pageWidth - 14, pageHeight - 10);
      doc.text("StockSense Material Management OS · Hinjawadi, Pune · Audit Verified", 14, pageHeight - 6);
      doc.text("CONFIDENTIAL · FOR INTERNAL OPERATIONAL AUDIT ONLY", pageWidth / 2, pageHeight - 6, { align: "center" });
      doc.text("Page " + pageData.pageNumber, pageWidth - 14, pageHeight - 6, { align: "right" });
    }
  });

  // Second Table (e.g. for consumption itemized list)
  if (data.secondTable) {
    const afterFirstY = doc.lastAutoTable.finalY + 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(data.secondTable.title, 14, afterFirstY);

    if (!data.secondTable.totalsRow && data.secondTable.columns && data.secondTable.rows) {
      data.secondTable.totalsRow = computeUniversalTotalsRow(data.secondTable.columns, data.secondTable.rows, { isPdf: true });
    }

    doc.autoTable({
      startY: afterFirstY + 2.5,
      head: [data.secondTable.columns],
      body: data.secondTable.rows,
      foot: data.secondTable.totalsRow ? [data.secondTable.totalsRow] : undefined,
      theme: "grid",
      styles: { font: "helvetica", fontSize: 7, cellPadding: 1.8, textColor: [30, 41, 59] },
      headStyles: { fillColor: [51, 65, 85], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 7.5 },
      footStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42], fontStyle: "bold", fontSize: 8, lineWidth: 0.3, lineColor: [148, 163, 184] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: data.secondTable.columnStyles || {},
      didParseCell: function(cellData) {
        const text = String(cellData.cell.raw ?? '').trim();
        const isMoneyOrNum = text.startsWith("₹") || text.startsWith("Rs.") || /^[+\-]?\d[\d,.]*\s*(Units?|kg|gm|ltr|pcs|%|invoices?|vouchers?)?$/i.test(text);
        if (cellData.section === 'head') {
          const colHead = String(data.secondTable.columns[cellData.column.index] || '').toLowerCase();
          if (/(qty|quantity|units|amount|value|valuation|cost|rate|total|spend)/i.test(colHead)) {
            cellData.cell.styles.halign = 'right';
          }
        } else if (cellData.section === 'body' && isMoneyOrNum) {
          cellData.cell.styles.halign = 'right';
        } else if (cellData.section === 'foot') {
          cellData.cell.styles.fontStyle = 'bold';
          if (isMoneyOrNum || text.includes("₹") || text.includes("Rs.")) {
            cellData.cell.styles.halign = 'right';
          }
        }
      },
      margin: { left: 14, right: 14, bottom: 18 },
      didDrawPage: function(pageData) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(148, 163, 184);
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.3);
        doc.line(14, pageHeight - 10, pageWidth - 14, pageHeight - 10);
        doc.text("StockSense Material Management OS · Hinjawadi, Pune · Audit Verified", 14, pageHeight - 6);
        doc.text("CONFIDENTIAL · FOR INTERNAL OPERATIONAL AUDIT ONLY", pageWidth / 2, pageHeight - 6, { align: "center" });
        doc.text("Page " + pageData.pageNumber, pageWidth - 14, pageHeight - 6, { align: "right" });
      }
    });
  }

  // Sign-off signature blocks on the last page
  let finalY = doc.lastAutoTable.finalY + 8;
  if (finalY + 20 > pageHeight - 15) {
    doc.addPage();
    finalY = 22;
  }

  const sigColWidth = (pageWidth - 28 - 20) / 3;
  const sigLabels = ["Prepared By (Store In-Charge)", "Verified By (Head Chef / Accountant)", "Approved By (General Manager / Owner)"];
  sigLabels.forEach((label, sIdx) => {
    const sx = 14 + sIdx * (sigColWidth + 10);
    doc.setDrawColor(148, 163, 184);
    doc.setLineWidth(0.3);
    doc.line(sx, finalY + 10, sx + sigColWidth, finalY + 10);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text(label, sx + sigColWidth / 2, finalY + 14, { align: "center" });
  });

  return doc;
}

function savePdfDocument(doc, filename) {
  try {
    doc.save(filename);
  } catch (err) {
    console.warn("Direct doc.save() failed, attempting blob fallback:", err);
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      a.remove();
      URL.revokeObjectURL(url);
    }, 2000);
  }
}

// User Action: Export Current Report View to PDF
function exportCurrentReportPdf() {
  toast("Preparing professionally formatted PDF report...");
  try {
    const data = getCurrentReportData();
    const doc = buildReportPdfDoc(data);
    savePdfDocument(doc, data.filename);
    toast(`Report exported successfully as PDF: ${data.filename}`);
  } catch (err) {
    console.error("PDF Export error:", err);
    toast("PDF generation error: " + err.message + ". Opening print view...");
    previewCurrentReportPdf();
  }
}

// User Action: Preview and Print Current Report
function previewCurrentReportPdf() {
  const data = getCurrentReportData();
  if (!data.totalsRow && data.columns && data.rows && data.rows.length > 0) {
    data.totalsRow = computeUniversalTotalsRow(data.columns, data.rows, { isPdf: true });
  }
  if (data.secondTable && !data.secondTable.totalsRow && data.secondTable.columns && data.secondTable.rows) {
    data.secondTable.totalsRow = computeUniversalTotalsRow(data.secondTable.columns, data.secondTable.rows, { isPdf: true });
  }

  const html = `
    <div class="report-preview-sheet" id="print-area">
      <div class="report-header-banner">
        <div>
          <div class="report-brand-name">${escapeHtml(state.settings?.general?.name || "Hotel Rajmudra")}</div>
          <div class="report-brand-sub">Restaurant Inventory OS & Material Management System · Hinjawadi, Pune</div>
          <div style="font-size:11px;color:#64748b;margin-top:2px;">GSTIN: 27AAACH1234F1Z5 | Ph: +91 98220 12345 | accounts@hotelrajmudra.com</div>
        </div>
        <div style="text-align:right;">
          <span class="report-doc-badge">Official Audit Statement</span>
          <div style="font-size:11.5px;color:#64748b;margin-top:4px;">Generated: <b>${new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</b></div>
          <div style="font-size:11.5px;color:#64748b;">Warehouse: <b>${escapeHtml(data.activeWarehouse || state.currentStore || "Main Store")}</b> | User: <b>${escapeHtml(state.currentUser || "Akash Kumar")}</b></div>
        </div>
      </div>

      <div class="report-title-main">${escapeHtml(data.title)}</div>
      
      <div class="report-filter-tags">
        ${data.filtersText.map(f => `<span class="report-filter-tag">${escapeHtml(f)}</span>`).join("")}
      </div>

      <div class="report-kpis-grid">
        ${data.kpis.map(k => `
          <div class="report-kpi-card">
            <div class="kpi-label">${escapeHtml(k.label)}</div>
            <div class="kpi-val">${escapeHtml(k.value)}</div>
            ${k.sub ? `<div style="font-size:10px;color:#64748b;margin-top:2px;">${escapeHtml(k.sub)}</div>` : ''}
          </div>
        `).join("")}
      </div>

      <div class="report-preview-table-wrap">
        <table class="report-preview-table">
          <thead>
            <tr>
              ${data.columns.map((c, cIdx) => {
                const colHead = String(c || '').toLowerCase();
                const isHeadNum = /(qty|quantity|units|amount|value|valuation|cost|rate|total|spend|gst|tax|price|revenue|due|paid|balance|impact|cogs)/i.test(colHead);
                return `<th style="${isHeadNum ? 'text-align:right;' : ''}">${escapeHtml(c)}</th>`;
              }).join("")}
            </tr>
          </thead>
          <tbody>
            ${data.rows.map(row => `
              <tr>
                ${row.map((cell, cIdx) => {
                  const text = String(cell ?? '').trim();
                  const isNum = data.columnStyles?.[cIdx]?.halign === 'right' || text.startsWith("₹") || text.startsWith("Rs.") || /^[+\-]?\d[\d,.]*\s*(Units?|kg|gm|ltr|pcs|%|invoices?|vouchers?)?$/i.test(text);
                  const isCenter = data.columnStyles?.[cIdx]?.halign === 'center';
                  return `<td class="${isNum ? 'cell-num' : isCenter ? 'cell-center' : ''}">${escapeHtml(text)}</td>`;
                }).join("")}
              </tr>
            `).join("")}
          </tbody>
          ${data.totalsRow ? `
            <tfoot>
              <tr>
                ${data.totalsRow.map((cell, cIdx) => {
                  const text = String(cell ?? '').trim();
                  const isNum = data.columnStyles?.[cIdx]?.halign === 'right' || text.startsWith("₹") || text.startsWith("Rs.") || /^[+\-]?\d[\d,.]*\s*(Units?|kg|gm|ltr|pcs|%|invoices?|vouchers?)?$/i.test(text);
                  const isCenter = data.columnStyles?.[cIdx]?.halign === 'center';
                  const isTotalLabel = text === 'TOTAL' || text === 'GRAND TOTAL' || text.toLowerCase().includes('total');
                  return `<td class="${isNum ? 'cell-num' : isCenter ? 'cell-center' : ''}" style="${isTotalLabel ? 'font-weight:800;letter-spacing:0.4px;' : ''}">${escapeHtml(text)}</td>`;
                }).join("")}
              </tr>
            </tfoot>
          ` : ''}
        </table>
      </div>

      ${data.secondTable ? `
        <div style="margin-top:20px;">
          <div class="report-title-main" style="font-size:13px;">${escapeHtml(data.secondTable.title)}</div>
          <div class="report-preview-table-wrap">
            <table class="report-preview-table">
              <thead>
                <tr>
                  ${data.secondTable.columns.map(c => `<th>${escapeHtml(c)}</th>`).join("")}
                </tr>
              </thead>
              <tbody>
                ${data.secondTable.rows.map(row => `
                  <tr>
                    ${row.map((cell, cIdx) => {
                      const text = String(cell ?? '').trim();
                      const isNum = data.secondTable.columnStyles?.[cIdx]?.halign === 'right' || text.startsWith("₹") || text.startsWith("Rs.") || /^[+\-]?\d[\d,.]*\s*(Units?|kg|gm|ltr|pcs|%|invoices?|vouchers?)?$/i.test(text);
                      return `<td class="${isNum ? 'cell-num' : ''}">${escapeHtml(text)}</td>`;
                    }).join("")}
                  </tr>
                `).join("")}
              </tbody>
              ${data.secondTable.totalsRow ? `
                <tfoot>
                  <tr>
                    ${data.secondTable.totalsRow.map((cell, cIdx) => {
                      const text = String(cell ?? '').trim();
                      const isNum = data.secondTable.columnStyles?.[cIdx]?.halign === 'right' || text.startsWith("₹") || text.startsWith("Rs.") || /^[+\-]?\d[\d,.]*\s*(Units?|kg|gm|ltr|pcs|%|invoices?|vouchers?)?$/i.test(text);
                      return `<td class="${isNum ? 'cell-num' : ''}" style="${text === 'TOTAL' || text === 'GRAND TOTAL' ? 'font-weight:800;' : ''}">${escapeHtml(text)}</td>`;
                    }).join("")}
                  </tr>
                </tfoot>
              ` : ''}
            </table>
          </div>
        </div>
      ` : ''}

      <div class="report-signoff-row">
        <div class="report-sig-box">
          <div style="font-size:12px;font-weight:700;color:#0f172a;">Prepared By</div>
          <div style="font-size:11px;color:#64748b;margin-top:2px;">Store In-Charge / Clerk</div>
        </div>
        <div class="report-sig-box">
          <div style="font-size:12px;font-weight:700;color:#0f172a;">Verified By</div>
          <div style="font-size:11px;color:#64748b;margin-top:2px;">Head Chef / F&B Manager</div>
        </div>
        <div class="report-sig-box">
          <div style="font-size:12px;font-weight:700;color:#0f172a;">Approved By</div>
          <div style="font-size:11px;color:#64748b;margin-top:2px;">General Manager / Owner</div>
        </div>
      </div>

      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:20px;font-size:10.5px;color:#94a3b8;border-top:1px solid #edf2f7;padding-top:10px;">
        <span>StockSense Material Management OS · Audit Verified</span>
        <span>CONFIDENTIAL · INTERNAL MANAGEMENT AUDIT STATEMENT</span>
      </div>
    </div>
  `;

  openInAppModal(
    `${data.shortName || "Report"} — Formatted Print & PDF View`,
    html,
    `
      <button type="button" class="primary" onclick="exportCurrentReportPdf()">📄 Download PDF File</button>
      <button type="button" class="secondary" onclick="window.print()">🖨️ Print Formatted Report</button>
      <button type="button" class="secondary" onclick="closeModal()">Close</button>
    `,
    "width: 1040px; max-width: 96vw;"
  );
}

// Universal Report CSV Exporters
function exportCurrentReportCsv() {
  const data = getCurrentReportData();
  if (data && data.csvRows && data.csvFilename) {
    downloadCsv(data.csvFilename, data.csvRows);
    toast(`Exported CSV: ${data.csvFilename}`);
  } else {
    exportStockReportCsv();
  }
}

function exportStockReportCsv() {
  const oldType = currentReportType;
  currentReportType = "stock";
  const data = getCurrentReportData();
  currentReportType = oldType;
  downloadCsv(data.csvFilename, data.csvRows);
}

function exportStockLedgerCsv() {
  const oldType = currentReportType;
  currentReportType = "ledger";
  const data = getCurrentReportData();
  currentReportType = oldType;
  downloadCsv(data.csvFilename, data.csvRows);
}

function exportReportData() {
  exportStockLedgerCsv();
}

function exportPurchaseReportCsv() {
  const oldType = currentReportType;
  currentReportType = "purchase";
  const data = getCurrentReportData();
  currentReportType = oldType;
  downloadCsv(data.csvFilename, data.csvRows);
}

function exportOutwardReportCsv() {
  const oldType = currentReportType;
  currentReportType = "outward";
  const data = getCurrentReportData();
  currentReportType = oldType;
  downloadCsv(data.csvFilename, data.csvRows);
}

function exportDepartmentConsumptionCsv() {
  const oldType = currentReportType;
  currentReportType = "consumption";
  const data = getCurrentReportData();
  currentReportType = oldType;
  downloadCsv(data.csvFilename, data.csvRows);
}

function exportDeadStockCsv() {
  const oldType = currentReportType;
  currentReportType = "deadstock";
  const data = getCurrentReportData();
  currentReportType = oldType;
  downloadCsv(data.csvFilename, data.csvRows);
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

        <div style="margin-top:24px;padding:16px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap;">
            <div>
              <b style="font-size:14px;color:#0f172a;display:block;margin-bottom:4px;">Item Name &amp; Unit Auto-Standardization</b>
              <p style="margin:0;font-size:13px;color:#64748b;line-height:1.5;">
                Converts all item names to Title Case (e.g. <code>ATTA</code> &rarr; <code>Atta</code>) and intelligently resolves default <code>unit</code> to actual physical units (e.g. Atta in <code>kg</code>, Milk in <code>Ltr</code>, Eggs in <code>pcs</code>).
              </p>
            </div>
            <button class="primary" style="white-space:nowrap;display:inline-flex;align-items:center;gap:6px;" onclick="const res = normalizeCatalogUnitsAndNames(); rebuildStock(); save(); showView('settings'); toast('Standardized ' + res.updated + ' catalog items with proper names &amp; actual units');">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
              Standardize All Items Now
            </button>
          </div>
        </div>
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
          <input id="m-prod-name" placeholder="e.g. Atta, Milk, Basmati Rice" oninput="handleProdNameAutoDetect(this.value)" onblur="this.value=formatItemName(this.value);handleProdNameAutoDetect(this.value)">
          <span style="font-size:11px;color:#64748b;margin-top:2px;">Name is automatically formatted (e.g. ATTA &rarr; Atta) and actual unit identified</span>
        </div>
        <div class="form-field">
          <label>Brand</label>
          <input id="m-prod-brand" placeholder="e.g. Aashirvaad, Amul, Metro">
        </div>
        <div class="form-field">
          <label>Category</label>
          <input id="m-prod-cat" placeholder="e.g. Flour & Grains, Dairy, Pantry" onchange="this.dataset.manual='true'">
        </div>
        <div class="form-field">
          <label>Department</label>
          <select id="m-prod-dept">
            ${departments.map(d => `<option>${d}</option>`).join("")}
          </select>
        </div>
        <div class="form-field">
          <label>Unit (e.g. kg, Ltr, pcs)</label>
          <select id="m-prod-unit">
            ${renderUnitOptions("kg")}
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
  const rawName = document.getElementById("m-prod-name")?.value.trim();
  if (!rawName) { toast("Item name is required"); return; }
  const name = formatItemName(rawName);
  const brand = document.getElementById("m-prod-brand")?.value.trim() || "";
  const category = formatItemName(document.getElementById("m-prod-cat")?.value.trim() || identifyItemCategory(name));
  const department = document.getElementById("m-prod-dept")?.value || "Kitchen";
  const unit = document.getElementById("m-prod-unit")?.value || identifyItemUnit(name, "unit", category);
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
    icon: getItemIcon(name, category),
    active: true
  };

  state.products.push(newProd);
  if (!state.openingStock) state.openingStock = {};
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
  toast(`Product "${name}" (${unit}) added to catalog`);
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
  if (!rows || !rows.length) return;
  let finalRows = [...rows];
  if (finalRows.length > 1) {
    const headers = finalRows[0];
    const dataRows = finalRows.slice(1);
    const lastRow = dataRows[dataRows.length - 1];
    const firstCell = String(lastRow[0] || lastRow[1] || "").toLowerCase().trim();
    const hasTotal = firstCell.includes("total") || firstCell.includes("grand total") || firstCell.includes("summary");
    if (!hasTotal) {
      const totalsRow = computeUniversalTotalsRow(headers, dataRows, { isExcel: true });
      if (totalsRow && totalsRow.length > 0) {
        finalRows.push(totalsRow);
      }
    }
  }

  const csvContent = "\uFEFF" + finalRows.map(r => r.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(",")).join("\r\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csvContent], { type: "text/csv;charset=utf-8;" }));
  a.download = filename;
  a.click();
  toast(filename + " downloaded");
}

// RESTAURANT SALES & CONSUMPTION VIEW
function salesScreen() {
  const today = new Date().toISOString().slice(0, 10);
  const salesOrders = state.transactions.filter(t => t.type === "Sale" || t.type === "Outward");
  const todaySalesCount = salesOrders.filter(t => (t.date || "").slice(0, 10) === today).length;
  const totalDisbursed = salesOrders.reduce((sum, t) => sum + Math.abs(Number(t.qty) || 0) * (Number(t.cost || t.rate) || 10), 0);

  return `
    <div class="stock-ledger-page-container">
      <div class="stock-ledger-card">
        <div class="stock-ledger-header-row">
          <div class="stock-ledger-title-group">
            <h1 class="stock-ledger-title">Restaurant Sales & Consumption</h1>
            <div class="stock-ledger-scope">
              <span class="stock-ledger-scope-dot"></span>
              <span class="stock-ledger-scope-text">LIVE KITCHEN DISBURSEMENTS & BILLING</span>
            </div>
          </div>
          <div class="stock-ledger-controls-group">
            <button class="topbar-btn topbar-btn-purchase" onclick="newOutward()">+ New Kitchen Issue</button>
            <button class="topbar-btn topbar-btn-new-item" onclick="openRecordSaleModal()">+ Record Sale Bill</button>
          </div>
        </div>

        <div class="metrics" style="margin: 20px 0;">
          <div class="metric-card"><div class="metric-title">Today's Kitchen Orders</div><div class="metric-val" style="color:#2563eb;">${todaySalesCount}</div><div class="metric-foot">Dispatched to outlets</div></div>
          <div class="metric-card"><div class="metric-title">Total Consumption Value</div><div class="metric-val" style="color:#16a34a;">₹${totalDisbursed.toLocaleString('en-IN', {minimumFractionDigits:2, maximumFractionDigits:2})}</div><div class="metric-foot">FIFO inventory value</div></div>
          <div class="metric-card"><div class="metric-title">Active Revenue Centers</div><div class="metric-val" style="color:#0f172a;">3</div><div class="metric-foot">Fine Dine, Bar, Banquet</div></div>
          <div class="metric-card"><div class="metric-title">Total Ledger Dispatches</div><div class="metric-val" style="color:#ea580c;">${salesOrders.length}</div><div class="metric-foot">Synchronized transactions</div></div>
        </div>

        <div class="stock-ledger-table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>Date / Time</th>
                <th>Voucher / Ref #</th>
                <th>Item Dispatched</th>
                <th>Quantity</th>
                <th>Unit Rate</th>
                <th>Total Value</th>
                <th>Department / Outlet</th>
                <th>Operator</th>
              </tr>
            </thead>
            <tbody>
              ${salesOrders.slice(0, 30).map(s => `
                <tr>
                  <td>${fmtDate(s.date)}</td>
                  <td><b>${escapeHtml(s.id || s.ref || 'SALE-001')}</b></td>
                  <td>${escapeHtml(s.product)}</td>
                  <td style="font-weight:700;color:#ea580c;">${Math.abs(s.qty)}</td>
                  <td>₹${(s.cost || s.rate || 0).toFixed(2)}</td>
                  <td><b>₹${(Math.abs(s.qty) * (s.cost || s.rate || 0)).toFixed(2)}</b></td>
                  <td><span class="pill">${escapeHtml(s.store || 'Restaurant')}</span></td>
                  <td>${escapeHtml(s.user || state.currentUser)}</td>
                </tr>
              `).join("") || '<tr><td colspan="8" style="text-align:center;padding:32px;color:#94a3b8;">No sales or consumption dispatches logged yet. Click "+ Record Sale Bill" to add one.</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function openRecordSaleModal() {
  openInAppModal("Record Restaurant Sale & Kitchen Consumption", `
    <div class="form-grid">
      <div class="form-field full">
        <label>Item *</label>
        <select id="sale-product-select">
          ${state.products.map(p => `<option value="${escapeHtml(p.name)}">${escapeHtml(p.name)} (${p.stock} ${p.unit} in stock)</option>`).join("")}
        </select>
      </div>
      <div class="form-field">
        <label>Quantity Consumed / Sold *</label>
        <input id="sale-qty" type="number" step="0.01" value="1" min="0.01">
      </div>
      <div class="form-field">
        <label>Billing Outlet / Department</label>
        <select id="sale-outlet">
          <option>Main Kitchen</option>
          <option>Restaurant Fine Dine</option>
          <option>Bar & Beverage Counter</option>
          <option>Banquet & Events</option>
        </select>
      </div>
      <div class="form-field full">
        <label>Table / Bill Reference</label>
        <input id="sale-ref" placeholder="e.g. Table 12, Banquet Hall A, Takeaway #412">
      </div>
    </div>
  `, `
    <button class="secondary" onclick="closeModal()">Cancel</button>
    <button class="primary" onclick="submitRecordSale()">Save Sale Entry</button>
  `);
}

function submitRecordSale() {
  const prodName = document.getElementById("sale-product-select")?.value;
  const p = productByName(prodName);
  if (!p) { toast("Please select a product"); return; }
  const qty = Number(document.getElementById("sale-qty")?.value) || 0;
  if (qty <= 0) { toast("Quantity must be greater than zero"); return; }
  const outlet = document.getElementById("sale-outlet")?.value || "Main Kitchen";
  const ref = document.getElementById("sale-ref")?.value.trim() || ("BILL-" + Math.floor(1000 + Math.random() * 9000));

  p.stock = Math.max(0, (Number(p.stock) || 0) - qty);

  state.transactions.unshift({
    id: "SALE-" + Date.now(),
    date: new Date().toISOString(),
    type: "Sale",
    product: p.name,
    store: outlet,
    qty: -qty,
    cost: p.cost || p.purchaseCost || 0,
    user: state.currentUser,
    ref: ref
  });

  save();
  closeModal();
  toast(`Logged sale for ${p.name} (-${qty} ${p.unit})`);
  showView("sales");
}

// ABOUT DEVELOPER VIEW
function aboutDeveloperScreen() {
  return `
    <div class="stock-ledger-page-container">
      <div class="stock-ledger-card" style="max-width: 900px; margin: 0 auto;">
        <div style="text-align:center; padding: 20px 0 30px;">
          <div style="width:64px;height:64px;border-radius:18px;background:#0b1120;color:#ffffff;display:inline-grid;place-items:center;font-size:26px;font-weight:800;margin:0 auto 16px auto;box-shadow:0 8px 24px rgba(11,17,32,0.25);">
            SS
          </div>
          <h1 style="font-size:28px;font-weight:800;color:#0f172a;margin:0;">StockSense Enterprise</h1>
          <p style="font-size:14px;color:#64748b;margin-top:6px;">Next-Generation Restaurant & Commercial Kitchen Inventory OS</p>
          <div style="display:inline-flex;align-items:center;gap:8px;background:#eff6ff;color:#2563eb;font-weight:700;font-size:12px;padding:6px 14px;border-radius:20px;border:1px solid #bfdbfe;margin-top:12px;">
            ● Version 2.4-Production • Hotel Rajmudra Deployment
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:16px;">
          <div style="border:1px solid #e2e8f0;border-radius:14px;padding:22px;background:#f8fafc;">
            <b style="font-size:15px;color:#0f172a;">Core Capabilities</b>
            <ul style="margin:12px 0 0 18px;font-size:13px;color:#475569;line-height:1.8;">
              <li>Real-time Stock Ledger Balance (Carry Forward, Receipts, Consumption, Closing)</li>
              <li>Dual Inward / Outward inventory synchronization</li>
              <li>Universal PDF & Financial reporting engine</li>
              <li>Physical audit cycle counts & stock discrepancy reconciliation</li>
              <li>Multi-warehouse & departmental cost allocation</li>
            </ul>
          </div>

          <div style="border:1px solid #e2e8f0;border-radius:14px;padding:22px;background:#f8fafc;">
            <b style="font-size:15px;color:#0f172a;">System Architecture</b>
            <ul style="margin:12px 0 0 18px;font-size:13px;color:#475569;line-height:1.8;">
              <li>High-performance reactive single-page architecture</li>
              <li>Strict tabular numeric alignment & audit tracking</li>
              <li>Zero data-loss local state persistence with automatic recovery</li>
              <li>Instant responsive search & category filtration across 250+ SKUs</li>
            </ul>
          </div>
        </div>

        <div style="text-align:center;margin-top:32px;padding-top:20px;border-top:1px solid #e2e8f0;font-size:13px;color:#64748b;">
          Engineered for hospitality operations • <b>Hotel Rajmudra, Hinjawadi, Pune</b>
        </div>
      </div>
    </div>
  `;
}

// NAVIGATION DISPATCHER
let ledgerFilterItem = null;

function showView(view) {
  document.querySelectorAll(".nav-item").forEach(b => b.classList.toggle("active", b.dataset.view === view));
  const titleEl = document.getElementById("page-title");
  if (titleEl) {
    if (view === "inventory" || view === "stock") titleEl.textContent = "Stock";
    else if (view === "about-dev") titleEl.textContent = "About Developer";
    else titleEl.textContent = titleCase(view);
  }

  let html = "";
  if (view === "dashboard") html = dashboard();
  else if (view === "inventory" || view === "stock") html = inventory();
  else if (view === "sales") html = salesScreen();
  else if (view === "about-dev") html = aboutDeveloperScreen();
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
  else html = inventory();

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
      stockLedgerFilters.search = e.target.value;
      showView("inventory");
      const localSearch = document.getElementById("stock-ledger-search");
      if (localSearch) localSearch.value = e.target.value;
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
    } else if (poDraft.isNew) {
      exitPOFullscreen();
    } else {
      closeAllPopovers();
    }
  }
  if (e.key === "F8" || (e.ctrlKey && (e.key.toLowerCase() === "s" || e.key.toLowerCase() === "a"))) {
    if (document.getElementById("purchase-items-body")) { e.preventDefault(); savePurchase(); }
    else if (document.getElementById("outward-items-body")) { e.preventDefault(); saveOutward(); }
    else if (document.getElementById("po-items-body")) { e.preventDefault(); savePurchaseOrder(); }
  }
  if (e.key === "F5") {
    if (document.getElementById("purchase-items-body")) { e.preventDefault(); addPurchaseRow(); }
    else if (document.getElementById("outward-items-body")) { e.preventDefault(); addOutwardRow(); }
    else if (document.getElementById("po-items-body")) { e.preventDefault(); addPORow(); }
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
  showView("inventory");
});

ensureProductsDatalist();
updateSidebarMeta();
showView("inventory");
