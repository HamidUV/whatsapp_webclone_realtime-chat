import React from 'react';

function SplashScreen() {
  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen bg-gray-100">
      <img 
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/512px-WhatsApp.svg.png" 
        alt="WhatsApp Logo"
        className="w-20 h-20"
      />
      <h1 className="text-2xl text-gray-600 mt-4 font-light">WhatsApp</h1>
    </div>
  );
}

export default SplashScreen;