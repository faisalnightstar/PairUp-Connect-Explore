import React from "react";
import { useSelector } from "react-redux";

const Home = () => {
    const userData = useSelector((state) => state.auth);
    console.log("logged in user state: ", userData);
    return <div>Home</div>;
};

export default Home;
