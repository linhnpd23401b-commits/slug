import { Component } from '@angular/core';
import { UserLogin } from '../classes/UserLogin';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-component',
  standalone: false,
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent {
  // Khởi tạo model để binding
  user = new UserLogin();
  message = '';
  constructor(private http: HttpClient, private router: Router) {}

  onLogin() {
    this.http.post('/user-login', this.user, { withCredentials: true }).subscribe({
      next: () => {
        localStorage.setItem('isLoggedIn', 'true');
        this.router.navigateByUrl('/lazyinfor');
      },
      error: err => { this.message = err.error?.message || 'Không thể kết nối server.'; }
    });
  }
}


