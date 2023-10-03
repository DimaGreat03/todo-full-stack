import { useEffect, useRef } from "react";
import s from "./popup.module.css";
import { instance } from "../api/axios.api";
import { useState } from "react";

const PopupWithoutInput = (id) => {
  const [data, setData] = useState([]);
  // для textarea стили
  const [value, setValue] = useState(localStorage.getItem("text"));
  const textareaRef = useRef(null);
  // что бы мог растягиваться по длине value

  useEffect(() => {
    instance
      .get(`/popup/${localStorage.getItem("popId")}`)
      .then((data) => setData(data.data));
    
    const textarea = textareaRef.current;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`
  }, [value]);

  return (
    <div className={s.wrapper}>
      <div>
      <textarea
         placeholder="notes"
         className={s.textarea}
         ref={textareaRef}
         style={{ height: 'auto', resize: 'none' }}
         value={value}
    />
      </div>
      {data.length !== 0 ? (
        data.map((e) => {
          return (
            <li className={s.li}>
              <input className={s.input} checked={e.isCheck} type="checkbox" />
              {e.title}
            </li>
          );
        })
      ) : (
        <div className={s.li}> </div>
      )}
    </div>
  );
};

export default PopupWithoutInput;
