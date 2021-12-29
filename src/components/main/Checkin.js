import React, { useEffect, useMemo, useState } from "react";
import MainContent from "../layout/MainContent";
import MainHeader from "../layout/MainHeader";
import Card from "../common/Card";
import Col from "../layout/Col";
import Row from "../layout/Row";
import Button from "../common/Button";
import Container from "../layout/Container";
import Table from "../common/Table";
import {
  retrieveData,
  mapResultToTableData,
} from "../../services/airtable.service";
import { getLocalUser } from "../../services/localStorage.service";
import { selectUserCredential } from "../../features/userSlice";
import { useSelector } from "react-redux";
import Loader from "../common/Loader";

function Checkin() {
  const fieldList = useMemo(() => {
    return ["RecordId", "CreatedDate", "Type", "Notes"];
  }, []);
  const [showLoader, setShowLoader] = useState(true);
  const [recordList, setRecordList] = useState([]);
  const [isCheckInAvailable, setCheckInStatus] = useState(true);
  const userCredential = useSelector(selectUserCredential);
  const userId = userCredential
    ? userCredential.StaffId[0]
    : getLocalUser().StaffId[0];

  /* eslint-disable */
  useEffect(() => {
    retrieveData("Check-in", { filterByFormula: `StaffId = "${userId}"` })
      .then((res) => {
        const tableDataList = mapResultToTableData(res, fieldList);
        setRecordList(tableDataList);
        
        let lastCheck = tableDataList[0];
        tableDataList.forEach((recordData) => {
          // the CreatedDate 's index is 1 in the fieldList
          const createdTimeStr = recordData.data[1].cellData;
          const lastCheckTimeStr = lastCheck.data[1].cellData;
          if (Date.parse(createdTimeStr) > Date.parse(lastCheckTimeStr)) {
            lastCheck = recordData;
          }
        });
        // the Type 's index is 2 in the fieldList
        if (lastCheck.data[2] === "Check-in") {
          setCheckInStatus(false);
        } else {
          setCheckInStatus(true);
        }
      })
      .catch((e) => console.log(e))
      .finally(() => setShowLoader(false));
  }, []);
  const handleCheckIn = (e) => {
    console.log(e);
  };
  const handleCheckOut = (e) => {
    console.log(e);
  };
  return (
    <>
      {showLoader && <Loader />}
      <MainContent>
        <MainHeader
          title="Check-in"
          subTitle="Check-in before working and check-out before leaving. Remember!"
        />
        <Container fluid>
          <Row>
            <Col columnSize={["12", "md-auto"]}>
              <Card
                cardHeader={{
                  title: isCheckInAvailable ? "Check-in" : "Check-out",
                }}
                elementList={[
                  <Col columnSize={["auto"]}>
                    <Row>
                      <p>{`Create a new check-${
                        isCheckInAvailable ? "in" : "out"
                      } for today before working`}</p>
                    </Row>
                    <Row className="justify-content-end">
                      <Button
                        className="py-2 px-4"
                        onClick={
                          isCheckInAvailable ? handleCheckIn : handleCheckOut
                        }
                      >
                        {isCheckInAvailable ? "Check-in" : "Check-out"}
                      </Button>
                    </Row>
                  </Col>,
                ]}
              />
            </Col>
          </Row>
          <Row>
            <Col columnSize={["12"]}>
              <Card
                cardHeader={{
                  title: "Check-in/out history",
                  badge: {
                    label: "All",
                    theme: "success",
                  },
                  extension: true,
                }}
                elementList={[
                  <Table
                    fieldList={fieldList}
                    recordList={recordList}
                    isHasSettings
                  />,
                ]}
                noBodyPadding
              />
            </Col>
          </Row>
        </Container>
      </MainContent>
    </>
  );
}

export default Checkin;