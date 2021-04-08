<template>
    <div>
        <v-menu open-on-hover offset-y content-class="no-highlight">
            <template v-slot:activator="{on}">
                <v-btn
                        :icon="!!publisherName"
                        :text="!publisherName"
                        class="low-key-button no-highlight"
                        v-on="on"
                        :to="`/i/${institutionId}`"
                >
                    <v-icon color="#777" :left="!publisherName">
                        {{ institutionIsConsortium ? "mdi-lan" : "mdi-bank-outline"}}
                    </v-icon>
                    <span v-if="!publisherName">
                        {{ institutionName }}
                    </span>
                </v-btn>
            </template>
            <div>
                <v-list dense class="pb-0">
                    <v-list-item :to="`/i/${institutionId}`">
                        <v-list-item-icon>
                            <v-icon class="mt-4">
                                {{ institutionIsConsortium ? "mdi-lan" : "mdi-bank-outline"}}
                            </v-icon>
                        </v-list-item-icon>
                        <v-list-item-content class="font-weight-bold">
                            <div>
                                <div class="body-2 mb-1">
                                    Current {{ institutionIsConsortium ? "consortium" : "institution" }}:
                                </div>
                                <div>
                                    {{institutionName}}
                                </div>
                            </div>
                        </v-list-item-content>
                    </v-list-item>
                    <template v-if="orgsOtherThanCurrent.length">
                        <v-subheader class="body-2 mt-2">
                            Other
                            {{ userHasAConsortium ? "organizations" : "institutions"}}

                            ({{ orgsOtherThanCurrent.length
                            }}):
                        </v-subheader>
                        <v-divider></v-divider>
                    </template>
                </v-list>
                <div style="overflow: scroll; max-height: 500px;">
                    <v-list dense v-if="orgsOtherThanCurrent.length">

                        <v-list-item
                                v-for="org in orgsOtherThanCurrent"
                                :key="org.id"
                                :to="`/i/${org.institution_id}`"
                        >
                            <v-list-item-icon>
                                <v-icon >
                                    {{ org.is_consortium ? "mdi-lan" : "mdi-bank-outline"}}
                                </v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <div>
                                    {{org.institution_name}}
                                </div>
                                <div v-if="org.is_consortium" class="caption">
                                    consortium
                                </div>
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
        name: "AppBarBreadcrumbsInstitution",
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
                'userInstitutions',
                'userConsortia',
                "institutionId",
                "institutionName",
                "institutionIsConsortium",


                'publisherName',
            ]),
            orgs(){
                return this.userConsortia.concat(this.userInstitutions)
            },
            orgsOtherThanCurrent() {
                return this.orgs.filter(i => {
                    return i.institution_id !== this.institutionId
                })
            },
            userHasAConsortium(){
                return this.orgs.find(org => {
                    return org.is_consortium
                })
            },

        },

    }
</script>

<style scoped>

</style>