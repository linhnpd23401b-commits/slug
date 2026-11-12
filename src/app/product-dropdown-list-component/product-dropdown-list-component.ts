import { Component } from '@angular/core';
import { Product } from '../classes/IProduct';

@Component({
  selector: 'app-product-dropdown-list-component',
  standalone: false,
  templateUrl: './product-dropdown-list-component.html',
  styleUrl: './product-dropdown-list-component.css',
})
export class ProductDropdownListComponent {
  products:Product[]=[
      {id:1,name:"Iphone 14",price:30,image:"https://24hstore.vn/images/products/2024/08/07/large/iphone-15-hong_1723027399.jpg"},
      {id:2,name:"Samsung Galaxy S23",price:25,image:"https://cdn11.dienmaycholon.vn/filewebdmclnew/DMCL21/Picture//Apro/Apro_product_36051/samsung-galaxy-s25-ultra-5g-12gb256gb-trang-main-36051.png"},
      {id:3,name:"Samsung 8",price:45,image:"https://www.duchuymobile.com/images/detailed/94/galaxy-z-fold-8-ultra-tim.jpg"},
    ]
}
