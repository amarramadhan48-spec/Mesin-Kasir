const LOGIN_USERNAME = "admin";
const LOGIN_PASSWORD = "12345";

const LOGIN_SESSION_KEY =
    "kasirku_login_session_v3";

const PRODUCTS_KEY =
    "kasirku_products_final_v1";

const TRANSACTIONS_KEY =
    "kasirku_transactions_final_v1";


/* =========================================
   DEFAULT PRODUCTS
========================================= */

const defaultProducts = [

    {
        id: "PRD001",
        code: "PRD001",
        name: "Ayam Negeri",
        category: "Lauk",
        price: 25000,
        stock: 20
    },

    {
        id: "PRD002",
        code: "PRD002",
        name: "Ayam Pejantan",
        category: "Lauk",
        price: 28000,
        stock: 20
    },

    {
        id: "PRD003",
        code: "PRD003",
        name: "Ayam Kampung",
        category: "Lauk",
        price: 35000,
        stock: 15
    },

    {
        id: "PRD004",
        code: "PRD004",
        name: "Bebek",
        category: "Lauk",
        price: 30000,
        stock: 15
    },

    {
        id: "PRD005",
        code: "PRD005",
        name: "Tempe",
        category: "Pelengkap",
        price: 5000,
        stock: 30
    },

    {
        id: "PRD006",
        code: "PRD006",
        name: "Tahu",
        category: "Pelengkap",
        price: 4000,
        stock: 30
    },

    {
        id: "PRD007",
        code: "PRD007",
        name: "Ikan",
        category: "Lauk",
        price: 25000,
        stock: 20
    },

    {
        id: "PRD008",
        code: "PRD008",
        name: "Nasi",
        category: "Makanan",
        price: 5000,
        stock: 50
    },

    {
        id: "PRD009",
        code: "PRD009",
        name: "Es Jeruk",
        category: "Minuman",
        price: 7000,
        stock: 25
    },

    {
        id: "PRD010",
        code: "PRD010",
        name: "Es Teh",
        category: "Minuman",
        price: 5000,
        stock: 25
    },

    {
        id: "PRD011",
        code: "PRD011",
        name: "Kerupuk",
        category: "Pelengkap",
        price: 3000,
        stock: 40
    },

    {
        id: "PRD012",
        code: "PRD012",
        name: "Kol Goreng",
        category: "Pelengkap",
        price: 5000,
        stock: 30
    }

];


let products =
    loadStorage(
        PRODUCTS_KEY,
        defaultProducts
    );


let transactions =
    loadStorage(
        TRANSACTIONS_KEY,
        []
    );


let cart = [];

let editingProductId =
    null;

let currentReceipt =
    "";


/* =========================================
   HELPER
========================================= */

function get(id) {
    return document.getElementById(id);
}


function formatRupiah(number) {

    return new Intl.NumberFormat(
        "id-ID",
        {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }
    ).format(
        Number(number) || 0
    );

}


function getToday() {

    const date =
        new Date();

    return (
        date.getFullYear() +
        "-" +
        String(
            date.getMonth() + 1
        ).padStart(2, "0") +
        "-" +
        String(
            date.getDate()
        ).padStart(2, "0")
    );

}


function escapeHtml(value) {

    return String(value)
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}


function loadStorage(
    key,
    fallback
) {

    try {

        const saved =
            localStorage.getItem(
                key
            );


        if (saved) {

            const parsed =
                JSON.parse(saved);


            if (
                Array.isArray(
                    parsed
                )
            ) {

                return parsed;

            }

        }

    } catch (error) {

        console.error(
            "Storage error:",
            error
        );

    }


    return JSON.parse(
        JSON.stringify(
            fallback
        )
    );

}


function saveProducts() {

    localStorage.setItem(
        PRODUCTS_KEY,
        JSON.stringify(
            products
        )
    );

}


function saveTransactions() {

    localStorage.setItem(
        TRANSACTIONS_KEY,
        JSON.stringify(
            transactions
        )
    );

}


/* =========================================
   LOGIN
========================================= */

function showLogin() {

    get(
        "loginPage"
    )?.classList.remove(
        "app-hidden"
    );


    get(
        "appPage"
    )?.classList.add(
        "app-hidden"
    );

}


function showApp() {

    get(
        "loginPage"
    )?.classList.add(
        "app-hidden"
    );


    get(
        "appPage"
    )?.classList.remove(
        "app-hidden"
    );

}


function checkLogin() {

    const login =
        sessionStorage.getItem(
            LOGIN_SESSION_KEY
        );


    if (
        login === "true"
    ) {

        showApp();

    } else {

        showLogin();

    }

}


function handleLogin(event) {

    event.preventDefault();


    const username =
        get(
            "username"
        )?.value.trim();


    const password =
        get(
            "password"
        )?.value;


    const error =
        get(
            "loginError"
        );


    if (
        username ===
            LOGIN_USERNAME &&
        password ===
            LOGIN_PASSWORD
    ) {

        sessionStorage.setItem(
            LOGIN_SESSION_KEY,
            "true"
        );


        if (error) {

            error.textContent =
                "";

        }


        get(
            "loginForm"
        )?.reset();


        showApp();

        renderAll();


        return;

    }


    if (error) {

        error.textContent =
            "Username atau password salah.";

    }

}


function logout() {

    if (
        !confirm(
            "Yakin ingin logout?"
        )
    ) {

        return;

    }


    sessionStorage.removeItem(
        LOGIN_SESSION_KEY
    );


    cart = [];


    showLogin();

}


function togglePassword() {

    const password =
        get("password");

    const button =
        get("togglePassword");


    if (
        !password ||
        !button
    ) {

        return;

    }


    if (
        password.type ===
        "password"
    ) {

        password.type =
            "text";

        button.textContent =
            "🙈";

    } else {

        password.type =
            "password";

        button.textContent =
            "👁";

    }

}


/* =========================================
   CLOCK
========================================= */

function updateClock() {

    const clock =
        get("clock");


    if (!clock) {
        return;
    }


    clock.textContent =
        new Date().toLocaleString(
            "id-ID",
            {
                dateStyle:
                    "full",

                timeStyle:
                    "medium"
            }
        );

}


/* =========================================
   DASHBOARD
========================================= */

function renderDashboard() {

    const today =
        getToday();


    const todayTransactions =
        transactions.filter(
            transaction =>
                String(
                    transaction.date
                ).startsWith(
                    today
                )
        );


    const revenue =
        todayTransactions.reduce(
            (
                total,
                transaction
            ) =>
                total +
                Number(
                    transaction.total ||
                    0
                ),

            0
        );


    const lowStock =
        products.filter(
            product =>
                Number(
                    product.stock ||
                    0
                ) <= 5
        ).length;


    if (
        get(
            "statProducts"
        )
    ) {

        get(
            "statProducts"
        ).textContent =
            products.length;

    }


    if (
        get(
            "statTransactions"
        )
    ) {

        get(
            "statTransactions"
        ).textContent =
            todayTransactions.length;

    }


    if (
        get(
            "statRevenue"
        )
    ) {

        get(
            "statRevenue"
        ).textContent =
            formatRupiah(
                revenue
            );

    }


    if (
        get(
            "statLowStock"
        )
    ) {

        get(
            "statLowStock"
        ).textContent =
            lowStock;

    }

}


/* =========================================
   PRODUCTS
========================================= */

function renderProducts() {

    const grid =
        get(
            "productGrid"
        );


    if (!grid) {
        return;
    }


    const search =
        (
            get(
                "searchProduct"
            )?.value ||
            ""
        )
            .trim()
            .toLowerCase();


    const filtered =
        products.filter(
            product =>
                String(
                    product.name
                )
                    .toLowerCase()
                    .includes(
                        search
                    )

                ||

                String(
                    product.code
                )
                    .toLowerCase()
                    .includes(
                        search
                    )

                ||

                String(
                    product.category
                )
                    .toLowerCase()
                    .includes(
                        search
                    )
        );


    if (
        filtered.length ===
        0
    ) {

        grid.innerHTML =
            `
                <div class="empty">
                    Produk tidak ditemukan.
                </div>
            `;

        return;

    }


    grid.innerHTML =
        filtered.map(
            product => {

                const stock =
                    Number(
                        product.stock
                    ) || 0;


                return `

                    <div
                        class="product-card"
                    >

                        <h3>
                            ${escapeHtml(
                                product.name
                            )}
                        </h3>


                        <div
                            class="category"
                        >
                            ${escapeHtml(
                                product.code
                            )}
                            ·
                            ${escapeHtml(
                                product.category
                            )}
                        </div>


                        <div
                            class="price"
                        >
                            ${formatRupiah(
                                product.price
                            )}
                        </div>


                        <div
                            class="
                                stock
                                ${
                                    stock <= 5
                                        ? "low"
                                        : ""
                                }
                            "
                        >
                            Stok:
                            ${stock}
                        </div>


                        <button
                            type="button"
                            class="
                                btn
                                btn-primary
                                btn-small
                            "
                            data-action="add-product"
                            data-id="${escapeHtml(
                                product.id
                            )}"
                            ${
                                stock <= 0
                                    ? "disabled"
                                    : ""
                            }
                        >
                            ${
                                stock <= 0
                                    ? "Stok Habis"
                                    : "Tambah"
                            }
                        </button>

                    </div>

                `;

            }
        ).join("");

}


/* =========================================
   CART
========================================= */

function addToCart(
    productId
) {

    const product =
        products.find(
            product =>
                product.id ===
                productId
        );


    if (!product) {
        return;
    }


    const stock =
        Number(
            product.stock
        ) || 0;


    if (
        stock <= 0
    ) {

        alert(
            "Stok produk habis."
        );

        return;

    }


    const item =
        cart.find(
            item =>
                item.productId ===
                productId
        );


    if (item) {

        if (
            item.qty >=
            stock
        ) {

            alert(
                "Jumlah sudah mencapai stok."
            );

            return;

        }


        item.qty++;

    } else {

        cart.push({

            productId:
                productId,

            qty:
                1

        });

    }


    renderCart();

}


function setQty(
    productId,
    rawValue
) {

    const item =
        cart.find(
            item =>
                item.productId ===
                productId
        );


    const product =
        products.find(
            product =>
                product.id ===
                productId
        );


    if (
        !item ||
        !product
    ) {

        return;

    }


    let quantity =
        parseInt(
            rawValue,
            10
        );


    const stock =
        Number(
            product.stock
        ) || 0;


    if (
        !Number.isFinite(
            quantity
        )
    ) {

        return;

    }


    if (
        quantity < 1
    ) {

        quantity = 1;

    }


    if (
        quantity > stock
    ) {

        quantity = stock;

        alert(
            `Jumlah maksimal ${product.name} adalah ${stock}.`
        );

    }


    item.qty =
        quantity;


    calculateTotal();

}


function changeQty(
    productId,
    amount
) {

    const item =
        cart.find(
            item =>
                item.productId ===
                productId
        );


    if (!item) {
        return;
    }


    let value =
        Number(
            item.qty
        ) +
        Number(
            amount
        );


    if (
        value < 1
    ) {

        removeFromCart(
            productId
        );

        return;

    }


    setQty(
        productId,
        value
    );


    renderCart();

}


function removeFromCart(
    productId
) {

    cart =
        cart.filter(
            item =>
                item.productId !==
                productId
        );


    renderCart();

}


function clearCart() {

    if (
        !cart.length
    ) {

        return;

    }


    if (
        !confirm(
            "Yakin ingin mengosongkan keranjang?"
        )
    ) {

        return;

    }


    cart = [];


    renderCart();

}


function renderCart() {

    const list =
        get(
            "cartList"
        );


    if (!list) {
        return;
    }


    if (
        cart.length ===
        0
    ) {

        list.innerHTML =
            `
                <div class="empty">
                    Keranjang masih kosong.
                </div>
            `;


        calculateTotal();

        return;

    }


    list.innerHTML =
        cart.map(
            item => {

                const product =
                    products.find(
                        product =>
                            product.id ===
                            item.productId
                    );


                if (!product) {
                    return "";
                }


                const itemTotal =
                    Number(
                        product.price
                    ) *
                    Number(
                        item.qty
                    );


                const stock =
                    Number(
                        product.stock
                    ) || 0;


                return `

                    <div
                        class="cart-item"
                    >

                        <div>

                            <h4>
                                ${escapeHtml(
                                    product.name
                                )}
                            </h4>

                            <small>
                                ${formatRupiah(
                                    product.price
                                )}
                                ×
                                ${item.qty}
                                =
                                ${formatRupiah(
                                    itemTotal
                                )}
                            </small>

                        </div>


                        <div
                            class="qty-controls"
                        >

                            <button
                                type="button"
                                data-action="qty-minus"
                                data-id="${escapeHtml(
                                    product.id
                                )}"
                            >
                                −
                            </button>


                            <input
                                type="number"
                                class="qty-input"
                                min="1"
                                max="${stock}"
                                value="${item.qty}"
                                data-action="qty-input"
                                data-id="${escapeHtml(
                                    product.id
                                )}"
                            >


                            <button
                                type="button"
                                data-action="qty-plus"
                                data-id="${escapeHtml(
                                    product.id
                                )}"
                            >
                                +
                            </button>


                            <button
                                type="button"
                                data-action="remove-item"
                                data-id="${escapeHtml(
                                    product.id
                                )}"
                            >
                                ×
                            </button>

                        </div>

                    </div>

                `;

            }
        ).join("");


    calculateTotal();

}


/* =========================================
   PAYMENT
========================================= */

function updatePaymentMethod() {

    const method =
        get(
            "paymentMethod"
        )?.value ||
        "CASH";


    const cashArea =
        get(
            "cashPaymentArea"
        );


    const qrisArea =
        get(
            "qrisPaymentArea"
        );


    if (
        method ===
        "CASH"
    ) {

        cashArea?.classList.remove(
            "hidden"
        );

        qrisArea?.classList.add(
            "hidden"
        );

    } else {

        cashArea?.classList.add(
            "hidden"
        );

        qrisArea?.classList.remove(
            "hidden"
        );

    }


    calculateTotal();

}


/* =========================================
   TOTAL + DISCOUNT PERCENT
========================================= */

function calculateTotal() {

    let subtotal =
        0;


    cart.forEach(
        item => {

            const product =
                products.find(
                    product =>
                        product.id ===
                        item.productId
                );


            if (product) {

                subtotal +=
                    Number(
                        product.price
                    ) *
                    Number(
                        item.qty
                    );

            }

        }
    );


    let discountPercent =
        Number(
            get(
                "discount"
            )?.value
        ) || 0;


    discountPercent =
        Math.min(
            100,
            Math.max(
                0,
                discountPercent
            )
        );


    const discount =
        subtotal *
        discountPercent /
        100;


    const total =
        Math.max(
            0,
            subtotal -
            discount
        );


    const method =
        get(
            "paymentMethod"
        )?.value ||
        "CASH";


    let payment =
        0;


    let change =
        0;


    if (
        method ===
        "CASH"
    ) {

        payment =
            Number(
                get(
                    "payment"
                )?.value
            ) || 0;


        change =
            Math.max(
                0,
                payment -
                total
            );

    } else {

        payment =
            total;

        change =
            0;

    }


    if (
        get("subtotal")
    ) {

        get(
            "subtotal"
        ).textContent =
            formatRupiah(
                subtotal
            );

    }


    if (
        get("discountLabel")
    ) {

        get(
            "discountLabel"
        ).textContent =
            formatRupiah(
                discount
            );

    }


    if (
        get(
            "discountPercentLabel"
        )
    ) {

        get(
            "discountPercentLabel"
        ).textContent =
            `${discountPercent}%`;

    }


    if (
        get("grandTotal")
    ) {

        get(
            "grandTotal"
        ).textContent =
            formatRupiah(
                total
            );

    }


    if (
        get("change")
    ) {

        get(
            "change"
        ).textContent =
            formatRupiah(
                change
            );

    }


    if (
        get("qrisTotal")
    ) {

        get(
            "qrisTotal"
        ).textContent =
            formatRupiah(
                total
            );

    }


    return {

        subtotal:
            subtotal,

        discountPercent:
            discountPercent,

        discount:
            discount,

        total:
            total,

        payment:
            payment,

        change:
            change,

        method:
            method

    };

}


/* =========================================
   CHECKOUT
========================================= */

function checkout() {

    if (
        !cart.length
    ) {

        alert(
            "Keranjang masih kosong."
        );

        return;

    }


    const result =
        calculateTotal();


    if (
        result.method ===
            "CASH" &&
        result.payment <
            result.total
    ) {

        alert(
            "Uang pembayaran masih kurang."
        );

        return;

    }


    if (
        result.method ===
        "QRIS"
    ) {

        if (
            !confirm(
                "Pastikan pembayaran QRIS sudah diterima.\n\n" +
                `Total: ${formatRupiah(
                    result.total
                )}\n\n` +
                "Lanjutkan transaksi?"
            )
        ) {

            return;

        }

    }


    for (
        const item of cart
    ) {

        const product =
            products.find(
                product =>
                    product.id ===
                    item.productId
            );


        if (!product) {

            alert(
                "Produk tidak ditemukan."
            );

            return;

        }


        if (
            Number(
                item.qty
            ) >
            Number(
                product.stock
            )
        ) {

            alert(
                `Stok ${product.name} tidak mencukupi.`
            );

            return;

        }

    }


    const items =
        cart.map(
            item => {

                const product =
                    products.find(
                        product =>
                            product.id ===
                            item.productId
                    );


                return {

                    code:
                        product.code,

                    name:
                        product.name,

                    price:
                        Number(
                            product.price
                        ),

                    qty:
                        Number(
                            item.qty
                        ),

                    subtotal:
                        Number(
                            product.price
                        ) *
                        Number(
                            item.qty
                        )

                };

            }
        );


    cart.forEach(
        item => {

            const product =
                products.find(
                    product =>
                        product.id ===
                        item.productId
                );


            if (product) {

                product.stock =
                    Number(
                        product.stock
                    ) -
                    Number(
                        item.qty
                    );

            }

        }
    );


    const transaction = {

        invoice:
            "INV-" +
            Date.now(),

        date:
            new Date()
                .toISOString(),

        paymentMethod:
            result.method,

        subtotal:
            result.subtotal,

        discountPercent:
            result.discountPercent,

        discount:
            result.discount,

        total:
            result.total,

        payment:
            result.payment,

        change:
            result.change,

        items:
            items

    };


    transactions.unshift(
        transaction
    );


    saveProducts();

    saveTransactions();


    cart = [];


    if (
        get("discount")
    ) {

        get(
            "discount"
        ).value =
            "0";

    }


    if (
        get("payment")
    ) {

        get(
            "payment"
        ).value =
            "";

    }


    if (
        get(
            "paymentMethod"
        )
    ) {

        get(
            "paymentMethod"
        ).value =
            "CASH";

    }


    updatePaymentMethod();

    renderAll();

    showReceipt(
        transaction
    );

}


/* =========================================
   RECEIPT
========================================= */

function showReceipt(
    transaction
) {

    let text = "";


    text +=
        "================================\n";

    text +=
        "             KASIRKU\n";

    text +=
        "================================\n";


    text +=
        `Invoice : ${
            transaction.invoice
        }\n`;


    text +=
        `Tanggal : ${
            new Date(
                transaction.date
            ).toLocaleString(
                "id-ID"
            )
        }\n`;


    text +=
        `Metode  : ${
            transaction.paymentMethod
        }\n`;


    text +=
        `Diskon  : ${
            transaction.discountPercent ??
            0
        }%\n`;


    text +=
        "--------------------------------\n";


    transaction.items.forEach(
        item => {

            text +=
                `${item.name}\n`;

            text +=
                `${item.qty} x ${
                    formatRupiah(
                        item.price
                    )
                } = ${
                    formatRupiah(
                        item.subtotal
                    )
                }\n`;

        }
    );


    text +=
        "--------------------------------\n";


    text +=
        `Subtotal : ${
            formatRupiah(
                transaction.subtotal
            )
        }\n`;


    text +=
        `Diskon   : ${
            formatRupiah(
                transaction.discount
            )
        }\n`;


    text +=
        `TOTAL    : ${
            formatRupiah(
                transaction.total
            )
        }\n`;


    text +=
        `Bayar    : ${
            formatRupiah(
                transaction.payment
            )
        }\n`;


    text +=
        `Kembali  : ${
            formatRupiah(
                transaction.change
            )
        }\n`;


    text +=
        "--------------------------------\n";


    text +=
        "          TERIMA KASIH\n";


    text +=
        "================================";


    currentReceipt =
        text;


    get(
        "receiptContent"
    ).textContent =
        text;


    get(
        "receiptModal"
    ).classList.remove(
        "hidden"
    );

}


/* =========================================
   PRINT RECEIPT
========================================= */

function printReceipt() {

    if (
        !currentReceipt
    ) {

        alert(
            "Belum ada struk."
        );

        return;

    }


    const printWindow =
        window.open(
            "",
            "_blank",
            "width=400,height=650"
        );


    if (!printWindow) {

        alert(
            "Popup browser diblokir."
        );

        return;

    }


    printWindow.document.write(`

        <html>

        <head>

            <title>
                Struk Kasir
            </title>

        </head>

        <body>

            <pre
                style="
                    font-family: monospace;
                    white-space: pre-wrap;
                "
            >${escapeHtml(
                currentReceipt
            )}</pre>

            <script>
                window.onload =
                    function() {
                        window.print();
                    };
            <\/script>

        </body>

        </html>

    `);


    printWindow.document.close();

}


/* =========================================
   PRODUCT MODAL
========================================= */

function openProductModal(
    product = null
) {

    editingProductId =
        product?.id ||
        null;


    get(
        "modalTitle"
    ).textContent =
        product
            ? "Edit Produk"
            : "Tambah Produk";


    get(
        "productCode"
    ).value =
        product?.code ||
        "";


    get(
        "productName"
    ).value =
        product?.name ||
        "";


    get(
        "productCategory"
    ).value =
        product?.category ||
        "";


    get(
        "productPrice"
    ).value =
        product?.price ??
        "";


    get(
        "productStock"
    ).value =
        product?.stock ??
        "";


    get(
        "productModal"
    ).classList.remove(
        "hidden"
    );

}


function closeProductModal() {

    get(
        "productModal"
    )?.classList.add(
        "hidden"
    );


    get(
        "productForm"
    )?.reset();


    editingProductId =
        null;

}


function saveProduct(
    event
) {

    event.preventDefault();


    const code =
        get(
            "productCode"
        )
            .value
            .trim();


    const name =
        get(
            "productName"
        )
            .value
            .trim();


    const category =
        get(
            "productCategory"
        )
            .value
            .trim();


    const price =
        Number(
            get(
                "productPrice"
            ).value
        );


    const stock =
        Number(
            get(
                "productStock"
            ).value
        );


    if (
        !code ||
        !name ||
        !category
    ) {

        alert(
            "Semua data produk wajib diisi."
        );

        return;

    }


    if (
        !Number.isFinite(
            price
        ) ||
        !Number.isFinite(
            stock
        ) ||
        price < 0 ||
        stock < 0
    ) {

        alert(
            "Harga dan stok tidak valid."
        );

        return;

    }


    const duplicate =
        products.find(
            product =>
                String(
                    product.code
                ).toLowerCase() ===
                code.toLowerCase() &&

                product.id !==
                editingProductId
        );


    if (duplicate) {

        alert(
            "Kode produk sudah digunakan."
        );

        return;

    }


    if (
        editingProductId
    ) {

        const index =
            products.findIndex(
                product =>
                    product.id ===
                    editingProductId
            );


        if (
            index !== -1
        ) {

            products[index] = {

                ...products[index],

                code:
                    code,

                name:
                    name,

                category:
                    category,

                price:
                    price,

                stock:
                    stock

            };

        }

    } else {

        products.push({

            id:
                "P-" +
                Date.now(),

            code:
                code,

            name:
                name,

            category:
                category,

            price:
                price,

            stock:
                stock

        });

    }


    saveProducts();

    renderAll();

    closeProductModal();

}


function editProduct(
    id
) {

    const product =
        products.find(
            product =>
                product.id ===
                id
        );


    if (product) {

        openProductModal(
            product
        );

    }

}


function deleteProduct(
    id
) {

    const product =
        products.find(
            product =>
                product.id ===
                id
        );


    if (!product) {

        return;

    }


    if (
        !confirm(
            `Yakin ingin menghapus ${product.name}?`
        )
    ) {

        return;

    }


    products =
        products.filter(
            product =>
                product.id !==
                id
        );


    cart =
        cart.filter(
            item =>
                item.productId !==
                id
        );


    saveProducts();

    renderAll();

}


function renderProductTable() {

    const table =
        get(
            "productTableBody"
        );


    if (!table) {

        return;

    }


    if (
        products.length ===
        0
    ) {

        table.innerHTML = `
            <tr>
                <td
                    colspan="6"
                    class="empty"
                >
                    Belum ada produk.
                </td>
            </tr>
        `;

        return;

    }


    table.innerHTML =
        products.map(
            product => {

                const stock =
                    Number(
                        product.stock
                    ) || 0;


                return `

                    <tr>

                        <td>
                            ${escapeHtml(
                                product.code
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                product.name
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                product.category
                            )}
                        </td>

                        <td>
                            ${formatRupiah(
                                product.price
                            )}
                        </td>

                        <td
                            class="${
                                stock <= 5
                                    ? "low"
                                    : ""
                            }"
                        >
                            ${stock}
                        </td>

                        <td>

                            <button
                                type="button"
                                class="
                                    btn
                                    btn-secondary
                                    btn-small
                                "
                                data-action="edit-product"
                                data-id="${escapeHtml(
                                    product.id
                                )}"
                            >
                                Edit
                            </button>


                            <button
                                type="button"
                                class="
                                    btn
                                    btn-danger
                                    btn-small
                                "
                                data-action="delete-product"
                                data-id="${escapeHtml(
                                    product.id
                                )}"
                            >
                                Hapus
                            </button>

                        </td>

                    </tr>

                `;

            }
        ).join("");

}


/* =========================================
   RIWAYAT
========================================= */

function viewTransaction(
    invoice
) {

    const transaction =
        transactions.find(
            transaction =>
                transaction.invoice ===
                invoice
        );


    if (
        transaction
    ) {

        showReceipt(
            transaction
        );

    }

}


function renderTransactions() {

    const table =
        get(
            "transactionTableBody"
        );


    if (!table) {
        return;
    }


    if (
        !transactions.length
    ) {

        table.innerHTML = `
            <tr>
                <td
                    colspan="8"
                    class="empty"
                >
                    Belum ada transaksi.
                </td>
            </tr>
        `;

        return;

    }


    table.innerHTML =
        transactions.map(
            transaction => {

                return `

                    <tr>

                        <td>
                            ${escapeHtml(
                                transaction.invoice
                            )}
                        </td>

                        <td>
                            ${
                                new Date(
                                    transaction.date
                                ).toLocaleString(
                                    "id-ID"
                                )
                            }
                        </td>

                        <td>
                            ${escapeHtml(
                                transaction.paymentMethod ||
                                "CASH"
                            )}
                        </td>

                        <td>
                            ${
                                transaction.discountPercent ??
                                0
                            }%
                        </td>

                        <td>
                            ${formatRupiah(
                                transaction.total
                            )}
                        </td>

                        <td>
                            ${formatRupiah(
                                transaction.payment
                            )}
                        </td>

                        <td>
                            ${formatRupiah(
                                transaction.change
                            )}
                        </td>

                        <td>

                            <button
                                type="button"
                                class="
                                    btn
                                    btn-primary
                                    btn-small
                                "
                                data-action="view-transaction"
                                data-invoice="${escapeHtml(
                                    transaction.invoice
                                )}"
                            >
                                Lihat
                            </button>

                        </td>

                    </tr>

                `;

            }
        ).join("");

}


function clearTransactions() {

    if (
        !transactions.length
    ) {

        alert(
            "Riwayat transaksi masih kosong."
        );

        return;

    }


    if (
        !confirm(
            "Yakin ingin menghapus semua riwayat?"
        )
    ) {

        return;

    }


    const password =
        prompt(
            "Masukkan password admin:"
        );


    if (
        password === null
    ) {

        return;

    }


    if (
        password !==
        LOGIN_PASSWORD
    ) {

        alert(
            "Password salah."
        );

        return;

    }


    transactions =
        [];


    saveTransactions();

    renderAll();

}


/* =========================================
   REKAP
========================================= */

function getDailyData() {

    const date =
        get(
            "rekapDate"
        )?.value ||
        getToday();


    const daily =
        transactions.filter(
            transaction =>
                String(
                    transaction.date
                ).startsWith(
                    date
                )
        );


    let totalItems =
        0;


    let totalDiscount =
        0;


    let totalRevenue =
        0;


    let cashRevenue =
        0;


    let qrisRevenue =
        0;


    const productsMap =
        {};


    daily.forEach(
        transaction => {

            totalDiscount +=
                Number(
                    transaction.discount ||
                    0
                );


            totalRevenue +=
                Number(
                    transaction.total ||
                    0
                );


            const method =
                transaction.paymentMethod ||
                "CASH";


            if (
                method ===
                "QRIS"
            ) {

                qrisRevenue +=
                    Number(
                        transaction.total ||
                        0
                    );

            } else {

                cashRevenue +=
                    Number(
                        transaction.total ||
                        0
                    );

            }


            (
                transaction.items ||
                []
            ).forEach(
                item => {

                    const qty =
                        Number(
                            item.qty ||
                            0
                        );


                    const total =
                        Number(
                            item.subtotal ||
                            0
                        );


                    totalItems +=
                        qty;


                    if (
                        !productsMap[
                            item.name
                        ]
                    ) {

                        productsMap[
                            item.name
                        ] = {

                            qty:
                                0,

                            total:
                                0

                        };

                    }


                    productsMap[
                        item.name
                    ].qty +=
                        qty;


                    productsMap[
                        item.name
                    ].total +=
                        total;

                }
            );

        }
    );


    return {

        date:
            date,

        daily:
            daily,

        totalItems:
            totalItems,

        totalDiscount:
            totalDiscount,

        totalRevenue:
            totalRevenue,

        cashRevenue:
            cashRevenue,

        qrisRevenue:
            qrisRevenue,

        productsMap:
            productsMap

    };

}


function renderDailyReport() {

    const data =
        getDailyData();


    get(
        "rekapTransaksi"
    ).textContent =
        data.daily.length;


    get(
        "rekapItem"
    ).textContent =
        data.totalItems;


    get(
        "rekapDiskon"
    ).textContent =
        formatRupiah(
            data.totalDiscount
        );


    get(
        "rekapOmzet"
    ).textContent =
        formatRupiah(
            data.totalRevenue
        );


    get(
        "rekapCash"
    ).textContent =
        formatRupiah(
            data.cashRevenue
        );


    get(
        "rekapQris"
    ).textContent =
        formatRupiah(
            data.qrisRevenue
        );


    const table =
        get(
            "rekapProduk"
        );


    const entries =
        Object.entries(
            data.productsMap
        );


    if (
        !entries.length
    ) {

        table.innerHTML =
            `
                <tr>

                    <td
                        colspan="3"
                        class="empty"
                    >
                        Tidak ada penjualan
                        pada tanggal ini.
                    </td>

                </tr>
            `;

        return;

    }


    entries.sort(
        (
            [, a],
            [, b]
        ) =>
            b.qty -
            a.qty
    );


    table.innerHTML =
        entries.map(
            (
                [
                    name,
                    value
                ]
            ) => {

                return `

                    <tr>

                        <td>
                            ${escapeHtml(
                                name
                            )}
                        </td>

                        <td>
                            ${value.qty}
                        </td>

                        <td>
                            ${formatRupiah(
                                value.total
                            )}
                        </td>

                    </tr>

                `;

            }
        ).join("");

}


/* =========================================
   CETAK REKAP
========================================= */

function printDailyReport() {

    const data =
        getDailyData();


    let text =
        "====================================\n";

    text +=
        "          REKAP PENJUALAN\n";

    text +=
        "====================================\n";

    text +=
        `Tanggal         : ${
            data.date
        }\n`;

    text +=
        `Total Transaksi : ${
            data.daily.length
        }\n`;

    text +=
        `Item Terjual    : ${
            data.totalItems
        }\n`;

    text +=
        `Total Diskon    : ${
            formatRupiah(
                data.totalDiscount
            )
        }\n`;

    text +=
        `Total Omzet     : ${
            formatRupiah(
                data.totalRevenue
            )
        }\n`;

    text +=
        `Omzet Cash      : ${
            formatRupiah(
                data.cashRevenue
            )
        }\n`;

    text +=
        `Omzet QRIS      : ${
            formatRupiah(
                data.qrisRevenue
            )
        }\n`;

    text +=
        "------------------------------------\n";

    text +=
        "PRODUK TERJUAL\n";

    text +=
        "------------------------------------\n";


    Object.entries(
        data.productsMap
    ).forEach(
        (
            [
                name,
                value
            ]
        ) => {

            text +=
                `${name} : ${
                    value.qty
                } = ${
                    formatRupiah(
                        value.total
                    )
                }\n`;

        }
    );


    const windowPrint =
        window.open(
            "",
            "_blank",
            "width=500,height=700"
        );


    if (!windowPrint) {

        alert(
            "Popup browser diblokir."
        );

        return;

    }


    windowPrint.document.write(`

        <html>

        <head>

            <title>
                Rekap Penjualan
            </title>

        </head>

        <body>

            <pre>
${escapeHtml(text)}
            </pre>

            <script>
                window.onload =
                    function() {
                        window.print();
                    };
            <\/script>

        </body>

        </html>

    `);


    windowPrint.document.close();

}


/* =========================================
   EXPORT EXCEL AS REAL XLSX
   TANPA LIBRARY EXTERNAL
========================================= */

function xmlEscape(value) {

    return String(value ?? "")
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&apos;"
        );

}


function crc32(bytes) {

    if (
        !crc32.table
    ) {

        const table =
            new Uint32Array(
                256
            );


        for (
            let n = 0;
            n < 256;
            n++
        ) {

            let c =
                n;


            for (
                let k = 0;
                k < 8;
                k++
            ) {

                c =
                    (
                        c & 1
                    )

                        ?

                    (
                        0xEDB88320 ^
                        (
                            c >>> 1
                        )
                    )

                        :

                    (
                        c >>> 1
                    );

            }


            table[n] =
                c >>> 0;

        }


        crc32.table =
            table;

    }


    let c =
        0xFFFFFFFF;


    for (
        const byte of bytes
    ) {

        c =
            crc32.table[
                (
                    c ^
                    byte
                ) &
                255
            ] ^
            (
                c >>> 8
            );

    }


    return (
        c ^
        0xFFFFFFFF
    ) >>> 0;

}


function u16(number) {

    return new Uint8Array([

        number & 255,

        (
            number >>>
            8
        ) & 255

    ]);

}


function u32(number) {

    return new Uint8Array([

        number & 255,

        (
            number >>>
            8
        ) & 255,

        (
            number >>>
            16
        ) & 255,

        (
            number >>>
            24
        ) & 255

    ]);

}


function concatBytes(
    parts
) {

    let length =
        0;


    parts.forEach(
        part => {
            length +=
                part.length;
        }
    );


    const result =
        new Uint8Array(
            length
        );


    let offset =
        0;


    parts.forEach(
        part => {

            result.set(
                part,
                offset
            );

            offset +=
                part.length;

        }
    );


    return result;

}


function zipStore(
    files
) {

    const encoder =
        new TextEncoder();


    const localFiles = [];

    const centralFiles = [];


    let offset =
        0;


    files.forEach(
        file => {

            const name =
                encoder.encode(
                    file.name
                );


            const data =
                encoder.encode(
                    file.data
                );


            const checksum =
                crc32(
                    data
                );


            const local =
                concatBytes([

                    new Uint8Array([
                        0x50,
                        0x4b,
                        0x03,
                        0x04
                    ]),

                    u16(20),

                    u16(0),

                    u16(0),

                    u16(0),

                    u16(0),

                    u32(checksum),

                    u32(
                        data.length
                    ),

                    u32(
                        data.length
                    ),

                    u16(
                        name.length
                    ),

                    u16(0),

                    name,

                    data

                ]);


            localFiles.push(
                local
            );


            const central =
                concatBytes([

                    new Uint8Array([
                        0x50,
                        0x4b,
                        0x01,
                        0x02
                    ]),

                    u16(20),

                    u16(20),

                    u16(0),

                    u16(0),

                    u16(0),

                    u16(0),

                    u32(checksum),

                    u32(
                        data.length
                    ),

                    u32(
                        data.length
                    ),

                    u16(
                        name.length
                    ),

                    u16(0),

                    u16(0),

                    u16(0),

                    u16(0),

                    u32(0),

                    u32(offset),

                    name

                ]);


            centralFiles.push(
                central
            );


            offset +=
                local.length;

        }
    );


    const localData =
        concatBytes(
            localFiles
        );


    const centralData =
        concatBytes(
            centralFiles
        );


    const end =
        concatBytes([

            new Uint8Array([
                0x50,
                0x4b,
                0x05,
                0x06
            ]),

            u16(0),

            u16(0),

            u16(
                files.length
            ),

            u16(
                files.length
            ),

            u32(
                centralData.length
            ),

            u32(
                localData.length
            ),

            u16(0)

        ]);


    return concatBytes([

        localData,

        centralData,

        end

    ]);

}


function xlsxCell(
    column,
    row,
    value
) {

    const ref =
        `${column}${row}`;


    if (
        typeof value ===
        "number" &&
        Number.isFinite(
            value
        )
    ) {

        return `

            <c
                r="${ref}"
                t="n"
            >
                <v>
                    ${value}
                </v>
            </c>

        `;

    }


    return `

        <c
            r="${ref}"
            t="inlineStr"
        >

            <is>

                <t>
                    ${xmlEscape(
                        value
                    )}
                </t>

            </is>

        </c>

    `;

}


function columnName(
    number
) {

    let name =
        "";


    let n =
        number;


    while (
        n >= 0
    ) {

        name =
            String.fromCharCode(
                65 +
                (
                    n %
                    26
                )
            ) +
            name;


        n =
            Math.floor(
                n / 26
            ) -
            1;

    }


    return name;

}


function createSheetXml(
    rows
) {

    let xml = `

        <?xml version="1.0"
        encoding="UTF-8"
        standalone="yes"?>

        <worksheet
            xmlns="
            http://schemas.openxmlformats.org/spreadsheetml/2006/main"
        >

        <sheetData>

    `;


    rows.forEach(
        (
            row,
            rowIndex
        ) => {

            const excelRow =
                rowIndex + 1;


            xml +=
                `<row r="${excelRow}">`;


            row.forEach(
                (
                    value,
                    columnIndex
                ) => {

                    xml +=
                        xlsxCell(
                            columnName(
                                columnIndex
                            ),
                            excelRow,
                            value
                        );

                }
            );


            xml +=
                "</row>";

        }
    );


    xml +=
        `

            </sheetData>

        </worksheet>

        `;


    return xml;

}


function exportRekap() {

    const data =
        getDailyData();


    const rows = [

        [
            "REKAP PENJUALAN KASIRKU"
        ],

        [],

        [
            "Tanggal",
            data.date
        ],

        [
            "Total Transaksi",
            data.daily.length
        ],

        [
            "Item Terjual",
            data.totalItems
        ],

        [
            "Total Diskon",
            data.totalDiscount
        ],

        [
            "Total Omzet",
            data.totalRevenue
        ],

        [
            "Omzet Cash",
            data.cashRevenue
        ],

        [
            "Omzet QRIS",
            data.qrisRevenue
        ],

        [],

        [
            "Invoice",
            "Tanggal",
            "Metode",
            "Produk",
            "Qty",
            "Harga",
            "Diskon %",
            "Diskon Nominal",
            "Total Item"
        ]

    ];


    data.daily.forEach(
        transaction => {

            (
                transaction.items ||
                []
            ).forEach(
                item => {

                    rows.push([

                        transaction.invoice,

                        new Date(
                            transaction.date
                        ).toLocaleString(
                            "id-ID"
                        ),

                        transaction.paymentMethod ||
                            "CASH",

                        item.name,

                        Number(
                            item.qty
                        ) || 0,

                        Number(
                            item.price
                        ) || 0,

                        `${
                            transaction.discountPercent ??
                            0
                        }%`,

                        Number(
                            transaction.discount
                        ) || 0,

                        Number(
                            item.subtotal
                        ) || 0

                    ]);

                }
            );

        }
    );


    const sheetXml =
        createSheetXml(
            rows
        );


    const files = [

        {
            name:
                "[Content_Types].xml",

            data:
                `

                <?xml version="1.0"
                encoding="UTF-8"
                standalone="yes"?>

                <Types
                    xmlns="
                    http://schemas.openxmlformats.org/package/2006/content-types"
                >

                    <Default
                        Extension="rels"
                        ContentType="
                        application/vnd.openxmlformats-package.relationships+xml"
                    />

                    <Default
                        Extension="xml"
                        ContentType="
                        application/xml
                    "
                    />

                    <Override
                        PartName="
                        /xl/workbook.xml
                        "
                        ContentType="
                        application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml
                        "
                    />

                    <Override
                        PartName="
                        /xl/worksheets/sheet1.xml
                        "
                        ContentType="
                        application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml
                        "
                    />

                </Types>

                `
        },


        {
            name:
                "_rels/.rels",

            data:
                `

                <?xml version="1.0"
                encoding="UTF-8"
                standalone="yes"?>

                <Relationships
                    xmlns="
                    http://schemas.openxmlformats.org/package/2006/relationships"
                >

                    <Relationship
                        Id="rId1"

                        Type="
                        http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument
                        "

                        Target="xl/workbook.xml"
                    />

                </Relationships>

                `
        },


        {
            name:
                "xl/workbook.xml",

            data:
                `

                <?xml version="1.0"
                encoding="UTF-8"
                standalone="yes"?>

                <workbook
                    xmlns="
                    http://schemas.openxmlformats.org/spreadsheetml/2006/main"
                    "

                    xmlns:r="
                    http://schemas.openxmlformats.org/officeDocument/2006/relationships"
                >

                    <sheets>

                        <sheet
                            name="Rekap"
                            sheetId="1"
                            r:id="rId1"
                        />

                    </sheets>

                </workbook>

                `
        },


        {
            name:
                "xl/_rels/workbook.xml.rels",

            data:
                `

                <?xml version="1.0"
                encoding="UTF-8"
                standalone="yes"?>

                <Relationships
                    xmlns="
                    http://schemas.openxmlformats.org/package/2006/relationships"
                >

                    <Relationship
                        Id="rId1"

                        Type="
                        http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet
                        "

                        Target="
                        worksheets/sheet1.xml
                        "
                    />

                </Relationships>

                `
        },


        {
            name:
                "xl/worksheets/sheet1.xml",

            data:
                sheetXml

        }

    ];


    const bytes =
        zipStore(
            files
        );


    const blob =
        new Blob(
            [bytes],
            {
                type:
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        `Rekap-Penjualan-${data.date}.xlsx`;


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    setTimeout(
        () => {
            URL.revokeObjectURL(
                url
            );
        },
        1000
    );

}


/* =========================================
   EVENT HANDLERS
========================================= */

function handleProductGrid(
    event
) {

    const button =
        event.target.closest(
            "button[data-action='add-product']"
        );


    if (
        !button
    ) {

        return;

    }


    addToCart(
        button.dataset.id
    );

}


function handleCartClick(
    event
) {

    const button =
        event.target.closest(
            "button[data-action]"
        );


    if (!button) {

        return;

    }


    const id =
        button.dataset.id;


    if (
        button.dataset.action ===
        "qty-minus"
    ) {

        changeQty(
            id,
            -1
        );

    }


    if (
        button.dataset.action ===
        "qty-plus"
    ) {

        changeQty(
            id,
            1
        );

    }


    if (
        button.dataset.action ===
        "remove-item"
    ) {

        removeFromCart(
            id
        );

    }

}


function handleCartInput(
    event
) {

    const input =
        event.target.closest(
            "input[data-action='qty-input']"
        );


    if (!input) {

        return;

    }


    const id =
        input.dataset.id;


    const item =
        cart.find(
            item =>
                item.productId ===
                id
        );


    const product =
        products.find(
            product =>
                product.id ===
                id
        );


    if (
        !item ||
        !product
    ) {

        return;

    }


    const stock =
        Number(
            product.stock
        ) || 0;


    let value =
        parseInt(
            input.value,
            10
        );


    if (
        Number.isFinite(
            value
        )
    ) {

        if (
            value < 1
        ) {
            value = 1;
        }

        if (
            value > stock
        ) {
            value = stock;
        }


        item.qty =
            value;


        calculateTotal();


        const row =
            input.closest(
                ".cart-item"
            );


        const text =
            row?.querySelector(
                "small"
            );


        if (text) {

            text.textContent =
                `${formatRupiah(
                    product.price
                )} × ${
                    item.qty
                } = ${
                    formatRupiah(
                        Number(
                            product.price
                        ) *
                        item.qty
                    )
                }`;

        }

    }

}


function handleCartChange(
    event
) {

    const input =
        event.target.closest(
            "input[data-action='qty-input']"
        );


    if (!input) {

        return;

    }


    const item =
        cart.find(
            item =>
                item.productId ===
                input.dataset.id
        );


    if (!item) {

        return;

    }


    input.value =
        item.qty;

}


function handleProductTable(
    event
) {

    const button =
        event.target.closest(
            "button[data-action]"
        );


    if (!button) {

        return;

    }


    if (
        button.dataset.action ===
        "edit-product"
    ) {

        editProduct(
            button.dataset.id
        );

    }


    if (
        button.dataset.action ===
        "delete-product"
    ) {

        deleteProduct(
            button.dataset.id
        );

    }

}


function handleTransactionTable(
    event
) {

    const button =
        event.target.closest(
            "button[data-action='view-transaction']"
        );


    if (!button) {

        return;

    }


    viewTransaction(
        button.dataset.invoice
    );

}


/* =========================================
   TABS
========================================= */

function setupTabs() {

    const tabs =
        document.querySelectorAll(
            ".tab"
        );


    const contents =
        document.querySelectorAll(
            ".tab-content"
        );


    tabs.forEach(
        tab => {

            tab.addEventListener(
                "click",
                function() {

                    tabs.forEach(
                        item =>
                            item.classList.remove(
                                "active"
                            )
                    );


                    contents.forEach(
                        item =>
                            item.classList.remove(
                                "active"
                            )
                    );


                    this.classList.add(
                        "active"
                    );


                    const target =
                        get(
                            this.dataset.tab
                        );


                    if (target) {

                        target.classList.add(
                            "active"
                        );

                    }


                    if (
                        this.dataset.tab ===
                        "rekap"
                    ) {

                        renderDailyReport();

                    }

                }
            );

        }
    );

}


/* =========================================
   EVENTS
========================================= */

function setupEvents() {

    on(
        "loginForm",
        "submit",
        handleLogin
    );

    on(
        "togglePassword",
        "click",
        togglePassword
    );

    on(
        "logoutBtn",
        "click",
        logout
    );

    on(
        "searchProduct",
        "input",
        renderProducts
    );

    on(
        "paymentMethod",
        "change",
        updatePaymentMethod
    );

    on(
        "discount",
        "input",
        calculateTotal
    );

    on(
        "payment",
        "input",
        calculateTotal
    );

    on(
        "clearCart",
        "click",
        clearCart
    );

    on(
        "checkoutBtn",
        "click",
        checkout
    );

    on(
        "addProductBtn",
        "click",
        () =>
            openProductModal()
    );

    on(
        "closeModal",
        "click",
        closeProductModal
    );

    on(
        "cancelModal",
        "click",
        closeProductModal
    );

    on(
        "productForm",
        "submit",
        saveProduct
    );

    on(
        "clearTransactions",
        "click",
        clearTransactions
    );

    on(
        "closeReceipt",
        "click",
        () =>
            get(
                "receiptModal"
            )?.classList.add(
                "hidden"
            )
    );

    on(
        "closeReceiptBtn",
        "click",
        () =>
            get(
                "receiptModal"
            )?.classList.add(
                "hidden"
            )
    );

    on(
        "printReceipt",
        "click",
        printReceipt
    );

    on(
        "rekapDate",
        "change",
        renderDailyReport
    );

    on(
        "printRekap",
        "click",
        printDailyReport
    );

    on(
        "exportRekap",
        "click",
        exportRekap
    );

    on(
        "productGrid",
        "click",
        handleProductGrid
    );

    on(
        "cartList",
        "click",
        handleCartClick
    );

    on(
        "cartList",
        "input",
        handleCartInput
    );

    on(
        "cartList",
        "change",
        handleCartChange
    );

    on(
        "productTableBody",
        "click",
        handleProductTable
    );

    on(
        "transactionTableBody",
        "click",
        handleTransactionTable
    );

}


/* =========================================
   SAFE EVENT BINDING
========================================= */

function on(
    id,
    event,
    handler
) {

    const element =
        get(id);


    if (!element) {

        console.warn(
            `Elemen #${id} tidak ditemukan.`
        );

        return;

    }


    element.addEventListener(
        event,
        handler
    );

}


/* =========================================
   RENDER ALL
========================================= */

function renderAll() {

    renderDashboard();

    renderProducts();

    renderProductTable();

    renderCart();

    renderTransactions();

    renderDailyReport();

}


/* =========================================
   START
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        if (
            get("rekapDate")
        ) {

            get(
                "rekapDate"
            ).value =
                getToday();

        }


        if (
            get(
                "paymentMethod"
            )
        ) {

            get(
                "paymentMethod"
            ).value =
                "CASH";

        }


        setupTabs();

        setupEvents();

        updateClock();

        setInterval(
            updateClock,
            1000
        );

        updatePaymentMethod();

        checkLogin();

        renderAll();

    }
);


/* =========================================
   GLOBAL
========================================= */

window.addToCart =
    addToCart;

window.setQty =
    setQty;

window.changeQty =
    changeQty;

window.removeFromCart =
    removeFromCart;

window.editProduct =
    editProduct;

window.deleteProduct =
    deleteProduct;

window.viewTransaction =
    viewTransaction;

window.openProductModal =
    openProductModal;

window.closeProductModal =
    closeProductModal;
