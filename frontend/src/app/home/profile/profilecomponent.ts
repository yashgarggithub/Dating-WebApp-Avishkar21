import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { AuthResponseData, AuthService } from "src/app/services/auth.service";
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { NgForm } from "@angular/forms";
import { PhotoService } from "src/app/services/photo.service";
import { CookieService } from "ngx-cookie-service";
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage'

// import {Http, Headers, RequestOptionsArgs } from "@angular/http";

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css', './demo.css', './style.css']
})

export class ProfileComponent implements OnInit {

    filePath: String
    constructor(private authService: AuthService, private router: Router,
        private http: HttpClient, private photoService: PhotoService,
        private cookieService: CookieService, private fileStorage: AngularFireStorage) { }  //AngularFireStorage: firebase for image upload
    authObs: Observable<AuthResponseData>
    user: any;
    basePath = '/images';                       //  <<<<<<<
    downloadableURL: any;                      //  <<<<<<<
    task: AngularFireUploadTask;
    // photograph :any;
    imageToShow: any;
    images: any;

    onlogout() {
        this.authObs = this.authService.logout();
        console.log('16', this.authObs)
        this.authObs.subscribe(resData => {
            this.router.navigate(['/auth']);
        }, error => {
            console.log(error)
        })
    }
    AUTH_API = "http://localhost:3000/";

    ngOnInit() {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Origin': 'http://localhost:4200',
            'withCredentials': 'true',
            'observe': 'response',
            'Token': this.cookieService.get('Token')    //GETting user Token from cookie
        });
        let options = { headers: headers };
        console.log('38');
        this.http.get(this.AUTH_API + 'profile',
            options

            //   httpOptions
        ).subscribe(data => {
            console.log('43', data)
            this.user = data;   //now we can access show user info
            this.imageToShow = this.user.image
            // this.imageToShow = null;
            console.log('45', data)
        }, error => {
            console.log('47', error)

        });
        console.log('50');

        // headers = new HttpHeaders({
        //     'Content-type': 'image/jpg',
        //     'Access-Control-Allow-Credentials' : 'true',
        //     'Access-Control-Allow-Origin': 'http://localhost:4200',
        //     'withCredentials' : 'true',
        //     'observe' : 'response',
        //     'Token' : this.authService.savedUser._token
        // });

        // this.http.get( this.AUTH_API + 'avatar',
        // { headers: headers 
        //     , responseType :'blob'
        // }
        // //   httpOptions
        // ).subscribe(data =>{
        //     console.log('60',data)
        //     // let blob = new Blob(data['_body'], {type: 'image/jpg'});
        //     // let url = URL.createObjectURL(blob);
        //    this.createImageFromBlob(data);
        // //    this.imageToShow = data
        //     // console.log('73',blob)
        //     console.log('62')
        // },error =>{
        //     console.log('64',error) 
        // })

        this.router.navigate(['/profile'])
    }
    // createImageFromBlob(image: Blob) {
    //     let reader = new FileReader();
    //     reader.addEventListener("load", () => {
    //        this.imageToShow = reader.result;
    //        console.log('95');
    //     }, false);

    //     if (image) {
    //        reader.readAsDataURL(image);
    //     //    console.log(reader);
    //     }
    //  } 


    cookieValue = this.cookieService.get('Token');
    headers = new HttpHeaders({
        // 'Content-Type': 'image/jpg',
        // 'Content-Type': 'multipart/form-data',
        // 'Accept': 'application/json',
        // 'Content-Type': 'multipart/form-data',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': 'http://localhost:4200',
        'withCredentials': 'true',
        'observe': 'response',
        'Token': this.cookieValue
    });
    options = { headers: this.headers };



    //event: is a object which records change
    upload(event) {
        this.filePath = event.target.files[0]
    }

    //online API request => unsynchronous
    async uploadImage() {
        console.log(this.filePath)
        this.task = this.fileStorage.upload('/images/' + Math.random() + this.filePath, this.filePath); //firebase upload
        (await this.task).ref.getDownloadURL().then(async url => {
            console.log('144', url)
            this.http.patch<any>('http://localhost:3000/avatar', { url: url }, this.options).subscribe(
                (res) => console.log('146', res),
                (err) => console.log(err)
            );
        });
        await console.log('147', this.downloadableURL);
        this.router.navigate(['/profile'])

    }


} 