const { DataTypes, Sequelize } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Post",
    {
      content: {
        type: DataTypes.STRING,
        allowNull: true
      },
    },
    {
      paranoid: true,
      timestamps: true,
    }
  );
};
