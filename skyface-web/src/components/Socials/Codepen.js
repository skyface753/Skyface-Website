// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaCodepen } from "react-icons/fa";
export default function CodepenButton({ link, size = "2.4em" }) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: "white", textDecoration: "none", marginLeft: "10px" }}
    >
      {/* <h1>Codepen Button</h1> */}
      {/* <FontAwesomeIcon icon={FaCodepen} /> */}
      <FaCodepen
        style={{
          fontSize: size,
        }}
      />
    </a>
  );
}
