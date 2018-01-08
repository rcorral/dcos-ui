/* eslint-disable no-unused-vars */
const React = require("react");
/* eslint-enable no-unused-vars */
const ReactDOM = require("react-dom");

const ErrorModal = require("../ErrorModal");

describe("ErrorModal", function() {
  describe("#onClose", function() {
    beforeEach(function() {
      this.callback = jasmine.createSpy();
      this.container = global.document.createElement("div");
      this.instance = ReactDOM.render(
        <ErrorModal onClose={this.callback} />,
        this.container
      );
    });

    afterEach(function() {
      ReactDOM.unmountComponentAtNode(this.container);
    });

    it("doesn't call the callback after initialization", function() {
      expect(this.callback).not.toHaveBeenCalled();
    });

    it("calls the callback when #onClose is called", function() {
      this.instance.onClose();
      expect(this.callback).toHaveBeenCalled();
    });
  });
});
