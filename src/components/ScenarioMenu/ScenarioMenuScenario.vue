<template>
    <div>
        <v-menu offset-y min-width="200">
            <template v-slot:activator="{ on }">
                <v-btn
                        text
                        class="text-capitalize"
                        v-on="on"
                >
                    Scenario
                </v-btn>
            </template>
            <v-list dense>


                <v-list-item @click="openCreateDialog">
                    <v-list-item-icon class="mr-2">
                        <v-icon>mdi-chart-box-plus-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title class="font-weight-regular">
                        New
                    </v-list-item-title>
                </v-list-item>

                <v-list-item
                        @click="openOpenScenarioDialog"
                        v-if="publisherScenariosCount > 1"
                >
                    <v-list-item-icon class="mr-2">
                        <v-icon>mdi-folder-open-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title class="font-weight-regular">
                        Open
                    </v-list-item-title>
                </v-list-item>

                <v-list-item @click="openCopyDialog(selectedScenario)">
                    <v-list-item-icon class="mr-2">
                        <v-icon>mdi-content-copy</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title class="font-weight-regular">
                        Make a copy
                    </v-list-item-title>
                </v-list-item>


                <v-divider />

                <v-list-item   @click="closeScenario">
                    <v-list-item-icon class="mr-2">
                        <v-icon>mdi-close</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title class="font-weight-regular">
                        Close
                    </v-list-item-title>
                </v-list-item>

                <v-list-item @click="openRenameDialog(selectedScenario)">
                    <v-list-item-icon class="mr-2">
                        <v-icon>mdi-pencil</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title class="font-weight-regular">
                        Rename
                    </v-list-item-title>
                </v-list-item>

                <v-list-item
                        v-if="publisherScenariosCount > 1"
                        @click="openDeleteDialog(selectedScenario)"
                >
                    <v-list-item-icon class="mr-2">
                        <v-icon>mdi-delete-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title class="font-weight-regular">
                        Delete
                    </v-list-item-title>
                </v-list-item>

            </v-list>
        </v-menu>

        <scenario-edit-dialogs />







    </div>
</template>

<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex'
    import ScenarioEditDialogs from "../ScenarioEditDialogs/ScenarioEditDialogs";

    export default {
        name: "ScenarioMenuScenario",
        components: {
            ScenarioEditDialogs,
        },
        data() {
            return {
            }
        },
        computed: {
            ...mapGetters([
                "publisherName",
                "publisherId",
                "institutionId",
                "scenarioName",
                "selectedScenario",
                "publisherScenariosCount",
            ]),
        },
        methods: {
            ...mapActions([
            ]),
            ...mapMutations([
                "openCopyDialog",
                "openCreateDialog",
                "openRenameDialog",
                "openDeleteDialog",
                "openOpenScenarioDialog",
            ]),
            closeScenario(){
                const url = `/i/${this.institutionId}/p/${this.publisherId}`
                this.$router.push(url)
                this.$store.commit("clearSelectedScenario")
            },
            openNewScenario(){
                console.log("open new scenario")
            }
        }
    }
</script>

<style scoped>

</style>