<template>
    <v-navigation-drawer v-if="scenario" clipped app left dark>

<!--     current summary. DISABLED for now -->
        <v-list v-if="false">
            <v-list-item>
                Cost
                <v-spacer></v-spacer>
                <strong>
                    {{summary.cost_percent | round()}}%
                </strong>

                <vc-donut
                        v-if="summary.cost_percent"
                        class="ml-2"
                        foreground="grey"
                        background="#424242"
                        :size="20"
                        :thickness="50"
                        :sections="[{value:summary.cost_percent, color: '#ffffff'}]"
                ></vc-donut>

            </v-list-item>
            <v-list-item>
                Instant access
                <v-spacer></v-spacer>
                <strong>
                    {{summary.use_instant_percent | round()}}%
                </strong>

                <vc-donut
                        v-if="summary.use_free_instant_percent"
                        class="ml-2"
                        foreground="grey"
                        background="#424242"
                        :size="20"
                        :thickness="50"
                        :sections="[{value:summary.use_free_instant_percent, color: '#50aa06'}, {value:summary.use_subscription_percent, color: 'dodgerblue'}, ]"
                ></vc-donut>

            </v-list-item>
            <v-list-item>
                Subscriptions
                <v-spacer></v-spacer>
                <strong>
                    {{summary.num_journals_subscribed | round()}}
                </strong>

                <vc-donut
                        v-if="summary.num_journals_subscribed >= 0"
                        class="ml-2"
                        foreground="grey"
                        background="#424242"
                        :size="20"
                        :thickness="50"
                        :sections="[{value: 100 * summary.num_journals_subscribed / summary.num_journals_total, color: 'dodgerblue'}]"
                ></vc-donut>

            </v-list-item>

        </v-list>


        <v-divider></v-divider>


        <v-list>
            <v-list-item-group>
                <v-list-item :to="scenarioUrl + '/overview'">
                    <v-list-item-content>
                        <v-list-item-title>Overview</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item :to="scenarioUrl + '/journals'">
                    <v-list-item-content>
                        <v-list-item-title>Journals</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item :to="scenarioUrl + '/apc'">
                    <v-list-item-content>
                        <v-list-item-title>APC costs</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-divider></v-divider>

                <v-list-item :to="scenarioUrl + '/export'">
                    <v-list-item-content>
                        <v-list-item-title>Export</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item :to="scenarioUrl + '/settings'">
                    <v-list-item-content>
                        <v-list-item-title>Settings</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item @click="$store.commit('openNotSupportedMsg')">
                    <v-list-item-content>
                        <v-list-item-title>
                            Save as copy
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

            </v-list-item-group>

        </v-list>
    </v-navigation-drawer>
</template>

<script>

    export default {
        name: "NavSidebar",
        components: {},
        data() {
            return {}
        },
        methods: {
            increment() {
            }
        },
        computed: {
            summary() {
                return this.$store.getters.summary
            },
            count() {
            },
            account() {
                return this.$store.state.user
            },
            pkg() {
                return this.$store.getters.selectedPkg
            },
            scenario() {
                return this.$store.getters.selectedScenario
            },
            scenarioUrl(){
                if (this.scenario && this.pkg){
                    return `/a/${this.pkg.id}/${this.scenario.id}`
                }
                else {
                    return ""
                }
            }
        },
        created() {
        },
        mounted() {

        },
    }
</script>

<style scoped>

</style>