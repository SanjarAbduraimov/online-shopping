const productList = document.getElementById("productList");
const saveBtn = document.getElementById("save-wallet-money-btn");
const moneyInWalletInput = document.getElementById("money-in-wallet-input");
const moneyInWalletText = document.getElementById("money-in-wallet-input-text");
const moneyToPayText = document.getElementById("money-to-pay");
const buyBtn = document.getElementById("buy-product-btn");

let moneyInWallet = 0;
let moneyToPay = 0;

class Product {
    async getProducts() {
        try {
            let get = await fetch("product.json");
            let productsData = await get.json();
            let products = productsData.products
            products = products.map(i => {
                const { title, price, img } = i;
                return { title, price, img };
            })
            return products;
        } catch (error) {
            console.log(error);
        }
    }

    productDom() {
        let product = [...document.getElementsByClassName("product")];
        product.forEach(i => {
            i.onclick = () => {
                i.classList.toggle("selected");
                let productPrice = parseInt(i.getAttribute("data-price"));
                let containsOrNot = i.classList.contains("selected")
                if (containsOrNot) {
                    moneyToPay += productPrice;
                    moneyToPayText.innerHTML = moneyToPay;
                    return;
                }
                moneyToPay -= productPrice;
                moneyToPayText.innerHTML = moneyToPay;
            }
        })
    }
}

class UI {
    displayProducts(products) {
        let result = "";
        products.forEach(i => {
            result += `
            <!-- single product -->
                <div  class="col-6 col-sm-4 col-md-3 col-xl-2">
                    <div class="card product mb-3 mx-1" data-price="${i.price}">
                        <img class="card-img-top product__img" src="${i.img}" alt="Tovar">
                        <div class="card-body p-2 text-center">
                            <h2 class="h5 product__name">${i.title}</h2>
                            <div class="product__price__wrapper"><span class="product__price">${i.price}</span> UZS</div>
                        </div>
                    </div>
                </div>
            <!-- end of single product -->
                `
        });
        productList.innerHTML = result;
    }
}


let ui = new UI();
let product = new Product();

product.getProducts()
    .then(products => { (ui.displayProducts(products)); })
    .then(() => product.productDom());



saveBtn.addEventListener('click', i => {
    let moneyInWalletInputValue = moneyInWalletInput.value;
    i.preventDefault();
    if (moneyInWalletInputValue == "" || moneyInWalletInputValue <= 1) {
        alert("No");
        return;
    }
    moneyInWalletInputValue = parseInt(moneyInWalletInputValue);
    moneyInWalletText.innerHTML = moneyInWalletInputValue;
    moneyInWallet = moneyInWalletInputValue;
    moneyInWalletInput.value = "";
})

buyBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (moneyToPay == 0) {
        console.log(moneyToPay);
        alert("Select product");
        return;
    }
    if (moneyToPay > moneyInWallet) {
        alert("No money no honey");
        return;
    }

    moneyInWallet -= moneyToPay;
    moneyInWalletText.innerHTML = moneyInWallet;
    moneyToPay = 0;
    moneyToPayText.innerHTML = moneyToPay;
    let products = [...document.getElementsByClassName("product")];
    products.forEach(i => {
        i.classList.remove("selected");
    })
    alert("Done");
})