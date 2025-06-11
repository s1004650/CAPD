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

router.get('/alert-record', async (req, res) => {
  const { userId, isResolved } = req.query;
  try {
    await sql.connect(dbConfig);

    let query = 'SELECT alert_record.*, u.full_name FROM alert_record LEFT JOIN "user" u ON alert_record.user_id = u.id WHERE alert_record.deleted_at IS NULL';
    if (userId) {
      query += ` AND alert_record.user_id = '${userId}'`;
    }
    if (isResolved !== undefined && !isResolved) {
      query += ' AND alert_record.is_resolved = 0';
    }
    query += ' ORDER BY alert_record.created_at DESC';

    const result = await sql.query(query);
    res.json({ success: true, data: result.recordset });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/alert-record', async (req, res) => {
  const {
    userId,
    recordId,
    type,
    content,
  } = req.body;

  try {
    await sql.connect(dbConfig);

    await sql.query`
      INSERT INTO alert_record (
        user_id,
        record_id,
        type,
        content
      )
      VALUES (
        ${userId},
        ${recordId},
        ${type},
        ${content}
      )
    `;

    res.json({ success: true, message: '紀錄已新增' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
