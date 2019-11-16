<template>
    <v-container fluid v-if="scenario" :class="{loading: $store.state.loading > 0}">
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
                <v-spacer></v-spacer>
                <v-text-field
                        v-model="search"
                        append-icon="mdi-magnify"
                        label="Search"
                        flat
                        solo
                        outlined
                        hide-details
                ></v-text-field>

            </v-toolbar>


            <v-divider></v-divider>


            <v-card>
                <div class="pa-3" v-if="data">
                    <v-row>
                        <v-col>

                            <div class="text-summary">
                                <p>
                                    At a projected annual spend of <strong>{{this.cost | currency}},</strong>
                                    subscribing to

                                    <span v-if="subscribedJournals.length">
                                        only the <strong>{{ subscribedJournals.length}}</strong> most <a
                                            href="https://support.unpaywall.org/support/solutions/articles/44001822684-cost-effectiveness"
                                            target="_blank">cost-effective</a> journals
                                    </span>
                                    <span v-if="!subscribedJournals.length">
                                        <em>none</em> of your baseline journals
                                    </span>
                                    saves <strong>{{100 - (subrCostPercent + illCostPercent) | round}}%</strong> off
                                    your current package subscription cost, while providing instant fulfillment for
                                    <strong>{{instantUsage | round}}%</strong> of (weighted) usage.
                                </p>

                                <p>
                                    <v-btn
                                            @click='startEdit'
                                            v-if="!editMode"
                                            class="mt-4"
                                            depressed color="info">edit
                                    </v-btn>
                                </p>


                                <v-alert text type="info" v-if="false && journalsCheaperToSubscribe.length">
                                    <div>
                                        You could save money by subscribing to the <strong>{{
                                        journalsCheaperToSubscribe.length }}</strong> journals where subscription is
                                        cheaper than ILL.
                                    </div>
                                    <div>
                                        <v-btn @click='$store.dispatch("openWizard")' class="mt-4" depressed
                                               color="info">show me
                                        </v-btn>
                                    </div>
                                </v-alert>


                            </div>

                            <div v-if="editMode" class="mt-8">
                                <v-btn depressed
                                       :loading="makeItSoLoading"
                                       @click="makeItSo"
                                       class="mr-2"
                                       color="info">
                                    Save subscriptions
                                </v-btn>
                                <v-btn depressed
                                       @click="cancelEdit"

                                       outlined>cancel
                                </v-btn>
                            </div>

                        </v-col>
                        <v-col cols="1 slider-col lift">
                            <v-slider
                                    v-model="sliderPercent"
                                    color="info"
                                    vertical
                                    :disabled="!editMode"
                                    @end="sliderEnd"
                            ></v-slider>
                        </v-col>
                        <v-col :cols="barCols" class="currency-area lift">
                            <div class="under-bar">
                                <div class="num font-weight-bold main-number ">
                                    {{(subrCostPercent+illCostPercent) | round}}%
                                </div>
                                <div class="label">
                                    of base cost
                                </div>
                            </div>
                            <div class="bar-wrapper">
                                <div class="bar-fill"></div>
                                <div class="bar cost" :style="{height: subrCostPercent+'%'}">
                                    <strong>{{subrCostPercent | round}}%</strong>
                                    Subscription
                                </div>
                                <div class="bar cost" :style="{height: illCostPercent +'%'}">
                                    <strong>{{illCostPercent | round}}%</strong>
                                    ILL
                                </div>
                            </div>

                        </v-col>


                        <v-col :cols="barCols" class="usage-area lift">
                            <div class="under-bar">
                                <div class="num font-weight-bold main-number ">
                                    {{instantUsage | round}}%
                                </div>
                                <div class="label">
                                    Instant Usage
                                </div>
                            </div>

                            <div class="bar-wrapper">
                                <div class="bar delayed bar-fill">
                                    <strong>{{usage.ill + usage.otherDelayed | round}}%</strong>
                                    ILL and other
                                </div>
                                <div class="bar paid instant" :style="{height: usage.subr+'%'}">
                                    <strong>{{usage.subr | round}}%</strong>
                                    Subscription
                                </div>
                                <div class="bar free instant" :style="{height: usage.oa+'%'}">
                                    <strong>{{usage.oa | round}}%</strong>
                                    OA
                                </div>
                                <div class="bar free instant" :style="{height: usage.backfile+'%'}">
                                    <strong>{{usage.backfile | round}}%</strong>
                                    Backfile
                                </div>
                                <div class="bar free instant" :style="{height: usage.asn+'%'}">
                                    <strong>{{usage.asn | round}}%</strong>
                                    ResearchGate etc
                                </div>
                            </div>

                        </v-col>


                        <v-col :cols="barCols" class="journals-area lift">
                            <div class="under-bar">
                                <div class="num font-weight-bold main-number ">
                                    {{subscribedJournals.length}}
                                </div>
                                <div class="label">
                                    subscribed journals
                                </div>
                            </div>
                            <div class="dots-bar-wrapper">
                                <div v-for="journal in data.journals"
                                     :key="journal.issn_l"
                                     class="journal-dot"
                                     :class="{subscribed: journal.subscribed}"
                                >
                                </div>

                            </div>
                        </v-col>

                    </v-row>
                </div>

            </v-card>
        </v-card>
    </v-container>

</template>

<script>
    import _ from "lodash"
    import {api} from "../../api.js"

    export default {
        components: {},
        name: "SliderTab",
        data() {
            return {
                sliderPercent: 0,
                totalUsage: 0,
                barHeight: 500,
                makeItSoLoading: false,
                search: "",
                data: null,
                sliderPercentAtStartOfEdit: null
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
            scenarioId(){
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
            loading() {
                return this.$store.state.tabDataLoading
            },
            barCols() {
                return 2
            },

            subscribedJournals() {
                return this.data.journals.filter(j => !!j.subscribed)
            },
            usage() {
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
                const total = Object.values(ret).reduce((a, b) => a + b) || 1
                Object.keys(ret).forEach(k => {
                    ret[k] = 100 * ret[k] / total
                })


                return ret
            },
            instantUsage() {
                const usage = this.usage
                return usage.oa + usage.backfile + usage.asn + usage.subr
            },
            tabDataDigest() {
                return this.$store.getters.tabDataDigest
            },
            numJournals() {
                return this.data && this.data.journals.length
            },
            editMode(){
                return this.$store.state.editMode
            }


        },
        methods: {
            sliderEnd() {
                if (this.sliderPercent < this.illCostPercent) {
                    this.sliderPercent = this.illCostPercent
                }
            },
            cancelEdit(){
                this.$store.commit("clearEditMode")
                this.sliderPercent = this.sliderPercentAtStartOfEdit
            },
            startEdit(){
                this.$store.commit("setEditMode")
                this.sliderPercentAtStartOfEdit = this.sliderPercent
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
                await this.$store.dispatch("updateScenario")
                await this.getData()

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
                    if (j.cost_subscription_minus_ill < 0) {
                        j.subscribed = true
                        mySpendSoFar += j.cost_subscription_minus_ill
                    }
                })

                if (mySpendSoFar >= myMax) return


                // subscribe to as many other journals as we can afford
                this.data.journals.forEach(j => {
                    mySpendSoFar += j.cost_subscription_minus_ill
                    if (mySpendSoFar <= myMax) {
                        j.subscribed = true
                    } else {
                        j.subscribed = false
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
                console.log("cost percent changed")
                this.updateJournals()
            },

            editMode: function (to, from) {
                console.log("edit mode changed")
                if (this.editMode) {
                    this.sliderEnd()
                }
            },
        }
    }
</script>

<style lang="scss">
    $bar-height: 400px;

    .tab.loading {
        opacity: .5;
        transition: opacity .25s ease-in-out;
    }

    .text-summary {
        font-size: 20px;
        line-height: 1.5;

    }

    .under-bar {
        padding: 10px 0;
        line-height: 1;

        .main-number {
            font-size: 50px;
            color: #333;
            text-align: center;
            width: 100%;
        }


        .label {
            font-size: 14px;
            text-align: center;

        }
    }

    .journal-dot {
        background: #ccc;
        height: 4px;
        width: 4px;
        border-radius: 5px;
        margin: 1px 1px 0 0;
        line-height: .1;
        display: block;

        &.subscribed {
            background: dodgerblue;
        }
    }


    .lift {
        // margin-top: -80px;
    }

    .slider-col {
        padding-top: 100px;
    }

    .v-slider--vertical {
        height: $bar-height !important;
        margin: 0 !important;
    }

    .dots-bar-wrapper {
        height: $bar-height;
        display: block;
        display: flex;
        flex-wrap: wrap-reverse;
    }

    .bar-wrapper {
        height: $bar-height;
        display: flex;
        flex-direction: column;

        .bar-fill {
            background: #ccc;
            flex-grow: 1000;
        }

        .bar {
            padding-left: 3px;
            border-top: 1px solid #eee;
            font-size: 12px;
            color: #fff;

            &.cost {
                background: #555;
            }

            &.free {
                background: green;
            }

            &.paid.instant {
                background: dodgerblue;
            }
        }
    }

</style>