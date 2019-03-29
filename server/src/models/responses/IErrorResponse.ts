export interface IErrorResponse {
    thrown?: boolean,
    error?: any;
    message?: string;
}

export function throwError(resp : IErrorResponse){
    console.error(resp)
    throw JSON.stringify(resp)
}