const sequelize = require('./database');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function resetPassword() {
    try {
        await sequelize.authenticate();
        const email = 'lcartoon510@gmail.com';
        const user = await User.findOne({ where: { email } });

        if (!user) {
            console.log('User not found');
            return;
        }

        const hashedPassword = await bcrypt.hash('123456', 10);
        user.password = hashedPassword;
        await user.save();

        console.log(`Password for ${email} has been manually reset to: 123456`);
        console.log('Hashed password:', hashedPassword);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

resetPassword();
