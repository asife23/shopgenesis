// ===============================
// 🔐 AUTH STATE CHECK
// ===============================
firebase.auth().onAuthStateChanged(function(user) {

  const isAdminPage = window.location.pathname.includes("admin.html");

  // 👉 যদি admin page হয়
  if (isAdminPage) {

    if (!user) {
      window.location.href = "login.html";
      return;
    }

    // 👉 শুধু এই email admin
    if (user.email !== "sr0632890@gmail.com") {
      alert("Access Denied");
      window.location.href = "index.html";
      return;
    }

    loadAdminOrders();
  }

  // 👉 Login button show/hide
  const authSection = document.getElementById("auth-section");
  if (authSection) {
    if (user) {
      authSection.innerHTML = `
        <span>Welcome, ${user.email}</span>
        <button onclick="logout()">Logout</button>
      `;
    } else {
      authSection.innerHTML = `
        <a href="login.html">Login</a>
      `;
    }
  }

});


// ===============================
// 🔐 LOGIN
// ===============================
function loginUser() {

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
      alert("Login Successful!");
      window.location.href = "index.html";
    })
    .catch(error => {
      alert(error.message);
    });
}


// ===============================
// 📝 REGISTER
// ===============================
function registerUser() {

  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(() => {
      alert("Registration Successful!");
      window.location.href = "index.html";
    })
    .catch(error => {
      alert(error.message);
    });
}


// ===============================
// 🚪 LOGOUT
// ===============================
function logout() {
  firebase.auth().signOut().then(() => {
    window.location.href = "index.html";
  });
}


// ===============================
// 🛍 ADD PRODUCT (ADMIN)
// ===============================
function addProduct() {

  const name = document.getElementById("product-title")?.value;
  const price = document.getElementById("product-price")?.value;
  const image = document.getElementById("product-image")?.value;

  if (!name || !price || !image) {
    alert("সব ঘর পূরণ করুন");
    return;
  }

  db.collection("products").add({
    name: name,
    price: Number(price),
    image: image,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    alert("Product Added Successfully!");
    document.getElementById("add-product-form").reset();
  })
  .catch(error => {
    console.error(error);
  });
}


// ===============================
// 🛍 LOAD PRODUCTS
// ===============================
function loadProducts() {

  const container = document.getElementById("product-list");
  if (!container) return;

  db.collection("products").orderBy("createdAt", "desc")
    .onSnapshot(snapshot => {

      container.innerHTML = "";

      snapshot.forEach(doc => {
        const data = doc.data();

        container.innerHTML += `
          <div class="product">
            <img src="${data.image}" width="100%">
            <h3>${data.name}</h3>
            <p>৳ ${data.price}</p>
            <button onclick="addToCart('${doc.id}', '${data.name}', ${data.price})">
              Add to Cart
            </button>
          </div>
        `;
      });

    });
}


// ===============================
// 🛒 CART SYSTEM
// ===============================
let cart = [];

function addToCart(id, name, price) {
  cart.push({ id, name, price });
  alert("Added to cart");
  updateCartUI();
}

function updateCartUI() {

  const cartItems = document.getElementById("cart-items");
  const totalElement = document.getElementById("cart-total");

  if (!cartItems) return;

  cartItems.innerHTML = "";

  cart.forEach(item => {
    cartItems.innerHTML += `<li>${item.name} - ৳ ${item.price}</li>`;
  });

  totalElement.innerText = "Total: ৳ " + getTotal();
}

function getTotal() {
  return cart.reduce((sum, item) => sum + item.price, 0);
}


// ===============================
// 📦 PLACE ORDER (COD)
// ===============================
const checkoutForm = document.getElementById("checkout-form");

if (checkoutForm) {
  checkoutForm.addEventListener("submit", function(e) {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;

    db.collection("orders").add({
      customerName: name,
      phone: phone,
      address: address,
      items: cart,
      total: getTotal(),
      paymentMethod: "Cash on Delivery",
      status: "Pending",
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
      alert("Order Placed Successfully!");
      cart = [];
      updateCartUI();
      checkoutForm.reset();
    })
    .catch(error => {
      console.error(error);
    });

  });
}


// ===============================
// 📊 ADMIN ORDER DASHBOARD
// ===============================
function loadAdminOrders() {

  const container = document.getElementById("admin-product-list");
  if (!container) return;

  db.collection("orders").orderBy("createdAt", "desc")
    .onSnapshot(snapshot => {

      container.innerHTML = "<h2>Customer Orders</h2>";

      snapshot.forEach(doc => {
        const data = doc.data();

        container.innerHTML += `
          <div class="product">
            <h3>${data.customerName}</h3>
            <p>Phone: ${data.phone}</p>
            <p>Address: ${data.address}</p>
            <p>Total: ৳ ${data.total}</p>
            <p>Status: ${data.status}</p>
            <button onclick="updateStatus('${doc.id}')">Mark as Delivered</button>
            <hr>
          </div>
        `;
      });

    });
}


// ===============================
// ✅ UPDATE ORDER STATUS
// ===============================
function updateStatus(orderId) {
  db.collection("orders").doc(orderId).update({
    status: "Delivered"
  })
  .then(() => {
    alert("Order marked as Delivered");
  });
}


// ===============================
// 🧾 ADMIN FORM SUBMIT
// ===============================
const form = document.getElementById("add-product-form");

if (form) {
  form.addEventListener("submit", function(e) {
    e.preventDefault();
    addProduct();
  });
}


// 🚀 LOAD PRODUCTS
loadProducts();
