import test from 'ava';
import fs from 'fs/promises';
import path from 'path';
import * as basera1n from '../../src/loaders/basera1n.js';

test('decode', async t => {
	const sample = (await fs.readFile(path.resolve(process.cwd(), 'test/loaders/basera1n.sample.bin'), 'utf-8')).toString();
	const out = basera1n.decode(sample);

	t.log(out);

	// Check if the output is JSON compatible
	try {
		JSON.parse(out);

		t.pass();
	} catch (_) {
		t.fail();
	}

	t.pass();
});
