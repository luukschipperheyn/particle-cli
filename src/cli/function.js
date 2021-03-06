export default ({ commandProcessor, root }) => {
	const func = commandProcessor.createCategory(root, 'function', 'Call functions on your device');

	commandProcessor.createCommand(func, 'list', 'Show functions provided by your device(s)', {
		handler: (args) => {
			const FunctionCommand = require('../cmd/function');
			return new FunctionCommand(args).listFunctions();
		}
	});

	commandProcessor.createCommand(func, 'call', 'Call a particular function on a device', {
		params: '<device> <function> [argument]',
		handler: (args) => {
			const FunctionCommand = require('../cmd/function');
			return new FunctionCommand(args).callFunction();
		},
		examples: {
			'$0 $command coffee brew': 'Call the brew function on the coffee device',
			'$0 $command board digitalWrite D7=HIGH': 'Call the digitalWrite function with argument D7=HIGH on the board device'
		}
	});

	return func;
};
