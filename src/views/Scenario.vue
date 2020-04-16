<template>
    <div>

        <div
                style="height: 85vh"
                class="loading d-flex flex-column align-center justify-center"
                v-if="selectedScenarioIsLoading"
        >
            <div style="width: 300px;">
                <v-progress-linear
                        v-model="loadingPercent"
                />

            </div>
            <div class="mt-3">
                Loading scenario
            </div>
        </div>

        <div v-if="!selectedScenarioIsLoading">
            <v-container>

                <router-link
                        v-if="publisherId && institutionId"
                        class="text--secondary low-key-link"
                        :to="`/i/${institutionId}/p/${publisherId}`">
                    <strong>‹</strong>
                    Back <span v-if="publisherName">to {{publisherName}}</span>
                </router-link>
                <div class="page-title mt-8 d-flex">
                    <div class="text">
                        <div class="body-2">
                            <span>Big Deal cancellation scenario</span>
                        </div>
                        <div class="display-2">
                            {{ scenarioName }}
                        </div>

                    </div>
                </div>
                <v-divider></v-divider>
                <div class="d-flex pa-1">
                    <scenario-menu-scenario key="scenario"/>
                    <scenario-menu-view key="view"/>
                    <scenario-menu-subscriptions v-if="0" key="subscriptions"/>
                    <scenario-menu-columns key="columns"/>
                    <scenario-menu-settings key="settings"/>
                    <scenario-menu-export key="export"/>
                    <scenario-menu-help key="help"/>
                </div>
            </v-container>


            <v-container>
                <v-row>
                    <v-col cols="4">
                        <v-card style="position: sticky; top: 0px;">
                            <v-toolbar flat>
                                <v-toolbar-title>
                                    5yr forecast overview
                                </v-toolbar-title>
                            </v-toolbar>
                            <v-divider/>
                            <v-card-text>
                                <v-row>
                                    <v-spacer/>
                                    <overview-graphic-subrs-counter/>
                                    <v-spacer/>
                                </v-row>
                            </v-card-text>
                            <v-divider/>

                            <v-card-text class="pt-9 pb-0">
                                <v-row class="">
                                    <!--                                COST -->
                                    <v-col class="py-0" cols="6">
                                        <div class="text-right">
                                            <div class="headline font-weight-bold">
                                                {{ subrCost + illCost | currency }}
                                            </div>
                                            <div class="caption">
                                                <v-tooltip bottom max-width="400" color="#333">
                                                    <template v-slot:activator="{ on }">
                                                                <span v-on="on">
                                                                    Annual cost
                                                                    <v-icon small>mdi-information-outline</v-icon>
                                                                </span>
                                                    </template>
                                                    <div>
                                                        This is the average annual cost to the library over the next
                                                        five years, based on your selected settings and subscriptions.
                                                    </div>
                                                </v-tooltip>
                                            </div>
                                        </div>
                                    </v-col>

                                    <!--                                FULFILLMENT -->
                                    <v-col class="py-0" cols="6">
                                        <div class="text-right">
                                            <div class="headline font-weight-bold">
                                                {{ instantUsagePercent | percent }}
                                            </div>
                                            <div class="caption">
                                                <v-tooltip bottom max-width="400" color="#333">
                                                    <template v-slot:activator="{ on }">
                                                                <span v-on="on">
                                                                    Instant fulfillment
                                                                    <v-icon small>mdi-information-outline</v-icon>
                                                                </span>
                                                    </template>
                                                    <div>
                                                        This is the percentage of content requests that your library
                                                        will fulfill <em>instantly</em> over the next five
                                                        years (either via subscription, backfile, or OA).
                                                    </div>
                                                </v-tooltip>
                                            </div>
                                        </div>
                                    </v-col>
                                </v-row>

                            </v-card-text>

                            <v-card-text class="pt-0">
                                <v-row>
                                    <v-col cols="6">
                                        <overview-graphic-bar
                                                type="cost"
                                                :segments="costSegments"
                                                :num-journals="journals.length"
                                                :num-journals-subscribed="subscribedJournals.length"
                                        />
                                        <div class="text-center mt-2">
                                            <div class="">
                                                Annual cost
                                            </div>
                                            <div class="caption text--secondary">
                                                {{ (this.subrCostPercent + this.illCostPercent) | percent(1) }} of Big
                                                Deal
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
                                        <div class="text-center mt-2">
                                            <div class="">
                                                Instant fulfillment
                                            </div>
                                        </div>
                                    </v-col>

                                </v-row>

                            </v-card-text>


                        </v-card>
                    </v-col>

                    <v-col cols="8">
                        <v-card>
                            <v-toolbar flat
                                       style="position: sticky; top: 0px; z-index: 8; border-bottom: 1px solid rgba(0, 0, 0, 0.12)">
                                <v-toolbar-title>
                                    A-la-carte journals
                                    <span class="body-2">({{ numJournalsNotHiddenByFilters | round }})</span>
                                </v-toolbar-title>
                                <v-spacer></v-spacer>

                                <div class="mr-3">
                                    <v-text-field
                                            hide-details
                                            clearable
                                            outlined
                                            dense
                                            label="Search journals"
                                            autocomplete="false"
                                            v-model="search"
                                            v-on:input="setJournalsFilterStatus"
                                            append-icon="mdi-magnify"
                                            full-width

                                    />
                                </div>
                                <scenario-menu-columns :icon="true"/>
                                <v-menu>
                                    <template v-slot:activator="{on}">
                                        <v-btn
                                                text
                                                v-on="on"
                                                icon

                                        >
                                            <v-icon>mdi-eye</v-icon>
                                            <!--                                        <v-icon v-if="'histogram' === menuSettingsView.displayJournalsAsSelected">-->
                                            <!--                                            mdi-poll-box-->
                                            <!--                                        </v-icon>-->
                                            <!--                                        <v-icon v-if="'table' === menuSettingsView.displayJournalsAsSelected">-->
                                            <!--                                            mdi-table-large-->
                                            <!--                                        </v-icon>-->
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
                                                <v-icon>{{option.icon}}</v-icon>
                                                {{ option.name }}
                                            </v-list-item-title>
                                        </v-list-item>
                                    </v-list>
                                </v-menu>
                            </v-toolbar>
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
            </v-container>


        </div>


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

    </div>
</template>

<script>
    import _ from "lodash"
    import {mapGetters, mapMutations} from 'vuex'
    import LongPress from 'vue-directive-long-press'

    import appConfigs from "../appConfigs";


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
    import {sleep} from "../shared/util";


    export default {
        components: {
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
        },
        directives: {
            "long-press": LongPress,
        },
        name: "ScenarioPage",
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

                showSlowRenderingThings: false,
            }
        },
        computed: {
            ...mapGetters([
                'menuSettingsView',
                'selectedScenarioIsLoading',
                'institutionId',
                'scenarioName',
                'scenarioId',
                'publisherName',
                'publisherId',
                'journals',
                'scenarioSubrsAreInCpuOrder',
                'scenarioIdHash',
                'scenarioSnackbars',


                'menuSettingsView',
            ]),


            account() {
                return this.$store.state.account
            },
            scenario() {
                return this.$store.getters.selectedScenario
            },
            subrJournalsCount() {
                return this.$store.getters.subrJournalsCount
            },
            cost() {
                return .01 * (this.subrCostPercent + this.illCostPercent) * this.$store.getters.costBigdealProjected
            },
            costPerUse() {
                return (this.subrCost + this.illCost) / this.usageRawPaid.subr
            },
            subrCostPercent() {
                return 100 * this.subrCost / this.$store.getters.costBigdealProjected
            },
            illCostPercent() {
                return 100 * this.illCost / this.$store.getters.costBigdealProjected
            },

            subrCost() {
                return this.journals
                    .filter(j => j.subscribed || j.customSubscribed)
                    // .filter(j => this.$store.getters.isSubscribed(j.issn_l))
                    .map(j => j.cost_subscription)
                    .reduce((a, b) => a + b, 0)
            },
            illCost() {
                return this.journals
                    .filter(j => !j.subscribed || j.customSubscribed)
                    // .filter(j => !this.$store.getters.isSubscribed(j.issn_l))
                    .map(j => j.cost_ill)
                    .reduce((a, b) => a + b, 0)
            },

            subscribedJournals() {
                return this.journals.filter(j => !!j.subscribed || j.customSubscribed)
            },


            costSegments() {
                const mySavings = this.$store.getters.costBigdealProjected - (this.illCost + this.subrCost)
                const ret = {
                    ill: {
                        value: this.illCost,
                        key: "ill",
                    },
                    subr: {
                        value: this.subrCost,
                        key: "subr",
                    },
                    savings: {
                        value: Math.max(mySavings, 0),
                        key: "savings",
                        colorIsLight: true,
                    }
                }
                return [
                    ret.savings,
                    ret.ill,
                    ret.subr,
                ]
            },

            usageSegments() {
                const ret = {}
                Object.entries(this.usageRaw).forEach(([k, v]) => {
                    ret[k] = {
                        value: v,
                        key: k
                    }
                })
                return [
                    ret.delayed,
                    ret.subr,
                    ret.backfile,
                    ret.oa,
                ]
            },
            usageTotal() {
                return this.journals
                    .map(j => j.use_total)
                    .reduce((a, b) => a + b, 0)
            },
            subrColor() {
                return appConfigs.barSegments.usage.subr.color
            },
            illColor() {
                return appConfigs.barSegments.usage.delayed.color
            },

            // splitting this out so that vue can cache it
            usageRawFree() {
                const ret = {
                    oa: 0,
                    backfile: 0,
                }
                this.journals.forEach(j => {
                    ret.oa += j.use_groups_free_instant.oa
                    ret.backfile += j.use_groups_free_instant.backfile
                })
                return ret
            },

            usageRawPaid() {
                const ret = {
                    delayed: 0,
                    subr: 0,
                }
                this.journals.forEach(j => {
                    // if (this.$store.getters.isSubscribed(j.issn_l)) {
                    if (j.subscribed || j.customSubscribed) {
                        ret.subr += j.use_groups_if_subscribed.subscription
                    } else {
                        ret.delayed += (j.use_groups_if_not_subscribed.ill + j.use_groups_if_not_subscribed.other_delayed)
                    }
                })
                return ret
            },

            usageRaw() {
                return {
                    ...this.usageRawFree,
                    ...this.usageRawPaid
                }
            },

            instantUsagePercent() {
                const instant = this.usageRaw.oa + this.usageRaw.backfile + this.usageRaw.subr
                return 100 * instant / this.usageTotal
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
            ]),
            onScroll(e) {
                const stickyToolbar = document.getElementById("sticky-toolbar")
                const distanceToTopOfWindow = stickyToolbar.getBoundingClientRect().top
                this.stickyToolbarIsAtTopOfWindow = (distanceToTopOfWindow === 0) ? true : false
            },
            setJournalsFilterStatus: _.debounce(
                function () {
                    console.log("setJournalsFilterStatus", this.search)
                    // needed because clearing the field sets it to NULL and we want ""
                    const searchStr = (this.search) ? this.search : ""

                    const isHiddenByFilters = function (journal) {
                        if (!journal.title) return false
                        return journal.title.toLowerCase().indexOf(searchStr) === -1
                    }
                    this.journals.forEach(j => {
                        j.isHiddenByFilters = isHiddenByFilters(j)
                    })
                }, 300),
        },
        async mounted() {
            this.$store.commit("setIsLoading", true)
            await this.$store.dispatch("fetchPublisher", this.$route.params.publisherId)
            await this.$store.dispatch("fetchInstitution", this.$route.params.institutionId)

            this.$store.commit(
                "setScenarioFromObject",
                this.$store.getters.publisherScenario(this.$route.params.scenarioId)
            )

            console.log("scenario selected:", this.$store.getters.selectedScenario)

            // await this.$store.dispatch("fetchScenario", this.$route.params.scenarioId)
            // this.$nextTick(()=>{
            //     this.showSlowRenderingThings = true
            //
            // })

            const that = this


            this.loadingPercent = 0
            await sleep(500)

            this.loadingPercent = 33
            await sleep(800)

            this.loadingPercent = 66
            await sleep(500)

            that.$store.commit("setIsLoading", false)


            // setTimeout(function () {
            //     that.$store.commit("setIsLoading", false)
            //     // that.showSlowRenderingThings = true
            // }, 3000)
        },
        destroyed() {

        },
        watch: {}
    }
</script>

<style lang="scss">
    .journals-info-header {
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