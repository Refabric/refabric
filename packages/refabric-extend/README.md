# Refabric Extend

Framework to create extensible classes that behave like middleware holders and event emitters.

# Get Started

Install `extend`.

```sh
npm install @refabric/extend
```

Extend the extensible class.

```javascript
import { Extensible } from '@refabric/extend';
import assert from 'assert';

class Counter extends Extensible {
  async count(context) {
    await this.processExtensions(context);
  }
}

const counter = new Counter();
counter.extend((ctx) => ctx.count++);
counter.extend((ctx) => ctx.count *= 2);

const ctx = {
  count: 1,
};

counter.count(ctx).then(() => {
  assert(ctx.count === 4);
});
```
