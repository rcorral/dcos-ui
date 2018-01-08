var DSLFilterList = require("#SRC/js/structs/DSLFilterList");
var SearchDSL = require("#SRC/resources/grammar/SearchDSL.jison");
var HealthStatus = require("../../constants/HealthStatus");
var ServiceAttributeNoHealthchecksFilter = require("../ServiceAttributeNoHealthchecksFilter");
var List = require("#SRC/js/structs/List");

describe("ServiceAttributeNoHealthchecksFilter", function() {
  beforeEach(function() {
    this.mockItems = [
      {
        getHealth() {
          return HealthStatus.HEALTHY;
        }
      },
      {
        getHealth() {
          return HealthStatus.UNHEALTHY;
        }
      },
      {
        getHealth() {
          return HealthStatus.IDLE;
        }
      },
      {
        getHealth() {
          return HealthStatus.NA;
        }
      }
    ];
  });

  it("keeps services without health checks", function() {
    const services = new List({ items: this.mockItems });
    const expr = SearchDSL.parse("no:healthchecks");

    const filters = new DSLFilterList().add(
      new ServiceAttributeNoHealthchecksFilter()
    );

    expect(expr.filter(filters, services).getItems()).toEqual([
      this.mockItems[3]
    ]);
  });

  it("keeps nothing on unknown states", function() {
    const services = new List({ items: this.mockItems });
    const expr = SearchDSL.parse("no:boo");

    const filters = new DSLFilterList().add(
      new ServiceAttributeNoHealthchecksFilter()
    );

    expect(expr.filter(filters, services).getItems()).toEqual([]);
  });

  it("is case-insensitive", function() {
    const services = new List({ items: this.mockItems });
    const expr = SearchDSL.parse("no:HeaLThchEckS");

    const filters = new DSLFilterList([
      new ServiceAttributeNoHealthchecksFilter()
    ]);

    expect(expr.filter(filters, services).getItems()).toEqual([
      this.mockItems[3]
    ]);
  });
});
