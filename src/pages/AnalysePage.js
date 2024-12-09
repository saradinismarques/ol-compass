import React from 'react';
import OLCompass from '../components/OLCompass'
import Menu from '../components/Menu';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const AnalysePage = ({ colors }) => {
    const handleDownloadPDF = async () => {
        const element = document.getElementById('capture');
        
        const pdf = new jsPDF("landscape", "mm", "a4");
        const canvas = await html2canvas(element, { scale: 2, logging: true });
        const imgData = canvas.toDataURL('image/png');

        // Add custom content to the PDF
         // Load Manrope font (from Google Fonts or local font file)
        pdf.addFileToVFS('Manrope-Regular.ttf', require('../assets/Manrope-VariableFont_wght.ttf'));
        pdf.addFont('Manrope-Regular.ttf', 'Manrope', 'normal');

        // Set Manrope as the font for the PDF
        pdf.setFont('Manrope'); 
        pdf.setFontSize(16);
        // pdf.text("Ocean Literacy Concepts", 10, 20);


        // Step 3: Calculate the center position for the content
        // Dimensions of the A4 page
        const a4Width = pdf.internal.pageSize.getWidth();
        const a4Height = pdf.internal.pageSize.getHeight();
         // Original dimensions of the captured canvas
         const imgWidth = 600; // In pixels
         const imgHeight = 600; // In pixels
 
         // Convert pixel dimensions to mm
         const pixelToMm = 25.4 / 96; // Conversion factor (1 inch = 25.4 mm, screen DPI = 96)
         const contentWidth = imgWidth * pixelToMm;
         const contentHeight = imgHeight * pixelToMm;
 
         // Scale the image to fit within the A4 dimensions while maintaining aspect ratio
         const scaleFactor = Math.min(a4Width / contentWidth, a4Height / contentHeight);
         // Calculate the x and y positions to center the image
         console.log(a4Width);
         console.log(contentWidth);
         const x = (a4Width - contentWidth)/ 2 ;
         const y = (a4Height - contentHeight) / 2;
        // Example: Add an image (optional)
        // (You need the image as a Base64 string or a URL)
        // const imgBase64 = "data:image/png;base64,...";
        // doc.addImage(imgBase64, "PNG", 10, 60, 50, 50);
        pdf.addImage(imgData, 'PNG', x, y, contentWidth, contentHeight);

        // Trigger the download
        pdf.save("Ocean_Literacy.pdf");
    };

    return (
        <>
        <div id='capture' 
        style={{
            position: 'fixed',   // Fixed position to stay in the specified location
            top: '50vh',            // Reset top for positioning
            left: '50vw',           // Reset left for positioning
            transform: `translate(-50%, -50%)`,
            height: 600,
            width: 600,
            backgroundColor: "#ff6f7f",
          }}
        >
        <OLCompass 
            colors={colors}
            mode="analyse"
            position="center" 
        /> 
        </div>
        <Menu />
        <button onClick={handleDownloadPDF}>Download PDF with Border</button>
        </>
    );
};

export default AnalysePage;