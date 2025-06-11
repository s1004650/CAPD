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

router.get('/vitalsign-record', async (req, res) => {
  const { userId } = req.query;
  try {
    await sql.connect(dbConfig);

    let query = 'SELECT * FROM vitalsign_record WHERE deleted_at IS NULL';
    if (userId) {
      query += ` AND user_id = '${userId}'`;
    }
    query += ' ORDER BY record_date DESC';
    
    const result = await sql.query(query);
    res.json({ success: true, data: result.recordset });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/vitalsign-record', async (req, res) => {
  const {
    userId,
    recordDate,
    systolicBP,
    diastolicBP,
    temperature,
    needBloodGlucose,
    bloodGlucose,
    note,
  } = req.body;

  try {
    await sql.connect(dbConfig);

    const result = await sql.query`
      INSERT INTO vitalsign_record (
        user_id,
        record_date,
        systolic_bp,
        diastolic_bp,
        temperature,
        need_blood_glucose,
        blood_glucose,
        note
      )
      OUTPUT INSERTED.*
      VALUES (
        ${userId},
        ${recordDate},
        ${systolicBP},
        ${diastolicBP},
        ${temperature},
        ${needBloodGlucose},
        ${bloodGlucose},
        ${note}
      )
    `;

    res.json({ success: true, message: '紀錄已新增', data: result.recordsets[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/vitalsign-record/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await sql.connect(dbConfig);

    const result = await sql.query`
      UPDATE vitalsign_record
      SET deleted_at = GETDATE()
      WHERE id = ${id} AND deleted_at IS NULL
    `;

    res.json({ success: true, message: '紀錄已刪除' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
