import { Component } from '@angular/core';

@Component({
  selector: 'app-binding-property-component',
  standalone: false,
  templateUrl: './binding-property-component.html',
  styleUrl: './binding-property-component.css',
})
export class BindingPropertyComponent {
  public name: string = 'Tèo Đại Bàng';
  public email: string = "longlanh@hotmail.com";
  public nameid:string="nameid";
  public emailid:string="emailid"
  public isDisabled: boolean = false;
  public hello: string = "Hello!!!!!!";
}
