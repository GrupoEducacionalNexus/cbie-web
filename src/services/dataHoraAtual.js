const dataHoraAtual = new Date();
const ano = dataHoraAtual.getFullYear();
const mes = String(dataHoraAtual.getMonth() + 1).padStart(2, '0'); // Adiciona zero à esquerda, se necessário
const dia = String(dataHoraAtual.getDate()).padStart(2, '0');
const hora = String(dataHoraAtual.getHours()).padStart(2, '0');
const minutos = String(dataHoraAtual.getMinutes()).padStart(2, '0');

export const dataHoraFormatada = `${ano}-${mes}-${dia} ${hora}:${minutos}`;
