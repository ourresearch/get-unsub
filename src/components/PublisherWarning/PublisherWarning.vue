<template>

  <div>
    <span class="d-flex body-2 align-start py-2">
      <v-icon left color="warning">mdi-alert-outline</v-icon>
      <div>
        <span class="font-weight-bold f" v-html="warning.displayName"/>:
        <span v-html="warning.msg"/>
      </div>
      <v-spacer />
      <div>
        <v-btn icon>
          <v-icon>
          mdi-help-circle-outline
          </v-icon>
        </v-btn>
      </div>
    </span>

    <v-list-item v-if="0">
      <v-list-item-icon>
        <v-icon color="warning">mdi-alert-outline</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <template v-if="warning.id==='missingPerpetualAccess'">
          <div class="font-weight-bold mb-2">
            Missing PTA Data:
          </div>
          <div class="">
            We don't know your PTA (Post-Termination Access) rights; this makes forecasting much less accurate.
            <span>To fix, upload your PTA data.</span>
          </div>
        </template>

        <template v-if="warning.id==='missingPrices'">
          <div class="font-weight-bold ">
            Missing Price Data:
          </div>
          <div class=" ">
            We're missing price data for some journals; these are excluded from all forecasting.
            <span>To fix, upload your prices for these titles.</span>

          </div>
        </template>
      </v-list-item-content>
    </v-list-item>

  </div>


  <!--      <div class="">-->


  <!--      </div>-->

  <!--    <v-list-item-action>-->

  <!--      <v-menu-->
  <!--          offset-y-->
  <!--      >-->
  <!--        <template v-slot:activator="{ on }">-->
  <!--          <v-btn icon v-on="on">-->
  <!--            <v-icon>mdi-dots-vertical</v-icon>-->
  <!--          </v-btn>-->
  <!--        </template>-->
  <!--        <v-list>-->
  <!--          <v-list-item>-->
  <!--            <v-list-item-icon>-->
  <!--              <v-icon>mdi-medical-bag</v-icon>-->
  <!--            </v-list-item-icon>-->
  <!--            <v-list-item-title>-->
  <!--              Fix it-->
  <!--            </v-list-item-title>-->
  <!--          </v-list-item>-->
  <!--          <v-list-item>-->
  <!--            <v-list-item-icon>-->
  <!--              <v-icon>mdi-volume-off</v-icon>-->
  <!--            </v-list-item-icon>-->
  <!--            <v-list-item-title>-->
  <!--              Mute this warning-->
  <!--            </v-list-item-title>-->
  <!--          </v-list-item>-->
  <!--          <v-list-item v-if="warning.journals">-->
  <!--            <v-list-item-icon>-->
  <!--              <v-icon>mdi-download</v-icon>-->
  <!--            </v-list-item-icon>-->
  <!--            <v-list-item-title>-->
  <!--              View affected journals-->
  <!--            </v-list-item-title>-->
  <!--          </v-list-item>-->
  <!--        </v-list>-->
  <!--      </v-menu>-->

  <!--    </v-list-item-action>-->


  <!--      <v-btn text :disabled="isLoading">-->
  <!--        View Journals-->
  <!--      </v-btn>-->
  <!--      <v-btn text-->
  <!--             @click="setWarningIsDismissed(warning.id, true)"-->
  <!--             :disabled="isLoading"-->
  <!--      >-->
  <!--        Mute-->
  <!--      </v-btn>-->


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