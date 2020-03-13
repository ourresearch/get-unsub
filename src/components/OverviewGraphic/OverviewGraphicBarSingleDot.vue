<template>
    <div
            @click.shift.stop="subscribeUpToIndex"
            @click.exact="openZoom"
            @click.ctrl="toggleCustomSubscribed"
            @click.meta="toggleCustomSubscribed"
            class="journal-dot-container">
        <v-tooltip
                bottom
                max-width="200px"
                open-delay="500"
                content-class="dot-tooltip"
        >
            <template v-slot:activator="{ on }">
                <div v-on="on">
                    <div class="journal-dot"
                         v-if="isSubscribed"
                         :style="{background: '#777'}"
                    ></div>
                    <div class="journal-dot"
                         v-if="!isSubscribed"
                         :style="{background: '#ccc'}"
                    ></div>
                </div>
            </template>
            <span
                    style="line-height: 1.1"
                    class="d-flex align-center tooltip-contents"
            >
                <div
                        class="pr-2 mr-2 text-right cpu-section"
                        :style="{color: subrColorLight}"
                        style="border-right: 1px solid #ddd;"
                >
                    <div
                            class="caption"
                    >
                        CPU
                    </div>
                    <div class="">
                        <strong
                                :style="{color: subrColorLight}"
                                v-if="journal.ncppu !== null">
                            ${{journal.ncppu | round(2)}}
                        </strong>
                    </div>
                </div>

                <div>
                    <span class="journal-title">{{journal.title}}</span>
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
        },
        methods: {
            openZoom(){
                this.$store.commit('setZoomIssnl', this.journal.issn_l)
            },
            subscribeUpToIndex(){
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
            toggleCustomSubscribed(){
                console.log("custom subscribe!")
                if (this.journal.customSubscribed){
                    this.$store.dispatch("unsubscribeCustom", this.journal.issn_l)
                }
                else {
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
        background: #ccc;
        cursor: pointer;

        /*height: 10px;*/
        /*width: 10px;*/
        /*border: 1px solid #fff;*/
        /*border-radius: 20px;*/

        height: 11px;
        width: 11px;
        border-top: 1px solid #fff;
        border-left: 1px solid #fff;
        border-radius: 3px;

        /*border-right: 1px solid #fff;*/
        /*border-left: 1px solid #fff;*/


        &:hover {
            /*border: 1px solid #333;*/
            /*background: #999 !important;*/
        }
    }

</style>