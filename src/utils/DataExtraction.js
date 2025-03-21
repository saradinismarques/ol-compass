import colorPalletData from '../data/static/color-pallete-data.json'
import enLabelsData from '../data/static/en/en-labels-texts.json';
import enIntroTexts from '../data/static/en/en-intro-texts.json'
import enModesTexts from '../data/static/en/en-modes-texts.json'
import enTooltipsTexts from '../data/content/en/en-tooltips-texts.json'
import enComponentsCodes from '../data/content/en/en-components-codes.json';
import enGetStartedData from '../data/content/en/en-get-started-data.json';
import enLearnData from '../data/content/en/en-learn-data.json';
import enLinksPrinciples from '../data/content/en/en-links-principles.json';
import enLinksPerspectives from '../data/content/en/en-links-perspectives.json';
import enLinksDimensions from '../data/content/en/en-links-dimensions.json';
import enConceptsData from '../data/content/en/en-concepts-data.json';
import enGetInspiredData from '../data/content/en/en-get-inspired-data.json';
import ptLabelsData from '../data/static/pt/pt-labels-texts.json';
import ptIntroTexts from '../data/static/pt/pt-intro-texts.json'
import ptModesTexts from '../data/static/pt/pt-modes-texts.json'
import ptTooltipsTexts from '../data/content/pt/pt-tooltips-texts.json'
import ptComponentsCodes from '../data/content/pt/pt-components-codes.json';
import ptLinksPrinciples from '../data/content/pt/pt-links-principles.json';
import ptLinksPerspectives from '../data/content/pt/pt-links-perspectives.json';
import ptLinksDimensions from '../data/content/pt/pt-links-dimensions.json';
import ptGetInspiredData from '../data/content/pt/pt-get-inspired-data.json';

// Static
export const getLabelsTexts = (language, section) => {
    try {
        let lanLabelsData;
        if(language === "en") lanLabelsData = enLabelsData;
        else if(language === "pt") lanLabelsData = ptLabelsData;
        else lanLabelsData = enLabelsData;

        // Attempt to retrieve the section from the JSON data
        return lanLabelsData[section] || {};
    } catch (error) {
        // Catch and log any error that occurs during the process
        console.error("Error processing JSON:", error);
        return {}; // Return an empty object or some fallback value
    }
};

export function getColorPallete(version) {
    try {

        // Find the color data for the given version
        let versionData = colorPalletData.find(item => item.ColorVersion === version);

        // If no matching version found, return null or an error message
        if (!versionData) {
            versionData = colorPalletData.find(item => item.ColorVersion === 1);
        }

        // Initialize the colors object
        let colors = {
            Wave: {},
            Label: {},
            Text: {},
            "Intro Text": {},
            Selection: "",
            "Selection Hover": "",
            "Selection Method": "",
            "CBookmark": "",
            "CBookmark Hover": "",
            "CSBookmark": "",
            "CSBookmark Hover": "",
            "Gray": "",
            "Gray Hover": "",
        };

        // Manually map colors for the selected version
        colors['Wave']['Principle'] = versionData["Wave [Principle]"];
        colors['Wave']['Perspective'] = versionData["Wave [Perspective]"];
        colors['Wave']['Dimension'] = versionData["Wave [Dimension]"];
        
        colors['Label']['Principle'] = versionData["Label [Principle]"];
        colors['Label']['Perspective'] = versionData["Label [Perspective]"];
        colors['Label']['Dimension'] = versionData["Label [Dimension]"];

        colors['Text']['Principle'] = versionData["Text [Principle]"];
        colors['Text']['Perspective'] = versionData["Text [Perspective]"];
        colors['Text']['Dimension'] = versionData["Text [Dimension]"];

        colors['Intro Text']['Principle'] = versionData["Intro Text [Principle]"];
        colors['Intro Text']['Perspective'] = versionData["Intro Text [Perspective]"];
        colors['Intro Text']['Dimension'] = versionData["Intro Text [Dimension]"];

        colors['Selection'] = versionData["Selection"];

        colors["CBookmark"] = versionData["Bookmark Component"] || "#000000";
        colors["CSBookmark"] = versionData["Bookmark CaseStudies"] || "#000000";
        colors["Gray"] = versionData["Gray Text"] || "#000000";
        colors["Gray Hover"] = versionData["Gray Text [Hover]"] || "#000000";


        // Return the colors for the specific version
        return colors;
    } catch (error) {
        console.error("Error processing JSON:", error);
        throw error;
    }
}

export function getIntroTexts(language) {
    try {
        let lanIntroTexts;
        if(language === "en") lanIntroTexts = enIntroTexts;
        else if(language === "pt") lanIntroTexts = ptIntroTexts;
        else lanIntroTexts = enIntroTexts;

        // Find the item in the introTexts array where LANGUAGE matches the desired language
        const item = lanIntroTexts[0];

        // If a match is found, return the data; otherwise, return null or a default value
        if (item) {
            return {
                Frame0: item["Frame 0"],
                Frame1: item["Frame 1"],
                Frame2: item["Frame 2"],
                Frame3: item["Frame 3"],
                Frame4: item["Frame 4"],
                Frame5: item["Frame 5"],
                Frame6: item["Frame 6"],
                Frame7: item["Frame 7"],
                Frame8: item["Frame 8"],
                Frame9: item["Frame 9"],
                Frame10: item["Frame 10"],
                Frame11: item["Frame 11"],
                Frame12: item["Frame 12"],
                Frame13: item["Frame 13"],
                Frame14: item["Frame 14"],
                Frame15: item["Frame 15"],
            };
        }

        // If no data for the language, return null or a fallback object
        return null;
    } catch (error) {
        console.error("Error processing JSON:", error);
        throw error;
    }
}


export function getModeTexts(mode, language) {
    try {
        let lanModesTexts;
        if(language === "en") lanModesTexts = enModesTexts;
        else if(language === "pt") lanModesTexts = ptModesTexts;
        else lanModesTexts = enModesTexts;

        const formattedMode = mode.replace(/-/g, ' ').toUpperCase();
        // Find the item in the introTexts array where LANGUAGE matches the desired language
        const item = lanModesTexts.find(item => item["#MODE-LABEL"] === formattedMode);

        // If a match is found, return the data; otherwise, return null or a default value
        if (item) {
            return {
                Headline: item["#headline"],
                Text: item["#text"],
                Instruction: item["#instruction"],
            };
        }

        // If no data for the language, return null or a fallback object
        return null;
    } catch (error) {
        console.error("Error processing JSON:", error);
        throw error;
    }
}

// Content
export function getTypeTooltip(language) {
    try {
        let lanTooltipsTexts;
        if(language === "en") lanTooltipsTexts = enTooltipsTexts;
        else if(language === "pt") lanTooltipsTexts = ptTooltipsTexts;
        else lanTooltipsTexts = enTooltipsTexts;

        // Filter only the required labels
        const filteredData = lanTooltipsTexts.filter(item =>
            ["PRINCIPLES", "PERSPECTIVES", "DIMENSIONS"].includes(item["#ID/ELEMENT"])
        );

        // Convert to the required format
        const result = {
            Principle: filteredData.find(item => item["#ID/ELEMENT"] === "PRINCIPLES")?.["#TOOLTIP TEXT"],
            Perspective: filteredData.find(item => item["#ID/ELEMENT"] === "PERSPECTIVES")?.["#TOOLTIP TEXT"],
            Dimension: filteredData.find(item => item["#ID/ELEMENT"] === "DIMENSIONS")?.["#TOOLTIP TEXT"]
        };

        return result;
    } catch (error) {
        console.error("Error processing JSON:", error);
        throw error;
    }
}

export function getButtonTooltip(language) {
    try {
        let lanTooltipsTexts;
        if(language === "en") lanTooltipsTexts = enTooltipsTexts;
        else if(language === "pt") lanTooltipsTexts = ptTooltipsTexts;
        else lanTooltipsTexts = enTooltipsTexts;

        // Filter only the required labels
        const filteredData = lanTooltipsTexts.filter(item =>
            ["REPLAY INTRO", "STUDY INSTRUCTIONS"].includes(item["#ID/ELEMENT"])
        );

        // Convert to the required format
        const result = {
            ReplayIntro: filteredData.find(item => item["#ID/ELEMENT"] === "REPLAY INTRO")?.["#TOOLTIP TEXT"],
            StudyInstructions: filteredData.find(item => item["#ID/ELEMENT"] === "STUDY INSTRUCTIONS")?.["#TOOLTIP TEXT"],
        };

        return result;
    } catch (error) {
        console.error("Error processing JSON:", error);
        throw error;
    }
}

export function getComponentsData(type, language) {
    if(type === 'default') return getDefaultData(language);
    else if(type === 'get-started') return getGetStartedData(language);
    else if(type === 'learn') return getLearnData(language);
    else if(type === 'learn-2') return getLinksData(language);
    else if(type === 'concepts') return getConceptsData(language);
}

export function getDefaultData(language) {
    try {
        let lanTooltipsTexts;
        if(language === "en") lanTooltipsTexts = enTooltipsTexts;
        else if(language === "pt") lanTooltipsTexts = ptTooltipsTexts;
        else lanTooltipsTexts = enTooltipsTexts;

        // Create a map of labels from learnData for easy lookup
        const tooltipsMap = lanTooltipsTexts.reduce((acc, item) => {
            acc[item["#ID/ELEMENT"]] = item["#TOOLTIP TEXT"];
            return acc;
        }, {});

        let lanComponentsCodes;
        if(language === "en") lanComponentsCodes = enComponentsCodes;
        else if(language === "pt") lanComponentsCodes = ptComponentsCodes;
        else lanComponentsCodes = enComponentsCodes;

        // Process the JSON data
        const result = lanComponentsCodes.map(item => ({
            code: item["ID"],
            label: item["LABEL"],
            tooltip: tooltipsMap[item["ID"]] || "",
            type: getType(item['ID'])
        }));

        // Organize into three parts by Type
        const organizeComponents = result.reduce((acc, item) => {
            const type = item.type;
            if (!acc[type]) {
                acc[type] = []; // Initialize the array for each type if it doesn't exist
            }
            acc[type].push(item);
            return acc;
        }, {});

        return organizeComponents;
    } catch (error) {
        console.error("Error processing JSON:", error);
        throw error;
    }
}

export function getGetStartedData(language) {
    try {
        let lanGetStartedData = enGetStartedData;

        // Process the JSON data
        const result = lanGetStartedData.map(item => ({
            code: item["#code"],
            label: item["#label"],
            headline: item["#headline-1"],
            showMore: item["SHOW MORE"],
            type: getType(item['#code'])
        }));

        // Organize into three parts by Type
        const organizeComponents = result.reduce((acc, item) => {
            const type = item.type;
            if (!acc[type]) {
                acc[type] = []; // Initialize the array for each type if it doesn't exist
            }
            acc[type].push(item);
            return acc;
        }, {});

        return organizeComponents;
    } catch (error) {
        console.error("Error processing JSON:", error);
        throw error;
    }
}

export function getLearnData(language) {
    try {
        let lanTooltipsTexts;
        if(language === "en") lanTooltipsTexts = enTooltipsTexts;
        else if(language === "pt") lanTooltipsTexts = ptTooltipsTexts;
        else lanTooltipsTexts = enTooltipsTexts;

        // Create a map of labels from learnData for easy lookup
        const tooltipsMap = lanTooltipsTexts.reduce((acc, item) => {
            acc[item["#ID/ELEMENT"]] = item["#TOOLTIP TEXT"];
            return acc;
        }, {});

        let lanLearnData;
        if(language === "en") lanLearnData = enLearnData;
        else if(language === "pt") lanLearnData = enLearnData;
        else lanLearnData = enLearnData;

        // Process the JSON data
        const result = lanLearnData.map(item => ({
            code: item["#code"],
            label: item["#label"],
            headline: item["#headline"],
            paragraph: item["#paragraph"],
            tooltip: tooltipsMap[item["#code"]] || "",
            type: getType(item['#code'])
        }));

        // Organize into three parts by Type
        const organizeComponents = result.reduce((acc, item) => {
            const type = item.type;
            if (!acc[type]) {
                acc[type] = []; // Initialize the array for each type if it doesn't exist
            }
            acc[type].push(item);
            return acc;
        }, {});

        return organizeComponents;
    } catch (error) {
        console.error("Error processing JSON:", error);
        throw error;
    }
}

function getLinksData(language) {
    try {
        let lanTooltipsTexts;
        if(language === "en") lanTooltipsTexts = enTooltipsTexts;
        else if(language === "pt") lanTooltipsTexts = ptTooltipsTexts;
        else lanTooltipsTexts = enTooltipsTexts;

        // Create a map of labels from learnData for easy lookup
        const tooltipsMap = lanTooltipsTexts.reduce((acc, item) => {
            acc[item["#ID/ELEMENT"]] = item["#TOOLTIP TEXT"];
            return acc;
        }, {});

        let lanComponentsCodes;
        if(language === "en") lanComponentsCodes = enComponentsCodes;
        else if(language === "pt") lanComponentsCodes = ptComponentsCodes;
        else lanComponentsCodes = enComponentsCodes;

        // Create a map of labels from learnData for easy lookup
        const labelsMap = lanComponentsCodes.reduce((acc, item) => {
            acc[item["ID"]] = item["LABEL"];
            return acc;
        }, {});

        let lanLinksPrinciples;
        if(language === "en") lanLinksPrinciples = enLinksPrinciples;
        else if(language === "pt") lanLinksPrinciples = ptLinksPrinciples;
        else lanLinksPrinciples = enLinksPrinciples;

        // Process the principles JSON
        let principlesData = lanLinksPrinciples.map(item => ({
            code: item["P-ID"],
            label: labelsMap[item["P-ID"]] || "", // Get label from map
            paragraph: item["P-GEN"],
            paragraph_extended: item["P-GEN-continue"],
            map_question: item["MAP-question"],
            wbc_links: item["WBF-P_links"] ? item["WBF-P_links"].split(",").map(link => link.trim()) : [], // Convert to array
            region_feature: item["WATER BODY + FEATURE (WBF)"],
            country_e1: item["COUNTRY-E1"],
            ce1_links: item["E1-Pe_link"] ? item["E1-Pe_link"].split(",").map(link => link.trim()) : [], // Convert to array
            country_e2: item["COUNTRY-E2"],
            ce2_links: item["E2-Pe_link"] ? item["E2-Pe_link"].split(",").map(link => link.trim()) : [], // Convert to array
            tooltip: tooltipsMap[item["P-ID"]] || "",
            type: getType(item["P-ID"])
        }));

        let lanLinksPerspectives;
        if(language === "en") lanLinksPerspectives = enLinksPerspectives;
        else if(language === "pt") lanLinksPerspectives = ptLinksPerspectives;
        else lanLinksPerspectives = enLinksPerspectives;

        // Process the perspectives JSON
        let perspectivesData = lanLinksPerspectives.map(item => {
            let Py1 = Object.keys(item).find(key => item[key] === "y1" && key.startsWith("P")) || "";
            let Py2 = Object.keys(item).find(key => item[key] === "y2" && key.startsWith("P")) || "";
                    
            // Return the object with the necessary fields
            return {
                code: item["Pe-ID"],
                label: labelsMap[item["Pe-ID"]] || "", // Get label from map
                paragraph: item["What-PAR"],
                map_question: item["MAP-question"],
                example_1: item["Example 1"],
                example_2: item["Example 2"],
                e1_codes: [Py1],   // Single P code with "y1"
                e2_codes: [Py2],   // Single P code with "y1"
                tooltip: tooltipsMap[item["Pe-ID"]] || "",
                type: getType(item["Pe-ID"])
            };
        });

        let lanLinksDimensions;
        if(language === "en") lanLinksDimensions = enLinksDimensions;
        else if(language === "pt") lanLinksDimensions = ptLinksDimensions;
        else lanLinksDimensions = enLinksDimensions;

        // Process the perspectives JSON
        let dimensionsData = lanLinksDimensions.map(item => {
            let Py1 = Object.keys(item).find(key => item[key] === "y1" && key.startsWith("P")) || "";
            let Py2 = Object.keys(item).find(key => item[key] === "y2" && key.startsWith("P")) || "";
            let Pey1 = Object.keys(item).find(key => item[key] === "y1" && key.startsWith("Pe")) || "";
            let Pey2 = Object.keys(item).find(key => item[key] === "y2" && key.startsWith("Pe")) || "";
            
            return {
                code: item["D-ID"],
                label: labelsMap[item["D-ID"]] || "", // Get label from map
                paragraph: item["What-PAR"],
                map_question: item["MAP-question"],
                diff_code: item["Diff-from"],
                diff_label: labelsMap[item["Diff-from"]] || "",
                diff_paragraph: item["Diff-from-PAR"],
                example_1: item["Example 1"],
                example_2: item["Example 2"],
                e1_codes: [Py1, Pey1],   // Single P code with "y1"
                e2_codes: [Py2, Pey2],   // Single P code with "y1"
                tooltip: tooltipsMap[item["D-ID"]] || "",
                type: getType(item["D-ID"])
            };
        });

        // Combine both datasets
        let mergedData = [...principlesData, ...perspectivesData, ...dimensionsData];

        // Organize into three parts by Type
        const organizedData = mergedData.reduce((acc, item) => {
            if (!acc[item.type]) {
                acc[item.type] = []; // Initialize array for type if not exists
            }
            acc[item.type].push(item);
            return acc;
        }, {});

        return organizedData;
    } catch (error) {
        console.error("Error processing JSON:", error);
        throw error;
    }
}

function getType(code) {
    // Define a mapping of prefixes to their corresponding full names
    const prefixMap = {
        "D": "Dimension",
        "Pe": "Perspective",
        "P": "Principle"
    };  
  
    // Use a regular expression to capture the prefix and the number
    const regex = /^([A-Za-z]+)(\d+)$/;
    const match = code.match(regex);
  
    if (match) {
        const prefix = match[1];
  
        // Find the corresponding full name for the prefix
        const type = prefixMap[prefix];
  
        if (type) {
            return type;
        }
    }
  // If the label doesn't match the expected pattern, return it unchanged
  return code;
}

export function getConceptsData(language) {
    try {
        let lanConceptsData = enConceptsData;

        // Process the JSON data
        const result = lanConceptsData.map(item => ({
            code: item["#code"],
            label: item["#label"],
            paragraph: item["#paragraph"],
            linkedTo: item["#linked-to"],
            type: "Concept"
        }));

        return result;
    } catch (error) {
        console.error("Error processing JSON:", error);
        throw error;
    }
}

export function getGetInspiredData(language) {
    try {
        let lanGetInspiredData;
        if(language === "en") lanGetInspiredData = enGetInspiredData;
        else if(language === "pt") lanGetInspiredData = ptGetInspiredData;
        else lanGetInspiredData = enGetInspiredData;

        // Function to extract components and return the case study object
        const result = lanGetInspiredData.map(item => ({
            title: item["PROJECT"],
            collection: item["Collection"],
            mainTarget: item["Main Target"],
            age: item["Age"],
            time: item["Time"],
            type: item["SubType"],
            languages: item["Laguage(s)"],
            year: item["Year"],
            description: item["DESCR-SHORT"],
            credits: item["Author"],
            components: Object.keys(item).filter(key => item[key] === 'Y')
        }));
        return result;
    } catch (error) {
        console.error("Error processing JSON:", error);
        throw error;
    }
}
