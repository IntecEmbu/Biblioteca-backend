export default function formateDateFromDatabase(dateNotFormated) {
  // Recebe uma data no formato "2021-05-01T00:00:00Z"
  // Retorna uma data no formato "01/05/2021"
  const date = new Date(dateNotFormated);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day < 10 ? "0" + day : day}/${month < 10 ? "0" + month : month }/${year}`;
}