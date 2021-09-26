import { LoaderFS } from './loader-fs';

describe('Loader FS', () => {
  test("should list this directory's files", () => {
    const loader = new LoaderFS({ root: __dirname, cwd: __dirname });
    return expect(
      loader.listContent().then((list) => {
        expect(
          list.some((filePath) => filePath.match(/loader-fs\.ts$/)),
        ).toEqual(true);
        expect(
          list.some((filePath) => filePath.match(/loader-fs\.test\.ts$/)),
        ).toEqual(true);
      }),
    ).resolves.not.toThrow();
  });

  test('should load files', () => {
    const loader = new LoaderFS(
      { root: __dirname, cwd: __dirname },
      (file) => ({ file }),
    );
    return expect(
      loader.listContent('**.test.ts').then((list) => loader.loadContent(list)),
    ).resolves.not.toThrow();
  });

  test('should load files with custom initializer', () => {
    const loader = new LoaderFS(
      { root: __dirname, cwd: __dirname },
      (file) => ({ file }),
    );
    return expect(
      loader
        .listContent('**.test.ts')
        .then((list) => loader.loadContent(list))
        .then((items) => items[0]),
    ).resolves.toHaveProperty('file');
  });

  test('should throw an error if missing root', () => {
    const loader = new LoaderFS({
      // Necessary for the test.
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      root: null,
    });
    return expect(loader.listContent('**.test.ts')).rejects.toThrowError(
      /root not provided/,
    );
  });

  test('should throw an error if invalid ignore list', () => {
    const loader = new LoaderFS({
      // Necessary for the test.
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ignore: 'potato',
      root: __dirname,
    });
    return expect(loader.listContent('**.test.ts')).rejects.toThrowError(
      /ignore field in options must be an array/,
    );
  });

  test('should load a file', () => {
    const loader = new LoaderFS({
      root: __dirname,
      cwd: __dirname,
    });
    return expect(
      loader.listContent('/**.stub.*').then((list) => loader.loadContent(list)),
    ).resolves.toStrictEqual([{ value: 2020 }, { value: 2021 }]);
  });
});
