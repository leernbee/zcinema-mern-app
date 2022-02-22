import { useEffect } from 'react';

const useStyle = url => {
  useEffect(() => {
    var headID = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = url;

    headID.appendChild(link);

    return () => {
      headID.removeChild(link);
    };
  }, [url]);
};

export default useStyle;
