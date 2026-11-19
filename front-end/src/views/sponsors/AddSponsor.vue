<template>
  <section class="page-section">
    <b-container>
      <HeaderPage title="Adicionar Patrocinador" />
      <b-row>
        <b-col cols="2"></b-col>
        <b-col>
          <SponsorForm
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
import { ADD_SPONSOR } from "@/store/sponsors/sponsor.constants";
import HeaderPage from "@/components/HeaderPage.vue";
import SponsorForm from "@/components/SponsorForm.vue";
import router from "@/router";
import { mapGetters } from "vuex";

export default {
  name: "AddSponsor",
  components: { HeaderPage, SponsorForm },
  computed: {
    ...mapGetters("sponsor", ["getMessage"])
  },
  methods: {
    add(form) {
      const payload = { ...form };
      delete payload._id;
      this.$store.dispatch(`sponsor/${ADD_SPONSOR}`, payload).then(
        () => {
          this.$alert(this.getMessage, "Patrocinador adicionado!", "success");
          router.push({ name: "listSponsors" });
        },
        err => {
          this.$alert(`${err.message}`, "Erro", "error");
        }
      );
    }
  }
};
</script>
