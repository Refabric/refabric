import { Grammar } from './grammar';

describe('Grammar', () => {
  test('should parse correctly', () => {
    const grammar = Grammar.parse(`Example\n\nHello\n\nWorld`);

    expect(grammar.name).toEqual('Example');
    expect(grammar.grammar.Example).toBeDefined();
    expect(grammar.grammar.Example_0).toBeDefined();
    expect(grammar.grammar.Example_1).toBeDefined();

    expect(grammar.grammar.Example).toEqual(['#Example_0#']);
    expect(grammar.grammar.Example_0).toEqual(['Hello\n#Example_1#']);
    expect(grammar.grammar.Example_1).toEqual(['World\n']);
  });
});
