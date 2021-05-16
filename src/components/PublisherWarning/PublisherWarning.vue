<template>

  <div class="mt-2">
    <v-slide-y-transition>
      <v-alert
          type="warning"
          text
          class="mb-10"
          v-if="showWarning"
      >



        <template v-if="id==='missingPerpetualAccess'">
          <div>
            <span class="font-weight-bold">Missing PTA:</span>
            We don't know this package's PTA (Post-Termination Access) rights, so we are assuming you have no PTA for
            any
            title. This is probabaly not true, and makes forecasting much less accurate. To fix, upload your PTA Dates
            file
            below.
          </div>
          <div class="mt-6 d-flex">
            <v-btn text small color="warning"
                   href="http://help.unsub.org/en/articles/5229614-warning-no-pta-file-uploaded"
                   target="_blank">
              <v-icon left small>mdi-open-in-new</v-icon>
              Learn more
            </v-btn>
          </div>
        </template>


        <template v-if="id==='missingPrices'">
          <div>
            <span class="font-weight-bold">Missing prices:</span>
            <template v-if="!!getPublisherDataFile('price')">
              Although you've uploaded a custom pricelist, there remain {{ journals.length | round }} journals with
              no
              price information.
              These are excluded from all forecasting.
            </template>
            <template v-if="!getPublisherDataFile('price')">
              There are {{ journals.length | round }} journals in this package with no price information.
            These journals are excluded from all forecasting.
            </template>

            To fix, upload a custom journal pricelist below, with price quotes for
            these missing titles.
          </div>
          <div class="mt-6 d-flex">
            <v-btn text small color="warning" href="http://help.unsub.org/en/articles/5229615-warning-missing-prices"
                   target="_blank">
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
    </v-slide-y-transition>
  </div>


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
import PublisherFileSetupTabFileDelete from "@/components/PulisherFile/PublisherFileSetupTabFileDelete";
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
    journals() {
      const myWarning = this.publisherWarnings.find(p => {
        return p.id === this.id
      })
      return myWarning?.journals ?? []
    },
    showWarning() {
      // hack for counter
      // if (this.id==='missingCounter') return true

      return !!this.publisherWarnings.find(p => {
        return p.id === this.id
      })

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
      const rows = this.journals
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