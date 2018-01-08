const testUtil = require("../testUtil");

describe("testUtil", function() {
  describe("#getSearchParameter", function() {
    it("gets first search parameter", function() {
      const uri = "something?q=something&q=somethingelse";
      expect(testUtil.getSearchParameter(uri)).to.equal("q=something");
    });

    it("returns undefined if no query is found", function() {
      const uri = "something?t=0m";
      expect(testUtil.getSearchParameter(uri)).to.equal(undefined);
    });
  });
});
