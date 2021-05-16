<template>
  <v-card flat  class="setup-subtab-content">
    <div>



      <div class="font-weight-bold">
        Public journal pricelist

      </div>
      <div>
        We automatically load title-by-title prices from this publisher's public pricelist. You can override these prices, or add missing ones, by uploading a custom pricelist below.
      </div>
      <v-list>
        <publisher-file disabled file-type="pricePublic" />
      </v-list>

    </div>

    <div class="pt-12">
      <div class="font-weight-bold">
        Custom journal pricelist
      </div>
      <div>
        Some of your titles may not be included in the public pricelist (or they are, and you want to override them with custom prices). To solve this, upload a spreadsheet with your quoted title-by-title price for each journal. The spreadsheet should have two columns: <strong>ISSN</strong> and <strong>Price</strong>. Accepted formats are:
        <code>.csv</code>,
        <code>.xlsx</code>, and
        <code>.xls</code>.
      </div>
      <v-list>
        <publisher-file file-type="price" />
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
  name: "PublisherSetupTabPricelist",
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