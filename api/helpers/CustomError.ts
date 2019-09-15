export class CustomError extends Error {
  public status;
  public message;

  constructor(error: Error, status = 500){
    super(error.message);

    // Since we want the whole error message for sql errors, we'll be passing the whole object
    if(error && error.hasOwnProperty('sql')) {
      this.message = error;
    } 

    this.status = status;
  }

  toJSON() {
    return {
      message: this.message,
      status: this.status
    }
  }
} 