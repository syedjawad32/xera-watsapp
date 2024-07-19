import { Image } from "@chakra-ui/react";
// import { ArrowBackIcon } from "@chakra-ui/icons";
// import { Link, useLocation, useSearchParams } from "react-router-dom";
import logo from "../assets//logo.png-removebg-preview.png";
import styles from "./Navbar.module.css";

const Navbar = () => {
  // const location = useLocation();
  // const [searchParams] = useSearchParams();

  // Check if we are on the landlord detail page
  // const isLandlordDetailPage = location.pathname.startsWith("/landlord");

  return (
    <div className={styles.navBackground}>
      {/* <Link to={{ pathname: "/" }}> */}
        <Image
          src={logo}
          width=""
          height="65px"
          marginLeft={5}
          marginTop={1}
          marginBottom={1}
          alt="Logo"
        />
      {/* </Link> */}
      {/* {isLandlordDetailPage && (
        <Link
          className={styles.closeIcon}
          to={{ pathname: "/", search: searchParams.toString() }}
        >
          <ArrowBackIcon />
        </Link> */}
      {/* )} */}
    </div>
  );
};

export default Navbar;
