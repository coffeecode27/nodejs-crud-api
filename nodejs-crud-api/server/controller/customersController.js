import models from "../models/init-models";

const createCustomer = async (req, res) => {
    try {
      const { firstname, lastname, user_id } = req.body;
      // Cek apakah pengguna dengan user_id yang diberikan ada dalam tabel users
      const existingUser = await models.users.findByPk(user_id);
      if (!existingUser) {
        return res.status(404).send({ message: "User not found" });
      }
      // Buat pelanggan baru dengan kaitannya ke pengguna yang sesuai
      const customer = await req.context.models.customers.create({
        firstname,
        lastname,
        user_id,
      });
      return res.status(200).send({ message: "Customer created successfully", customer });
    } catch (error) {
      return res.status(500).send({ message: "Failed to create customer", error });
    }
  };
  

  const getCustomerAccount = async (req, res) => {
    try {
      const userId = req.userId;
      const customer = await models.customers.findOne({
        where: { user_id: userId },
     include: [
         { model: models.users, attributes: ['username', 'user_password'], as: 'user' }
       ]
      });
      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }
      const { firstname, lastname } = customer;
      const { username, user_password } = customer.user;
      return res.status(200).json({
        firstname,
        lastname,
        username,
        password: user_password, // Perhatikan penggunaan password dalam respons, pertimbangkan keamanan yang diperlukan
      });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to retrieve customer account', error });
    }
  };

const { customers, users, orders, order_details, products } = models;
const getCustomerOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const customer = await customers.findOne({
      where: { user_id: userId },
      include: [
        {
          model: users,
          attributes: ['username', 'user_password'],
          as: 'user',
        },
        {
          model: orders,
          attributes: ['order_id', 'total_product', 'total_price'],
          as: 'orders',
          include: [
            {
              model: order_details,
              attributes: ['order_detail_id', 'product_id', 'quantity'],
              as: 'order_details',
              include: [
                {
                  model: products,
                  attributes: ['product_id', 'name'],
                  as: 'product',
                },
              ],
            },
          ],
        },
      ],
    });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get customer orders', error: error.message });
  }
};
  export default {
    createCustomer,
    getCustomerAccount,
    getCustomerOrders
  }