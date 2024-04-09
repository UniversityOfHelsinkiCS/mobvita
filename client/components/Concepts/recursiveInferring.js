
const recursiveToggle = (targetConcepts, value) => {
    // Toggle the target concepts and their children
    const targetConceptId = targetConcepts.map(concept => concept.concept_id)
    const childrenConcepts = targetConcepts.map(concept => concept.children).flat()
    
    const updatedConceptEntries = targetConceptId.map(conceptId => [conceptId, value])
    if (childrenConcepts.length > 0) {
        return [...updatedConceptEntries, ...recursiveToggle(childrenConcepts, value)]
    } else {
        return updatedConceptEntries
    }
}

const recursiveCount = (targetConcepts, allConcepts, conceptSetting) => {
    // Re-calculate value for the parent concepts
    const parentConceptIds = targetConcepts.map(concept => concept.parents).flat()
    const parentConcepts = allConcepts.filter(concept => parentConceptIds.includes(concept.concept_id))
    const parentConceptEntries = parentConcepts.map(concept => {
        const childrenConceptValues = concept.children.map(
            conceptId => conceptSetting[conceptId] === undefined ? 1: conceptSetting[conceptId])
        return [concept.concept_id, childrenConceptValues.reduce((acc, value) => acc + value, 0) / childrenConceptValues.length]
    })
    const updatedConceptSetting = {
        ...conceptSetting,
        ...Object.fromEntries(parentConceptEntries)
    }
    if (parentConcepts.length > 0) {
        return { ...updatedConceptSetting, ...recursiveCount(parentConcepts, allConcepts, updatedConceptSetting) }
    } else {
        return updatedConceptSetting
    }
}

const conceptToggle = (concept, allConcepts, conceptSetting, value) => {
    const targetConcepts = [concept]
    const updatedConceptSetting = {
        ...conceptSetting,
        ...Object.fromEntries(recursiveToggle(targetConcepts, value))
    }
    return {
        ...updatedConceptSetting,
        ...recursiveCount(targetConcepts, allConcepts, updatedConceptSetting)
    }
}

export default conceptToggle