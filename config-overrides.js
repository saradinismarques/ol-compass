const { override } = require("customize-cra");

module.exports = override((config) => {
  // Set all Node.js core modules to false if you don't need them
  config.resolve.fallback = {
    fs: false,
    path: false,
    stream: false,
    os: false,
    util: false,
    buffer: false,
    constants: false,
    child_process: false,
    assert: false,
  };

  return config;
});
