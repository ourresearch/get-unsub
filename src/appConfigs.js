const journalColGroups = [
    {
        displayName: "Key stats",
        name: "keyStats",
        colNames: [
            "use",
            "free_instant_usage_percent",
            "instant_usage_percent",
            "cost",
            "ncppu",
        ]
    },

    {
        displayName: "Costs",
        name: "costs",
        colNames: [
            "scenario_cost",
            "subscription_cost",
            "ill_cost",
            "real_cost",
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
            "use_asns",
            "use_oa",
            "use_backfile",
            "use_subscription",
            "use_ill",
            "use_other_delayed",
        ]
    },

    {
        displayName: "Institutional impact",
        name: "usage",
        colNames: [
            "total_usage",
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
        display: "currency"
    },
    {
        text: "Cost",
        value: "cost",
        display: "currency_int"
    },
    {
        text: "Usage",
        value: "use",
        display: "number"
    },
    {
        text: "Instant Usage Percent",
        value: "instant_usage_percent",
        display: "percent"
    },
    {
        display: "percent",
        text: "Free Instant Usage Percent",
        value: "free_instant_usage_percent"
    },
    {
        text: "Scenario Cost",
        value: "scenario_cost",
        display: "currency_int"
    },
    {
        text: "Subscription Cost",
        value: "subscription_cost",
        display: "currency_int"
    },
    {
        text: "ILL Cost",
        value: "ill_cost",
        display: "currency_int"
    },
    {
        text: "Subscription minus ILL Cost",
        value: "real_cost",
        display: "currency_int"
    },
    {
        text: "% usage from ASNs",
        value: "use_asns",
        display: "number"
    },
    {
        text: "% usage from Open Access",
        value: "use_oa",
        display: "number"
    },
    {
        text: "% usage from backfile",
        value: "use_backfile",
        display: "number"
    },
    {
        text: "% usage from subscription",
        value: "use_subscription",
        display: "number"
    },
    {
        text: "% usage from ILL",
        value: "use_ill",
        display: "number"
    },
    {
        text: "% usage from 'other (delayed)'",
        value: "use_other_delayed",
        display: "number"
    },
    {
        text: "% usage from OA",
        value: "use_oa_percent",
        display: "percent"
    },
    {
        text: "% usage from Green OA",
        value: "use_green_percent",
        display: "percent"
    },
    {
        text: "% usage from Hybrid OA",
        value: "use_hybrid_percent",
        display: "percent"
    },
    {
        text: "% usage from Bronze OA",
        value: "use_bronze_percent",
        display: "percent"
    },
    {
        text: "% usage from Peer-reviewed OA",
        value: "use_peer_reviewed_percent",
        display: "percent"
    },
    {
        text: "Total Usage",
        value: "total_usage",
        display: "number"
    },
    {
        text: "Downloads",
        value: "downloads",
        display: "number"
    },
    {
        text: "Citations to papers",
        value: "citations",
        display: "float1"
    },
    {
        text: "Authored papers",
        value: "authorships",
        display: "float1"
    }
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


export default {
    journalColGroups: hydratedJournalColGroups(),
    journalCols,

}