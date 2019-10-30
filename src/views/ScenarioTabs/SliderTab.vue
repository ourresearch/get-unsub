<template>
    <v-container fluid class="tab" v-if="data">
        <v-row>
            <v-col cols="8">
                <v-row>
                    <v-col>
                        <v-row>
                            <v-col cols="1">
                                <v-slider
                                        v-model="costPercent"
                                        vertical
                                        @end="sliderEnd"
                                ></v-slider>
                            </v-col>
                            <v-col cols="2">
                                <div class="bar-wrapper">
                                    <div class="bar-fill"></div>
                                    <div class="bar cost" :style="{height: costPercent+'%'}"></div>
                                </div>
                            </v-col>
                        </v-row>
                        <v-row>
                            ${{this.cost}}
                        </v-row>
                    </v-col>
                    <v-col>
                        <v-row>
                            <v-col cols="2">
                                <div class="bar-wrapper">
                                    <div class="bar delayed bar-fill"></div>
                                    <div class="bar paid instant" :style="{height: usage.subr+'%'}"></div>
                                    <div class="bar free instant" :style="{height: usage.oa+'%'}"></div>
                                    <div class="bar free instant" :style="{height: usage.backfile+'%'}"></div>
                                    <div class="bar free instant" :style="{height: usage.asn+'%'}"></div>
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
            <v-col cols="4">
                {{ subscribedJournals.length }} subscribed journals
                total usage {{totalUsage}}
            </v-col>
        </v-row>

    </v-container>
</template>

<script>
    export default {
        props: ["data", "scenario"],
        name: "SliderTab",
        data() {
            return {
                costPercent: 0,
                totalUsage: 0,
            }
        },
        computed: {
            cost() {
                return .01 * this.costPercent * this.data._summary.cost_bigdeal_projected
            },
            costFromSubrs(){
                const costs = this.data.journals.map(j=>{
                    if (j.subscribed){
                        return j.cost_subscription
                    }
                    else {
                        return j.cost_ill
                    }
                })
                return costs.reduce((a,b)=>a+b)
            },

            subscribedJournals() {
                return this.data.journals.filter(j=>!!j.subscribed)
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
                this.data.journals.forEach(j=>{
                    ret.oa += j.use_groups_free_instant.oa
                    ret.backfile += j.use_groups_free_instant.backfile
                    ret.asn += j.use_groups_free_instant.social_networks

                    if (j.subscribed){
                        ret.subr += j.use_groups_if_subscribed.subscription
                    }
                    else {
                        ret.ill += j.use_groups_if_not_subscribed.ill
                        ret.otherDelayed += j.use_groups_if_not_subscribed.other_delayed
                    }
                })
                const total = Object.values(ret).reduce((a,b)=>a+b) || 1
                Object.keys(ret).forEach(k=>{
                    ret[k] = 100 *  ret[k] / total
                })


                return ret
            },
            instantUsage(){
                const usage = this.usage
                return usage.oa + usage.backfile + usage.asn + usage.subr
            },
            instantUsagePercent() {
            },
            numSubr() {
                return 0
            },
            numJournals(){
                return this.data && this.data.journals.length
            }


        },
        methods: {
            sliderEnd(){
                console.log("slider blur")
                this.scenario.subrs = this.data.journals
                    .filter(j=>j.subscribed)
                    .map(j=>j.issn_l)
                console.log("subrs", this.subrs)
            },
            updateJournals(){
                if (!this.data) return

                const myMax = this.cost

                // unsubscribe all
                this.data.journals.forEach(j=>j.subscribed=false)

                // ILL cost must be paid regardless
                let mySpendSoFar = this.data.journals.map(j => j.cost_ill).reduce((a, b) => a + b)

                // subscribe to journals where subr is cheaper than ILL
                this.data.journals.forEach(j => {
                    if (j.cost_subscription_minus_ill < 0) {
                        j.subscribed = true
                        mySpendSoFar += j.cost_subscription_minus_ill
                    }
                })

                // subscribe to as many other journals as we can afford
                this.data.journals.forEach(j => {
                    mySpendSoFar += j.cost_subscription_minus_ill
                    if (mySpendSoFar <= myMax) {
                        j.subscribed = true
                    }
                })
            },
            setCostPercentFromJournals(){
                this.costPercent = 100 * this.costFromSubrs / this.data._summary.cost_bigdeal_projected
            }
        },
        mounted(){

        },
        watch: {
            costPercent: function(to, from){
                this.updateJournals()
            },
            numJournals: function(to, from){
                console.log("set journals")
                // this.updateJournals()
                this.data.journals.forEach(j=>{
                    if (this.scenario.subrs.includes(j.issn_l)){
                        j.subscribed = true
                    }
                    else {
                        j.subscribed = false
                    }
                })
                this.setCostPercentFromJournals()
            }

        }
    }
</script>

<style lang="scss">
    .v-slider--vertical {
        min-height: 500px !important;
        margin: 0 !important;
    }

    .bar-wrapper {
        height: 100%;
        min-height: 500px;
        display: flex;
        flex-direction: column;

        .bar-fill {
            background: #ccc;
            flex-grow: 1000;
        }

        .bar {
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