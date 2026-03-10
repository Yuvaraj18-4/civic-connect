const sequelize = require('./database');
const User = require('./models/User');

async function listUsers() {
    try {
        await sequelize.authenticate();
        const users = await User.findAll();
        console.log('Users:', JSON.stringify(users, null, 2));
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

listUsers();
