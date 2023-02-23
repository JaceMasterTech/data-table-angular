import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const URL = 'http://ndiazproduction-env.eba-vwdsag7x.us-east-2.elasticbeanstalk.com';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {}

  public token:string = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI4NDk2MjY2NCIsInJvbGVzIjpbIlJPTEVfQURNSU4iLCJST0xFX1NVUEVSVklTT1IiLCJST0xFX1NVUEVSX0FETUlOIiwiUk9MRV9WRU5ERURPUiJdLCJpc3MiOiJodHRwOi8vbmRpYXpwcm9kdWN0aW9uLWVudi5lYmEtdndkc2FnN3gudXMtZWFzdC0yLmVsYXN0aWNiZWFuc3RhbGsuY29tL2xvZ2luIiwiZXhwIjoxNjc4NDAyODEzfQ.XIXmhmJCbH862so1EjCsReZ9nEnDygg89jg5TJV43Qk';

  getData(pageSize: Number, pageNumber: Number): Promise<any> {
    // const url = "http://localhost:8081/api/library/book/search?size="+pageSize+"&page="+pageNumber;
    if (pageNumber === 0) {
      pageNumber = 1;
    }
    const path = "usuario?page="+pageNumber+"&size="+pageSize;

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token
    });

    return new Promise((resolve, reject) => {
      this.http.get<any>(`${ URL }/${ path }`, { headers: headers })
      .subscribe({
        next: (response: any) => {
          resolve(response);
        },
        error: (error: any) => {
          reject(error);
        }
      });
    });
  }

}
