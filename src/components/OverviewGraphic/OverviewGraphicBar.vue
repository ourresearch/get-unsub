<template>
    <div class="usage-area lift bar-col">

        <div class="bar-wrapper">
            <overview-graphic-bar-segment
                    v-if="type !== 'journals'"
                    v-for="segment in segmentsToPrint"
                    :key="segment.config.name"
                    :count="segment.value"
                    :count-total="segmentsRawSum"
                    :num-journals="numJournals"
                    :num-journals-subscribed="numJournalsSubscribed"
                    :config-obj="segment.config"
            />

        </div>
    </div>
</template>

<script>
    import OverviewGraphicBarSegment from "./OverviewGraphicBarSegment";
    import OverviewGraphicBarHeader from "./OverviewGraphicBarHeader";
    import OverviewGraphicBarDots from "./OverviewGraphicBarDots";
    import appConfigs from "../../appConfigs";

    export default {
        name: "OverviewGraphicBar",
        components: {
            OverviewGraphicBarDots,
            OverviewGraphicBarHeader,
            OverviewGraphicBarSegment
        },
        props: {
            type: String,
            mainNumber: String,
            secondaryNumber: String,
            segments: Array,
            numJournals: Number,
            numJournalsSubscribed: Number,
            name: String,
        },
        computed: {
            title() {
                if (this.type === 'cost') {
                    return "Cost"
                } else if (this.type === 'usage') {
                    return "Uses"
                }
            },
            secondaryLabel(){
                return (this.type === 'cost') ? "of Big Deal" : "fulfilled instantly"
            },
            segmentsRawSum() {
                if (!this.segments) return 0
                return this.segments
                    .map(s => s.value)
                    .reduce((a, b) => a + b, 0)
            },
            segmentsToPrint() {
                let config = appConfigs.barSegments[this.type]
                return this.segments.map(s => {
                    const myConfig = config[s.key]
                    return {
                        ...s,
                        config: myConfig,
                    }
                })
            },
        }
    }
</script>

<style scoped lang="scss">
    $bar-height: 450px;
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
                /*background: green;*/
                background: #555;
            }

            &.paid.instant {
                /*background: dodgerblue;*/
                background: #555;
            }

            &.delayed {
                background: #ccc;
            }
        }
    }



</style>