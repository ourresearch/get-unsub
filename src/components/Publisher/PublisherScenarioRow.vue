<template>
    <v-list-item
            two-line
            :key="scenario.id + scenario.saved.name"
            @click="goToScenario"
    >

        <v-list-item-content>
            <v-list-item-title
                    class="title font-weight-bold"
                    v-text="scenario.saved.name"
            />
            <v-list-item-subtitle>
                <span>ID: {{scenario.id}}</span>
                <!--                                    <strong>{{ scenario.saved.subrs.length }}</strong> à la carte journal subscriptions-->
            </v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-action>
            <v-menu
                    offset-y
            >
                <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item @click.stop="openCopyDialog(scenario)">
                        <v-list-item-icon>
                            <v-icon>mdi-content-copy</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>
                            Make a copy
                        </v-list-item-title>
                    </v-list-item>
                    <v-list-item @click.stop="openRenameDialog(scenario)">
                        <v-list-item-icon>
                            <v-icon>mdi-pencil</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>
                            Rename
                        </v-list-item-title>
                    </v-list-item>
                    <v-list-item @click.stop="openDeleteDialog(scenario)">
                        <v-list-item-icon>
                            <v-icon>mdi-delete</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>
                            Delete
                        </v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-list-item-action>

    </v-list-item>
</template>

<script>
    import {mapGetters, mapMutations} from "vuex";

    export default {
        name: "PublisherScenarioRow",
        components: {
        },
        props: {
            scenario: Object,
        },
        data() {
            return {

            }
        },
        methods: {
            ...mapMutations([
                "openCopyDialog",
                "openCreateDialog",
                "openRenameDialog",
                "openDeleteDialog",
                "openPublisherFileUploadDialog",
            ]),
            async goToScenario() {
                const url = `/i/${this.institutionId}/p/${this.publisherId}/s/${this.scenario.id}`
                await this.$router.push(url)

            },
        },
        computed: {
            ...mapGetters([
                "institutionId",

                "publisherName",
                "publisherScenarios",
                "publisherScenariosAreAllLoaded",
                "publisherId",
                "publisherBigDealCost",
                "publisherFiles",
            ]),
        },
        created() {
        },
        mounted() {
        },
        watch: {}
    }
</script>

<style scoped>

</style>