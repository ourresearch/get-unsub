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
                                ></v-slider>
                            </v-col>
                            <v-col cols="2">
                                <div class="bar-wrapper">
                                    <div class="bar-fill"></div>
                                    <div class="bar" :style="{height: costPercent+'%'}"></div>
                                </div>
                            </v-col>
                        </v-row>
                        <v-row>
                            ${{this.cost}}
                        </v-row>
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="4">
                {{ subscribedJournals.length }} subscribed journals
            </v-col>
        </v-row>

    </v-container>
</template>

<script>
    export default {
        props: ["data"],
        name: "SliderTab",
        data() {
            return {
                costPercent: 50
            }
        },
        computed: {
            cost() {
                return .01 * this.costPercent * this.data._summary.cost_bigdeal_projected
            },

            subscribedJournals(){
                const myMax = this.cost
                let mySpendSoFar = this.data.journals.map(j=>j.cost_ill).reduce((a,b)=>a+b)
                const ret = new Set([])

                // subscribe to journals where subr is cheaper than ILL
                this.data.journals.forEach(j=>{
                    if (j.cost_subscription_minus_ill < 0){
                        ret.add(j)
                        mySpendSoFar += j.cost_subscription_minus_ill
                    }
                })


                // subscribe to as many other journals as we can afford
                this.data.journals.forEach(j=>{
                    mySpendSoFar += j.cost_subscription_minus_ill
                    if (mySpendSoFar <= myMax){
                        ret.add(j)
                    }
                })
                return Array.from(ret)
            },
            instantUsage() {
                return 142
            },
            instantUsagePercent() {
                return 55
            },
            numSubr() {
                return 0
            }

        },
        methods: {
        },
    }
</script>

<style lang="scss" >
    .v-slider--vertical {
        min-height: 500px !important;
    }
    .bar-wrapper {
        height: 100%;
        display: flex;
        flex-direction: column;

        .bar-fill {
            background: #ccc;
            flex-grow: 1000;
        }

        .bar {
            background: rebeccapurple;
        }
    }

</style>