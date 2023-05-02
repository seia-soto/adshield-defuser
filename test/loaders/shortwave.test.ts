import test from 'ava';
import fs from 'fs/promises';
import path from 'path';
import * as shortwave from '../../src/loaders/shortwave.js';

test('decode', async t => {
	const bin = (await fs.readFile(path.resolve(process.cwd(), 'test/loaders/shortwave.sample.bin'), 'utf-8')).toString();
	const script = (await fs.readFile(path.resolve(process.cwd(), 'test/loaders/shortwave.sample.script'), 'utf-8')).toString();
	const out = shortwave.decode(bin, script);

	t.log(JSON.stringify(out)); // Reduce output
	t.pass();
});
