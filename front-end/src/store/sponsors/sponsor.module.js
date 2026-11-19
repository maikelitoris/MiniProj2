// Módulo Vuex de sponsors (Tarefa 3.2). Mesma estrutura do animal.module.js do livro.
import sponsorService from "@/api/sponsor.service";
import {
  FETCH_SPONSORS,
  ADD_SPONSOR,
  EDIT_SPONSOR,
  REMOVE_SPONSOR,
  SET_SPONSORS,
  SET_MESSAGE
} from "./sponsor.constants";

const state = {
  sponsors: [],
  message: ""
};

const getters = {
  getSponsors: state => state.sponsors,
  getSponsorById: state => id => state.sponsors.find(item => item._id === id),
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
  [FETCH_SPONSORS]: ({ commit, rootState }) =>
    run(commit, sponsorService.getSponsors(rootState.auth.token)).then(res => {
      commit(SET_SPONSORS, res.body);
      return res;
    }),
  [ADD_SPONSOR]: ({ commit, rootState }, payload) =>
    run(
      commit,
      sponsorService.addSponsor(rootState.auth.token, payload),
      res => `O patrocinador ${res.body.name} foi adicionado com sucesso!`
    ),
  [EDIT_SPONSOR]: ({ commit, rootState }, payload) =>
    run(
      commit,
      sponsorService.editSponsor(rootState.auth.token, payload),
      res => `O patrocinador ${res.body.name} foi atualizado com sucesso!`
    ),
  [REMOVE_SPONSOR]: ({ commit, rootState }, id) =>
    run(
      commit,
      sponsorService.removeSponsor(rootState.auth.token, id),
      () => "O patrocinador foi removido com sucesso!"
    )
};

export const mutations = {
  [SET_SPONSORS]: (state, list) => {
    state.sponsors = list;
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
