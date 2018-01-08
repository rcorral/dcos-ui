var Application = require("../../structs/Application");
var DSLFilterList = require("#SRC/js/structs/DSLFilterList");
var Framework = require("../../structs/Framework");
var List = require("#SRC/js/structs/List");
var Pod = require("../../structs/Pod");
var SearchDSL = require("#SRC/resources/grammar/SearchDSL.jison");
var ServiceAttributeIsPodFilter = require("../ServiceAttributeIsPodFilter");

describe("ServiceAttributeIsPodFilter", function() {
  beforeEach(function() {
    this.mockItems = [new Framework(), new Application(), new Pod()];
  });

  it("matches Pod instances", function() {
    const services = new List({ items: this.mockItems });
    const expr = SearchDSL.parse("is:pod");

    const filters = new DSLFilterList().add(new ServiceAttributeIsPodFilter());

    expect(expr.filter(filters, services).getItems()).toEqual([
      this.mockItems[2]
    ]);
  });

  it("keeps nothing on unknown values", function() {
    const services = new List({ items: this.mockItems });
    const expr = SearchDSL.parse("is:foo");

    const filters = new DSLFilterList().add(new ServiceAttributeIsPodFilter());

    expect(expr.filter(filters, services).getItems()).toEqual([]);
  });

  it("is case-insensitive", function() {
    const services = new List({ items: this.mockItems });
    const expr = SearchDSL.parse("is:pOd");

    const filters = new DSLFilterList().add(new ServiceAttributeIsPodFilter());

    expect(expr.filter(filters, services).getItems()).toEqual([
      this.mockItems[2]
    ]);
  });
});
