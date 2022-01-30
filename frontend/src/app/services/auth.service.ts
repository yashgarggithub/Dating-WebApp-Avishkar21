import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { User } from "./user.model";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { HttpHeaders } from "@angular/common/http";
export interface AuthResponseData {
    kind: string;
    user: any;
    token: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    resgistered?: boolean;
}

//defines that file is service
@Injectable({ providedIn: 'root' })   //'root' -> this service can be used in any component inside root

export class AuthService {
    user = new BehaviorSubject<User>(null); //initializing model
    token: string = null;
    AUTH_API = 'http://localhost:3000/'
    id: string;
    private tokenExpirationTimer: any;
    constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) { }
    savedUser: any;


    //communicates with user.js
    signup(email: string, password: string) {
        // let headers = new Headers();
        // headers.append('Content-Type','application/json');
        // // headers.append('Authorization',this.basic);
        // let options = new RequestOptions({headers:headers});

        // HEADERS - carry information
        let headers = new HttpHeaders({
            'Content-Type': 'application/json', //default settings
            'Access-Control-Allow-Origin': '*',
            'withCredentials': 'true'
        });
        let options = { headers: headers };
        // console.log('line27', email);
        return this.http.post<AuthResponseData>(
            this.AUTH_API + 'signup',  //adderss from which we are posting
            {   //data to post
                email: email,
                password: password,
                returnSecureToken: true
            },
            options    //options stores headers
        ).pipe( //pipe() - catches and edits response
            catchError(throwError),
            tap(resData => { //tap() - default fn
                console.log(resData);
                this.handleAuthentication(resData.email, resData.localId, resData.token,
                    +resData.expiresIn)
            }))
    }

    login(email: string, password: string) {

        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Origin': 'http://localhost:4200',
            'withCredentials': 'true',
            'observe': 'response'
        });
        let options = { headers: headers };
        return this.http.post<AuthResponseData>(
            this.AUTH_API + 'login',
            {
                email: email,
                password: password,
                returnSecureToken: true
            }, options
        ).pipe(tap(resData => {
            this.savedUser = resData.user;
            this.id = resData.user._id;
            console.log('82', this.savedUser);
            console.log('80', resData.token);
            this.cookieService.set('Token', resData.token)  //storing(set) token in cookie
            this.handleAuthentication(resData.user.email, resData.user._id, resData.token,
                +resData.expiresIn)
            // this.cookieService.set('Token', resData.token)
        }))
    }


    autologin() {
        const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;

        } = JSON.parse(localStorage.getItem('userData'));
        if (!userData) return;
        console.log('100', userData._token)
        this.cookieService.set('Token', userData._token)    //need to create coockie, as it was destroyed in login

        const loadedUser = new User(userData.email,
            userData.id,
            userData._token,
            new Date(userData._tokenExpirationDate));
        
        console.log('105', loadedUser.email)
        this.savedUser = loadedUser
        this.id = this.savedUser.id

        console.log('110', this.savedUser);
        if (loadedUser._token) {
            console.log('107', loadedUser);
            this.savedUser = loadedUser;
            this.user.next(loadedUser)  //updating user model instance
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            // this.autologout(expirationDuration);
            console.log('109', this.user)
            // manually set data in expirationDuration argument to verify
        }
    }

    logout() {
        const cookieValue = this.cookieService.get('Token');

        this.user.next(null);
        this.router.navigate(['/auth']);

        // clear localSTorage
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Origin': 'http://localhost:4200',
            'withCredentials': 'true',
            'observe': 'response',
            'Token': cookieValue
        });
        console.log('132', cookieValue);
        let options = { headers: headers };
        localStorage.removeItem('userData');
        // this.cookieService.deleteAll();
        this.cookieService.delete('Token', '/', 'localhost', false, 'Lax');
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer)
        }
        this.tokenExpirationTimer = null;
        return this.http.post<AuthResponseData>(
            this.AUTH_API + 'logout', {
            // cookie: this.cookieValue,
            returnSecureToken: true
        }, options
        ).pipe(tap(resData => {
            const user = new User(
                resData.user.email,
                resData.user.localId,
                resData.token,
                new Date()
            );
            this.user.next(user);
        }));

    }


    autologout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout()
        }, expirationDuration)
    }

    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
        console.log('135', email);
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new User(  //making frontend user using backend user data
            email,
            userId,
            token,
            expirationDate
        );
        this.user.next(user);
        console.log('97', user);
        //  To save user data in case of reloading
        // console.log('86',resData);
        localStorage.setItem('userData', JSON.stringify(user));
        // this.cookieService.set('Token', '1234')
        console.log('179', user.token);

    }





}