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
  Select,
  Option
} from "@material-tailwind/react";
import { appConfig } from "@/configs";
import { Tables } from "@/widgets/tables";
import { Loader } from "@/widgets/spinners";
import { Alert } from "@/widgets/alerts";
import { extractErrorMessages } from "@/utils";

export const Books = () => {
    const apiUrl = appConfig.baseApiUrl + "books";
    const pageSize = 5;
    const [books, setBooks] = useState([]);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(false);
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(1);
    const [refreshList, setRefreshList] = useState(false);

    const [title, setTitle] = useState("");
    const [bookId, setBookId] = useState("");
    const [isbn, setIsbn] = useState("");
    const [author, setAuthor] = useState("");
    const [subject, setSubject] = useState("");
    const [language, setLanguage] = useState("");
    const [publisher, setPublisher] = useState("");
    const [publicationDate, setPublicationDate] = useState("");
    const [pagesCount, setPagesCount] = useState("");
    const [bookCount, setBookCount] = useState("");
    const [translator, setTranslator] = useState("");

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
        { type: "text", name: "title", label: "title" },
        { type: "text", name: "author", label: "author" },
        { type: "text", name: "isbn", label: "ISBN" },
        { type: "text", name: "subject", label: "subject" },
        { type: "text", name: "language", label: "language" },
        { type: "text", name: "publisher", label: "publisher" },
        { type: "date", name: "publicationDate", label: "publication Date" },
      ];
    
      const headeroptions = {
        "Content-Type": "application/json",
      };

      useEffect(() => {
        const getBooks = async () => {
          const booksFromApi = await fetchBooks();
          setBooks(booksFromApi);
        };
        getBooks();
      }, [page, refreshList]); //eslint-disable-line react-hooks/exhaustive-deps


      const fetchBooks = async () => {
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

      const getFormObject = () => {
        return {
            title,
            isbn,
            author,
            translator,
            pagesCount,
            subject,
            publicationDate,
            publisher,
            count: bookCount,
            language,
          };
      }

      const onAddBook = () => {
        setFormValues('clear');
        handleOpen("ADD");
      };
    
      const createBook = async () => {
        const book = getFormObject();

        setSubmitButtonLoading(true);
        await fetch(apiUrl, {
          method: "POST",
          headers: headeroptions,
          body: JSON.stringify(book),
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
              const newBooksList = [
                ...books,
                {
                  ...responseResult.result,
                },
              ];
              const newCount = count + 1;
              setCount(newCount);
              if (newBooksList.length <= pageSize) {
                setBooks(newBooksList);
              } else {
                setPage(Math.ceil(newCount / pageSize));
              }
              setOpen(false);
              setFormValues('clear');
            }
          });
      };

      const onEditBook = (row) => {
        setFormValues('EDIT', row);
        handleOpen('EDIT');
      }

      const updateBook = async () => {
        setSubmitButtonLoading(true);
        const response = await fetch(`${apiUrl}/${bookId}`, {
          method: "PUT",
          headers: headeroptions,
          body: JSON.stringify(getFormObject()),
        });
        const result = await response.json();
        if (response.ok) {
          const book = result.result;
          const index = books.findIndex(
            (item) => item.id === book.id
          );
          if (index > -1) {
            books[index] = book;
            setBooks(books);
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

      const deleteBook = async (row) => {
        await fetch(`${apiUrl}/${row.id}`, {
          method: "DELETE",
        });
        const leftBooks = books.filter((item) => item.id !== row.id);
        setBooks(leftBooks);
        if (leftBooks.length === 0) {
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

      const setFormValues = (mode, book) => {
        setBookId(mode === 'clear' ? '' : book.id);
        setTitle(mode === 'clear' ? '' : book.title);
        setAuthor(mode === 'clear' ? '' : book.author);
        setIsbn(mode === 'clear' ? '' : book.isbn);
        setLanguage(mode === 'clear' ? '' : book.language);
        setBookCount(mode === 'clear' ? '' : book.count);
        setPagesCount(mode === 'clear' ? '' : book.pagesCount);
        setPublisher(mode === 'clear' ? '' : book.publisher);
        setPublicationDate(mode === 'clear' ? '' : book.publicationDate);
        setTranslator(mode === 'clear' ? '' : book.translator);
        setSubject(mode === 'clear' ? '' : book.subject);
      }

      const onPageChange = (page) => {
        setPage(page);
      };

    return (
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Tables
          title="Books"
          data={books}
          columns={tableColumns}
          actions={["edit", "delete"]}
          hasPaging={true}
          count={count}
          onPageChange={onPageChange}
          pageSize={pageSize}
          currentPage={page}
          loading={isPending}
          onAddRow={onAddBook}
          onEditRow={onEditBook}
          onDeleteRow={deleteBook}
        />
        <Dialog
          size="sm"
          open={open}
          handler={handleOpen}
          className="bg-transparent shadow-none"
        >
          <Card className="mx-auto w-full max-w-[36rem]">
            <CardHeader
              variant="gradient"
              color="blue"
              className="mb-4 grid h-28 place-items-center"
            >
              <Typography variant="h3" color="white">
                {dialogMode === "ADD" ? "New Book" : "Edit Book"}
              </Typography>
            </CardHeader>
            <CardBody className="flex flex-col gap-4">
              <Input
                label="Title"
                size="lg"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
              />
              <Input
                label="ISBN"
                size="lg"
                readOnly={dialogMode === "EDIT"}
                disabled={dialogMode === "EDIT"}
                onChange={(e) => setIsbn(e.target.value)}
                value={isbn}
              />
              <Input
                label="Author"
                size="lg"
                onChange={(e) => setAuthor(e.target.value)}
                value={author}
              />
              <Select
                label="Subject"
                menuProps={{ className: "h-48" }}
                value={subject}
                onChange={(e) => setSubject(e)}
              >
                <Option key="novel" value="novel">Novel</Option>
                <Option key="educational" value="educational">Educational</Option>
                <Option key="psychology" value="psychology">Psychology</Option>
                <Option key="philosophical" value="philosophical">Philosophical</Option>
                <Option key="historical" value="historical">Historical</Option>
                <Option key="religious" value="religious">Religious</Option>
                <Option key="fiction" value="fiction">Fiction</Option>
                <Option key="comic" value="comic">Comic</Option>
                <Option key="art" value="art">Art</Option>
                <Option key="science_fiction" value="science_fiction">Science fiction</Option>
                <Option key="children" value="children">Children</Option>
                <Option key="humer" value="humer">Humer</Option>
              </Select>
              <Input
                label="Publisher"
                size="lg"
                onChange={(e) => setPublisher(e.target.value)}
                value={publisher}
              />
              <div className="flex items-center gap-4">
              <Input
                label="Publication Year"
                size="lg"
                onChange={(e) => setPublicationDate(e.target.value)}
                value={publicationDate}
              />
              <Input
                label="Language"
                size="lg"
                onChange={(e) => setLanguage(e.target.value)}
                value={language}
              />
              </div>
              <div className="flex items-center gap-4">
              <Input
                label="Pages count"
                size="lg"
                type="number"
                onChange={(e) => setPagesCount(e.target.value)}
                value={pagesCount}
              />
              <Input
                label="Count"
                size="lg"
                type="number"
                onChange={(e) => setBookCount(e.target.value)}
                value={bookCount}
              />
              </div>
              <Input
                label="Translator"
                size="lg"
                onChange={(e) => setTranslator(e.target.value)}
                value={translator}
              />
            </CardBody>
            <CardFooter className="pt-0">
              <Button
                variant="gradient"
                onClick={dialogMode === "ADD" ? createBook : updateBook}
                disabled={
                  !title ||
                  !isbn ||
                  !author ||
                  !subject ||
                  !language ||
                  !publisher ||
                  !publicationDate ||
                  !pagesCount ||
                  !bookCount
                }
                fullWidth
              >
                {submitButtonLoading && <Loader />}
                {submitButtonLoading ? (
                  <></>
                ) : dialogMode === "ADD" ? (
                  "Add Book"
                ) : (
                  "Update Book"
                )}
              </Button>
              <Button
                variant="outlined"
                className="mt-2"
                onClick={() => handleOpen(dialogMode)}
                fullWidth
              >
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
}

export default Books;