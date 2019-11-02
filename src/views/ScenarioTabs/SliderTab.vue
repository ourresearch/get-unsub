<template>
    <v-container fluid class="tab" v-if="showMe" :class="{loading: loading}">
        <v-row>
            <v-col cols="4">
                {{ subscribedJournals.length }} subscribed journals
                total usage {{totalUsage}}
                <div>
                    <div v-for="journal in data.journals"
                         :key="journal.issn_l"
                         @click="$store.dispatch('openSingleJournal', journal.issn_l)"
                         class="journal-dot"
                         :class="{subscribed: journal.subscribed}"
                            style="height: 5px; width: 5px; border-radius: 10px; margin: 1px; float:left;">

                    </div>

                </div>
            </v-col>
            <v-col cols="8">
                <v-row>
                    <v-col>
                        <v-row>
                            <v-col cols="1">
                                <v-slider
                                        v-model="sliderPercent"
                                        color="gray"
                                        vertical
                                        @end="sliderEnd"
                                ></v-slider>
                            </v-col>
                            <v-col cols="4">
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
                        </v-row>
                        <v-row>
                            {{this.cost | currency}}
                        </v-row>
                        <v-row>{{illCost | currency}}</v-row>
                        <v-row>subr cost {{subrCost}}</v-row>
                    </v-col>
                    <v-col>
                        <v-row>
                            <v-col cols="4">
                                <div class="bar-wrapper">
                                    <div class="bar delayed bar-fill">
                                        <strong>{{usage.ill + usage.otherDelayed | round}}%</strong>
                                        Other
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
                            </v-col>
                        </v-row>
                        <v-row>
                            {{instantUsage}} instant access
                            <pre>{{usage}}</pre>
                        </v-row>
                    </v-col>
                </v-row>
            </v-col>

        </v-row>

    </v-container>
</template>

<script>
    export default {
        props: [],
        name: "SliderTab",
        data() {
            return {
                sliderPercent: 0,
                totalUsage: 0,
                // subrCost:0,
                // illCost: 0,
            }
        },
        computed: {
            data() {
                return this.$store.state.tabData
            },
            showMe() {
                return this.$store.getters.currentScenarioPage === 'slider'
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


        },
        methods: {
            sliderEnd() {
                console.log("slider blur")
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

    .journal-dot {
        background: #ccc;
        &.subscribed {
            background: dodgerblue;
        }
    }

    .v-slider--vertical {
        min-height: 400px !important;
        margin: 0 !important;
    }

    .bar-wrapper {
        height: 100%;
        min-height: 400px;
        display: flex;
        flex-direction: column;

        .bar-fill {
            background: #ccc;
            flex-grow: 1000;
        }

        .bar {
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