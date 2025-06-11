const express = require('express');
const sql = require('mssql');

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

router.get('/message', async (req, res) => {
  const { userId } = req.query;
  try {
    await sql.connect(dbConfig);

    let query = `SELECT * FROM message`;
    if (userId) {
      query += ` WHERE sender_id = '${userId}' OR receiver_id = '${userId}'`;
    }
    query += ' ORDER BY created_at DESC';

    const result = await sql.query(query);
    res.json({ success: true, data: result.recordset });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/message', async (req, res) => {
  const {
    senderId,
    receiverId,
    content
  } = req.body;

  try {
    await sql.connect(dbConfig);

    await sql.query`
      INSERT INTO message (
        sender_id,
        receiver_id,
        content
      )
      VALUES (
        ${senderId},
        ${receiverId},
        ${content}
      )
    `;

    res.json({ success: true, message: '紀錄已新增' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
