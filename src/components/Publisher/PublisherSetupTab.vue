<template>
  <v-card flat class="py-3 pt-10">
    <template v-if="!institutionIsConsortium">
      <v-tabs
          v-model="tabModel"
          vertical
          hide-slider
          class="publisher-setup-tab-tabs"
      >
        <!--        <div class="black&#45;&#45;text body-2 ml-4 mt-4 mb-2 font-weight-bold">-->
        <!--          Setup menu-->
        <!--        </div>-->
        <v-subheader class="">
          1. Required data
        </v-subheader>
        <v-divider/>
        <template v-for="tab in tabs">
          <v-subheader class="mt-" v-if="tab.isFirstRecommendedTab">
            <span style="color: #bbb;" v-if="!publisherRequiredDataIsLoaded">
            2. Recommended data
            </span>
            <span v-if="publisherRequiredDataIsLoaded">
            2. Recommended data
            </span>
          </v-subheader>
          <v-tab
              class="body-1"
              :disabled="tab.isDisabled"
          >
            <v-icon
                small
                left
                v-if="tab.isWarning"
                :color="(tab.isDisabled) ? 'grey' : 'warning'"
            >
              mdi-alert
            </v-icon>
            <v-icon
                small
                left
                v-if="tab.isError"
                color="error"
            >
              mdi-close-outline
            </v-icon>
            <v-icon
                small
                left
                v-if="tab.isComplete"
                color="success"
            >
              mdi-check-outline
            </v-icon>
            {{ tab.name }}
          </v-tab>

        </template>

        <v-tab-item>
          <div class="header">
            <div class="main-title">
              Setup:
              <strong>
                COUNTER
              </strong>
              <v-btn small icon
                     href="http://help.unsub.org/en/articles/4202521-how-do-i-upload-my-counter-usage-data"
                     target="_blank">
                <v-icon small>mdi-help-circle-outline</v-icon>
              </v-btn>
            </div>
            <v-spacer/>
            <div v-if="getPublisherDataIsComplete('counter')" class="success--text">
              <v-icon small left color="success">mdi-check-outline</v-icon>
              Fully loaded
            </div>
          </div>
          <publisher-setup-tab-counter/>
        </v-tab-item>


        <v-tab-item>
          <div class="header">
            <div class="main-title">
              Setup:
              <strong>
                Currency
              </strong>
              <v-btn small icon
                     href="http://help.unsub.org/en/articles/4055375-what-currencies-are-supported"
                     target="_blank">
                <v-icon small>mdi-help-circle-outline</v-icon>
              </v-btn>
            </div>
            <v-spacer/>
            <div class="success--text">
              <v-icon small left color="success">mdi-check-outline</v-icon>
              Fully loaded
            </div>
          </div>
          <publisher-setup-tab-currency/>
        </v-tab-item>


        <v-tab-item>
          <div class="header">
            <div class="main-title">
              Setup:
              <strong>
                Big Deal costs
              </strong>
              <v-btn small icon
                     href="http://help.unsub.org/en/articles/4205378-how-do-i-set-my-big-deal-s-annual-cost-and-annual-cost-increase"
                     target="_blank">
                <v-icon small>mdi-help-circle-outline</v-icon>
              </v-btn>
            </div>
            <v-spacer/>
            <div v-if="getPublisherDataIsComplete('bigDealCosts')" class="success--text">
              <v-icon small left color="success">mdi-check-outline</v-icon>
              Fully loaded
            </div>
            <div v-if="!getPublisherDataIsComplete('bigDealCosts')" class="error--text">
              <v-icon small left color="error">mdi-close-outline</v-icon>
              Missing data
            </div>
          </div>
          <publisher-setup-tab-big-deal-costs/>
        </v-tab-item>


        <v-tab-item>
          <div class="header">
            <div class="main-title">
              Setup:
              <strong>
                PTA (Post-Termination Access)
              </strong>
              <v-btn small icon
                     href="http://help.unsub.org/en/articles/4203970-how-do-i-upload-custom-perpetual-access-dates"
                     target="_blank">
                <v-icon small>mdi-help-circle-outline</v-icon>
              </v-btn>
            </div>
            <v-spacer/>
            <div v-if="getPublisherDataIsComplete('pta')" class="success--text">
              <v-icon small left color="success">mdi-check-outline</v-icon>
              Fully loaded
            </div>
            <div v-if="!getPublisherDataIsComplete('pta')" class="warning--text">
              <v-icon small left color="warning">mdi-alert</v-icon>
              Missing data
            </div>
          </div>
          <publisher-warning id="missingPerpetualAccess"/>
          <publisher-setup-tab-pta/>
        </v-tab-item>


        <v-tab-item>
          <div class="header">
            <div class="main-title">
              Setup:
              <strong>
                Journal Pricelist
              </strong>
              <v-btn small icon
                     href="http://help.unsub.org/en/articles/4203886-how-do-i-upload-custom-a-la-carte-prices"
                     target="_blank">
                <v-icon small>mdi-help-circle-outline</v-icon>
              </v-btn>
            </div>
            <v-spacer/>
            <div v-if="getPublisherDataIsComplete('pricelist')" class="success--text">
              <v-icon small left color="success">mdi-check-outline</v-icon>
              Fully loaded
            </div>
            <div v-if="!getPublisherDataIsComplete('pricelist')" class="warning--text">
              <v-icon small left color="warning">mdi-alert</v-icon>
              Missing data
            </div>
          </div>
          <publisher-warning id="missingPrices"/>
          <publisher-setup-tab-price/>
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
          isRequired: true,
        },
        {
          id: "currency",
          name: "Currency",
          isRequired: true,
        },
        {
          id: "bigDealCosts",
          name: "Big Deal costs",
          isRequired: true,
        },
        {
          id: "pta",
          name: "PTA",
          warningId: "missingPerpetualAccess",
          isFirstRecommendedTab: true,
          isRecommended: true,
        },
        {
          id: "pricelist",
          name: "Journal pricelist",
          warningId: "missingPrices",
          isRecommended: true,
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
      "publisherRequiredDataIsLoaded",
      "getPublisherDataIsComplete",
    ]),
    pricelistWarning() {
      return this.getPublisherWarning("missingPrices")
    },
    ptaWarning() {
      return this.getPublisherWarning("missingPerpetualAccess")
    },

    tabs() {
      const ret = this.tabsConfig.map(tabConfig => {
        const isComplete = this.getPublisherDataIsComplete(tabConfig.id)
        const isError = !isComplete && tabConfig.isRequired
        const isWarning = !isComplete && tabConfig.isRecommended
        const isDisabled = !this.publisherRequiredDataIsLoaded && tabConfig.isRecommended

        return {
          ..._.cloneDeep(tabConfig),
          isComplete,
          isError,
          isWarning,
          isDisabled
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

.setup-subtab-content {
  margin-top: 40px;
}

.publisher-setup-tab-tabs {
  .header {
    display: flex;
    align-content: flex-end;
    align-items: flex-end;
    border-bottom: 1px solid #ddd;
    padding-bottom: 4px;
    margin-right: 30px;
    font-weight: bold;

    .main-title {
      font-size: 16px;
    }
  }

  .v-tabs-items {
    margin-left: 70px;
    margin-top: 25px;
  }

  .v-tabs-bar__content {
    align-items: flex-start !important;
    margin-top: 8px;

    .v-subheader {
      font-weight: bold;
      align-items: flex-end;
      padding-bottom: 5px;
      border-bottom: 1px solid #ddd;
      width: 100%;

    }

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
      background: #E4F3FE;
    }

    //border-right: 1px solid #ddd;
  }

  .v-tab {
    //color: #333 !important;
  }

}


</style>