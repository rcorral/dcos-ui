/* eslint-disable no-unused-vars */
const React = require("react");
/* eslint-enable no-unused-vars */
const ReactDOM = require("react-dom");

const ExpandingTable = require("../ExpandingTable");

describe("ExpandingTable", function() {
  beforeEach(function() {
    this.columns = [{ heading() {}, prop: "id" }];
    this.rows = [{ id: "foo" }, { id: "bar" }];
    this.container = global.document.createElement("div");
  });

  afterEach(function() {
    ReactDOM.unmountComponentAtNode(this.container);
  });

  describe("#render", function() {
    describe("#expandRow", function() {
      it("adds a row to state.expandedRows", function() {
        const instance = ReactDOM.render(
          <ExpandingTable columns={this.columns} data={this.rows} />,
          this.container
        );

        instance.expandRow(this.rows[0]);

        expect(instance.state.expandedRows["foo"]).toBeTruthy();
      });

      it("removes a row from state.expandedRows if expanded", function() {
        const instance = ReactDOM.render(
          <ExpandingTable columns={this.columns} data={this.rows} />,
          this.container
        );

        instance.expandRow(this.rows[0]);
        instance.expandRow(this.rows[0]);

        expect(instance.state.expandedRows["foo"]).toBeFalsy();
      });

      it("allows multiple rows in state.expandedRows", function() {
        const instance = ReactDOM.render(
          <ExpandingTable columns={this.columns} data={this.rows} />,
          this.container
        );

        instance.expandRow(this.rows[0]);
        instance.expandRow(this.rows[1]);

        expect(instance.state.expandedRows["foo"]).toBeTruthy();
        expect(instance.state.expandedRows["bar"]).toBeTruthy();
      });

      it("expands all rows on mount when expandRowsByDefault is true", function() {
        const instance = ReactDOM.render(
          <ExpandingTable
            columns={this.columns}
            data={this.rows}
            expandRowsByDefault={true}
          />,
          this.container
        );

        expect(instance.state.expandedRows["foo"]).toBeTruthy();
        expect(instance.state.expandedRows["bar"]).toBeTruthy();

        instance.expandRow(this.rows[0]);
        instance.expandRow(this.rows[1]);

        expect(instance.state.expandedRows["foo"]).toBeFalsy();
        expect(instance.state.expandedRows["bar"]).toBeFalsy();
      });
    });

    describe("#getRenderer", function() {
      it("proxies the render method on each column", function() {
        const renderSpy = jasmine.createSpy("renderSpy");
        this.columns[0].render = renderSpy;

        ReactDOM.render(
          <ExpandingTable columns={this.columns} data={this.rows} />,
          this.container
        );

        expect(renderSpy).toHaveBeenCalled();
      });
    });
  });
});
