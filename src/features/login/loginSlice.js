import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = "http://localhost:8000/";

//res.dataのaccessにトークンが入るので、それをローカルストレージに入れる
const token = localStorage.localJWT;

//jwtのトークンを取得する時のAPI処理
//async(auth)に後で引数を渡す
//headersや${apiURL}の後にAPIのエンドポイントを書く
export const fetchAsyncLogin = createAsyncThunk("login/post",async(auth)=>{
    const res = await axios.post(`${apiUrl}authen/jwt/create`,auth, {
        headers:{
            "Content-Type": "application/json",
        },
    });
    return res.data;
});

//Register部分
export const fetchAsyncRegister = createAsyncThunk("register/post",async(auth)=>{
    const res = await axios.post(`${apiUrl}api/register/`,auth, {
        headers:{
            "Content-Type": "application/json",
        },
    });
    return res.data;
});

//ログインしているユーザーのIDとユーザーネームを取得する
//第２引数authを削除
//ヘッダーに認証のAuthorization: `JWT ${token}`,をつける
export const fetchAsyncProf = createAsyncThunk("login/get",async()=>{
    const res = await axios.get(`${apiUrl}api/myself/`, {
        headers:{
            Authorization: `JWT ${token}`,
        },
    });
    return res.data;
});

const loginSlice = createSlice({
    name: "login",
    initialState : {
        //ログイン情報
        authen: {
            username: "",
            password: "",
        },
        //ログインしていなかったら、Register画面に切り替えるため、ステータスを確認
        //profileの名前を空で定義
        isLoginView: true,
        profile: {
            id: 0,
            username: "",
        },
    },
    //ログインネームの入力を受け取るreducer
    //Reducersは現在のstateとactionにより、新しいstateをreturnする
    reducers: {
        editUsername(state, action) {
            state.authen.username = action.payload
        },
        editPassword(state, action) {
            state.authen.password = action.payload
        },
        //ログインとRegisterを反転させるトグル
        toggleMode(state) {
            state.isLoginView = !state.isLoginView;
        },
    },
    //extraReducersで、状態による処理を書く
    //fulfilledは成功した場合の処理
    //トークンの実態をlocalStorageのsetItem関数で入れる
    extraReducers: (builder) =>{
        builder.addCase(fetchAsyncLogin.fulfilled, (state, action)=> {
            localStorage.setItem("localJWT", action.payload.access);
            //論理積でブラウザを遷移
            //ログインに成功すると、Routerで設定したtasksへ飛ぶ
            action.payload.access && (window.location.href = "/tasks");
        });
        builder.addCase(fetchAsyncProf.fulfilled, (state, action)=> {
            state.profile = action.payload;
        })
    }
});
//エクスポートしていない関数をエクスポートする
//これでコンポーネントからディスパッチで呼び出せる
export const {editUsername, editPassword, toggleMode} = loginSlice.actions
//stateをエクスポートする
export const selectAuthen = (state) => state.login.authen;
export const selectIsLoginView = (state) => state.login.isLoginView;
export const selectProfile = (state) => state.login.profile;
//reducersをエクスポート
//reducersではなく、reducerと書く
export default loginSlice.reducer;