<template>
  <v-card flat class="publisher">

    <template>
      <v-card flat class="pa-5">
        <div class="pa-3">
          Download a report with estimates of your institution's APC spend on gold and hybrid open-access articles. When OpenAlex identifies your institution as the corresponding institution on an article, we attribute the full APC to you. When corresponding-institution information is not available, we fall back to an estimate that assumes each author on the article had an equal likelihood of being the corresponding author.
        </div>
        <div class="pa-3">
          Articles are drawn from OpenAlex and priced individually using OpenAlex's per-article APC data, which now covers a wide range of publishers.
        </div>
        <div class="pa-3">
          Read <a href="https://docs.unsub.org/how-to-guides/apc-report" target="_blank">the documentation on the APC report</a> for more information.
        </div>
      </v-card>
    </template>

    <template>
      <v-card flat class="pa-5">
        <div class="d-flex px-3">
          <v-btn color="primary" @click="" :href="csvUrl">
            <v-icon left>mdi-download</v-icon>
            Download
          </v-btn>
        </div>
      </v-card>
    </template>

  </v-card>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex'
import {urlBase} from "../../api";

export default {
  name: "InstitutionApcTab",
  components: {},
  data() {
    return {
      search: "",
    }
  },
  computed: {
    ...mapGetters([
      "institutionName",
      "institutionId",
      "institutionIsJisc",
      "institutionIsConsortium",
    ]),
    csvUrl() {
      // urlBase ends with a slash
      let url = `${urlBase}institution/${this.institutionId}/apc/export.csv`;
      url += "?timestamp=" + `${new Date().getTime()}`
      url += "&jwt=" + localStorage.getItem("token")
      return url
    },
  },
  methods: {},

  created() {
  },
  async mounted() {


  },
}
</script>

<style lang="scss">
.v-toolbar__extension {
  border-top: none !important;
}

</style>
