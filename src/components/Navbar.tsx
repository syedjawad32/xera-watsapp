import { Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.webp";
import styles from "./Navbar.module.css";

const Navbar = () => {
  return (
    <div className={styles.navBackground}>
      <Link to="/">
        <Image src={logo} boxSize="60px" marginLeft={3}></Image>
      </Link>
    </div>
  );
};

export default Navbar;
