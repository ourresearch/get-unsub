<template>
    <div class="number-and-controls text-right">
        <div class="box d-flex align-center">
            <v-btn
                    v-long-press="300"
                    :disabled="scenarioJournals.length <= 0"
                    @long-press-start="longPressStart(-1)"
                    @long-press-stop="longPressStop"
                    @click="subrIndexAdd(-1)"
                    icon
            >
                <v-icon>mdi-minus</v-icon>
            </v-btn>
            <div class="number display-2 px-2">{{scenarioJournalsAnySubr.length | round}}</div>
            <v-btn
                    v-long-press="300"
                    :disabled="subrIssnls.length > scenarioJournals.length"
                    @long-press-start="longPressStart(1)"
                    @long-press-stop="longPressStop"
                    @click="subrIndexAdd(1)"
                    icon
            >
                <v-icon>mdi-plus</v-icon>
            </v-btn>
        </div>
        <div class="label title text-center" style="line-height: 1.1;">
            Subscriptions
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
            longPressStart(direction){
                const stepSize = 5
                const that = this
                this.longPressInterval = setInterval(function(){
                    console.log("tick: longPressStart")
                    let step = stepSize * direction
                    that.subrIndexAdd(step)
                }, 0)
            }
        },
        computed: {
            ...mapGetters([
                "scenarioJournalsAnySubr",
                "subrIssnls",
                "scenarioJournals",
            ])
        }
    }
</script>

<style scoped lang="scss">
    .number-and-controls {
        .box {
            border-radius: 3px;

            /*background: #666;*/
            /*color: #fff;*/
            /*background-image: linear-gradient(#555, #444);*/



            .number {
                /*font-family: Monaco, monospace;*/
                text-align: right;
            }

            .buttons {
            }
        }
    }
</style>