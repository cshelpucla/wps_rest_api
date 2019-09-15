

export class BaseResponse {
    status: string; // TODO: switch to enum

    controller() {

    }

    setStatus(status:string) {
        this.status = status;
    }
}