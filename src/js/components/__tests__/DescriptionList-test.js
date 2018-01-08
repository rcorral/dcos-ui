/* eslint-disable no-unused-vars */
const React = require("react");
/* eslint-enable no-unused-vars */
const ReactDOM = require("react-dom");
const TestUtils = require("react-addons-test-utils");

const HashMapDisplay = require("../HashMapDisplay");

describe("HashMapDisplay", function() {
  beforeEach(function() {
    this.container = global.document.createElement("div");
  });

  afterEach(function() {
    ReactDOM.unmountComponentAtNode(this.container);
  });

  it("returns null if hash is not passed", function() {
    var instance = ReactDOM.render(<HashMapDisplay />, this.container);

    var result = ReactDOM.findDOMNode(instance);
    expect(TestUtils.isDOMComponent(result)).toEqual(false);
  });

  it("returns null if hash is not passed with headline", function() {
    var instance = ReactDOM.render(
      <HashMapDisplay headline="foo" />,
      this.container
    );

    var result = ReactDOM.findDOMNode(instance);
    expect(TestUtils.isDOMComponent(result)).toEqual(false);
  });

  it("returns null if undefined is passed to hash", function() {
    var instance = ReactDOM.render(
      <HashMapDisplay hash={undefined} />,
      this.container
    );

    var result = ReactDOM.findDOMNode(instance);
    expect(TestUtils.isDOMComponent(result)).toEqual(false);
  });

  it("returns null if empty object is passed to hash", function() {
    var instance = ReactDOM.render(
      <HashMapDisplay hash={{}} />,
      this.container
    );

    var result = ReactDOM.findDOMNode(instance);
    expect(TestUtils.isCompositeComponent(result)).toEqual(false);
  });

  it("returns a node of elements if node exists", function() {
    var instance = ReactDOM.render(
      <HashMapDisplay hash={{ foo: "bar" }} />,
      this.container
    );

    var result = ReactDOM.findDOMNode(instance);
    expect(TestUtils.isDOMComponent(result)).toEqual(true);
  });

  it("returns a headline if headline string is given", function() {
    var instance = ReactDOM.render(
      <HashMapDisplay hash={{ foo: "bar" }} headline="baz" />,
      this.container
    );

    var node = ReactDOM.findDOMNode(instance);
    var headline = node.querySelector(".configuration-map-heading");

    expect(headline.textContent).toEqual("baz");
  });
});
