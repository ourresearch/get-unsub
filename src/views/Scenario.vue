<template>
  <div>
    <v-container v-if="!selectedScenarioIsLoading" class="mt-12">
      <v-card
          v-if="scenarioIsLockedPendingUpdate"
          class="d-flex justify-center align-center"
          style="height: 50vh"
      >
        <div class="d-flex align-start">
          <v-icon x-large class="pr-6 pt-2">mdi-timer-sand</v-icon>
          <div>
            <div class="headline">Scenario recalculating...</div>
            <div>
              <p>
                This consortial scenerio is currently locked while we recalculate the
                forecast. This can take up to one hour.
              </p>
              <p>
                We'll send an email to <strong>{{ scenarioUpdateNotificationEmail }}</strong>
                when the update is
                complete (don't forget to check your spam folder).
              </p>
            </div>

          </div>
        </div>
      </v-card>

      <div class="d-flex entity-title">
        <v-btn icon class="mr-2 no-highlight" :to="`/i/${institutionId}/p/${publisherId}`">
          <v-icon color="primary">
            mdi-chevron-left
          </v-icon>
        </v-btn>
        <v-icon color="primary" large left>
          mdi-chart-box-outline
        </v-icon>

        <div>
          <div class="caption primary--text">
            Scenario
          </div>
          <div class="text-h5 font-weight-bold primary--text">
            {{ scenarioName }}
            <v-btn
                icon
                small
                @click="openCopyDialog(scenario)"
                v-if="!publisherIsConsortialProposalSet"
            >
              <v-icon small>mdi-content-copy</v-icon>
            </v-btn>
          </div>
        </div>
      </div>
      <v-alert v-if="publisherIsConsortialProposalSet"
               color="info"
               outlined
               icon="mdi-information-outline"
               class="my-4"
      >
        <div class="d-flex align-center">
          <div>
            This is a <strong>Consortial Proposal</strong> scenario. The parameters and core title-by-title subscriptions are preset by consortial staff. Your mission is to provide feedback on this proposed scenario. To do
            that, request additional titles that you'd like to see included in the title-by-title
            subscription list.

          </div>
        </div>
      </v-alert>
      <app-bar-ext-scenario-new v-if="!scenarioIsLockedPendingUpdate"/>
      <v-divider/>
      <v-tabs-items
          v-if="!scenarioIsLockedPendingUpdate"
          v-model="scenarioTabShowing"
          class="mt-8"
      >
        <v-tab-item>
          <v-card flat>

            <v-row>
              <v-col cols="4">
                <v-card flat>
                  <div class="pt-10 pb-0 px-3 black--text">
                    <v-row class="mb-4 ">
                      <!--                                COST -->
                      <v-col class="py-0" cols="6">
                        <div class="text-right">
                          <v-dialog max-width="500" v-model="dialogs.cost">
                            <template v-slot:activator="{ on, attrs }">
                              <div v-on="on" style="cursor: pointer">
                                <div class="text-h5" id="annual-costs-value">
                                  {{ costTotal | currency(publisherCurrencySymbol) }}
                                </div>
                                <div class="body-2 mt-1">Annual cost ({{ costPercent | percent }})</div>
                              </div>
                            </template>
                            <v-card>
                              <v-toolbar flat>
                                <v-toolbar-title>
                                  Projected annual cost
                                </v-toolbar-title>
                                <v-spacer/>
                                <div class="font-weight-bold">
                                  {{ costTotal | currency(publisherCurrencySymbol) }}
                                </div>
                              </v-toolbar>
                              <v-divider/>
                              <div class="pa-4">
                                Over the next five years, your library will pay
                                {{ costTotal | currency(publisherCurrencySymbol) }} in this scenario. That's {{
                                  costPercent | percent
                                }} of what you'd pay if you kept your Big Deal.
                              </div>
                              <v-card-actions>
                                <v-spacer/>
                                <v-btn text @click="dialogs.cost=false">Dismiss</v-btn>
                              </v-card-actions>
                            </v-card>
                          </v-dialog>
                        </div>
                      </v-col>

                      <!--                                FULFILLMENT -->
                      <v-col class="py-0" cols="6">
                        <div class="text-right">
                          <v-dialog max-width="500" v-model="dialogs.fulfillment">
                            <template v-slot:activator="{ on, attrs }">
                              <div v-on="on" style="cursor: pointer">
                                <div class="text-h5" id="instant-fulfillment-value">
                                  {{ libraryFulfillmentPercent | percent(1) }}
                                </div>
                                <div class="body-2 mt-1">Access</div>
                              </div>
                            </template>
                            <v-card>
                              <v-toolbar flat>
                                <v-toolbar-title>
                                  Projected Access
                                </v-toolbar-title>
                                <v-spacer/>
                                <div class="font-weight-bold">
                                  {{ libraryFulfillmentPercent | percent(0) }}
                                </div>
                              </v-toolbar>
                              <v-divider/>
                              <div class="pa-4">
                                Over the next five years, library users will be able to easily access
                                {{ libraryFulfillmentPercent | percent(0) }} of requests (via PTA, Open Access,
                                title-by-title subscription, or ILL).
                              </div>
                              <v-card-actions>
                                <v-spacer/>
                                <v-btn text @click="dialogs.fulfillment=false">Dismiss</v-btn>
                              </v-card-actions>
                            </v-card>
                          </v-dialog>
                        </div>
                      </v-col>
                    </v-row>

                  </div>

                  <v-card-text class="pt-0">
                    <v-row>
                      <v-col cols="6">
                        <overview-graphic-bar
                            type="cost"
                            :segments="costSegments"
                            :num-journals="journals.length"
                            :num-journals-subscribed="subscribedJournals.length"
                        />
                        <div class="bar-bottom-label">
                          <div class="body-1">
                            Annual cost
                          </div>

                        </div>
                      </v-col>
                      <v-col cols="6">
                        <overview-graphic-bar
                            type="usage"
                            :segments="usageSegments"
                            :num-journals="journals.length"
                            :num-journals-subscribed="subscribedJournals.length"
                        />
                        <div class="bar-bottom-label">
                          <div class="body-1">
                            Usage fulfillment
                          </div>
                        </div>
                      </v-col>

                    </v-row>

                  </v-card-text>


                </v-card>
              </v-col>

              <v-col cols="8">
                <v-card flat>
                  <v-card flat class="mt-9">
                    <v-row class="mx-0 px-0">
                      <overview-graphic-subrs-counter/>
                      <v-spacer></v-spacer>


                      <div class="pt-1 d-flex">
                        <v-slide-x-reverse-transition>
                          <v-text-field
                              hide-details
                              ref="searchBox"
                              dense
                              label="Search journals"
                              autocomplete="false"
                              v-model="search"
                              v-on:input="setJournalsFilterStatus"
                              class="mr-4"
                              outlined
                              v-if="showSearchBox"

                          />
                        </v-slide-x-reverse-transition>
                        <v-btn icon class="mr-4" @click="toggleSearchBox">
                          <v-icon v-if="!showSearchBox">mdi-magnify</v-icon>
                          <v-icon v-if="showSearchBox">mdi-magnify-close</v-icon>
                        </v-btn>

                        <scenario-menu-columns class="mr-4" :icon="true" direction="left"/>
                        <v-menu>
                          <template v-slot:activator="{on}">
                            <v-btn
                                v-on="on"
                                icon
                                class="mr-0"
                            >
                              <v-icon>mdi-eye</v-icon>
                            </v-btn>
                          </template>
                          <v-list dense subheader>
                            <v-subheader>Display journals as:</v-subheader>
                            <v-list-item
                                v-for="option in menuSettingsView.displayJournalsAsOptions"
                                :key="option.name"
                                @click="menuViewSetDisplayJournalsAs(option.name)"
                            >
                              <v-list-item-icon>
                                <v-icon v-if="option.name === menuSettingsView.displayJournalsAsSelected">
                                  mdi-radiobox-marked
                                </v-icon>
                                <v-icon v-if="option.name !== menuSettingsView.displayJournalsAsSelected">
                                  mdi-radiobox-blank
                                </v-icon>
                              </v-list-item-icon>

                              <v-list-item-title>
                                <v-icon>{{ option.icon }}</v-icon>
                                {{ option.name }}
                              </v-list-item-title>
                            </v-list-item>
                          </v-list>
                        </v-menu>

                      </div>

                    </v-row>

                  </v-card>
                  <v-card-text class="px-0">
                    <overview-graphic-bar-dots
                        class="pa-3"
                        v-show="menuSettingsView.displayJournalsAsSelected=='histogram'"
                        :journals="journals"
                    />
                    <journals-table-table
                        v-show="menuSettingsView.displayJournalsAsSelected=='table'"
                        :journals="journals"
                    />

                  </v-card-text>
                </v-card>

              </v-col>
            </v-row>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <scenario-parameters-tab/>
        </v-tab-item>
        <v-tab-item>
          <scenario-export-tab/>
        </v-tab-item>
        <v-tab-item v-if="institutionIsConsortium">
          <scenario-institutions-tab/>
        </v-tab-item>
        <v-tab-item v-if="institutionIsJisc && institutionIsConsortium">
          <scenario-push-pull-tab/>
        </v-tab-item>
        <v-tab-item v-if="institutionIsJisc && !institutionIsConsortium">
          <scenario-push-pull-tab-member/>
        </v-tab-item>
      </v-tabs-items>

    </v-container>

    <v-snackbar
        v-model="scenarioSnackbars.customSubrSuccess"
        :timeout="3000"
        color="blue"
        bottom left
    >
      Journal subscribed
      <v-btn dark icon @click="scenarioSnackbars.customSubrSuccess = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>


    <v-snackbar
        v-model="scenarioSnackbars.customUnsubrSuccess"
        :timeout="3000"
        bottom left
    >
      Journal unsubscribed
      <v-btn dark icon @click="scenarioSnackbars.customUnsubrSuccess = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>

    <scenario-edit-dialogs/>

  </div>
</template>

<script>
import _ from "lodash"
import {mapGetters, mapMutations} from 'vuex'
import LongPress from 'vue-directive-long-press'

import appConfigs from "../appConfigs";
import {fetchScenario} from "../shared/scenario";
import {
  usageList,
  instantUsagePercent,
  libraryFulfillmentPercent,
  costList,
  costTotal,
} from "../shared/scenarioSummary";

import AppBarExtScenarioNew from "@/components/AppBar/AppBarExtScenarioNew";

import OverviewGraphicBarSegment from "../components/OverviewGraphic/OverviewGraphicBarSegment";
import OverviewGraphicBarHeader from "../components/OverviewGraphic/OverviewGraphicBarHeader";
import OverviewGraphicBar from "../components/OverviewGraphic/OverviewGraphicBar";
import OverviewGraphicBarDots from "../components/OverviewGraphic/OverviewGraphicBarDots";
import OverviewGraphicSubrsCounter from "../components/OverviewGraphic/OverviewGraphicSubrsCounter";

import JournalsTableTable from "../components/JournalsTable/JournalsTableTable";

import ScenarioMenuScenario from "../components/ScenarioMenu/ScenarioMenuScenario";
import ScenarioMenuSubscriptions from "../components/ScenarioMenu/ScenarioMenuSubscriptions";
import ScenarioMenuView from "../components/ScenarioMenu/ScenarioMenuView";
import ScenarioMenuColumns from "../components/ScenarioMenu/ScenarioMenuColumns";
import ScenarioMenuSettings from "../components/ScenarioMenu/ScenarioMenuSettings";
import ScenarioMenuExport from "../components/ScenarioMenu/ScenarioMenuExport";
import ScenarioMenuHelp from "../components/ScenarioMenu/ScenarioMenuHelp";

import ScenarioParametersTab from "../components/Scenario/ScenarioParametersTab";
import ScenarioExportTab from "../components/Scenario/ScenarioExportTab";
import ScenarioInstitutionsTab from "../components/Scenario/ScenarioInstitutionsTab";
import ScenarioPushPullTab from "@/components/Scenario/ScenarioPushPullTab";
import ScenarioPushPullTabMember from "@/components/Scenario/ScenarioPushPullTabMember";

import ScenarioEditDialogsInstitutions from "../components/ScenarioEditDialogs/ScenarioEditDialogsInstitutions";
import PublisherWarning from "@/components/PublisherWarning/PublisherWarning";
import ScenarioEditDialogs from "@/components/ScenarioEditDialogs/ScenarioEditDialogs";

import {sleep} from "../shared/util";


export default {
  components: {
    AppBarExtScenarioNew,
    OverviewGraphicBarSegment,
    OverviewGraphicBar,
    OverviewGraphicBarDots,
    OverviewGraphicBarHeader,
    OverviewGraphicSubrsCounter,
    JournalsTableTable,

    ScenarioMenuScenario,
    ScenarioMenuView,
    ScenarioMenuSubscriptions,
    ScenarioMenuColumns,
    ScenarioMenuExport,
    ScenarioMenuSettings,
    ScenarioMenuHelp,

    ScenarioParametersTab,
    ScenarioExportTab,
    ScenarioInstitutionsTab,
    ScenarioPushPullTab,
    ScenarioPushPullTabMember,

    ScenarioEditDialogsInstitutions,
    PublisherWarning,
    ScenarioEditDialogs,
  },
  directives: {
    "long-press": LongPress,
  },
  name: "ScenarioPage",
  metaInfo() {
    return {
      title: `${this.scenarioName}`
    }
  },
  data() {
    return {
      barHeight: 500,
      addSubrsInterval: null,
      removeSubrsInterval: null,
      colors: appConfigs.colors,
      isLoading: true,
      stickyToolbarIsAtTopOfWindow: false,
      search: "",
      loadingPercent: 0,
      showSearchBox: false,
      dialogs: {
        fulfillment: false,
        cost: false,
      },

      showSlowRenderingThings: false,
    }
  },
  computed: {
    ...mapGetters([
      'menuSettingsView',
      'selectedScenarioIsLoading',
      'institutionId',
      'institutionIsConsortium',
      'scenarioName',
      'scenarioMemberInstitutions',
      'scenarioId',
      'publisherName',
      'publisherId',
      'publisherCurrencySymbol',
      'journals',
      'scenarioIdHash',
      'scenarioTabShowing',
      'scenarioSnackbars',
      "selectedScenario",
      'menuSettingsView',
      'institutionIsConsortium',
      "institutionIsJisc",
      'scenarioIsLockedPendingUpdate',
      'scenarioUpdatePercentComplete',
      'userEmail',
      'scenarioUpdateNotificationEmail',
      "publisherBigDeal5YearAnnualCost",
      "publisherIsConsortialProposalSet",

    ]),

    readyStatus() {
    },

    account() {
      return this.$store.state.account
    },
    scenario() {
      return this.$store.getters.selectedScenario
    },
    subrJournalsCount() {
      return this.$store.getters.subrJournalsCount
    },
    costPercent() {
      return 100 * this.costTotal / this.publisherBigDeal5YearAnnualCost
    },
    subscribedJournals() {
      return this.journals.filter(j => !!j.subscribed || j.customSubscribed)
    },
    costTotal() {
      return costTotal(this.journals)
    },
    costSegments() {
      return costList(
          this.journals,
          this.publisherBigDeal5YearAnnualCost,
      )
    },
    usageSegments() {
      return usageList(this.journals)
    },
    subrColor() {
      return appConfigs.barSegments.usage.subr.color.normal
    },
    illColor() {
      return appConfigs.barSegments.usage.delayed.color.normal
    },
    instantUsagePercent() {
      return instantUsagePercent(this.journals)
    },
    libraryFulfillmentPercent() {
      return libraryFulfillmentPercent(this.journals)
    },
    numJournals() {
      return this.journals.length
    },
    numJournalsNotHiddenByFilters() {
      return this.journals.filter(j => !j.isHiddenByFilters).length
    },
  },
  methods: {
    ...mapMutations([
      "menuViewToggleShowCostBar",
      "menuViewSetDisplayJournalsAs",
      "openCopyDialog",
    ]),
    onScroll(e) {
      const stickyToolbar = document.getElementById("sticky-toolbar")
      const distanceToTopOfWindow = stickyToolbar.getBoundingClientRect().top
      this.stickyToolbarIsAtTopOfWindow = (distanceToTopOfWindow === 0) ? true : false
    },
    toggleSearchBox() {
      console.log("toggle search box", this.search)

      // clear the text
      this.search = ""
      this.setJournalsFilterStatus()
      console.log("toggle search box", this.search)

      // show/hide the box
      this.showSearchBox = !this.showSearchBox

      // if we are showing the box
      if (this.showSearchBox) {
        this.$nextTick(() => {
          this.focusOnSearchBox();
        });
      }
    },
    focusOnSearchBox() {
      this.$refs.searchBox.focus()
    },
    setJournalsFilterStatus: _.debounce(
        function () {
          // needed because clearing the field sets it to NULL and we want ""
          let searchStr = (this.search) ? this.search : ""
          searchStr = searchStr.toLowerCase()
          const splitSearchTerms = searchStr.split(",").map(term => {
            return _.trim(term)
          })
          console.log("journal search is: ", searchStr)
          console.log("splitSearchTerms is: ", splitSearchTerms)


          const isHiddenByFilters = function (journal) {
            const myTitle = journal.title || ""
            const titleMatch = myTitle.toLowerCase().indexOf(searchStr) > -1
            const issnMatches = _.intersection(
                splitSearchTerms,
                journal.issns.map(issn => issn.toLowerCase())
            )
            return !titleMatch && !issnMatches.length
          }

          // 0190-9622, 0142-0615

          this.journals.forEach(j => {
            j.isHiddenByFilters = isHiddenByFilters(j)
          })
        }, 300),
    async loadPage() {
      this.$store.commit("setIsLoading", true)
      this.$store.dispatch("fetchScenario", this.$route.params.scenarioId)


      this.$store.dispatch("fetchPublisher", this.$route.params.publisherId)
      this.$store.dispatch("fetchInstitution", this.$route.params.institutionId)

      // await this.$store.dispatch("fetchScenario", this.$route.params.scenarioId)
      // this.$nextTick(()=>{
      //     this.showSlowRenderingThings = true
      //
      // })

      // const that = this
      //
      // this.loadingPercent = 0
      // await sleep(500)
      //
      // this.loadingPercent = 33
      // await sleep(800)
      //
      // this.loadingPercent = 66
      await sleep(5)

      this.$store.commit("setIsLoading", false)
    }
  },
  async mounted() {
    this.loadPage()
  },
  destroyed() {
    this.$store.commit("clearSelectedScenario")
  },
  watch: {
    selectedScenarioIsLoading: {
      immediate: true,
      handler: function (to) {
        if (!to) this.$store.commit("setAllowAutoSubscribeFromCurrentJournalSubrs")
      }
    },
    $route: function (to) {
      console.log("scenario page route change", to)
      this.loadPage()
    }
  }
}
</script>

<style lang="scss">
.journals-info-header {
}

.bar-bottom-label {
  margin-top: 26px;
  color: #333;
  text-align: right;
  padding-right: 15px;
}

.infovis {
  flex: 0 0 500px;
  min-width: 500px;
}

.slider-col {
  padding-top: 85px;
  flex: 0 0 1%;
}

.sticky-toolbar {
  top: 0;
  left: 0;
  right: 0;
  position: -webkit-sticky;
  position: sticky;
  z-index: 8;

  div.container {
    transition: max-width 300ms;

  }

}


</style>