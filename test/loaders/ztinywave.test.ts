import test from 'ava';
import fs from 'fs/promises';
import path from 'path';
import * as ztinywave from '../../src/loaders/ztinywave.js';
import keySources from './zintywave.sample.keys.json' assert {type: 'json'};

test('decode', async t => {
	const bin = (await fs.readFile(path.resolve(process.cwd(), 'test/loaders/ztinywave.sample.bin'), 'utf-8')).toString();
	const out = ztinywave.decode(bin, keySources);

	t.log(JSON.stringify(out)); // Reduce output
	t.pass();
});
