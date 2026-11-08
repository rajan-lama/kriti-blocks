import KritiBlocksBase from '../base/classBase';

export default class Settings extends KritiBlocksBase {
  constructor(
    OptionName,
    OptionType,
    OptionSource,
    OptionSelector,
    OptionAttribute,
    OptionExtra,
  ) {
    super(
      OptionName,
      OptionType,
      OptionSource,
      OptionSelector,
      OptionAttribute,
      OptionExtra,
    );
  }

  generateOptions() {
    return {
      name: this.getOptionName(),
      type: this.getOptionType(),
      source: this.getOptionSource(),
      selector: this.getOptionSelector(),
      attribute: this.getOptionAttribute(),
      extra: this.getOptionExtra(),
    };
  }

  generateTextBoxOptions() {
    return {
      name: this.getOptionName() || 'textBox',
      type: 'text',
      source: this.getOptionSource() || 'attribute',
      selector: this.getOptionSelector() || 'input',
      attribute: this.getOptionAttribute() || 'value',
      extra: this.getOptionExtra() || {
        placeholder: 'Enter text...',
        defaultValue: '',
        required: false,
      },
    };
  }
}
