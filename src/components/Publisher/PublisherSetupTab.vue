<template>
  <v-card flat class="py-3 pt-6">
    <template v-if="!institutionIsConsortium">
      <v-tabs
          v-model="tabModel"
          vertical
          hide-slider
          class="publisher-setup-tab-tabs"
      >
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
          <v-subheader class="mt-" v-if="tab.isOptional">
            <span style="color: #bbb;" v-if="!publisherRequiredDataIsLoaded">
            3. Optional data
            </span>
            <span v-if="publisherRequiredDataIsLoaded">
            3. Optional data
            </span>
          </v-subheader>
          <v-subheader class="mt-" v-if="tab.isDiagnostic">
            <span style="color: #bbb;" v-if="!publisherRequiredDataIsLoaded">
            Package diagnostics
            </span>
            <span v-if="publisherRequiredDataIsLoaded">
            Package diagnostics
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
                v-if="tab.isComplete && tab.id === 'pricelist' && journalsWithNoPriceInfo"
                color="warning"
            >
              mdi-alert
            </v-icon>
            <v-icon
                small
                left
                v-if="tab.isComplete && tab.id === 'pricelist' && !journalsWithNoPriceInfo"
                color="success"
            >
              mdi-check-outline
            </v-icon>
            <v-icon
                small
                left
                v-if="tab.isComplete && tab.id != 'pricelist'"
                color="success"
            >
              mdi-check-outline
            </v-icon>
            <v-icon
                small
                left
                v-if="tab.isInfo"
                :color="(tab.isDisabled) ? 'grey' : 'info'"
            >
              mdi-information
            </v-icon>
            <v-icon
                small
                left
                v-if="tab.isDiagnostic"
                :color="(tab.isDisabled) ? 'grey' : 'info'"
            >
              mdi-stethoscope
            </v-icon>
            {{ tab.shortName }}
          </v-tab>

        </template>

        <v-divider/>


        <v-tab-item
            v-for="tab in tabs"
            :key="'tab-content-'+tab.id"
        >
          <div class="header">
            <div class="main-title" v-if="tab.id != 'missing'">
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
            <div class="main-title" v-if="tab.id === 'missing'">
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
              v-if="!tab.isDiagnostic"
            />
          
          <publisher-setup-tab-counter  v-if="tab.id==='counter'" />
          <publisher-setup-tab-currency v-if="tab.id==='currency'" />
          <publisher-setup-tab-big-deal-costs v-if="tab.id==='bigDealCosts'" />
          <publisher-setup-tab-pta v-if="tab.id==='pta'" />
          <publisher-setup-tab-price  v-if="tab.id==='pricelist'" />
          <publisher-setup-tab-filter  v-if="tab.id==='filter'" />
          <publisher-setup-tab-missing  v-if="tab.id==='missing'" />
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
        <a href="mailto:support@unsub.org">support@unsub.org</a>.
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
import PublisherSetupTabFilter from "@/components/PublisherSetupTab/PublisherSetupTabFilter";
import PublisherSetupTabMissing from "@/components/PublisherSetupTab/PublisherSetupTabMissing";
import PublisherSetupTabPrice from "@/components/PublisherSetupTab/PublisherSetupTabPricelist";
import PublisherSetupTabBigDealCosts from "@/components/PublisherSetupTab/PublisherSetupTabBigDealCosts";

import PublisherWarning from "@/components/PublisherWarning/PublisherWarning";


export default {
  name: "PublisherSetupTab",
  components: {

    PublisherSetupTabCounter,
    PublisherSetupTabCurrency,
    PublisherSetupTabPta,
    PublisherSetupTabFilter,
    PublisherSetupTabMissing,
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
          warningUrl: "https://docs.unsub.org/how-to-guides/upload-counter-usage-data",
          helpUrl: "https://docs.unsub.org/how-to-guides/upload-counter-usage-data",
          errorMsg: "<strong>Missing data: </strong> This data is required."
        },
        {
          id: "pricelist",
          shortName: "Pricelist",
          longName: "Journal pricelist",
          warningId: "missingPrices",
          isRequired: true,
          warningUrl: "https://docs.unsub.org/how-to-guides/upload-title-prices",
          helpUrl: "https://docs.unsub.org/troubleshooting/what-does-the-missing-prices-warning-mean",
        },
        {
          id: "currency",
          shortName: "Currency",
          longName: "Currency",
          isRequired: true,
          warningUrl: "https://docs.unsub.org/how-to-guides/set-currency",
          helpUrl: "https://docs.unsub.org/how-to-guides/set-currency",
          errorMsg: "<strong>Missing data: </strong> This data is required."
        },
        {
          id: "bigDealCosts",
          shortName: "Big Deal costs",
          longName: "Big Deal costs",
          isRequired: true,
          warningUrl: "https://docs.unsub.org/how-to-guides/set-big-deal-costs",
          helpUrl: "https://docs.unsub.org/how-to-guides/set-big-deal-costs",
          errorMsg: "<strong>Missing data: </strong> This data is required."
        },
        {
          id: "pta",
          shortName: "PTA",
          longName: "PTA (Post-Termination Access)",
          warningId: "missingPerpetualAccess",
          isFirstRecommendedTab: true,
          isRecommended: true,
          warningUrl: "https://docs.unsub.org/how-to-guides/upload-pta-data",
          helpUrl: "https://docs.unsub.org/troubleshooting/what-does-the-missing-pta-warning-mean",
          errorMsg: "<strong>Missing data: </strong> Forecasts currently assume you have <em>zero PTA rights</em> for all titles. This is probably untrue, and so your forecasts are not very accurate."
        },
        {
          id: "filter",
          shortName: "Filter",
          longName: "Journal filter",
          isOptional: true,
          warningUrl: "https://docs.unsub.org/how-to-guides/upload-journal-filter",
          helpUrl: "https://docs.unsub.org/troubleshooting/what-does-the-journal-whitelist-alert-mean",
          errorMsg: "<strong>Optional data: </strong> You can filter all scenarios within this package to include only specific titles by providing a spreadsheet of ISSNs or a KBART file."
        },
        {
          id: "missing",
          shortName: "Missing titles",
          isDiagnostic: true,
          longName: "Missing titles",
          warningUrl: "https://docs.unsub.org/how-to-guides/upload-journal-filter",
          helpUrl: "https://docs.unsub.org/troubleshooting/what-does-the-journal-whitelist-alert-mean",
          errorMsg: "<strong>Download a report on the titles missing across all senarios in this package.</strong>"
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
        const isInfo = !isComplete && tabConfig.isOptional
        const isDisabled = !this.publisherRequiredDataIsLoaded && (tabConfig.isRecommended || tabConfig.isOptional)

        const myErrorMsg = (tabConfig.id === "pricelist") ? this.priceListErrorMsg : tabConfig.errorMsg
        const journals = (tabConfig.id === "pricelist") ? this.journalsWithNoPrices : null

        const alertMsg = (isComplete && tabConfig.id != "pricelist") ? this.successMsg : myErrorMsg

        return {
          ..._.cloneDeep(tabConfig),
          isComplete,
          isError,
          isWarning,
          isInfo,
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
      if (this.publisherPriceDataFileIsLive && !this.journalsWithNoPriceInfo) {
        return "You have no journals with missing price information."
      } else {
        // if (!this.publisherPriceDataFileIsLive) return "<strong>Missing data: </strong> This data is required."
        if (!this.journalsWithNoPriceInfo) return "<strong>Missing data: </strong> This data is required."
        // prefix = "<strong>Missing data: </strong> This data is required."
        const prefix = (this.publisherPriceDataFileIsLive) ?
          "<strong>Still missing data: </strong> Although you've uploaded a custom pricelist, there remain"  :
          "<strong>Missing required data: </strong> There are "
        return `${prefix} ${this.journalsWithNoPrices?.length} journals with no price information. These are excluded from all forecasting. To fix, upload a new custom journal pricelist below, with price quotes for those missing titles.`
        // return `<strong>Still missing data: </strong> Although you've uploaded a custom pricelist, there remain ${this.journalsWithNoPriceInfo?.length} journals with no price information. These are excluded from all forecasting. To fix, upload a new custom journal pricelist below, with price quotes for those missing titles.`
      }
    },
    journalsWithNoPrices(){
      return this.getPublisherWarning("missingPrices")?.journals
    },
    journalsWithNoPriceInfo(){
      return !!this.getPublisherWarning("missingPrices")?.journals.length || false
      // return this.getPublisherWarning("missingPrices")?.journals
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
