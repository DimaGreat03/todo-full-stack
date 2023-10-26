import { useEffect, useRef, useState } from "react";
import { instance } from "../../api/axios.api";
import s from "./OpenedNotes.module.css";

const OpenedNotes = () => {
  const [watcher, setWatcher] = useState(false);
  const [value, setValue] = useState(localStorage.getItem("openedNotes"));
  const textareaRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [value]);

  const updateNotes = (id) => {
    instance
      .patch(`/notes/${localStorage.getItem("noteId")}`, {
        letters: value,
      })
      .then(
        () => setWatcher(!watcher) & localStorage.setItem("openedNotes", value)
      );
  };

  return (
    <div className={s.wrapper}>
      <h1 className={s.h1}>{localStorage.getItem("titleNotes")}</h1>
      <hr />

      <textarea
        spellcheck="false"
        placeholder="notes"
        className={s.textarea}
        ref={textareaRef}
        style={{ height: "auto", resize: "none" }}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => updateNotes()}
      />
    </div>
  );
};

export default OpenedNotes;
