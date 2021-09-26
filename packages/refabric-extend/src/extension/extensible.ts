import { compose } from 'async';
import { EventEmitter } from 'events';

import { RecordUnknown } from '../util-types';

export abstract class Extensible extends EventEmitter {
  private _extensions: ExtensionFunction[];

  constructor(opts: { captureRejections?: boolean | undefined } = {}) {
    super(opts);
    this._extensions = [];
  }

  extend(func: ExtensionFunction): void {
    this._extensions.push(func);
  }

  processExtensions(context: RecordUnknown): Promise<RecordUnknown> {
    if (this._extensions.length === 0) return Promise.resolve({});
    return new Promise((resolve, reject) => {
      const run = compose(
        ...this._extensions.map((func) => async () => func(context)),
      );
      run(null, (err: Error) => {
        if (err) {
          reject(
            new Error('Extension function throw an error. ' + err.message),
          );
          return;
        }
        resolve(context);
      });
    });
  }
}

export type ExtensionFunction = (
  options: RecordUnknown,
) => unknown | Promise<unknown>;
