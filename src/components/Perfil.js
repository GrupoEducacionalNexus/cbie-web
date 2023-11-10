import { FaRegEdit } from 'react-icons/fa';
import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import styled from 'styled-components';
import api from '../services/api';
import { getToken, logout } from '../services/auth';
import UserContext from '../UserContext';
import Button from 'react-bootstrap/Button';
import { Col, Row } from 'react-bootstrap';

export default class Perfil extends Component {
  static contextType = UserContext;

  constructor(props) {
    super();
    this.state = {
      success: '',
      error: '',
      modalShowEditarUsuario: false,

      //Informações do usuário
      id_usuario: 0,
      nome: '',
      email: '',
      id_setor: 0,
      cpf_cnpj: '',
      senha: '',
      confirmarSenha: ''
    }
  }

  componentDidMount() {
    this.buscarPerfil(getToken());
  }

  setModalShowEditarUsuario(valor) {
    this.setState({ modalShowEditarUsuario: valor, success: '', error: '' });
  }

  handlerShowModalEditarUsuario() {
    this.setModalShowEditarUsuario(true);

  }

  handlerCloseModalEditarUsuario() {
    this.setModalShowEditarUsuario(false);
    this.setState({
      success: '', error: ''
    })
  }

  buscarPerfil = async (token) => {
    try {
      const response = await fetch(`${api.baseURL}/usuarios/${token}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
      });

      const data = await response.json();

      if (data.status === 200) {
        this.setState({
          id_usuario: data.resultados[0].id,
          nome: data.resultados[0].nome,
          email: data.resultados[0].email,
          cpf_cnpj: data.resultados[0].cpf,
          senha: data.resultados[0].senha,
          confirmarSenha: data.resultados[0].senha
        });
      }

      if (data.permissoes === false) {
        logout();
        this.props.history.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  }

  atualizarPerfil = async (e) => {
    e.preventDefault();
    this.setState({ sucess: '', error: '' });
    const id_usuario = this.state.id_usuario;
    const nome = this.state.nome;
    const email = this.state.email;
    const cpf_cnpj = this.state.cpf_cnpj;
    const senha = this.state.senha;
    const confirmarSenha = this.state.confirmarSenha;

    const senhaInvalida = senha !== confirmarSenha ? true : false;

    if (!nome || !email || !senha || !confirmarSenha) {
      this.setState({ error: 'Por favor, preencher todos os campos.' });
    } else if (senhaInvalida) {
      this.setState({ error: 'Por favor, informe senhas iguais.' });
    } else {
      try {
        const response = await fetch(`${api.baseURL}/usuarios/${this.context.user.id}`, {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': getToken()
          },
          body: JSON.stringify({
            nome,
            cpf_cnpj,
            email,
            senha
          }),
        });

        const data = await response.json();
        console.log(data)

        if (data.status === 200) {
          this.setState({ success: data.msg });
        }

        if (data.status === 400) {
          this.setState({ error: data.msg });
        }
      } catch (error) {
        console.log(error)
        this.setState({ error: 'Ocorreu um erro' });
      }
    }
  };

  render() {
    return (
      <div>
        <button className="button" size="sm" onClick={() => this.handlerShowModalEditarUsuario()}>Perfil</button>
        <Modal
          show={this.state.modalShowEditarUsuario}
          onHide={() => this.handlerCloseModalEditarUsuario()}
          aria-labelledby="contained-modal-title-vcenter"
          backdrop="static"
          size='md'>
          <Modal.Header closeButton>
            <h4 className='titulo'>Meu Perfil</h4>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <div className="form-group">
                <label htmlFor="nome">Nome</label>
                <input
                  type="text"
                  className="form-control"
                  id="nome"
                  placeholder="Digite seu nome"
                  onChange={(e) =>
                    this.setState({ nome: e.target.value })
                  }
                  value={this.state.nome}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Informe o seu email"
                  onChange={(e) =>
                    this.setState({ email: e.target.value })
                  }
                  value={this.state.email}
                />
              </div>

              <div className="form-group">
                <label htmlFor="select_Usuario">CPF</label>
                <input
                  className="form-control"
                  type="number"
                  placeholder="CPF"
                  name="cpf"
                  onChange={(e) =>
                    this.setState({ cpf_cnpj: e.target.value })
                  }
                  value={this.state.cpf_cnpj}
                />
              </div>

              <Row>
                <Col>
                  <div className="form-group">
                    <label htmlFor="senha">Senha</label>
                    <input
                      type="password"
                      className="form-control"
                      id="senha"
                      placeholder="Informe sua senha"
                      onChange={(e) =>
                        this.setState({ senha: e.target.value })
                      }
                      value={this.state.senha}
                    />
                  </div>
                </Col>
                <Col>
                  <div className="form-group">
                    <label htmlFor="repetir_senha">Repetir Senha</label>
                    <input
                      type="password"
                      className="form-control"
                      id="repetir_senha"
                      placeholder="Informe sua senha novamente"
                      onChange={(e) =>
                        this.setState({ confirmarSenha: e.target.value })
                      }
                      value={this.state.confirmarSenha}
                    />
                  </div>
                </Col>
              </Row>

              {this.state.success && (
                <div class="alert alert-success text-center" role="alert">
                  {this.state.success}
                </div>
              )}
              {this.state.error && (
                <div className="alert alert-danger text-center" role="alert">
                  {this.state.error}
                </div>
              )}
            </Form>
          </Modal.Body>

        </Modal>
      </div >
    );
  }
}


export const Form = styled.form``;
