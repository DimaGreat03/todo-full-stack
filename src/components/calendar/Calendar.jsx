import "./Calendar.css";
import Calendar from "react-calendar";
import { instance } from "../api/axios.api";
import { useState } from "react";
import { format } from "date-fns";

const Calendary = ({ id, data, watcher, setWatcher }) => {


  const setUntill = (e) => {
    instance
      .patch(`/transactions/transaction/${id}`, {
        untill: e,
        isDeadLine: true
      })
      .then(() => setWatcher(!watcher));
  };

  return (
    <div>
      <Calendar 
              value={data} 
              onClickDay={(e) => setUntill(format(e, "yyyy.MM.dd"))}
              minDate={new Date()}
              />
    </div>
  );
};

export default Calendary;
