import * as Mocha from 'mocha';
import * as fs from 'fs';
import * as path from 'path';

const mocha = new Mocha({
  timeout: 5000
});
const testDir = path.resolve(__dirname, './specs/base_spec');
console.log('test Dire', testDir);

fs.readdirSync(testDir)
    .filter((file) => path.extname(file) === '.js')
    .forEach((file) => mocha.addFile(path.join(testDir, file)));

mocha.run((failures) => process.exitCode = failures ? 1 : 0);
