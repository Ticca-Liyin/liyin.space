export const CookieServerCode = {
    SUCCESS: 0,
    COOKIE_EXPIRED: -100,
    COOKIE_ERROR: 400,
    UNKNOWN_ERROR: 401,
}

export class RequesrResult {
    constructor(code, message, data = null) {
        this.code = code;
        this.message = message;
        this.data = data;
    }
}