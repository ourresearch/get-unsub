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
                        <v-list-item v-on="on" :to="'/a/' + pkgName">
                            <v-list-item-icon class="mr-2">
                                <v-icon>mdi-close</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title class="font-weight-regular">
                                Close
                            </v-list-item-title>
                        </v-list-item>
                    </template>
                    <span>Close this scenario and return to the {{pkgName}} publisher page (all your changes have been automatically saved).</span>
                </v-tooltip>


                <!--                <v-divider />-->
                <!--                <v-subheader>Current scenario</v-subheader>-->
                <v-list-item @click="">
                    <v-list-item-icon class="mr-2">
                        <v-icon>mdi-content-copy</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title class="font-weight-regular">
                        Copy
                    </v-list-item-title>
                </v-list-item>


                <v-list-item @click="">
                    <v-list-item-icon class="mr-2">
                        <v-icon>mdi-pencil</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title class="font-weight-regular">
                        Rename
                    </v-list-item-title>
                </v-list-item>
                <v-list-item @click="">
                    <v-list-item-icon class="mr-2">
                        <v-icon>mdi-delete</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title class="font-weight-regular">
                        Delete
                    </v-list-item-title>
                </v-list-item>

            </v-list>
        </v-menu>


        <v-dialog v-model="isRenameDialogOpen" max-width="400" persistent>
            <v-card v-if="isRenameDialogOpen">
                <v-card-title class="headline">
                    Rename scenario
                </v-card-title>
                <v-card-text class="pt-4">
                    <div>
                        <v-text-field
                                outlined
                                type="text"
                                :disabled="isSavingRename"
                                @keydown.enter="renameScenario(newScenarioName)"
                                v-model="newScenarioName"
                        />
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-btn depressed
                           @click="renameScenario(newScenarioName)"
                           color="primary"
                           :loading="isSavingRename"
                    >
                        Rename
                    </v-btn>
                    <v-btn depressed @click="isRenameDialogOpen=false">
                        Cancel
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </div>
</template>

<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex'

    export default {
        name: "ScenarioMenuScenario",
        data() {
            return {
                isRenameDialogOpen: false,
                newScenarioName: "",
                isDeleteDialogOpen: false,
                isCopyDialogOpen: false,
                isSavingRename: false,
            }
        },
        computed: {
            ...mapGetters([
                "pkgName"
            ]),
        },
        methods: {
            ...mapActions([
                "clearAllSubrs",
                "renameScenario",
            ])
        }
    }
</script>

<style scoped>

</style>