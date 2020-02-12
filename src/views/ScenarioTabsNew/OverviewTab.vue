<template>
    <v-container fluid v-if="scenario">

        <v-card>
            <v-toolbar flat>
                <div>
                    <h2 class="display-1">
                        Scenario overview
                        <v-btn icon
                               href="https://support.unpaywall.org/support/solutions/articles/44001822204-page-overview"
                               target="_blank">
                            <v-icon>mdi-information-outline</v-icon>
                        </v-btn>
                    </h2>
                </div>
            </v-toolbar>

            <v-divider></v-divider>

            <v-card>
                <div class="pa-3" v-if="journals.length">
                    <v-row>

                        <v-col cols="7">
                            <overview-graphic-bar-dots
                                :journals="journals"
                            />
                        </v-col>

                        <v-col cols="1"></v-col>


                        <v-col cols="2">
                            <overview-graphic-bar
                                type="cost"
                                :segments="costSegments"
                                :main-number="subrCost + illCost | currency"
                                :secondary-number="subrCostPercent + illCostPercent | percent"
                                :num-journals="journals.length"
                                :num-journals-subscribed="subscribedJournals.length"
                            />
                        </v-col>
                        <v-col cols="2">
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


                </div>

            </v-card>
        </v-card>

        <info-dialog />
        <scenario-config-dialog />
    </v-container>
</template>

<script>
    import _ from "lodash"
    import {api} from "../../api.js"
    import InfoDialog from "../../components/InfoDialog"
    import InfoLink from "../../components/InfoLink"

    import ScenarioConfigDialog from "../../components/ScenarioConfigDialog"
    import ConfigEditLink from "../../components/ConfigEditLink"
    import OverviewGraphicBarSegment from "../../components/OverviewGraphic/OverviewGraphicBarSegment";
    import OverviewGraphicBar from "../../components/OverviewGraphic/OverviewGraphicBar";
    import OverviewGraphicBarDots from "../../components/OverviewGraphic/OverviewGraphicBarDots";

    export default {
        components: {
            InfoLink,
            InfoDialog,
            ConfigEditLink,
            ScenarioConfigDialog,
            OverviewGraphicBarSegment,
            OverviewGraphicBar,
            OverviewGraphicBarDots
        },
        name: "SliderTab",
        data() {
            return {
                barHeight: 500,
                journals: [],
            }
        },
        computed: {
            account() {
                return this.$store.state.account
            },
            pkg() {
                return this.$store.getters.selectedPkg
            },
            scenario() {
                return this.$store.getters.selectedScenario
            },
            scenarioId() {
                return this.$route.params.scenarioId
            },

            cost() {
                return .01 * (this.subrCostPercent + this.illCostPercent) * this.$store.getters.costBigdealProjected
            },
            subrCostPercent() {
                return 100 * this.subrCost / this.$store.getters.costBigdealProjected
            },
            illCostPercent() {
                return 100 * this.illCost / this.$store.getters.costBigdealProjected
            },

            subrCost() {
                return this.journals
                    .filter(j => j.subscribed)
                    .map(j => j.cost_subscription)
                    .reduce((a, b) => a + b, 0)
            },
            illCost() {
                return this.journals
                    .filter(j => !j.subscribed)
                    .map(j => j.cost_ill)
                    .reduce((a, b) => a + b, 0)
            },

            subscribedJournals() {
                return this.journals.filter(j => !!j.subscribed)
            },

            numSubscribedJournalsStr() {
                let ret = this.subscribedJournals.length.toLocaleString() + " journal"
                if (this.subscribedJournals.length !== 1) ret += "s"
                return ret
            },

            costSegments(){
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
                        value: this.$store.getters.costBigdealProjected - (this.illCost + this.subrCost),
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

            usageSegments(){
                const ret = {}
                Object.entries(this.usageRaw).forEach(([k,v]) => {
                    ret[k] = {
                        value: v,
                        key: k
                    }
                })
                return [
                    ret.delayed,
                    ret.subr,
                    ret.asn,
                    ret.backfile,
                    ret.oa,
                ]
            },
            usageTotal(){
                return this.journals
                    .map(j=>j.use_total)
                    .reduce((a, b) => a + b, 0)
            },

            // splitting this out so that vue can cache it
            usageRawFree(){
                const ret = {
                    oa: 0,
                    backfile: 0,
                    asn: 0,
                }
                this.journals.forEach(j => {
                    ret.oa += j.use_groups_free_instant.oa
                    ret.backfile += j.use_groups_free_instant.backfile
                    ret.asn += j.use_groups_free_instant.social_networks
                })
                return ret
            },

            usageRawPaid(){
                const ret = {
                    delayed: 0,
                    subr: 0,
                }
                this.journals.forEach(j => {
                    if (j.subscribed) {
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

            instantUsagePercent(){
                const instant = this.usageRaw.oa + this.usageRaw.backfile + this.usageRaw.asn + this.usageRaw.subr
                return 100 * instant / this.usageTotal
            },
            numJournals() {
                return this.journals.length
            },
            // journals(){
            //     return this.$store.getters.getJournals
            // }
        },
        methods: {
        },
        async mounted() {
            const pkgId = this.$route.params.pkgId
            this.$store.dispatch("fetchPkg", pkgId)
            await this.$store.dispatch("fetchScenario", this.scenarioId)
            this.journals = this.$store.getters.getJournals

        },
        watch: {
        }
    }
</script>

<style lang="scss">

    .infovis {
        flex: 0 0 500px;
        min-width: 500px;
    }

    .slider-col {
        padding-top: 85px;
        flex: 0 0 1%;
    }


</style>