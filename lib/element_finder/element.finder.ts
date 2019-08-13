interface IElement {
  click(): Promise<void>;
  sendKeys(value: string): Promise<void>;
  get(): Promise<object>;
}

interface IElementFinder {
  byId(id: string): IElement
  byText(name: string): IElement
  byClass(classValue: string): IElement
  byAccessibilityId(accessibilityId: string): IElement
}

interface IPlatformElementFinder extends IElementFinder {
  driver: any
}

class ElementFinder implements IElementFinder {
  private platformElementFinder: IPlatformElementFinder

  constructor(platformElementFinder: IPlatformElementFinder) {
    this.platformElementFinder = platformElementFinder;
  }

  public byAccessibilityId(id: string): IElement {
    return this.platformElementFinder.byAccessibilityId(id)
  }

  public byText(value: string): IElement {
    return this.platformElementFinder.byText(value)
  }

  public byId(id: string): IElement {
    return this.platformElementFinder.byId(id)
  }

  public byClass(classValue: string): IElement {
    return this.platformElementFinder.byClass(classValue)
  }
}

export {ElementFinder, IPlatformElementFinder, IElementFinder, IElement}
