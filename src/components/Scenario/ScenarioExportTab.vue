<template>
  <v-card flat class="px-6">
    <p>
      You can export all of the data in this scenario as a CSV file. You can find <a
        href="http://help.unsub.org/en/articles/4246610-what-are-the-columns-in-download-as-spreadsheet">documentation
      for the column names here.</a>
    </p>
    <p>
       To further explore and visualize your exported data,
      check out
      <a href="https://unsubextender.lib.iastate.edu/" target="_blank">Unsub Extender,</a> a free third-party tool created by Eric
      Schares, a librarian at Iowa State University.
    </p>
    <v-btn color="primary" @click="" :href="csvUrl">
      <v-icon left>mdi-download</v-icon>
      Download
    </v-btn>
  </v-card>


</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import {urlBase} from "../../api";


export default {
  name: "ScenarioExportTab",
  components: {},
  props: {
    myRole: String,
    isConsortialFeeder: Boolean,
    publishers: Array,
  },
  data() {
    return {
      dialogs: {
        createGroupMember: false,
      }
    }
  },
  methods: {
    ...mapMutations([
      "snackbar",
    ]),
  },
  computed: {
    ...mapGetters([
      'institutionId',
      'institutionName',
      'institutionIsDemo',
      "institutionIsConsortium",
      "institutionUsersWithRoles",
      'userConsortia',
      'userInstitutions',
    ]),
    csvUrl() {
      let scenarioId = this.$store.getters.scenarioId
      let url = `${urlBase}scenario/${scenarioId}/export.csv`; // urlBase ends with a slash
      url += "?timestamp=" + `${new Date().getTime()}`
      url += "&jwt=" + localStorage.getItem("token")
      return url

    }

  },
  created() {
  },
  mounted() {
  },
  watch: {
    "foo": {
      immediate: true,
      handler: function (to, from) {
      }
    }
  }
}
</script>

<style lang="scss">


</style>