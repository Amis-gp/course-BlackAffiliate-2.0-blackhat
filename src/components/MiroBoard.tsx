'use client';

import { useState, useEffect } from 'react';

const MiroBoard = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="w-full mb-8 rounded-lg bg-gray-800 animate-pulse" style={{height: '600px'}}></div>;
  }

  return (
    <div className="w-full mb-8" style={{height: '600px'}}>
      <iframe
        width="100%"
        height="100%"
        src="https://miro.com/app/live-embed/uXjVJd8dQOg=/?embedMode=view_only_without_ui&moveToViewport=-51291,7398,35011,19339&embedId=187877913013"
        frameBorder="0"
        scrolling="no"
        allow="fullscreen; clipboard-read; clipboard-write"
        allowFullScreen
        className="rounded-lg"
        loading="lazy"
      />
    </div>
  );
};

export default MiroBoard;