import React, { useState, useCallback, useEffect } from 'react';
import '../styles/IdeatePage.css';
import OLCompass from '../components/OLCompass';
import PostIt from '../components/PostIt';
import Menu from '../components/Menu';

const IdeatePage = ({ colors }) => {
  const [postItPositions, setPostItPositions] = useState([]); // For PostIts created by clicking outside
  const [initialState, setInitialState] = useState(true); // Initial state of the ideation page
  const [initialPostIts, setInitialPostIts] = useState([{ id: 0 }]); // Tracks all initial PostIts created

  const toggleInitialState = () => {
    setInitialState(false);
  };

  const resetState = useCallback(() => {
    setPostItPositions([]);
    setInitialState(true);
    setInitialPostIts([{ id: 0 }]); // Reset initial PostIts
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      resetState();
    }
  }, [resetState]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Handle click outside compass to create new PostIt
  const handleClickOutside = (coords) => {
    setPostItPositions([...postItPositions, { x: coords.x + 5, y: coords.y - 55 }]);
  };

  // Handle dragging the initial PostIt to trigger new PostIt creation
  const handlePostItDragStart = (id) => {
    // Check if the dragged PostIt is the initial one and create a new initial PostIt
    if (id === initialPostIts[initialPostIts.length - 1].id) {
      const newId = id + 1;
      setInitialPostIts([...initialPostIts, { id: newId }]);
    }
  };

  return (
    <div>
      {!initialState && (
        <>
          <div className="circle-container">
            <div className="circle circle-left"></div>
            <div className="content content-left">
              <h1>theory-driven ideation</h1>
              <p>select the compass elements you want to tackle and come up with an idea to do so</p>
            </div>

            <div className="circle circle-right"></div>
            <div className="content content-right">
              <h1>intuition-driven ideation</h1>
              <p>note down your idea and trace it back to the compass elements</p>
            </div>
          </div>

          {/* Render all initial PostIts */}
          {initialPostIts.map((postIt) => (
            <PostIt
              key={postIt.id}
              isInitialPostIt
              onDragStart={() => handlePostItDragStart(postIt.id)}
            />
          ))}

          {/* Render PostIts created by clicking outside the compass */}
          {postItPositions.map((position, index) => (
            <PostIt key={index} position={position} />
          ))}

          <OLCompass colors={colors} action="ideate" onClickOutside={handleClickOutside} />
        </>
      )}
      {initialState && (
        <>
          <OLCompass colors={colors} action="default-left" />
          <div className="text-container">
            <p className='question'>
              What's it for?
            </p>
            <p className='headline'>
              Come up with new ideas for pursuing OL
            </p>
            <p className='text'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <button onClick={toggleInitialState} className='start-new-button'>
              Start New Ideation Session
            </button>
          </div>
        </>
      )}
    <Menu />
    </div>
  );
};

// const IdeatePage = ({colors}) => {
//   return (
//     <div>
//       <OLCompass colors={colors} action="default-left" />
//         <div className='text-container'>
//             <p className='question'>
//               What's it for?
//             </p>
//             <p className='headline'>
//               Come up with new ideas for pursuing OL
//             </p>
//             <p className='text'>
//               Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
//             </p>
//             <p className='instruction'>
//               Start New Ideation Session
//             </p>
//             <p className='not-available'>
//               Not Available Yet
//             </p>
//         </div>
//         <Menu />
//     </div>
//   );
// };

export default IdeatePage;
