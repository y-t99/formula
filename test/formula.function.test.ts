import { evaluate } from "../src/formula";

describe("Formula Function test", () => {

  test("test Contains", () => {
    const output = evaluate(`Contains("itou ng","ng")`);
    expect(output).toEqual(true);
  });

  test("test Find", () => {
    const output = evaluate(`Find("itou ng","ng")`);
    expect(output).toEqual(6);
  });

  test("test Join", () => {
    const output = evaluate(`Join(["A","B"],",")`);
    expect(output).toEqual("A,B");
  });

  test("test Left", () => {
    const output = evaluate(`Left("ABCD",2)`);
    expect(output).toEqual("AB");
  });

  test("test Length", () => {
    const output = evaluate(`Length("itou ng")`);
    expect(output).toEqual(7);
  });

  test("test Lowercase", () => {
    const output = evaluate(`Lowercase("ABc")`);
    expect(output).toEqual("abc");
  });

  test("test Replace", () => {
    const output = evaluate(`Replace("ABc","c","C")`);
    expect(output).toEqual("ABC");
  });

  test("test Right", () => {
    const output = evaluate(`Right("ABCD",2)`);
    expect(output).toEqual("CD");
  });

  test("test Substring", () => {
    const output = evaluate(`Substring("abc",1,2)`);
    expect(output).toEqual("ab");
  });

  test("test Uppercase", () => {
    const output = evaluate(`Uppercase("ABc")`);
    expect(output).toEqual("ABC");
  });

});
