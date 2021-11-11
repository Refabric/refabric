import { TextGenerator } from './text-generator';

describe('Generator', () => {
  test('should generate correctly', () => {
    const generator = new TextGenerator([
      'Example\n\nHello  ->\n\nWorld\nPeople',
      'Color\n\nRed\nGreen\nBlue',
      'Favorite Color\n\nMy favorite color is {grammar:Color}',
    ]);
    for (let i = 0; i < 100; i++) {
      expect(generator.think('Example')).toMatch(/^Hello (World|People)$/);
    }
    for (let i = 0; i < 100; i++) {
      expect(generator.think('Color')).toMatch(/^(Red|Green|Blue)$/);
    }
    for (let i = 0; i < 100; i++) {
      expect(generator.think('Favorite Color')).toMatch(
        /^My favorite color is (Red|Green|Blue)$/,
      );
    }
  });
});
