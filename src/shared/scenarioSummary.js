// USAGE

const usageDictFree = function (journals) {
    const ret = {
        oa: 0,
        backfile: 0,
    }
    journals.forEach(j => {
        ret.oa += j.use_groups_free_instant.oa
        ret.backfile += j.use_groups_free_instant.backfile
    })
    ret.oa = Math.max(0, ret.oa)
    ret.backfile = Math.max(0, ret.backfile)

    return ret
}
const usageDictPaid = function (journals) {
    const ret = {
        // delayed: 0,
        turnaway: 0,
        ill: 0,
        subr: 0,
    }
    journals.forEach(j => {
        if (j.subscribed || j.customSubscribed) {
            ret.subr += j.use_groups_if_subscribed.subscription
        } else {
            // ret.delayed += (j.use_groups_if_not_subscribed.ill + j.use_groups_if_not_subscribed.other_delayed)
            ret.turnaway += j.use_groups_if_not_subscribed.other_delayed
            ret.ill += j.use_groups_if_not_subscribed.ill
        }
    })
    return ret
}

const usageDict = function (journals) {
    return {
        ...usageDictFree(journals),
        ...usageDictPaid(journals),
    }
}

const usageList = function (journals) {
    const myUsageDict = usageDict(journals)
    const ret = {}
    Object.entries(myUsageDict).forEach(([k, v]) => {
        ret[k] = {
            value: v,
            key: k
        }
    })

    console.log("creating usageList", myUsageDict)

    return [
        // ret.delayed,
        ret.turnaway,
        ret.ill,
        ret.subr,
        ret.backfile,
        ret.oa,
    ]
}

const usageTotal = function (journals) {
    return journals
        .map(j => j.usage)
        .reduce((a, b) => a + b, 0)
}

const instantUsagePercent = function (journals) {
    const myUsageDict = usageDict(journals)
    const instant = myUsageDict.oa + myUsageDict.backfile + myUsageDict.subr
    return 100 * instant / usageTotal(journals)

}


// COST
// *********************************************************************
const subrCost = function (journals) {
    return journals
        .filter(j => j.subscribed || j.customSubscribed)
        .map(j => j.subscription_cost)
        .reduce((a, b) => a + b, 0)
}
const illCost = function (journals) {
    return journals
        .filter(j => !j.subscribed || j.customSubscribed)
        .map(j => j.ill_cost)
        .reduce((a, b) => a + b, 0)
}


const costList = function (journals, previousTotalCost) {
    const myIllCost = illCost(journals)
    const mySubrCost = subrCost(journals)

    const mySavings = previousTotalCost - (myIllCost + mySubrCost)
    const ret = {
        ill: {
            value: myIllCost,
            key: "ill",
        },
        subr: {
            value: mySubrCost,
            key: "subr",
        },
        savings: {
            value: Math.max(mySavings, 0),
            key: "savings",
            colorIsLight: true,
        }
    }
    return [
        ret.savings,
        ret.ill,
        ret.subr,
    ]
}
const costTotal = function (journals) {
    return subrCost(journals) + illCost(journals)
}


export {
    usageDict,
    usageList,
    instantUsagePercent,

    costList,
    costTotal,
}