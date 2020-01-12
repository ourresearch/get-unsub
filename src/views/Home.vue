<template>
    <v-container fluid class="home">
        <v-card class="pa-6">

            <v-row class="top-screen pa-12">
                <v-col>
                    <div class="main-copy">
                        <div class="tagline">
                            <h2 class="display-2 mb-6">
                                Get more value from your serials budget.
                            </h2>
                        </div>
                        <div class="about">
                            <p class="headline">
                                Unpaywall Journals is a data dashboard that combines journal-level citations, downloads,
                                Open Access statistics and more, to help librarians confidently manage their serials
                                collections.
                            </p>
    
                        </div>
    
                        <div class="cta">
                            <div class="my-3">
                                <v-btn to="/purchase" class="mr-3" depressed large color="primary">Purchase</v-btn>
                                <v-btn @click="loginDemo" outlined large color="primary">Try Demo</v-btn>
                            </div>
    
                        </div>
    
    
                    </div>
                    
                </v-col>
                <v-col>
<!--                    <img style="max-width:600px; border:5px solid #eee; border-radius:5px;" src="https://i.imgur.com/E7qZ312.png" alt="">-->



                    <img style="max-width:600px; border:12px solid #eee; border-radius:12px;" src="../assets/slider.gif" alt="">
                </v-col>


            </v-row>
            <v-divider class="my-12"></v-divider>

            <v-container class="selling-points">

                <!-- first point -->
                <div class="selling-point">
                    <div class="main">
                        <h2>Get Informed</h2>
                        <p>
                            Pull together comprehensive data on open access, institutional citation rates and
                            authorship, APC spending and more.
                        </p>
                    </div>
                    <ul class="extra">
                        <li>
                            <h3>Include Open Access</h3>
                            <p>Get journal-level open access details from Unpaywall, the industry leaders in Open Access
                                data.</p>
                        </li>
                        <li>
                            <h3>Connect with APC spending</h3>
                            <p>Automatically determine how much money your institution pays in open access publishing
                                fees to understand your entire spend to publishers.</p>
                        </li>
                        <li>
                            <h3>Look beyond cost-per-use</h3>
                            <p>Model how citations and authorship from your faculty affect journal value.</p>
                        </li>
                    </ul>
                </div>

                <v-divider class="my-12"></v-divider>

                <!-- second point -->
                <div class="selling-point">
                    <div class="main">
                        <h2>Keep optimizing</h2>
                        <p>
                            Identify cost saving opportunities that work for your institution, given your unique
                            assumptions, usage patterns, and priorities.
                        </p>
                    </div>
                    <ul class="extra">
                        <li>
                            <h3>Stop paying for free content</h3>
                            <p>Calculate <a
                                    href="http://www.ala.org/acrl/sites/ala.org.acrl/files/content/conferences/confsandpreconfs/2017/LeveragingtheGrowthofOpenAccess.pdf">OA-adjusted
                                cost-per-use,</a> excluding OA content when assessing subscription value, and exclude
                                backfile access as well where relevant.</p>
                        </li>
                        <li>
                            <h3>Look ahead five years</h3>
                            <p>Base your decisions on projections of future usage and availability, rather than how
                                things have been. Configure every aspect of the model, to reflect your personal
                                assumptions and risk tolerance--from ILL costs, to the effects of Plan S.</p>
                        </li>
                        <li>
                            <h3>Customize for your institution's values</h3>
                            <p>Balance your serials budget with your institutions's needs, weighing citations,
                                authorships, and speed of access as best fits your community.</p>
                        </li>
                    </ul>
                </div>



                <v-divider class="my-12"></v-divider>

                <!-- third point -->
                <div class="selling-point">
                    <div class="main">
                        <h2>Stay Organized</h2>
                        <p>
                            Bring prices, COUNTER, open access, citations, authorships, and backfile usage together in
                            one place, so you can integrate, experiment, and share.
                        </p>
                    </div>
                    <ul class="extra">
                        <li>
                            <h3>Stop juggling spreadsheets</h3>
                            <p>The easy-to-use web interface brings all your data to one place (though you can still
                                export the data if you can't help yourself!).</p>
                        </li>
                        <li>
                            <h3>Save Scenarios</h3>
                            <p>Want to experiment? Try a few different subscription paths -- maybe one that maximum
                                cost-cutting and another that proposes a read and publish agreement -- and save them as
                                you go so you can come back and compare.</p>
                        </li>
                        <li>
                            <h3>Share with your team</h3>
                            <p>Through our Report View, bring the same data that helped inform your decisions to
                                administration and faculty on your campus as part of your communication strategy.</p>
                        </li>
                    </ul>
                </div>
            </v-container>


            <v-divider class="my-12"></v-divider>




            <div class="my-12 text-center">
                <v-btn x-large class="mr-3" depressed large color="primary">Purchase</v-btn>
                <v-btn x-large @click="loginDemo" outlined large color="primary">Try Demo</v-btn>
            </div>
        </v-card>


    </v-container>


</template>

<script>
    // https://www.npmjs.com/package/vue-vimeo-player
    import {vueVimeoPlayer} from 'vue-vimeo-player'

    export default {
        name: 'home',
        components: {vueVimeoPlayer},
        methods: {
            async loginDemo() {
                console.log("login demo account")
                const path = await this.$store.dispatch("loginDemo")
                console.log("we logged in the demo user", path)
                this.$router.push(path)


            }
        },
        computed: {
            count() {
                return this.$store.getters.count
            }
        },
        mounted() {
        },
    }
</script>
