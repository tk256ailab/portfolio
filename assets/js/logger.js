// Debug Configuration
// Set DEBUG to true to enable console logging
// Set DEBUG to false to disable console logging in production
const DEBUG = false; // Change to true for development

// Logger utility that respects DEBUG flag
window.logger = {
  log: function(...args) {
    if (DEBUG) {
      console.log(...args);
    }
  },

  info: function(...args) {
    if (DEBUG) {
      console.info(...args);
    }
  },

  warn: function(...args) {
    if (DEBUG) {
      console.warn(...args);
    }
  },

  // Always show errors regardless of DEBUG flag
  error: function(...args) {
    console.error(...args);
  }
};
