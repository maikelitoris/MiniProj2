<template>
  <section class="page-section">
    <b-container>
      <HeaderPage title="Adicionar Especialista" />
      <b-row>
        <b-col cols="2"></b-col>
        <b-col>
          <ExpertForm
            submitLabel="ADICIONAR"
            icon="fa-plus-square"
            @submit="add"
          />
        </b-col>
        <b-col cols="2"></b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import { ADD_EXPERT } from "@/store/experts/expert.constants";
import HeaderPage from "@/components/HeaderPage.vue";
import ExpertForm from "@/components/ExpertForm.vue";
import router from "@/router";
import { mapGetters } from "vuex";

export default {
  name: "AddExpert",
  components: { HeaderPage, ExpertForm },
  computed: {
    ...mapGetters("expert", ["getMessage"])
  },
  methods: {
    add(form) {
      const payload = { ...form };
      delete payload._id;
      this.$store.dispatch(`expert/${ADD_EXPERT}`, payload).then(
        () => {
          this.$alert(this.getMessage, "Especialista adicionado!", "success");
          router.push({ name: "listExperts" });
        },
        err => {
          this.$alert(`${err.message}`, "Erro", "error");
        }
      );
    }
  }
};
</script>
