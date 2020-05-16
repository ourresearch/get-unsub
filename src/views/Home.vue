<template>
    <div class="home">
        <v-card flat class="pa-6">
            <v-row class="top-screen pa-12">
                <v-col>
                    <img style="max-width:600px; border:12px solid #eee; border-radius:12px;"
                         src="https://i.imgur.com/ddWJutv.png"
                         alt="">
                </v-col>
                <v-col>
                    <div class="main-copy">
                        <div class="tagline">
                            <h2 class="display-2 mb-6">
                                Cancel journal subscriptions with confidence.
                            </h2>
                        </div>
                        <div class="about">
                            <p class="title text--secondary">
                                Our forecast model reveals your best serials value at any price point, considering
                                downloads, citations, open access, ala carte pricing, and more.
                            </p>

                        </div>

                        <div class="cta">
                            <div class="mt-5 mr-6 d-flex">

                                <!--                                <v-btn to="/purchase" class="mr-3" depressed large color="primary">Purchase</v-btn>-->
                                <v-text-field
                                        label="Your email"
                                        @keydown.enter="createDemo"
                                        :loading="createDemoLoading"
                                        :readonly="createDemoLoading"
                                        outlined
                                        type="email"
                                        v-model="userEmail"
                                        :error-messages="errorMsg"
                                         style="max-width: 350px"

                                />
                                <v-btn
                                        @click="createDemo"
                                        x-large
                                        :loading="createDemoLoading"
                                        class="main-cta-button ma-0 ml-2"
                                        style="margin-top: 0px !important;"
                                        color="primary">
                                    Try the demo!
                                </v-btn>
                            </div>
                            <router-link v-if="errorMsg" to="/login">Log in to an existing account, instead
                            </router-link>

                        </div>


                    </div>

                </v-col>


            </v-row>
        </v-card>
        <v-card flat tile color="#555">
            <div class="text-center trusted-by white--text caption">
                Trusted by hundreds of acadmic libraries worldwide
            </div>
            <v-container class="logos" style="border-top: 1px solid #666;">
                <!--                <img src="../assets/logos/antwerp.png" style="height: 30px;" alt="">-->
                <img src="../assets/logos/cern.png" style="height: 60px;" alt="">
                <!--<img src="../assets/logos/cornell.png" style="height: 45px;" alt="">-->
                <img src="../assets/logos/dartmouth.png" style="height: 15px;" alt="">
                <img src="../assets/logos/duke.png" style="height: 40px;" alt="">
                <img src="../assets/logos/imperial.png" style="height: 30px;" alt="">
                <img src="../assets/logos/michigan.png" style="height: 30px;" alt="">
                <img src="../assets/logos/mit.png" style="height: 35px;" alt="">
                <img src="../assets/logos/oregon.png" style="height: 30px;" alt="">
                <img src="../assets/logos/pennstate.png" style="height: 40px;" alt="">
                <!--<img src="../assets/logos/smithsonian.png" style="height: 25px;" alt="">-->
                <img src="../assets/logos/tamu.png" style="height: 30px;" alt="">
                <img src="../assets/logos/uva.png" style="height: 30px;" alt="">
                <img src="../assets/logos/vassar.png" style="height: 30px;" alt="">
            </v-container>
        </v-card>
        <v-card flat tile color="blue" class="selling-point-card">
            <div class="selling-point-container">
                <div class="selling-point-text">
                    <h2 class="display-2">
                        Get all the data you need, in one place
                    </h2>
                    <div class="title mt-8">
                        Upload your COUNTER JR1s and we take care of the rest...for every journal, we gather citations
                        and authorship from your faculty, OA percentages, a-la-carte pricing, and more. Setup takes just
                        a few hours.

                    </div>
                </div>
                <div>
                    <img src="../assets/illustrations/gather.png" style="transform: scaleX(-1); width: 300px;" alt="">
                </div>
            </div>
        </v-card>
        <v-card flat tile color="blue" class="selling-point-card">
            <div class="selling-point-container">
                <div>
                    <img src="../assets/illustrations/prediction.png" style="width: 400px;" alt="">
                </div>
                <div class="selling-point-text">
                    <h2 class="display-2">
                        Forecast with confidence
                    </h2>
                    <div class="title mt-8">
                        Predict your costs and fulfillment in different cancellation scenarios, and find the best value
                        for you. Our forecasting model is trained on data from thousands of universities, then
                        customized using your unique data.

                    </div>
                </div>
            </div>
        </v-card>
        <v-card flat tile color="blue" class="selling-point-card">
            <div class="selling-point-container">
                <div class="selling-point-text">
                    <h2 class="display-2">
                        Customize everything
                    </h2>
                    <div class="title mt-8">
                        Try out different assumptions to compare best- and worst-case scenarios...everything in the
                        model can be modified, from per-transaction ILL costs, to exclusion of subtypes of Open Access.
                    </div>
                </div>
                <div>
                    <img src="../assets/illustrations/customize.png" style="width: 300px;" alt="">
                </div>
            </div>
        </v-card>
        <v-card flat tile color="blue" class="selling-point-card">
            <div class="selling-point-container">
                <div>
                    <img src="../assets/illustrations/presentation.png" style="width: 400px;" alt="">
                </div>
                <div class="selling-point-text">
                    <h2 class="display-2">
                        Communicate your message
                    </h2>
                    <div class="title mt-8">
                        Use our PowerPoint-ready graphics and stats to help you share an optimistic, well-researched
                        message to campus stakeholders.


                    </div>
                </div>
            </div>
        </v-card>
        <v-card flat tile color="blue" style="padding: 80px 0;">
            <div class="text-center white--text display-2 mb-12">
                Try the free demo today!
            </div>

            <div>
                <div class="d-flex" style="max-width: 500px; margin: 0 auto;">
                    <v-text-field
                            label="Your email"
                            @keydown.enter="createDemo"
                            :loading="createDemoLoading"
                            :readonly="createDemoLoading"
                            type="email"
                            solo
                            v-model="userEmail"
                            :error-messages="errorMsg"
                    />
                    <v-btn
                            @click="createDemo"
                            large
                            :loading="createDemoLoading"
                            class="ma-0 ml-4"
                            outlined
                            dark
                    >
                        Try demo
                    </v-btn>
                </div>
                <router-link v-if="errorMsg" to="/login">Log in to an existing account, instead</router-link>
            </div>
            <div class="white--text text-center">
                or, go straight to the <router-link class="white--text" to="/purchase">purchase page</router-link>
            </div>

        </v-card>


    </div>


</template>

<script>
    // https://www.npmjs.com/package/vue-vimeo-player
    import {randanimal, randanimalSync} from 'randanimal';
    import {vueVimeoPlayer} from 'vue-vimeo-player'

    export default {
        name: 'home',
        components: {vueVimeoPlayer},
        data() {
            return {
                userEmail: "",
                createDemoLoading: false,
                errorMsg: ""
            }
        },
        methods: {
            async createDemo() {
                this.errorMsg = ""
                this.createDemoLoading = true
                const adjectiveAnimal = randanimalSync()
                const animal = adjectiveAnimal.split(" ")[1]

                try {
                    await this.$store.dispatch("createDemo", {
                        email: this.userEmail,
                        password: "",
                        name: "Anonymous User",
                    })
                } catch (e) {
                    if (!e.response) {
                        console.log("non-axios error!", e)
                        this.errorMsg = "Sorry, there was an error"
                    } else if (e.response.status === 409) {
                        this.errorMsg = "Email already in use"
                    } else {
                        console.log("axios error!", e.response)
                        this.errorMsg = "Sorry, there was an error"
                    }
                } finally {
                    this.createDemoLoading = false
                }
                const data = {
                    user_id: this.$store.getters.userId,
                    name: this.$store.getters.userName,
                }
                if (this.$store.getters.userEmail) data.email = this.$store.getters.userEmail
                this.$intercom.boot(data)
            }
        },
        computed: {
            count() {
                return this.$store.getters.count
            }
        },
        mounted() {
            if (this.$store.getters.userId) this.$router.push("/u")
            this.$store.commit("setIsLandingPage", true)
        },
        destroyed() {
            this.$store.commit("setIsLandingPage", false)
        },
    }
</script>

<style lang="scss">

    .trusted-by {
        opacity: .75;
        padding: 20px;
    }
    .logos {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        padding: 20px 0;

        img {
            max-width: 100%;
            margin: 0 20px 40px;
            opacity: .75;

        }
    }

    .selling-point-card {
        padding: 0;
        margin: 0;
    }

    .selling-point-container {
        display: flex;
        align-items: center;
        justify-content: space-around;
        margin: 0 auto;
        padding: 75px 0;
        max-width: 1100px;
        border-bottom: 7px solid rgba(255, 255, 255, .15);

        .selling-point-text {
            color: #fff;
            max-width: 500px;
        }
    }


</style>
