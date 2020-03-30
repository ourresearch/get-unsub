<template>
    <v-dialog
            v-model="helpDialogIsOpen"
            width="600"
    >
        <template v-slot:activator="{ on }">
            <div class="bar-segment"
                 v-on="on"
                 :style="{height: percentage+'%', background: configObj.color, color: configObj.barTextColor}">
                <strong v-if="!configObj.isCurrency">{{percentage | round}}%</strong>
                <strong v-if="configObj.isCurrency">{{count | currency}}</strong>
                <span style="opacity: 0.7;">
                    {{configObj.displayName}}

                </span>
            </div>
        </template>

        <v-card>
            <v-toolbar flat :color="configObj.color" class="mb-3">
                <v-toolbar-title>
                    <v-icon class="pr-2">mdi-information-outline</v-icon>
                    <span v-if="configObj.isFree">Free fulfillment: </span>


                    {{configObj.displayNameLong}}

                </v-toolbar-title>
            </v-toolbar>
            <div class="subtitle-1 ma-5">
                <div v-if="configObj.name=='costSavings'">
                    <p>In this scenario, after cancelling your Big Deal you'll save an average of <strong>{{count | currency}}</strong> per year over the next five years, compared to what you <em>would’ve</em> spent on the Big Deal (that's a savings of {{percentage | round}}%).
                    </p>
                </div>
                <div v-if="configObj.name=='costSubr'">
                    <p>In this scenario, after cancelling your Big Deal you <color-highlighted-phrase color-key="subr" text="subscribe a la carte" /> to {{numJournalsSubscribed | round}} individual journals, paying list price for each one. We forecast this particular set of {{numJournalsSubscribed | round }} journals will cost on average <strong>{{count | currency}}/yr</strong> over the next five years.
                    </p>
                    <p>
                        This projection includes an estimated <strong>{{settings.cost_alacart_increase}}%</strong> annual increase in journal list price, based on historical pricing data. You can modify this number in settings.
                    </p>
                </div>
                <div v-if="configObj.name=='costIll'">
                    <p>
                        In this scenario, you cancel your Big Deal and <color-highlighted-phrase color-key="subr" text="subscribe à la carte" /> to
                        {{numJournalsSubscribed | round}} individual journals.
                    </p>
                    <P>

                        That leaves {{numJournals -
                        numJournalsSubscribed | round}} journals where you'll need to fulfill usage using either <color-highlighted-phrase color-key="freeInstant" text="free sources" /> (backfile, Open Access) or <color-highlighted-phrase color-key="ill" text="ILL," /> which isn't free to the library. We forecast your average annual ILL spend in this scenario at <strong>{{count | currency}}/yr</strong> over the next five years.
                    </p>
                    <p>
                        We arrive at this estimate by projecting how much usage <em>can't</em> be met by subscription or  free sources, then applying industry average estimates for ILL transaction cost and frequency. You can customize these estimates in settings.
                    </p>
                </div>

                <div v-if="configObj.name=='usageDelayed'">
                    <p>
                        In this scenario, we forecast  <strong>{{count | round}}</strong> annual uses cannot be fulfilled by any <color-highlighted-phrase color-key="freeInstant" text="free source," /> nor will they be fulfilled by one of your   {{numJournalsSubscribed | round}} à la carte journal <color-highlighted-phrase color-key="subr" text="subscriptions." />
                    </p>
                    <p class="mb-0 pb-0">
                        Surveys and user studies show that in these cases, users turn to a mixture of:
                    </p>
                    <ul class="pt-0 mt-0">
                        <li>Interlibrary Loan</li>
                        <li>Document delivery (eg Reprints Desk, CCC Get It Now)</li>
                        <li>Requesting the resource from a colleague</li>
                        <li>Twitter requests using the #icanhazpdf hashtag</li>
                        <li>Finding a replacement or complement article</li>
                        <li>Pirate websites like Sci-Hub</li>
                    </ul>

                    <p class="pt-2">
                        While the literature on some of these sources remains limited, there's a large and robust body of research and case studies reporting the prevalence of ILL and document delivery requests in  the wake of Big Deal cancellations.
                    </p>
                    <p>

                        Based on this research, we can estimate that ILL/DD will account for about
                        <strong>{{settings.ill_request_percent_of_delayed}}%</strong> of this segment, or about <strong>{{ 0.01 *  settings.ill_request_percent_of_delayed * count | round}}</strong> requests annually.
                    </p>
                </div>

                <div v-if="configObj.name=='usageSubr'">
                    In this scenario, we forecast  <strong>{{count | round}}</strong> annual uses cannot be fulfilled by any <color-highlighted-phrase color-key="freeInstant" text="free source," />, but <em>can</em> be fulfilled by one of the {{ numJournalsSubscribed  | round}} journals where you have your à la carte <color-highlighted-phrase color-key="subr" text="subscription" /> access.
                </div>

                <div v-if="configObj.name=='usageBackfile'">
                    <p>
                        In this scenario, we forecast <strong>{{count | round}}</strong> annual uses will be fulfilled by your  perpetual-access backfile (historical content you've already paid for), even though they can't be fulfilled via Open Access.
                    </p>
                    <p>
                        Backfile fulfillments will trend downward every year after a cancellation, as perpetual access content becomes increasingly stale. For some titles (eg in biomed), readers mostly care about  new content, and so the backfile loses value quickly after cancellation. In others (eg in math), old content stays relevant for a long time, and so the backfile will fulfill a lot of usage for years to come. Our model accounts for this.
                    </p>
                    <p>
                        By default, we assume you've got perpetual access to all purchased content since 2010. You can modify that assumption by uploading custom perpetual access date ranges.
                    </p>
                </div>

                <div v-if="configObj.name=='usageOa'">
                    <p>
                        In this scenario, we forecast  <strong>{{count | round}}</strong> annual uses can be fulfilled <color-highlighted-phrase color-key="freeInstant" text="for free" /> by Open Access copies.
                    </p>
                    <p class="pb-0 mb-0">
                        Importantly, this OA content isn't just floating around on the internet somewhere! You can integrate it into library systems, creating a smooth access experience for users:
                    </p>
                    <ul>
                        <li>
                            Unpaywall OA links are already included in results pages from Web of Science, Scopus, OCLC WorldCat, EBSCO EDS, and many other vendors.
                        </li>
                        <li>
                            Unpaywall can be enabled as a source in link resolvers including SFX, Primo, and others. This will automatically deliver an OA copy of requested resources to users, instead of showing them a turnaway/ILL screen.
                        </li>
                        <li>
                            Users can install the free Unpaywall browser extension, which automatically delivers OA copies of paywalled articles as users encounter them in their browsing.
                        </li>
                    </ul>


                </div>


            </div>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="helpDialogIsOpen = false">close</v-btn>
            </v-card-actions>
        </v-card>


    </v-dialog>
</template>

<script>
    import colorHighlightedPhrase from "../colorHighlightedPhrase";
    export default {
        components: {
            colorHighlightedPhrase,
        },
        name: "OverviewGraphicBarSegment",
        props: {
            count: Number,
            countTotal: Number,

            // from the config
            configObj: Object,

            numJournals: Number,
            numJournalsSubscribed: Number,
        },
        data() {
            return {
                helpDialogIsOpen: false
            }
        },
        computed: {
            percentage() {
                return 100 * this.count / this.countTotal
            },
            settings() {
                return this.$store.getters.configs
            },
        }
    }
</script>

<style scoped lang="scss">
    .bar-segment {
        padding-left: 3px;
        border-top: 1px solid #eee;
        font-size: 12px;
        cursor: help;
        color: #333;

        &:hover {
            /*background: #444 !important;*/
            opacity: 1;
        }
    }
</style>