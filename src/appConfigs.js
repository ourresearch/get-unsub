const journalColGroups = [
    {
        displayName: "Cost Effectiveness",
        name: "keyStats",
        colNames: [
            "cpu",
            "cpu_rank",
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
            "usage",
            "free_instant_usage_percent",
            "instant_usage_percent",
            "perpetual_access_years_text",
            "baseline_access_text",
            "use_oa_percent",
            "use_backfile_percent",
            "use_social_networks_percent",
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
        text: "Cost per use",
        value: "cpu",
        display: "currency",
        descr: "Cost per use (CPU) is the <strong>net cost</strong> (subscription minus ILL), divided by <strong>Paid Use</strong> (Usage that can't be met with free sources). This measures the real value you're getting for your subscription dollar.",
    },
    {
        text: "Rank by CPU",
        value: "cpu_rank",
        display: "number",
        descr: "The journal's rank by Cost Per Use (CPU) relative to other journals in this dataset. The most cost-effective journal has a rank of 1.",
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
        descr: "The percent of Usage that is available instantly -- available as Open Access, PTA, or Subscription.",
    },
    {
        display: "percent",
        text: "Free Instant Usage Percent",
        value: "free_instant_usage_percent",
        descr: "The percent of Usage that can be fulfilled via Open Access or PTA. This excludes usage met only by ILL or Subscription.",
    },
    {
        text: "Subscription Cost",
        value: "subscription_cost",
        display: "currency_int",
        descr: "The title-by-title subscription cost of this journal.  It includes a 'content fee' based on your settings, and annual price increases over the next five years (the cost shown is the average cost over the next five years).  This data is based on public price lists unless you've uploaded a custom price list (available in a purchased account).",
    },
    {
        text: "ILL Cost",
        value: "ill_cost",
        display: "currency_int",
        descr: "The ILL subscription cost of this journal.  It is based on the ILL transaction cost and your ILL Request Rate, both of which are adjustable parameters.",
    },
    {
        text: "Subscription minus ILL Cost",
        value: "subscription_minus_ill_cost",
        display: "currency_int",
        descr: "The net cost of the subscription, which is the Subscription cost above minus the ILL cost (since almost all universities will offer a journal by ILL if they didn't subscribe).  For some journals with very high Usage and low subscription prices this number is actually negative -- subscribing is *cheaper* than filling all the anticipated ILL requests.",
    },
    {
        text: "% usage fulfilled by ResearchGate",
        value: "use_social_networks_percent",
        display: "number",
        descr: "The percent of Usage that can be fulfilled by ResearchGate and other Academic Social Networks. This can be excluded in the settings.",
    },
    {
        text: "% usage fulfilled by Open Access",
        value: "use_oa_percent",
        display: "number",
        descr: "The percent of Usage that can be fulfilled by Green, Hybrid, or Bronze Open Access.  Some of this content can be excluded in the settings (see the Open Access page for more info).",
    },
    {
        text: "% usage fulfilled by PTA rights",
        value: "use_backfile_percent",
        display: "number",
        descr: "The percent of Usage that can be fulfilled via your PTA (Post-Termination Access) rights.",
    },
    {
        text: "% usage fulfilled by subscription",
        value: "use_subscription_percent",
        display: "number",
        descr: "Percent of Usage that can be fulfilled ONLY via title-by-title subscription in this scenario--after fulfilling requests via Open Access and PTA fulfillment wherever possible.",
    },
    {
        text: "% usage fulfilled by ILL",
        value: "use_ill_percent",
        display: "number",
        descr: "Percent of Usage that is fulfilled via ILL in this scenario.  This is simply turnaways (Usage that can't be fulfilled by Open Access, PTA, or your title-by-title subscriptions) multiplied by your ILL Request Rate parameter.",
    },
    {
        text: "% usage fulfilled by Unknown",
        value: "use_other_delayed_percent",
        display: "number",
        descr: "Percent of Usage that is fulfilled via Unknown paths in this scenario.  This all Usage that isn't fulfilled by Open Access, PTA rights, title-by-title subscription or ILL. Instead, the user fulfills their information need some other way -- asks the author for a paper, asks a colleague, finds another similar paper that is good enough for their purposes, etc.",
    },
    {
        text: "% usage fulfilled by Green OA",
        value: "use_green_percent",
        display: "percent",
        descr: "The percent of Usage that can be fulfilled via Green OA.  This is Open Access hosted on open repositories, like Harvard's institutional repository, arXiv, or PMC.  Green OA that hasn't been peer-reviewed (preprints, submitted drafts, etc) can be excluded in Settings.",
    },
    {
        text: "% usage fulfilled by Hybrid OA",
        value: "use_hybrid_percent",
        display: "percent",
        descr: "The percent of Usage that can be fulfilled via Hybrid OA.  This is Open Access hosted on the publisher site with an open license in an otherwise subscription journal.  Usually an APC was paid by the authors when they published this paper.",
    },
    {
        text: "% usage fulfilled by Bronze OA",
        value: "use_bronze_percent",
        display: "percent",
        descr: "The percent of Usage can be fulfilled via Bronze OA.  This is Open Access hosted on the publisher site in an otherwise subscription journal, but unlike Hybrid it does not have an open license.  It is sometimes promotional material, and sometimes open after an embargo in a Delayed OA journal (like Elsevier's Open Archive content).  Bronze OA can be excluded in Settings.",
    },
    {
        text: "% usage fulfilled by Peer-reviewed OA",
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
        text: "PTA (Post-Termination Access)",
        value: "perpetual_access_years_text",
        display: "text",
        descr: "The years for which you have perpetual access to this title if you were to unsubscribe.",
    },
    {
        text: "Baseline access",
        value: "baseline_access_text",
        display: "text",
        descr: "The method by which you access this title currently.  Provided for reference: this information is not used in the model.",
    },
]


const scenarioConfigs = {
    cost_alacart_increase: {
        name: "cost_alacart_increase",
        default: 8,
        value: null,
        display: "percent",
        displayName: "Title-by-title subscription cost growth",
        descr: "The annual percent increase you expect in title-by-title subscription prices (literature suggests 8%).",
    },
    cost_content_fee_percent: {
        name: "cost_content_fee_percent",
        default: 5.7,
        value: null,
        display: "percent",
        displayName: "Title-by-title 'content fee'",
        descr: "A content fee charged by publishers when buying subscriptions title-by-title, above whatever is included in your current package price (literature suggests 5.7% for subscriptions)."
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
        displayName: "ILL Request Rate",
        descr: "The  percent of turnaways that will result in an ILL request. Our extensive literature review suggests 5% is a conservative estimate. (NB: 'Turnaways' are all usages that aren't fulfilled by Open Access, PTA rights, or title-by-title subscriptions in this scenario.)",
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
        displayName: "Include ResearchGate-hosted content",
        descr: "Include ResearchGate and other Academic Social Networks as a fulfillment source.",
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

const scenarioConfigGroups = [
    {
        name: "costs",
        displayName: "Costs",
        contents: [
            scenarioConfigs.cost_alacart_increase,
            scenarioConfigs.cost_content_fee_percent,
        ],
    },
    {
        name: "ill",
        displayName: "ILL",
        contents: [
            scenarioConfigs.cost_ill,
            scenarioConfigs.ill_request_percent_of_delayed,
        ],
    },
    {
        name: "fulfillment",
        displayName: "Fulfillment sources",
        contents: [
            scenarioConfigs.include_bronze,
            scenarioConfigs.include_submitted_version,
            scenarioConfigs.include_social_networks,
        ],
    },
    {
        name: "usageWeights",
        displayName: "Citation and authorship",
        contents: [
            scenarioConfigs.weight_citation,
            scenarioConfigs.weight_authorship,
        ],
    },
]


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

const colors = {
    turnaway: {
        light: "#eee",
        normal: "#ccc",
        dark: "#aaa",
    },
    ill: {
        light: "#ff5c8d",
        normal: "#3F51B5",
        // normal: "#512DA8",
        dark: "#a00037",
    },
    subr: {
        light: "#63a4ff",
        normal: "#1976D2",
        dark: "#004ba0",
    },
    requested: {
        light: "#ef6c00",
        normal: "#ef6c00",
        dark: "#ef6c00",
    },
    oa: {
        light: "#ffb04c",
        normal: "#2E7D32",
        dark: "#bc5100",
    },
    backfile: {
        light: "#85bb5c",
        normal: "#558B2F",
        dark: "#255d00",
    },
    savings: {
        light: "#eee",
        normal: "#ccc",
        dark: "#aaa",
    },
    dark: "#333",
    light: "#ccc"
}

const usageSegments = {
    turnaway: {
        name: "usageTurnaway",
        segmentType: "usage",
        displayName: "Unknown",
        displayNameLong: "Access unknown",
        isFree: false,
        color: colors.turnaway,
        isLeftover: true,
    },
    ill: {
        name: "usageIll",
        segmentType: "usage",
        displayName: "ILL",
        displayNameLong: "Inter-Library Loan",
        isFree: false,
        color: colors.ill,
        isLeftover: false,
    },
    subr: {
        name: "usageSubr",
        segmentType: "usage",
        displayName: "Subscription",
        displayNameLong: "Title-by-title subscription",
        isFree: false,
        color: colors.subr,
        isLeftover: false,
    },
    requested: {
        name: "usageRequested",
        segmentType: "usage",
        displayName: "Requested subscription",
        displayNameLong: "Requested Title-by-title subscription",
        isFree: false,
        color: colors.requested,
        isLeftover: false,
    },
    oa: {
        name: "usageOa",
        segmentType: "usage",
        displayName: "Open access",
        displayNameLong: "Open access",
        isFree: true,
        color: colors.oa,
        isLeftover: false,
    },
    backfile: {
        name: "usageBackfile",
        segmentType: "usage",
        displayName: "PTA",
        displayNameLong: "Post-Termination Access",
        isFree: true,
        color: colors.backfile,
        isLeftover: false,
    },
}

const costSegments = {
    savings: {
        name: "costSavings",
        segmentType: "cost",
        displayName: "Savings",
        displayNameLong: "Cost savings (compared to Big Deal)",
        color: colors.savings,
        isCurrency: true,
        isLeftover: true,
    },
    subr: {
        name: "costSubr",
        segmentType: "cost",
        displayName: "Subscription",
        displayNameLong: "Title-by-title subscription cost",
        color: colors.subr,
        isCurrency: true,
        isLeftover: false,
    },
    requested: {
        name: "costRequested",
        segmentType: "cost",
        displayName: "Requested",
        displayNameLong: "Requested title-by-title subscription cost",
        color: colors.requested,
        isCurrency: true,
        isLeftover: false,
    },
    ill: {
        name: "costIll",
        segmentType: "cost",
        displayName: "ILL",
        displayNameLong: "Inter-Library Loan cost",
        color: colors.ill,
        isCurrency: true,
        isLeftover: false,
    },

}

const barSegments = {
    cost: costSegments,
    usage: usageSegments
}


const dataFiles = {
    counter: {
        name: "counter",
        displayName: "2018 COUNTER JR1",
        dataType: "COUNTER usage data",
        icon: "mdi-file-eye-outline",

        format: "A standard COUNTER JR1 download report spreadsheet",
        alternativeSource: null,
        display: true,
        required: true,

    },
    "perpetual-access": {
        name: "perpetual-access",
        displayName: "PTA date ranges",
        dataType: "Date ranges where you have Post-Termination access",
        icon: "mdi-briefcase-file-outline",

        uploadFormat: "A spreadsheet with one row per journal, and three columns: ISSN, PTA start date, and PTA end date",
        uploadSource: "Custom date ranges",

        defaultSource: "Partial perpetual access",
        display: true,
        required: false,
    },
    prices: {
        name: "price",
        displayName: "Title-by-title pricelist",
        dataType: "Title-by-title subscription prices",
        icon: "mdi-cash-multiple",

        uploadFormat: "A spreadsheet with one row per journal, and two columns: ISSN, and custom price",
        uploadSource: "Custom pricelist",

        defaultSource: "Public list prices",
        display: true,
        required: false,

    },
    "core-journals": {
        name: "core-journals",
        display: false,
    },
}


const testimonials = [
    {
        name: "Mark McBride",
        job: "Library Senior Strategist",
        institution: "SUNY",
        quote: "Unsub is a <strong>game-changer</strong> for libraries.",
        img: "https://i.imgur.com/09uGrea.png",
        displayOnPage: ["demo", "homepage"]
    },
    {
        name: "Hannah McKelvey",
        job: "Head of Electronic Resources & Discovery Services",
        institution: "Montana State University",
        quote: "<strong>It's so incredibly easy</strong> to upload your report, and the tool does the rest!",
        img: "https://i.imgur.com/stGlyU8.png",
        displayOnPage: ["demo", "homepage"]
    },

    {
        name: "Nathan Mealey",
        job: "AUL for Discovery and Access",
        institution: "Wesleyan University",
        quote: "<strong>Unsub has been invaluable</strong> ... and has demonstrated that it has the interests of the library community squarely at heart.",
        img: "https://i.imgur.com/B2OHNXo.png",
        displayOnPage: ["homepage"]
    },
    {
        name: "Elizabeth Grace",
        job: "Head of Collections & Systems",
        institution: "University of Rochester",
        quote: "It's so helpful to have <strong>an accurate picture</strong> moving forward.",
        img: "https://i.imgur.com/uSPKsPS.png",
        displayOnPage: ["demo", "homepage"]
    },
    {
        name: "Jennifer Beamer",
        job: "Scholarly Communications & Open Publishing Coordinator",
        institution: "The Claremont Colleges",
        quote: "Heather and Jason deserve a medal for Unsub!",
        img: "https://i.imgur.com/p7OkrM0.png",
        displayOnPage: ["demo", "homepage"]
    },
]


export default {
    journalColGroups: hydratedJournalColGroups(),
    journalCols,
    scenarioConfigs,
    scenarioConfigGroups,
    usageSegments,
    costSegments,
    barSegments,
    colors,
    dataFiles,
    testimonials,
}