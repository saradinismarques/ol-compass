import React, { useState } from 'react';
import '../styles/Text.css';
import '../styles/App.css';

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
              Senectus et netus et malesuada fames ac turpis. Purus non enim praesent elementum. Donec ac odio tempor orci dapibus. Blandit cursus risus at ultrices mi tempus imperdiet nulla. Mauris cursus mattis molestie a iaculis at erat pellentesque. Adipiscing commodo elit at imperdiet dui accumsan sit. Ornare lectus sit amet est placerat in egestas erat imperdiet. Elementum eu facilisis sed odio morbi quis commodo. Consequat id porta nibh venenatis cras. Urna duis convallis convallis tellus id. Neque gravida in fermentum et sollicitudin ac orci phasellus egestas. Nunc non blandit massa enim nec dui nunc mattis enim. Et ultrices neque ornare aenean euismod elementum. Mauris in aliquam sem fringilla. Curabitur gravida arcu ac tortor dignissim convallis aenean et. Nulla porttitor massa id neque aliquam.
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
