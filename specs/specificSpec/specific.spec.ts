import {expect} from 'chai'
import * as path from 'path'
import {Driver} from '../../lib'

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

describe(`Base suite`, function() {
  let driver = null

  beforeEach(async () => {
    console.log('IN BEFORE')
    driver = await Driver.getInstance({appiumServer: localAppium, deviceCapabilities: opts})
  })

  afterEach(async () => {
    await Driver.quit()
  })

  it(`Specific it 1`, async function() {
    const textToInput = 'This is text.'
    // const elem = await driver.element('id', 'io.selendroid.testapp:id/my_text_field')
    // await elem.sendKeys(textToInput)
    // const text = await elem.text()
    // expect(text).to.eq(textToInput, `"${text}" value should be equal ${textToInput}`)
    await driver.element('accessibility id', 'buttonStartWebviewCD').click()
    // await (async () => new Promise((res) => setTimeout(res, 3000)))()
    // await driver.element('id', 'io.selendroid.testapp:id/spinner_webdriver_test_data').click()
    // await (async () => new Promise((res) => setTimeout(res, 3000)))()
    // await driver.element('xpath', `//*[@text = 'iframes']`).click()
    // await (async () => new Promise((res) => setTimeout(res, 3000)))()
    // await driver.element('xpath', `//*[@text = 'Foo']`).click()
    // await (async () => new Promise((res) => setTimeout(res, 3000)))()
  })

  it(`Specific it 2`, async function() {
    // driver = await Driver.getInstance({appiumServer: localAppium, deviceCapabilities: opts})
    // console.log('DATA FRoM TEST')
    console.log('RUNNING SECIND')
    // console.log('FAILED_IT:$$Specific it 2$$')
    await driver.element('accessibility id', 'buttonStartWebviewCD').click()
    // flaky
    if (Math.round(Math.random())) {
      throw new Error('FAILED_IT:$$Specific it 2$$')
    }
  })
})
