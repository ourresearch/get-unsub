<template>
    <v-card flat>
        <v-card flat class="my-6 pb-12">
            <v-subheader>Export scenario data</v-subheader>
            <v-divider class="mb-4" />
            <p>
                You can export all of the data in this scenario as a CSV file. You can find <a
                    href="http://help.unsub.org/en/articles/4246610-what-are-the-columns-in-download-as-spreadsheet">documentation
                for the column names here.</a>
            </p>
            <v-btn color="primary" @click="" :href="csvUrl">
                <v-icon left>mdi-download</v-icon>
                Download
            </v-btn>
        </v-card>
        <v-card flat class="my-12">
<!--            <div class="text-h6 pt-12">API key</div>-->
            <v-subheader>Your API key</v-subheader>
            <v-divider class="mb-4" />
            <p>
                The public API doesn't need a key, but this unique key allows you to access your account data
                via the API
                as well:

            </p>
        <pre>
<code style="font-size:20px;">demo-2c2e4c80-ff84-11e9-8d71-362b9e155667</code>
                    </pre>
        </v-card>


    </v-card>
</template>

<script>
    import {mapGetters, mapMutations} from 'vuex'
    import {urlBase} from "../../api";


    export default {
        name: "ScenarioExportTab",
        components: {},
        props: {
            myRole: String,
            isConsortialFeeder: Boolean,
            publishers: Array,
        },
        data() {
            return {
                dialogs: {
                    createGroupMember: false,
                }
            }
        },
        methods: {
            ...mapMutations([
                "snackbar",
            ]),
        },
        computed: {
            ...mapGetters([
                'institutionId',
                'institutionName',
                'institutionIsDemo',
                "institutionIsConsortium",
                "institutionUsersWithRoles",
                'userConsortia',
                'userInstitutions',
            ]),
            csvUrl() {
                let scenarioId = this.$store.getters.scenarioId
                let url = `${urlBase}scenario/${scenarioId}/export.csv`; // urlBase ends with a slash
                url += "?timestamp=" + `${new Date().getTime()}`
                url += "&jwt=" + localStorage.getItem("token")
                return url

            }

        },
        created() {
        },
        mounted() {
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