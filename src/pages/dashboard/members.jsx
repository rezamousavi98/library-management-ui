import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
} from "@material-tailwind/react";
import { appConfig } from "@/configs";
import { Tables } from "@/widgets/tables";
import { Loader } from "@/widgets/spinners";
import { Alert } from "@/widgets/alerts";
import { extractErrorMessages } from "@/utils";
import { Datepicker } from "@/widgets/datepicker";
export const Members = () => {
  const apiUrl = appConfig.baseApiUrl + "members";
  const pageSize = 5;
  const [members, setMembers] = useState([]);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(false);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [refreshList, setRefreshList] = useState(false);
  const [fullName, setFullName] = useState("");
  const [nationalCode, setNationalCode] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [registrationExpiry, setRegistrationExpiry] = useState("");
  const [submitButtonLoading, setSubmitButtonLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = (mode) => {
    setOpen((state) => !state);
    setDialogMode(mode);
  };
  const [dialogMode, setDialogMode] = useState("ADD");
  const [alertMessage, setAlertMessage] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const handleAlert = () => setOpenAlert((state) => !state);
  const [openExtention, setOpenExtention] = useState(false);
  const handleOpenExtention = () => setOpenExtention((state) => !state);

  const tableColumns = [
    { type: "text", name: "fullName", label: "Full Name" },
    { type: "text", name: "nationalCode", label: "National Code" },
    { type: "text", name: "mobile", label: "Mobile No." },
    { type: "text", name: "address", label: "Address" },
    { type: "date", name: "registeredAt", label: "Registered At" },
    { type: "date", name: "registrationExpiry", label: "Registration Expiry" }
  ];

  const headeroptions = {
    "Content-Type": "application/json",
  };

  useEffect(() => {
    const getMembers = async () => {
      const membersFromApi = await fetchMembers();
      setMembers(membersFromApi);
    };
    getMembers();
  }, [page, refreshList]); //eslint-disable-line react-hooks/exhaustive-deps

  const addMember = async (member) => {
    setSubmitButtonLoading(true);
    await fetch(apiUrl, {
      method: "POST",
      headers: headeroptions,
      body: JSON.stringify(member),
    })
      .then(async (response) => {
        if (response.ok) {
          setError(false);
          return response.json();
        } else {
          setError(true);
          const result = await response.json();
          setAlertMessage(extractErrorMessages(result.message));
          setOpenAlert(true);
        }
      })
      .then((responseResult) => {
        setSubmitButtonLoading(false);
        if (responseResult) {
          const newMembersList = [
            ...members,
            {
              ...responseResult.result,
            },
          ];
          const newCount = count + 1;
          setCount(newCount);
          if (newMembersList.length <= pageSize) {
            setMembers(newMembersList);
          } else {
            setPage(Math.ceil(newCount / pageSize));
          }
          setOpen(false);
          clearForm();
        }
      });
  };

  const fetchMembers = async () => {
    setIsPending(true);
    const response = await fetch(`${apiUrl}/?page=${page}&limit=${pageSize}`);
    const data = await response.json();
    if (response.ok) {
      setIsPending(false);
      setError(false);
      setCount(data.result.count);
      return data.result.results;
    } else {
      setIsPending(false);
      setCount(0);
      setError(true);
      setAlertMessage(extractErrorMessages(data.message));
      setOpenAlert(true);
      return [];
    }
  };

  const onDeleteMember = (row) => {
    deleteMember(row.nationalCode);
  };

  const deleteMember = async (id) => {
    await fetch(`${apiUrl}/${id}`, {
      method: "DELETE",
    });
    const leftMembers = members.filter((item) => item.nationalCode !== id);
    setMembers(leftMembers);
    if (leftMembers.length === 0) {
      if (page > 1) {
        setPage(page - 1);
      }
      setCount(count > 0 ? count - 1 : 0);
    } else {
      setPage(page);
      setRefreshList(!refreshList);
      setCount(count > 0 ? count - 1 : 0);
    }
  };

  const onAddMember = () => {
    clearForm();
    handleOpen("ADD");
  };

  const createMember = () => {
    if (!fullName || !nationalCode || !mobile || !address) {
      return;
    }
    const member = {
      fullName,
      nationalCode,
      mobile,
      address,
      registrationExpiry: `${new Date().getFullYear()}-12-30T00:00:00.000Z`,
    };
    addMember(member);
  };

  const onEditMember = (row) => {
    setMemberInfo(row);
    handleOpen("EDIT");
  };

  const updateMember = async () => {
    setSubmitButtonLoading(true);
    const memberData = { fullName, mobile, address };
    const response = await fetch(`${apiUrl}/${nationalCode}`, {
      method: "PATCH",
      headers: headeroptions,
      body: JSON.stringify(memberData),
    });
    const result = await response.json();
    if (response.ok) {
      const member = result.result;
      const index = members.findIndex(
        (item) => item.nationalCode === member.nationalCode
      );
      if (index > -1) {
        members[index] = member;
        setMembers(members);
      }
      setSubmitButtonLoading(false);
      setOpen(false);
      setError(false);
      clearForm();
    } else {
      setSubmitButtonLoading(false);
      setError(true);
      setAlertMessage(extractErrorMessages(result.message));
      setOpenAlert(true);
    }
  };

  const onRenewal = (row) => {
    setMemberInfo(row);
    handleOpenExtention();
  }

  const extendSubscription = async () => {
    setSubmitButtonLoading(true);
    const bodyData = {
      expiryDate: new Date(registrationExpiry).toISOString()
    }
    const response = await fetch(`${apiUrl}/${nationalCode}/subscription-renewal`, {
      method: "PATCH",
      headers: headeroptions,
      body: JSON.stringify(bodyData) 
    });
    const result = await response.json();
    if (response.ok) {
      const member = result.result;
      const index = members.findIndex(
        (item) => item.nationalCode === member.nationalCode
      );
      if (index > -1) {
        members[index] = member;
        setMembers(members);
      }
      setSubmitButtonLoading(false);
      setOpenExtention(false);
      setError(false);
      clearForm();
    } else {
      setSubmitButtonLoading(false);
      setError(true);
      setAlertMessage(extractErrorMessages(result.message));
      setOpenAlert(true);
    }
  }

  const setMemberInfo = (member) => {
    setFullName(member.fullName);
    setNationalCode(member.nationalCode);
    setMobile(member.mobile);
    setAddress(member.address);
    setRegistrationExpiry(member.registrationExpiry);
  }

  const clearForm = () => {
    setFullName("");
    setNationalCode("");
    setMobile("");
    setAddress("");
    setRegistrationExpiry("");
  };

  const onPageChange = (page) => {
    setPage(page);
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Tables
        title="Members"
        data={members}
        columns={tableColumns}
        actions={["edit", "delete", "custom"]}
        hasPaging={true}
        count={count}
        onPageChange={onPageChange}
        pageSize={pageSize}
        currentPage={page}
        loading={isPending}
        onAddRow={onAddMember}
        onEditRow={onEditMember}
        onDeleteRow={onDeleteMember}
        customAction={{
          action: onRenewal,
          icon: "fas fa-repeat",
          color: "green",
          title: "Extend Subscription",
        }}
      />
      <Dialog
        size="md"
        open={open}
        handler={handleOpen}
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full max-w-[24rem]">
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-4 grid h-28 place-items-center"
          >
            <Typography variant="h3" color="white">
              {dialogMode === "ADD" ? "New Member" : "Edit Member"}
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <Input
              label="Full Name"
              size="lg"
              onChange={(e) => setFullName(e.target.value)}
              value={fullName}
            />
            <Input
              label="National Code"
              size="lg"
              readOnly={dialogMode === "EDIT"}
              disabled={dialogMode === "EDIT"}
              onChange={(e) => setNationalCode(e.target.value)}
              value={nationalCode}
            />
            <Input
              label="Mobile"
              size="lg"
              onChange={(e) => setMobile(e.target.value)}
              value={mobile}
            />
            <Input
              label="Address"
              size="lg"
              onChange={(e) => setAddress(e.target.value)}
              value={address}
            />
          </CardBody>
          <CardFooter className="pt-0">
            <Button
              variant="gradient"
              onClick={dialogMode === "ADD" ? createMember : updateMember}
              disabled={!fullName || !nationalCode || !mobile || !address}
              fullWidth
            >
              {submitButtonLoading && <Loader />}
              {submitButtonLoading ? (
                <></>
              ) : dialogMode === "ADD" ? (
                "Add Member"
              ) : (
                "Update Member"
              )}
            </Button>
            <Button variant="outlined" className="mt-2" onClick={() => handleOpen(dialogMode)} fullWidth>
              Cancel
            </Button>
          </CardFooter>
        </Card>
      </Dialog>
      <Dialog
        size="md"
        open={openExtention}
        handler={handleOpenExtention}
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full max-w-[24rem]">
          <CardHeader
            variant="gradient"
            color="cyan"
            className="mb-4 grid h-28 place-items-center"
          >
            <Typography variant="h4" color="white">
              Extend Subscription
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4 px-6 py-2" style={{ height: "380px" }}>
           <Typography variant="h6">{fullName} - {nationalCode}</Typography>
            <Datepicker
              onDateChange={setRegistrationExpiry}
              value={registrationExpiry}
              isOpen={true}
              cssClass="w-full full-width-datepicker"
            />
          </CardBody>
          <CardFooter className="pt-0">
            <Button variant="gradient" onClick={extendSubscription} fullWidth>
              {submitButtonLoading && <Loader />}
              {submitButtonLoading ? (
                <></>
              ) : "Submit"}
            </Button>
            <Button variant="outlined" className="mt-2" onClick={handleOpenExtention} fullWidth>
              Cancel
            </Button>
          </CardFooter>
        </Card>
      </Dialog>
      {openAlert && error && (
        <Alert
          title="Error"
          open={openAlert}
          handler={handleAlert}
          size="sm"
          headerColor="red"
          message={alertMessage}
        />
      )}
    </div>
  );
};
