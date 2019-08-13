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

  public static async getInstance({appiumServer, deviceCapabilities}: IDriverInitialization = null): Promise<any> {
    if (Driver.driver === null) {
      Driver.driver = wd.promiseChainRemote(appiumServer)
      await Driver.driver.init(deviceCapabilities)
      return Driver.driver
    } else if (arguments.length) {
      throw Error(`You are trying to initialize singletone once more, with ${arguments}`)
    }
    return Driver.driver
  }
}

export {Driver, IDriverInitialization}
