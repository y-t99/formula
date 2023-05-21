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

describe("Formula Logic test", () => {
  describe("or", () => {
    test("1 || 0", () => {
      const output = evaluate("1 || 0");
      expect(output).toEqual(1);
    });
    test("1 || 1", () => {
      const output = evaluate("1 || 1");
      expect(output).toEqual(1);
    });
    test("0 || 1", () => {
      const output = evaluate("0 || 1");
      expect(output).toEqual(1);
    });
    test("0 || 0", () => {
      const output = evaluate("0 || 0");
      expect(output).toEqual(0);
    });
  });

  describe("and", () => {
    test("1 && 0", () => {
      const output = evaluate("1 && 0");
      expect(output).toEqual(0);
    });
    test("1 && 1", () => {
      const output = evaluate("1 && 1");
      expect(output).toEqual(1);
    });
    test("0 && 1", () => {
      const output = evaluate("0 && 1");
      expect(output).toEqual(0);
    });
    test("0 && 0", () => {
      const output = evaluate("0 && 0");
      expect(output).toEqual(0);
    });
  });

  describe("equal", () => {
    test("0 = 0", () => {
      const output = evaluate("0 = 0");
      expect(output).toEqual(1);
    });

    test("1 = 0", () => {
      const output = evaluate("1 = 0");
      expect(output).toEqual(0);
    });
  });

  describe("no equal", () => {
    test("0 != 0", () => {
      const output = evaluate("0 != 0");
      expect(output).toEqual(0);
    });

    test("1 != 0", () => {
      const output = evaluate("1 != 0");
      expect(output).toEqual(1);
    });
  });

  describe("greater", () => {
    test("1 > 0", () => {
      const output = evaluate("1 > 0");
      expect(output).toEqual(1);
    });

    test("1 > 1", () => {
      const output = evaluate("1 > 1");
      expect(output).toEqual(0);
    });
  });

  describe("greater equal", () => {
    test("1 >= 0", () => {
      const output = evaluate("1 >= 0");
      expect(output).toEqual(1);
    });

    test("1 >= 1", () => {
      const output = evaluate("1 >= 1");
      expect(output).toEqual(1);
    });

    test("1 >= 2", () => {
      const output = evaluate("1 >= 2");
      expect(output).toEqual(0);
    });
  });

  describe("less", () => {
    test("1 < 0", () => {
      const output = evaluate("1 < 0");
      expect(output).toEqual(0);
    });

    test("1 < 2", () => {
      const output = evaluate("1 < 2");
      expect(output).toEqual(1);
    });
  });

  describe("less equal", () => {
    test("1 <= 0", () => {
      const output = evaluate("1 <= 0");
      expect(output).toEqual(0);
    });

    test("1 <= 1", () => {
      const output = evaluate("1 <= 1");
      expect(output).toEqual(1);
    });

    test("1 <= 2", () => {
      const output = evaluate("1 <= 2");
      expect(output).toEqual(1);
    });
  });

  describe("unary operator", () => {
    test("plus minus", () => {
      const output = evaluate("-+-1");
      expect(output).toEqual(1);
    });

    test("not true", () => {
      const output = evaluate("!2");
      expect(output).toEqual(0);
    });

    test("not false", () => {
      const output = evaluate("!0");
      expect(output).toEqual(1);
    });
  });
});
