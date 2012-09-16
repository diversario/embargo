// cache the real JS module loader
var jsLoader = require.extensions['.js']
// this will hold overrides keyed on module absolute path
  , resolvedPaths = {}
  , overrides  = {}
;


/**
 * Searches for available overriden modules in the caller context
 * @param {Module} mod Module being loaded
 */
function applyOverrides(mod) {
  // save original current module path
  var originalPaths = module.paths;
  module.paths = mod.parent.paths;

  // go over exports and register all declared overrides
  Object.keys(module.exports).forEach(function (path) {
    if (!resolvedPaths[path]) {
      resolvedPaths[path] = module.exports[path];
    }
  });

  // go over declared overrides and look for them in current caller's path
  Object.keys(resolvedPaths).forEach(function (modName) {
    if (resolvedPaths[modName]) {
      overrides[require.resolve(modName)] = resolvedPaths[modName];
    }
  });

  // restore original module path
  module.paths = originalPaths;
}


require.extensions['.js'] = function (mod, modPath) {
  applyOverrides(mod);
  if (!overrides[modPath]) return jsLoader(mod, modPath);
  mod.exports = overrides[modPath];
};



module.exports = {};