import { LoaderBase } from '../loader-base/loader-base';

export class LoaderInline<LoadedItem, ListedItem> extends LoaderBase<
  LoadedItem,
  ListedItem
> {
  public async listContent(list: ListedItem[]): Promise<ListedItem[]> {
    return list;
  }

  public async loadContent(list: ListedItem[]): Promise<LoadedItem[]> {
    if (this.init) {
      return list.map(this.init.bind(this));
    }
    return list as unknown as LoadedItem[];
  }
}
