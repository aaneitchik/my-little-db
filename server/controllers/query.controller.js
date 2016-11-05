const oracledb = require('oracledb');
oracledb.stmtCacheSize = 0;

const SimpleOracleDb = require('simple-oracledb');
SimpleOracleDb.extend(oracledb);

module.exports = {
	getGenres,
	runQuery
};

function getGenres(res) {
	oracledb.getPool().getConnection().then(conn => {
		return conn.execute('SELECT ID, NAME FROM GENRES ORDER BY NAME').then(result => {
			const columns = result.metaData.map(column => column.name);
			result = result.rows.reduce((prev, curr) => {
				let option = {};
				columns.forEach((col, index) => {
					option[col] = curr[index];
				});
				for (let i = 0; i < columns.length; i++) {
					option[columns[i]] = curr[i];
				}
				prev.push(option);
				return prev;
			}, []);
			res.status(200).send(result);
			return conn.release();
		});
	}).catch(err => {res.status(500).send(err); console.log(err)});
}

function runQuery(res, index, genreId) {
	let query = 'default';
	index = +index;
	switch (index) {
		case 0:
			query = 'SELECT FILMS.NAME, GENRES.NAME, FILM_GENRES.GENRE_RATING FROM FILMS ' +
			'INNER JOIN (FILM_GENRES INNER JOIN GENRES ' +
			'ON GENRES.ID = FILM_GENRES.GENRE_ID ' +
			'AND GENRES.ID = ' + genreId +' AND FILM_GENRES.GENRE_RATING >= 3) ' +
			'ON FILMS.ID = FILM_GENRES.FILM_ID';
			break;
		case 1:
			query = 'SELECT * from FILMS ' +
			'WHERE YEAR = EXTRACT(YEAR FROM SYSDATE) ' +
			'OR YEAR = EXTRACT(YEAR FROM SYSDATE) - 1';
			break;
		case 2:
			query = '(SELECT DISTINCT FILMS.DIRECTOR_ID, FAMOUS_PERSONS.NAME FROM FILMS ' +
			'INNER JOIN FAMOUS_PERSONS ' +
			'ON FILMS.DIRECTOR_ID = FAMOUS_PERSONS.ID) ' +
			'INTERSECT ' +
			'(SELECT DISTINCT ACTORS_IN_FILM.ACTOR_ID, FAMOUS_PERSONS.NAME FROM ACTORS_IN_FILM ' +
			'INNER JOIN FAMOUS_PERSONS ' +
			'ON ACTORS_IN_FILM.ACTOR_ID = FAMOUS_PERSONS.ID)';
			break;
	}
	oracledb.getPool().getConnection().then(conn => {
		return conn.execute(query).then(result => {
			result.metaData = result.metaData.map(column => column.name);
			res.status(200).send(result);
			return conn.release();
		});
	}).catch(err => {res.status(500).send(err); console.log(err)});
}