<template>
    <v-tooltip
            max-width="400"
            close-delay="0"
            right
            :color="configObj.color.normal"
    >
        <template v-slot:activator="{ on, attrs }">
            <div class="bar-segment"
                 v-on="on"
                 v-bind="attrs"
                 :class="{light: configObj.isLeftover}"
                 :style="{height: percentage+'%', background: configObj.color.normal, color: textColor}">

                <span class="segment-label d-flex px-2"  v-if="percentage > 5">
                    <span>
                        {{configObj.displayName}}
                    </span>
                    <v-spacer />

                    <span class="bar-value" :id="`bar-value-${configObj.name}`">
                        <template v-if="!configObj.isCurrency">{{percentage | round}}%</template>
                        <template v-if="configObj.isCurrency">{{count | currency(publisherCurrencySymbol)}}</template>
                    </span>
                </span>

            </div>
        </template>
        <div class="pa-3 pt-1" v-if="configObj.segmentType==='cost'">
            <div class="d-flex subtitle-1 align-center">
                <span class="name font-weight-bold">
                    {{configObj.displayNameLong}}
                </span>
                <v-spacer />
                <span class="number pl-3">
                    {{count | currency(publisherCurrencySymbol)}}
                </span>
            </div>
            <v-divider class="my-2" dark />

            <span v-if="configObj.name=='costSavings'">
                Your annual savings over the next five years,
            </span>
            <span v-if="configObj.name=='costSubr'">
                Your subscription spend over the next five years,
            </span>
            <span v-if="configObj.name=='costIll'">
                Your ILL spend over the next five years,
            </span>

            given your current model parameters and subscriptions cart.
        </div>


        <div class="pa-3 pt-1" v-if="configObj.segmentType==='usage'">
            <div class="d-flex subtitle-1 align-center">
                <span class="name font-weight-bold">
                    {{configObj.displayNameLong}}
                </span>
                <v-spacer />
                <span class="number pl-3">
                    {{percentage | round}}%
                </span>
            </div>
            <v-divider class="my-2"  dark />

            Percentage of usage that
            <span v-if="configObj.name=='usageDelayed'">
                 can't be fulfilled by any free source or subscription, and will generate an ILL request
            </span>
            <span v-if="configObj.name=='usageSubr'">
                can't be fulfilled by any free source, but can be fulfilled by one of your title-by-title subscriptions
            </span>
            <span v-if="configObj.name=='usageBackfile'">
                can't be fulfilled by Open Access, but can be fulfilled by your PTA content
            </span>
            <span v-if="configObj.name=='usageOa'">
                can be fulfilled by online Open Access
            </span>

            (given your current model parameters and subscriptions cart).
        </div>

    </v-tooltip>
</template>

<script>
    import colorHighlightedPhrase from "../colorHighlightedPhrase";
    import {mapGetters, mapMutations} from 'vuex'

    export default {
        components: {
            colorHighlightedPhrase,
        },
        name: "OverviewGraphicBarSegment",
        props: {
            count: Number,
            countTotal: Number,

            // from the config
            configObj: Object,

            numJournals: Number,
            numJournalsSubscribed: Number,
        },
        data() {
            return {
            }
        },
        computed: {
            ...mapGetters([
                'publisherCurrencySymbol',
            ]),
            percentage() {
                return 100 * this.count / this.countTotal
            },
            height() {
                return Math.max(this.percentage, 5)
            },
            textColor(){
                return (this.configObj.isLeftover) ? "#000" : "#fff"
            },
            subrColor(){
                return appConfigs.colors.subr.nomal
            },
            settings() {
                return this.$store.getters.configs
            },
        }
    }
</script>

<style scoped lang="scss">
    .bar-segment {
        padding-left: 3px;
        /*border-top: 1px solid rgba(255, 255, 255, 0.2);*/
        border-top: 1px solid #fff;
        font-size: 13px;
        color: #333;
        /*opacity: .9;*/
        &.light {
            opacity: .8;
        }
        span {
            cursor: default;
        }

        &:hover {
            /*background: #333 !important;*/
            /*color: #fff !important;*/
            /*opacity: 1;*/
        }
    }
</style>