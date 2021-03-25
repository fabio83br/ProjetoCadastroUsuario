import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sexo } from './Sexo';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class CombosService {

  url = 'https://localhost:44335/api/combos';

  constructor(private http: HttpClient) { }

  PegarSexoDescricao(): Observable<Sexo[]> {
    return this.http.get<Sexo[]>(this.url);
  }

}
