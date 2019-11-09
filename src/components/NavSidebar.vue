<template>
<v-navigation-drawer v-if="summary" clipped app left dark>

            <v-list>
                <v-list-item>
                    Cost
                    <v-spacer></v-spacer>
                    <strong>
                        {{summary.cost_percent | round()}}%
                    </strong>

                    <vc-donut
                            v-if="summary.cost_percent"
                            class="ml-2"
                            foreground="grey"
                            background="#424242"
                            :size="20"
                            :thickness="50"
                            :sections="[{value:summary.cost_percent, color: '#ffffff'}]"
                    ></vc-donut>

                </v-list-item>
                <v-list-item>
                    Instant access
                    <v-spacer></v-spacer>
                    <strong>
                        {{summary.use_instant_percent | round()}}%
                    </strong>

                    <vc-donut
                            v-if="summary.use_free_instant_percent"
                            class="ml-2"
                            foreground="grey"
                            background="#424242"
                            :size="20"
                            :thickness="50"
                            :sections="[{value:summary.use_free_instant_percent, color: '#50aa06'}, {value:summary.use_subscription_percent, color: 'dodgerblue'}, ]"
                    ></vc-donut>

                </v-list-item>
                <v-list-item>
                    Subscriptions
                    <v-spacer></v-spacer>
                    <strong>
                        {{summary.num_journals_subscribed | round()}}
                    </strong>

                    <vc-donut
                            v-if="summary.num_journals_subscribed >= 0"
                            class="ml-2"
                            foreground="grey"
                            background="#424242"
                            :size="20"
                            :thickness="50"
                            :sections="[{value: 100 * summary.num_journals_subscribed / summary.num_journals_total, color: 'dodgerblue'}]"
                    ></vc-donut>

                </v-list-item>

            </v-list>




            <v-divider></v-divider>


            <v-list>
                <!--                            <v-subheader>VIEWS</v-subheader>-->
                <v-list-item-group v-model="$store.state.tabDataIndex">

                    <template v-for="(view, i) in $store.getters.journalViews"
                    >
                        <v-list-item
                                :class="{'pl-6': !['journals', 'report',].includes(view.value)}"
                                @click="$store.dispatch('setTabData', view.value)"

                        >
                            <!--                                    <v-list-item-icon>-->
                            <!--                                        <v-icon v-text="view.icon">{{view.icon}}</v-icon>-->
                            <!--                                    </v-list-item-icon>-->

                            <v-list-item-content>
                                <v-list-item-title v-text="view.displayName"></v-list-item-title>
                            </v-list-item-content>

                        </v-list-item>

                        <v-divider v-if="view.value==='apc'"></v-divider>
                    </template>
                    <v-list-item @click="$store.commit('openNotSupportedMsg')">
                        <v-list-item-content>
                            <v-list-item-title>
                                Save as copy
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>


                </v-list-item-group>
            </v-list>
        </v-navigation-drawer>
</template>

<script>

    export default {
        name: "NavSidebar",
        components: {},
        data() {
            return {
            }
        },
        methods: {
            increment() {
            }
        },
        computed: {
            summary() {
                return this.$store.getters.summary
            },
            count() {
            },
            account() {
                return this.$store.state.user
            },
            pkg(){
                return this.$store.getters.selectedPkg
            }
        },
        created(){
        },
        mounted() {
            this.$store.commit("selectPkg", this.$route.params.pkgId)
            this.$store.commit("clearScenario")

            console.log("pkg: mount up", this.$route.params)
        },
    }
</script>

<style scoped>

</style>