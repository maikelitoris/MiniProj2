<template>
  <section class="page-section">
    <b-container>
      <HeaderPage title="Gestão de Especialistas" />
      <!--MENU TOPO-->
      <b-row class="mb-4">
        <b-col cols="2"></b-col>
        <b-col>
          <router-link
            :to="{ name: 'addExpert' }"
            tag="button"
            class="btn btn-outline-success mr-2 mt-2"
          >
            <i class="fas fa-plus-square"></i> ADICIONAR ESPECIALISTA
          </router-link>
          <router-link
            :to="{ name: 'admin' }"
            tag="button"
            class="btn btn-outline-info mr-2 mt-2"
          >
            <i class="fas fa-bars"></i> MENU PRINCIPAL
          </router-link>
        </b-col>
        <b-col cols="2"></b-col>
      </b-row>

      <!--TABELA-->
      <b-row>
        <b-col>
          <p v-if="items.length === 0" class="text-center">
            Ainda não há especialistas registados.
          </p>
          <div v-else class="table-responsive">
            <table class="table table-striped">
              <thead class="thead-dark">
                <tr>
                  <th scope="col">
                    NOME
                    <i
                      class="fas fa-arrow-up"
                      v-if="sortType === 1"
                      @click="sort()"
                    ></i>
                    <i class="fas fa-arrow-down" v-else @click="sort()"></i>
                  </th>
                  <th scope="col">ESPECIALIDADE</th>
                  <th scope="col">INSTITUIÇÃO</th>
                  <th scope="col">ANIMAIS</th>
                  <th scope="col">ESTADO</th>
                  <th scope="col">AÇÕES</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item of items" :key="item._id">
                  <td class="pt-4">{{ item.name }}</td>
                  <td class="pt-4">{{ item.specialty }}</td>
                  <td class="pt-4">{{ item.institution }}</td>
                  <td class="pt-4">{{ animalNames(item) }}</td>
                  <td class="pt-4">
                    <b-badge :variant="item.active ? 'success' : 'secondary'">{{
                      item.active ? "ativo" : "inativo"
                    }}</b-badge>
                  </td>
                  <td>
                    <router-link
                      :to="{
                        name: 'editExpert',
                        params: { expertId: item._id }
                      }"
                      tag="button"
                      class="btn btn-outline-success mr-2 mt-2"
                    >
                      <i class="fas fa-edit"></i> EDITAR
                    </router-link>
                    <button
                      @click="view(item)"
                      type="button"
                      class="btn btn-outline-success mr-2 mt-2"
                    >
                      <i class="fas fa-search"></i> VER
                    </button>
                    <button
                      @click="toggleActive(item)"
                      type="button"
                      class="btn btn-outline-warning mr-2 mt-2"
                    >
                      <i
                        :class="item.active ? 'fas fa-eye-slash' : 'fas fa-eye'"
                      ></i>
                      {{ item.active ? "DESATIVAR" : "ATIVAR" }}
                    </button>
                    <button
                      @click="remove(item._id)"
                      type="button"
                      class="btn btn-outline-danger mr-2 mt-2"
                    >
                      <i class="fas fa-trash-alt"></i> REMOVER
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import {
  FETCH_EXPERTS,
  EDIT_EXPERT,
  REMOVE_EXPERT
} from "@/store/experts/expert.constants";
import HeaderPage from "@/components/HeaderPage.vue";
import { mapGetters } from "vuex";

export default {
  name: "ListExperts",
  components: { HeaderPage },
  data: function() {
    return {
      items: [],
      sortType: 1
    };
  },
  computed: {
    ...mapGetters("expert", ["getExperts", "getMessage"])
  },
  methods: {
    fetch() {
      this.$store.dispatch(`expert/${FETCH_EXPERTS}`).then(
        () => {
          this.items = [...this.getExperts];
        },
        err => {
          this.$alert(`${err.message}`, "Erro", "error");
        }
      );
    },
    sort() {
      this.items.sort((a, b) => a.name.localeCompare(b.name) * this.sortType);
      this.sortType *= -1;
    },
    animalNames(item) {
      return (item.animals || []).map(a => (a && a.name) || "?").join(", ");
    },
    view(item) {
      this.$fire({
        title: item.name,
        html: this.generateTemplate(item),
        imageUrl: item.photo || undefined,
        imageWidth: 200,
        imageAlt: "Imagem"
      });
    },
    generateTemplate(item) {
      // texto escapado: os dados vêm do utilizador
      const esc = s =>
        String(s || "").replace(
          /[&<>"']/g,
          c =>
            ({
              "&": "&amp;",
              "<": "&lt;",
              ">": "&gt;",
              '"': "&quot;",
              "'": "&#39;"
            }[c])
        );
      return `<p><b>${esc(item.title)}</b> ${esc(item.name)}</p>
        <p><b>Especialidade:</b> ${esc(
          item.specialty
        )} · <b>Instituição:</b> ${esc(item.institution)}</p>
        <p><b>Animais que acompanha:</b> ${esc(this.animalNames(item))}</p>
        <p>${item.orcid ? `ORCID ${esc(item.orcid)} · ` : ""}${
        item.canValidateQuizzes ? "pode validar quizzes" : "não valida quizzes"
      }</p>
        <p>${esc(item.bio)}</p>`;
    },
    toggleActive(item) {
      const payload = { _id: item._id, active: !item.active };
      this.$store
        .dispatch(`expert/${EDIT_EXPERT}`, payload)
        .then(
          () => this.fetch(),
          err => this.$alert(`${err.message}`, "Erro", "error")
        );
    },
    remove(id) {
      this.$confirm(
        "Se sim, clique em OK",
        "Deseja mesmo remover o especialista?",
        "warning",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancelar"
        }
      ).then(
        () => {
          this.$store.dispatch(`expert/${REMOVE_EXPERT}`, id).then(() => {
            this.$alert(this.getMessage, "Especialista removido!", "success");
            this.fetch();
          });
        },
        () => {
          this.$alert("Remoção cancelada!", "Informação", "info");
        }
      );
    }
  },
  created() {
    this.fetch();
  }
};
</script>
