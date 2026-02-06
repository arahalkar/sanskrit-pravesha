
import React, { useState } from 'react';

interface Props {
  front: string;
  back: string;
}

const FlashcardItem: React.FC<Props> = ({ front, back }) => {
  const [flipped, setFlipped] = useState(false);

  // Common styles to ensure 3D behavior works across browsers
  const backfaceHidden: React.CSSProperties = {
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  };

  return (
    <div 
      className="relative w-full h-48 cursor-pointer [perspective:1000px] group"
      onClick={() => setFlipped(!flipped)}
    >
      <div 
        className="relative w-full h-full transition-transform duration-500 shadow-lg rounded-xl"
        style={{ 
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' 
        }}
      >
        {/* Front Side */}
        <div 
          style={{ 
            ...backfaceHidden,
            zIndex: 2,
            transform: 'rotateY(0deg)'
          }}
          className="bg-white flex flex-col items-center justify-center p-6 text-center border-2 border-orange-200 rounded-xl"
        >
          <span className="text-orange-400 text-[10px] font-bold uppercase tracking-widest mb-2">Sanskrit</span>
          <p className="text-xl font-medium devanagari text-orange-900 leading-relaxed">
            {front}
          </p>
        </div>
        
        {/* Back Side */}
        <div 
          style={{ 
            ...backfaceHidden,
            transform: 'rotateY(180deg)',
          }}
          className="bg-orange-100 flex flex-col items-center justify-center p-6 text-center border-2 border-orange-300 rounded-xl"
        >
          <span className="text-orange-500/50 text-[10px] font-bold uppercase tracking-widest mb-2">Meaning</span>
          <p className="text-lg text-slate-800 font-medium">
            {back}
          </p>
        </div>
      </div>
      
      {/* Visual Hint for kids */}
      <div className="absolute -bottom-6 left-0 right-0 text-center text-[10px] text-orange-400 font-bold uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">
        Tap to flip
      </div>
    </div>
  );
};

export default FlashcardItem;
