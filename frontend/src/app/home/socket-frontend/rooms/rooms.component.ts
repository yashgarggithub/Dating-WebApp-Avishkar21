import { Component, Input, OnInit } from "@angular/core";
// import { AnyTxtRecord } from "dns";
import { Router } from "@angular/router";
@Component({
    selector: 'app-rooms',
    templateUrl: './rooms.component.html',
    styleUrls: ['./rooms.components.css']
})
export class RoomComponent implements OnInit{
    @Input() room: any;
    @Input() index: number;
    constructor(private router: Router){}
    istrue: boolean;
    ngOnInit(){
        console.log('14',this.index);
    }
    onclick(){
        this.istrue = true;
        this.router.navigate(['/list', {name: this.room}]);
    }
    close(){
        this.istrue= false;
    }
}