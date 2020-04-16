<template>
    <div
            class="dots-graphic"
    >

        <div
                class="histogram-bars"
        >
            <div class="histogram-bar"
                 :key="'histogram-bar'+index"
                 v-for="(myBin, index) in journalBins">

                <div class="bar-label" v-if="myBin.end % 10 === 0">
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
                >
                </div>
            </div>
        </div>




        <div class="x-axis-label text-center">
            {{ publisherName }} journals, by cost per use
        </div>


        <v-card flat class="mt-5" v-show="journalsWithCpuOutsideBins.length">
            <div class="">
                <span class="body-">{{journalsWithCpuOutsideBins.length}}</span> Journals with CPU > {{maxBinValue | currency}}
            </div>
            <div class="d-flex flex-wrap">
                <overview-graphic-bar-single-dot
                            v-for="item in journalsWithCpuOutsideBins"
                            :key="item.issnl"
                            :journal="item"
                    />
            </div>
        </v-card>

        <v-card flat class="mt-5" v-show="journalsWithNoUsage.length">
            <div class="">
                <span class="body-">{{journalsWithNoUsage.length}}</span> Journals with no usage
            </div>
            <div class="d-flex flex-wrap">
                <overview-graphic-bar-single-dot
                            v-for="item in journalsWithNoUsage"
                            :key="item.issnl"
                            :journal="item"
                    />
            </div>
        </v-card>




    </div>
</template>

<script>
    import _ from 'lodash'
    import ClickOutside from 'vue-click-outside'
    import LongPress from 'vue-directive-long-press'
    import {mapGetters, mapMutations} from 'vuex'



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
                maxBinValue: 100,

            }
        },
        computed: {
            ...mapGetters([
                'publisherName',
            ]),
            myJournals() {
                return this.$store.getters.journals
            },

            journalBins() {
                const bins = []
                const binWidth = 1
                const histogramStart = -1
                const histogramEnd = this.maxBinValue
                for (let i = histogramStart; i <= histogramEnd; i += binWidth) {
                    bins.push({
                        start: i,
                        end: i + binWidth,
                        journals: [],
                    })
                }

                this.journals.forEach(myJournal => {
                    const myBin = bins.find(bin => {
                        return bin.start <= myJournal.ncppu && bin.end > myJournal.ncppu
                    })
                    if (myBin) {
                        myBin.journals.push(myJournal)
                    }
                })

                return bins

            },
            journalsWithCpuOutsideBins(){
                return this.journals.filter(j => j.ncppu > this.maxBinValue)
            },
            journalsWithNoUsage(){
                return this.journals.filter(j => isNaN(j.ncppu) )
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
        }
    }
</script>

<style scoped lang="scss">
    $histogram-bar-width: 7px;
    .dots-graphic {
        // https://stackoverflow.com/a/4407335/226013
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Safari */
        -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none; /* Non-prefixed version, currently  supported by Chrome, Opera and Firefox */


        .top-section {
        }


        .histogram-bars {
            width: 100%;
            display: flex;
            align-items: stretch;
            flex-direction: row;
            border-bottom: 1px solid #555;
            padding-bottom: 2px;
            margin-bottom: 20px;

            .histogram-bar {
                /*border-left: 1px solid #555;*/

                /*&:first-child {*/
                /*    border-top: 1px solid #eee;*/
                /*}*/

                display: flex;
                flex-direction: column-reverse;
                position: relative;
                width: 7px; // if you change it here you have to also change it in OverviewGraphicSingleDot dot width.

                .bar-label {
                    position: absolute;
                    font-size: 12px;
                    bottom: 0;
                    left: 0;
                    /*width: 50px;*/
                    height: 20px;
                    margin-left: 0;
                    margin-bottom: -25px;
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