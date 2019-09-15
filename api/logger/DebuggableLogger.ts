import { AdvancedConsoleLogger, QueryRunner, Logger } from 'typeorm'

export class DebuggableLogger extends AdvancedConsoleLogger {
  public enabled: boolean = false

  public logEnable(flag: boolean): void {
    this.enabled = flag;
  }

  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): void {
    if (this.enabled) {      
      return super.logQuery(query, parameters, queryRunner)
    }
  }

  logQueryError(
    error: string,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ): void {
    if (this.enabled) {
      return super.logQueryError(error, query, parameters, queryRunner)
    }
  }

  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ): void {
    if (this.enabled) {
      return super.logQuerySlow(time, query, parameters, queryRunner)
    }
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner): void {
    if (this.enabled) {
      return super.logSchemaBuild(message, queryRunner)
    }
  }

  logMigration(message: string, queryRunner?: QueryRunner): void {
    if (this.enabled) {
      return super.logMigration(message, queryRunner)
    }
  }

  log(
    level: 'log' | 'info' | 'warn',
    message: any,
    queryRunner?: QueryRunner,
  ): void {
    if (this.enabled) {
        return super.log(level, message, queryRunner)
    }
  }
}