<template>
    <div>
        <v-menu open-on-hover max-height="500" offset-y content-class="no-highlight">
            <template v-slot:activator="{on}">
                <v-btn text class="low-key-button font-weight-bold" style="font-size:18px;" v-on="on">
                    <v-icon color="#777" left>mdi-chart-box-outline</v-icon>
                    {{ scenarioName }}
                </v-btn>
            </template>
            <div>
                <v-list class="pb-0" dense>
                    <v-list-item :to="`./${scenarioId}`">
                        <v-list-item-icon>
                            <v-icon class="mt-4">mdi-chart-box-outline</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content class="font-weight-bold">
                            <div>
                                <div class="body-2 mb-1">
                                    Current scenario:
                                </div>
                                <div>
                                    {{scenarioName}}

                                </div>

                            </div>
                        </v-list-item-content>
                    </v-list-item>

                    <template v-if="scenariosOtherThanCurrent.length">
                        <v-subheader class="body-2 mt-2">Other scenarios ({{ scenariosOtherThanCurrent.length }}):
                        </v-subheader>
                        <v-divider></v-divider>
                    </template>
                </v-list>
                <div style="overflow: scroll; max-height: 500px;">
                    <v-list dense>
                        <v-list-item
                                v-for="scenario in scenariosOtherThanCurrent"
                                :key="scenario.id"
                                :to="`/i/${institutionId}/p/${publisherId}/s/${scenario.id}`"
                        >
                            <v-list-item-icon>
                                <v-icon>mdi-chart-box-outline</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                {{scenario.saved.name}}
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </div>

            </div>
        </v-menu>

    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import {publisherLogoFromId} from "../../shared/publisher";

    export default {
        name: "AppBarBreadcrumbsPublisher",
        data() {
            return {
                formIsSubmitted: false,
            }
        },
        methods: {
            publisherLogoFromId,
        },
        computed: {
            ...mapGetters([
                "institutionId",

                'publisherId',
                'publisherScenarios',

                "scenarioId",
                "scenarioName",
            ]),
            scenariosOtherThanCurrent() {
                return this.publisherScenarios.filter(s => {
                    return s.id !== this.scenarioId
                })
            }

        },

    }
</script>

<style scoped>

</style>