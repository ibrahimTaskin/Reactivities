//  Server Hata Mesajlarını buradan alıcaz.
export interface ServerError{
    statusCode:number;
    message:string;
    details:string;
}