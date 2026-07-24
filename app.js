const ADMIN_PASSWORD = "codexxshai";

const products = [
  { id: "play-10000", name: "PLAYSTORE", balance: "BALANCE 10000 INR", price: 1599, status: "available", colors: "linear-gradient(135deg,#1d804d,#0d2b3e)" },
  { id: "apple-10000", name: "APPLE", balance: "BALANCE 10000", price: 1999, status: "available", colors: "linear-gradient(135deg,#111,#5c6670)" },
  { id: "apple-5000", name: "APPLE", balance: "BALANCE 5000", price: 999, status: "sold", colors: "linear-gradient(135deg,#313131,#9d9d9d)" },
  { id: "bestbuy-85", name: "BEST BUY", balance: "BALANCE 85 USD", price: 2000, status: "available", colors: "linear-gradient(135deg,#063c74,#e7b21e)" },
  { id: "etsy-85", name: "ETSY", balance: "BALANCE 85 USD", price: 2000, status: "available", colors: "linear-gradient(135deg,#f06a22,#70270b)" },
  { id: "target-85", name: "TARGET", balance: "BALANCE 85 USD", price: 2000, status: "available", colors: "linear-gradient(135deg,#c1121f,#450a0d)" },
  { id: "walmart-85", name: "WALMART", balance: "BALANCE 85 USD", price: 2000, status: "available", colors: "linear-gradient(135deg,#0b5fa5,#ffc220)" },
  { id: "shopify-85", name: "SHOPIFY", balance: "BALANCE 85 USD", price: 2000, status: "available", colors: "linear-gradient(135deg,#7ab55c,#153a2b)" },
  { id: "steam-85", name: "STEAM", balance: "BALANCE 85 USD", price: 2000, status: "available", colors: "linear-gradient(135deg,#171a21,#4b6e8f)" },
  { id: "amazoncom-90", name: "AMAZON.COM", balance: "BALANCE 90 USD", price: 2499, status: "available", colors: "linear-gradient(135deg,#232f3e,#ff9900)" },
  { id: "xbox-6999", name: "X BOX", balance: "BALANCE 6999 INR", price: 1499, status: "sold", colors: "linear-gradient(135deg,#107c10,#062c06)" },
  { id: "steam-6999", name: "STEAM", balance: "BALANCE 6999 INR", price: 1999, status: "sold", colors: "linear-gradient(135deg,#0a1d2c,#66c0f4)" },
  { id: "blinkit-6999", name: "BLINKIT", balance: "BALANCE 6999 INR", price: 1999, status: "available", colors: "linear-gradient(135deg,#f7d716,#159447)" },
  { id: "swiggy-6999", name: "SWIGGY", balance: "BALANCE 6999 INR", price: 1999, status: "available", colors: "linear-gradient(135deg,#fc8019,#531f00)" },
  { id: "zomato-6999", name: "ZOMATO", balance: "BALANCE 6999 INR", price: 1999, status: "available", colors: "linear-gradient(135deg,#e23744,#5a1118)" },
  { id: "pvr-6999", name: "PVR", balance: "BALANCE 6999 INR", price: 1999, status: "sold", colors: "linear-gradient(135deg,#352060,#d9a43a)" },
  { id: "prime-6999", name: "AMAZON PRIME", balance: "BALANCE 6999 INR", price: 1999, status: "available", colors: "linear-gradient(135deg,#00a8e1,#0f243d)" },
  { id: "zepto-7999", name: "ZEPTO", balance: "BALANCE 7999 INR", price: 1999, status: "available", colors: "linear-gradient(135deg,#501082,#df4fd8)" },
  { id: "bigbasket-7999", name: "BIGBASKET", balance: "BALANCE 7999 INR", price: 1999, status: "available", colors: "linear-gradient(135deg,#84c225,#263f12)" },
  { id: "flipkart-7999", name: "FLIPKART", balance: "BALANCE 7999 INR", price: 1999, status: "available", colors: "linear-gradient(135deg,#2874f0,#f4c20d)" },
  { id: "jio-6999", name: "JIO DIGITAL", balance: "BALANCE 6999 INR", price: 1999, status: "available", colors: "linear-gradient(135deg,#0a4db3,#00a6ff)" },
  { id: "amazon-9999", name: "AMAZON", balance: "BALANCE 9999 INR", price: 1999, status: "available", colors: "linear-gradient(135deg,#131921,#ff9900)" }
];


const state = {
  cart: JSON.parse(localStorage.getItem("premiumCart") || "[]"),
  user: JSON.parse(localStorage.getItem("premiumUser") || "null"),
  token: localStorage.getItem("premiumToken") || ""
};

const productGrid = document.getElementById("productGrid");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const welcomeText = document.getElementById("welcomeText");

let authMode = "login";

function money(amount) {
  return `Rs ${Number(amount).toLocaleString("en-IN")}`;
}

function saveCart() {
  localStorage.setItem("premiumCart", JSON.stringify(state.cart));
  renderCart();
}

function setUser(user, token) {
  state.user = user;
  state.token = token || "";
  localStorage.setItem("premiumUser", JSON.stringify(user));
  localStorage.setItem("premiumToken", state.token);
  renderHeader();
}

function initials(name) {
  return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 3);
}

function renderProducts(filter = "") {
  const needle = filter.trim().toLowerCase();
  const matches = products.filter((product) => {
    return [product.name, product.balance].join(" ").toLowerCase().includes(needle);
  });

  productGrid.innerHTML = matches.map((product) => `
    <article class="product-card">
      <div class="card-art" style="--art:${product.colors}">
        <span class="gift-chip">${initials(product.name)}</span>
      </div>
      <div class="product-body">
        <h3>${product.name}</h3>
        <p class="balance">${product.balance}</p>
        <p class="price">${money(product.price)}</p>
        <button type="button" data-add="${product.id}" ${product.status === "sold" ? "disabled" : ""}>
          ${product.status === "sold" ? "SOLD OUT" : "Add to Cart"}
        </button>
      </div>
    </article>
  `).join("") || `<p class="empty">No products found.</p>`;
}


function renderHeader() {
  document.getElementById("loginBtn").textContent = state.user ? "Logout" : "Login";
  document.getElementById("signupBtn").hidden = Boolean(state.user);
  welcomeText.textContent = state.user
    ? `Welcome, ${state.user.name}. Your paid UTR entries will be saved for admin.`
    : "Login to save your orders and UTR details.";
}

function renderCart() {
  cartCount.textContent = state.cart.reduce((sum, item) => sum + item.qty, 0);
  const total = state.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  cartTotal.textContent = money(total);
  document.getElementById("paymentTotal").textContent = `Pay ${money(total)}`;

  cartItems.innerHTML = state.cart.length ? state.cart.map((item) => `
    <div class="cart-row">
      <div>
        <strong>${item.name}</strong>
        <span>${item.balance}</span>
      </div>
      <strong>${money(item.price * item.qty)}</strong>
      <button class="qty-button" type="button" data-remove="${item.id}" aria-label="Remove ${item.name}">-</button>
    </div>
  `).join("") : `<p class="empty">Your cart is empty.</p>`;
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product || product.status === "sold") return;
  const existing = state.cart.find((item) => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({ ...product, qty: 1 });
  }
  saveCart();
}

function removeFromCart(productId) {
  const existing = state.cart.find((item) => item.id === productId);
  if (!existing) return;
  existing.qty -= 1;
  if (existing.qty <= 0) {
    state.cart = state.cart.filter((item) => item.id !== productId);
  }
  saveCart();
}

async function api(path, payload) {
  if (location.protocol === "file:") {
    throw new Error("static-mode");
  }
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Request failed");
  return data;
}

function fallbackStore() {
  const users = JSON.parse(localStorage.getItem("premiumUsers") || "[]");
  const orders = JSON.parse(localStorage.getItem("premiumOrders") || "[]");
  return { users, orders };
}

function saveFallbackStore(store) {
  localStorage.setItem("premiumUsers", JSON.stringify(store.users));
  localStorage.setItem("premiumOrders", JSON.stringify(store.orders));
}

async function signup(payload) {
  try {
    return await api("/api/signup", payload);
  } catch {
    const store = fallbackStore();
    if (store.users.some((user) => user.email === payload.email)) {
      throw new Error("Email already registered");
    }
    const user = { id: crypto.randomUUID(), name: payload.name, phone: payload.phone, email: payload.email, createdAt: new Date().toISOString() };
    store.users.push({ ...user, password: payload.password });
    saveFallbackStore(store);
    return { user, token: user.id };
  }
}

async function login(payload) {
  try {
    return await api("/api/login", payload);
  } catch {
    const store = fallbackStore();
    const row = store.users.find((user) => user.email === payload.email && user.password === payload.password);
    if (!row) throw new Error("Invalid email or password");
    const { password, ...user } = row;
    return { user, token: user.id };
  }
}

async function submitOrder(utr) {
  const total = state.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const payload = { token: state.token, items: state.cart, total, utr };
  try {
    return await api("/api/order", payload);
  } catch {
    const store = fallbackStore();
    const order = {
      id: crypto.randomUUID(),
      userId: state.user.id,
      name: state.user.name,
      email: state.user.email,
      phone: state.user.phone,
      utr,
      total,
      items: state.cart,
      createdAt: new Date().toISOString()
    };
    store.orders.push(order);
    saveFallbackStore(store);
    return { order };
  }
}

async function loadAdmin(password) {
  try {
    return await api("/api/admin", { password });
  } catch {
    if (password !== ADMIN_PASSWORD) throw new Error("Wrong admin password");
    const store = fallbackStore();
    const users = store.users.map(({ password: _password, ...user }) => user);
    return { users, orders: store.orders };
  }
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (typeof modal.showModal === "function") {
    modal.showModal();
  } else {
    modal.setAttribute("open", "");
  }
}

function closeModal(button) {
  button.closest("dialog").close();
}

function openAuth(mode) {
  authMode = mode;
  const isSignup = mode === "signup";
  document.getElementById("authTitle").textContent = isSignup ? "Sign Up" : "Login";
  document.getElementById("authSubmit").textContent = isSignup ? "Create Account" : "Login";
  document.getElementById("namePhoneFields").hidden = !isSignup;
  document.getElementById("authMessage").textContent = "";
  document.getElementById("authForm").reset();
  openModal("authModal");
}

function renderAdmin(data) {
  const totalSales = data.orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  document.getElementById("adminSummary").innerHTML = `
    <div class="summary-tile"><span>Customers</span><strong>${data.users.length}</strong></div>
    <div class="summary-tile"><span>Orders</span><strong>${data.orders.length}</strong></div>
    <div class="summary-tile"><span>Total UTR Amount</span><strong>${money(totalSales)}</strong></div>
  `;

  document.getElementById("customerTable").innerHTML = data.users.length ? `
    <table>
      <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Signup Time</th></tr></thead>
      <tbody>${data.users.map((user) => `
        <tr><td>${user.name}</td><td>${user.email}</td><td>${user.phone || "-"}</td><td>${new Date(user.createdAt).toLocaleString()}</td></tr>
      `).join("")}</tbody>
    </table>
  ` : `<p class="empty">No customers yet.</p>`;

  document.getElementById("orderTable").innerHTML = data.orders.length ? `
    <table>
      <thead><tr><th>Customer</th><th>UTR</th><th>Items</th><th>Total</th><th>Time</th></tr></thead>
      <tbody>${data.orders.map((order) => `
        <tr>
          <td><strong>${order.name}</strong><br>${order.email}<br>${order.phone || "-"}</td>
          <td>${order.utr}</td>
          <td>${order.items.map((item) => `${item.name} x ${item.qty}`).join("<br>")}</td>
          <td>${money(order.total)}</td>
          <td>${new Date(order.createdAt).toLocaleString()}</td>
        </tr>
      `).join("")}</tbody>
    </table>
  ` : `<p class="empty">No UTR payments submitted yet.</p>`;
}

document.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  const removeButton = event.target.closest("[data-remove]");
  const closeButton = event.target.closest("[data-close]");

  if (addButton) addToCart(addButton.dataset.add);
  if (removeButton) removeFromCart(removeButton.dataset.remove);
  if (closeButton) closeModal(closeButton);
});

document.getElementById("searchInput").addEventListener("input", (event) => {
  renderProducts(event.target.value);
});

document.getElementById("loginBtn").addEventListener("click", () => {
  if (state.user) {
    localStorage.removeItem("premiumUser");
    localStorage.removeItem("premiumToken");
    state.user = null;
    state.token = "";
    renderHeader();
    return;
  }
  openAuth("login");
});

document.getElementById("signupBtn").addEventListener("click", () => openAuth("signup"));
document.getElementById("cartBtn").addEventListener("click", () => openModal("cartModal"));
document.getElementById("adminBtn").addEventListener("click", () => openModal("adminModal"));

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (!state.cart.length) return;
  if (!state.user) {
    document.getElementById("cartModal").close();
    openAuth("login");
    return;
  }
  document.getElementById("cartModal").close();
  openModal("checkoutModal");
});

document.getElementById("authForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const message = document.getElementById("authMessage");
  const payload = {
    name: document.getElementById("authName").value.trim(),
    phone: document.getElementById("authPhone").value.trim(),
    email: document.getElementById("authEmail").value.trim().toLowerCase(),
    password: document.getElementById("authPassword").value
  };

  try {
    const result = authMode === "signup" ? await signup(payload) : await login(payload);
    setUser(result.user, result.token);
    message.textContent = "Success. You are logged in.";
    setTimeout(() => document.getElementById("authModal").close(), 500);
  } catch (error) {
    message.textContent = error.message;
  }
});

document.getElementById("paymentForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const message = document.getElementById("paymentMessage");
  const utr = document.getElementById("utrInput").value.trim();
  if (!utr) return;

  try {
    await submitOrder(utr);
    state.cart = [];
    saveCart();
    message.textContent = "Order saved. Admin can see your UTR now.";
    document.getElementById("utrInput").value = "";
    setTimeout(() => document.getElementById("checkoutModal").close(), 700);
  } catch (error) {
    message.textContent = error.message;
  }
});
document.getElementById("adminForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const password = document.getElementById("adminPassword").value;

  try {
    const data = await loadAdmin(password);

    document.getElementById("adminForm").hidden = true;
    document.getElementById("adminData").hidden = false;

    renderAdmin(data);

  } catch (error) {
    alert(error.message);
  }
});



renderProducts();
renderCart();
renderHeader();
