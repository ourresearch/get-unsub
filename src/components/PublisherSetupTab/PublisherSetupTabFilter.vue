<template>
  <v-card flat  class="setup-subtab-content">

    <div class="">

      <div class="font-weight-bold">
        Your spreadsheet or KBART file
      </div>
      <div>
        Upload your file as either a:

        <ol>
          <li>Spreadsheet with one journal per row. The spreadsheet should have one column (<a target="_blank" href="https://en.wikipedia.org/wiki/International_Standard_Serial_Number">ISSN</a>).</li>
          <li><a target="_blank" href="https://www.niso.org/standards-committees/kbart">KBART file</a></li>
        </ol>
        Accepted file formats for both: <code>.txt</code>, <code>.csv</code>, <code>.xlsx</code>, and <code>.xls</code>.
      </div>
      <v-list>
        <publisher-file file-type="filter"/>
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
  name: "PublisherSetupTabFilter",
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
