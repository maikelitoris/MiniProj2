<template>
  <section class="page-section">
    <b-container>
      <HeaderPage title="Editar Patrocinador" />
      <b-row>
        <b-col cols="2"></b-col>
        <b-col>
          <SponsorForm
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
import {
  FETCH_SPONSORS,
  EDIT_SPONSOR
} from "@/store/sponsors/sponsor.constants";
import HeaderPage from "@/components/HeaderPage.vue";
import SponsorForm from "@/components/SponsorForm.vue";
import router from "@/router";
import { mapGetters } from "vuex";

export default {
  name: "EditSponsor",
  components: { HeaderPage, SponsorForm },
  data: () => ({ item: null }),
  computed: {
    ...mapGetters("sponsor", ["getSponsorById", "getMessage"])
  },
  methods: {
    update(form) {
      this.$store.dispatch(`sponsor/${EDIT_SPONSOR}`, form).then(
        () => {
          this.$alert(this.getMessage, "Patrocinador atualizado!", "success");
          router.push({ name: "listSponsors" });
        },
        err => {
          this.$alert(`${err.message}`, "Erro", "error");
        }
      );
    }
  },
  created() {
    // se a página for aberta diretamente (sem passar pela lista), vai buscar a lista primeiro
    const id = this.$route.params.sponsorId;
    const load = () => (this.item = this.getSponsorById(id) || null);
    if (this.getSponsorById(id)) load();
    else this.$store.dispatch(`sponsor/${FETCH_SPONSORS}`).then(load);
  }
};
</script>
