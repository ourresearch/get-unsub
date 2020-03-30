<template>


    <div>
        <div v-if="0" class="individual-mode d-flex">
            <div class="text-right subr-count" style="">
                <div class="headline">
                    {{ myCount | round }}
                </div>
                <div class="caption">
                    <v-tooltip bottom max-width="400" color="#333">
                        <template v-slot:activator="{ on }">
                                                            <span v-on="on">
                                                                Subscriptions
                                                                <v-icon small>mdi-information-outline</v-icon>
                                                            </span>
                        </template>
                        <div>
                            This is the percentage of content requests that your library will successfully fulfill <em>instantly</em>
                            over the next five years (either via subscription, backfile, or OA).
                        </div>
                    </v-tooltip>
                </div>
            </div>
            <div class="mode">Individual mode</div>
        </div>

        <div v-if="1" class="best-deal-mode d-flex">
            <div class="number-and-controls d-flex align-center pt-2">
                <v-btn
                        v-long-press="300"
                        :disabled="(myCount <= 0)"
                        @long-press-start="longPressStart(-1)"
                        @long-press-stop="longPressStop"
                        @click="changeMyCount(-1)"
                        x-small
                        outlined
                        icon
                >
                    <v-icon>mdi-minus</v-icon>
                </v-btn>
                <div class="input-container mx-2">
                    <v-text-field
                            v-model="myCount"
                            label="Subscriptions"
                            dense
                            hide-details
                            outlined
                            color="#333"
                    />

                </div>
                <v-btn
                        v-long-press="300"
                        :disabled="(myCount > numJournals)"
                        @long-press-start="longPressStart(1)"
                        @long-press-stop="longPressStop"
                        @click="changeMyCount(1)"
                        x-small
                        outlined
                        icon

                >
                    <v-icon>mdi-plus</v-icon>
                </v-btn>
            </div>
            <div v-if="0" class="mode">Best Deal mode</div>
        </div>
    </div>


</template>

<script>
    import LongPress from 'vue-directive-long-press'
    import {mapGetters, mapMutations, mapActions} from "vuex"

    export default {
        name: "OverviewGraphicSubrsCounter",
        directives: {
            LongPress
        },
        data() {
            return {
                longPressInterval: null,
            }
        },
        methods: {
            ...mapActions([
                "subrIndexAdd",
            ]),
            longPressStop() {
                clearInterval(this.longPressInterval)
            },
            changeMyCount(amountToChange) {
                this.myCount += amountToChange
            },
            longPressStart(direction) {
                const stepSize = 5
                const that = this
                this.longPressInterval = setInterval(function () {
                    console.log("tick: longPressStart")
                    let step = stepSize * direction
                    // that.subrIndexAdd(step)
                    that.myCount += step
                }, 0)
            }
        },
        computed: {
            ...mapGetters([
                "scenarioJournalsAnySubr",
                "subrIssnls",
                "scenarioJournals",
                "scenarioSubrsAreInCpuOrder",
            ]),
            numJournals() {
                return this.scenarioJournals.length
            },
            myCount: {
                get() {
                    return this.$store.getters.subrJournalsCount
                },
                set(val) {
                    if (val < 0) return
                    if (val > this.numJournals) return
                    this.$store.dispatch("subscribeUpToIndex", val)
                }
            }
        }
    }
</script>

<style lang="scss">
    .subr-count {
        width: 180px;
    }
    .number-and-controls {
        .input-container {
            width: 120px;
        }

        .v-input input {
            max-height: none;
        }

        .v-text-field input {
            font-size: 26px;
            text-align: right;
            font-weight: bold;
            padding-top: 4px;
            padding-bottom: 2px;
        }

    }
</style>