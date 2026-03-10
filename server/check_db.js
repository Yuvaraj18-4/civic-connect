const sequelize = require('./database');
const User = require('./models/User');

async function check() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Sync with alter to ensure columns exist
        await sequelize.sync({ alter: true });
        console.log('Sync completed.');

        const tableInfo = await sequelize.getQueryInterface().describeTable('Users');
        console.log('Columns in Users table:', Object.keys(tableInfo));

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
}

check();
