import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './product-list-component/product-list-component';
import { ProductDropdownListComponent } from './product-dropdown-list-component/product-dropdown-list-component';
import { ProductListCallServiceComponent } from './product-list-call-service-component/product-list-call-service-component';
import { ProductListCallHttpServiceComponent } from './product-list-call-http-service-component/product-list-call-http-service-component';
import { ProductDetailComponent } from './product-detail-component/product-detail-component';
import { ProductListAdvancedComponent } from './product-list-advanced-component/product-list-advanced-component';
import { ProductListSearchComponent } from './product-list-search-component/product-list-search-component';
import { PageNotFoundComponent } from './page-not-found-component/page-not-found-component';
import { Contact } from './contact/contact';
import { LazyComponent } from './lazy-component/lazy-component';
import { authGuard } from './classes/auth.guard';
import { CourseRegistrationComponent } from './course-registration-component/course-registration-component';
import { LoginComponent } from './login-component/login-component';
import { CourseRegistrationReactiveComponent } from './course-registration-reactive-component/course-registration-reactive-component';
import { FakeProductComponent } from './fake-product-component/fake-product-component';
import { BooksComponent } from './books-component/books-component';
import { BookNewComponent } from './book-new-component/book-new-component';
import { BookDetailComponent } from './book-detail-component/book-detail-component';
import { BookUpdateComponent } from './book-update-component/book-update-component';
import { BookDeleteComponent } from './book-delete-component/book-delete-component';
import { FashionComponent } from './fashion-component/fashion-component';
import { SearchFashion } from './search-fashion/search-fashion';
import { FashionNewComponent } from './fashion-new-component/fashion-new-component';
import { FashionUpdateComponent } from './fashion-update-component/fashion-update-component';
import { FashionDeleteComponent } from './fashion-delete-component/fashion-delete-component';
import { GroupCustomersComponent } from './group-customers-component/group-customers-component';
import { FashionDetailComponent } from './fashion-detail-component/fashion-detail-component';

const routes: Routes = [
  {path:"group-customers",component:GroupCustomersComponent},
  {path:"learn-directive",component:ProductListComponent},
  {path:"product-dropdown-list",component:ProductDropdownListComponent},
  {path:"product-list-call-service",component:ProductListCallServiceComponent},
  {path:"product-list-call-http-service",component:ProductListCallHttpServiceComponent},
  {path:"products/:id",component:ProductDetailComponent},
  {path:"products",component:ProductListAdvancedComponent},
  {path:"search-product",component:ProductListSearchComponent},
  {path:"books",component:BooksComponent},
  {path:"books-list",component:BooksComponent},
  {path:"book-detail",component:BookDetailComponent},
  {path:"book-new",component:BookNewComponent},
  {path:"book-update",component:BookUpdateComponent},
  {path:"book-delete",component:BookDeleteComponent},
  {path:"fashion-list",component:FashionComponent},
  {path:"search-fashion",component:SearchFashion},
  {path:"fashion-new",component:FashionNewComponent},
  {path:"fashion-detail/:slug",component:FashionDetailComponent},
  {path:"fashion-detail",redirectTo:"fashion-list",pathMatch:"full"},
  {path:"fashion-update",component:FashionUpdateComponent},
  {path:"fashion-delete",component:FashionDeleteComponent},
  {
    path:"sample-nested",component:ProductListAdvancedComponent,
    children:[
      {path:"search-child",component:ProductListSearchComponent},
      {path:"detail/:id",component:ProductDetailComponent}
    ]
  },
  {
    path:"lazyinfor",
    loadComponent:()=>
      import("./lazy-component/lazy-component")
      .then(c=>c.LazyComponent),
      canActivate:[authGuard]    
  },
  {path:'course-register',component:CourseRegistrationComponent},
  {path:'course-reactive-register',component:CourseRegistrationReactiveComponent},
  {path:"contacts",component:Contact},
  {path:"login",component:LoginComponent},
  {path:"fakeproducts",component:FakeProductComponent},
  {path:"",component:Contact},
  {path:"**",component:PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
