import { glob, IOptions } from 'glob';

import { LoaderBase } from '../loader-base/loader-base';
import { Overwrite } from '../util-types';
import { Initializer } from '../interfaces';

export class LoaderFS<LoadedItem> extends LoaderBase<LoadedItem, string> {
  options: Overwrite<
    IOptions,
    { root: string; ignore?: ReadonlyArray<string> }
  >;
  init: Initializer<string, LoadedItem>;

  constructor(
    options: LoaderFS<LoadedItem>['options'],
    init?: LoaderFS<LoadedItem>['init'],
  ) {
    super(options);
    this.options = options;
    this.init = init ?? this._requireInitializer;
  }

  public listContent(pattern = '**'): Promise<string[]> {
    return new Promise((resolve, reject) => {
      if (!this.options?.root) {
        reject(new Error('Files root not provided for LoaderFS'));
        return;
      }
      if (this.options?.ignore && !Array.isArray(this.options.ignore)) {
        reject(
          new Error('The ignore field in options must be an array of patterns'),
        );
        return;
      }
      const opts = {
        ...this.options,
        ignore: [
          ...(this.options?.ignore ?? []),
          'node_modules/**',
          'coverage/**',
        ].filter(Boolean),
        absolute: true,
      };
      glob(pattern, opts, (err, matches) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(matches);
      });
    });
  }

  public async loadContent(filePaths: string[]): Promise<LoadedItem[]> {
    return filePaths.map(this.init.bind(this));
  }

  private _requireInitializer: Initializer<string, LoadedItem> = (filePath) => {
    const required = module.require(filePath);
    return required?.default ?? required;
  };
}
