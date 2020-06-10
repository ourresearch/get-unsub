<template>
    <span v-if="journals.length">
        <span style="white-space: nowrap; display:block;">
            <a @click="open">
                {{journals.length}}
            </a>
             {{label}}
        </span>

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
                            {{rows.length}} journals {{ label }}
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
            tableRows(){
                return (this.errorRows) ? this.errorRows : this.journalRows
            },


            journalHeaders(){
                return [
                    {text: "issn", value: "issnl"},
                    {text: "name", value: "name"},
                ]
            },
            journals(){
                return this.rows
            },
            journalRows() {
                return this.journals.map(j => {
                    return {
                        name: j.name,
                        issnl: j.issnl,
                    }
                })
            },
            errorHeaders(){
                return [
                    {text: "Row", value: "row_no"},
                    {text: "Column", value: "column_name"},
                    {text: "Error", value: "message"},
                ]
            },
            errorRows() {
                return this.rows

                // maybe later
                return this.rows.map(r => {
                    return {
                        // stuff
                    }
                })
            },
            footerProps(){
                return {

                }
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

<style  lang="scss">
    .v-data-footer__select {
        display:none !important;
    }

</style>