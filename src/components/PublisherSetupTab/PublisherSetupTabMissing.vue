<template>
  <v-card flat  class="setup-subtab-content">

    <div class="">

    <div class="pb-3">
      Titles can be <a href="https://docs.unsub.org/troubleshooting/why-dont-i-see-a-certain-title-in-my-dashboard">missing from your dashboard for four reasons</a>. Here, you can download a report as a CSV file with those titles that are missing, and for what reason(s) they are missing. Importantly, the same titles will be missing from all scenarios within this package. Read <a href="https://docs.unsub.org/how-to-guides/missing-titles-report" target="_blank">the documentation</a> for more information.
    </div>

    <div class="pb-3 pt-3">
      Click the button below to get your missing titles report.
    </div>

    <v-card flat>
      <div class="d-flex pt-3">
        <v-btn color="primary" @click="" :href="csvUrl">
          <v-icon left>mdi-download</v-icon>
          Download
        </v-btn>
      </div>
    </v-card>

    </div>
  </v-card>
</template>


<script>
import _ from "lodash"
import {mapGetters, mapMutations, mapActions} from 'vuex'
import {urlBase} from "../../api";
import PublisherFile from "../PulisherFile/PublisherFile";
import PublisherWarning from "@/components/PublisherWarning/PublisherWarning";

export default {
  name: "PublisherSetupTabMissing",
  components: {
    PublisherFile,
    PublisherWarning,
  },
  props: {},
  data() {
    return {}
  },
  methods: {},
  computed: {
    ...mapGetters([
      "publisherName",
      "publisherId",
      "publisherBigDealCost",
      "publisherFiles",
      "getPublisherDataFile",
      "publisherCounterVersion",
    ]),
    csvUrl() {
      // urlBase ends with a slash
      let url = `${urlBase}publisher/${this.publisherId}/missing`;
      url += "?timestamp=" + `${new Date().getTime()}`
      url += "&jwt=" + localStorage.getItem("token")
      return url
    },
  },
  created() {
  },
  mounted() {

  },
  watch: {}
}
</script>

<style lang="scss">


</style>
