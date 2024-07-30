import principlesData from '../data/principles.json';
import perspectivesData from '../data/perspectives.json';
import dimensionsData from '../data/dimensions.json';

function getDataFromJson(data) {
    try {
        // Process the JSON data
        const result = data.map(item => ({
            Code: item["#code"],
            Label: item["#label"],
            Headline: item["#headline"],
            Paragraph: item["#paragraph"],
            ShowMoreText: item["#showmoretext"],
            Prompt: item["#prompt"],
            Credits: item["#credits"],
        }));

        return result;
    } catch (error) {
        console.error("Error processing JSON:", error);
        throw error;
    }
}

export function getPrinciplesData() {
    return getDataFromJson(principlesData)
}

export function getPerspectivesData() {
    return getDataFromJson(perspectivesData)
}

export function getDimensionsData() {
    return getDataFromJson(dimensionsData)
}