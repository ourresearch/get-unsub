<template>
  <span>
    <v-icon small class="mx-2" v-if="publisherWarnings.length" color="warning">
      mdi-alert-outline
    </v-icon>
  </span>
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
  name: "PublisherWarningIcon",
  props: {
  },
  components: {},
  data() {
    return {
      isLoading: false,
    }
  },
  computed: {
    ...mapGetters([
      "publisherWarnings",
    ]),
  },
  methods: {
    ...mapActions([
      "refreshPublisherFileStatus",
    ]),
    ...mapMutations([
      "snackbar",
    ]),

  },
  async created() {
  }
}
</script>

<style scoped>

</style>