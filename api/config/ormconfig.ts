const jsonConfig = require('../../config/ormconfig.json');
/**
 * Since moving ormconfig for TypeORM is not an easy change, we're manually reading the configs 
 * by loading it into the app.
 */
export const ormconfig:any = jsonConfig;