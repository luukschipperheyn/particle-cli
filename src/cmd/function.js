const ApiClient = require('../lib/ApiClient.js');
const VError = require('verror');
const ensureError = require('../lib/utilities').ensureError;

class FunctionCommand {
	constructor(options) {
		this.options = options;
	}

	listFunctions() {
		const api = new ApiClient();
		api.ensureToken();

		return api.getAllAttributes().then(devices => {
			let lines = [];
			for (let i = 0; i < devices.length; i++) {

				const device = devices[i];
				const available = [];
				if (device.functions) {

					for (let idx = 0; idx < device.functions.length; idx++) {
						const name = device.functions[idx];
						available.push('  int ' + name + '(String args) ');
					}
				}

				let status = device.name + ' (' + device.id + ') has ' + available.length + ' functions ';
				if (available.length === 0) {
					status += ' (or is offline) ';
				}

				lines.push(status);
				lines = lines.concat(available);
			}
			console.log(lines.join('\n'));
		});
	}

	callFunction() {
		const deviceId = this.options.params.device;
		const functionName = this.options.params['function'];
		const funcParam = this.options.params.argument || '';

		const api = new ApiClient();
		api.ensureToken();

		return api.callFunction(deviceId, functionName, funcParam).then(result => {
			if (result && result.return_value) {
				console.log(result.return_value);
			} else {
				throw api.normalizedApiError(result);
			}
		}).catch(err => {
			throw new VError(ensureError(err), 'Function call failed');
		});
	}
}

module.exports = FunctionCommand;
