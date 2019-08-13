import {expect} from 'chai'
import * as wd from 'wd'
import * as path from 'path'
import {arraysAreEqual} from 'tslint/lib/utils'

const localAppium = {
  host: 'localhost',
  port: 4723
}

const opts = {
  platformName: 'Android',
  platformVersion: '8.1',
  // platformVersion: '8.0',
  deviceName: 'Samsung Galaxy S9',
  // deviceName: 'Nexus_5X_26_emul',
  app: path.resolve(__dirname, '../../apps/functional-app.apk'),
  automationName: 'UiAutomator2',
}

describe(`Base suite`, function () {
  let driver = null

  it(`First it`, async function () {
    const textToInput = 'This is text.'
    driver = wd.promiseChainRemote(localAppium)
    await driver.init(opts)
    // const elem = await driver.element('id', 'io.selendroid.testapp:id/my_text_field')
    // await elem.sendKeys(textToInput)
    // const text = await elem.text()
    // expect(text).to.eq(textToInput, `"${text}" value should be equal ${textToInput}`)

    await driver.element('accessibility id', 'buttonStartWebviewCD').click()
    console.log('DONE1')
    await (async () => new Promise((res) => setTimeout(res, 3000)))()
    console.log('DONE2')
    await driver.element('id', 'io.selendroid.testapp:id/spinner_webdriver_test_data').click()
    console.log('DONE3')
    await (async () => new Promise((res) => setTimeout(res, 3000)))()
    console.log('DONE4')
    await driver.element('xpath', `//*[@text = 'iframes']`).click()
    console.log('DONE5')
    await (async () => new Promise((res) => setTimeout(res, 3000)))()
    console.log('DONE6')
    await driver.element('xpath', `//*[@text = 'Foo']`).click()
    console.log('DONE7')
    await (async () => new Promise((res) => setTimeout(res, 3000)))()
    console.log('DONE8')
  })

  after(async function () {
    await driver.quit()
  })
})
