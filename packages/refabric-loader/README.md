# Refabric Loader

Flexible library load data.

# Get Started

Install `loader`.

```sh
npm install @refabric/loader
```

Load JSON from HTTP.

```javascript
import { LoaderHTTP } from '@refabric/loader';

const loader = new LoaderHTTP();
loader
  .listContent('https://jsonplaceholder.typicode.com/posts')
  .then((list) => loader.loadContent(list))
  .then((posts) => {
    // use posts here
  });
```

Load JS/TS files.

```javascript
import { LoaderFS } from '@refabric/loader';

const loader = new LoaderFS({ root: __dirname, cwd: __dirname });
loader
  .listContent('**.config.ts')
  .then((list) => loader.loadContent(list))
  .then((configs) => {
    // use configs here
  });
```
