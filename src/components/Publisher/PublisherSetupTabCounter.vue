<template>
  <v-card flat class="">
    <div class="pa-3">
      <div class="">
        <div class="">
          COUNTER version

        </div>
        <v-radio-group
            class="mt-0"
            row
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
      <div class="">
        Upload your files
      </div>
      <div v-if="counterFileType==='counter-5'">
        <div>
          For COUNTER 5, you'll need to upload three files. Unsub requires all three in order to
          create your dashboard:
        </div>
        <publisher-setup-tab-file-upload file-type="counterTrj2"/>
        <publisher-setup-tab-file-upload file-type="counterTrj3"/>
        <publisher-setup-tab-file-upload file-type="counterTrj4"/>
      </div>
      <div v-if="counterFileType==='counter-4'">
        <div>
          For COUNTER 4, you'll need to upload a single file:
        </div>
        <publisher-setup-tab-file-upload file-type="counter"/>
      </div>

    </div>
  </v-card>


</template>


<script>
import _ from "lodash"
import {mapGetters, mapMutations, mapActions} from 'vuex'
import PublisherSetupTabFileUpload from "./PublisherSetupTabFileUpload";


export default {
  name: "PublisherSetupTab",
  components: {
    PublisherSetupTabFileUpload,
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
    if (this.publisherCounterVersion === 5) {
      this.counterFileType = "counter-5"
    }

  },
  watch: {}
}
</script>

<style lang="scss">


</style>