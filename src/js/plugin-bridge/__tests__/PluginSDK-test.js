const deepEqual = require("deep-equal");

const PluginSDK = require("PluginSDK");
const PluginTestUtils = require("PluginTestUtils");

const Hooks = PluginSDK.Hooks;

describe("PluginSDK", function() {
  describe("#initialize", function() {
    describe("#reducers", function() {
      it("does not create a namespace in Store for plugin if no reducer returned", function() {
        // Mock a fake plugin
        this.mockPlugin = jest.genMockFunction().mockImplementation(function() {
          // Don't return anything
        });
        PluginTestUtils.loadPlugins({
          fakePlugin1: {
            module: this.mockPlugin,
            config: {
              enabled: true,
              foo: "bar"
            }
          }
        });
        var state = PluginSDK.Store.getState();
        expect(state.fakePlugin1).toEqual(undefined);
      });

      it("creates a namespace in Store for plugin if reducer returned", function() {
        // Mock a fake plugin
        this.mockPlugin = jest.genMockFunction().mockImplementation(function() {
          // Return reducer
          return function() {
            // Return an initial state
            return { foo: "bar" };
          };
        });
        PluginTestUtils.loadPlugins({
          fakePlugin2: {
            module: this.mockPlugin,
            config: {
              enabled: true,
              foo: "bar"
            }
          }
        });
        var state = PluginSDK.Store.getState();
        expect(deepEqual(state.fakePlugin2, { foo: "bar" })).toEqual(true);
      });

      it("throws an error if reducer is not a function", function() {
        // Mock a fake plugin
        var mockPlugin = jest.genMockFunction().mockImplementation(function() {
          // Return invalid reducer
          return {};
        });
        expect(function() {
          PluginTestUtils.loadPlugins({
            badFakePlugin: {
              module: mockPlugin,
              config: {
                enabled: true,
                foo: "bar"
              }
            }
          });
        }).toThrow(new Error("Reducer for badFakePlugin must be a function"));
      });
    });
  });

  describe("#bootstrapPlugin", function() {
    beforeEach(function() {
      this.mockPlugin = jest.genMockFunction();

      PluginTestUtils.loadPlugins({
        fakePlugin3: {
          module: this.mockPlugin,
          config: {
            enabled: true,
            foo: "bar"
          }
        }
      });
    });

    it("calls plugin", function() {
      expect(this.mockPlugin.mock.calls.length).toBe(1);
    });

    it("calls plugin with correct # of args", function() {
      var args = this.mockPlugin.mock.calls[0];
      expect(args.length).toBe(1);
    });

    it("calls plugin with PluginSDK", function() {
      var SDK = this.mockPlugin.mock.calls[0][0];
      expect(SDK.toString()).toEqual(PluginSDK.toString());
    });

    it("contains Store in PluginSDK", function() {
      var store = this.mockPlugin.mock.calls[0][0].Store;
      expect(typeof store.subscribe).toEqual("function");
      expect(typeof store.getState).toEqual("function");
    });

    it("contains personal dispatch in PluginSDK", function() {
      var SDK = this.mockPlugin.mock.calls[0][0];
      var store = PluginSDK.Store;
      var dispatch = SDK.dispatch;
      var pluginID = SDK.pluginID;
      var storeDispatch = store.dispatch;
      store.dispatch = jest.genMockFunction();
      dispatch({
        type: "foo",
        data: "bar"
      });
      var dispatchedObject = {
        type: "foo",
        data: "bar",
        __origin: pluginID
      };
      expect(store.dispatch.mock.calls.length).toEqual(1);
      expect(
        deepEqual(store.dispatch.mock.calls[0][0], dispatchedObject)
      ).toEqual(true);
      // Undo
      store.dispatch = storeDispatch;
    });

    it("contains pluginID in PluginSDK", function() {
      var pluginID = this.mockPlugin.mock.calls[0][0].pluginID;
      expect(pluginID).toEqual("fakePlugin3");
    });

    it("contains Hooks in PluginSDK", function() {
      var pluginHooks = this.mockPlugin.mock.calls[0][0].Hooks;
      expect(pluginHooks).toEqual(Hooks);
    });
  });

  describe("#store and dispatch", function() {
    beforeEach(function() {
      var mockReducer = jest.genMockFunction();
      // Mock reducer
      mockReducer.mockImplementation(function(state, action) {
        if (!state || action.type === "reset") {
          return { foo: 1 };
        }
        switch (action.type) {
          case "foo":
            return { foo: state.foo + 1 };
          case "bar":
            return Object.assign({}, state, { bar: "qux" });
          default:
            return state;
        }
      });

      var testArgs = {};

      // Mock a fake plugin
      this.mockPlugin = jest
        .genMockFunction()
        .mockImplementation(function(SDK) {
          testArgs.dispatch = SDK.dispatch;

          return mockReducer;
        });
      this.testArgs = testArgs;
      this.mockReducer = mockReducer;

      PluginTestUtils.loadPlugins({
        anotherFakePlugin: {
          module: this.mockPlugin,
          config: {
            enabled: true,
            foo: "bar"
          }
        }
      });
    });

    it("calls reducer to get initial state", function() {
      // Redux calls the reducer 3 times to check everything
      expect(this.mockReducer.mock.calls.length).toEqual(3);
    });

    it("calls reducer with correct state", function() {
      this.testArgs.dispatch({ type: "foo" });
      var prevState = this.mockReducer.mock.calls[3][0];
      expect(deepEqual(prevState, { foo: 1 })).toEqual(true);
    });

    it("calls reducer with correct action", function() {
      this.testArgs.dispatch({ type: "foo" });
      var action = this.mockReducer.mock.calls[3][1];
      expect(
        deepEqual(action, { type: "foo", __origin: "anotherFakePlugin" })
      ).toEqual(true);
    });

    it("updates Store with new state #1", function() {
      this.testArgs.dispatch({ type: "reset" });
      var state = PluginSDK.Store.getState().anotherFakePlugin;
      expect(deepEqual(state, { foo: 1 })).toEqual(true);
    });

    it("updates Store with new state #2", function() {
      this.testArgs.dispatch({ type: "foo" });
      var state = PluginSDK.Store.getState().anotherFakePlugin;
      expect(deepEqual(state, { foo: 2 })).toEqual(true);
    });

    it("updates Store with new state #3", function() {
      this.testArgs.dispatch({ type: "bar" });
      var state = PluginSDK.Store.getState().anotherFakePlugin;
      expect(deepEqual(state, { foo: 2, bar: "qux" })).toEqual(true);
    });
  });
});
