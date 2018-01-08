const Networks = require("../Networks");
const { ADD_ITEM, SET } = require("#SRC/js/constants/TransactionTypes");

describe("Networks", function() {
  describe("#JSONParser", function() {
    it("returns an empty array", function() {
      expect(Networks.JSONParser({})).toEqual([]);
    });

    it("defaults mode to CONTAINER when name is defined", function() {
      const state = {
        networks: [
          {
            mode: "host",
            name: "dcos"
          }
        ]
      };
      expect(Networks.JSONParser(state)).toEqual([
        { type: ADD_ITEM, value: 0, path: ["networks"] },
        { type: SET, value: "dcos", path: ["networks", 0, "name"] },
        { type: SET, value: "CONTAINER", path: ["networks", 0, "mode"] }
      ]);
    });

    it("sets BRIDGE mode", function() {
      const state = {
        networks: [{ mode: "container/bridge" }]
      };
      expect(Networks.JSONParser(state)).toEqual([
        { type: ADD_ITEM, value: 0, path: ["networks"] },
        { type: SET, value: "BRIDGE", path: ["networks", 0, "mode"] }
      ]);
    });

    it("sets HOST mode", function() {
      const state = {
        networks: [{ mode: "host" }]
      };
      expect(Networks.JSONParser(state)).toEqual([
        { type: ADD_ITEM, value: 0, path: ["networks"] },
        { type: SET, value: "HOST", path: ["networks", 0, "mode"] }
      ]);
    });
  });
});
