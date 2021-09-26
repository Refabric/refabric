import { LoaderInline } from './loader-inline';

describe('Loader Inline', () => {
  test('should list content', () => {
    const loader = new LoaderInline();
    const itemsToLoad = [{ msg: 'test1' }, { msg: 'test2' }];
    return expect(loader.listContent(itemsToLoad)).resolves.toStrictEqual([
      { msg: 'test1' },
      { msg: 'test2' },
    ]);
  });

  test('should load list content', async () => {
    const loader = new LoaderInline();
    const itemsToLoad = [{ msg: 'test1' }, { msg: 'test2' }];
    const list = await loader.listContent(itemsToLoad);
    return expect(loader.loadContent(list)).resolves.toStrictEqual([
      { msg: 'test1' },
      { msg: 'test2' },
    ]);
  });

  test('should load list content and initialize them', async () => {
    const loader = new LoaderInline({}, (item: Record<string, unknown>) => ({
      ...item,
      ok: true,
    }));
    const itemsToLoad = [{ msg: 'test1' }, { msg: 'test2' }];
    const list = await loader.listContent(itemsToLoad);
    return expect(loader.loadContent(list)).resolves.toStrictEqual([
      { msg: 'test1', ok: true },
      { msg: 'test2', ok: true },
    ]);
  });
});
