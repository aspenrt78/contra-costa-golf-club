// server/routes/teams.js
const express = require('express');
const router = express.Router();
const pool = require('../db');            // your pg Pool
const { authenticateJWT, authorizeAdmin } = require('../middleware/auth'); 

// GET /api/teams — list all teams
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM teams ORDER BY name');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to fetch teams' });
  }
});

// POST /api/teams — create a new team (admin only)
router.post('/', authenticateJWT, authorizeAdmin, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Team name is required' });
  try {
    const { rows } = await pool.query(
      'INSERT INTO teams(name) VALUES($1) RETURNING *',
      [name]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to create team' });
  }
});

module.exports = router;
