const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function seedDemoUser() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    const demoEmail = 'demo@clouddrive.com';
    const demoPassword = 'Demo@123';
    const demoName = 'Demo User';

    try {
        console.log('Checking for existing demo user...');

        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [demoEmail]);

        if (existingUser.rows.length > 0) {
            console.log('Demo user already exists. Updating password...');

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(demoPassword, salt);

            await pool.query('UPDATE users SET password = $1, name = $2 WHERE email = $3', [
                hashedPassword,
                demoName,
                demoEmail
            ]);

            console.log('SUCCESS: Demo user password updated!');
        } else {
            console.log('Creating new demo user...');

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(demoPassword, salt);

            const newUser = await pool.query(
                'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
                [demoName, demoEmail, hashedPassword]
            );

            console.log('SUCCESS: Demo user created!');
            console.log('User ID:', newUser.rows[0].id);
        }

        console.log('');
        console.log('Demo Credentials:');
        console.log('Email:', demoEmail);
        console.log('Password:', demoPassword);

        await pool.end();
    } catch (error) {
        console.error('ERROR:', error.message);
        await pool.end();
        process.exit(1);
    }
}

seedDemoUser();
