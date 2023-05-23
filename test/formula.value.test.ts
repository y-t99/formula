import { evaluate } from "../src/formula";


describe("Formula value test", () => {
  it("string type output", () => {
    const output = evaluate("\"string\"");
    expect(output).toEqual("string");
  });

  it("boolean type output", () => {
    const output = evaluate("true");
    expect(output).toEqual(true);
  });

  it("array type output", () => {
    const output = evaluate("[1,2,3,4]");
    expect(output).toEqual([1,2,3,4]);
  });
})