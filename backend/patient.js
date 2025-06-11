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

router.get('/patients', async (req, res) => {
  try {
    await sql.connect(dbConfig);

    const query = `SELECT * FROM "user" WHERE role = 'patient' AND deleted_at IS NULL ORDER BY created_at DESC`;
    
    const result = await sql.query(query);
    res.json({ success: true, data: result.recordset });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/patients/summaries', async (req, res) => {
  try {
    await sql.connect(dbConfig);

    const query = `
      SELECT u.id,
            u. full_name,
            DATEDIFF(YEAR, birthdate, GETDATE()) AS age,
            CASE gender WHEN 'male' THEN '男' WHEN 'female' THEN '女' ELSE '' END gender,
            LEFT(case_Number, 4)+'***'+RIGHT(case_Number, 3) AS case_number,
            format(dialysis_start_date, 'yyyy-MM-dd') AS dialysis_start_date,
            ISNULL(format(ISNULL(d.record_date, v.record_date), 'yyyy-MM-dd'), '無') AS last_record,
            a.alert_records_count,
            CASE
                WHEN a.alert_records_count >= 3 THEN 'danger'
                WHEN a.alert_records_count >= 1 THEN 'warning'
                ELSE 'stable'
            END AS status,
            CONVERT(varchar,v.systolic_bp) + '/' + CONVERT(varchar,v.diastolic_bp) AS last_bp,
            d.weight AS last_weight,
            v.blood_glucose AS last_blood_glucose
      FROM "user" u OUTER APPLY
        (SELECT COUNT(1) AS alert_records_count
        FROM alert_record
        WHERE user_id = u.id) a OUTER APPLY
        (SELECT TOP 1 *
        FROM vitalsign_record
        WHERE user_id = u.id
        ORDER BY record_date DESC) AS v OUTER APPLY
        (SELECT TOP 1 *
        FROM dialysis_record
        WHERE user_id = u.id
        ORDER BY record_date DESC) AS d
      WHERE u.role = 'patient' AND u.deleted_at IS NULL 
      ORDER BY u.created_at DESC`

    const result = await sql.query(query);
    res.json({ success: true, data: result.recordset });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/user', async (req, res) => {
  const {
    fullName,
    caseNumber,
    gender,
    birthdate,
    role,
    dialysisStartDate
  } = req.body;

  try {
    await sql.connect(dbConfig);

    await sql.query`
      INSERT INTO "user" (
        full_name,
        case_number,
        passward,
        gender,
        birthdate,
        role,
        dialysis_start_date
      )
      VALUES (
        ${fullName},
        ${caseNumber},
        ${caseNumber},
        ${gender},
        ${birthdate},
        ${role},
        ${dialysisStartDate}
      )
      SELECT SCOPE_IDENTITY() AS id
    `;

    const userId = userResult.recordset[0].id;
    if (role === 'patient') {
      await sql.query`
        INSERT INTO dialysis_setting (
          user_id,
          exchange_volumne_pertime,
          exchange_times_perday,
          dialysate_glucose,
          note
        )
        VALUES (
          ${userId},
          2000,
          4,
          1.5,
          ''
        )
      `;
    }

    res.json({ success: true, message: '紀錄已新增' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;