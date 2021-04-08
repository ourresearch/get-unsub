<template>
    <div>
        <v-menu open-on-hover offset-y content-class="no-highlight">
            <template v-slot:activator="{on}">
                <v-btn
                        :icon="!!scenarioName"
                        :text="!scenarioName"
                        class="low-key-button no-highlight"
                        v-on="on"
                        :to="`/i/${institutionId}/p/${publisherId}`"
                >
                    <v-icon color="#777" :left="!scenarioName">mdi-package-variant</v-icon>
                    <span v-if="!scenarioName">
                        {{ publisherName }} <span v-if="publisherIsOwnedByConsortium">(consortial)</span>
                    </span>
                </v-btn>
            </template>
            <div>
                <v-list class="pb-0" dense>
                    <v-list-item :to="`/i/${institutionId}/p/${publisherId}`">
                        <v-list-item-icon>
                            <v-icon class="mt-4">mdi-package-variant</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content class="font-weight-bold">
                            <div>
                                <div class="body-2 mb-1">
                                    Current package:
                                </div>
                                <div>
                                    {{publisherName}} <s1pan v-if="publisherIsOwnedByConsortium">(consortial)</s1pan>
                                </div>
                            </div>
                        </v-list-item-content>
                    </v-list-item>
                    <template v-if="publishersOtherThanCurrent.length">
                        <v-subheader class="body-2 mt-2">Other packages ({{publishersOtherThanCurrent.length}}):
                        </v-subheader>
                        <v-divider></v-divider>
                    </template>
                </v-list>
                <div style="overflow: scroll; max-height: 500px;">
                    <v-list dense>
                        <v-list-item
                                v-for="pub in publishersOtherThanCurrent"
                                :key="pub.id"
                                :to="`/i/${institutionId}/p/${pub.id}`"
                        >
                            <v-list-item-icon>
                                <v-icon>mdi-package-variant</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                {{pub.name}}
                                <template v-if="pub.is_owned_by_consortium">(consortial)</template>
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
                'institutionPublishers',
                'publisherName',
                'publisherId',
                'publisherPublisher',
                'publisherIsOwnedByConsortium',

                "institutionId",

                "scenarioId",
                "scenarioName",
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