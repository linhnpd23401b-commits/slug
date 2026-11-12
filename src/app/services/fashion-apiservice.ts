import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Fashion } from '../classes/Fashion';

@Injectable({
  providedIn: 'root',
})
export class FashionAPIService {
    headers=new HttpHeaders().set("Content-Type","application/json;charset=utf-8")
    requestOptions:Object={
        headers:this.headers,
        responseType:"text"
      }
    constructor(private _http: HttpClient) { }  
    getFashionByIdF(id: number): Observable<Fashion> {
      return this._http.get<Fashion>('/fashions/by-idf/' + id).pipe(catchError(this.handleError));
    }
    postFashion(fashion: Fashion): Observable<Fashion> {
      const { _id, ...data } = fashion;
      return this._http.post<Fashion>('/fashions', data).pipe(catchError(this.handleError));
    }
    getFashions():Observable<any>
    {      
      return this._http.get<any>("/fashions",this.requestOptions).pipe(
          map(res=>JSON.parse(res) as Array<Fashion>),
          
          catchError(this.handleError))
    }
    handleError(error:HttpErrorResponse){
      return throwError(()=>new Error(error.error?.message || error.message))
    }
    getFashion(id:string):Observable<any>
    {
      return this._http.get<any>("/fashions/"+id,this.requestOptions).pipe(
          map(res=>JSON.parse(res) as Fashion),
          
          catchError(this.handleError))
    }
    putFashion(aFashion:any):Observable<any>
    {
      let jsonString=JSON.stringify(aFashion)
      return this._http.put<any>("/fashions",jsonString,this.requestOptions).pipe(
          map(res=>JSON.parse(res) as Fashion),
          
          catchError(this.handleError))
    }
    deleteFashion(fashionId:string):Observable<any>
    {
      return this._http.delete<any>("/fashions/"+fashionId,this.requestOptions).pipe(
          map(res=>JSON.parse(res) as Fashion),
          
          catchError(this.handleError))
    }
}
