<template>
    <v-dialog scrollable max-width="1100" v-model="dialogIsOpen">
        <v-card flat v-if="scenarioZoomedJournal.issn_l">

            <v-toolbar>
                <v-toolbar-title>
                    <div>
                        {{scenarioZoomedJournal.title}}
                    </div>
                    <div class="caption">
                        {{scenarioZoomedJournal.issn_l}}
                    </div>
                </v-toolbar-title>

                <v-spacer></v-spacer>
                <v-btn icon @click="dialogIsOpen = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-divider />
            <v-card-text style="color: #333;">
                <v-row>
                    <v-col cols="3">
                        <table>
                            <tr class="main-row">
                                <td class="number main-row display-1 foo">
                                    {{ scenarioZoomedJournal.subscription_minus_ill_cost | currency }}
                                </td>
                                <td class="label main-row caption">
                                    Net subscription cost
                                </td>
                            </tr>
                            <tr>
                                <td class="number title foo">
                                    {{ scenarioZoomedJournal.cost_subscription | currency }}
                                </td>
                                <td class="label caption">
                                    Subscription cost
                                </td>
                            </tr>
                            <tr>
                                <td class="number title foo">
                                    {{ scenarioZoomedJournal.cost_ill | currency }}
                                </td>
                                <td class="label caption">
                                    ILL cost
                                </td>
                            </tr>
                        </table>
                    </v-col>
                    <v-col cols="3">
                        <table>
                            <tr class="main-row">
                                <td class="number main-row display-1 foo">
                                    {{ scenarioZoomedJournal.usage | round }}
                                </td>
                                <td class="label main-row caption">
                                    Weighted overall uses
                                </td>
                            </tr>
                            <tr>
                                <td class="number title">
                                    {{ scenarioZoomedJournal.downloads | round }}
                                </td>
                                <td class="label caption">
                                    Downloads
                                </td>
                            </tr>
                            <tr>
                                <td class="number title foo">
                                    {{ scenarioZoomedJournal.citations | round }}
                                </td>
                                <td class="label caption">
                                    Citations
                                </td>
                            </tr>
                            <tr>
                                <td class="number title foo">
                                    {{ scenarioZoomedJournal.authorships | round }}
                                </td>
                                <td class="label caption">
                                    Authorships
                                </td>
                            </tr>
                        </table>
                    </v-col>
                    <v-col cols="3">
                        <table>
                            <tr class="main-row">
                                <td class="number main-row display-1 foo">
                                    {{ scenarioZoomedJournal.use_groups_free_instant.backfile + scenarioZoomedJournal.use_groups_free_instant.oa  | round }}
                                </td>
                                <td class="label main-row caption">
                                    Free-to-fulfill uses
                                </td>
                            </tr>
                            <tr>
                                <td class="number title">
                                    {{ scenarioZoomedJournal.use_groups_free_instant.backfile | round }}
                                </td>
                                <td class="label caption">
                                    Backfile uses
                                </td>
                            </tr>
                            <tr>
                                <td class="number title foo">
                                    {{ scenarioZoomedJournal.use_groups_free_instant.oa | round }}
                                </td>
                                <td class="label caption">
                                    OA uses
                                </td>
                            </tr>
                        </table>
                    </v-col>
                </v-row>


                <pre>{{scenarioZoomedJournal}}</pre>

                <div v-if="loading">loading...</div>
                <single-journal-by-year-tables :journal="journalDetail" />

            </v-card-text>






            <v-card-actions>
                <v-spacer />
                <v-btn text @click="dialogIsOpen = false">
                    Close
                </v-btn>
                <v-btn dark color="blue" @click="unsubscribe" v-if="scenarioZoomedJournal.subscribed">
                    <v-icon>mdi-cart-outline</v-icon>
                    Unsubscribe
                </v-btn>
                <v-btn dark color="blue" @click="subscribe" v-if="!scenarioZoomedJournal.subscribed">
                    <v-icon>mdi-cart</v-icon>
                    Subscribe
                </v-btn>
            </v-card-actions>

        </v-card>
    </v-dialog>
</template>

<script>
    import {api} from "../../api";
    import {mapGetters, mapActions} from 'vuex'
    import SingleJournalByYearTables from "./SingleJournalByYearTables";



    export default {
        name: 'SingleJournal',
        components: {
            SingleJournalByYearTables,
        },
        data: () => ({
            drawerRight: false,
            switch: false,
            showApi: false,
            journal: null,
            journalDetail: null,
            loading: false,
        }),
        computed: {
            ...mapGetters([
                "scenarioId",
                "scenarioZoomedJournal",
            ]),
            dialogIsOpen: {
                get() {
                    return !!this.$store.getters.zoomIssnl
                },
                set(val){
                    if (!val){
                        this.$store.commit("closeZoom")
                    }
                    else {
                        // pass
                    }
                }
            },
            summary() {
                return this.$store.getters.summary
            },
            subscribed() {
                if (this.$store.state.singleJournalData) {
                    return this.$store.state.singleJournalData.journal.subscribed
                }
            },
            issnl() {
                return this.$store.getters.zoomIssnl
            }

        },
        methods: {
            ...mapActions([
                "subscribeCustom",
                "unsubscribeCustom",
            ]),
            subscribe(){
                this.subscribeCustom(this.issnl)
                this.$store.commit("closeZoom")
            },
            unsubscribe(){
                this.unsubscribeCustom(this.issnl)
                this.$store.commit("closeZoom")
            },
            clearSingleJournal() {
                this.$store.commit('closeZoom')
                this.journal = null
            },
            async getData() {
                this.loading = true

                const url = `scenario/${this.scenarioId}/journal/${this.issnl}`
                console.log("getting journal zoom detail data", url)

                const resp = await api.get(url)
                this.journalDetail = resp.data.journal
                this.loading = false
            }
        },
        watch: {
            issnl: function (to) {
                console.log("zoom issnl has changed", this.issnl)
                if (!this.issnl) return
                this.getData()
            }
        }
    };
</script>

<style scoped lang="scss">
    table {
        width: 100%;
        td {
            line-height: 1.1 !important;
            padding: 5px;
        }
        td.number {
            text-align: right;
            padding-right: 5px;
        }
    }

</style>