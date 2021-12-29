import PropTypes from "prop-types";
import React, { useEffect, useMemo, useState } from "react";
import { MdSettings } from "react-icons/md";
import { useSelector } from "react-redux";
import Select from "react-select";
import { NOT_SUPPORT_FIELD_FEATURE } from "../../constants";
import { selectInnerWidth } from "../../features/windowSlice";
import Outclick from "../../hoc/Outclick";
import Col from "../layout/Col";
import Row from "../layout/Row";
import CustomSwitch from "./CustomSwitch";
import Search from "./Search";

function Table({ fieldList, recordList, isHasSettings }) {
  const innerWidth = useSelector(selectInnerWidth);
  const fieldsForSortAndSearch = useMemo(() => {
    const newList = [];
    fieldList.forEach((field, index) => {
      if (NOT_SUPPORT_FIELD_FEATURE.indexOf(field) === -1) {
        return newList.push({ field, index });
      }
    });
    return newList;
  }, [fieldList]);

  const [activeIndex, setActiveIndex] = useState(1);
  const [recordsPerPage, setRecordPerPage] = useState(5);
  const [pageList, setPageList] = useState([]);
  const [recordTableList, setRecordTableList] = useState(recordList);

  const [showSettings, setShowSettings] = useState(false);

  const [searchStatus, setSearchStatus] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchCritea, setSearchCritea] = useState(fieldsForSortAndSearch[0]);

  const [sortStatus, setSortStatus] = useState(false);
  const [sortCritea, setSortCritea] = useState(fieldsForSortAndSearch[0]);
  const [sortDirection, setSortDirection] = useState("ascending");
  const sortOptionList = [
    { label: "ascending", value: "ascending" },
    { label: "descending", value: "descending" },
  ];

  useEffect(() => {
    let newRecordList = [];
    recordList.forEach((recordData) => {
      const cellDataArr = recordData.data;
      const cellDataForSearch = cellDataArr[searchCritea.index];
      if (searchStatus) {
        setActiveIndex(1);
        if (typeof cellDataForSearch === "string") {
          if (cellDataForSearch.includes(searchValue)) {
            newRecordList.push(recordData);
          } else {
            return;
          }
        } else if (Array.isArray(cellDataForSearch)) {
          if (typeof cellDataForSearch[0] === "string") {
            if (cellDataForSearch[0].includes(searchValue)) {
              newRecordList.push(recordData);
            } else {
              return;
            }
          } else {
            return;
          }
        } else {
          return;
        }
      } else {
        newRecordList.push(recordData);
      }
    });
    if (sortStatus) {
      if (sortDirection === "ascending") {
        newRecordList = newRecordList.sort((a, b) => {
          return a.data[sortCritea.index].localeCompare(
            b.data[sortCritea.index]
          );
        });
      } else {
        newRecordList = newRecordList.sort((a, b) => {
          return b.data[sortCritea.index].localeCompare(
            a.data[sortCritea.index]
          );
        });
      }
    }
    let newRecordListToDisplay = [];
    newRecordList.forEach((recordData, recordIndex) => {
      const recordIndexMin = recordsPerPage * (activeIndex - 1);
      const recordIndexMax = recordsPerPage * activeIndex - 1;
      if (recordIndex >= recordIndexMin && recordIndex <= recordIndexMax) {
        newRecordListToDisplay.push(recordData);
      }
    });
    setRecordTableList(newRecordListToDisplay);
    const pageAmount =
      newRecordList % recordsPerPage > 0
        ? parseInt(newRecordList.length / recordsPerPage) + 1
        : newRecordList.length / recordsPerPage;
    setPageList(() => {
      const newState = [];
      for (let i = 0; i < pageAmount; i++) {
        newState.push(i + 1);
      }
      return newState;
    });
  }, [
    recordList,
    recordsPerPage,
    activeIndex,
    searchStatus,
    searchValue,
    searchCritea,
    sortStatus,
    sortCritea.index,
    sortDirection,
  ]);

  return (
    <>
      {isHasSettings && (
        <Row className="justify-content-between px-2 flex-nowrap">
          <Col columnSize={["auto"]} className="d-flex align-items-center py-2">
            {searchStatus ? (
              <Search
                noBorder
                placeholder={`Search by ${searchCritea.field}...`}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                }}
                value={searchValue}
              />
            ) : (
              " "
            )}
          </Col>
          <Col columnSize={["auto"]} className="d-flex align-items-center py-2">
            <div className="dropdown">
              <button
                className="btn btn-link rounded"
                onClick={() => setShowSettings(true)}
              >
                <MdSettings size={20} />
              </button>
              <Outclick onOutClick={() => setShowSettings(false)}>
                <div
                  className={`dropdown-menu px-3 dropdown-menu-right${
                    showSettings ? " d-block" : ""
                  }`}
                  style={{ width: "248px" }}
                >
                  <Row>
                    <Col columnSize={["12"]}>
                      <div className="form-group">
                        <Row className="mb-3">
                          <Col
                            columnSize={["12"]}
                            className="d-flex justify-content-between"
                          >
                            <label className="mb-0" htmlFor="search-critea">
                              Search by{" "}
                            </label>
                            <CustomSwitch onSwitchChange={setSearchStatus} />
                          </Col>
                        </Row>
                        {searchStatus && (
                          <Select
                            id="search-critea"
                            styles={{
                              input: (provided) => ({
                                ...provided,
                                width: "200px",
                              }),
                            }}
                            options={fieldsForSortAndSearch.map(
                              (sortableField) => ({
                                label: sortableField.field,
                                value: sortableField.field,
                                index: sortableField.index,
                              })
                            )}
                            onChange={(e) => {
                              setSearchCritea({
                                field: e.value,
                                index: e.index,
                              });
                            }}
                          />
                        )}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col columnSize={["12"]}>
                      <div className="form-group">
                        <Row className="mb-3">
                          <Col
                            columnSize={["12"]}
                            className="d-flex justify-content-between"
                          >
                            <label
                              className="mb-0"
                              htmlFor="sort-critea sort-direction"
                            >
                              Sort by{" "}
                            </label>
                            <CustomSwitch onSwitchChange={setSortStatus} />
                          </Col>
                        </Row>
                        {sortStatus && (
                          <Row>
                            <Col
                              columnSize={["12"]}
                              className="d-flex justify-content-between"
                            >
                              <Select
                                id="sort-critea"
                                styles={{
                                  control: (provided) => ({
                                    ...provided,
                                    width: "120px",
                                  }),
                                }}
                                defaultValue={{
                                  label: fieldsForSortAndSearch[0].field,
                                  value: fieldsForSortAndSearch[0].field,
                                }}
                                options={fieldsForSortAndSearch.map(
                                  (sortableField) => ({
                                    label: sortableField.field,
                                    value: sortableField.field,
                                    index: sortableField.index,
                                  })
                                )}
                                onChange={(e) => {
                                  setSortCritea({
                                    field: e.value,
                                    index: e.index,
                                  });
                                }}
                              />
                              <Select
                                id="sort-direction"
                                styles={{
                                  control: (provided) => ({
                                    ...provided,
                                    width: "80px",
                                  }),
                                }}
                                defaultValue={sortOptionList[0]}
                                options={sortOptionList}
                                onChange={(e) => {
                                  setSortDirection(e.value);
                                }}
                              />
                            </Col>
                          </Row>
                        )}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      columnSize={["12"]}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <label className="mb-0" htmlFor="max-record-per-page">
                        Records/page
                      </label>
                      <input
                        id="max-record-per-page"
                        className="form-control ml-4"
                        type="number"
                        value={recordsPerPage}
                        onChange={(e) =>
                          e.target.value > 0 && e.target.value !== ""
                            ? setRecordPerPage(e.target.value)
                            : setRecordPerPage(1)
                        }
                      />
                    </Col>
                  </Row>
                </div>
              </Outclick>
            </div>
          </Col>
        </Row>
      )}
      <div className="table-responsive mb-0 border-bottom">
        <table className="table table-sm table-nowrap card-table">
          <thead>
            <tr>
              {fieldList.map((fieldItem, i) => (
                <th key={i}>
                  <span className="text-muted">{fieldItem}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="list">
            {recordTableList.map((recordData) => (
              <tr key={recordData.rowId}>
                {recordData.data.map((value, cellRowIndex) => (
                  <td key={cellRowIndex}>{injectDataToJSX(value)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <nav
        className={`d-flex align-items-center flex-wrap px-3 py-1 ${
          innerWidth < 330
            ? "justify-content-center"
            : "justify-content-between"
        }`}
      >
        <span
          className={`badge badge-success${innerWidth < 330 ? " my-3" : ""}`}
        >
          {recordTableList.length}{" "}
          {recordTableList.length > 1 ? "records" : "record"} in total
        </span>
        <ul className="pagination mb-0">
          <li
            className="page-item"
            onClick={() => {
              activeIndex > 1 && setActiveIndex(activeIndex - 1);
            }}
            style={{ cursor: "pointer" }}
          >
            <button className="rounded page-link border-0">Previous</button>
          </li>
          {pageList.map((indexPagination) => (
            <li
              key={indexPagination}
              className={`page-item${
                indexPagination === activeIndex ? " active" : ""
              }`}
              onClick={() => setActiveIndex(indexPagination)}
              style={{ cursor: "pointer" }}
            >
              <button className="rounded page-link border-0">
                {indexPagination}
              </button>
            </li>
          ))}
          <li
            className="rounded page-item"
            onClick={() => {
              activeIndex < pageList.length && setActiveIndex(activeIndex + 1);
            }}
            style={{ cursor: "pointer" }}
          >
            <button className="rounded page-link border-0">Next</button>
          </li>
        </ul>
      </nav>
    </>
  );
}

function injectDataToJSX(cellData) {
  let cellJSX = null; // the cell data has been injected to an JSX to render
  if (typeof cellData === "string") {
    // Date type {formatted as string}
    // String type
    cellJSX = (
      <div
        className="cellData d-flex justify-content-start align-items-center"
        style={{ height: "40px" }}
      >
        {cellData}
      </div>
    );
  } else if (Array.isArray(cellData)) {
    if (typeof cellData[0] === "string") {
      // Looked up field (type's bases on original value)
      // Linked field (always in array)
      // Mutiple select field
      cellJSX = (
        <div
          className="cellData d-flex justify-content-start align-items-center"
          style={{ height: "40px" }}
        >
          {cellData.map((item, i) => {
            return i === cellData.length - 1 ? item : item + ", ";
          })}
        </div>
      );
    } else {
      // Attachment object (ex: .png, .jpg, ...)
      cellJSX = (
        <div
          className="cellData d-flex justify-content-start align-items-center"
          style={{ height: "40px", overflowY: "hidden" }}
        >
          {cellData.map((item, i) => (
            <img key={i} className="cellImg" src={item.url} alt="" width={30} />
          ))}
        </div>
      );
    }
  }
  return cellJSX;
}

Table.propTypes = {
  fieldList: PropTypes.arrayOf(PropTypes.string).isRequired,
  recordList: PropTypes.arrayOf(PropTypes.any),
  itemAmountPerPage: PropTypes.number,
  isHasSettings: PropTypes.bool,
};

export default Table;