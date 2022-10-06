<template>
  <v-card flat  class="setup-subtab-content">

    <div class="">

    <div class="pb-3">
      Some journals in your COUNTER reports are excluded from scenario forecasts for a <a href="https://docs.unsub.org/troubleshooting/why-dont-i-see-a-certain-title-in-my-dashboard" target="_blank">variety of reasons</a>. Here, you can download a report as a CSV file with those titles that are excluded, and for what reason(s) they are excluded. Read <a href="https://docs.unsub.org/how-to-guides/excluded-titles-report" target="_blank">the documentation</a> for more information.
    </div>

    <v-card flat>
      <div class="d-flex pt-3">
        <v-btn color="primary" @click="" :href="csvUrl">
          <v-icon left>mdi-download</v-icon>
          Excluded Titles
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
  name: "PublisherSetupTabExcluded",
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
      let url = `${urlBase}publisher/${this.publisherId}/excluded`;
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
