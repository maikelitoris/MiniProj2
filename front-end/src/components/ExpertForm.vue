<template>
  <!-- Formulário do especialista (usado em Adicionar e em Editar). Campos da especificação da Tarefa 3.1 b). -->
  <form @submit.prevent="$emit('submit', form)">
    <div class="form-row">
      <div class="form-group col-md-3">
        <label for="sltTitle">Título</label>
        <select
          id="sltTitle"
          v-model="form.title"
          class="form-control form-control-lg"
        >
          <option value="">—</option>
          <option>Dr.</option>
          <option>Dra.</option>
          <option>Prof.</option>
          <option>Profa.</option>
        </select>
      </div>
      <div class="form-group col-md-9">
        <label for="txtName">Nome *</label>
        <input
          id="txtName"
          v-model.trim="form.name"
          type="text"
          maxlength="120"
          class="form-control form-control-lg"
          required
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group col-md-6">
        <label for="txtSpecialty">Especialidade (família ou espécie) *</label>
        <input
          id="txtSpecialty"
          v-model.trim="form.specialty"
          list="families"
          type="text"
          class="form-control form-control-lg"
          required
        />
        <datalist id="families">
          <option value="Felidae" />
          <option value="Canidae" />
          <option value="Ursidae" />
          <option value="Accipitridae" />
          <option value="Ranidae" />
          <option value="Cheloniidae" />
        </datalist>
      </div>
      <div class="form-group col-md-6">
        <label for="txtInstitution">Instituição *</label>
        <input
          id="txtInstitution"
          v-model.trim="form.institution"
          type="text"
          class="form-control form-control-lg"
          required
        />
      </div>
    </div>
    <div class="form-group">
      <label for="sltAnimals"
        >Animais que acompanha * (Ctrl para escolher vários)</label
      >
      <select
        id="sltAnimals"
        v-model="form.animals"
        multiple
        size="5"
        class="form-control"
        required
      >
        <option v-for="animal in animals" :key="animal._id" :value="animal._id"
          >{{ animal.name }} ({{ animal.group }})</option
        >
      </select>
    </div>
    <div class="form-row">
      <div class="form-group col-md-6">
        <label for="txtEmail">Email *</label>
        <input
          id="txtEmail"
          v-model.trim="form.email"
          type="email"
          class="form-control form-control-lg"
          required
        />
      </div>
      <div class="form-group col-md-6">
        <label for="txtOrcid">ORCID</label>
        <input
          id="txtOrcid"
          v-model.trim="form.orcid"
          type="text"
          pattern="\d{4}-\d{4}-\d{4}-\d{3}[\dX]"
          placeholder="0000-0000-0000-000X"
          title="Formato 0000-0000-0000-000X"
          class="form-control form-control-lg"
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group col-md-6">
        <label for="txtPhoto">Fotografia (link para a imagem)</label>
        <input
          id="txtPhoto"
          v-model.trim="form.photo"
          type="url"
          placeholder="https://"
          class="form-control form-control-lg"
        />
      </div>
      <div class="form-group col-md-6">
        <label for="txtSite">Página pessoal</label>
        <input
          id="txtSite"
          v-model.trim="form.website"
          type="url"
          placeholder="https://"
          class="form-control form-control-lg"
        />
      </div>
    </div>
    <div class="form-group">
      <label for="txtBio">Nota biográfica</label>
      <textarea
        id="txtBio"
        v-model.trim="form.bio"
        maxlength="500"
        rows="4"
        class="form-control"
      ></textarea>
      <small class="form-text text-muted"
        >{{ (form.bio || "").length }}/500</small
      >
    </div>
    <div class="form-group form-check">
      <input
        id="chkQuizzes"
        v-model="form.canValidateQuizzes"
        type="checkbox"
        class="form-check-input"
      />
      <label for="chkQuizzes" class="form-check-label"
        >Pode validar quizzes dos animais que acompanha</label
      >
    </div>
    <div class="form-group form-check">
      <input
        id="chkActive"
        v-model="form.active"
        type="checkbox"
        class="form-check-input"
      />
      <label for="chkActive" class="form-check-label">Ativo</label>
    </div>
    <button type="submit" class="btn btn-outline-success btn-lg mr-2">
      <i :class="'fas ' + icon"></i> {{ submitLabel }}
    </button>
    <router-link
      :to="{ name: 'listExperts' }"
      tag="button"
      class="btn btn-outline-danger btn-lg"
    >
      <i class="fas fa-window-close"></i> CANCELAR
    </router-link>
  </form>
</template>

<script>
import { FETCH_ANIMALS } from "@/store/animals/animal.constants";
import { mapGetters } from "vuex";

export default {
  name: "ExpertForm",
  props: {
    value: { type: Object, default: () => ({}) },
    submitLabel: { type: String, default: "GUARDAR" },
    icon: { type: String, default: "fa-save" }
  },
  data() {
    const v = this.value || {};
    return {
      form: {
        _id: v._id,
        name: v.name || "",
        title: v.title || "",
        photo: v.photo || "",
        specialty: v.specialty || "",
        institution: v.institution || "",
        animals: (v.animals || []).map(a =>
          typeof a === "object" ? a._id : a
        ),
        orcid: v.orcid || "",
        bio: v.bio || "",
        email: v.email || "",
        website: v.website || "",
        canValidateQuizzes: !!v.canValidateQuizzes,
        active: v.active === undefined ? true : v.active
      }
    };
  },
  computed: {
    ...mapGetters("animal", ["getAnimals"]),
    animals() {
      return this.getAnimals;
    }
  },
  created() {
    if (this.getAnimals.length === 0)
      this.$store.dispatch(`animal/${FETCH_ANIMALS}`);
  }
};
</script>
