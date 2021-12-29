import React, { useState } from "react";
import PropTypes from "prop-types";
import { MdMoreVert } from "react-icons/md";
import { Link } from "react-router-dom";
import { SpinnerCircular } from "spinners-react";

function Card({
  elementList,
  cardHeader,
  cardFooter,
  inactive,
  isLoading,
  noBodyPadding,
}) {
  const [navActivated, setActiveNav] = useState(0);
  const handleChangeTab = (e, tabIndex) => {
    e.preventDefault();
    setActiveNav(tabIndex);
  };
  return (
    <div className={"card" + (inactive ? " card-inactive" : "")}>
      {cardHeader && (
        <div
          className="card-header"
          style={{ gap: "5px", paddingRight: "5px" }}
        >
          <h4 className="card-header-title font-weight-bold mr-auto">
            {cardHeader.title}
            {cardHeader.badge && (
              <span
                className={
                  "badge font-weight-bold ml-2 badge-" + cardHeader.badge.theme
                }
              >
                {cardHeader.badge.label}
              </span>
            )}
          </h4>
          {cardHeader.navList && (
            <ul className="nav nav-tabs nav-tabs-sm card-header-tabs">
              {cardHeader.navList.map((navLinkTitle) => (
                <li className="nav-item">
                  <Link className="nav-link active" onClick={handleChangeTab}>
                    {navLinkTitle}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {cardHeader.extension && <MdMoreVert size="20px" />}
        </div>
      )}
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center py-3">
          <SpinnerCircular size="30px" />
        </div>
      ) : noBodyPadding ? (
        elementList[navActivated]
      ) : (
        <div className="card-body">{elementList[navActivated]}</div>
      )}
      {cardFooter && cardFooter}
    </div>
  );
}

Card.propTypes = {
  elementList: PropTypes.array.isRequired,
  cardHeader: PropTypes.shape({
    title: PropTypes.any.isRequired,
    badge: PropTypes.shape({
      theme: PropTypes.oneOf([
        "primary",
        "secondary",
        "success",
        "danger",
        "warning",
        "info",
        "light",
        "dark",
      ]),
      label: PropTypes.string,
    }),
    extension: PropTypes.any,
    navList: PropTypes.arrayOf(PropTypes.string),
  }),
  cardFooter: PropTypes.any,
  inactive: PropTypes.bool,
  noBodyPadding: PropTypes.bool,
};

export default Card;