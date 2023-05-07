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
export const Members = () => {
  // TODO: make add modal responsive, edit member and renewal
  const apiUrl = appConfig.baseApiUrl + "members/";
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
  const [addMemberLoading, setAddMemberLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen((state) => !state);

  const tableColumns = [
    { type: "text", name: "fullName", label: "Full Name" },
    { type: "text", name: "nationalCode", label: "National Code" },
    { type: "text", name: "mobile", label: "Mobile No." },
    { type: "text", name: "address", label: "Address" },
    { type: "date", name: "registeredAt", label: "Registered At" },
  ];

  useEffect(() => {
    const getMembers = async () => {
      const membersFromApi = await fetchMembers();
      setMembers(membersFromApi);
    };
    getMembers();
  }, [page, refreshList]); //eslint-disable-line react-hooks/exhaustive-deps

  const addMember = async (member) => {
    setAddMemberLoading(true);
      await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(member),
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              alert('عملیات با خطا مواجه شد');
            }
          })
          .then((responseResult) => {
            setAddMemberLoading(false);
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
          });
  }

  const fetchMembers = async () => {
    setIsPending(true);
    const response = await fetch(`${apiUrl}?page=${page}&limit=${pageSize}`);
    if (response.ok) {
      const data = await response.json();
      setIsPending(false);
      setError(false);
      setCount(data.result.count);
      return data.result.results;
    } else {
      setError(true);
      setIsPending(false);
      setCount(0);
      return [];
    }
  };

    const deleteMember = async (id) => {
      await fetch(`${apiUrl}${id}`, {
          method: "DELETE",
        });
        const leftMembers = members.filter((item) => item.nationalCode !== id);
        setMembers(leftMembers);
        // Fix update page
        if (leftMembers.length === 0) {
          if (page > 1) {
            setPage(page - 1);
          }
          setCount(count > 0 ? count - 1 : 0);
        } else {
          setPage(page);
          setRefreshList(true);
          setCount(count > 0 ? count - 1 : 0)
        }
    }

  const onAddMember = () => {
    if (!fullName || !nationalCode || !mobile || !address) {
      return;
    }
    const member = {
      fullName,
      nationalCode,
      mobile,
      address,
      registrationExpiry: "2023-12-15T00:00:00.000Z",
    };
    addMember(member);
  };

  const onEditMember = (row) => {
    console.log(row);
  }

  const onDeleteMember = (row) => {
    deleteMember(row.nationalCode);
  }

  const onPageChange = (page) => {
    setPage(page);
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Tables
        title="Members"
        data={members}
        columns={tableColumns}
        actions={['edit', 'delete']}
        hasPaging={true}
        count={count}
        onPageChange={onPageChange}
        pageSize={pageSize}
        currentPage={page}
        loading={isPending}
        onAddRow={handleOpen}
        onEditRow={onEditMember}
        onDeleteRow={onDeleteMember}
      />
      <Dialog
        size="xs"
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
              New Member
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <Input
              label="Full Name"
              size="lg"
              onChange={(e) => setFullName(e.target.value)}
            />
            <Input
              label="National Code"
              size="lg"
              onChange={(e) => setNationalCode(e.target.value)}
            />
            <Input
              label="Mobile"
              size="lg"
              onChange={(e) => setMobile(e.target.value)}
            />
            <Input
              label="Address"
              size="lg"
              onChange={(e) => setAddress(e.target.value)}
            />
          </CardBody>
          <CardFooter className="pt-0">
            <Button
              variant="gradient"
              onClick={onAddMember}
              disabled={!fullName || !nationalCode || !mobile || !address}
              fullWidth
            >
              Add Member
            </Button>
          </CardFooter>
        </Card>
      </Dialog>
    </div>
  );
};
