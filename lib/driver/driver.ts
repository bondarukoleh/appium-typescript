import * as wd from 'wd'

interface IAppiumServer {
  host: string,
  port: number
}

interface IDeviceCapabilities {
  platformName: string,
  platformVersion: string,
  deviceName: string,
  app: string,
  automationName: string,
}

interface IDriverInitialization {
  appiumServer: IAppiumServer,
  deviceCapabilities: IDeviceCapabilities
}

class Driver {
  private static driver = null

  private constructor() {
  }

  public static async getInstance({appiumServer, deviceCapabilities}: IDriverInitialization = {} as any): Promise<any> {
    if (Driver.driver === null) {
      Driver.driver = wd.promiseChainRemote(appiumServer)
      await Driver.driver.init(deviceCapabilities)
      return Driver.driver
    }
    return Driver.driver
  }

  public static async quit(): Promise<any> {
    if (Driver.driver === null) {
      console.log('NOTING TO QUITE')
      return true
    }
    try {
      await Driver.driver.quit()
      Driver.driver = null
    } catch (e) {
      console.log(`COULDN'T STOP DRIVER`)
      console.log(e)
    }
  }
}

export {Driver, IDriverInitialization}
