<template>


    <div class="number-and-controls d-flex align-center pt-1">
        <v-btn
                v-long-press="300"
                :disabled="myCount <= 0"
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
                    :disabled="myCount > numJournals"
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
            ]),
            numJournals(){
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