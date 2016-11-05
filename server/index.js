const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const oracledb = require('oracledb');

const dbConfig = require('./config/db.config');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(morgan('dev'));
app.use(cookieParser());

const tableRouter = require('./routes/table.routes');
const triggerRouter = require('./routes/trigger.routes');
const queryRouter = require('./routes/query.routes');

app.use('/api/tables', tableRouter);
app.use('/api/triggers', triggerRouter);
app.use('/api/queries', queryRouter);

const port = 8000;

oracledb.createPool(dbConfig).then( () => {
	app.listen(port, () => {
		console.log(`Express server listening on port ${port}`);
	});
});