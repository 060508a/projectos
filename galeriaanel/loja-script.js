/* ============================================================
   GALERIA ANEL — loja-script.js
   Login · Loja · Carrinho · Fatura
   ============================================================ */
(function () {
  'use strict';

  /* ════════════════════════════════════════════════════════════
     DADOS — PRODUTOS
  ════════════════════════════════════════════════════════════ */
  const PRODUCTS = [
    // Mobiliário & Decoração
    { id: 1, sku: 'MOB-001', name: 'Cadeira de Balanço', cat: 'Mobiliário & Decoração', price: 145.00, emoji: '🪑', desc: 'Cadeira de balanço em madeira de teca envelhecida. Peça dos anos 60, restaurada com cera natural. Estrutura sólida e assento confortável.' },
    { id: 2, sku: 'MOB-002', name: 'Espelho Art Déco',   cat: 'Mobiliário & Decoração', price: 89.00,  emoji: '🪞', desc: 'Espelho com moldura dourada em estilo Art Déco. Proveniente de um atelier de Lisboa, circa 1940. Vidro original sem fissuras.' },
    { id: 3, sku: 'MOB-003', name: 'Candeeiro de Mesa',  cat: 'Mobiliário & Decoração', price: 54.00,  emoji: '🪔', desc: 'Candeeiro vintage com base em latão e paralume em tecido creme. Cablagem renovada. Iluminação aconchegante.' },
    { id: 4, sku: 'MOB-004', name: 'Aparador Português', cat: 'Mobiliário & Decoração', price: 220.00, emoji: '🗄️', desc: 'Aparador em madeira de castanho, estilo rústico português. Três gavetas originais com puxadores de ferro forjado.' },

    // Livros & Manuscritos
    { id: 5, sku: 'LIV-001', name: 'Fernando Pessoa — Mensagem',   cat: 'Livros & Manuscritos', price: 38.00,  emoji: '📖', desc: 'Edição de 1942, Ática. Capa dura com dourados. Estado de conservação muito bom, algumas anotações a lápis nas margens.' },
    { id: 6, sku: 'LIV-002', name: 'Diário de Viagem (1887)',       cat: 'Livros & Manuscritos', price: 95.00,  emoji: '📒', desc: 'Manuscrito em caligrafia victoriana. Relatos de viagem pelo Mediterrâneo. Papel amarelado com cheiro a história.' },
    { id: 7, sku: 'LIV-003', name: 'Enciclopédia Ilustrada (1910)', cat: 'Livros & Manuscritos', price: 72.00,  emoji: '📚', desc: 'Volume único de enciclopédia portuguesa do início do séc. XX. Gravuras originais impressas em tipografia. Lombada restaurada.' },

    // Joias & Adornos
    { id: 8,  sku: 'JOI-001', name: 'Broche Filigrana',      cat: 'Joias & Adornos', price: 68.00,  emoji: '✨', desc: 'Broche em prata filigranada, feito à mão em Viana do Castelo, circa 1950. Estojo original incluído.' },
    { id: 9,  sku: 'JOI-002', name: 'Colar Art Nouveau',     cat: 'Joias & Adornos', price: 115.00, emoji: '💎', desc: 'Colar em metal dourado com pedra ágata, estilo Art Nouveau. Fecho original em bom estado.' },
    { id: 10, sku: 'JOI-003', name: 'Pulseira de Azeviche',  cat: 'Joias & Adornos', price: 42.00,  emoji: '🖤', desc: 'Pulseira em azeviche legítimo, material mineral único da região de Trás-os-Montes. Peça rara e singular.' },

    // Arte & Fotografia
    { id: 11, sku: 'ART-001', name: 'Gravura — Lisboa Anos 70', cat: 'Arte & Fotografia', price: 180.00, emoji: '🖼️', desc: 'Serigrafia numerada e assinada pelo artista. Série de 30 exemplares. Representa a Ribeira de Lisboa antes das reformas.' },
    { id: 12, sku: 'ART-002', name: 'Fotografia Analógica',     cat: 'Arte & Fotografia', price: 65.00,  emoji: '📷', desc: 'Fotografia analógica em preto e branco, impressão em papel baryta 30x40cm. Cena rural do Alentejo, décadas de 60.' },
    { id: 13, sku: 'ART-003', name: 'Aguarela Original',         cat: 'Arte & Fotografia', price: 240.00, emoji: '🎨', desc: 'Aguarela original sobre papel de algodão. Paisagem costeira, autoria de artista portuense emergente dos anos 80.' },

    // Roupa & Moda Vintage
    { id: 14, sku: 'ROV-001', name: 'Casaco de Tweed',      cat: 'Roupa & Moda Vintage', price: 95.00,  emoji: '🧥', desc: 'Casaco em tweed irlandês, tamanho M. Fabricado nos anos 80. Forro interior em seda. Estado impecável.' },
    { id: 15, sku: 'ROV-002', name: 'Lenço de Seda Hermès', cat: 'Roupa & Moda Vintage', price: 130.00, emoji: '🧣', desc: 'Lenço 90x90cm em seda pura. Motivo floral com orlas azuis. Autêntico, acompanha caixa original laranja.' },
    { id: 16, sku: 'ROV-003', name: 'Chapéu Cloche 1920s',  cat: 'Roupa & Moda Vintage', price: 78.00,  emoji: '🎩', desc: 'Chapéu cloche em feltro bege, típico dos anos 20. Detalhes em fita de seda preta. Peça única de época.' },
  ];

  const CATEGORIES = ['Todos', ...new Set(PRODUCTS.map(p => p.cat))];

  /* ════════════════════════════════════════════════════════════
     ESTADO
  ════════════════════════════════════════════════════════════ */
  let currentUser   = null;   // { name, email }
  let cart          = [];     // [{ product, qty }]
  let activeCategory= 'Todos';
  let searchQuery   = '';
  let sortMode      = 'default';
  let modalProduct  = null;
  let modalQty      = 1;

  /* ════════════════════════════════════════════════════════════
     ECRÃS
  ════════════════════════════════════════════════════════════ */
  const screens = {
    login:    document.getElementById('screenLogin'),
    register: document.getElementById('screenRegister'),
    shop:     document.getElementById('screenShop'),
  };

  function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.add('hidden'));
    screens[name].classList.remove('hidden');
  }

  /* ════════════════════════════════════════════════════════════
     TEMA
  ════════════════════════════════════════════════════════════ */
  const html = document.documentElement;
  const THEME_KEY = 'galeria-anel-theme';

  function applyTheme(t) { html.setAttribute('data-theme', t); }

  (function initTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) { applyTheme(stored); return; }
    applyTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  })();

  document.getElementById('themeToggle').addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch {}
  });

  /* ════════════════════════════════════════════════════════════
     LOGIN
  ════════════════════════════════════════════════════════════ */
  // Utilizadores em memória (simples)
  let users = JSON.parse(localStorage.getItem('ga-users') || '[]');

  function saveUsers() {
    try { localStorage.setItem('ga-users', JSON.stringify(users)); } catch {}
  }

  // Toggle visibilidade senha
  const pwToggle = document.getElementById('pwToggle');
  const loginPw  = document.getElementById('loginPassword');

  pwToggle.addEventListener('click', () => {
    const isText = loginPw.type === 'text';
    loginPw.type = isText ? 'password' : 'text';
    pwToggle.querySelector('.eye-open').style.display  = isText ? 'inline' : 'none';
    pwToggle.querySelector('.eye-closed').style.display= isText ? 'none'   : 'inline';
  });

  // Trocar para registo
  document.getElementById('toRegister').addEventListener('click', () => showScreen('register'));
  document.getElementById('toLogin').addEventListener('click', () => showScreen('login'));

  // Submeter login
  document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const pw    = document.getElementById('loginPassword').value;
    const emailErr = document.getElementById('emailError');
    const pwErr    = document.getElementById('pwError');
    emailErr.textContent = '';
    pwErr.textContent    = '';

    const user = users.find(u => u.email === email);
    if (!user) { emailErr.textContent = 'E-mail não encontrado.'; return; }
    if (user.password !== pw) { pwErr.textContent = 'Palavra-passe incorreta.'; return; }

    currentUser = { name: user.name, email: user.email };
    enterShop();
  });

  // Submeter registo
  document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name  = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const pw    = document.getElementById('regPassword').value;

    if (!name || !email || pw.length < 6) {
      alert('Preencha todos os campos. A palavra-passe deve ter pelo menos 6 caracteres.');
      return;
    }

    if (users.find(u => u.email === email)) {
      alert('Este e-mail já está registado. Faça login.');
      showScreen('login');
      return;
    }

    users.push({ name, email, password: pw });
    saveUsers();
    currentUser = { name, email };
    enterShop();
  });

  // Logout
  document.getElementById('logoutBtn').addEventListener('click', () => {
    currentUser = null;
    cart = [];
    renderCartCount();
    showScreen('login');
    document.getElementById('loginForm').reset();
    document.getElementById('loginPassword').type = 'password';
  });

  /* ════════════════════════════════════════════════════════════
     ENTRAR NA LOJA
  ════════════════════════════════════════════════════════════ */
  function enterShop() {
    showScreen('shop');
    buildCategories();
    renderProducts();
    updateNavUser();
  }

  /* ════════════════════════════════════════════════════════════
     NAV SIDEBAR
  ════════════════════════════════════════════════════════════ */
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navSidebar   = document.getElementById('navSidebar');
  const navOverlay   = document.getElementById('navOverlay');
  const navClose     = document.getElementById('navClose');

  function openNav() {
    navSidebar.classList.add('open');
    navOverlay.classList.add('active');
    hamburgerBtn.classList.add('active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    navSidebar.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    navSidebar.classList.remove('open');
    navOverlay.classList.remove('active');
    hamburgerBtn.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    navSidebar.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  hamburgerBtn.addEventListener('click', () => navSidebar.classList.contains('open') ? closeNav() : openNav());
  navClose.addEventListener('click', closeNav);
  navOverlay.addEventListener('click', closeNav);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeNav(); closeCart(); closeProductModal(); }
  });

  /* ════════════════════════════════════════════════════════════
     CATEGORIAS
  ════════════════════════════════════════════════════════════ */
  function buildCategories() {
    const list = document.getElementById('catList');
    list.innerHTML = '';
    CATEGORIES.forEach(cat => {
      const li = document.createElement('li');
      const a  = document.createElement('a');
      a.href = '#';
      a.innerHTML = `<span class="cat-dot"></span>${cat}`;
      if (cat === activeCategory) a.classList.add('active');
      a.addEventListener('click', (e) => {
        e.preventDefault();
        activeCategory = cat;
        searchQuery = '';
        document.getElementById('searchInput').value = '';
        document.getElementById('sortSelect').value = 'default';
        sortMode = 'default';
        buildCategories();
        renderProducts();
        closeNav();
      });
      li.appendChild(a);
      list.appendChild(li);
    });
  }

  function updateNavUser() {
    const el = document.getElementById('navUser');
    if (currentUser) {
      el.innerHTML = `Olá, <em>${currentUser.name.split(' ')[0]}</em>`;
    }
  }

  /* ════════════════════════════════════════════════════════════
     PESQUISA & ORDENAÇÃO
  ════════════════════════════════════════════════════════════ */
  document.getElementById('searchInput').addEventListener('input', (e) => {
    searchQuery = e.target.value.trim().toLowerCase();
    activeCategory = 'Todos';
    buildCategories();
    renderProducts();
  });

  document.getElementById('sortSelect').addEventListener('change', (e) => {
    sortMode = e.target.value;
    renderProducts();
  });

  /* ════════════════════════════════════════════════════════════
     RENDER PRODUTOS
  ════════════════════════════════════════════════════════════ */
  function getFiltered() {
    let list = [...PRODUCTS];

    if (activeCategory !== 'Todos') {
      list = list.filter(p => p.cat === activeCategory);
    }

    if (searchQuery) {
      list = list.filter(p =>
        p.name.toLowerCase().includes(searchQuery) ||
        p.cat.toLowerCase().includes(searchQuery)  ||
        p.sku.toLowerCase().includes(searchQuery)
      );
    }

    if (sortMode === 'price-asc')  list.sort((a,b) => a.price - b.price);
    if (sortMode === 'price-desc') list.sort((a,b) => b.price - a.price);
    if (sortMode === 'name-asc')   list.sort((a,b) => a.name.localeCompare(b.name));

    return list;
  }

  function renderProducts() {
    const grid     = document.getElementById('productsGrid');
    const emptyMsg = document.getElementById('emptyMsg');
    const heading  = document.getElementById('shopHeading');
    const countEl  = document.getElementById('shopCount');
    const list     = getFiltered();

    heading.textContent = searchQuery
      ? `Resultados para "${searchQuery}"`
      : activeCategory === 'Todos' ? 'Todos os produtos' : activeCategory;

    grid.innerHTML = '';

    if (list.length === 0) {
      emptyMsg.classList.remove('hidden');
      countEl.textContent = '';
      return;
    }

    emptyMsg.classList.add('hidden');
    countEl.textContent = `${list.length} produto${list.length !== 1 ? 's' : ''}`;

    list.forEach((p, i) => {
      const card = document.createElement('article');
      card.className = 'prod-card';
      card.style.animationDelay = `${i * 40}ms`;
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `Ver ${p.name}`);
      card.innerHTML = `
        <div class="prod-thumb" style="background:${thumbBg(p.id)}">
          <div class="prod-thumb-inner">${p.emoji}</div>
        </div>
        <div class="prod-body">
          <span class="prod-cat-tag">${p.cat.split(' ')[0]}</span>
          <h3 class="prod-name">${p.name}</h3>
          <p class="prod-sku">SKU: ${p.sku}</p>
          <div class="prod-footer">
            <span class="prod-price">${fmt(p.price)}</span>
            <button class="prod-add-btn" aria-label="Adicionar ao carrinho" title="Adicionar ao carrinho">+</button>
          </div>
        </div>`;

      card.addEventListener('click', (e) => {
        if (e.target.closest('.prod-add-btn')) {
          addToCart(p, 1);
          animateAddBtn(e.target.closest('.prod-add-btn'));
        } else {
          openProductModal(p);
        }
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') openProductModal(p);
      });

      grid.appendChild(card);
    });
  }

  function thumbBg(id) {
    const bgs = [
      'radial-gradient(ellipse at 60% 40%, rgba(80,50,140,0.55) 0%, transparent 65%)',
      'radial-gradient(ellipse at 30% 60%, rgba(50,70,150,0.5) 0%, transparent 60%)',
      'radial-gradient(ellipse at 70% 60%, rgba(100,60,160,0.5) 0%, transparent 60%)',
    ];
    return bgs[id % bgs.length];
  }

  function animateAddBtn(btn) {
    btn.textContent = '✓';
    btn.style.background = 'var(--accent)';
    btn.style.color = '#fff';
    setTimeout(() => {
      btn.textContent = '+';
      btn.style.background = '';
      btn.style.color = '';
    }, 900);
  }

  /* ════════════════════════════════════════════════════════════
     PRODUCT MODAL
  ════════════════════════════════════════════════════════════ */
  function openProductModal(p) {
    modalProduct = p;
    modalQty     = 1;
    document.getElementById('pmVisual').textContent  = p.emoji;
    document.getElementById('pmCat').textContent     = p.cat;
    document.getElementById('pmTitle').textContent   = p.name;
    document.getElementById('pmSku').textContent     = `SKU: ${p.sku}`;
    document.getElementById('pmDesc').textContent    = p.desc;
    document.getElementById('pmPrice').textContent   = fmt(p.price);
    document.getElementById('pmQty').textContent     = '1';
    document.getElementById('pmVisual').style.background = thumbBg(p.id);
    document.getElementById('productModalOverlay').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeProductModal() {
    document.getElementById('productModalOverlay').classList.add('hidden');
    document.body.style.overflow = '';
    modalProduct = null;
  }

  document.getElementById('productModalClose').addEventListener('click', closeProductModal);
  document.getElementById('productModalOverlay').addEventListener('click', (e) => {
    if (e.target === document.getElementById('productModalOverlay')) closeProductModal();
  });

  document.getElementById('pmQtyMinus').addEventListener('click', () => {
    if (modalQty > 1) { modalQty--; document.getElementById('pmQty').textContent = modalQty; }
  });

  document.getElementById('pmQtyPlus').addEventListener('click', () => {
    modalQty++;
    document.getElementById('pmQty').textContent = modalQty;
  });

  document.getElementById('pmAddToCart').addEventListener('click', () => {
    if (!modalProduct) return;
    addToCart(modalProduct, modalQty);
    closeProductModal();
  });

  /* ════════════════════════════════════════════════════════════
     CARRINHO
  ════════════════════════════════════════════════════════════ */
  const cartDrawer  = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartBtn     = document.getElementById('cartBtn');
  const cartClose   = document.getElementById('cartClose');

  function openCart() {
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('active');
    cartDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    renderCart();
  }

  function closeCart() {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('active');
    cartDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  cartBtn.addEventListener('click', openCart);
  cartClose.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  function addToCart(product, qty) {
    const existing = cart.find(i => i.product.id === product.id);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ product, qty });
    }
    renderCartCount();
    // Toast rápido
    showToast(`"${product.name}" adicionado ao carrinho`);
  }

  function renderCartCount() {
    const total = cart.reduce((s, i) => s + i.qty, 0);
    const el    = document.getElementById('cartCount');
    el.textContent = total;
    if (total > 0) { el.classList.add('visible'); }
    else           { el.classList.remove('visible'); }
  }

  function renderCart() {
    const body   = document.getElementById('cartBody');
    const footer = document.getElementById('cartFooter');
    const totalEl= document.getElementById('cartTotal');
    body.innerHTML = '';

    if (cart.length === 0) {
      body.innerHTML = '<p class="cart-empty">O seu carrinho está vazio.</p>';
      footer.style.display = 'none';
      return;
    }

    footer.style.display = '';

    cart.forEach(item => {
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <div class="ci-thumb">${item.product.emoji}</div>
        <div class="ci-info">
          <p class="ci-name">${item.product.name}</p>
          <p class="ci-sku">${item.product.sku}</p>
        </div>
        <div class="ci-right">
          <span class="ci-price">${fmt(item.product.price * item.qty)}</span>
          <div class="qty-ctrl">
            <button class="qty-btn" data-action="minus" data-id="${item.product.id}">−</button>
            <span class="qty-val">${item.qty}</span>
            <button class="qty-btn" data-action="plus"  data-id="${item.product.id}">+</button>
          </div>
          <button class="ci-remove" data-id="${item.product.id}">remover</button>
        </div>`;
      body.appendChild(div);
    });

    const total = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
    totalEl.textContent = fmt(total);

    // Delegação de eventos
    body.addEventListener('click', handleCartClick);
  }

  function handleCartClick(e) {
    const id = parseInt(e.target.dataset.id);
    if (isNaN(id)) return;

    if (e.target.dataset.action === 'plus') {
      const item = cart.find(i => i.product.id === id);
      if (item) item.qty++;
    }

    if (e.target.dataset.action === 'minus') {
      const item = cart.find(i => i.product.id === id);
      if (item && item.qty > 1) item.qty--;
      else cart = cart.filter(i => i.product.id !== id);
    }

    if (e.target.classList.contains('ci-remove')) {
      cart = cart.filter(i => i.product.id !== id);
    }

    renderCartCount();
    renderCart();
  }

  // Checkout
  document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (cart.length === 0) return;
    closeCart();
    generateInvoice();
  });

  /* ════════════════════════════════════════════════════════════
     FATURA
  ════════════════════════════════════════════════════════════ */
  function generateInvoice() {
    const now   = new Date();
    const invNum= `GA-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-${Math.floor(Math.random()*9000+1000)}`;
    const dateStr = now.toLocaleDateString('pt-PT', { day:'2-digit', month:'long', year:'numeric' });
    const timeStr = now.toLocaleTimeString('pt-PT', { hour:'2-digit', minute:'2-digit' });

    document.getElementById('invMeta').innerHTML = `
      <div>Fatura nº <strong>${invNum}</strong></div>
      <div>${dateStr}</div>
      <div>${timeStr}</div>`;

    document.getElementById('invClient').innerHTML = `
      <strong>${currentUser.name}</strong>
      ${currentUser.email}`;

    const tbody = document.getElementById('invItems');
    tbody.innerHTML = '';
    let subtotal = 0;

    cart.forEach(item => {
      const line = item.product.price * item.qty;
      subtotal += line;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${item.product.name}</td>
        <td>${item.product.sku}</td>
        <td class="txt-right">${item.qty}</td>
        <td class="txt-right">${fmt(item.product.price)}</td>
        <td class="txt-right">${fmt(line)}</td>`;
      tbody.appendChild(tr);
    });

    const iva     = subtotal * 0.23;
    const total   = subtotal + iva;

    document.getElementById('invTotals').innerHTML = `
      <div class="inv-row"><span>Subtotal</span><span>${fmt(subtotal)}</span></div>
      <div class="inv-row"><span>IVA 23%</span><span>${fmt(iva)}</span></div>
      <div class="inv-row total"><span>Total</span><span>${fmt(total)}</span></div>`;

    document.getElementById('invoiceOverlay').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  document.getElementById('invPrint').addEventListener('click', () => window.print());

  document.getElementById('invDone').addEventListener('click', () => {
    document.getElementById('invoiceOverlay').classList.add('hidden');
    document.body.style.overflow = '';
    cart = [];
    renderCartCount();
    showToast('Compra concluída! Obrigado por escolher a Galeria Anel.');
  });

  document.getElementById('invoiceOverlay').addEventListener('click', (e) => {
    if (e.target === document.getElementById('invoiceOverlay')) {
      document.getElementById('invoiceOverlay').classList.add('hidden');
      document.body.style.overflow = '';
    }
  });

  /* ════════════════════════════════════════════════════════════
     LOGO → topo
  ════════════════════════════════════════════════════════════ */
  document.getElementById('logoBtn').addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ════════════════════════════════════════════════════════════
     TOAST
  ════════════════════════════════════════════════════════════ */
  let toastTimeout;

  function showToast(msg) {
    let toast = document.getElementById('ga-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'ga-toast';
      Object.assign(toast.style, {
        position: 'fixed',
        bottom: '1.5rem',
        left: '50%',
        transform: 'translateX(-50%) translateY(80px)',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        color: 'var(--text-secondary)',
        padding: '0.75rem 1.5rem',
        borderRadius: '2px',
        fontFamily: 'var(--font-body)',
        fontSize: '0.8rem',
        fontWeight: '300',
        letterSpacing: '0.05em',
        zIndex: '9999',
        transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.35s ease',
        opacity: '0',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
      });
      document.body.appendChild(toast);
    }

    toast.textContent = msg;
    clearTimeout(toastTimeout);

    requestAnimationFrame(() => {
      toast.style.transform  = 'translateX(-50%) translateY(0)';
      toast.style.opacity    = '1';
    });

    toastTimeout = setTimeout(() => {
      toast.style.transform = 'translateX(-50%) translateY(80px)';
      toast.style.opacity   = '0';
    }, 2800);
  }

  /* ════════════════════════════════════════════════════════════
     UTILITÁRIOS
  ════════════════════════════════════════════════════════════ */
  function fmt(n) {
    return '€' + n.toFixed(2).replace('.', ',');
  }

  /* ════════════════════════════════════════════════════════════
     INIT — mostrar login por defeito
  ════════════════════════════════════════════════════════════ */
  showScreen('login');

  console.log('%cGaleria Anel — Loja ✦', 'font-family:serif;font-size:1.1rem;color:#a08cd4;');

})();
