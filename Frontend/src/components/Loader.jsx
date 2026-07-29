import { useEffect, useState } from 'react';

const Loader = ({ onDone }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 400); // let the fade-out transition finish
    }, 1100);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink transition-opacity duration-400 ${
        visible ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <div className="loader-pulse h-14 w-14 rounded-full border-2 border-pulse" />
      <p className="label-eyebrow mt-6 text-paper/60">
        FIT<span className="text-pulse">PULSE</span>
      </p>
    </div>
  );
};

export default Loader;
