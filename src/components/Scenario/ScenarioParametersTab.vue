<template>
    <v-card>
        <v-row>
            <v-col
                    v-for="group in configGroups"
                    :key="'groupMenuConfigs'+group.name"
            >
                <div>
                    {{group.displayName}}
                </div>
                <v-list>
                    <v-list-item
                            v-for="config in group.contents"
                            :key="group.name+config.name"
                            @click="foo"

                    >
                        <v-list-item-content>
                            {{config.displayName}}
                        </v-list-item-content>
                        <v-list-item-action class="font-weight-bold pl-2">
                            <settings-item-value :config-name="config.name"/>
                        </v-list-item-action>
                    </v-list-item>
                </v-list>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
    import {mapGetters, mapMutations} from 'vuex'
    import appConfigs from "../../appConfigs";
    import SettingsItemValue from "../Settings/SettingsItemValue";

    export default {
        name: "ScenarioParametersTab",
        components: {
            SettingsItemValue,
        },
        props: {
            myRole: String,
            isConsortialFeeder: Boolean,
            publishers: Array,
        },
        data() {
            return {
                dialogs: {
                    createGroupMember: false,
                }
            }
        },
        methods: {
            ...mapMutations([
                "snackbar",
            ]),
            foo() {
                console.log("clicked foo")
            }
        },
        computed: {
            ...mapGetters([
                'institutionId',
                'institutionName',
                'institutionIsDemo',
                "institutionIsConsortium",
                "institutionUsersWithRoles",
                'userConsortia',
                'userInstitutions',
            ]),
            configGroups: () => appConfigs.scenarioConfigGroups,

        },
        created() {
        },
        mounted() {
        },
        watch: {
            "foo": {
                immediate: true,
                handler: function (to, from) {
                }
            }
        }
    }
</script>

<style lang="scss">


</style>