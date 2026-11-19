<template>
  <section class="page-section">
    <b-container>
      <HeaderPage title="Gestão de Patrocinadores" />
      <!--MENU TOPO-->
      <b-row class="mb-4">
        <b-col cols="2"></b-col>
        <b-col>
          <router-link
            :to="{ name: 'addSponsor' }"
            tag="button"
            class="btn btn-outline-success mr-2 mt-2"
          >
            <i class="fas fa-plus-square"></i> ADICIONAR PATROCINADOR
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
            Ainda não há patrocinadores registados.
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
                  <th scope="col">TIPO</th>
                  <th scope="col">NÍVEL</th>
                  <th scope="col">ANIMAIS</th>
                  <th scope="col">ESTADO</th>
                  <th scope="col">AÇÕES</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item of items" :key="item._id">
                  <td class="pt-4">{{ item.name }}</td>
                  <td class="pt-4">{{ item.type }}</td>
                  <td class="pt-4">{{ item.level }}</td>
                  <td class="pt-4">{{ animalNames(item) }}</td>
                  <td class="pt-4">
                    <b-badge :variant="item.active ? 'success' : 'secondary'">{{
                      item.active ? "ativo" : "inativo"
                    }}</b-badge>
                  </td>
                  <td>
                    <router-link
                      :to="{
                        name: 'editSponsor',
                        params: { sponsorId: item._id }
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
  FETCH_SPONSORS,
  EDIT_SPONSOR,
  REMOVE_SPONSOR
} from "@/store/sponsors/sponsor.constants";
import HeaderPage from "@/components/HeaderPage.vue";
import { mapGetters } from "vuex";

export default {
  name: "ListSponsors",
  components: { HeaderPage },
  data: function() {
    return {
      items: [],
      sortType: 1
    };
  },
  computed: {
    ...mapGetters("sponsor", ["getSponsors", "getMessage"])
  },
  methods: {
    fetch() {
      this.$store.dispatch(`sponsor/${FETCH_SPONSORS}`).then(
        () => {
          this.items = [...this.getSponsors];
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
        imageUrl: item.logo || undefined,
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
      return `<p><b>Tipo:</b> ${esc(item.type)} · <b>Nível:</b> ${esc(
        item.level
      )}</p>
        <p><b>Email:</b> ${esc(item.email)}${
        item.website
          ? ` · <a href="${esc(item.website)}" target="_blank">site</a>`
          : ""
      }</p>
        <p><b>Animais:</b> ${esc(this.animalNames(item))}</p>
        <p><i>${esc(item.message)}</i></p>`;
    },
    toggleActive(item) {
      const payload = { _id: item._id, active: !item.active };
      this.$store
        .dispatch(`sponsor/${EDIT_SPONSOR}`, payload)
        .then(
          () => this.fetch(),
          err => this.$alert(`${err.message}`, "Erro", "error")
        );
    },
    remove(id) {
      this.$confirm(
        "Se sim, clique em OK",
        "Deseja mesmo remover o patrocinador?",
        "warning",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancelar"
        }
      ).then(
        () => {
          this.$store.dispatch(`sponsor/${REMOVE_SPONSOR}`, id).then(() => {
            this.$alert(this.getMessage, "Patrocinador removido!", "success");
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
