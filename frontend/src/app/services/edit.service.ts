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
    resgistered?: boolean;
}

@Injectable({providedIn: 'root'})

export class EditService{
    user = new BehaviorSubject<any>(null);
    
    constructor(private http:HttpClient, private router: Router, private cookieService: CookieService) {}
    AUTH_API = 'http://localhost:3000/';
    cookieValue = this.cookieService.get('Token');
    edit(form: NgForm, lat: number, lng: number){   //form, lattitude, longi
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials' : 'true',
            'Access-Control-Allow-Origin': 'http://localhost:4200',
            'withCredentials' : 'true',
            'observe' : 'response',
            'Token' : this.cookieValue
        });
        let options = { headers: headers }; //optins: reference of headers
        console.log('26',form.value);
        // this.cookieValue = this.cookieService.get('Token')
        console.log('39', this.cookieValue);
        
        return this.http.patch<EditResponseData>(
            this.AUTH_API + 'edit',{
                first_name: form.value.first_name, 
                last_name: form.value.last_name,
                age: form.value.age,
                phone: form.value.phone,
                latitude: lat,
                longitude: lng,
                gender: form.value.gender,
                bio: form.value.bio,
                cookie: this.cookieValue,
                returnSecureToken : true
            }, options
        ).pipe(tap(resData =>{
                // new Date.getTime() returns number of milliseconds since 1970
                console.log('39',resData);
            const expirationDate = new Date();
            const user = new User(
                 resData.email,
                //  resData.localId,
                null,
                null,
                    null
                    // ,
                //  expirationDate,
                // null
                );
                 console.log('64',user)
                 this.user.next(user);
                //  console.log('58',this.user);
            }))

    }

}