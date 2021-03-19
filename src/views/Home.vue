<template>
    <div class="home">
        <v-card flat class="pt-10">
            <v-container class="text-center mt-10">
                <div class="tagline mt-10">
                    <h1 class="text-h2 mb-6 font-weight-bold">
                        A better way to analyze your Big Deal.
                    </h1>
                </div>
                <div class="text-h5 d-flex justify-center">
                    <p  style="max-width: 600px;">
                    Unsub gives you the data to reevaluate your deal's value, and understand your cancellation
                    options.

                    </p>

                </div>
                <div class="mb-10 ">
                    <v-btn
                            to="./request-demo"
                            x-large
                            class=""
                            color="primary">
                        Get demo
                    </v-btn>

                </div>

<!--                       src="https://i.imgur.com/ddWJutv.png"-->
<!--                this thing is handy: https://browserframe.com/-->
                <v-img
                       src="../assets/screenshot-in-frame.png"
                       width="100%"
                       alt=""></v-img>
            </v-container>

        </v-card>


        <v-card flat tile color="#555">
            <div class="text-center trusted-by white--text caption">
                Used by hundreds of academic libraries worldwide
            </div>
            <v-container class="logos" style="border-top: 1px solid #666;">
                <!--                <img src="../assets/logos/antwerp.png" style="height: 30px;" alt="">-->
                <img src="../assets/logos/cern.png" style="height: 60px;" alt="">
                <!--<img src="../assets/logos/cornell.png" style="height: 45px;" alt="">-->
                <!--                <img src="../assets/logos/dartmouth.png" style="height: 15px;" alt="">-->
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
        <v-card flat tile color="blue" class="selling-point-card pb-12">
            <div class="text-center text-h4 text-sm-h3 white--text pt-12">
                Take the guided tour:
            </div>
            <div class=""
                 style="width: 100% !important; max-width: 1280px; margin: 20px auto; background: #fff; border: 3px solid #444;">
                <vimeo-player ref="player" :video-id="420183913" :options="{'responsive':true}"></vimeo-player>

            </div>
        </v-card>


        <v-card flat tile color="blue" class="selling-point-card">
            <div class="selling-point-container">
                <div class="selling-point-text">
                    <h2 class="text-h4 text-sm-h3">
                        Get all the data you need, in one place
                    </h2>
                    <div class="text-sm-h6  mt-8">
                        Upload your COUNTER JR1s and we take care of the rest...for every journal, we gather citations
                        and authorship from your faculty, OA percentages, à la carte pricing, and more. Setup takes just
                        a few hours.

                    </div>
                </div>
                <div class="d-none d-sm-block">
                    <img src="../assets/illustrations/gather.png" style="transform: scaleX(-1); width: 300px;" alt="">
                </div>
            </div>
        </v-card>
        <v-card flat tile color="blue" class="selling-point-card">
            <div class="selling-point-container">
                <div class="d-none d-sm-block">
                    <img src="../assets/illustrations/prediction.png" style="width: 400px;" alt="">
                </div>
                <div class="selling-point-text">
                    <h2 class="text-h4 text-sm-h3">
                        Forecast with confidence
                    </h2>
                    <div class="text-sm-h6 mt-8">
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
                    <h2 class="text-h4 text-sm-h3">
                        Customize everything
                    </h2>
                    <div class="text-sm-h6 mt-8">
                        Try out different assumptions to compare best-case and worst-case scenarios...everything in the
                        model can be modified, from per-transaction ILL costs, to exclusion of subtypes of Open Access.
                    </div>
                </div>
                <div class="d-none d-sm-block">
                    <img src="../assets/illustrations/customize.png" style="width: 300px;" alt="">
                </div>
            </div>
        </v-card>
        <v-card flat tile color="blue" class="selling-point-card">
            <div class="selling-point-container">
                <div class="d-none d-sm-block">
                    <img src="../assets/illustrations/presentation.png" style="width: 400px;" alt="">
                </div>
                <div class="selling-point-text">
                    <h2 class="text-h4 text-sm-h3">
                        Communicate your message
                    </h2>
                    <div class="text-sm-h6 mt-8">
                        Use our PowerPoint-ready graphics and stats to help you share a positive, well-researched
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
                you can also
                <router-link class="white--text" to="/purchase">purchase an account now,</router-link>
                or
                <a
                        :href="`mailto:team@ourresearch.org?subject=${productTourEmailSubject}&body=${productTourEmailSubject}`"
                        style="color: white; text-decoration: underline;"
                >
                    schedule a product tour.
                </a>
            </div>

        </v-card>


        <v-dialog max-width="400" v-model="mobileCreateDemoDialogIsShowing">
            <v-card>
                <v-toolbar dark flat color="primary">
                    <v-toolbar-title>
                        <v-icon>mdi-desktop-mac</v-icon>
                        Desktop required
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon text @click="mobileCreateDemoDialogIsShowing = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <div class="pa-6">
                    Sorry, but we can't currently create demo accounts from mobile devices. Please try again
                    later from a desktop computer.
                </div>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                            depressed
                            color="primary"
                            @click="mobileCreateDemoDialogIsShowing = false"
                    >
                        OK
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>


    </div>


</template>

<script>
    // https://www.npmjs.com/package/vue-vimeo-player
    import {randanimal, randanimalSync} from 'randanimal';
    import {vueVimeoPlayer} from 'vue-vimeo-player'

    export default {
        name: 'home',
        components: {vimeoPlayer: vueVimeoPlayer},
        metaInfo: {
            // title: "Unsub: Get the data you need to reassess your library's Big Deal",
            // title: "Unsub: Library journals assessment dashboard for your Big Deal.",
            title: "Unsub: Library journals assessment tool for your Big Deal",
            titleTemplate: undefined, // have to override this or it'll get the site title template
        },
        data() {
            return {
                userEmail: "",
                createDemoLoading: false,
                mobileCreateDemoDialogIsShowing: false,
                errorMsg: ""
            }
        },
        computed: {
            count() {
                return this.$store.getters.count
            },
            productTourEmailSubject() {
                return encodeURIComponent("I'd like to schedule an Unsub product tour")
            },
        },
        methods: {
            async createDemo() {
                if (this.$vuetify.breakpoint.mdAndDown) {
                    this.mobileCreateDemoDialogIsShowing = true
                    return
                }

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
            padding: 0 10px;;
        }
    }


</style>
