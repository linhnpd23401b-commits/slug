import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CourseRegistration } from '../classes/CourseRegistration';

@Component({
  selector: 'app-course-registration-component',
  standalone: false,
  templateUrl: './course-registration-component.html',
  styleUrl: './course-registration-component.css',
})
export class CourseRegistrationComponent {
  /*onSubmit(form:NgForm)
  {
    if(form.valid)
    {
      alert(JSON.stringify(form.value))
      let info=form.value
      alert(info.email)
    } 
  }*/
  courseModel=new CourseRegistration()
  onSubmit()
  {
    let infor=this.courseModel.getInfor()
    alert(infor)
  }
}
