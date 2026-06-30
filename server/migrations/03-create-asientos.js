module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Asientos', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      numero: { type: Sequelize.INTEGER, allowNull: false },
      disponible: { type: Sequelize.BOOLEAN, defaultValue: true },
      viajeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Viajes', key: 'id' },
        onDelete: 'CASCADE',
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Asientos');
  },
};