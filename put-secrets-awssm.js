#!/usr/bin/env node

/**
  * Put secret variables from a file into AWS SM Parameter Store
  */
const fs 		= require('fs');
const lineByLine	= require('n-readlines');
const { SSM }		= require('aws-sdk');
// const { SSM } 		= require('/usr/local/lib/node_modules/aws-sdk');

const defaultRegion 	= 'eu-west-1';
const defaultNameSpace 	= 'default-secrets';
const defaultFile 	= "./.env";

const argv = require('yargs/yargs')(process.argv.slice(2))
	.usage('Usage: $0 <command> [options]')
	.example('$0 put --file ./dotenv/.env --region eu-west-1 --namespace test1')
	.command('put', 'Put secret variables from a file into AWS SM Parameter Store. The AWS IAM credentials should be previously set up on the console.', {
		region: {
			alias: 'r',
			description: 'The AWS region where the variables will be saved. Default is \"eu-west-1\"',
			type: 'string'
		},
		namespace: {
			alias: 'n',
			description: 'The Name Space preceding the variable name. Default is \"default-secrets\"',
			type: 'string'
		}		
	})
	.option('file', {
		alias: 'f',
		description: 'The file name containing the variables. Default is \".env\"',
		type: 'string'
	})
	.option('show', {
		alias: 's',
		description: 'Preview the variables that will be saved',
		type: 'boolean'
	})
	.help()
	.alias('help', 'h')
	.version('1.0')
	.alias('version', 'v')
	.argv;

const uploadParamToAWSSM = function(nameSpace, region, param, value) {
	let paramNameSpace = '/' + nameSpace + '/' + param;

	const params = {
		Name: paramNameSpace /* required */
		,Value: value /* required */
		,Tier: "Standard"
		,Type: "SecureString"
		,Overwrite: true
		// AllowedPattern: 'STRING_VALUE',
		// DataType: 'STRING_VALUE',
		// Description: 'STRING_VALUE',
		// KeyId: 'STRING_VALUE',
		// Policies: 'STRING_VALUE',
		// Tags: [
		// 	{
		// 		Key: 'STRING_VALUE', /* required */
		// 		Value: 'STRING_VALUE' /* required */
		// 	},
		// 	/* more items */
		// ],
	};

	let ssm = new SSM({
		apiVersion: '2014-11-06', 
	    region: region
	});
	ssm.putParameter(params, function(err, data) {
		if (err) {
			console.log(`ERROR param [[${param}]]: ${err}`); //, err.stack);
		}
		else {
			console.log(`Uploaded Param: ${paramNameSpace} * Value: ${value}`);
		}
	});
}

/** Remove first and last [", '] chars from *value*
  *
  */
const sanitize = function(value) {
	if (value.slice(0,1).match(/[\"\']/))
		value = value.slice(1);

	if (value.slice(-1).match(/[\"\']/))
		value = value.slice(0,-1);

	return value;
}

const execCommand = function() {
	const nameSpace = argv.namespace || defaultNameSpace;
	const region = argv.region || defaultRegion;	
	const fileName = argv.file || defaultFile;
	let stats;
	
	try {
		stats = fs.statSync(fileName);
	}
	catch (e) {
		console.log('File "%s" does not exist', fileName);
		return false;
	}

	const liner = new lineByLine(fileName);

	let line;
	let lineNumber = 1,
		equalPosit,
		param;
		value = undefined;

	while (line = liner.next()) {
		line = line.toString().trim();

		// Ignore comments (#) and blank lines
		if (line !== '' && line.slice(0,1) !== '#') {
			equalPosit = line.indexOf('=');
			param = line.slice(0, equalPosit);
			value = line.slice(equalPosit+1);

			if (argv.show) {
				console.log(`Parameter: ${param} \t Value: %s`, sanitize(value));
			} else {
				uploadParamToAWSSM(nameSpace, region, param, sanitize(value));
			}
		}
	}
}

const main = function() {
	if (argv._.includes('put') || argv.show) {
		execCommand();
	}
}

if (require.main === module) {
	main();
}
