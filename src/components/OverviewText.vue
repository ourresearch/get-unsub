<template>
    <!--




       this is just a temporary place to store the text block from the Overview tab.




     -->

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
                                    <info-link v-if="pkg" :text="pkg.numJournals.toLocaleString() + ' journals'"
                                               info-key="Big Deal journals"></info-link>


                                    that were included in your Big Deal. Click the blue "Find best deal" button to change this (and see how it affects costs and access).
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
                                        scenario.configs.cost_ill).toLocaleString(undefined, {maximumFractionDigits: 0}) }} annual requests
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
</template>

<script>
    export default {
        name: "OverviewText"
    }
</script>

<style scoped>

</style>