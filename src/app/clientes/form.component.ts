import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import {Router, ActivatedRoute} from '@angular/router';
import swal from 'sweetalert2'

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  cliente: Cliente = new Cliente();
  titulo: string="Crear Cliente";
  errores: string[];

  constructor(private clienteService: ClienteService, private router:Router, private activateRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarCliente();
  }

  cargarCliente(): void {
    this.activateRoute.params.subscribe(params => {
      let id = params['id']
      if(id){
        this.clienteService.getCliente(id).subscribe(
          clienteResp => this.cliente = clienteResp
        )
      }
    })
  }

  // Coge los datos de cliente lo guarda y cuando llegue la respuesta del
  // back se redireccina a /clientes
  create(): void {
    this.clienteService.create(this.cliente)
    .subscribe(jsonCliente => {
      this.router.navigate(['/clientes'])
      swal('Nuevo Cliente', `${jsonCliente.mensaje}: ${jsonCliente.cliente.nombre}`, 'success')
    },
    err => {
      this.errores = err.error.errors as string[];
      console.error('Código del error desde el backend: ' + err.status)
      console.error(err.error.errors)
    }
  )
}

  update(): void {
    this.clienteService.create(this.cliente)
    .subscribe(jsonCliente => {
      this.router.navigate(['/clientes'])
      swal('Actualizado', `${jsonCliente.mensaje}: ${jsonCliente.cliente.nombre}`, 'success')
    },
    err => {
      this.errores = err.error.errors as string[];
      console.error('Código del error desde el backend: ' + err.status)
      console.error(err.error.errors)
    }
  )
}

}
