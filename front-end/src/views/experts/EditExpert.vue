<template>
  <section class="page-section">
    <b-container>
      <HeaderPage title="Editar Especialista" />
      <b-row>
        <b-col cols="2"></b-col>
        <b-col>
          <ExpertForm
            v-if="item"
            :value="item"
            submitLabel="ATUALIZAR"
            icon="fa-edit"
            @submit="update"
          />
          <p v-else class="text-center">A carregar…</p>
        </b-col>
        <b-col cols="2"></b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import { FETCH_EXPERTS, EDIT_EXPERT } from "@/store/experts/expert.constants";
import HeaderPage from "@/components/HeaderPage.vue";
import ExpertForm from "@/components/ExpertForm.vue";
import router from "@/router";
import { mapGetters } from "vuex";

export default {
  name: "EditExpert",
  components: { HeaderPage, ExpertForm },
  data: () => ({ item: null }),
  computed: {
    ...mapGetters("expert", ["getExpertById", "getMessage"])
  },
  methods: {
    update(form) {
      this.$store.dispatch(`expert/${EDIT_EXPERT}`, form).then(
        () => {
          this.$alert(this.getMessage, "Especialista atualizado!", "success");
          router.push({ name: "listExperts" });
        },
        err => {
          this.$alert(`${err.message}`, "Erro", "error");
        }
      );
    }
  },
  created() {
    // se a página for aberta diretamente (sem passar pela lista), vai buscar a lista primeiro
    const id = this.$route.params.expertId;
    const load = () => (this.item = this.getExpertById(id) || null);
    if (this.getExpertById(id)) load();
    else this.$store.dispatch(`expert/${FETCH_EXPERTS}`).then(load);
  }
};
</script>
