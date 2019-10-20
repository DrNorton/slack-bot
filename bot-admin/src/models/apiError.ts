export class ApiError extends Error {
    private _errorCode: number;

    get errorCode (): number {
        return this._errorCode;
    }

    constructor (code: number, message: string) {
        super(message);
        this._errorCode = code;
    }
}
