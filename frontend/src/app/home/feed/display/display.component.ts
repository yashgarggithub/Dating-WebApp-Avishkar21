import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
// import { userInfo } from 'os';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { DisplayService } from 'src/app/services/display.service';

@Component({
    selector: 'app-display',
    templateUrl: './display.component.html',
    styleUrls: ['./display.component.css']
})

export class DisplayComponent implements OnInit {

    @Input() user: any;    //@Input(): fetching binded data sebt from feed.html
    @Input() index: any;
    @Input() gender: any;
    image: any;
    // gender: any;
    buttonClicked = false;
    i = 1;
    id2: string;
    Obs: Observable<any>
    DisObs: Observable<any>
    constructor(private http: HttpClient, private cookieService: CookieService,
        private displayService: DisplayService) { }
    ngOnInit() {
        const id2 = this.user._id;
        this.id2 = id2;
        this.image = this.user.image
        console.log('30', this.image)
        // this.gender = this.currUser.gender
        // console.log('32',this.gender)
    }

    AUTH_API = 'http://localhost:3000/';
    onsubmit() {
        this.buttonClicked = true;
        window.scrollBy(0, 800);
        this.Obs = this.displayService.like(this.id2)
        this.Obs.subscribe(resData => {
            console.log('33', resData);
        }, e => {
            console.log('35', e)
        })
    }
    ondislike() {
        this.buttonClicked = true;
        window.scrollBy(0, 800);
        this.DisObs = this.displayService.dislike(this.id2);
        this.DisObs.subscribe(resData => {
            console.log('44', resData);
        }, e => {
            console.log('46', e)
        })
    }

    // ngOnChanges(changes: SimpleChanges): void {
    //     console.log('52',changes)
    // }
}