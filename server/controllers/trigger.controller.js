const oracledb = require('oracledb');
oracledb.stmtCacheSize = 0;

const SimpleOracleDb = require('simple-oracledb');
SimpleOracleDb.extend(oracledb);

module.exports = {
	getTriggers,
	toggleTrigger
};

function getTriggers(res) {
	oracledb.getPool().getConnection().then(conn => {
		return conn.execute('SELECT trigger_name, status FROM user_triggers').then(result => {
			result.metaData = result.metaData.map(column => column.name);
			res.status(200).send(result);
			return conn.close();
		});
	})
	.catch(err => res.status(500).json({message: err.message}));
}

function toggleTrigger(res, trigger, value)  {
	console.log(trigger);
	const action = value === 'true' ? 'ENABLE' : 'DISABLE';
	const query = `ALTER TRIGGER ${trigger} ${action}`;
	oracledb.getPool().getConnection().then(conn => {
		return conn.execute(query).then(() => {
			res.status(200).send();
			return conn.release();
		});
	}).catch(err => {res.status(500).send(err); console.log(err)});
}