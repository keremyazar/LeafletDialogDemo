import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AtlantaService {

  constructor(private http: HttpClient){}

  getAll(): Observable<any> {
    return this.http.get('assets/data/atlanta.json');
  }

}
