const env = process.env.NODE_ENV || "development"
const configFile = require('../../../config/config.json')

class ConfigHelper{
  globalConfig: object;
  currentEnvironmentConfig: object;

  constructor(globalConfig, currentEnvironmentString){
    this.globalConfig = globalConfig
    this.currentEnvironmentConfig = this.getConfigForEnv(currentEnvironmentString)
  }

  getConfig(){
    return this.currentEnvironmentConfig
  }

  getConfigForEnv(environmentString){
    return this.globalConfig[environmentString]
  }
}

module.exports = {
  configHelper: new ConfigHelper(configFile, env),
  ConfigHelper: ConfigHelper
}