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
                max-width="1000"
                scrollable
                persistent
        >

            <v-card flat>
                <v-toolbar flat dark color="primary">
                    <v-toolbar-title class="d-flex">
                        <div v-if="!errorRows">
                            {{rows.length}}
                            <span v-if="successJournals">Journals</span>
                            <span v-if="!successJournals">{{label}}</span>
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
                            v-if="!errorRows"
                    ></v-text-field>
                    <v-btn icon dark class="ml-2" @click="close">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-data-table
                        height="500"
                        :fixed-header="true"
                        :headers="myHeaders"
                        :items="tableRows"
                        :items-per-page="100"
                        :search="search"
                        :footer-props="footerProps"
                        :disable-sort="errorRows"
                >
                    <template v-slot:item="item">
                       <publisher-file-journal-row
                               v-if="!errorRows"
                               :cells-dict="item.item"
                               :headers="myHeaders"
                       />
                        <publisher-file-error-row
                               v-if="errorRows"
                               :cells-dict="item.item"
                               :headers="myHeaders"
                       />

                    </template>
                </v-data-table>



                <v-card-actions class="pt-4">
                    <v-spacer></v-spacer>
                    <v-btn depressed  @click="close">
                        <v-icon>mdi-close</v-icon>
                        Close
                    </v-btn>
                    <v-btn v-if="false" depressed color="primary" @click="">
                        <v-icon>mdi-download</v-icon>
                        Download
                    </v-btn>
                </v-card-actions>

            </v-card>
        </v-dialog>


    </span>
</template>

<script>
    import {mapActions, mapGetters, mapMutations} from "vuex";
    import PublisherFileJournalRow from "./PublisherFileJournalRow";
    import PublisherFileErrorRow from "./PublisherFileErrorRow";
    import _ from "lodash";
    import {api, toBase64} from "../../api";

    export default {
        name: "PublisherFileJournalsList",
        components: {
            PublisherFileJournalRow,
            PublisherFileErrorRow
        },
        props: {
            rows: Array,
            extraHeaders: Array,
            headers: Array,
            label: String,
            errorRows: Boolean,
            successJournals: Boolean,
            valueColumnLabel: String,
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
            tableRows() {
                return this.rows
            },
            baseJournalHeaders(){
                return [
                        {text: "issn", value: "issnl"},
                        {text: "name", value: "name"},
                ]
            },
            myHeaders(){
                let ret
                if (this.headers){
                    console.log("submitted these headers", this.headers)
                    ret = this.headers.map(h => {
                        if (h.name) h.text = h.name
                        if (h.id) h.value = h.id
                        return h
                    })
                }
                else {
                    ret = this.baseJournalHeaders.concat(this.extraHeaders || [])
                }
                return ret
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