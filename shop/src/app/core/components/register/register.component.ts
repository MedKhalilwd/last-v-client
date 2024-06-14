import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  errorMessage: string = '';
  // firstName: string = '';
  name: string = '';
  email: string = '';
  company: string = '';
  password: string = '';
  repeatPassword: string = '';
  role:String= 'client'

  constructor(private http: HttpClient, private router: Router) { }

  submitForm(event: Event): void {
    event.preventDefault(); // Empêche le comportement par défaut du formulaire

    // Vérifiez si les mots de passe correspondent
    if (this.password !== this.repeatPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas.';
      return;
    }

    // Créez un objet contenant les données du formulaire
    const formData = {
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role
    };
console.log("formulaire : ",formData);

    // Envoyez les données au backend via une requête HTTP
    this.http.post<any>('http://localhost:3000/api/auth/sign-up', formData).subscribe(
      response => {
        console.log('Réponse du serveur:', response);
        // Redirigez vers une autre page ou affichez un message de succès
        this.router.navigate(['/login']);
      },
      error => {
        console.error('Erreur lors de l\'inscription:', error);
        if (error.status === 400 && error.error.message === 'Cet email est déjà utilisé.') {
          this.errorMessage = 'Cet email est déjà utilisé.';
        } else {
          this.errorMessage = 'Erreur lors de l\'inscription. Veuillez réessayer.';
        }
      }
    );
  }
}
