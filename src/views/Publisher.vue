<template>
  <v-container class="publisher pt-12">
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


    <div class="loaded" v-if="loadingPercent === 100">


      <v-alert v-if="publisherIsOwnedByConsortium"
               color="warning"
               prominent
               dark
               icon="mdi-alert"
      >
        <div class="d-flex align-center">
          <div>
            This <strong>Consortial Feeder Package</strong> function exclusively as a <em>data source</em>
            for your consortium's central Unsub dashboard. Please don't edit it without permission of
            consortium staff!
          </div>
        </div>
      </v-alert>
      <v-alert v-if="isPublisherDemo" color="info" text dense icon="mdi-information-outline">
        <div class="d-flex align-center">
          <div>
            This package belongs to a demo institution; some functionality is restricted.
          </div>
          <v-spacer></v-spacer>
          <div>
            <v-btn color="info" text small to="/purchase">Purchase full account</v-btn>
          </div>
        </div>
      </v-alert>

      <v-tabs-items v-model="publisherTabShowing">
        <v-tab-item>
          <publisher-scenarios-tab/>
        </v-tab-item>
        <v-tab-item>
          <apc-tab/>
        </v-tab-item>
        <v-tab-item>
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
import PublisherFileUploadDialog from "../components/PublisherFile/PublisherFileUpload";
import ApcTab from "../components/Publisher/ApcTab";
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
    PublisherFileUploadDialog,
    ApcTab,
    PublisherSetupTab,
    PublisherScenariosTab,
  },
  data() {
    return {
      errorMsg: "",
      loadingPercent: 0,
    }
  },
  computed: {
    ...mapGetters([
      "publisherName",
      "publisherTabShowing",
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
      "userCanEditActivePublisher",
      "institutionIsConsortium",
      "userEmail",

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
  },
  methods: {
    ...mapMutations([
      "openCopyDialog",
      "openCreateDialog",
      "openRenameDialog",
      "openDeleteDialog",
      "openPublisherFileUploadDialog",
      "clearPublisher",
      "setPublisherTabShowing",
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

    const myTab = (!this.publisherIsFeeder && this.publisherCounterIsLive) ? 0 : 2
    this.setPublisherTabShowing(myTab)

    console.log("publisher done loading", this.publisherCounterIsLive)

  },
}
</script>

<style lang="scss">
.v-toolbar__extension {
  border-top: none !important;
}

</style>