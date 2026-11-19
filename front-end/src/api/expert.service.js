// Pedidos à API de experts (Tarefa 3.2). Mesma estrutura do animal.service.js do livro.
import API_URL from "./config.js";

async function request(method, path, token, payload) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    }
  };
  if (payload !== undefined) options.body = JSON.stringify(payload);
  const response = await fetch(`${API_URL}${path}`, options);
  if (response.status === 204) return { body: [] }; // lista vazia
  if (response.ok) return await response.json();
  throw Error(handleResponses(response.status));
}

export const expertService = {
  getExperts: token => request("GET", "/experts", token),
  getPublicExperts: () => request("GET", "/experts/public", ""),
  addExpert: (token, payload) => request("POST", "/experts", token, payload),
  editExpert: (token, payload) =>
    request("PUT", `/experts/${payload._id}`, token, payload),
  removeExpert: (token, id) => request("DELETE", `/experts/${id}`, token)
};

function handleResponses(code) {
  switch (code) {
    case 401:
      return "Não está autorizado a executar esta ação!";
    case 404:
      return "O especialista não foi encontrado.";
    case 406:
      return "Há dados inválidos no formulário. Verifique os campos.";
    default:
      return "Mensagem desconhecida";
  }
}

export default expertService;
