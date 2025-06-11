const express = require('express');
const cors = require('cors');
require('dotenv').config();

const loginRoute = require('./login');
const patientRoute = require('./patient');
const dialysisRecordRoute = require('./dialysisRecord');
const vitalsignRecordRoute = require('./vitalsignRecord');
const exitsiteCareRecordRoute = require('./exitsiteCareRecord');
const messageRoute = require('./message');
const alertRecordRoute = require('./alertRecord');
const dialysisSetting = require('./dialysisSetting')

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', loginRoute);
app.use('/api', patientRoute);
app.use('/api', dialysisRecordRoute)
app.use('/api', vitalsignRecordRoute)
app.use('/api', exitsiteCareRecordRoute)
app.use('/api', messageRoute)
app.use('/api', alertRecordRoute)
app.use('/api', dialysisSetting)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});