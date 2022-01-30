import { Component , OnInit} from "@angular/core";
import { AuthService } from "../services/auth.service";
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['/home.component.css']
})

export class HomeComponent implements OnInit{
    
    constructor(private authService: AuthService) {}
    email = this.authService.savedUser.email;
    // console.log(user)
    // this.authService.user.pipe(map(user => {
    //     const isAuth = !!user;
    //     if(isAuth) {return true;}
    //     return this.router.createUrlTree(['/auth']);
    // })
    // // , tap(isAuth => {
    // //     if(!isAuth){
    // //         this.router.navigate(['/auth']);
    // //     } 
    // // })
    // );
    ngOnInit(){
        console.log('25',this.email)
    }
}