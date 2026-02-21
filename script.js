// Add Product to Firestore
function addProduct() {
  const name = document.getElementById("productName").value;
  const price = document.getElementById("productPrice").value;
  const image = document.getElementById("productImage").value;

  if (!name || !price || !image) {
    alert("সব ঘর পূরণ করুন");
    return;
  }

  db.collection("products").add({
    name: name,
    price: price,
    image: image,
    createdAt: new Date()
  }).then(() => {
    alert("Product Added!");
    location.reload();
  }).catch(error => {
    console.error("Error adding product:", error);
  });
}

// Load Products
function loadProducts() {
  const container = document.getElementById("product-list");
  if (!container) return;

  db.collection("products").onSnapshot(snapshot => {
    container.innerHTML = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      container.innerHTML += `
        <div class="product">
          <img src="${data.image}" width="100%">
          <h3>${data.name}</h3>
          <p>৳ ${data.price}</p>
        </div>
      `;
    });
  });
}

loadProducts();
