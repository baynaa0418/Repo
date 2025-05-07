<<<<<<< HEAD
=======
// import { uniqueId } from "lodash";
// import Person3OutlinedIcon from "@mui/icons-material/Person3Outlined";
// import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
// import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
// import SickOutlinedIcon from "@mui/icons-material/SickOutlined";
// import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
// import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
// import BloodtypeIcon from "@mui/icons-material/Bloodtype";
// import SummarizeIcon from "@mui/icons-material/Summarize";
// import VaccinesIcon from "@mui/icons-material/Vaccines";

// const Menuitems = (user) => {
//   const baseMenu = [
//     {
//       navlabel: true,
//       subheader: "Үндсэн цэс",
//     },
//     {
//       id: uniqueId(),
//       title: "Хянах самбар",
//       icon: DashboardOutlinedIcon,
//       href: "/",
//     },
//     {
//       id: uniqueId(),
//       title: "Амин үзүүлэлт",
//       icon: BloodtypeIcon,
//       href: "/vitals",
//     },
//     {
//       id: uniqueId(),
//       title: "Эмчилгээ",
//       icon: VaccinesIcon,
//       href: "/treatment",
//     },
//     // {
//     //   id: uniqueId(),
//     //   title: "Үзлэгийн цаг",
//     //   icon: CalendarMonthOutlinedIcon,
//     //   href: "/makeAppointment",
//     // },
//   ];

//   const doctorAndNurseMenu = [
//     {
//       id: uniqueId(),
//       title: "Үйлчлүүлэгч",
//       icon: SickOutlinedIcon,
//       href: "/customer",
//     },
//     {
//       id: uniqueId(),
//       title: "Материал зарцуулалт",
//       icon: MedicalServicesOutlinedIcon,
//       href: "/pharmacy",
//     },
//     {
//       id: uniqueId(),
//       title: "Тайлан",
//       icon: SummarizeIcon,
//       href: "/report",
//     },
//   ];

//   const doctorMenu = [
//     {
//       id: uniqueId(),
//       title: "Үзлэг",
//       icon: MedicalServicesIcon,
//       href: "/examination",
//     },
//     {
//       id: uniqueId(),
//       title: "Ажилтан",
//       icon: Person3OutlinedIcon,
//       href: "/employee",
//     },
//   ];

//   let menuData = [...baseMenu];

//   if (user?.user.role === "MedicalStaff") {
//     menuData = [...menuData, ...doctorAndNurseMenu, ...doctorMenu];
//   // } else if (user?.role === "Nurse") {
//   //   menuData = [...menuData, ...doctorAndNurseMenu];
//   } else if (user?.user.role === "Admin") {
//     menuData = [...baseMenu, ...doctorAndNurseMenu, ...doctorMenu];
//   }

//   return menuData;
// };

// export default Menuitems;



>>>>>>> 4fee7c1 ([ADD] add some functions)
import { uniqueId } from "lodash";
import Person3OutlinedIcon from "@mui/icons-material/Person3Outlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import SickOutlinedIcon from "@mui/icons-material/SickOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import BloodtypeIcon from "@mui/icons-material/Bloodtype";
import SummarizeIcon from "@mui/icons-material/Summarize";
import VaccinesIcon from "@mui/icons-material/Vaccines";

<<<<<<< HEAD
const Menuitems = (user) => {
  const baseMenu = [
=======
const Menuitems = () => {
  const menuData = [
>>>>>>> 4fee7c1 ([ADD] add some functions)
    {
      navlabel: true,
      subheader: "Үндсэн цэс",
    },
    {
      id: uniqueId(),
      title: "Хянах самбар",
      icon: DashboardOutlinedIcon,
<<<<<<< HEAD
      href: "/dashboard/home",
=======
      href: "/",
>>>>>>> 4fee7c1 ([ADD] add some functions)
    },
    {
      id: uniqueId(),
      title: "Амин үзүүлэлт",
      icon: BloodtypeIcon,
<<<<<<< HEAD
      href: "/dashboard/vitals",
=======
      href: "/vitals",
>>>>>>> 4fee7c1 ([ADD] add some functions)
    },
    {
      id: uniqueId(),
      title: "Эмчилгээ",
      icon: VaccinesIcon,
<<<<<<< HEAD
      href: "/dashboard/treatment",
=======
      href: "/treatment",
>>>>>>> 4fee7c1 ([ADD] add some functions)
    },
    {
      id: uniqueId(),
      title: "Үйлчлүүлэгч",
      icon: SickOutlinedIcon,
<<<<<<< HEAD
      href: "/dashboard/customer",
=======
      href: "/customer",
>>>>>>> 4fee7c1 ([ADD] add some functions)
    },
    {
      id: uniqueId(),
      title: "Материал зарцуулалт",
      icon: MedicalServicesOutlinedIcon,
<<<<<<< HEAD
      href: "/dashboard/pharmacy",
=======
      href: "/pharmacy",
>>>>>>> 4fee7c1 ([ADD] add some functions)
    },
    {
      id: uniqueId(),
      title: "Тайлан",
      icon: SummarizeIcon,
<<<<<<< HEAD
      href: "/dashboard/report",
=======
      href: "/report",
>>>>>>> 4fee7c1 ([ADD] add some functions)
    },
    {
      id: uniqueId(),
      title: "Үзлэг",
      icon: MedicalServicesIcon,
      href: "/examination",
    },
    {
      id: uniqueId(),
      title: "Ажилтан",
      icon: Person3OutlinedIcon,
<<<<<<< HEAD
      href: "/dashboard/employee",
    },
  ];

  let menuData = [...baseMenu];

  // Check if user exists and has the correct structure
  if (user && user.user && user.user.role) {
    if (user.user.role === "doctor") {
      menuData = [...baseMenu];
    }
  }

=======
      href: "/employee",
    },
    // {
    //   id: uniqueId(),
    //   title: "Үзлэгийн цаг",
    //   icon: CalendarMonthOutlinedIcon,
    //   href: "/makeAppointment",
    // },
  ];

>>>>>>> 4fee7c1 ([ADD] add some functions)
  return menuData;
};

export default Menuitems;
