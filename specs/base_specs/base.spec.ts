import {expect} from 'chai';

describe(`Base suite`, function () {
  it(`Base it 1`, async function () {
    console.log('Testing...');
    expect(true).to.eq(true, 'True should be true')
  })
});
