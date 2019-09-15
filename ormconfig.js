const fullConfig = require("./config/ormconfig.json");
// this surfaces the v4_database config to the mirgrations script
module.exports = fullConfig[process.env.NODE_ENV || "development"]["new_default"];