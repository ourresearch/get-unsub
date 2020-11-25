<template>


    <div
            @click.exact="openZoom"
            @click.ctrl="toggleCustomSubscribed"
            @click.meta="toggleCustomSubscribed"
            class="journal-dot-container">
        <v-tooltip
                bottom
                max-width="400px"
                open-delay="0"
                content-class="dot-tooltip"
                transition="fade-transition"
                :color="(isSubscribed) ? '#1e90ff' : '#333'"
                :disabled="journal.isHiddenByFilters"
        >
            <template v-slot:activator="{ on }">
                <div v-on="on">
                    <div class="journal-dot journal-dot-subscribed"
                         :class="{isNotHiddenByFilters: !journal.isHiddenByFilters}"
                         v-show="isSubscribed"
                    ></div>
                    <div class="journal-dot"
                         :class="{isNotHiddenByFilters: !journal.isHiddenByFilters}"
                         v-show="!isSubscribed"
                    ></div>
                </div>
            </template>
            <span
                    class="d-flex align-center tooltip-contents"
            >
                <div
                        v-if="!isNaN(journal.cpu)"
                        class="pr-2 mr-2 text-right cpu-section"
                        style="border-right: 1px solid #ddd;"
                >
                    <div class="">
                        <strong
                                v-if="journal.cpu !== null">
                            ${{journal.cpu | round(2)}}
                        </strong>
                    </div>
                    <div
                        style="font-size: 11px;"
                    >
                        CPU
                    </div>
                </div>

                <div>
                    <div class="journal-title mb-1 font-weight-bold" style="line-height: 1.1">{{journal.title}}</div>
                    <div class="caption" v-if="isSubscribed">
                        <v-icon dark x-small >mdi-cart</v-icon>
                        Subscribed
                    </div>
                    <div class="caption" v-if="!isSubscribed">
                        <v-icon dark x-small>mdi-cart-outline</v-icon>
                        Not subscribed
                    </div>
                </div>
            </span>
        </v-tooltip>

    </div>
</template>

<script>
    import appConfigs from "../../appConfigs";

    export default {
        name: "OverviewGraphicBarSingleDot",
        props: {
            journal: Object,
        },
        data() {
            return {
                subrColor: appConfigs.costSegments.subr.color,
                subrColorLight: appConfigs.costSegments.subr.lightColor,
                illColor: "#cccccc",
                // illColor: appConfigs.costSegments.ill.lightColor
            }
        },
        computed: {
            isSubscribed() {
                return this.journal.subscribed
            },
            myOpacity() {
                return (this.journal.isHiddenByFilters) ? 0.1 : 1
            }
        },
        methods: {
            openZoom() {
                this.$store.commit('setZoomIssnl', this.journal.issn_l)
            },
            subscribeUpToIndex() {
                console.log("subscribeUpToIndex in overview graphic", this.journal.cpuIndex)
                this.$store.dispatch("subscribeUpToIndex", this.journal.cpuIndex + 1)


                // if (this.journal.cpuIndex === 0 && this.journal.subscribed){
                //     console.log("click on the first journal. setting subr index to -1")
                //     this.$store.dispatch("subscribeUpToIndex", -1)
                // }
                // else {
                //     this.$store.dispatch("subscribeUpToIndex", this.journal.cpuIndex)
                // }
            },
            toggleCustomSubscribed() {
                console.log("custom subscribe!")
                if (this.journal.subscribed) {
                    this.$store.dispatch("unsubscribeCustom", this.journal.issn_l)
                } else {
                    this.$store.dispatch("subscribeCustom", this.journal.issn_l)
                }
            },
        }
    }
</script>

<style scoped lang="scss">
    .journal-dot-container {

    }


    .journal-dot {
        background: #aaa;
        opacity: .1;
        &.isNotHiddenByFilters {
            opacity: 1;
        }

        &.isNotHiddenByFilters:hover {
            background: darken(#aaa, 30%);
            border-top: none;
            border-left: none;
            box-shadow: 0px 0px 20px 20px rgba(255,255,255,.2);
            z-index: 4;
            position: relative;
            height: 11px;
            width: 11px;
            margin: -2px;
            border-radius: 3px;
        }

        &:hover {
        }

        cursor: pointer;

        /*height: 10px;*/
        /*width: 10px;*/
        /*border: 1px solid #fff;*/
        /*border-radius: 20px;*/

        $dot-color: dodgerblue;

        &.journal-dot-subscribed {
            background: dodgerblue;

            &:hover {
                background: darken($dot-color, 30%);
            }
        }

        height: 7px;
        width: 7px; // if you change it here you have to also change it in OverviewGraphicDots hist bar width.
        border-top: 1px solid #fff;
        border-left: 1px solid #fff;
        /*border-radius: 3px;*/

        /*border-right: 1px solid #fff;*/
        /*border-left: 1px solid #fff;*/


        &:hover {
            /*border: 1px solid #333;*/
            /*background: #999 !important;*/
        }
    }

</style>