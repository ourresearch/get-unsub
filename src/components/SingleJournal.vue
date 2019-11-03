<template>
    <v-dialog scrollable v-model="$store.state.singleJournalId">
        <v-card>

            <v-toolbar dark color="primary">
                <v-btn icon dark @click="clearSingleJournal">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>Single Journal</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <!--                        <v-btn dark text @click="dialog = false">Save</v-btn>-->
                </v-toolbar-items>
            </v-toolbar>


            <v-card-text style="min-height: 600px; color: #333;">

                <div class="pa-3" v-if="journal">
                    <div class="top mt-8">
                        <div class="body-2">{{ journal.top.issn_l }}</div>
                        <h1 class="display-3">{{journal.top.title}}</h1>
                        <div class="subr-status yes" v-if="journal.cost.subscribed">
                            <div class="headline">
                                Subscribed
                            </div>
                        </div>
                        <div class="subr-status yes" v-if="!journal.cost.subscribed">
                            <div class="headline">
                                Not subscribed
                            </div>
                        </div>

                        <div>Publisher: {{journal.top.publisher}}</div>
                        <div>Subject: {{journal.top.subject}}</div>
                        <div>Society journal:
                            <span v-if="journal.top.is_society_journal">yes</span>
                            <span v-if="!journal.top.is_society_journal">no</span>
                        </div>
                        <div>
                            <!--                            <div class="subr-status" v-if="sub">-->
                            <!--                                Subscribed-->
                            <!--                            </div>-->

                        </div>
                    </div>

                    <v-card class="my-4">
                        <v-card-title>
                            Fulfillment
                        </v-card-title>
                        <v-data-table
                                :headers="journal.fulfillment.headers"
                                :items="journal.fulfillment.data"
                                :must-sort="true"
                                hide-default-footer
                        >
                        </v-data-table>

                    </v-card>


                    <v-card class="my-4">
                        <v-card-title>
                            Open Access
                        </v-card-title>
                        <v-data-table
                                :headers="journal.oa.headers"
                                :items="journal.oa.data"
                                :must-sort="true"
                                hide-default-footer
                        >
                        </v-data-table>
                    </v-card>

                    <v-card class="my-4">
                        <v-card-title>
                            Impact
                        </v-card-title>
                        <v-card-text>
                            <v-alert
                                    outlined
                                    type="info"
                            >
                                Praesent venenatis metus at tortor pulvinar varius. Aenean commodo ligula eget dolor.
                                Praesent ac massa at ligula laoreet iaculis. Vestibulum ullamcorper mauris at ligula.
                            </v-alert>
                        </v-card-text>
                        <v-data-table
                                :headers="journal.impact.headers"
                                :items="journal.impact.data"
                                :must-sort="true"
                                hide-default-footer
                        >
                        </v-data-table>
                        <v-divider></v-divider>
                    </v-card>

                    <v-card class="my-4">
                        <v-card-title>
                            Subscription cost
                        </v-card-title>
                        <v-card-text>
                            <v-alert
                                    outlined
                                    type="info"
                            >
                                Praesent venenatis metus at tortor pulvinar varius. Aenean commodo ligula eget dolor.
                                Praesent ac massa at ligula laoreet iaculis. Vestibulum ullamcorper mauris at ligula.
                            </v-alert>
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

                    <v-card class="my-4">
                        <v-card-title>
                            APC cost
                        </v-card-title>
                        <v-card-text>
                            <v-alert
                                    outlined
                                    type="info"
                            >
                                Praesent venenatis metus at tortor pulvinar varius. Aenean commodo ligula eget dolor.
                                Praesent ac massa at ligula laoreet iaculis. Vestibulum ullamcorper mauris at ligula.
                            </v-alert>
                        </v-card-text>
                        <v-divider></v-divider>
                    </v-card>


                    <div>
                        <pre>
                            {{journal}}
                        </pre>
                    </div>


                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        name: 'SingleJournal',
        components: {},
        data: () => ({
            drawerRight: false,
            switch: false,
        }),
        computed: {
            summary() {
                return this.$store.getters.summary
            },
            loading() {
                return this.$store.state.tabDataLoading
            },
            singleJournalIssnl() {
                return this.$store.state.singleJournalIssnl
            },
            data() {
                return this.$store.state.singleJournalData
            },
            journal() {
                if (this.$store.state.singleJournalData) {
                    return this.$store.state.singleJournalData.journal
                }
            },
            subscribed() {
                if (this.$store.state.singleJournalData) {
                    return this.$store.state.singleJournalData.journal.subscribed
                }
            }

        },
        methods: {
            clearSingleJournal() {
                console.log("clear single journal")
                this.$store.commit('clearSingleJournal')
            },
        }
    };
</script>

<style scoped>

</style>