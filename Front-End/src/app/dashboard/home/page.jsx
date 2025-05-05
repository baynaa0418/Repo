'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Divider,
  Stack,
  Menu,
  MenuItem,
  IconButton,
  TextField,
  Button,
  Container
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ClearIcon from '@mui/icons-material/Clear';
import { useRouter, useParams } from 'next/navigation';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useAuth } from '@/app/dashboard/context/AuthContext';
import { toast } from 'react-toastify';

const customerData = {
  '1': {
    id: 1,
    name: 'Батбаяр Ариунболд',
    birthDate: '2001/07/06',
    age: 23,
    type: 'Оюутан',
    address: 'УБ, 3-р хороо, Даваа салбар, ...',
    phone: '9921 8857',
    vitalSigns: [
      { date: '2023/10/15', height: '175cm', weight: '70kg', bloodPressure: '120/80', temperature: '36.6' },
      { date: '2023/09/20', height: '175cm', weight: '68kg', bloodPressure: '118/78', temperature: '36.5' }
    ],
    medicalHistory: [
      { date: '2022/05/10', diagnosis: 'Харшил', treatment: 'Антигистамин', doctor: 'Д. Энхчимэг' },
      { date: '2021/11/15', diagnosis: 'Ханиад', treatment: 'Антибиотик', doctor: 'Д. Энхчимэг' }
    ],
    treatmentHistory: [
      { date: '2023/10/15', procedure: 'Шүдний эмчилгээ', dentist: 'Б. Ганцэцэг', notes: 'Хоёр шүд цэвэрлэлт хийсэн' },
      { date: '2023/07/22', procedure: 'Шүд суулгах', dentist: 'Б. Ганцэцэг', notes: 'Дээд 2 шүд суулгасан' }
    ],
    examinationHistory: [
      { date: '2023/10/15', type: 'Ерөнхий үзлэг', result: 'Хэвийн', doctor: 'Д. Энхчимэг' },
      { date: '2023/05/10', type: 'Шүдний рентген', result: 'Хоёр шүдэнд цооролтой', doctor: 'Б. Ганцэцэг' }
    ]
  }
};

export default function PatientProfile() {
  const router = useRouter();
  const params = useParams();
  const [tabValue, setTabValue] = useState(0);
  const [customer, setCustomer] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const pdfRef = useRef();
  const { user } = useAuth();

  useEffect(() => {
    if (user === null) return;
    if (!user) {
      router.push('/patientProfile/customerProfile');
    } else if (user.role !== 'patient') {
      router.push('/unauthorized');
    }
  }, [user, router]);

  useEffect(() => {
    if (user?.role === 'patient') {
      const id = params?.id || '1';
      if (customerData[id]) {
        setCustomer(customerData[id]);
      } else {
        router.push('/patientProfile/customerProfile');
      }
    }
  }, [user, params?.id, router]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const downloadPDF = async () => {
    handleMenuClose();
    const input = pdfRef.current;
    const canvas = await html2canvas(input, { 
      scale: 2, 
      useCORS: true, 
      allowTaint: true,
      backgroundColor: '#ffffff'
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${customer.name}_profile.pdf`);
  };

  const renderTabContent = () => {
    if (!customer) return null;
    
    const tabRenderers = [
      {
        title: 'Амин үзүүлэлт',
        data: customer.vitalSigns,
        fields: [
          { label: 'Өндөр', key: 'height' },
          { label: 'Жин', key: 'weight' },
          { label: 'Цусны даралт', key: 'bloodPressure' },
          { label: 'Биеийн температур', key: 'temperature', suffix: '°C' }
        ]
      },
      {
        title: 'Өвчний түүх',
        data: customer.medicalHistory,
        fields: [
          { label: 'Онош', key: 'diagnosis' },
          { label: 'Эмчилгээ', key: 'treatment' },
          { label: 'Эмч', key: 'doctor' }
        ]
      },
      {
        title: 'Эмчилгээний түүх',
        data: customer.treatmentHistory,
        fields: [
          { label: 'Процедур', key: 'procedure' },
          { label: 'Эмч', key: 'dentist' },
          { label: 'Тэмдэглэл', key: 'notes' }
        ]
      },
      {
        title: 'Үзлэгийн түүх',
        data: customer.examinationHistory,
        fields: [
          { label: 'Төрөл', key: 'type' },
          { label: 'Үр дүн', key: 'result' },
          { label: 'Эмч', key: 'doctor' }
        ]
      }
    ];

    const { title, data, fields } = tabRenderers[tabValue];

    const filteredData = data.filter(entry => 
      Object.values(entry).some(value => 
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

    return (
      <>
        <Typography variant="h6" gutterBottom>{title}</Typography>
        <Divider sx={{ mb: 2 }} />
        
        <TextField
          label="Хайх"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
          sx={{ mb: 3 }}
          InputProps={{
            endAdornment: searchQuery && (
              <IconButton onClick={() => setSearchQuery('')}>
                <ClearIcon />
              </IconButton>
            ),
          }}
        />
        
        {filteredData.length > 0 ? (
          filteredData.map((entry, index) => (
            <Box 
              key={index} 
              sx={{ 
                mb: 3, 
                p: 2, 
                border: '1px solid #eee', 
                borderRadius: '8px',
                width: '100%'
              }}
            >
              <Typography variant="subtitle2" color="text.secondary">{entry.date}</Typography>
              <Stack direction="row" spacing={4} sx={{ mt: 1 }} flexWrap="wrap">
                {fields.map((field, i) => (
                  <Box key={i} sx={{ minWidth: '200px', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">{field.label}</Typography>
                    <Typography>{entry[field.key]}{field.suffix || ''}</Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          ))
        ) : (
          <Typography color="text.secondary">Мэдээлэл байхгүй</Typography>
        )}
      </>
    );
  };

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        p: { xs: 1, sm: 2 },
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      <Box sx={{ mb: 2 }}>
        <IconButton onClick={() => router.back()}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" gutterBottom>Өвчтөний дэлгэрэнгүй</Typography>
      </Box>

      <Box 
        ref={pdfRef} 
        sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid #eee',
          borderRadius: '8px',
          p: { xs: 1, sm: 2 },
          backgroundColor: 'background.paper'
        }}
      >
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          indicatorColor="primary"
          sx={{ mb: 2 }}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Амин үзүүлэлт" />
          <Tab label="Өвчний түүх" />
          <Tab label="Эмчилгээний түүх" />
          <Tab label="Үзлэгийн түүх" />
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
            <IconButton onClick={handleMenuOpen}>
              <PictureAsPdfIcon />
            </IconButton>
          </Box>
        </Tabs>

        <Menu 
          anchorEl={anchorEl} 
          open={Boolean(anchorEl)} 
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={downloadPDF}>PDF татах</MenuItem>
        </Menu>

        {customer && (
          <Box sx={{ 
            mb: 3, 
            p: 2, 
            border: '1px solid #eee', 
            borderRadius: '8px',
          }}>
            <Typography variant="h6" gutterBottom>Үндсэн мэдээлэл</Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack direction="row" spacing={4} flexWrap="wrap">
              <Box sx={{ width: { xs: '100%', sm: '45%' }, mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Нэр</Typography>
                <Typography>{customer.name}</Typography>
              </Box>
              <Box sx={{ width: { xs: '100%', sm: '45%' }, mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Төрсөн огноо</Typography>
                <Typography>{customer.birthDate}</Typography>
              </Box>
              <Box sx={{ width: { xs: '100%', sm: '45%' }, mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Нас</Typography>
                <Typography>{customer.age}</Typography>
              </Box>
              <Box sx={{ width: { xs: '100%', sm: '45%' }, mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Төрөл</Typography>
                <Typography>{customer.type}</Typography>
              </Box>
              <Box sx={{ width: { xs: '100%', sm: '45%' }, mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Утас</Typography>
                <Typography>{customer.phone}</Typography>
              </Box>
              <Box sx={{ width: { xs: '100%', sm: '100%' }, mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Хаяг</Typography>
                <Typography>{customer.address}</Typography>
              </Box>
            </Stack>
          </Box>
        )}

        <Box sx={{ 
          flex: 1,
          overflowY: 'auto',
          pb: 2
        }}>
          {renderTabContent()}
        </Box>

        <Button
          variant="contained"
          sx={{ mt: 2, width: '100%' }}
          onClick={() => toast.success('Хадгалагдлаа')}
        >
          Хадгалах
        </Button>
      </Box>
    </Container>
  );
}