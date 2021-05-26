<template>
  <v-card flat class="setup-subtab-content">
    <div>
      <div class="font-weight-bold">Selected Currency</div>
      <p>
        Your selected currency is used in many places throughout the app. Noteably, it determines which default
        pricelist will be used for individual titles. For example, if you select UK Pounds Sterling, we'll use this
        publisher's UK public pricelist.
      </p>


      <v-radio-group
          class="mt-5"
          v-model="currency"
      >
        <v-radio
            value="USD"
            label="US Dollars (USD)"
            :disabled="isLoading"
            @click="openDialog"
        />
        <v-radio
            value="GBP"
            label="UK Pounds Sterling (GBP)"
            :disabled="isLoading"
            @click="openDialog"
        />
      </v-radio-group>

      <p v-if="!!publisherCurrency">
        <strong>Important:</strong> changing currency doesn't <em>convert</em> from one currency to another. If you
        change currency, don't forget to update costs you've already entered, replacing them with ones denominated in
        your new currency. Specifically, you'll need to edit your package
        <a href="http://help.unsub.org/en/articles/4205378-how-do-i-set-my-big-deal-s-annual-cost-and-annual-cost-increase"
           target="_blank">Big Deal Cost</a> and scenario
        <a href="http://help.unsub.org/en/articles/4938030-scenario-parameters" target="_blank">ILL Transaction Cost
          parameter.</a>

        <span class="ml-1" v-if="publisherPriceDataFileIsLive">You'll also need to <a
            href="http://help.unsub.org/en/articles/4203886-how-do-i-upload-a-custom-title-by-title-journal-pricelist">replace your custom pricelist</a>.</span>

      </p>

    </div>

    <v-dialog
        persistent
        v-model="dialogIsShowing"
        max-width="500"
    >
      <v-card>
        <v-card-title v-if="!!publisherCurrency">
          Change currency
        </v-card-title>
        <v-card-title v-if="!publisherCurrency">
          Select currency
        </v-card-title>
        <div class="pa-6">
          <div v-if="!publisherCurrency">
            This will set your currency <strong>{{ currency }}.</strong>
          </div>
          <div v-if="!!publisherCurrency">
            <p>
              Are you sure you want to change currency to <strong>{{ currency }}?</strong>
            </p>

            <template v-if="!!publisherCurrency">
              <p>
                Changing currency doesn't <em>convert</em> from one currency to another.
              </p>
              <p>
                If you make the change, don't forget to edit your package
                <a href="http://help.unsub.org/en/articles/4205378-how-do-i-set-my-big-deal-s-annual-cost-and-annual-cost-increase"
                   target="_blank">Big Deal Cost</a> and scenario
                <a href="http://help.unsub.org/en/articles/4938030-scenario-parameters" target="_blank">ILL Transaction
                  Cost parameter</a> to new values denominated in {{ currency }}.

                <span class="ml-1" v-if="publisherPriceDataFileIsLive">You'll also need to <a
                    href="http://help.unsub.org/en/articles/4203886-how-do-i-upload-a-custom-title-by-title-journal-pricelist">replace your custom pricelist</a>.</span>

              </p>

            </template>
          </div>
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
import {api} from "@/api";


export default {
  name: "PublisherSetupTabWarnings",
  components: {},
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
      "publisherPriceDataFileIsLive",
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

<style lang="scss">


</style>