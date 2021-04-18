<template>
    <div class="d-flex" style="width: 100%;">
        <v-tabs class="ml-1" v-model="currentTab">
            <v-tab class="low-key-button">5yr forecast</v-tab>
            <v-tab class="low-key-button">Parameters</v-tab>
            <v-tab class="low-key-button">Export</v-tab>
            <v-tab class="low-key-button" v-if="institutionIsConsortium">Member Institutions</v-tab>
            <v-spacer />
        <div class="d-flex align-center black--text">
            <div class="mx-3 black--text">
                {{myCost | currency}}
            </div>
            <div class="mx-3">
                {{ myInstantUsagePercent | percent}}
            </div>
            <div class="mx-3">
                {{ subrJournalsCount }}
            </div>
        </div>
        </v-tabs>
    </div>
</template>

<script>
    import {mapGetters, mapMutations} from 'vuex'
    import {costTotal, instantUsagePercent} from "../../shared/scenarioSummary";

    export default {
        name: "AppBarExtScenarioNew",
        components: {},
        data() {
            return {
                foo: 42,
            }
        },
        methods: {},
        computed: {
            ...mapGetters([
                "userEmail",
                "institutionIsConsortium",
                "scenarioJournals",
                "subrJournalsCount",
            ]),
            currentTab: {
                get() {
                    console.log("get currentTab")
                    return this.$store.getters.scenarioTabShowing
                },
                set(newVal) {
                    this.$store.commit("setScenarioTabShowing", newVal)
                }
            },
            myCost() {
                return costTotal(this.scenarioJournals)
            },
            myInstantUsagePercent(){
                return instantUsagePercent(this.scenarioJournals)
            }
        },
        created() {
            this.currentTab = 0
        },
        watch: {
            "foo": {
                immediate: true,
                handler: function (to, from) {
                }
            }
        }
    }
</script>

<style lang="scss">


</style>