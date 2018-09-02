const express = require('express');
const app = express();
const mongoose = require('mongoose');
const workflowActivities = require('./routes/workflowActivities.js');
const users = require('./routes/user.js');

console.log("Tes path:"+process.env.DB_path);
mongoose.connect(process.env.DB_path, { useNewUrlParser: true } )
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use('/api/WorkflowActivities', workflowActivities);
app.use('/api/Users', users);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));