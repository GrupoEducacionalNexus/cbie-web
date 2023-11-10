import React, { Component } from 'react';
import { Container, Form, Img } from './styles';
import Logo from '../../assets/cbie2.png';
import api from '../../services/api';
import { setToken, setRole, setNome } from '../../services/auth';
import UserContext from '../../UserContext';

export default class Login extends Component {

    static contextType = UserContext;

    constructor(props) {
        super();
        this.state = {
            id: 0,
            email: '',
            senha: '',
            error: ''
        }
    }


    handlerLogin = async e => {
        e.preventDefault()

        const { email, senha } = this.state;

        if (!email || !senha) {
            this.setState({ error: "Por favor, preencher todos os campos." });
        } else {
            try {
                const response = await fetch(`${api.baseURL}/login`, {
                    method: 'POST',
                    headers: {
                        
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email,
                        senha: senha
                    })
                });

                const data = await response.json();
                console.log(data);

                if (data.status === 200) {
                    setToken(data.token);
                    setRole(data.id_permissao);
                    setNome(data.nome);


                    const userData =
                    {
                        auth: data.auth,
                        id: data.id,
                        email: data.email,
                        id_permissao: data.id_permissao,
                        id_setor: data.id_setor

                    }
                    this.context.setUser(userData);

                    if (data.papel.toLowerCase() === "secretaria") {
                        this.props.history.push("/secretaria");
                    }
                    
                }

                if (data.status === 400) {
                    this.props.history.push("/");
                    this.setState({ error: data.msg })
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    render() {
        return (
            <Container>
                <img src={Logo} style={{ display: "block", margin: "0 auto" }} className="mt-3 mb-3" />
                <h1 className='titulo'>Cbie</h1>
                <Form onSubmit={this.handlerLogin}>
                    <div class="form-group mb-3">
                        <label htmlFor="email">EMAIL:</label>
                        <input className="form-control form-control-sm" type="email" placeholder="Email" name="email"
                            onChange={e => this.setState({ email: e.target.value })} />
                    </div>

                    <div class="form-group">
                        <label htmlFor="nome">SENHA:</label>
                        <input className="form-control form-control-sm" type="password" placeholder="Senha" name="senha"
                            onChange={e => this.setState({ senha: e.target.value })} />
                    </div>

                    {this.state.error && <div className="alert alert-danger text-center mt-2" role="alert">{this.state.error}</div>}

                    <button className="button btn-block mt-4" type="submit">Entrar</button>
                </Form>
            </Container>
        )
    }
}