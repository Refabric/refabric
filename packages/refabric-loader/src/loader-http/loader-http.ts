import got, { OptionsOfJSONResponseBody } from 'got';

import { LoaderBase } from '../loader-base/loader-base';
import { Json, JsonArray } from '../util-types';
import { Initializer } from '../interfaces';

export class LoaderHTTP<LoadedItem> extends LoaderBase<LoadedItem, JsonArray> {
  init: Initializer<JsonArray, LoadedItem>;
  customRequest?: (
    url: string,
    requestOptions?: OptionsOfJSONResponseBody | undefined,
  ) => Promise<JsonArray>;

  constructor(
    init?: LoaderHTTP<LoadedItem>['init'],
    customRequest?: (
      url: string,
      requestOptions?: OptionsOfJSONResponseBody,
    ) => Promise<JsonArray>,
  ) {
    super({});
    this.customRequest = customRequest;
    this.init =
      init ??
      (((content: unknown) => content) as Initializer<JsonArray, LoadedItem>);
  }

  public listContent(
    url: string,
    requestOptions?: OptionsOfJSONResponseBody,
  ): Promise<JsonArray> {
    return new Promise((resolve, reject) => {
      if (!url) {
        reject(new Error('URL not provided for LoaderHTTP'));
        return;
      }

      if (this.customRequest) {
        this.customRequest(url, requestOptions)
          .then((content) => {
            if (!Array.isArray(content)) {
              throw new TypeError('Request url did not return an array');
            }
            resolve(content as JsonArray);
          })
          .catch((err) => reject(err));
      } else {
        got(url, { ...requestOptions, responseType: 'json' })
          .then((content) => {
            if (!Array.isArray(content.body)) {
              throw new TypeError('Request url did not return an array');
            }
            resolve(content.body as JsonArray);
          })
          .catch((err) => reject(err));
      }
    });
  }

  public async loadContent(jsonContent: JsonArray): Promise<LoadedItem[]> {
    return jsonContent.map((json) => this.init(json as Json[]));
  }
}
