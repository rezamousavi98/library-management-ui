import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Button,
    IconButton,
    Popover,
    PopoverHandler,
    PopoverContent,
  } from "@material-tailwind/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import PropTypes from "prop-types";
import { datePipe } from '@/utils';
import { Pagination } from "@/widgets/tables";
import { Spinner } from '@/widgets/spinners';

export const Tables = ({
  title,
  columns,
  data,
  actions,
  hasPaging,
  onPageChange,
  count,
  pageSize,
  currentPage,
  loading,
  onAddRow,
  onEditRow,
  onDeleteRow
}) => {
  return (
    <Card>
      <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
        <Typography variant="h6" color="white" className="inline-block align-sub">
          {title}
        </Typography>
        {onAddRow && (
          <Button
            variant="filled"
            color="white"
            size="sm"
            title="Create new member"
            className="float-right flex items-center bg-white focus:opacity-100"
            onClick={onAddRow}
          >
            <PlusIcon
              color="#1e88e5"
              strokeWidth={2}
              className="mr-1 h-4 w-4"
            />
            Add
          </Button>
        )}
      </CardHeader>
      <CardBody className="overflow-x-auto px-0 pt-0 pb-2">
        {!loading ? (
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                  #
                </th>
                {columns.map((column) => (
                  <th
                    key={column.name}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {column.label}
                    </Typography>
                  </th>
                ))}
                {actions.length ? (
                  <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    ></Typography>
                  </th>
                ) : (
                  <></>
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((row, key) => {
                const className = `py-3 px-5 ${
                  key === data.length - 1 ? "" : "border-b border-blue-gray-50"
                }`;

                return (
                  <tr key={row.id}>
                    <td className={className}>
                      {hasPaging
                        ? (currentPage - 1) * pageSize + key + 1
                        : key + 1}
                    </td>
                    {columns.map((column) => (
                      <td key={row.id + column.name} className={className}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-semibold"
                        >
                          {column.type === "date"
                            ? datePipe(row[column.name])
                            : row[column.name]}
                        </Typography>
                      </td>
                    ))}
                    {actions.length ? (
                      <td className="inline-flex border-b border-blue-gray-50 py-2 px-5" style={{width: '100%'}}>
                        {actions.includes("edit") && (
                          <IconButton variant="outlined" size="sm" className="m-1" onClick={() => onEditRow(row)}>
                          <i className="fas fa-pen" />
                        </IconButton>
                        )}
                        {actions.includes("delete") && (
                          <Popover placement="left-start" dismiss={{enabled: true, escapeKey: true}}>
                          <PopoverHandler>
                            <IconButton variant="outlined" size="sm" className="m-1" color="red">
                            <i className="fas fa-trash" />
                          </IconButton>
                          </PopoverHandler>
                          <PopoverContent className="w-60">
                            <Typography
                              variant="h6"
                              color="blue-gray"
                              className="mb-3"
                            >
                              Are you sure?
                            </Typography>
                            <div className="flex justify-end gap-2">
                              <Button variant="text" size="sm" onClick={() => onDeleteRow(row)} >{`Yes, delete this item`}</Button>
                              {/* <Button variant="text" size="sm" onClick={(e) => console.log(e)}>Cancel</Button> */}
                            </div>
                          </PopoverContent>
                        </Popover>
                        )}
                      </td>
                    ) : (
                      <></>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="loading-container py-5">
            <Spinner />
          </div>
        )}
      </CardBody>
      {hasPaging && !loading ? (
        <div className="table-footer px-4 py-2">
          <Pagination
            count={count}
            onPageChange={onPageChange}
            pageSize={pageSize}
            currentPage={currentPage}
          />
        </div>
      ) : (
        <></>
      )}
    </Card>
  );
};

Tables.prototype = {
    title: PropTypes.string,
    columns: PropTypes.array,
    data: PropTypes.array,
    actions: PropTypes.array,
    count: PropTypes.number,
    hasPaging: PropTypes.bool,
    pageSize: PropTypes.number,
    currentPage: PropTypes.number,
    onPageChange: PropTypes.func,
    loading: PropTypes.bool,
    onAddRow: PropTypes.func,
    onEditRow: PropTypes.func,
    onDeleteRow: PropTypes.func
}

export default Tables;