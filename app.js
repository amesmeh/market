  // تصنيفات الحسابات (قابلة للتعديل)
  const ACC_CAT_KEY = 'sm_account_categories_v1';
  function loadAccountCategories(){ try{ return JSON.parse(localStorage.getItem(ACC_CAT_KEY))||[] }catch{ return [] } }
  function saveAccountCategories(arr){ localStorage.setItem(ACC_CAT_KEY, JSON.stringify(arr)); }
const MENU_ITEMS = [
  { key: 'products', label: 'المنتجات', icon: '🛒' },
  { key: 'sales', label: 'المبيعات', icon: '💵' },
  { key: 'purchases', label: 'المشتريات', icon: '🧾' },
  { key: 'invoices', label: 'الفواتير', icon: '📄' },
  { key: 'accounts', label: 'متابعة الحسابات', icon: '📊' },
  { key: 'expenses', label: 'المصروفات', icon: '💳' },
  { key: 'debts', label: 'الديون', icon: '📌' },
  { key: 'cashboxes', label: 'الصناديق', icon: '💼' },
  { key: 'partners', label: 'الشركاء', icon: '🤝' },
  { key: 'stats', label: 'الإحصائيات', icon: '📈' },
  { key: 'calculator', label: 'الآلة الحاسبة', icon: '🧮' },
  { key: 'settings', label: 'الإعدادات', icon: '⚙️' },
];

const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

// حالة تعديل فاتورة مبيعات من خلال تبويب المبيعات
let editingSaleInvoiceNo = null;      // رقم الفاتورة الجاري تعديلها
let editingSaleOriginal = null;       // النسخة الأصلية (لاسترجاع الطبقات المستهلكة)
let editingSaleConsumedMap = null;    // خريطة الاستهلاك الأصلية لكل صنف
// حالة تعديل فاتورة مشتريات
let editingPurchInvoiceNo = null;
let editingPurchOriginal = null;
// دالة إعادة ضبط وضع تحرير الفواتير عند الانتقال لتبويب الفواتير
function resetInvoiceEditState(){
  editingPurchInvoiceNo = null;
  editingPurchOriginal = null;
}

// التخزين المحلي للمنتجات
const STORE_KEY = 'sm_products_v1';
const SIDEBAR_KEY = 'sm_sidebar_collapsed';
function loadProducts(){
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; }
  catch { return []; }
}
  const SALES_KEY = 'sm_sales_v1';
  const PURCH_KEY = 'sm_purchases_v1';
  const SEQ_KEY = 'sm_invoice_seq_v1';
function saveProducts(list){
  localStorage.setItem(STORE_KEY, JSON.stringify(list));
}
function addProduct(p){
  const list = loadProducts();
  ensureProductLots(p);
  // initialize lots from provided stock and buyPrice if not existing
  if((p.lots||[]).length===0 && Number(p.stock||0)>0){ p.lots=[{ qty:Number(p.stock||0), price:Number(p.buyPrice||0) }]; }
  list.push(p);
  saveProducts(list);
}
  function loadSales(){ try{ return JSON.parse(localStorage.getItem(SALES_KEY))||[] }catch{ return [] } }
  function saveSales(arr){ localStorage.setItem(SALES_KEY, JSON.stringify(arr)); }
  function loadPurchases(){ try{ return JSON.parse(localStorage.getItem(PURCH_KEY))||[] }catch{ return [] } }
  function savePurchases(arr){ localStorage.setItem(PURCH_KEY, JSON.stringify(arr)); }
  const SETTINGS_KEY = 'sm_settings_v1';
  const PARTNERS_KEY = 'sm_partners_v1';
  const DISTR_KEY = 'sm_profit_distributions_v1';
  const PWITH_KEY = 'sm_partner_withdrawals_v1';
  function loadSettings(){ try{ return JSON.parse(localStorage.getItem(SETTINGS_KEY))||{} }catch{ return {} } }
  function saveSettings(obj){ localStorage.setItem(SETTINGS_KEY, JSON.stringify(obj)); }
  function loadPartners(){ try{ return JSON.parse(localStorage.getItem(PARTNERS_KEY))||[] }catch{ return [] } }
  function savePartners(arr){ localStorage.setItem(PARTNERS_KEY, JSON.stringify(arr)); }
  // ترقية بسيطة: إضافة initialCapital إذا لم تكن موجودة
  (function upgradePartners(){
    try{
      const arr = JSON.parse(localStorage.getItem(PARTNERS_KEY))||[];
      let changed=false;
      arr.forEach(p=>{ if(p && p.initialCapital==null){ p.initialCapital = Number(p.capital||0); changed=true; } });
      if(changed) localStorage.setItem(PARTNERS_KEY, JSON.stringify(arr));
    }catch{}
  })();
  function loadDistributions(){ try{ return JSON.parse(localStorage.getItem(DISTR_KEY))||[] }catch{ return [] } }
  function saveDistributions(arr){ localStorage.setItem(DISTR_KEY, JSON.stringify(arr)); }
  function loadPartnerWithdrawals(){ try{ return JSON.parse(localStorage.getItem(PWITH_KEY))||[] }catch{ return [] } }
  function savePartnerWithdrawals(arr){ localStorage.setItem(PWITH_KEY, JSON.stringify(arr)); }
  function nextInvoiceNo(prefix){
    let seq = 0; try{ seq = Number(localStorage.getItem(SEQ_KEY)||0) }catch{ seq=0 }
    seq += 1; localStorage.setItem(SEQ_KEY, String(seq));
    return prefix + String(seq).padStart(5,'0');
  }
  const CASHBOX_KEY = 'sm_cashboxes_v1';
  const TRANSFER_KEY = 'sm_transfers_v1';
  const EXPENSES_KEY = 'sm_expenses_v1';
  function loadCashboxes(){ try{ return JSON.parse(localStorage.getItem(CASHBOX_KEY))||[] }catch{ return [] } }
  function saveCashboxes(arr){ localStorage.setItem(CASHBOX_KEY, JSON.stringify(arr)); }
  function loadTransfers(){ try{ return JSON.parse(localStorage.getItem(TRANSFER_KEY))||[] }catch{ return [] } }
  function saveTransfers(arr){ localStorage.setItem(TRANSFER_KEY, JSON.stringify(arr)); }
  function loadExpenses(){ try{ return JSON.parse(localStorage.getItem(EXPENSES_KEY))||[] }catch{ return [] } }
  function saveExpenses(arr){ localStorage.setItem(EXPENSES_KEY, JSON.stringify(arr)); }
  // Accounts (manual cash movements log)
  const ACC_LOG_KEY = 'sm_account_log_v1';
  function loadAccountLogs(){ try{ return JSON.parse(localStorage.getItem(ACC_LOG_KEY))||[] }catch{ return [] } }
  function saveAccountLogs(arr){ localStorage.setItem(ACC_LOG_KEY, JSON.stringify(arr)); }
  // Debts storage
  const DEBT_CLIENTS_KEY = 'sm_debt_clients_v1';
  const DEBT_TX_KEY = 'sm_debt_txs_v1';
  function loadDebtClients(){ try{ return JSON.parse(localStorage.getItem(DEBT_CLIENTS_KEY))||[] }catch{ return [] } }
  function saveDebtClients(arr){ localStorage.setItem(DEBT_CLIENTS_KEY, JSON.stringify(arr)); }
  function loadDebtTx(){ try{ return JSON.parse(localStorage.getItem(DEBT_TX_KEY))||[] }catch{ return [] } }
  function saveDebtTx(arr){ localStorage.setItem(DEBT_TX_KEY, JSON.stringify(arr)); }
  function nextDebtClientCode(){
    const s = loadSettings();
    if(!s.nextDebtCode) s.nextDebtCode = 1;
    const code = 'D' + String(s.nextDebtCode).padStart(4,'0');
    s.nextDebtCode += 1; saveSettings(s); return code;
  }
  function addCashbox(name, opening){
    const boxes = loadCashboxes();
    const id = 'CB' + Date.now();
    boxes.push({ id, name: String(name).trim(), opening: Number(opening)||0, balance: Number(opening)||0 });
    saveCashboxes(boxes);
    return id;
  }
  function makeTransfer({date, amount, fromId, toId, note}){
    const boxes = loadCashboxes();
    const from = boxes.find(b=> b.id===fromId);
    const to = boxes.find(b=> b.id===toId);
    const amt = Number(amount)||0;
    if(!from || !to) throw new Error('صندوق غير موجود');
    if(fromId===toId) throw new Error('اختر صندوقين مختلفين');
    if(amt<=0) throw new Error('المبلغ يجب أن يكون أكبر من صفر');
    if(from.balance < amt) throw new Error('الرصيد غير كاف في الصندوق المحوَّل منه');
    from.balance -= amt; to.balance += amt; saveCashboxes(boxes);
    const log = loadTransfers();
    log.push({ id:'TX'+Date.now(), date, amount:amt, fromId, toId, note: String(note||'') });
    saveTransfers(log);
  }
  function ensureOpenings(){
    const boxes = loadCashboxes();
    let changed = false;
    boxes.forEach(b=>{ if(typeof b.opening === 'undefined'){ b.opening = Number(b.balance||0); changed = true; } });
    if(changed) saveCashboxes(boxes);
  }
  function recomputeBalances(){
    const boxes = loadCashboxes();
    const map = Object.fromEntries(boxes.map(b=>[b.id,b]));
    boxes.forEach(b=>{ b.balance = Number(b.opening||0); });
    const logs = loadTransfers();
    logs.forEach(tx=>{
      const from = map[tx.fromId]; const to = map[tx.toId]; const amt = Number(tx.amount)||0;
      if(from) from.balance -= amt; if(to) to.balance += amt;
    });
    // apply sales (paid only) and purchases
    const sales = loadSales();
    sales.forEach(v=>{
      const b = map[v.cashbox];
      const amt = Number(v.total||0);
      if(b && v.status==='paid') b.balance += amt;
    });
    const purch = loadPurchases();
    purch.forEach(v=>{
      const b = map[v.cashbox];
      const amt = Number(v.total||0);
      if(b) b.balance -= amt;
    });
    // apply expenses (always reduce from their cashbox)
    const expenses = loadExpenses();
    expenses.forEach(e=>{
      const b = map[e.cashbox];
      const amt = Number(e.amount||0);
      if(b) b.balance -= amt;
    });
    saveCashboxes(boxes);
  }
function computeStats(){
  const list = loadProducts();
  const totalProducts = list.length;
  const totalStock = list.reduce((s,p)=> s + (Number(p.stock)||0), 0);
  const stockValue = list.reduce((s,p)=> s + (Number(p.stock||0) * Number(p.buyPrice||0)), 0);
  const avgProfit = list.length
    ? list.reduce((s,p)=> s + ((Number(p.bankPrice||0) - Number(p.buyPrice||0))||0), 0) / list.length
    : 0;
  const sales = loadSales();
  const totalSalesProfit = sales.reduce((s,v)=> s + Number(v.profit||0), 0);
  const expenses = loadExpenses();
  const totalExpenses = expenses.reduce((s,v)=> s + Number(v.amount||0), 0);
  const dists = loadDistributions();
  const mgmtFees = dists.reduce((s,d)=> s + Number(d.mgmtFeeValue||0), 0);
  const distPaid = dists.reduce((s,d)=> s + Number(d.totalPaidOut||0), 0);
  const distReinv = dists.reduce((s,d)=> s + Number(d.totalReinvested||0), 0);
  // Opening balances adjustments
  const settings = loadSettings();
  const ob = (settings && settings.openingBalances) ? settings.openingBalances : { profit:0, expenses:0 };
  const adjProfit = totalSalesProfit + Number(ob.profit||0);
  const adjExpenses = totalExpenses + Number(ob.expenses||0);
  const undistributed = adjProfit - adjExpenses - mgmtFees - distPaid - distReinv;
  const partners = loadPartners();
  const totalCapital = partners.reduce((s,p)=> s + Number(p.capital||0), 0);
  return { totalProducts, totalStock, stockValue, avgProfit, undistributed, totalCapital, totalSalesProfit:adjProfit, totalExpenses:adjExpenses, mgmtFees, distPaid, distReinv, baseProfit: totalSalesProfit, baseExpenses: totalExpenses, obProfit: Number(ob.profit||0), obExpenses: Number(ob.expenses||0) };
}

function renderSidebar(activeKey){
  const aside = $('#sidebar');
  aside.innerHTML = '';
  const logo = document.createElement('div');
  logo.className = 'logo';
  logo.innerHTML = `<span class="icon">🛍️</span><span>متجرنا</span>`;
  aside.appendChild(logo);

  const ul = document.createElement('ul');
  ul.className = 'menu';
  MENU_ITEMS.forEach(item=>{
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.type='button';
    btn.innerHTML = `<span class="icon">${item.icon}</span><span>${item.label}</span>`;
    btn.title = item.label;
    if(item.key === activeKey) btn.classList.add('active');
    btn.addEventListener('click', ()=>{
      location.hash = item.key;
    });
    li.appendChild(btn);
    ul.appendChild(li);
  });
  aside.appendChild(ul);
}

function renderTopStats(){
  const box = $('#top-stats');
  const s = computeStats();
  const operatingUndistributed = (s.baseProfit - s.baseExpenses) - s.mgmtFees - s.distPaid - s.distReinv;
  const openingDelta = (s.obProfit - s.obExpenses);
  const stats = [
    { ico:'📦', val:formatNumber(s.totalProducts,0), lbl:'إجمالي المنتجات' },
    { ico:'🗃️', val:formatNumber(s.totalStock,0), lbl:'إجمالي المخزون' },
    { ico:'💰', val: formatCurrency(s.stockValue), lbl:'قيمة المخزون' },
    { ico:'📈', val: formatCurrency(s.avgProfit), lbl:'متوسط الربح البنكي' },
    { ico:'💹', val:`${formatCurrency(s.undistributed||0)}<div class="mini" style="margin-top:2px;direction:rtl">تشغيلي: ${formatCurrency(operatingUndistributed)} • افتتاحي: ${formatCurrency(openingDelta)}</div>`, lbl:'صافي غير موزع' },
  ];
  box.innerHTML = stats.map(s=>`
    <div class="stat-card">
      <div class="ico">${s.ico}</div>
      <div>
        <div class="val">${s.val}</div>
        <div class="lbl">${s.lbl}</div>
      </div>
    </div>
  `).join('');
}

function formatCurrency(n){
  return new Intl.NumberFormat('en-US', { style:'currency', currency:'ILS', maximumFractionDigits:2 }).format(Number(n||0));
}

function formatNumber(n, digits=0){
  return new Intl.NumberFormat('en-US', { minimumFractionDigits:digits, maximumFractionDigits:digits }).format(Number(n||0));
}

function numberInputValue(id){
  return Number($(id).value || 0) || 0;
}

function renderProductsTable(filter=''){
  const box = $('#products-list');
  const all = loadProducts();
  const headers = ['الباركود','اسم الصنف','التصنيف','المخزون','سعر الشراء','سعر البيع النقدي','سعر البيع البنكي','الربح النقدي','الربح البنكي'];
  const html = `
    <div class="searchbar" style="margin-bottom:8px">
      <input class="input" id="search" placeholder="بحث بالاسم/الباركود/التصنيف" value="${escapeHtml(filter)}" />
    </div>
    <div style="overflow:auto">
    <table class="table">
      <thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}<th>الإجراءات</th></tr></thead>
      <tbody id="prod_rows"></tbody>
    </table>
    </div>`;
  box.innerHTML = html;
  function paint(){
    const q = ($('#search').value||'').trim().toLowerCase();
    const list = q ? all.filter(p=>
      String(p.name||'').toLowerCase().includes(q) ||
      String(p.barcode||'').toLowerCase().includes(q) ||
      String(p.category||'').toLowerCase().includes(q)
    ) : all;
    const cntEl = $('#prod_count'); if(cntEl) cntEl.textContent = String(list.length);
    if(!list.length){ $('#prod_rows').innerHTML = `<tr><td colspan="10">لا توجد بيانات بعد.</td></tr>`; return; }
    $('#prod_rows').innerHTML = list.map(p=>`
      <tr>
        <td>${escapeHtml(p.barcode||'')}</td>
        <td>${escapeHtml(p.name||'')}</td>
        <td>${escapeHtml(p.category||'')}</td>
        <td>${formatNumber(p.stock||0,0)}</td>
        <td>${formatNumber(p.buyPrice||0,2)}</td>
        <td>${formatNumber(p.cashPrice||0,2)}</td>
        <td>${formatNumber(p.bankPrice||0,2)}</td>
        <td>${formatNumber(Number(p.cashPrice||0)-Number(p.buyPrice||0),2)}</td>
        <td>${formatNumber(Number(p.bankPrice||0)-Number(p.buyPrice||0),2)}</td>
        <td><button class="button ghost btn-act" data-id="${escapeAttr(p.barcode||p.name)}">⋯</button></td>
      </tr>`).join('');
    $$('.btn-act', box).forEach(btn=> btn.addEventListener('click', ()=> openActionsModal(btn.dataset.id)));
  }
  $('#search').addEventListener('input', paint);
  paint();
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
}
function escapeAttr(s){
  return String(s).replace(/"/g,'&quot;');
}

// FIFO helpers for inventory layers (lots)
function ensureProductLots(p){
  if(!p) return;
  if(!Array.isArray(p.lots)){
    const qty = Number(p.stock||0);
    const price = Number(p.buyPrice||0);
    p.lots = qty>0 ? [{ qty, price }] : [];
  }
}
function lotsTotalQty(p){
  ensureProductLots(p);
  return (p.lots||[]).reduce((s,l)=> s + Number(l.qty||0), 0);
}
function fifoAddLot(p, qty, price){
  ensureProductLots(p);
  const q = Number(qty)||0; const pr = Number(price)||0;
  if(q<=0) return;
  const last = p.lots[p.lots.length-1];
  if(last && Number(last.price)===pr){ last.qty = Number(last.qty||0) + q; }
  else p.lots.push({ qty:q, price:pr });
}
// Enhanced lot with metadata (source purchase invoice no + timestamp)
function migrateLotsIfNeeded(p){
  ensureProductLots(p);
  if(!p.lots) p.lots = [];
  let changed=false;
  p.lots.forEach(l=>{
    if(l && l.qty!=null && l.price!=null && l.sourceNo===undefined){
      l.sourceNo = l.sourceNo || null; // unknown origin
      l.createdAt = l.createdAt || Date.now();
      changed=true;
    }
  });
  if(changed) p.stock = lotsTotalQty(p);
}
function fifoAddLotDetailed(p, qty, price, sourceNo){
  migrateLotsIfNeeded(p);
  const q = Number(qty)||0; const pr = Number(price)||0; if(q<=0) return;
  // Do not merge across different sourceNo; keep traceability
  p.lots.push({ qty:q, price:pr, sourceNo: sourceNo||null, createdAt: Date.now() });
  p.stock = lotsTotalQty(p);
}
function removeLotsBySource(p, sourceNo){
  migrateLotsIfNeeded(p);
  const target = sourceNo==null?null:String(sourceNo);
  // Remove only lots whose source matches exactly and return removed aggregate
  let removed=[];
  p.lots = p.lots.filter(l=>{
    if(String(l.sourceNo)===target){ removed.push(l); return false; }
    return true;
  });
  p.stock = lotsTotalQty(p);
  return removed;
}
function findLotsBySource(p, sourceNo){
  migrateLotsIfNeeded(p);
  const target = sourceNo==null?null:String(sourceNo);
  return (p.lots||[]).filter(l=> String(l.sourceNo)===target);
}
function hasSourceLotsFullyAvailable(p, sourceNo, items){
  // items: array of {qty, price}
  const lots = findLotsBySource(p, sourceNo);
  // Sum required per price
  const needMap = new Map();
  items.forEach(it=>{ const key=Number(it.price); needMap.set(key, (needMap.get(key)||0)+Number(it.qty||0)); });
  const haveMap = new Map();
  lots.forEach(l=>{ const key=Number(l.price); haveMap.set(key, (haveMap.get(key)||0)+Number(l.qty||0)); });
  for(const [price, need] of needMap){ if((haveMap.get(price)||0) < need) return false; }
  return true;
}
// ملاحظة: الطبقات القديمة (قبل إضافة sourceNo) يتم تحويلها إلى sourceNo = null.
// تعديل فاتورة شراء قديمة غير ممكن إذا كانت كمياتها قد استهلكت جزئياً في المبيعات، لأننا لا نستطيع تتبع الجزء المستهلك منها بدقة بالسعر فقط.
// جميع الفواتير الجديدة تستخدم sourceNo = رقم الفاتورة لضمان إمكانية التعديل لاحقاً ما دام لم يُستهلك أي جزء.
function fifoConsume(p, qty){
  // Destructively consume from oldest lots; return total COGS
  ensureProductLots(p);
  let need = Number(qty)||0; let cogs = 0;
  const lots = p.lots;
  for(let i=0; i<lots.length && need>0; i++){
    const take = Math.min(Number(lots[i].qty||0), need);
    if(take>0){ cogs += take * Number(lots[i].price||0); lots[i].qty = Number(lots[i].qty||0) - take; need -= take; }
  }
  // remove empty lots
  p.lots = lots.filter(l=> Number(l.qty||0) > 0);
  // sync stock
  p.stock = lotsTotalQty(p);
  return cogs;
}
function fifoConsumeBreakdown(p, qty){
  ensureProductLots(p);
  let need = Number(qty)||0; let cogs = 0; const parts=[];
  const lots = p.lots;
  for(let i=0; i<lots.length && need>0; i++){
    const take = Math.min(Number(lots[i].qty||0), need);
    if(take>0){
      const price = Number(lots[i].price||0);
      cogs += take * price; parts.push({ qty: take, price });
      lots[i].qty = Number(lots[i].qty||0) - take; need -= take;
    }
  }
  p.lots = lots.filter(l=> Number(l.qty||0) > 0);
  p.stock = lotsTotalQty(p);
  return { cogs, parts };
}
function fifoPeekCOGSMap(products, items){
  // Simulate COGS for a set of items without mutating products
  const map = new Map();
  products.forEach(p=>{ ensureProductLots(p); map.set(String(p.barcode||p.name), (p.lots||[]).map(l=>({ qty:Number(l.qty||0), price:Number(l.price||0) }))); });
  let cogs = 0;
  for(const it of items){
    const key = String(it.code);
    const lots = map.get(key) || [];
    let need = Number(it.qty)||0;
    for(let i=0; i<lots.length && need>0; i++){
      const take = Math.min(Number(lots[i].qty||0), need);
      if(take>0){ cogs += take * Number(lots[i].price||0); lots[i].qty = Number(lots[i].qty||0) - take; need -= take; }
    }
    map.set(key, lots.filter(l=> Number(l.qty||0)>0));
  }
  return cogs;
}

// Helpers for editing invoices
function restoreLotsFront(p, parts){
  ensureProductLots(p);
  if(!Array.isArray(parts)) return;
  for(let i=parts.length-1;i>=0;i--){
    const part = parts[i];
    if(!part || !part.qty) continue;
    // add to front preserving original oldest-first order
    p.lots.unshift({ qty: Number(part.qty||0), price: Number(part.price||0) });
  }
  // merge consecutive same-price from front
  const merged=[];
  for(const l of p.lots){
    const last = merged[merged.length-1];
    if(last && Number(last.price)===Number(l.price)) last.qty = Number(last.qty||0) + Number(l.qty||0);
    else merged.push({ qty:Number(l.qty||0), price:Number(l.price||0) });
  }
  p.lots = merged;
  p.stock = lotsTotalQty(p);
}
function removeLotsByPriceFromEnd(p, qty, price){
  ensureProductLots(p);
  let need = Number(qty)||0; const pr = Number(price)||0;
  for(let i=p.lots.length-1; i>=0 && need>0; i--){
    if(Number(p.lots[i].price)!==pr) continue;
    const take = Math.min(Number(p.lots[i].qty||0), need);
    p.lots[i].qty = Number(p.lots[i].qty||0) - take; need -= take;
    if(Number(p.lots[i].qty||0) <= 0) p.lots.splice(i,1);
  }
  p.stock = lotsTotalQty(p);
  return need; // remaining not removed (if sales consumed it already)
}

function openActionsModal(id){
  const list = loadProducts();
  const idx = list.findIndex(p=> String(p.barcode||p.name)===String(id));
  if(idx<0) return;
  const p = list[idx];
  const backdrop = document.createElement('div');
  backdrop.className='modal-backdrop';
  backdrop.innerHTML = `
    <div class="modal">
      <div class="title">الإجراءات: ${escapeHtml(p.name)}</div>
      <div class="grid cols-3" style="align-items:stretch">
        <button class="button" id="edit">تعديل</button>
        <button class="button ghost" id="delete">حذف</button>
        <button class="button" id="lots">طبقات المخزون</button>
        <button class="button" id="movement">حركة المنتج</button>
        <button class="button ghost" id="opening_bal">الرصيد الافتتاحي</button>
      </div>
      <div class="actions">
        <button class="button ghost" id="close">إغلاق</button>
      </div>
    </div>`;
  document.body.appendChild(backdrop);
  const close=()=>backdrop.remove();
  backdrop.addEventListener('click', e=>{if(e.target===backdrop) close();});
  $('#close', backdrop).addEventListener('click', close);
  $('#delete', backdrop).addEventListener('click', ()=>{
    if(confirm('تأكيد الحذف؟')){
      list.splice(idx,1); saveProducts(list); renderTopStats(); renderProductsTable($('#search')?.value||''); close();
    }
  });
  $('#edit', backdrop).addEventListener('click', ()=>{
    close(); openEditModal(p, idx);
  });
  $('#lots', backdrop).addEventListener('click', ()=>{ close(); openLotsModal(p.barcode||p.name); });
  $('#movement', backdrop).addEventListener('click', ()=>{ close(); openMovementModal(p.barcode||p.name); });
  $('#opening_bal', backdrop).addEventListener('click', ()=>{ close(); openOpeningModal(p.barcode||p.name); });
}

function openMovementModal(id){
  const list = loadProducts();
  const p = list.find(pr=> String(pr.barcode||pr.name)===String(id));
  if(!p) return;
  const sales = loadSales();
  const purch = loadPurchases();
  // Gather movements from invoices
  const code = String(p.barcode||p.name);
  const events = [];
  purch.forEach(inv=>{
    (inv.items||[]).forEach(it=>{
      if(String(it.code)===code){
        events.push({ date: inv.date||'', type:'purchase', ref: inv.no, qty: Number(it.qty||0), price: Number(it.price||0), amount: Number(it.qty||0)*Number(it.price||0) });
      }
    });
  });
  sales.forEach(inv=>{
    (inv.items||[]).forEach(it=>{
      if(String(it.code)===code){
        events.push({ date: inv.date||'', type:'sale', ref: inv.no, qty: -Number(it.qty||0), price: Number(it.price||0), amount: Number(it.qty||0)*Number(it.price||0) });
      }
    });
  });
  // Compute inferred opening balance: Ending - Purchases + Sales
  const endStock = Number(p.stock||0);
  const totalPurch = events.filter(e=> e.type==='purchase').reduce((s,e)=> s + e.qty, 0);
  const totalSales = events.filter(e=> e.type==='sale').reduce((s,e)=> s + Math.abs(e.qty), 0);
  const opening = endStock - totalPurch + totalSales;
  function sortEvents(list){
    return list.sort((a,b)=>{
      const d = String(a.date||'').localeCompare(String(b.date||''));
      if(d!==0) return d;
      if(a.type===b.type) return 0;
      return a.type==='purchase' ? -1 : 1;
    });
  }
  function buildRows(filtered){
    const df = $('#mv_from')?.value||''; const dt = $('#mv_to')?.value||'';
    const incPurch = $('#mv_pur')?.checked!==false; const incSale = $('#mv_sale')?.checked!==false;
    // Apply filters
    let list = events.filter(e=>{
      let ok=true;
      if(df) ok = ok && (String(e.date||'') >= df);
      if(dt) ok = ok && (String(e.date||'') <= dt);
      if(!incPurch && e.type==='purchase') ok=false;
      if(!incSale && e.type==='sale') ok=false;
      return ok;
    });
    list = sortEvents(list);
    // Opening balance for filtered range: endStock - (purchases on/after df) + (sales on/after df)
    let openingAdj = 0;
    if(df){
      const after = events.filter(e=> String(e.date||'') >= df);
      const afterPurch = after.filter(e=> e.type==='purchase').reduce((s,e)=> s + e.qty, 0);
      const afterSales = after.filter(e=> e.type==='sale').reduce((s,e)=> s + Math.abs(e.qty), 0);
      openingAdj = endStock - afterPurch + afterSales;
    } else openingAdj = opening;
    // override by manual opening balance if provided
    const manual = Number($('#mv_open')?.value||'');
    if(!Number.isNaN(manual) && $('#mv_open') && $('#mv_open').value!=='') openingAdj = manual;
    let balance = openingAdj;
    const rows = [
      `<tr><td>—</td><td>رصيد افتتاحي</td><td>—</td><td>${formatNumber(openingAdj,0)}</td><td>—</td><td>—</td><td>${formatNumber(balance,0)}</td></tr>`
    ];
    list.forEach(ev=>{
      balance += ev.qty;
      const qtyStr = (ev.qty>=0? '+' : '−') + formatNumber(Math.abs(ev.qty),0);
      const typeStr = ev.type==='purchase' ? 'شراء' : 'بيع';
      rows.push(`<tr>
        <td>${escapeHtml(ev.date||'')}</td>
        <td>${typeStr}</td>
        <td>${escapeHtml(ev.ref||'')}</td>
        <td>${qtyStr}</td>
        <td>${formatNumber(ev.price,2)}</td>
        <td>${formatNumber(ev.amount,2)}</td>
        <td>${formatNumber(balance,0)}</td>
      </tr>`);
    });
    return rows.join('');
  }
  const backdrop = document.createElement('div'); backdrop.className='modal-backdrop';
  backdrop.innerHTML = `
    <div class="modal" style="max-width:1000px">
      <div class="title">حركة المنتج: ${escapeHtml(p.name)} ${p.barcode? '('+escapeHtml(p.barcode)+')' : ''}</div>
      <div class="toolbar tight" style="margin-bottom:8px;justify-content:space-between">
        <div class="searchbar" style="gap:6px">
          <input type="date" class="input" id="mv_from" />
          <input type="date" class="input" id="mv_to" />
          <label style="display:inline-flex;align-items:center;gap:6px"><input type="checkbox" id="mv_pur" checked /> شراء</label>
          <label style="display:inline-flex;align-items:center;gap:6px"><input type="checkbox" id="mv_sale" checked /> بيع</label>
          <input type="number" class="input" id="mv_open" placeholder="الرصيد الافتتاحي (اختياري)" style="max-width:200px" />
          <button class="button ghost" id="mv_apply">تصفية</button>
        </div>
        <div>
          <button class="button" id="mv_export">تصدير Excel</button>
        </div>
      </div>
      <div style="max-height:60vh;overflow:auto">
        <table class="table">
          <thead><tr><th>التاريخ</th><th>النوع</th><th>المرجع</th><th>الكمية</th><th>السعر</th><th>القيمة</th><th>الرصيد</th></tr></thead>
          <tbody id="mv_rows"></tbody>
        </table>
      </div>
      <div class="invoice-summary"><div><strong>الرصيد الحالي:</strong> ${formatNumber(endStock,0)}</div></div>
      <div class="actions"><button class="button ghost" id="close">إغلاق</button></div>
    </div>`;
  document.body.appendChild(backdrop);
  const close=()=>backdrop.remove();
  backdrop.addEventListener('click', e=>{ if(e.target===backdrop) close(); });
  $('#close', backdrop).addEventListener('click', close);
  // initial render
  const render = ()=>{ $('#mv_rows', backdrop).innerHTML = buildRows(); };
  render();
  $('#mv_apply', backdrop).addEventListener('click', render);
  $('#mv_export', backdrop).addEventListener('click', ()=>{
    try{
      if(typeof XLSX==='undefined'){ alert('مكتبة Excel غير متوفرة'); return; }
      // Build array of arrays for export from current filtered view
      const df = $('#mv_from', backdrop).value; const dt = $('#mv_to', backdrop).value;
      const incPurch = $('#mv_pur', backdrop).checked!==false; const incSale = $('#mv_sale', backdrop).checked!==false;
      let list = events.filter(e=>{
        let ok=true;
        if(df) ok = ok && (String(e.date||'') >= df);
        if(dt) ok = ok && (String(e.date||'') <= dt);
        if(!incPurch && e.type==='purchase') ok=false;
        if(!incSale && e.type==='sale') ok=false;
        return ok;
      });
      list = sortEvents(list);
      const header = ['التاريخ','النوع','المرجع','الكمية','السعر','القيمة'];
      const rows = list.map(ev=>[
        ev.date||'', ev.type==='purchase'?'شراء':'بيع', ev.ref||'', ev.qty, ev.price, ev.amount
      ]);
      const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Movements');
      XLSX.writeFile(wb, `movements_${(p.barcode||p.name)}.xlsx`);
    }catch(e){ alert('تعذر التصدير: '+(e.message||e)); }
  });
}

// Opening balance editor
function openOpeningModal(id){
  const list = loadProducts();
  const idx = list.findIndex(pr=> String(pr.barcode||pr.name)===String(id));
  if(idx<0) return;
  const p = list[idx];
  // helper: ensure openingQty field exists representing ORIGINAL opening quantity
  function openingLotsRemaining(prod){
    ensureProductLots(prod);
    return (prod.lots||[]).filter(l=> l.sourceNo==null).reduce((s,l)=> s + Number(l.qty||0),0);
  }
  if(p.openingQty==null){
    // infer from current remaining null lots (cannot know consumed history otherwise)
    p.openingQty = openingLotsRemaining(p);
    saveProducts(list);
  }
  const remaining = openingLotsRemaining(p);
  const consumed = p.openingQty - remaining;
  const backdrop = document.createElement('div');
  backdrop.className='modal-backdrop';
  backdrop.innerHTML = `
    <div class="modal" style="max-width:520px">
      <div class="title">الرصيد الافتتاحي: ${escapeHtml(p.name||'')}</div>
      <div class="grid cols-2">
        <div><label>الرصيد الافتتاحي الأصلي</label><input class="input" id="orig_opening" value="${Number(p.openingQty||0)}" disabled /></div>
        <div><label>المتبقي من الافتتاحي الآن</label><input class="input" id="rem_opening" value="${Number(remaining)}" disabled /></div>
        <div><label>المستهلك من الافتتاحي</label><input class="input" id="cons_opening" value="${Number(consumed)}" disabled /></div>
        <div><label>الرصيد الافتتاحي الجديد</label><input type="number" class="input" id="new_opening" value="${Number(p.openingQty||0)}" /></div>
      </div>
      <div style="margin-top:10px;font-size:12px;line-height:1.6;color:#555">
        ملاحظات:<br/>
        - لا يمكنك خفض الرصيد الافتتاحي الجديد إلى أقل من الكمية التي تم استهلاكها فعلياً (${Number(consumed)}).<br/>
        - الزيادة تضيف كمية افتتاحية إضافية لا تُنسب إلى فاتورة مشتريات.<br/>
        - النقص (المسموح) يزيل من الكمية الافتتاحية المتبقية فقط.
      </div>
      <div class="actions">
        <button class="button" id="save_opening">حفظ</button>
        <button class="button ghost" id="cancel_opening">إغلاق</button>
      </div>
    </div>`;
  document.body.appendChild(backdrop);
  const close=()=>backdrop.remove();
  backdrop.addEventListener('click', e=>{ if(e.target===backdrop) close(); });
  $('#cancel_opening', backdrop).addEventListener('click', close);
  $('#save_opening', backdrop).addEventListener('click', ()=>{
    const newVal = Number($('#new_opening', backdrop).value||0);
    if(newVal < consumed){ alert('لا يمكن أن يكون أقل من الكمية المستهلكة: '+consumed); return; }
    const diff = newVal - p.openingQty;
    if(diff===0){ close(); return; }
    // adjust lots with sourceNo null accordingly
    ensureProductLots(p);
    // gather opening lots indices
    let openingLots = (p.lots||[]).filter(l=> l.sourceNo==null);
    if(diff > 0){
      // add additional quantity as a new oldest layer (front)
      p.lots.unshift({ qty: diff, price: Number(p.buyPrice||0) });
    } else if(diff < 0){
      // need to remove -diff from remaining opening lots FIFO (oldest first)
      let need = -diff; // positive amount to remove
      for(let i=0; i<p.lots.length && need>0; i++){
        const l = p.lots[i];
        if(l.sourceNo!=null) continue;
        const take = Math.min(Number(l.qty||0), need);
        l.qty = Number(l.qty||0) - take; need -= take;
        if(Number(l.qty||0) <= 0){ p.lots.splice(i,1); i--; }
      }
    }
    // clean empty lots & recompute stock
    p.lots = (p.lots||[]).filter(l=> Number(l.qty||0) > 0);
    p.stock = lotsTotalQty(p);
    p.openingQty = newVal;
    saveProducts(list);
    renderTopStats();
    renderProductsTable($('#search')?.value||'');
    close();
  });
}

function openLotsModal(id){
  const list = loadProducts();
  const p = list.find(pr=> String(pr.barcode||pr.name)===String(id));
  if(!p) return;
  migrateLotsIfNeeded(p);
  saveProducts(list);
  const lots = (p.lots||[]).map((l,i)=>({
    idx:i+1,
    qty:Number(l.qty||0),
    price:Number(l.price||0),
    sourceNo: l.sourceNo||'-',
    createdAt: l.createdAt? new Date(l.createdAt).toLocaleString('en-GB') : '-'
  }));
  const backdrop = document.createElement('div'); backdrop.className='modal-backdrop';
  backdrop.innerHTML = `
    <div class="modal" style="max-width:700px">
      <div class="title">طبقات المخزون: ${escapeHtml(p.name)}</div>
      <div style="max-height:55vh;overflow:auto">
        <table class="table">
          <thead><tr><th>#</th><th>الكمية</th><th>السعر</th><th>رقم الفاتورة</th><th>تاريخ الإضافة</th></tr></thead>
          <tbody>
            ${lots.length? lots.map(r=>`<tr><td>${r.idx}</td><td>${formatNumber(r.qty,0)}</td><td>${formatNumber(r.price,2)}</td><td>${escapeHtml(r.sourceNo)}</td><td>${escapeHtml(r.createdAt)}</td></tr>`).join('') : '<tr><td colspan="5">لا طبقات حالياً.</td></tr>'}
          </tbody>
        </table>
      </div>
      <div class="actions"><button class="button ghost" id="close">إغلاق</button></div>
    </div>`;
  document.body.appendChild(backdrop);
  const close=()=>backdrop.remove();
  backdrop.addEventListener('click', e=>{ if(e.target===backdrop) close(); });
  $('#close', backdrop).addEventListener('click', close);
}

function openEditModal(p, idx){
  const backdrop = document.createElement('div');
  backdrop.className='modal-backdrop';
  backdrop.innerHTML = `
    <div class="modal">
      <div class="title">تعديل المنتج</div>
      <div class="grid cols-3">
        <div><label>الباركود</label><input class="input" id="e_barcode" value="${escapeAttr(p.barcode||'')}"/></div>
        <div><label>اسم الصنف</label><input class="input" id="e_name" value="${escapeAttr(p.name||'')}"/></div>
        <div><label>التصنيف</label><input class="input" id="e_category" value="${escapeAttr(p.category||'')}"/></div>
        <div><label>المخزون</label><input type="number" class="input" id="e_stock" value="${Number(p.stock||0)}"/></div>
        <div><label>سعر الشراء</label><input type="number" class="input" id="e_buy" value="${Number(p.buyPrice||0)}"/></div>
        <div><label>سعر البيع النقدي</label><input type="number" class="input" id="e_cash" value="${Number(p.cashPrice||0)}"/></div>
        <div><label>سعر البيع البنكي</label><input type="number" class="input" id="e_bank" value="${Number(p.bankPrice||0)}"/></div>
      </div>
      <div class="actions">
        <button class="button" id="save">حفظ</button>
        <button class="button ghost" id="cancel">إلغاء</button>
      </div>
    </div>`;
  document.body.appendChild(backdrop);
  const close=()=>backdrop.remove();
  backdrop.addEventListener('click', e=>{if(e.target===backdrop) close();});
  $('#cancel', backdrop).addEventListener('click', close);
  $('#save', backdrop).addEventListener('click', ()=>{
    const list = loadProducts();
    list[idx] = {
      barcode: $('#e_barcode', backdrop).value.trim(),
      name: $('#e_name', backdrop).value.trim(),
      category: $('#e_category', backdrop).value.trim(),
      stock: Number($('#e_stock', backdrop).value||0),
      buyPrice: Number($('#e_buy', backdrop).value||0),
      cashPrice: Number($('#e_cash', backdrop).value||0),
      bankPrice: Number($('#e_bank', backdrop).value||0),
    };
    saveProducts(list); renderTopStats(); renderProductsTable($('#search')?.value||''); close();
  });
}

function applySectionTheme(key){
  const b = document.body;
  const themes = ['products','sales','purchases','invoices','expenses','cashboxes','accounts','stats','settings','debts','partners','calculator'];
  themes.forEach(t=> b.classList.remove('theme-'+t));
  const base = (key||'').split('/')[0];
  if(themes.includes(base)) b.classList.add('theme-'+base);
}

function renderPage(key){
  // حفظ آخر تبويب قبل الانتقال (باستثناء نفس التبويب)
  if(window.__currentTab && window.__currentTab!==key){
    window.__lastTab = window.__currentTab;
    if(key==='purchases') window.__lastTabBeforePurchase = window.__currentTab;
    if(key==='sales') window.__lastTabBeforeSales = window.__currentTab;
  }
  window.__currentTab = key;
  applySectionTheme(key);
  renderSidebar(key);
  if(key==='products') renderTopStats(); else $('#top-stats').innerHTML='';
  const content = $('#content');
  const titles = Object.fromEntries(MENU_ITEMS.map(m=>[m.key, m.label]));
  const breadcrumb = `<div class="breadcrumb">${titles[key] || ''}</div>`;
  if(key==='products'){
    content.innerHTML = breadcrumb + `
      <div class="panel">
        <div class="grid cols-4" style="margin-bottom:12px">
          <button class="button" id="btn-add-product">➕ إضافة منتج</button>
          <button class="button ghost" id="btn-import">⬇️ استيراد إكسل</button>
          <button class="button ghost" id="btn-export">⬆️ تصدير إكسل</button>
          <div style="display:flex;gap:6px">
            <button class="button ghost" id="btn-template">📄 تحميل القالب</button>
            <button class="button ghost" id="quick_calc_products" title="حاسبة سريعة">🧮</button>
          </div>
        </div>
        <div style="margin:4px 0 8px;font-size:13px;color:#555">عدد المنتجات: <span id="prod_count">0</span></div>
        <div id="products-list">لا توجد بيانات بعد.</div>
      </div>
    `;
    $('#btn-add-product').addEventListener('click', ()=>{
      location.hash = 'products/add';
    });
    $('#btn-template').addEventListener('click', ()=>{
      downloadTemplate();
    });
    $('#btn-export').addEventListener('click', ()=>{
      exportToExcel();
    });
    $('#btn-import').addEventListener('click', ()=>{
      importFromExcel();
    });
    renderProductsTable();
    // quick calc modal (same pattern as sales/purchases simple one)
    const openQuickCalcProducts = () => {
      if(document.getElementById('qc_backdrop_products')) return;
      const wrap = document.createElement('div');
      wrap.className = 'modal-backdrop';
      wrap.id = 'qc_backdrop_products';
      wrap.innerHTML = `
        <div class="modal" style="min-width:340px">
          <div class="title">حاسبة سريعة</div>
          <input class="input" id="qc_expr_products" placeholder="اكتب عملية مثل: 50*3-12" />
          <div style="margin-top:10px;font-weight:700;font-size:18px">= <span id="qc_res_products">0</span></div>
          <div class="actions">
            <button class="button ghost" id="qc_close_products">إغلاق (Esc)</button>
          </div>
        </div>`;
      document.body.appendChild(wrap);
      const exprInp = document.getElementById('qc_expr_products');
      const resSpan = document.getElementById('qc_res_products');
      function safeEvalQuick(e){ if(!e) return 0; e=e.replace(/,/g,''); e=e.replace(/(\d+(?:\.\d+)?)%/g,'($1/100)'); if(!/^[-+*/().%0-9\s]*$/.test(e)) return NaN; try{ return Function('return ('+e+')')(); }catch{ return NaN; } }
      function recompute(){ const v=safeEvalQuick(exprInp.value.trim()); resSpan.textContent = (!Number.isNaN(v)&&Number.isFinite(v))? String(v):'خطأ'; }
      exprInp.addEventListener('input', recompute);
      exprInp.addEventListener('keydown', ev=>{ if(ev.key==='Enter'){ recompute(); } else if(ev.key==='Escape'){ close(); } });
      function close(){ document.removeEventListener('keydown', esc); wrap.remove(); }
      function esc(ev){ if(ev.key==='Escape') close(); }
      document.getElementById('qc_close_products').addEventListener('click', close);
      wrap.addEventListener('click', e=>{ if(e.target===wrap) close(); });
      document.addEventListener('keydown', esc);
      setTimeout(()=> exprInp.focus(),0);
    };
    const quickBtnProducts = document.getElementById('quick_calc_products');
    if(quickBtnProducts){ quickBtnProducts.addEventListener('click', openQuickCalcProducts); }
  } else if(key==='products/add'){
    content.innerHTML = breadcrumb + `
      <div class="section-title-bar">إدارة الفواتير <small>مبيعات ومشتريات</small></div>
      <div class="panel">
        <div style="display:flex;justify-content:flex-end;margin-bottom:8px">
          <button class="button ghost" id="quick_calc_add_product" title="حاسبة سريعة">🧮</button>
        </div>
        <div class="grid cols-3">
          <div>
            <label>الباركود</label>
            <input class="input" id="barcode" placeholder="مثال: 6291041500213" />
          </div>
          <div>
            <label>اسم الصنف</label>
            <input class="input" id="name" placeholder="مثال: حليب طازج" />
          </div>
          <div>
            <label>التصنيف</label>
            <input class="input" id="category" placeholder="مثال: ألبان" />
          </div>
          <div>
            <label>المخزون</label>
            <input type="number" class="input" id="stock" placeholder="0" />
          </div>
          <div>
            <label>سعر الشراء</label>
            <input type="number" class="input" id="buyPrice" placeholder="0" />
          </div>
          <div>
            <label>سعر البيع النقدي</label>
            <input type="number" class="input" id="cashPrice" placeholder="0" />
          </div>
          <div>
            <label>سعر البيع البنكي</label>
            <input type="number" class="input" id="bankPrice" placeholder="0" />
          </div>
          <div>
            <label>ربح البيع النقدي</label>
            <input class="input" id="cashProfit" readonly />
          </div>
          <div>
            <label>ربح البيع البنكي</label>
            <input class="input" id="bankProfit" readonly />
          </div>
        </div>
        <div style="margin-top:12px;display:flex;gap:8px">
          <button class="button" id="save">حفظ</button>
          <button class="button ghost" id="back">العودة</button>
        </div>
      </div>
    `;
    const buy = $('#buyPrice');
    const cash = $('#cashPrice');
    const bank = $('#bankPrice');
    function recalc(){
      const b = parseFloat(buy.value)||0;
      const c = parseFloat(cash.value)||0;
      const k = parseFloat(bank.value)||0;
      $('#cashProfit').value = (c-b).toFixed(2);
      $('#bankProfit').value = (k-b).toFixed(2);
    }
    ;[buy,cash,bank].forEach(el=>el.addEventListener('input', recalc));
    // Quick calculator for add product form
    const openQuickCalcAddProd = () => {
      if(document.getElementById('qc_backdrop_addprod')) return;
      const wrap = document.createElement('div'); wrap.className='modal-backdrop'; wrap.id='qc_backdrop_addprod';
      wrap.innerHTML = `
        <div class="modal" style="min-width:340px">
          <div class="title">حاسبة سريعة</div>
          <input class="input" id="qc_expr_addprod" placeholder="مثال: (سعر الشراء + 5%)" />
          <div style="margin-top:10px;font-weight:700;font-size:18px">= <span id="qc_res_addprod">0</span></div>
          <div class="actions"><button class="button ghost" id="qc_close_addprod">إغلاق (Esc)</button></div>
        </div>`;
      document.body.appendChild(wrap);
      const exprInp = document.getElementById('qc_expr_addprod');
      const resSpan = document.getElementById('qc_res_addprod');
      function safeEvalQuick(e){ if(!e) return 0; e=e.replace(/,/g,''); e=e.replace(/(\d+(?:\.\d+)?)%/g,'($1/100)'); if(!/^[-+*/().%0-9\s]*$/.test(e)) return NaN; try{ return Function('return ('+e+')')(); }catch{ return NaN; } }
      function recompute(){ const v=safeEvalQuick(exprInp.value.trim()); resSpan.textContent = (!Number.isNaN(v)&&Number.isFinite(v))? String(v):'خطأ'; }
      exprInp.addEventListener('input', recompute);
      exprInp.addEventListener('keydown', ev=>{ if(ev.key==='Enter'){ recompute(); } else if(ev.key==='Escape'){ close(); } });
      function close(){ document.removeEventListener('keydown', esc); wrap.remove(); }
      function esc(ev){ if(ev.key==='Escape') close(); }
      document.getElementById('qc_close_addprod').addEventListener('click', close);
      wrap.addEventListener('click', e=>{ if(e.target===wrap) close(); });
      document.addEventListener('keydown', esc);
      setTimeout(()=> exprInp.focus(),0);
    };
    const quickBtnAddProd = document.getElementById('quick_calc_add_product');
    if(quickBtnAddProd){ quickBtnAddProd.addEventListener('click', openQuickCalcAddProd); }
    $('#back').addEventListener('click', ()=>{ location.hash = 'products'; });
    $('#save').addEventListener('click', ()=>{
      const p = {
        barcode: $('#barcode').value.trim(),
        name: $('#name').value.trim(),
        category: $('#category').value.trim(),
        stock: Number($('#stock').value||0),
        buyPrice: Number($('#buyPrice').value||0),
        cashPrice: Number($('#cashPrice').value||0),
        bankPrice: Number($('#bankPrice').value||0),
      };
      if(!p.name){ alert('يرجى إدخال اسم الصنف'); return; }
      addProduct(p);
      alert('تم حفظ المنتج');
      location.hash = 'products';
    });
  } else if(key==='sales'){
    const products = loadProducts();
    const cashboxes = loadCashboxes();
    const settings = loadSettings();
    const ob = (settings && settings.openingBalances) ? settings.openingBalances : { sales:0 };
    const today = new Date();
    const iso = today.toISOString().slice(0,10);
    const invoice = { items:[], payment:'bank', status:'unpaid', customer:'', date: iso, cashbox:'' };
    content.innerHTML = breadcrumb + `
      <div class="panel">
  <div class="grid invoice-head" style="margin-bottom:12px;grid-template-columns:160px 220px repeat(3,1fr);gap:12px">
          <div style="min-width:140px">
            <label>اسم العميل</label>
            <input class="input" id="s_customer" placeholder="زائر" style="max-width:150px" />
          </div>
          <div style="min-width:210px">
            <label>التاريخ</label>
            <input class="input" id="s_date" type="date" value="${iso}" style="padding-inline:10px;width:100%" />
          </div>
          <div>
            <label>السعر</label>
            <select id="s_price" class="input">
              <option value="bank" selected>بنكي (افتراضي)</option>
              <option value="cash">نقدي</option>
            </select>
          </div>
          <div>
            <label>حالة الدفع</label>
            <select id="s_status" class="input">
              <option value="unpaid" selected>لم يتم الدفع (افتراضي)</option>
              <option value="paid">تم الدفع</option>
            </select>
          </div>
          <div>
            <label>اسم الصندوق</label>
            <select class="input" id="s_cashbox">
              <option value="">اختر الصندوق</option>
              ${cashboxes.map(b=>`<option value="${b.id}">${escapeHtml(b.name)} — ${formatCurrency(b.balance)}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="split-cols">
          <div class="pane-products" style="flex:0 0 35%">
            <div class="toolbar" style="margin-bottom:8px">
              <span class="badge">المنتجات (${products.length})</span>
            </div>
            <div class="searchbar"><input class="input" id="s_prod_search" placeholder="بحث عن صنف لإضافته"/></div>
            <div style="max-height:50vh;overflow:auto">
              <div id="s_prod_list"></div>
            </div>
          </div>
          <div class="pane-invoice" style="flex:1 0 65%">
            <div class="invoice-titlebar" id="s_inv_title">${editingSaleInvoiceNo ? `تحديث فاتورة مبيعات ${escapeHtml(editingSaleInvoiceNo)}` : 'فاتورة مبيعات جديدة'}</div>
            <div class="toolbar" style="margin-bottom:8px;justify-content:space-between">
              <span class="badge">الفاتورة</span>
              <div style="display:flex;gap:6px">
                <button class="button ghost" id="quick_calc_sales" title="حاسبة سريعة">🧮</button>
                <button class="button ghost" id="s_cancel_edit" style="display:${editingSaleInvoiceNo?'inline-flex':'none'}">إغلاق</button>
                <button class="button" id="finalize">إتمام الفاتورة</button>
              </div>
            </div>
            <div id="invoice-box"></div>
            <div style="margin-top:8px;display:${editingSaleInvoiceNo?'block':'none'}" id="s_edit_hint" class="mini">أنت في وضع تعديل. زر إغلاق لإلغاء التعديل دون حفظ.</div>
          </div>
        </div>
      </div>
    `;

    function renderProdList(filter=''){
      const q = filter.trim().toLowerCase();
      const list = q? products.filter(p=>
        String(p.name||'').toLowerCase().includes(q) ||
        String(p.barcode||'').toLowerCase().includes(q) ||
        String(p.category||'').toLowerCase().includes(q)
      ): products;
      $('#s_prod_list').innerHTML = list.length? list.map(p=>`
                <div class="panel" style="margin-bottom:8px">
                  <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
                    <div>
                      <div><strong>${escapeHtml(p.name)}</strong></div>
                      <div class="mini">${escapeHtml(p.category||'')} • سعر الشراء: ${formatCurrency(Number(p.buyPrice||0))}</div>
                    </div>
                    <div style="display:flex;gap:8px;align-items:center">
                      <div class="mini">المخزون: ${Number(p.stock||0)}</div>
                      <button class="button ghost btn-add" data-id="${escapeAttr(p.barcode||p.name)}">إضافة</button>
                    </div>
                  </div>
                </div>
              `).join('') : 'لا توجد منتجات';
      $$('.btn-add', $('#s_prod_list')).forEach(b=> b.addEventListener('click', ()=> addToInvoice(b.dataset.id)));
    }

    function priceOf(p){
      return ($('#s_price').value==='cash') ? Number(p.cashPrice||0) : Number(p.bankPrice||0);
    }
    function buyOf(p){ return Number(p.buyPrice||0); }
    function addToInvoice(code){
      const p = products.find(x=> String(x.barcode||x.name)===String(code));
      if(!p) return;
      const existing = invoice.items.find(it=> it.code===code);
      if(existing){ existing.qty += 1; existing.total = existing.qty * existing.price; }
      else {
        const price = priceOf(p);
        invoice.items.push({ code, name:p.name, qty:1, price, total: price*1, buy: buyOf(p) });
      }
      renderInvoice();
    }
    function renderInvoice(){
      const box = $('#invoice-box');
      if(!invoice.items.length){ box.innerHTML = 'لا توجد عناصر بعد.'; return; }
      const rows = invoice.items.map((it,idx)=>`
        <tr>
          <td>${idx+1}</td>
          <td>${escapeHtml(it.name)}</td>
          <td>
            <div class="qty-ctrl">
              <button data-idx="${idx}" data-act="dec">−</button>
              <input type="number" step="1" min="1" value="${it.qty}" data-idx="${idx}" data-field="qty" style="max-width:100px" />
              <button data-idx="${idx}" data-act="inc">+</button>
            </div>
          </td>
          <td>
            <input type="number" step="0.01" value="${it.price}" data-idx="${idx}" data-field="price" class="input" style="max-width:300px;font-size:16px" />
          </td>
          <td>${formatNumber(it.total,2)}</td>
          <td><button class="button ghost" data-idx="${idx}" data-act="remove">حذف</button></td>
        </tr>
      `).join('');
      const totals = invoice.items.reduce((a,it)=>{ a.sub += it.total; return a; }, {sub:0});
      // Estimate COGS via FIFO simulation without mutating
      const estCogs = fifoPeekCOGSMap(products, invoice.items);
      const profit = totals.sub - estCogs;
      box.innerHTML = `
        <div style="overflow:auto">
          <table class="table">
            <thead>
              <tr><th>#</th><th>الصنف</th><th>الكمية</th><th>السعر</th><th>الإجمالي</th><th>الإجراء</th></tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
        <div class="invoice-summary">
          <div><strong>المجموع:</strong> ${formatCurrency(totals.sub)}</div>
          <div><strong>ربح الفاتورة:</strong> ${formatCurrency(profit)}</div>
        </div>
      `;
      // events
      $$('#invoice-box [data-act="inc"]').forEach(b=> b.addEventListener('click', ()=>{ const i=b.dataset.idx; invoice.items[i].qty++; invoice.items[i].total = invoice.items[i].qty*invoice.items[i].price; renderInvoice(); }));
      $$('#invoice-box [data-act="dec"]').forEach(b=> b.addEventListener('click', ()=>{ const i=b.dataset.idx; invoice.items[i].qty=Math.max(1,invoice.items[i].qty-1); invoice.items[i].total = invoice.items[i].qty*invoice.items[i].price; renderInvoice(); }));
      $$('#invoice-box [data-act="remove"]').forEach(b=> b.addEventListener('click', ()=>{ const i=b.dataset.idx; invoice.items.splice(i,1); renderInvoice(); }));
      $$('#invoice-box [data-field]').forEach(inp=> inp.addEventListener('change', ()=>{
        const i=inp.dataset.idx; const f=inp.dataset.field; const v=Number(inp.value||0);
        if(f==='qty') invoice.items[i].qty = Math.max(1, Math.floor(v));
        if(f==='price') invoice.items[i].price = Math.max(0, v);
        invoice.items[i].total = invoice.items[i].qty * invoice.items[i].price;
        renderInvoice();
      }));
      $$('#invoice-box [data-field]').forEach(inp=> inp.addEventListener('blur', ()=>{
        const i=inp.dataset.idx; const f=inp.dataset.field; const v=Number(inp.value||0);
        if(f==='qty') invoice.items[i].qty = Math.max(1, Math.floor(v));
        if(f==='price') invoice.items[i].price = Math.max(0, v);
        invoice.items[i].total = invoice.items[i].qty * invoice.items[i].price;
        renderInvoice();
      }));
    }
          function prepareSaleEditorFromExisting(){
            if(!editingSaleInvoiceNo) return;
            const inv = loadSales().find(v=> String(v.no)===String(editingSaleInvoiceNo));
            if(!inv){ editingSaleInvoiceNo=null; editingSaleOriginal=null; editingSaleConsumedMap=null; return; }
            // استرجاع الطبقات المستهلكة إلى المخزون قبل إعادة التحرير
            const productsLocal = loadProducts();
            if(editingSaleOriginal && editingSaleConsumedMap){
              for(const it of (editingSaleOriginal.items||[])){
                const consumed = editingSaleConsumedMap[it.code]||[];
                if(consumed.length){
                  const p = productsLocal.find(x=> String(x.barcode||x.name)===String(it.code));
                  if(p) restoreLotsFront(p, consumed);
                }
              }
              // حفظ التغييرات في التخزين وتحديث النسخة المحمّلة في شاشة المبيعات
              saveProducts(productsLocal);
              try {
                // مزامنة المصفوفة المستخدمة في شاشة المبيعات حتى تعكس الاسترجاع فوراً
                // دون تغيير المرجع (لتبقى دوال العرض تعمل على نفس الكائن)
                products.length = 0;
                products.push(...productsLocal);
                // تحديث قائمة المنتجات المعروضة لأن الأرصدة تغيّرت بعد الاسترجاع
                if(typeof renderProdList === 'function'){
                  const q = document.getElementById('s_prod_search');
                  renderProdList(q ? q.value : '');
                }
              } catch {}
            }
            // ملء النموذج
            $('#s_customer').value = inv.customer||'';
            $('#s_date').value = inv.date||new Date().toISOString().slice(0,10);
            $('#s_price').value = inv.payment||'cash';
            $('#s_status').value = inv.status||'unpaid';
            $('#s_cashbox').value = inv.cashbox||'';
            invoice.items = (inv.items||[]).map(it=>({ code:it.code, name:it.name, qty:it.qty, price:it.price, total:it.qty*it.price }));
            renderInvoice();
            const btn = $('#finalize');
            if(btn){ btn.textContent='تحديث الفاتورة'; btn.dataset.mode='update'; }
            const titleEl = $('#s_inv_title');
            if(titleEl){ titleEl.textContent = `تحديث فاتورة مبيعات ${inv.no}`; }
          }
          function finalizeSale(){
            if(!invoice.items.length){ alert('لا توجد عناصر في الفاتورة'); return; }
            const boxId = $('#s_cashbox').value;
            if(!boxId){ alert('يرجى اختيار الصندوق'); return; }
            // التحقق من المخزون
            for(const it of invoice.items){
              const p = products.find(x=> String(x.barcode||x.name)===String(it.code));
              const stk = Number(p?.stock||0);
              if(stk < it.qty){ alert(`الكمية المطلوبة غير متاحة للصنف: ${it.name}`); return; }
            }
            // استهلاك المخزون بطريقة FIFO وتحديث الكلفة
            let cogsTotal = 0;
            const consumedMap = {};
            for(const it of invoice.items){
              const p = products.find(x=> String(x.barcode||x.name)===String(it.code));
              if(!p) continue;
              const r = fifoConsumeBreakdown(p, it.qty);
              cogsTotal += r.cogs; consumedMap[it.code] = r.parts;
            }
            saveProducts(products);
            // حفظ / تحديث الفاتورة
            const totals = invoice.items.reduce((a,it)=>{ a.sub += it.total; return a; }, {sub:0});
            if(editingSaleInvoiceNo){
              const all = loadSales();
              const idx = all.findIndex(v=> String(v.no)===String(editingSaleInvoiceNo));
              if(idx>=0){
                all[idx] = {
                  ...all[idx],
                  date: $('#s_date').value,
                  customer: $('#s_customer').value.trim(),
                  payment: $('#s_price').value,
                  status: $('#s_status').value,
                  cashbox: boxId,
                  items: invoice.items.map(it=>({code:it.code,name:it.name,qty:it.qty,price:it.price,total:it.total,consumed: consumedMap[it.code]||[]})),
                  total: totals.sub,
                  profit: totals.sub - cogsTotal
                };
                saveSales(all);
                recomputeBalances();
                renderTopStats();
                alert(`تم تحديث فاتورة المبيعات رقم ${editingSaleInvoiceNo}`);
              }
              // reset edit state
              editingSaleInvoiceNo=null; editingSaleOriginal=null; editingSaleConsumedMap=null;
              const btn = $('#finalize'); if(btn){ btn.textContent='حفظ الفاتورة'; delete btn.dataset.mode; }
              const titleEl = $('#s_inv_title'); if(titleEl){ titleEl.textContent = 'فاتورة مبيعات جديدة'; }
            } else {
              const invObj = {
                no: nextInvoiceNo('S'),
                type:'sale',
                date: $('#s_date').value,
                customer: $('#s_customer').value.trim(),
                payment: $('#s_price').value,
                status: $('#s_status').value,
                cashbox: boxId,
                items: invoice.items.map(it=>({code:it.code,name:it.name,qty:it.qty,price:it.price,total:it.total,consumed: consumedMap[it.code]||[]})),
                total: totals.sub,
                profit: totals.sub - cogsTotal
              };
              const all = loadSales(); all.push(invObj); saveSales(all);
              recomputeBalances();
              renderTopStats();
              alert(`تم حفظ فاتورة المبيعات رقم ${invObj.no}`);
              const titleEl = $('#s_inv_title'); if(titleEl){ titleEl.textContent = 'فاتورة مبيعات جديدة'; }
            }
            invoice.items = []; renderInvoice(); renderProdList(sInp?.value||'');
          }
          $('#finalize').addEventListener('click', finalizeSale);
          const cancelSaleBtn = document.getElementById('s_cancel_edit');
          if(cancelSaleBtn){
            cancelSaleBtn.addEventListener('click', ()=>{
              editingSaleInvoiceNo=null; editingSaleOriginal=null; editingSaleConsumedMap=null;
              location.hash = window.__lastTabBeforeSales || 'products';
            });
          }
          // حاسبة سريعة داخل تبويب المبيعات (بسيطة بدون سجل أو ذاكرة)
          const openQuickCalcSales = () => {
            if(document.getElementById('qc_backdrop_sales')) return; // منع التكرار
            const wrap = document.createElement('div');
            wrap.className = 'modal-backdrop';
            wrap.id = 'qc_backdrop_sales';
            wrap.innerHTML = `
              <div class="modal" style="min-width:340px">
                <div class="title">حاسبة سريعة</div>
                <input class="input" id="qc_expr_sales" placeholder="اكتب عملية مثل: 12+5*3" />
                <div style="margin-top:10px;font-weight:700;font-size:18px">= <span id="qc_res_sales">0</span></div>
                <div class="actions">
                  <button class="button ghost" id="qc_close_sales">إغلاق (Esc)</button>
                </div>
              </div>`;
            document.body.appendChild(wrap);
            const exprInp = document.getElementById('qc_expr_sales');
            const resSpan = document.getElementById('qc_res_sales');
            function safeEvalQuick(e){
              if(!e) return 0; e = e.replace(/,/g,''); e = e.replace(/(\d+(?:\.\d+)?)%/g,'($1/100)');
              if(!/^[-+*/().%0-9\s]*$/.test(e)) return NaN; try{ return Function('return ('+ e + ')')(); }catch{ return NaN; }
            }
            function recompute(){
              const v = safeEvalQuick(exprInp.value.trim());
              if(!Number.isNaN(v) && Number.isFinite(v)) resSpan.textContent = String(v); else resSpan.textContent='خطأ';
            }
            exprInp.addEventListener('input', recompute);
            exprInp.addEventListener('keydown', ev=>{ if(ev.key==='Enter'){ recompute(); } else if(ev.key==='Escape'){ close(); } });
            function close(){ document.removeEventListener('keydown', esc); wrap.remove(); }
            function esc(ev){ if(ev.key==='Escape'){ close(); } }
            document.getElementById('qc_close_sales').addEventListener('click', close);
            wrap.addEventListener('click', e=>{ if(e.target===wrap) close(); });
            document.addEventListener('keydown', esc);
            setTimeout(()=> exprInp.focus(), 0);
          };
          const quickBtnSales = document.getElementById('quick_calc_sales');
          if(quickBtnSales){ quickBtnSales.addEventListener('click', openQuickCalcSales); }
          // إذا كنا في وضع تعديل قائم مسبقاً (قد نكون جئنا من شاشة الفواتير)
          if(editingSaleInvoiceNo){ setTimeout(prepareSaleEditorFromExisting, 0); }
  // attach search
  const sInp = $('#s_prod_search');
  if(sInp){ sInp.addEventListener('input', ()=> renderProdList(sInp.value)); }
  renderProdList('');
    // react to price mode changes
    $('#s_price').addEventListener('change', ()=>{
      // update prices on items according to new mode
      invoice.items = invoice.items.map(it=>{
        const p = products.find(x=> String(x.barcode||x.name)===String(it.code));
        if(!p) return it; const newPrice = priceOf(p); return { ...it, price:newPrice, total:newPrice*it.qty };
      });
      renderInvoice();
      // اضبط الحالة تلقائياً حسب نوع الدفع
      if($('#s_price').value==='cash') $('#s_status').value='paid'; else $('#s_status').value='unpaid';
    });
    // apply default cashbox per price method
    const applyDefaultBox = ()=>{
      const method = $('#s_price').value;
      const defId = method==='cash'? (settings.defaultCashSaleBox||'') : (settings.defaultBankSaleBox||'');
      if(defId) $('#s_cashbox').value = defId;
    };
    applyDefaultBox();
    $('#s_price').addEventListener('change', applyDefaultBox);
  // ضبط الحالة الافتراضية عند التحميل الأول
  if($('#s_price').value==='cash') $('#s_status').value='paid'; else $('#s_status').value='unpaid';
    renderInvoice();
  } else if(key==='purchases'){
    const products = loadProducts();
    const cashboxes = loadCashboxes();
    const ob = (loadSettings().openingBalances)||{ purchases:0 };
    const today = new Date();
    const iso = today.toISOString().slice(0,10);
    const invoice = { items:[], supplier:'', date: iso, cashbox:'' };
    content.innerHTML = breadcrumb + `
      <div class="panel">
        <div class="grid cols-4 invoice-head" style="margin-bottom:12px">
          <div>
            <label>اسم المورد</label>
            <input class="input" id="p_supplier" placeholder="مورد" />
          </div>
          <div>
            <label>التاريخ</label>
            <input class="input" id="p_date" type="date" value="${iso}" />
          </div>
          <div>
            <label>اسم الصندوق</label>
            <select class="input" id="p_cashbox">
              <option value="">اختر الصندوق</option>
              ${cashboxes.map(b=>`<option value="${b.id}">${escapeHtml(b.name)} — ${formatCurrency(b.balance)}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="split-cols">
          <div class="pane-products" style="flex:0 0 35%">
            <div class="toolbar" style="margin-bottom:8px">
              <span class="badge">الأصناف (${products.length})</span>
            </div>
            <div class="searchbar"><input class="input" id="p_prod_search" placeholder="بحث عن صنف لإضافته"/></div>
            <div style="max-height:50vh;overflow:auto">
              <div id="p_prod_list"></div>
            </div>
          </div>
          <div class="pane-invoice" style="flex:1 0 65%">
            <div class="invoice-titlebar" id="p_inv_title">${editingPurchInvoiceNo ? `تحديث فاتورة مشتريات ${escapeHtml(editingPurchInvoiceNo)}` : 'فاتورة مشتريات جديدة'}</div>
            <div class="toolbar" style="margin-bottom:8px;justify-content:space-between">
              <span class="badge">فاتورة الشراء</span>
              <div style="display:flex;gap:6px">
                <button class="button ghost" id="quick_calc_purchases" title="حاسبة سريعة">🧮</button>
                <button class="button ghost" id="p_cancel_edit" style="display:${editingPurchInvoiceNo?'inline-flex':'none'}">إغلاق</button>
                <button class="button" id="p_finalize">${editingPurchInvoiceNo?'تحديث الفاتورة':'إتمام الشراء'}</button>
              </div>
            </div>
            <div id="p_invoice_box"></div>
            <div style="margin-top:8px;display:${editingPurchInvoiceNo?'block':'none'}" id="p_edit_hint" class="mini">أنت في وضع تعديل. زر إغلاق للعودة دون حفظ التعديلات.</div>
          </div>
        </div>
      </div>
    `;

    function addToPurch(code){
      const p = products.find(x=> String(x.barcode||x.name)===String(code));
      if(!p) return;
      const existing = invoice.items.find(it=> it.code===code);
      if(existing){ existing.qty += 1; existing.total = existing.qty * existing.price; }
      else {
        const price = Number(p.buyPrice||0);
        invoice.items.push({ code, name:p.name, qty:1, price, total: price*1 });
      }
      renderPurch();
    }
    function renderPurch(){
      const box = $('#p_invoice_box');
      if(!invoice.items.length){ box.innerHTML = 'لا توجد عناصر بعد.'; return; }
      const rows = invoice.items.map((it,idx)=>`
        <tr>
          <td>${idx+1}</td>
          <td>${escapeHtml(it.name)}</td>
          <td>
            <div class="qty-ctrl">
              <button data-idx="${idx}" data-act="dec">−</button>
              <input type="number" step="1" min="1" value="${it.qty}" data-idx="${idx}" data-field="qty" style="max-width:100px" />
              <button data-idx="${idx}" data-act="inc">+</button>
            </div>
          </td>
          <td>
            <input type="number" step="0.01" value="${it.price}" data-idx="${idx}" data-field="price" class="input" style="max-width:300px;font-size:16px" />
          </td>
          <td>${formatNumber(it.total,2)}</td>
          <td><button class="button ghost" data-idx="${idx}" data-act="remove">حذف</button></td>
        </tr>
      `).join('');
      const totals = invoice.items.reduce((a,it)=>{ a.sub += it.total; return a; }, {sub:0});
      box.innerHTML = `
        <div style="overflow:auto">
          <table class="table">
            <thead>
              <tr><th>#</th><th>الصنف</th><th>الكمية</th><th>سعر الشراء</th><th>الإجمالي</th><th>الإجراء</th></tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
        <div class="invoice-summary">
          <div><strong>إجمالي الشراء:</strong> ${formatCurrency(totals.sub)}</div>
        </div>
      `;
      $$('#p_invoice_box [data-act="inc"]').forEach(b=> b.addEventListener('click', ()=>{ const i=b.dataset.idx; invoice.items[i].qty++; invoice.items[i].total = invoice.items[i].qty*invoice.items[i].price; renderPurch(); }));
      $$('#p_invoice_box [data-act="dec"]').forEach(b=> b.addEventListener('click', ()=>{ const i=b.dataset.idx; invoice.items[i].qty=Math.max(1,invoice.items[i].qty-1); invoice.items[i].total = invoice.items[i].qty*invoice.items[i].price; renderPurch(); }));
      $$('#p_invoice_box [data-act="remove"]').forEach(b=> b.addEventListener('click', ()=>{ const i=b.dataset.idx; invoice.items.splice(i,1); renderPurch(); }));
      $$('#p_invoice_box [data-field]').forEach(inp=> inp.addEventListener('change', ()=>{
        const i=inp.dataset.idx; const f=inp.dataset.field; const v=Number(inp.value||0);
        if(f==='qty') invoice.items[i].qty = Math.max(1, Math.floor(v));
        if(f==='price') invoice.items[i].price = Math.max(0, v);
        invoice.items[i].total = invoice.items[i].qty * invoice.items[i].price;
        renderPurch();
      }));
      $$('#p_invoice_box [data-field]').forEach(inp=> inp.addEventListener('blur', ()=>{
        const i=inp.dataset.idx; const f=inp.dataset.field; const v=Number(inp.value||0);
        if(f==='qty') invoice.items[i].qty = Math.max(1, Math.floor(v));
        if(f==='price') invoice.items[i].price = Math.max(0, v);
        invoice.items[i].total = invoice.items[i].qty * invoice.items[i].price;
        renderPurch();
      }));
    }

    function renderPurchProdList(filter=''){
      const q = filter.trim().toLowerCase();
      const list = q? products.filter(p=>
        String(p.name||'').toLowerCase().includes(q) ||
        String(p.barcode||'').toLowerCase().includes(q) ||
        String(p.category||'').toLowerCase().includes(q)
      ): products;
      $('#p_prod_list').innerHTML = list.length? list.map(p=>`
        <div class="panel" style="margin-bottom:8px">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
            <div>
              <div><strong>${escapeHtml(p.name)}</strong></div>
              <div class="mini">${escapeHtml(p.category||'')} • الكمية المتاحة: ${Number(p.stock||0)}</div>
            </div>
            <div style="display:flex;gap:8px;align-items:center">
              <button class="button ghost btn-addp" data-id="${escapeAttr(p.barcode||p.name)}">إضافة</button>
            </div>
          </div>
        </div>
      `).join('') : 'لا توجد منتجات';
      $$('.btn-addp', $('#p_prod_list')).forEach(b=> b.addEventListener('click', ()=> addToPurch(b.dataset.id)));
    }
          function finalizePurchase(){
            if(!invoice.items.length){ alert('لا توجد عناصر في الفاتورة'); return; }
            const boxId = $('#p_cashbox').value;
            if(!boxId){ alert('يرجى اختيار الصندوق'); return; }
            const totals = invoice.items.reduce((a,it)=>{ a.sub += it.total; return a; }, {sub:0});
            if(editingPurchInvoiceNo){
              // السماح بالتعديل حتى لو استهلك جزء: نحدّد المتبقي القابل للتعديل لكل صنف
              const productsNow = loadProducts();
              const orig = editingPurchOriginal;
              // خريطة: code+price -> { originalQty, consumedQty, availableQty }
              const metaMap = new Map();
              orig.items.forEach(old=>{
                const key = old.code+'@@'+old.price;
                const p = productsNow.find(x=> String(x.barcode||x.name)===String(old.code));
                let consumedQty = 0; let availableQty = 0;
                if(p){
                  const lots = findLotsBySource(p, orig.no).filter(l=> Number(l.price)===Number(old.price));
                  availableQty = lots.reduce((s,l)=> s + Number(l.qty||0), 0);
                  consumedQty = Number(old.qty||0) - availableQty;
                  if(consumedQty < 0) consumedQty = 0; // أمان
                }
                metaMap.set(key, { originalQty: Number(old.qty||0), consumedQty, availableQty });
              });
              // تحقق: لا يجوز أن تقل الكمية الجديدة لأي عنصر عن الكمية المستهلكة فعلاً
              for(const newItem of invoice.items){
                const key = newItem.code+'@@'+newItem.price; // قد يتغير السعر، سنراعي الحالات لاحقاً
                // ابحث أيضاً بالسعر الأصلي إذا تغيّر
                const altKeys = Array.from(metaMap.keys()).filter(k=> k.startsWith(newItem.code+'@@'));
                let related = null; if(metaMap.has(key)) related = metaMap.get(key); else if(altKeys.length===1) related = metaMap.get(altKeys[0]);
                if(related){
                  if(Number(newItem.qty||0) < related.consumedQty){
                    alert(`لا يمكن جعل كمية الصنف ${newItem.name} أقل من الكمية المستهلكة (${related.consumedQty}).`);
                    return;
                  }
                }
              }
              // إزالة كل طبقات الفاتورة القديمة ثم إعادة تركيبها وفق الكميات الجديدة مع الحفاظ على الجزء المستهلك ثابتاً
              orig.items.forEach(old=>{ const p = productsNow.find(x=> String(x.barcode||x.name)===String(old.code)); if(p) removeLotsBySource(p, orig.no); });
              invoice.items.forEach(it=>{
                const p = productsNow.find(x=> String(x.barcode||x.name)===String(it.code)); if(!p) return;
                // إيجاد بيانات الاستهلاك القديمة (بغض النظر عن تغير السعر)
                const oldEntries = Array.from(metaMap.entries()).filter(([k,v])=> k.startsWith(it.code+'@@'));
                let consumedQty = 0;
                // اجمع الاستهلاك من جميع الأسعار السابقة (لو كان هناك تعديل سعر)
                consumedQty = oldEntries.reduce((s,[k,v])=> s + Number(v.consumedQty||0), 0);
                const newQty = Number(it.qty||0);
                const adjustableQty = Math.max(0, newQty - consumedQty);
                // نضيف فقط الجزء القابل للتعديل كطبقات جديدة (المستهلك فعلياً لا يمكن استرجاعه)
                if(adjustableQty>0){ fifoAddLotDetailed(p, adjustableQty, it.price, orig.no); }
              });
              saveProducts(productsNow);
              const all = loadPurchases();
              const idx = all.findIndex(v=> String(v.no)===String(editingPurchInvoiceNo));
              if(idx>=0){
                all[idx] = { ...all[idx], date: $('#p_date').value, supplier: $('#p_supplier').value.trim(), cashbox: boxId, items: invoice.items.map(it=>({code:it.code,name:it.name,qty:it.qty,price:it.price,total:it.total})), total: totals.sub };
                savePurchases(all);
              }
              alert(`تم تحديث فاتورة الشراء رقم ${editingPurchInvoiceNo}`);
              editingPurchInvoiceNo=null; editingPurchOriginal=null; const btn=$('#p_finalize'); if(btn){ btn.textContent='حفظ الفاتورة'; delete btn.dataset.mode; }
              const titleEl = $('#p_inv_title'); if(titleEl){ titleEl.textContent = 'فاتورة مشتريات جديدة'; }
              invoice.items = []; renderPurch(); renderPurchProdList($('#p_prod_search')?.value||'');
            } else {
              // رقم الفاتورة الجديد (نحتاجه لاحقاً لربط الرصيد الافتتاحي إن وُجد)
              const invNo = nextInvoiceNo('P');
              const existingPurchases = loadPurchases();
              // معالجة منع التكرار: إذا كان المنتج جديداً وله رصيد افتتاحي (lot واحدة بلا sourceNo)
              // ثم قام المستخدم بإدخال أول فاتورة بنفس الكمية والسعر، نعتبر الفاتورة توثيقاً لذلك الرصيد فقط.
              invoice.items.forEach(it=>{
                const p = products.find(x=> String(x.barcode||x.name)===String(it.code));
                if(!p) return;
                migrateLotsIfNeeded(p);
                const priorPurch = existingPurchases.some(v=> (v.items||[]).some(pi=> String(pi.code)===String(it.code)) );
                const lots = p.lots||[];
                const singleOpening = lots.length===1 && lots[0].sourceNo==null;
                const sameQty = lotsTotalQty(p) === Number(it.qty||0);
                const samePrice = singleOpening && Number(lots[0].price)===(Number(it.price||0));
                if(!priorPurch && singleOpening && sameQty && samePrice){
                  // تحويل الطبقة الافتتاحية إلى طبقة مربوطة بهذه الفاتورة بدلاً من إضافة طبقة جديدة
                  lots[0].sourceNo = invNo;
                  lots[0].createdAt = lots[0].createdAt || Date.now();
                  // عدم إضافة كمية جديدة (تجنّب التكرار)
                } else {
                  // سلوك طبيعي: إضافة طبقة جديدة بالكميات المشتراة
                  fifoAddLotDetailed(p, it.qty, it.price, invNo);
                }
              });
              saveProducts(products);
              const invObj = { no: invNo, type:'purchase', date: $('#p_date').value, supplier: $('#p_supplier').value.trim(), cashbox: boxId, items: invoice.items.map(it=>({code:it.code,name:it.name,qty:it.qty,price:it.price,total:it.total})), total: totals.sub };
              existingPurchases.push(invObj); savePurchases(existingPurchases);
              // تنبيه المستخدم إن تم تحويل الرصيد الافتتاحي بدلاً من مضاعفته
              try{
                const converted = invoice.items.filter(it=>{
                  const p = products.find(x=> String(x.barcode||x.name)===String(it.code));
                  if(!p) return false;
                  const lots = p.lots||[];
                  return lots.some(l=> String(l.sourceNo)===String(invNo)) && lots.filter(l=> String(l.sourceNo)===String(invNo)).length===1 && Number(it.qty||0)===Number(lots.filter(l=> String(l.sourceNo)===String(invNo)).reduce((s,l)=>s+Number(l.qty||0),0));
                });
                if(converted.length){
                  alert('تم ربط الرصيد الافتتاحي بالأصناف التالية بهذه الفاتورة دون إضافة كميات جديدة:\n' + converted.map(c=> '• '+c.name).join('\n'));
                }
              }catch{}
              recomputeBalances(); renderTopStats();
              alert(`تم حفظ فاتورة الشراء رقم ${invObj.no}`);
              const titleEl = $('#p_inv_title'); if(titleEl){ titleEl.textContent = 'فاتورة مشتريات جديدة'; }
              invoice.items = []; renderPurch(); renderPurchProdList($('#p_prod_search')?.value||'');
            }
          }
          $('#p_finalize').addEventListener('click', finalizePurchase);
          // تهيئة زر الإغلاق (خارج finalizePurchase لتعمل في الحالتين)
          const cancelPurchBtn = document.getElementById('p_cancel_edit');
          if(cancelPurchBtn){
            cancelPurchBtn.addEventListener('click', ()=>{
              editingPurchInvoiceNo=null; editingPurchOriginal=null;
              location.hash = window.__lastTabBeforePurchase || 'products';
            });
          }
          // حاسبة سريعة داخل تبويب المشتريات
          const openQuickCalcPurch = () => {
            if(document.getElementById('qc_backdrop_purch')) return; // منع التكرار
            const wrap = document.createElement('div');
            wrap.className = 'modal-backdrop';
            wrap.id = 'qc_backdrop_purch';
            wrap.innerHTML = `
              <div class="modal" style="min-width:340px">
                <div class="title">حاسبة سريعة</div>
                <input class="input" id="qc_expr_purch" placeholder="اكتب عملية مثل: 20*3+15" />
                <div style="margin-top:10px;font-weight:700;font-size:18px">= <span id="qc_res_purch">0</span></div>
                <div class="actions">
                  <button class="button ghost" id="qc_close_purch">إغلاق (Esc)</button>
                </div>
              </div>`;
            document.body.appendChild(wrap);
            const exprInp = document.getElementById('qc_expr_purch');
            const resSpan = document.getElementById('qc_res_purch');
            function safeEvalQuick(e){
              if(!e) return 0; e = e.replace(/,/g,''); e = e.replace(/(\d+(?:\.\d+)?)%/g,'($1/100)');
              if(!/^[-+*/().%0-9\s]*$/.test(e)) return NaN; try{ return Function('return ('+ e + ')')(); }catch{ return NaN; }
            }
            function recompute(){
              const v = safeEvalQuick(exprInp.value.trim());
              if(!Number.isNaN(v) && Number.isFinite(v)) resSpan.textContent = String(v); else resSpan.textContent='خطأ';
            }
            exprInp.addEventListener('input', recompute);
            exprInp.addEventListener('keydown', ev=>{ if(ev.key==='Enter'){ recompute(); } else if(ev.key==='Escape'){ close(); } });
            function close(){ document.removeEventListener('keydown', esc); wrap.remove(); }
            function esc(ev){ if(ev.key==='Escape'){ close(); } }
            document.getElementById('qc_close_purch').addEventListener('click', close);
            wrap.addEventListener('click', e=>{ if(e.target===wrap) close(); });
            document.addEventListener('keydown', esc);
            setTimeout(()=> exprInp.focus(), 0);
          };
          const quickBtnPurch = document.getElementById('quick_calc_purchases');
          if(quickBtnPurch){ quickBtnPurch.addEventListener('click', openQuickCalcPurch); }
          function preparePurchEditorFromExisting(){
            if(!editingPurchInvoiceNo) return;
            const inv = loadPurchases().find(v=> String(v.no)===String(editingPurchInvoiceNo));
            if(!inv){ editingPurchInvoiceNo=null; editingPurchOriginal=null; return; }
            // لا حاجة لاسترجاع طبقات لأنها لم تُستهلك (التحقق عند الحفظ)
            $('#p_supplier').value = inv.supplier||'';
            $('#p_date').value = inv.date||new Date().toISOString().slice(0,10);
            $('#p_cashbox').value = inv.cashbox||'';
            invoice.items = (inv.items||[]).map(it=>({ code:it.code, name:it.name, qty:it.qty, price:it.price, total:it.qty*it.price }));
            renderPurch();
            const btn=$('#p_finalize'); if(btn){ btn.textContent='تحديث الفاتورة'; btn.dataset.mode='update'; }
            const titleEl = $('#p_inv_title'); if(titleEl){ titleEl.textContent = `تحديث فاتورة مشتريات ${inv.no}`; }
          }
          if(editingPurchInvoiceNo){ setTimeout(preparePurchEditorFromExisting,0); }

    const pInp = $('#p_prod_search');
    if(pInp){ pInp.addEventListener('input', ()=> renderPurchProdList(pInp.value)); }
    renderPurchProdList('');
    renderPurch();
  } else if(key==='cashboxes'){
    ensureOpenings();
    recomputeBalances();
    const boxes = loadCashboxes();
    const today = new Date().toISOString().slice(0,10);
    content.innerHTML = breadcrumb + `
      <div class="panel">
        <div class="grid cols-3" style="margin-bottom:12px">
          <div>
            <div style="font-weight:700;margin-bottom:6px">إضافة صندوق</div>
            <div class="grid cols-2">
              <input class="input" id="cb_name" placeholder="اسم الصندوق" />
              <input type="number" class="input" id="cb_open" placeholder="الرصيد الابتدائي" />
            </div>
            <div style="margin-top:8px"><button class="button" id="cb_add">إضافة</button></div>
          </div>
          <div>
            <div style="font-weight:700;margin-bottom:6px">تحويل بين الصناديق</div>
            <div class="grid cols-2">
              <input type="date" class="input" id="tr_date" value="${today}" />
              <input type="number" class="input" id="tr_amount" placeholder="المبلغ" />
              <select class="input" id="tr_from"></select>
              <select class="input" id="tr_to"></select>
              <input class="input" id="tr_note" placeholder="البيان (اختياري)" />
            </div>
            <div style="margin-top:8px"><button class="button" id="tr_do">تحويل</button></div>
          </div>
          <div>
            <div style="font-weight:700;margin-bottom:6px">الصناديق</div>
            <div id="cb_list">لا صناديق بعد.</div>
          </div>
        </div>
        <div class="panel" style="margin-top:12px">
          <div class="toolbar" style="margin-bottom:8px;justify-content:space-between">
            <span class="badge">حركات التحويل</span>
            <div class="searchbar" style="gap:6px">
              <input type="date" class="input" id="f_from" />
              <input type="date" class="input" id="f_to" />
              <input type="number" class="input" id="f_min" placeholder="المبلغ من" />
              <input type="number" class="input" id="f_max" placeholder="المبلغ إلى" />
              <input class="input" id="f_name" placeholder="اسم الصندوق" />
              <button class="button ghost" id="f_apply">تصفية</button>
            </div>
          </div>
          <div id="tr_list">لا حركات بعد.</div>
        </div>
      </div>
    `;
    function refreshBoxes(){
      const bs = loadCashboxes();
      $('#cb_list').innerHTML = bs.length? `
        <table class="table"><thead><tr><th>الاسم</th><th>الرصيد</th><th>الحركة</th><th>تعديل</th></tr></thead>
          <tbody>
            ${bs.map(b=>`<tr>
              <td>${escapeHtml(b.name)}</td>
              <td>${formatCurrency(b.balance)}</td>
              <td><button class="button ghost" data-id="${b.id}" data-act="view-mv">عرض الحركة</button></td>
              <td><button class="button ghost" data-id="${b.id}" data-act="edit-cb">تعديل</button></td>
            </tr>`).join('')}
          </tbody></table>` : 'لا صناديق بعد.';
      // fill selects
      const options = bs.map(b=>`<option value="${b.id}">${escapeHtml(b.name)} — ${formatCurrency(b.balance)}</option>`).join('');
      $('#tr_from').innerHTML = `<option value="">من صندوق</option>` + options;
      $('#tr_to').innerHTML = `<option value="">إلى صندوق</option>` + options;
      $$('#cb_list [data-act="edit-cb"]').forEach(btn=> btn.addEventListener('click', ()=> openEditCashbox(btn.dataset.id)));
      $$('#cb_list [data-act="view-mv"]').forEach(btn=> btn.addEventListener('click', ()=> openCashboxMovement(btn.dataset.id)));
    }
    function applyTransfer(){
      const date = $('#tr_date').value;
      const amount = Number($('#tr_amount').value||0);
      const fromId = $('#tr_from').value;
      const toId = $('#tr_to').value;
      const note = $('#tr_note').value;
      try{
        makeTransfer({date, amount, fromId, toId, note});
        alert('تم التحويل بنجاح');
        recomputeBalances(); refreshBoxes(); renderTransfers();
      }catch(err){ alert(err.message||String(err)); }
    }
    function renderTransfers(){
      const logs = loadTransfers();
      const map = Object.fromEntries(loadCashboxes().map(b=>[b.id,b.name]));
      // filters
      const df = $('#f_from').value; const dt = $('#f_to').value;
      const min = Number($('#f_min').value||''); const max = Number($('#f_max').value||'');
      const nameQ = ($('#f_name').value||'').trim().toLowerCase();
      const rows = logs.filter(tx=>{
        let ok = true;
        if(df) ok = ok && (tx.date >= df);
        if(dt) ok = ok && (tx.date <= dt);
        if(!Number.isNaN(min) && $('#f_min').value!=='') ok = ok && (tx.amount >= min);
        if(!Number.isNaN(max) && $('#f_max').value!=='') ok = ok && (tx.amount <= max);
        if(nameQ){
          const fromN = String(map[tx.fromId]||'').toLowerCase();
          const toN = String(map[tx.toId]||'').toLowerCase();
          ok = ok && (fromN.includes(nameQ) || toN.includes(nameQ));
        }
        return ok;
      });
      if(!rows.length){ $('#tr_list').innerHTML='لا حركات بعد.'; return; }
      $('#tr_list').innerHTML = `
        <div style="overflow:auto">
          <table class="table">
            <thead><tr><th>التاريخ</th><th>المبلغ</th><th>من صندوق</th><th>إلى صندوق</th><th>البيان</th><th>تعديل</th></tr></thead>
            <tbody>
              ${rows.map(tx=>`<tr>
                <td>${escapeHtml(tx.date||'')}</td>
                <td>${formatCurrency(tx.amount)}</td>
                <td>${escapeHtml(map[tx.fromId]||'')}</td>
                <td>${escapeHtml(map[tx.toId]||'')}</td>
                <td>${escapeHtml(tx.note||'')}</td>
                <td><button class="button ghost" data-id="${tx.id}" data-act="edit-tx">تعديل</button></td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>`;
      $$('#tr_list [data-act="edit-tx"]').forEach(btn=> btn.addEventListener('click', ()=> openEditTransfer(btn.dataset.id)));
    }
    function openEditCashbox(id){
      const boxes = loadCashboxes();
      const b = boxes.find(x=> x.id===id); if(!b) return;
      const backdrop = document.createElement('div'); backdrop.className='modal-backdrop';
      backdrop.innerHTML = `
        <div class="modal">
          <div class="title">تعديل الصندوق</div>
          <div class="grid cols-2">
            <div><label>الاسم</label><input class="input" id="cb_e_name" value="${escapeAttr(b.name)}"/></div>
            <div><label>الرصيد الابتدائي</label><input type="number" class="input" id="cb_e_open" value="${Number(b.opening||0)}"/></div>
          </div>
          <div class="actions"><button class="button" id="save">حفظ</button><button class="button ghost" id="cancel">إلغاء</button></div>
        </div>`;
      document.body.appendChild(backdrop);
      const close=()=>backdrop.remove();
      backdrop.addEventListener('click', e=>{ if(e.target===backdrop) close(); });
      $('#cancel', backdrop).addEventListener('click', close);
      $('#save', backdrop).addEventListener('click', ()=>{
        b.name = $('#cb_e_name', backdrop).value.trim();
        b.opening = Number($('#cb_e_open', backdrop).value||0);
        saveCashboxes(boxes); recomputeBalances(); refreshBoxes(); close();
      });
    }
    function openEditTransfer(id){
      const logs = loadTransfers();
      const tx = logs.find(x=> x.id===id); if(!tx) return;
      const boxes = loadCashboxes();
      const backdrop = document.createElement('div'); backdrop.className='modal-backdrop';
      backdrop.innerHTML = `
        <div class="modal">
          <div class="title">تعديل التحويل</div>
          <div class="grid cols-2">
            <input type="date" class="input" id="tx_e_date" value="${escapeAttr(tx.date||'')}"/>
            <input type="number" class="input" id="tx_e_amount" value="${Number(tx.amount||0)}"/>
            <select class="input" id="tx_e_from">${boxes.map(b=>`<option value="${b.id}" ${b.id===tx.fromId?'selected':''}>${escapeHtml(b.name)}</option>`).join('')}</select>
            <select class="input" id="tx_e_to">${boxes.map(b=>`<option value="${b.id}" ${b.id===tx.toId?'selected':''}>${escapeHtml(b.name)}</option>`).join('')}</select>
            <input class="input" id="tx_e_note" placeholder="البيان" value="${escapeAttr(tx.note||'')}"/>
          </div>
          <div class="actions"><button class="button" id="save">حفظ</button><button class="button ghost" id="cancel">إلغاء</button></div>
        </div>`;
      document.body.appendChild(backdrop);
      const close=()=>backdrop.remove();
      backdrop.addEventListener('click', e=>{ if(e.target===backdrop) close(); });
      $('#cancel', backdrop).addEventListener('click', close);
      $('#save', backdrop).addEventListener('click', ()=>{
        tx.date = $('#tx_e_date', backdrop).value;
        tx.amount = Number($('#tx_e_amount', backdrop).value||0);
        tx.fromId = $('#tx_e_from', backdrop).value;
        tx.toId = $('#tx_e_to', backdrop).value;
        tx.note = $('#tx_e_note', backdrop).value;
        saveTransfers(logs); recomputeBalances(); refreshBoxes(); renderTransfers(); close();
      });
    }
    // عرض حركة صندوق محدد
    function openCashboxMovement(id){
      const boxes = loadCashboxes();
      const b = boxes.find(x=> x.id===id); if(!b) return;
      const sales = loadSales();
      const purch = loadPurchases();
      const expenses = loadExpenses();
      const transfers = loadTransfers();
      // تجميع الحركات: كل عنصر: {date,type,label,in,out,note,ref}
      const rows = [];
      // افتتاحي
      rows.push({ date: '0000-00-00', type:'opening', label:'رصيد افتتاحي', in: Number(b.opening||0), out:0, note:'', ref:'' });
      // مبيعات (وارد للصندوق)
      sales.forEach(v=>{ if(v.cashbox===b.id && v.status==='paid'){ rows.push({ date:v.date||'', type:'sale', label:'فاتورة مبيعات '+v.no, in:Number(v.total||0), out:0, note:v.customer||'', ref:v.no }); } });
      // مشتريات (صادر من الصندوق)
      purch.forEach(v=>{ if(v.cashbox===b.id){ rows.push({ date:v.date||'', type:'purchase', label:'فاتورة مشتريات '+v.no, in:0, out:Number(v.total||0), note:v.supplier||'', ref:v.no }); } });
      // مصروفات (صادر)
      expenses.forEach(e=>{ if(e.cashbox===b.id){ rows.push({ date:e.date||'', type:'expense', label:'مصروف '+(e.category||''), in:0, out:Number(e.amount||0), note:e.note||'', ref:e.id||'' }); } });
      // تحويلات واردة/صادرة
      transfers.forEach(t=>{
        if(t.fromId===b.id){ rows.push({ date:t.date||'', type:'transfer_out', label:'تحويل خارج إلى '+ (boxes.find(x=>x.id===t.toId)?.name||''), in:0, out:Number(t.amount||0), note:t.note||'', ref:t.id }); }
        if(t.toId===b.id){ rows.push({ date:t.date||'', type:'transfer_in', label:'تحويل وارد من '+ (boxes.find(x=>x.id===t.fromId)?.name||''), in:Number(t.amount||0), out:0, note:t.note||'', ref:t.id }); }
      });
      rows.sort((a,b)=> String(a.date).localeCompare(String(b.date)) || a.type.localeCompare(b.type));
      const backdrop = document.createElement('div'); backdrop.className='modal-backdrop';
      backdrop.innerHTML = `
        <div class="modal" style="max-width:900px">
          <div class="title">حركة الصندوق: ${escapeHtml(b.name)}</div>
          <div style="margin:6px 0 10px" class="searchbar">
            <select class="input" id="mv_type" style="max-width:200px">
              <option value="all">كل الأنواع</option>
              <option value="in">وارد (مبيعات + تحويل وارد + افتتاحي)</option>
              <option value="out">صادر (مشتريات + مصروفات + تحويل صادر)</option>
              <option value="opening">افتتاحي فقط</option>
              <option value="sale">مبيعات فقط</option>
              <option value="purchase">مشتريات فقط</option>
              <option value="expense">مصروفات فقط</option>
              <option value="transfer_in">تحويلات واردة</option>
              <option value="transfer_out">تحويلات صادرة</option>
            </select>
            <input type="date" class="input" id="mv_from" />
            <input type="date" class="input" id="mv_to" />
            <button class="button ghost" id="mv_apply">تطبيق</button>
          </div>
          <div style="max-height:55vh;overflow:auto" id="mv_box"></div>
          <div style="margin-top:8px;font-size:13px" id="mv_totals"></div>
          <div class="actions"><button class="button ghost" id="close">إغلاق</button></div>
        </div>`;
      document.body.appendChild(backdrop);
      const close=()=>backdrop.remove();
      backdrop.addEventListener('click', e=>{ if(e.target===backdrop) close(); });
      $('#close', backdrop).addEventListener('click', close);
      function repaint(){
        const t = $('#mv_type', backdrop).value;
        const df = $('#mv_from', backdrop).value; const dt = $('#mv_to', backdrop).value;
        const filtered = rows.filter(r=>{
          let ok=true;
            if(df && r.date<'0000-00-00' ){ /* opening always kept unless date filter forbids */ }
          if(df && r.date && r.date!=='0000-00-00') ok = ok && (r.date>=df);
          if(dt && r.date && r.date!=='0000-00-00') ok = ok && (r.date<=dt);
          if(t==='in') ok = ok && ( (r.in>0 && r.type!=='purchase' && r.type!=='expense' && !r.type.endsWith('_out')) );
          else if(t==='out') ok = ok && ( (r.out>0) );
          else if(t!=='all') ok = ok && (r.type===t);
          return ok;
        });
        if(!filtered.length){ $('#mv_box').innerHTML = 'لا نتائج.'; $('#mv_totals').textContent=''; return; }
        const totalIn = filtered.reduce((s,r)=> s + Number(r.in||0),0);
        const totalOut = filtered.reduce((s,r)=> s + Number(r.out||0),0);
        $('#mv_totals').textContent = `الإجمالي الوارد: ${formatCurrency(totalIn)} • الإجمالي الصادر: ${formatCurrency(totalOut)} • الصافي: ${formatCurrency(totalIn-totalOut)}`;
        $('#mv_box').innerHTML = `
          <table class="table">
            <thead><tr><th>التاريخ</th><th>الوصف</th><th>وارد</th><th>صادر</th><th>ملاحظة</th></tr></thead>
            <tbody>
              ${filtered.map(r=>`<tr>
                <td>${r.date==='0000-00-00'?'—':escapeHtml(r.date)}</td>
                <td>${escapeHtml(r.label)}</td>
                <td>${r.in? formatCurrency(r.in): ''}</td>
                <td>${r.out? formatCurrency(r.out): ''}</td>
                <td>${escapeHtml(r.note||'')}</td>
              </tr>`).join('')}
            </tbody>
          </table>`;
      }
      $('#mv_apply', backdrop).addEventListener('click', repaint);
      repaint();
    }
    $('#cb_add').addEventListener('click', ()=>{
      const name = $('#cb_name').value.trim();
      const open = Number($('#cb_open').value||0);
      if(!name){ alert('يرجى إدخال اسم الصندوق'); return; }
      addCashbox(name, open);
      $('#cb_name').value=''; $('#cb_open').value='';
      refreshBoxes();
    });
    $('#tr_do').addEventListener('click', applyTransfer);
    $('#f_apply').addEventListener('click', renderTransfers);
    refreshBoxes();
    renderTransfers();
  } else if(key==='invoices'){
    // تأكد من عدم جر وضع تحرير فاتورة مشتريات إلى تبويب الفواتير
    resetInvoiceEditState();
    // التاريخ الحالي لاستخدامه كقيمة افتراضية في فلاتر التاريخ
    const today = new Date().toISOString().slice(0,10);
    const sales = loadSales();
    const purch = loadPurchases();
    const expenses = loadExpenses();
    const settings = loadSettings();
    const ob = (settings && settings.openingBalances) ? settings.openingBalances : { sales:0, purchases:0, expenses:0, profit:0 };
    // Stats
    const baseSales = sales.reduce((s,v)=> s + Number(v.total||0), 0);
    const basePurch = purch.reduce((s,v)=> s + Number(v.total||0), 0);
    const totalStockValue = loadProducts().reduce((s,p)=> s + (Number(p.stock||0) * Number(p.buyPrice||0)), 0);
    const baseProfit = sales.reduce((s,v)=> s + Number(v.profit||0), 0);
    const baseExpenses = expenses.reduce((s,e)=> s + Number(e.amount||0), 0);
    const totalSales = baseSales + Number(ob.sales||0);
    const totalPurch = basePurch + Number(ob.purchases||0);
    const totalProfit = baseProfit + Number(ob.profit||0);
    const totalExpenses = baseExpenses + Number(ob.expenses||0);
    const netProfit = (baseProfit - baseExpenses) + (Number(ob.profit||0) - Number(ob.expenses||0));
    // UI: stats + tabs
    content.innerHTML = breadcrumb + `
      <div class="panel">
        <div class="grid cols-3">
          <div class="stat-card"><div class="ico">🧾</div><div><div class="val">${formatCurrency(totalPurch)}${(ob.purchases||0)? `<div class='mini'>تشغيلي: ${formatCurrency(basePurch)} • افتتاحي: ${formatCurrency(ob.purchases||0)}</div>`:''}</div><div class="lbl">إجمالي المشتريات</div></div></div>
          <div class="stat-card"><div class="ico">💵</div><div><div class="val">${formatCurrency(totalSales)}${(ob.sales||0)? `<div class='mini'>تشغيلي: ${formatCurrency(baseSales)} • افتتاحي: ${formatCurrency(ob.sales||0)}</div>`:''}</div><div class="lbl">إجمالي المبيعات</div></div></div>
          <div class="stat-card"><div class="ico">📦</div><div><div class="val">${formatCurrency(totalStockValue)}</div><div class="lbl">إجمالي المخزون</div></div></div>
          <div class="stat-card"><div class="ico">📈</div><div><div class="val">${formatCurrency(totalProfit)}${(ob.profit||0)? `<div class='mini'>تشغيلي: ${formatCurrency(baseProfit)} • افتتاحي: ${formatCurrency(ob.profit||0)}</div>`:''}</div><div class="lbl">إجمالي الأرباح</div></div></div>
          <div class="stat-card"><div class="ico">💳</div><div><div class="val">${formatCurrency(totalExpenses)}${(ob.expenses||0)? `<div class='mini'>تشغيلي: ${formatCurrency(baseExpenses)} • افتتاحي: ${formatCurrency(ob.expenses||0)}</div>`:''}</div><div class="lbl">إجمالي المصروفات</div></div></div>
          <div class="stat-card"><div class="ico">➖</div><div><div class="val">${formatCurrency(netProfit)}${(ob.profit||0||ob.expenses||0)? `<div class='mini'>تشغيلي: ${formatCurrency(baseProfit - baseExpenses)} • افتتاحي: ${formatCurrency((ob.profit||0)-(ob.expenses||0))}</div>`:''}</div><div class="lbl">صافي الربح</div></div></div>
        </div>
      </div>
      <div class="panel" id="invoice-tabs-panel">
        <div class="toolbar" style="justify-content:space-between">
          <div style="display:flex;gap:8px">
            <button class="button" id="tab_sales">فواتير المبيعات</button>
            <button class="button ghost" id="tab_purch">فواتير المشتريات</button>
            <button class="button ghost" id="inv_newwin" title="فتح في نافذة جديدة">🗗 نافذة</button>
            <button class="button ghost" id="inv_float" title="فتح نسخة عائمة">🗂️ نسخة</button>
          </div>
          <div class="searchbar" style="gap:10px;flex-wrap:wrap;font-size:13.5px;line-height:1.4">
            <select class="input" id="inv_sort" style="max-width:250px;font-size:13.5px;height:40px;padding:6px 10px">
              <option value="date_desc" selected>ترتيب: التاريخ (أحدث ↓)</option>
              <option value="date_asc">ترتيب: التاريخ (أقدم ↑)</option>
              <option value="amount_desc">ترتيب: المبلغ (أعلى ↓)</option>
              <option value="amount_asc">ترتيب: المبلغ (أدنى ↑)</option>
              <option value="no_desc">ترتيب: رقم الفاتورة (أحدث ↓)</option>
              <option value="no_asc">ترتيب: رقم الفاتورة (أقدم ↑)</option>
            </select>
            <select class="input" id="inv_paid" style="max-width:170px;font-size:13.5px;height:40px;padding:6px 10px">
              <option value="all" selected>كل المدفوعات</option>
              <option value="paid">مدفوع</option>
              <option value="unpaid">غير مدفوع</option>
            </select>
            <div style="display:flex;align-items:center;gap:6px;font-size:13.5px">
              <span style="white-space:nowrap;font-weight:500">من:</span>
              <input type="date" class="input" id="inv_from" style="height:40px;font-size:13.5px;padding:6px 8px" />
              <span style="white-space:nowrap;font-weight:500">إلى:</span>
              <input type="date" class="input" id="inv_to" style="height:40px;font-size:13.5px;padding:6px 8px" />
            </div>
            <input type="number" class="input" id="inv_min" placeholder="المبلغ (من)" style="max-width:150px;height:40px;font-size:13.5px;padding:6px 10px" />
            <input type="number" class="input" id="inv_max" placeholder="المبلغ (إلى)" style="max-width:150px;height:40px;font-size:13.5px;padding:6px 10px" />
            <input class="input" id="inv_search" placeholder="بحث (رقم/اسم)" style="max-width:200px;height:40px;font-size:13.5px;padding:6px 10px" />
            <button class="button ghost" id="inv_apply" style="height:40px;font-size:13.5px;padding:0 16px">تطبيق</button>
            <button class="button ghost" id="inv_reset" style="height:40px;font-size:13.5px;padding:0 16px">مسح</button>
            <button class="button" id="inv_export" style="height:40px;font-size:13.5px;padding:0 16px;background:#2b7">تصدير مختصر</button>
            <button class="button" id="inv_export_detailed" style="height:40px;font-size:13.5px;padding:0 16px;background:#27a">تصدير البنود</button>
          </div>
        </div>
        <div id="tab_box"></div>
      </div>`;
    let activeTab = 'sales';
    let __invoiceState = null; try{ __invoiceState = JSON.parse(sessionStorage.getItem('invoice_page_state')||'null'); }catch{}
    if(__invoiceState && __invoiceState.activeTab){ activeTab = __invoiceState.activeTab; }
    function gatherInvFilters(){
      return { sort:$('#inv_sort').value, paid:$('#inv_paid').value, from:$('#inv_from').value, to:$('#inv_to').value, min:$('#inv_min').value, max:$('#inv_max').value, search:$('#inv_search').value };
    }
    function saveInvoiceState(includeScroll=true){
      try{ const box=document.getElementById('tab_box'); const st={ activeTab, filters:gatherInvFilters(), scroll: includeScroll && box? box.scrollTop : (__invoiceState?__invoiceState.scroll:0) }; sessionStorage.setItem('invoice_page_state', JSON.stringify(st)); __invoiceState=st; }catch{}
    }
    // استرجاع الفلاتر قبل الرسم
    if(__invoiceState && __invoiceState.filters){ try{ $('#inv_sort').value=__invoiceState.filters.sort||'date_desc'; $('#inv_paid').value=__invoiceState.filters.paid||'all'; $('#inv_from').value=__invoiceState.filters.from||''; $('#inv_to').value=__invoiceState.filters.to||''; $('#inv_min').value=__invoiceState.filters.min||''; $('#inv_max').value=__invoiceState.filters.max||''; $('#inv_search').value=__invoiceState.filters.search||''; }catch{} }
    // مصفوفة آخر نتائج عرض للفواتير لتسهيل التصدير
    window.__lastInvoiceRows = [];
    function renderSalesTable(){
      const q = ($('#inv_search').value||'').trim().toLowerCase();
      const df = $('#inv_from').value; const dt = $('#inv_to').value;
      const min = Number($('#inv_min').value||''); const max = Number($('#inv_max').value||'');
      const paidFilter = ($('#inv_paid').value||'all');
      const rows = sales.filter(v=>{
        let ok = true;
        if(q) ok = ok && (String(v.no).toLowerCase().includes(q) || String(v.customer||'').toLowerCase().includes(q));
        if(df) ok = ok && (String(v.date||'') >= df);
        if(dt) ok = ok && (String(v.date||'') <= dt);
        if(!Number.isNaN(min) && $('#inv_min').value!=='') ok = ok && (Number(v.total||0) >= min);
        if(!Number.isNaN(max) && $('#inv_max').value!=='') ok = ok && (Number(v.total||0) <= max);
        if(paidFilter!=='all') ok = ok && ((paidFilter==='paid') === (v.status==='paid'));
        return ok;
      });
      const sortBy = $('#inv_sort').value || 'date_desc';
      const cmp = (a,b)=>{
        if(sortBy==='date_desc') return String(b.date||'').localeCompare(String(a.date||''));
        if(sortBy==='date_asc') return String(a.date||'').localeCompare(String(b.date||''));
        if(sortBy==='amount_desc') return Number(b.total||0) - Number(a.total||0);
        if(sortBy==='amount_asc') return Number(a.total||0) - Number(b.total||0);
        if(sortBy==='no_desc') return String(b.no||'').localeCompare(String(a.no||''));
        if(sortBy==='no_asc') return String(a.no||'').localeCompare(String(b.no||''));
        return 0;
      };
      rows.sort((a,b)=>{
        const ap = a.status==='paid'?1:0, bp = b.status==='paid'?1:0;
        if(ap!==bp) return ap-bp; // unpaid first
        return cmp(a,b);
      });
      window.__lastInvoiceRows = rows.map(r=>({
        type:'sale',
        number:r.no,
        date:r.date||'',
        customer:r.customer||'',
        total:Number(r.total||0),
        profit:Number(r.profit||0),
        status:r.status==='paid'?'مدفوع':'غير مدفوع',
        payment:r.payment==='bank'?'بنكي':'نقدي',
        cashbox: (Object.fromEntries(loadCashboxes().map(b=>[b.id,b.name])))[r.cashbox]||r.cashbox||''
      }));
      if(!rows.length){ $('#tab_box').innerHTML='لا توجد فواتير مبيعات.'; return; }
      const mapBoxes = Object.fromEntries(loadCashboxes().map(b=>[b.id,b.name]));
      $('#tab_box').innerHTML = `
        <div style="overflow:auto">
          <table class="table">
            <thead><tr><th>رقم</th><th>التاريخ</th><th>اسم العميل</th><th>مبلغ الفاتورة</th><th>الربح</th><th>حالة الدفع</th><th>نوع الدفع</th><th>اسم الصندوق</th><th>عرض/تعديل</th><th>دفع</th><th>حذف</th></tr></thead>
            <tbody>
              ${rows.map(v=>{
                const paid = v.status==='paid';
                const cls = paid? ' style="background:#eaffea"' : '';
                return `<tr${cls}>
                  <td>${escapeHtml(v.no)}</td>
                  <td>${escapeHtml(v.date||'')}</td>
                  <td>${escapeHtml(v.customer||'')}</td>
                  <td>${formatCurrency(v.total||0)}</td>
                  <td>${formatCurrency(v.profit||0)}</td>
                  <td>${paid?'تم الدفع':'لم يتم الدفع'}</td>
                  <td>${v.payment==='bank'?'بنكي':'نقدي'}</td>
                  <td>${escapeHtml(mapBoxes[v.cashbox]||v.cashbox||'')}</td>
                  <td>
                    <button class="button ghost" data-no="${v.no}" data-act="view-sale">عرض</button>
                    <button class="button" data-no="${v.no}" data-act="edit-sale">تعديل</button>
                  </td>
                  <td>${paid? '' : `<button class="button" data-no="${v.no}" data-act="mark-paid">تم الدفع</button>`}</td>
                  <td><button class="button ghost" data-no="${v.no}" data-act="del-sale">حذف</button></td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>`;
      $$('#tab_box [data-act="view-sale"]').forEach(btn=> btn.addEventListener('click', ()=> openInvoiceView('sale', btn.dataset.no)));
      $$('#tab_box [data-act="edit-sale"]').forEach(btn=> btn.addEventListener('click', ()=> {
        const no = btn.dataset.no;
        const invoice = sales.find(v=> String(v.no)===String(no));
        if(!invoice){ alert('الفاتورة غير موجودة'); return; }
        // حفظ الحالة للمحرر
        editingSaleInvoiceNo = invoice.no;
        editingSaleOriginal = JSON.parse(JSON.stringify(invoice));
        editingSaleConsumedMap = {}; (invoice.items||[]).forEach(it=> editingSaleConsumedMap[it.code]= (it.consumed||[]).map(c=>({...c})) );
        // الانتقال لتبويب المبيعات مع تهيئة النموذج
        location.hash = '#sales';
        setTimeout(()=>{
          // تعبئة النموذج في المبيعات عند إعادة الرسم
          prepareSaleEditorFromExisting();
        },50);
      }));
      $$('#tab_box [data-act="mark-paid"]').forEach(btn=> btn.addEventListener('click', ()=> markSalePaid(btn.dataset.no)));
      $$('#tab_box [data-act="del-sale"]').forEach(btn=> btn.addEventListener('click', ()=>{
        const no = btn.dataset.no;
        const idx = sales.findIndex(v=> String(v.no)===String(no));
        if(idx<0) return;
        const inv = sales[idx];
        if(!confirm('تأكيد حذف فاتورة المبيعات رقم '+no+'؟\nسيتم إعادة المخزون المستهلك.')) return;
        const products = loadProducts();
        // إعادة الطبقات المستهلكة
        (inv.items||[]).forEach(it=>{
          if(Array.isArray(it.consumed) && it.consumed.length){
            const p = products.find(x=> String(x.barcode||x.name)===String(it.code));
            if(p) restoreLotsFront(p, it.consumed);
          }
        });
        saveProducts(products);
        sales.splice(idx,1); saveSales(sales); recomputeBalances(); rerender(); renderTopStats();
      }));
    }
    function renderPurchTable(){
      const q = ($('#inv_search').value||'').trim().toLowerCase();
      const df = $('#inv_from').value; const dt = $('#inv_to').value;
      const min = Number($('#inv_min').value||''); const max = Number($('#inv_max').value||'');
      const rows = purch.filter(v=>{
        let ok = true;
        if(q) ok = ok && (String(v.no).toLowerCase().includes(q) || String(v.supplier||'').toLowerCase().includes(q));
        if(df) ok = ok && (String(v.date||'') >= df);
        if(dt) ok = ok && (String(v.date||'') <= dt);
        if(!Number.isNaN(min) && $('#inv_min').value!=='') ok = ok && (Number(v.total||0) >= min);
        if(!Number.isNaN(max) && $('#inv_max').value!=='') ok = ok && (Number(v.total||0) <= max);
        return ok;
      });
      const sortBy = $('#inv_sort').value || 'date_desc';
      rows.sort((a,b)=>{
        if(sortBy==='date_desc') return String(b.date||'').localeCompare(String(a.date||''));
        if(sortBy==='date_asc') return String(a.date||'').localeCompare(String(b.date||''));
        if(sortBy==='amount_desc') return Number(b.total||0) - Number(a.total||0);
        if(sortBy==='amount_asc') return Number(a.total||0) - Number(b.total||0);
        if(sortBy==='no_desc') return String(b.no||'').localeCompare(String(a.no||''));
        if(sortBy==='no_asc') return String(a.no||'').localeCompare(String(b.no||''));
        return 0;
      });
      window.__lastInvoiceRows = rows.map(r=>({
        type:'purchase',
        number:r.no,
        date:r.date||'',
        supplier:r.supplier||'',
        total:Number(r.total||0),
        cashbox:(Object.fromEntries(loadCashboxes().map(b=>[b.id,b.name])))[r.cashbox]||r.cashbox||''
      }));
      if(!rows.length){ $('#tab_box').innerHTML='لا توجد فواتير مشتريات.'; return; }
      const mapBoxes = Object.fromEntries(loadCashboxes().map(b=>[b.id,b.name]));
      $('#tab_box').innerHTML = `
        <div style="overflow:auto">
          <table class="table">
            <thead><tr><th>رقم</th><th>اسم المورد</th><th>مبلغ الفاتورة</th><th>اسم الصندوق</th><th>عرض/تعديل</th><th>حذف</th></tr></thead>
            <tbody>
              ${rows.map(v=>`
                <tr>
                  <td>${escapeHtml(v.no)}</td>
                  <td>${escapeHtml(v.supplier||'')}</td>
                  <td>${formatCurrency(v.total||0)}</td>
                  <td>${escapeHtml(mapBoxes[v.cashbox]||v.cashbox||'')}</td>
                  <td>
                    <button class="button ghost" data-no="${v.no}" data-act="view-purch">عرض</button>
                    <button class="button" data-no="${v.no}" data-act="edit-purch">تعديل</button>
                  </td>
                  <td><button class="button ghost" data-no="${v.no}" data-act="del-purch">حذف</button></td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>`;
      $$('#tab_box [data-act="view-purch"]').forEach(btn=> btn.addEventListener('click', ()=> openInvoiceView('purchase', btn.dataset.no)));
      $$('#tab_box [data-act="edit-purch"]').forEach(btn=> btn.addEventListener('click', ()=> {
        const no = btn.dataset.no;
        const invoice = purch.find(v=> String(v.no)===String(no));
        if(!invoice){ alert('الفاتورة غير موجودة'); return; }
        editingPurchInvoiceNo = invoice.no;
        editingPurchOriginal = JSON.parse(JSON.stringify(invoice));
        location.hash = '#purchases';
        setTimeout(()=>{ preparePurchEditorFromExisting(); },50);
      }));
      $$('#tab_box [data-act="del-purch"]').forEach(btn=> btn.addEventListener('click', ()=>{
        const no = btn.dataset.no;
        const idx = purch.findIndex(v=> String(v.no)===String(no)); if(idx<0) return;
        const inv = purch[idx];
        if(!confirm('تأكيد حذف فاتورة المشتريات رقم '+no+'؟\nسيتم إنقاص المخزون الذي أضافته ما لم يكن قد استهلك.')) return;
        // تحقق أن كل كميات الفاتورة ما زالت متاحة بنفس sourceNo
        const products = loadProducts();
        for(const it of (inv.items||[])){
          const p = products.find(x=> String(x.barcode||x.name)===String(it.code));
          if(!p) continue; migrateLotsIfNeeded(p);
          const lots = findLotsBySource(p, inv.no).filter(l=> Number(l.price)===Number(it.price));
          const avail = lots.reduce((s,l)=> s + Number(l.qty||0), 0);
          if(avail < Number(it.qty||0)){
            alert('لا يمكن حذف الفاتورة: تم استهلاك جزء من كمية الصنف '+it.name+' بالسعر '+formatNumber(it.price,2));
            return;
          }
        }
        // إزالة الطبقات الخاصة بهذه الفاتورة
        for(const it of (inv.items||[])){
          const p = products.find(x=> String(x.barcode||x.name)===String(it.code));
          if(!p) continue; removeLotsBySource(p, inv.no);
        }
        saveProducts(products);
        purch.splice(idx,1); savePurchases(purch); recomputeBalances(); rerender(); renderTopStats();
      }));
    }
    // تصدير الفواتير الحالية المعروضة
    $('#inv_export').addEventListener('click', ()=>{
        try {
          if(typeof XLSX==='undefined') {
            alert('مكتبة Excel غير متوفرة. يرجى التأكد من تحميلها بشكل صحيح.');
            return;
          }
          const rows = window.__lastInvoiceRows||[];
          if(!Array.isArray(rows) || !rows.length) {
            alert('لا توجد بيانات للتصدير.');
            return;
          }
          let aoa = [];
          if(activeTab==='sales') {
            aoa.push(['نوع','رقم','التاريخ','العميل','الإجمالي','الربح','الحالة','الدفع','الصندوق']);
            rows.forEach(r=>{
              aoa.push([
                r.type==='sale'?'مبيع':'',
                r.number||'', r.date||'', r.customer||'',
                typeof r.total==='number'?r.total:0,
                typeof r.profit==='number'?r.profit:0,
                r.status||'', r.payment||'', r.cashbox||''
              ]);
            });
          } else {
            aoa.push(['نوع','رقم','التاريخ','المورد','الإجمالي','الصندوق']);
            rows.forEach(r=>{
              aoa.push([
                r.type==='purchase'?'مشتريات':'',
                r.number||'', r.date||'', r.supplier||'',
                typeof r.total==='number'?r.total:0,
                r.cashbox||''
              ]);
            });
          }
          if(aoa.length<2) {
            alert('لا توجد بيانات للتصدير بعد تطبيق الفلتر.');
            return;
          }
          const ws = XLSX.utils.aoa_to_sheet(aoa);
          if(!ws['!ref']) {
            alert('حدث خطأ في بناء ورقة العمل.');
            return;
          }
          // تنسيق أرقام
          const range = XLSX.utils.decode_range(ws['!ref']);
          for(let R=1; R<=range.e.r; R++){
            if(activeTab==='sales'){
              ['E','F'].forEach(col=>{ const cell = ws[col+ (R+1)]; if(cell && typeof cell.v==='number'){ cell.z = '#,##0.00'; } });
            } else {
              ['E'].forEach(col=>{ const cell = ws[col+ (R+1)]; if(cell && typeof cell.v==='number'){ cell.z = '#,##0.00'; } });
            }
          }
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, activeTab==='sales'?'مبيعات':'مشتريات');
          const fileName = activeTab==='sales'? 'فواتير_مبيعات.xlsx':'فواتير_مشتريات.xlsx';
          XLSX.writeFile(wb, fileName);
        } catch(err) {
          alert('تعذر توليد الملف: '+(err.message||err));
          console.error('Excel export error:', err);
        }
    });
      // تصدير تفصيلي (سطر لكل بند داخل كل فاتورة)
      $('#inv_export_detailed').addEventListener('click', ()=>{
        try {
          if(typeof XLSX==='undefined'){ alert('مكتبة Excel غير متوفرة.'); return; }
          const rows = (window.__lastInvoiceRows||[]);
          if(!rows.length){ alert('لا توجد بيانات للتصدير.'); return; }
          // نجلب الفواتير كاملة من المصدر لأن النسخة المختصرة لا تحتوي البنود
          const salesAll = loadSales();
          const purchAll = loadPurchases();
          const byNoSale = Object.fromEntries(salesAll.map(v=>[v.no,v]));
          const byNoPurch = Object.fromEntries(purchAll.map(v=>[v.no,v]));
          const aoa = [];
          if(activeTab==='sales'){
            aoa.push(['النوع','رقم الفاتورة','التاريخ','العميل','حالة الدفع','نوع الدفع','الصندوق','الصنف','الكمية','سعر البيع','الإجمالي','الربح الإجمالي للفاتورة']);
            rows.forEach(r=>{
              if(r.type!=='sale') return; const full = byNoSale[r.number]; if(!full) return; const profit = Number(full.profit||0);
              (full.items||[]).forEach(it=>{
                aoa.push(['مبيع', r.number, full.date||'', full.customer||'', r.status||'', r.payment||'', r.cashbox||'', it.name||'', Number(it.qty||0), Number(it.price||0), Number(it.total||0), profit]);
              });
            });
          } else {
            aoa.push(['النوع','رقم الفاتورة','التاريخ','المورد','الصندوق','الصنف','الكمية','سعر الشراء','الإجمالي']);
            rows.forEach(r=>{
              if(r.type!=='purchase') return; const full = byNoPurch[r.number]; if(!full) return;
              (full.items||[]).forEach(it=>{
                aoa.push(['مشتريات', r.number, full.date||'', full.supplier||'', r.cashbox||'', it.name||'', Number(it.qty||0), Number(it.price||0), Number(it.total||0)]);
              });
            });
          }
          if(aoa.length<2){ alert('لا توجد بنود مطابقة للفلتر.'); return; }
          const ws = XLSX.utils.aoa_to_sheet(aoa);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, activeTab==='sales'?'بنود_مبيعات':'بنود_مشتريات');
          const fileName = activeTab==='sales'? 'فواتير_مبيعات_تفصيلي.xlsx':'فواتير_مشتريات_تفصيلي.xlsx';
          XLSX.writeFile(wb, fileName);
        }catch(e){ alert('تعذر توليد الملف التفصيلي: '+(e.message||e)); console.error(e); }
      });
      // أزرار فتح نافذة جديدة ونسخة عائمة
      const btnNewWin = document.getElementById('inv_newwin');
      const btnFloat = document.getElementById('inv_float');
      if(btnNewWin){ btnNewWin.addEventListener('click', ()=>{ saveInvoiceState(); window.open(location.href.replace(/#.*/,'')+'#invoices','_blank'); }); }
      if(btnFloat){ btnFloat.addEventListener('click', ()=>{
        if(document.getElementById('floating_invoices_panel')) return;
        const wrap = document.createElement('div');
        wrap.id='floating_invoices_panel';
        wrap.style.position='fixed'; wrap.style.top='70px'; wrap.style.left='20px'; wrap.style.width='500px'; wrap.style.maxWidth='95vw'; wrap.style.maxHeight='70vh'; wrap.style.display='flex'; wrap.style.flexDirection='column'; wrap.style.background='var(--panel-bg,#222)'; wrap.style.border='1px solid var(--border,#444)'; wrap.style.borderRadius='10px'; wrap.style.boxShadow='0 6px 18px rgba(0,0,0,0.4)'; wrap.style.zIndex='9999'; wrap.style.opacity='0'; wrap.style.transform='translateY(10px)';
        wrap.innerHTML = `<div style="display:flex;align-items:center;justify-content:space-between;padding:6px 10px;border-bottom:1px solid var(--border,#444)">
          <strong style="font-size:13px">فواتير (${activeTab==='sales'?'مبيعات':'مشتريات'}) - نسخة</strong>
          <div style="display:flex;gap:4px">
            <button class="button ghost" id="fi_min">↕️</button>
            <button class="button ghost" id="fi_close">✕</button>
          </div>
        </div>
        <div id="fi_body" style="flex:1;overflow:auto;padding:6px 8px;font-size:12.5px"></div>`;
        document.body.appendChild(wrap);
        requestAnimationFrame(()=>{ wrap.style.opacity='1'; wrap.style.transform='translateY(0)'; });
        const body = document.getElementById('fi_body');
        function miniRender(){
          const rows = window.__lastInvoiceRows||[];
          if(!rows.length){ body.innerHTML='لا نتائج.'; return; }
          body.innerHTML = `<table class="table" style="font-size:12px"><thead>${activeTab==='sales'? '<tr><th>رقم</th><th>تاريخ</th><th>عميل</th><th>مبلغ</th>' : '<tr><th>رقم</th><th>تاريخ</th><th>مورد</th><th>مبلغ</th>'}</tr></thead><tbody>` + rows.slice(0,200).map(r=>`<tr><td>${escapeHtml(r.number||'')}</td><td>${escapeHtml(r.date||'')}</td><td>${escapeHtml((r.customer||r.supplier||''))}</td><td>${formatCurrency(r.total||0)}</td></tr>`).join('') + '</tbody></table>' + (rows.length>200? `<div style="margin-top:4px">+ ${rows.length-200} صف إضافي</div>`:'');
        }
        miniRender();
        document.getElementById('fi_close').addEventListener('click', ()=>{ wrap.style.opacity='0'; wrap.style.transform='translateY(10px)'; setTimeout(()=> wrap.remove(),180); });
        document.getElementById('fi_min').addEventListener('click', ()=>{ const bd=document.getElementById('fi_body'); if(!bd) return; bd.style.display = bd.style.display==='none'? '' : 'none'; });
        // سحب
        let drag=false,sx=0,sy=0,ox=0,oy=0; const header=wrap.firstChild; header.style.cursor='move';
        header.addEventListener('mousedown', ev=>{ drag=true; sx=ev.clientX; sy=ev.clientY; const r=wrap.getBoundingClientRect(); ox=r.left; oy=r.top; ev.preventDefault(); });
        window.addEventListener('mousemove', ev=>{ if(!drag) return; const dx=ev.clientX-sx; const dy=ev.clientY-sy; wrap.style.left=(ox+dx)+"px"; wrap.style.top=(oy+dy)+"px"; });
        window.addEventListener('mouseup', ()=> drag=false);
      }); }
      // مراقبة الفلاتر للحفظ
      ['inv_sort','inv_paid','inv_from','inv_to','inv_min','inv_max','inv_search'].forEach(id=>{ const el=document.getElementById(id); if(el){ ['change','input'].forEach(ev=> el.addEventListener(ev, ()=> saveInvoiceState())); }});
      const scrollBox = document.getElementById('tab_box'); if(scrollBox){ scrollBox.addEventListener('scroll', ()=> saveInvoiceState(false)); }
      window.addEventListener('beforeunload', ()=> saveInvoiceState());
      // إعادة التمرير بعد الرسم الأول
      if(__invoiceState && typeof __invoiceState.scroll==='number'){ setTimeout(()=>{ try{ if(scrollBox) scrollBox.scrollTop=__invoiceState.scroll; }catch{} },60); }
    function openInvoiceView(type, no){
      const list = type==='sale'? sales : purch;
      const v = list.find(x=> String(x.no)===String(no)); if(!v) return;
      const backdrop = document.createElement('div'); backdrop.className='modal-backdrop';
      const rows = (v.items||[]).map((it,i)=>`<tr><td>${i+1}</td><td>${escapeHtml(it.name)}</td><td>${it.qty}</td><td>${formatNumber(it.price,2)}</td><td>${formatNumber(it.total,2)}</td></tr>`).join('');
      backdrop.innerHTML = `
        <div class="modal">
          <div class="title">${type==='sale'?'فاتورة مبيعات':'فاتورة مشتريات'} ${escapeHtml(v.no)}</div>
          <div style="max-height:50vh;overflow:auto"><table class="table"><thead><tr><th>#</th><th>الصنف</th><th>الكمية</th><th>السعر</th><th>الإجمالي</th></tr></thead><tbody>${rows}</tbody></table></div>
          <div class="invoice-summary"><div><strong>الإجمالي:</strong> ${formatCurrency(v.total||0)}</div>${type==='sale'? `<div><strong>الربح:</strong> ${formatCurrency(v.profit||0)}</div>`:''}</div>
          <div class="actions"><button class="button" id="edit">تعديل</button><button class="button ghost" id="close">إغلاق</button></div>
        </div>`;
      document.body.appendChild(backdrop);
      const close=()=>backdrop.remove();
      backdrop.addEventListener('click', e=>{ if(e.target===backdrop) close(); });
      $('#close', backdrop).addEventListener('click', close);
      $('#edit', backdrop).addEventListener('click', ()=>{ close(); if(type==='sale') openSaleEdit(no); else openPurchEdit(no); });
    }
    function openPurchEdit(no){
      const v = purch.find(x=> String(x.no)===String(no)); if(!v) return;
      const boxes = loadCashboxes();
      const backdrop = document.createElement('div'); backdrop.className='modal-backdrop';
      backdrop.innerHTML = `
        <div class="modal">
          <div class="title">تعديل فاتورة مشتريات ${escapeHtml(v.no)}</div>
          <div class="grid cols-2">
            <div><label>اسم المورد</label><input class="input" id="pe_supplier" value="${escapeAttr(v.supplier||'')}"/></div>
            <div><label>التاريخ</label><input type="date" class="input" id="pe_date" value="${escapeAttr(v.date||'')}"/></div>
            <div><label>الصندوق</label><select class="input" id="pe_cashbox">${boxes.map(b=>`<option value="${b.id}" ${b.id===v.cashbox?'selected':''}>${escapeHtml(b.name)}</option>`).join('')}</select></div>
          </div>
          <div style="margin-top:10px">
            <div class="title" style="font-size:16px">عناصر الفاتورة</div>
            <div style="max-height:40vh;overflow:auto">
              <table class="table" id="pe_items">
                <thead><tr><th>#</th><th>الصنف</th><th>الكمية</th><th>سعر الشراء</th><th>الإجمالي</th><th>حذف</th></tr></thead>
                <tbody></tbody>
              </table>
            </div>
            <div class="invoice-summary"><div><strong>الإجمالي:</strong> <span id="pe_total"></span></div></div>
          </div>
          <div class="actions"><button class="button" id="save">حفظ</button><button class="button ghost" id="cancel">إلغاء</button></div>
        </div>`;
      document.body.appendChild(backdrop);
      const close=()=>backdrop.remove();
      backdrop.addEventListener('click', e=>{ if(e.target===backdrop) close(); });
      $('#cancel', backdrop).addEventListener('click', close);
      const work = JSON.parse(JSON.stringify(v.items||[]));
      function renderItems(){
        const tbody = $('#pe_items tbody', backdrop);
        tbody.innerHTML = work.map((it,i)=>{
          const total = Number(it.qty||0)*Number(it.price||0);
          return `<tr>
            <td>${i+1}</td>
            <td>${escapeHtml(it.name)}</td>
            <td><input type="number" min="1" step="1" value="${it.qty}" data-idx="${i}" data-field="qty" class="input" style="max-width:100px"/></td>
            <td><input type="number" step="0.01" value="${it.price}" data-idx="${i}" data-field="price" class="input" style="max-width:300px;font-size:16px"/></td>
            <td>${formatNumber(total,2)}</td>
            <td><button class="button ghost" data-idx="${i}" data-act="rm">حذف</button></td>
          </tr>`;
        }).join('');
        const sub = work.reduce((s,it)=> s + Number(it.qty||0)*Number(it.price||0), 0);
        $('#pe_total', backdrop).textContent = formatCurrency(sub);
        $$('#pe_items [data-act="rm"]', backdrop).forEach(b=> b.addEventListener('click', ()=>{ const i=Number(b.dataset.idx); work.splice(i,1); renderItems(); }));
        $$('#pe_items [data-field]', backdrop).forEach(inp=>{
          inp.addEventListener('change', ()=>{ const i=inp.dataset.idx; const f=inp.dataset.field; const v=Number(inp.value||0); if(f==='qty') work[i].qty=Math.max(1,Math.floor(v)); if(f==='price') work[i].price=Math.max(0,v); renderItems(); });
          inp.addEventListener('blur', ()=>{ const i=inp.dataset.idx; const f=inp.dataset.field; const v=Number(inp.value||0); if(f==='qty') work[i].qty=Math.max(1,Math.floor(v)); if(f==='price') work[i].price=Math.max(0,v); renderItems(); });
        });
      }
      renderItems();
      $('#save', backdrop).addEventListener('click', ()=>{
        const products = loadProducts();
        const sourceNo = v.no;
        // Ensure all original lot quantities from this invoice are still fully available
        for(const old of (v.items||[])){
          const p = products.find(x=> String(x.barcode||x.name)===String(old.code));
          if(!p) continue; migrateLotsIfNeeded(p);
          const lots = findLotsBySource(p, sourceNo).filter(l=> Number(l.price)===Number(old.price));
          const avail = lots.reduce((s,l)=> s + Number(l.qty||0), 0);
            if(avail < Number(old.qty||0)){
              alert(`لا يمكن تعديل هذه الفاتورة لأن جزءًا من كمية الصنف "${old.name}" (السعر ${formatNumber(old.price,2)}) قد تم استهلاكه في المبيعات.`);
              return;
            }
        }
        // Remove all lots that originated from this invoice
        for(const old of (v.items||[])){
          const p = products.find(x=> String(x.barcode||x.name)===String(old.code));
          if(!p) continue;
          removeLotsBySource(p, sourceNo);
        }
        // Add new revised lots with same sourceNo
        const newItems = work.map(it=>({ code:it.code, name:it.name, qty:Number(it.qty||0), price:Number(it.price||0), total:Number(it.qty||0)*Number(it.price||0) }));
        for(const it of newItems){
          const p = products.find(x=> String(x.barcode||x.name)===String(it.code));
          if(!p) continue; fifoAddLotDetailed(p, it.qty, it.price, sourceNo);
        }
        saveProducts(products);
        v.supplier = $('#pe_supplier', backdrop).value.trim();
        v.date = $('#pe_date', backdrop).value;
        v.cashbox = $('#pe_cashbox', backdrop).value;
        v.items = newItems;
        v.total = v.items.reduce((s,it)=> s + it.total, 0);
        savePurchases(purch);
        recomputeBalances();
        close();
        rerender();
      });
    }
    function openSaleEdit(no){
      const v = sales.find(x=> String(x.no)===String(no)); if(!v) return;
      const boxes = loadCashboxes();
      const backdrop = document.createElement('div'); backdrop.className='modal-backdrop';
      backdrop.innerHTML = `
        <div class="modal">
          <div class="title">تعديل فاتورة مبيعات ${escapeHtml(v.no)}</div>
          <div class="grid cols-2">
            <div><label>اسم العميل</label><input class="input" id="e_customer" value="${escapeAttr(v.customer||'')}"/></div>
            <div><label>التاريخ</label><input type="date" class="input" id="e_date" value="${escapeAttr(v.date||'')}"/></div>
            <div><label>نوع الدفع</label><select class="input" id="e_payment"><option value="bank" ${v.payment==='bank'?'selected':''}>بنكي</option><option value="cash" ${v.payment==='cash'?'selected':''}>نقدي</option></select></div>
            <div><label>حالة الدفع</label><select class="input" id="e_status"><option value="unpaid" ${v.status!=='paid'?'selected':''}>لم يتم الدفع</option><option value="paid" ${v.status==='paid'?'selected':''}>تم الدفع</option></select></div>
            <div><label>الصندوق</label><select class="input" id="e_cashbox">${boxes.map(b=>`<option value="${b.id}" ${b.id===v.cashbox?'selected':''}>${escapeHtml(b.name)}</option>`).join('')}</select></div>
          </div>
          <div style="margin-top:10px">
            <div class="title" style="font-size:16px">عناصر الفاتورة</div>
            <div style="max-height:40vh;overflow:auto">
              <table class="table" id="e_items">
                <thead><tr><th>#</th><th>الصنف</th><th>الكمية</th><th>السعر</th><th>الإجمالي</th><th>حذف</th></tr></thead>
                <tbody></tbody>
              </table>
            </div>
            <div class="invoice-summary"><div><strong>الإجمالي:</strong> <span id="e_total"></span></div><div><strong>الربح (تقديري):</strong> <span id="e_profit"></span></div></div>
          </div>
          <div class="actions"><button class="button" id="save">حفظ</button><button class="button ghost" id="cancel">إلغاء</button></div>
        </div>`;
      document.body.appendChild(backdrop);
      const close=()=>backdrop.remove();
      backdrop.addEventListener('click', e=>{ if(e.target===backdrop) close(); });
      $('#cancel', backdrop).addEventListener('click', close);
      const work = JSON.parse(JSON.stringify(v.items||[]));
      function renderItems(){
        const tbody = $('#e_items tbody', backdrop);
        tbody.innerHTML = work.map((it,i)=>{
          const total = Number(it.qty||0)*Number(it.price||0);
          return `<tr>
            <td>${i+1}</td>
            <td>${escapeHtml(it.name)}</td>
            <td><input type="number" min="1" step="1" value="${it.qty}" data-idx="${i}" data-field="qty" class="input" style="max-width:100px"/></td>
            <td><input type="number" step="0.01" value="${it.price}" data-idx="${i}" data-field="price" class="input" style="max-width:160px"/></td>
            <td>${formatNumber(total,2)}</td>
            <td><button class="button ghost" data-idx="${i}" data-act="rm">حذف</button></td>
          </tr>`;
        }).join('');
        // totals + est profit FIFO
        const sub = work.reduce((s,it)=> s + Number(it.qty||0)*Number(it.price||0), 0);
        $('#e_total', backdrop).textContent = formatCurrency(sub);
        const products = loadProducts();
        const estCogs = fifoPeekCOGSMap(products, work.map(it=>({ code: it.code, qty: it.qty }))); 
        $('#e_profit', backdrop).textContent = formatCurrency(sub - estCogs);
        // events
        $$('#e_items [data-act="rm"]', backdrop).forEach(b=> b.addEventListener('click', ()=>{ const i=Number(b.dataset.idx); work.splice(i,1); renderItems(); }));
        $$('#e_items [data-field]', backdrop).forEach(inp=>{
          inp.addEventListener('change', ()=>{ const i=inp.dataset.idx; const f=inp.dataset.field; const v=Number(inp.value||0); if(f==='qty') work[i].qty=Math.max(1,Math.floor(v)); if(f==='price') work[i].price=Math.max(0,v); renderItems(); });
          inp.addEventListener('blur', ()=>{ const i=inp.dataset.idx; const f=inp.dataset.field; const v=Number(inp.value||0); if(f==='qty') work[i].qty=Math.max(1,Math.floor(v)); if(f==='price') work[i].price=Math.max(0,v); renderItems(); });
        });
      }
      renderItems();
      $('#save', backdrop).addEventListener('click', ()=>{
        v.customer = $('#e_customer', backdrop).value.trim();
        v.date = $('#e_date', backdrop).value;
        v.payment = $('#e_payment', backdrop).value;
        v.status = $('#e_status', backdrop).value;
        v.cashbox = $('#e_cashbox', backdrop).value;
        // adjust inventory: return previous consumed lots, then consume new quantities FIFO
        const products = loadProducts();
        for(const old of (v.items||[])){
          if(Array.isArray(old.consumed) && old.consumed.length){
            const p = products.find(x=> String(x.barcode||x.name)===String(old.code));
            if(p) restoreLotsFront(p, old.consumed);
          }
        }
        // validate availability for new quantities after rollback
        for(const it of work){
          const p = products.find(x=> String(x.barcode||x.name)===String(it.code));
          if(!p) continue; ensureProductLots(p);
          const avail = lotsTotalQty(p);
          if(avail < Number(it.qty||0)){
            alert(`الكمية المطلوبة غير متاحة بعد التعديل للصنف: ${it.name}`);
            return;
          }
        }
        // apply work, then consume and compute real COGS
        const newItems = work.map(it=>({ code:it.code, name:it.name, qty:Number(it.qty||0), price:Number(it.price||0) }));
        let cogsTotal = 0; const consumedMap = {};
        for(const it of newItems){
          const p = products.find(x=> String(x.barcode||x.name)===String(it.code));
          if(!p) continue; const r = fifoConsumeBreakdown(p, it.qty); cogsTotal += r.cogs; consumedMap[it.code]=r.parts; it.total = it.qty*it.price; it.buy = undefined; it.consumed = r.parts;
        }
        saveProducts(products);
        v.items = newItems;
        v.total = newItems.reduce((s,it)=> s + it.total, 0);
        v.profit = v.total - cogsTotal;
        saveSales(sales);
        recomputeBalances();
        close();
        rerender();
      });
    }
    function markSalePaid(no){
      const v = sales.find(x=> String(x.no)===String(no)); if(!v) return;
  v.status='paid'; saveSales(sales); recomputeBalances(); rerender();
    }
    function rerender(){ if(activeTab==='sales') renderSalesTable(); else renderPurchTable(); }
    $('#tab_sales').addEventListener('click', ()=>{ activeTab='sales'; $('#tab_sales').classList.remove('ghost'); $('#tab_purch').classList.add('ghost'); rerender(); });
    $('#tab_purch').addEventListener('click', ()=>{ activeTab='purch'; $('#tab_purch').classList.remove('ghost'); $('#tab_sales').classList.add('ghost'); rerender(); });
  $('#inv_search').addEventListener('input', rerender);
  $('#inv_sort').addEventListener('change', rerender);
  $('#inv_paid').addEventListener('change', rerender);
    $('#inv_apply').addEventListener('click', rerender);
    $('#inv_reset').addEventListener('click', ()=>{
      $('#inv_from').value='';
      $('#inv_to').value='';
      $('#inv_min').value='';
      $('#inv_max').value='';
      $('#inv_search').value='';
      $('#inv_paid').value='all';
      $('#inv_sort').value='date_desc';
      rerender();
    });
    rerender();
  } else if(key==='expenses'){
    const today = new Date().toISOString().slice(0,10);
    const boxes = loadCashboxes();
    content.innerHTML = breadcrumb + `
      <div class="panel">
        <div class="title">إضافة مصروف</div>
        <div class="grid cols-4" style="margin-top:8px">
          <input class="input" id="ex_name" placeholder="اسم المصروف" />
          <input type="number" class="input" id="ex_amount" placeholder="المبلغ" />
          <input class="input" id="ex_note" placeholder="البيان (اختياري)" />
          <input type="date" class="input" id="ex_date" value="${today}" />
          <select class="input" id="ex_cashbox">
            <option value="">اختر الصندوق</option>
            ${boxes.map(b=>`<option value="${b.id}">${escapeHtml(b.name)} — ${formatCurrency(b.balance)}</option>`).join('')}
          </select>
        </div>
        <div class="actions" style="margin-top:8px"><button class="button" id="ex_add">إضافة</button></div>
      </div>
      <div class="panel" style="margin-top:12px">
        <div class="toolbar" style="justify-content:space-between">
          <span class="badge">قائمة المصروفات</span>
          <div class="searchbar" style="gap:6px">
            <input type="date" class="input" id="ef_from" />
            <input type="date" class="input" id="ef_to" />
            <input class="input" id="ef_name" placeholder="بحث بالاسم/البيان" />
            <select class="input" id="ef_cashbox"><option value="">كل الصناديق</option>${boxes.map(b=>`<option value="${b.id}">${escapeHtml(b.name)}</option>`).join('')}</select>
            <button class="button ghost" id="ef_apply">تصفية</button>
            <button class="button" id="ex_export" style="background:#2b7">تصدير</button>
          </div>
        </div>
        <div id="ex_list">لا مصروفات بعد.</div>
      </div>`;
    function renderExpenses(){
      const arr = loadExpenses();
      const df = $('#ef_from').value; const dt = $('#ef_to').value;
      const q = ($('#ef_name').value||'').trim().toLowerCase();
      const cb = $('#ef_cashbox').value;
      const rows = arr.filter(e=>{
        let ok = true;
        if(df) ok = ok && (String(e.date||'') >= df);
        if(dt) ok = ok && (String(e.date||'') <= dt);
        if(q) ok = ok && (String(e.name||'').toLowerCase().includes(q) || String(e.note||'').toLowerCase().includes(q));
        if(cb) ok = ok && (String(e.cashbox||'')===cb);
        return ok;
      }).sort((a,b)=> String(b.date||'').localeCompare(String(a.date||'')));
      const total = rows.reduce((s,e)=> s + Number(e.amount||0), 0);
      let html = '';
      if(!rows.length){
        html = 'لا مصروفات بعد.';
      } else {
        html = `
          <div style="overflow:auto">
            <table class="table">
              <thead><tr><th>التاريخ</th><th>الاسم</th><th>المبلغ</th><th>البيان</th><th>الصندوق</th><th>تعديل</th></tr></thead>
              <tbody>
                ${rows.map(e=>`<tr>
                  <td>${escapeHtml(e.date||'')}</td>
                  <td>${escapeHtml(e.name||'')}</td>
                  <td>${formatCurrency(e.amount||0)}</td>
                  <td>${escapeHtml(e.note||'')}</td>
                  <td>${escapeHtml((boxes.find(b=> b.id===e.cashbox)||{}).name||'')}</td>
                  <td><button class="button ghost" data-id="${e.id}" data-act="edit">تعديل</button></td>
                </tr>`).join('')}
              </tbody>
            </table>
          </div>
          <div class="invoice-summary"><div><strong>إجمالي المصروفات:</strong> ${formatCurrency(total)}</div></div>`;
      }
      // توزيعات الأرباح
      const dists = loadDistributions();
      let distPanel = '';
      if(dists.length){
        const totalMgmt = dists.reduce((s,d)=> s + Number(d.mgmtFeeValue||0), 0);
        const totalPaid = dists.reduce((s,d)=> s + Number(d.totalPaidOut||0), 0);
        const totalReinv = dists.reduce((s,d)=> s + Number(d.totalReinvested||0), 0);
        distPanel = `<div class="panel" style="margin-top:14px"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px"><div class="title" style="font-weight:700">توزيعات أرباح</div></div><div style="overflow:auto"><table class="table"><thead><tr><th>التاريخ</th><th>صافي قبل</th><th>حصة الإدارة</th><th>قابل للتوزيع</th><th>نقدي</th><th>معاد استثماره</th></tr></thead><tbody>${dists.slice().sort((a,b)=> String(b.date||'').localeCompare(String(a.date||''))).map(d=>`<tr><td>${escapeHtml(d.date||'')}</td><td>${formatCurrency(d.totalNetProfitBefore||0)}</td><td>${formatCurrency(d.mgmtFeeValue||0)}</td><td>${formatCurrency(d.distributable||0)}</td><td>${formatCurrency(d.totalPaidOut||0)}</td><td>${formatCurrency(d.totalReinvested||0)}</td></tr>`).join('')}</tbody></table></div><div class="invoice-summary"><div><strong>الإدارة:</strong> ${formatCurrency(totalMgmt)}</div><div><strong>نقدي:</strong> ${formatCurrency(totalPaid)}</div><div><strong>معاد:</strong> ${formatCurrency(totalReinv)}</div></div></div>`;
      } else {
        distPanel = '<div class="panel" style="margin-top:14px"><div class="title" style="font-weight:700;margin-bottom:6px">توزيعات أرباح</div><div>لا توزيعات بعد.</div></div>';
      }
      $('#ex_list').innerHTML = html + distPanel;
      $$('#ex_list [data-act="edit"]').forEach(b=> b.addEventListener('click', ()=> openEditExpense(b.dataset.id)));
    }
    function openEditExpense(id){
      const arr = loadExpenses();
      const e = arr.find(x=> x.id===id); if(!e) return;
      const backdrop = document.createElement('div'); backdrop.className='modal-backdrop';
      backdrop.innerHTML = `
        <div class="modal">
          <div class="title">تعديل مصروف</div>
          <div class="grid cols-2">
            <input class="input" id="ee_name" value="${escapeAttr(e.name||'')}"/>
            <input type="number" class="input" id="ee_amount" value="${Number(e.amount||0)}"/>
            <input class="input" id="ee_note" value="${escapeAttr(e.note||'')}"/>
            <input type="date" class="input" id="ee_date" value="${escapeAttr(e.date||'')}"/>
            <select class="input" id="ee_cashbox">${boxes.map(b=>`<option value="${b.id}" ${b.id===e.cashbox?'selected':''}>${escapeHtml(b.name)}</option>`).join('')}</select>
          </div>
          <div class="actions"><button class="button" id="save">حفظ</button><button class="button ghost" id="del">حذف</button><button class="button ghost" id="cancel">إلغاء</button></div>
        </div>`;
      document.body.appendChild(backdrop);
      const close=()=>backdrop.remove();
      backdrop.addEventListener('click', e=>{ if(e.target===backdrop) close(); });
      $('#cancel', backdrop).addEventListener('click', close);
      $('#del', backdrop).addEventListener('click', ()=>{
        const arr = loadExpenses();
        const i = arr.findIndex(x=> x.id===id); if(i>=0) arr.splice(i,1);
        saveExpenses(arr); close(); renderExpenses();
      });
      $('#save', backdrop).addEventListener('click', ()=>{
        const arr = loadExpenses();
        const i = arr.findIndex(x=> x.id===id); if(i<0) return;
        arr[i].name = $('#ee_name', backdrop).value.trim();
        arr[i].amount = Number($('#ee_amount', backdrop).value||0);
        arr[i].note = $('#ee_note', backdrop).value;
        arr[i].date = $('#ee_date', backdrop).value;
        arr[i].cashbox = $('#ee_cashbox', backdrop).value;
        saveExpenses(arr); close(); renderExpenses();
      });
    }
    $('#ex_add').addEventListener('click', ()=>{
      const name = $('#ex_name').value.trim();
      const amount = Number($('#ex_amount').value||0);
      const note = $('#ex_note').value;
      const date = $('#ex_date').value;
      const cashbox = $('#ex_cashbox').value;
      if(!name){ alert('أدخل اسم المصروف'); return; }
      if(!(amount>0)){ alert('أدخل مبلغاً صحيحاً'); return; }
      if(!cashbox){ alert('اختر الصندوق'); return; }
      const arr = loadExpenses(); arr.push({ id:'EX'+Date.now(), name, amount, note, date, cashbox }); saveExpenses(arr);
      recomputeBalances();
      $('#ex_name').value=''; $('#ex_amount').value=''; $('#ex_note').value=''; $('#ex_date').value=today; renderExpenses();
    });
    $('#ef_apply').addEventListener('click', renderExpenses);
    // تصدير المصروفات المفلترة
    document.getElementById('ex_export').addEventListener('click', ()=>{
      try{
        if(typeof XLSX==='undefined'){ alert('مكتبة Excel غير متوفرة'); return; }
        const arr = loadExpenses();
        const df = $('#ef_from').value; const dt = $('#ef_to').value; const q = ($('#ef_name').value||'').trim().toLowerCase(); const cb = $('#ef_cashbox').value;
        const rows = arr.filter(e=>{
          let ok = true;
          if(df) ok = ok && (String(e.date||'') >= df);
          if(dt) ok = ok && (String(e.date||'') <= dt);
            if(q) ok = ok && (String(e.name||'').toLowerCase().includes(q) || String(e.note||'').toLowerCase().includes(q));
          if(cb) ok = ok && (String(e.cashbox||'')===cb); return ok; });
        if(!rows.length){ alert('لا توجد بيانات مطابقة للفلتر'); return; }
        const boxesMap = Object.fromEntries(boxes.map(b=>[b.id,b.name]));
        const aoa = [['التاريخ','الاسم','المبلغ','البيان','الصندوق']];
        rows.forEach(e=> aoa.push([e.date||'', e.name||'', Number(e.amount||0), e.note||'', boxesMap[e.cashbox]||e.cashbox||'']));
        const ws = XLSX.utils.aoa_to_sheet(aoa); const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, 'Expenses'); XLSX.writeFile(wb, 'expenses_filtered.xlsx');
      }catch(err){ alert('تعذر تصدير المصروفات: '+(err.message||err)); console.error(err); }
    });
    renderExpenses();
  } else if(key==='accounts'){
    const today = new Date().toISOString().slice(0,10);
    let categories = loadAccountCategories();
    if(!categories.length) categories = ['سداد دين','مواصلات','أخذ من المبلغ كسلفة بسيطة','إيداع','سحب','أخرى'];
    const boxes = loadCashboxes();
    content.innerHTML = breadcrumb + `
      <div class="panel">
        <div class="title">تسجيل حركة</div>
        <div class="grid cols-6" style="margin-top:8px">
          <input type="date" class="input" id="acc_date" value="${today}" />
          <select class="input" id="acc_type">
            <option value="in">قبض (زيادة)</option>
            <option value="out">صرف (نقص)</option>
          </select>
          <input type="number" class="input" id="acc_amount" placeholder="المبلغ" />
          <input class="input" id="acc_cat" list="acc_cat_list" placeholder="اختر أو أضف تصنيف" />
          <datalist id="acc_cat_list">
            ${categories.map(c=>`<option value="${escapeAttr(c)}">`).join('')}
          </datalist>
          <input class="input" id="acc_person" placeholder="اسم الشخص (اختياري)" />
          <select class="input" id="acc_box"><option value="">بدون صندوق</option>${boxes.map(b=>`<option value="${escapeAttr(b.id)}">${escapeHtml(b.name)}</option>`).join('')}</select>
          <input class="input" id="acc_note" placeholder="البيان / الوصف" />
        </div>
        <div class="actions" style="margin-top:8px"><button class="button" id="acc_add">إضافة</button></div>
        <div style="margin-top:8px;font-size:13px;color:#555">يمكنك كتابة تصنيف جديد وسيتم حفظه تلقائياً.</div>
      </div>
      <div class="panel" style="margin-top:12px">
        <div class="toolbar" style="justify-content:space-between">
          <span class="badge">سجل الحركات</span>
          <div class="searchbar" style="gap:6px">
            <input type="date" class="input" id="af_from" />
            <input type="date" class="input" id="af_to" />
            <select class="input" id="af_type">
              <option value="">كل الأنواع</option>
              <option value="in">قبض</option>
              <option value="out">صرف</option>
            </select>
            <select class="input" id="af_cat"><option value="">كل التصنيفات</option>${categories.map(c=>`<option value="${escapeAttr(c)}">${escapeHtml(c)}</option>`).join('')}</select>
            <input class="input" id="af_person" placeholder="بحث باسم الشخص" />
            <select class="input" id="af_box"><option value="">كل الصناديق</option>${boxes.map(b=>`<option value="${escapeAttr(b.id)}">${escapeHtml(b.name)}</option>`).join('')}</select>
            <input class="input" id="af_q" placeholder="بحث في البيان" />
            <button class="button ghost" id="af_apply">تصفية</button>
            <button class="button ghost" id="af_reset">مسح</button>
            <button class="button" id="af_export">تصدير Excel</button>
          </div>
        </div>
        <div id="acc_list">لا حركات بعد.</div>
      </div>`;
    function renderAccountLogs(){
      const arr = loadAccountLogs();
      const df = $('#af_from').value; const dt = $('#af_to').value;
      const tp = $('#af_type').value; const cat = $('#af_cat').value; const q = ($('#af_q').value||'').trim().toLowerCase();
      const person = ($('#af_person').value||'').trim().toLowerCase();
      const box = $('#af_box').value;
      const rows = arr.filter(r=>{
        let ok=true;
        if(df) ok = ok && (String(r.date||'') >= df);
        if(dt) ok = ok && (String(r.date||'') <= dt);
        if(tp) ok = ok && (r.type===tp);
        if(cat) ok = ok && (r.category===cat);
        if(person) ok = ok && String(r.person||'').toLowerCase().includes(person);
        if(box) ok = ok && (r.box===box);
        if(q) ok = ok && String(r.note||'').toLowerCase().includes(q);
        return ok;
      }).sort((a,b)=> String(b.date||'').localeCompare(String(a.date||'')) || String(b.id).localeCompare(String(a.id)) );
      if(!rows.length){ $('#acc_list').innerHTML='لا حركات بعد.'; return; }
      const totalIn = rows.filter(r=> r.type==='in').reduce((s,r)=> s + Number(r.amount||0),0);
      const totalOut = rows.filter(r=> r.type==='out').reduce((s,r)=> s + Number(r.amount||0),0);
      const balance = totalIn - totalOut;
      $('#acc_list').innerHTML = `
        <div style="overflow:auto">
          <table class="table">
            <thead><tr><th>التاريخ</th><th>النوع</th><th>التصنيف</th><th>الشخص</th><th>الصندوق</th><th>المبلغ</th><th>البيان</th><th>تعديل</th></tr></thead>
            <tbody>
              ${rows.map(r=>`<tr>
                <td>${escapeHtml(r.date||'')}</td>
                <td>${r.type==='in'?'قبض':'صرف'}</td>
                <td>${escapeHtml(r.category||'')}</td>
                <td>${escapeHtml(r.person||'')}</td>
                <td>${escapeHtml((boxes.find(b=> b.id===r.box)||{}).name||'')}</td>
                <td>${formatCurrency(r.amount||0)}</td>
                <td>${escapeHtml(r.note||'')}</td>
                <td><button class="button ghost" data-id="${r.id}" data-act="edit">تعديل</button></td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
        <div class="invoice-summary"><div><strong>إجمالي القبض:</strong> ${formatCurrency(totalIn)}</div><div><strong>إجمالي الصرف:</strong> ${formatCurrency(totalOut)}</div><div><strong>صافي:</strong> ${formatCurrency(balance)}</div></div>`;
      $$('#acc_list [data-act="edit"]').forEach(b=> b.addEventListener('click', ()=> openEditAccLog(b.dataset.id)));
    }
    function openEditAccLog(id){
      const arr = loadAccountLogs(); const idx = arr.findIndex(x=> String(x.id)===String(id)); if(idx<0) return;
      const v = arr[idx];
      const boxes = loadCashboxes();
      let categories = loadAccountCategories();
      if(!categories.length) categories = ['سداد دين','مواصلات','أخذ من المبلغ كسلفة بسيطة','إيداع','سحب','أخرى'];
      const backdrop = document.createElement('div'); backdrop.className='modal-backdrop';
      backdrop.innerHTML = `
        <div class="modal">
          <div class="title">تعديل حركة</div>
          <div class="grid cols-2">
            <input type="date" class="input" id="ed_date" value="${escapeAttr(v.date||'')}" />
            <select class="input" id="ed_type"><option value="in" ${v.type==='in'?'selected':''}>قبض</option><option value="out" ${v.type==='out'?'selected':''}>صرف</option></select>
            <input type="number" class="input" id="ed_amount" value="${Number(v.amount||0)}" />
            <input class="input" id="ed_cat" list="ed_cat_list" value="${escapeAttr(v.category||'')}" placeholder="اختر أو أضف تصنيف" />
            <datalist id="ed_cat_list">${categories.map(c=>`<option value="${escapeAttr(c)}">`).join('')}</datalist>
            <input class="input" id="ed_person" value="${escapeAttr(v.person||'')}" placeholder="اسم الشخص (اختياري)" />
            <select class="input" id="ed_box"><option value="">بدون صندوق</option>${boxes.map(b=>`<option value="${escapeAttr(b.id)}" ${v.box===b.id?'selected':''}>${escapeHtml(b.name)}</option>`).join('')}</select>
            <input class="input" id="ed_note" value="${escapeAttr(v.note||'')}" />
          </div>
          <div class="actions"><button class="button" id="save">حفظ</button><button class="button ghost" id="del">حذف</button><button class="button ghost" id="cancel">إلغاء</button></div>
        </div>`;
      document.body.appendChild(backdrop);
      const close=()=>backdrop.remove();
      backdrop.addEventListener('click', e=>{ if(e.target===backdrop) close(); });
      $('#cancel', backdrop).addEventListener('click', close);
      $('#del', backdrop).addEventListener('click', ()=>{ arr.splice(idx,1); saveAccountLogs(arr); close(); renderAccountLogs(); });
      $('#save', backdrop).addEventListener('click', ()=>{
        v.date = $('#ed_date', backdrop).value;
        v.type = $('#ed_type', backdrop).value;
        v.amount = Number($('#ed_amount', backdrop).value||0);
        v.category = $('#ed_cat', backdrop).value.trim();
        v.person = $('#ed_person', backdrop).value.trim();
        v.box = $('#ed_box', backdrop).value;
        v.note = $('#ed_note', backdrop).value.trim();
        // إضافة التصنيف الجديد إن لم يكن موجوداً
        if(v.category && !categories.includes(v.category)){
          categories.push(v.category); saveAccountCategories(categories);
        }
        saveAccountLogs(arr); close(); renderAccountLogs();
      });
    }
    $('#acc_add').addEventListener('click', ()=>{
      const date=$('#acc_date').value; const type=$('#acc_type').value; const amount=Number($('#acc_amount').value||0);
      const category=$('#acc_cat').value.trim();
      const person=$('#acc_person').value.trim();
      const box=$('#acc_box').value;
      const note=$('#acc_note').value.trim();
      if(!date){ alert('حدد التاريخ'); return; }
      if(!(amount>0)){ alert('أدخل مبلغاً صحيحاً'); return; }
      const arr = loadAccountLogs();
      arr.push({ id:'AC'+Date.now(), date, type, amount, category, person, box, note });
      // إضافة التصنيف الجديد إن لم يكن موجوداً
      let categories = loadAccountCategories();
      if(!categories.length) categories = ['سداد دين','مواصلات','أخذ من المبلغ كسلفة بسيطة','إيداع','سحب','أخرى'];
      if(category && !categories.includes(category)){
        categories.push(category); saveAccountCategories(categories);
      }
      saveAccountLogs(arr);
      $('#acc_amount').value=''; $('#acc_note').value=''; $('#acc_person').value='';
      renderAccountLogs();
    });
    $('#af_apply').addEventListener('click', renderAccountLogs);
    $('#af_reset').addEventListener('click', ()=>{ $('#af_from').value=''; $('#af_to').value=''; $('#af_type').value=''; $('#af_cat').value=''; $('#af_person').value=''; $('#af_box').value=''; $('#af_q').value=''; renderAccountLogs(); });
    $('#af_export').addEventListener('click', ()=>{
      try{
        if(typeof XLSX==='undefined'){ alert('مكتبة Excel غير متوفرة'); return; }
        const arr = loadAccountLogs();
        const boxes = loadCashboxes();
        const rows = arr.map(r=>[r.date, r.type==='in'?'قبض':'صرف', r.category, r.person||'', (boxes.find(b=> b.id===r.box)||{}).name||'', r.amount, r.note||'']);
        const header=['التاريخ','النوع','التصنيف','الشخص','الصندوق','المبلغ','البيان'];
        const ws = XLSX.utils.aoa_to_sheet([header, ...rows]); const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, 'Accounts'); XLSX.writeFile(wb, 'accounts_log.xlsx');
      }catch(e){ alert('تعذر التصدير: '+(e.message||e)); }
    });
    renderAccountLogs();
  } else if(key==='settings'){
    const settings = loadSettings();
    const boxes = loadCashboxes();
    // تهيئة الأرصدة الابتدائية الافتراضية إذا غير موجودة
    if(!settings.openingBalances){
      settings.openingBalances = { sales:0, purchases:0, expenses:0, profit:0, debts:0 };
      saveSettings(settings);
    }
    content.innerHTML = breadcrumb + `
      <div class="panel">
        <div class="title">الإعدادات</div>
        <div class="grid cols-2" style="margin-top:8px">
          <div>
            <label>الصندوق الافتراضي للبيع النقدي</label>
            <select class="input" id="st_cash">
              <option value="">— لا شيء —</option>
              ${boxes.map(b=>`<option value="${b.id}" ${settings.defaultCashSaleBox===b.id?'selected':''}>${escapeHtml(b.name)} — ${formatCurrency(b.balance)}</option>`).join('')}
            </select>
          </div>
          <div>
            <label>الصندوق الافتراضي للبيع البنكي</label>
            <select class="input" id="st_bank">
              <option value="">— لا شيء —</option>
              ${boxes.map(b=>`<option value="${b.id}" ${settings.defaultBankSaleBox===b.id?'selected':''}>${escapeHtml(b.name)} — ${formatCurrency(b.balance)}</option>`).join('')}
            </select>
          </div>
        </div>
        <hr style="margin:16px 0" />
        <div style="font-weight:700;margin-bottom:6px">الأرصدة الابتدائية (تضاف إلى الإحصائيات)</div>
        <div class="grid cols-5" style="row-gap:12px">
          <div>
            <label style="font-size:12px">مبيعات افتتاحية</label>
            <input type="number" class="input" id="ob_sales" value="${settings.openingBalances.sales||0}" />
          </div>
          <div>
            <label style="font-size:12px">مشتريات افتتاحية</label>
            <input type="number" class="input" id="ob_purchases" value="${settings.openingBalances.purchases||0}" />
          </div>
          <div>
            <label style="font-size:12px">مصروفات افتتاحية</label>
            <input type="number" class="input" id="ob_expenses" value="${settings.openingBalances.expenses||0}" />
          </div>
          <div>
            <label style="font-size:12px">ربح سابق</label>
            <input type="number" class="input" id="ob_profit" value="${settings.openingBalances.profit||0}" />
          </div>
          <div>
            <label style="font-size:12px">ديون افتتاحية صافية</label>
            <input type="number" class="input" id="ob_debts" value="${settings.openingBalances.debts||0}" />
          </div>
        </div>
        <div class="mini" style="margin-top:6px;color:var(--text-soft)">يتم استخدام هذه القيم لدمج أنشطة سابقة قبل استخدام النظام. تظهر كمجاميع إضافية في تبويب الإحصائيات فقط، ولا تُنشئ فواتير فعلية.</div>
        <div class="actions" style="margin-top:12px">
          <button class="button" id="st_save">حفظ</button>
        </div>
      </div>
      <div class="panel">
        <div class="title">النسخ الاحتياطي والاستيراد</div>
        <div class="grid cols-2" style="margin-top:8px">
          <div>
            <button class="button" id="bk_export_json">تنزيل نسخة بيانات JSON</button>
          </div>
          <div>
            <input type="file" class="input" id="bk_import_json" accept="application/json"/>
            <button class="button ghost" id="bk_do_import">استيراد JSON</button>
          </div>
        </div>
      </div>
      <div class="panel">
        <div class="title">نسخة مضغوطة للموقع</div>
        <div><button class="button" id="bk_export_zip">تنزيل ZIP</button></div>
      </div>`;
    $('#st_save').addEventListener('click', ()=>{
      const s = loadSettings();
      s.defaultCashSaleBox = $('#st_cash').value||'';
      s.defaultBankSaleBox = $('#st_bank').value||'';
      // حفظ الأرصدة الابتدائية
      const ob = s.openingBalances || { sales:0, purchases:0, expenses:0, profit:0, debts:0 };
      ob.sales = Number($('#ob_sales').value||0);
      ob.purchases = Number($('#ob_purchases').value||0);
      ob.expenses = Number($('#ob_expenses').value||0);
      ob.profit = Number($('#ob_profit').value||0);
      ob.debts = Number($('#ob_debts').value||0);
      s.openingBalances = ob;
      saveSettings(s);
      alert('تم الحفظ');
      // تحديث البطاقات العلوية في حال كنا في تبويب المنتجات
      try{ renderTopStats(); }catch{}
    });
    $('#bk_export_json').addEventListener('click', ()=>{
      const data = {
        products: loadProducts(),
        sales: loadSales(),
        purchases: loadPurchases(),
        cashboxes: loadCashboxes(),
        transfers: loadTransfers(),
        expenses: loadExpenses(),
        settings: loadSettings(),
      };
      const blob = new Blob([JSON.stringify(data,null,2)], {type:'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `backup_${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    });
    $('#bk_do_import').addEventListener('click', async ()=>{
      const f = $('#bk_import_json').files[0]; if(!f){ alert('اختر ملف JSON'); return; }
      try{
        const text = await f.text();
        const data = JSON.parse(text);
        if(data.products){
          // normalize lots for FIFO
          data.products.forEach(p=>{ ensureProductLots(p); if((p.lots||[]).length===0 && Number(p.stock||0)>0){ p.lots=[{ qty:Number(p.stock||0), price:Number(p.buyPrice||0) }]; } });
          saveProducts(data.products);
        }
        if(data.sales) saveSales(data.sales);
        if(data.purchases) savePurchases(data.purchases);
        if(data.cashboxes) saveCashboxes(data.cashboxes);
        if(data.transfers) saveTransfers(data.transfers);
  if(data.expenses) saveExpenses(data.expenses);
        if(data.settings) saveSettings(data.settings);
        recomputeBalances();
        alert('تم الاستيراد');
      }catch(e){ alert('فشل الاستيراد: '+ (e.message||e)); }
    });
    $('#bk_export_zip').addEventListener('click', async ()=>{
      try{
        if(typeof JSZip==='undefined'){ alert('JSZip غير محمل'); return; }
        const zip = new JSZip();
        const data = {
          products: loadProducts(),
          sales: loadSales(),
          purchases: loadPurchases(),
          cashboxes: loadCashboxes(),
          transfers: loadTransfers(),
          settings: loadSettings(),
        };
        zip.file('data.json', JSON.stringify(data,null,2));
        zip.file('README.txt', 'This ZIP contains your app data in data.json. Restore via settings import.');
        const blob = await zip.generateAsync({type:'blob'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `site_backup_${new Date().toISOString().slice(0,10)}.zip`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
      }catch(e){ alert('تعذر إنشاء ZIP: '+(e.message||e)); }
    });
  } else if(key==='calculator'){
    content.innerHTML = breadcrumb + `
      <div class="section-title-bar">الآلة الحاسبة <small>عمليات فورية + سجل</small></div>
      <div class="calc-wrapper">
        <div class="calc-box" id="calc_box">
          <div class="calc-display" id="calc_display"><div class="expr" id="calc_expr">0</div><div class="result" id="calc_result">0</div></div>
          <div class="calc-toolbar">
            <button class="button ghost" id="calc_copy" title="نسخ النتيجة">نسخ</button>
            <button class="button ghost" id="calc_mc" title="مسح الذاكرة">MC</button>
            <button class="button ghost" id="calc_mr" title="استرجاع الذاكرة">MR</button>
            <button class="button ghost" id="calc_mplus" title="إضافة إلى الذاكرة">M+</button>
            <span class="calc-mem-indicator" id="calc_mem_ind"></span>
          </div>
          <div class="calc-keys" id="calc_keys">
            <button class="calc-key fn" data-k="C">C</button>
            <button class="calc-key fn" data-k="CE">CE</button>
            <button class="calc-key fn" data-k="BS">⌫</button>
            <button class="calc-key op" data-k="/">÷</button>
            <button class="calc-key" data-k="7">7</button>
            <button class="calc-key" data-k="8">8</button>
            <button class="calc-key" data-k="9">9</button>
            <button class="calc-key op" data-k="*">×</button>
            <button class="calc-key" data-k="4">4</button>
            <button class="calc-key" data-k="5">5</button>
            <button class="calc-key" data-k="6">6</button>
            <button class="calc-key op" data-k="-">−</button>
            <button class="calc-key" data-k="1">1</button>
            <button class="calc-key" data-k="2">2</button>
            <button class="calc-key" data-k="3">3</button>
            <button class="calc-key op" data-k="+">+</button>
            <button class="calc-key fn" data-k="%">%</button>
            <button class="calc-key" data-k="0">0</button>
            <button class="calc-key" data-k=",">,</button>
            <button class="calc-key fn" data-k=".">.</button>
            <button class="calc-key eq" data-k="=">=</button>
          </div>
        </div>
        <div class="calc-history" id="calc_history">
          <h3>السجل</h3>
          <div id="calc_history_list"></div>
        </div>
      </div>`;
    // Calculator logic
    let expr = '0';
    let result = 0;
    let memory = 0;
    let history = loadSettings().calcHistory || []; // reuse settings storage bag
    const exprEl = $('#calc_expr');
    const resEl = $('#calc_result');
    const histList = $('#calc_history_list');
    const memInd = $('#calc_mem_ind');
    function saveHistory(){
      const s = loadSettings();
      s.calcHistory = history.slice(-20); // keep last 20
      saveSettings(s);
    }
    function renderHistory(){
      histList.innerHTML = history.slice().reverse().map(h=>`<div class="calc-history-item" data-expr="${escapeAttr(h.expr)}" data-res="${escapeAttr(h.res)}"><span>${escapeHtml(h.expr)}</span><strong>= ${escapeHtml(h.res)}</strong></div>`).join('');
      $$('#calc_history_list .calc-history-item').forEach(it=> it.addEventListener('click', ()=>{
        expr = it.dataset.expr; result = Number(it.dataset.res); updateDisplay();
      }));
    }
    function updateDisplay(){ exprEl.textContent = expr; resEl.textContent = String(result); memInd.textContent = memory? ('M: '+ memory):''; }
    function safeEval(e){
      if(!e) return 0;
      e = e.replace(/,/g,''); // remove thousand separators if entered
      // percent: a% -> (a/100)
      e = e.replace(/(\d+(?:\.\d+)?)%/g,'($1/100)');
      if(!/^[-+*/().%0-9\s]*$/.test(e)) return NaN;
      try{ // eslint-disable-next-line no-new-func
        return Function('return ('+ e + ')')();
      }catch{ return NaN; }
    }
    function compute(){
      const v = safeEval(expr);
      if(!Number.isNaN(v) && Number.isFinite(v)){ result = v; }
      updateDisplay();
    }
    function input(k){
      if(k==='='){ compute(); history.push({expr, res: result}); saveHistory(); renderHistory(); return; }
      if(k==='C'){ expr='0'; result=0; updateDisplay(); return; }
      if(k==='CE'){ expr='0'; updateDisplay(); return; }
      if(k==='BS'){ expr = expr.length>1? expr.slice(0,-1):'0'; updateDisplay(); return; }
      if(k==='%' ){ expr += '%'; compute(); return; }
      if(k===','){ // thousand separator insertion visually only
        // ignore direct comma insertion into expression; we treat as group formatting of result
        return; }
      if(k==='.' ){ if(/\.\d*$/.test(expr.split(/[-+*/]/).pop())) return; if(/[^0-9)]$/.test(expr)) expr+='0'; expr+='.'; updateDisplay(); return; }
      if(k==='+'||k==='-'||k==='*'||k==='/'){
        if(/[-+*/]$/.test(expr)) expr = expr.slice(0,-1); expr += k; updateDisplay(); return; }
      if(/^[0-9]$/.test(k)){
        if(expr==='0') expr=k; else expr += k; updateDisplay(); return; }
    }
    $('#calc_keys').addEventListener('click', e=>{ const b = e.target.closest('[data-k]'); if(!b) return; input(b.dataset.k); });
    $('#calc_copy').addEventListener('click', ()=>{ try{ navigator.clipboard.writeText(String(result)); }catch{} });
    $('#calc_mc').addEventListener('click', ()=>{ memory=0; updateDisplay(); });
    $('#calc_mr').addEventListener('click', ()=>{ if(memory){ expr = String(memory); compute(); } });
    $('#calc_mplus').addEventListener('click', ()=>{ compute(); memory += result; updateDisplay(); });
    function keyHandler(ev){
      const k = ev.key;
      if(k==='Enter'){ input('='); ev.preventDefault(); }
      else if(k==='Backspace'){ input('BS'); ev.preventDefault(); }
      else if(k==='Escape'){ input('C'); ev.preventDefault(); }
      else if(k==='Delete'){ input('CE'); ev.preventDefault(); }
      else if(/[0-9.+\-*/%]/.test(k)){ input(k); ev.preventDefault(); }
    }
    document.addEventListener('keydown', keyHandler);
    renderHistory(); compute(); updateDisplay();
    // Cleanup on hash change: rely on main navigation to rebuild content; detach listener
    const detach = ()=> document.removeEventListener('keydown', keyHandler);
    window.addEventListener('hashchange', detach, { once:true });
  } else if(key==='stats'){
    // Data loads
    const products = loadProducts();
    const sales = loadSales();
    const purchases = loadPurchases();
    const expenses = loadExpenses ? loadExpenses() : [];
    const debtClients = (typeof loadDebtClients==='function')? loadDebtClients(): [];
    const debtTx = (typeof loadDebtTx==='function')? loadDebtTx(): [];
    const settings = loadSettings();
    const ob = (settings && settings.openingBalances) ? settings.openingBalances : { sales:0, purchases:0, expenses:0, profit:0, debts:0 };
    // Totals
    const baseSales = sales.reduce((s,v)=> s + Number(v.total||0), 0);
    const basePurchases = purchases.reduce((s,v)=> s + Number(v.total||0), 0);
    const totalStockValue = products.reduce((s,p)=> s + (Number(p.stock||0) * Number(p.buyPrice||0)), 0);
    const baseProfit = sales.reduce((s,v)=> s + Number(v.profit||0), 0);
    const baseExpenses = expenses.reduce((s,e)=> s + Number(e.amount||0), 0);
    const totalSales = baseSales + Number(ob.sales||0);
    const totalPurchases = basePurchases + Number(ob.purchases||0);
    const totalExpenses = baseExpenses + Number(ob.expenses||0);
    const totalProfit = baseProfit + Number(ob.profit||0);
    const netProfit = (baseProfit - baseExpenses) + Number(ob.profit||0) - Number(ob.expenses||0);
    // Debts total: opening + (debt adds) - (pay)
    const clientMap = Object.fromEntries(debtClients.map(c=>[c.id,c]));
    const addMap = {}; // accumulate movements per client
    debtTx.forEach(t=>{
      const sign = t.type==='debt'? 1 : -1;
      addMap[t.clientId] = (addMap[t.clientId]||0) + sign * Number(t.amount||0);
    });
    const baseDebts = debtClients.reduce((s,c)=> s + Number(c.opening||0) + (addMap[c.id]||0), 0);
    const totalDebts = baseDebts + Number(ob.debts||0);
    const productsCount = products.length;
    // Aggregate product sales (units + amount + profit)
    const prodMap = new Map();
    sales.forEach(inv=>{
      const items = (inv.items||[]).filter(it=> Number(it.qty||0)>0 && Number(it.price||0)>=0);
      const invoiceProfit = Number(inv.profit||0);
      const invoiceSalesAmount = items.reduce((s,it)=> s + Number(it.price||0)*Number(it.qty||0), 0) || 0;
      items.forEach(it=>{
        const qty = Number(it.qty||0);
        const sell = Number(it.price||0);
        const lineAmount = sell * qty;
        // Allocate profit proportionally; fallback to (sell - buy) * qty if invoiceProfit=0
        let lineProfit = 0;
        if(invoiceProfit>0 && invoiceSalesAmount>0){
          lineProfit = invoiceProfit * (lineAmount / invoiceSalesAmount);
        } else {
          const prod = products.find(p=> p.barcode===it.code || p.code===it.code);
          const buy = Number(it.buy != null ? it.buy : (prod?prod.buyPrice:0)) || 0;
          lineProfit = Math.max(0, (sell - buy) * qty);
        }
        const m = prodMap.get(it.code)||{ code:it.code, name:it.name||it.code, units:0, amount:0, profit:0 };
        m.units += qty; m.amount += lineAmount; m.profit += lineProfit;
        prodMap.set(it.code, m);
      });
    });
    const allAgg = Array.from(prodMap.values());
    const topSelling = allAgg.slice().sort((a,b)=> b.units - a.units).slice(0,5);
  // Filter very tiny profits (<1) unless everything tiny
  let tmpProfitList = allAgg.slice().sort((a,b)=> b.profit - a.profit);
  const anyAbove1 = tmpProfitList.some(p=> p.profit >= 1);
  if(anyAbove1) tmpProfitList = tmpProfitList.filter(p=> p.profit >= 1);
  const topProfit = tmpProfitList.slice(0,5);
    // Recommendation text
    let advice = '';
    if(topSelling.length){
      const first = topSelling[0];
      advice = `ركز على استمرار توفر ${first.name} (الأعلى مبيعاً). `;
      // find high-margin low-units candidate
      const withMetrics = allAgg.map(p=>({ ...p, margin: p.amount? (p.profit/p.amount*100):0 }));
      const highMarginLowUnits = withMetrics
        .filter(p=> p.margin>=25 && p.units>0 && p.units < (first.units*0.4))
        .sort((a,b)=> b.margin - a.margin)[0];
      if(highMarginLowUnits){
        advice += `زد ترويج ${highMarginLowUnits.name} فهامشه ${highMarginLowUnits.margin.toFixed(1)}% لكن مبيعاته قليلة.`;
      }
      // low margin warning
      const lowMargin = withMetrics.filter(p=> p.units>0).sort((a,b)=> a.margin - b.margin)[0];
      if(lowMargin && lowMargin.margin < 5){ advice += ` راجع تسعير ${lowMargin.name} (هامش ${lowMargin.margin.toFixed(1)}%).`; }
    } else advice = 'لا توجد بيانات مبيعات بعد لعرض توصيات.';
    content.innerHTML = breadcrumb + `
      <div class="section-title-bar">ملخص الإحصائيات <small>نظرة شاملة</small></div>
      <div class="panel">
        <div class="grid cols-4" style="row-gap:16px">
          <div class="stat-card"><div class="ico">💵</div><div><div class="val">${formatCurrency(totalSales)}</div><div class="lbl">إجمالي المبيعات</div></div></div>
          <div class="stat-card"><div class="ico">🧾</div><div><div class="val">${formatCurrency(totalPurchases)}</div><div class="lbl">إجمالي المشتريات</div></div></div>
          <div class="stat-card"><div class="ico">📦</div><div><div class="val">${formatCurrency(totalStockValue)}</div><div class="lbl">قيمة المخزون الحالي</div></div></div>
          <div class="stat-card"><div class="ico">📈</div><div><div class="val">${formatCurrency(totalProfit)}</div><div class="lbl">إجمالي الربح</div></div></div>
          <div class="stat-card"><div class="ico">💳</div><div><div class="val">${formatCurrency(totalExpenses)}</div><div class="lbl">إجمالي المصروفات</div></div></div>
          <div class="stat-card"><div class="ico">➖</div><div><div class="val">${formatCurrency(netProfit)}</div><div class="lbl">صافي الربح</div></div></div>
          <div class="stat-card"><div class="ico">🤝</div><div><div class="val">${formatCurrency(totalDebts)}</div><div class="lbl">إجمالي الديون</div></div></div>
          <div class="stat-card"><div class="ico">🛍️</div><div><div class="val">${productsCount}</div><div class="lbl">عدد المنتجات</div></div></div>
        </div>
        ${(Number(ob.sales||0)||Number(ob.purchases||0)||Number(ob.expenses||0)||Number(ob.profit||0)||Number(ob.debts||0))? `<div class="mini" style="margin-top:8px;color:var(--text-soft)">القيم أعلاه تشمل أرصدة افتتاحية (مبيعات:${formatCurrency(ob.sales||0)} مشتريات:${formatCurrency(ob.purchases||0)} مصروفات:${formatCurrency(ob.expenses||0)} ربح سابق:${formatCurrency(ob.profit||0)} ديون:${formatCurrency(ob.debts||0)})</div>`:''}
      </div>
      <div class="panel">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <div class="title" style="font-weight:700">أكثر الأصناف مبيعاً</div>
          ${topSelling.length? '<button class="button ghost" id="exp_top_selling">تصدير</button>':''}
        </div>
        ${topSelling.length? `<div style="overflow:auto"><table class="table"><thead><tr><th>الرمز</th><th>الاسم</th><th>الوحدات</th><th>المبيعات</th></tr></thead><tbody>${topSelling.map(p=>`<tr><td>${escapeHtml(p.code)}</td><td>${escapeHtml(p.name)}</td><td>${p.units}</td><td>${formatCurrency(p.amount)}</td></tr>`).join('')}</tbody></table></div>` : 'لا توجد بيانات مبيعات.'}
      </div>
      <div class="panel">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <div class="title" style="font-weight:700">أكثر الأصناف ربحاً</div>
          ${topProfit.length? '<button class="button ghost" id="exp_top_profit">تصدير</button>':''}
        </div>
  ${topProfit.length? (()=>{ const totalProfitAll = allAgg.reduce((s,p)=> s + p.profit, 0)||1; return `<div style="overflow:auto"><table class="table"><thead><tr><th>الرمز</th><th>الاسم</th><th>الربح الإجمالي</th><th>حصة الربح %</th><th>الهامش %</th><th>متوسط ربح/وحدة</th><th>الوحدات</th><th>المبيعات</th></tr></thead><tbody>${topProfit.map(p=>{ const margin = p.amount? (p.profit / p.amount *100):0; const avg = p.units? (p.profit/p.units):0; const share = (p.profit/totalProfitAll*100); const cls = margin>=30? 'margin-high': (margin>=15? 'margin-mid':'margin-low'); return `<tr class="${cls}"><td>${escapeHtml(p.code)}</td><td>${escapeHtml(p.name)}</td><td>${formatCurrency(p.profit)}</td><td>${share.toFixed(1)}%</td><td>${margin.toFixed(1)}%</td><td>${formatCurrency(avg)}</td><td>${p.units}</td><td>${formatCurrency(p.amount)}</td></tr>`; }).join('')}</tbody></table></div>` })() : 'لا توجد بيانات ربح.'}
        ${topProfit.length && allAgg.some(p=> p.profit>0 && p.profit<1)? '<div class="mini" style="margin-top:6px">* تم إخفاء أرباح أقل من 1 لتحسين دقة الترتيب</div>':''}
      </div>
      <div class="panel">
        <div class="title" style="margin-bottom:8px;font-weight:700">توصية</div>
        <div>${escapeHtml(advice)}</div>
      </div>`;
    // export handlers
    const expSellBtn = $('#exp_top_selling');
    if(expSellBtn){
      expSellBtn.addEventListener('click', ()=>{
        try{
          const headers = ['الرمز','الاسم','الوحدات','مبلغ المبيعات'];
            const rows = topSelling.map(p=>[p.code,p.name,p.units,p.amount]);
            const ws = XLSX.utils.aoa_to_sheet([headers,...rows]); const wb=XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, 'TopSelling');
            // Sheet opening balances
            const obSheet = XLSX.utils.aoa_to_sheet([
              ['البند','القيمة'],
              ['مبيعات افتتاحية', ob.sales||0],
              ['مشتريات افتتاحية', ob.purchases||0],
              ['مصروفات افتتاحية', ob.expenses||0],
              ['ربح سابق', ob.profit||0],
              ['ديون افتتاحية', ob.debts||0]
            ]);
            XLSX.utils.book_append_sheet(wb, obSheet, 'OpeningBalances');
            XLSX.writeFile(wb, 'top_selling.xlsx');
        }catch(e){ alert('فشل التصدير: '+(e.message||e)); }
      });
    }
    const expProfitBtn = $('#exp_top_profit');
    if(expProfitBtn){
      expProfitBtn.addEventListener('click', ()=>{
        try{
          const totalProfitAll = allAgg.reduce((s,p)=> s + p.profit, 0)||1;
          const headers = ['الرمز','الاسم','الربح الإجمالي','حصة الربح %','الهامش %','متوسط ربح/وحدة','الوحدات','المبيعات'];
          const rows = topProfit.map(p=>{ const margin = p.amount? (p.profit/p.amount*100):0; const avg=p.units? (p.profit/p.units):0; const share=(p.profit/totalProfitAll*100); return [p.code,p.name,p.profit,share,margin,avg,p.units,p.amount]; });
          const ws = XLSX.utils.aoa_to_sheet([headers,...rows]); const wb=XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, 'TopProfit');
          const obSheet = XLSX.utils.aoa_to_sheet([
            ['البند','القيمة'],
            ['مبيعات افتتاحية', ob.sales||0],
            ['مشتريات افتتاحية', ob.purchases||0],
            ['مصروفات افتتاحية', ob.expenses||0],
            ['ربح سابق', ob.profit||0],
            ['ديون افتتاحية', ob.debts||0]
          ]);
          XLSX.utils.book_append_sheet(wb, obSheet, 'OpeningBalances');
          XLSX.writeFile(wb, 'top_profit.xlsx');
        }catch(e){ alert('فشل التصدير: '+(e.message||e)); }
      });
    }
  } else if(key==='partners'){
    const partners = loadPartners();
    const dists = loadDistributions();
    const sStats = computeStats();
    const contentHtml = [];
    contentHtml.push(`<div class="section-title-bar">الشركاء <small>رأس المال والتوزيعات</small></div>`);
    contentHtml.push(`<div class="panel" style="margin-bottom:14px">
      <div class="grid cols-5" style="margin-bottom:10px">
        <input class="input" id="pt_name" placeholder="اسم الشريك" />
        <input class="input" id="pt_capital" type="number" placeholder="رأس المال" />
        <input class="input" id="pt_note" placeholder="ملاحظات" />
        <button class="button" id="pt_add">إضافة شريك</button>
        <button class="button ghost" id="pt_export">تصدير الشركاء</button>
      </div>
      <div id="pt_list" style="overflow:auto">لا شركاء بعد.</div>
    </div>`);
    contentHtml.push(`<div class="panel">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <div class="title" style="font-weight:700">التوزيعات</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <button class="button" id="pt_new_dist">توزيع أرباح</button>
          <button class="button ghost" id="pt_withdraw_btn">سحب رأس مال</button>
          <button class="button ghost" id="pt_report_btn">تقرير الشركاء</button>
          <button class="button ghost" id="pt_export_dist">تصدير التوزيعات</button>
        </div>
      </div>
      <div id="pt_dists">لا توزيعات.</div>
    </div>`);
    content.innerHTML = breadcrumb + contentHtml.join('');
    function renderPartners(){
      const arr = loadPartners();
      if(!arr.length){ $('#pt_list').innerHTML='لا شركاء بعد.'; return; }
      const total = arr.reduce((s,p)=> s + Number(p.capital||0), 0)||1;
      $('#pt_list').innerHTML = `<table class="table"><thead><tr><th>الاسم</th><th>رأس المال</th><th>النسبة %</th><th>ملاحظات</th><th>تعديل</th></tr></thead><tbody>${arr.map(p=>`<tr data-id="${p.id}"><td>${escapeHtml(p.name)}</td><td>${formatCurrency(p.capital||0)}</td><td>${((p.capital||0)/total*100).toFixed(2)}</td><td>${escapeHtml(p.note||'')}</td><td><button class="button ghost" data-act="edit" data-id="${p.id}">✏️</button></td></tr>`).join('')}</tbody></table>`;
      $$('#pt_list [data-act="edit"]').forEach(btn=> btn.addEventListener('click', ()=> editPartner(btn.dataset.id)));
    }
    function editPartner(id){
      const arr = loadPartners(); const p = arr.find(x=> x.id===id); if(!p) return;
      const backdrop = document.createElement('div'); backdrop.className='modal-backdrop';
      backdrop.innerHTML = `<div class="modal"><div class="title">تعديل شريك</div><div class="grid cols-2"><input class="input" id="e_name" value="${escapeAttr(p.name)}"/><input class="input" id="e_capital" type="number" value="${Number(p.capital||0)}"/><input class="input" id="e_note" value="${escapeAttr(p.note||'')}"/></div><div class="actions"><button class="button" id="save">حفظ</button><button class="button ghost" id="cancel">إلغاء</button></div></div>`;
      document.body.appendChild(backdrop); const close=()=>backdrop.remove(); backdrop.addEventListener('click', e=>{ if(e.target===backdrop) close(); }); $('#cancel', backdrop).addEventListener('click', close);
      $('#save', backdrop).addEventListener('click', ()=>{ p.name=$('#e_name',backdrop).value.trim(); p.capital=Number($('#e_capital',backdrop).value||0); p.note=$('#e_note',backdrop).value.trim(); savePartners(arr); renderPartners(); renderTopStats(); close(); });
    }
    function renderDists(){
      const arr = loadDistributions().slice().sort((a,b)=> String(b.date||'').localeCompare(String(a.date||'')));
      if(!arr.length){ $('#pt_dists').innerHTML='لا توزيعات.'; return; }
      const latestId = arr[0].id;
  // ملاحظة: السماح بتعديل/حذف الأحدث فقط يمنع كسر تسلسل رؤوس الأموال الناتج عن إعادة الاستثمار
  $('#pt_dists').innerHTML = `<div style="overflow:auto"><table class="table"><thead><tr><th>التاريخ</th><th>صافي قبل</th><th>حصة الإدارة</th><th>قابل للتوزيع</th><th>نقدي</th><th>معاد استثماره</th><th>إجراءات</th></tr></thead><tbody>${arr.map(d=>`<tr><td>${escapeHtml(d.date||'')}</td><td>${formatCurrency(d.totalNetProfitBefore||0)}</td><td>${formatCurrency(d.mgmtFeeValue||0)}</td><td>${formatCurrency(d.distributable||0)}</td><td>${formatCurrency(d.totalPaidOut||0)}</td><td>${formatCurrency(d.totalReinvested||0)}</td><td>${d.id===latestId? `<button class=\"button ghost\" data-act=\"edit-dist\" data-id=\"${d.id}\">تعديل</button><button class=\"button ghost\" data-act=\"del-dist\" data-id=\"${d.id}\">حذف</button>`:''} <button class=\"button ghost\" data-id=\"${d.id}\" data-act=\"show\">عرض</button></td></tr>`).join('')}</tbody></table><div class="mini" style="margin-top:4px">* لا يمكن تعديل أو حذف إلا أحدث توزيع حفاظاً على سلامة التسلسل المحاسبي وإجمالي رأس المال.</div></div>`;
      $$('#pt_dists [data-act="show"]').forEach(b=> b.addEventListener('click', ()=> showDist(b.dataset.id)));
      $$('#pt_dists [data-act="del-dist"]').forEach(b=> b.addEventListener('click', ()=> deleteLatestDistribution(b.dataset.id)));
      $$('#pt_dists [data-act="edit-dist"]').forEach(b=> b.addEventListener('click', ()=> editLatestDistribution(b.dataset.id)));
    }
    function showDist(id){
      const all = loadDistributions(); const d = all.find(x=> x.id===id); if(!d) return;
      const partnersMap = Object.fromEntries(loadPartners().map(p=>[p.id,p]));
      const backdrop = document.createElement('div'); backdrop.className='modal-backdrop';
      backdrop.innerHTML = `<div class="modal" style="max-width:750px"><div class="title">تفاصيل التوزيع (${escapeHtml(d.date||'')})</div><div style="max-height:55vh;overflow:auto">${d.details && d.details.length? `<table class=\"table\"><thead><tr><th>الشريك</th><th>رأس مال قبل</th><th>النسبة %</th><th>الحصة</th><th>نقدي</th><th>معاد</th><th>رأس مال بعد</th></tr></thead><tbody>${d.details.map(r=>{ const p=partnersMap[r.partnerId]||{}; return `<tr><td>${escapeHtml(p.name||'')}</td><td>${formatCurrency(r.capitalBefore||0)}</td><td>${(r.sharePercent||0).toFixed(2)}</td><td>${formatCurrency(r.allocated||0)}</td><td>${formatCurrency(r.paidOut||0)}</td><td>${formatCurrency(r.reinvested||0)}</td><td>${formatCurrency(r.capitalAfter||0)}</td></tr>`; }).join('')}</tbody></table>`:'لا تفاصيل.'}</div><div class="actions"><button class="button" id="close">إغلاق</button></div></div>`;
      document.body.appendChild(backdrop); $('#close', backdrop).addEventListener('click', ()=> backdrop.remove()); backdrop.addEventListener('click', e=>{ if(e.target===backdrop) backdrop.remove(); });
    }
    function deleteLatestDistribution(id){
      const arr = loadDistributions(); if(!arr.length) return;
      if(arr[0].id!==id){ alert('يمكن حذف أحدث توزيع فقط'); return; }
      if(!confirm('سيتم حذف أحدث توزيع وعكس تأثير إعادة الاستثمار على رأس المال. متابعة؟')) return;
      const latest = arr[0];
      const parts = loadPartners();
      // عكس أثر إعادة الاستثمار: طرح reinvested من رأس المال
      latest.details.forEach(r=>{ const p = parts.find(pp=> pp.id===r.partnerId); if(p){ p.capital = Number(p.capital||0) - Number(r.reinvested||0); if(p.capital<0) p.capital=0; }});
      savePartners(parts);
      arr.shift(); // إزالة الأحدث فقط
      saveDistributions(arr);
      renderPartners(); renderDists(); renderTopStats();
      alert('تم الحذف');
    }
    function editLatestDistribution(id){
      const arr = loadDistributions(); if(!arr.length) return;
      if(arr[0].id!==id){ alert('يمكن تعديل أحدث توزيع فقط'); return; }
      const dist = arr[0];
      const parts = loadPartners();
      const partsMap = Object.fromEntries(parts.map(p=>[p.id,p]));
      const backdrop = document.createElement('div'); backdrop.className='modal-backdrop';
      backdrop.innerHTML = `<div class="modal" style="max-width:900px"><div class="title">تعديل أحدث توزيع (${escapeHtml(dist.date||'')})</div><div class="grid cols-3" style="margin-bottom:8px"><input class="input" id="ed_mgmt_percent" type="number" value="${Number(dist.mgmtFeePercent||0)}"/><input class="input" id="ed_date" type="date" value="${escapeAttr(dist.date||'')}"/><input class="input" id="ed_note" value="${escapeAttr(dist.note||'')}" placeholder="ملاحظات"/></div><div style="max-height:45vh;overflow:auto" id="ed_table_wrap"></div><div class="actions" style="justify-content:space-between"><div><button class="button ghost" id="ed_recalc">إعادة حساب حسب نفس النسب</button></div><div><button class="button" id="ed_save">حفظ</button><button class="button ghost" id="ed_cancel">إلغاء</button></div></div></div>`;
      document.body.appendChild(backdrop);
      // استعادة الوضع قبل التوزيع للأثر الرأسمالي (نحتاج رأس مال قبل لكل شريك ضمن التفاصيل)
      const baseRows = dist.details.map(r=>({ partnerId:r.partnerId, name: (partsMap[r.partnerId]||{}).name||'', capitalBefore:r.capitalBefore, sharePercent:r.sharePercent, allocated:r.allocated, reinvested:r.reinvested, paidOut:r.paidOut, capitalAfter:r.capitalAfter }));
      let rowsState = JSON.parse(JSON.stringify(baseRows));
      function renderEditTable(){
        $('#ed_table_wrap').innerHTML = `<table class="table"><thead><tr><th>الشريك</th><th>رأس مال قبل</th><th>الحصة الأصلية</th><th>معاد (جديد)</th><th>نقدي (جديد)</th><th>المجموع</th><th>رأس مال بعد</th></tr></thead><tbody>${rowsState.map(r=>`<tr><td>${escapeHtml(r.name)}</td><td>${formatCurrency(r.capitalBefore)}</td><td>${formatCurrency(r.allocated)}</td><td><input class=\"input\" style=\"width:110px\" data-id=\"${r.partnerId}\" data-f=\"reinvested\" type=\"number\" value=\"${r.reinvested}\" /></td><td><input class=\"input\" style=\"width:110px\" data-id=\"${r.partnerId}\" data-f=\"paidOut\" type=\"number\" value=\"${r.paidOut}\" /></td><td>${formatCurrency(r.reinvested + r.paidOut)}</td><td>${formatCurrency(r.capitalBefore + r.reinvested)}</td></tr>`).join('')}</tbody></table>`;
        $$('#ed_table_wrap input').forEach(inp=> inp.addEventListener('input', ()=>{ const id=inp.dataset.id; const f=inp.dataset.f; const val=Number(inp.value||0); const row=rowsState.find(x=> x.partnerId===id); if(row){ row[f]=val; if(row.reinvested+row.paidOut > row.allocated+0.00001){ row[f]=Math.max(0,row.allocated - (f==='reinvested'? row.paidOut: row.reinvested)); inp.value=row[f]; } } renderEditTable(); }));
      }
      renderEditTable();
      $('#ed_recalc').addEventListener('click', ()=>{
        // إعادة توزيع بنفس sharePercent لكن بناءً على صافي قبل الأصلي (لا نغير totalNetProfitBefore)
        const mgmtPercent = Number($('#ed_mgmt_percent').value||0);
        const mgmtFeeValue = dist.totalNetProfitBefore * (mgmtPercent/100);
        const distributable = dist.totalNetProfitBefore - mgmtFeeValue;
        rowsState.forEach(r=>{ r.allocated = distributable * (r.sharePercent/100); if(r.reinvested + r.paidOut > r.allocated){ r.paidOut = Math.max(0, r.allocated - r.reinvested); } });
        renderEditTable();
      });
      $('#ed_cancel').addEventListener('click', ()=> backdrop.remove()); backdrop.addEventListener('click', e=>{ if(e.target===backdrop) backdrop.remove(); });
      $('#ed_save').addEventListener('click', ()=>{
        const mgmtPercent = Number($('#ed_mgmt_percent').value||0);
        const mgmtFeeValue = dist.totalNetProfitBefore * (mgmtPercent/100);
        const distributable = dist.totalNetProfitBefore - mgmtFeeValue;
        const totalPaidOut = rowsState.reduce((s,r)=> s + Number(r.paidOut||0), 0);
        const totalReinvested = rowsState.reduce((s,r)=> s + Number(r.reinvested||0), 0);
        if(totalPaidOut + totalReinvested > distributable + 0.00001){ alert('مجموع المدفوع + المعاد يتجاوز القابل للتوزيع'); return; }
        // عكس رأس المال القديم (طرح المعاد السابق) ثم إضافة المعاد الجديد
        const partnersArr = loadPartners();
        dist.details.forEach(r=>{ const p = partnersArr.find(pp=> pp.id===r.partnerId); if(p){ p.capital = Number(p.capital||0) - Number(r.reinvested||0); if(p.capital<0) p.capital=0; }});
        rowsState.forEach(r=>{ const p = partnersArr.find(pp=> pp.id===r.partnerId); if(p){ p.capital = Number(p.capital||0) + Number(r.reinvested||0); }});
        savePartners(partnersArr);
        dist.mgmtFeePercent = mgmtPercent; dist.mgmtFeeValue = mgmtFeeValue; dist.distributable = distributable; dist.totalPaidOut = totalPaidOut; dist.totalReinvested = totalReinvested; dist.date = $('#ed_date').value; dist.note = $('#ed_note').value; dist.details = rowsState.map(r=>({ partnerId:r.partnerId, capitalBefore:r.capitalBefore, sharePercent:r.sharePercent, allocated:r.allocated, reinvested:r.reinvested, paidOut:r.paidOut, capitalAfter: r.capitalBefore + r.reinvested }));
        saveDistributions(arr);
        backdrop.remove(); renderPartners(); renderDists(); renderTopStats(); alert('تم الحفظ');
      });
    }
    function openNewDistribution(){
      const st = computeStats();
      const currentUnd = st.undistributed||0;
      if(!(currentUnd>0)){ alert('لا يوجد صافي ربح غير موزع > 0'); return; }
      const parts = loadPartners(); if(!parts.length){ alert('أضف شركاء أولاً'); return; }
      const totalCap = parts.reduce((sx,p)=> sx + Number(p.capital||0), 0)||1;
      const today = new Date().toISOString().slice(0,10);
      const backdrop = document.createElement('div'); backdrop.className='modal-backdrop';
      backdrop.innerHTML = `<div class="modal" style="max-width:900px"><div class="title">توزيع أرباح</div><div class="grid cols-4" style="margin-bottom:8px"><input class="input" id="d_date" type="date" value="${today}"/><input class="input" id="d_mgmt_percent" type="number" placeholder="% حصة الإدارة" value="0"/><input class="input" id="d_note" placeholder="ملاحظات (اختياري)"/><input class="input" id="d_filter" placeholder="بحث شريك"/></div><div style="max-height:45vh;overflow:auto" id="d_table_wrap"></div><div class="actions" style="justify-content:space-between"><div><strong>صافي غير موزع:</strong> ${formatCurrency(currentUnd)}</div><div style="display:flex;gap:6px"><button class="button ghost" id="d_all_cash">جعل الكل نقدي</button><button class="button ghost" id="d_all_reinv">جعل الكل إعادة استثمار</button><button class="button" id="d_save">حفظ التوزيع</button><button class="button ghost" id="d_cancel">إلغاء</button></div></div></div>`;
      document.body.appendChild(backdrop);
      const state = parts.map(p=>({ partnerId:p.id, name:p.name, capitalBefore:Number(p.capital||0), sharePercent: (Number(p.capital||0)/totalCap*100), allocated:0, reinvested:0, paidOut:0, capitalAfter:Number(p.capital||0) }));
      function recompute(){
        const mgmtPercent = Number($('#d_mgmt_percent').value||0);
        const mgmtFeeValue = currentUnd * (mgmtPercent/100);
        const distributable = currentUnd - mgmtFeeValue;
        state.forEach(r=>{ r.allocated = distributable * (r.sharePercent/100); if(r.reinvested + r.paidOut > r.allocated){ r.paidOut = Math.max(0, r.allocated - r.reinvested); } r.capitalAfter = r.capitalBefore + r.reinvested; });
        const q = ($('#d_filter').value||'').trim().toLowerCase();
        const rows = state.filter(r=> !q || r.name.toLowerCase().includes(q));
        $('#d_table_wrap').innerHTML = `<table class="table"><thead><tr><th>الشريك</th><th>رأس مال</th><th>النسبة%</th><th>الحصة</th><th>إعادة استثمار</th><th>نقدي</th><th>رأس مال بعد</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${escapeHtml(r.name)}</td><td>${formatCurrency(r.capitalBefore)}</td><td>${r.sharePercent.toFixed(2)}</td><td>${formatCurrency(r.allocated)}</td><td><input data-id="${r.partnerId}" data-f="reinvested" type="number" class="input" style="width:110px" value="${r.reinvested}" /></td><td><input data-id="${r.partnerId}" data-f="paidOut" type="number" class="input" style="width:110px" value="${r.paidOut}" /></td><td>${formatCurrency(r.capitalAfter)}</td></tr>`).join('')}</tbody></table><div style="margin-top:6px"><strong>حصة الإدارة:</strong> ${formatCurrency(mgmtFeeValue)} | <strong>قابل للتوزيع:</strong> ${formatCurrency(distributable)}</div>`;
        $$('#d_table_wrap input').forEach(inp=> inp.addEventListener('input', ()=>{ const id=inp.dataset.id; const f=inp.dataset.f; const val=Number(inp.value||0); const row=state.find(x=> x.partnerId===id); if(row){ if(f==='reinvested'){ row.reinvested = val; } else { row.paidOut = val; } } recompute(); }));
      }
      recompute();
      $('#d_all_cash').addEventListener('click', ()=>{ state.forEach(r=>{ r.paidOut = r.allocated; r.reinvested=0; }); recompute(); });
      $('#d_all_reinv').addEventListener('click', ()=>{ state.forEach(r=>{ r.reinvested = r.allocated; r.paidOut=0; }); recompute(); });
      $('#d_filter').addEventListener('input', recompute);
      $('#d_mgmt_percent').addEventListener('input', recompute);
      $('#d_cancel').addEventListener('click', ()=> backdrop.remove());
      backdrop.addEventListener('click', e=>{ if(e.target===backdrop) backdrop.remove(); });
      $('#d_save').addEventListener('click', ()=>{
        recompute();
        const mgmtPercent = Number($('#d_mgmt_percent').value||0);
        const mgmtFeeValue = currentUnd * (mgmtPercent/100);
        const distributable = currentUnd - mgmtFeeValue;
        const totalPaidOut = state.reduce((sx,r)=> sx + Number(r.paidOut||0), 0);
        const totalReinvested = state.reduce((sx,r)=> sx + Number(r.reinvested||0), 0);
        if(totalPaidOut + totalReinvested > distributable + 0.00001){ alert('مجموع المدفوع + المعاد استثماره يتجاوز القابل للتوزيع'); return; }
        const partsArr = loadPartners();
        state.forEach(r=>{ const p = partsArr.find(pp=> pp.id===r.partnerId); if(p){ p.capital = r.capitalAfter; } });
        savePartners(partsArr);
        const arr = loadDistributions();
        arr.push({ id:'DST'+Date.now(), date: $('#d_date').value, note: $('#d_note').value, totalNetProfitBefore: currentUnd, mgmtFeePercent: mgmtPercent, mgmtFeeValue, distributable, totalPaidOut, totalReinvested, details: state.map(r=>({ partnerId:r.partnerId, capitalBefore:r.capitalBefore, sharePercent:r.sharePercent, allocated:r.allocated, reinvested:r.reinvested, paidOut:r.paidOut, capitalAfter:r.capitalAfter })) });
        saveDistributions(arr);
        backdrop.remove(); renderPartners(); renderDists(); renderTopStats(); alert('تم حفظ التوزيع');
      });
    }
    $('#pt_add').addEventListener('click', ()=>{
      const name = $('#pt_name').value.trim(); const cap = Number($('#pt_capital').value||0); const note=$('#pt_note').value.trim();
      if(!name){ alert('اكتب اسم الشريك'); return; }
      if(!(cap>=0)){ alert('رأس المال غير صالح'); return; }
  const arr = loadPartners(); arr.push({ id:'PT'+Date.now(), name, capital:cap, initialCapital:cap, note, createdAt:Date.now() }); savePartners(arr); $('#pt_name').value=''; $('#pt_capital').value=''; $('#pt_note').value=''; renderPartners(); renderTopStats();
    });
    $('#pt_export').addEventListener('click', ()=>{
      try{ const arr = loadPartners(); const headers = ['الاسم','رأس المال الحالي','رأس المال الابتدائي','النسبة %','ملاحظات','تاريخ']; const total = arr.reduce((s,p)=> s + Number(p.capital||0), 0)||1; const rows = arr.map(p=>[p.name, p.capital, p.initialCapital!=null?p.initialCapital:p.capital, (p.capital/total*100), p.note||'', (p.createdAt? new Date(p.createdAt).toLocaleString('en-GB'):'')]); const ws = XLSX.utils.aoa_to_sheet([headers,...rows]); const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, 'Partners'); XLSX.writeFile(wb, 'partners.xlsx'); }catch(e){ alert('فشل التصدير: '+(e.message||e)); }
    });
    $('#pt_export_dist').addEventListener('click', ()=>{
      try{ const arr = loadDistributions(); const headers = ['التاريخ','صافي قبل','حصة الإدارة','قابل للتوزيع','نقدي','معاد استثماره']; const rows = arr.map(d=>[d.date||'', d.totalNetProfitBefore||0, d.mgmtFeeValue||0, d.distributable||0, d.totalPaidOut||0, d.totalReinvested||0]); const ws = XLSX.utils.aoa_to_sheet([headers,...rows]); const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, 'Distributions'); XLSX.writeFile(wb, 'profit_distributions.xlsx'); }catch(e){ alert('فشل التصدير: '+(e.message||e)); }
    });
    $('#pt_new_dist').addEventListener('click', openNewDistribution);
    // سحب رأس مال
    $('#pt_withdraw_btn').addEventListener('click', ()=>{
      const parts = loadPartners(); if(!parts.length){ alert('لا شركاء'); return; }
      const backdrop = document.createElement('div'); backdrop.className='modal-backdrop';
      backdrop.innerHTML = `<div class="modal" style="max-width:600px"><div class="title">سحب رأس مال</div><div class="grid cols-2" style="margin-bottom:8px"><select class="input" id="w_partner"><option value="">اختر شريك</option>${parts.map(p=>`<option value="${p.id}">${escapeHtml(p.name)} — ${formatCurrency(p.capital||0)}</option>`).join('')}</select><input class="input" id="w_amount" type="number" placeholder="المبلغ" /></div><div class="grid cols-2" style="margin-bottom:8px"><input class="input" id="w_date" type="date" value="${new Date().toISOString().slice(0,10)}"/><input class="input" id="w_note" placeholder="ملاحظات (اختياري)" /></div><div class="actions"><button class="button" id="w_save">حفظ</button><button class="button ghost" id="w_cancel">إلغاء</button></div></div>`;
      document.body.appendChild(backdrop); const close=()=>backdrop.remove(); backdrop.addEventListener('click', e=>{ if(e.target===backdrop) close(); }); $('#w_cancel', backdrop).addEventListener('click', close);
      $('#w_save', backdrop).addEventListener('click', ()=>{
        const pid = $('#w_partner', backdrop).value; const amt = Number($('#w_amount', backdrop).value||0); if(!pid){ alert('اختر شريك'); return; } if(!(amt>0)){ alert('المبلغ غير صالح'); return; }
        const arr = loadPartners(); const p = arr.find(x=> x.id===pid); if(!p){ alert('شريك غير موجود'); return; }
        if(amt > Number(p.capital||0)){ alert('لا يمكن سحب أكثر من رأس المال الحالي'); return; }
        p.capital = Number(p.capital||0) - amt; savePartners(arr);
        const wArr = loadPartnerWithdrawals(); wArr.push({ id:'PW'+Date.now(), partnerId:pid, amount:amt, date: $('#w_date', backdrop).value, note: $('#w_note', backdrop).value }); savePartnerWithdrawals(wArr);
        close(); renderPartners(); renderTopStats(); alert('تم الحفظ');
      });
    });
    // تقرير الشركاء
    $('#pt_report_btn').addEventListener('click', ()=>{
      const parts = loadPartners(); if(!parts.length){ alert('لا شركاء'); return; }
      const dists = loadDistributions(); const wArr = loadPartnerWithdrawals();
      const stats = parts.map(p=>{
        const shares = dists.flatMap(d=> (d.details||[]).filter(r=> r.partnerId===p.id).map(r=>({ paidOut:r.paidOut||0, reinvested:r.reinvested||0 })));
        const paidOut = shares.reduce((s,r)=> s + Number(r.paidOut||0), 0);
        const reinv = shares.reduce((s,r)=> s + Number(r.reinvested||0), 0);
        const withdrawn = wArr.filter(w=> w.partnerId===p.id).reduce((s,w)=> s + Number(w.amount||0), 0);
        const init = Number(p.initialCapital!=null? p.initialCapital : p.capital);
        const current = Number(p.capital||0);
        const gain = (paidOut + (current - init));
        const roi = init>0 ? (gain / init * 100) : 0;
        return { id:p.id, name:p.name, init, current, paidOut, reinv, withdrawn, gain, roi };
      });
      const backdrop = document.createElement('div'); backdrop.className='modal-backdrop';
      backdrop.innerHTML = `<div class="modal" style="max-width:900px"><div class="title">تقرير الشركاء</div><div style="max-height:55vh;overflow:auto">${stats.length? `<table class=\"table\"><thead><tr><th>الشريك</th><th>ابتدائي</th><th>حالي</th><th>مدفوع</th><th>معاد</th><th>مسحوب</th><th>الربح/الخسارة</th><th>ROI%</th></tr></thead><tbody>${stats.map(r=>`<tr><td>${escapeHtml(r.name)}</td><td>${formatCurrency(r.init)}</td><td>${formatCurrency(r.current)}</td><td>${formatCurrency(r.paidOut)}</td><td>${formatCurrency(r.reinv)}</td><td>${formatCurrency(r.withdrawn)}</td><td>${formatCurrency(r.gain)}</td><td>${r.roi.toFixed(2)}</td></tr>`).join('')}</tbody></table>`:'لا بيانات.'}</div><div class="actions"><button class="button" id="rep_export">تصدير</button><button class="button ghost" id="close">إغلاق</button></div></div>`;
      document.body.appendChild(backdrop); const close=()=>backdrop.remove(); $('#close', backdrop).addEventListener('click', close); backdrop.addEventListener('click', e=>{ if(e.target===backdrop) close(); });
      $('#rep_export', backdrop).addEventListener('click', ()=>{
        try{ const headers=['الشريك','ابتدائي','حالي','مدفوع','معاد','مسحوب','الربح/الخسارة','ROI%']; const rows=stats.map(r=>[r.name,r.init,r.current,r.paidOut,r.reinv,r.withdrawn,r.gain,r.roi]); const ws=XLSX.utils.aoa_to_sheet([headers,...rows]); const wb=XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, 'PartnersROI'); XLSX.writeFile(wb, 'partners_report.xlsx'); }catch(e){ alert('فشل التصدير: '+(e.message||e)); }
      });
    });
    renderPartners(); renderDists();
  } else if(key==='debts'){
    const clients = loadDebtClients();
    const txs = loadDebtTx();
    const ob = (loadSettings().openingBalances)||{ debts:0 };
    let selected = null;
    function clientCurrentBalance(c){
      const start = Number(c.opening||0);
      const mov = txs.filter(t=> t.clientId===c.id).reduce((s,t)=> s + (t.type==='debt'? Number(t.amount||0): -Number(t.amount||0)), 0);
      return start + mov;
    }
    function render(){
      const q = ($('#deb_search')||{}).value? ($('#deb_search').value.trim().toLowerCase()):'';
      const list = loadDebtClients();
      const txsAll = loadDebtTx();
      const filtered = q? list.filter(c=> c.name.toLowerCase().includes(q) || (c.code||'').toLowerCase().includes(q)): list;
      $('#deb_clients').innerHTML = filtered.length? `<table class="table"><thead><tr><th>الكود</th><th>الاسم</th><th>الرصيد الافتتاحي</th><th>الرصيد الحالي</th></tr></thead><tbody>${filtered.map(c=>{
        const bal = clientCurrentBalance(c);
        return `<tr data-id="${c.id}" class="deb-client-row${selected&&selected.id===c.id?' active':''}"><td>${escapeHtml(c.code||'')}</td><td>${escapeHtml(c.name)}</td><td>${formatCurrency(c.opening||0)}</td><td>${formatCurrency(bal)}</td></tr>`; }).join('')}</tbody></table>` : 'لا يوجد عملاء.';
      // side / movements area
      if(selected){
        const c = selected; const curBal = clientCurrentBalance(c);
        const rows = txsAll.filter(t=> t.clientId===c.id).sort((a,b)=> String(b.date||'').localeCompare(String(a.date||'')));
        $('#deb_moves').innerHTML = `
          <div class="panel highlight">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:8px"><strong>${escapeHtml(c.name)}</strong><span class="badge">الرصيد الحالي: ${formatCurrency(curBal)}</span></div>
            <div class="grid cols-4" style="margin-bottom:10px">
              <input class="input" id="deb_tx_amount" type="number" placeholder="المبلغ" />
              <input class="input" id="deb_tx_date" type="date" />
              <input class="input" id="deb_tx_note" placeholder="البيان" />
              <select class="input" id="deb_tx_type"><option value="debt">إضافة دين</option><option value="pay">سداد دين</option></select>
            </div>
            <div class="toolbar"><button class="button" id="deb_add_tx">حفظ الحركة</button><button class="button ghost" id="deb_export_client">تصدير حركات العميل</button></div>
            <div style="margin-top:12px;overflow:auto">
              ${rows.length? `<table class="table"><thead><tr><th>التاريخ</th><th>النوع</th><th>المبلغ</th><th>البيان</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${escapeHtml(r.date||'')}</td><td>${r.type==='debt'?'دين':'سداد'}</td><td>${formatCurrency(r.amount||0)}</td><td>${escapeHtml(r.note||'')}</td></tr>`).join('')}</tbody></table>`:'لا توجد حركات.'}
            </div>
          </div>`;
        $('#deb_tx_date').value = new Date().toISOString().slice(0,10);
        $('#deb_add_tx').addEventListener('click', ()=>{
          const amount = Number($('#deb_tx_amount').value||0); const date = $('#deb_tx_date').value; const note=$('#deb_tx_note').value; const type=$('#deb_tx_type').value;
          if(!(amount>0)){ alert('المبلغ غير صالح'); return; }
          const arr = loadDebtTx();
            arr.push({ id:'DT'+Date.now(), clientId:c.id, type, amount, date, note });
            saveDebtTx(arr); $('#deb_tx_amount').value=''; $('#deb_tx_note').value=''; render();
        });
        $('#deb_export_client').addEventListener('click', ()=>{
          try{
            const rows = txsAll.filter(t=> t.clientId===c.id).map(t=>[c.code, c.name, t.date||'', t.type==='debt'? 'دين':'سداد', t.amount, t.note||'']);
            const headers = ['الكود','الاسم','التاريخ','النوع','المبلغ','البيان'];
            const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
            const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, 'Client');
            XLSX.writeFile(wb, `client_debts_${c.code}.xlsx`);
          }catch(e){ alert('تعذر التصدير: '+(e.message||e)); }
        });
      } else {
        $('#deb_moves').innerHTML = '<div class="panel">اختر عميل لعرض الحركات</div>';
      }
      $$('#deb_clients .deb-client-row').forEach(r=> r.addEventListener('click', ()=>{ selected = loadDebtClients().find(c=> c.id===r.dataset.id); render(); }));
    }
    content.innerHTML = breadcrumb + `
      <div class="section-title-bar">الديون <small>إدارة العملاء والحركات</small></div>
      <div class="panel">
        <div class="grid cols-4" style="margin-bottom:12px">
          <input class="input" id="deb_name" placeholder="اسم العميل" />
          <input class="input" id="deb_open" type="number" placeholder="الرصيد الافتتاحي (دين)" />
          <button class="button" id="deb_add">إضافة عميل</button>
          <input class="input" id="deb_search" placeholder="بحث (اسم/كود)" />
        </div>
        <div id="deb_clients" style="overflow:auto"></div>
      </div>
      <div id="deb_moves"></div>
      <div class="panel" style="margin-top:16px" id="deb_log_panel">
        <div class="title" style="margin-bottom:8px;font-weight:700">سجل الحركات العام</div>
        <div class="grid cols-4" style="margin-bottom:10px">
          <input class="input" id="fl_client" placeholder="اسم/كود العميل" />
          <select class="input" id="fl_type">
            <option value="all">كل الأنواع</option>
            <option value="debt">دين</option>
            <option value="pay">سداد</option>
          </select>
          <input class="input" id="fl_from" type="date" />
          <input class="input" id="fl_to" type="date" />
          <input class="input" id="fl_min" type="number" placeholder="المبلغ من" />
          <input class="input" id="fl_max" type="number" placeholder="المبلغ إلى" />
          <button class="button" id="fl_apply">تصفية</button>
          <button class="button ghost" id="deb_export_all">تصدير Excel</button>
        </div>
        <div id="deb_log_table" style="overflow:auto"></div>
      </div>`;
    $('#deb_add').addEventListener('click', ()=>{
      const name = $('#deb_name').value.trim(); const opening = Number($('#deb_open').value||0);
      if(!name){ alert('اكتب اسم العميل'); return; }
      const arr = loadDebtClients();
      const id = 'CL'+Date.now();
      const code = nextDebtClientCode();
      arr.push({ id, code, name, opening });
      saveDebtClients(arr); $('#deb_name').value=''; $('#deb_open').value=''; render();
    });
    $('#deb_search').addEventListener('input', render);
    render();
    // Global log rendering
    function renderLog(){
      const nameQ = ($('#fl_client').value||'').trim().toLowerCase();
      const typeQ = $('#fl_type').value||'all';
      const df = $('#fl_from').value; const dt = $('#fl_to').value;
      const min = ($('#fl_min').value==='')? null: Number($('#fl_min').value); const max = ($('#fl_max').value==='')? null: Number($('#fl_max').value);
      const clientsMap = Object.fromEntries(loadDebtClients().map(c=>[c.id,c]));
      let rows = loadDebtTx().slice();
      rows = rows.filter(r=>{
        const c = clientsMap[r.clientId]; if(!c) return false;
        if(nameQ){ const nm = (c.name+' '+(c.code||'')).toLowerCase(); if(!nm.includes(nameQ)) return false; }
        if(typeQ!=='all' && r.type!==typeQ) return false;
        if(df && String(r.date||'') < df) return false;
        if(dt && String(r.date||'') > dt) return false;
        const amt = Number(r.amount||0);
        if(min!==null && amt < min) return false;
        if(max!==null && amt > max) return false;
        return true;
      });
      rows.sort((a,b)=> String(b.date||'').localeCompare(String(a.date||'')) );
      $('#deb_log_table').innerHTML = rows.length? `<table class="table"><thead><tr><th>التاريخ</th><th>الكود</th><th>العميل</th><th>النوع</th><th>المبلغ</th><th>البيان</th></tr></thead><tbody>${rows.map(r=>{ const c=clientsMap[r.clientId]||{}; return `<tr><td>${escapeHtml(r.date||'')}</td><td>${escapeHtml(c.code||'')}</td><td>${escapeHtml(c.name||'')}</td><td>${r.type==='debt'?'دين':'سداد'}</td><td>${formatCurrency(r.amount||0)}</td><td>${escapeHtml(r.note||'')}</td></tr>` }).join('')}</tbody></table>` : 'لا توجد نتائج.';
    }
    $('#fl_apply').addEventListener('click', renderLog);
    $('#deb_export_all').addEventListener('click', ()=>{
      try{
        const clientsMap = Object.fromEntries(loadDebtClients().map(c=>[c.id,c]));
        const rows = loadDebtTx().map(r=>{ const c = clientsMap[r.clientId]||{}; return [r.date||'', c.code||'', c.name||'', r.type==='debt'?'دين':'سداد', r.amount, r.note||'']; });
        const headers=['التاريخ','كود','العميل','النوع','المبلغ','البيان'];
        const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]); const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, 'DebtsLog'); XLSX.writeFile(wb, 'debts_log.xlsx');
      }catch(e){ alert('فشل التصدير: '+(e.message||e)); }
    });
    renderLog();
  } else {
    content.innerHTML = breadcrumb + `<div class="panel">${titles[key]||'اختر من القائمة'}</div>`;
  }
}

function parseHash(){
  const h = location.hash.replace(/^#/, '').trim();
  if(!h) return 'products';
  // السماح فقط بالمفاتيح المعروفة، وإلا العودة للمنتجات
  const allowed = new Set(MENU_ITEMS.map(m=>m.key));
  // قبول مسارات فرعية محددة (حالياً صفحة إضافة منتج)
  if(allowed.has(h)) return h;
  if(h.startsWith('products/')) return h; // يسمح بـ products/add
  return 'products';
}

function downloadTemplate(){
  const headers = [
    'barcode','name','category','stock','buyPrice','cashPrice','bankPrice'
  ];
  const sample = [
    ['6291041500213','حليب طازج','ألبان', 24, 3.50, 4.50, 4.75]
  ];
  const ws = XLSX.utils.aoa_to_sheet([headers, ...sample]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Products');
  XLSX.writeFile(wb, 'products_template.xlsx');
}

function exportToExcel(){
  const headers = ['barcode','name','category','stock','buyPrice','cashPrice','bankPrice'];
  const data = loadProducts().map(p=>[
    p.barcode||'', p.name||'', p.category||'', Number(p.stock||0), Number(p.buyPrice||0), Number(p.cashPrice||0), Number(p.bankPrice||0)
  ]);
  const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Products');
  XLSX.writeFile(wb, 'products_export.xlsx');
}

function importFromExcel(){
  const input = document.createElement('input');
  input.type='file';
  input.accept='.xlsx,.xls,.csv';
  input.onchange = () => {
    const file = input.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const data = new Uint8Array(reader.result);
      const wb = XLSX.read(data, {type:'array'});
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(ws, {header:1, defval:''});
      if(!json.length){ alert('الملف فارغ'); return; }
      const headers = (json[0]||[]).map(String);
      const required = ['barcode','name','category','stock','buyPrice','cashPrice','bankPrice'];
      const missing = required.filter(h=>!headers.includes(h));
      if(missing.length){ alert('الأعمدة الناقصة: '+missing.join(', ')); return; }
      const hIndex = Object.fromEntries(headers.map((h,i)=>[h,i]));
      const current = loadProducts();
      for(let i=1;i<json.length;i++){
        const row = json[i];
        if(!row || row.length===0) continue;
        const p = {
          barcode: String(row[hIndex.barcode]||'').trim(),
          name: String(row[hIndex.name]||'').trim(),
          category: String(row[hIndex.category]||'').trim(),
          stock: Number(row[hIndex.stock]||0),
          buyPrice: Number(row[hIndex.buyPrice]||0),
          cashPrice: Number(row[hIndex.cashPrice]||0),
          bankPrice: Number(row[hIndex.bankPrice]||0),
        };
        if(!p.name) continue;
        current.push(p);
      }
      saveProducts(current);
      alert('تم الاستيراد بنجاح');
      renderTopStats();
      if(location.hash.replace('#','')==='products') renderProductsTable();
    };
    reader.readAsArrayBuffer(file);
  };
  input.click();
}

window.addEventListener('hashchange', ()=>renderPage(parseHash()));
window.addEventListener('DOMContentLoaded', ()=>{
  // تطبيق حالة إخفاء/إظهار القائمة الجانبية
  const collapsed = localStorage.getItem(SIDEBAR_KEY)==='1';
  if(collapsed) $('#sidebar').classList.add('collapsed');
  document.body.addEventListener('click', (e)=>{
    if(e.target && e.target.id==='toggle-sidebar'){
      $('#sidebar').classList.toggle('collapsed');
      localStorage.setItem(SIDEBAR_KEY, $('#sidebar').classList.contains('collapsed') ? '1' : '0');
    }
  });
  // تطبيق/تبديل الثيم
  const THEME_KEY = 'sm_theme_mode';
  const applyTheme = (mode)=>{
    document.body.classList.toggle('theme-dark', mode==='dark');
    const btn = document.getElementById('toggle-theme');
    if(btn) btn.textContent = mode==='dark' ? '🌙' : '🌞';
  };
  let mode = localStorage.getItem(THEME_KEY) || 'light';
  applyTheme(mode);
  document.addEventListener('click', (e)=>{
    if(e.target && e.target.id==='toggle-theme'){
      mode = (mode==='light') ? 'dark' : 'light';
      localStorage.setItem(THEME_KEY, mode);
      applyTheme(mode);
    }
  });
  renderPage(parseHash());
  // دعم إظهار الحاسبة كنافذة عائمة عند طلبها أثناء وجود تبويب آخر
  document.body.addEventListener('click', (e)=>{
    if(e.target && e.target.closest && e.target.closest('#sidebar')){
      // الزر ضمن القائمة الجانبية
      const btn = e.target.closest('button');
      if(btn && btn.textContent && btn.textContent.includes('الآلة الحاسبة')){
        const current = parseHash();
        if(current !== 'calculator'){
          // منع الانتقال الكامل: نحذف تغيير الهاش ونظهر نافذة عائمة
          location.hash = current; // إن حدث تغيير سريع نعيده
          if(!document.getElementById('floating_calculator')){
            const wrap = document.createElement('div');
            wrap.id = 'floating_calculator';
            wrap.style.position='fixed'; wrap.style.top='80px'; wrap.style.left='20px'; wrap.style.zIndex='9999'; wrap.style.background='var(--panel-bg,#222)'; wrap.style.color='var(--text,#fff)'; wrap.style.boxShadow='0 4px 14px rgba(0,0,0,0.35)'; wrap.style.border='1px solid var(--border,#444)'; wrap.style.borderRadius='12px'; wrap.style.width='320px'; wrap.style.maxWidth='90vw'; wrap.style.transition='opacity .2s, transform .2s'; wrap.style.opacity='0'; wrap.style.transform='scale(.9)';
            wrap.innerHTML = `<div style="display:flex;align-items:center;justify-content:space-between;padding:6px 10px;border-bottom:1px solid var(--border,#444)"><strong style="font-size:13px">حاسبة سريعة</strong><div style="display:flex;gap:4px"><button class="button ghost" id="fc_min" title="تصغير">_</button><button class="button ghost" id="fc_close" title="إغلاق">✕</button></div></div>
              <div id="fc_body" style="padding:8px">
                <div class="calc-box mini" style="box-shadow:none;background:transparent;padding:0">
                  <div class="calc-display" id="fc_disp" style="margin-bottom:6px"><div class="expr" id="fc_expr" style="font-size:14px">0</div><div class="result" id="fc_res" style="font-size:16px;font-weight:700">0</div></div>
                  <div class="calc-keys" id="fc_keys" style="grid-template-columns:repeat(4,1fr);gap:4px">
                    ${['C','CE','BS','/','7','8','9','*','4','5','6','-','1','2','3','+','%','0',',','.','=',''].filter(k=>k!=='').map(k=>`<button class="calc-key ${['/','*','-','+','%'].includes(k)?'op':(k==='='?'eq':(k.length>1?'fn':''))}" data-k="${k}">${k==='*'?'×':(k==='/'?'÷':k)}</button>`).join('')}
                  </div>
                  <div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap">
                    <button class="button ghost" id="fc_copy" style="flex:1">نسخ</button>
                    <button class="button ghost" id="fc_expand" style="flex:1">فتح الصفحة</button>
                  </div>
                </div>
              </div>`;
            document.body.appendChild(wrap);
            requestAnimationFrame(()=>{ wrap.style.opacity='1'; wrap.style.transform='scale(1)'; });
            let exprF='0'; let resF=0;
            function evalExprF(){
              try{ const safe = exprF.replace(/[^0-9+*\-\/%.,()]/g,'').replace(/,/g,''); const val = Function('return ('+safe+')')(); resF = Number(val||0); }catch{ /* ignore */ }
              document.getElementById('fc_expr').textContent = exprF;
              document.getElementById('fc_res').textContent = resF;
            }
            function press(k){
              if(k==='C'){ exprF='0'; resF=0; evalExprF(); return; }
              if(k==='CE'){ exprF='0'; evalExprF(); return; }
              if(k==='BS'){ exprF = exprF.length>1? exprF.slice(0,-1):'0'; evalExprF(); return; }
              if(k==='='){ evalExprF(); exprF = String(resF); evalExprF(); return; }
              if(k==='%'){ try{ const safe = exprF.replace(/[^0-9+*\-\/%.,()]/g,'').replace(/,/g,''); const val = Function('return ('+safe+')')(); exprF = String(Number(val||0)/100); evalExprF(); }catch{} return; }
              if(k===','){ k='+'; }
              if(exprF==='0' && /[0-9]/.test(k)){ exprF=k; } else { exprF += k; }
              evalExprF();
            }
            evalExprF();
            document.getElementById('fc_keys').addEventListener('click', ev=>{ if(ev.target.dataset.k){ press(ev.target.dataset.k); } });
            document.getElementById('fc_copy').addEventListener('click', ()=>{ try{ navigator.clipboard.writeText(String(resF)); }catch{} });
            document.getElementById('fc_expand').addEventListener('click', ()=>{ location.hash='calculator'; wrap.remove(); });
            document.getElementById('fc_close').addEventListener('click', ()=> wrap.remove());
            document.getElementById('fc_min').addEventListener('click', ()=>{ const body=document.getElementById('fc_body'); if(body.style.display!=='none'){ body.style.display='none'; wrap.style.height='auto'; } else { body.style.display=''; } });
            // سحب (تحريك) النافذة
            let drag=false, sx=0, sy=0, ox=0, oy=0; const header=wrap.firstChild; header.style.cursor='move';
            header.addEventListener('mousedown', ev=>{ drag=true; sx=ev.clientX; sy=ev.clientY; const r=wrap.getBoundingClientRect(); ox=r.left; oy=r.top; ev.preventDefault(); });
            window.addEventListener('mousemove', ev=>{ if(!drag) return; const dx=ev.clientX-sx; const dy=ev.clientY-sy; wrap.style.left=(ox+dx)+"px"; wrap.style.top=(oy+dy)+"px"; });
            window.addEventListener('mouseup', ()=> drag=false);
          } else {
            const w = document.getElementById('floating_calculator'); w.style.opacity='0'; setTimeout(()=>{ w.style.opacity='1'; },100);
          }
        }
      }
    }
  });
});

  // صفحة الفواتير
  function renderInvoicesPage(){
    const sales = loadSales();
    const purch = loadPurchases();
  }
