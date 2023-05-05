import {
    Card,
    CardHeader,
    CardBody,
    Typography,
  } from "@material-tailwind/react";
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
  offsetCount,
  loading
}) => {
  return (
    <Card>
      <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
        <Typography variant="h6" color="white">
          {title}
        </Typography>
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
                      {hasPaging ? offsetCount + key + 1 : key + 1}
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
                      <td className={className}>
                        <Typography
                          as="a"
                          href="#"
                          className="text-xs font-semibold text-blue-gray-600"
                        >
                          Edit
                        </Typography>
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
        <div className="table-footer px-3 py-2">
          <Pagination
            count={count}
            onPageChange={onPageChange}
            pageSize={pageSize}
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
    offsetCount: PropTypes.number,
    onPageChange: PropTypes.func,
    loading: PropTypes.bool,
}

export default Tables;