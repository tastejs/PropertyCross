define("viewModel/util", function (require) {
  var $ = require("lib/jquery");
  var ko = require("lib/knockout");
  var viewModels = {};

  return {
    registerFactory: function (name, factory) {
      viewModels[name] = factory;
    },

    hydrateObject: function hydrateObject(application, state) {
      /// <summary>
      /// Takes a JSON representation of view model state and creates view model instances
      /// via their constructor function as indicated by the 'factoryName' property.
      /// </summary>

      // if state is a primitive type, rather than an object - no 
      // need to hydrate;
      if (!(state instanceof Object)) {
        return state;
      }

      var property, unwrapped, propertyValue,
      // create the required view model instance
        viewModel = new viewModels[state.factoryName](application);

      // iterate over each state property
      for (property in state) {
        if (property === "template" ||
            property === "factoryName" ||
            property === undefined) {
          continue;
        }

        propertyValue = state[property];

        // if the view model property is a function - it might be a KO observable
        if (viewModel[property] instanceof Function) {

          // check if this is a KO observable
          unwrapped = ko.utils.unwrapObservable(viewModel[property]);

          // if after unwrapping we do not get the same object back, then
          // this is an observable
          if (viewModel[property] !== unwrapped) {

            // check if this is an array observable
            if (unwrapped instanceof Array) {
              $.each(propertyValue, function () {
                viewModel[property].push(hydrateObject(application, this));
              });
            } else {
              // otherwise set the value via the observable setter
              viewModel[property](propertyValue);
            }
          }

        } else {
          viewModel[property] = hydrateObject(application, propertyValue);
        }
      }

      return viewModel;
    }
  };
});