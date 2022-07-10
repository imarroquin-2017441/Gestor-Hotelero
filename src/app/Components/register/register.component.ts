import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/app/models/user.model';
import { UserRestService } from 'src/app/services/services/user-rest.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  user: UserModel;

  constructor(
    private userRest: UserRestService,
    private router: Router
  ) { 
    this.user= new UserModel('', '', '', '', '', '','','');
  }

  ngOnInit(): void {
  }
  saveUser(register:any){
    this.userRest.getRegisterUser(this.user).subscribe({
      next: (res: any)=>{
        alert(res.message);
        return this.router.navigateByUrl('/login')
      },
      error: (err)=> {
        register.reset();
        alert(err.error.message || err.error);
      }
    })
  }
}
