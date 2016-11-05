const express = require('express');

const queryCtrl = require('../controllers/query.controller');

const queryRouter = express.Router();

queryRouter.route('/')
	.get((req, res) => {
		const {index, genreId} = req.query;
		return queryCtrl.runQuery(res, index, genreId);
	});

queryRouter.route('/genres')
	.get((req, res) => {
		return queryCtrl.getGenres(res);
	});

module.exports = queryRouter;