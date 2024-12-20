import colorPalletData from '../data/static/color-pallete-data.json'
import introTexts from '../data/static/intro-texts.json'
import modesTexts from '../data/static/modes-texts.json'
import getStartedData from '../data/content/get-started-data.json';
import learnData from '../data/content/learn-data.json';
import conceptsData from '../data/content/concepts-data.json';
import getInspiredData from '../data/content/get-inspired-data.json';

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

export function getGetStartedData() {
    try {
        // Process the JSON data
        const result = getStartedData.map(item => ({
            Code: item["#code"],
            Label: item["#label"],
            Headline: item["#headline-1"],
            ShowMore: item["SHOW MORE"],
            Type: getType(item['#code'])
        }));

        // Organize into three parts by Type
        const organizeComponents = result.reduce((acc, item) => {
            const type = item.Type;
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
            Code: item["#code"],
            Label: item["#label"],
            Headline: item["#headline"],
            Paragraph: item["#paragraph"],
            Tooltip: item["#headline"],
            Type: getType(item['#code'])
        }));

        // Organize into three parts by Type
        const organizeComponents = result.reduce((acc, item) => {
            const type = item.Type;
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

export function getGetInspiredData() {
    try {
        // Function to extract components and return the case study object
        const result = getInspiredData.map(item => ({
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
        return result;
    } catch (error) {
        console.error("Error processing JSON:", error);
        throw error;
    }
}
