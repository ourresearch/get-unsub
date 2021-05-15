<template>
  <v-card flat   class="setup-subtab-content">
    <div>
      <div class="text-h6">
        Big Deal annual cost
      </div>
      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
        laborum.
      </div>

      <div>

        <v-list-item class="setting-list-item">
          <v-list-item-icon>
            <v-icon v-if="!publisherBigDealCost" color="error">mdi-close-outline</v-icon>
            <v-icon v-if="publisherBigDealCost" color="success">mdi-check-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <div class="text-h5">
              <span v-if="publisherBigDealCost">
                {{ publisherBigDealCost | currency(publisherCurrencySymbol) }}
              </span>
              <span v-if="!publisherBigDealCost">
                Not set
              </span>
            </div>
            <div class="body-2">
              Annual cost
            </div>

          </v-list-item-content>
          <v-list-item-action class="align-self-start">
            <v-btn @click="openCostDialog" color="primary" class="">
              <v-icon left>mdi-pencil</v-icon>
              edit
            </v-btn>
          </v-list-item-action>
        </v-list-item>

      </div>

      <div class="text-h6 mt-12">
        Big Deal annual cost increase (%)
      </div>
      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
        laborum.
      </div>

      <div>
        <v-list-item class="setting-list-item">
          <v-list-item-icon>
            <v-icon v-if="!publishersBigDealCostIncrease" color="error">mdi-close-outline</v-icon>
            <v-icon v-if="publishersBigDealCostIncrease" color="success">mdi-check-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <div class="text-h5">
              <span v-if="publishersBigDealCostIncrease">
                {{ publishersBigDealCostIncrease | percent(2) }}
              </span>
              <span v-if="!publishersBigDealCostIncrease">
                Not set
              </span>
            </div>
            <div class="body-2">
              Annual increase
            </div>

          </v-list-item-content>
          <v-list-item-action class="align-self-start">
            <v-btn @click="openIncreaseDialog" color="primary" class="ml-5">
              <v-icon left>mdi-pencil</v-icon>
              edit
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </div>


      <div class="text-h6 mt-12">
        Big Deal 5-year annual cost
      </div>
      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
        laborum.
      </div>

      <div>
        <v-list-item class="setting-list-item">
          <v-list-item-icon>
            <v-icon v-if="!publisherBigDeal5YearAnnualCost" color="warning">mdi-alert</v-icon>
            <v-icon v-if="publisherBigDeal5YearAnnualCost" color="success">mdi-check-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <div class="text-h5">
              <span v-if="publishersBigDealCostIncrease">
                {{ publisherBigDeal5YearAnnualCost | currency(publisherCurrencySymbol) }}
              </span>
              <span v-if="!publishersBigDealCostIncrease">
                Unknown
              </span>
            </div>
            <div class="body-2">
              5-yr annual cost
            </div>

          </v-list-item-content>
        </v-list-item>
      </div>


    </div>











      <!--            DIALOGS                                          -->
      <!--*****************************************************************-->


    <v-dialog
        persistent
        v-model="dialogs.cost"
        max-width="500"
    >
      <v-card>
        <v-card-title>
          Edit Big Deal cost
        </v-card-title>
        <div class="pa-6">
          <v-text-field
              v-model="newVal"
              :label="`Annual cost (${publisherCurrency})`"
              outlined
              placeholder="1000000"
              type="number"
              :prefix="publisherCurrencySymbol"
          />
        </div>
        <v-card-actions>
          <v-spacer/>
          <v-btn
              depressed
              :disabled="isLoading"
              @click="cancelDialogs"
          >
            Cancel
          </v-btn>
          <v-btn
              depressed
              color="primary"
              :loading="isLoading"
              @click="setBigDealData"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <v-dialog
        persistent
        v-model="dialogs.increase"
        max-width="500"
    >
      <v-card>
        <v-card-title>
          Edit Big Deal increase
        </v-card-title>
        <div class="pa-6">
          <v-text-field
              v-model="newVal"
              :label="`Annual increase (%)`"
              outlined
              placeholder="1.8"
              type="number"
              suffix="%"
          />
        </div>
        <v-card-actions>
          <v-spacer/>
          <v-btn
              depressed
              :disabled="isLoading"
              @click="cancelDialogs"
          >
            Cancel
          </v-btn>
          <v-btn
              depressed
              color="primary"
              :loading="isLoading"
              @click="setBigDealData"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


  </v-card>


</template>


<script>
import _ from "lodash"
import {mapGetters, mapMutations, mapActions} from 'vuex'
import PublisherSetupTabFileUpload from "./PublisherSetupTabFile";
import {api} from "@/api";


export default {
  name: "PublisherSetupTabBigDealCosts",
  components: {
    PublisherSetupTabFileUpload,
  },
  props: {},
  data() {
    return {
      isLoading: false,
      currency: "USD",
      dialogIsShowing: false,
      currencyValueBeforeDialog: null,
      currencyLastValue: null,
      increaseValue: 0,
      newVal: 0,


      dialogs: {
        cost: false,
        increase: false,
      }
    }
  },
  methods: {
    cancelDialogs() {
      this.dialogs.cost = false
      this.dialogs.increase = false
    },
    openCostDialog() {
      this.dialogs.cost = true
      this.newVal = this.publisherBigDealCost
    },
    openIncreaseDialog() {
      this.dialogs.increase = true
      this.newVal = this.publishersBigDealCostIncrease
    },

    createPostData() {
      if (this.dialogs.cost) {
        return {cost_bigdeal: this.newVal}
      } else {
        return {cost_bigdeal_increase: this.newVal}
      }
    },

    async setBigDealData() {
      console.log("setBigDealData()")
      this.isLoading = true
      const path = `publisher/${this.publisherId}`
      const postData = this.createPostData()
      try {
        await api.postFile(path, postData)
        await this.$store.dispatch("refreshPublisher")
        this.$store.commit("snackbar", `Edit successful.`)
      } catch (e) {
        console.log("there was an error.")
      } finally {
        this.cancelDialogs()
        this.isLoading = false
      }
    }
  },
  computed: {
    ...mapGetters([
      "publisherId",
      "publisherWarnings",
      "publisherCurrency",
      "publisherBigDealCost",
      "publishersBigDealCostIncrease",
      "publisherCurrencyIconName",
      "publisherCurrencySymbol",
        "publisherBigDeal5YearAnnualCost",

    ]),
  },
  created() {
  },
  mounted() {
    this.currency = this.publisherCurrency
  },
  watch: {
    currency: function (to, from) {
      this.currencyLastValue = from
    }
  }
}
</script>

<style scoped lang="scss">
.setting-list-item {
  max-width: 400px;
}


</style>