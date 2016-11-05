const express = require('express');

const tableCtrl = require('../controllers/table.controller');

const tableRouter = express.Router();

tableRouter.route('/')
	.get((req, res) => {
		const tableName = req.query.name;
		return tableName ? tableCtrl.getTableByName(res, tableName) : tableCtrl.getTables(res);
	})
	.put((req, res) => {
		const tableName = req.query.name;
		if (tableName) {
			const {rows} = req.body;
			return tableCtrl.updateTable(res, tableName, rows);
		}
	})
	.delete((req, res) => {
		const {name, rows} = req.query;
		return tableCtrl.deleteRows(res, name, rows);
	});

module.exports = tableRouter;