// === FUNCIONES AYUDAS DE CONFIGURACIÓN Y API (inyectadas) ===
/**/
if (typeof CONFIG === 'undefined') {
  var CONFIG = {
  get MOCKAPI_BASE() {
    try { return localStorage.MOCKAPI_BASE || "https://68e9132df2707e6128cd7502.mockapi.io"; }
    catch(_) { return "https://68e9132df2707e6128cd7502.mockapi.io"; }
  },
  ENDPOINTS: { productos: "productos", carrito: "carrito" }
};
  window.CONFIG = CONFIG;
}


/*AYUDANTES DE API PROTEGIDOS*/
if (!window.__apiHelpersInstalled) {
window.__apiHelpersInstalled = true;
async function apiFetch(path, opts={}) {
  const url = `${CONFIG.MOCKAPI_BASE}/${path}`;
  try {
    const res = await fetch(url, opts);
    if (!res.ok) throw new Error(`${opts.method||'GET'} ${url} -> ${res.status}`);
    const ctype = res.headers.get('content-type') || '';
    if (ctype.includes('application/json')) return await res.json();
    return await res.text();
  } catch (err) {
    console.error(err);
    if (typeof toast === 'function') toast('Error de conexión. Verifica MOCKAPI_BASE.');
    throw err;
  }
}
const apiGet    = (p)   => apiFetch(p);
const apiPost   = (p,d) => apiFetch(p, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(d)});
const apiDelete = (p)   => apiFetch(p, {method:'DELETE'});

}

// Helpers comunes
/*ESCAPE_PROTEGIDO*/
if (!window.__escHelperInstalled) { window.__escHelperInstalled = true; const esc = (s='') => String(s)
  .replaceAll('&','&amp;').replaceAll('<','&lt;')
  .replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
}

/*
DINERO_PROTEGIDO*/
if (!window.__moneyHelperInstalled) { window.__moneyHelperInstalled = true; const moneyFmt = new Intl.NumberFormat('es-AR', { style:'currency', currency:'ARS' });
const formatMoney = (n) => moneyFmt.format(Number(n||0));
}

// Seeds idempotentes
async function seedProductosIfNeeded() {
  try {
    const list = await apiGet(CONFIG.ENDPOINTS.productos);
    const setByName = new Set((Array.isArray(list)?list:[]).map(p => (p.nombre||'').toLowerCase()));
    const seeds = [
      { nombre:"Auricular", precio:1200, stock:10, marca:"Genérica", categoria:"Audio", descCorta:"Auricular clásico", descLarga:"-", envio:true,  edadDesde:0, edadHasta:99, foto:"img/Producto1.jpg" },
      { nombre:"Sillon",    precio:2500, stock:5,  marca:"Hogar",    categoria:"Muebles", descCorta:"Sillón",          descLarga:"-", envio:false, edadDesde:0, edadHasta:99, foto:"img/Producto2.jpg" },
      { nombre:"Mueble",    precio:3800, stock:3,  marca:"Hogar",    categoria:"Muebles", descCorta:"Mueble",          descLarga:"-", envio:false, edadDesde:0, edadHasta:99, foto:"img/Producto3.jpg" }
    ];
    for (const p of seeds) {
      if (!setByName.has(p.nombre.toLowerCase())) {
        await apiPost(CONFIG.ENDPOINTS.productos, p);
      }
    }
  } catch (e) {
    console.warn('Seeds: omitidas (sin conexión o endpoint inválido)');
  }
}

// Ejemplo simple para manejar búsqueda (puede ampliarse)
document.querySelector('.search-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Función de búsqueda no implementada todavía.');
});



seedProductosIfNeeded();


// === AUTO-DETECTOR MOCKAPI (injected) ===
function __qsParam(name){
  const m = location.search.match(new RegExp('[?&]'+name+'=([^&]+)'));
  return m ? decodeURIComponent(m[1]) : null;
}
async function __probeBase(base){
  try{
    const res = await fetch(`${base.replace(/\/$/,'')}/${CONFIG.ENDPOINTS.productos}`, {cache:'no-store'});
    if(!res.ok) return { ok:false, status:res.status };
    const data = await res.json().catch(()=>null);
    const isArray = Array.isArray(data);
    return { ok: true, status:res.status, isArray };
  }catch(e){ return { ok:false, err:String(e) };}
}
async function detectMockApiBase(){
  const urlOverride = __qsParam('api');
  const stored = (function(){ try { return localStorage.MOCKAPI_BASE || '' } catch(_) { return '' } })();
  const defaults = [
    stored,
    urlOverride,
    "https://68e9132df2707e6128cd7502.mockapi.io",
    "https://68e58eaa21dd31f22cc21ffa.mockapi.io"
  ].filter(Boolean);
  const seen = new Set();
  for (const base of defaults){
    if (seen.has(base)) continue;
    seen.add(base);
    const r = await __probeBase(base);
    const bannerBase = document.getElementById('apiBaseTxt');
    const bannerHealth = document.getElementById('apiHealthTxt');
    if (bannerBase) bannerBase.textContent = base;
    if (r.ok){
      if (bannerHealth) bannerHealth.textContent = `OK (${r.status})`;
      try { localStorage.MOCKAPI_BASE = base; } catch(_){}
      return base;
    } else {
      if (bannerHealth) bannerHealth.textContent = `Fallo`;
    }
  }
  const bannerBase = document.getElementById('apiBaseTxt');
  const bannerHealth = document.getElementById('apiHealthTxt');
  if (bannerBase) bannerBase.textContent = "(sin conexión)";
  if (bannerHealth) bannerHealth.textContent = `Error`;
  throw new Error("No se pudo detectar una base MockAPI operativa.");
}

async function bootAppWithDetection(){
  try{
    const base = await detectMockApiBase();
    // Forzar a que CONFIG get MOCKAPI_BASE lea el stored actualizado
    console.log("Usando MockAPI:", base);
    // Seeds y primer render
    if (typeof seedProductosIfNeeded === 'function') {
      await seedProductosIfNeeded();
    }
    if (typeof navigate === 'function') {
      navigate('home');
    } else if (typeof render === 'function') {
      render('home');
    }
  }catch(e){
    console.error(e);
    if (typeof toast === 'function') toast('No se pudo conectar con MockAPI');
  }
}

// Arranque automático tras load si no se llamó aún
if (!window.__bootAppScheduled) {
  window.__bootAppScheduled = true;
  window.addEventListener('load', () => bootAppWithDetection());
}
