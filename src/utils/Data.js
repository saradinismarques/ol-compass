import principlesData from '../data/principles.json';
import perspectivesData from '../data/perspectives.json';
import dimensionsData from '../data/dimensions.json';
import conceptsData from '../data/concepts.json';
import caseStudies from '../data/case_studies.json'

function getComponentsDataFromJson(data, type) {
    try {
        // Process the JSON data
        const result = data.map(item => ({
            Code: item["#code"],
            Label: item["#label"],
            Headline: item["#headline"],
            Paragraph: item["#paragraph"],
            ShowMoreText: item["#showmoretext"],
            DesignPrompt: item["#design prompt"],
            Credits: item["#credits"],
            Tooltip: item["#headline"],
            Type: type
        }));

        return result;
    } catch (error) {
        console.error("Error processing JSON:", error);
        throw error;
    }
}

export function getPrinciplesData() {
    return getComponentsDataFromJson(principlesData, "Principle")
}

export function getPerspectivesData() {
    return getComponentsDataFromJson(perspectivesData, "Perspective")
}

export function getDimensionsData() {
    return getComponentsDataFromJson(dimensionsData, "Dimension")
}

export function getConceptsData() {
    try {
        // Process the JSON data
        const result = conceptsData.map(item => ({
            Code: item["#code"],
            Label: item["#label"],
            Paragraph: item["#paragraph"],
            LinkedTo: item["#linked-to"],
            Type: "Concept"
        }));

        return result;
    } catch (error) {
        console.error("Error processing JSON:", error);
        throw error;
    }
}

export function getCaseStudies() {
    try {
        // Process the JSON data
        const result = caseStudies.map(item => ({
            Title: item["#title"],
            ShortDescription: item["#short-description"],
            Credits: item["#credits"],
            Source: item["#SOURCE [link]"],
            Components: Object.keys(item).filter(key => !key.startsWith('#') && item[key] === 'y') // Get the components again for the result
        }));

        return result;
    } catch (error) {
        console.error("Error processing JSON:", error);
        throw error;
    }
}
