import React, { Component } from 'react';
import { getToken, logout } from '../services/auth';
import api from '../services/api';
import { slide as Slide } from 'react-burger-menu';
import nexus_white from '../assets/logo_nexus2.png';
import { FaCog, FaRegThumbsUp, FaUpload, FaUserCog, FaUsers, FaUsersCog, FaWrench } from 'react-icons/fa';
import UserContext from '../UserContext';

export default class Menu extends Component {
    static contextType = UserContext;
    constructor(props) {
        super();
        this.state = {
            arrayPermissoes: []
        }

    }

    componentDidMount() {
        const userContext = this.context;
        this.listaPermissoes(userContext.user.id);
    }

    showSettings(event) {
        event.preventDefault();
    }

    listaPermissoes = async (id_usuario) => {
        try {
            const response = await fetch(`${api.baseURL}/usuarios/${id_usuario}/permissoes`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': getToken()
                }
            });

            const data = await response.json();
            console.log(data);
            if (data.status === 200) {
                this.setState({ arrayPermissoes: data.resultados });
            }

        } catch (error) {
            console.log(error);
        }
    };

    render() {
        const arrayPermissoes = this.state.arrayPermissoes;
        return (
            <Slide>
                <img id="logo" src={nexus_white} style={{ width: "100px", marginBottom: "14px" }} />
                {arrayPermissoes.length > 0 ? (
                    arrayPermissoes.map((item, index) => (
                        item.id_permissao === 1 ? (<a href={`/administrador`}><FaUserCog/> ADMINISTRADOR</a>) : ("") ||
                        item.id_permissao === 5 ? (<a href={`/bancas/orientadores`}><FaUpload/> {item.permissao.toUpperCase()}</a>) : ("") ||
                        item.id_permissao === 6 ? (<a href={`/bancas/orientandos`}><FaRegThumbsUp /> {item.permissao.toUpperCase()}</a>) : ("") ||
                        item.id_permissao === 7 ? (<a href={`/bancas/coordenadores`}><FaUsersCog/> {item.permissao.toUpperCase()}</a>) : ("") ||
                        item.id_permissao === 8 ? (<a href={`/bancas/diretor`}><FaCog/> {item.permissao.toUpperCase()}</a>) : ("") ||
                        item.id_permissao === 9 ? (<a href={`/eventos/enber/grupo_trabalho`}><FaCog/> {item.permissao.toUpperCase()}</a>) : ("") ||
                        item.id_permissao === 11 ? (<a href={`/convenios`}><FaUsers/> {item.permissao.toUpperCase()}</a>) : ("") ||
                        item.id_permissao === 12 ? (<a href={`/correcao_redacao`}><FaCog/> {item.permissao.toUpperCase()}</a>) : ("") ||
                        item.id_permissao === 15 ? (<a href={`/processo_credenciamento`}><FaCog/> {item.permissao.toUpperCase()}</a>) : ("") ||
                        <a href={`/${item.permissao.toLowerCase()}`}><FaWrench/> {item.permissao.toUpperCase()}</a>
                    ))
                ) : ("")}
                <a href="/" className="nav-link" onClick={() => logout()}>
                    <i className="nav-icon fas fa-sign-out-alt" />
                    Sair
                </a>
            </Slide>
        );
    }
}