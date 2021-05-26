<template>
  <v-card flat  class="setup-subtab-content">

    <div class="">

      <div class="font-weight-bold">
        Your PTA file
      </div>
      <div>
        Upload your PTA (Post-Termination Access) dates as a spreadsheet with one journal per row. The spreadsheet should have three columns: <strong>ISSN</strong>,
                        <strong>Start date</strong>, and
                        <strong>End date</strong>.
        For journals where the PTA is ongoing, just leave the <strong>End Date</strong> blank.
        Accepted formats are:
        <code>.csv</code>,
        <code>.xlsx</code>, and
        <code>.xls</code>.
      </div>
      <v-list>
        <publisher-file file-type="perpetualAccess"/>
      </v-list>

    </div>
  </v-card>


</template>


<script>
import _ from "lodash"
import {mapGetters, mapMutations, mapActions} from 'vuex'
import PublisherFile from "../PulisherFile/PublisherFile";
import PublisherWarning from "@/components/PublisherWarning/PublisherWarning";


export default {
  name: "PublisherSetupTabPta",
  components: {
    PublisherFile,
    PublisherWarning,
  },
  props: {},
  data() {
    return {
      counterFileType: "counter-4",
      isUploadFileLoading: false, // temporary to silence console errors
      fileSelected: null,
      errorMsg: null,


    }
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