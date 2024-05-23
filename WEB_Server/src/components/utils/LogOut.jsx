import Cookies from "js-cookie";

const LogOut = () => {
    localStorage.removeItem("localData");
    Cookies.remove("remember");
    window.location.reload();
};

export default LogOut