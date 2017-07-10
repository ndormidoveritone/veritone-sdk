import validate from 'validate.js';
const asyncRetry = require('async/retry');

function RetryHelper(options = {}) {
	const finalOptions = {
		maxRetries: 0,
		retryIntervalMs: 0,
		...options
	};

	const constraints = {
		maxRetries: {
			numericality: { onlyInteger: true, greaterThanOrEqualTo: 0 }
		},
		retryIntervalMs: {
			numericality: { onlyInteger: true, greaterThanOrEqualTo: 0 }
		}
	};

	const errors = validate(finalOptions, constraints);
	if (errors) {
		throw new Error(Object.values(errors)[0]);
	}

	this._maxRetries = finalOptions.maxRetries;
	this._retryIntervalMs = finalOptions.retryIntervalMs;
}

RetryHelper.prototype.retry = function retry(task, callback) {
	if (typeof task !== 'function') {
		throw new Error('task is required!');
	}
	if (typeof callback !== 'function') {
		throw new Error('callback is required!');
	}

	asyncRetry(
		{ times: this._maxRetries, interval: this._retryIntervalMs },
		task,
		callback
	);
};

module.exports = RetryHelper;
