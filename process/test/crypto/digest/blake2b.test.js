import { test } from 'node:test';
import * as assert from 'node:assert';
import AoLoader from '@permaweb/ao-loader';
import fs from 'fs';

const wasm = fs.readFileSync('./process.wasm');

test('run sha3 hash successfully', async () => {
	const results = [
		'576701fd79a126f2c414ef94adf1117c88943700f312679d018c29c378b2c807a3412b4e8d51e191c48fb5f5f54bf1bca29a714dda166797b3baf9ead862ae1d',
		'7050811afc947ba7190bb3c0a7b79b4fba304a0de61d529c8a35bdcbbb5544f4'
	];

	const handle = await AoLoader(wasm);
	const env = {
		Process: {
			Id: 'AOS',
			Owner: 'FOOBAR',
			Tags: [{ name: 'Name', value: 'Thomas' }],
		},
	};

	
	const data = `
		local crypto = require(".crypto");

		local results = {};

		results[1] =  crypto.digest.blake2b("ao").asHex();
		results[2] =  crypto.digest.blake2b("ao", 32).asHex();

		return table.concat(results, ", ");
	`;
	const msg = {
		Target: 'AOS',
		Owner: 'FOOBAR',
		['Block-Height']: '1000',
		Id: '1234xyxfoo',
		Module: 'WOOPAWOOPA',
		Tags: [{ name: 'Action', value: 'Eval' }],
		Data: data,
	};

	const result = await handle(null, msg, env);
	assert.equal(result.Output?.data.output, results.join(', '));
	assert.ok(true);
});
