import React from 'react';
import styled from 'styled-components';
import ri_1 from '../assets/certificado_congresso.png';
import ri_2 from '../assets/assinatura.png';

export const Certificado = (props) => {
  return (

    // <Container>
    //   <h5 >PROGRAMA DE PÓS GRADUAÇÃO EM CIÊNCIAS DA EDUCAÇÃO</h5>
    //   <h3 className='text-danger mt-3 font-weight-bold'>CERTIFICADO</h3>
    //   <p className=' mt-3 text-justify'>ESTE CERTIFICADO COMPROVA QUE <b className='text-uppercase'>{props.nomeMembro}</b>
    //     PARTICIPOU DO MINICURSO CURRICULO LATTES: UMA PLATAFORMA ALIADA A
    //     TRAJETÓRIA ACADÊMICA , ORGANIZADO PELO O GRUPO DE PESQUISA EM
    //     EDUCAÇÃO E DIVERSIDADE- GPED NO DIA 14/06/2023 COM DURAÇÃO DE 4 HORAS.</p>
    //   <span className='codigo_validacao mb-5'>Código de validação: {props.codigo_validacao}</span>
    // </Container>
    <Container>
      <span className='paragrafo_principal text-uppercase'>
        {props.tipo_membro === 1 ? (<p>Certificamos que <b>{props.nomeMembro}</b> participou como Apresentador no grupo de trabalho "<b>{props.grupo_trabalho}</b>" no "<b>{props.temaEvento}</b>", cujo o tema: <b>Ciência, globalização e tecnologias na Pós Graduação: Desafios e Perspectivas na contemporaneidade </b> 
          realizado nos dias 11 e 12 de maio de 2023, contabilizando {props.cargaHoraria} horas de carga horária.</p>
        ) : (<p>
          Certificamos que <b>{props.nomeMembro}</b> participou do "<b>{props.temaEvento}</b>" , cujo o tema: <b>Ciência, globalização e tecnologias na Pós Graduação: Desafios e Perspectivas na contemporaneidade </b>, 
          realizado nos dias 11 e 12 de maio de 2023, contabilizando {props.cargaHoraria} horas de carga horária.
        </p>)}
      </span>

      <img src={ri_2} className="assinatura" />
      <span className='nome_completo'>Alcimar José Silva</span>
      <span style={{ fontSize: "16px", fontFamily: "Calibri" }}>Diretor</span>
      <span className='codigo_validacao'>Código de validação: {props.codigo_validacao}</span>
    </Container>
  );
};

const Container = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
  margin: auto;
	max-width: 900px;
	min-height: 600px;
	border: 1px solid black;
	padding: 100px;

	background: url("${ri_1}");
	background-repeat: no-repeat;  
 	background-position: 0% 0%;
 	background-size: 100% 100%;

  .paragrafo_principal {
    text-align: justify;
    margin-top: 150px;
    font-family: "Calibri";
    font-size: 12px;
  }

  .subtitulo {
    margin-top: 2px;
    font-size: 10px;
    font-family: Calibri;
  }

  .assinatura {
    border-bottom: 1px solid black;
  }

  .nome_completo {
    margin-top: 5px; 
    font-size: 16px; 
    fontFamily: Calibri;
  }

  .codigo_validacao {
    margin-top: 15px;
    margin-bottom: 15px;
    font-size: 14px; 
    font-family: Calibri;
  }

`;
