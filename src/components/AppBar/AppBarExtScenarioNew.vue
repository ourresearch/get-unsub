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
        <v-spacer/>
        <div v-if="0" class="d-flex align-center black--text">
          <div class="mx-3 black--text">
            {{ myCost | currency }}
          </div>
          <div class="mx-3">
            {{ myInstantUsagePercent | percent }}
          </div>
          <div class="mx-3">
            {{ subrJournalsCount }}
          </div>
        </div>
        <div class="d-flex align-center">
          <v-tooltip bottom max-width="300" v-for="warning in publisherWarningsActive">
            <template v-slot:activator="{ on }">
                <v-btn v-on="on" text class="body-2 text-capitalize warning--text px-2 font-weight-bold">
                  <v-icon left color="warning" small style="vertical-align: 0">mdi-alert</v-icon>
                  {{ warning.displayName }}
                </v-btn>
            </template>
            <div>
              {{ warning.msg }}
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
      "publisherWarningsActive",
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
      return !this.scenarioMemberInstitutions.length
    },
    disableParametersTab(){
      return !this.scenarioMemberInstitutions.length
    },
    disableExportTab(){
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