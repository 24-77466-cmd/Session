/* ============================================================
   Fieldwear — Auth + Landing + Shop
   Database layer: localStorage
   ============================================================ */

(function () {

  /* ---------- DATABASE (localStorage) ---------- */
  const DB_USERS_KEY = 'fieldwear_users_db';
  const SESSION_KEY  = 'fieldwear_session';

  function initDB() {
    if (!localStorage.getItem(DB_USERS_KEY)) {
      const demoUsers = [
        { id: 1, name: 'Patrick', email: 'patrick@g.batstate-u', password: 'password123' },
        { id: 2, name: 'Demo User', email: 'demo@example.com',  password: 'demo123' }
      ];
      localStorage.setItem(DB_USERS_KEY, JSON.stringify(demoUsers));
    }
  }
  initDB();

  const getUsers  = () => JSON.parse(localStorage.getItem(DB_USERS_KEY)) || [];
  const saveUsers = (users) => localStorage.setItem(DB_USERS_KEY, JSON.stringify(users));
  const findUser  = (email) => getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());

  function addUser(name, email, password) {
    const users = getUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'Email already registered.' };
    }
    const newId = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const user  = { id: newId, name, email, password };
    users.push(user);
    saveUsers(users);
    return { success: true, user };
  }

  const setSession = (user) => localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ id: user.id, name: user.name, email: user.email })
  );
  const getSession = () => {
    const s = localStorage.getItem(SESSION_KEY);
    return s ? JSON.parse(s) : null;
  };
  const clearSession = () => localStorage.removeItem(SESSION_KEY);

  /* ---------- PAGE DETECTION ---------- */
  const onLoginPage   = !!document.getElementById('loginForm');
  const onLandingPage = !!document.getElementById('landingUserName');
  const onShopPage    = !!document.getElementById('productGrid');

  /* ============================================================
     PAGE 1: LOGIN / REGISTER
     ============================================================ */
  if (onLoginPage) {
    const loginForm    = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const goToRegister = document.getElementById('goToRegister');
    const goToLogin    = document.getElementById('goToLogin');
    const authMessage  = document.getElementById('authMessage');

    // Already logged in? Skip straight to landing.
    if (getSession()) {
      window.location.href = 'landing.html';
      return;
    }

    goToRegister.addEventListener('click', (e) => {
      e.preventDefault();
      loginForm.classList.add('hidden');
      registerForm.classList.remove('hidden');
      authMessage.innerHTML = '';
    });

    goToLogin.addEventListener('click', (e) => {
      e.preventDefault();
      registerForm.classList.add('hidden');
      loginForm.classList.remove('hidden');
      authMessage.innerHTML = '';
    });

    // Login
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email    = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;

      if (!email || !password) {
        authMessage.innerHTML = '<span class="error">Please fill in all fields.</span>';
        return;
      }
      const user = findUser(email);
      if (!user) {
        authMessage.innerHTML = '<span class="error">No account found with that email.</span>';
        return;
      }
      if (user.password !== password) {
        authMessage.innerHTML = '<span class="error">Incorrect password.</span>';
        return;
      }

      setSession(user);
      authMessage.innerHTML = '<span class="success">Login successful! Redirecting…</span>';
      setTimeout(() => window.location.href = 'landing.html', 400);
    });

    // Register
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name     = document.getElementById('regName').value.trim();
      const email    = document.getElementById('regEmail').value.trim();
      const password = document.getElementById('regPassword').value;

      if (!name || !email || !password) {
        authMessage.innerHTML = '<span class="error">All fields are required.</span>';
        return;
      }
      if (password.length < 4) {
        authMessage.innerHTML = '<span class="error">Password must be at least 4 characters.</span>';
        return;
      }

      const result = addUser(name, email, password);
      if (!result.success) {
        authMessage.innerHTML = `<span class="error">${result.message}</span>`;
        return;
      }

      setSession(result.user);
      authMessage.innerHTML = '<span class="success">Registration successful! Redirecting…</span>';
      setTimeout(() => window.location.href = 'landing.html', 450);
    });
  }

  /* ============================================================
     PAGE 2: LANDING (WELCOME)
     ============================================================ */
  if (onLandingPage) {
    const session = getSession();
    if (!session) {
      window.location.href = 'login.html';
      return;
    }

    const nameEl = document.getElementById('landingUserName');
    if (nameEl) nameEl.textContent = session.name;

    const logoutBtn = document.getElementById('landingLogout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        clearSession();
        window.location.href = 'login.html';
      });
    }
  }

  /* ============================================================
     PAGE 3: SHOP
     ============================================================ */
  if (onShopPage) {

    // ----- Session guard + header greeting -----
    const session = getSession();
    if (!session) {
      window.location.href = 'login.html';
      return;
    }

    const headerUserName = document.getElementById('headerUserName');
    if (headerUserName) headerUserName.textContent = session.name;

    const shopLogoutBtn = document.getElementById('logoutBtn');
    if (shopLogoutBtn) {
      shopLogoutBtn.addEventListener('click', () => {
        clearSession();
        window.location.href = 'login.html';
      });
    }

    // ----- Products -----
    const products = [
      { id: 1, name: "Heavyweight Tee",   category: "tops",      price: 38,  image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80" },
      { id: 2, name: "Brushed Flannel",   category: "tops",      price: 68,  image: "https://images.unsplash.com/photo-1588117260148-b47818741c74?w=600&q=80" },
      { id: 3, name: "Canvas Work Pant",  category: "bottoms",   price: 82,  image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80" },
      { id: 4, name: "Relaxed Denim",     category: "bottoms",   price: 74,  image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80" },
      { id: 5, name: "Wax Field Jacket",  category: "outerwear", price: 148, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80" },
      { id: 6, name: "Fleece-Lined Coat", category: "outerwear", price: 168, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80" },
      { id: 7, name: "Cotton Henley",     category: "tops",      price: 44,  image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80" },
      { id: 8, name: "Utility Shorts",    category: "bottoms",   price: 54,  image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&q=80" }
    ];

    let cart = [];
    let activeFilter = "all";

    const grid         = document.getElementById("productGrid");
    const filters      = document.getElementById("filters");
    const cartCountEl  = document.getElementById("cartCount");
    const cartBtn      = document.getElementById("cartBtn");
    const cartPanel    = document.getElementById("cartPanel");
    const cartOverlay  = document.getElementById("cartOverlay");
    const cartClose    = document.getElementById("cartClose");
    const cartItemsEl  = document.getElementById("cartItems");
    const cartTotalEl  = document.getElementById("cartTotal");

    function renderProducts() {
      const items = activeFilter === "all"
        ? products
        : products.filter(p => p.category === activeFilter);

      grid.innerHTML = items.map((p, index) => {
        const delay = index * 0.03;
        return `
          <div class="card" style="animation-delay: ${delay}s;">
            <div class="card-image">
              <img src="${p.image}" alt="${p.name}" loading="lazy">
            </div>
            <div class="card-body">
              <h3>${p.name}</h3>
              <span class="price">$${p.price}</span>
              <button class="add-btn" data-id="${p.id}">Add to bag</button>
            </div>
          </div>
        `;
      }).join("");
    }

    function totalCount() {
      return cart.reduce((sum, item) => sum + item.qty, 0);
    }

    function totalPrice() {
      return cart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.id);
        return sum + product.price * item.qty;
      }, 0);
    }

    function renderCart() {
      cartCountEl.textContent = totalCount();
      cartTotalEl.textContent = `$${totalPrice()}`;

      if (cart.length === 0) {
        cartItemsEl.innerHTML = `<p class="cart-empty">Your bag is empty.</p>`;
        return;
      }

      cartItemsEl.innerHTML = cart.map(item => {
        const p = products.find(prod => prod.id === item.id);
        return `
          <div class="cart-item" data-id="${p.id}">
            <div class="cart-item-image">
              <img src="${p.image}" alt="${p.name}" loading="lazy">
            </div>
            <div class="cart-item-info">
              <h4>${p.name}</h4>
              <span class="price">$${p.price}</span>
              <button class="cart-item-remove" data-id="${p.id}">Remove</button>
            </div>
            <div class="cart-item-qty">
              <button class="qty-btn" data-id="${p.id}" data-action="dec">−</button>
              <span>${item.qty}</span>
              <button class="qty-btn" data-id="${p.id}" data-action="inc">+</button>
            </div>
          </div>
        `;
      }).join("");
    }

    function addToCart(id) {
      const existing = cart.find(item => item.id === id);
      if (existing) {
        existing.qty++;
      } else {
        cart.push({ id, qty: 1 });
      }
      renderCart();
      cartBtn.style.transform = "scale(1.05)";
      setTimeout(() => cartBtn.style.transform = "", 150);
    }

    function changeQty(id, action) {
      const item = cart.find(i => i.id === id);
      if (!item) return;
      if (action === "inc") item.qty++;
      if (action === "dec") item.qty--;
      if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
      renderCart();
    }

    function removeFromCart(id) {
      cart = cart.filter(i => i.id !== id);
      renderCart();
    }

    function openCart() {
      cartPanel.classList.add("open");
      cartOverlay.classList.add("open");
    }

    function closeCart() {
      cartPanel.classList.remove("open");
      cartOverlay.classList.remove("open");
    }

    filters.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;
      filters.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeFilter = btn.dataset.filter;
      renderProducts();
    });

    grid.addEventListener("click", (e) => {
      const btn = e.target.closest(".add-btn");
      if (!btn) return;
      const id = Number(btn.dataset.id);
      addToCart(id);
      btn.textContent = "Added";
      btn.classList.add("added");
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = "Add to bag";
        btn.classList.remove("added");
        btn.disabled = false;
      }, 1100);
    });

    cartBtn.addEventListener("click", openCart);
    cartClose.addEventListener("click", closeCart);
    cartOverlay.addEventListener("click", closeCart);

    cartItemsEl.addEventListener("click", (e) => {
      const qtyBtn = e.target.closest(".qty-btn");
      const removeBtn = e.target.closest(".cart-item-remove");

      if (qtyBtn) {
        changeQty(Number(qtyBtn.dataset.id), qtyBtn.dataset.action);
      }
      if (removeBtn) {
        removeFromCart(Number(removeBtn.dataset.id));
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && cartPanel.classList.contains("open")) {
        closeCart();
      }
    });

    renderProducts();
    renderCart();
  }

})();