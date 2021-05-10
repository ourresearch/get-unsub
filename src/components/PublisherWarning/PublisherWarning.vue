<template>
  <v-card flat>
    <div class="d-flex">
      <div style="width: 200px;">
        <v-icon color="warning">mdi-alert-outline</v-icon>
      </div>
      <div>
        <div class="font-weight-bold" v-html="warning.displayName"/>
        <div class="body-2" v-html="warning.msg"></div>
      </div>
      <v-btn text :disabled="isLoading">
        View Journals
      </v-btn>
      <v-btn text
             @click="setWarningIsDismissed(warning.id, true)"
             :disabled="isLoading"
      >
        Mute
      </v-btn>
    </div>
  </v-card>


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
    "warning": Object,
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
    ]),
  },
  methods: {
    ...mapActions([
      "refreshPublisherFileStatus",
    ]),
    ...mapMutations([
      "snackbar",
    ]),
    async toggleWarningIsDismissed() {

    },
    async setWarningIsDismissed(id, newVal) {
      console.log("editWarning()", id, newVal)
      this.isLoading = true
      this.$store.commit("startGlobalLoading")
      const path = `publisher/${this.publisherId}`
      const postData = {
        warnings: [
          {id: _.snakeCase(id), is_dismissed: newVal,},
        ]
      }
      const snackbarMsg = (newVal) ? "Warning muted." : "Warning unmuted."
      try {
        await api.postFile(path, postData)
        await this.$store.dispatch("refreshPublisher")
        this.$store.commit("snackbar", snackbarMsg)
      } catch (e) {
        console.log("there was an error.")
      } finally {
        this.isLoading = false
        this.$store.commit("finishGlobalLoading")
      }
    }

  },
  async created() {
    // this.myDataFile = this.getPublisherDataFile(this.fileType)
  }
}
</script>

<style scoped>

</style>