import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, throwError, tap, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000'; // L'URL de votre API backend
  private userPointsSubject = new BehaviorSubject<number>(0);
  userPoints$ = this.userPointsSubject.asObservable();
  constructor(private router: Router, private http: HttpClient) { } // Ajout de "private" pour http

  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/auth/sign-in`, credentials).pipe(
      tap((response:any) => {
        if (response.msg === 'success') {
          localStorage.setItem("userconnect", JSON.stringify(response.user));
          localStorage.setItem("token", response.token);
          localStorage.setItem("point", response.user.points);
          localStorage.setItem("state", "0");
        }
      }),
      catchError(error => {
        console.error('Error during login', error);
        return of({ user: null, error: 'Invalid credentials' });
      })
    );
  }
  updateUserPoints(userId: any, points: number) {
    return this.http.put(`${this.apiUrl}/users/update-points/${userId}`, { points });
  }
  // Method to update user points locally and notify subscribers
  // updateLocalUserPoints(points: number) {
  //   this.userPointsSubject.next(points);
  // }

  // // Method to get user points
  // getUserPoints(): number {
  //   return this.userPointsSubject.value;
  // }
  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData);
 }

  logout(){
    localStorage.removeItem('state');

    this.router.navigate(['/']);
    localStorage.removeItem('isLogged');
  }
  isLoggedIn(){
    // return localStorage.getItem('isLogged');
    return localStorage.getItem('state') === '0';


    // return localStorage.getItem('isLogged') === 'true';

  }

  getAllProduct(){
    return this.http.get(`${this.apiUrl}/products`)
  }


  addCmd(data: any): Observable<any> {
    return this.http.post<any>(`http://localhost:3000/cmd/createCmd`, data);
 }





// Add a new recompense
addRecompense(recompense: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/api/recompense`, recompense);
}

// Get all recompenses
getAllRecompenses(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/api/recompense`);
}

// Get a recompense by ID
getRecompenseById(recompenseId: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/api/recompense/${recompenseId}`);
}

// Update a recompense
updateRecompense(recompenseId: string, recompense: any): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}/api/recompense/${recompenseId}`, recompense);
}

// Delete a recompense
deleteRecompense(recompenseId: string): Observable<any> {
  return this.http.delete<any>(`${this.apiUrl}/api/recompense/${recompenseId}`);
}



}
