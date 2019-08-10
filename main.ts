import * as Mocha from 'mocha';
import * as fs from 'fs';
import * as path from 'path';

const mocha = new Mocha({
  timeout: 30000
});

const testDir = path.resolve(__dirname, './specs/base_specs');
fs.readdirSync(testDir)
    .filter((file) => path.basename(file).match(/.*\.spec\..*/))
    .forEach((file) => mocha.addFile(path.join(testDir, file)));

mocha.run((failures) => process.exitCode = failures ? 1 : 0);
