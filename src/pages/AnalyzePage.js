import React, {useState, useEffect, useCallback, useMemo} from 'react';
import '../styles/AnalyzePage.css';
import OLCompass from '../components/OLCompass';
import Menu from '../components/Menu'

// const AnalyzePage = ({colors}) => {
//   // Memoize the initialState object
//   const initialState = useMemo(() => ({
//     title: '',
//     shortDescription: '',
//     credits: '',
//     sources: '',
//     components: [], // Use an array to hold selected components
//     initialState: true,
//     firstClick: true,
//     showMessage: false
//   }), []);

//   const [state, setState] = useState(initialState);

//   const resetState = useCallback(() => {
//     setState(initialState);
//   }, [initialState]);

//   const handleKeyDown = useCallback((e) => {
//     //for the initial state
//     if(e.key !== 'Enter') return;
//     if (!state.initialState) return;

//     if(state.firstClick) {
//       setState((prevState) => ({
//         ...prevState,
//         firstClick: false,
//         showMessage: true,
//       }));
//     }

//     setState((prevState) => ({
//       ...prevState,
//       initialState: false,
//     }));

//   }, [state.initialState, state.firstClick]);


//   useEffect(() => {
//     window.addEventListener('keydown', handleKeyDown);
//     return () => {
//         window.removeEventListener('keydown', handleKeyDown);
//     };
// }, [handleKeyDown]);


// const handleInputChange = (e) => {
//   const { name, value } = e.target;

//   setState((prevState) => ({
//     ...prevState,
//     [name]: value,
//   }));
// };

// const handleEnterClick = (components) => {
//   // for the rest of the interaction

//   const keys = [
//     "P1", "P2", "P3", "P4", "P5", "P6", "P7",
//     "Pe1", "Pe2", "Pe3", "Pe4", "Pe5", "Pe6", "Pe7",
//     "D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10"
//   ];
  
//   // Save the current state to local storage
//   const newuserInputData = {
//     "#title": state.title,
//     "#short-description": state.shortDescription,
//     "#credits": state.credits,
//     "#SOURCE [link]": state.sources,
//   };

//   keys.forEach(key => {
//     newuserInputData[key] = components.includes(key) ? "y" : "";
// });

//     // localStorage.setItem('userInputData', JSON.stringify(userInputData));
//     // const data = localStorage.getItem("userInputData");
//     // console.log('Data saved to localStorage:', data);

//     const existingData = localStorage.getItem('userInputData');
//     // Step 2: Parse existing data or create a new object if none exists
//     let userInputData = existingData ? JSON.parse(existingData) : {};
    
//     console.log(userInputData);
//     // Step 3: Add new input data
//     // Assuming newInputData is an object, merge it with existing data
//     // userInputData = {
//     //     ...userInputData,
//     //     ...newuserInputData
//     // };
//     userInputData.push(newuserInputData);

//     console.log(userInputData);


//     // Step 4: Save the updated data back to localStorage
//     localStorage.setItem('userInputData', JSON.stringify(userInputData));

//     // Optional: Log the updated data
//     const updatedData = localStorage.getItem("userInputData");
//     //console.log('Updated data saved to localStorage:', JSON.parse(updatedData));
//   };


//   const showMessage = () => {
//     setState((prevState) => ({
//       ...prevState,
//       showMessage: true,
//     }));
// };

//   const removeMessage = () => {
//     setState((prevState) => ({
//       ...prevState,
//       showMessage: false,
//     }));
//   };

//   return (
//     <div>
//     <div className={`${state.showMessage ? "blur-background" : ""}`}>
//       <OLCompass 
//         colors={colors} 
//         position="left" 
//         action="analyze"
//         onButtonClick={handleEnterClick} 
//         resetState={resetState} 
//       />
//         {state.initialState && (
//         <>
//         <div className='text-container'>
//             <p className='question'>
//               What's it for?
//             </p>
//             <p className='headline'>
//               Scan an OL practice or resource you developed!
//             </p>
//             <p className='text'>
//               You want to make sense of an OL resource/experience you developed?
//               <br></br>
//               In the ANALYSE mode the Compass provides you with a structured way to see and record your own OL contents or initiatives, for future personal or public use.
//               <br></br>
//               <br></br>
//               Press 'Enter' to start the analysis.
//             </p>
//         </div>
//         </>
//         )} 

//         {!state.initialState && (
//         <>
//         <button onClick={showMessage} className="question-button">
//               <svg 
//                 className="question-icon" 
//                 fill="currentcolor" 
//                 stroke="currentcolor" /* Adds stroke color */
//                 xmlns="http://www.w3.org/2000/svg" 
//                 viewBox="-1 109 35 35"  
//                 >
//                 <path d="m14.01,133.19c0-1.09.05-2.04.16-2.87.1-.83.38-1.66.82-2.5.42-.79.93-1.45,1.55-1.97.61-.52,1.25-1.02,1.92-1.48.67-.47,1.3-1.02,1.9-1.66.54-.63.91-1.26,1.09-1.9s.27-1.32.27-2.03-.09-1.34-.26-1.9c-.17-.56-.44-1.04-.8-1.44-.56-.68-1.24-1.15-2.05-1.4s-1.65-.38-2.53-.38-1.67.12-2.41.37c-.75.24-1.36.62-1.85,1.12-.47.45-.82.98-1.03,1.61-.22.63-.32,1.29-.32,1.98h-3.17c.06-1.1.3-2.18.72-3.23.42-1.05,1.05-1.93,1.87-2.64.82-.75,1.78-1.3,2.87-1.64,1.09-.34,2.2-.51,3.31-.51,1.36,0,2.66.21,3.88.62,1.23.41,2.26,1.1,3.09,2.06.67.71,1.16,1.52,1.47,2.43.31.91.47,1.88.47,2.91,0,1.16-.22,2.24-.65,3.26-.43,1.02-1.04,1.92-1.82,2.72-.47.52-1.01.99-1.61,1.43-.6.44-1.17.89-1.72,1.36-.55.47-.97.97-1.26,1.51-.36.67-.56,1.3-.6,1.9-.03.6-.05,1.36-.05,2.28h-3.26Zm.02,8.21v-4.09h3.24v4.09h-3.24Z"/>
//               </svg>
//             </button>
//         <div className="a-text-container">
//           <div className="a-title">
//               <input 
//                 name="title"
//                 className="a-placeholder" 
//                 type="text" 
//                 placeholder="Insert Title"   
//                 onChange={handleInputChange}
//               />
//           </div>
//           <div className='a-text'>
//               <p className='a-small-instruction'>Select all relevant elements</p>
//               <div className='a-instruction-container'>
//                   <p className='a-instruction'>Click again to deselect</p>
//                   <p className='a-instruction'>Long press to recall description</p>
//               </div>
//               <div className='a-question-container'>
//                   <p className='a-question'>Which principles does your case address?</p>
//                   <p className='a-question'>Which perspective(s) does it express?</p>
//                   <p className='a-question'>Which dimension(s) does it pertain?</p>
//               </div>
//           </div>
//           <div className="a-description">
//               <textarea 
//                 name="shortDescription"
//                 className="a-placeholder" 
//                 placeholder="Insert Description"
//                 onChange={handleInputChange}
//               ></textarea>
//           </div>
//           <div className="a-insert-sources">
//               <input 
//                 name="credits"
//                 type="text"
//                 className="a-placeholder" 
//                 placeholder="Insert Credits" 
//                 onChange={handleInputChange}
//                 />
//           </div>
//           <div className="a-insert-sources">
//               <input 
//                 name="sources"
//                 type="text" 
//                 className="a-placeholder" 
//                 placeholder="Insert Sources" 
//                 onChange={handleInputChange}
//                 />
//           </div>
//           <button className="a-preview-button">Submit</button>
//         </div>
//         </>
//         )}  
//         <Menu />
//     </div>
//     {!state.initialState && state.showMessage && (
//       <>
//       <div className="message-box">
//         <div className="question-circle">
//             <svg 
//                 className="question-icon" 
//                 fill="currentcolor" 
//                 stroke="currentcolor" /* Adds stroke color */
//                 xmlns="http://www.w3.org/2000/svg" 
//                 viewBox="-1 109 35 35"  
//               >
//               <path d="m14.01,133.19c0-1.09.05-2.04.16-2.87.1-.83.38-1.66.82-2.5.42-.79.93-1.45,1.55-1.97.61-.52,1.25-1.02,1.92-1.48.67-.47,1.3-1.02,1.9-1.66.54-.63.91-1.26,1.09-1.9s.27-1.32.27-2.03-.09-1.34-.26-1.9c-.17-.56-.44-1.04-.8-1.44-.56-.68-1.24-1.15-2.05-1.4s-1.65-.38-2.53-.38-1.67.12-2.41.37c-.75.24-1.36.62-1.85,1.12-.47.45-.82.98-1.03,1.61-.22.63-.32,1.29-.32,1.98h-3.17c.06-1.1.3-2.18.72-3.23.42-1.05,1.05-1.93,1.87-2.64.82-.75,1.78-1.3,2.87-1.64,1.09-.34,2.2-.51,3.31-.51,1.36,0,2.66.21,3.88.62,1.23.41,2.26,1.1,3.09,2.06.67.71,1.16,1.52,1.47,2.43.31.91.47,1.88.47,2.91,0,1.16-.22,2.24-.65,3.26-.43,1.02-1.04,1.92-1.82,2.72-.47.52-1.01.99-1.61,1.43-.6.44-1.17.89-1.72,1.36-.55.47-.97.97-1.26,1.51-.36.67-.56,1.3-.6,1.9-.03.6-.05,1.36-.05,2.28h-3.26Zm.02,8.21v-4.09h3.24v4.09h-3.24Z"/>
//             </svg>
//           </div>
//         <p className="message-text">
//           Fill the form with information about your OL content/initiative, select all the Principles/Perspectives/Dimensions it addresses and press 'Enter' to save it.
//         </p>
//         <button className="got-it-button" onClick={removeMessage}>
//           Ok, got it!
//         </button>
//       </div>
//       </>
//     )}
//     </div>
//   );
// };

// export default AnalyzePage;

const AnalyzePage = ({colors}) => {
  return (
    <div>
      <OLCompass colors={colors} action="default-left" />
        <div className='text-container'>
            <p className='question'>
              What's it for?
            </p>
            <p className='headline'>
              Scan an OL practice or resource you developed!
            </p>
            <p className='text'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            
            <div className="instruction-container">
              <svg 
                className='plus-icon'
                fill="currentcolor" 
                stroke="currentcolor"
                viewBox="0 0 512 512" 
                version="1.1" 
                xmlns="http://www.w3.org/2000/svg" 
              >
              <path d="M213.333333,1.42108547e-14 L213.333,170.666 L384,170.666667 L384,213.333333 L213.333,213.333 L213.333333,384 L170.666667,384 L170.666,213.333 L1.42108547e-14,213.333333 L1.42108547e-14,170.666667 L170.666,170.666 L170.666667,1.42108547e-14 L213.333333,1.42108547e-14 Z"></path>
              </svg>
              <button className='start-new-button'>
                Start New Analysis
              </button>
            </div>
            
            <div className="not-available-container">
                <svg 
                  className="lock-icon"
                  fill="currentcolor"
                  xmlns="http://www.w3.org/2000/svg"  
                  viewBox="0 0 64 64">
                  <path d="M 32 9 C 24.832 9 19 14.832 19 22 L 19 27.347656 C 16.670659 28.171862 15 30.388126 15 33 L 15 49 C 15 52.314 17.686 55 21 55 L 43 55 C 46.314 55 49 52.314 49 49 L 49 33 C 49 30.388126 47.329341 28.171862 45 27.347656 L 45 22 C 45 14.832 39.168 9 32 9 z M 32 13 C 36.963 13 41 17.038 41 22 L 41 27 L 23 27 L 23 22 C 23 17.038 27.037 13 32 13 z"/>
                </svg>
                <p className='not-available'>
                  Not Available Yet
                </p>
            </div>
        </div>
      <Menu />
    </div>
  );
};

export default AnalyzePage;