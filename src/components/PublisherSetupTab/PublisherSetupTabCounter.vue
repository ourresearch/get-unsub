<template>
  <v-card flat class="setup-subtab-content">
    <div>

      <div class="">
        <div class="font-weight-bold">
          COUNTER version
        </div>
        <div v-if="!publisherCounterVersion">
          This sets which type of COUNTER report you'll use. We recommend you use COUNTER 5 reports, which will generate more accurate forecasts.
        </div>
        <div v-if="publisherCounterVersion === 4">
          This sets which version of COUNTER report you're using. To edit, first delete the COUNTER 4 JR1 report that you've already uploaded.
        </div>
        <div v-if="publisherCounterVersion === 5">
          This sets which version of COUNTER report you're using. To edit, first delete the three COUNTER 5 reports that you've already uploaded.
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
      <div class="font-weight-bold mt-10 mb-1">
        COUNTER report files
      </div>
      <div v-if="counterFileType==='counter-5'">
        <div>
          For COUNTER 5, you'll need to upload three COUNTER 5 reports: your <strong>TR_J2, TR_J3,</strong> and <strong>TR_J4.</strong> Unsub requires all three files, in order to
          create your dashboard.
        </div>
        <v-list>
          <publisher-file file-type="counterTrj2"/>
          <publisher-file file-type="counterTrj3"/>
          <publisher-file file-type="counterTrj4"/>
        </v-list>
      </div>
      <div v-if="counterFileType==='counter-4'">
        <div>
          For COUNTER 4, you'll need to upload a single file:
        </div>
        <v-list>
          <publisher-file file-type="counter"/>

        </v-list>
      </div>

    </div>
  </v-card>


</template>


<script>
import _ from "lodash"
import {mapGetters, mapMutations, mapActions} from 'vuex'
import PublisherFile from "@/components/PulisherFile/PublisherFile";
import PublisherWarning from "@/components/PublisherWarning/PublisherWarning";


export default {
  name: "PublisherSetupTab",
  components: {
    PublisherFile,
    PublisherWarning,
  },
  props: {},
  data() {
    return {
      counterFileType: "counter-5",
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
        "getPublisherWarning",
    ]),
  },
  created() {
    if (this.publisherCounterVersion === 4) {
      this.counterFileType = "counter-4"
    }
    else {
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