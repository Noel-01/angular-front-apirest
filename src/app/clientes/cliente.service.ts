import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Cliente } from './cliente';
import swal from 'sweetalert2';
//import { CLIENTES } from './cliente.json';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint: string = 'http://localhost:8080/api/clientes';

  //Sin las cabeceras también funciona
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'})

  constructor(private http: HttpClient, private router: Router) { }

  getClientes(): Observable<Cliente[]>{
    //  return of(CLIENTES);
    return this.http.get(this.urlEndPoint).pipe(
      tap(response => {
        let clientes = response as Cliente[];
        console.log("ClienteService: tap 1, nombres en minuscula")
        clientes.forEach( cliente => {
          console.log(cliente.nombre);
        })
      }),
      map(response => {
        let clientes = response as Cliente[];
        return clientes.map(cliente => {
            cliente.nombre = cliente.nombre.toUpperCase();
            return cliente;
          }
        );
      }
    ),
    //Response ya es de tipo cliente porque lo he casteado antes
    tap(response => {
      console.log("ClienteService: tap 2, nombres en mayuscula")
      response.forEach( cliente => {
        console.log(cliente.nombre);
      })
    })
  );
}

  create(cliente: Cliente): Observable<any>{
    return this.http.post<any>(this.urlEndPoint, cliente, {headers:this.httpHeaders}).pipe(
      catchError(e => {

        if(e.status==400){
          return throwError(e);
        }

        console.error(e.error.mensaje);
        swal('Error al crear', e.error.mensaje, 'error')
        return throwError (e);
      })
    )
  }

  getCliente(id: number): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        swal('Error al editar', e.error.mensaje, 'error')
        return throwError (e);
      })
    );
  }

  update(cliente: Cliente): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers:this.httpHeaders}).pipe(
      catchError(e => {

        if(e.status==400){
          return throwError(e);
        }

        console.error(e.error.mensaje);
        swal('Error al actualizar', e.error.mensaje, 'error')
        return throwError (e);
      })
    )
  }

  delete(id:number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers:this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal('Error al borrar', e.error.mensaje, 'error')
        return throwError (e);
      })
    )
  }
}
