const axios = require('axios');

const API_URL = 'http://localhost:3000/api/auth';

async function testSignup() {
    const timestamp = Date.now();
    const email = `test_${timestamp}@example.com`;

    const user1 = {
        name: 'Test User 1',
        email: email,
        password: 'password123',
        location: 'City 1'
    };

    const user2 = {
        name: 'Test User 2',
        email: email, // Same email
        password: 'password123',
        location: 'City 2'
    };

    const user3 = {
        name: 'Test User 3',
        email: email.toUpperCase(), // Case difference
        password: 'password123',
        location: 'City 3'
    };

    const user4 = {
        name: 'Test User 4',
        email: `other_${timestamp}@example.com`, // Different email
        password: 'password123',
        location: 'City 4'
    };

    try {
        console.log('1. Registering User 1 (New Email):', user1.email);
        const res1 = await axios.post(`${API_URL}/register`, user1);
        console.log('User 1 Registered Successfully');
        if (res1.data.token) {
            console.log('Token received:', res1.data.token.substring(0, 20) + '...');
        } else {
            console.error('Token NOT received!');
        }
    } catch (error) {
        console.error('User 1 Failed:', error.response ? error.response.data : error.message);
    }

    try {
        console.log('2. Registering User 2 (Same Email):', user2.email);
        await axios.post(`${API_URL}/register`, user2);
        console.log('User 2 Registered Successfully (Unexpected)');
    } catch (error) {
        console.log('User 2 Failed (Expected):', error.response ? error.response.data : error.message);
    }

    try {
        console.log('3. Registering User 3 (Case Difference):', user3.email);
        await axios.post(`${API_URL}/register`, user3);
        console.log('User 3 Registered Successfully (Check if this is expected)');
    } catch (error) {
        console.log('User 3 Failed (Likely Case Insensitive):', error.response ? error.response.data : error.message);
    }

    try {
        console.log('4. Registering User 4 (Different Email):', user4.email);
        await axios.post(`${API_URL}/register`, user4);
        console.log('User 4 Registered Successfully');
    } catch (error) {
        console.error('User 4 Failed:', error.response ? error.response.data : error.message);
    }
}

testSignup();
