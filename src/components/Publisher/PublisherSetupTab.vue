<template>
  <v-card flat class="py-3 mt-6">
    <template v-if="!institutionIsConsortium">
      <v-tabs
          v-model="tabModel"
          vertical
          hide-slider
          class="publisher-setup-tab-tabs"
      >
        <div class="black--text body-2 ml-4 mt-4 mb-2 font-weight-bold">
          Setup menu
        </div>
        <v-tab v-for="tab in tabs"
               class="body-1"
               :disabled="tab.isDisabled"
        >
          <v-icon
              small
              left
              v-if="tab.hasWarning"
              color=""
          >
            mdi-alert
          </v-icon>
          <v-icon
              small
              left
              v-if="!tab.hasWarning"
              color=""
          >
            mdi-check-outline
          </v-icon>
          {{ tab.name }}
        </v-tab>

        <v-tab-item>
          <publisher-warning id="missingCounterData" />
          <publisher-setup-tab-counter />
        </v-tab-item>
        <v-tab-item>
          <publisher-warning id="missingPerpetualAccess"/>
          <publisher-setup-tab-pta />
        </v-tab-item>
        <v-tab-item>
          <publisher-warning id="missingPrices" />
          <publisher-setup-tab-price />
        </v-tab-item>
        <v-tab-item>
          <publisher-setup-tab-currency />
        </v-tab-item>
        <v-tab-item>
          <publisher-warning id="missingBigDealCosts" />
          <publisher-setup-tab-big-deal-costs />
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
import PublisherSetupTabBigDealCosts from "@/components/Publisher/PublisherSetupTabBigDealCosts";

import PublisherWarning from "@/components/PublisherWarning/PublisherWarning";


export default {
  name: "PublisherSetupTab",
  components: {

    PublisherSetupTabCounter,
    PublisherSetupTabCurrency,
    PublisherSetupTabPta,
    PublisherSetupTabPrice,
    PublisherSetupTabBigDealCosts,
    PublisherWarning,
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
      ],
      tabsConfig: [
        {
          id: "counter",
          name: "COUNTER",
          warningId: "missingCounterData",
          isFirstPriority: true,
        },
        {
          id: "pta",
          name: "PTA",
          warningId: "missingPerpetualAccess"
        },
        {
          id: "pricelist",
          name: "Journal pricelist",
          warningId: "missingPrices"
        },
        {
          id: "currency",
          name: "Currency",
          warningId: null,
          isFirstPriority: true,
        },
        {
          id: "bigDealCosts",
          name: "Big Deal costs",
          warningId: "missingBigDealCosts",
          // isFirstPriority: true,
        },
      ]
    }
  },
  methods: {
    showTinyTriangle(tabName) {
      const lookup = {
        "COUNTER": "missingCounterData",
        "PTA": "missingPerpetualAccess",
        "Journal pricelist": "missingPrices"
      }
      const key = lookup[tabName]
      return this.getPublisherWarning(key)
    },
    disableTab(tabName) {
      if (tabName !== "COUNTER" && this.getPublisherWarning("missingCounterData")) {
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
    firstPriorityTabsHaveWarnings(){
      return !!this.tabsConfig.find(t => {
        const hasWarning = this.getPublisherWarning(t.warningId)
        return hasWarning && t.isFirstPriority
      })
    },
    tabs() {
      const ret = this.tabsConfig.map(tabConfig => {
        const ret = _.cloneDeep(tabConfig)
        const isDisabled = this.firstPriorityTabsHaveWarnings && !ret.isFirstPriority
        return {
          ..._.cloneDeep(tabConfig),
          hasWarning: this.getPublisherWarning(ret.warningId),
          isDisabled,
        }
      })

      return ret
    }
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
  .v-tabs-items {
    margin-left: 70px;
    margin-top: 9px;
  }
  .v-tabs-bar__content {
    align-items: flex-start !important;

    .v-tab {
      padding-right: 70px;
      width: 100%;
      text-transform: capitalize;
      justify-content: left;
      //border-radius: 5px;
      //color: #333 !important;
    }
    .v-tab--active {
      font-weight: bold;
      //background: #f0f0f0;
    }

    //border-right: 1px solid #ddd;
  }

  .v-tab {
    //color: #333 !important;
  }

}


</style>