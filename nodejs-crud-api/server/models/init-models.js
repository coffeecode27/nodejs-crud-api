import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _customers from  "./customers.js";
import _order_details from  "./order_details.js";
import _orders from  "./orders.js";
import _product_categories from  "./product_categories.js";
import _products from  "./products.js";
import _users from  "./users.js";
import config from "../../config/config.js"
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  config.db_name,
  config.db_username,
  config.db_password,
  {
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const initModels = (sequelize) => {
  const customers = _customers.init(sequelize, DataTypes);
  const order_details = _order_details.init(sequelize, DataTypes);
  const orders = _orders.init(sequelize, DataTypes);
  const product_categories = _product_categories.init(sequelize, DataTypes);
  const products = _products.init(sequelize, DataTypes);
  const users = _users.init(sequelize, DataTypes);

  customers.hasMany(orders, { foreignKey: 'user_id' });
  orders.belongsTo(customers, { foreignKey: 'user_id' });
  order_details.belongsTo(orders, { as: "order", foreignKey: "order_id"});
  orders.hasMany(order_details, { as: "order_details", foreignKey: "order_id"});
  products.belongsTo(product_categories, { as: "product_category", foreignKey: "product_category_id"});
  product_categories.hasMany(products, { as: "products", foreignKey: "product_category_id"});
  order_details.belongsTo(products, { as: "product", foreignKey: "product_id"});
  products.hasMany(order_details, { as: "order_details", foreignKey: "product_id"});
  customers.belongsTo(users, { as: "user", foreignKey: { name: "user_id", type: DataTypes.INTEGER } });
  users.hasMany(customers, { as: "customers", foreignKey: { name: "user_id", type: DataTypes.INTEGER } });
  orders.belongsTo(users, { as: "user", foreignKey: { name: "user_id", type: DataTypes.INTEGER } });
  users.hasMany(orders, { as: "orders", foreignKey: { name: "user_id", type: DataTypes.INTEGER } });


  return {
    customers,
    order_details,
    orders,
    product_categories,
    products,
    users,
  };
}

const models = initModels(sequelize);
export default models;
export { sequelize };
