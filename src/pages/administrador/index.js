import { FaUserGraduate, FaLayerGroup, FaRegEdit, FaRegPlusSquare, FaRegSave, FaPencilAlt, FaShieldAlt, FaWpforms, FaClipboardList, FaBookMedical, FaBookReader, FaRegWindowClose } from 'react-icons/fa';
import React, { Component } from 'react';
import styled from 'styled-components';
import api from '../../services/api';
import { getToken } from '../../services/auth';
import Modal from 'react-bootstrap/Modal';
import { Col, Container, Row, Spinner } from 'react-bootstrap';
import { Tabs, Tab } from 'react-bootstrap';
import { listaDeSetores } from '../../services/getListaDeSetores';
import { listaDePrioridades } from '../../services/getListaDePrioridades';
import Menu from '../../components/Menu';
import backgroundImage from '../../assets/sistema_chamados.png';
import UserContext from '../../UserContext';
import FloatingMenu from '../../components/FloatingMenu';

export default class Index extends Component {
	static contextType = UserContext;

	constructor(props) {
		super();

		this.state = {
			modalShowAtualizarUsuario: false,
			modalShowCadastrarEAtualizarTipoChamado: false,
			keyTab: 'Checklist',
			success: '',
			error: '',
			arrayUsuarios: [],
			arrayPermissoes: [],
			permissoes_usuario: [],
			arraySetores: [],
			arrayPrioridades: [],
			arrayTiposChamados: [],

			//Dados do tipo de chamado
			id_tipoChamado: "",
			tipo_chamado: "",
			idSetorResponsavel: 0,

			//Dados do usuário
			id_usuario: 0,
			nome: '',
			email: '',
			cpf_cnpj: '',
			senha: '',
			confirmarSenha: '',
			id_setor: 0,
			idSetorResponsavel: 0,


		};
	}

	componentDidMount() {
		const user = this.context
		this.listaDeUsuarios(getToken());
		this.listaDeTiposDeChamados(getToken());
		this.listaPermissoes();
	}

	componentDidUpdate() {
		this.marcarPermissoes();
	}

	setModalShowAtualizarUsuario(valor) {
		this.setState({ modalShowAtualizarUsuario: valor, success: '', error: '' });
	}

	handlerShowModalAtualizarUsuario(usuario = null) {
		this.setModalShowAtualizarUsuario(true);
		this.setState({
			id_usuario: usuario.id, nome: usuario.nome, email: usuario.email,
			cpf_cnpj: usuario.cpf_cnpj, senha: usuario.senha, confirmarSenha: usuario.senha, id_setor: usuario.id_setor
		});
		listaDeSetores(getToken()).then(result => this.setState({ arraySetores: result }));
		this.listaPermissoesDoUsuario(usuario.id);
	}

	handlerCloseModalAtualizarUsuario() {
		this.setModalShowAtualizarUsuario(false);
	};

	setModalShowCadastrarEAtualizarTipoChamado(valor) {
		this.setState({ modalShowCadastrarEAtualizarTipoChamado: valor, success: '', error: '' });
	}

	handlerShowModalCadastrarEAtualizarTipoChamado(tipo_chamado = null) {
		this.setModalShowCadastrarEAtualizarTipoChamado(true);
		listaDeSetores(getToken()).then(result => this.setState({ arraySetores: result }));
		listaDePrioridades(getToken()).then(result => this.setState({ arrayPrioridades: result }));

		if (tipo_chamado !== null) {
			this.setState({
				id_tipoChamado: tipo_chamado.id,
				tipo_chamado: tipo_chamado.tipo,
				idSetorResponsavel: tipo_chamado.idSetorResponsavel
			});
			return;
		}

		this.setState({
			id_tipoChamado: 0,
			tipo_chamado: "",
			idSetorResponsavel: 0
		});
	}

	handlerCloseModalCadastrarEAtualizarTipoChamado() {
		this.setModalShowCadastrarEAtualizarTipoChamado(false);
	};

	listaDeUsuarios = async (token) => {
		try {
			const response = await fetch(`${api.baseURL}/usuarios`,
				{
					method: 'GET',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
						'x-access-token': token
					}
				}
			);
			const data = await response.json();
			if (data.status === 200) {
				this.setState({ arrayUsuarios: data.resultados });
			}
		} catch (error) {
			console.log(error);
		}
	};


	listaPermissoes = async () => {
		try {
			const response = await fetch(`${api.baseURL}/permissoes`, {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				}
			});

			const data = await response.json();
			if (data.status === 200) {
				this.setState({ arrayPermissoes: data.resultados });
			}

		} catch (error) {
			console.log(error);
		}
	};

	listaPermissoesDoUsuario = async (id_usuario) => {
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
				this.setState({ permissoes_usuario: data.resultados });
			}

		} catch (error) {
			console.log(error);
		}
	};


	definirPermissao = async (id_usuario, id_permissao) => {
		try {
			const response = await fetch(`${api.baseURL}/permissoes/${id_permissao}/usuarios`, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'x-access-token': getToken()
				},
				body: JSON.stringify({
					id_usuario
				})
			});

			const data = await response.json();

			if (parseInt(data.status) === 200) {
				this.setState({ success: data.msg });
				if (data.checked === 0) {
					let index = this.state.permissoes_usuario.findIndex(valor => valor === id_permissao);
					if (index > -1) {
						this.state.permissoes_usuario.splice(index, 1);
						console.log(this.state.permissoes_usuario);
						document.getElementById(`checkPermissao_${id_permissao}`).checked = false;
					}
				}

				this.listaDeUsuarios(getToken());
			}

			if (parseInt(data.status) === 400) {
				this.setState({ error: data.msg });
			}
		} catch (error) {
			console.log(error);
		}
	}

	marcarPermissoes() {
		if (this.state.permissoes_usuario.length > 0) {
			this.state.permissoes_usuario.map(permissao => {
				document.getElementById(`checkPermissao_${permissao.id_permissao}`).checked = true;
				console.log(permissao);
			});

		}
	}

	cadastrarEatualizarTipoChamado = async (e) => {
		e.preventDefault();
		this.setState({ success: "", error: "" });
		const { id_tipoChamado, tipo_chamado, idSetorResponsavel } = this.state;

		if (!tipo_chamado || !idSetorResponsavel) {
			this.setState({ error: "Por favor, preecher todos os campos!" });
			return;
		}

		const response = await fetch(`${api.baseURL}/tipos_chamados${id_tipoChamado !== 0 ? `/${id_tipoChamado}` : ``}`, {
			method: id_tipoChamado !== 0 ? 'PUT' : 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'x-access-token': getToken(),
			},
			body: JSON.stringify({
				nome: tipo_chamado, idSetorResponsavel
			})
		});

		const data = await response.json();

		if (parseInt(data.status) === 200) {
			this.setState({ success: data.msg });
			this.listaDeTiposDeChamados(getToken());
		}

		if (parseInt(data.status) === 400) {
			this.setState({ error: data.msg });
		}
	}

	listaDeTiposDeChamados = async (token) => {
		try {
			const response = await fetch(`${api.baseURL}/tipos_chamados`,
				{
					method: 'GET',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
						'x-access-token': token
					}
				}
			);
			const data = await response.json();
			if (data.status === 200) {
				this.setState({ arrayTiposChamados: data.resultados });
			}
		} catch (error) {
			console.log(error);
		}
	};

	atualizarUsuario = async (e) => {
		e.preventDefault();

		const { id_usuario, nome, email, cpf_cnpj, senha, confirmarSenha, id_setor } = this.state;
		console.log(id_usuario, nome, email, cpf_cnpj, senha, confirmarSenha);

		if (!nome || !email || !cpf_cnpj) {
			this.setState({ error: "Por favor, preencher todos campos" });
			return;
		}

		if (senha !== confirmarSenha) {
			this.setState({ error: "Por favor, preencher todos campos" });
			return;
		}

		try {
			const response = await fetch(`${api.baseURL}/usuarios/${id_usuario}`, {
				method: 'PUT',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'x-access-token': getToken(),
				},
				body: JSON.stringify({
					nome, email, cpf_cnpj, senha, id_setor
				})
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
			console.log(error);
		}
	}


	render() {
		const arrayUsuarios = this.state.arrayUsuarios;
		const arrayPermissoes = this.state.arrayPermissoes;

		return (
			<Container fluid style={{
				backgroundImage: `url(${backgroundImage})`,
				backgroundSize: "100% 100%",
				backgroundRepeat: 'no-repeat',
				padding: '0px',
				minHeight: '100vh'
			}}>
				<Menu />
				<Row>
					<Col xs={12}>

					</Col>
				</Row>
				<Row>
					<Col xs={12} id="main">
						<FloatingMenu>
							<ul className="dropdown-menu">
								{/* <li>
										<a onClick={() => this.handlerShowModalCadastrarChamado()}><FaPlus /> Solicitar chamado</a>
									</li>
									<li>
										<a onClick={() => this.handlerShowModalFiltrarChamado()}><FaPlus /> Filtrar chamado</a>
									</li>
									<li>
										<a onClick={() => this.handlerShowModalCadastrarTipoChamado()}><FaPlus /> Tipos de chamado</a>
									</li>

									{this.context.user.id_permissao.includes(14) ? (
										<li>
											<a onClick={() => this.handlerShowModalVisualizarSetores()}><FaPlus /> Diretoria</a>
										</li>
									) : ("")} */}

							</ul>
						</FloatingMenu>

						<div className='container mt-4 mb-4'>
							<Tabs
								defaultActiveKey="home"
								id="tap-memu-admin"
								className="justify-content-center mb-3"
								variant='pills'>
								<Tab eventKey="home" title="Usuários">
									<h2 className='lead text-light'><FaUserGraduate /> Usuários</h2>
									<hr />
									<div className="table-responsive table-sm">
										<div class="table-wrapper">
											<table className="table table-bordered table-light table-hover text-center">
												<thead className="thead-light">
													<tr>
														<th scope="col" >Id</th>
														<th scope="col" >Cpf/cnpj</th>
														<th scope="col" >Nome</th>
														<th scope="col" >email</th>
														<th scope="col" >Status</th>
														<th scope="col" >Data e hora de criação</th>
														<th scope='col'>Ações</th>
													</tr>
												</thead>
												<tbody>
													{arrayUsuarios.length > 0 ? (
														arrayUsuarios.map((usuario, index) => (
															<tr key={index}>
																<td >{usuario.id}</td>
																<td >{usuario.cpf_cnpj}</td>
																<td >{usuario.nome}</td>
																<td >{usuario.email}</td>
																<td >{usuario.status}</td>
																<td >{usuario.dataHoraCriacao}</td>
																<td ><button className='button'
																	onClick={() => this.handlerShowModalAtualizarUsuario(usuario)}>
																	Atualizar
																</button></td>
															</tr>
														))
													) :
														(<tr className="text-center">
															<td colSpan="15">
																<Spinner animation="border" />
															</td>
														</tr>)
													}
												</tbody>
											</table>
										</div>
									</div>
								</Tab>
								<Tab eventKey="tipos_chamados" title="Tipos de chamados">

									<div className='row'>
										<div className='col-sm-10'>	<h2 className='lead text-light'><FaUserGraduate /> Tipos de chamados</h2></div>
										<div className='col-sm-2 text-right'><button className='button' onClick={() => this.handlerShowModalCadastrarEAtualizarTipoChamado()}>Cadastrar</button></div>
									</div>

									<hr />

									<div className="table-responsive table-sm">
										<div class="table-wrapper">
											<table className="table table-bordered table-hover text-center table-light">
												<thead className="thead-light">
													<tr>
														<th scope="col" >Id</th>
														<th scope="col" >Nome</th>
														<th scope="col" >Setor responsável</th>
														<th scope="col" >Data e hora de criação</th>
														<th scope='col'>Ações</th>
													</tr>
												</thead>
												<tbody>
													{this.state.arrayTiposChamados.length > 0 ? (
														this.state.arrayTiposChamados.map(tipo_chamado => (
															<tr key={tipo_chamado.id} title="Clique aqui para obter mais informações sobre o tipo de chamado">
																<td>{tipo_chamado.id}</td>
																<td>{tipo_chamado.tipo}</td>
																<td>{tipo_chamado.setor_responsavel}</td>
																<td>{tipo_chamado.dataHoraCriacao}</td>
																<td><button className='button' onClick={() => this.handlerShowModalCadastrarEAtualizarTipoChamado(tipo_chamado)}>Atualizar</button></td>
															</tr>
														))
													) : (<tr className="text-center">
														<td colSpan="15">
															<Spinner animation="border" />
														</td>
													</tr>)}
												</tbody>
											</table>
										</div>
									</div>
								</Tab>
							</Tabs>
						</div>
						{/* /.content */}
						< br />

						<Modal
							show={this.state.modalShowAtualizarUsuario}
							onHide={() => this.handlerCloseModalAtualizarUsuario()}
							aria-labelledby="contained-modal-title-vcenter"
							backdrop="static"
							size="lg"
							centered
						>

							<Modal.Header closeButton>
								<Modal.Title id="contained-modal-title-vcenter" >
									<h5 className='titulo'><FaRegWindowClose />Atualizar</h5>
								</Modal.Title>
							</Modal.Header>
							<Modal.Body>
								<div className='row'>
									<div className="col-sm-6">
										<h4 className='lead text-center'>Informações pessoais</h4>
										<hr />
										<Form onSubmit={this.atualizarUsuario}>
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
												<label htmlFor="email">E-mail</label>
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

											<p className='text-danger'>*Por favor, preencha os campos de senha e de confirmação de senha caso deseje alterar sua senha.</p>

											<div className="row" style={{ marginBottom: 20 }}>
												<div className="col-md-6">
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
												</div>

												<div className="col-md-6">
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
												</div>

											</div>

											<div className="form-group">
												<label htmlFor="selectSetorResponsavel">Setor responsável:*</label>
												<select class="form-control form-control-sm" id="selectSetorResponsavel" value={this.state.id_setor}
													onChange={e => this.setState({ id_setor: e.target.value })}>
													<option value="0">Selecione</option>
													{this.state.arraySetores.length > 0 ?
														this.state.arraySetores.map(setor => (
															<option value={setor.id}>{setor.nome}</option>
														))
														: (<option>0</option>)
													}
												</select>
											</div>

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

											<div className="d-flex justify-content-center"> <button className="button" type="submit">Atualizar</button></div>
										</Form>
									</div>
									<div className="col-sm-6">
										<h4 className='lead text-center'>Permissões</h4>
										<hr />
										{arrayPermissoes.length > 0 ? (
											arrayPermissoes.map((permissao, index) => (
												<div key={index} className="custom-control custom-checkbox">
													<input type="checkbox" className="custom-control-input" id={`checkPermissao_${permissao.id}`}
														onChange={() => this.definirPermissao(this.state.id_usuario, permissao.id)} />
													<label class="custom-control-label" htmlFor={`checkPermissao_${permissao.id}`}>{permissao.nome}</label>
												</div>
											))
										) :
											<div className="custom-control custom-checkbox">
												<input type="checkbox" className="custom-control-input" id={"check"} value={0} />
												<label className="custom-control-label" htmlFor={"check"}>Nenhum resultado encontrado</label>
											</div>
										}
									</div>
								</div>
							</Modal.Body>
							<Modal.Footer>

							</Modal.Footer>
						</Modal>

						<Modal
							show={this.state.modalShowCadastrarEAtualizarTipoChamado}
							onHide={() => this.handlerCloseModalCadastrarEAtualizarTipoChamado()}
							aria-labelledby="contained-modal-title-vcenter"
							backdrop="static"
							size="md"
							centered
						>
							<Form onSubmit={this.cadastrarEatualizarTipoChamado}>
								<Modal.Header closeButton>
									<Modal.Title id="contained-modal-title-vcenter" >
										<h5 className='titulo'><FaRegWindowClose />{this.state.id_tipoChamado !== 0 ? ` Atualizar` : ` Cadastrar`}</h5>
									</Modal.Title>
								</Modal.Header>
								<Modal.Body>
									<div className="form-group">
										<label htmlFor="nome">Tipo de chamado</label>
										<input
											type="text"
											className="form-control"
											id="nome"
											placeholder="Informe o nome"
											autoComplete='off'
											onChange={(e) =>
												this.setState({ tipo_chamado: e.target.value })
											}
											value={this.state.tipo_chamado}
										/>
									</div>

									<div className="form-group">
										<label htmlFor="selectSetorResponsavel">Setor responsável:*</label>
										<select class="form-control" id="selectSetorResponsavel" value={this.state.idSetorResponsavel}
											onChange={e => this.setState({ idSetorResponsavel: e.target.value })}>
											<option value="0">Selecione</option>
											{this.state.arraySetores.length > 0 ?
												this.state.arraySetores.map(setor => (
													<option value={setor.id}>{setor.nome}</option>
												))
												: (<option>0</option>)
											}
										</select>
									</div>

									<div className="row mt-2">
										<div className="col-sm-12">
											{this.state.success && (
												<div
													className="alert alert-success text-center"
													role="alert"
												>
													{this.state.success}
												</div>
											)}
											{this.state.error && (
												<div
													className="alert alert-danger text-center"
													role="alert"
												>
													{this.state.error}
												</div>
											)}
										</div>
									</div>

								</Modal.Body>
								<Modal.Footer>{parseInt(this.state.id_tipoChamado) !== 0 ? (<button className='button'>Atualizar</button>) : (<button className='button'>Cadastrar</button>)}

								</Modal.Footer>
							</Form>
						</Modal>

					</Col>
				</Row>
			</Container>

		);
	}
}

export const Form = styled.form`
	.titulo {
		color: #ffffff;
  	}
`;



