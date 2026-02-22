let cart = [];

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
          <button onclick="addToCart('${doc.id}','${data.name}',${data.price})" class="btn">
            Add to Cart
          </button>
        </div>
      `;
    });

  });
}

function addToCart(id,name,price){
  cart.push({id,name,price});
  updateCart();
}

function updateCart(){
  const list = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");

  list.innerHTML="";
  let total=0;

  cart.forEach(item=>{
    total+=item.price;
    list.innerHTML+=`<li>${item.name} - ৳${item.price}</li>`;
  });

  totalEl.textContent=total;
}

const form=document.getElementById("checkout-form");

if(form){
form.addEventListener("submit",function(e){
e.preventDefault();

const name=document.getElementById("name").value;
const phone=document.getElementById("phone").value;
const address=document.getElementById("address").value;
const payment=document.getElementById("payment-method").value;

db.collection("orders").add({
customerName:name,
phone:phone,
address:address,
items:cart,
total:cart.reduce((s,i)=>s+i.price,0),
paymentMethod:payment,
status:"Pending",
createdAt:firebase.firestore.FieldValue.serverTimestamp()
}).then(()=>{
alert("Order Placed Successfully!");
cart=[];
updateCart();
form.reset();
});

});
}

loadProducts();
