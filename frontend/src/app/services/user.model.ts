export class User{
    constructor(
         public email: string,
         public id: string,
         public _token: string,
        //  public first_name: string,
        //  public last_name: string,
        //  public phone: number,
        //  public gender: string,
        //  public bio: string,
         public _tokenExpirationDate: Date
         ) {}

    get token(){
        if(!this._tokenExpirationDate || new Date() > this._tokenExpirationDate){
            return null;
        }
        else{
        return this._token;
        }
    }
}