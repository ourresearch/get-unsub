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
                            This is the percentage of content requests that your library will fulfill <em>instantly</em>
                            over the next five years (either via subscription, backfile, or OA).
                        </div>
                    </v-tooltip>
                </div>
            </div>
            <div class="mode">Individual mode</div>
        </div>

        <div v-if="1" class="best-deal-mode d-flex">
            <div class="number-and-controls d-flex align-center pt-2">
                <div class="input-container mx-2 d-flex align-center">
                    <v-icon color="blue" class="mr-2">mdi-cart</v-icon>
                    <v-text-field
                            v-model="myCount"
                            label="Subscriptions"
                            dense
                            hide-details
                            outlined
                            color="blue"
                    />

                </div>
                <div class="buttons">

                    <div
                            class="button top d-block"
                            v-long-press="300"
                            :disabled="(myCount > numJournals)"
                            @long-press-start="longPressStart(1)"
                            @long-press-stop="longPressStop"
                            @click="changeMyCount(1)"
                            v-ripple

                    >
                        <v-icon  dark>mdi-chevron-up</v-icon>
                    </div>
                    <div
                            class="button bottom d-block"
                            v-long-press="300"
                            :disabled="(myCount <= 0)"
                            @long-press-start="longPressStart(-1)"
                            @long-press-stop="longPressStop"
                            @click="changeMyCount(-1)"
                            v-ripple
                    >
                        <v-icon dark>mdi-chevron-down</v-icon>
                    </div>
                </div>
            </div>
            <div v-if="0" class="mode">Best Deal mode</div>
        </div>

        <v-dialog v-model="dialogs.confirmStomp" max-width="400" persistent>
            <v-card>
                <v-card-title class="headline">
                    Overwrite custom subscription?
                </v-card-title>
                <v-card-text class="pt-4">
                   <div>
                       This will overwrite your custom à la carte journals subscription(s), and automatically subscribe to the {{lastValSet}} journals with the lowest Cost Per Use. Are you sure you want to do that?
                   </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn depressed
                           @click="confirmStomp"
                           color="primary"
                    >
                        Yep, overwrite it.
                    </v-btn>
                    <v-btn depressed
                           @click="dialogs.confirmStomp = false"
                    >
                        Cancel
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>



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
                isOkToStompCustomSubrs: false,
                allowAutoSubscribed: true,
                lastValSet: null,
                dialogs: {
                    confirmStomp: false,
                }
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
            confirmStomp(){
                this.$store.commit("setAllowAutoSubscribe", true)
                this.dialogs.confirmStomp = false
                this.myCount = this.lastValSet
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
                "scenarioAllowAutosubscribe",
            ]),
            numJournals() {
                return this.scenarioJournals.length
            },
            countIsTooHigh(){

            },
            myCount: {
                get() {
                    return this.$store.getters.subrJournalsCount
                },
                set(val) {
                    this.lastValSet = val
                    if (!this.scenarioAllowAutosubscribe) {
                        this.dialogs.confirmStomp = true
                        return
                    }

                    if (val < 0) return
                    if (val > this.numJournals) return
                    this.$store.dispatch("subscribeUpToIndex", val)
                }
            }
        },

    }
</script>

<style lang="scss">
    .subr-count {
        width: 180px;
    }
    .button {
        cursor: pointer;
        background: dodgerblue;
        &:hover {
            background: darken(dodgerblue, 20%);
        }
        &.top {
            border-bottom: 1px solid #fff;
            border-radius: 5px 5px 0 0;
        }
        &.bottom {
            border-radius: 0 0 5px 5px;
        }
    }

    .number-and-controls {
        .input-container {
            width: 160px;
        }

        .v-input input {
            max-height: none;
        }
        .v-input {

        }
        .v-text-field--outlined fieldset {
            border-color: dodgerblue !important;
            border-radius: 4px;

        }

        .v-text-field input {
            color: dodgerblue;
            font-size: 30px;
            text-align: right;
            padding-top: 4px;
            padding-bottom: 2px;
        }
        .theme--light.v-label {
            color: dodgerblue;
        }

    }
</style>