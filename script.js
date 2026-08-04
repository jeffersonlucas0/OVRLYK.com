(function(){
  "use strict";

  // ---------- dados dos produtos ----------
  const products = [
    { id:1, name:"Camiseta Oversize Básica", cat:"camisetas", price:89.90, fig:"T", sku:"CT-101", stock:14, img:"imagens/camiseta-basica.svg" },
    { id:2, name:"Regata Ampla", cat:"camisetas", price:99.90, fig:"R", sku:"CT-104", stock:6, img:"imagens/regata-ampla.svg" },
    { id:3, name:"Camiseta Oversize Manga Longa", cat:"camisetas", price:119.90, fig:"T", sku:"CT-112", stock:9, img:"imagens/camiseta-manga-longa.svg" },
    { id:4, name:"Moletom Oversize Canguru", cat:"moletons", price:189.90, fig:"M", sku:"MO-201", stock:4, img:"imagens/moletom-canguru.svg" },
    { id:5, name:"Moletom Oversize Gola Alta", cat:"moletons", price:169.90, fig:"M", sku:"MO-207", stock:11, img:"imagens/moletom-gola-alta.svg" },
    { id:6, name:"Moletom Oversize Zíper", cat:"moletons", price:219.90, fig:"M", sku:"MO-215", stock:3, img:"imagens/moletom-zip.svg" },
    { id:7, name:"Calça Cargo Oversize", cat:"calcas", price:189.90, fig:"C", sku:"CL-501", stock:8, img:"imagens/calca-cargo.svg" },
    { id:8, name:"Calça Moletom Reta", cat:"calcas", price:159.90, fig:"C", sku:"CL-508", stock:17, img:"imagens/calca-moletom-reta.svg" },
    { id:9, name:"Calça Sarja Ampla", cat:"calcas", price:199.90, fig:"C", sku:"CL-514", stock:5, img:"imagens/calca-sarja-ampla.svg" },
    { id:10, name:"Boné Aba Reta Ovrlyk", cat:"acessorios", price:69.90, fig:"A", sku:"AC-401", stock:22, img:"imagens/bone-aba-reta.svg" },
    { id:11, name:"Meia Cano Alto Kit 3", cat:"acessorios", price:49.90, fig:"A", sku:"AC-408", stock:30, img:"imagens/meia-kit3.svg" },
    { id:12, name:"Bolsa Transversal Oversize", cat:"acessorios", price:129.90, fig:"A", sku:"AC-415", stock:7, img:"imagens/bolsa-transversal.svg" },
  ];

  // Para usar foto real num produto, preencha o campo "img" acima com o
  // caminho do arquivo, por exemplo: img:"imagens/camiseta-basica.jpg"
  // ou uma URL completa, por exemplo: img:"https://exemplo.com/foto.jpg"
  // Deixando "" (vazio), o produto continua usando a letra estilizada.

  const fmt = (v) => "R$ " + v.toFixed(2).replace(".", ",");

  // ---------- estado ----------
  let currentFilter = "todos";
  let cart = []; // { id, qty }

  // ---------- elementos ----------
  const grid = document.getElementById("productGrid");
  const resultCount = document.getElementById("resultCount");
  const chips = document.querySelectorAll(".chip");
  const cartCount = document.getElementById("cartCount");
  const drawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("overlay");
  const drawerItems = document.getElementById("drawerItems");
  const cartTotal = document.getElementById("cartTotal");
  const checkoutBtn = document.getElementById("checkoutBtn");

  // ---------- render catálogo ----------
  function renderGrid(){
    const list = currentFilter === "todos"
      ? products
      : products.filter(p => p.cat === currentFilter);

    resultCount.textContent = list.length;

    grid.innerHTML = list.map(p => `
      <article class="card">
        <div class="card-media">
          <span class="tag-hole" aria-hidden="true"></span>
          ${p.img
            ? `<img src="${p.img}" alt="${p.name}" loading="lazy">`
            : `<span class="fig" aria-hidden="true">${p.fig}</span>`
          }
          <span class="sku">${p.sku}</span>
        </div>
        <div class="card-body">
          <span class="card-cat">${catLabel(p.cat)}</span>
          <h3 class="card-name">${p.name}</h3>
          <span class="stock-badge${p.stock <= 6 ? ' urgent' : ''}">${p.stock <= 6 ? `Restam ${p.stock} unidades` : `${p.stock} em estoque`}</span>
          <div class="card-bottom">
            <span class="price">${fmt(p.price)}</span>
            <button class="add-btn" data-id="${p.id}">Adicionar</button>
          </div>
        </div>
      </article>
    `).join("");

    grid.querySelectorAll(".add-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        addToCart(Number(btn.dataset.id));
        btn.textContent = "Adicionado ✓";
        btn.classList.add("added");
        setTimeout(() => {
          btn.textContent = "Adicionar";
          btn.classList.remove("added");
        }, 1100);
      });
    });
  }

  function catLabel(cat){
    const map = { camisetas:"Camiseta", moletons:"Moletom", calcas:"Calça", acessorios:"Acessório" };
    return map[cat] || cat;
  }

  // ---------- filtros ----------
  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      chips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      currentFilter = chip.dataset.cat;
      renderGrid();
    });
  });

  // ---------- carrinho ----------
  function addToCart(id){
    const existing = cart.find(i => i.id === id);
    if(existing){ existing.qty += 1; }
    else{ cart.push({ id, qty:1 }); }
    renderCart();
  }

  function changeQty(id, delta){
    const item = cart.find(i => i.id === id);
    if(!item) return;
    item.qty += delta;
    if(item.qty <= 0){
      cart = cart.filter(i => i.id !== id);
    }
    renderCart();
  }

  function removeItem(id){
    cart = cart.filter(i => i.id !== id);
    renderCart();
  }

  function renderCart(){
    const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);
    cartCount.textContent = totalItems;

    if(cart.length === 0){
      drawerItems.innerHTML = `<div class="empty-cart">Seu carrinho está vazio.<br>Adicione peças no catálogo.</div>`;
      cartTotal.textContent = fmt(0);
      checkoutBtn.disabled = true;
      return;
    }

    let total = 0;
    drawerItems.innerHTML = cart.map(item => {
      const p = products.find(pr => pr.id === item.id);
      const lineTotal = p.price * item.qty;
      total += lineTotal;
      return `
        <div class="item-row">
          <div class="item-fig" aria-hidden="true">${p.fig}</div>
          <div class="item-info">
            <span class="name">${p.name}</span>
            <span class="cat">${catLabel(p.cat)} · ${p.sku}</span>
            <div class="item-controls">
              <div class="qty-control">
                <button data-action="dec" data-id="${p.id}" aria-label="Diminuir quantidade">−</button>
                <span>${item.qty}</span>
                <button data-action="inc" data-id="${p.id}" aria-label="Aumentar quantidade">+</button>
              </div>
              <span class="item-price">${fmt(lineTotal)}</span>
            </div>
            <button class="remove-btn" data-action="remove" data-id="${p.id}">Remover</button>
          </div>
        </div>
      `;
    }).join("");

    cartTotal.textContent = fmt(total);
    checkoutBtn.disabled = false;

    drawerItems.querySelectorAll("[data-action]").forEach(btn => {
      const id = Number(btn.dataset.id);
      const action = btn.dataset.action;
      btn.addEventListener("click", () => {
        if(action === "inc") changeQty(id, 1);
        if(action === "dec") changeQty(id, -1);
        if(action === "remove") removeItem(id);
      });
    });
  }

  // ---------- drawer open/close ----------
  function openDrawer(){
    drawer.classList.add("open");
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeDrawer(){
    drawer.classList.remove("open");
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }
  document.getElementById("openCart").addEventListener("click", openDrawer);
  document.getElementById("closeCart").addEventListener("click", closeDrawer);
  overlay.addEventListener("click", closeDrawer);
  document.addEventListener("keydown", (e) => { if(e.key === "Escape") closeDrawer(); });

  checkoutBtn.addEventListener("click", () => {
    alert("Pedido de exemplo! Em um site real, aqui seguiria para o pagamento.");
  });

  // ---------- newsletter (simulado) ----------
  document.getElementById("newsletterForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("newsletterEmail").value;
    const msg = document.getElementById("newsletterMsg");
    msg.textContent = `Inscrito com ${email}. (simulação — sem envio real)`;
    document.getElementById("newsletterEmail").value = "";
  });

  // ---------- init ----------
  renderGrid();
  renderCart();
})();
