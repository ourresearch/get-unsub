<template>
  <v-card flat  class="setup-subtab-content">
    <div>
      <div class="font-weight-bold">Selected Currency</div>
      <p>
        Your selected currency is used in many places throughout the app. Noteably, it determines which default pricelist will be used for individual titles. For example, if you select  UK Pounds Sterling, we'll use this publisher's UK public pricelist.
      </p>

      <p>
        However, it doesn't <em>convert</em> from one currency to another. So for example, if you've already uploaded a pricelist in dollars (USD), and you now change your currency to pounds (GBP), you'll need to delete your old pricelist and replace it with new one, denominated in pounds.
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
import {api} from "@/api";


export default {
  name: "PublisherSetupTabWarnings",
  components: {
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