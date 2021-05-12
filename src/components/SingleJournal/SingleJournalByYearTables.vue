<template>
    <div v-if="journal">


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
                    <li>PTA (Post-Termination Access) is only content that’s not otherwise available as OA.</li>
                </ul>
            </v-card-text>

        </v-card>
        <v-card class="my-4" flat>
            <v-card-title>
                <div>
                    <div>Open Access</div>
                    <div class="body-1" v-if="journal.oa.bronze_oa_embargo_months">
                        <strong>Delayed OA ({{journal.oa.bronze_oa_embargo_months}}mo):</strong> this
                        journal makes
                        back content available after an embargo of {{journal.oa.bronze_oa_embargo_months}}
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

        <v-card class="my-4" flat>
            <v-card-title>
                Subscription cost
            </v-card-title>
            <v-card-text>
                <span v-if="journal.cost.subscribed">You are currently subscribed to this journal.</span>
                <span v-if="!journal.cost.subscribed">You are currently <em>not</em> subscribed to this journal.</span>
            </v-card-text>
            <v-card-text>
                <span>cpu: {{ journal.top.cpu }} </span>
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

        <!--<v-card class="my-4" flat>-->
            <!--<v-card-title>-->
                <!--APC cost-->
            <!--</v-card-title>-->

            <!--<v-card-text class="body-1">-->
                <!--<div>-->
                    <!--Your institution's projected annual fractional authorship in this journal-->
                    <!--(fractional-->
                    <!--authorship = <em>number of authors from your institution</em> divided by <em>total-->
                    <!--coauthors</em> for each paper): <strong>{{-->
                    <!--journal.apc.annual_projected_fractional_authorship || "none found" }}</strong>-->
                <!--</div>-->
                <!--<div>-->
                    <!--This journal's APC price: <strong>{{ journal.apc.apc_price || "none found"}}</strong>-->
                <!--</div>-->
                <!--<div>-->
                    <!--Adjusted (fractional) projected annual APC spend from authors at your-->
                    <!--institution:-->
                    <!--<strong>{{-->
                        <!--journal.apc.annual_projected_cost || "none found" }}</strong>-->
                <!--</div>-->
            <!--</v-card-text>-->
            <!--<v-divider></v-divider>-->
        <!--</v-card>-->


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


    </div>
</template>

<script>
    import {api} from "../../api";
    import {mapGetters} from 'vuex'


    export default {
        name: 'SingleJournal',
        components: {},
        props: ["journal",],
        data: () => ({
            showApi: false,
        }),
        computed: {
            ...mapGetters([
                "scenarioId"
            ]),
            issnl() {
                return this.journal.issn_l
            }

        },
        methods: {},
    };
</script>

<style scoped>

</style>