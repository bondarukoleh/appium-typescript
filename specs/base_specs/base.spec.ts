import {expect} from 'chai'
import * as wd from 'wd'
import * as path from 'path'

const localAppium = {
  host: 'localhost',
  port: 4723
}

const opts = {
  platformName: 'Android',
  platformVersion: '8.0',
  deviceName: 'Nexus_5X_26_emul',
  app: path.resolve(__dirname, '../../apps/functional-demo-app.apk'),
  automationName: 'UiAutomator2',
}

describe(`Base suite`, function () {
  let driver = null

  it(`Base it 1`, async function () {
    const textToInput = 'This is text.'
    driver = wd.promiseChainRemote(localAppium)
    await driver.init(opts)
    const elem = await driver.element('id', 'io.selendroid.testapp:id/my_text_field')
    await elem.sendKeys(textToInput)
    const text = await elem.text()
    expect(text).to.eq(textToInput, `"${text}" value should be equal ${textToInput}`)
  })

  after(async function () {
    await driver.quit()
  })
})
