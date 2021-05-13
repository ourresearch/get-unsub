<template>
  <v-card flat class="">
    <div class="pt-2 px-12">
      <publisher-warning id="missingPrices" />


      <div class="text-h6">
        Public pricelist
        <v-btn icon href="http://help.unsub.org/en/articles/4203886-how-do-i-upload-custom-a-la-carte-prices" target="_blank">
            <v-icon small>mdi-help-circle-outline</v-icon>
          </v-btn>
      </div>
      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat.
      </div>
      <v-list>
        <publisher-setup-tab-file-upload disabled file-type="pricePublic" />
      </v-list>

    </div>

    <div class="pt-12 px-12">
      <div class="text-h6">
        Custom pricelist
        <v-btn icon href="http://help.unsub.org/en/articles/4203886-how-do-i-upload-custom-a-la-carte-prices" target="_blank">
            <v-icon small>mdi-help-circle-outline</v-icon>
          </v-btn>
      </div>
      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat.
      </div>
      <v-list>
        <publisher-setup-tab-file-upload file-type="price" />
      </v-list>

    </div>
  </v-card>


</template>


<script>
import _ from "lodash"
import {mapGetters, mapMutations, mapActions} from 'vuex'
import PublisherSetupTabFileUpload from "./PublisherSetupTabFile";
import PublisherWarning from "@/components/PublisherWarning/PublisherWarning";


export default {
  name: "PublisherSetupTabPrice",
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
  },
  mounted() {

  },
  watch: {}
}
</script>

<style lang="scss">


</style>