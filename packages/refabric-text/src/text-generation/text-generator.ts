import tracery from 'tracery-grammar';

import { Grammar } from './grammar';

type TraceryGrammar = ReturnType<
  typeof import('tracery-grammar').createGrammar
>;

export class TextGenerator {
  private grammar: TraceryGrammar;

  /**
   * Creates a new TextGenerator
   * @param grammarFilesContent The text content of `.grammar` files.
   */
  constructor(grammarFilesContent: string[]) {
    this.grammar = this._buildTraceryGrammarObject(
      grammarFilesContent.map((raw) => {
        const g = Grammar.parse(raw);
        return g.grammar;
      }) as unknown as Record<string, string>[],
    );
  }

  /**
   * Generates a text from a grammar
   * @param grammarName The name of the grammar to use.
   * @param context Object with information used for variable substitution.
   * @returns The generated text.
   */
  think(grammarName: string, context: Record<string, unknown> = {}): string {
    if (!this.grammar) return '';
    const flattened = this.grammar.flatten(`#${grammarName}#`);
    return this._injectVariables(flattened, context).trim();
  }

  private _buildTraceryGrammarObject(
    grammars: Record<string, string>[],
  ): TraceryGrammar {
    const combinedGrammars = grammars.reduce(
      (acc, cur) => Object.assign({}, acc, cur),
      {},
    );
    const grammar = tracery.createGrammar(combinedGrammars);
    grammar.addModifiers(tracery.baseEngModifiers);
    this.grammar = grammar;
    return grammar;
  }

  private _injectVariables(
    text: string,
    context: Record<string, unknown>,
  ): string {
    const matches = text.match(/{.+?}/g);
    if (matches) {
      for (const match of matches) {
        text = text.replace(
          match,
          this._resolveDynamicVariables(match, context),
        );
      }
      return text;
    } else {
      return text;
    }
  }

  private _resolveDynamicVariables(
    str: string,
    context: Record<string, unknown>,
  ): string {
    const options = str
      .replace(/(^{)|(}$)/, '')
      .trim()
      .split(' or ')
      .map((item) => item.trim());

    for (const option of options) {
      if (/(^")|("$)/.test(option)) {
        return option.replace(/(^{)|(}$)/, '').replace(/(^")|("$)/g, '');
      }
      const resolved = this._drillObject(option, context);
      if (resolved) {
        return resolved;
      }
    }

    return '((unknown))';
  }

  private _drillObject(path: string, obj: Record<string, any>): any {
    const parts = path.split('.').filter(Boolean);
    if (!parts.length) return undefined;

    let current = obj;
    for (const part of parts) {
      current = current?.[part];
    }
    return current;
  }
}
