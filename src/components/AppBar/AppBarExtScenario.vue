<template>
    <v-row style="margin-left:0px; ">
                    <scenario-menu-scenario key="scenario"/>
                    <scenario-menu-view key="view"/>
                    <scenario-menu-subscriptions v-if="0" key="subscriptions"/>
                    <scenario-menu-columns key="columns"/>
                    <scenario-menu-settings key="settings"/>
                    <scenario-menu-export key="export"/>
                    <scenario-menu-help key="help"/>
                    <v-spacer/>
                    <div class="pt-2" v-if="institutionIsConsortium">
                        <scenario-edit-dialogs-institutions/>
                    </div>
                </v-row>
</template>

<script>
     import ScenarioMenuScenario from "../ScenarioMenu/ScenarioMenuScenario";
    import ScenarioMenuSubscriptions from "../ScenarioMenu/ScenarioMenuSubscriptions";
    import ScenarioMenuView from "../ScenarioMenu/ScenarioMenuView";
    import ScenarioMenuColumns from "../ScenarioMenu/ScenarioMenuColumns";
    import ScenarioMenuSettings from "../ScenarioMenu/ScenarioMenuSettings";
    import ScenarioMenuExport from "../ScenarioMenu/ScenarioMenuExport";
    import ScenarioMenuHelp from "../ScenarioMenu/ScenarioMenuHelp";
     import {mapGetters} from "vuex";
    export default {
        name: "AppBarExtScenario",
        components: {
            ScenarioMenuScenario,
            ScenarioMenuView,
            ScenarioMenuSubscriptions,
            ScenarioMenuColumns,
            ScenarioMenuExport,
            ScenarioMenuSettings,
            ScenarioMenuHelp,
        },
        computed: {
            ...mapGetters([
                "institutionIsConsortium",

                'scenarioId',
                'scenarioName',
                'publisherScenarios',
                'selectedScenarioIsLoading',

            ]),
        },
    }
</script>

<style scoped>

</style>