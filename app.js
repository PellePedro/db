const express = require('express');
const db = require('./db');

const app = express(); 
app.use(express.json());

// Create a new user
app.post('/users', async (req, res) => {
    const { username, password, first_name, last_name, email, phone, address } = req.body;
    
    // WARNING: This approach is vulnerable to SQL injection attacks!
    // Using string interpolation directly in SQL queries is a security risk
    const query = `
        INSERT INTO users (username, password, first_name, last_name, email, phone, address)
        VALUES ('${username}', '${password}', '${first_name}', '${last_name}', '${email}', '${phone}', '${address}')
        RETURNING user_id;
    `;
    
    try {
        // No parameters array needed with direct values in the query
        const result = await db.query(query);
        res.status(201).json({ message: 'User created successfully', userId: result.rows[0].user_id });
    } catch (error) {
        // Incase of an error during database operation, return a http status code 500
        res.status(500).json({ error: error.message });
    }
});

// Update an existing user
app.put('/users/:id', async (req, res) => {
    const { id } = req.params; // Get the user ID from the URL path
    const { username, password, first_name, last_name, email, phone, address } = req.body;

    const updateQuery = `
        UPDATE users
        SET username = $1, password = $2, first_name = $3, last_name = $4, email = $5, phone = $6, address = $7
        WHERE user_id = $8
        RETURNING user_id;
    `;

    try {
        const result = await db.query(updateQuery, [username, password, first_name, last_name, email, phone, address, id]);

        // Check if user exists and was updated
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User updated', userId: result.rows[0].user_id });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete an existing user  
app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    if (!Number.isInteger(parseInt(id))) {
        return res.status(400).json({ error: 'Invalid ID format' });
    }
    const deleteUserSQL = 'DELETE FROM users WHERE user_id = $1 RETURNING *';

    try {
        const result = await db.query(deleteUserSQL, [id]);

        // Verify that user has been deleted
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // If deletion was successful
        res.json({ message: 'User deleted', deletedUser: result.rows[0] });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal Server error' });
    }
});

// Get a user information
app.get('/users/:id', async (req, res) => {
    const { id } = req.params;

    // Input Validation: Ensure the ID is an integer 
    if (!Number.isInteger(parseInt(id))) {
        return res.status(400).json({ error: 'Invalid ID format' });
    }
    
    const getUserSQL = 'SELECT * FROM users WHERE user_id = $1';

    try {
        const result = await db.query(getUserSQL, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
