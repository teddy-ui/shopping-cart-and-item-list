let iconCart = document.querySelector('.icon-cart');
let closeCart = document.querySelector('.close');
let body = document.querySelector('body');
let listCartHTML = document.querySelector('.listCart');
let iconCartSpan = document.querySelector('.icon-cart span');
let listProductHTML = document.querySelector('.listProduct');

let listProducts = [];
let carts = [];

iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

const addDataToHTML = () => {
    listProductHTML.innerHTML = '';
    if (listProducts.length > 0) {
        listProducts.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.dataset.id = product.id;
            newProduct.innerHTML = `
                <img src="${product.image}" alt="#">
                <h2>${product.name}</h2>
                <div class="price">Ksh${product.price}</div>
                <button class="addToCart">Add To Cart</button>
            `;
            listProductHTML.appendChild(newProduct);
        });
    }
};

listProductHTML.addEventListener('click', (event) => {
    let target = event.target;
    if (target.classList.contains('addToCart')) {
        let product_id = target.parentElement.dataset.id;
        addToCart(product_id);
    }
});

const addToCart = (product_id) => {
    let positionThisProductInCart = carts.findIndex((cartItem) => cartItem.product_id == product_id);
    if (positionThisProductInCart < 0) {
        carts.push({
            product_id: product_id,
            quantity: 1
        });
    } else {
        carts[positionThisProductInCart].quantity += 1;
    }
    updateCartHTML();
    saveCartToMemory();
};

const saveCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(carts));
};

const updateCartHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    if (carts.length > 0) {
        carts.forEach(cart => {
            totalQuantity += cart.quantity;
            let product = listProducts.find(item => item.id == cart.product_id);
            let newCart = document.createElement('div');
            newCart.classList.add('item');
            newCart.dataset.id = cart.product_id;
            newCart.innerHTML = `
                <div class="image">
                    <img src="${product.image}" alt="">
                </div>
                <div class="name">
                    ${product.name}
                </div>
                <div class="totalprice">
                    Ksh${product.price * cart.quantity}
                </div>
                <div class="quantity">
                    <span class="minus">-</span>
                    <span>${cart.quantity}</span>
                    <span class="plus">+</span>
                </div>
            `;
            listCartHTML.appendChild(newCart);
        });
    }
    iconCartSpan.innerText = totalQuantity;
};

listCartHTML.addEventListener('click', (event) => {
    let target = event.target;
    let cartItem = target.closest('.item');
    let product_id = cartItem ? cartItem.dataset.id : null;
    if (product_id) {
        if (target.classList.contains('minus')) {
            updateCartQuantity(product_id, 'minus');
        } else if (target.classList.contains('plus')) {
            updateCartQuantity(product_id, 'plus');
        }
    }
});

const updateCartQuantity = (product_id, operation) => {
    let positionThisProductInCart = carts.findIndex((cartItem) => cartItem.product_id == product_id);
    if (positionThisProductInCart >= 0) {
        if (operation === 'minus') {
            carts[positionThisProductInCart].quantity -= 1;
            if (carts[positionThisProductInCart].quantity <= 0) {
                carts.splice(positionThisProductInCart, 1);
            }
        } else if (operation === 'plus') {
            carts[positionThisProductInCart].quantity += 1;
        }
    }
    updateCartHTML();
    saveCartToMemory();
};

const initApp = () => {
    fetch('products.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            listProducts = data;
            addDataToHTML();
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });

    if (localStorage.getItem('cart')) {
        carts = JSON.parse(localStorage.getItem('cart'));
        updateCartHTML();
    }
};

initApp();
