<template>
    <v-dialog scrollable v-model="$store.state.scenario.zoomOpen">
        <v-card flat>

            <v-toolbar dark color="primary">
                <v-toolbar-title>{{journal && journal.top.title}}</v-toolbar-title>
                <v-progress-linear
                        :active="loading"
                        :indeterminate="loading"
                        absolute
                        bottom
                        color="green"
                ></v-progress-linear>


                <v-spacer></v-spacer>
                <v-btn icon dark @click="clearSingleJournal">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-items>
                    <!--                        <v-btn dark text @click="dialog = false">Save</v-btn>-->
                </v-toolbar-items>
            </v-toolbar>


            <v-card-text v-if="journal" class="pa-0" style="min-height: 600px; color: #333;">
                <v-tabs>
                    <v-tab>
                        Overview
                    </v-tab>
                    <v-tab>
                        Fulfillment
                    </v-tab>
                    <v-tab>
                        Open Access
                    </v-tab>
                    <v-tab>
                        Impact
                    </v-tab>
                    <v-tab>
                        Subscription cost
                    </v-tab>
                    <v-tab>
                        APC cost
                    </v-tab>
                    <v-tab>
                        API
                    </v-tab>


                    <v-tab-item>

                            <div class="top ma-4 mt-8">
                                <div class="body-2">{{ journal.top.issn_l }}</div>
                                <div class="body-2">{{ journal.top.subject }}</div>
                                <h1 class="display-1">{{journal.top.title}}</h1>
                                <v-card-text>
                                    <div class="subr-status yes body-1" v-if="journal.cost.subscribed">
                                            Currently subscribed in this scenario
                                    </div>
                                    <div class="subr-status no body-1" v-if="!journal.cost.subscribed">
                                            Currently not subscribed in this scenario
                                    </div>
                                </v-card-text>

                                <v-card-text>
                                    <div class="body-1">Average annual output: {{journal.top.num_papers}} papers</div>
                                    <div class="body-1">Average usage: {{ journal.impact.usage_total | round }} uses</div>
                                    <div class="body-1">NCPPU: {{ journal.top.ncppu }}</div>

                                </v-card-text>

                                <v-card-text>
                                    <div class="body-1">
                                        <span v-if="journal.top.is_society_journal">This journal is associated with an academic society.</span>
                                        <span v-if="!journal.top.is_society_journal">This journal is <strong>not</strong> associated with an academic society.</span>
                                    </div>
                                </v-card-text>

                                <v-card-text>
                                    <div class="body-1" v-if="journal.oa.oa_embargo_months">
                                        Delayed OA ({{journal.oa.oa_embargo_months}}mo): this
                                        journal makes
                                        back content available after an embargo of {{journal.oa.oa_embargo_months}}
                                        months.
                                    </div>
                                </v-card-text>

                                </div>
                                <!--<v-alert type="info" text>-->
                                    <!--All the figures in this dialog are for your <em>current scenario</em> as defined in your configs-->
                                    <!--and-->
                                    <!--subscriptions.-->
                                <!--</v-alert>-->
                            </div>

                            <!--                    <v-row class="pa-6">-->
                            <!--                        <v-card flat class="pa-6 mx-4" color="grey lighten-1">-->
                            <!--                            <div class="top-number">-->
                            <!--                                {{journal.impact.usage_total.toLocaleString()}}-->
                            <!--                            </div>-->
                            <!--                            <div class="bottom-number">-->
                            <!--                                Weighted usage-->
                            <!--                            </div>-->
                            <!--                        </v-card>-->

                            <!--                        <v-card flat class="pa-6" color="grey lighten-1">-->
                            <!--                            <div class="top-number">-->
                            <!--                                {{journal.top.use_instant_percent | round(2)}}%-->
                            <!--                            </div>-->
                            <!--                            <div class="bottom-number">-->
                            <!--                                Instant access (free + paid)-->
                            <!--                            </div>-->
                            <!--                        </v-card>-->
                            <!--                    </v-row>-->




                    </v-tab-item>
                    <v-tab-item>

                            <v-card class="my-4" flat>
                                <v-card-title>
                                    Fulfillment
                                </v-card-title>
                                <v-data-table
                                        :headers="journal.fulfillment.headers"
                                        :items="journal.fulfillment.data"
                                        :must-sort="true"
                                        hide-default-footer
                                        disable-sort
                                >
                                </v-data-table>
                                <v-divider></v-divider>
                                <v-card-text>
                                    Notes:
                                    <ul>
                                        <li>Backfile is only content that’s not otherwise available as oa</li>
                                        <li>ASN is only content that’s not otherwise available as oa or backfile.</li>
                                    </ul>
                                </v-card-text>

                            </v-card>
                    </v-tab-item>


                    <v-tab-item>
                            <v-card class="my-4" flat>
                                <v-card-title>
                                    <div>
                                        <div>Open Access</div>
                                        <div class="body-1" v-if="journal.oa.oa_embargo_months">
                                            <strong>Delayed OA ({{journal.oa.oa_embargo_months}}mo):</strong> this
                                            journal makes
                                            back content available after an embargo of {{journal.oa.oa_embargo_months}}
                                            months.
                                        </div>

                                    </div>
                                </v-card-title>
                                <v-data-table
                                        :headers="journal.oa.headers"
                                        :items="journal.oa.data"
                                        :must-sort="true"
                                        hide-default-footer
                                        disable-sort
                                >
                                </v-data-table>
                                <v-divider></v-divider>
                                <v-card-text>
                                    Notes:
                                    <ul>
                                        <li>green is only content that’s not otherwise available as hybrid or bronze
                                        </li>
                                    </ul>
                                </v-card-text>
                            </v-card>
                    </v-tab-item>

                    <v-tab-item>

                            <v-card class="my-4" flat>
                                <v-card-title>
                                    Impact
                                </v-card-title>
                                <v-data-table
                                        :headers="journal.impact.headers"
                                        :items="journal.impact.data"
                                        :must-sort="true"
                                        hide-default-footer
                                        disable-sort
                                >
                                </v-data-table>
                                <v-divider></v-divider>
                            </v-card>
                    </v-tab-item>

                    <v-tab-item>

                            <v-card class="my-4" flat>
                                <v-card-title>
                                    Subscription cost
                                </v-card-title>
                                <v-card-text>
                                    <span v-if="journal.cost.subscribed">You are currently subscribed to this journal.</span>
                                    <span v-if="!journal.cost.subscribed">You are currently <em>not</em> subscribed to this journal.</span>
                                </v-card-text>
                                <v-card-text>
                                    <span>NCPPU: {{ journal.top.ncppu }} </span>
                                </v-card-text>

                                <v-data-table
                                        :headers="journal.cost.headers"
                                        :items="journal.cost.data"
                                        :must-sort="true"
                                        hide-default-footer
                                >
                                </v-data-table>
                                <v-divider></v-divider>
                            </v-card>
                    </v-tab-item>

                    <v-tab-item>

                            <v-card class="my-4" flat>
                                <v-card-title>
                                    APC cost
                                </v-card-title>

                                <v-card-text class="body-1">
                                    <div>
                                        Your institution's projected annual fractional authorship in this journal
                                        (fractional
                                        authorship = <em>number of authors from your institution</em> divided by <em>total
                                        coauthors</em> for each paper): <strong>{{
                                        journal.apc.annual_projected_fractional_authorship || "none found" }}</strong>
                                    </div>
                                    <div>
                                        This journal's APC price: <strong>{{ journal.apc.apc_price || "none found"}}</strong>
                                    </div>
                                    <div>
                                        Adjusted (fractional) projected annual APC spend from authors at your
                                        institution:
                                        <strong>{{
                                            journal.apc.annual_projected_cost || "none found" }}</strong>
                                    </div>
                                </v-card-text>
                                <v-divider></v-divider>
                            </v-card>

                    </v-tab-item>
                    <v-tab-item>

                            <v-card flat>
                                <v-card-title>
                                    <v-switch
                                            color="primary"
                                            v-model="showApi"
                                    ></v-switch>
                                    API response
                                </v-card-title>
                                <v-card-text v-if="showApi">
                                    <pre>
                                        {{journal}}
                                    </pre>
                                </v-card-text>
                            </v-card>
                    </v-tab-item>






                </v-tabs>
            </v-card-text>


        </v-card>
    </v-dialog>
</template>

<script>
    import {api} from "../api";


    export default {
        name: 'SingleJournal',
        components: {},
        data: () => ({
            drawerRight: false,
            switch: false,
            showApi: false,
            journal: null,
            loading: false,
        }),
        computed: {
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
            clearSingleJournal() {
                this.$store.commit('closeZoom')
            },
            async getData() {
                if (!this.issnl) {
                    this.journal = null
                    return
                }
                this.loading = true
                // const url = "journal/issn_l/" + this.issnl

                const scenarioId = this.$store.getters.selectedScenario.id
                const url = `scenario/${scenarioId}/journal/${this.issnl}`

                const resp = await api.get(url)
                this.journal = resp.data.journal
                this.loading = false
            }
        },
        watch: {
            issnl: function (to) {
                console.log("zoom issnl has changed")
                this.getData()
            }
        }
    };
</script>

<style scoped>

</style>