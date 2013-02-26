// cache the real JS module loader
var jsLoader = require.extensions['.js']
// this will hold overrides keyed on module absolute path
  , registeredOverrides = {}
  , decrlaredOverrides = {}
  , cachedModules = {}
  , overrides  = {}
;


/**
 * Searches for available overriden modules in the caller context.
 * 
 * @param {Object} modContent Module being loaded
 * @param {String} modPath module path
 */
function applyOverrides(modContent, modPath) {
  // save original current module path
  var originalPaths = module.paths;
  module.paths = modContent.parent.paths;

  // go over exports and register all declared overrides
  Object.keys(decrlaredOverrides).forEach(function (moduleName) {
    if (!registeredOverrides[moduleName]) {
      registeredOverrides[moduleName] = decrlaredOverrides[moduleName];
    }
  });

  // go over declared overrides and look for them in current caller's path
  Object.keys(registeredOverrides).forEach(function (moduleName) {
    try {
      var modulePath = require.resolve(moduleName); 
      overrides[modulePath] = registeredOverrides[moduleName];
      cachedModules[moduleName] = modulePath;
    } catch (e) {
      // maybe it's a relative-path module? let's try
      try {
        var relativeModuleName = modContent.paths[0].split('/');
        relativeModuleName = relativeModuleName[relativeModuleName.length-2];
        
        if (relativeModuleName === moduleName) {
          // modPath is already resolved here, so we'll just use it
          overrides[modPath] = registeredOverrides[moduleName];
          cachedModules[moduleName] = modPath;
        }
      } catch (e) {
        console.log(e);
      }
    }
  });

  // restore original module path
  module.paths = originalPaths;
}


require.extensions['.js'] = load;


/**
 * Returns stubbed content or a real module.
 * 
 * @param modContent
 * @param modPath
 */
function load(modContent, modPath) {
  applyOverrides(modContent, modPath);
  if (!overrides[modPath]) return jsLoader(modContent, modPath);
  modContent.exports = overrides[modPath];
}



/**
 * Attempts to replace a cached module with a stub.
 * 
 * @param {String} name
 * @param {Object} content
 */
function stubCache(name, content) {
  if (cachedModules[name]) require.cache[cachedModules[name]] = content;
  else {
    try {
      var realPaths = module.paths;
      module.paths = module.parent.paths;
      var resolvedPath = require.resolve(name);
      require.cache[resolvedPath].exports = content;
      module.paths = realPaths;
    } catch(e) {
      console.log('Module', name, 'appears to be not cached.');
    }
  }
}


/**
 * Adds module name to declared overrides
 * and attempts to replace a cached module.
 * @param name
 * @param content
 */
function stub(name, content) {
  decrlaredOverrides[name] = content;
  stubCache(name, content);
}


module.exports = stub;