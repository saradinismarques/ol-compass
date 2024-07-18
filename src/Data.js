import principlesData from './data/principles.json';

export function getDataFromJson() {
    try {
        // Process the JSON data
        const result = principlesData.map(item => ({
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
