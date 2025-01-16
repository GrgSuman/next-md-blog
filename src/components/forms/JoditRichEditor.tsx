'use client'
/* Imports */
import React, {useRef, useMemo } from 'react';

import JoditEditor from 'jodit-react';

/*functions*/
export default function JoditRichEditor ({content,setContent}:any) {
  const editor = useRef(null); //declared a null value 

  /* The most important point*/
  const config = useMemo( //  Using of useMemo while make custom configuration is strictly recomended 
    () => ({              //  if you don't use it the editor will lose focus every time when you make any change to the editor, even an addition of one character
      /* Custom image uploader button configuretion to accept image and convert it to base64 format */
    //   uploader: {         
    //     insertImageAsBase64URI: true,
    //     imagesExtensions: ['jpg', 'png', 'jpeg', 'gif', 'svg', 'webp'] // this line is not much important , use if you only strictly want to allow some specific image format
    //   },
    }),
    []
  );
  /* function to handle the changes in the editor */
  const handleChange = (value:any) => {
    setContent(value);
  };

  return (
    <>
        {/* This is the main initialization of the Jodit editor */}
          <JoditEditor 
            ref={editor}            //This is important
            value={content}         //This is important
            config={config}         //Only use when you declare some custom configs
            onChange={handleChange} //handle the changes
            className="w-full h-[70%] bg-white"
            />
            <style>
              {`.jodit-wysiwyg{min-height:300px !important}`}
            </style>
    </>
  );
}