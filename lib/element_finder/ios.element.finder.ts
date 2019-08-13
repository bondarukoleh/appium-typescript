import {IPlatformElementFinder, IElement} from './element.finder'

class IosElementFinder implements IPlatformElementFinder {
  public driver: any
  private platform = 'IOS'
  private text = 'value'
  private id = 'name'
  private classFinder = 'className'
  private accessibilityId = 'accessibility-id'

  constructor(driver: any) {
    this.driver = driver
  }

  public byAccessibilityId(id: string, partial = false): IElement {
    return partial
      ? this.driver.element('xpath', `//*[contains(@${this.accessibilityId}), '${id}']`)
      : this.driver.element('accessibility id', id)
  }

  public byText(value: string, partial = false): IElement {
    return partial
      ? this.driver.element('xpath', `//*[contains(@${this.text}), '${value}']`)
      : this.driver.element('xpath', `//*[@${this.text}, '${value}']`)
  }

  public byId(id: string): IElement {
    return this.driver.element('id', id)
  }

  public byClass(classValue: string): IElement {
    return this.driver.element('class name', classValue)
  }
}

export {IosElementFinder}
