const journalColGroups = [
    {
        displayName: "Key stats",
        name: "keyStats",
        colNames: [
            "usage",
            "free_instant_usage_percent",
            "instant_usage_percent",
            "cost",
            "ncppu",
            "ncppu_rank",
        ]
    },

    {
        displayName: "Costs",
        name: "costs",
        colNames: [
            "cost",
            "subscription_cost",
            "ill_cost",
            "subscription_minus_ill_cost",
            "ncppu",
        ]
    },

    {
        displayName: "Open Access",
        name: "oa",
        colNames: [
            "use_oa_percent",
            "use_green_percent",
            "use_hybrid_percent",
            "use_bronze_percent",
            "use_peer_reviewed_percent",
        ]
    },

    {
        displayName: "Fulfillment",
        name: "fulfillment",
        colNames: [
            "has_perpetual_access",
            "use_oa_percent",
            "use_backfile_percent",
            "use_asns_percent",
            "use_subscription_percent",
            "use_ill_percent",
            "use_other_delayed_percent",
        ]
    },

    {
        displayName: "Impact",
        name: "impact",
        colNames: [
            "usage",
            "downloads",
            "citations",
            "authorships",
        ]
    },

]


const journalCols = [
    {
        text: "Net cost per paid use",
        value: "ncppu",
        display: "currency",
        descr: "NCPPU is the <strong>net cost</strong> (subscription minus ILL), divided by <strong>Paid Use</strong> (Usage that can't be met with free sources). This is our most important measure of journal value--it summarizes the real value you're getting for your subscription dollar.  <a href='https://support.unpaywall.org/support/solutions/articles/44001822684-cost-effectiveness-ncppu-' target='_blank'>Read more about NCPPU here.</a>",
    },
    {
        text: "Rank by NCPPU",
        value: "ncppu_rank",
        display: "number",
        descr: "The journal's rank by Net cost per paid use (NCPPU), relative to other journals in this dataset. The most cost-effective journal has a rank of 1.",
    },
    {
        text: "Cost",
        value: "cost",
        display: "currency_int",
        descr: "The cost of this journal according to the Settings and Subscription status of the journals in this Scenario.  It will be either Subscription Cost or ILL Cost, depending on whether the journal is currently subscribed to or not in this scenario.",
    },
    {
        text: "Usage",
        value: "usage",
        display: "number",
        descr: "The projected Usage of the journal by your institution.  Usage is a measure of the journal's value to your institution.  It is calculated as: Usage of a journal = Downloads from the journal (Citations to the journal by your authors) * (your selected citation weight) + (Authored papers in the journal) * (your selected authorship weight)",
    },
    {
        text: "Instant Usage Percent",
        value: "instant_usage_percent",
        display: "percent",
        descr: "The percent of Usage that is available instantly -- available as Open Access, Backfile, ASNs, or Subscription.  Or to look at it the other way, all Usage that isn't via ILL or Other (delayed)",
    },
    {
        display: "percent",
        text: "Free Instant Usage Percent",
        value: "free_instant_usage_percent",
        descr: "The percent of Usage that can be met by instantly-available, free sources: Open Access, Backfile, and ASNs. This excludes usage met only by ILL, 'Other (delayed),' or Subscription.",
    },
    {
        text: "Subscription Cost",
        value: "subscription_cost",
        display: "currency_int",
        descr: "The ala carte subscription cost of this journal.  It includes a 'content fee' based on your settings, and annual price increases over the next five years (the cost shown is the average cost over the next five years).  This data is based on public price lists unless you've uploaded a custom price list (available in a purchased account).",
    },
    {
        text: "ILL Cost",
        value: "ill_cost",
        display: "currency_int",
        descr: "The ILL subscription cost of this journal.  It is based on the ILL transaction cost from the settings, and an ILL request rate (adjustable in the settings, though the default is based on an extensive literature search of other institution's experiences).",
    },
    {
        text: "Subscription minus ILL Cost",
        value: "subscription_minus_ill_cost",
        display: "currency_int",
        descr: "The net cost of the subscription, which is the Subscription cost above minus the ILL cost (since almost all universities will offer a journal by ILL if they didn't subscribe).  For some journals with very high Usage and low subscription prices this number is actually negative -- subscribing is *cheaper* than filling all the anticipated ILL requests.",
    },
    {
        text: "% usage from ASNs",
        value: "use_asns_percent",
        display: "number",
        descr: "The percent of Usage that is available from Academic Social Networks like ResearchGate and Academia.edu.  These are not considered open repositories, so papers hosted here are not considered Open Access.  These can be excluded in the settings.",
    },
    {
        text: "% usage from Open Access",
        value: "use_oa_percent",
        display: "number",
        descr: "The percent of Usage that is available as Green, Hybrid, or Bronze Open Access.  Some of this content can be excluded in the settings (see the Open Access page for more info).",
    },
    {
        text: "% usage from backfile",
        value: "use_backfile_percent",
        display: "number",
        descr: "The percent of Usage that is available from your backfile -- the content that you still have access to because it was published while you had a subscription.  If your institution doesn't have Perpetual access you can exclude Backfile in the settings. In a Paid Account you can also upload a customized list of perpetual access availability by journal.",
    },
    {
        text: "% usage from subscription",
        value: "use_subscription_percent",
        display: "number",
        descr: "Percent of Usage that is fulfilled via subscription in this scenario.  Of course if you've subscribed to a journal you can actually fulfill all of it via subscription, but we model that you fulfill via free, instant sources when possible, and only subscription for the remainder of the paywalled content (costs and instant percentages aren't affected by this decision, it mostly just shows up in the fulfillment bar graphs showing fulfillment breakdowns).",
    },
    {
        text: "% usage from ILL",
        value: "use_ill_percent",
        display: "number",
        descr: "Percent of Usage that is fulfilled via ILL in this scenario.  This all Usage that isn't available via a free, instant route multiplied by the ILL request rate (adjustable in the settings, though the default is based on an extensive literature search of other institution's experiences).",
    },
    {
        text: "% usage from 'other (delayed)'",
        value: "use_other_delayed_percent",
        display: "number",
        descr: "Percent of Usage that is fulfilled via Other (delayed) paths in this scenario.  This all Usage that isn't available via a free, instant route and the researcher does not choose to place an ILL request, but instead fulfills their information need another way -- asks the author for a paper, asks a colleague, finds another similar paper that is good enough for their purposes, etc.",
    },
    {
        text: "% usage from Green OA",
        value: "use_green_percent",
        display: "percent",
        descr: "The percent of Usage that is available as Green OA.  This is Open Access hosted on open repositories, like Harvard's institutional repository, arXiv, or PMC.  Green OA that hasn't been peer-reviewed (preprints, submitted drafts, etc) can be excluded in Settings.",
    },
    {
        text: "% usage from Hybrid OA",
        value: "use_hybrid_percent",
        display: "percent",
        descr: "The percent of Usage that is available as Hybrid OA.  This is Open Access hosted on the publisher site with an open license in an otherwise subscription journal.  Usually an APC was paid by the authors when they published this paper.",
    },
    {
        text: "% usage from Bronze OA",
        value: "use_bronze_percent",
        display: "percent",
        descr: "The percent of Usage that is available as Bronze OA.  This is Open Access hosted on the publisher site in an otherwise subscription journal, but unlike Hybrid it does not have an open license.  It is sometimes promotional material, and sometimes open after an embargo in a Delayed OA journal (like Elsevier's Open Archive content).  Bronze OA can be excluded in Settings.",
    },
    {
        text: "% usage from Peer-reviewed OA",
        value: "use_peer_reviewed_percent",
        display: "percent",
        descr: "Percent of Usage that is the peer-reviewed version.  This includes all of Hybrid and Bronze, and the portion of Green OA that is an Accepted or Published version of the paper.  Green OA that hasn't been peer-reviewed (preprints, submitted drafts, etc) can be excluded in Settings.",

    },
    {
        text: "Downloads",
        value: "downloads",
        display: "number",
        descr: "The number of times people in your institution will download papers from this journal.  We base this on your COUNTER statistics and literature on download decay curves (how often an article is to be downloaded based on how long ago it was published).",
    },
    {
        text: "Citations to papers",
        value: "citations",
        display: "float1",
        descr: "The number of times that a paper authored by someone in your institution will cite a paper in this journal.  This number is based on the citations patterns of the previous five years.  The importance of this number to overall Usage is determined by the Citation Weight setting.",
    },
    {
        text: "Authored papers",
        value: "authorships",
        display: "float1",
        descr: "The number of papers in this journal that have at least one author from your institution.  This number is based on the authorship patterns of the previous five years.  The importance of this number to overall Usage is determined by the Authorship Weight setting.",
    },
    {
        text: "Perpetual access",
        value: "has_perpetual_access",
        display: "boolean",
        descr: "Whether or not you have perpetual access to this title.",
    }
]

const scenarioConfigs = {
    cost_alacart_increase: {
        name: "cost_alacart_increase",
        default: 8,
        value: null,
        display: "percent",
        displayName: "A la carte subscription cost growth",
        descr: "The annual percent increase you expect in ala cart subscription prices (literature suggests 8%).",
    },
    cost_bigdeal: {
        name: "cost_bigdeal",
        default: 2100000,
        value: null,
        display: "dollars",
        displayName: "Base cost",
        descr: "The base cost of your package right now -- either your Big Deal cost or the sum of subscriptions you are currently paying."
    },
    cost_bigdeal_increase: {
        name: "cost_bigdeal_increase",
        default: 5,
        value: null,
        display: "percent",
        displayName: "Base cost growth",
        descr: "The annual percent increase you expect in your package price (literature suggests 5% if a Big Deal, 8% if individual subscriptions)."

    },
    cost_content_fee_percent: {
        name: "cost_content_fee_percent",
        default: 5.7,
        value: null,
        display: "percent",
        displayName: "A la carte 'content fee'",
        descr: "A content fee charged by publishers when buying subscriptions ala cart, above whatever is included in your current package price (literature suggests 5.7% for subscriptions)."
    },
    cost_ill: {
        name: "cost_ill",
        default: 17,
        value: null,
        display: "dollars",
        displayName: "ILL transaction cost",
        descr: "The cost of an ILL request for your institution (literature suggests $17 is average).",
    },
    ill_request_percent_of_delayed: {
        name: "ill_request_percent_of_delayed",
        default: 5,
        value: null,
        display: "percent",
        displayName: "ILL frequency, as percent of delayed access",
        descr: "The percent of accesses which you estimate will result in ILL requests, of papers not available instantly (literature suggests 5).",
    },
    include_bronze: {
        name: "include_bronze",
        default: true,
        value: null,
        display: "boolean",
        displayName: "Include Bronze OA",
        descr: "Include Bronze OA as a type of fulfillment.  Bronze OA is when a paper is made freely available on a publisher site without an open license (includes Elsevier's \"open archive\" journals).",
    },
    include_submitted_version: {
        name: "include_submitted_version",
        default: true,
        value: null,
        display: "boolean",
        displayName: "Permit non-peer-reviewed versions",
        descr: "For Green OA, allow submitted versions as a type of fulfillment.  Submitted versions are papers made available in repositories as preprints or other versions that have not yet been peer reviewed.",
    },
    include_social_networks: {
        name: "include_social_networks",
        default: true,
        value: null,
        display: "boolean",
        displayName: "Include ASN-hosted content",
        descr: "Include Academic Social Networks (ASNs) as a type of fulfillment -- these include ResearchGate, Academia.edu, and other social sites where academics post papers that are not open repositories.",
    },
    include_backfile: {
        name: "include_backfile",
        default: true,
        value: null,
        display: "boolean",
        displayName: "Include perpetual-access backfile content",
        descr: "Include backfile content as a type of fulfillment.  Disable to see what fulfillment would be like if you don't have perpetual access.",
    },
    backfile_contribution: {
        name: "backfile_contribution",
        default: 100,
        value: null,
        display: "percent",
        displayName: "Backfile available as perpetual access",
        descr: "Percent of backfile available as perpetual access.  If you estimate that you have perpetual access to 90% of your content, set this to 90%.",
    },
    package: {
        display: false
    },
    weight_authorship: {
        name: "weight_authorship",
        default: 100,
        value: null,
        display: "number",
        displayName: "Institutional authorship weight",
        descr: "A paper authored by someone in your institution contributes this many download-equivalent points to the Usage of the journal.  A common value is 100 -- in this case an authored paper in this journal is modelled as the equivalent of 100 downloads of this journal.",
    },
    weight_citation: {
        name: "weight_citation",
        default: 10,
        value: null,
        display: "number",
        displayName: "Institutional citation weight",
        descr: "A citation from someone in your institution contributes this many download-equivalent points to the Usage of the journal.  A common value is 10 -- in this case a citation from your institution to this journal is modelled as the equivalent of 10 downloads of this journal.",
    },
}


const hydratedJournalColGroups = function () {
    const ret = journalColGroups.map(group => {
        const ret = {...group}
        ret.cols = journalCols.filter(h => {
            return group.colNames.includes(h.value)
        })
        return ret
    })
    return ret
}
const usageSegments = {
    delayed: {
        name: "usageDelayed",
        displayName: "ILL and other delayed",
        displayNameLong: "ILL, Document Delivery, and other delayed access",
        color: "#c5cae9",
        darkColor: "#303F9F",
    },
    subr: {
        name: "usageSubr",
        displayName: "Subscription",
        displayNameLong: "À la carte subscription",
        color: "#ffab91",
        darkColor: "#BF360C",
    },
    oa: {
        name: "usageOa",
        displayName: "Open access",
        displayNameLong: "Open access",
        color: "#a5d6a7",
    },
    backfile: {
        name: "usageBackfile",
        displayName: "Backfile",
        displayNameLong: "Perpetual access backfile",
        color: "#a5d6a7",
    },
    asn: {
        name: "usageAsn",
        displayName: "ResearchGate etc",
        displayNameLong: "ResearchGate and other academic social networks",
        color: "#a5d6a7",
    },
}

const costSegments = {
    savings: {
        name: "costSavings",
        displayName: "Savings",
        displayNameLong: "Cost savings (compared to Big Deal)",
        color: "#eeeeee",
        isCurrency: true,
    },
    subr: {
        name: "costSubr",
        displayName: "Subscription",
        displayNameLong: "À la carte subscription cost",
        color: "#ffab91",
        darkColor: "#BF360C",
        isCurrency: true,
    },
    ill: {
        name: "costIll",
        displayName: "ILL",
        displayNameLong: "Interlibrary Loan and document delivery cost",
        color: "#c5cae9",
        darkColor: "#303F9F",
        isCurrency: true,
    },

}

const barSegments = {
    cost: costSegments,
    usage: usageSegments
}



export default {
    journalColGroups: hydratedJournalColGroups(),
    journalCols,
    scenarioConfigs,
    usageSegments,
    costSegments,
    barSegments,
}