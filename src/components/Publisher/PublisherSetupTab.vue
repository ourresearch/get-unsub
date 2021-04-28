<template>
  <v-card flat class="">
    <v-card-title class="text-h5">
      <div>
        Package Setup: {{ tabNames[tabModel] }}
      </div>
      <v-spacer/>
    </v-card-title>

    <v-tabs
        v-model="tabModel"
        vertical
        style="justify-content: flex-end;"
    >
      <v-tab v-for="tabName in tabNames">
        {{ tabName }}
        <span class="ml-1" v-if="tabName === 'Warnings' ">
          ({{publisherWarnings.length}})
        </span>
      </v-tab>

      <v-tab-item>
        <publisher-setup-tab-warnings />
      </v-tab-item>
      <v-tab-item>
        <publisher-setup-tab-counter/>
      </v-tab-item>
      <v-tab-item>
        <publisher-setup-tab-currency />
      </v-tab-item>
      <v-tab-item>
        four
      </v-tab-item>
      <v-tab-item>
        <publisher-setup-tab-pta />
      </v-tab-item>
    </v-tabs>


    <div v-if="0">

      <v-row class="section py-6 pl-4 pr-8">
        <v-col cols="4">
          <div class="headline">
            Download counts
          </div>
          <div class="body-2">
            Downloads by journal, last year
          </div>
          <div class="body-2">
            <v-icon color="primary" small>mdi-information-outline</v-icon>
            <a target="_blank"
               href="http://help.unsub.org/en/articles/4202521-how-do-i-upload-my-counter-usage-data">
              Knowledge base
            </a>
          </div>
        </v-col>
        <v-col>
          <publisher-file-counter/>
        </v-col>
      </v-row>
      <v-divider></v-divider>

      <v-row class="section py-6 pl-4 pr-8">
        <v-col cols="4">
          <div class="headline">
            À la carte
          </div>
          <div class="body-2">
            Costs of journal-by-journal subscriptions
          </div>

          <div class="body-2">
            <v-icon color="primary" small>mdi-information-outline</v-icon>
            <a target="_blank"
               href="http://help.unsub.org/en/articles/4203886-how-do-i-upload-custom-a-la-carte-prices">
              Knowledge base
            </a>
          </div>
        </v-col>
        <v-col>
          <publisher-file-price v-if="counterIsUploaded"/>
          <div v-if="!counterIsUploaded">
            Upload your COUNTER report in order to set prices.
          </div>
        </v-col>
      </v-row>
      <v-divider></v-divider>

      <v-row class="section py-6 pl-4 pr-8">
        <v-col cols="4">
          <div class="headline">
            Perpetual Access
          </div>
          <div class="body-2">
            Each journal's date ranges for which you have perpetual access to articles. Only dates after
            2010 affect forecasting
          </div>

          <div class="body-2">
            <v-icon color="primary" small>mdi-information-outline</v-icon>
            <a target="_blank"
               href="http://help.unsub.org/en/articles/4203970-how-do-i-upload-custom-perpetual-access-dates">
              Knowledge base
            </a>
          </div>
        </v-col>
        <v-col>
          <publisher-file-perpetual-access v-if="counterIsUploaded"/>
          <div v-if="!counterIsUploaded">
            Upload your COUNTER report in order to set perpetual access dates.
          </div>
        </v-col>
      </v-row>
    </div>
  </v-card>


</template>


<script>
import _ from "lodash"
import {mapGetters, mapMutations, mapActions} from 'vuex'
import PublisherFileUploadDialog from "../PublisherFile/PublisherFileUpload";
import PublisherFile from "../PublisherFile/PublisherFile";

import PublisherFileCounter from "../PublisherFile/PublisherFileCounter";
import PublisherFilePrice from "../PublisherFile/PublisherFilePrice";
import PublisherFilePerpetualAccess from "../PublisherFile/PublisherFilePerpetualAccess";

import PublisherSetupTabCounter from "./PublisherSetupTabCounter";
import PublisherSetupTabWarnings from "@/components/Publisher/PublisherSetupTabWarnings";
import PublisherSetupTabCurrency from "@/components/Publisher/PublisherSetupTabCurrency";
import PublisherSetupTabPta from "@/components/Publisher/PublisherSetupTabPta";


export default {
  name: "PublisherSetupTab",
  components: {
    PublisherFileUploadDialog,
    PublisherFile,
    PublisherFileCounter,
    PublisherFilePrice,
    PublisherFilePerpetualAccess,

    PublisherSetupTabCounter,
    PublisherSetupTabWarnings,
    PublisherSetupTabCurrency,
    PublisherSetupTabPta,
  },
  props: {},
  data() {
    return {
      tabModel: 0,
      tabNames: [
        "Warnings",
        "COUNTER",
        "Currency",
        // "Big Deal price",
        "Journal pricelist",
        "Post-Termination Access",
      ]
    }
  },
  methods: {},
  computed: {
    ...mapGetters([
      "publisherName",
      "publisherId",
      "publisherBigDealCost",
      "publisherFiles",
      "publisherWarnings",
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