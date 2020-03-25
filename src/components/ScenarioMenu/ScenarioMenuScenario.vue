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
                <v-tooltip
                        right
                        max-width="400"
                >
                    <template v-slot:activator="{ on }">
                        <v-list-item v-on="on" :to="'/a/' + publisherId">
                            <v-list-item-icon class="mr-2">
                                <v-icon>mdi-close</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title class="font-weight-regular">
                                Close
                            </v-list-item-title>
                        </v-list-item>
                    </template>
                    <span>Close this scenario and return to the {{publisherName}} publisher page (all your changes have been automatically saved).</span>
                </v-tooltip>
                <v-list-item @click="openCopyDialog(selectedScenario)">
                    <v-list-item-icon class="mr-2">
                        <v-icon>mdi-content-copy</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title class="font-weight-regular">
                        Copy
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
                <v-list-item v-if="publisherScenariosCount > 1" @click="openDeleteDialog(selectedScenario)">
                    <v-list-item-icon class="mr-2">
                        <v-icon>mdi-delete</v-icon>
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
                "openRenameDialog",
                "openDeleteDialog",
            ]),
        }
    }
</script>

<style scoped>

</style>