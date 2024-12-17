import React, { useState, useMemo, useCallback, useRef, useEffect, useContext } from 'react';
import OLCompass from '../components/OLCompass'
import CompassIcon from '../components/CompassIcon'
import Menu from '../components/Menu';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import ManropeFont from '../utils/Font.js';
import ReactDOM from 'react-dom';
import { StateContext } from "../State";
import '../styles/pages/AnalysePage.css';

const AnalysePage = () => {
    const {
        colors,
        firstMessage,
        setFirstMessage,
        isExplanationPage,
        setIsExplanationPage,
        allComponents,
        AComponents,
        setAComponents,
        AComponentsRef,
        addedComponents,
        setAddedComponents,
        removedComponents,
        setRemovedComponents,
      } = useContext(StateContext);

    const [projectName, setProjectName] = useState('');
    const [components, setComponents] = useState([]);
    const [activeTask, setActiveTask] = useState('A'); // Track active button
    const [ASubtask, setASubtask] = useState('All'); // Track active button
    const [mode, setMode] = useState('analyse');

    const componentsRef = useRef(components);

    useEffect(() => {
        componentsRef.current = components;
    }, [components]);
    
    setIsExplanationPage(false);

    const resetState = useCallback(() => {
        setProjectName('');
        setActiveTask('A');
        setASubtask('All');
        setMode('analyse');
    }, []);

    const handleCompassClick = (code, title, headline, type) => {
        setComponents((prevComponents) => {
            const componentExists = prevComponents.some((component) => component.code === code);
      
            const updatedComponents = componentExists
              ? prevComponents.filter((component) => component.code !== code)
              : [
                  ...prevComponents,
                  {
                    code,
                    title,
                    headline,
                    type,
                  },
                ];
      
            const sortedComponents = updatedComponents.sort((a, b) => {
              const indexA = allComponents.indexOf(a.code);
              const indexB = allComponents.indexOf(b.code);
      
              if (indexA === -1) return 1;
              if (indexB === -1) return -1;
      
              return indexA - indexB;
            });
      
            componentsRef.current = sortedComponents;
            return sortedComponents;
          });
    };

    // Handle input change for project name
    const handleInputChange = (e) => {
        setProjectName(e.target.value);
    };

    const handleTaskChange = (task) => {
        setActiveTask(task); // Set active button based on the index
        setMode('analyse-' + task.toLowerCase());
    };

    const handleASubtaskChange = (subtask) => {
        setASubtask(subtask); // Set active button based on the index
        setMode('analyse-a-' + subtask.toLowerCase())
        
        document.documentElement.style.setProperty('--background-color', colors['Wave'][subtask]);
        document.documentElement.style.setProperty('--title-color', colors['Text'][subtask]);
    };

    return (
    <>
        <textarea
            className="a-textarea" 
            type="text" 
            placeholder='Insert Project Name'
            value={projectName} 
            onChange={handleInputChange}
            spellcheck="false"
        ></textarea>

        <div id='ol-compass' className='a-ol-compass'>
            <OLCompass 
                mode={mode}
                position="center" 
                resetState={resetState}
                onButtonClick={handleCompassClick}
            /> 
        </div>

        {/* <CompassIcon 
                colors={colors} 
                mode={'analyse'}
                type={'Dimension'} 
        /> */}
        <div className="a-tasks-nav fixed">
            <button 
                className={`a-task-button ${'A' === activeTask ? 'active' : ''}`} 
                onClick={() => handleTaskChange('A')}>
                A
            </button>

            <button 
                className={`a-task-button ${'B' === activeTask ? 'active' : ''}`} 
                onClick={() => handleTaskChange('B')}>
                B
            </button>

            <button 
                className={`a-task-button ${'C' === activeTask ? 'active' : ''}`} 
                onClick={() => handleTaskChange('C')}>
                C
            </button>

            <button 
                className={`a-task-button ${'D' === activeTask ? 'active' : ''}`} 
                onClick={() => handleTaskChange('D')}>
                D
            </button>
            <button 
                className='a-generate-pdf-button'
                //onClick={handleDownloadPDF}
                >
                Generate Visual Report
            </button>
        </div> 

        {activeTask === 'A' &&
        <>
        <div className="a-subtask-nav">
            <button 
                className={`a-subtask-button ${'All' === ASubtask ? 'active' : ''}`} 
                onClick={() => handleASubtaskChange('All')}>
                All
            </button>

            <button 
                className={`a-subtask-button ${'Principle' === ASubtask ? 'active' : ''}`} 
                onClick={() => handleASubtaskChange('Principle')}>
                P
            </button>

            <button 
                className={`a-subtask-button ${'Perspective' === ASubtask ? 'active' : ''}`} 
                onClick={() => handleASubtaskChange('Perspective')}>
                Pe
            </button>

            <button 
                className={`a-subtask-button ${'Dimension' === ASubtask ? 'active' : ''}`} 
                onClick={() => handleASubtaskChange('Dimension')}>
                D
            </button>
        </div>
        
            {ASubtask !== 'All' &&
                <div className='a-definitions-container fixed'>
                    {components
                        .filter((c) => c.Type === ASubtask) // Filter by the specific type
                        .map((c) => (
                            <div className='a-definition'>
                                <p className='a-definition-title'>{c.Title}</p>
                                <p className='a-definition-text'>{c.Text}</p>
                            </div>
                    ))}
                </div>
            }
        
            </>
        }

        {activeTask === 'B' &&
            <>
            <div className='a-changed-components'>
                <p className='a-added-components'>ADDED</p>
                <p className='a-removed-components'>REMOVED</p>
            </div>
            </>
        }
        <Menu />
    </>  
    );
};
export default AnalysePage;
