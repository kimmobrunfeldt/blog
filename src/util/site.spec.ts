import assert from "assert";
import { describe, it } from "@jest/globals";
import { overrideTw, splitTwClass } from "./site";

describe("overrideTw", () => {
  it("overrides classes", () => {
    const newCls = overrideTw("a b-1 m-1 c", "b-3 m-2");
    assert.strictEqual(newCls, "a b-1 c b-3 m-2");
  });

  it("classes that are not pre-listed should be concatenated", () => {
    const newCls = overrideTw("font-sans text-gray-1 m-1", "bg-gray-0");
    assert.strictEqual(newCls, "font-sans text-gray-1 bg-gray-0 m-1");
  });
});

describe("splitTwClass", () => {
  it("test case 1", () => {
    const split = splitTwClass("bg-gray-1");
    assert.deepStrictEqual(split, {
      utility: "bg",
      value: "gray-1",
    });
  });

  it("test case 2", () => {
    const split = splitTwClass("bg-1");
    assert.deepStrictEqual(split, {
      utility: "bg",
      value: "1",
    });
  });

  it("test case 3", () => {
    const split = splitTwClass("bg");
    assert.deepStrictEqual(split, {
      utility: "bg",
      value: "",
    });
  });
});
