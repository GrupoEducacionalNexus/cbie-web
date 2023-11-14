import { FaRegSave, FaCalendarWeek, FaBoxes, FaPlus } from 'react-icons/fa';
import React, { Component } from 'react';
import api from '../../services/api';
import { getToken } from '../../services/auth';
import Sidebar from '../../components/Sidebar';
import Perfil from '../../components/Perfil';
import { Button, Col, Container, Row, Form, Modal } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Accordion from 'react-bootstrap/Accordion';
import Table from 'react-bootstrap/Table';
import ModalRight from '../../components/ModalRight';
import logo from '../../assets/cbie2.png';
import * as ExcelJS from 'exceljs';
import Stack from 'react-bootstrap/Stack';
import InputMask from 'react-input-mask';

export default class Index extends Component {
	constructor(props) {
		super();
		this.state = {
			modalShowHistoricoAluno: false,
			modalShowRegistrarHistoricoAluno: false,
			success: '',
			error: '',
			successAtualizarAlun: '',
			errorAtualizarAluno: '',
			successRegistrarHistoricoEscolar: '',
			errorRegistrarHistoricoEscolar: '',


			//Usuário
			id_usuario: 0,
			nome: '',
			rg_orgao: '',
			dt_exp: '',
			dt_exp_formatada: '',
			dt_nascimento: '',
			dt_nascimento_formatada: '',
			naturalidade: '',
			filiacao: '',
			nacionalidade: '',
			arrayAreasConhecimento: [],
			arrayComponentesCurriculares: [],
			arrayAlunos: [],

			//Aluno
			id_aluno: 0,

			//Histórico
			notaModulo1: '',
			chModulo1: '',
			notaModulo2: '',
			chModulo2: '',
			notaModulo3: '',
			chModulo3: '',
			idAreaConhecimento: 0,
			idComponenteCurricular: 0,
			arrayHistoricoEscolar: []
		};
	}

	componentDidMount() {
		this.listaDeAlunos(getToken());
	}

	setModalShowHistoricoAluno(valor) {
		this.setState({ modalShowHistoricoAluno: valor, success: '', error: '' });
	}

	handlerShowModalHistoricoAluno(aluno) {
		this.setModalShowHistoricoAluno(true);
		console.log(aluno);
		this.setState({
			id_usuario: aluno.id_usuario,
			id_aluno: aluno.id_aluno,
			nome: aluno.nome,
			rg_orgao: aluno.rg_orgao,
			dt_exp: aluno.dt_exp,
			dt_exp_formatada: aluno.dt_exp_formatada,
			dt_nascimento: aluno.dt_nascimento,
			dt_nascimento_formatada: aluno.dt_nascimento_formatada,
			naturalidade: aluno.naturalidade,
			filiacao: aluno.filiacao,
			nacionalidade: aluno.nacionalidade
		});

		this.buscarHistoricoEscolar(getToken(), aluno.id_aluno);
	}

	handlerCloseModalHistoricoAluno() {
		this.setModalShowHistoricoAluno(false);
		this.setState({ arrayHistoricoEscolar: [] });
	};

	setModalShowRegistrarHistoricoAluno(valor) {
		this.setState({ modalShowRegistrarHistoricoAluno: valor, success: '', error: '' });
	}

	handlerShowModalRegistrarHistoricoAluno() {
		this.setModalShowRegistrarHistoricoAluno(true);
		this.listaDeAreasDeConhecimento(getToken());
	}

	handlerCloseModalRegistrarHistoricoAluno() {
		this.setModalShowRegistrarHistoricoAluno(false);
	};

	cadastrarListaDeAlunos = async () => {
		const { arrayAlunos } = this.state;

		try {
			const response = await fetch(`${api.baseURL}/alunos`, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'x-access-token': getToken()
				},
				body: JSON.stringify({
					colunas: ['nome', 'rg_orgao', 'dt_exp', 'dt_nascimento', 'naturalidade', 'filiacao', 'nacionalidade'],
					arrayAlunos
				})
			});

			const data = await response.json();
			//console.log(data)

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
	};

	cadastrarEatualizarAluno = async (e) => {
		e.preventDefault();
		this.setState({ success: '', error: '' });

		const { id_usuario, id_aluno, nome, rg_orgao, dt_exp, dt_nascimento, naturalidade,
			filiacao, nacionalidade } = this.state;

		if (!nome || !rg_orgao || !dt_nascimento || !dt_nascimento ||
			!naturalidade || !filiacao || !nacionalidade) {
			this.setState({ error: 'Por favor, preencher todos os campos.' });
			return;
		}

		const url = id_aluno === 0 ? `${api.baseURL}/alunos` : `${api.baseURL}/alunos/${id_aluno}`;

		try {
			const response = await fetch(`${url}`, {
				method: id_aluno === 0 ? 'POST' : 'PUT',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'x-access-token': getToken()
				},
				body: JSON.stringify({
					id_usuario, nome, rg_orgao, dt_exp, dt_nascimento,
					naturalidade, filiacao, nacionalidade
				})
			});

			const data = await response.json();
			//console.log(data)

			if (data.status === 200) {
				this.setState({ success: data.msg });
				this.listaDeAlunos(getToken());
			}

			if (data.status === 400) {
				this.setState({ error: data.msg });
			}
		} catch (error) {
			console.log(error)
			this.setState({ error: 'Ocorreu um erro' });
		}
	};

	importarListaDeAlunos = (e) => {
		const file = e.target.files[0];
		const reader = new FileReader();

		reader.onload = async (event) => {
			const data = event.target.result;
			const workbook = new ExcelJS.Workbook();
			await workbook.xlsx.load(data);
			const worksheet = workbook.worksheets[0];
			console.log(worksheet);

			const rows = [];
			const header = ['nome', 'rg_orgao', 'dt_exp', 'dt_nascimento', 'naturalidade', 'filiacao', 'nacionalidade', 'curso'];

			worksheet.eachRow((row, rowNumber) => {
				if (rowNumber > 1) {
					const rowData = {};
					row.eachCell((cell, colNumber) => {
						rowData[header[colNumber - 1]] = cell.value;
					});
					rows.push(rowData);
				}
			});
			console.log(header);
			console.log(rows);
			this.setState({ arrayAlunos: rows });
			this.cadastrarListaDeAlunos();
		};
		reader.readAsArrayBuffer(file);
	};

	listaDeAreasDeConhecimento = async (token) => {
		try {
			const response = await fetch(`${api.baseURL}/areas_conhecimento`,
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
				this.setState({ arrayAreasConhecimento: data.resultados });
			}
		} catch (error) {
			console.log(error);
		}
	};

	listaDeComponentesCurriculares = async (token, idAreaConhecimento) => {

		this.setState({ idAreaConhecimento });
		try {
			const response = await fetch(`${api.baseURL}/areas_conhecimento/${idAreaConhecimento}/componente_curricular`,
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
				this.setState({ arrayComponentesCurriculares: data.resultados });
			}
		} catch (error) {
			console.log(error);
		}
	};

	listaDeAlunos = async (token) => {
		try {
			const response = await fetch(`${api.baseURL}/alunos`,
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
				this.setState({ arrayAlunos: data.resultados });
			}
		} catch (error) {
			console.log(error);
		}
	};

	cadastrarHistoricoEscolar = async (e) => {
		e.preventDefault();
		this.setState({ successRegistrarHistoricoEscolar: '', errorRegistrarHistoricoEscolar: '' });

		const {
			id_aluno, idAreaConhecimento, idComponenteCurricular,
			notaModulo1, chModulo1,
			notaModulo2, chModulo2,
			notaModulo3, chModulo3 } = this.state;

		if (!idAreaConhecimento || !idComponenteCurricular
			|| !notaModulo1 || !chModulo1 ||
			!notaModulo2 || !chModulo2 ||
			!notaModulo3 || !chModulo3) {
			this.setState({ error: 'Por favor, preencher todos os campos.' });
			return;
		}

		try {
			const response = await fetch(`${api.baseURL}/historico_escolar`, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'x-access-token': getToken()
				},
				body: JSON.stringify({
					idAluno: id_aluno, idAreaConhecimento, idComponenteCurricular,
					notaModulo1, chModulo1,
					notaModulo2, chModulo2,
					notaModulo3, chModulo3
				}),
			});

			const data = await response.json();
			//console.log(data)

			if (data.status === 200) {
				this.setState({ successRegistrarHistoricoEscolar: data.msg });
			}

			if (data.status === 400) {
				this.setState({ errorRegistrarHistoricoEscolar: data.msg });
			}
		} catch (error) {
			console.log(error)
			this.setState({ errorRegistrarHistoricoEscolar: 'Ocorreu um erro' });
		}
	};

	buscarHistoricoEscolar = async (token, idAluno) => {
		try {
			const response = await fetch(`${api.baseURL}/alunos/${idAluno}/historico_escolar`,
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
			console.log(data);
			if (data.status === 200) {
				this.setState({ arrayHistoricoEscolar: data.resultados });
			}
		} catch (error) {
			console.log(error);
		}
	};

	componentesCurricularesEsuasDiciplinas = (ac, cc, nM1, nM2, nM3, chM1, chM2, chM3) => {
		return (
			<React.Fragment>
				<tr>
					<td rowSpan="3">{ac}</td>
				</tr>
				{
					cc.map((item, index) => (
						<tr>
							<td>{item}</td>
							<td>{nM1[index]}</td>
							<td>{chM1[index]}</td>
							<td>{nM2[index]}</td>
							<td>{chM2[index]}</td>
							<td>{nM3[index]}</td>
							<td>{chM3[index]}</td>
						</tr>
					))
				}
				<span></span>
			</React.Fragment>
		)
	}

	render() {
		const arrayAlunos = this.state.arrayAlunos;
		const arrayHistoricoEscolar = this.state.arrayHistoricoEscolar;
		return (
			<>
				<Navbar data-bs-theme="light" fixed>
					<Container>
						<Navbar.Brand href="#home"><img id="logo" src={logo} style={{ width: "100px" }} /></Navbar.Brand>
						<Nav className="ml-auto">
							<Nav.Link href="#home"></Nav.Link>
							<Nav.Link href="#features"><Perfil /></Nav.Link>
							<Nav.Link href="#pricing">
								<ModalRight key={0} placement={`end`} name={`Cadastrar Aluno`}>
									<Form onSubmit={this.cadastrarEatualizarAluno}>
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
											<label htmlFor="select_Usuario">RG</label>
											<input
												className="form-control"
												type="number"
												placeholder="RG"
												name="cpf"
												onChange={(e) =>
													this.setState({ rg: e.target.value })
												}
												value={this.state.rg}
											/>
										</div>

										<div className="form-group">
											<label htmlFor="nome">Orgão Expedidor</label>
											<input
												type="text"
												className="form-control"
												id="nome"
												placeholder="Digite seu nome"
												onChange={(e) =>
													this.setState({ orgao_expedidor: e.target.value })
												}
												value={this.state.orgao_expedidor}
											/>
										</div>

										<div className="form-group">
											<label htmlFor="dt_nascimento">Data de Nascimento</label>
											<input
												type="date"
												className="form-control"
												id="dt_nascimento"
												placeholder="Digite a data de nascimento"
												onChange={(e) =>
													this.setState({ dt_nascimento: e.target.value })
												}
												value={this.state.dt_nascimento}
											/>
										</div>

										<div className="form-group">
											<label htmlFor="nome">Naturalidade</label>
											<input
												type="text"
												className="form-control"
												id="nome"
												placeholder="Naturalidade"
												onChange={(e) =>
													this.setState({ naturalidade: e.target.value })
												}
												value={this.state.naturalidade}
											/>
										</div>

										<div className="form-group">
											<label htmlFor="nome">Filiação</label>
											<input
												type="text"
												className="form-control"
												id="nome"
												placeholder="Filiação"
												onChange={(e) =>
													this.setState({ filiacao: e.target.value })
												}
												value={this.state.filiacao}
											/>
										</div>

										<div className="form-group">
											<label htmlFor="nome">Nacionalidade</label>
											<input
												type="text"
												className="form-control"
												id="nome"
												placeholder="Nacionalidade"
												onChange={(e) =>
													this.setState({ nacionalidade: e.target.value })
												}
												value={this.state.nacionalidade}
											/>
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

										<div className='d-flex justify-content-center'>
											<Button variant="primary" type="submit">
												Registrar
											</Button>
										</div>
									</Form>
								</ModalRight>
							</Nav.Link>
							<Nav.Link>
								<Sidebar />
							</Nav.Link>
						</Nav>
					</Container>
				</Navbar>
				<Container fluid>
					<Row>
						<Col md={12}></Col>
					</Row>
					<Row>
						<Col md={12}>
							<Accordion defaultActiveKey="0" className='mt-3 mb-5' >
								<Accordion.Item eventKey="0" >.
									<Accordion.Header>Gerenciar Alunos - Total: {arrayAlunos.length}</Accordion.Header>
									<Accordion.Body>
										<Container fluid>
											<div className='d-flex justify-content-center text-center'>
												<div className="mb-3">
													<label htmlFor="lista_alunos" className="form-label">Importar Lista de Alunos</label>
													<input className="form-control" type="file" id="lista_alunos" onChange={this.importarListaDeAlunos}
														accept=".xlsx"
														onClick={(e) => { e.currentTarget.value = null }} />
												</div>
											</div>
											<hr />
											<div class="table-wrapper">
												<Table responsive striped hover variant="light" size='sm' className='text-center'>
													<thead>
														<tr>
															<th>Nome Completo</th>
															<th>Rg - Orgão</th>
															<th>Data - Exp</th>
															<th>Data de nascimento</th>
															<th>Naturalidade</th>
															<th>Nacionalidade</th>
															<th>Data e Hora de Criação</th>
															<th>Ação</th>
														</tr>
													</thead>
													<tbody>
														{arrayAlunos.length > 0 ? (
															arrayAlunos.map(aluno => (
																<tr>
																	<td>{aluno.nome}</td>
																	<td>{aluno.rg_orgao}</td>
																	<td>{aluno.dt_exp_formatada}</td>
																	<td>{aluno.dt_nascimento_formatada}</td>
																	<td>{aluno.nacionalidade}</td>
																	<td>{aluno.naturalidade}</td>
																	<td>{aluno.dataHoraCriacao}</td>
																	<td>
																		<button className="button w-100" size='sm' onClick={() => this.handlerShowModalHistoricoAluno(aluno)}>
																			Histórico
																		</button>
																	</td>
																</tr>
															))
														) : ("")}

													</tbody>
												</Table>
											</div>
										</Container>
									</Accordion.Body>
								</Accordion.Item>
								<Accordion.Item eventKey="1">
									<Accordion.Header>Accordion Item #2</Accordion.Header>
									<Accordion.Body>
										Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
										eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
										minim veniam, quis nostrud exercitation ullamco laboris nisi ut
										aliquip ex ea commodo consequat. Duis aute irure dolor in
										reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
										pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
										culpa qui officia deserunt mollit anim id est laborum.
									</Accordion.Body>
								</Accordion.Item>
							</Accordion>
						</Col>
					</Row>
				</Container>

				<Modal
					show={this.state.modalShowHistoricoAluno}
					onHide={() => this.handlerCloseModalHistoricoAluno()}
					aria-labelledby="contained-modal-title-vcenter"
					backdrop="static"
					fullscreen="xxl-down"
					centered>
					<Modal.Header closeButton>
						<Modal.Title id="contained-modal-title-vcenter" >
							<h5 className='titulo'>Histórico do Aluno</h5>
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Container>
							<h4>Atualizar Informações do Aluno</h4>
							<hr />

							<Form onSubmit={this.cadastrarEatualizarAluno}>
								<Row>
									<Col xs={6}>
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
									</Col>
									<Col>
										<div className="form-group">
											<label htmlFor="rg_orgao">RG/Orgão:</label>
											<input
												className="form-control"
												type="text"
												placeholder="RG/Orgão"
												name="rg_orgao"
												id='rg_orgao'
												onChange={(e) =>
													this.setState({ rg_orgao: e.target.value })
												}
												value={this.state.rg_orgao}
											/>
										</div>
									</Col>
									<Col>
										<div className="form-group">
											<label htmlFor="dt_nascimento">Data Exp:</label>
											<input
												type="date"
												className="form-control"
												id="dt_exp"
												placeholder="Data Exp"
												onChange={(e) =>
													this.setState({ dt_exp: e.target.value })
												}
												value={this.state.dt_exp}
											/>
										</div>
									</Col>
								</Row>
								<Row>
									<Col>
										<div className="form-group">
											<label htmlFor="dt_nascimento">Data de Nascimento:</label>
											<input
												type="date"
												className="form-control"
												id="dt_nascimento"
												placeholder="Digite a data de nascimento"
												onChange={(e) =>
													this.setState({ dt_nascimento: e.target.value })
												}
												value={this.state.dt_nascimento}
											/>
										</div>
									</Col>
									<Col>
										<div className="form-group">
											<label htmlFor="nome">Naturalidade:</label>
											<input
												type="text"
												className="form-control"
												id="nome"
												placeholder="Naturalidade"
												onChange={(e) =>
													this.setState({ naturalidade: e.target.value })
												}
												value={this.state.naturalidade}
											/>
										</div>
									</Col>
									<Col>
										<div className="form-group">
											<label htmlFor="nome">Nacionalidade</label>
											<input
												type="text"
												className="form-control"
												id="nome"
												placeholder="Nacionalidade"
												onChange={(e) =>
													this.setState({ nacionalidade: e.target.value })
												}
												value={this.state.nacionalidade}
											/>
										</div>
									</Col>
								</Row>
								<Row>
									<Col xs={6}>
										<div className="form-group">
											<label htmlFor="nome">Filiação</label>
											<input
												type="text"
												className="form-control"
												id="nome"
												placeholder="Filiação"
												onChange={(e) =>
													this.setState({ filiacao: e.target.value })
												}
												value={this.state.filiacao}
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

								<div className='d-flex justify-content-center'>
									<button className="button" type="submit">
										Atualizar
									</button>
								</div>
							</Form>
						</Container>



						<hr />
						<Container>
							<Stack direction="horizontal" gap={3}>
								<div className="p-2"><h4>Histórico</h4></div>
								<div className="p-2 ms-auto"><button className="button" size='sm' onClick={() => this.handlerShowModalRegistrarHistoricoAluno()}>
									Registrar Histórico
								</button></div>
							</Stack>
							<hr />
							<Table bordered>
								<tbody>
									<tr>
										<td colSpan={12}>Nome: {this.state.nome}</td>
									</tr>
									<tr>
										<td colSpan={3}>Rg/Órg.Expedidor: {this.state.rg_orgao}</td>
										<td colSpan={3}>Data de Expedição: {this.state.dt_exp_formatada}</td>
									</tr>
									<tr>
										<td colSpan={3}>Data de Nascimento: {this.state.dt_nascimento_formatada}</td>
										<td colSpan={6}>Nacionalidade: {this.state.nacionalidade}</td>
									</tr>
									<tr>
										<td colSpan={12}>Naturalidade: {this.state.naturalidade}</td>
									</tr>
									<tr>
										<td colSpan={12}>Filiação: {this.state.filiacao}</td>
									</tr>
								</tbody>
							</Table>
						</Container>

						<h5 className='text-center'>Carga Horária/Regime</h5>

						<div class="container mt-4">
							<Table bordered>
								<thead>
									<tr>
										<th>Áreas de Conhecimento</th>
										<th>Componentes Curriculares</th>
										<th>Módulo I Menção/Nota</th>
										<th>CH</th>
										<th>Módulo II Menção/Nota</th>
										<th>CH</th>
										<th>Módulo III Menção/Nota</th>
										<th>CH</th>
									</tr>
								</thead>
								<tbody>
									{arrayHistoricoEscolar.length > 0 ? (
										arrayHistoricoEscolar.map(item => {
											const cc = item.cc.split(',');
											const nM1 = item.nM1.split(',');
											const nM2 = item.nM2.split(',');
											const nM3 = item.nM3.split(',');
											const chM1 = item.chM1.split(',');
											const chM2 = item.chM2.split(',');
											const chM3 = item.chM3.split(',');
											return this.componentesCurricularesEsuasDiciplinas(item.ac, cc, nM1, nM2, nM3, chM1, chM2, chM3);
										})
									) : ("")}

								</tbody>
							</Table>
						</div>

					</Modal.Body>

				</Modal>

				<Modal
					show={this.state.modalShowRegistrarHistoricoAluno}
					onHide={() => this.handlerCloseModalRegistrarHistoricoAluno()}
					aria-labelledby="contained-modal-title-vcenter"
					backdrop="static"
					size="md"
					centered>

					<Modal.Header closeButton>
						<Modal.Title id="contained-modal-title-vcenter">
							<h5 className='titulo'>Registrar Histórico</h5>
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form onSubmit={this.cadastrarHistoricoEscolar}>
							<Form.Label htmlFor="inputPassword5">Área de Conhecimento</Form.Label>
							<Form.Select size='sm mb-2' aria-label="Default select example"
								onChange={(e) => this.listaDeComponentesCurriculares(getToken(), e.target.value)}>
								<option>Selecione</option>
								{this.state.arrayAreasConhecimento.length > 0 ? (
									this.state.arrayAreasConhecimento.map(item => (
										<option value={item.id}>{item.nome}</option>
									))
								) : ("")}
							</Form.Select>

							<Form.Label htmlFor="inputPassword5">Componente Curricular</Form.Label>
							<Form.Select size='sm mb-2' aria-label="Default select example"
								onChange={e => this.setState({ idComponenteCurricular: e.target.value })}>
								<option>Selecione</option>
								{this.state.arrayComponentesCurriculares.length > 0 ? (
									this.state.arrayComponentesCurriculares.map(item => (
										<option value={item.id}>{item.nome}</option>
									))
								) : ("")}
							</Form.Select>

							<Row>
								<Col>
									<div className="form-group">
										<label htmlFor="nome">Nota - Módulo 1</label>
										<InputMask
											className="form-control"
											mask="9,9"
											value={this.state.notaModulo1}
											onChange={e => this.setState({ notaModulo1: e.target.value })}
										/>
									</div>
								</Col>
								<Col>
									<div className="form-group">
										<label htmlFor="nome">Carga Horária - Módulo 1</label>
										<InputMask
											className="form-control"
											mask="99"
											value={this.state.chModulo1}
											onChange={e => this.setState({ chModulo1: e.target.value })}
										/>
									</div>
								</Col>
							</Row>

							<Row>
								<Col>
									<div className="form-group">
										<label htmlFor="nome">Nota - Módulo 2</label>
										<InputMask
											className="form-control"
											mask="9,9"
											value={this.state.notaModulo2}
											onChange={e => this.setState({ notaModulo2: e.target.value })}
										/>
									</div>
								</Col>
								<Col>
									<div className="form-group">
										<label htmlFor="nome">Carga Horária - Módulo 2</label>
										<InputMask
											className="form-control"
											mask="99"
											value={this.state.chModulo2}
											onChange={e => this.setState({ chModulo2: e.target.value })}
										/>
									</div>
								</Col>
							</Row>

							<Row>
								<Col>
									<div className="form-group">
										<label htmlFor="nome">Nota - Módulo 3</label>
										<InputMask
											className="form-control"
											mask="9,9"
											value={this.state.notaModulo3}
											onChange={e => this.setState({ notaModulo3: e.target.value })}
										/>
									</div>
								</Col>
								<Col>
									<div className="form-group">
										<label htmlFor="nome">Carga Horária - Módulo 3</label>
										<InputMask
											className="form-control"
											mask="99"
											value={this.state.chModulo3}
											onChange={e => this.setState({ chModulo3: e.target.value })}
										/>
									</div>
								</Col>
							</Row>

							<div className="row mt-2">
								<div className="col-sm-12">
									{this.state.successRegistrarHistoricoEscolar && (
										<div
											className="alert alert-success text-center"
											role="alert"
										>
											{this.state.successRegistrarHistoricoEscolar}
										</div>
									)}
									{this.state.errorRegistrarHistoricoEscolar && (
										<div
											className="alert alert-danger text-center"
											role="alert"
										>
											{this.state.errorRegistrarHistoricoEscolar}
										</div>
									)}
								</div>
							</div>
							<div className='d-flex justify-content-center'>
								<Button className='button' type="submit">
									Registrar
								</Button>
							</div>
						</Form>
					</Modal.Body>
				</Modal>
			</>
		);
	}
}


