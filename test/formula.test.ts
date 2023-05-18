import { evaluate } from "formula";

describe('Formula Arithmetic test', ()=> {

  test('integer operation', () => {
    const output = evaluate('(1 + 2) * (3 - 4)');
    expect(output).toEqual(-3);
  });

});