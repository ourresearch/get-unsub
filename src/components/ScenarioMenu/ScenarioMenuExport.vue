<template>
    <div>
        <v-menu offset-y>
            <template v-slot:activator="{ on }">
                <v-btn
                        text
                        class="text-capitalize"
                        v-on="on"
                >
                    Export
                </v-btn>
            </template>
            <v-list dense>
                <v-list-item @click="" :href="csvUrl">
                    <v-list-item-icon class="mr-2">
                        <v-icon>mdi-download</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title class="font-weight-regular">
                        Download as spreadsheet
                    </v-list-item-title>
                </v-list-item>

                <v-list-item @click="showApiKeyDialog=true">
                    <v-list-item-icon class="mr-2">
                        <v-icon>mdi-api</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title class="font-weight-regular">
                        Your API key
                    </v-list-item-title>
                </v-list-item>
                <v-list-item @click="showPublicWebsiteDialog=true">
                    <v-list-item-icon class="mr-2">
                        <v-icon>mdi-earth</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title class="font-weight-regular">
                        Public summary webpage
                    </v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>


        <v-dialog v-model="showApiKeyDialog" max-width="600">
            <v-card flat class="pb-4">
                <v-toolbar dark flat color="primary">
                    <v-toolbar-title>
                        <v-icon>mdi-settings-outline</v-icon>
                        Your API key
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon text @click="showApiKeyDialog=false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text class="pt-4">
                    <p>
                        The public API doesn't need a key, but this unique key allows you to access your account data
                        via the API
                        as well:

                    </p>
                    <pre>
<code style="font-size:20px;">demo-2c2e4c80-ff84-11e9-8d71-362b9e155667</code>
                    </pre>
                </v-card-text>
                <v-card-actions>
                    <v-btn @click="showApiKeyDialog=false" depressed color="primary">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>


        <v-dialog v-model="showPublicWebsiteDialog" max-width="600">
            <v-card flat class="pb-4">
                <v-toolbar dark flat color="primary">
                    <v-toolbar-title>
                        <v-icon>mdi-earth</v-icon>
                        Public summary webpage
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon text @click="showPublicWebsiteDialog=false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text class="pt-4">
                    <p>
                        If you enable this page, you can share this scenario at a public URL. This can be useful for sharing your forecasts with administrators and faculty.
                    </p>

<div>
                        <v-switch
                                color="primary"
                                v-model="pageEnabled"
                                label="Enable public summary page"
                        />

                    <v-alert text type="info" v-if="pageEnabled">
                        <div>
                            Sorry, this feature is still under construction. When it's done, here's where you'll be able to customize this scenario's public-facing website, including to:
                        </div>
                        <ul>
                            <li>
                                Report exact statistics or round numbers,
                            </li>
                            <li>
                                Include or exclude price data, and
                            </li>
                            <li>
                                Include or exclude journal-level data, as opposed to just the overall summary.
                            </li>
                        </ul>
                    </v-alert>
</div>

                </v-card-text>
                <v-card-actions>
                    <v-btn @click="showPublicWebsiteDialog=false" depressed color="primary">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>


    </div>
</template>

<script>
    import appConfigs from "../../appConfigs";
    import {urlBase} from "../../api";

    export default {
        name: "ScenarioMenuExport",
        data() {
            return {
                showPublicWebsiteDialog: false,
                showApiKeyDialog: false,
                pageEnabled: false,
            }
        },
        computed: {
            csvUrl() {
                let scenarioId = this.$store.getters.scenarioId
                let url = `${urlBase}scenario/${scenarioId}/export.csv`; // urlBase ends with a slash
                url += "?timestamp=" + `${new Date().getTime()}`
                url += "&jwt=" + localStorage.getItem("token")
                return url

            }
        }
    }
</script>

<style scoped>

</style>