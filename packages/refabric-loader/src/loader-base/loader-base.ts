import { Initializer } from '../interfaces';

export abstract class LoaderBase<LoadedItem, ListedItem> {
  options: unknown;
  init?: Initializer<ListedItem, LoadedItem>;

  constructor(options: unknown = {}, init?: Initializer<ListedItem, LoadedItem>) {
    this.options = options;
    this.init = init;
  }

  public abstract listContent(
    input: unknown,
  ): Promise<ListedItem[] | ListedItem>;
  public abstract loadContent(
    list: ListedItem[],
  ): Promise<LoadedItem[] | ListedItem>;
}
