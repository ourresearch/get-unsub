<template>
    <div>
        <v-menu offset-y>
            <template v-slot:activator="{ on }">
                <v-btn
                    text
                    class="text-capitalize"
                    v-on="on"
                >
                    Help
                </v-btn>
            </template>
            <v-list dense>
                <v-list-item @click="" href="http://help.unsub.org/en/" target="_blank">
                    <v-list-item-icon class="mr-2">
                        <v-icon >mdi-help-circle-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title class="font-weight-regular">
                        Knowledge base
                        <v-icon small>mdi-open-in-new</v-icon>
                    </v-list-item-title>
                </v-list-item>
                <v-list-item href="mailto:team@ourresearch.org">
                    <v-list-item-icon class="mr-2">
                        <v-icon >mdi-email-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title class="font-weight-regular">
                        Contact us
                    </v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
    </div>
</template>

<script>
    export default {
        name: "ScenarioMenuHelp"
    }
</script>

<style scoped>

</style>