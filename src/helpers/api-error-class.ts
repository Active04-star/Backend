import { HttpException } from "@nestjs/common";
import { ApiStatusEnum } from "src/enums/HttpStatus.enum";

export class ApiError {

    // public throw = {};
    public exception: new (...args: any[]) => HttpException = HttpException;
    public message: string;
    public info: any;

    /**
     * @param message Mensaje generico de error, string o tipo HttpMessagesEnum, puede ser nulo para enviar el mensaje de TryCatchWrapper
     * @param exception excepcion de tipo `HttpException`
     * @param info Error desconocido atrapado en catch() o mensaje customizado
     */
    constructor(message: ApiStatusEnum | null, exception: new (...args: any[]) => HttpException = HttpException, info?: any) {
        this.exception = exception;
        this.message = message;
        this.info = info;

        if(info !== undefined) {
            throw new this.exception({message: this.message, information: info});
        } else {
            throw new this.exception(this.message);
        }
    }
}