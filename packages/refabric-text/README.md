# Refabric Text

Wrapper around tracery-grammar to generate text based on custom grammar files.

# Get Started

Install `text`.

```sh
npm install @refabric/text
```

Example

```javascript
// index.js
import { TextGenerator } from '@refabric/text';

// Grab a list of files here...

const grammars = files.map((file) => {
  if (file.endsWith('.grammar')) {
    return fs.readFileSync(path.resolve(__dirname, file), 'utf-8');
  }
});
const generator = new TextGenerator(grammars.filter(Boolean));
console.log(generator.think('Example'));
```

some-file-name.grammar

```
Example

This is ->

the example.
an example.
some example.
```

