<template>
  <v-container class="publisher mt-12 pt-6">
    <div
        style="height: 85vh"
        class="loading d-flex flex-column align-center justify-center"
        v-if="loadingPercent < 100"
    >
      <div style="width: 300px;">
        <v-progress-linear
            v-model="loadingPercent"
        />

      </div>
      <div class="mt-3">
        Loading package
      </div>
    </div>
<!--    <pre> {{ $store.getters.publisherHalp }} </pre>-->


    <div class="loaded" v-if="loadingPercent === 100">




      <div class="d-flex entity-title">
        <v-btn icon class="mr-2 no-highlight" :to="`/i/${institutionId}`">
          <v-icon color="primary">
            mdi-chevron-left
          </v-icon>
        </v-btn>
        <v-icon color="primary" large left>
          {{ publisherIconName }}
        </v-icon>
        <div>
          <div class="caption primary--text">
            Package
          </div>
          <div class="text-h5 font-weight-bold primary--text">
            {{ publisherName }}
          </div>
        </div>
      </div>

      <v-alert v-if="publisherIsOwnedByConsortium"
               color="warning"
               outlined
               icon="mdi-alert"
               class="my-4"
      >
        <div class="d-flex align-center">
          <div>
            This is a <strong>Consortial Feeder</strong> package. It exists to provide a <em>data source</em>
            for your consortium's central Unsub dashboard. Please don't edit it without permission of
            consortium staff!
          </div>
        </div>
      </v-alert>
      <v-alert v-if="publisherIsConsortialProposalSet"
               color="info"
               outlined
               icon="mdi-information-outline"
               class="my-4"
      >
        <div class="d-flex align-center">
          <div>
            This is a <strong>Consortial Proposal</strong> package. It contains a list of cancellation scenarios proposed by your consortium. Each scenario has a set of parameters and core title-by-title subscriptions already set by consortial staff.  Your mission is to provide feedback on these proposed scenarios. To do that, open the scenarios, and add additional titles that you'd like to see included in the title-by-title subscription list.

          </div>
        </div>
      </v-alert>
      <v-tabs
          class="" v-model="currentTab"
      >
        <!--        <v-btn class="" icon><v-icon>mdi-chevron-left</v-icon></v-btn>-->
        <v-tab
            class="low-key-button"
            v-if="showScenariosTab"
        >
          <v-icon small left>mdi-chart-box-outline</v-icon>
          Forecast scenarios
          <span class="ml-1 caption">({{ publisherScenarios.length }})</span>
        </v-tab>
        <v-tab
            class="low-key-button"
            v-if="showApcTab"
        >
          <v-icon small left>mdi-cash-100</v-icon>
          APCs
        </v-tab>
        <v-tab
            class="low-key-button"
            v-if="showSetupTab"
        >
          <v-icon   small left>mdi-cog-outline</v-icon>
          Setup
<!--          <v-icon v-if="publisherWarnings.length" small right>mdi-alert</v-icon>-->
        </v-tab>
      </v-tabs>
      <v-divider/>
      <v-tabs-items v-model="currentTab">
        <v-tab-item v-if="showScenariosTab">
          <publisher-scenarios-tab/>
        </v-tab-item>
        <v-tab-item v-if="showApcTab">
          <apc-tab/>
        </v-tab-item>
        <v-tab-item v-if="showSetupTab">
          <publisher-setup-tab/>
        </v-tab-item>
      </v-tabs-items>


    </div>

    <scenario-edit-dialogs/>
  </v-container>
</template>

<script>
import {api, toBase64} from "../api";
import {mapGetters, mapMutations, mapActions} from 'vuex'
import ScenarioEditDialogs from "../components/ScenarioEditDialogs/ScenarioEditDialogs";
import ApcTab from "../components/Publisher/PublisherApcTab";
import PublisherSetupTab from "../components/Publisher/PublisherSetupTab";
import PublisherScenariosTab from "../components/Publisher/PublisherScenariosTab";

export default {
  name: "Publisher",
  metaInfo() {
    return {
      title: `${this.publisherName}`
    }
  },
  components: {
    ScenarioEditDialogs,
    ApcTab,
    PublisherSetupTab,
    PublisherScenariosTab,
  },
  data() {
    return {
      errorMsg: "",
      loadingPercent: 0,
      currentTab: 0,
    }
  },
  computed: {
    ...mapGetters([
      "publisherName",
      "publisherIsFeeder",
      "publisherId",
      "publisherScenarios",
      "publisherPublisher",
      "publisherScenariosCount",
      "isPublisherDemo",
      "institutionId",
      "institutionName",
      "publisherScenariosAreAllLoaded",
      "publisherBigDealCost",
      "publisherIsLoading",
      "publisherLogo",
      "publisherCounterIsLive",
      "publisherIsOwnedByConsortium",
      "publisherIsConsortialProposalSet",
      "publisherIconName",



      "userCanEditActivePublisher",
      "institutionIsConsortium",
      "userEmail",
      "publisherWarnings",
      "publisherRequiredDataIsLoaded",




      // apc stuff
      "publisherApcPapersCount",
      "publisherApcAuthorsFractionalCount",
      "publisherApcCost",
      "publisherApcIsLoading",

    ]),
    account() {
      return this.$store.state.user
    },
    pkg() {
      return this.$store.getters.selectedPublisher
    },
    showScenariosTab(){
      return this.publisherRequiredDataIsLoaded
    },
    showApcTab(){
      if (!this.publisherRequiredDataIsLoaded) return false
      if (this.publisherIsFeeder) return false
      if (this.institutionIsConsortium) return false
      if (this.publisherIsConsortialProposalSet) return false
      return true
    },
    showSetupTab(){
      if (this.institutionIsConsortium) return false
      if (this.publisherIsConsortialProposalSet) return false
      return true
    },

  },
  methods: {
    ...mapMutations([
      "openCopyDialog",
      "openCreateDialog",
      "openRenameDialog",
      "openDeleteDialog",
      "openPublisherFileUploadDialog",
      "clearPublisher",
    ]),
    ...mapActions([]),

  },

  created() {
  },
  destroyed() {

  },
  watch: {},
  async mounted() {
    console.log("publisher: mount up", this.$route.params)
    this.$store.dispatch("fetchInstitution", this.$route.params.institutionId)


    this.loadingPercent = 0
    const estSecondsToLoad = 20
    let secondsSincePageLoad = 0
    const that = this
    const interval = setInterval(function () {
      if (!that.publisherIsLoading) {
        that.loadingPercent = 100
        setTimeout(() => clearInterval(interval), 500)
        return
      }
      secondsSincePageLoad += 1
      let loadingPercent = 100 * secondsSincePageLoad / estSecondsToLoad

      if (loadingPercent >= 100) {
        // based on our time estimate, we should be done. but unfortunately, we haven't broken out of the loop
        // yet, which means that actually the publisher is still loading.
        // so, set the progress bar to "nearly done!"
        loadingPercent = 95
      }
      that.loadingPercent = loadingPercent
    }, 1000)


    // if we have any dehydrated scenarios, then clear the publisher; we'll update the whole thing.
    if (!this.publisherScenariosAreAllLoaded) this.clearPublisher()

    await this.$store.dispatch("fetchPublisher", this.$route.params.publisherId)
    // this.currentTab = (this.showSetupTabOnly) ? 2 : 0

    console.log("publisher done loading", this.publisherCounterIsLive)

  },
}
</script>

<style lang="scss">
.v-toolbar__extension {
  border-top: none !important;
}

</style>