import principlesData from '../data/principles.json';
import perspectivesData from '../data/perspectives.json';
import dimensionsData from '../data/dimensions.json';
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

export function getCaseStudies(labels) {
    try {
        // Process the JSON data
        const result = caseStudies.filter(item => {
            // Get all keys that are not metadata and have value "y"
            const components = Object.keys(item).filter(key => !key.startsWith('#') && item[key] === 'y');

            // Check if all labels are present in the components
            const hasAllLabels = labels.every(label => components.includes(label));

            return hasAllLabels;
        }).map(item => ({
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
