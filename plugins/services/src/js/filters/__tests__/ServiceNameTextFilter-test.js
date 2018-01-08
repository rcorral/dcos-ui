var DSLFilterList = require("#SRC/js/structs/DSLFilterList");
var SearchDSL = require("#SRC/resources/grammar/SearchDSL.jison");
var ServiceNameTextFilter = require("../ServiceNameTextFilter");
var List = require("#SRC/js/structs/List");

describe("ServiceNameTextFilter", function() {
  beforeEach(function() {
    this.mockItems = [
      {
        getName() {
          return "foo service";
        }
      },
      {
        getName() {
          return "bar service";
        }
      },
      {
        getName() {
          return "foo bar service";
        }
      }
    ];
  });

  it("matches parts of service name", function() {
    const services = new List({ items: this.mockItems });
    const expr = SearchDSL.parse("foo");

    const filters = new DSLFilterList().add(new ServiceNameTextFilter());

    expect(expr.filter(filters, services).getItems()).toEqual([
      this.mockItems[0],
      this.mockItems[2]
    ]);
  });

  it("matches exact parts of service name", function() {
    const services = new List({ items: this.mockItems });
    const expr = SearchDSL.parse('"foo bar"');

    const filters = new DSLFilterList().add(new ServiceNameTextFilter());

    expect(expr.filter(filters, services).getItems()).toEqual([
      this.mockItems[2]
    ]);
  });
});
