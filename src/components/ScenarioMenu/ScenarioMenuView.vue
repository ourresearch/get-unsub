<template>
    <div>
        <v-menu offset-y>
            <template v-slot:activator="{ on }">
                <v-btn
                        text
                        class="text-capitalize"
                        v-on="on"
                >
                    View
                </v-btn>
            </template>
            <v-list dense>
                <v-subheader>Display journals as</v-subheader>


                <v-list-item @click="menuViewSetDisplayJournalsAs('histogram')">
                    <v-list-item-icon class="mr-2">
                        <v-icon v-if="menuSettingsView.displayJournalsAsSelected=='histogram'">mdi-radiobox-marked
                        </v-icon>
                        <v-icon v-if="menuSettingsView.displayJournalsAsSelected !== 'histogram'">mdi-radiobox-blank
                        </v-icon>
                    </v-list-item-icon>
                    <v-list-item-title class="font-weight-regular">
                        <v-icon>mdi-poll-box</v-icon>
                        Histogram
                    </v-list-item-title>
                </v-list-item>

                <v-list-item @click="menuViewSetDisplayJournalsAs('table')">
                    <v-list-item-icon class="mr-2">
                        <v-icon v-if="menuSettingsView.displayJournalsAsSelected=='table'">mdi-radiobox-marked</v-icon>
                        <v-icon v-if="menuSettingsView.displayJournalsAsSelected !== 'table'">mdi-radiobox-blank
                        </v-icon>
                    </v-list-item-icon>
                    <v-list-item-title class="font-weight-regular">
                        <v-icon>mdi-table-large</v-icon>
                        Table
                    </v-list-item-title>
                </v-list-item>

<!--                <v-divider></v-divider>-->
<!--                <v-subheader>Show bar graphs</v-subheader>-->
<!--                <v-list-item @click="menuViewToggleShowCostBar">-->
<!--                    <v-list-item-icon class="mr-2">-->
<!--                        <v-icon v-if="menuSettingsView.showCostBar">mdi-check</v-icon>-->
<!--                    </v-list-item-icon>-->
<!--                    <v-list-item-title class="font-weight-regular">-->
<!--                        Costs by type-->
<!--                    </v-list-item-title>-->
<!--                </v-list-item>-->
<!--                <v-list-item @click="menuViewToggleShowUsageBar">-->
<!--                    <v-list-item-icon class="mr-2">-->
<!--                        <v-icon v-if="menuSettingsView.showUsageBar">mdi-check</v-icon>-->
<!--                    </v-list-item-icon>-->
<!--                    <v-list-item-title class="font-weight-regular">-->
<!--                        Usage by type-->
<!--                    </v-list-item-title>-->
<!--                </v-list-item>-->


            </v-list>
        </v-menu>
    </div>
</template>

<script>
    import {mapGetters, mapMutations} from 'vuex'

    export default {
        name: "ScenarioMenuView",
        computed: {
            ...mapGetters([
                'menuSettingsView',
            ])
        },
        methods: {
            ...mapMutations([
                "menuViewToggleShowCostBar",
                "menuViewToggleShowUsageBar",
                "menuViewSetDisplayJournalsAs",
            ]),
        }
    }
</script>

<style scoped>

</style>