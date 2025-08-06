import React, { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faDownload } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';

// RoadmapCanvas component
const RoadmapCanvas = ({ onClose, content }) => {
    const roadmapRef = useRef(null);

    const downloadPdf = () => {
        const doc = new jsPDF();
        const textLines = doc.splitTextToSize(content, 180);
        let y = 20;
        const margin = 20;

        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text("Your Customized Roadmap", margin, y);
        y += 15;

        doc.setLineWidth(0.5);
        doc.line(margin, y - 5, 190, y - 5);

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        
        const steps = content.split(/\d+\.\s*/).filter(Boolean);
        
        steps.forEach((step, index) => {
            const stepNumber = `${index + 1}. `;
            const stepText = step.trim();
            
            if (y > 280) {
                doc.addPage();
                y = 20;
            }
            
            doc.setFont("helvetica", "bold");
            doc.text(stepNumber, margin, y);
            
            doc.setFont("helvetica", "normal");
            const stepLines = doc.splitTextToSize(stepText, 170);
            doc.text(stepLines, margin + 8, y);
            
            y += (stepLines.length * 7) + 5;
        });

        doc.save("Aashima_Roadmap.pdf");
    };

    const steps = content.split(/\d+\.\s*/).filter(Boolean);

    return (
        <div className="p-4 overflow-y-auto relative h-full flex flex-col">
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-zinc-900 z-10 p-2 border-b border-zinc-700">
                <h4 className="text-xl font-bold">Your Customized Roadmap</h4>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <button className="py-1 px-3 rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-colors" onClick={downloadPdf}>
                        <FontAwesomeIcon icon={faDownload} className="mr-2" />
                        Download PDF
                    </button>
                    <button className="p-1 text-gray-400 hover:text-white" onClick={onClose}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
            </div>
            
            <div id="roadmap-canvas-content" ref={roadmapRef} className="p-4 bg-zinc-900 flex-grow">
                <div className="border border-zinc-700 rounded-md p-4 bg-zinc-800 space-y-6">
                    {steps.map((step, index) => (
                        <React.Fragment key={index}>
                            <div className="roadmap-step">
                                <div className="step-number">{index + 1}</div>
                                <div className="step-content">
                                    <p className="text-gray-400">{step.trim()}</p>
                                </div>
                            </div>
                            {index < steps.length - 1 && <div className="roadmap-connector"></div>}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RoadmapCanvas;