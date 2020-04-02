<template>
    <div>
        <v-container>

            <router-link class="text--secondary low-key-link" :to="`/i/${institutionId}/p/${publisherId}`">
                <strong>‹</strong>
                Back <span v-if="publisherName">to {{publisherName}}</span>
            </router-link>
            <div class="page-title mt-8 d-flex">
                <v-avatar size="50" class="mt-3 mr-3">
                    <jazzicon v-show="!selectedScenarioIsLoading" class="" :address="scenarioIdHash" :diameter="50"/>
                    <v-progress-circular
                            size="50"
                            v-show="selectedScenarioIsLoading"
                            indeterminate
                    />
                </v-avatar>

                <div class="text">
                    <div class="body-2">
                        <span v-if="selectedScenarioIsLoading">Loading scenario</span>
                        <span v-if="!selectedScenarioIsLoading">Big Deal cancellation scenario</span>
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
                        <v-divider />
                        <v-card-text>
                            <v-row>
                                <v-spacer />
                                <overview-graphic-subrs-counter/>
                                <v-spacer />
                            </v-row>
                        </v-card-text>
                        <v-divider />

                        <v-card-text>
                            <v-row class="">
                                <!--                                COST -->
                                <v-col class="py-0" cols="6">
                                    <div class="text-right">
                                        <div class="headline">
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
                                        <div class="headline">
                                            {{ instantUsagePercent | percent(1) }}
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
                                                    will successfully fulfill <em>instantly</em> over the next five
                                                    years (either via subscription, backfile, or OA).
                                                </div>
                                            </v-tooltip>
                                        </div>
                                    </div>
                                </v-col>
                            </v-row>

                        </v-card-text>

                        <v-card-text>
                            <v-row>
                                <v-col cols="6">
                                    <overview-graphic-bar
                                            type="cost"
                                            :segments="costSegments"
                                            :num-journals="journals.length"
                                            :num-journals-subscribed="subscribedJournals.length"
                                    />
                                    <div class="text-center mt-2">
                                        <div class="body-1">
                                            Annual cost
                                        </div>
                                        <div class="caption text--secondary">
                                            {{ (this.subrCostPercent + this.illCostPercent) | percent(1) }} of Big Deal
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
                                        <div class="body-1">
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
                        <v-toolbar flat  style="position: sticky; top: 0px; z-index: 999; border-bottom: 1px solid rgba(0, 0, 0, 0.12)">
                            <v-toolbar-title>
                                A-la-carte journals
                                <span class="body-2">({{ numJournals | round }})</span>
                            </v-toolbar-title>
                            <v-spacer></v-spacer>

                            <div class="mr-3">
                                <v-text-field
                                        v-if="menuSettingsView.displayJournalsAsSelected=='table'"
                                        hide-details
                                        outlined
                                        dense
                                        label="Search journals"
                                        v-model="search"
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
                        <v-card-text>
                            <overview-graphic-bar-dots
                                    v-show="menuSettingsView.displayJournalsAsSelected=='histogram'"
                                    :journals="filteredJournals"
                            />
                            <journals-table-table
                                    v-show="menuSettingsView.displayJournalsAsSelected=='table'"
                                    :journals="filteredJournals"
                            />

                        </v-card-text>
                    </v-card>

                </v-col>
            </v-row>
        </v-container>


        <div
                class="sticky-toolbar"
                id="sticky-toolbar"
                v-if="0 && !selectedScenarioIsLoading"
        >
            <v-container
                    class="pt-0 pb-0"
                    :fluid="stickyToolbarIsAtTopOfWindow"
                    v-scroll="onScroll"
            >
                <v-card
                        style="width: 100%; position: relative"
                >
                    <div class="pa-2 pl-4" style="position: absolute; top: 0; left: 0;">
                        <overview-graphic-subrs-counter/>
                    </div>
                    <v-container class="py-3 px-0" style="max-width: 1155px;">
                        <v-row class="mx-0 align-center">
                            <v-spacer/>

                            <v-col cols="1" class="pa-0 pr-8 text-right caption text--secondary">
                                Your 5yr forecast:
                            </v-col>
                            <v-divider vertical></v-divider>

                            <!--                         COST AND FULFILLMENT section-->
                            <v-col class="py-0" cols="4">
                                <v-row class="mx-0">
                                    <!--                                COST -->
                                    <v-col class="py-0" cols="6">
                                        <div class="text-right">
                                            <div class="headline">
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
                                            <div class="headline">
                                                {{ instantUsagePercent | percent(1) }}
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
                                                        will successfully fulfill <em>instantly</em> over the next five
                                                        years (either via subscription, backfile, or OA).
                                                    </div>
                                                </v-tooltip>
                                            </div>
                                        </div>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>

                    </v-container>
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
                </v-card>


            </v-container>

        </div>


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
            filteredJournals() {
                // return this.journals.map(j=>{
                //     return {
                //         ...j,
                //         isShowing:  j.title.toLowerCase().indexOf(this.search) > -1
                //     }
                // })


                if (this.search.length < 3) return this.journals

                return this.journals.filter(j => {
                    return j.title.toLowerCase().indexOf(this.search) > -1
                })
            }
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

            }
        },
        async mounted() {
            this.$store.commit("setIsLoading", true)
            await this.$store.dispatch("fetchPublisher", this.$route.params.publisherId)

            this.$store.commit(
                "setScenarioFromObject",
                this.$store.getters.publisherScenario(this.$route.params.scenarioId)
            )

            console.log("scenario selected:", this.$store.getters.selectedScenario)

            // await this.$store.dispatch("fetchScenario", this.$route.params.scenarioId)

            const that = this
            setTimeout(function () {
                that.$store.commit("setIsLoading", false)
            }, 500)
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
        z-index: 9;

        div.container {
            transition: max-width 300ms;

        }

    }


</style>