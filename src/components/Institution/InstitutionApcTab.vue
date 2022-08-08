<template>
  <v-card flat class="publisher">

    <template>
      <v-card flat class="pa-5">
        <div class="pa-3">
          Download a report with estimates of APC spend at the journal level. These sums includes APCs paid to gold and hybrid OA journals. Because we do not have access to corresponding author information, this is an estimate only; it assumes that any author on a given paper has an equal likelihood of being the corresponding author.
        </div>
        <div class="pa-3">
          This report is at the institution level. We used to provide APC reports at the package level, but with adding support for all publishers, we could no longer support package level APC reports.
        </div>
        <div class="pa-3">
          This report only includes APC spend estimates for the big five publishers: Elsevier, Wiley, Springer Nature, SAGE and Taylor & Francis.
        </div>
        <div class="pa-3">
          For more on the APC report, go to the documentation page <a href="">Stuff and things</a>
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
