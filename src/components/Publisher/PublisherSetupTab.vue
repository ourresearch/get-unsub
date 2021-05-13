<template>
  <v-card flat class="pa-3">
    <template v-if="!institutionIsConsortium">
      <v-tabs
          v-model="tabModel"
          vertical
          hide-slider
          class="publisher-setup-tab-tabs"
      >
        <v-tab v-for="tabName in tabNames" :disabled="disableTab(tabName)">
          <v-icon small left v-if="showTinyTriangle(tabName)" color="">mdi-alert</v-icon>
          {{ tabName }}

        </v-tab>

        <v-tab-item>
          <publisher-setup-tab-counter class="ml-8"/>
        </v-tab-item>
        <v-tab-item>
          <publisher-setup-tab-currency class="ml-8"/>
        </v-tab-item>
        <v-tab-item>
          <publisher-setup-tab-price class="ml-8"/>
        </v-tab-item>
        <v-tab-item>
          <publisher-setup-tab-pta class="ml-8"/>
        </v-tab-item>
      </v-tabs>
    </template>
    <template v-if="institutionIsConsortium">
      <v-alert
          type="info"
          text
          outlined
          icon="mdi-information-outline"
      >
        Setup for consortial dashboards happens behind the scenes, via email or data imports from your member
        institution dashboards. If you have any questions about setup, please drop us a line at
        <a href="mailto:team@ourresearch.org">team@ourresearch.org</a>.
      </v-alert>
    </template>


  </v-card>


</template>


<script>
import _ from "lodash"
import {mapGetters, mapMutations, mapActions} from 'vuex'

import PublisherSetupTabCounter from "./PublisherSetupTabCounter";
import PublisherSetupTabCurrency from "@/components/Publisher/PublisherSetupTabCurrency";
import PublisherSetupTabPta from "@/components/Publisher/PublisherSetupTabPta";
import PublisherSetupTabPrice from "@/components/Publisher/PublisherSetupTabPrice";


export default {
  name: "PublisherSetupTab",
  components: {

    PublisherSetupTabCounter,
    PublisherSetupTabCurrency,
    PublisherSetupTabPta,
    PublisherSetupTabPrice,
  },
  props: {},
  data() {
    return {
      tabModel: 0,
      tabNames: [
        "COUNTER",
        "Currency",
        // "Big Deal price",
        "Journal pricelist",
          "PTA",
      ]
    }
  },
  methods: {
    showTinyTriangle(tabName){
      const lookup = {
        "COUNTER": "missingCounterData",
        "PTA": "missingPerpetualAccess",
        "Journal pricelist": "missingPrices"
      }
      const key = lookup[tabName]
      return this.getPublisherWarning(key)
    },
    disableTab(tabName){
      if (tabName !== "COUNTER" && this.getPublisherWarning("missingCounterData"))  {
        return true

      }
    }
  },
  computed: {
    ...mapGetters([
      "publisherName",
      "publisherId",
      "publisherBigDealCost",
      "publisherFiles",
      "publisherWarnings",
      "institutionIsConsortium",
        "getPublisherWarning",
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

.publisher-setup-tab-tabs {
  .v-tabs-bar__content {
    align-items: flex-end !important;
    .v-tab {

    }
    border-right: 1px solid #ddd;
  }

  .v-tab {
    text-transform: capitalize;
  }

}


</style>