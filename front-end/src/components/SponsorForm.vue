<template>
  <!-- Formulário do patrocinador (usado em Adicionar e em Editar). Campos da especificação da Tarefa 3.1 b). -->
  <form @submit.prevent="$emit('submit', form)">
    <div class="form-group">
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
    <div class="form-row">
      <div class="form-group col-md-6">
        <label for="sltType">Tipo *</label>
        <select
          id="sltType"
          v-model="form.type"
          class="form-control form-control-lg"
          required
        >
          <option value="">-- SELECIONA O TIPO --</option>
          <option value="empresa">Empresa</option>
          <option value="associacao">Associação</option>
          <option value="particular">Particular</option>
        </select>
      </div>
      <div class="form-group col-md-6">
        <label for="sltLevel">Nível *</label>
        <select
          id="sltLevel"
          v-model="form.level"
          class="form-control form-control-lg"
          required
        >
          <option value="">-- SELECIONA O NÍVEL --</option>
          <option value="ouro">Ouro</option>
          <option value="prata">Prata</option>
          <option value="bronze">Bronze</option>
        </select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group col-md-6">
        <label for="txtNif">NIF</label>
        <input
          id="txtNif"
          v-model.trim="form.nif"
          type="text"
          pattern="[0-9]{9}"
          title="9 algarismos"
          class="form-control form-control-lg"
        />
      </div>
      <div class="form-group col-md-6">
        <label for="txtPhone">Telefone</label>
        <input
          id="txtPhone"
          v-model.trim="form.phone"
          type="tel"
          class="form-control form-control-lg"
        />
      </div>
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
        <label for="txtSite">Site</label>
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
      <label for="txtLogo">Logótipo (link para a imagem)</label>
      <input
        id="txtLogo"
        v-model.trim="form.logo"
        type="url"
        placeholder="https://"
        class="form-control form-control-lg"
      />
    </div>
    <div class="form-group">
      <label for="sltAnimals"
        >Animais patrocinados * (Ctrl para escolher vários)</label
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
        <label for="dtStart">Data de início *</label>
        <input
          id="dtStart"
          v-model="form.startDate"
          type="date"
          class="form-control form-control-lg"
          required
        />
      </div>
      <div class="form-group col-md-6">
        <label for="dtEnd">Data de fim</label>
        <input
          id="dtEnd"
          v-model="form.endDate"
          type="date"
          :min="form.startDate"
          class="form-control form-control-lg"
        />
      </div>
    </div>
    <div class="form-group">
      <label for="txtMessage">Mensagem para o público</label>
      <textarea
        id="txtMessage"
        v-model.trim="form.message"
        maxlength="300"
        rows="3"
        class="form-control"
      ></textarea>
      <small class="form-text text-muted"
        >{{ (form.message || "").length }}/300</small
      >
    </div>
    <div class="form-group form-check">
      <input
        id="chkActive"
        v-model="form.active"
        type="checkbox"
        class="form-check-input"
      />
      <label for="chkActive" class="form-check-label"
        >Ativo (aparece na página principal)</label
      >
    </div>
    <button type="submit" class="btn btn-outline-success btn-lg mr-2">
      <i :class="'fas ' + icon"></i> {{ submitLabel }}
    </button>
    <router-link
      :to="{ name: 'listSponsors' }"
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

// Datas do MongoDB vêm em ISO (2026-11-01T00:00:00.000Z); o <input type="date"> precisa de 2026-11-01
const toDateInput = d => (d ? String(d).substring(0, 10) : "");

export default {
  name: "SponsorForm",
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
        type: v.type || "",
        nif: v.nif || "",
        logo: v.logo || "",
        email: v.email || "",
        website: v.website || "",
        phone: v.phone || "",
        level: v.level || "",
        // a API devolve os animais já preenchidos (populate); o formulário só precisa dos ids
        animals: (v.animals || []).map(a =>
          typeof a === "object" ? a._id : a
        ),
        startDate: toDateInput(v.startDate),
        endDate: toDateInput(v.endDate),
        message: v.message || "",
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
