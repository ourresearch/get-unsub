<template>


    <v-container fluid>
        <v-card class="pa-3" v-if="showMe" fluid>
            <h2 class="display-1">Export scenario</h2>
            <v-divider></v-divider>
            <v-card flat>
                <v-card-title>
                    Export as CSV
                </v-card-title>
                <v-card-text>
                    Download a list of your subscriptions as a CSV file that can be opened in Excel or Google
                    Spreadsheets.
                </v-card-text>
                <v-card-actions>
                    <v-btn color="primary"
                           flat
                           depressed
                           href="https://unpaywall-jump-api.herokuapp.com/scenario/export.csv">
                        Download CSV
                    </v-btn>
                </v-card-actions>
            </v-card>

            <v-divider></v-divider>
            <v-card flat>
                <v-card-title>
                    API key
                </v-card-title>
                <v-card-text>
                    The public API doesn't need a key, but this unique key allows you to access your account data via the API
                    as well.
                </v-card-text>
                <v-card-actions>
                    <code class="headline">demo-2c2e4c80-ff84-11e9-8d71-362b9e155667

</code>
                </v-card-actions>
            </v-card>
            <v-divider></v-divider>
            <v-card flat>
                <v-card-title>
                    Public summary page
                </v-card-title>
                <v-card-text>
                    If you enable this page, you can share this scenario at a public URL. This can be useful for sharing  projections with administrators and faculty.
                </v-card-text>
                <v-card-actions>
                    <div>
                        <v-switch
                                color="primary"
                                v-model="pageEnabled"
                                label="Enable public summary page"
                        ></v-switch>
                        <v-card flat
                                outlined
                                v-if="pageEnabled">
                            <v-toolbar color="primary" dark flat>Public report page</v-toolbar>
                            <v-card-text>
                                <v-switch
                                        color="primary"
                                        :disabled="!pageEnabled"
                                        label="Fuzz numbers (round all statistics instead of reporting exact figures)"
                                ></v-switch>
                                <v-switch
                                        color="primary"
                                        :disabled="!pageEnabled"
                                        label="Include price data"
                                ></v-switch>
                                <v-switch
                                        color="primary"
                                        :disabled="!pageEnabled"
                                        label="Include journal-by-journal data along with summary"
                                ></v-switch>

                            </v-card-text>
                            <v-card-actions>
                                <v-btn @click="$store.commit('openNotSupportedMsg')" flat color="primary">
                                    Generate custom URL
                                </v-btn>
                            </v-card-actions>

                        </v-card>

                    </div>

                </v-card-actions>
            </v-card>


        </v-card>


    </v-container>
</template>

<script>
    export default {
        props: [],

        name: "SharingTab",
        data() {
            return {
                pageEnabled: false
            }
        },
        computed: {
            showMe() {
                return this.$store.state.tabData && this.$store.state.tabData.key === "report"
            },
        }
    }
</script>

<style scoped>

</style>