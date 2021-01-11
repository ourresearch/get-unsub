<template>
    <v-toolbar
            color="white"
            :flat="isLandingPage"
    >
        <router-link to="/">
            <img class="mt-2" style="width:130px;" src="../assets/unsub-logo.png" alt="" />
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
                    <v-chip
                        v-if="institutionIsConsortium"
                        x-small
                        color="primary"
                    >
                        Consortium
                    </v-chip>
                    <v-chip
                        x-small
                        v-if="!institutionIsConsortium"
                        outlined
                    >
                        Institution
                    </v-chip>
                    <!--<div v-if="institutionIsConsortium" class="body-2 font-weight-bold" style="line-height:initial">
                        Consortium
                    </div>
                    <div v-if="!institutionIsConsortium" class="body-2 font-weight-bold line-height-reset" style="line-height:initial">
                        Institution
                    </div>-->
                    <div class="title font-weight-regular line-height-reset" style="line-height:initial">
                        {{ institutionName }}
                    </div>
                </div>
            </v-btn>
        </v-toolbar-items>

        <v-spacer/>
        <div class="no-highlight">

            <v-btn text color="primary" v-if="isLoggedIn && $store.getters.userIsDemo" to="/purchase">
                Purchase
            </v-btn>
            <v-btn text color="primary" v-if="!isLoggedIn" to="/purchase">
                <span>Purchase</span>
            </v-btn>

            <v-btn
                    class="breadcrumbs"
                    text
                    to="/login"
                    v-if="!isLoggedIn"
                    id="header-login-link"
            >
                Log in
            </v-btn>

            <v-tooltip v-if="isLoggedIn" bottom color="#333" max-width="200">
                <template v-slot:activator="{on}">
                    <v-btn icon v-on="on" icon to="/u">
                        <v-icon>mdi-account-outline</v-icon>
                    </v-btn>
                </template>
                <div>
                    Manage your account info
                </div>
            </v-tooltip>

            <v-tooltip v-if="isLoggedIn" bottom color="#333" max-width="200">
                <template v-slot:activator="{on}">
                    <v-btn icon v-on="on" @click="logout">
                        <v-icon>mdi-logout</v-icon>
                    </v-btn>
                </template>
                <div>
                    Logout
                </div>
            </v-tooltip>

            <v-btn icon href="https://intercom.help/get-unsub/en" target="_blank">
                <v-icon>mdi-help-circle-outline</v-icon>
            </v-btn>
        </div>

<!--        <template v-slot:extension v-if="showBannerContent">-->
<!--            <div class="text">-->
<!--                Are you a librarian? Take our 5-minute pricing survey!-->
<!--            </div>-->
<!--            <v-spacer />-->
<!--            <v-btn text dark href="https://docs.google.com/forms/d/e/1FAIpQLSce71D0KwMF3Utmkt5qbVWtdfAmHFPE2Y8nlqbBZfXb26JkbQ/viewform?usp=send_form" target="_blank">-->
<!--                <v-icon small class="mr-2">mdi-open-in-new</v-icon>-->
<!--                Take survey-->
<!--            </v-btn>-->
<!--            <v-btn text dark @click="dismissBanner">-->
<!--                <v-icon small class="mr-2">mdi-close</v-icon>-->
<!--                Dismiss-->
<!--            </v-btn>-->
<!--        </template>-->


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
            }
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