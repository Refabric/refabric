/* eslint-disable unicorn/no-abusive-eslint-disable */
// eslint-disable-next-line unicorn/no-static-only-class
export class Grammar {
  // FIXME break down this method into smaller methods
  static parse(rawData: string): {
    name: string;
    grammar: {
      [x: string]: string[];
    };
  } {
    const lines = rawData.split('\n').filter((line) => !line.startsWith('//'));

    const blocks = [];

    let currentBlock = [];

    const name = lines.shift()?.trim();
    if (!name?.length) {
      throw new Error(
        `Invalid name in grammar file.` + '\n' + rawData.slice(0, 100),
      );
    }
    if (lines[0].trim() === '') {
      lines.shift();
    }

    for (const [i, line] of lines.entries()) {
      let blockLine = line.trim();
      if (blockLine.length) {
        blockLine = blockLine.endsWith(' ->')
          ? blockLine.replace(/ ->$/, '')
          : blockLine + '\n';
        if (/\$([^$]*)$/.test(blockLine)) {
          if (blockLine.endsWith('\n')) {
            blockLine = blockLine.trim();
            blockLine = blockLine
              .replace(/\$([^$]*)$/, `\n#${name}_${blocks.length + 1}$1#`)
              .replace(/\n$/, '')
              .replace(/ #$/, '#');
          } else {
            blockLine = blockLine
              .replace(/\$([^$]*)$/, `#${name}_${blocks.length + 1}$1#`)
              .replace(/\n$/, '')
              .replace(/ #$/, '#');
          }
        } else {
          blockLine = blockLine + `#${name}_${blocks.length + 1}#`;
        }
        if (blockLine.startsWith('--empty--')) {
          blockLine = '';
        }
        if (blockLine.includes('--end--')) {
          blockLine = blockLine.replace(/#.+?#.*?$/, '').replace('--end--', '');
        }
        if (/--skip:.--/.test(blockLine)) {
          const num = blockLine
            .match(/--skip:.+?--/)![0]
            .match(/\d/g)!
            .join('');
          blockLine = blockLine
            .replace(/#.+?#/, '')
            .replace(/--skip:.+?--/, `#${name}_${num}#`)
            .trim();
        }
        const matchInserts = blockLine.match(/{grammar:.+?}/g);
        for (const match of matchInserts ?? []) {
          const otherGrammarName = match
            .match(/:.+?}/)?.[0]
            .replace(':', '')
            .replace('}', '')
            .trim();
          blockLine =
            otherGrammarName === name
              ? blockLine.replace(match, `INVALID_GRAMMAR_LINK`)
              : blockLine.replace(match, `#${otherGrammarName}#`);
        }
        currentBlock.push(blockLine);
      }

      if (i === lines.length - 1 || line.trim() === '') {
        blocks.push({ [name + '_' + blocks.length]: [...currentBlock] });
        currentBlock = [];
        continue;
      }
    }

    blocks.unshift({ [name!]: [`#${name + '_0'}#`] });

    blocks[blocks.length - 1][name + '_' + String(blocks.length - 2)] = blocks[
      blocks.length - 1
    ][name + '_' + String(blocks.length - 2)].map((line) =>
      line.replace(/#.+?#.*?$/, ''),
    );

    // eslint-disable-next-line
    const grammar = blocks.reduce(
      (acc, cur) => Object.assign({}, acc, cur),
      {},
    );
    return { name, grammar };
  }
}
