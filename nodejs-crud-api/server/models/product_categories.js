import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class product_categories extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    product_category_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    createdat: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedat: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'product_categories',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_product_category_id",
        unique: true,
        fields: [
          { name: "product_category_id" },
        ]
      },
    ]
  });
  }
}
