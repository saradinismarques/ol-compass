import colorPalletData from '../data/static/color-pallete-data.json'
import enIntroTexts from '../data/static/en/intro-texts.json'
import enModesTexts from '../data/static/en/modes-texts.json'
import enTooltipsTexts from '../data/content/en/tooltips-texts.json'
import enGetStartedData from '../data/content/en/get-started-data.json';
import enLearnData from '../data/content/en/learn-data.json';
import enLinksPrinciples from '../data/content/en/links-principles.json';
import enLinksPerspectives from '../data/content/en/links-perspectives.json';
import enLinksDimensions from '../data/content/en/links-dimensions.json';
import enConceptsData from '../data/content/en/concepts-data.json';
import enGetInspiredData from '../data/content/en/get-inspired-data.json';
import ptIntroTexts from '../data/static/pt/intro-texts.json'
import ptModesTexts from '../data/static/pt/modes-texts.json'
import ptTooltipsTexts from '../data/content/pt/tooltips-texts.json'
import ptLearnData from '../data/content/pt/learn-data.json';
import ptLinksPrinciples from '../data/content/pt/links-principles.json';
import ptLinksPerspectives from '../data/content/pt/links-perspectives.json';
import ptLinksDimensions from '../data/content/pt/links-dimensions.json';
import ptGetInspiredData from '../data/content/pt/get-inspired-data.json';

// Static
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

        colors.Selection = versionData["Selection"];
        colors["Selection Hover"] = versionData["Selection [Hover]"];

        colors["CBookmark"] = versionData["Bookmark Component"] || "#000000";
        colors["CBookmark Hover"] = versionData["Bookmark Component [Hover]"] || "#000000";
        colors["CSBookmark"] = versionData["Bookmark CaseStudies"] || "#000000";
        colors["CSBookmark Hover"] = versionData["Bookmark CaseStudies [Hover]"] || "#000000";
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
                Title: item["TITLE (Frame 00)"],
                IntroDef: item["INTRO_DEF (Frame 01)"],
                IntroWho: item["INTRO_WHO IS BEHIND (Frame 02)"],
                IntroSubject: item["INTRO_SUBJECT (Frame 03)"],
                DefineP: item["define_P (Frame 04)"],
                ClarifyP: item["clarify_P (Frame 05)"],
                DefinePe: item["define_Pe (Frame 06)"],
                ClarifyPe: item["clarify_Pe (Frame 07)"],
                DefineD: item["define_D (Frame 08)"],
                ClarifyD: item["clarify_D (Frame 09)"],
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
                StartPrompt: item["#start-prompt"],
                Message: item["#?message NB - NOT AUTOMATIC"],
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
            ["PRINCIPLES", "PERSPECTIVES", "DIMENSIONS"].includes(item["#label"])
        );

        // Convert to the required format
        const result = {
            Principle: filteredData.find(item => item["#label"] === "PRINCIPLES")?.["#TOOLTIP"],
            Perspective: filteredData.find(item => item["#label"] === "PERSPECTIVES")?.["#TOOLTIP"],
            Dimension: filteredData.find(item => item["#label"] === "DIMENSIONS")?.["#TOOLTIP"]
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
            acc[item["#label"]] = item["#TOOLTIP"];
            return acc;
        }, {});

        let lanLearnData;
        if(language === "en") lanLearnData = enLearnData;
        else if(language === "pt") lanLearnData = ptLearnData;
        else lanLearnData = enLearnData;

        // Process the JSON data
        const result = lanLearnData.map(item => ({
            code: item["#code"],
            label: item["#label"],
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
            acc[item["#label"]] = item["#TOOLTIP"];
            return acc;
        }, {});

        let lanLearnData;
        if(language === "en") lanLearnData = enLearnData;
        else if(language === "pt") lanLearnData = ptLearnData;
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
            acc[item["#label"]] = item["#TOOLTIP"];
            return acc;
        }, {});

        let lanLearnData;
        if(language === "en") lanLearnData = enLearnData;
        else if(language === "pt") lanLearnData = ptLearnData;
        else lanLearnData = enLearnData;

        // Create a map of labels from learnData for easy lookup
        const labelsMap = lanLearnData.reduce((acc, item) => {
            acc[item["#code"]] = item["#label"];
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
            wbc_links: item["WBC-P_links"] ? item["WBC-P_links"].split(",").map(link => link.trim()) : [], // Convert to array
            region_feature: item["REGION+FEATURE (WBC)"],
            country_e1: item["COUNTRY-E1 (Ce1)"],
            ce1_links: item["Ce1-Pe_links"] ? item["Ce1-Pe_links"].split(",").map(link => link.trim()) : [], // Convert to array
            country_e2: item["COUNTRY-E2 (Ce2)"],
            ce2_links: item["Ce2-Pe_links"] ? item["Ce2-Pe_links"].split(",").map(link => link.trim()) : [], // Convert to array
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
                diff_code: item["Diff-from"],
                diff_label: labelsMap[item["Diff-from"]] || "",
                diff_paragraph: item["Diff-from-PAR"],
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
            title: item["Title"],
            collection: item["Collection"],
            mainTarget: item["Main Target"],
            age: item["Age"],
            time: item["Time"],
            type: item["Type"],
            languages: item["Laguage(s)"],
            year: item["Year"],
            description: item["Description"],
            credits: item["Author, Country"],
            components: Object.keys(item).filter(key => item[key] === 'Y')
        }));
        return result;
    } catch (error) {
        console.error("Error processing JSON:", error);
        throw error;
    }
}
