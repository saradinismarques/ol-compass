import colorPalletData from '../data/static/color-pallete-data.json'
import introTexts from '../data/static/intro-texts.json'
import modesTexts from '../data/static/modes-texts.json'
import getStartedData from '../data/content/get-started-data.json';
import learnData from '../data/content/learn-data.json';
import linksPrinciples from '../data/content/links_principles.json';
import linksPerspectives from '../data/content/links_perspectives.json';
import linksDimensions from '../data/content/links_dimensions.json';
import conceptsData from '../data/content/concepts-data.json';
import getInspiredData from '../data/content/get-inspired-data.json';

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
            Opacity: {
                Max: 0,
                Hover: 0,
                Intro: 0,
                "Not Selected": 0
            }
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
        colors["Selection Method"] = versionData["Selection Method"];
        
        colors.Opacity.Max = versionData["Opacity [Max]"];
        colors.Opacity.Hover = versionData["Opacity [Hover]"];
        colors.Opacity.Intro = versionData["Opacity [Intro]"];
        colors.Opacity["Not Selected"] = versionData["Opacity [Not Selected]"];

        // Return the colors for the specific version
        return colors;
    } catch (error) {
        console.error("Error processing JSON:", error);
        throw error;
    }
}

export function getIntroTexts(language) {
    try {
        // Find the item in the introTexts array where LANGUAGE matches the desired language
        const item = introTexts.find(item => item.Language === language);

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


export function getModeTexts(mode) {
    try {
        const formattedMode = mode.replace(/-/g, ' ').toUpperCase();
        // Find the item in the introTexts array where LANGUAGE matches the desired language
        const item = modesTexts.find(item => item["#MODE-LABEL"] === formattedMode);

        // If a match is found, return the data; otherwise, return null or a default value
        if (item) {
            return {
                Headline: item["#headline"],
                Text: item["#text"],
                StartPrompt: item["#start-prompt"],
                Message: item["#?message?"],
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
export function getComponentsData(type) {
    if(type === 'default') return getDefaultData();
    else if(type === 'get-started') return getGetStartedData();
    else if(type === 'learn') return getLearnData();
    else if(type === 'learn-2') return getLinksData();
    else if(type === 'concepts') return getConceptsData();
}

export function getDefaultData() {
    try {
        // Process the JSON data
        const result = learnData.map(item => ({
            code: item["#code"],
            label: item["#label"],
            tooltip: item["#headline"],
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

export function getGetStartedData() {
    try {
        // Process the JSON data
        const result = getStartedData.map(item => ({
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

export function getLearnData() {
    try {
        // Process the JSON data
        const result = learnData.map(item => ({
            code: item["#code"],
            label: item["#label"],
            headline: item["#headline"],
            paragraph: item["#paragraph"],
            tooltip: item["#headline"],
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

function getLinksData() {
    try {
        // Create a map of labels from learnData for easy lookup
        const labelsMap = learnData.reduce((acc, item) => {
            acc[item["#code"]] = item["#label"];
            return acc;
        }, {});

        // Process the principles JSON
        let principlesData = linksPrinciples.map(item => ({
            code: item["Princ-ID"],
            label: labelsMap[item["Princ-ID"]] || "", // Get label from map
            paragraph: item["Principle-def"],
            phy: item["Phy-L"],
            phy_links: item["Phy-L_links"] ? item["Phy-L_links"].split(",").map(link => link.trim()) : [], // Convert to array
            geo: item["Geo-L"],
            geo_links: item["Geo-L_links"] ? item["Geo-L_links"].split(",").map(link => link.trim()) : [], // Convert to array
            che: item["Che-L"],
            che_links: item["Che-L_links"] ? item["Che-L_links"].split(",").map(link => link.trim()) : [], // Convert to array
            bio: item["Bio-L"],
            bio_links: item["Bio-L_links"] ? item["Bio-L_links"].split(",").map(link => link.trim()) : [], // Convert to array
            type: getType(item["Princ-ID"])
        }));

        // Process the perspectives JSON
        let perspectivesData = linksPerspectives.map(item => {
            let Py1 = Object.keys(item).find(key => item[key] === "y1" && key.startsWith("P")) || "";
            let Py2 = Object.keys(item).find(key => item[key] === "y2" && key.startsWith("P")) || "";
                    
            // Return the object with the necessary fields
            return {
                code: item["Per-ID"],
                label: labelsMap[item["Per-ID"]] || "", // Get label from map
                paragraph: item["What-PAR"],
                compared_paragraph: item["Compared with-PAR"],
                compared_code: item["Compared with-ID"],
                example_1: item["Example 1"],
                example_2: item["Example 2"],
                example_1_codes: [Py1],   // Single P code with "y1"
                example_2_codes: [Py2],   // Single P code with "y1"
                type: getType(item["Per-ID"])
            };
        });

        // Process the perspectives JSON
        let dimensionsData = linksDimensions.map(item => {
            let Py1 = Object.keys(item).find(key => item[key] === "y1" && key.startsWith("P")) || "";
            let Py2 = Object.keys(item).find(key => item[key] === "y2" && key.startsWith("P")) || "";
            let Pey1 = Object.keys(item).find(key => item[key] === "y1" && key.startsWith("Pe")) || "";
            let Pey2 = Object.keys(item).find(key => item[key] === "y2" && key.startsWith("Pe")) || "";
            
            return {
                code: item["Dim-ID"],
                label: labelsMap[item["Dim-ID"]] || "", // Get label from map
                paragraph: item["What-PAR"],
                compared_paragraph: item["Compared with-PAR"],
                compared_code: item["Compared with-ID"],
                example_1: item["Example 1"],
                example_2: item["Example 2"],
                example_1_codes: [Py1, Pey1],   // Single P code with "y1"
                example_2_codes: [Py2, Pey2],   // Single P code with "y1"
                type: getType(item["Dim-ID"])
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

export function getConceptsData() {
    try {
        // Process the JSON data
        const result = conceptsData.map(item => ({
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

export function getGetInspiredData() {
    try {
        // Function to extract components and return the case study object
        const result = getInspiredData.map(item => ({
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
