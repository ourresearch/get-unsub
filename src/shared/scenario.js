// https://www.npmjs.com/package/short-uuid
const short = require('short-uuid');
import {toHexHash} from "./util";
import scenarioConfigs  from "../appConfigs"

const buildScenarioFromApiResp = function (apiRespRaw) {
    const apiResp = {...apiRespRaw}
    apiResp.journals.forEach((myJournal, myIndex) => {
        myJournal.cpuIndex = myIndex
        myJournal.subscribed = apiResp.saved.subrs.includes(myJournal.issn_l)
        myJournal.isHiddenByFilters = false
    })
    apiResp.id = apiResp.meta.scenario_id
    apiResp.isLockedPendingUpdate = apiResp.is_locked_pending_update
    apiResp.updatePercentComplete = apiResp.update_percent_complete

    apiResp.costBigdealProjected = setCostBigdealProjected(
        parseInt(apiResp.saved.configs.cost_bigdeal),
            parseInt(apiResp.saved.configs.cost_bigdeal_increase) * 0.01,
    )
    return apiResp
}




const newScenario = function (id = "", name="") {

    const defaultConfigs = {}
    for (const k in scenarioConfigs) {
        defaultConfigs[k] = {...scenarioConfigs[k]}
        defaultConfigs[k].value =  defaultConfigs[k].default
    }

    return {
        id: id,
        idHash: toHexHash(id),
        isLoading: false,
        journals: [],
        costBigdealProjected: 0,
        isLockedPendingUpdate: false,
        updatePercentComplete: 100,
        saved: {
            subrs: [],
            name: name,
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
    buildScenarioFromApiResp,
    newScenarioId,
    newScenario,
}

