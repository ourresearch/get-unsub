<template>
    <div class="d-flex pl-2 ml-4 align-center" style="border-left:1px solid #555;">


        <!--        <v-menu offset-y content-class="no-highlight">-->
        <!--            <template v-slot:activator="{on}">-->
        <!--                <v-btn icon v-on="on">-->
        <!--                    <v-icon>mdi-bank-outline</v-icon>-->
        <!--                </v-btn>-->
        <!--            </template>-->
        <!--            <v-list dense>-->
        <!--                <v-subheader class="body-2">Institutions</v-subheader>-->

        <!--                <v-list-item-->
        <!--                        v-for="insti in userInstitutions"-->
        <!--                        :key="insti.institution_id"-->
        <!--                        :to="`/i/${insti.institution_id}`"-->
        <!--                >-->
        <!--                    <v-list-item-icon>-->
        <!--                        <v-icon>mdi-check</v-icon>-->
        <!--                    </v-list-item-icon>-->
        <!--                    <v-list-item-content>-->
        <!--                        {{insti.institution_name}}-->

        <!--                    </v-list-item-content>-->
        <!--                </v-list-item>-->
        <!--            </v-list>-->
        <!--        </v-menu>-->




        <template v-if="institutionName">
            <app-bar-breadcrumbs-institution/>
        </template>

        <template v-if="publisherName">
            <v-icon>mdi-chevron-right</v-icon>
            <app-bar-breadcrumbs-publisher/>
        </template>

        <template v-if="scenarioName">
            <v-icon>mdi-chevron-right</v-icon>
            <app-bar-breadcrumbs-scenario/>
        </template>


        <!--        <v-icon>mdi-chevron-right</v-icon>-->
        <!--        <v-btn text class="low-key-button">-->
        <!--            <v-icon left>mdi-chart-box-outline</v-icon>-->
        <!--            Lorem ipsum dolor sit amet, consectetur adipiscing elit-->
        <!--        </v-btn>-->


    </div>
</template>

<script>
    import appConfigs from "../../appConfigs";
    import {mapGetters} from "vuex";
    import AppBarBreadcrumbsPublisher from "./AppBarBreadcrumbsPublisher";
    import AppBarBreadcrumbsInstitution from "./AppBarBreadcrumbsInstitution";
    import AppBarBreadcrumbsScenario from "./AppBarBreadcrumbsScenario";

    export default {
        name: "AppBarBreadcrumbs",
        components: {
            AppBarBreadcrumbsPublisher,
            AppBarBreadcrumbsInstitution,
            AppBarBreadcrumbsScenario,
        },
        data() {
            return {
                formIsSubmitted: false,
            }
        },
        methods: {},
        computed: {
            ...mapGetters([

                // institutions
                'userInstitutions',
                'userConsortia',

                // packages
                'institutionPublishers',
                'publisherName',
                'publisherId',
                'publisherPublisher',


                'scenarioId',
                'scenarioName',
                'publisherId',
                'publisherName',
                'selectedScenarioIsLoading',
                'isLoggedIn',
                'institutionName',
                'institutionId',
                "institutionIsConsortium",
            ]),
            publishersOtherThanCurrent() {
                return this.institutionPublishers.filter(p => {
                    return p.id !== this.publisherId
                })
            }

        },

    }
</script>

<style scoped>

</style>