import {ValidatorOptions} from "class-validator";

export class CustomValidatorOptions implements ValidatorOptions {

  skipMissingProperties?: boolean;
  whitelist?: boolean;
  forbidNonWhitelisted?: boolean;
  groups?: string[];
  dismissDefaultMessages?: boolean;
  validationError?: {
      target?: boolean;
      value?: boolean;
  };
  forbidUnknownValues?: boolean;

  constructor(){
    this.forbidUnknownValues = true;
  }
}