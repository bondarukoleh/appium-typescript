import {expect} from 'chai'
import * as path from 'path'
import {Driver} from '../../lib'

const localAppium = {
  host: 'localhost',
  port: 4723
}

const opts = {
  platformName: 'Android',
  // platformVersion: '8.1',
  platformVersion: '8.0',
  // deviceName: 'Samsung Galaxy S9',
  deviceName: 'Nexus_5X_26_emul',
  app: path.resolve(__dirname, '../../apps/functional-app.apk'),
  automationName: 'UiAutomator2',
};


describe(`Base suite`, function () {
  let driver = null;

  it(`First it`, async function () {
    const textToInput = 'This is text.'
    // const elem = await driver.element('id', 'io.selendroid.testapp:id/my_text_field')
    // await elem.sendKeys(textToInput)
    // const text = await elem.text()
    // expect(text).to.eq(textToInput, `"${text}" value should be equal ${textToInput}`)
    driver = await Driver.getInstance({appiumServer: localAppium, deviceCapabilities: opts})
    await driver.element('accessibility id', 'buttonStartWebviewCD').click()
    await (async () => new Promise((res) => setTimeout(res, 3000)))()
    await driver.element('id', 'io.selendroid.testapp:id/spinner_webdriver_test_data').click()
    await (async () => new Promise((res) => setTimeout(res, 3000)))()
    await driver.element('xpath', `//*[@text = 'iframes']`).click()
    await (async () => new Promise((res) => setTimeout(res, 3000)))()
    await driver.element('xpath', `//*[@text = 'Foo']`).click()
    await (async () => new Promise((res) => setTimeout(res, 3000)))()
  })

  after(async function () {
    await driver.quit()
  })
})
