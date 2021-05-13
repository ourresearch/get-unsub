<template>
  <v-card flat class="">
    <div class="pt-2 px-12">
      <publisher-warning id="missingCounter" />
      <div class="">
        <div class="text-h6">
          COUNTER version
        </div>
        <div class="pa-3">
          To change this, first delete the
          <span v-if="publisherCounterVersion === 4">COUNTER 4 JR1 file</span>
          <span v-if="publisherCounterVersion === 5">COUNTER 5 files</span>
          currently in use.
        </div>
        <div class="pa-3">
          <v-radio-group
              class="mt-0"
              v-model="counterFileType"
          >
            <v-radio
                value="counter-4"
                label="COUNTER 4"
                :disabled="publisherCounterVersion === 5"
            />
            <v-radio
                value="counter-5"
                label="COUNTER 5"
                :disabled="publisherCounterVersion === 4"
            />
          </v-radio-group>

        </div>
      </div>
      <div class="text-h6 mt-10 mb-1">
        COUNTER report files
      </div>
      <div v-if="counterFileType==='counter-5'">
        <div>
          For COUNTER 5, you'll need to upload three COUNTER 5 reports: your <strong>TR_J2, TR_J3,</strong> and <strong>TR_J4.</strong> Unsub requires all three files, in order to
          create your dashboard.
        </div>
        <v-list>
          <publisher-setup-tab-file-upload file-type="counterTrj2"/>
          <publisher-setup-tab-file-upload file-type="counterTrj3"/>
          <publisher-setup-tab-file-upload file-type="counterTrj4"/>
        </v-list>
      </div>
      <div v-if="counterFileType==='counter-4'">
        <div>
          For COUNTER 4, you'll need to upload a single file:
        </div>
        <v-list>
          <publisher-setup-tab-file-upload file-type="counter"/>

        </v-list>
      </div>

    </div>
  </v-card>


</template>


<script>
import _ from "lodash"
import {mapGetters, mapMutations, mapActions} from 'vuex'
import PublisherSetupTabFileUpload from "./PublisherSetupTabFile";
import PublisherWarning from "@/components/PublisherWarning/PublisherWarning";


export default {
  name: "PublisherSetupTab",
  components: {
    PublisherSetupTabFileUpload,
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
    if (this.publisherCounterVersion === 5) {
      this.counterFileType = "counter-5"
    }
  },
  mounted() {

  },
  watch: {}
}
</script>

<style lang="scss">


</style>