<template>
    <v-container fluid v-if="scenario">
        <v-card class="">
            <v-toolbar flat>
                <div>
                    <h2 class="display-1">
                        Scenario journals
                        <v-btn icon
                               href="https://support.unpaywall.org/support/solutions/articles/44001822204-page-overview"
                               target="_blank">
                            <v-icon>mdi-information-outline</v-icon>
                        </v-btn>

                    </h2>
                </div>
                <v-spacer></v-spacer>
                <v-text-field
                        v-model="search"
                        append-icon="mdi-magnify"
                        label="Search"
                        flat
                        solo
                        outlined
                        hide-details
                ></v-text-field>

                <div class="px-3">
                    <v-tooltip bottom>
                        <template v-slot:activator="{on}">
                            <v-btn v-on="on" fab
                                   dark small @click="showAddColsDialog = true">
                                <v-icon>mdi-table-edit</v-icon>
                            </v-btn>
                        </template>
                        <span>
                            Show/hide columns
                        </span>
                    </v-tooltip>

                </div>

            </v-toolbar>


            <v-divider></v-divider>

            <v-card v-if="data" class="main-card">


                <div class="table-wrapper">

                    <div class="table-portal">

                        <table>
                            <thead>
                            <tr>
                                <th class="title-header">
                                    <span class="header-cell-contents">
                                        <v-menu offset-y>
                                            <template v-slot:activator="{ on }">
                                                <span v-on="on">
                                                    Title&nbsp;▿
                                                </span>
                                            </template>
                                            <v-list>
                                                <v-list-item @click="sortTable('title', true)">
                                                    <v-list-item-icon>
                                                        <v-icon>mdi-sort-ascending</v-icon>
                                                    </v-list-item-icon>
                                                    <v-list-item-title>
                                                        Sort Asc
                                                    </v-list-item-title>
                                                </v-list-item>
                                            </v-list>
                                            <v-list>
                                                <v-list-item @click="sortTable('title', false)">
                                                    <v-list-item-icon>
                                                        <v-icon>mdi-sort-descending</v-icon>
                                                    </v-list-item-icon>
                                                    <v-list-item-title>
                                                        Sort Desc
                                                    </v-list-item-title>
                                                </v-list-item>
                                            </v-list>


                                        </v-menu>

                                    </span>


                                </th>
                                <th v-for="header in tableHeaders" :key="header.value">
                                    <span class="header-width" v-html="header.textWithDownArrow"></span>

                                    <span class="header-cell-contents">
                                        <v-menu offset-y>
                                            <template v-slot:activator="{ on }">
                                                <span v-on="on" v-html="header.textWithDownArrow">
                                                </span>
                                            </template>
                                            <v-list>
                                                <v-list-item @click="sortTable(header.value, true)">
                                                    <v-list-item-icon>
                                                        <v-icon>mdi-sort-ascending</v-icon>
                                                    </v-list-item-icon>
                                                    <v-list-item-title>
                                                        Sort Asc
                                                    </v-list-item-title>
                                                </v-list-item>
                                            </v-list>
                                            <v-list>
                                                <v-list-item @click="sortTable(header.value, false)">
                                                    <v-list-item-icon>
                                                        <v-icon>mdi-sort-descending</v-icon>
                                                    </v-list-item-icon>
                                                    <v-list-item-title>
                                                        Sort Desc
                                                    </v-list-item-title>
                                                </v-list-item>
                                            </v-list>

                                            <v-list>
                                                <v-list-item @click="$store.commit('hideTableCol', header.value)">

                                                    <v-list-item-icon>
                                                        <v-icon>mdi-eye-off</v-icon>
                                                    </v-list-item-icon>
                                                    <v-list-item-title>
                                                        Hide
                                                    </v-list-item-title>
                                                </v-list-item>
                                            </v-list>

                                            <v-list>
                                                <v-list-item @click="getInfo(header.value)">
                                                    <v-list-item-icon>
                                                        <v-icon>mdi-information-outline</v-icon>
                                                    </v-list-item-icon>
                                                    <v-list-item-title>
                                                        Info
                                                    </v-list-item-title>
                                                </v-list-item>
                                            </v-list>

                                        </v-menu>

                                    </span>


                                </th>
                                <th>

                                </th>
                            </tr>


                            </thead>
                            <tbody>
                            <journal-row
                                    v-for="journal in journals"
                                    :key="journal.meta.issn_l"
                                    :journal="journal"
                                    :headers="tableHeaders"
                            ></journal-row>
                            </tbody>
                        </table>
                    </div>

                </div>


                <v-divider></v-divider>
                <v-toolbar flat>
                    <v-spacer></v-spacer>
                    <div>
                        {{pageStartIndex + 1}} &ndash; {{pageEndIndex}}
                        of {{data.journals.length}}
                        <v-btn icon :disabled="isFirstPage" @click="pageBack">
                            <v-icon>mdi-chevron-left</v-icon>
                        </v-btn>
                        <v-btn icon :disabled="isLastPage" @click="pageForward">
                            <v-icon>mdi-chevron-right</v-icon>
                        </v-btn>
                    </div>
                    <v-spacer></v-spacer>


                </v-toolbar>

            </v-card>

        </v-card>


        <v-dialog scrollable max-width="500px" v-model="showAddColsDialog">
            <add-cols-dialog></add-cols-dialog>
        </v-dialog>

    </v-container>


</template>

<script>
    import axios from 'axios'
    import VueScrollingTable from "vue-scrolling-table"
    import _ from "lodash"

    import configs from "../../appConfigs"

    import {api} from '../../api'
    import JournalRow from "../../components/JournalRow"
    import AddColsDialog from "../../components/AddColsDialog"


    export default {
        name: "JournalsTab",
        components: {JournalRow, AddColsDialog},
        data() {
            return {
                data: null,
                search: "",
                editColumnsOpen: false,
                pageStartIndex: 0,
                sortKey: "subscription_cost",
                sortDesc: false,
                pageSize: 200,
                showAddColsDialog: false,
            }
        },
        methods: {

            async getData() {
                const path = `scenario/${this.scenarioId}/table`
                const resp = await api.get(path)
                this.data = resp.data


            },
            getColDisplayType(colName) {
                const myHeader = this.data.headers.find(h => h.value === colName)
                if (myHeader) {
                    return myHeader.display
                } else {
                    return "number"
                }
            },

            async subscribe(issnl) {
                this.$store.commit("addSubr", issnl)
                await this.$store.dispatch("updateScenario")
                await this.getData()
                this.$store.commit("snackbar", "Journal subscribed!")
            },
            async unsubscribe(issnl) {
                this.$store.commit("removeSubr", issnl)
                await this.$store.dispatch("updateScenario")
                await this.getData()
                this.$store.commit("snackbar", "Journal unsubscribed")
            },
            editColumns() {
                this.editColumnsOpen = true
            },
            sortTable(colname, asc = true) {
                console.log("sort table", colname, asc)
                this.sortKey = colname
                this.sortDesc = !asc
            },
            getInfo(colname) {
                console.log("get info", colname)
            },
            addCol() {
                console.log("add column")
            },


            pageForward() {
                if (this.isLastPage) return
                this.pageStartIndex += this.pageSize;
            },
            pageBack() {
                this.pageStartIndex = Math.max(
                    this.pageStartIndex - this.pageSize,
                    0
                )
            },


        },
        computed: {
            // pagination stuff
            pageEndIndex() {
                return Math.min(
                    this.pageStartIndex + this.pageSize,
                    this.data.journals.length
                )
            },
            isLastPage() {
                return this.pageEndIndex >= this.data.journals.length
            },
            isFirstPage() {
                return this.pageStartIndex === 0
            },


            account() {
                return this.$store.state.account
            },
            pkg() {
                return this.$store.getters.selectedPkg
            },
            scenario() {
                return this.$store.getters.selectedScenario
            },
            scenarioId() {
                return this.$route.params.scenarioId
            },
            tableHeaders() {
                return this.data.headers
                    .filter(h => {
                        return this.$store.getters.tableColsToShow.includes(h.value)
                    })
                    .map(h => {
                        const ret = {...h}
                        ret.textWithDownArrow = ret.text + "&nbsp;▿"
                        // ret.groupName = configs.journalColGroups.find(g=>{
                        //     g.cols.includes(g.value)
                        // })

                        return ret
                    })
            },

            journals() {
                const fn = (a, b) => {
                    let diff = a.table_row[this.sortKey] - b.table_row[this.sortKey]
                    if (this.sortDesc) diff *= -1
                    return diff
                }

                let ret = [...this.data.journals]
                ret.sort(fn)
                if (this.search) {
                    ret = ret.filter(j => {
                        const searchTheseStrings = [
                            j.meta.title.toLowerCase(),
                            j.meta.issn_l.toLowerCase()
                        ]
                        const searchTerm = this.search.toLowerCase()
                        return searchTheseStrings.some(m => m.indexOf(searchTerm) > -1)
                    })
                }
                return ret.slice(this.pageStartIndex, this.pageEndIndex)
            },
        },
        created() {
        },
        mounted() {
            console.log("scenario overview: mount up")
            const pkgId = this.$route.params.pkgId

            this.$store.dispatch("fetchPkg", pkgId)
            this.$store.dispatch("fetchScenario", this.scenarioId)
            this.getData()

        },
        watch: {
            '$store.getters.configsDigest': function (to) {
                console.log("configs changed", to)
                this.getData().then(resp => {
                    this.$store.commit("snackbar", "Scenario recalculated with new configs")
                })
            }
        }
    }
</script>

<style lang="scss">
    .tab.loading {
        opacity: .5;
        transition: opacity .25s ease-in-out;
    }

    table tr.subscribed {
        background: #C2DBFD !important;
    }

    table tr {
        cursor: pointer;
        &:hover {
            background: #fafafa;
        }
    }
    table {
        margin-top: -20px;
    }

    table th {
        padding: 0 10px;
        white-space: nowrap;
        background: #fff;
        display: table-cell;
        text-align: left;
        vertical-align: center;

        .header-cell-contents {
            position: absolute;
            padding-top: 10px;
            top: 0;

        }
        .header-width {
            visibility: hidden;
            display:block;
            height: 0;
        }

        &.title-header {
            text-align: left;
            padding-left: 70px;

        }

    }

    .main-card {
        height: 80vh;
        overflow: auto;
        position: relative;
    }

    .table-wrapper {
        position: relative;
        height: 100%;
        display: flex;
        flex-direction: column;
        flex: 1;
        width: 100%;
        padding-top: 50px;
        box-sizing: border-box;
        overflow: auto;
        overflow-y: hidden;
    }
    .table-portal {
        overflow-y: scroll;
        overflow-x: hidden;
        min-width: fit-content;
    }

    table {
        border-collapse: collapse;
        /*overflow-x: auto;*/
        /*width: 100%;*/
        /*position:relative;*/
        /*thead {*/
        /*    display: block;*/
        /*}*/

        tbody {
            /*display: block;*/
            /*overflow: auto;*/
            height: 500px;
            /*width: 100%;*/
        }

    }


</style>