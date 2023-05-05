import { Button, IconButton } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import PropTypes from "prop-types";

export const Pagination = ({count, onPageChange, pageSize}) => {
  const [active, setActive] = useState(1);
  const pagesCount = Math.ceil(count / pageSize);
  // TODO: fix active page updating
  const updatePage = (page) => {
    if (page === active) return;
    setActive(page);
    onPageChange(page);
  }

  const next = () => {
    if (active === pagesCount) return;
    updatePage(active + 1);
  };

  const prev = () => {
    if (active === 1) return;
    updatePage(active - 1);
  };

  return (
    <div className="flex items-center justify-end gap-4">
      <Button
        variant="text"
        color="blue-gray"
        className="flex items-center gap-2"
        onClick={prev}
        disabled={active === 1}
      >
        <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> Previous
      </Button>
      <div className="flex items-center gap-2">
        {Array.from({ length: pagesCount }, (item, index) => (
          <IconButton
            key={index + 1}
            variant={active === index + 1 ? "filled" : "text"}
            color={active === index + 1 ? "blue" : "blue-gray"}
            onClick={() => updatePage(index + 1)}
          >
            {index + 1}
          </IconButton>
        ))}
      </div>
      <Button
        variant="text"
        color="blue-gray"
        className="flex items-center gap-2"
        onClick={next}
        disabled={active === pagesCount}
      >
        Next
        <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
      </Button>
    </div>
  );
};

Pagination.prototype = {
    count: PropTypes.number,
    onPageChange: PropTypes.object,
    pageSize: PropTypes.number
}

export default Pagination;