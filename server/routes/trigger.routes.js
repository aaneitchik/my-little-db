const express = require('express');

const triggerCtrl = require('../controllers/trigger.controller');

const triggerRouter = express.Router();

triggerRouter.route('/')
	.get((req, res) => {
		const {name, value} = req.query;
		return triggerCtrl.toggleTrigger(res, name, value);
	});

triggerRouter.route('/all')
	.get((req, res) => {
		return triggerCtrl.getTriggers(res);
	});

module.exports = triggerRouter;

