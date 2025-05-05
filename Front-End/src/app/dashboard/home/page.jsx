// 'use client'
// import { Grid, Box } from '@mui/material';
// import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
// // components
// import SalesOverview from '@/app/(DashboardLayout)/components/dashboard/SalesOverview';
// import YearlyBreakup from '@/app/(DashboardLayout)/components/dashboard/YearlyBreakup';
// import RecentTransactions from '@/app/(DashboardLayout)/components/dashboard/RecentTransactions';
// import ProductPerformance from '@/app/(DashboardLayout)/components/dashboard/ProductPerformance';
// import Blog from '@/app/(DashboardLayout)/components/dashboard/Blog';
// import MonthlyEarnings from '@/app/(DashboardLayout)/components/dashboard/MonthlyEarnings';
// import { useAuth } from './context/authContext';

// const Dashboard = () => {
//   const { user } = useAuth();

//   return (
//     <PageContainer title="Dashboard" description="this is Dashboard">
//       <Box>
//         <Grid container spacing={3}>
//           <Grid item xs={12} lg={8}>
//             <SalesOverview />
//           </Grid>
//           <Grid item xs={12} lg={4}>
//             <Grid container spacing={3}>
//               <Grid item xs={12}>
//                 <YearlyBreakup />
//               </Grid>
//               <Grid item xs={12}>
//                 <MonthlyEarnings />
//               </Grid>
//             </Grid>
//           </Grid>
//           <Grid item xs={12} lg={4}>
//             <RecentTransactions />
//           </Grid>
//           <Grid item xs={12} lg={8}>
//             <ProductPerformance />
//           </Grid>
//           <Grid item xs={12}>
//             <Blog />
//           </Grid>
//         </Grid>
//       </Box>
//     </PageContainer>
//   )
// }

// export default Dashboard;


'use client'
import { Grid, Box, Typography } from '@mui/material';
import PageContainer from '@/app/dashboard/components/container/PageContainer';
// components
import { useAuth } from '../context/AuthContext';
import PatientOverview from '../components/dashboard/PatientOverview';
import DepartmentBreakdown from '../components/dashboard/DepartmentBreakdown';
import MonthlyRevenue from '../components/dashboard/MonthlyRevenue';
import RecentAppointments from '../components/dashboard/recentAppointment';
import StaffPerformance from '../components/dashboard/StaffPerformance';
import AvailableMedications from '../components/dashboard/AvailableMed';

export default function Dashboard() {
  const { user } = useAuth();

  useEffect(() => {
    console.log("sdaaaa----->",user);
  });

  return (
    <PageContainer title="Эмнэлгийн хяналтын самбар" description="Hospital Dashboard">
      <Box sx={{ pt: 2, pb: 4 }}>
        <Typography variant="h4" fontWeight="600" sx={{ mb: 4 }}>
          Эмнэлгийн хяналтын самбар
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <PatientOverview />
          </Grid>
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <DepartmentBreakdown />
              </Grid>
              <Grid item xs={12}>
                <MonthlyRevenue />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={4}>
            <RecentAppointments />
          </Grid>
          <Grid item xs={12} lg={8}>
            <StaffPerformance />
          </Grid>
          <Grid item xs={12}>
            <AvailableMedications />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  )
}

// app/dashboard/page.js
// 'use client'
// import { Grid, Box, Typography, CircularProgress } from '@mui/material';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '../context/authContext';
// import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
// import PatientOverview from './components/dashboard/PatientOverview';
// import DepartmentBreakdown from './components/dashboard/DepartmentBreakdown';
// import MonthlyRevenue from './components/dashboard/MonthlyRevenue';
// import RecentAppointments from './components/dashboard/recentAppointment';
// import StaffPerformance from './components/dashboard/StaffPerformance';
// import AvailableMedications from './components/dashboard/AvailableMed';

// const Dashboard = () => {
//   const { user, loading } = useAuth();
//   const router = useRouter();

//   // Хэрэглэгч нэвтрээгүй эсвэл ачааллаж байгаа тохиолдолд
//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (!user) {
//     // Нэвтрээгүй тохиолдолд нэвтрэх хуудасруу шилжүүлэх
//     if (typeof window !== 'undefined') {
//       router.push('/authentication/login');
//     }
//     return null;
//   }

//   // Хэрэглэгчийн эрхийг шалгах (жишээ: зөвхөн эмч эсвэл админ хандах эсэх)
//   const canAccessDashboard = ['doctor', 'admin', 'patient'].includes(user.role);
  
//   if (!canAccessDashboard) {
//     return (
//       <PageContainer title="Хандах эрхгүй">
//         <Box sx={{ pt: 2, pb: 4, textAlign: 'center' }}>
//           <Typography variant="h4" sx={{ mb: 2 }}>
//             Хандах эрхгүй
//           </Typography>
//           <Typography>
//             Таны эрхээр энэ хуудсыг харах боломжгүй
//           </Typography>
//         </Box>
//       </PageContainer>
//     );
//   }

//   // Хэрэглэгчийн төрлөөс хамаарч өөр dashboard харуулах
//   const renderDashboard = () => {
//     switch(user.role) {
//       case 'admin':
//         return (
//           <>
//             <Grid item xs={12} lg={8}>
//               <PatientOverview />
//             </Grid>
//             <Grid item xs={12} lg={4}>
//               <Grid container spacing={3}>
//                 <Grid item xs={12}>
//                   <DepartmentBreakdown />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <MonthlyRevenue />
//                 </Grid>
//               </Grid>
//             </Grid>
//             <Grid item xs={12} lg={4}>
//               <RecentAppointments />
//             </Grid>
//             <Grid item xs={12} lg={8}>
//               <StaffPerformance />
//             </Grid>
//             <Grid item xs={12}>
//               <AvailableMedications />
//             </Grid>
//           </>
//         );
//       case 'doctor':
//         return (
//           <>
//             <Grid item xs={12} lg={8}>
//               <PatientOverview showOnlyMyPatients doctorId={user.id} />
//             </Grid>
//             <Grid item xs={12} lg={4}>
//               <Grid container spacing={3}>
//                 <Grid item xs={12}>
//                   <MyAppointments doctorId={user.id} />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <MySchedule doctorId={user.id} />
//                 </Grid>
//               </Grid>
//             </Grid>
//           </>
//         );
//       case 'patient':
//         return (
//           <>
//             <Grid item xs={12}>
//               <MyMedicalRecords patientId={user.id} />
//             </Grid>
//             <Grid item xs={12} lg={6}>
//               <UpcomingAppointments patientId={user.id} />
//             </Grid>
//             <Grid item xs={12} lg={6}>
//               <PrescriptionHistory patientId={user.id} />
//             </Grid>
//           </>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <PageContainer title="Эмнэлгийн хяналтын самбар" description="Hospital Dashboard">
//       <Box sx={{ pt: 2, pb: 4 }}>
//         <Typography variant="h4" fontWeight="600" sx={{ mb: 4 }}>
//           {user.role === 'admin' && 'Эмнэлгийн хяналтын самбар'}
//           {user.role === 'doctor' && 'Эмчийн самбар'}
//           {user.role === 'patient' && 'Миний эрүүл мэндийн самбар'}
//         </Typography>
//         <Grid container spacing={3}>
//           {renderDashboard()}
//         </Grid>
//       </Box>
//     </PageContainer>
//   );
// };

// export default Dashboard;