<template>
    <v-toolbar
            :color="backgroundColor"
            :dark="institutionIsConsortium"
            :flat="isLandingPage"
    >
        <router-link to="/">
            <img v-if="!institutionIsConsortium"  class="mt-2" style="width:130px;" src="../assets/unsub-logo.png" alt="" />
            <img v-if="institutionIsConsortium"  class="mt-2" style="width:130px;" src="../assets/unsub-logo-white.png" alt="" />
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
                   style="text-transform: capitalize"
                   active-class="no-active"
            >
                <div>
                    <div v-if="institutionIsConsortium" class="body-2 font-weight-bold">
                        Consortium:
                    </div>
                    <div class="title font-weight-regular">
                        {{ institutionName }}
                    </div>
                </div>
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

            <v-btn text color="" v-if="!isLoggedIn" to="/purchase">
                Purchase
            </v-btn>
            <v-btn text color="" v-if="!isLoggedIn" to="/request-demo">
                Get Demo
            </v-btn>

            <v-menu offset-y>
                <template v-slot:activator="{on}">
                    <v-btn text color="" v-on="on">
                        About
                        <v-icon class="">mdi-menu-down</v-icon>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item to="/team">
                        Team
                    </v-list-item>
                    <v-list-item to="/press">
                        Press
                    </v-list-item>
                    <v-list-item to="/contact">
                        Contact
                    </v-list-item>
                </v-list>
            </v-menu>


            <v-btn text href="http://help.unsub.org/en/" target="_blank">
                Help
<!--                <v-icon small class="ml-1">mdi-open-in-new</v-icon>-->
            </v-btn>



            <v-btn
                    text
                    to="/login"
                    v-if="!isLoggedIn"
                    id="header-login-link"
            >
                Log in
            </v-btn>

            <v-btn
                    text
                    to="/u"
                    v-if="isLoggedIn"
            >
                Account
            </v-btn>

            <v-btn
                    text
                    @click="logout"
                    v-if="isLoggedIn"
            >
                Log out
            </v-btn>




<!--            <v-tooltip v-if="isLoggedIn" bottom color="#333" max-width="200">-->
<!--                <template v-slot:activator="{on}">-->
<!--                    <v-btn icon v-on="on" icon to="/u">-->
<!--                        <v-icon>mdi-account-outline</v-icon>-->
<!--                    </v-btn>-->
<!--                </template>-->
<!--                <div>-->
<!--                    Manage your account info-->
<!--                </div>-->
<!--            </v-tooltip>-->

<!--            <v-tooltip v-if="isLoggedIn" bottom color="#333" max-width="200">-->
<!--                <template v-slot:activator="{on}">-->
<!--                    <v-btn icon v-on="on" @click="logout">-->
<!--                        <v-icon>mdi-logout</v-icon>-->
<!--                    </v-btn>-->
<!--                </template>-->
<!--                <div>-->
<!--                    Log out-->
<!--                </div>-->
<!--            </v-tooltip>-->

        </div>
    </v-toolbar>
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
                showBannerContent: !localStorage.getItem("surveyBannerDismissed"),
            }
        },
        methods: {
            logout() {
                this.$store.commit("clearSelectedScenario")
                this.$store.commit("clearPublisher")
                this.$store.commit("clearInstitution")
                this.$store.commit("logout")
                this.$router.push("/")
            },
            dismissBanner(){
                localStorage.setItem("surveyBannerDismissed", "true")
                this.showBannerContent = false
            }
        },
        computed: {
            ...mapGetters([
                'isLandingPage',
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
                "institutionIsConsortium",
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
            backgroundColor(){
                return (this.institutionIsConsortium) ? "primary" : "white"
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
        padding-right: 27px;
        color: #fff;
        background: #2196F3;
        display: flex;
        justify-content: space-between;
    }


</style>