<template>
  <v-card flat class="">
    <div>
      <div class="text-h6">Selected Currency</div>
      <div>
        Your selected currency determines which default pricelist will be used for individual titles (eg: if you select
        UK Pounds Sterling, we'll use this publisher's UK pricelist) as well as changing currency display used throughout the
        app. However, it doesn't <em>convert</em> from one currency to another; any prices you enter or upload will need
        to be in the currency you've selected. If you've already uploaded prices in a different currency, you'll need to
        delete those and re-upload prices in the new selected currency.
      </div>
      <v-radio-group
          class="mt-5"
          v-model="currency"
      >
        <v-radio
            value="USD"
            label="US Dollars"
            :disabled="isLoading"
            @click="openDialog"
        />
        <v-radio
            value="GBP"
            label="UK Pounds Sterling"
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
import PublisherSetupTabFileUpload from "./PublisherSetupTabFile";
import {api} from "@/api";


export default {
  name: "PublisherSetupTabWarnings",
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