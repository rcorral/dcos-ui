/* eslint-disable no-unused-vars */
const React = require("react");
/* eslint-enable no-unused-vars */
const TestUtils = require("react-addons-test-utils");

const ReactUtil = require("../ReactUtil");

describe("ReactUtil", function() {
  it("wraps the elements if there is more than one", function() {
    const result = ReactUtil.wrapElements([
      <span key="1">test</span>,
      <span key="2">test</span>
    ]);

    expect(TestUtils.isElementOfType(result, "div")).toEqual(true);
  });

  it("does not wrap if not necessary", function() {
    const elements = ReactUtil.wrapElements(<span>test</span>);

    expect(TestUtils.isElementOfType(elements, "span")).toEqual(true);
  });

  it("always wraps elements if configured", function() {
    const elements = ReactUtil.wrapElements(<span>test</span>, "div", true);

    expect(TestUtils.isElementOfType(elements, "div")).toEqual(true);
  });

  it("wraps elements with provided wrapper", function() {
    const elements = ReactUtil.wrapElements(<span>test</span>, "p", true);

    expect(TestUtils.isElementOfType(elements, "p")).toEqual(true);
  });

  it("handles undefined elements", function() {
    const elements = ReactUtil.wrapElements(undefined);

    expect(elements).toEqual(null);
  });

  it("does not wrap elements if they are an array with a single item", function() {
    const elements = ReactUtil.wrapElements([<span key={0}>test</span>], "p");

    expect(TestUtils.isElementOfType(elements, "span")).toEqual(true);
  });

  it("wraps elements if they are an array with a single item when alwaysWrap is true", function() {
    const elements = ReactUtil.wrapElements(
      [<span key={0}>test</span>],
      "p",
      true
    );

    expect(TestUtils.isElementOfType(elements, "p")).toEqual(true);
  });
});
