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

router.get('/dialysis-record', async (req, res) => {
  const { userId } = req.query;
  try {
    await sql.connect(dbConfig);

    let query = 'SELECT * FROM dialysis_record WHERE deleted_at IS NULL';
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

router.post('/dialysis-record', async (req, res) => {
  const {
    userId,
    recordDate,
    infusedVolume,
    drainedVolume,
    dialysateGlucose,
    weight,
    dialysateAppearance,
    abdominalPain,
    abdominalPainScore,
    otherSymptoms,
    note,
  } = req.body;

  try {
    await sql.connect(dbConfig);

    const result = await sql.query`
      INSERT INTO dialysis_record (
        user_id,
        record_date,
        infused_volume,
        drained_volume,
        dialysate_glucose,
        weight,
        dialysate_appearance,
        abdominal_pain,
        abdominal_pain_score,
        other_symptoms,
        note
      )
      OUTPUT INSERTED.*
      VALUES (
        ${userId},
        ${recordDate},
        ${infusedVolume},
        ${drainedVolume},
        ${dialysateGlucose},
        ${weight},
        ${dialysateAppearance},
        ${abdominalPain},
        ${abdominalPainScore},
        ${otherSymptoms},
        ${note}
      )
    `;

    res.json({ success: true, message: '紀錄已新增', data: result.recordsets[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/dialysis-record/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await sql.connect(dbConfig);

    const result = await sql.query`
      UPDATE dialysis_record
      SET deleted_at = GETDATE()
      WHERE id = ${id} AND deleted_at IS NULL
    `;

    res.json({ success: true, message: '紀錄已刪除' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
