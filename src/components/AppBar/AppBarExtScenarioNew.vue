<template>
  <v-container class="pa-0">
    <div class="d-flex" style="width: 100%;">
      <v-tabs class="ml-1" v-model="currentTab">
        <v-tab class="low-key-button" :disabled="disableForecastTab">
          <v-icon small left>mdi-chart-box-outline</v-icon>
          5yr Forecast
        </v-tab>
        <v-tab class="low-key-button" :disabled="disableParametersTab">
          <v-icon small left>mdi-cog-outline</v-icon>
          Parameters
        </v-tab>
        <v-tab class="low-key-button" :disabled="disableExportTab">
          <v-icon small left>mdi-download</v-icon>
          Export
        </v-tab>
        <v-tab class="low-key-button" :class="{'warning--text': !scenarioMemberInstitutions}" v-if="institutionIsConsortium">
          <v-icon v-if="scenarioMemberInstitutions" small left>mdi-bank-outline</v-icon>
          <v-icon v-if="!scenarioMemberInstitutions" small left color="warning">mdi-alert</v-icon>
          Member Institutions
          ({{ scenarioMemberInstitutions.length }})
        </v-tab>

        <v-tab class="low-key-button" :class="{'warning--text': !scenarioMemberInstitutions}" v-if="institutionIsJisc">
          <v-icon v-if="scenarioMemberInstitutions" small left>mdi-swap-horizontal</v-icon>
          <v-icon v-if="!scenarioMemberInstitutions" small left color="warning">mdi-alert</v-icon>
          Push/pull
        </v-tab>
        <v-spacer/>
        <div class="d-flex align-center">
          <v-tooltip bottom max-width="300" v-for="warning in publisherWarnings">
            <template v-slot:activator="{ on }">
                <v-btn v-on="on" :href="warning.link" target="_blank" text class="body-2 warning--text px-2 font-weight-bold">
                  <v-icon left color="warning" small style="vertical-align: 0">mdi-alert</v-icon>
                  <span class="text text-capitalize">
                    {{ warning.displayName }}
                  </span>
                  <span class="text-lowercase ml-1" v-if="warning.journals">
                     ({{warning.journals.length}})
                  </span>
                </v-btn>
            </template>
            <div>
              Click to learn more.
            </div>
          </v-tooltip>
        </div>
      </v-tabs>
    </div>




  </v-container>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import {costTotal, instantUsagePercent} from "../../shared/scenarioSummary";
import PublisherWarningIcon from "@/components/PublisherWarning/PublisherWarningIcon";

export default {
  name: "AppBarExtScenarioNew",
  components: {
    PublisherWarningIcon,
  },
  data() {
    return {
      foo: 42,
    }
  },
  methods: {},
  computed: {
    ...mapGetters([
      "userEmail",
      "institutionIsConsortium",
      "scenarioMemberInstitutions",
      "scenarioJournals",
      "subrJournalsCount",
      "publisherWarnings",
      "institutionIsJisc",
    ]),
    currentTab: {
      get() {
        console.log("get currentTab")
        return this.$store.getters.scenarioTabShowing
      },
      set(newVal) {
        this.$store.commit("setScenarioTabShowing", newVal)
      }
    },
    myCost() {
      return costTotal(this.scenarioJournals)
    },
    myInstantUsagePercent() {
      return instantUsagePercent(this.scenarioJournals)
    },
    disableForecastTab(){
      return false
      return !this.scenarioMemberInstitutions.length
    },
    disableParametersTab(){
      return false
      return !this.scenarioMemberInstitutions.length
    },
    disableExportTab(){
      return false
      return !this.scenarioMemberInstitutions.length
    },
  },
  created() {
    this.currentTab = 0
  },
  watch: {
    "foo": {
      immediate: true,
      handler: function (to, from) {
      }
    }
  }
}
</script>

<style lang="scss">


</style>