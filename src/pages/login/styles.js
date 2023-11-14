import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-height: 100vh;
  background-color: #424047;

  .titulo {
    font-size: 20px;
    text-align:center;
    color: #424047;
    font-weight: bold;
    margin-bottom: 20px;
  }

  @media only screen and (min-width: 320px) and (max-width: 725px) {
    img {
      width: 390px;
    }
  }
`;

export const Form = styled.form`
  width: 420px;
  background-color: #f5f5f5;
  padding: 40px;
  border: 1px solid rgba(0,0,0,0.2);
  border-radius: 10px;
  box-shadow: 8px 8px 8px 0 rgba(0,0,0,0.2);
  transition: 0.3s;

  @media only screen and (min-width: 320px) and (max-width: 725px) {
    width: 320px;
  }
`;
