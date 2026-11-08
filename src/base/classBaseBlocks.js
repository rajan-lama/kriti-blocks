export default class KritiBlocksBaseBlocks {
  constructor(
    OptionName,
    OptionType,
    OptionSource,
    OptionSelector,
    OptionAttribute,
    OptionExtra,
  ) {
    this.OptionName = OptionName;
    this.OptionType = OptionType;
    this.OptionSource = OptionSource;
    this.OptionSelector = OptionSelector;
    this.OptionAttribute = OptionAttribute;
    this.OptionExtra = OptionExtra;
  }

  getOptionName() {
    return this.OptionName;
  }

  getOptionType() {
    return this.OptionType;
  }

  getOptionSource() {
    return this.OptionSource;
  }

  getOptionSelector() {
    return this.OptionSelector;
  }

  getOptionAttribute() {
    return this.OptionAttribute;
  }

  getOptionExtra() {
    return this.OptionExtra;
  }

  setOptionName(OptionName) {
    this.OptionName = OptionName;
  }

  setOptionType(OptionType) {
    this.OptionType = OptionType;
  }

  setOptionSource(OptionSource) {
    this.OptionSource = OptionSource;
  }

  setOptionSelector(OptionSelector) {
    this.OptionSelector = OptionSelector;
  }

  setOptionAttribute(OptionAttribute) {
    this.OptionAttribute = OptionAttribute;
  }

  setOptionExtra(OptionExtra) {
    this.OptionExtra = OptionExtra;
  }
}
