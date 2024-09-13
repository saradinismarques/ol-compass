import principlesData from '../data/principles.json';
import perspectivesData from '../data/perspectives.json';
import dimensionsData from '../data/dimensions.json';

function getDataFromJson(data, type) {
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
            Tooltip: item["#tooltip"],
            Type: type
        }));

        return result;
    } catch (error) {
        console.error("Error processing JSON:", error);
        throw error;
    }
}

export function getPrinciplesData() {
    return getDataFromJson(principlesData, "Principle")
}

export function getPerspectivesData() {
    return getDataFromJson(perspectivesData, "Perspective")
}

export function getDimensionsData() {
    return getDataFromJson(dimensionsData, "Dimension")
}