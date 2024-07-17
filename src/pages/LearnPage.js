import React, { useState } from 'react';
import '../styles/Text.css';

const LearnPage = () => {
  const [showMore, setShowMore] = useState(false);

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  return (
    <div className="gradient-background">
      <div className="circle left"></div>
      <div className="text-container">
        <h2>PRINCIPLE 7</h2>
        <h1>THE OCEAN IS LARGELY UNKNOWN</h1>

        <div className={showMore ? 'text-content expanded' : 'text-content'}>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
            labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit
            esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
          {showMore && (
            <>
              <p>
                Additional information goes here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                scelerisque justo at ligula blandit, non pulvinar lacus porttitor.
              </p>
              <p>
                More information can be added as needed. Phasellus a nunc non turpis egestas tempor nec ut odio.
                Sed non metus sit amet dolor tincidunt vestibulum.
              </p>
            </>
          )}
        </div>

        <button onClick={toggleShowMore} className="show-more-button">
          {showMore ? 'Show less' : 'Show more'}
        </button>
      </div>
    </div>
  );
};

export default LearnPage;
