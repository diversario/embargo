// cache the real JS module loader
var jsLoader = require.extensions['.js']
// this will hold overrides keyed on module absolute path
  , registeredOverrides = {}
  , overrides  = {}
;


/**
 * Searches for available overriden modules in the caller context
 * @param {Module} mod Module being loaded
 */
function applyOverrides(mod, modPath) {
  // save original current module path
  var originalPaths = module.paths;
  module.paths = mod.parent.paths;

  // go over exports and register all declared overrides
  Object.keys(module.exports).forEach(function (moduleName) {
    if (!registeredOverrides[moduleName]) {
      registeredOverrides[moduleName] = module.exports[moduleName];
    }
  });

  // go over declared overrides and look for them in current caller's path
  Object.keys(registeredOverrides).forEach(function (moduleName) {
    try {
      var modulePath = require.resolve(moduleName); 
      overrides[modulePath] = registeredOverrides[moduleName];
    } catch (e) {
      // maybe it's a relative-path module? let's try
      try {
        var relativeModuleName = mod.paths[0].split('/');
        relativeModuleName = relativeModuleName[relativeModuleName.length-2];
        
        if (relativeModuleName === moduleName) {
          // modPath is already resolved here, so we'll just use it
          overrides[modPath] = registeredOverrides[moduleName];
        }
      } catch (e) {
        console.log(e);
      }
    }
  });

  // restore original module path
  module.paths = originalPaths;
}


require.extensions['.js'] = function (mod, modPath) {
  applyOverrides(mod, modPath);
  if (!overrides[modPath]) return jsLoader(mod, modPath);
  mod.exports = overrides[modPath];
};



module.exports = {};