import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular'; // Uvozi samo ovo
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule,
    IonicModule 
  ]
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;

  constructor(private router: Router) {
    this.registerForm = new FormGroup({
      name: new FormControl('Jovana', Validators.required),
      surname: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl(null, [Validators.required, Validators.minLength(6)])
    });
  }

  ngOnInit() {}

  onRegister() {
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);
      this.router.navigateByUrl('/travel');
    }
  }
}