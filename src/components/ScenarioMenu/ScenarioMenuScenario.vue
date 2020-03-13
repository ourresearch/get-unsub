<template>
    <div>
        <v-menu offset-y>
            <template v-slot:activator="{ on }">
                <v-btn
                    text
                    class="text-capitalize"
                    v-on="on"
                >
                    File
                </v-btn>
            </template>
            <v-list dense>
                <v-list-item @click="">
                    <v-list-item-icon class="mr-2">
                        <v-icon >mdi-folder-open</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title class="font-weight-regular">
                        Open scenario
                    </v-list-item-title>
                </v-list-item>

                <v-divider />
                <v-subheader>Current scenario</v-subheader>
                <v-list-item @click="">
                    <v-list-item-icon class="mr-2">
                        <v-icon >mdi-content-copy</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title class="font-weight-regular">
                        Copy
                    </v-list-item-title>
                </v-list-item>
                <v-list-item @click="">
                    <v-list-item-icon class="mr-2">
                        <v-icon >mdi-pencil</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title class="font-weight-regular">
                        Rename
                    </v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
    </div>
</template>

<script>
    export default {
        name: "ScenarioMenuFile"
    }
</script>

<style scoped>

</style>