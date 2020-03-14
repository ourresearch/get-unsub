<template>
    <v-container class="pkg" v-if="pkg">

        <!--        <h1 class="display-3 py-6">{{ pkg.name }}</h1>-->
        <v-row class="fill-height">
            <v-col cols="6">
                <h2 class="display-1 my-2">Your dashboards</h2>
                <v-card outlined class="mb-2">
                    <v-card-title>
                        <div>
                            <div class="body-2">"Read" dashboard</div>
                            <div class="headline">Your subscription scenarios</div>
                        </div>
                    </v-card-title>
                    <v-list class="pb-8">
                        <v-list-item
                                two-line
                                v-for="scenario in pkg.scenarios"
                                :key="scenario.id"
                                @click="$router.push(`/a/${pkg.id}/${scenario.id}`)"
                        >
                            <v-list-item-content>
                                <v-list-item-title class="title" v-text="scenario.name" />
                                <v-list-item-subtitle>
                                    <strong>{{ scenario.saved.subrs.length }}</strong> à la carte journal subscriptions
                                </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <div>
                                    <v-btn icon text @click.stop="$store.commit('openNotSupportedMsg')">
                                        <v-icon>mdi-content-copy</v-icon>
                                    </v-btn>
                                    <v-btn icon text @click.stop="openRenameDialog(scenario)">
                                        <v-icon>mdi-pencil</v-icon>
                                    </v-btn>

                                    <v-btn icon text @click.stop="$store.commit('openNotSupportedMsg')">
                                        <v-icon>mdi-delete</v-icon>
                                    </v-btn>
                                </div>
                            </v-list-item-action>
                        </v-list-item>

                    </v-list>
                </v-card>
                <v-card outlined>
                    <v-card-title>
                        <div>
                            <div class="body-2">"Publish" dashboard</div>
                            <div class="headline">Your APC costs</div>
                        </div>
                    </v-card-title>
                    <v-card-text>
                        <v-btn large outlined :to="'/a/' + pkgId + '/apc'">
                            View your APC costs
                        </v-btn>
                    </v-card-text>
                </v-card>

            </v-col>

            <v-col cols="6">
                <h2 class="display-1 my-2">Your data</h2>
                <v-card outlined class="mb-2">
                    <v-card-title>
                        <div>
                            <div class="body-2">Required</div>
                            <div class="headline">Your COUNTER JR1</div>
                        </div>
                        <v-spacer/>
                        <div>
                            <div class="green--text">
                                <v-icon color="green">mdi-checkbox-marked</v-icon>
                                Uploaded!
                            </div>
                        </div>
                    </v-card-title>
                    <v-card-text class="details">
                        <div v-if="pkg.hasCoreJournalList">
                            Your core journal list has been uploaded. It included:
                            <ul>
                                <li>{{ pkg.journal_detail.diff_counts.diff_not_in_counter }} journals not in
                                    your COUNTER file
                                </li>
                                <li>{{ pkg.journal_detail.diff_counts.diff_not_published_in_2019 }} discontinued
                                    journals
                                </li>
                                <li>{{ pkg.journal_detail.diff_counts.diff_changed_publisher }} journals now
                                    with a new publisher
                                </li>
                                <li>{{ pkg.journal_detail.diff_counts.diff_no_price }} journals without an
                                    available ala carte price
                                </li>
                            </ul>
                            The subscription analysis in this package focuses on the remaining <strong>{{
                            pkg.journal_detail.counts.in_scenario }}</strong> journals.
                        </div>
                        <div v-if="!pkg.hasCoreJournalList">
                            Your COUNTER file has been uploaded. It includes:
                            <ul>
                                <li>{{ pkg.journal_detail.diff_counts.diff_open_access_journals }} fully open
                                    access journals
                                </li>
                                <li>{{ pkg.journal_detail.diff_counts.diff_not_published_in_2019 }} discontinued
                                    journals
                                </li>
                                <li>{{ pkg.journal_detail.diff_counts.diff_changed_publisher }} journals now
                                    with a new publisher
                                </li>
                                <li>{{ pkg.journal_detail.diff_counts.diff_no_price }} journals without an
                                    available ala carte price
                                </li>
                            </ul>
                            The subscription analysis in this package focuses on the remaining <strong>{{
                            pkg.journal_detail.counts.in_scenario }}</strong> journals.
                        </div>
                    </v-card-text>


                </v-card>


                <v-card outlined class="mb-2">
                    <v-card-title>
                        <div>
                            <div class="body-2">Optional</div>
                            <div class="headline">Custom journal prices</div>
                        </div>
                        <v-spacer/>
                        <div>
                            <div class="green--text">
                                <v-btn
                                        v-if="!pkg.hasCustomPrices"
                                        text
                                        @click="$store.commit('openNotSupportedMsg')"
                                >
                                    <v-icon>mdi-upload</v-icon>
                                    Upload
                                </v-btn>
                                <div class="green--text" v-if="pkg.hasCustomPrices">
                                    <v-icon color="green">mdi-checkbox-marked</v-icon>
                                    Uploaded!
                                </div>
                            </div>
                        </div>
                    </v-card-title>
                    <v-card-text class="details" v-if="!pkg.hasCustomPrices">
                        We are using the <em>public list price</em> for each a la carte journal. If you have custom
                        prices from your {{pkg.name}} rep, you can upload them as a spreadsheet and we'll use them
                        instead.
                    </v-card-text>
                    <v-card-text class="details" v-if="pkg.hasCustomPrices">
                        We are using your custom uploaded price list.
                    </v-card-text>
                </v-card>

                <v-card outlined class="mb-2">
                    <v-card-title>
                        <div>
                            <div class="body-2">Optional</div>
                            <div class="headline">Perpetual access dates</div>
                        </div>
                        <v-spacer/>
                        <div>
                            <div class="green--text">
                                <v-btn
                                        v-if="!pkg.hasCustomPerpetualAccess"
                                        text
                                        @click="$store.commit('openNotSupportedMsg')"
                                >
                                    <v-icon>mdi-upload</v-icon>
                                    Upload
                                </v-btn>
                                <div class="green--text" v-if="pkg.hasCustomPerpetualAccess">
                                    <v-icon color="green">mdi-checkbox-marked</v-icon>
                                    Uploaded!
                                </div>
                            </div>
                        </div>
                    </v-card-title>
                    <v-card-text class="details" v-if="!pkg.hasCustomPerpetualAccess">
                        We are assuming <em>full perpetual access</em> for the last 10 years of each journal's backfile. If there are some date ranges for some journals where you <em>don't</em> have perpetual access, you can upload them as a spreadsheet and we'll use them instead.
                    </v-card-text>
                    <v-card-text class="details" v-if="pkg.hasCustomPerpetualAccess">
                        We are using your custom uploaded perpetual access dates for each journal.
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <scenario-edit-dialogs />
    </v-container>
</template>

<script>
    import {mapGetters, mapMutations} from 'vuex'
    import ScenarioEditDialogs from "../components/ScenarioEditDialogs/ScenarioEditDialogs";

    export default {
        name: "Pkg",
        components: {
            ScenarioEditDialogs,
        },
        data() {
            return {}
        },
        methods: {
            ...mapMutations([
                "openCopyDialog",
                "openRenameDialog",
                "openDeleteDialog",
            ]),
            increment() {
            }
        },
        computed: {
            ...mapGetters([
                "pkgName",
                "pkgId",
            ]),
            count() {
            },
            account() {
                return this.$store.state.user
            },
            pkg() {
                return this.$store.getters.selectedPkg
            }
        },
        created() {
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