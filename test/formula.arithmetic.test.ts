import { evaluate } from "../src/formula";

describe("Formula Arithmetic test", () => {
  test("integer operation", () => {
    const output = evaluate("(1 + 2) * (3 - 4)");
    expect(output).toEqual(-3);
  });

  test("float operation", () => {
    const output = evaluate("(1 + 2.5) * (3.5 - 4)");
    expect(output).toEqual(-1.75);
  });

  describe("div", () => {
    test("1/2", () => {
      const output = evaluate("1/2");
      expect(output).toEqual(0.5);
    });
  });

  describe("mod", () => {
    test("4%2", () => {
      const output = evaluate("4%2");
      expect(output).toEqual(0);
    });

    test("1%2", () => {
      const output = evaluate("1%2");
      expect(output).toEqual(1);
    });
  });
});
