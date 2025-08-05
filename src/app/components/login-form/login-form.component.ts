import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class LoginFormComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {}

  entrar() {
    this.router.navigate(['/home']); 
  }
}
