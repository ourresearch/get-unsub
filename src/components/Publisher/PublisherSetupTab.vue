<template>
  <v-card flat class="py-3 pt-6">
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
              :key="'tab-'+tab.id"
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
            {{ tab.shortName }}
          </v-tab>

        </template>

        <v-tab-item
            v-for="tab in tabs"
            :key="'tab-content-'+tab.id"
        >
          <div class="header">
            <div class="main-title ">
              Setup:
              <strong>
                {{ tab.longName }}
              </strong>
              <v-btn small icon
                     :href="tab.warningUrl"
                     target="_blank"
              >
                <v-icon small>mdi-help-circle-outline</v-icon>
              </v-btn>
            </div>
            <v-spacer/>
          </div>
          <publisher-warning
              :id="tab.id"
              :is-required="tab.isRequired"
              :is-success="tab.isComplete"
              :url="tab.helpUrl"
              :msg="tab.alertMsg"
              :journals="tab.journals"
            />
          
          <publisher-setup-tab-counter  v-if="tab.id==='counter'" />
          <publisher-setup-tab-currency v-if="tab.id==='currency'" />
          <publisher-setup-tab-big-deal-costs v-if="tab.id==='bigDealCosts'" />
          <publisher-setup-tab-pta v-if="tab.id==='pta'" />
          <publisher-setup-tab-price  v-if="tab.id==='pricelist'" />
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

import PublisherSetupTabCounter from "../PublisherSetupTab/PublisherSetupTabCounter";
import PublisherSetupTabCurrency from "@/components/PublisherSetupTab/PublisherSetupTabCurrency";
import PublisherSetupTabPta from "@/components/PublisherSetupTab/PublisherSetupTabPta";
import PublisherSetupTabPrice from "@/components/PublisherSetupTab/PublisherSetupTabPricelist";
import PublisherSetupTabBigDealCosts from "@/components/PublisherSetupTab/PublisherSetupTabBigDealCosts";

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
      tabsConfig: [
        {
          id: "counter",
          shortName: "COUNTER",
          longName: "COUNTER",
          isRequired: true,
          warningUrl: "http://help.unsub.org/en/articles/4202521-how-do-i-upload-my-counter-usage-data",
          helpUrl: "http://help.unsub.org/en/articles/4202521-how-do-i-upload-my-counter-usage-data",
          errorMsg: "<strong>Missing data: </strong> This data is required."
        },
        {
          id: "currency",
          shortName: "Currency",
          longName: "Currency",
          isRequired: true,
          warningUrl: "http://help.unsub.org/en/articles/4055375-what-currencies-are-supported",
          helpUrl: "http://help.unsub.org/en/articles/4055375-what-currencies-are-supported",
          errorMsg: "<strong>Missing data: </strong> This data is required."
        },
        {
          id: "bigDealCosts",
          shortName: "Big Deal costs",
          longName: "Big Deal costs",
          isRequired: true,
          warningUrl: "http://help.unsub.org/en/articles/4205378-how-do-i-set-my-big-deal-s-annual-cost-and-annual-cost-increase",
          helpUrl: "http://help.unsub.org/en/articles/4205378-how-do-i-set-my-big-deal-s-annual-cost-and-annual-cost-increase",
          errorMsg: "<strong>Missing data: </strong> This data is required."
        },
        {
          id: "pta",
          shortName: "PTA",
          longName: "PTA (Post-Termination Access)",
          warningId: "missingPerpetualAccess",
          isFirstRecommendedTab: true,
          isRecommended: true,
          warningUrl: "http://help.unsub.org/en/articles/4203970-how-do-i-upload-custom-perpetual-access-dates",
          helpUrl: "http://help.unsub.org/en/articles/5229614-warning-no-pta-file-uploaded",
          errorMsg: "<strong>Missing data: </strong> Forecasts currently assume you have <em>zero PTA rights</em> for all titles. This is probably untrue, and so your forecasts are not very accurate."
        },
        {
          id: "pricelist",
          shortName: "Pricelist",
          longName: "Journal pricelist",
          warningId: "missingPrices",
          isRecommended: true,
          warningUrl: "http://help.unsub.org/en/articles/4203886-how-do-i-upload-custom-a-la-carte-prices",
          helpUrl: "http://help.unsub.org/en/articles/5229615-warning-missing-prices",
        },
      ]
    }
  },
  methods: {
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
      "publisherPriceDataFileIsLive",
    ]),

    tabs() {

      const ret = this.tabsConfig.map(tabConfig => {
        const isComplete = this.getPublisherDataIsComplete(tabConfig.id)
        const isError = !isComplete && tabConfig.isRequired
        const isWarning = !isComplete && tabConfig.isRecommended
        const isDisabled = !this.publisherRequiredDataIsLoaded && tabConfig.isRecommended

        const myErrorMsg = (tabConfig.id === "pricelist") ? this.priceListErrorMsg : tabConfig.errorMsg
        const journals = (tabConfig.id === "pricelist") ? this.journalsWithNoPriceInfo : null

        const alertMsg = (isComplete) ? this.successMsg : myErrorMsg

        return {
          ..._.cloneDeep(tabConfig),
          isComplete,
          isError,
          isWarning,
          isDisabled,
          alertMsg,
          journals,
        }

      })

      return ret
    },
    successMsg(){
      return "<strong>Fully loaded: </strong> This data is now being used in all forecast scenarios."
    },
    priceListErrorMsg(){
      const prefix = (this.publisherPriceDataFileIsLive) ?
          "<strong>Still missing data: </strong> Although you've uploaded a custom pricelist, there remain"  :
          "<strong>Missing data: </strong> There are "
      return `${prefix} ${this.journalsWithNoPriceInfo?.length} journals with no price information. These are excluded from all forecasting. To fix, upload a new custom journal pricelist below, with price quotes for those missing titles.`

    },
    journalsWithNoPriceInfo(){
      return this.getPublisherWarning("missingPrices")?.journals
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
  margin-top: 36px;
}

.publisher-setup-tab-tabs {
  .header {
    display: flex;
    align-content: flex-end;
    align-items: flex-end;
    //border-bottom: 1px solid #ddd;
    padding-bottom: 4px;
    margin-right: 30px;
    font-weight: bold;

    .main-title {
      font-size: 20px;
      font-size: 24px;
    }
  }

  .v-tabs-items {
    margin-left: 70px;
    margin-top: 15px;
  }

  .v-tabs-bar__content {
    align-items: flex-start !important;

    .v-subheader {
      font-weight: bold;
      align-items: flex-end;
      padding-bottom: 5px;
      //border-bottom: 1px solid #ddd;
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