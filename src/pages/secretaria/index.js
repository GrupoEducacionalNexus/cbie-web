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


export default class Index extends Component {
	constructor(props) {
		super();
		this.state = {
			modalShowHistoricoAluno: false,
			modalShowRegistrarHistoricoAluno: false,
			success: '',
			error: '',

			nome: '',
			rg_orgao: '',
			dt_nascimento: '',
			dt_nascimento_formatada: '',
			naturalidade: '',
			filiacao: '',
			nacionalidade: '',
			arrayAreasConhecimento: [],
			arrayComponentesCurriculares: [],
			arrayAlunos: []
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
		this.setState({
			nome: aluno.nome,
			rg_orgao: aluno.rg_orgao,
			dt_nascimento: aluno.dt_nascimento,
			dt_nascimento_formatada: aluno.dt_nascimento_formatada,
			naturalidade: aluno.naturalidade,
			filiacao: aluno.filiacao,
			nacionalidade: aluno.nacionalidade
		});
	}

	handlerCloseModalHistoricoAluno() {
		this.setModalShowHistoricoAluno(false);
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
					colunas: ['nome', 'rg_orgao', 'dt_nascimento', 'naturalidade', 'filiacao', 'nacionalidade'],
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

	cadastrarAluno = async (e) => {
		e.preventDefault();
		this.setState({ success: '', error: '' });

		const { nome, rg, orgao_expedidor, dt_nascimento, naturalidade,
			filiacao, nacionalidade, arrayAlunos } = this.state;

		if (arrayAlunos.length > 0) {
			console.log(arrayAlunos);
			return
		}



		if (!nome || !rg || !orgao_expedidor || !dt_nascimento || !dt_nascimento ||
			!naturalidade || !filiacao || !nacionalidade) {
			this.setState({ error: 'Por favor, preencher todos os campos.' });
			return;
		}

		try {
			const response = await fetch(`${api.baseURL}/alunos`, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'x-access-token': getToken()
				},
				body: JSON.stringify({
					nome, rg, orgao_expedidor, dt_nascimento,
					naturalidade, filiacao, nacionalidade
				}),
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
			const header = ['nome', 'rg_orgao', 'dt_nascimento', 'naturalidade', 'filiacao', 'nacionalidade', 'curso'];

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
				this.setState({ arrayAreasConhecimento: data.resultados });
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

	render() {

		const arrayAlunos = this.state.arrayAlunos;
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
									<Form onSubmit={this.cadastrarAluno}>
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
								<Accordion.Item eventKey="0" >
									<Accordion.Header>Relação dos Alunos</Accordion.Header>
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
															<th>Rg - Orgão Expedidor</th>
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
					size="xl"
					centered>
					<Form onSubmit={this.state.modalShowHistoricoAluno}>
						<Modal.Header closeButton>
							<Modal.Title id="contained-modal-title-vcenter" >
								<h5 className='titulo'>Histórico do Aluno</h5>
							</Modal.Title>
						</Modal.Header>
						<Modal.Body>

							<Container>
								<h4>Atualizar Informações do Aluno</h4>
								<hr />
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
							</Container>

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

							<hr />
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
										<td colSpan={3}>Data de Expedição: </td>
									</tr>
									<tr>
										<td colSpan={3}>Data de Nascimento: {this.state.dt_nascimento_formatada}</td>
										<td colSpan={6}>Nacionalidade: {this.state.nacionalidade}</td>
									</tr>
									<tr>
										<td colSpan={12}>Naturalidade: {this.state.nacionalidade}</td>
									</tr>
									<tr>
										<td colSpan={12}>Filiação: {this.state.filiacao}</td>
									</tr>
								</tbody>
							</Table>

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
										<tr>
											<td rowspan="4">Ciências Humanas e suas Tecnologias</td>
										</tr>
										<tr>
											<td>História</td>
											<td>-</td>
											<td>30</td>
											<td>-</td>
											<td>30</td>
											<td>-</td>
											<td>30</td>
										</tr>
										<tr>
											<td>Geografia</td>
											<td>-</td>
											<td>30</td>
											<td>-</td>
											<td>30</td>
											<td>-</td>
											<td>30</td>
										</tr>
										<tr>
											<td>Filosofia</td>
											<td>-</td>
											<td>20</td>
											<td>-</td>
											<td>20</td>
											<td>-</td>
											<td>20</td>
										</tr>
										<tr>
											<td rowspan="4">Ciências da Natureza,
												Matemática e
												suas Tecnologias</td>
										</tr>
										<tr>
											<td>Matemática</td>
											<td>-</td>
											<td>80</td>
											<td>-</td>
											<td>80</td>
											<td>-</td>
											<td>80</td>
										</tr>
										<tr>
											<td>Física</td>
											<td>-</td>
											<td>30</td>
											<td>-</td>
											<td>30</td>
											<td>-</td>
											<td>30</td>
										</tr>
										<tr>
											<td>Química</td>
											<td>-</td>
											<td>30</td>
											<td>-</td>
											<td>30</td>
											<td>-</td>
											<td>30</td>
										</tr>
									</tbody>
								</Table>
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
					</Form>
				</Modal>

				<Modal
					show={this.state.modalShowRegistrarHistoricoAluno}
					onHide={() => this.handlerCloseModalRegistrarHistoricoAluno()}
					aria-labelledby="contained-modal-title-vcenter"
					backdrop="static"
					size="md"
					centered>

					<Modal.Header closeButton>
						<Modal.Title id="contained-modal-title-vcenter" >
							<h5 className='titulo'>Registrar Histórico</h5>
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
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
						<Form.Select size='sm mb-2' aria-label="Default select example">
							<option>Selecione</option>
							{this.state.arrayAreasConhecimento.length > 0 ? (
								this.state.arrayAreasConhecimento.map(item => (
									<option value={item.id}>{item.nome}</option>
								))
							) : ("")}
						</Form.Select>

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
				</Modal>
			</>
		);
	}
}


