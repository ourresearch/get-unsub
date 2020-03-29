<template>
    <v-app-bar app hide-on-scroll color="white">
        <router-link to="/">
            <img  class="mt-2" src="../assets/unpaywall-journals-logo.png" alt="" />
        </router-link>
<!--        <v-toolbar-title class="headline">-->
<!--        </v-toolbar-title>-->


        <v-divider
                class=" ml-7"
                vertical
                v-if="institutionName"
        />

        <v-toolbar-items class="account breadcrumbs">
            <v-btn v-if="institutionName"
                   class="px-5"
                   text
                   :to="`/i/${institutionId}`"
            >
                <v-avatar tile size="40" class="mr-2" v-if="institutionIsDemo">
                    <img src="https://i.imgur.com/oeSIBs7.png" alt="">
                </v-avatar>
                <span class="title font-weight-regular">
                    {{ institutionName }}
                </span>
            </v-btn>


<!--            not using breadcrumbs right now. -->
            <div class="d-none">
                <v-btn v-if="institutionName"
                       class="px-3"
                       :class="{'pr-0': !!publisherName}"
                       text
                       :to="`/i/${institutionId}`"
                >
                    <span class="title font-weight-regular">
                        {{ institutionName }}
                    </span>
                    <v-icon color="grey" v-if="publisherName"  class="pl-2">mdi-chevron-right</v-icon>
                </v-btn>
                <v-btn v-if="publisherName" class="px-2" text :to="`/i/${institutionId}/p/${publisherId}`">
    <!--                <v-icon color="grey"  class="pr-2">mdi-bank</v-icon>-->
                    <span class="title font-weight-regular">
                        {{ publisherName }}

                    </span>
                </v-btn>

            </div>
        </v-toolbar-items>

        <v-spacer/>
        <div class="no-highlight">
            <v-btn text color="primary" v-if="!$store.getters.isUserSubscribed" to="/purchase">
                Buy
            </v-btn>



            <v-btn class="breadcrumbs" text to="/login" v-if="!isLoggedIn">Log in</v-btn>
            <v-menu offset-y v-if="isLoggedIn">
                <template
                        v-slot:activator="{ on }">
                    <v-btn icon
                           class="px-2"
                           v-on="on"
                    >
                        <v-icon>mdi-account-outline</v-icon>
                    </v-btn>
                </template>
                <v-list subheader>
                    <v-subheader>Hi, {{ userName }}!</v-subheader>
                    <v-list-item to="/u">
                        <v-list-item-icon>
                            <v-icon>mdi-account-outline</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>
                            My account info
                        </v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="logout">
                        <v-list-item-icon>
                            <v-icon>mdi-logout</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>
                            Log out
                        </v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
            <v-btn icon to="/support">
                <v-icon>mdi-help-circle-outline</v-icon>
            </v-btn>
        </div>
    </v-app-bar>
</template>

<script>
    import {mapGetters, mapMutations} from 'vuex'



    export default {
        name: "AppBar",
        components: {

        },
        data() {
            return {
                thirdBreadcrumb: null,
            }
        },
        methods: {
            logout() {
                this.$store.commit("clearSelectedScenario")
                this.$store.commit("clearPublisher")
                this.$store.commit("clearInstitution")
                this.$store.commit("logout")
                this.$router.push("/")
            }
        },
        computed: {
            ...mapGetters([
                'scenarioId',
                'scenarioName',
                'publisherId',
                'publisherName',
                'selectedScenarioIsLoading',
                'isLoggedIn',
                'institutionName',
                'institutionId',
                'institutionIsDemo',
                'foo',
                "userName",
            ]),
            isApcPage(){
                // hack for now
                return !!location.href.match(/\/apc$/)
            },
            account() {
                return this.$store.getters.selectedAccount
            },
            selectedScenario() {
                return this.$store.getters.selectedScenario
            },
        },
        created() {
        },
        mounted() {
        },
        watch: {
            "$route": {
                immediate: true,
                handler: function(to, from){

                }
            }
        }
    }
</script>

<style lang="scss">
    .v-toolbar__extension {
        /*background: #eee;*/
        border-top: 1px solid #ddd;
    }


</style>