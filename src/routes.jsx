import {
  HomeIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
  UserGroupIcon,
  BookOpenIcon,
  ArrowsRightLeftIcon
} from "@heroicons/react/24/solid";
import { Home, Books, Members, Loans } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <ArrowsRightLeftIcon {...icon} />,
        name: "loans",
        path: "/loans",
        element: <Loans />,
      },
      {
        icon: <BookOpenIcon {...icon} />,
        name: "books",
        path: "/books",
        element: <Books />,
      },
      {
        icon: <UserGroupIcon {...icon} />,
        name: "members",
        path: "/members",
        element: <Members />,
      },
    ],
  },
  // {
  //   title: "auth pages",
  //   layout: "auth",
  //   pages: [
  //     {
  //       icon: <ArrowRightOnRectangleIcon {...icon} />,
  //       name: "sign in",
  //       path: "/sign-in",
  //       element: <SignIn />,
  //     },
  //     {
  //       icon: <UserPlusIcon {...icon} />,
  //       name: "sign up",
  //       path: "/sign-up",
  //       element: <SignUp />,
  //     },
  //   ],
  // },
];

export default routes;
