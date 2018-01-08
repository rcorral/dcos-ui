/* eslint-disable no-unused-vars */
const React = require("react");
const ReactDOM = require("react-dom");
/* eslint-enable no-unused-vars */
const TestUtils = require("react-addons-test-utils");
const ConfigurationMapValueWithDefault = require("../ConfigurationMapValueWithDefault");

describe("ConfigurationMapValueWithDefault", function() {
  it("renders value if specified", function() {
    var instance = TestUtils.renderIntoDocument(
      <ConfigurationMapValueWithDefault value={"foo"} />
    );

    var contentText = TestUtils.findRenderedDOMComponentWithClass(
      instance,
      "configuration-map-value"
    ).textContent.trim();

    expect(contentText).toEqual("foo");
  });

  it("renders `defaultValue` if empty", function() {
    var instance = TestUtils.renderIntoDocument(
      <ConfigurationMapValueWithDefault value={null} defaultValue="-" />
    );

    var contentText = TestUtils.findRenderedDOMComponentWithClass(
      instance,
      "configuration-map-value"
    ).textContent.trim();

    expect(contentText).toEqual("-");
  });
});
