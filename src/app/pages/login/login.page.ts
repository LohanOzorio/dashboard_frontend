import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { LoginFormComponent } from 'src/app/components/login-form/login-form.component';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonicModule, FormsModule, LoginFormComponent],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  usuario: string = '';
  senha: string = '';
  lembrarSenha: boolean = false;
  showPassword: boolean = false;

  constructor(private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    if (this.usuario.trim() && this.senha.trim()) {
      this.router.navigate(['/dashboard']);
    } else {
      alert('Por favor, preencha usuário e senha.');
    }
  }
}
