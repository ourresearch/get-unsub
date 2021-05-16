<template>

  <div class="mt-2">
    <v-slide-y-transition>
      <v-alert
          :type="alertType"
          text
          :icon="alertIcon"
      >
        <div class="d-flex">
          <div>
            <div v-html="msg"/>
                    <div class="d-flex">
          <v-spacer />
          <v-btn @click="download" v-if="journals" class=" mt-3" text :color="alertType">
            <v-icon left>mdi-download</v-icon>
            View missing titles
          </v-btn>

        </div>
          </div>
          <v-spacer/>
          <v-btn icon
                 small
                 :color="alertType"
                 :href="url"
                 target="_blank"
                 class="ml-4"
                 v-if="!isSuccess"
          >
            <v-icon>mdi-help-circle-outline</v-icon>
          </v-btn>
        </div>

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
import PublisherFileSetupTabFileDelete from "@/components/PulisherFile/PublisherFileDelete";
import Publisher from "@/views/Publisher";


export default {
  name: "PublisherFileUpload",
  props: {
    "id": String,
    "isRequired": Boolean,
    "isSuccess": Boolean,
    "url": String,
    "msg": String,
    "journals": Array,
  },
  components: {},
  data() {
    return {
      isLoading: false,
    }
  },
  computed: {
    ...mapGetters([
    ]),
    alertType() {
      if (this.isSuccess) return "success"
      return (this.isRequired) ? "error" : "warning"
    },
    alertIcon() {
      if (this.isSuccess)  return "mdi-check-outline"
      return (this.isRequired) ? "mdi-close-outline" : "mdi-alert"
    },
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