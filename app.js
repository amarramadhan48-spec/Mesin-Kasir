/* =====================================================
   KASIRKU
===================================================== */

const LOGIN_USERNAME = "admin";
const LOGIN_PASSWORD = "12345";

const LOGIN_SESSION_KEY =
    "kasirku_login_session_v3";

const PRODUCTS_KEY =
    "kasirku_products_final_v1";

const TRANSACTIONS_KEY =
    "kasirku_transactions_final_v1";


/* =====================================================
   DEFAULT PRODUCTS
===================================================== */

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


/* =====================================================
   DATA
===================================================== */

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

let editingProductId = null;

let currentReceipt = "";


/* =====================================================
   HELPER
===================================================== */

function get(id) {

    return document.getElementById(id);

}


function on(
    id,
    event,
    handler
) {

    const element =
        get(id);

    if (!element) {
        return;
    }

    element.addEventListener(
        event,
        handler
    );

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

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    return (
        year +
        "-" +
        month +
        "-" +
        day
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
                JSON.parse(
                    saved
                );

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


/* =====================================================
   LOGIN
===================================================== */

function showLogin() {

    const loginPage =
        get("loginPage");

    const appPage =
        get("appPage");

    if (loginPage) {

        loginPage.style.display =
            "flex";

    }

    if (appPage) {

        appPage.classList.add(
            "app-hidden"
        );

    }

}


function showApp() {

    const loginPage =
        get("loginPage");

    const appPage =
        get("appPage");

    if (loginPage) {

        loginPage.style.display =
            "none";

    }

    if (appPage) {

        appPage.classList.remove(
            "app-hidden"
        );

    }

}


function checkLogin() {

    const loggedIn =
        sessionStorage.getItem(
            LOGIN_SESSION_KEY
        );

    if (
        loggedIn === "true"
    ) {

        showApp();

    } else {

        showLogin();

    }

}


function handleLogin(event) {

    event.preventDefault();

    const username =
        get("username")
            ?.value
            .trim();

    const password =
        get("password")
            ?.value;

    const error =
        get("loginError");


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


/* =====================================================
   CLOCK
===================================================== */

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


/* =====================================================
   DASHBOARD
===================================================== */

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
                sum,
                transaction
            ) =>
                sum +
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
        get("statProducts")
    ) {

        get(
            "statProducts"
        ).textContent =
            products.length;

    }


    if (
        get("statTransactions")
    ) {

        get(
            "statTransactions"
        ).textContent =
            todayTransactions.length;

    }


    if (
        get("statRevenue")
    ) {

        get(
            "statRevenue"
        ).textContent =
            formatRupiah(
                revenue
            );

    }


    if (
        get("statLowStock")
    ) {

        get(
            "statLowStock"
        ).textContent =
            lowStock;

    }

}


/* =====================================================
   PRODUK DI KASIR
===================================================== */

function renderProducts() {

    const grid =
        get("productGrid");

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
            product => {

                return (

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

            }
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
                            onclick="
                                addToCart(
                                    '${product.id}'
                                )
                            "
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


/* =====================================================
   CART
===================================================== */

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


    const existing =
        cart.find(
            item =>
                item.productId ===
                productId
        );


    if (existing) {

        if (
            existing.qty >=
            stock
        ) {

            alert(
                "Jumlah sudah mencapai stok."
            );

            return;

        }

        existing.qty += 1;

    } else {

        cart.push({

            productId:
                productId,

            qty: 1

        });

    }


    renderCart();

}


function setQty(
    productId,
    value
) {

    const item =
        cart.find(
            i =>
                i.productId ===
                productId
        );


    const product =
        products.find(
            p =>
                p.id ===
                productId
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


    let qty =
        parseInt(
            value,
            10
        );


    if (
        Number.isNaN(qty) ||
        qty <= 0
    ) {

        removeFromCart(
            productId
        );

        return;

    }


    if (
        qty > stock
    ) {

        qty = stock;

        alert(
            `Jumlah ${product.name} dibatasi sesuai stok: ${stock}.`
        );

    }


    item.qty =
        qty;


    renderCart();

}


function changeQty(
    productId,
    amount
) {

    const item =
        cart.find(
            i =>
                i.productId ===
                productId
        );


    if (!item) {

        return;

    }


    setQty(
        productId,
        item.qty +
        Number(amount)
    );

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
        get("cartList");


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
                        p =>
                            p.id ===
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
                                onclick="
                                    changeQty(
                                        '${product.id}',
                                        -1
                                    )
                                "
                            >
                                −
                            </button>


                            <input
                                type="number"
                                class="qty-input"
                                min="1"
                                max="${stock}"
                                value="${item.qty}"
                                onchange="
                                    setQty(
                                        '${product.id}',
                                        this.value
                                    )
                                "
                            >


                            <button
                                type="button"
                                onclick="
                                    changeQty(
                                        '${product.id}',
                                        1
                                    )
                                "
                            >
                                +
                            </button>


                            <button
                                type="button"
                                onclick="
                                    removeFromCart(
                                        '${product.id}'
                                    )
                                "
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


/* =====================================================
   PEMBAYARAN
===================================================== */

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


/* =====================================================
   HITUNG TOTAL
===================================================== */

function calculateTotal() {

    let subtotal = 0;


    cart.forEach(
        item => {

            const product =
                products.find(
                    p =>
                        p.id ===
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


    /* DISKON PERSEN */

    let discountPercent =
        Number(
            get(
                "discount"
            )?.value
        ) || 0;


    if (
        discountPercent < 0
    ) {

        discountPercent =
            0;

    }


    if (
        discountPercent > 100
    ) {

        discountPercent =
            100;

    }


    const discount =
        subtotal *
        (
            discountPercent /
            100
        );


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


    let payment = 0;

    let change = 0;


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


    get(
        "subtotal"
    ).textContent =
        formatRupiah(
            subtotal
        );


    get(
        "discountLabel"
    ).textContent =
        formatRupiah(
            discount
        );


    get(
        "discountPercentLabel"
    ).textContent =
        discountPercent +
        "%";


    get(
        "grandTotal"
    ).textContent =
        formatRupiah(
            total
        );


    get(
        "change"
    ).textContent =
        formatRupiah(
            change
        );


    get(
        "qrisTotal"
    ).textContent =
        formatRupiah(
            total
        );


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


/* =====================================================
   CHECKOUT
===================================================== */

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


    /* CASH */

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


    /* QRIS */

    if (
        result.method ===
        "QRIS"
    ) {

        const confirmed =
            confirm(
                "Pastikan pembayaran QRIS sudah diterima.\n\n" +
                "Total: " +
                formatRupiah(
                    result.total
                ) +
                "\n\n" +
                "Lanjutkan transaksi?"
            );


        if (!confirmed) {

            return;

        }

    }


    /* VALIDASI STOK */

    for (
        const item of cart
    ) {

        const product =
            products.find(
                p =>
                    p.id ===
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


    /* SIMPAN ITEM */

    const transactionItems =
        cart.map(
            item => {

                const product =
                    products.find(
                        p =>
                            p.id ===
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


    /* KURANGI STOK */

    cart.forEach(
        item => {

            const product =
                products.find(
                    p =>
                        p.id ===
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


    /* TRANSAKSI */

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
            transactionItems

    };


    transactions.unshift(
        transaction
    );


    saveProducts();

    saveTransactions();


    /* RESET */

    cart = [];


    if (
        get("discount")
    ) {

        get(
            "discount"
        ).value =
            0;

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


/* =====================================================
   STRUK
===================================================== */

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
            transaction.paymentMethod ||
            "CASH"
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


/* =====================================================
   CETAK STRUK
===================================================== */

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
        <!DOCTYPE html>

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
                    font-size: 14px;
                    white-space: pre-wrap;
                "
            >${escapeHtml(
                currentReceipt
            )}</pre>

            <script>
                window.onload = function() {
                    window.print();
                };
            <\/script>

        </body>

        </html>
    `);


    printWindow.document.close();

}


/* =====================================================
   MODAL PRODUK
===================================================== */

function openProductModal(
    product = null
) {

    editingProductId =
        product
            ? product.id
            : null;


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


/* =====================================================
   SIMPAN PRODUK
===================================================== */

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
        Number.isNaN(price) ||
        Number.isNaN(stock) ||
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
                )
                    .toLowerCase() ===
                code.toLowerCase()
                &&
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


/* =====================================================
   EDIT PRODUK
===================================================== */

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


/* =====================================================
   DELETE PRODUK
===================================================== */

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


/* =====================================================
   PRODUCT TABLE
===================================================== */

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

        table.innerHTML =
            `
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
                                onclick="
                                    editProduct(
                                        '${product.id}'
                                    )
                                "
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
                                onclick="
                                    deleteProduct(
                                        '${product.id}'
                                    )
                                "
                            >
                                Hapus
                            </button>

                        </td>

                    </tr>

                `;

            }
        ).join("");

}


/* =====================================================
   RIWAYAT
===================================================== */

function renderTransactions() {

    const table =
        get(
            "transactionTableBody"
        );


    if (!table) {

        return;

    }


    if (
        transactions.length ===
        0
    ) {

        table.innerHTML =
            `
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
                                onclick="
                                    viewTransaction(
                                        '${transaction.invoice}'
                                    )
                                "
                            >
                                Lihat
                            </button>

                        </td>

                    </tr>

                `;

            }
        ).join("");

}


function viewTransaction(
    invoice
) {

    const transaction =
        transactions.find(
            transaction =>
                transaction.invoice ===
                invoice
        );


    if (transaction) {

        showReceipt(
            transaction
        );

    }

}


/* =====================================================
   HAPUS RIWAYAT
===================================================== */

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


    transactions = [];


    saveTransactions();

    renderAll();


    alert(
        "Semua riwayat berhasil dihapus."
    );

}


/* =====================================================
   REKAP
===================================================== */

function getDailyData() {

    const selectedDate =
        get(
            "rekapDate"
        )?.value ||
        getToday();


    const dailyTransactions =
        transactions.filter(
            transaction =>
                String(
                    transaction.date
                ).startsWith(
                    selectedDate
                )
        );


    let totalItems = 0;

    let totalDiscount = 0;

    let totalRevenue = 0;

    let cashRevenue = 0;

    let qrisRevenue = 0;


    const productSummary =
        {};


    dailyTransactions.forEach(
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


            if (
                Array.isArray(
                    transaction.items
                )
            ) {

                transaction.items.forEach(
                    item => {

                        const qty =
                            Number(
                                item.qty ||
                                0
                            );


                        const itemTotal =
                            Number(
                                item.subtotal ||
                                0
                            );


                        totalItems +=
                            qty;


                        if (
                            !productSummary[
                                item.name
                            ]
                        ) {

                            productSummary[
                                item.name
                            ] = {

                                qty:
                                    0,

                                total:
                                    0

                            };

                        }


                        productSummary[
                            item.name
                        ].qty +=
                            qty;


                        productSummary[
                            item.name
                        ].total +=
                            itemTotal;

                    }
                );

            }

        }
    );


    return {

        selectedDate:

            selectedDate,

        dailyTransactions:

            dailyTransactions,

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

        productSummary:

            productSummary

    };

}


/* =====================================================
   RENDER REKAP
===================================================== */

function renderDailyReport() {

    const data =
        getDailyData();


    get(
        "rekapTransaksi"
    ).textContent =
        data
            .dailyTransactions
            .length;


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
            data.productSummary
        );


    if (
        entries.length ===
        0
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
            ([name, item]) => {

                return `

                    <tr>

                        <td>
                            ${escapeHtml(
                                name
                            )}
                        </td>

                        <td>
                            ${item.qty}
                        </td>

                        <td>
                            ${formatRupiah(
                                item.total
                            )}
                        </td>

                    </tr>

                `;

            }
        ).join("");

}


/* =====================================================
   EXPORT EXCEL
===================================================== */

function exportRekap() {

    const data =
        getDailyData();


    if (
        data
            .dailyTransactions
            .length ===
        0
    ) {

        alert(
            "Tidak ada transaksi pada tanggal tersebut."
        );

        return;

    }


    let rows = `

        <table border="1">

            <tr>

                <th>
                    No
                </th>

                <th>
                    Invoice
                </th>

                <th>
                    Tanggal
                </th>

                <th>
                    Metode
                </th>

                <th>
                    Produk
                </th>

                <th>
                    Qty
                </th>

                <th>
                    Harga
                </th>

                <th>
                    Diskon %
                </th>

                <th>
                    Diskon Nominal
                </th>

                <th>
                    Total Item
                </th>

            </tr>

    `;


    let no = 1;


    data.dailyTransactions.forEach(
        transaction => {

            transaction.items.forEach(
                item => {

                    rows += `

                        <tr>

                            <td>
                                ${no++}
                            </td>

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
                                ${escapeHtml(
                                    item.name
                                )}
                            </td>

                            <td>
                                ${item.qty}
                            </td>

                            <td>
                                ${item.price}
                            </td>

                            <td>
                                ${
                                    transaction.discountPercent ??
                                    0
                                }%
                            </td>

                            <td>
                                ${
                                    Number(
                                        transaction.discount ||
                                        0
                                    )
                                }
                            </td>

                            <td>
                                ${
                                    Number(
                                        item.subtotal ||
                                        0
                                    )
                                }
                            </td>

                        </tr>

                    `;

                }
            );

        }
    );


    rows += `
        </table>
    `;


    const summary = `

        <table border="1">

            <tr>

                <th colspan="2">
                    REKAP PENJUALAN KASIRKU
                </th>

            </tr>


            <tr>

                <td>
                    Tanggal
                </td>

                <td>
                    ${data.selectedDate}
                </td>

            </tr>


            <tr>

                <td>
                    Total Transaksi
                </td>

                <td>
                    ${data.dailyTransactions.length}
                </td>

            </tr>


            <tr>

                <td>
                    Item Terjual
                </td>

                <td>
                    ${data.totalItems}
                </td>

            </tr>


            <tr>

                <td>
                    Total Diskon
                </td>

                <td>
                    ${data.totalDiscount}
                </td>

            </tr>


            <tr>

                <td>
                    Total Omzet
                </td>

                <td>
                    ${data.totalRevenue}
                </td>

            </tr>


            <tr>

                <td>
                    Omzet Cash
                </td>

                <td>
                    ${data.cashRevenue}
                </td>

            </tr>


            <tr>

                <td>
                    Omzet QRIS
                </td>

                <td>
                    ${data.qrisRevenue}
                </td>

            </tr>

        </table>

        <br>

    `;


    const html =
        `

            <!DOCTYPE html>

            <html>

            <head>

                <meta
                    charset="UTF-8"
                >

            </head>

            <body>

                ${
                    summary
                }

                ${
                    rows
                }

            </body>

            </html>

        `;


    const blob =
        new Blob(
            [
                "\ufeff" +
                html
            ],
            {
                type:
                    "application/vnd.ms-excel"
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
        "Rekap-Penjualan-" +
        data.selectedDate +
        ".xls";


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    URL.revokeObjectURL(
        url
    );

}


/* =====================================================
   CETAK REKAP
===================================================== */

function printDailyReport() {

    const data =
        getDailyData();


    let text = "";


    text +=
        "====================================\n";

    text +=
        "          REKAP PENJUALAN\n";

    text +=
        "====================================\n";


    text +=
        `Tanggal         : ${
            data.selectedDate
        }\n`;


    text +=
        `Total Transaksi : ${
            data.dailyTransactions.length
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
        data.productSummary
    ).forEach(
        ([name, item]) => {

            text +=
                `${name} : ${
                    item.qty
                } = ${
                    formatRupiah(
                        item.total
                    )
                }\n`;

        }
    );


    text +=
        "====================================";


    const printWindow =
        window.open(
            "",
            "_blank",
            "width=500,height=700"
        );


    if (!printWindow) {

        alert(
            "Popup browser diblokir."
        );

        return;

    }


    printWindow.document.write(`
        <!DOCTYPE html>

        <html>

        <head>

            <title>
                Rekap Penjualan
            </title>

        </head>

        <body>

            <pre
                style="
                    font-family: monospace;
                    font-size: 14px;
                    white-space: pre-wrap;
                "
            >${escapeHtml(
                text
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


/* =====================================================
   TAB
===================================================== */

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


/* =====================================================
   SEMUA EVENT
===================================================== */

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

}


/* =====================================================
   RENDER SEMUA
===================================================== */

function renderAll() {

    renderDashboard();

    renderProducts();

    renderProductTable();

    renderCart();

    renderTransactions();

    renderDailyReport();

}


/* =====================================================
   START
===================================================== */

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


/* =====================================================
   GLOBAL FUNCTIONS
===================================================== */

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
