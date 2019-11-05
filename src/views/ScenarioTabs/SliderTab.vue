<template>

            <v-card-text style="color: #333;">
                <div class="pa-3" v-if="$store.state.wizardData">
                    <v-row>
                        <v-col cols="4">

                            <h2 class="display-1">Summmary:</h2>
                            <div class="text-summary">
                                At a projected annual spend of <strong>{{this.cost | currency}},</strong> subscribing to
                                the <strong>{{ subscribedJournals.length}}</strong> most cost-effective journals saves
                                <strong>{{100 - (subrCostPercent + illCostPercent) | round}}%</strong> off your current package subscription cost, while providing instant
                                fulfillment for <strong>{{instantUsage | round}}%</strong> of (weighted) usage.
                            </div>

                            <div class="mt-8">
                                <v-btn depressed large class="mr-6" color="primary">Make it so</v-btn>
                                <v-btn depressed large outline>cancel</v-btn>
                            </div>

                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col cols="1">
                            <v-slider
                                    v-model="sliderPercent"
                                    color="gray"
                                    vertical
                                    @end="sliderEnd"
                            ></v-slider>
                        </v-col>
                        <v-col cols="2" class="currency-area">
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

                            <table>
                                <tr>
                                    <td class="num font-weight-bold main-number text-right pr-2">
                                        {{(subrCostPercent+illCostPercent) | round}}%
                                    </td>
                                    <td class="label">
                                        of current cost
                                    </td>
                                </tr>
                            </table>
                        </v-col>


                        <v-col cols="2" class="usage-area">
                            <div class="bar-wrapper">
                                <div class="bar delayed bar-fill">
                                    <strong>{{usage.ill + usage.otherDelayed | round}}%</strong>
                                    ILL and other delayed
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
                                    ASNs
                                </div>
                            </div>
                            <div>
                                <table>
                                    <tr>
                                        <td class="num font-weight-bold main-number text-right pr-2">
                                            <div>
                                                {{instantUsage | round}}%
                                            </div>
                                        </td>
                                        <td class="label">
                                            Instant usage
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </v-col>


                        <v-col cols="2" class="journals-area">
                            <div class="dots-bar-wrapper">
                                    <div v-for="journal in data.journals"
                                         :key="journal.issn_l"
                                         class="journal-dot"
                                         :class="{subscribed: journal.subscribed}"
                                    >
                                    </div>

                            </div>
                            <div>
                                <table>
                                    <tr>
                                        <td class="num font-weight-bold main-number text-right pr-2">
                                            <div>
                                                {{subscribedJournals.length}}
                                            </div>
                                        </td>
                                        <td class="label">
                                            subscribed journals
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </v-col>

                    </v-row>
                </div>

            </v-card-text>

</template>

<script>
    import _ from "lodash"

    export default {
        props: ["data", "editable"],
        name: "SliderTab",
        data() {
            return {
                sliderPercent: 0,
                totalUsage: 0,
                barHeight: 500,
                // subrCost:0,
                // illCost: 0,
            }
        },
        computed: {
            // data() {
            //     return this.$store.state.wizardData
            //
            // },
            showMe() {
                return this.$store.state.wizardOpen
            },
            cost() {
                // i think maybe this is garbage...
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
            costFromSubrs() {
                const costs = this.data.journals.map(j => {
                    if (j.subscribed) {
                        return j.cost_subscription
                    } else {
                        return j.cost_ill
                    }
                })
                return costs.reduce((a, b) => a + b)
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
            instantUsagePercent() {
            },
            numSubr() {
                return 0
            },
            numJournals() {
                return this.data && this.data.journals.length
            },
            journalSubjects() {
                const dict = _.groupBy(this.data.journals, j => {
                    return j.subject
                })
                const subjects = Object.keys(dict).map(k => {
                    return {
                        name: k,
                        journals: dict[k]
                    }
                })
                return subjects
            },
            topCost() {
                return 31091 // tetrahedron letters
                return Math.max(...this.data.journals.map(j => j.cost_subscription))
            },
            topPaidUsage() {
                return 4283.8 // cell

                return Math.max(...this.data.journals.map(j => {
                    return j.use_groups_if_subscribed.subscription
                }))
            },
            journalsXy() {

                return this.data.journals.map(j => {
                    return {
                        ...j,
                        x: (100 * Math.log(j.cost_subscription) / Math.log(this.topCost)) + '%',
                        y: (100 * Math.log(j.use_groups_if_subscribed.subscription) / Math.log(this.topPaidUsage)) + '%'
                    }
                })
            }


        },
        methods: {
            sliderEnd() {
                console.log("slider blur")
                return
                if (this.sliderPercent < this.illCostPercent) {
                    this.sliderPercent = this.illCostPercent
                }
                const subrIssnls = this.data.journals
                    .filter(j => j.subscribed)
                    .map(j => j.issn_l)
                this.$store.dispatch("setSubrs", subrIssnls)
                    .then(r => {
                    })
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

                // set the subrCost
                // this.subrCost = this.data.journals
                //     .filter(j=>j.subscribed)
                //     .map(j => j.cost_subscription_minus_ill)
                //     .reduce((a, b) => a + b, 0)

            },
        },
        mounted() {

        },
        watch: {
            sliderPercent: function (to, from) {
                console.log("cost percent changed")
                this.updateJournals()
            },
            'tabDataDigest': {
                deep: false,
                handler: function (to, from) {
                    console.log("summary changed", to)
                    if (!this.data || !this.data._summary) return
                    // this.illCost = this.data._summary.cost_scenario_ill
                    // this.subrCost = this.data._summary.cost_scenario_subscription
                    this.sliderPercent = 100 * (this.illCost + this.subrCost) / this.data._summary.cost_bigdeal_projected
                }
            },


        }
    }
</script>

<style lang="scss">
    $bar-height: 500px;

    .text-summary {
        font-size: 24px;
        line-height: 1.4;
    }

    table {
        padding: 10px 0;
        line-height: 1;

        .main-number {
            font-size: 60px;
            color: #333;
        }


        .label {
            font-size: 14px;
            width: 3em;

        }
    }

    .journal-dot {
        background: #ccc;
        height: 5px;
        width: 5px;
        border-radius: 5px;
        margin: 1px 1px 0 0;
        line-height: .1;
        display:block;

        &.subscribed {
            background: dodgerblue;
        }
    }

    .v-slider--vertical {
        height: $bar-height !important;
        margin: 0 !important;
    }

    .dots-bar-wrapper {
        height: $bar-height;
        display: block;
        display:flex;
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