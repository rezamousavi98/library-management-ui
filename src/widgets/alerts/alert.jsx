import { Dialog, Card, CardHeader, CardBody, CardFooter, Typography, Button } from '@material-tailwind/react';
import PropTypes from "prop-types";

export const Alert = ({size, open, handler, title, headerColor, confirmLabel, cancelLabel, message}) => {
    return (<Dialog
        size={size || "md"}
        open={open}
        handler={handler}
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full max-w-[24rem]">
          <CardHeader
            variant="gradient"
            color={headerColor || "blue"}
            className="-mt-1 mb-4 grid h-16 place-items-center"
          >
            <Typography variant="h4" color="white">
              {title}
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
           {message}
          </CardBody>
          <CardFooter className="pt-0">
          <Button
              variant="outlined"
              size="sm"
              className="float-right ml-2"
              onClick={handler}
            >
              {confirmLabel ?? "OK"}
            </Button>
          {cancelLabel && <Button
              variant="outlined"
              size="sm"
              className="float-right"
              onClick={handler}
            >
              {cancelLabel}
            </Button>}
          </CardFooter>
        </Card>
      </Dialog>)
}

Alert.prototype = {
    title: PropTypes.string,
    handler: PropTypes.func,
    open: PropTypes.bool,
    headerColor: PropTypes.oneOf([
        "white",
        "blue-gray",
        "gray",
        "brown",
        "deep-orange",
        "orange",
        "amber",
        "yellow",
        "lime",
        "light-green",
        "green",
        "teal",
        "cyan",
        "light-blue",
        "blue",
        "indigo",
        "deep-purple",
        "purple",
        "pink",
        "red",
      ]),
    size: PropTypes.oneOf([
        "xs",
        "sm",
        "md",
        "lg",
        "xl",
        "xxl",
      ]),
    message: PropTypes.string,
    confirmLabel: PropTypes.string,
    cancelLabel: PropTypes.string,
}

export default Alert;