import models from "../models/init-models";

const getProductsByCategory = async (req, res) => {
    try {
        const categoryId = req.params.category_id;

        // Mencari produk berdasarkan kategori
        const products = await models.products.findAll({
            where: { product_category_id: categoryId },
            include: [
                {
                    model: models.product_categories,
                    as: 'product_category',
                    attributes: ['name'],
                },
            ],
        });

        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found for the specified category' });
        }

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get products by category', error: error.message });
    }
};


const productOrder = async (req, res) => {
    try {
        // Mendapatkan data pemesanan dari body permintaan (request body)
        const { customer_id, product_id, quantity } = req.body;

        // Validasi customer_id
        const customerId = parseInt(customer_id);
        if (!Number.isInteger(customerId) || customerId <= 0) {
            throw new Error('Invalid customer_id');
        }

        // Validasi product_id
        const productId = parseInt(product_id);
        if (!Number.isInteger(productId) || productId <= 0) {
            throw new Error('Invalid product_id');
        }

        // Periksa keberadaan customer
        const customer = await models.customers.findByPk(customerId);
        if (!customer) {
            throw new Error('Customer not found');
        }

        // Periksa keberadaan product
        const product = await models.products.findByPk(productId);
        if (!product) {
            throw new Error('Product not found');
        }

        // Periksa ketersediaan produk
        if (!product || product.quantity < quantity) {
            throw new Error('Product is not available');
        }

        // Hitung total harga
        const priceWithoutCurrency = product.price.replace('Rp', '').replace(',', '');
        const totalPrice = parseFloat(priceWithoutCurrency) * parseInt(quantity);

        // Buat objek order baru
        const order = {
            customer_id: customerId,
            product_id: productId,
            quantity: quantity,
            total_price: totalPrice,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        // Simpan order ke dalam database
        const createdOrder = await models.orders.create(order);

        // Kurangi stok produk yang dipesan
        product.quantity -= quantity;
        await product.save();

        // Berikan respons sukses jika pemesanan berhasil
        res.status(200).json({ message: `Order success!`, detail:order});
    } catch (error) {
        // Tangani kesalahan jika terjadi
        res.status(500).json({ message: 'Failed to place order', error: error.message });
    }
};

export default {
    getProductsByCategory,
    productOrder
};
