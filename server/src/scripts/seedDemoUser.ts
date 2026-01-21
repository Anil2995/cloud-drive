import pool from '../config/db';
import bcrypt from 'bcrypt';

const seedDemoUser = async () => {
    const demoEmail = 'demo@clouddrive.com';
    const demoPassword = 'Demo@123';
    const demoName = 'Demo User';

    try {
        console.log('🔍 Checking for existing demo user...');

        // Check if demo user already exists
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [demoEmail]);

        if (existingUser.rows.length > 0) {
            console.log('⚠️  Demo user already exists!');
            console.log('📧 Email:', demoEmail);
            console.log('🔑 Password:', demoPassword);

            // Update the password to ensure it's correct
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(demoPassword, salt);

            await pool.query('UPDATE users SET password = $1, name = $2 WHERE email = $3', [
                hashedPassword,
                demoName,
                demoEmail
            ]);

            console.log('✅ Demo user password updated successfully!');
        } else {
            console.log('➕ Creating new demo user...');

            // Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(demoPassword, salt);

            // Insert demo user
            const newUser = await pool.query(
                'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
                [demoName, demoEmail, hashedPassword]
            );

            console.log('✅ Demo user created successfully!');
            console.log('📧 Email:', demoEmail);
            console.log('🔑 Password:', demoPassword);
            console.log('👤 User ID:', newUser.rows[0].id);
        }

        await pool.end();
        console.log('\n✨ Done! You can now login with the demo credentials.');
    } catch (error) {
        console.error('❌ Error seeding demo user:', error);
        process.exit(1);
    }
};

seedDemoUser();
