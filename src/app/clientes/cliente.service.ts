import { Injectable } from "@angular/core";
import { Cliente } from "./cliente.model";
import { Subject } from "rxjs";
import { map } from 'rxjs/operators';
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private clientes: Cliente[] = [];
  private listaClientesAtualizada = new Subject<Cliente[]>();

  constructor(private httpClient: HttpClient){}

  getCliente (idCliente: string){
    return {...this.clientes.find(cli => cli.id === idCliente)}
  }

  getClientes(): void {
    this.httpClient.get<{mensagem: string,
      clientes: any}>('http://localhost:3000/api/clientes')
      // {_id: 1, nome: Ana, fone: 111, email: ana@email.com} => {id: 1, nome: Ana, fone: 111, email: ana@email.com}
      .pipe(map((dados) => {
        return dados.clientes.map((cliente => {
          return {
            id: cliente._id,
            nome: cliente.nome,
            fone: cliente.fone,
            email: cliente.email
          }
        }))  
      }))      
      .subscribe(
        (clientes) => {
          this.clientes = clientes;
          this.listaClientesAtualizada.next([...this.clientes]);
        }
      )
  }

  adicionarCliente(nome: string, fone: string, email:string){
    const cliente: Cliente = {
      nome: nome,
      fone: fone,
      email: email,
    };
    this.httpClient.post<{mensagem: string, id: string}>('http://localhost:3000/api/clientes',
    cliente).subscribe(
      (dados) => {
        cliente.id = dados.id
        this.clientes.push(cliente);
        this.listaClientesAtualizada.next([...this.clientes]);
      }
    )
  }

  getListaDeClientesAtualizadaObservable(){
    return this.listaClientesAtualizada.asObservable();
  }

  //implementar o método removerCliente
  //ele recebe o id
  //faz a requisição http adequada usando o httpClient
  //exibe uma mensagem confirmando que o cliente de id tal foi removido
  removerCliente(id: string): void {
    this.httpClient.delete(`http://localhost:3000/api/clientes/${id}`).subscribe(() => {
      this.clientes = this.clientes.filter(cli => cli.id !== id)
      this.listaClientesAtualizada.next([...this.clientes])  
    })
  }
}
