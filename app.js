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
    "kasirku_login_session_v3";


/* =====================================================
   STORAGE
===================================================== */

const PRODUCTS_KEY =
    "kasirku_products_final_v1";

const TRANSACTIONS_KEY =
    "kasirku_transactions_final_v1";


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
   DATA
===================================================== */

let products = loadStorage(
    PRODUCTS_KEY,
    defaultProducts
);

let transactions = loadStorage(
    TRANSACTIONS_KEY,
    []
);

let cart = [];
let editingProductId = null;
let currentReceipt = "";


/* =====================================================
   STORAGE
===================================================== */

function loadStorage(key, fallback) {
    try {
        const saved = localStorage.getItem(key);

        if (saved) {
            const parsed = JSON.parse(saved);

            if (Array.isArray(parsed)) {
                return parsed;
            }
        }
    } catch (error) {
        console.error("Storage error:", error);
    }

    return JSON.parse(JSON.stringify(fallback));
}

function saveProducts() {
    localStorage.setItem(
        PRODUCTS_KEY,
        JSON.stringify(products)
    );
}

function saveTransactions() {
    localStorage.setItem(
        TRANSACTIONS_KEY,
        JSON.stringify(transactions)
    );
}


/* =====================================================
   HELPER
===================================================== */

function get(id) {
    return document.getElementById(id);
}

function formatRupiah(number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(Number(number) || 0);
}

function getToday() {
    const date = new Date();

    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =====================================================
   LOGIN
===================================================== */

function checkLogin() {
    const loggedIn =
        sessionStorage.getItem(
            LOGIN_SESSION_KEY
        );

    if (loggedIn === "true") {
        showApp();
    } else {
        showLogin();
    }
}

function showLogin() {
    get("loginPage").style.display = "flex";
    get("appPage").classList.add("app-hidden");
}

function showApp() {
    get("loginPage").style.display = "none";
    get("appPage").classList.remove("app-hidden");
}

function handleLogin(event) {
    event.preventDefault();

    const username =
        get("username").value.trim();

    const password =
        get("password").value;

    const error =
        get("loginError");

    if (
        username === LOGIN_USERNAME &&
        password === LOGIN_PASSWORD
    ) {
        sessionStorage.setItem(
            LOGIN_SESSION_KEY,
            "true"
        );

        error.textContent = "";

        get("loginForm").reset();

        showApp();

        renderAll();

        return;
    }

    error.textContent =
        "Username atau password salah.";
}

function logout() {
    if (!confirm("Yakin ingin logout?")) {
        return;
    }

    sessionStorage.removeItem(
        LOGIN_SESSION_KEY
    );

    cart = [];

    showLogin();
}

function togglePassword() {
    const password = get("password");
    const button = get("togglePassword");

    if (password.type === "password") {
        password.type = "text";
        button.textContent = "🙈";
    } else {
        password.type = "password";
        button.textContent = "👁";
    }
}


/* =====================================================
   CLOCK
===================================================== */

function updateClock() {
    const clock = get("clock");

    if (!clock) return;

    clock.textContent =
        new Date().toLocaleString(
            "id-ID",
            {
                dateStyle: "full",
                timeStyle: "medium"
            }
        );
}

setInterval(updateClock, 1000);


/* =====================================================
   DASHBOARD
===================================================== */

function renderDashboard() {
    const today = getToday();

    const todayTransactions =
        transactions.filter(
            transaction =>
                String(transaction.date)
                    .startsWith(today)
        );

    const revenue =
        todayTransactions.reduce(
            (sum, transaction) =>
                sum +
                Number(transaction.total || 0),
            0
        );

    const lowStock =
        products.filter(
            product =>
                Number(product.stock || 0) <= 5
        ).length;

    get("statProducts").textContent =
        products.length;

    get("statTransactions").textContent =
        todayTransactions.length;

    get("statRevenue").textContent =
        formatRupiah(revenue);

    get("statLowStock").textContent =
        lowStock;
}


/* =====================================================
   PRODUK DI KASIR
===================================================== */

function renderProducts() {
    const grid = get("productGrid");

    const search =
        get("searchProduct")
            .value
            .trim()
            .toLowerCase();

    const filtered =
        products.filter(product =>
            product.name
                .toLowerCase()
                .includes(search)
            ||
            product.code
                .toLowerCase()
                .includes(search)
            ||
            product.category
                .toLowerCase()
                .includes(search)
        );

    if (!filtered.length) {
        grid.innerHTML = `
            <div class="empty">
                Produk tidak ditemukan.
            </div>
        `;
        return;
    }

    grid.innerHTML =
        filtered.map(product => `
            <div class="product-card">

                <h3>
                    ${escapeHtml(product.name)}
                </h3>

                <div class="category">
                    ${escapeHtml(product.code)}
                    ·
                    ${escapeHtml(product.category)}
                </div>

                <div class="price">
                    ${formatRupiah(product.price)}
                </div>

                <div class="
                    stock
                    ${product.stock <= 5 ? "low" : ""}
                ">
                    Stok: ${product.stock}
                </div>

                <button
                    class="btn btn-primary btn-small"
                    onclick="addToCart('${product.id}')"
                    ${product.stock <= 0 ? "disabled" : ""}
                >
                    ${
                        product.stock <= 0
                            ? "Stok Habis"
                            : "Tambah"
                    }
                </button>

            </div>
        `).join("");
}


/* =====================================================
   CART
===================================================== */

function addToCart(productId) {
    const product =
        products.find(
            product =>
                product.id === productId
        );

    if (!product) return;

    if (product.stock <= 0) {
        alert("Stok produk habis.");
        return;
    }

    const existing =
        cart.find(
            item =>
                item.productId === productId
        );

    if (existing) {

        if (
            existing.qty >=
            Number(product.stock)
        ) {
            alert("Jumlah melebihi stok.");
            return;
        }

        existing.qty += 1;

    } else {

        cart.push({
            productId: productId,
            qty: 1
        });
    }

    renderCart();
    calculateTotal();
}


function renderCart() {
    const list = get("cartList");

    if (!cart.length) {

        list.innerHTML = `
            <div class="empty">
                Keranjang masih kosong.
            </div>
        `;

        calculateTotal();
        return;
    }

    list.innerHTML =
        cart.map(item => {

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
                Number(product.price) *
                Number(item.qty);

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
                                itemTotal
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

        }).join("");

    calculateTotal();
}


function changeQty(productId, amount) {
    const item =
        cart.find(
            item =>
                item.productId === productId
        );

    const product =
        products.find(
            product =>
                product.id === productId
        );

    if (!item || !product) {
        return;
    }

    item.qty += Number(amount);

    if (item.qty <= 0) {
        removeFromCart(productId);
        return;
    }

    if (
        item.qty >
        Number(product.stock)
    ) {
        item.qty =
            Number(product.stock);

        alert(
            "Jumlah melebihi stok tersedia."
        );
    }

    renderCart();
    calculateTotal();
}


function removeFromCart(productId) {
    cart =
        cart.filter(
            item =>
                item.productId !== productId
        );

    renderCart();
    calculateTotal();
}


function clearCart() {
    if (!cart.length) {
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
    calculateTotal();
}


/* =====================================================
   METODE PEMBAYARAN
===================================================== */

function updatePaymentMethod() {

    const method =
        get("paymentMethod").value;

    const cashArea =
        get("cashPaymentArea");

    const qrisArea =
        get("qrisPaymentArea");

    if (method === "CASH") {

        cashArea.classList.remove("hidden");
        qrisArea.classList.add("hidden");

    } else {

        cashArea.classList.add("hidden");
        qrisArea.classList.remove("hidden");
    }

    calculateTotal();
}


/* =====================================================
   HITUNG TOTAL
===================================================== */

function calculateTotal() {

    let subtotal = 0;

    for (const item of cart) {

        const product =
            products.find(
                product =>
                    product.id ===
                    item.productId
            );

        if (product) {

            subtotal +=
                Number(product.price) *
                Number(item.qty);

        }
    }


    let discount =
        Number(
            get("discount").value
        ) || 0;


    if (discount < 0) {
        discount = 0;
    }


    if (discount > subtotal) {
        discount = subtotal;
    }


    const total =
        Math.max(
            0,
            subtotal - discount
        );


    const method =
        get("paymentMethod").value;


    let payment = 0;
    let change = 0;


    if (method === "CASH") {

        payment =
            Number(
                get("payment").value
            ) || 0;

        change =
            Math.max(
                0,
                payment - total
            );

    } else {

        /*
         * QRIS dianggap pembayaran
         * tepat sesuai total.
         */

        payment = total;
        change = 0;
    }


    get("subtotal").textContent =
        formatRupiah(subtotal);

    get("discountLabel").textContent =
        formatRupiah(discount);

    get("grandTotal").textContent =
        formatRupiah(total);

    get("change").textContent =
        formatRupiah(change);

    get("qrisTotal").textContent =
        formatRupiah(total);


    return {
        subtotal: subtotal,
        discount: discount,
        total: total,
        payment: payment,
        change: change,
        method: method
    };
}


/* =====================================================
   CHECKOUT
===================================================== */

function checkout() {

    if (!cart.length) {
        alert("Keranjang masih kosong.");
        return;
    }


    const result =
        calculateTotal();


    /* CASH */

    if (
        result.method === "CASH" &&
        result.payment < result.total
    ) {

        alert(
            "Uang pembayaran masih kurang."
        );

        return;
    }


    /* QRIS */

    if (result.method === "QRIS") {

        const confirmed =
            confirm(
                "Pastikan pembayaran QRIS sudah diterima.\n\n" +
                "Total: " +
                formatRupiah(result.total) +
                "\n\n" +
                "Lanjutkan transaksi?"
            );

        if (!confirmed) {
            return;
        }
    }


    /* VALIDASI STOK */

    for (const item of cart) {

        const product =
            products.find(
                product =>
                    product.id ===
                    item.productId
            );

        if (!product) {
            alert("Produk tidak ditemukan.");
            return;
        }

        if (
            Number(item.qty) >
            Number(product.stock)
        ) {

            alert(
                `Stok ${product.name} tidak mencukupi.`
            );

            return;
        }
    }


    /* KURANGI STOK */

    cart.forEach(item => {

        const product =
            products.find(
                product =>
                    product.id ===
                    item.productId
            );

        product.stock =
            Number(product.stock) -
            Number(item.qty);
    });


    /* BUAT TRANSAKSI */

    const transaction = {

        invoice:
            "INV-" +
            Date.now(),

        date:
            new Date().toISOString(),

        paymentMethod:
            result.method,

        subtotal:
            result.subtotal,

        discount:
            result.discount,

        total:
            result.total,

        payment:
            result.payment,

        change:
            result.change,

        items:
            cart.map(item => {

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
            })
    };


    transactions.unshift(
        transaction
    );


    saveProducts();
    saveTransactions();


    /* RESET CART */

    cart = [];

    get("discount").value = 0;
    get("payment").value = "";

    get("paymentMethod").value = "CASH";

    updatePaymentMethod();

    renderAll();

    showReceipt(transaction);
}


/* =====================================================
   STRUK
===================================================== */

function showReceipt(transaction) {

    const method =
        transaction.paymentMethod ||
        "CASH";

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
            ).toLocaleString("id-ID")
        }\n`;

    text +=
        `Metode  : ${method}\n`;

    text +=
        "--------------------------------\n";


    transaction.items.forEach(
        item => {

            text +=
                `${item.name}\n`;

            text +=
                `${item.qty} x ${
                    formatRupiah(item.price)
                } = ${
                    formatRupiah(item.subtotal)
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
            <title>Struk Kasir</title>
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
   TABEL PRODUK
===================================================== */

function renderProductTable() {

    const table =
        get("productTableBody");


    if (!products.length) {

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
        products.map(product => `

            <tr>

                <td>
                    ${escapeHtml(product.code)}
                </td>

                <td>
                    ${escapeHtml(product.name)}
                </td>

                <td>
                    ${escapeHtml(product.category)}
                </td>

                <td>
                    ${formatRupiah(product.price)}
                </td>

                <td
                    class="${
                        product.stock <= 5
                            ? "low"
                            : ""
                    }"
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

        `).join("");
}


/* =====================================================
   MODAL PRODUK
===================================================== */

function openProductModal(product = null) {

    editingProductId =
        product
            ? product.id
            : null;


    get("modalTitle").textContent =
        product
            ? "Edit Produk"
            : "Tambah Produk";


    get("productCode").value =
        product?.code || "";

    get("productName").value =
        product?.name || "";

    get("productCategory").value =
        product?.category || "";

    get("productPrice").value =
        product?.price ?? "";

    get("productStock").value =
        product?.stock ?? "";


    get("productModal")
        .classList
        .remove("hidden");
}


function closeProductModal() {

    get("productModal")
        .classList
        .add("hidden");

    get("productForm").reset();

    editingProductId = null;
}


/* =====================================================
   SIMPAN PRODUK
===================================================== */

function saveProduct(event) {

    event.preventDefault();


    const code =
        get("productCode")
            .value
            .trim();


    const name =
        get("productName")
            .value
            .trim();


    const category =
        get("productCategory")
            .value
            .trim();


    const price =
        Number(
            get("productPrice")
                .value
        );


    const stock =
        Number(
            get("productStock")
                .value
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
                product.code.toLowerCase() ===
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


    if (editingProductId) {

        const index =
            products.findIndex(
                product =>
                    product.id ===
                    editingProductId
            );


        if (index !== -1) {

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

function editProduct(id) {

    const product =
        products.find(
            product =>
                product.id === id
        );

    if (product) {
        openProductModal(product);
    }
}


/* =====================================================
   HAPUS PRODUK
===================================================== */

function deleteProduct(id) {

    const product =
        products.find(
            product =>
                product.id === id
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
                product.id !== id
        );


    cart =
        cart.filter(
            item =>
                item.productId !== id
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


    if (!transactions.length) {

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
            transaction => {

                const method =
                    transaction.paymentMethod ||
                    "CASH";

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
                            <strong>
                                ${method}
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
                `;
            }
        ).join("");
}


function viewTransaction(invoice) {

    const transaction =
        transactions.find(
            transaction =>
                transaction.invoice ===
                invoice
        );


    if (transaction) {
        showReceipt(transaction);
    }
}


/* =====================================================
   HAPUS RIWAYAT + PASSWORD
===================================================== */

function clearTransactions() {

    if (!transactions.length) {

        alert(
            "Riwayat transaksi masih kosong."
        );

        return;
    }


    const confirmDelete =
        confirm(
            "Yakin ingin menghapus SEMUA riwayat transaksi?"
        );


    if (!confirmDelete) {
        return;
    }


    const password =
        prompt(
            "Masukkan password admin untuk menghapus riwayat:"
        );


    if (password === null) {
        return;
    }


    if (password !== LOGIN_PASSWORD) {

        alert(
            "Password salah. Riwayat tidak dihapus."
        );

        return;
    }


    transactions = [];


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
        get("rekapDate");


    if (!dateInput.value) {
        dateInput.value = getToday();
    }


    const selectedDate =
        dateInput.value;


    const dailyTransactions =
        transactions.filter(
            transaction =>
                String(transaction.date)
                    .startsWith(selectedDate)
        );


    let totalItems = 0;
    let totalDiscount = 0;
    let totalRevenue = 0;
    let cashRevenue = 0;
    let qrisRevenue = 0;


    const productSummary = {};


    dailyTransactions.forEach(
        transaction => {

            totalDiscount +=
                Number(
                    transaction.discount || 0
                );


            totalRevenue +=
                Number(
                    transaction.total || 0
                );


            const method =
                transaction.paymentMethod ||
                "CASH";


            if (method === "CASH") {

                cashRevenue +=
                    Number(
                        transaction.total || 0
                    );

            } else if (method === "QRIS") {

                qrisRevenue +=
                    Number(
                        transaction.total || 0
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
                                item.qty || 0
                            );


                        const itemTotal =
                            Number(
                                item.subtotal || 0
                            );


                        totalItems += qty;


                        if (
                            !productSummary[
                                item.name
                            ]
                        ) {

                            productSummary[
                                item.name
                            ] = {
                                qty: 0,
                                total: 0
                            };

                        }


                        productSummary[
                            item.name
                        ].qty += qty;


                        productSummary[
                            item.name
                        ].total +=
                            itemTotal;
                    }
                );
            }
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


    if (!entries.length) {

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
            [,a],
            [,b]
        ) =>
            b.qty - a.qty
    );


    table.innerHTML =
        entries.map(
            ([name,data]) => `

                <tr>

                    <td>
                        ${escapeHtml(name)}
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
        get("rekapDate").value;


    const dailyTransactions =
        transactions.filter(
            transaction =>
                String(transaction.date)
                    .startsWith(date)
        );


    let totalItems = 0;
    let totalDiscount = 0;
    let totalRevenue = 0;
    let cashRevenue = 0;
    let qrisRevenue = 0;


    const productsReport = {};


    dailyTransactions.forEach(
        transaction => {

            totalDiscount +=
                Number(
                    transaction.discount || 0
                );


            totalRevenue +=
                Number(
                    transaction.total || 0
                );


            const method =
                transaction.paymentMethod ||
                "CASH";


            if (method === "CASH") {

                cashRevenue +=
                    Number(
                        transaction.total || 0
                    );

            } else if (method === "QRIS") {

                qrisRevenue +=
                    Number(
                        transaction.total || 0
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
                                item.qty || 0
                            );


                        totalItems += qty;


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
                        ] += qty;
                    }
                );
            }
        }
    );


    let text = "";


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
        ([name,qty]) => {

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
            <title>Rekap Penjualan</title>
        </head>

        <body>

            <pre
                style="
                    font-family: monospace;
                    font-size: 14px;
                "
            >${escapeHtml(text)}</pre>

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
   TAB
===================================================== */

function setupTabs() {

    const tabs =
        document.querySelectorAll(".tab");


    const contents =
        document.querySelectorAll(".tab-content");


    tabs.forEach(tab => {

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

    });
}


/* =====================================================
   EVENT
===================================================== */

function setupEvents() {

    get("loginForm")
        .addEventListener(
            "submit",
            handleLogin
        );


    get("togglePassword")
        .addEventListener(
            "click",
            togglePassword
        );


    get("logoutBtn")
        .addEventListener(
            "click",
            logout
        );


    get("searchProduct")
        .addEventListener(
            "input",
            renderProducts
        );


    get("paymentMethod")
        .addEventListener(
            "change",
            updatePaymentMethod
        );


    get("discount")
        .addEventListener(
            "input",
            calculateTotal
        );


    get("payment")
        .addEventListener(
            "input",
            calculateTotal
        );


    get("clearCart")
        .addEventListener(
            "click",
            clearCart
        );


    get("checkoutBtn")
        .addEventListener(
            "click",
            checkout
        );


    get("addProductBtn")
        .addEventListener(
            "click",
            () => openProductModal()
        );


    get("closeModal")
        .addEventListener(
            "click",
            closeProductModal
        );


    get("cancelModal")
        .addEventListener(
            "click",
            closeProductModal
        );


    get("productForm")
        .addEventListener(
            "submit",
            saveProduct
        );


    get("clearTransactions")
        .addEventListener(
            "click",
            clearTransactions
        );


    get("closeReceipt")
        .addEventListener(
            "click",
            () =>
                get("receiptModal")
                    .classList
                    .add("hidden")
        );


    get("closeReceiptBtn")
        .addEventListener(
            "click",
            () =>
                get("receiptModal")
                    .classList
                    .add("hidden")
        );


    get("printReceipt")
        .addEventListener(
            "click",
            printReceipt
        );


    get("rekapDate")
        .addEventListener(
            "change",
            renderDailyReport
        );


    get("printRekap")
        .addEventListener(
            "click",
            printDailyReport
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

        get("rekapDate").value =
            getToday();

        get("paymentMethod").value =
            "CASH";

        setupTabs();

        setupEvents();

        updatePaymentMethod();

        checkLogin();

        renderAll();
    }
);


/* =====================================================
   AGAR BISA DIPANGGIL DARI HTML
===================================================== */

window.addToCart =
    addToCart;

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
