<template>

  <v-alert
      type="warning"
      text
      outlined
      icon="mdi-alert"
      class="mb-10"
      v-if="myWarning"
  >
    <template v-if="id==='missingPrices'">
      <div>
        This package has {{ myWarning.journals.length | round }} journals with no price information.
        These journals are excluded from all forecasting. To fix, upload <strong>Custom pricelist</strong> below, with price quotes for these missing titles.
      </div>
      <div class="mt-6">
        <v-btn text small color="warning" href="http://help.unsub.org" target="_blank">
          <v-icon left small>mdi-open-in-new</v-icon>
          Learn more
        </v-btn>
        <v-btn text small color="warning" @click="download">
          <v-icon left small>mdi-download</v-icon>
          View journals
        </v-btn>
      </div>
    </template>
    <template v-if="id==='missingPerpetualAccess'">
      <div>
        We don't know this package's PTA (Post-Termination Access) rights; this makes forecasting much less accurate
      </div>
      <div class="mt-6">
        <v-btn text small color="warning" href="http://help.unsub.org" target="_blank">
          <v-icon left small>mdi-open-in-new</v-icon>
          Learn more
        </v-btn>
        <v-btn text small color="warning" @click="download">
          <v-icon left small>mdi-download</v-icon>
          View journals
        </v-btn>
      </div>
    </template>
  </v-alert>

</template>

<script>
import _ from "lodash"
import {sleep} from "@/shared/util";
import {makePublisherFileStatus} from "@/shared/publisherFileStatus";

const queryString = require('query-string');
import axios from "axios";

import {ExportToCsv} from 'export-to-csv'
import {mapGetters, mapMutations, mapActions} from 'vuex'
import {api, toBase64} from "../../api";
import PublisherFileSetupTabFileDelete from "@/components/Publisher/PublisherFileSetupTabFileDelete";
import Publisher from "@/views/Publisher";


export default {
  name: "PublisherFileUpload",
  props: {
    "id": String,
  },
  components: {},
  data() {
    return {
      isLoading: false,
    }
  },
  computed: {
    ...mapGetters([
      "publisherId",
      "institutionIsDemo",
      "publisherPublisher",
      "getPublisherDataFile",
      "publisherWarnings",
    ]),
    myWarning() {
      return this.publisherWarnings.find(p => {
        return p.id === this.id
      })
    },
    showWarning() {

    }
  },
  methods: {
    ...mapActions([
      "refreshPublisherFileStatus",
    ]),
    ...mapMutations([
      "snackbar",
    ]),
    async download() {
      const rows = this.myWarning.journals
      console.log("download journal rows", rows)
      const csvExporter = new ExportToCsv({
        useKeysAsHeaders: true,
      });
      csvExporter.generateCsv(rows);
      this.snackbar(`Journals downloaded.`)

    },

  },
  async created() {
    // this.myDataFile = this.getPublisherDataFile(this.fileType)
  }
}
</script>

<style scoped>

</style>