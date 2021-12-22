import React, { useState, useEffect, useRef, useCallback } from "react";
import Modal from "../common/Modal";
import Row from "../layout/Row";
import Col from "../layout/Col";
import Select from "react-select";
import Button from "../common/Button";
import { createNewRecord, retrieveData } from "../../services/airtable.service";
import ImageUploader, { ImageReviewer } from "../common/ImageUploader";
import { VALIDATE_RULE } from "../../constants";
import useAutoGenerate from "../hooks/useAutoGenerate";
import { MdRefresh, MdRemoveRedEye } from "react-icons/md";

// NOTE: The Select component (from react-select) that doesn't
// support custom inner props when using component event listener
// (the event object doesn't contains the custom props), so we use
// className props to define the table(data-table) and the field
// name(name) to that Select component (syntax: "<data-table> <name>"),
// the normal input form-control still can use the custom props data-table
// and name.

function AddNewStaffModal({ isModalDisplay, setModalHide, setShowLoader }) {
  let [componentAvailable, setComponentAvailable] = useState(true);
  const autoGenerate = useAutoGenerate();
  const initialPasswordString = autoGenerate(12);
  const [showPassword, setShowPassword] = useState(false);
  /**
   * Used to convert a Full Name string into Username
   * @param {String} fullName Full Name string
   * @returns a Username that was converted (ex. Nguyen Van Anh => AnhNV)
   */
  const convertFullNameToUsername = (fullName) => {
    const nameArr = fullName.split(" ");
    const lastName = nameArr[nameArr.length - 1];
    let abbreviation = "";
    for (let i = 0; i < nameArr.length - 1; i++) {
      abbreviation += nameArr[i].charAt(0);
    }
    return lastName + abbreviation;
  };
  const generateNewPassword = (length) => {
    const newPassword = autoGenerate(length);
    setNewStaffForm((state) => {
      const newState = { ...state };
      newState.Account.Password.label = newPassword;
      newState.Account.Password.value = newPassword;
      return newState;
    });
  };

  // all the input form below must have this 2 properties (name, data-table)

  // define the select list use for dropdown form control
  // empty select lists have to retrive data from airtable
  const [selectList, setSelectList] = useState({
    Staff: {
      Gender: {
        fromTable: "Staff",
        list: [
          { "data-table": "Staff", label: "Nam", value: "Nam", name: "Gender" },
          { "data-table": "Staff", label: "Nữ", value: "Nữ", name: "Gender" },
        ],
      },
      Company: {
        fromTable: "Collaboratory",
        list: [] /* { value: "", label: "" } */,
      },
      CurrentWorkingPlace: {
        fromTable: "WorkingPlace",
        list: [] /* { value: "", label: "" } */,
      },
      RoleType: {
        fromTable: "Role",
        list: [] /* { value: "", label: "" } */,
      },
    },
    Status: {
      WorkingStatus: {
        fromTable: "Status",
        list: [
          {
            "data-table": "Status",
            label: "Working from home",
            value: "Working from home",
            name: "WorkingStatus",
          },
          {
            "data-table": "Status",
            label: "Working in department",
            value: "Working in department",
            name: "WorkingStatus",
          },
          {
            "data-table": "Status",
            label: "On-site with client",
            value: "On-site with client",
            name: "WorkingStatus",
          },
          {
            "data-table": "Status",
            label: "Leaving",
            value: "Leaving",
            name: "WorkingStatus",
          },
        ],
      },
      MarriageStatus: {
        fromTable: "Status",
        list: [
          {
            "data-table": "Status",
            label: "Maried",
            value: "Maried",
            name: "MarriageStatus",
          },
          {
            "data-table": "Status",
            label: "Single",
            value: "Single",
            name: "MarriageStatus",
          },
        ],
      },
      HealthStatus: {
        fromTable: "Status",
        list: [
          {
            "data-table": "Status",
            label: "Normally",
            value: "Normally",
            name: "HealthStatus",
          },
          {
            "data-table": "Status",
            label: "Having diseases",
            value: "Having diseases",
            name: "HealthStatus",
          },
          {
            "data-table": "Status",
            label: "Pregnants",
            value: "Pregnants",
            name: "HealthStatus",
          },
          {
            "data-table": "Status",
            label: "Taking care babies",
            value: "Taking care babies",
            name: "HealthStatus",
          },
        ],
      },
      Covid19Vaccinated: {
        fromTable: "Status",
        list: [
          {
            "data-table": "Status",
            label: "Not vaccinated",
            value: "Not vaccinated",
            name: "Covid19Vaccinated",
          },
          {
            "data-table": "Status",
            label: "1 time vaccinated",
            value: "1 time vaccinated",
            name: "Covid19Vaccinated",
          },
          {
            "data-table": "Status",
            label: "2 time vaccinated",
            value: "2 time vaccinated",
            name: "Covid19Vaccinated",
          },
        ],
      },
      Covid19VaccineType: {
        fromTable: "Status",
        list: [
          {
            "data-table": "Status",
            label: "AZD1222 (Astra Zeneca)",
            value: "AZD1222 (Astra Zeneca)",
            name: "Covid19VaccineType",
          },
          {
            "data-table": "Status",
            label: "Sputnik-V (Gamalaya)",
            value: "Sputnik-V (Gamalaya)",
            name: "Covid19VaccineType",
          },
          {
            "data-table": "Status",
            label: "Vero-Cell (Sinopharm)",
            value: "Vero-Cell (Sinopharm)",
            name: "Covid19VaccineType",
          },
          {
            "data-table": "Status",
            label: "Corminaty (Pfizer BioNTect)",
            value: "Corminaty (Pfizer BioNTect)",
            name: "Covid19VaccineType",
          },
          {
            "data-table": "Status",
            label: "Spikevax (Covid-19 vaccine Mordena)",
            value: "Spikevax (Covid-19 vaccine Mordena)",
            name: "Covid19VaccineType",
          },
          {
            "data-table": "Status",
            label: "Covid-19 vaccine Janssen",
            value: "Covid-19 vaccine Janssen",
            name: "Covid19VaccineType",
          },
          {
            "data-table": "Status",
            label: "Vaccine Hayat-Vax",
            value: "Vaccine Hayat-Vax",
            name: "Covid19VaccineType",
          },
          {
            "data-table": "Status",
            label: "Vaccine Abdala (AICA)",
            value: "Vaccine Abdala (AICA)",
            name: "Covid19VaccineType",
          },
        ],
      },
    },
    Account: {
      Domain: {
        fromTable: "Collaboratory",
        list: [],
      },
    },
  });

  // define the data object that used for display and upload to
  // airtable the key name is the looked up value (read-only)
  // the 'linkedField' property is the actual field that
  // the new record will be add by this linkedField,
  // the field key and the linkedField is looked up field if
  // they are the same
  const [newStaffForm, setNewStaffForm] = useState({
    Staff: {
      FullName: { linkedField: "FullName", value: "", label: "" },
      Portrait: { linkedField: "Portrait", value: "", label: "" },
      Gender: { linkedField: "Gender", value: "", label: "" },
      DOB: { linkedField: "DOB", value: "", label: "" },
      Phone: { linkedField: "Phone", value: "", label: "" },
      PersonalEmail: {
        linkedField: "PersonalEmail",
        value: "",
        label: "",
      },
      RoleType: { linkedField: "Role", value: "", label: "" },
      Company: { linkedField: "Collaboratory", value: "", label: "" },
      CurrentWorkingPlace: {
        linkedField: "WorkingPlace",
        value: "",
        label: "",
      },
    },
    Status: {
      WorkingStatus: {
        linkedField: "WorkingStatus",
        value: "",
        label: "",
      },
      MarriageStatus: {
        linkedField: "MarriageStatus",
        value: "",
        label: "",
      },
      HealthStatus: {
        linkedField: "HealthStatus",
        value: "",
        label: "",
      },
      Notes: { linkedField: "Notes", value: "", label: "" },
      Covid19Vaccinated: {
        linkedField: "Covid19Vaccinated",
        value: "",
        label: "",
      },
      Covid19VaccineType: {
        // multi select
        linkedField: "Covid19VaccineType",
        value: [],
        label: [],
      },
      StaffId: { linkedField: "Staff", value: "", label: "" },
    },
    Account: {
      Username: {
        linkedField: "Username",
        value: "",
        label: "",
      },
      Domain: {
        linkedField: "Collaboratory",
        value: "",
        label: "",
      },
      UserAccount: {
        // combination of username + domain
        linkedField: "UserAccount",
        value: "",
        label: "",
      },
      Password: {
        linkedField: "Password",
        value: initialPasswordString,
        label: initialPasswordString,
      },
    },
  });
  const [previewImg, setPreviewImg] = useState(null); // Portrait image state

  // define the error status and message
  const [errorForm, setErrorForm] = useState({
    errStatus: false,
    isShowMsg: false,
    errMsg: {
      Staff: {
        FullName: "",
        Gender: "",
        DOB: "",
        Phone: "",
        Company: "",
      },
    },
  });

  // define the ref list
  const refList = {
    FullName: useRef(null),
    Gender: useRef(null),
    DOB: useRef(null),
    Phone: useRef(null),
  };

  const countEmptySelectList = () => {
    let count = 0;
    Object.keys(selectList).forEach((tableKey) => {
      Object.keys(selectList[tableKey]).forEach((fieldKey) => {
        if (selectList[tableKey][fieldKey].list.length === 0) {
          count++;
        }
      });
    });
    return count;
  };

  // retrive data from airtable into empty select list
  useEffect(() => {
    // componentAvailable use for stoping render when component is unmounted
    setShowLoader(true);
    const selectListKeys = Object.keys(selectList);

    selectListKeys.forEach((tableKey) => {
      Object.keys(selectList[tableKey]).forEach((fieldKey) => {
        if (selectList[tableKey][fieldKey].list.length === 0) {
          retrieveData(selectList[tableKey][fieldKey].fromTable)
            .then((res) => {
              componentAvailable &&
                setSelectList((state) => ({
                  ...state,
                  [tableKey]: {
                    ...state[tableKey],
                    [fieldKey]: {
                      ...state[tableKey][fieldKey],
                      list: res.map((item) => ({
                        "data-table": tableKey,
                        value: item.id,
                        label:
                          tableKey === "Account"
                            ? item.fields.Domain
                            : item.fields.Name,
                        name: fieldKey,
                      })),
                    },
                  },
                }));
            })
            .catch((e) => console.log(e))
            .finally(() => {
              const checkEmptySelectList = countEmptySelectList();
              if (checkEmptySelectList === 0) {
                setShowLoader(false);
              }
            });
        }
      });
    });
    return () => {
      setComponentAvailable(false);
    };
  }, []);

  // Handle the input change (valitdate right after the input change)
  const handleStaffInput = (e, action) => {
    if (e === null) {
      // when clearing a single select input
      setNewStaffForm((state) => {
        const { "data-table": dataTable, name } = action.removedValues[0];
        const newState = { ...state };
        newState[dataTable][name].value = "";
        newState[dataTable][name].label = "";
        return newState;
      });
      return;
    }
    e.target
      ? setNewStaffForm((state) => {
          // used for normal input
          const {
            dataset: { table: dataTable },
            name,
            value,
          } = e.target;
          const newState = { ...state };
          newState[dataTable][name].value = value;
          newState[dataTable][name].label = value;
          if (name === "FullName") {
            const newUsername = convertFullNameToUsername(value);
            const currentDomain = newState.Account.Domain.label;
            newState.Account.Username.value = newUsername;
            newState.Account.Username.label = newUsername;
            newState.Account.UserAccount.value = newUsername + currentDomain;
            newState.Account.UserAccount.label = newUsername + currentDomain;
          }
          return newState;
        })
      : setNewStaffForm((state) => {
          // used for select input
          let newState = { ...state };
          if (Array.isArray(e)) {
            // multi select
            let refObj = {};
            switch (action.action) {
              case "clear":
                refObj = action.removedValues[0];
                break;
              case "remove-value":
                refObj = action.removedValue;
                break;
              default:
                refObj = action.option;
                break;
            }
            const { "data-table": dataTable, name } = refObj;
            const newSelectedValue = [];
            const newSelectedLabel = [];
            e.forEach((selectItem) => {
              const { value, label } = selectItem;
              newSelectedValue.push(value);
              newSelectedLabel.push(label);
            });
            newState[dataTable][name].value = newSelectedValue;
            newState[dataTable][name].label = newSelectedLabel;
          } else {
            // single select
            const { "data-table": dataTable, name, value, label } = e;
            const newState = { ...state };
            if (name === "Company") {
              const username = newState.Account.Username;
              const domain = newState.Account.Domain;
              const userAccount = newState.Account.UserAccount;
              domain.value = value;
              domain.label = selectList.Account.Domain.list.find(
                (item) => item.value === value
              ).label;
              userAccount.value = username.value + domain.value;
              userAccount.label = username.label + domain.label;
            }
            newState[dataTable][name].value = value;
            newState[dataTable][name].label = label;
          }
          return newState;
        });
  };
  const handleUploadImg = (value) => {
    setPreviewImg(value);
    setNewStaffForm({
      ...newStaffForm,
      Staff: {
        ...newStaffForm.Staff,
        Portrait: {
          ...newStaffForm.Staff.Portrait,
          value: value.filesUploaded[0].url,
          label: value.filesUploaded[0].url,
        },
      },
    });
  };

  // Validate, Clear error message on focus and Submit
  const handleValidate = () => {
    // define the validator for the form
    setErrorForm((state) => {
      let newErr = { ...state };
      // FullName
      if (newStaffForm.Staff.FullName.value === "") {
        newErr.errMsg.Staff.FullName = "The Full Name is mustn't empty";
        newErr.errStatus = true;
      }
      // Gender
      if (newStaffForm.Staff.Gender.value === "") {
        newErr.errMsg.Staff.Gender = "The Gender is mustn't empty";
        newErr.errStatus = true;
      }
      // Date of birth
      if (newStaffForm.Staff.DOB.value === "") {
        newErr.errMsg.Staff.DOB = "The DOB is mustn't empty";
        newErr.errStatus = true;
      }
      // Phone
      if (newStaffForm.Staff.Phone.value === "") {
        newErr.errMsg.Staff.Phone = "The Phone is mustn't empty";
        newErr.errStatus = true;
      } // Company
      if (newStaffForm.Staff.Company.value === "") {
        newErr.errMsg.Staff.Company = "The Phone is mustn't empty";
        newErr.errStatus = true;
      }
      return newErr;
    });
  };
  // the clear error msg trigger on form-group that
  // have required tag only used with onFocus
  const handleClearErrMsgOnFocus = (e) => {
    let name = "";
    let dataTable = "";
    if (e.target.className === "") {
      // select input
      const inputElement =
        e.target.parentElement.parentElement.parentElement.parentElement;
      name = inputElement.classList[1];
      dataTable = inputElement.classList[0];
    } else {
      // normal input
      name = e.target.attributes.name.nodeValue;
      dataTable = e.target.attributes["data-table"].nodeValue;
    }
    setErrorForm((state) => {
      let newState = { ...state };
      newState.errMsg[dataTable][name] = "";
      return newState;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(errorForm.errStatus);
    if (errorForm.errStatus) {
      setErrorForm({ ...errorForm, isShowMsg: true });
      let findFirstErrRef = false;
      Object.values(errorForm.errMsg).forEach((tableErrObj) => {
        if (findFirstErrRef) return;
        for (const fieldKey in tableErrObj) {
          if (tableErrObj[fieldKey] !== "") {
            refList[fieldKey]?.current.scrollIntoView();
            findFirstErrRef = true;
            return;
          }
        }
      });
      return;
    }

    let newRecord = {};
    Object.keys(newStaffForm).forEach((key) => {
      newRecord[key] = {};
      Object.values(newStaffForm[key]).forEach((field) => {
        newRecord[key][newStaffForm[key].linkedField] =
          key === field.linkedField ? field.value : [field.value];
      });
    });
    console.log(newRecord);

    // createNewRecord("Staff", newRecordStaff.Staff)
    //   .then((res) =>
    //     console.log("Create new record in Staff table successfully!", res)
    //   )
    //   .catch((e) => console.log(e));
  };

  return (
    <Modal setModalHide={setModalHide} isModalDisplay={isModalDisplay}>
      <Row className="py-4 justify-content-center">
        <Col columnSize={["auto"]}>
          <h1 className="font-weight-bold">Add new staff</h1>
        </Col>
      </Row>
      <hr className="navbar-divider"></hr>
      <h3 className="font-weight-bold text-center">General Information</h3>
      <form className="form">
        <div className="form-group">
          <label htmlFor="FullName" ref={refList.FullName}>
            Full name <span className="text-danger">*</span>
          </label>
          <input
            name="FullName"
            data-table="Staff"
            className="form-control"
            type="text"
            onChange={handleStaffInput}
            onFocus={handleClearErrMsgOnFocus}
            onBlur={handleValidate}
            placeholder="Enter full name..."
          />
          {errorForm.errMsg.Staff.FullName !== "" && errorForm.isShowMsg && (
            <div className="err-text text-danger mt-1">
              {errorForm.errMsg.Staff.FullName}
            </div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="Gender" ref={refList.Gender}>
            Gender <span className="text-danger">*</span>
          </label>
          <Select
            className="Staff Gender"
            onChange={handleStaffInput}
            onFocus={handleClearErrMsgOnFocus}
            onBlur={handleValidate}
            options={selectList.Staff.Gender.list}
            placeholder="Select gender..."
            isClearable
            styles={{
              menu: (provided) => ({
                ...provided,
                zIndex: "1000",
              }),
            }}
          />
          {errorForm.errMsg.Staff.Gender !== "" && errorForm.isShowMsg && (
            <div className="err-text text-danger mt-1">
              {errorForm.errMsg.Staff.Gender}
            </div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="Portrait">Portrait</label>
          {previewImg ? (
            <ImageReviewer
              data={previewImg}
              handleUploadSuccessfully={handleUploadImg}
            />
          ) : (
            <ImageUploader handleUploadSuccessfully={handleUploadImg} />
          )}
        </div>
        <div className="form-group">
          <label htmlFor="DOB" ref={refList.DOB}>
            Day of birth <span className="text-danger">*</span>
          </label>
          <input
            name="DOB"
            data-table="Staff"
            className="form-control"
            type="date"
            onChange={handleStaffInput}
            onFocus={handleClearErrMsgOnFocus}
            onBlur={handleValidate}
          />
          {errorForm.errMsg.Staff.DOB !== "" && errorForm.isShowMsg && (
            <div className="err-text text-danger mt-1 mt-2">
              {errorForm.errMsg.Staff.DOB}
            </div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="Phone" ref={refList.Phone}>
            Phone number <span className="text-danger">*</span>
          </label>
          <input
            name="Phone"
            data-table="Staff"
            className="form-control"
            type="tel"
            onChange={handleStaffInput}
            onFocus={handleClearErrMsgOnFocus}
            onBlur={handleValidate}
            placeholder="0123 456 789"
          />
          {errorForm.errMsg.Staff.Phone !== "" && errorForm.isShowMsg && (
            <div className="err-text text-danger mt-1 mt-2">
              {errorForm.errMsg.Staff.Phone}
            </div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="PersonalEmail">Personal email</label>
          <input
            name="PersonalEmail"
            data-table="Staff"
            className="form-control"
            type="email"
            onChange={handleStaffInput}
            onBlur={handleValidate}
            placeholder="example@foo.com"
          />
        </div>
        <div className="form-group">
          <label htmlFor="Company">
            Company <span className="text-danger">*</span>
          </label>
          <Select
            className="Staff Company"
            onChange={handleStaffInput}
            onBlur={handleValidate}
            options={selectList.Staff.Company.list}
            placeholder="Who to work for..."
            styles={{
              menu: (provided) => ({
                ...provided,
                zIndex: "1000",
              }),
            }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="CurrentWorkingPlace">Working Place</label>
          <Select
            className="Staff CurrentWorkingPlace"
            onChange={handleStaffInput}
            onBlur={handleValidate}
            options={selectList.Staff.CurrentWorkingPlace.list}
            placeholder="Where to work..."
            styles={{
              menu: (provided) => ({
                ...provided,
                zIndex: "1000",
              }),
            }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="RoleType">Role</label>
          <Select
            className="Staff RoleType"
            onChange={handleStaffInput}
            onBlur={handleValidate}
            options={selectList.Staff.RoleType.list}
            placeholder="Working as a/an..."
            styles={{
              menu: (provided) => ({
                ...provided,
                zIndex: "1000",
              }),
            }}
          />
        </div>
        <hr className="navbar-divider"></hr>
        <h3 className="font-weight-bold text-center">Employee Status</h3>
        <div className="form-group">
          <label htmlFor="WorkingStatus">Working Status</label>
          <Select
            className="Status WorkingStatus"
            onChange={handleStaffInput}
            onBlur={handleValidate}
            options={selectList.Status.WorkingStatus.list}
            placeholder="Working status..."
            styles={{
              menu: (provided) => ({
                ...provided,
                zIndex: "1000",
              }),
            }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="MarriageStatus">Marriage Status</label>
          <Select
            className="Status MarriageStatus"
            onChange={handleStaffInput}
            onBlur={handleValidate}
            options={selectList.Status.MarriageStatus.list}
            placeholder="Marriage status..."
            styles={{
              menu: (provided) => ({
                ...provided,
                zIndex: "1000",
              }),
            }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="HealthStatus">Health Status</label>
          <Select
            className="Status HealthStatus"
            onChange={handleStaffInput}
            onBlur={handleValidate}
            options={selectList.Status.HealthStatus.list}
            placeholder="Health status..."
            styles={{
              menu: (provided) => ({
                ...provided,
                zIndex: "1000",
              }),
            }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="Notes">Notes</label>
          <textarea
            name="Notes"
            data-table="Status"
            className="form-control"
            onChange={handleStaffInput}
            onBlur={handleValidate}
            placeholder="Notes..."
            style={{
              resize: "none",
            }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="Covid19Vaccinated">Having vaccinated Covid-19?</label>
          <Select
            className="Status Covid19Vaccinated"
            onChange={handleStaffInput}
            onBlur={handleValidate}
            options={selectList.Status.Covid19Vaccinated.list}
            placeholder="0/1/2 vaccinated..."
            styles={{
              menu: (provided) => ({
                ...provided,
                zIndex: "1000",
              }),
            }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="Covid19VaccineType">Vaccine Type</label>
          <Select
            className="Status Covid19VaccineType"
            onChange={handleStaffInput}
            onBlur={handleValidate}
            isMulti
            options={selectList.Status.Covid19VaccineType.list}
            placeholder="Which type vaccine..."
            styles={{
              menu: (provided) => ({
                ...provided,
                zIndex: "1000",
              }),
            }}
          />
        </div>
        <hr className="navbar-divider"></hr>
        <h3 className="font-weight-bold text-center">Account Information</h3>
        <div className="form-group">
          <label htmlFor="Username">Username</label>
          <span name="Username" data-table="Account" className="form-control">
            {newStaffForm.Account.Username.label}
          </span>
        </div>
        <div className="form-group">
          <label htmlFor="Domain">Domain</label>
          <span name="Domain" data-table="Account" className="form-control">
            {newStaffForm.Account.Domain.label}
          </span>
        </div>
        <div className="form-group">
          <label htmlFor="UserAccount">User Account</label>
          <span
            name="UserAccount"
            data-table="Account"
            className="form-control"
          >
            {newStaffForm.Account.UserAccount.label}
          </span>
        </div>
        <div className="form-group">
          <label htmlFor="Password">Password</label>
          <div className="input-group input-group-merge">
            <input
              name="Password"
              data-table="Account"
              className="form-control form-control-appended"
              type={showPassword ? "text" : "password"}
              value={newStaffForm.Account.Password.label}
              disabled
            />
            <div className="input-group-append">
              <div className="input-group-text">
                <MdRefresh
                  onClick={() => generateNewPassword(12)}
                  style={{ cursor: "pointer" }}
                />
                <MdRemoveRedEye
                  color={showPassword ? "blue" : "grey"}
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: "pointer", marginLeft: "5px" }}
                />
              </div>
            </div>
          </div>
        </div>
        <hr className="navbar-divider"></hr>
        <Row className="justify-content-center mt-5">
          <Col columnSize={["12"]}>
            <Button
              className="px-4 py-3 w-100"
              type="submit"
              onClick={handleSubmit}
            >
              Add new staff
            </Button>
          </Col>
        </Row>
      </form>
    </Modal>
  );
}

export default AddNewStaffModal;
