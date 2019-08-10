

export const isLogin = () =>{

    if(typeof window == "undefined")
    {
        return false;
    }

    if(localStorage.getItem("ljwt")){
        return JSON.parse(localStorage.getItem("ljwt"));
    }
    else
    {
        return false;
    }

}; 

export const orderStatusValues = () =>{

    let enumStatus = [
      "Not processed",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled"
    ];

    return enumStatus;

}; 
