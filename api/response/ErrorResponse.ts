import { BaseResponse } from './BaseResponse';

export class ErrorResponse extends BaseResponse {
    controller() {
        this.status = "Failed"; // TODO: use enum status
    }
}