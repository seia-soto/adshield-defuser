import test from 'ava';
import fs from 'fs/promises';
import path from 'path';
import * as asKit from '../../src/loaders/baseshower.js';

test('decode', async t => {
	const sample = (await fs.readFile(path.resolve(process.cwd(), 'test/loaders/baseshower.sample.bin'), 'utf-8')).toString();
	const out = asKit.decode(sample);

	t.log(out);
	t.pass();
});
