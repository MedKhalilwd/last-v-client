import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,FormControl,Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent {
  returnUrl: string;
  userPoints:any
  listuser:any
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router:Router, private route: ActivatedRoute) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

  }

  onSubmit0(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value)
        .subscribe(
          response => {
            this.listuser = response

            if (this.listuser.success == true) {
              localStorage.setItem("userconnect", JSON.stringify(this.listuser.user) )
              localStorage.setItem("token",this.listuser.token)
              localStorage.setItem("state","0")

            console.log('Réponse du serveur:', response);
            window.location.reload(); // Reload the page after successful purchase

            // Redirection vers la page d'accueil après une authentification réussie
            this.router.navigate(['/']);
            window.location.reload(); // Reload the page after successful purchase

          }
          },
          error => {
            console.error('Erreur lors de la connexion:', error);
            this.errorMessage = 'Erreur lors de la connexion. Veuillez réessayer.';
          }
        );
    } else {
      this.errorMessage = 'Veuillez remplir correctement tous les champs.';
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;
      console.log('Credentials:', credentials); // Check credentials here
      this.authService.login(credentials).subscribe(
        response => {
          if (response.msg === 'success') {
            localStorage.setItem("userconnect", JSON.stringify(response.user));
            localStorage.setItem("token", response.token);
            localStorage.setItem("point", response.user.points);
            localStorage.setItem("state", "0");
            this.router.navigateByUrl(this.returnUrl || '/');
          } else {
            this.errorMessage = response.error;
          }
        },
        error => {
          console.error('Login error:', error);
          this.errorMessage = 'Erreur lors de la connexion. Veuillez réessayer.';
        }
      );
    } else {
      this.errorMessage = 'Veuillez remplir correctement tous les champs.';
    }
  }
  



}
