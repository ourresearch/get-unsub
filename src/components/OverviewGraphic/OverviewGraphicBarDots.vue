<template>
    <div
            class="dots-graphic"
    >

        <div class="top-section d-flex">
            <overview-graphic-subrs-counter/>
            <v-spacer />
        </div>


        <div class="dots-graphic-labels d-flex align-center pb-1">
            <div class="cpu-label hist-label">
                <div class="top-line">Cost</div>
                <div class="bottom-line">per use</div>
            </div>

            <div class="journals pl-3">
                Your {{ this.journals.length | round}} Elsevier journals
            </div>


            <v-spacer />
        </div>
        <div
                class="histogram-bars"
                @mouseleave="mouseoutOfHistogram"
        >
            <div class="histogram-bar"
                 :key="'histogram-bar'+index"
                 v-if="myBin.end < maxBinValue"
                 v-for="(myBin, index) in journalBins">

                <div class="bar-label" v-if="myBin.end % 5 === 0">
                    <div class="number">
                        {{myBin.end | currency}}
                    </div>
                </div>
                <overview-graphic-bar-single-dot
                        v-for="item in myBin.journals"
                        :key="item.issnl"
                        :journal="item"
                />
                <div class="bar-filler"
                     @click="barFillerClick(myBin)"
                >
                </div>
            </div>
        </div>


    </div>
</template>

<script>
    import _ from 'lodash'
    import ClickOutside from 'vue-click-outside'
    import LongPress from 'vue-directive-long-press'


    import OverviewGraphicBarSingleDot from "./OverviewGraphicBarSingleDot";
    import OverviewGraphicBarHeader from "./OverviewGraphicBarHeader";
    import OverviewGraphicSubrsCounter from "./OverviewGraphicSubrsCounter";
    import appConfigs from "../../appConfigs";

    export default {
        name: "OverviewGraphicBarDots",
        components: {
            OverviewGraphicBarSingleDot,
            OverviewGraphicBarHeader,
            OverviewGraphicSubrsCounter,
        },
        directives: {
            ClickOutside,
            LongPress,
        },
        props: {
            journals: Array,
        },
        data() {
            return {
                illConfigs: appConfigs.costSegments.ill,
                subrConfigs: appConfigs.costSegments.subr,
                savingSliderChoice: false,
                subrColor: appConfigs.costSegments.subr.color,
                illColor: appConfigs.costSegments.ill.lightColor,
                colors: appConfigs.colors,
                maxBinValue: 200,
            }
        },
        computed: {
            myJournals() {
                return this.$store.getters.journals
            },

            journalBins() {
                const bins = []
                const binWidth = 1
                const histogramStart = -1
                const histogramEnd = 200
                for (let i = histogramStart; i <= histogramEnd; i += binWidth) {
                    bins.push({
                        start: i,
                        end: i + binWidth,
                        journals: [],
                    })
                }

                this.myJournals.forEach(myJournal => {
                    const myBin = bins.find(bin => {
                        return bin.start <= myJournal.ncppu && bin.end > myJournal.ncppu
                    })
                    if (myBin) {
                        myBin.journals.push(myJournal)
                    }
                })

                return bins

            },

            subrJournalsCount() {
                // return this.$store.getters.subrJournalsCount
                return this.journals.filter(j => j.subscribed).length
            },
            illJournalsCount() {
                // return this.$store.getters.illJournalsCount
                return this.journals.filter(j => !j.subscribed).length
            },

        },
        methods: {
            mouseoutOfHistogram() {
            },
            barFillerClick(histogramBin) {

                // disable for now.
                return

                this.$store.commit(
                    "subscribeUpToIndex",
                    histogramBin.journals[histogramBin.journals.length - 1].cpuIndex
                )
            },
            increaseMaxBinValue() {
                this.maxBinValue += 50
            }
        },
        watch: {},
        mounted() {
            console.log("dots mounted")
            this.maxBinValue = 100
        }
    }
</script>

<style scoped lang="scss">
    $dots-graphic-left-gutter: 60px;
    $histogram-bar-width: 11px;
    .dots-graphic {
        height: 100%;
        width: 100%;
        padding: 10px 20px 20px;
        border-radius: 5px;
        margin-left: 30px;

        // https://stackoverflow.com/a/4407335/226013
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Safari */
        -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none; /* Non-prefixed version, currently  supported by Chrome, Opera and Firefox */


        .top-section {
            margin: 0 0 50px $dots-graphic-left-gutter;
        }

        .dots-graphic-labels {
            line-height: 1;

            .hist-label {
                line-height: 1;
                font-size: 15px;
                flex: 0 1 $dots-graphic-left-gutter;
                align-content: center;
                text-align: right;
                border-right: 1px solid #555;
                padding-right: 10px;

                &.journals-label {
                    border-right: none;
                    flex: 0 1 7em;
                    text-align: left;

                }
            }

            .journals-subr-num {
                width: 50px;
                display: inline-block;
                text-align: right;
            }
        }

        .histogram-bars {
            padding-left: $dots-graphic-left-gutter;
            width: 100%;
            display: flex;
            align-items: stretch;
            flex-direction: column;

            .histogram-bar {
                border-left: 1px solid #555;

                &:first-child {
                    border-top: 1px solid #eee;
                }

                display: flex;
                flex-direction: row;
                flex: 0 1 $histogram-bar-width;
                position: relative;

                .bar-label {
                    position: absolute;
                    font-size: 14px;
                    top: 0;
                    left: 0;
                    width: 50px;
                    height: 20px;
                    margin-left: -60px;
                    text-align: right;

                }

                .bar-filler {
                    flex-grow: 100;
                    /*cursor: pointer;*/
                }

            }
        }
    }

</style>