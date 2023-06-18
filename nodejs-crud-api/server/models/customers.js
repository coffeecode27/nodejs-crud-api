import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class customers extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      customer_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      firstname: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      lastname: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'user_id'
        }
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
      tableName: 'customers',
      schema: 'public',
      timestamps: false,
      indexes: [
        {
          name: "pk_customer_id",
          unique: true,
          fields: [
            { name: "customer_id" },
          ]
        },
      ]
    });
  }
}
