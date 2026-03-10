const sequelize = require('./database');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function seedAdmin() {
    try {
        await sequelize.sync();

        const adminEmail = 'admin@civic.com';
        const adminPassword = 'admin123'; // Simple password for demo

        const existingAdmin = await User.findOne({ where: { email: adminEmail } });

        if (existingAdmin) {
            console.log('Admin user already exists.');
            console.log('Email:', adminEmail);
            // We won't print the password as it's hashed, but we can reset it if needed.
            // For now, let's assume if it exists, the user might know it or we can update it.
            // Let's update it to be sure.
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            existingAdmin.password = hashedPassword;
            existingAdmin.role = 'Admin';
            await existingAdmin.save();
            console.log('Admin password reset to:', adminPassword);
        } else {
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            await User.create({
                name: 'City Official',
                email: adminEmail,
                password: hashedPassword,
                role: 'Admin',
                location: 'City Hall'
            });
            console.log('Admin user created successfully.');
            console.log('Email:', adminEmail);
            console.log('Password:', adminPassword);
        }
    } catch (error) {
        console.error('Error seeding admin:', error);
    } finally {
        await sequelize.close();
    }
}

seedAdmin();
