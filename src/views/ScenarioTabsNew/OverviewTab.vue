<template>
    <v-container fluid v-if="scenario" :class="{loading: $store.state.loading > 0}">
        <v-card>
            <v-toolbar flat>
                <div>
                    <h2 class="display-1">
                        Scenario overview
                        <v-btn icon
                               href="https://support.unpaywall.org/support/solutions/articles/44001822204-page-overview"
                               target="_blank">
                            <v-icon>mdi-information-outline</v-icon>
                        </v-btn>

                    </h2>
                </div>
                <v-spacer></v-spacer>
                <!--                <v-text-field-->
                <!--                        v-model="search"-->
                <!--                        append-icon="mdi-magnify"-->
                <!--                        label="Search"-->
                <!--                        flat-->
                <!--                        solo-->
                <!--                        outlined-->
                <!--                        hide-details-->
                <!--                ></v-text-field>-->

            </v-toolbar>


            <v-divider></v-divider>


            <v-card>
                <div class="pa-3" v-if="data">
                    <v-row>
                        <v-col >

                            <div class="text-summary">

                                <p>
                                    This scenario helps you answer the question: Over the next five years, what would it
                                    look like to cancel your
                                    Elsevier Big Deal package, and partly replace it
                                    with a-la-carte subscriptions?
                                </p>


                                <h2 class="title">A-la-carte subscriptions</h2>
                                <p>
                                    You’re now
                                    <info-link :text="'subscribed to '+numSubscribedJournalsStr"
                                               info-key="Subscribed journals"></info-link>
                                    out of the
                                    <info-link :text="pkg.numJournals.toLocaleString() + ' journals'"
                                               info-key="Big Deal journals"></info-link>


                                    that were included in your Big Deal.
                                </p>

                                <h2 class="title">Costs</h2>
                                <p>
                                    In this scenario, you’ll spend {{cost | currency}} annually (that’s
                                    {{(subrCostPercent + illCostPercent) | round}}% of the
                                    <config-edit-link :text="data._summary.cost_bigdeal_projected | currency"
                                                      config-key="cost_bigdeal"></config-edit-link>
                                    you’d
                                    spend on your Big Deal). Your costs are:
                                </p>
                                <ul>
                                    <li>
                                        Interlibrary Loan (ILL): {{ (illCost /
                                        scenario.configs.cost_ill).toLocaleString() }} annual requests
                                        <config-edit-link :text="'@$' + scenario.configs.cost_ill + '/request'"
                                                          config-key="cost_ill"></config-edit-link>
                                        = {{ illCost | currency }} per year
                                    </li>
                                    <li>
                                        A-la-carte subscriptions: based on your selected subscriptions and
                                        <info-link text="Elsevier's public price list"
                                                   info-key="Journal prices"></info-link>
                                        , you’ll spend an average of {{ subrCost | currency }}/year on these.
                                    </li>
                                </ul>


                                <h2 class="title pt-4">Fulfillment</h2>
                                <p>
                                    Your usage is based on downloads as reported in the COUNTER files you’ve uploaded.
                                    It also includes the times a journal was cited by your faculty, and the times your
                                    faculty authored in a journal (each citation is counted as
                                    <config-edit-link :text="scenario.configs.weight_citation"
                                                      config-key="weight_citation"></config-edit-link>
                                    downloads, and each
                                    authorship counts as
                                    <config-edit-link :text="scenario.configs.weight_authorship"
                                                      config-key="weight_authorship"></config-edit-link>
                                    downloads).
                                </p>
                                <p>
                                    Under the assumptions of this scenario, fulfillment of usage breaks down like this:
                                </p>
                                <ul>
                                    <li>
                                        <span class="num">
                                            {{(usage.ill + usage.otherDelayed) | round }}%
                                        </span>
                                        Delayed fulfillment:
                                        <ul>
                                            <li>
                                                <span class="num">
                                                    {{usage.ill | round}}%
                                                </span>
                                                <info-link text="Interlibrary loan" info-key="Ill estimate"></info-link>
                                            </li>
                                            <li>
                                                <span class="num">
                                                    {{usage.otherDelayed | round}}%
                                                </span>
                                                Other Delayed (emailing colleagues, #icanhazpdf, alternative articles,
                                                etc)
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        <span class="num">
                                            {{instantUsage | round}}%
                                        </span>
                                        Instant fulfillment (users get the resource at once)
                                        <ul>
                                            <li>
                                                <span class="num">
                                                    {{ usage.subr | round }}%
                                                    <!--                                                    ({{ usageRaw.subr |round }} raw)-->
                                                </span>
                                                Subscription fullfillment
                                            </li>
                                            <li>
                                                <span class="num">
                                                    {{(instantUsage - usage.subr) | round}}%
                                                </span>
                                                Free instant fulfillment
                                                <ul>
                                                    <li>
                                                        <span class="num">
                                                            {{ usage.oa | round }}%
                                                        </span>
                                                        Open Access, which includes
                                                        <config-edit-link :text="bronzeConfigLinkStr"
                                                                          config-key="include_bronze"></config-edit-link>
                                                        , Hybrid, and Green OA
                                                    </li>
                                                    <li>
                                                        <span class="num">
                                                            {{ usage.backfile | round }}%
                                                        </span>
                                                        <config-edit-link text="Perpetual access backfile"
                                                                          config-key="include_backfile"></config-edit-link>
                                                        content the library has already purchased.
                                                    </li>
                                                    <li>
                                                        <span class="num">
                                                            {{ usage.asn | round }}%
                                                        </span>


                                                        ResearchGate and other


                                                        <config-edit-link :text="asnConfigLinkStr"
                                                                          config-key="include_social_networks"></config-edit-link>
                                                    </li>
                                                </ul>
                                            </li>


                                        </ul>
                                    </li>
                                </ul>


                            </div>


<!--                            <div class="text-summary">-->
<!--                                <v-alert text type="info" v-if="false && journalsCheaperToSubscribe.length">-->
<!--                                    <div>-->
<!--                                        You could save money by subscribing to the <strong>{{-->
<!--                                        journalsCheaperToSubscribe.length }}</strong> journals where subscription is-->
<!--                                        cheaper than ILL.-->
<!--                                    </div>-->
<!--                                    <div>-->
<!--                                        <v-btn @click='$store.dispatch("openWizard")' class="mt-4" depressed-->
<!--                                               color="info">show me-->
<!--                                        </v-btn>-->
<!--                                    </div>-->
<!--                                </v-alert>-->
<!--                            </div>-->


                        </v-col>


                        <v-col class="infovis">
                            <v-row>
                                <v-col class="1 slider-col lift" cols="">
                                    <v-slider
                                            v-model="sliderPercent"
                                            color="info"
                                            vertical
                                            :disabled="!editMode"
                                            @end="sliderEnd"
                                    ></v-slider>
                                </v-col>
                                <v-col cols="4" class="currency-area lift bar-col">
                                    <div class="under-bar">
                                        <div class="label top">
                                            Total cost
                                        </div>
                                        <div class="num font-weight-bold main-number ">
                                            {{(subrCostPercent+illCostPercent) | round}}%
                                        </div>
                                    </div>
                                    <div class="bar-wrapper">
                                        <div class="bar-fill bar">
                                            <strong>
                                                {{ savingsPercent | round }}%
                                            </strong>
                                            Cost savings
                                        </div>
                                        <div class="bar cost" :style="{height: subrCostPercent+'%'}">
                                            <strong>{{subrCostPercent | round}}%</strong>
                                            Subscription
                                        </div>
                                        <div class="bar cost" :style="{height: illCostPercent +'%'}">
                                            <strong>{{illCostPercent | round}}%</strong>
                                            ILL
                                        </div>
                                    </div>

                                </v-col>

                                <v-col cols="4" class="usage-area lift bar-col">
                                    <div class="under-bar">
                                        <div class="label top">
                                            Fulfillment
                                        </div>
                                        <div class="num font-weight-bold main-number ">
                                            {{instantUsage | round}}%
                                        </div>
                                    </div>

                                    <div class="bar-wrapper">
                                        <div class="bar delayed bar-fill">
                                            <strong>{{usage.ill + usage.otherDelayed | round}}%</strong>
                                            ILL and other
                                        </div>
                                        <div class="bar paid instant" :style="{height: usage.subr+'%'}">
                                            <strong>{{usage.subr | round}}%</strong>
                                            Subscription
                                        </div>
                                        <div class="bar free instant" :style="{height: usage.oa+'%'}">
                                            <strong>{{usage.oa | round}}%</strong>
                                            OA
                                        </div>
                                        <div class="bar free instant" :style="{height: usage.backfile+'%'}">
                                            <strong>{{usage.backfile | round}}%</strong>
                                            Backfile
                                        </div>
                                        <div class="bar free instant" :style="{height: usage.asn+'%'}">
                                            <strong>{{usage.asn | round}}%</strong>
                                            ResearchGate etc
                                        </div>
                                    </div>

                                </v-col>


                                <v-col cols="4" class="journals-area lift bar-col journals">
                                    <div class="under-bar">
                                        <div class="label top">
                                            Subscriptions
                                        </div>
                                        <div class="num font-weight-bold main-number ">
                                            {{subscribedJournals.length}}
                                        </div>
                                    </div>
                                    <div class="dots-bar-wrapper">
                                        <div v-for="journal in data.journals"
                                             :key="journal.issn_l"
                                             class="journal-dot"
                                             :class="{subscribed: journal.subscribed}"
                                        >
                                        </div>

                                    </div>
                                </v-col>

                            </v-row>

                            <v-row>
                                <v-col class="pt-0">
                                    <div v-if="!editMode">
                                        <v-btn
                                                @click='startEdit'
                                                class="mt-4"
                                                :disabled="$store.getters.loading"
                                                depressed color="info">edit subscriptions
                                        </v-btn>
                                    </div>
                                    <div v-if="editMode" class="mt-8">
                                        <v-btn depressed
                                               :loading="makeItSoLoading"
                                               @click="makeItSo"
                                               class="mr-2"
                                               color="info">
                                            Save subscriptions
                                        </v-btn>
                                        <v-btn depressed
                                               @click="cancelEdit"

                                               outlined>cancel
                                        </v-btn>
                                    </div>
                                </v-col>
                            </v-row>


                        </v-col>


                    </v-row>
                </div>

            </v-card>
        </v-card>

        <info-dialog></info-dialog>
        <scenario-config-dialog></scenario-config-dialog>
    </v-container>

</template>

<script>
    import _ from "lodash"
    import {api} from "../../api.js"
    import InfoDialog from "../../components/InfoDialog"
    import InfoLink from "../../components/InfoLink"

    import ScenarioConfigDialog from "../../components/ScenarioConfigDialog"
    import ConfigEditLink from "../../components/ConfigEditLink"

    export default {
        components: {
            InfoLink,
            InfoDialog,
            ConfigEditLink,
            ScenarioConfigDialog,
        },
        name: "SliderTab",
        data() {
            return {
                sliderPercent: 0,
                barHeight: 500,
                makeItSoLoading: false,
                search: "",
                data: null,
                sliderPercentAtStartOfEdit: null,
                journalsAtStartOfEdit: null,
            }
        },
        computed: {
            account() {
                return this.$store.state.account
            },
            pkg() {
                return this.$store.getters.selectedPkg
            },
            scenario() {
                return this.$store.getters.selectedScenario
            },
            scenarioId() {
                return this.$route.params.scenarioId
            },

            journalsCheaperToSubscribe() {
                return this.data.journals.filter(j => {
                    return j.cost_subscription_minus_ill < 0
                })
            },
            cost() {
                return .01 * (this.subrCostPercent + this.illCostPercent) * this.data._summary.cost_bigdeal_projected
            },
            costFromSlider() {
                const sliderCost = .01 * this.sliderPercent * this.data._summary.cost_bigdeal_projected
                return sliderCost
                return Math.max(sliderCost, this.illCost)
            },
            subrCostPercent() {
                return 100 * this.subrCost / this.data._summary.cost_bigdeal_projected
            },
            illCostPercent() {
                return 100 * this.illCost / this.data._summary.cost_bigdeal_projected
            },
            savingsPercent() {
                return 100 - (this.subrCostPercent + this.illCostPercent)
            },
            subrCost() {
                return this.data.journals
                    .filter(j => !!j.subscribed)
                    .map(j => j.cost_subscription)
                    .reduce((a, b) => a + b, 0)
            },
            illCost() {
                return this.data.journals
                    .filter(j => !j.subscribed)
                    .map(j => j.cost_ill)
                    .reduce((a, b) => a + b, 0)
            },
            loading() {
                return this.$store.state.tabDataLoading
            },
            barCols() {
                return 2
            },

            subscribedJournals() {
                return this.data.journals.filter(j => !!j.subscribed)
            },

            numSubscribedJournalsStr() {
                let ret = this.subscribedJournals.length.toLocaleString() + " journal"
                if (this.subscribedJournals.length !== 1) ret += "s"
                return ret
            },

            usageRaw() {
                const ret = {
                    oa: 0,
                    backfile: 0,
                    asn: 0,
                    ill: 0,
                    otherDelayed: 0,
                    subr: 0,
                }
                this.data.journals.forEach(j => {
                    ret.oa += j.use_groups_free_instant.oa
                    ret.backfile += j.use_groups_free_instant.backfile
                    ret.asn += j.use_groups_free_instant.social_networks

                    if (j.subscribed) {
                        ret.subr += j.use_groups_if_subscribed.subscription
                    } else {
                        ret.ill += j.use_groups_if_not_subscribed.ill
                        ret.otherDelayed += j.use_groups_if_not_subscribed.other_delayed
                    }
                })
                return ret
            },

            usage() {
                const ret = {}
                const total = this.tempTotalUsage
                Object.keys(this.usageRaw).forEach(k => {
                    ret[k] = 100 * this.usageRaw[k] / total
                })
                return ret
            },
            tempTotalUsage() {
                return Object.values(this.usageRaw).reduce((a, b) => a + b, 0)
            },
            instantUsage() {
                const usage = this.usage
                return usage.oa + usage.backfile + usage.asn + usage.subr
            },
            tabDataDigest() {
                return this.$store.getters.tabDataDigest
            },
            numJournals() {
                return this.data && this.data.journals.length
            },
            editMode() {
                return this.$store.state.editMode
            },
            bronzeConfigLinkStr() {
                const abled = (this.scenario.configs.include_bronze)
                    ? "enabled"
                    : "disabled"
                return `Bronze (${abled})`
            },
            asnConfigLinkStr() {
                const abled = (this.scenario.configs.include_social_networks)
                    ? "enabled"
                    : "disabled"
                return `academic social networks (${abled})`
            },


        },
        methods: {
            sliderEnd() {
                if (this.sliderPercent < this.illCostPercent) {
                    this.sliderPercent = this.illCostPercent
                }
            },
            cancelEdit() {
                this.sliderPercent = this.sliderPercentAtStartOfEdit
                this.data.journals = this.journalsAtStartOfEdit
                // this.updateJournals()
                this.$store.commit("clearEditMode")
            },
            startEdit() {
                this.$store.commit("setEditMode")
                this.sliderPercentAtStartOfEdit = this.sliderPercent
                this.journalsAtStartOfEdit = _.cloneDeep(this.data.journals)
                console.log("starting edit")
            },
            async getData() {

                const path = `scenario/${this.scenarioId}/slider`
                const resp = await api.get(path)
                this.data = resp.data
                this.sliderPercent = this.subrCostPercent + this.illCostPercent
                this.sliderEnd()
            },

            async makeItSo() {
                this.$store.commit("clearEditMode")
                this.makeItSoLoading = true
                const subrIssnls = this.data.journals
                    .filter(j => j.subscribed)
                    .map(j => j.issn_l)

                this.$store.commit("setSubrs", subrIssnls)
                await this.$store.dispatch("updateScenario")

                this.makeItSoLoading = false
                this.$store.commit('snackbar', "Subscriptions updated!", "info")

            },
            updateJournals() {
                if (!this.data) return

                const myMax = this.costFromSlider

                // unsubscribe all
                this.data.journals.forEach(j => j.subscribed = false)

                // ILL cost must be paid regardless
                let mySpendSoFar = this.data.journals.map(j => j.cost_ill).reduce((a, b) => a + b, 0)

                // subscribe to journals where subr is cheaper than ILL
                this.data.journals.forEach(j => {
                    if (j.cost_subscription_minus_ill < 0) {
                        j.subscribed = true
                        mySpendSoFar += j.cost_subscription_minus_ill
                    }
                })

                if (mySpendSoFar >= myMax) return


                // subscribe to as many other journals as we can afford
                this.data.journals.forEach(j => {
                    mySpendSoFar += j.cost_subscription_minus_ill
                    if (mySpendSoFar <= myMax) {
                        j.subscribed = true
                    } else {
                        j.subscribed = false
                    }
                })

            },
        },
        mounted() {
            const pkgId = this.$route.params.pkgId

            this.$store.dispatch("fetchPkg", pkgId)
            this.$store.dispatch("fetchScenario", this.scenarioId)
            this.getData()
        },
        watch: {
            sliderPercent: function (to, from) {
                if (this.editMode) {
                    this.updateJournals()
                }
            },

            editMode: function (to, from) {
                console.log("edit mode changed")
                if (this.editMode) {
                    this.sliderEnd()
                }
            },

            '$store.getters.scenarioDigest': function (to) {
                console.log("digest changed, run getDAta()")
                this.getData()
            }
        }
    }
</script>

<style lang="scss">
    $bar-height: 400px;

    .tab.loading {
        opacity: .5;
        transition: opacity .25s ease-in-out;
    }

    .text-summary {
        /*font-size: 20px;*/
        /*line-height: 1.5;*/

    }

    .infovis {
        flex: 0 0 500px;
        min-width: 500px;
    }

    .bar-col {
        flex: 0 0 30%;
        max-width: 30%;

        &.journals {
            /*flex: 0 0 16%;*/
            /*max-width: 16%;*/
        }
    }

    .under-bar {
        padding: 10px 0;
        line-height: 1;
        display: flex;
        font-size: 18px;
        align-items: center;

        .main-number {
            /*font-size: 50px;*/
            /*color: #333;*/
            /*text-align: center;*/
            font-size: 20px;
            display: none;


        }


        .label {
            font-weight: bold;
            width: 100%;
            text-align: center;
        }
    }

    .journal-dot {
        background: #ccc;
        height: 4px;
        width: 4px;
        border-radius: 5px;
        margin: 1px 1px 0 0;
        line-height: .1;
        display: block;

        &.subscribed {
            background: dodgerblue;
        }
    }


    .lift {
        // margin-top: -80px;
    }

    .slider-col {
        padding-top: 53px;
        flex: 0 0 1%;
    }

    .v-slider--vertical {
        height: $bar-height !important;
        margin: 0 !important;
    }

    .dots-bar-wrapper {
        height: $bar-height;
        display: block;
        display: flex;
        flex-wrap: wrap-reverse;
    }

    .bar-wrapper {
        height: $bar-height;
        display: flex;
        flex-direction: column;

        .bar-fill {
            background: #ccc;
            flex-grow: 1000;
        }

        .bar {
            padding-left: 3px;
            border-top: 1px solid #eee;
            font-size: 12px;
            color: #fff;

            &.cost {
                background: #555;
            }

            &.free {
                background: green;
            }

            &.paid.instant {
                background: dodgerblue;
            }
        }
    }

</style>