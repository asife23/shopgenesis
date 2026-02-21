// Add Product to Firestore
function addProduct() {

  const name = document.getElementById("product-title").value;
  const price = document.getElementById("product-price").value;
  const image = document.getElementById("product-image").value;

  if (!name || !price || !image) {
    alert("সব ঘর পূরণ করুন");
    return;
  }

  db.collection("products").add({
    name: name,
    price: price,
    image: image,
    createdAt: new Date()
  })
  .then(() => {
    alert("Product Added Successfully!");
    document.getElementById("add-product-form").reset();
  })
  .catch(error => {
    console.error("Error adding product:", error);
  });
}


// Load Products (Shop Page)
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


// Handle Admin Form Submit
const form = document.getElementById("add-product-form");

if (form) {
  form.addEventListener("submit", function(e) {
    e.preventDefault();
    addProduct();
  });
}


// Load products when page loads
loadProducts();
