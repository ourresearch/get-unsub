<template>
    <span v-if="rows.length">
        <span v-if="!successJournals">
            <a @click="open">
                {{rows.length}}
            </a>
             {{label}}
        </span>
        <div v-if="successJournals" class="text-right" @click="open">
            <a class="title">
                {{ rows.length }}
            </a>
            <div class="body-2">
                Journals
            </div>
        </div>

        <v-dialog
                v-model="dialogIsShowing"
                max-width="800"
                scrollable
                persistent
        >

            <v-card flat>
                <v-toolbar flat dark color="primary">
                    <v-toolbar-title class="d-flex">
                        <div v-if="!errorRows">
                            {{rows.length}} Journals {{ label }}
                        </div>
                        <div v-if="errorRows">
                            {{rows.length}} rows with errors
                        </div>
                    </v-toolbar-title>
                    <v-spacer></v-spacer>

                    <v-text-field
                            v-model="search"
                            append-icon="mdi-magnify"
                            label="Search"
                            solo-inverted
                            hide-details
                            flat
                    ></v-text-field>
                </v-toolbar>
                <v-data-table
                        height="500"
                        :fixed-header="true"
                        :headers="headers"
                        :items="tableRows"
                        :items-per-page="100"
                        :search="search"
                        :footer-props="footerProps"
                >

                </v-data-table>
                <v-card-actions class="pt-4">
                    <v-spacer></v-spacer>
                    <v-btn depressed @click="">
                        <v-icon>mdi-download</v-icon>
                        Download
                    </v-btn>
                    <v-btn depressed color="primary" @click="close">
                        <v-icon>mdi-close</v-icon>
                        Close
                    </v-btn>
                </v-card-actions>

            </v-card>
        </v-dialog>


    </span>
</template>

<script>
    import {mapActions, mapGetters, mapMutations} from "vuex";
    import _ from "lodash";
    import {api, toBase64} from "../../api";

    export default {
        name: "PublisherFileJournalsList",
        props: {
            "rows": Array,
            "label": String,
            "errorRows": Boolean,
            "successJournals": Boolean,
            "valueColumnLabel": String,
        },
        data() {
            return {
                dialogIsShowing: false,
                search: "",
            }
        },
        computed: {
            ...mapGetters([
                "publisherId",
            ]),
            headers() {
                return (this.errorRows) ? this.errorHeaders : this.journalHeaders
            },
            tableRows() {
                return this.rows
                // return (this.errorRows) ? this.errorRows : this.journalRows
            },


            journalHeaders() {
                const ret = [
                    {text: "issn", value: "issnl"},
                    {text: "name", value: "name"},
                ]
                if (this.successJournals) {
                    ret.push({
                        text:  this.valueColumnLabel || "value",
                        value: "value"
                    })
                }

                return ret
            },
            errorHeaders() {
                return [
                    {text: "Row", value: "row_no"},
                    {text: "Column", value: "column_name"},
                    {text: "Error", value: "message"},
                ]
            },
            footerProps() {
                return {}
            }
        },
        methods: {
            ...mapActions([]),
            ...mapMutations([]),
            close() {
                this.dialogIsShowing = false
            },
            open() {
                this.dialogIsShowing = true
            }

        }
    }
</script>

<style lang="scss">
    .v-data-footer__select {
        display: none !important;
    }

</style>