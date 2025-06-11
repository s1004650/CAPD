const express = require('express');
const sql = require('mssql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: 'localhost',
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

router.post('/login', async (req, res) => {
  const { lineUserId, password } = req.body;
  try {
    await sql.connect(dbConfig);

    const result = await sql.query`
      SELECT * FROM "user" WHERE line_user_id = ${lineUserId} AND deleted_at IS NULL
    `;

    const user = result.recordset[0];
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    if (password !== user.password) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    const token = jwt.sign(
      {
        line_user_id: user.line_user_id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ 
      success: true,
      token,
      user: {
        id: user.id,
        lineUserId: user.line_user_id,
        lineDisplayName: user.line_display_name,
        fullName: user.full_name,
        caseNumber: user.case_number,
        gender: user.gender,
        birthdate: user.birthdate?.toISOString?.() ?? null,
        role: user.role,
        dialysisStartDate: user.dialysisStartDate?.toISOString?.() ?? null,
        createdAt: user.created_at?.toISOString?.() ?? null,
        updatedAt: user.updated_at?.toISOString?.() ?? null,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
