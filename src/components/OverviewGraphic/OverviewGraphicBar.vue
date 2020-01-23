<template>
    <div class="usage-area lift bar-col">

        <overview-graphic-bar-header
                :title="title"
                :main-number="mainNumber"
                :secondary-number="secondaryNumber"

        />
        <div class="bar-wrapper" v-if="type !== 'journals'">
            <overview-graphic-bar-segment
                    v-for="segment in segmentsToPrint"
                    :percentage="segment.percentage"
                    :count="segment.value"
                    :name="segment.displayName"
                    :is-light="segment.colorIsLight"
            />
        </div>
        <div class="dots-bar-wrapper" v-if="type === 'journals'">
            <div v-for="journal in journals"
                 :key="journal.issn_l"
                 class="journal-dot"
                 :class="{subscribed: journal.subscribed}"
            >
            </div>
        </div>
    </div>
</template>

<script>
    import OverviewGraphicBarSegment from "./OverviewGraphicBarSegment";
    import OverviewGraphicBarHeader from "./OverviewGraphicBarHeader";
    import appConfigs from "../../appConfigs";

    export default {
        name: "OverviewGraphicBar",
        components: {
            OverviewGraphicBarHeader,
            OverviewGraphicBarSegment
        },
        props: {
            type: String,
            mainNumber: String,
            secondaryNumber: String,
            segments: Array,
            journals: Array,
            name: String,
        },
        computed: {
            title() {
                if (this.type === 'cost') {
                    return "Total Cost"
                } else if (this.type === 'fulfillment') {
                    return "Instant Fulfillment"
                } else if (this.type === 'journals') {
                    return "Subscribed Journals"
                }
            },
            segmentsRawSum() {
                if (!this.segments) return 0
                return this.segments
                    .map(s => s.value)
                    .reduce((a, b) => a + b, 0)
            },
            segmentsToPrint() {
                let config
                if (this.type === 'journals') return []
                else if (this.type === "cost") config = appConfigs.costSegments
                else if (this.type === "fulfillment") config = appConfigs.usageSegments

                return this.segments.map(s => {
                    const myConfig = config[s.key]
                    return {
                        ...s,
                        ...myConfig,
                        percentage: s.value * 100 / this.segmentsRawSum
                    }
                })
            },
            mainNumberFormat() {
                if (this.type === 'journal') return "number"
                return "percent"
            },
            secondaryNumberFormat() {
                if (this.type === 'journal') return "none"
                if (this.type === 'cost') return "currency"
                if (this.type === 'fulfillment') return "number"

            }
        }
    }
</script>

<style scoped lang="scss">
    $bar-height: 400px;
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


    .dots-bar-wrapper {
        height: $bar-height;
        display: block;
        display: flex;
        flex-wrap: wrap-reverse;
    }

    .journal-dot {
        background: #ccc;
        height: 5px;
        width: 5px;
        border-radius: 5px;
        margin: 1px 3px 0 0;
        line-height: .1;
        display: block;

        &.subscribed {
            background: dodgerblue;
        }
    }

</style>