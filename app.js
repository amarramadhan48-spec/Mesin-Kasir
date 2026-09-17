/* =========================================================
   KASIRKU - MESIN KASIR SEDERHANA
   ========================================================= */

const PRODUCTS_KEY = "kasirku_products";
const TRANSACTIONS_KEY = "kasirku_transactions";


/* =========================================================
   DATA PRODUK AWAL
   ========================================================= */

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


/* =========================================================
   DATA APLIKASI
   ========================================================= */

let products = JSON.parse(
    localStorage.getItem(PRODUCTS_KEY)
);

let transactions = JSON.parse(
    localStorage.getItem(TRANSACTIONS_KEY)
);

let cart = [];

let editingProductId = null;


/* =========================================================
   CEK DATA AWAL
   ========================================================= */

if (!Array.isArray(products)) {
    products = [...defaultProducts];
    saveProducts();
}

if (!Array.isArray(transactions)) {
    transactions = [];
    saveTransactions();
}


/* =========================================================
   HELPER
   ========================================================= */

function $(selector) {
    return document.querySelector(selector);
}


function formatRupiah(number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(Number(number) || 0);
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


/* =========================================================
   JAM
   ========================================================= */

function updateClock() {
    const clock = document.getElementById("clock");

    if (clock) {
        clock.textContent = new Date().toLocaleString(
            "id-ID",
            {
                dateStyle: "full",
                timeStyle: "medium"
            }
        );
    }
}

updateClock();
setInterval(updateClock, 1000);


/* =========================================================
   DASHBOARD
   ========================================================= */

function renderStats() {

    const today = new Date()
        .toISOString()
        .split("T")[0];

    const todayTransactions = transactions.filter(
        transaction =>
            transaction.date.startsWith(today)
    );

    const revenue = todayTransactions.reduce(
        (total, transaction) =>
            total + Number(transaction.total),
        0
    );

    const lowStock = products.filter(
        product => Number(product.stock) <= 5
    ).length;


    const statProducts =
        document.getElementById("statProducts");

    const statTransactions =
        document.getElementById("statTransactions");

    const statRevenue =
        document.getElementById("statRevenue");

    const statLowStock =
        document.getElementById("statLowStock");


    if (statProducts) {
        statProducts.textContent = products.length;
    }

    if (statTransactions) {
        statTransactions.textContent =
            todayTransactions.length;
    }

    if (statRevenue) {
        statRevenue.textContent =
            formatRupiah(revenue);
    }

    if (statLowStock) {
        statLowStock.textContent =
            lowStock;
    }
}


/* =========================================================
   TAMPILKAN PRODUK
   ========================================================= */

function renderProducts() {

    const grid =
        document.getElementById("productGrid");

    if (!grid) return;


    const searchInput =
        document.getElementById("searchProduct");

    const search =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const filteredProducts =
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


    if (filteredProducts.length === 0) {

        grid.innerHTML = `
            <div class="empty">
                Produk tidak ditemukan.
            </div>
        `;

        return;
    }


    grid.innerHTML =
        filteredProducts.map(product => `

            <div class="product-card">

                <h3>
                    ${product.name}
                </h3>

                <div class="category">
                    ${product.code}
                    ·
                    ${product.category}
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


/* =========================================================
   TAMBAH KE KERANJANG
   ========================================================= */

function addToCart(productId) {

    const product = products.find(
        product => product.id === productId
    );

    if (!product) return;


    if (product.stock <= 0) {
        alert("Stok produk habis.");
        return;
    }


    const existingItem = cart.find(
        item => item.productId === productId
    );


    if (existingItem) {

        if (
            existingItem.qty >=
            product.stock
        ) {

            alert(
                "Jumlah melebihi stok tersedia."
            );

            return;
        }

        existingItem.qty++;

    } else {

        cart.push({
            productId: productId,
            qty: 1
        });

    }


    renderCart();
}


/* =========================================================
   TAMPILKAN KERANJANG
   ========================================================= */

function renderCart() {

    const cartList =
        document.getElementById("cartList");

    if (!cartList) return;


    if (cart.length === 0) {

        cartList.innerHTML = `
            <div class="empty">
                Keranjang masih kosong.
            </div>
        `;

    } else {

        cartList.innerHTML =
            cart.map(item => {

                const product = products.find(
                    product =>
                        product.id === item.productId
                );

                if (!product) {
                    return "";
                }


                const subtotal =
                    product.price * item.qty;


                return `

                    <div class="cart-item">

                        <div>

                            <h4>
                                ${product.name}
                            </h4>

                            <small>
                                ${formatRupiah(product.price)}
                                ×
                                ${item.qty}
                                =
                                ${formatRupiah(subtotal)}
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
    }


    calculateTotal();
}


/* =========================================================
   UBAH QTY
   ========================================================= */

function changeQty(productId, amount) {

    const item = cart.find(
        item => item.productId === productId
    );

    const product = products.find(
        product => product.id === productId
    );


    if (!item || !product) {
        return;
    }


    item.qty += amount;


    if (item.qty <= 0) {

        removeFromCart(productId);

        return;
    }


    if (item.qty > product.stock) {

        item.qty = product.stock;

        alert(
            "Jumlah melebihi stok tersedia."
        );
    }


    renderCart();
}


/* =========================================================
   HAPUS ITEM DARI KERANJANG
   ========================================================= */

function removeFromCart(productId) {

    cart = cart.filter(
        item => item.productId !== productId
    );

    renderCart();
}


/* =========================================================
   HITUNG TOTAL
   ========================================================= */

function calculateTotal() {

    let subtotal = 0;


    cart.forEach(item => {

        const product = products.find(
            product =>
                product.id === item.productId
        );


        if (product) {

            subtotal +=
                product.price *
                item.qty;

        }

    });


    const discountInput =
        document.getElementById("discount");

    const paymentInput =
        document.getElementById("payment");


    let discount =
        discountInput
            ? Number(discountInput.value) || 0
            : 0;


    if (discount < 0) {
        discount = 0;
    }


    if (discount > subtotal) {
        discount = subtotal;
    }


    const total =
        subtotal - discount;


    const payment =
        paymentInput
            ? Number(paymentInput.value) || 0
            : 0;


    const change =
        Math.max(
            0,
            payment - total
        );


    if (document.getElementById("subtotal")) {
        document.getElementById("subtotal")
            .textContent =
            formatRupiah(subtotal);
    }


    if (document.getElementById("discountLabel")) {
        document.getElementById("discountLabel")
            .textContent =
            formatRupiah(discount);
    }


    if (document.getElementById("grandTotal")) {
        document.getElementById("grandTotal")
            .textContent =
            formatRupiah(total);
    }


    if (document.getElementById("change")) {
        document.getElementById("change")
            .textContent =
            formatRupiah(change);
    }


    return {
        subtotal,
        discount,
        total,
        payment,
        change
    };
}


/* =========================================================
   CHECKOUT
   ========================================================= */

function checkout() {

    if (cart.length === 0) {

        alert(
            "Keranjang masih kosong."
        );

        return;
    }


    const result =
        calculateTotal();


    if (result.payment < result.total) {

        alert(
            "Uang pembayaran masih kurang."
        );

        return;
    }


    // Cek stok
    for (const item of cart) {

        const product =
            products.find(
                product =>
                    product.id === item.productId
            );


        if (!product) {

            alert(
                "Produk tidak ditemukan."
            );

            return;
        }


        if (item.qty > product.stock) {

            alert(
                `Stok ${product.name} tidak cukup.`
            );

            return;
        }
    }


    // Kurangi stok
    cart.forEach(item => {

        const product =
            products.find(
                product =>
                    product.id === item.productId
            );


        product.stock -= item.qty;

    });


    // Buat transaksi
    const transaction = {

        invoice:
            "INV-" +
            Date.now(),

        date:
            new Date().toISOString(),

        items:
            cart.map(item => {

                const product =
                    products.find(
                        product =>
                            product.id === item.productId
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

            }),

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


    if (document.getElementById("discount")) {
        document.getElementById("discount").value = 0;
    }


    if (document.getElementById("payment")) {
        document.getElementById("payment").value = "";
    }


    renderAll();


    showReceipt(transaction);
}


/* =========================================================
   STRUK
   ========================================================= */

function showReceipt(transaction) {

    let receipt = "";

    receipt +=
        "================================\n";

    receipt +=
        "              KASIRKU\n";

    receipt +=
        "================================\n";

    receipt +=
        `Invoice : ${transaction.invoice}\n`;

    receipt +=
        `Tanggal : ${
            new Date(
                transaction.date
            ).toLocaleString("id-ID")
        }\n`;

    receipt +=
        "--------------------------------\n";


    transaction.items.forEach(item => {

        receipt +=
            `${item.name}\n`;

        receipt +=
            `${item.qty} x ${
                formatRupiah(item.price)
            } = ${
                formatRupiah(item.subtotal)
            }\n`;

    });


    receipt +=
        "--------------------------------\n";

    receipt +=
        `Subtotal  : ${
            formatRupiah(
                transaction.subtotal
            )
        }\n`;

    receipt +=
        `Diskon    : ${
            formatRupiah(
                transaction.discount
            )
        }\n`;

    receipt +=
        `TOTAL     : ${
            formatRupiah(
                transaction.total
            )
        }\n`;

    receipt +=
        `Bayar     : ${
            formatRupiah(
                transaction.payment
            )
        }\n`;

    receipt +=
        `Kembalian : ${
            formatRupiah(
                transaction.change
            )
        }\n`;

    receipt +=
        "--------------------------------\n";

    receipt +=
        "          TERIMA KASIH\n";

    receipt +=
        "================================";


    const receiptContent =
        document.getElementById(
            "receiptContent"
        );


    if (receiptContent) {
        receiptContent.textContent =
            receipt;
    }


    const receiptModal =
        document.getElementById(
            "receiptModal"
        );


    if (receiptModal) {
        receiptModal.classList.remove(
            "hidden"
        );
    }


    window.currentReceipt =
        receipt;
}


/* =========================================================
   CETAK STRUK
   ========================================================= */

function printReceipt() {

    const receipt =
        window.currentReceipt || "";


    const printWindow =
        window.open(
            "",
            "_blank",
            "width=400,height=600"
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
            >${receipt}</pre>

            <script>
                window.print();
            <\/script>

        </body>
        </html>
    `);


    printWindow.document.close();
}


/* =========================================================
   TABEL PRODUK
   ========================================================= */

function renderProductTable() {

    const table =
        document.getElementById(
            "productTableBody"
        );

    if (!table) return;


    if (products.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="6">
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
                ${product.code}
            </td>

            <td>
                ${product.name}
            </td>

            <td>
                ${product.category}
            </td>

            <td>
                ${formatRupiah(
                    product.price
                )}
            </td>

            <td
                class="
                    ${product.stock <= 5
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

    `).join("");
}


/* =========================================================
   MODAL TAMBAH / EDIT PRODUK
   ========================================================= */

function openProductModal(product = null) {

    editingProductId =
        product
            ? product.id
            : null;


    const modalTitle =
        document.getElementById(
            "modalTitle"
        );


    if (modalTitle) {

        modalTitle.textContent =
            product
                ? "Edit Produk"
                : "Tambah Produk";

    }


    document.getElementById(
        "productCode"
    ).value =
        product?.code || "";


    document.getElementById(
        "productName"
    ).value =
        product?.name || "";


    document.getElementById(
        "productCategory"
    ).value =
        product?.category || "";


    document.getElementById(
        "productPrice"
    ).value =
        product?.price ?? "";


    document.getElementById(
        "productStock"
    ).value =
        product?.stock ?? "";


    document.getElementById(
        "productModal"
    ).classList.remove(
        "hidden"
    );
}


function closeProductModal() {

    document.getElementById(
        "productModal"
    ).classList.add(
        "hidden"
    );


    document.getElementById(
        "productForm"
    ).reset();


    editingProductId = null;
}


/* =========================================================
   SIMPAN PRODUK
   ========================================================= */

function saveProduct(event) {

    event.preventDefault();


    const code =
        document.getElementById(
            "productCode"
        ).value.trim();


    const name =
        document.getElementById(
            "productName"
        ).value.trim();


    const category =
        document.getElementById(
            "productCategory"
        ).value.trim();


    const price =
        Number(
            document.getElementById(
                "productPrice"
            ).value
        );


    const stock =
        Number(
            document.getElementById(
                "productStock"
            ).value
        );


    if (!code || !name || !category) {

        alert(
            "Semua data produk wajib diisi."
        );

        return;
    }


    if (price < 0 || stock < 0) {

        alert(
            "Harga dan stok tidak boleh negatif."
        );

        return;
    }


    const duplicate =
        products.find(
            product =>
                product.code.toLowerCase() ===
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
                "P" +
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


/* =========================================================
   EDIT PRODUK
   ========================================================= */

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


/* =========================================================
   HAPUS PRODUK
   ========================================================= */

function deleteProduct(id) {

    const product =
        products.find(
            product =>
                product.id === id
        );


    if (!product) return;


    const confirmDelete =
        confirm(
            `Yakin ingin menghapus "${product.name}"?`
        );


    if (!confirmDelete) {
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


/* =========================================================
   RIWAYAT TRANSAKSI
   ========================================================= */

function renderTransactions() {

    const table =
        document.getElementById(
            "transactionTableBody"
        );

    if (!table) return;


    if (transactions.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="6" class="empty">
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
                    ${transaction.invoice}
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


/* =========================================================
   LIHAT TRANSAKSI
   ========================================================= */

function viewTransaction(invoice) {

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


/* =========================================================
   HAPUS SEMUA RIWAYAT TRANSAKSI
   ========================================================= */

function clearTransactions() {

    /*
     * BAGIAN INI YANG MEMPERBAIKI
     * TOMBOL HAPUS RIWAYAT
     */

    if (transactions.length === 0) {

        alert(
            "Riwayat transaksi masih kosong."
        );

        return;
    }


    const confirmation =
        confirm(
            "Yakin ingin menghapus SEMUA riwayat transaksi?"
        );


    if (!confirmation) {
        return;
    }


    // Kosongkan array
    transactions = [];


    // Hapus data dari localStorage
    localStorage.removeItem(
        TRANSACTIONS_KEY
    );


    // Simpan ulang sebagai array kosong
    saveTransactions();


    // Update tampilan
    renderTransactions();

    renderStats();


    alert(
        "Semua riwayat transaksi berhasil dihapus."
    );
}


/* =========================================================
   CLEAR CART
   ========================================================= */

function clearCart() {

    if (cart.length === 0) {

        return;
    }


    const confirmation =
        confirm(
            "Yakin ingin mengosongkan keranjang?"
        );


    if (!confirmation) {
        return;
    }


    cart = [];

    renderCart();
}


/* =========================================================
   TAB
   ========================================================= */

function setupTabs() {

    const tabs =
        document.querySelectorAll(
            ".tab"
        );


    const sections =
        document.querySelectorAll(
            ".tab-content"
        );


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


                sections.forEach(
                    section =>
                        section.classList.remove(
                            "active"
                        )
                );


                this.classList.add(
                    "active"
                );


                const target =
                    document.getElementById(
                        this.dataset.tab
                    );


                if (target) {

                    target.classList.add(
                        "active"
                    );

                }

            }
        );

    });
}


/* =========================================================
   EVENT LISTENER
   ========================================================= */

function setupEvents() {

    const searchProduct =
        document.getElementById(
            "searchProduct"
        );


    if (searchProduct) {

        searchProduct.addEventListener(
            "input",
            renderProducts
        );

    }


    const discount =
        document.getElementById(
            "discount"
        );


    if (discount) {

        discount.addEventListener(
            "input",
            calculateTotal
        );

    }


    const payment =
        document.getElementById(
            "payment"
        );


    if (payment) {

        payment.addEventListener(
            "input",
            calculateTotal
        );

    }


    const checkoutBtn =
        document.getElementById(
            "checkoutBtn"
        );


    if (checkoutBtn) {

        checkoutBtn.addEventListener(
            "click",
            checkout
        );

    }


    const clearCartButton =
        document.getElementById(
            "clearCart"
        );


    if (clearCartButton) {

        clearCartButton.addEventListener(
            "click",
            clearCart
        );

    }


    const addProductButton =
        document.getElementById(
            "addProductBtn"
        );


    if (addProductButton) {

        addProductButton.addEventListener(
            "click",
            function() {

                openProductModal();

            }
        );

    }


    const closeModalButton =
        document.getElementById(
            "closeModal"
        );


    if (closeModalButton) {

        closeModalButton.addEventListener(
            "click",
            closeProductModal
        );

    }


    const cancelModalButton =
        document.getElementById(
            "cancelModal"
        );


    if (cancelModalButton) {

        cancelModalButton.addEventListener(
            "click",
            closeProductModal
        );

    }


    const productForm =
        document.getElementById(
            "productForm"
        );


    if (productForm) {

        productForm.addEventListener(
            "submit",
            saveProduct
        );

    }


    const closeReceiptButton =
        document.getElementById(
            "closeReceipt"
        );


    if (closeReceiptButton) {

        closeReceiptButton.addEventListener(
            "click",
            function() {

                document
                    .getElementById(
                        "receiptModal"
                    )
                    .classList.add(
                        "hidden"
                    );

            }
        );

    }


    const closeReceiptBtn =
        document.getElementById(
            "closeReceiptBtn"
        );


    if (closeReceiptBtn) {

        closeReceiptBtn.addEventListener(
            "click",
            function() {

                document
                    .getElementById(
                        "receiptModal"
                    )
                    .classList.add(
                        "hidden"
                    );

            }
        );

    }


    const printReceiptButton =
        document.getElementById(
            "printReceipt"
        );


    if (printReceiptButton) {

        printReceiptButton.addEventListener(
            "click",
            printReceipt
        );

    }


    /*
     * TOMBOL HAPUS RIWAYAT
     */

    const clearTransactionsButton =
        document.getElementById(
            "clearTransactions"
        );


    if (clearTransactionsButton) {

        clearTransactionsButton.addEventListener(
            "click",
            clearTransactions
        );

    }

}


/* =========================================================
   RENDER SEMUA
   ========================================================= */

function renderAll() {

    renderStats();

    renderProducts();

    renderProductTable();

    renderCart();

    renderTransactions();
}


/* =========================================================
   JALANKAN APLIKASI
   ========================================================= */

setupTabs();

setupEvents();

renderAll();