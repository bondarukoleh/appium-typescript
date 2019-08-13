import {IElement, IPlatformElementFinder} from './element.finder'

class AndroidElementFinder implements IPlatformElementFinder {
  public driver: any
  private platform = 'Android'
  private text = 'text'
  private id = 'resource-id'
  private classFinder = 'className'
  private accessibilityId = 'content-desc'

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
