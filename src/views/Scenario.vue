<template>
    <v-container fluid >
        <v-card>
            <v-card>
                <div class="pa-3">
                    <v-row>
                        <v-col class="journals-info" cols="7" >
                            <v-row v-if="selectedScenarioIsLoading" class="d-flex justify-center align-center py-10">
                                Loading...
                            </v-row>
                            <v-row v-if="!selectedScenarioIsLoading">
                                <overview-graphic-bar-dots
                                        v-if="menuSettingsView.displayJournalsAsSelected=='histogram'"
                                        :journals="journals"
                                />
                                <journals-table-table
                                        v-if="menuSettingsView.displayJournalsAsSelected=='table'"
                                        :journals="journals"
                                />
                            </v-row>
                        </v-col>

                        <v-col cols="1"></v-col>


                        <v-col cols="4">
                            <v-row  v-if="scenario && journals.length" >
                                <v-col>
                                    <overview-graphic-bar
                                            type="cost"
                                            :segments="costSegments"
                                            :main-number="subrCost + illCost | currency"
                                            :secondary-number="subrCostPercent + illCostPercent | percent"
                                            :num-journals="journals.length"
                                            :num-journals-subscribed="subscribedJournals.length"
                                    />
                                </v-col>
                                <v-col>
                                    <overview-graphic-bar
                                            type="usage"
                                            :segments="usageSegments"
                                            :main-number="usageTotal | round"
                                            :secondary-number="instantUsagePercent | percent"
                                            :num-journals="journals.length"
                                            :num-journals-subscribed="subscribedJournals.length"
                                    />
                                </v-col>

                            </v-row>
                        </v-col>


                    </v-row>


                </div>

            </v-card>
        </v-card>

    </v-container>
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

    import JournalsTableTable from "../components/JournalsTable/JournalsTableTable";


    export default {
        components: {
            OverviewGraphicBarSegment,
            OverviewGraphicBar,
            OverviewGraphicBarDots,
            OverviewGraphicBarHeader,
            JournalsTableTable,
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
            }
        },
        computed: {
            ...mapGetters([
                'menuSettingsView',
                'selectedScenarioIsLoading',
            ]),


            account() {
                return this.$store.state.account
            },
            scenario() {
                return this.$store.getters.selectedScenario
            },
            subrJournalsCount(){
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
                const instant = this.usageRaw.oa + this.usageRaw.backfile +  this.usageRaw.subr
                return 100 * instant / this.usageTotal
            },
            numJournals() {
                return this.journals.length
            },
            journals() {
                return this.$store.getters.journals
            }
        },
        methods: {
            ...mapMutations([
                "menuViewToggleShowCostBar",
            ]),
        },
        async mounted() {
            this.$store.commit("setIsLoading", true)
            await this.$store.dispatch("fetchPublisher", this.$route.params.publisherId)
            console.log("finished loading the package")
            const myScenario = this.$store.getters.getScenario(this.$route.params.scenarioId)
            console.log("got a scenario", myScenario)
            this.$store.commit("_setScenario", myScenario)

            const that = this
            setTimeout(function(){
                that.$store.commit("setIsLoading", false)
            }, 500)
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


</style>