<template>
  <v-card flat  class="setup-subtab-content">
    
    <div>
      <div class="font-weight-bold">
        Journal pricelist
      </div>
      <div>
        Upload a spreadsheet with a title-by-title price for each journal. The spreadsheet should have two columns: <strong>ISSN</strong> and <strong>Price</strong>. Accepted formats are:
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
