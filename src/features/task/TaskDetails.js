import React from 'react';
import styles from "./TaskDetails.module.css";
import { useSelector } from "react-redux";
import { selectSelectedTask } from "./taskSlice";

const TaskDetails = () => {
    //インポートした機能を代入する
    const selectedTask = useSelector(selectSelectedTask);
  return (
    //論理積でselectedTask.titleが存在するときだけ、title、created_at等を表示する
    <div className={styles.details}>
    
      {selectedTask.title && (
        <>
            <h2>{selectedTask.title}</h2>
            <p>Created at</p>
            <h3>{selectedTask.created_at}</h3>
            <p>updated at</p>
            <h3>{selectedTask.updated_at}</h3>
        </>
      )}
    </div>
  )
}

export default TaskDetails
