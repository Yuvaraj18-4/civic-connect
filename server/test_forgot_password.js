const axios = require('axios');

async function testForgotPassword() {
    try {
        const response = await axios.post('http://localhost:3001/api/auth/forgot-password', {
            email: 'lcartoon510@gmail.com'
        });
        console.log('Response:', response.data);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

testForgotPassword();
