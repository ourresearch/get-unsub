// https://www.npmjs.com/package/short-uuid
const short = require('short-uuid');
import {toHexHash} from "./util";
import scenarioConfigs  from "../appConfigs"
import {api} from "../api";

const fetchScenario = async function (scenarioId) {
    const path = `scenario/${scenarioId}/journals`
    const apiResp = await api.get(path)
    const apiData = apiResp.data

    const ret = newScenario(scenarioId)
    ret.journals = apiData.journals.map((myJournal, myIndex) => {
        const ret = {...myJournal}
        ret.cpuIndex = myIndex
        ret.subscribed = apiData.saved.subrs.includes(myJournal.issn_l)
        ret.isHiddenByFilters = false
        return ret
    })
    ret.isLockedPendingUpdate = apiData.is_locked_pending_update
    ret.updatePercentComplete = apiData.update_percent_complete
    ret.memberInstitutions = apiData.member_institutions
    ret.saved = apiData.saved

    ret.costBigdealProjected = setCostBigdealProjected(
        parseInt(apiData.saved.configs.cost_bigdeal),
            parseInt(apiData.saved.configs.cost_bigdeal_increase) * 0.01,
    )
    return ret
}

const newScenario = function (id = "") {

    const defaultConfigs = {}
    for (const k in scenarioConfigs) {
        defaultConfigs[k] = {...scenarioConfigs[k]}
        defaultConfigs[k].value =  defaultConfigs[k].default
    }

    return {
        id: id,
        idHash: toHexHash(id),
        journals: [],
        costBigdealProjected: 0,
        isLockedPendingUpdate: false,
        updatePercentComplete: 100,
        memberInstitutions: [],
        saved: {
            subrs: [],
            name: "",
            configs: defaultConfigs,
        }
    }
}

const newScenarioId = function(isDemo){
    let id = "scenario-" + short.generate().slice(0, 8)
    if (isDemo) id = "demo-" + id
    return id
}

const setCostBigdealProjected = function (costThisYear, yearlyIncrease) {
    let totalCost = 0
    let numYears = 5
    for (let i = 1; i <= numYears; i++) {
        totalCost += costThisYear
        costThisYear = costThisYear * (1 + yearlyIncrease)
    }
    return totalCost / numYears
}


export {
    fetchScenario,
    newScenarioId,
    newScenario,
}

