<template>
    <v-footer
            class="py-10 site-footer"
            dark
            color="#555"
    >
        <v-container>
            <v-row>
                <v-col cols="12" sm="2">
                    <div>
                        <router-link to="/team">Team</router-link>
                    </div>
                    <div>
                        <router-link to="/press">Press</router-link>
                    </div>
                    <div>
                        <router-link to="/contact">Contact</router-link>
                    </div>
                    <div><a href="https://twitter.com/unsub_org" target="_blank">Twitter</a></div>
                    <div><a href="https://github.com/ourresearch/get-unsub" target="_blank">Source code</a></div>
                </v-col>
                <v-col cols="12" sm="2">
                    <div><a href="http://help.unsub.org" target="_blank">Support</a></div>
                    <div>
                        <router-link to="/request-demo">Get a demo</router-link>
                    </div>
                    <div>
                        <router-link to="/purchase">Purchase</router-link>
                    </div>
                    <div>
                        <router-link to="/login">Log in</router-link>
                    </div>
                    <div>
                        <router-link to="/unsub-toc.pdf" target="_blank">Terms of Use</router-link>
                    </div>

                </v-col>
                <v-col cols="12" sm="4" class="text-center">
                    <router-link to="/">
                        <img class="site-footer-logo" src="../assets/unsub-logo-white.png" alt=""/>
                    </router-link>
                </v-col>
                <v-col cols="12" sm="4" class="body-2">
                    Unsub is made with ❤︎ by <a style="text-decoration: underline;" href="https://ourresearch.org">OurResearch,</a> with generous support from <a style="text-decoration: underline;"
                                                                href="https://www.arcadiafund.org.uk/">Arcadia&mdash;a
                    charitable fund of Lisbet Rausing and Peter Baldwin</a>.
                </v-col>
            </v-row>
        </v-container>
    </v-footer>
</template>

<script>
    export default {
        name: "SiteFooter"
    }
</script>

<style scoped lang="scss">
    .site-footer {
        line-height: 1.8;
        a {
            text-decoration: none;
            color: #fff;

            &:hover {
                text-decoration: underline;
            }
        }
    }

    img.site-footer-logo {
        width: 100px;

    }

</style>