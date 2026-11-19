// Módulo Vuex de experts (Tarefa 3.2). Mesma estrutura do animal.module.js do livro.
import expertService from "@/api/expert.service";
import {
  FETCH_EXPERTS,
  ADD_EXPERT,
  EDIT_EXPERT,
  REMOVE_EXPERT,
  SET_EXPERTS,
  SET_MESSAGE
} from "./expert.constants";

const state = {
  experts: [],
  message: ""
};

const getters = {
  getExperts: state => state.experts,
  getExpertById: state => id => state.experts.find(item => item._id === id),
  getMessage: state => state.message
};

// Faz o pedido, guarda a mensagem para o utilizador e devolve uma Promise
const run = (commit, promise, okMessage) =>
  promise.then(
    res => {
      if (okMessage) commit(SET_MESSAGE, okMessage(res));
      return res;
    },
    err => {
      commit(SET_MESSAGE, err.message);
      throw err;
    }
  );

const actions = {
  [FETCH_EXPERTS]: ({ commit, rootState }) =>
    run(commit, expertService.getExperts(rootState.auth.token)).then(res => {
      commit(SET_EXPERTS, res.body);
      return res;
    }),
  [ADD_EXPERT]: ({ commit, rootState }, payload) =>
    run(
      commit,
      expertService.addExpert(rootState.auth.token, payload),
      res => `O especialista ${res.body.name} foi adicionado com sucesso!`
    ),
  [EDIT_EXPERT]: ({ commit, rootState }, payload) =>
    run(
      commit,
      expertService.editExpert(rootState.auth.token, payload),
      res => `O especialista ${res.body.name} foi atualizado com sucesso!`
    ),
  [REMOVE_EXPERT]: ({ commit, rootState }, id) =>
    run(
      commit,
      expertService.removeExpert(rootState.auth.token, id),
      () => "O especialista foi removido com sucesso!"
    )
};

export const mutations = {
  [SET_EXPERTS]: (state, list) => {
    state.experts = list;
  },
  [SET_MESSAGE]: (state, message) => {
    state.message = message;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
