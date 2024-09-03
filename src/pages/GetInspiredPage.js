import React, { useState, useCallback, useMemo } from 'react';
import '../styles/GetInspiredPage.css';
import OLCompass from '../components/OLCompass';
import Menu from '../components/Menu';

const GetInspiredPage = ({colors}) => {
  // Memoize the initialState object
  const initialState = useMemo(() => ({
    text: [], 
    showMore: false,
    initialState: true,
  }), []);

  const [state, setState] = useState(initialState);

  const resetState = useCallback(() => {
    setState(initialState);
  }, [initialState]);

  const handleEnterClick = (components) => {
    const text = components.join('\n');

    setState((prevState) => ({
        ...prevState,
        text,
        showMore: false,
        initialState: false,
    }));
  };

  const toggleShowMore = () => {
    setState((prevState) => ({
      ...prevState,
      showMore: !prevState.showMore,
    }));
  };


  return (
    <div>
      <OLCompass 
        colors={colors} 
        action="get-inspired" 
        onButtonClick={handleEnterClick} 
        resetState={resetState} 
      />
        {state.initialState && (
        <>
        <div className='text-container'>
            <p className='question'>
              What's it for?
            </p>
            <p className='headline'>
              Browse inspiring application cases
            </p>
            <p className='text'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p className='instruction'>
              Select as many elements as you like to filter examples
            </p>
        </div>
        </>
        )} 

        {!state.initialState && (
        <>
        <div className='gi-text-container'>
        <p className='gi-results'>
            <span className='bold-text'>16 </span>
            results | Relevance
        </p>
        <div className="gi-card-container">
            <h1 className="gi-title">[Title XXX]</h1>
            <p className="gi-description">[Short Description]</p>
            <p className="gi-description">{state.text}</p>
            <p className="gi-credits">Credits: [Lorem Ipsum]</p>
            <button onClick={toggleShowMore} className="gi-show-more-button">
                {state.showMore ? 'Show less' : 'Show more'}
            </button>
        </div>
        </div>
        </>
        )}    

         <Menu />
    </div>
  );
};

// const GetInspiredPage = ({colors}) => {
//   return (
//     <div>
//       <OLCompass colors={colors} action="default-left" />
//         <div className='text-container'>
//             <p className='question'>
//               What's it for?
//             </p>
//             <p className='headline'>
//               Browse inspiring application cases
//             </p>
//             <p className='text'>
//               Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
//             </p>
//             <p className='instruction'>
//               Select as many elements as you like to filter examples
//             </p>
//             <p className='not-available'>
//               Not Available Yet
//             </p>
//         </div>
//         <Menu />
//     </div>
//   );
// };

export default GetInspiredPage;
