import {validate, ValidatorOptions} from "class-validator";
import {CustomError} from "./CustomError";
import { CustomValidatorOptions } from "./ValidatorOptionsHelper";

export class ValidationHelper{

  private validationOptions = new CustomValidatorOptions();

  async validate(entity){
    const errors = await validate(entity, this.validationOptions);
    if(errors.length > 0){
      let errorMessage = '';
      errors.forEach((error) => {
        errorMessage += `For property ${error.property} -`;
        for(let key in error.constraints){
          errorMessage += ` ${error.constraints[key]}`
        }
      })
      throw new Error(errorMessage);
    } else {
      return true;
    }
  };
}