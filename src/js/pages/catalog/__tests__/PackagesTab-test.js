jest.mock("../../../utils/ScrollbarUtil");

/* eslint-disable no-unused-vars */
const React = require("react");
/* eslint-enable no-unused-vars */
const ReactDOM = require("react-dom");
const TestUtils = require("react-addons-test-utils");

// Setting useFixtures for when we load CosmosPackagesStore/CosmosPackageActions
/* eslint-disable import/newline-after-import */
const Config = require("../../../config/Config");
var configUseFixtures = Config.useFixtures;
Config.useFixtures = true;
const CosmosPackagesStore = require("../../../stores/CosmosPackagesStore");
Config.useFixtures = configUseFixtures;
/* eslint-enable import/newline-after-import */

const PackagesTab = require("../PackagesTab");
const UniversePackagesList = require("../../../structs/UniversePackagesList");

describe("PackagesTab", function() {
  beforeEach(function() {
    this.container = global.document.createElement("div");
    this.instance = ReactDOM.render(<PackagesTab />, this.container);
  });

  afterEach(function() {
    ReactDOM.unmountComponentAtNode(this.container);
  });

  describe("#handleDetailOpen", function() {
    beforeEach(function() {
      this.instance.handleDetailOpen = jasmine.createSpy("handleDetailOpen");
      jest.runAllTimers();
    });

    it("calls handler when panel is clicked", function() {
      var panel = ReactDOM.findDOMNode(this.instance).querySelector(
        ".panel.clickable"
      );
      TestUtils.Simulate.click(panel);

      expect(
        this.instance.handleDetailOpen.calls.mostRecent().args[0].get("name")
      ).toEqual("arangodb3");
    });
  });

  describe("#getPackageGrid", function() {
    beforeEach(function() {
      this.CosmosPackagesStoreGetAvailablePackages =
        CosmosPackagesStore.getAvailablePackages;
      this.packages = CosmosPackagesStore.getAvailablePackages();
    });

    afterEach(function() {
      CosmosPackagesStore.getAvailablePackages = this.CosmosPackagesStoreGetAvailablePackages;
    });

    it("returns packages", function() {
      expect(this.instance.getPackageGrid(this.packages).length).toEqual(97);
    });

    it("doesn't return packages", function() {
      CosmosPackagesStore.getAvailablePackages = function() {
        return new UniversePackagesList();
      };

      const packages = CosmosPackagesStore.getAvailablePackages();
      expect(this.instance.getPackageGrid(packages).length).toEqual(0);
    });
  });
});
