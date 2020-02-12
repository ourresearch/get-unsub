<template>
    <div class="bar-col">
        <div class="headers row pl-3">
            <div>
                <overview-graphic-bar-header
                        title="Subscription journals"
                        :main-number="subrJournalsCount | round"
                        :color="subrConfigs.darkColor"

                />
            </div>

            <v-slider
                    class="pt-3 px-2"
                    v-model="sliderPercent"
                    @end="sliderEnd"
                    color="deep-orange"
                    track-color="indigo"
                    :disabled="savingSliderChoice"

            />

            <div class="pr-5">
                <overview-graphic-bar-header
                        title="ILL journals"
                        :main-number="illJournalsCount | round"
                        :color="illConfigs.darkColor"
                />
            </div>
        </div>
        <div class="bar-wrapper">
            <div class="dots-bar-wrapper">
                <div class="bin-splitter pt-2">
                    <span class="main body-2 font-weight-bold">High value  </span>
                    <span class="body-2">(<$1 per use)</span>
                </div>

<!--                <div v-for="(item, index) in itemsToPrint" :key="'dot'+index">-->
<!--                </div>-->


                <template v-for="(item, index) in itemsToPrint">
                    <div class="bin-splitter pt-2"
                         :key="'firstBinSplit'"
                         v-if="item==='firstBinSplit'">
                        <span class="main body-2 font-weight-bold">Medium value  </span>
                        <span class="body-2">($1-10 per use)</span>
                    </div>
                    <div class="bin-splitter pt-2"
                         :key="'secondBinSplit'"
                         v-if="item==='secondBinSplit'">
                        <span class="main body-2 font-weight-bold">Low value  </span>
                        <span class="body-2">(>$10 per use)</span>
                    </div>

<!--                    <div :key="'dot'+index">.</div>-->
                    <overview-graphic-bar-single-dot
                            v-if="item.issn_l"
                            :key="item.issn_l"
                            :journal="item"
                    />



                </template>
            </div>
        </div>
    </div>
</template>

<script>
    import OverviewGraphicBarSingleDot from "./OverviewGraphicBarSingleDot";
    import OverviewGraphicBarHeader from "./OverviewGraphicBarHeader";
    import appConfigs from "../../appConfigs";

    export default {
        name: "OverviewGraphicBarDots",
        components: {
            OverviewGraphicBarSingleDot,
            OverviewGraphicBarHeader
        },
        props: {
            journals: Array,
        },
        data() {
            return {
                firstBinSplit: 1,
                secondBinSplit: 10,
                illConfigs: appConfigs.costSegments.ill,
                subrConfigs: appConfigs.costSegments.subr,
                savingSliderChoice: false,
                foo: 0,
            }
        },
        computed: {
            itemsToPrint() {
                const firstBinIndex = this.journals.findIndex(j => j.ncppu > this.firstBinSplit)
                const secondBinIndex = this.journals.findIndex(j => j.ncppu > this.secondBinSplit)
                const ret = [...this.journals]
                ret.splice(firstBinIndex, 0, "firstBinSplit")
                ret.splice(secondBinIndex, 0, "secondBinSplit")
                return ret
            },
            firstBinCount() {
                return this.journals.filter(j => j.ncppu <= this.firstBinSplit).length
            },
            secondBinCount() {
                return this.journals.filter(j => j.ncppu <= this.secondBinSplit).length
            },
            thirdBinCount() {
                return this.journals.filter(j => j.ncppu > this.secondBinSplit).length
            },
            subrJournalsCount() {
                // return this.$store.getters.subrJournalsCount
                return this.journals.filter(j=>j.subscribed).length
            },
            illJournalsCount() {
                // return this.$store.getters.illJournalsCount
                return this.journals.filter(j=>!j.subscribed).length
            },
            journalsCount(){
                return this.journals.length
            },
            sliderPercent: {
                get() {
                    return 100 * this.subrJournalsCount / this.journalsCount
                    // return this.$store.getters.journalsPercentSubscribed
                },
                set(percent) {
                    const len = this.journals.length
                    const indexToSubscribeUpTo = .01 * percent * len
                    for (let i = 0; i < len; i++) {
                        if (i < indexToSubscribeUpTo) {
                            this.journals[i].subscribed = true
                        }
                        else {
                            this.journals[i].subscribed = false
                        }
                    }
                }
            },

        },
        methods: {
            async sliderEnd() {
                console.log("slider end.", this.sliderPercent)
                this.savingSliderChoice = true
                const subrIssnls = this.journals
                    .filter(j => j.subscribed)
                    .map(j => j.issn_l)

                this.$store.commit("setSubrs", subrIssnls)
                await this.$store.dispatch("updateSubrs")
                this.$store.commit('snackbar', "Subscriptions updated!", "info")
                this.savingSliderChoice = false
            }
        },
        watch: {
            sliderPercent: function (to, from) {
            }
        },
        mounted() {
            console.log("dots mounted")
            // this.sliderPercent = 33
        }
    }
</script>

<style scoped lang="scss">
    .bar-col {
        height: 100%;
        display: flex;
        flex-direction: column;

        .bar-wrapper {
            flex: 1;
        }

        .headers {
            flex: 0;
        }
    }

    .dots-bar-wrapper {
        height: 100%;
        display: flex;
        flex-wrap: wrap;
        /*flex-wrap: wrap-reverse;*/
    }

    .bin-splitter {
        width: 100%;
    }
</style>