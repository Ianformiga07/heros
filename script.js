// Variáveis globais
const menu = document.getElementById("menu");
const cartModal = document.getElementById("cart-modal");
const cartBtn = document.getElementById("cart-btn");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addresswarn = document.getElementById("address-warn");

let cart = [];

//Elementos de manipulação da modal
cartBtn.addEventListener("click", () => {
  updateCartModal();
  cartModal.style.display = "flex";
});
closeModalBtn.addEventListener("click", () => {
  cartModal.style.display = "none";
});
cartModal.addEventListener("click", (e) => {
  if (e.target === cartModal) {
    cartModal.style.display = "none";
  }
});

// Função para adicionar item ao carrinho
menu.addEventListener("click", (e) => {
  let parentButton = e.target.closest(".add-td-cart-btn");
  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));

    addToCart(name, price);
  }
});

//Função para adicionar item ao carrinho
function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  updateCartModal();
}

// Função para atualizar o carrinho
function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;
  cart.forEach((item) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add(
      "flex",
      "justify-between",
      "mb-4",
      "flex-col",
    );

    cartItemElement.innerHTML = `
      <div class="flex justify-between items-center border-b py-2">
        <div>
          <p class="font-bold">${item.name}</p>
          <p>Qtd: ${item.quantity}</p>
          <p>R$ ${item.price.toFixed(2)}</p>
        </div>
        <button class="text-red-500 remove-item-btn" data-name="${item.name}">remover</button>
      </div>`;

    total += item.price * item.quantity;

    cartItemsContainer.appendChild(cartItemElement);
  });
  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  cartCounter.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
}

// Função para remover item do carrinho
cartItemsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-item-btn")) {
    const name = e.target.getAttribute("data-name");

    removeItemCart(name);
  }
});

function removeItemCart(name) {
  const itemIndex = cart.findIndex((item) => item.name === name);
  if (itemIndex > -1) {
    cart[itemIndex].quantity -= 1;
    if (cart[itemIndex].quantity === 0) {
      cart.splice(itemIndex, 1);
    }
    updateCartModal();
  }
}

// Função Endereço
addressInput.addEventListener("input", (e) => {
  let inputValue = e.target.value;

  if (inputValue.trim() !== "") {
    addresswarn.setAttribute("hidden", "true");
    addressInput.classList.remove("border-red-600");
  } else {
    addresswarn.removeAttribute("hidden");
    addressInput.classList.add("border-red-600");
  }
});
//finalizar compra
checkoutBtn.addEventListener("click", () => {
  //   if (!checkRestaurantOpen()) {
  //     alert(
  //       "O restaurante está fechado no momento. Por favor, volte mais tarde.",
  //     );
  //     return;
  //   }

  if (cart.length === 0) return;
  if (addressInput.value.trim() === "") {
    addresswarn.removeAttribute("hidden");
    addressInput.classList.add("border-red-600");
    return;
  }

  //enviar pedido para api whatsapp
  const cartItems = cart
    .map((item) => {
      return `${item.name} Quantidade: (${item.quantity}) R$ ${item.price.toFixed(2)} |`;
    })
    .join("");

  const message = encodeURIComponent(cartItems);
  const phone = "63992863557";

  window.open(
    `https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`,
    "_blank",
  );
  cart.length = 0;
  updateCartModal();
});

//Validar horário de funcionamento
function checkRestaurantOpen() {
  const data = new Date();
  const hora = data.getHours();
  return hora >= 18 && hora < 23; //true se estiver aberto, false se estiver fechado
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if (isOpen) {
  spanItem.classList.remove("bg-red-600");
  spanItem.classList.add("bg-green-600");
} else {
  spanItem.classList.remove("bg-green-600");
  spanItem.classList.add("bg-red-600");
}
