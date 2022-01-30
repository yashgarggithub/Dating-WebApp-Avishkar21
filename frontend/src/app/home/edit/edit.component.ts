import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { EditService, EditResponseData } from "../../services/edit.service";
@Component({
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrls : ['./edit.component.css']
})

export class EditComponent implements OnInit {

    constructor(private editService: EditService, private router: Router){}
    ngOnInit(){
        this.getUserLocation()
    }
    latitude: any;
    longitude: any;
    
    getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
              this.latitude = position.coords.latitude;
              this.longitude = position.coords.longitude;
            //   this.zoom = 16;
              console.log("position", position)
            });
          }else{
            console.log("User not allowed")
          }
    }
  
    onSubmit(form: NgForm){
        if(!form.valid) return;
        let editObs: Observable<any>
        // console.log(form.value);
        console.log('37',form.value.gender)
        editObs = this.editService.edit(form, this.latitude , this.longitude);
        console.log('37',editObs)
        editObs.subscribe(resData=>{
          
          console.log('40',resData)
          // this.router.navigate["/profile"]
        })
        // ,error =>{
        //   console.log(error);
        // }
        this.router.navigate(['../profile'])

        form.reset()
         

        
    }


}