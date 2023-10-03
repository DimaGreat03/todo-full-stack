import { useState, useEffect, useRef } from "react";
import { instance } from "../api/axios.api";
import s from "./deepPopup.module.css"



const DeepPopup = ({setLocalWatcher, localWatcher}) => {

    const [value, setValue] = useState(localStorage.getItem("deepNotes"));
    const textareaRef = useRef(null);

    const updateNotes = (id) => {
        instance
          .patch(`/popup/${localStorage.getItem("deepId")}`, {
            notes: value,
          })
          .then(() => setLocalWatcher(!localWatcher))
      };


    useEffect(() => {
        const textarea = textareaRef.current;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`
      }, [localWatcher, value]);


  return <div>
     <textarea
         placeholder="notes"
         className={s.textarea}
         ref={textareaRef}
         style={{ height: 'auto', resize: 'none' }}
         value={value}
         onChange={(e) => setValue(e.target.value)}
         onBlur={() => updateNotes()}
    />
  </div>;
};

export default DeepPopup;
