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

test.only('getKeys', async t => {
	const script = (await fs.readFile(path.resolve(process.cwd(), 'test/loaders/ztinywave.sample.script'), 'utf-8')).toString();
	const keys = await ztinywave.getKeys__Node__(script);

	t.log(keys);
	t.true(keys.length > 0);
});
