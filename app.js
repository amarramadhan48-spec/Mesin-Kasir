/* =====================================================
   KASIRKU
   LOGIN + KASIR + CASH + QRIS + REKAP
===================================================== */


/* =====================================================
   LOGIN
===================================================== */

const LOGIN_USERNAME = "admin";
const LOGIN_PASSWORD = "12345";

const LOGIN_SESSION_KEY =
    "kasirku_login_session_v2";


/* =====================================================
   STORAGE
===================================================== */

const PRODUCTS_KEY =
    "kasirku_products_payment_v1";

const TRANSACTIONS_KEY =
    "kasirku_transactions_payment_v1";


/* =====================================================
   PRODUK DEFAULT
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
   DATA APLIKASI
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
   STORAGE
===================================================== */

function loadStorage(
    key,
    fallback
) {

    try {

        const saved =
            localStorage.getItem(key);


        if (saved) {

            const parsed =
                JSON.parse(saved);


            if (
                Array.isArray(parsed)
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
   HELPER
===================================================== */

function get(id) {

    return document.getElementById(id);

}


function formatRupiah(
    number
) {

    return new Intl.NumberFormat(
        "id-ID",
        {
            style:
                "currency",

            currency:
                "IDR",

            maximumFractionDigits:
                0
        }
    ).format(
        Number(number) || 0
    );

}


function getToday() {

    const now =
        new Date();


    const year =
        now.getFullYear();


    const month =
        String(
            now.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            now.getDate()
        ).padStart(
            2,
            "0"
        );


    return `${year}-${month}-${day}`;

}


function escapeHtml(
    text
) {

    return String(text)
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


/* =====================================================
   LOGIN
===================================================== */

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


function showLogin() {

    get(
        "loginPage"
    ).style.display =
        "flex";


    get(
        "appPage"
    ).classList.add(
        "app-hidden"
    );

}


function showApp() {

    get(
        "loginPage"
    ).style.display =
        "none";


    get(
        "appPage"
    ).classList.remove(
        "app-hidden"
    );

}


function handleLogin(
    event
) {

    event.preventDefault();


    const username =
        get(
            "username"
        ).value.trim();


    const password =
        get(
            "password"
        ).value;


    const error =
        get(
            "loginError"
        );


    if (
        username ===
        LOGIN_USERNAME
        &&
        password ===
        LOGIN_PASSWORD
    ) {

        sessionStorage.setItem(
            LOGIN_SESSION_KEY,
            "true"
        );


        error.textContent =
            "";


        get(
            "loginForm"
        ).reset();


        showApp();


        renderAll();

    } else {

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


    get(
        "username"
    ).focus();

}


function togglePassword() {

    const password =
        get(
            "password"
        );


    const button =
        get(
            "togglePassword"
        );


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
        get(
            "clock"
        );


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


updateClock();

setInterval(
    updateClock,
    1000
);


/* =====================================================
   DASHBOARD
===================================================== */

function renderDashboard() {

    const today =
        getToday();


    const todayTransactions =
        transactions.filter(
            transaction =>
                transaction.date.startsWith(
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
                    transaction.total
                ),

            0
        );


    const lowStock =
        products.filter(
            product =>
                Number(
                    product.stock
                ) <= 5
        ).length;


    get(
        "statProducts"
    ).textContent =
        products.length;


    get(
        "statTransactions"
    ).textContent =
        todayTransactions.length;


    get(
        "statRevenue"
    ).textContent =
        formatRupiah(
            revenue
        );


    get(
        "statLowStock"
    ).textContent =
        lowStock;

}


/* =====================================================
   PRODUK
===================================================== */

function renderProducts() {

    const grid =
        get(
            "productGrid"
        );


    const search =
        get(
            "searchProduct"
        ).value
            .trim()
            .toLowerCase();


    const filtered =
        products.filter(
            product =>
                product.name
                    .toLowerCase()
                    .includes(
                        search
                    )

                ||

                product.code
                    .toLowerCase()
                    .includes(
                        search
                    )

                ||

                product.category
                    .toLowerCase()
                    .includes(
                        search
                    )
        );


    if (
        filtered.length ===
        0
    ) {

        grid.innerHTML = `
            <div class="empty">
                Produk tidak ditemukan.
            </div>
        `;

        return;
    }


    grid.innerHTML =
        filtered.map(
            product => `

            <div class="product-card">

                <h3>
                    ${escapeHtml(
                        product.name
                    )}
                </h3>


                <div class="category">

                    ${escapeHtml(
                        product.code
                    )}

                    ·

                    ${escapeHtml(
                        product.category
                    )}

                </div>


                <div class="price">

                    ${formatRupiah(
                        product.price
                    )}

                </div>


                <div
                    class="
                        stock
                        ${
                            product.stock <= 5
                                ? "low"
                                : ""
                        }
                    "
                >

                    Stok:
                    ${product.stock}

                </div>


                <button
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
                        product.stock <= 0
                            ? "disabled"
                            : ""
                    }
                >

                    ${
                        product.stock <= 0
                            ? "Stok Habis"
                            : "Tambah"
                    }

                </button>

            </div>

        `
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
            p =>
                p.id ===
                productId
        );


    if (!product) {
        return;
    }


    if (
        product.stock <=
        0
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
            product.stock
        ) {

            alert(
                "Jumlah melebihi stok."
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


function renderCart() {

    const cartList =
        get(
            "cartList"
        );


    if (
        cart.length ===
        0
    ) {

        cartList.innerHTML = `
            <div class="empty">
                Keranjang masih kosong.
            </div>
        `;

    } else {

        cartList.innerHTML =
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


                    const subtotal =
                        product.price *
                        item.qty;


                    return `

                    <div class="cart-item">

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
                                    subtotal
                                )}

                            </small>

                        </div>


                        <div class="qty-controls">

                            <button
                                onclick="
                                    changeQty(
                                        '${product.id}',
                                        -1
                                    )
                                "
                            >
                                -
                            </button>


                            <strong>
                                ${item.qty}
                            </strong>


                            <button
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

    }


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


    item.qty +=
        amount;


    if (
        item.qty <=
        0
    ) {

        removeFromCart(
            productId
        );

        return;

    }


    if (
        item.qty >
        product.stock
    ) {

        item.qty =
            product.stock;

        alert(
            "Stok tidak cukup."
        );

    }


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
        cart.length ===
        0
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


/* =====================================================
   METODE PEMBAYARAN
===================================================== */

function updatePaymentMethod() {

    const method =
        get(
            "paymentMethod"
        ).value;


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

        cashArea.classList.remove(
            "hidden"
        );

        qrisArea.classList.add(
            "hidden"
        );

    } else {

        cashArea.classList.add(
            "hidden"
        );

        qrisArea.classList.remove(
            "hidden"
        );

        updateQrisTotal();

    }


    calculateTotal();

}


/* =====================================================
   HITUNG TOTAL
===================================================== */

function calculateTotal() {

    let subtotal =
        0;


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
                    product.price *
                    item.qty;

            }

        }
    );


    let discount =
        Number(
            get(
                "discount"
            ).value
        ) || 0;


    if (
        discount <
        0
    ) {

        discount =
            0;

    }


    if (
        discount >
        subtotal
    ) {

        discount =
            subtotal;

    }


    const total =
        subtotal -
        discount;


    const method =
        get(
            "paymentMethod"
        ).value;


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
                ).value
            ) || 0;


        change =
            Math.max(
                0,
                payment - total
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

        subtotal,
        discount,
        total,
        payment,
        change,
        method

    };

}


function updateQrisTotal() {

    const result =
        calculateTotal();


    get(
        "qrisTotal"
    ).textContent =
        formatRupiah(
            result.total
        );

}


/* =====================================================
   CHECKOUT
===================================================== */

function checkout() {

    if (
        cart.length ===
        0
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
        "CASH"
    ) {

        if (
            result.payment <
            result.total
        ) {

            alert(
                "Uang pembayaran masih kurang."
            );

            return;
        }

    }


    /* QRIS */

    if (
        result.method ===
        "QRIS"
    ) {

        const confirmation =
            confirm(
                `Pastikan pembayaran QRIS sebesar ${formatRupiah(result.total)} sudah diterima. Lanjutkan transaksi?`
            );


        if (!confirmation) {
            return;
        }

    }


    /* VALIDASI STOK */

    for (
        const item
        of cart
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
            item.qty >
            product.stock
        ) {

            alert(
                `Stok ${product.name} tidak cukup.`
            );

            return;
        }

    }


    /* KURANGI STOK */

    cart.forEach(
        item => {

            const product =
                products.find(
                    p =>
                        p.id ===
                        item.productId
                );


            product.stock -=
                item.qty;

        }
    );


    /* TRANSAKSI */

    const transaction = {

        invoice:
            "INV-" +
            Date.now(),

        date:
            new Date().toISOString(),

        paymentMethod:
            result.method,

        items:
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
                            product.price,

                        qty:
                            item.qty,

                        subtotal:
                            product.price *
                            item.qty

                    };

                }
            ),

        subtotal:
            result.subtotal,

        discount:
            result.discount,

        total:
            result.total,

        payment:
            result.payment,

        change:
            result.change

    };


    transactions.unshift(
        transaction
    );


    saveProducts();

    saveTransactions();


    cart = [];


    get(
        "discount"
    ).value =
        0;


    get(
        "payment"
    ).value =
        "";


    /* KEMBALIKAN CASH */

    get(
        "paymentMethod"
    ).value =
        "CASH";


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

    let text =
        "";


    text +=
        "================================\n";

    text +=
        "              KASIRKU\n";

    text +=
        "================================\n";

    text +=
        `Invoice : ${transaction.invoice}\n`;

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
        `Subtotal  : ${
            formatRupiah(
                transaction.subtotal
            )
        }\n`;


    text +=
        `Diskon    : ${
            formatRupiah(
                transaction.discount
            )
        }\n`;


    text +=
        `TOTAL     : ${
            formatRupiah(
                transaction.total
            )
        }\n`;


    text +=
        `Bayar     : ${
            formatRupiah(
                transaction.payment
            )
        }\n`;


    text +=
        `Kembalian : ${
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
   PRINT STRUK
===================================================== */

function printReceipt() {

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
                    font-size: 14px;
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


/* =====================================================
   TABEL PRODUK
===================================================== */

function renderProductTable() {

    const table =
        get(
            "productTableBody"
        );


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
            product => `

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
                    class="
                        ${
                            product.stock <= 5
                                ? "low"
                                : ""
                        }
                    "
                >
                    ${product.stock}
                </td>

                <td>

                    <button
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

        `
        ).join("");

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
        product?.code || "";


    get(
        "productName"
    ).value =
        product?.name || "";


    get(
        "productCategory"
    ).value =
        product?.category || "";


    get(
        "productPrice"
    ).value =
        product?.price ?? "";


    get(
        "productStock"
    ).value =
        product?.stock ?? "";


    get(
        "productModal"
    ).classList.remove(
        "hidden"
    );

}


function closeProductModal() {

    get(
        "productModal"
    ).classList.add(
        "hidden"
    );


    get(
        "productForm"
    ).reset();


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
        ).value.trim();


    const name =
        get(
            "productName"
        ).value.trim();


    const category =
        get(
            "productCategory"
        ).value.trim();


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
        price < 0 ||
        stock < 0
    ) {

        alert(
            "Harga dan stok tidak boleh negatif."
        );

        return;
    }


    const duplicate =
        products.find(
            product =>
                product.code
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
            index !==
            -1
        ) {

            products[index] = {

                ...products[index],

                code,
                name,
                category,
                price,
                stock

            };

        }

    } else {

        products.push({

            id:
                "P-" +
                Date.now(),

            code,
            name,
            category,
            price,
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
            p =>
                p.id ===
                id
        );


    if (product) {

        openProductModal(
            product
        );

    }

}


/* =====================================================
   HAPUS PRODUK
===================================================== */

function deleteProduct(
    id
) {

    const product =
        products.find(
            p =>
                p.id ===
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
            p =>
                p.id !==
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
   RIWAYAT
===================================================== */

function renderTransactions() {

    const table =
        get(
            "transactionTableBody"
        );


    if (
        transactions.length ===
        0
    ) {

        table.innerHTML = `
            <tr>

                <td
                    colspan="7"
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
            transaction => `

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

                    <strong>
                        ${transaction.paymentMethod}
                    </strong>

                </td>


                <td>
                    ${
                        formatRupiah(
                            transaction.total
                        )
                    }
                </td>


                <td>
                    ${
                        formatRupiah(
                            transaction.payment
                        )
                    }
                </td>


                <td>
                    ${
                        formatRupiah(
                            transaction.change
                        )
                    }
                </td>


                <td>

                    <button
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

        `
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
        transactions.length ===
        0
    ) {

        alert(
            "Riwayat masih kosong."
        );

        return;
    }


    if (
        !confirm(
            "Yakin ingin menghapus SEMUA riwayat transaksi?"
        )
    ) {

        return;
    }


    transactions =
        [];


    localStorage.removeItem(
        TRANSACTIONS_KEY
    );


    saveTransactions();


    renderTransactions();

    renderDashboard();

    renderDailyReport();


    alert(
        "Semua riwayat berhasil dihapus."
    );

}


/* =====================================================
   REKAP HARIAN
===================================================== */

function renderDailyReport() {

    const dateInput =
        get(
            "rekapDate"
        );


    if (
        !dateInput.value
    ) {

        dateInput.value =
            getToday();

    }


    const selectedDate =
        dateInput.value;


    const dailyTransactions =
        transactions.filter(
            transaction =>
                transaction.date.startsWith(
                    selectedDate
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


    const productSummary =
        {};


    dailyTransactions.forEach(
        transaction => {

            totalDiscount +=
                Number(
                    transaction.discount
                ) || 0;


            totalRevenue +=
                Number(
                    transaction.total
                ) || 0;


            if (
                transaction.paymentMethod ===
                "CASH"
            ) {

                cashRevenue +=
                    Number(
                        transaction.total
                    ) || 0;

            }


            if (
                transaction.paymentMethod ===
                "QRIS"
            ) {

                qrisRevenue +=
                    Number(
                        transaction.total
                    ) || 0;

            }


            transaction.items.forEach(
                item => {

                    const qty =
                        Number(
                            item.qty
                        ) || 0;


                    const total =
                        Number(
                            item.subtotal
                        ) || 0;


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
                        total;

                }
            );

        }
    );


    get(
        "rekapTransaksi"
    ).textContent =
        dailyTransactions.length;


    get(
        "rekapItem"
    ).textContent =
        totalItems;


    get(
        "rekapDiskon"
    ).textContent =
        formatRupiah(
            totalDiscount
        );


    get(
        "rekapOmzet"
    ).textContent =
        formatRupiah(
            totalRevenue
        );


    get(
        "rekapCash"
    ).textContent =
        formatRupiah(
            cashRevenue
        );


    get(
        "rekapQris"
    ).textContent =
        formatRupiah(
            qrisRevenue
        );


    const table =
        get(
            "rekapProduk"
        );


    const entries =
        Object.entries(
            productSummary
        );


    if (
        entries.length ===
        0
    ) {

        table.innerHTML = `
            <tr>

                <td
                    colspan="3"
                    class="empty"
                >
                    Tidak ada penjualan pada tanggal ini.
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
            ([name,data]) => `

            <tr>

                <td>
                    ${escapeHtml(
                        name
                    )}
                </td>

                <td>
                    ${data.qty}
                </td>

                <td>
                    ${formatRupiah(
                        data.total
                    )}
                </td>

            </tr>

        `
        ).join("");

}


/* =====================================================
   CETAK REKAP
===================================================== */

function printDailyReport() {

    const date =
        get(
            "rekapDate"
        ).value;


    const dailyTransactions =
        transactions.filter(
            transaction =>
                transaction.date.startsWith(
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


    const productsReport =
        {};


    dailyTransactions.forEach(
        transaction => {

            totalDiscount +=
                Number(
                    transaction.discount
                ) || 0;


            totalRevenue +=
                Number(
                    transaction.total
                ) || 0;


            if (
                transaction.paymentMethod ===
                "CASH"
            ) {

                cashRevenue +=
                    Number(
                        transaction.total
                    ) || 0;

            }


            if (
                transaction.paymentMethod ===
                "QRIS"
            ) {

                qrisRevenue +=
                    Number(
                        transaction.total
                    ) || 0;

            }


            transaction.items.forEach(
                item => {

                    totalItems +=
                        Number(
                            item.qty
                        ) || 0;


                    if (
                        !productsReport[
                            item.name
                        ]
                    ) {

                        productsReport[
                            item.name
                        ] = 0;

                    }


                    productsReport[
                        item.name
                    ] +=
                        Number(
                            item.qty
                        ) || 0;

                }
            );

        }
    );


    let text =
        "";


    text +=
        "====================================\n";

    text +=
        "          REKAP PENJUALAN\n";

    text +=
        "====================================\n";

    text +=
        `Tanggal         : ${date}\n`;

    text +=
        `Total Transaksi : ${dailyTransactions.length}\n`;

    text +=
        `Total Item      : ${totalItems}\n`;

    text +=
        `Total Diskon    : ${formatRupiah(
            totalDiscount
        )}\n`;

    text +=
        `Total Omzet     : ${formatRupiah(
            totalRevenue
        )}\n`;

    text +=
        `Omzet Cash      : ${formatRupiah(
            cashRevenue
        )}\n`;

    text +=
        `Omzet QRIS      : ${formatRupiah(
            qrisRevenue
        )}\n`;

    text +=
        "------------------------------------\n";

    text +=
        "PRODUK TERJUAL\n";

    text +=
        "------------------------------------\n";


    Object.entries(
        productsReport
    ).forEach(
        ([name, qty]) => {

            text +=
                `${name} : ${qty}\n`;

        }
    );


    text +=
        "====================================\n";


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
   EVENT
===================================================== */

function setupEvents() {

    get(
        "loginForm"
    ).addEventListener(
        "submit",
        handleLogin
    );


    get(
        "togglePassword"
    ).addEventListener(
        "click",
        togglePassword
    );


    get(
        "logoutBtn"
    ).addEventListener(
        "click",
        logout
    );


    get(
        "searchProduct"
    ).addEventListener(
        "input",
        renderProducts
    );


    get(
        "paymentMethod"
    ).addEventListener(
        "change",
        updatePaymentMethod
    );


    get(
        "discount"
    ).addEventListener(
        "input",
        calculateTotal
    );


    get(
        "payment"
    ).addEventListener(
        "input",
        calculateTotal
    );


    get(
        "clearCart"
    ).addEventListener(
        "click",
        clearCart
    );


    get(
        "checkoutBtn"
    ).addEventListener(
        "click",
        checkout
    );


    get(
        "addProductBtn"
    ).addEventListener(
        "click",
        () =>
            openProductModal()
    );


    get(
        "closeModal"
    ).addEventListener(
        "click",
        closeProductModal
    );


    get(
        "cancelModal"
    ).addEventListener(
        "click",
        closeProductModal
    );


    get(
        "productForm"
    ).addEventListener(
        "submit",
        saveProduct
    );


    get(
        "clearTransactions"
    ).addEventListener(
        "click",
        clearTransactions
    );


    get(
        "closeReceipt"
    ).addEventListener(
        "click",
        () =>
            get(
                "receiptModal"
            ).classList.add(
                "hidden"
            )
    );


    get(
        "closeReceiptBtn"
    ).addEventListener(
        "click",
        () =>
            get(
                "receiptModal"
            ).classList.add(
                "hidden"
            )
    );


    get(
        "printReceipt"
    ).addEventListener(
        "click",
        printReceipt
    );


    get(
        "rekapDate"
    ).addEventListener(
        "change",
        renderDailyReport
    );


    get(
        "printRekap"
    ).addEventListener(
        "click",
        printDailyReport
    );

}


/* =====================================================
   RENDER
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

        get(
            "rekapDate"
        ).value =
            getToday();


        get(
            "paymentMethod"
        ).value =
            "CASH";


        updatePaymentMethod();


        setupTabs();

        setupEvents();

        checkLogin();

        renderAll();

    }
);
