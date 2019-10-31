<template>
    <v-container fluid class="tab" v-if="data && data.journals">
        <v-row>
            header stuff
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-card>
                    <v-toolbar
                            color="gray"
                            dark
                            flat
                    >
                        Journals: Institutional Value
                        <v-spacer></v-spacer>
                        <v-text-field
                                v-model="search"
                                append-icon="mdi-magnify"
                                label="Search"
                                solo-inverted
                                flat
                                hide-details
                        ></v-text-field>

                    </v-toolbar>
                    <v-data-table
                            :headers="tableHeaders"
                            :items="tableRows"
                            :items-per-page="25"
                            :search="search"
                            :footer-props="{disableItemsPerPage:true}"

                    ></v-data-table>

                </v-card>

            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    export default {
        props: ["data"],
        name: "JournalsTab",
        data() {
            return {
                search: '',
            }
        },
        computed: {
            tableHeaders() {
                const metaHeaders = [
                    {text: "Title", value: "title"},
                    {text: "Subject", value: "subject"},
                ]

                return [...metaHeaders, ...this.data.headers]
            },
            tableRows() {
                return this.data.journals.map(j => {
                    let ret = {}
                    Object.keys(j).forEach(key => {
                        if (key !== 'meta') {
                            ret[key] = j[key]
                        }
                    })
                    ret.title = j.meta.title
                    ret.subject = j.meta.subject
                    return ret
                })
            }

        }
    }
</script>

<style scoped>

</style>