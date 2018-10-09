import { Builder } from '../../../Builder';
import JSRuleFinder from '../JSRuleFinder';

describe('JSRuleFinder', () => {
  it('should create js rule if it does not exist', () => {
    // tslint:disable-next-line
    const builder: Builder = {} as Builder;
    builder.config = {
      module: { rules: [] }
    };
    const rule = new JSRuleFinder(builder).findAndCreateJSRule();
    expect(rule).toHaveProperty('test');
  });

  it('should find js rule if it exists', () => {
    // tslint:disable-next-line
    const builder: Builder = {} as Builder;
    const regex = /\.js$/;
    builder.config = {
      module: { rules: [{ test: /abc/ }, { test: regex }, { test: /def/ }] }
    };
    const rule = new JSRuleFinder(builder).findAndCreateJSRule();
    expect(rule).toHaveProperty('test');
    expect(rule.test).toEqual(regex);
  });
});
