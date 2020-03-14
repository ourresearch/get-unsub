<template>
    <v-dialog v-model="isDeleteDialogOpen" max-width="400">
            <v-card v-if="isDeleteDialogOpen">
                <v-card-title class="headline">
                    Delete scenario
                </v-card-title>
                <v-card-text class="pt-4">
                    <div>
                        Are you sure you want to delete this scenario? This can't be undone.
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-btn depressed
                           @click="deleteScenario(scenarioName)"
                           color="primary"
                           :loading="isSavingRename"
                    >
                        Delete scenario
                    </v-btn>
                    <v-btn depressed @click="isDeleteDialogOpen=false">
                        Cancel
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
</template>

<script>
    export default {
        name: "ScenarioEditDialogsDelete"
    }
</script>

<style scoped>

</style>