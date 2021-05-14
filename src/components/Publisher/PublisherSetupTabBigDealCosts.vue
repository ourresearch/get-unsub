<template>
  <v-card flat class="">
    <div>
      <div class="text-h6">
        Big Deal annual cost
        <v-btn icon
               href="http://help.unsub.org/en/articles/4205378-how-do-i-set-my-big-deal-s-annual-cost-and-annual-cost-increase"
               target="_blank">
          <v-icon small>mdi-help-circle-outline</v-icon>
        </v-btn>
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
            <v-icon color="warning">mdi-alert</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <div class="text-h5">
              {{ publisherCostBigDeal || "Not set" }}
            </div>
            <div class="body-2">
              Annual cost
            </div>

          </v-list-item-content>
          <v-list-item-action class="align-self-start">
            <v-btn color="primary" class="">
              <v-icon left>mdi-pencil</v-icon>
              edit
            </v-btn>
          </v-list-item-action>
        </v-list-item>

      </div>

      <div class="text-h6 mt-12">
        Big Deal annual cost increase (%)
        <v-btn icon
               href="http://help.unsub.org/en/articles/4205378-how-do-i-set-my-big-deal-s-annual-cost-and-annual-cost-increase"
               target="_blank">
          <v-icon small>mdi-help-circle-outline</v-icon>
        </v-btn>
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
            <v-icon color="warning">mdi-alert</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <div class="text-h5">
              {{ publisherCostBigDeal || "Not set" }}
            </div>
            <div class="body-2">
              Percent increase
            </div>

          </v-list-item-content>
          <v-list-item-action class="align-self-start">
            <v-btn color="primary" class="ml-5">
              <v-icon left>mdi-pencil</v-icon>
              edit
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </div>


    </div>


    <v-dialog
        persistent
        v-model="dialogIsShowing"
        max-width="500"
    >
      <v-card>
        <v-card-title>
          Change currency
        </v-card-title>
        <div class="pa-6">
          <p>
            Are you sure you want to change currency to <strong>{{ currency }}?</strong>
          </p>
          <p>
            If you've already uploaded prices in some other currency, you'll need to delete those and replace
            them with new prices denominated in {{ currency }}.
          </p>
        </div>
        <v-card-actions>
          <v-spacer/>
          <v-btn
              depressed
              :disabled="isLoading"
              @click="cancelDialog"
          >
            Cancel
          </v-btn>
          <v-btn
              depressed
              color="primary"
              :loading="isLoading"
              @click="setCurrency(currency)"
          >
            Change to {{ currency }}
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
    }
  },
  methods: {
    cancelDialog() {
      // this.currency = this.currencyValueBeforeDialog
      this.currency = this.currencyLastValue
      this.dialogIsShowing = false
    },
    openDialog() {
      this.dialogIsShowing = true
    },

    async setCurrency(currency) {
      console.log("setCurrency()", currency)
      this.isLoading = true
      const path = `publisher/${this.publisherId}`
      const postData = {currency}
      try {
        await api.postFile(path, postData)
        await this.$store.dispatch("refreshPublisher")
        this.$store.commit("snackbar", `currency changed to ${currency}`)
      } catch (e) {
        console.log("there was an error.")
      } finally {
        this.dialogIsShowing = false
        this.isLoading = false
      }
    }
  },
  computed: {
    ...mapGetters([
      "publisherId",
      "publisherWarnings",
      "publisherCurrency",
      "publisherCostBigDeal",
      "publisherCostBigDealIncrease",
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