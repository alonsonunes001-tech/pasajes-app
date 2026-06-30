module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Viajes', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      origen: { type: Sequelize.STRING, allowNull: false },
      destino: { type: Sequelize.STRING, allowNull: false },
      fecha: { type: Sequelize.DATEONLY, allowNull: false },
      hora: { type: Sequelize.TIME, allowNull: false },
      precio: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      totalAsientos: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 40,
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Viajes');
  },
};