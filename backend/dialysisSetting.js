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

router.get('/dialysis-setting', async (req, res) => {
  const { userId } = req.query;
  try {
    await sql.connect(dbConfig);

    let query = 'SELECT * FROM dialysis_setting';
    if (userId) {
      query += ` WHERE user_id = '${userId}'`;
    }
    query += ' ORDER BY updated_at DESC';
    
    const result = await sql.query(query);
    res.json({ success: true, data: result.recordset });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put('/dialysis-setting/:id', async (req, res) => {
  const { id } = req.params;
  const {
    exchangeVolumnePertime,
    exchangeTimesPerday,
    dialysateGlucose,
    note,
  } = req.body;

  try {
    await sql.connect(dbConfig);

    const result = await sql.query`
      UPDATE dialysis_setting
      SET 
        exchange_volumne_pertime = ${exchangeVolumnePertime},
        exchange_times_perday = ${exchangeTimesPerday},
        dialysate_glucose = ${dialysateGlucose},
        note = ${note},
        updated_at = GETDATE()
      WHERE id = ${id}
    `;

    res.json({ success: true, message: '紀錄已更新', data: result.recordset[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
