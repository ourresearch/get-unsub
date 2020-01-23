<template>
    <v-container fluid v-if="scenario">
        <v-card>


            <!--https://unpaywall-jump-api.herokuapp.com/admin/change-password?username=demo&old-password=password&new-password=demo      -->


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
                <v-spacer></v-spacer>
                <div>
                    <div v-if="!editMode">
                        <v-btn
                                @click='startEdit'
                                :disabled="$store.getters.loading"
                                depressed color="info">
                            <v-icon>mdi-auto-fix</v-icon>
                            Find best deal
                        </v-btn>
                    </div>
                    <div v-if="editMode">
                        <v-btn depressed
                               :loading="makeItSoLoading"
                               @click="makeItSo"
                               class="mr-2"
                               color="info">
                            Save these subscriptions
                        </v-btn>
                        <v-btn depressed
                               @click="cancelEdit"

                               outlined>cancel
                        </v-btn>
                    </div>
                </div>


                <!--                <v-text-field-->
                <!--                        v-model="search"-->
                <!--                        append-icon="mdi-magnify"-->
                <!--                        label="Search"-->
                <!--                        flat-->
                <!--                        solo-->
                <!--                        outlined-->
                <!--                        hide-details-->
                <!--                ></v-text-field>-->

            </v-toolbar>


            <v-divider></v-divider>


            <v-card>
                <div class="pa-3" v-if="data">
                    <v-row>
                        <v-col class="1 slider-col lift" cols="">
                            <v-slider
                                    v-model="sliderPercent"
                                    color="info"
                                    vertical
                                    :disabled="!editMode"
                                    @end="sliderEnd"
                            />
                        </v-col>

                        <v-col cols="2">
                            <overview-graphic-bar
                                type="cost"
                                :segments="costSegments"
                                :main-number="subrCostPercent + illCostPercent | percent"
                                :secondary-number="subrCost + illCost | currency"

                            />
                        </v-col>
                        <v-col cols="2">
                            <overview-graphic-bar
                                type="fulfillment"
                                :segments="usageSegments"
                                :main-number="instantUsage | percent"
                                :secondary-number="instantUsageRaw | round"
                            />
                        </v-col>
                        <v-col cols="7" class="journals-area lift bar-col journals">
                            <overview-graphic-bar
                                type="journals"
                                :journals="data.journals"
                                :main-number="subscribedJournals.length + ''"
                            />
                        </v-col>

                    </v-row>


                </div>

            </v-card>
        </v-card>

        <info-dialog></info-dialog>
        <scenario-config-dialog></scenario-config-dialog>
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

    export default {
        components: {
            InfoLink,
            InfoDialog,
            ConfigEditLink,
            ScenarioConfigDialog,
            OverviewGraphicBarSegment,
            OverviewGraphicBar,
        },
        name: "SliderTab",
        data() {
            return {
                sliderPercent: 0,
                barHeight: 500,
                makeItSoLoading: false,
                search: "",
                data: null,
                sliderPercentAtStartOfEdit: null,
                journalsAtStartOfEdit: null,
                costBarHelpDialogIsOpen: false,
                fulfillmentBarHelpDialogIsOpen: false,
                subscriptionBarHelpDialogIsOpen: false,
                barSegmentDialogIsOpen: {}
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

            journalsCheaperToSubscribe() {
                return this.data.journals.filter(j => {
                    return j.cost_subscription_minus_ill < 0
                })
            },
            cost() {
                return .01 * (this.subrCostPercent + this.illCostPercent) * this.data._summary.cost_bigdeal_projected
            },
            costFromSlider() {
                const sliderCost = .01 * this.sliderPercent * this.data._summary.cost_bigdeal_projected
                return sliderCost
                return Math.max(sliderCost, this.illCost)
            },
            subrCostPercent() {
                return 100 * this.subrCost / this.data._summary.cost_bigdeal_projected
            },
            illCostPercent() {
                return 100 * this.illCost / this.data._summary.cost_bigdeal_projected
            },

            subrCost() {
                return this.data.journals
                    .filter(j => !!j.subscribed)
                    .map(j => j.cost_subscription)
                    .reduce((a, b) => a + b, 0)
            },
            illCost() {
                return this.data.journals
                    .filter(j => !j.subscribed)
                    .map(j => j.cost_ill)
                    .reduce((a, b) => a + b, 0)
            },

            subscribedJournals() {
                return this.data.journals.filter(j => !!j.subscribed)
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
                        value: this.data._summary.cost_bigdeal_projected - (this.illCost + this.subrCost),
                        key: "savings",
                        colorIsLight: true,
                    }
                }
                return [
                    ret.savings,
                    ret.subr,
                    ret.ill,
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
                ret.ill.colorIsLight = true
                ret.otherDelayed.colorIsLight = true
                return [
                    ret.ill,
                    ret.otherDelayed,
                    ret.subr,
                    ret.oa,
                    ret.backfile,
                    ret.asn,
                ]
            },


            usageRaw() {
                const ret = {
                    oa: 0,
                    backfile: 0,
                    asn: 0,
                    ill: 0,
                    otherDelayed: 0,
                    subr: 0,
                }
                this.data.journals.forEach(j => {
                    ret.oa += j.use_groups_free_instant.oa
                    ret.backfile += j.use_groups_free_instant.backfile
                    ret.asn += j.use_groups_free_instant.social_networks

                    if (j.subscribed) {
                        ret.subr += j.use_groups_if_subscribed.subscription
                    } else {
                        ret.ill += j.use_groups_if_not_subscribed.ill
                        ret.otherDelayed += j.use_groups_if_not_subscribed.other_delayed
                    }
                })
                return ret
            },

            usage() {
                const ret = {}
                const total = this.tempTotalUsage
                Object.keys(this.usageRaw).forEach(k => {
                    ret[k] = 100 * this.usageRaw[k] / total
                })
                return ret
            },
            tempTotalUsage() {
                return Object.values(this.usageRaw).reduce((a, b) => a + b, 0)
            },
            instantUsageRaw(){
                const usage = this.usageRaw
                return usage.oa + usage.backfile + usage.asn + usage.subr
            },
            instantUsage() {
                const usage = this.usage
                return usage.oa + usage.backfile + usage.asn + usage.subr
            },
            numJournals() {
                return this.data && this.data.journals.length
            },
            editMode() {
                return this.$store.state.editMode
            },
            bronzeConfigLinkStr() {
                const abled = (this.scenario.configs.include_bronze)
                    ? "enabled"
                    : "disabled"
                return `Bronze (${abled})`
            },
            asnConfigLinkStr() {
                const abled = (this.scenario.configs.include_social_networks)
                    ? "enabled"
                    : "disabled"
                return `academic social networks (${abled})`
            },


        },
        methods: {
            sliderEnd() {
                if (this.sliderPercent < this.illCostPercent + this.subrCostPercent) {
                    this.sliderPercent = this.illCostPercent + this.subrCostPercent
                }
            },
            cancelEdit() {
                this.sliderPercent = this.sliderPercentAtStartOfEdit
                this.data.journals = this.journalsAtStartOfEdit
                // this.updateJournals()
                this.$store.commit("clearEditMode")
            },
            startEdit() {
                this.$store.commit("setEditMode")
                this.sliderPercentAtStartOfEdit = this.sliderPercent
                this.journalsAtStartOfEdit = _.cloneDeep(this.data.journals)
                console.log("starting edit")
            },
            async getData() {
                const path = `scenario/${this.scenarioId}/slider`
                const resp = await api.get(path)
                this.data = resp.data
                this.sliderPercent = this.subrCostPercent + this.illCostPercent
                this.sliderEnd()
            },

            async makeItSo() {
                this.$store.commit("clearEditMode")
                this.makeItSoLoading = true
                const subrIssnls = this.data.journals
                    .filter(j => j.subscribed)
                    .map(j => j.issn_l)

                this.$store.commit("setSubrs", subrIssnls)
                await this.$store.dispatch("updateSubrs")

                this.makeItSoLoading = false
                this.$store.commit('snackbar', "Subscriptions updated!", "info")

            },
            updateJournals() {
                if (!this.data) return

                const myMax = this.costFromSlider

                // unsubscribe all
                this.data.journals.forEach(j => j.subscribed = false)

                // ILL cost must be paid regardless
                let mySpendSoFar = this.data.journals.map(j => j.cost_ill).reduce((a, b) => a + b, 0)

                // subscribe to journals where subr is cheaper than ILL
                this.data.journals.forEach(j => {
                    if (j.ncppu < 0) {
                        j.subscribed = true
                        mySpendSoFar += j.cost_subscription_minus_ill
                    }
                })

                if (mySpendSoFar >= myMax) return

                // subscribe to as many other journals as we can afford, ordered by nccpu (from server)
                this.data.journals.forEach(j => {
                    // already handled the negative ones above
                    if (j.ncppu !== null && j.ncppu >= 0) {
                        mySpendSoFar += j.cost_subscription_minus_ill
                        if (mySpendSoFar <= myMax) {
                            j.subscribed = true
                        } else {
                            j.subscribed = false
                        }
                    }
                })

            },
        },
        mounted() {
            const pkgId = this.$route.params.pkgId

            this.$store.dispatch("fetchPkg", pkgId)
            this.$store.dispatch("fetchScenario", this.scenarioId)
            this.getData()
        },
        watch: {
            sliderPercent: function (to, from) {
                if (this.editMode) {
                    this.updateJournals()
                }
            },

            editMode: function (to, from) {
                console.log("edit mode changed")
                if (this.editMode) {
                    this.sliderEnd()
                }
            },

            '$store.getters.scenarioDigest': function (to) {
                console.log("scenarioDigest updated", to)
                this.getData()
            }
        }
    }
</script>

<style lang="scss">
    $bar-height: 400px; // must match with same var in the OverviewGraphicBar

    .text-summary {
        /*font-size: 20px;*/
        /*line-height: 1.5;*/

    }

    .infovis {
        flex: 0 0 500px;
        min-width: 500px;
    }

    .bar-col {
        /*flex: 0 0 30%;*/
        /*max-width: 30%;*/

        &.journals {
            /*flex: 0 0 16%;*/
            /*max-width: 16%;*/
        }
    }

    /*.under-bar {*/
    /*    padding: 10px 0;*/
    /*    font-size: 18px;*/

    /*    .first-row {*/
    /*        line-height: 1;*/
    /*        display: flex;*/
    /*        text-align: left;*/
    /*        align-items: center;*/

    /*        &:hover {*/
    /*            color: green;*/
    /*        }*/

    /*        cursor: help;*/

    /*        div.numbers {*/
    /*            padding-right: 10px;*/

    /*            .main-number {*/
    /*                font-size: 30px;*/
    /*            }*/

    /*            .small-number {*/
    /*                font-size: 14px;*/
    /*                text-align: left;*/
    /*            }*/
    /*        }*/

    /*        .label {*/
    /*            width: 100%;*/
    /*            font-weight: bold;*/
    /*            line-height: 1.4;*/
    /*        }*/

    /*        i {*/
    /*            display: none;*/
    /*        }*/

    /*    }*/

    /*}*/




    .lift {
        // margin-top: -80px;
    }

    .slider-col {
        padding-top: 85px;
        flex: 0 0 1%;
    }

    .v-slider--vertical {
        height: $bar-height !important;
        margin: 0 !important;
    }





</style>