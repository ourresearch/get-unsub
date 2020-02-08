<template>
    <v-container class="pkg" v-if="pkg">


        <h1 class="display-3 py-6">{{ pkg.name }}</h1>
        <v-card outlined>
            <v-card-title>Your Scenarios</v-card-title>
            <v-card-text>
                <v-simple-table class="mb-12 pb-12">
                    <thead>
                    <tr>
                        <th class="text-left"></th>
                        <th class="text-left">Name</th>
                        <!--<th class="text-left">Toll-access journals</th>-->
                        <!--<th class="text-left">Subscribed journals</th>-->
                        <!--<th class="text-left">Cost</th>-->
                        <!--<th class="text-left">Instant access</th>-->
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="scenario in pkg.scenarios"
                        :key="scenario.id"
                        @click="$router.push(`/a/${pkg.id}/${scenario.id}`)"
                        style="cursor:pointer;">
                        <td>
                            <v-btn icon text @click.stop="$store.commit('openNotSupportedMsg')">
                                <v-icon>mdi-content-copy</v-icon>
                            </v-btn>
                            <v-btn icon text @click.stop="$store.commit('openNotSupportedMsg')">
                                <v-icon>mdi-delete</v-icon>
                            </v-btn>
                        </td>
                        <td>{{ scenario.name }}</td>
                        <!--<td>{{ pkg.numJournals }}</td>-->
                        <!--<td>{{ scenario.subrs.length }}</td>-->
                        <!--<td>-->
                            <!--{{ scenario.summary.cost_scenario | currency }}-->
                            <!--({{ scenario.summary.cost_percent | round(0) }}%)-->
                        <!--</td>-->
                        <!--<td>{{ scenario.summary.use_instant_percent | round(0) }}%</td>-->
                    </tr>
                    </tbody>
                </v-simple-table>
            </v-card-text>
            <v-card-actions>
                <v-btn @click="$store.commit('openNotSupportedMsg')" depressed>Add new Scenario</v-btn>
            </v-card-actions>
        </v-card>
        <v-row>
            <v-col cols="5">
                <v-card>
                    <v-card-title>
                        COUNTER stats
                    </v-card-title>
                    <v-card-text v-if="pkg.hasCounterData">
                        <v-alert colored-border border="left" type="success">
                            <div v-if="pkg.hasCoreJournalList">
                                    Your core journal list included included:
                                <ul>
                                    <li>{{ pkg.journal_detail.diff_counts.diff_not_in_counter }} journals not in your COUNTER file</li>
                                    <li>{{ pkg.journal_detail.diff_counts.diff_not_published_in_2019 }} discontinued journals</li>
                                    <li>{{ pkg.journal_detail.diff_counts.diff_changed_publisher }} journals now with a new publisher </li>
                                    <li>{{ pkg.journal_detail.diff_counts.diff_no_price }} journals without an available ala carte price </li>
                                </ul>
                                The subscription analysis in this package focuses on the remaining <strong>{{ pkg.journal_detail.counts.in_scenario }}</strong> journals.
                            </div>
                            <div v-if="!pkg.hasCoreJournalList">
                                    Your COUNTER file included:
                                <ul>
                                    <li>{{ pkg.journal_detail.diff_counts.diff_open_access_journals }} fully open access journals</li>
                                    <li>{{ pkg.journal_detail.diff_counts.diff_not_published_in_2019 }} discontinued journals</li>
                                    <li>{{ pkg.journal_detail.diff_counts.diff_changed_publisher }} journals now with a new publisher </li>
                                    <li>{{ pkg.journal_detail.diff_counts.diff_no_price }} journals without an available ala carte price </li>
                                </ul>
                                The subscription analysis in this package focuses on the remaining <strong>{{ pkg.journal_detail.counts.in_scenario }}</strong> journals.
                            </div>
                        </v-alert>
                    </v-card-text>
                    <v-card-actions v-if="!pkg.hasCounterData">
                        <v-btn depressed @click="$store.commit('openNotSupportedMsg')">upload counter</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
            <v-col cols="4">
                <v-card>
                    <v-card-title>
                        Perpetual access
                    </v-card-title>
                    <v-card-text>
                        <v-alert colored-border border="left" type="info" v-if="!pkg.hasCustomPerpetualAccess">
                            You haven't yet uploaded specific perpetual access details, so our initial
                            calculations will assume you have perpetual access to all your existing backfile content.
                            You can alter this assumption in the Settings.
                        </v-alert>
                        <v-alert colored-border border="left" type="success" v-if="pkg.hasCustomPerpetualAccess">
                            We are using your custom perpetual access list.
                        </v-alert>
                    </v-card-text>
                    <v-card-actions v-if="!pkg.hasCustomPerpetualAccess">
                        <v-btn depressed @click="$store.commit('openNotSupportedMsg')">Upload perpetual access file</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
            <v-col cols="3">
                <v-card>
                    <v-card-title>
                        Custom pricelists
                    </v-card-title>
                    <v-card-text>
                        <v-alert colored-border border="left" type="info" v-if="!pkg.hasCustomPrices">
                            If you haven't uploaded any custom per-journal prices we'll use the public list price for each title.
                        </v-alert>
                        <v-alert colored-border border="left" type="success" v-if="pkg.hasCustomPrices">
                            We are using your custom price list.
                        </v-alert>
                    </v-card-text>
                    <v-card-actions v-on: v-if="!pkg.hasCustomPrices">
                        <v-btn depressed @click="$store.commit('openNotSupportedMsg')">Upload custom prices</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>

    </v-container>
</template>

<script>

    export default {
        name: "Pkg",
        components: {},
        data() {
            return {
            }
        },
        methods: {
            increment() {
            }
        },
        computed: {
            count() {
            },
            account() {
                return this.$store.state.user
            },
            pkg(){
                return this.$store.getters.selectedPkg
            }
        },
        created(){
        },
        mounted() {
            console.log("pkg: mount up", this.$route.params)
            this.$store.commit("clearSelectedScenario")
            this.$store.dispatch("fetchPkg", this.$route.params.pkgId)

        },
    }
</script>

<style scoped>

</style>