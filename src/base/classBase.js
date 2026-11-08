import KritiBlocksBaseBlocks from './classBaseBlocks';

export default class KritiBlocksBase extends KritiBlocksBaseBlocks {
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

  render() {
    return (
      <div className="kriti-blocks-component">{this.renderComponents()}</div>
    );
  }

  renderComponents() {
    // Render each Gutenberg component based on OptionType
    if (this.OptionType) {
      return this.OptionExtra.map((component, index) => (
        <div key={index} className={`component-${this.OptionType}`}>
          {component}
        </div>
      ));
    }
    return null;
  }
}
