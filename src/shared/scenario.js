// https://www.npmjs.com/package/short-uuid
const short = require('short-uuid');
import _ from "lodash"
import {toHexHash} from "./util";
import scenarioConfigs from "../appConfigs"
import {api, apiPostUnbounced} from "../api";

const cache = {}
const getFromCache = function (id) {
    if (!cache[id]) return
    return _.cloneDeep(cache[id])
}

const clearScenarioCache = function(){
    Object.keys(cache).forEach(k => {
        cache[k] = null
    })
}


const fetchScenario = async function (scenarioId) {
    const cachedToReturn = getFromCache(scenarioId)
    if (cachedToReturn) {
        console.log("serving cached scenario", cachedToReturn)
        return cachedToReturn
    }

    const path = `scenario/${scenarioId}/journals`
    const apiResp = await api.get(path)
    const ret = newScenarioObjectFromApiData(apiResp.data)
    cache[ret.id] = ret
    return ret
}

const saveScenarioSubscriptions = async function (scenario) {
    cache[scenario.id] = null
    const url = `scenario/${scenario.id}/subscriptions`
    const ret = await apiPostUnbounced(url, scenario.saved)
    return ret
}

const saveScenarioInstitutions = async function (scenarioId, institutionIds) {
    cache[scenarioId] = null
    const postData = {member_institutions: institutionIds}
    const url = `scenario/${scenarioId}/member-institutions`
    const ret = await api.post(url, postData)
    return ret
}


const saveScenario = async function (scenario) {
    cache[scenario.id] = null
    const url = `scenario/${scenario.id}`
    const ret = await api.post(url, scenario.saved)
    return ret
}


const createScenario = async function (packageId, name) {
    console.log(`createScenario(): creating new scenario "${name}"`)
    const path = `package/${packageId}/scenario`
    const apiResp = await api.post(path, {name})

    console.log(`createScenario(): scenario created. Loading scenario.`)
    const newScenarioId = apiResp.data.meta.scenario_id
    const newScenario = await fetchScenario(newScenarioId)
    return newScenario
}

const copyScenario = async function (packageId, scenarioToCopyId, newScenarioName) {
    const path = `package/${packageId}/scenario?copy=${scenarioToCopyId}`
    const apiResp = await api.post(path, {name: newScenarioName})

    console.log(`copyScenario(): scenario created. Loading scenario.`)
    const newScenarioId = apiResp.data.meta.scenario_id
    const newScenario = await fetchScenario(newScenarioId)
    return newScenario
}
const deleteScenario = async function (scenarioId) {
    cache[scenarioId] = null
    const url = `scenario/${scenarioId}`
    return await api.delete(url)
}


const newScenarioObjectFromApiData = function (apiData) {
    const ret = newScenario(apiData.meta.scenario_id)
    ret.journals = apiData.journals.map((myJournal, myIndex) => {
        const ret = {...myJournal}
        ret.cpuIndex = myIndex
        ret.subscribed = apiData.saved.subrs.includes(myJournal.issn_l)
        ret.isHiddenByFilters = false
        return ret
    })
    ret.isLockedPendingUpdate = apiData.is_locked_pending_update
    ret.updatePercentComplete = apiData.update_percent_complete
    ret.updateNotificationEmail = apiData.update_notification_email
    ret.memberInstitutions = apiData.member_institutions
    ret.saved = apiData.saved


    return ret
}


const newScenario = function (id = "") {
    const defaultConfigs = {}
    for (const k in scenarioConfigs) {
        defaultConfigs[k] = {...scenarioConfigs[k]}
        defaultConfigs[k].value = defaultConfigs[k].default
    }
    return {
        id: id,
        idHash: toHexHash(id),
        journals: [],
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


const scenarioCost = function (scenario) {
    return {
        costSegments: null
    }
}


const newScenarioId = function (isDemo) {
    let id = "scenario-" + short.generate().slice(0, 8)
    if (isDemo) id = "demo-" + id
    return id
}








export {
    clearScenarioCache,
    fetchScenario,
    saveScenarioSubscriptions,
    saveScenarioInstitutions,
    saveScenario,
    createScenario,
    copyScenario,
    newScenarioId,
    newScenario,
    deleteScenario,

}

