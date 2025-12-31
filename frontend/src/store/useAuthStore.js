import {create} from 'zustard';

export const useAuthStore = create((set,get)=>{
    authUser:{name:"john"}
    isLoggedIn:false,
    isLoading:true,
    login:()=>{
        set({isLoggedIn:true,isLoadng:false}),
    }
})