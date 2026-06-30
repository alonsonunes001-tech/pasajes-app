module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Pasajes', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      usuarioId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Usuarios', key: 'id' },
        onDelete: 'CASCADE',
      },
      viajeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Viajes', key: 'id' },
        onDelete: 'CASCADE',
      },
      asientoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: 'Asientos', key: 'id' },
        onDelete: 'CASCADE',
      },
      precio: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Pasajes');
  },
};