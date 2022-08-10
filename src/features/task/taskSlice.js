import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const apiUrl = "http://localhost:8000/api/tasks/";
const token = localStorage.localJWT;
//表示
export const fetchAsyncGet = createAsyncThunk("task/get", async () => {
    const res = await axios.get(apiUrl, {
        headers: {
            Authorization: `JWT ${token}`,
        },
    });
    return res.data;
});
//新規作成
export const fetchAsyncCreate = createAsyncThunk("task/post", async (task) => {
    const res = await axios.post(apiUrl,task, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${token}`,
        },
    });
    return res.data;
});
//更新
export const fetchAsyncUpdate = createAsyncThunk("task/put", async (task) => {
    const res = await axios.put(`${apiUrl}${task.id}/`,task, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${token}`,
        },
    });
    return res.data;
});
//削除
export const fetchAsyncDelete = createAsyncThunk("task/delete", async (id) => {
    await axios.delete(`${apiUrl}${id}/`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${token}`,
        },
    });
    return id;
});

const taskSlice = createSlice({
    name: "task",
    initialState: {
        tasks: [
            {
                id: 0,
                title: "",
                created_at: "",
                updated_at: "",
            },
        ],
        editedTask: {
            id: 0,
            title: "",
            created_at: "",
            updated_at: "",
        },
        selectedTask: {
            id: 0,
            title: "",
            created_at: "",
            updated_at: "",
        },
    },
    //stateをアップデートするアクション
    reducers: {
        editTask(state, action) {
            state.editedTask = action.payload;
        },
        selectTask(state, action) {
            state.selectedTask = action.payload;
        },
    },
    //後処理をextraに書く
    //...stateでstateを分解して、tasksに値を入れる
    extraReducers: (builder) => {
        builder.addCase(fetchAsyncGet.fulfilled, (state, action)=> {
            return {
                ...state,
                tasks: action.payload,
            };
        });
        //先頭から追加される
        builder.addCase(fetchAsyncCreate.fulfilled, (state, action)=> {
            return {
                ...state,
                tasks: [action.payload, ...state.tasks],
            };
        });
        //配列をmapでいついつ見ていく、一致したら更新、一致しなかったら同じ値を再度入れる
        builder.addCase(fetchAsyncUpdate.fulfilled,(state,action)=>{
            return {
                ...state,
                tasks: state.tasks.map((t) =>
                t.id === action.payload.id ? action.payload : t
                ),
                selectedTask: action.payload,
            };
        });
        //削除したもの以外で更新
        builder.addCase(fetchAsyncDelete.fulfilled,(state, action)=> {
            return {
                ...state,
                tasks: state.tasks.filter((t) => t.id !== action.payload),
                selectedTask: { id: 0, title: "", created_at: "", updated_at: ""},
            }
        })
    },
});
//reducersのアクションをエクスポート
export const { editTask, selectTask } = taskSlice.actions;

//selectXXは、任意でつけた名前
export const selectSelectedTask = (state) => state.task.selectedTask;
export const selectEditedTask = (state) => state.task.editedTask;
export const selectTasks = (state) => state.task.tasks;

export default taskSlice.reducer;
//次にstore.jsでインポートする