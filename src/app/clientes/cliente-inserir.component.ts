import { Component, OnInit} from '@angular/core'
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Cliente } from './cliente.model';
import { ClienteService } from './cliente.service';
@Component({
  selector:'app-cliente-inserir',
  templateUrl:'./cliente-inserir.component.html',
  styleUrls:['./cliente-inserir.component.css']
})

export class ClienteInserirComponent implements OnInit{

  private modo: string = 'criar'
  private idCliente: string
  public cliente: Cliente
  constructor(
    public clienteService: ClienteService,
    public route: ActivatedRoute
  ) {

  }

  ngOnInit(){
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('idCliente')){
        this.modo = "editar"
        this.idCliente = paramMap.get('idCliente')
        this.cliente = this.clienteService.getCliente(this.idCliente)
      }
      else{
        this.modo = "criar"
        this.idCliente = null
      }
    })

  }

  onAdicionarCliente(form: NgForm){
    if (form.invalid){
      return;
    }
    this.clienteService.adicionarCliente(
      form.value.nome,
      form.value.fone,
      form.value.email
    );
    form.resetForm();
  }
}
