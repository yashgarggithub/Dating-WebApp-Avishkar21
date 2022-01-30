import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, Subject, throwError } from  'rxjs';
import { User } from "./user.model";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { HttpHeaders } from "@angular/common/http";
import { NgForm } from "@angular/forms";
export interface EditResponseData {
    kind: string;
    user: any;
    token: string;
    email: string;
    refreshToekn: string;
    expiresIn: string;
    localId: string;
    photo: File;
    resgistered?: boolean;
}

@Injectable({providedIn: 'root'})

export class PhotoService{
    user = new BehaviorSubject<any>(null);
    
    constructor(private http:HttpClient, private router: Router, private cookieService: CookieService) {}
    AUTH_API = 'http://localhost:3000/';
    cookieValue = this.cookieService.get('Token');
     headers = new HttpHeaders({
        // 'Content-Type': 'image/jpg',
        // 'Content-Type': 'multipart/form-data',
        // 'Accept': 'application/json',
        // 'Content-Type': 'multipart/form-data',
        'Access-Control-Allow-Credentials' : 'true',
        'Access-Control-Allow-Origin': 'http://localhost:4200',
        'withCredentials' : 'true',
        'observe' : 'response',
        'Token' : this.cookieValue
    });
    options = { headers: this.headers };
    phtoedit(form: NgForm){
       
        console.log('26',form.value.photo);
        // this.cookieValue = this.cookieService.get('Token')
        console.log('39',this.cookieValue);
        return this.http.post<EditResponseData>(
            this.AUTH_API + 'avatar',{
                photo : form.value.photo,
                returnSecureToken : true
            }, this.options
        ).pipe(tap(resData =>{
                // new Date.getTime() returns number of milliseconds since 1970
                console.log('50x',resData.user);
            const expirationDate = new Date();
            const user = new User(
                 resData.user.email,
                 resData.user.localId,
                 resData.user.idToken,
                 expirationDate);
                 this.user.next(user);
                 console.log('58',this.user);
            }))

    }


    // photoSubmit(form : FormData){
    //     console.log('69');
    //     return this.http.post<EditResponseData>(
    //         this.AUTH_API + 'avatar',{
    //             formData:form
    //         }, this.options
    //     ).pipe(tap(resData =>{
    //         console.log()
    //     }))
    // }

}