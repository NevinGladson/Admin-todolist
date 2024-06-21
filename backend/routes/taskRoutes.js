const express = require('express');
const router = express.Router();
const pool = require('../db'); 

// Route to get basic user information
router.get('/', async (req, res) => {
    console.log(`fetching usernames`);
    try {
        const query = `
            SELECT id, username, email FROM app_user;
        `;
        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// Route to get detailed user information including tasks
router.get('/:id/details', async (req, res) => {
    const { id } = req.params;
    console.log(`fetching detatils`);
    try { // Query to get postgres data from AWS RDS 
        const userQuery = `
            SELECT username, email FROM app_user WHERE id = $1;
        `;
        const tasksQuery = `
            SELECT t.task, t.date_of_task, t.day, u.urgency, s.status
            FROM task t
            JOIN urgency u ON t.urgency_id = u.id
            JOIN task_status s ON t.status_id = s.id
            WHERE t.user_id = $1;
        `;
        const user = await pool.query(userQuery, [id]);
        console.log('User data:', user.rows);
        const tasks = await pool.query(tasksQuery, [id]);
        console.log('Task data:', tasks.rows);
        if (user.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const details = {
            username: user.rows[0].username,
            email: user.rows[0].email,
            tasks: tasks.rows
        };
        console.log(details);
        res.json(details);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

module.exports = router;
