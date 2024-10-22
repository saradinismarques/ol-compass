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
        // Function to extract components and return the case study object
        const result = caseStudies.map(item => ({
            Title: item["Title"],
            Collection: item["Collection"],
            MainTarget: item["Main Target"],
            Age: item["Age"],
            Time: item["Time"],
            Type: item["Type"],
            Languages: item["Laguage(s)"],
            Year: item["Year"],
            Description: item["Description"],
            Credits: item["Author, Country"],
            Components: Object.keys(item).filter(key => item[key] === 'Y')
        }));

        // // Process the JSON data
        // let filteredCaseStudies = caseStudies;

        // // If labels are provided, filter the case studies
        // if (components !== null) {
        //     filteredCaseStudies = caseStudies.filter(item => {
        //         const comp = Object.keys(item).filter(key => item[key] === 'Y');
        //         return components.every(component => comp.includes(component));
        //     });
        // }

        // // Map the case studies to the desired format
        // return filteredCaseStudies.map(processCaseStudy);
        return result;
    } catch (error) {
        console.error("Error processing JSON:", error);
        throw error;
    }
}
