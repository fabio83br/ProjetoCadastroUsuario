import { CombosService } from './../../combos.service';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Sexo } from 'src/app/Sexo';
import { Usuario } from 'src/app/usuario';
import { UsuariosService } from './../../usuarios.service'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  formulario: any;
  formFiltro: any;
  tituloFormulario: string;
  usuarios: Usuario[];
  nomeUsuario: string;
  usuarioId: number;
  sexos: Sexo[];
  nomeFiltro: string;
  ativofiltro: boolean;

  visibilidadeTabela: boolean = true;
  visibilidadeFormulario: boolean = false;

  modalRef: BsModalRef;

  constructor(private usuariosService: UsuariosService, private combosService: CombosService, private modalService: BsModalService) {
}

  ngOnInit(): void {
    this.usuariosService.PegarTodos().subscribe(resultado => {
      this.usuarios = resultado;
    });
    this.CarregarCombos();
  }

  CarregarCombos(): void {
    this.combosService.PegarSexoDescricao().subscribe(resultado => {
      this.sexos = resultado;
    })
  }

  ExibirFormularioCadastro(): void {
    this.CarregarCombos();
    this.visibilidadeTabela = false;
    this.visibilidadeFormulario = true;
    this.tituloFormulario = 'Novo Usuario';
    this.formulario = new FormGroup({
      nome: new FormControl(null),
      dataNascimento: new FormControl(null),
      email: new FormControl(null),
      senha: new FormControl(null),
      sexoId: new FormControl(null)

    });
  }

  ExibirFormularioAtualizacao(usuarioId): void {
    this.visibilidadeTabela = false;
    this.visibilidadeFormulario = true;
    this.usuariosService.PegarPeloId(usuarioId).subscribe(resultado => {
      this.tituloFormulario = `Atualizar ${resultado.nome}`;
      this.formulario = new FormGroup({
        usuarioId: new FormControl(resultado.usuarioId),
        nome: new FormControl(resultado.nome),
        dataNascimento: new FormControl(new Date(resultado.dataNascimento).toISOString().substring(0, 10)),
        email: new FormControl(resultado.email),
        senha: new FormControl(resultado.senha),
        ativo: new FormControl(resultado.ativo),
        sexoId: new FormControl(resultado.sexoId)
      });
    });
  }
  EnviarFormulario(): void {
    const usuario: Usuario = this.formulario.value;
    if (usuario.nome == null || usuario.email == null || usuario.dataNascimento == null || usuario.sexoId == null) {
      alert('Preencha os campos');
      return;
    }
    if (usuario.nome.length <= 3) {
      alert('Informe um nome maior que 3 caracteres.');
      return;
    }
    if (usuario.usuarioId > 0) {
      this.usuariosService.AtualizarUsuario(usuario).subscribe((registros) => {
        this.visibilidadeFormulario = false;
        this.visibilidadeTabela = true;

        alert('Usuário atualizado com sucesso');
        this.usuariosService.PegarTodos().subscribe(registros => {
          this.usuarios = registros;
        });
      });
    }
    else {
      this.usuariosService.SalvarUsuario(usuario).subscribe(resultado => {
        this.visibilidadeFormulario = false;
        this.visibilidadeTabela = true;

        alert('Usuário inserido com sucesso');
        this.usuariosService.PegarTodos().subscribe(registros => {
          this.usuarios = registros;
        });

      });
    }
  }
  Voltar(): void {
    this.visibilidadeTabela = true;
    this.visibilidadeFormulario = false;
  }
  ExibirConfirmacaoExclusao(usuarioId, nomeUsuario, conteudoModal: TemplateRef <any>): void
  {
    this.modalRef = this.modalService.show(conteudoModal);
    this.usuarioId = usuarioId;
    this.nomeUsuario = nomeUsuario
  }
  ExcluirUsuario(usuarioId){
    this.usuariosService.ExcluirUsuario(usuarioId).subscribe(resultado => {
      this.modalRef.hide();
      alert("Usuario excluído com sucesso");
      this.usuariosService.PegarTodos().subscribe(registros => {
        this.usuarios = registros;
      });
    });
  }

}
