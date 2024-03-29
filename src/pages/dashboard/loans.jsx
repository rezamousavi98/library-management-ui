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
  Option,
} from "@material-tailwind/react";
import { appConfig } from "@/configs";
import { Tables } from "@/widgets/tables";
import { Loader } from "@/widgets/spinners";
import { Alert } from "@/widgets/alerts";
import { Datepicker } from "@/widgets/datepicker";
import { extractErrorMessages } from "@/utils";
import Select from "react-select";

export const Loans = () => {
  const apiUrl = appConfig.baseApiUrl + "borrowing";
  const pageSize = 10;
  const [loans, setLoans] = useState([]);
  const [loansList, setLoansList] = useState([]);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(false);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [refreshList, setRefreshList] = useState(false);

  const [member, setMember] = useState({});
  const [books, setBooks] = useState([]);
  const [returnDate, setReturnDate] = useState("");
  const [membersList, setMembersList] = useState([]);
  const [booksList, setBooksList] = useState([]);
  const [loanId, setLoanId] = useState(-1);
  const [debt, setDebt] = useState(0);
  const [showDebt, setShowDebt] = useState(false);
  const [isLoanClosed, setIsLoanClosed] = useState(false);

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

  const tableColumns = [
    { type: "object", name: "member", objProp: "fullName", label: "Loaned To" },
    {
      type: "enum",
      name: "status",
      enumMap: { 0: "Closed", 1: "Open" },
      label: "Status",
    },
    { type: "date", name: "date", label: "Loaned At" },
    { type: "date", name: "returnDate", label: "Return Date" },
    { type: "date", name: "returnedDate", label: "Returned Date" },
  ];

  const headeroptions = {
    "Content-Type": "application/json",
  };

  useEffect(() => {
    const getLoans = async () => {
      const loansFromApi = await fetchLoans();
      setLoans(loansFromApi);
    };
    getLoans();
  }, [page, refreshList]); //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const getUsers = async () => {
      let membersFromApi = await fetchUsers();
      membersFromApi = membersFromApi.map((member) => {
        return {
          value: member.nationalCode,
          label: member.fullName,
        };
      });
      setMembersList(membersFromApi);
    };

    const getBooks = async () => {
      let booksFromApi = await fetchBooks();
      booksFromApi = booksFromApi.map((book) => {
        return {
          value: book.id,
          label: book.title,
        };
      });
      setBooksList(booksFromApi);
    };

    getUsers();
    getBooks();
  }, []);

  const fetchUsers = async () => {
    const response = await fetch(`${appConfig.baseApiUrl}members`);
    const data = await response.json();
    if (response.ok) {
      return data.result.results;
    } else {
      return [];
    }
  };

  const fetchBooks = async () => {
    const response = await fetch(
      `${appConfig.baseApiUrl}books?status=available`
    );
    const data = await response.json();
    if (response.ok) {
      return data.result.results;
    } else {
      return [];
    }
  };

  const fetchLoans = async () => {
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

  const setFormValues = (mode, loan) => {
    setMember(
      mode === "clear"
        ? ""
        : { value: loan.member.nationalCode, label: loan.member.fullName }
    );
    setBooks(
      mode === "clear"
        ? ""
        : loan.books.map((book) => ({ value: book.id, label: book.title }))
    );
    setReturnDate(mode === "clear" ? "" : loan.returnDate);
  };

  const onAddLoan = () => {
    setFormValues("clear");
    setShowDebt(false);
    setIsLoanClosed(false);
    handleOpen("ADD");
  };

  const createLoan = async () => {
    const loan = {
      member: member.value,
      books: books.map((book) => book.value),
      returnDate: new Date(returnDate).toISOString(),
    };

    setSubmitButtonLoading(true);
    await fetch(apiUrl, {
      method: "POST",
      headers: headeroptions,
      body: JSON.stringify(loan),
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
          const newLoansList = [
            ...loans,
            {
              ...responseResult.result,
            },
          ];
          const newCount = count + 1;
          setCount(newCount);
          if (newLoansList.length <= pageSize) {
            setLoans(newLoansList);
          } else {
            setPage(Math.ceil(newCount / pageSize));
          }
          setOpen(false);
          setFormValues("clear");
        }
      });
  };

  const onEditLoan = (row) => {
    setFormValues("EDIT", row);
    setLoanId(row.id);
    setShowDebt(false);
    setIsLoanClosed(row.status === 0 ? true : false);
    handleOpen("EDIT");
  };

  const updateLoan = async () => {
    setSubmitButtonLoading(true);
    const updateData = {
      returnedDate: new Date().toISOString(),
    };

    const response = await fetch(`${apiUrl}/${loanId}/close`, {
      method: "PATCH",
      headers: headeroptions,
      body: JSON.stringify(updateData),
    });
    const result = await response.json();
    if (response.ok) {
      const loan = result.result;
      const index = loans.findIndex((item) => item.id === loan.id);
      if (index > -1) {
        loans[index] = loan;
        setLoans(loans);
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

  const getDebt = async () => {
    await fetch(`${apiUrl}/${loanId}/debt`, {
      method: "POST",
      headers: headeroptions,
      body: JSON.stringify({
        returnedDate: new Date().toISOString(),
      }),
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
        if (responseResult) {
          setDebt(responseResult.result);
          setShowDebt(true);
        }
      });
  };

  const onPageChange = (page) => {
    setPage(page);
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Tables
        title="Loans"
        data={loans}
        columns={tableColumns}
        actions={["custom"]}
        hasPaging={true}
        count={count}
        onPageChange={onPageChange}
        pageSize={pageSize}
        currentPage={page}
        loading={isPending}
        onAddRow={onAddLoan}
        // onEditRow={onEditLoan}
        customAction={{
          action: onEditLoan,
          icon: "fas fa-file-pen",
          color: "blue",
          title: "Loan details",
        }}
      />
      <Dialog
        size="sm"
        open={open}
        handler={handleOpen}
        className="unset-overlay bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full max-w-[36rem]">
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-4 grid h-28 place-items-center"
          >
            <Typography variant="h3" color="white">
              {dialogMode === "ADD" ? "New Loan" : "Loan Details"}
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <Select
              options={membersList}
              isClearable={true}
              placeholder="Pick member"
              className="outline outline-0 focus:border-2 focus:border-blue-500 focus:outline-0"
              isDisabled={dialogMode === "EDIT"}
              value={member}
              onChange={(e) => setMember(e)}
            />
            <Select
              options={booksList}
              isClearable={true}
              placeholder="Choose books"
              className="outline outline-0 focus:border-2 focus:border-blue-500 focus:outline-0"
              isDisabled={dialogMode === "EDIT"}
              value={books}
              isMulti={true}
              closeMenuOnSelect={false}
              onChange={(e) => setBooks(e)}
            />
            <Datepicker
              onDateChange={setReturnDate}
              value={returnDate}
              isOpen={false}
              cssClass="w-full full-width-datepicker"
              disabled={dialogMode === "EDIT" ? true : false}
            />
            {showDebt && <p className="text-red-500">debt: ${debt}</p>}
          </CardBody>
          <CardFooter className="pt-0">
            {dialogMode === "EDIT" && !isLoanClosed && (
              <Button
                variant="outlined"
                className="float-left mb-2 w-1/3"
                onClick={getDebt}
                color="orange"
              >
                Get Debt
              </Button>
            )}
            {!isLoanClosed && (
              <Button
                variant="gradient"
                onClick={dialogMode === "ADD" ? createLoan : updateLoan}
                disabled={!member || !books.length || !returnDate}
                className={
                  dialogMode === "EDIT"
                    ? "float-right ml-2 mb-2 w-3/5"
                    : "w-full"
                }
              >
                {submitButtonLoading && <Loader />}
                {submitButtonLoading ? (
                  <></>
                ) : dialogMode === "ADD" ? (
                  "Add Loan"
                ) : (
                  "Checkout"
                )}
              </Button>
            )}
            <Button
              variant="outlined"
              className="mt-2"
              onClick={() => handleOpen(dialogMode)}
              fullWidth
            >
              Close
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

export default Loans;
