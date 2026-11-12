import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-course-registration-reactive-component',
  standalone: false,
  templateUrl: './course-registration-reactive-component.html',
  styleUrl: './course-registration-reactive-component.css',
})
export class CourseRegistrationReactiveComponent {
  public regForm: FormGroup = new FormGroup(
    {
      name: new FormControl('Nguyễn Thị Long Lanh',
        [Validators.required,Validators.minLength(3),this.customValidator]),
      email: new FormControl('longlanh@st.uele.du.vn',
        [Validators.required,Validators.email]),
      password: new FormControl('123',[Validators.required,Validators.minLength(8)]),
      confirmPass: new FormControl('123',[Validators.required,Validators.minLength(8)]),
    }
  );
setDefaultValues() {
    this.regForm.patchValue({
      name: 'Trần Duy Thanh',
      email: 'thanhtd@uel.edu.vn'
    });
}
  customValidator(control: AbstractControl): {[key: string]: any } | null 
  {
    const matchName=/[@#$%^&]/g.test(control.value)
    return matchName ? { 'nameNotMatch': {value:control.value} } : null;
  }
}