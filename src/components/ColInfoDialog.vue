<template>
    <v-dialog width="400px" v-model="$store.state.showColInfo">
        <v-card v-if="$store.state.showColInfo">
            <v-toolbar dark flat color="primary">
                <v-toolbar-title>
                    <v-icon>mdi-information-outline</v-icon>
                    {{$store.getters.colInfo.text}}
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon text @click="close()">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>


            <v-card-text>
                <div class="pa-3" v-html="$store.getters.colInfo.descr"></div>

            </v-card-text>
        </v-card>
    </v-dialog>


</template>

<script>
    import configs from "../appConfigs"

    export default {
        name: "ColInfoDialog",
        props: [],
        data() {
            return {
            }
        },
        methods: {
            close(){
                this.$store.commit("clearColInfo")
            },
            isColShowing(colName) {
                return this.$store.getters.tableColsToShow.includes(colName)
            }
        },
        computed: {
            groupedTableHeaders: () => configs.journalColGroups,
        }
    }
</script>

<style scoped>

</style>