import * as Mocha from 'mocha';
import * as fs from 'fs';
import * as path from 'path';

const mocha = new Mocha({
  timeout: 5000
});

const testDir = path.resolve(__dirname, './specs/base_specs');
fs.readdirSync(testDir)
    .filter((file) => path.basename(file).includes('spec'))
    .forEach((file) => mocha.addFile(path.join(testDir, file)));

mocha.run((failures) => process.exitCode = failures ? 1 : 0);
