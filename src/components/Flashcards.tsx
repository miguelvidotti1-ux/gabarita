import React from 'react';

const Flashcards = () => {
  return (
    <div className="w-full h-full min-h-[600px] bg-[var(--bg-main)] rounded-xl overflow-hidden">
      <iframe 
        src="/flashcards-ui" 
        className="w-full h-full min-h-[600px] border-none"
        title="Flashcards"
      />
    </div>
  );
};

export default Flashcards;
