"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/dashboard/context/AuthContext";

const ExaminationList = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [examinations, setExaminations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchExaminations = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8000/api/examination/my-examinations", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Үзлэгийн мэдээлэл ачаалахад алдаа гарлаа");
        }

        const result = await response.json();
        console.log("Examinations:", result);
        if (result.data && Array.isArray(result.data)) {
          setExaminations(result.data);
        } else {
          throw new Error("Үзлэгийн мэдээлэл буруу форматаар ирлээ");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExaminations();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Үзлэгийн мэдээллийг устгахдаа итгэлтэй байна уу?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:8000/api/examination/exam/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Үзлэгийн мэдээлэл устгахад алдаа гарлаа");
        }

        setExaminations(examinations.filter(exam => exam._id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleViewDetails = (exam) => {
    setSelectedExam(exam);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedExam(null);
  };

  const getExamTypeColor = (type) => {
    switch (type) {
      case "General":
        return "primary";
      case "Special":
        return "secondary";
      case "Emergency":
        return "error";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h5">Үзлэгийн жагсаалт</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push("/examination/create")}
          >
            Шинэ үзлэг
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {examinations.length === 0 ? (
          <Alert severity="info">Үзлэгийн мэдээлэл олдсонгүй</Alert>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Огноо</TableCell>
                  <TableCell>Өвчтөн</TableCell>
                  <TableCell>Регистрийн дугаар</TableCell>
                  <TableCell>Үзлэгийн төрөл</TableCell>
                  <TableCell>Эмчийн үзлэг</TableCell>
                  <TableCell>Өвчин</TableCell>
                  <TableCell>Үйлдэл</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {examinations.map((exam) => (
                  <TableRow key={exam._id}>
                    <TableCell>
                      {new Date(exam.exam_date).toLocaleDateString("mn-MN")}
                    </TableCell>
                    <TableCell>
                      {exam.patient?.firstname} {exam.patient?.lastname}
                    </TableCell>
                    <TableCell>{exam.patient?.register}</TableCell>
                    <TableCell>
                      <Chip
                        label={exam.exam_type}
                        color={getExamTypeColor(exam.exam_type)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{exam.doctors_examination}</TableCell>
                    <TableCell>{exam.illness}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleViewDetails(exam)}
                        size="small"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(exam._id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>

      {/* Дэлгэрэнгүй мэдээллийн dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {selectedExam && (
          <>
            <DialogTitle>Үзлэгийн дэлгэрэнгүй мэдээлэл</DialogTitle>
            <DialogContent>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Огноо:</strong> {new Date(selectedExam.exam_date).toLocaleDateString("mn-MN")}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Өвчтөн:</strong> {selectedExam.patient?.firstname} {selectedExam.patient?.lastname}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Регистрийн дугаар:</strong> {selectedExam.patient?.register}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Үзлэгийн төрөл:</strong> {selectedExam.exam_type}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Эмчийн үзлэг:</strong> {selectedExam.doctors_examination}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Өвчин:</strong> {selectedExam.illness}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Мэс засал:</strong> {selectedExam.surgery}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Шалтгаан:</strong> {selectedExam.reason}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Өвчний хоног:</strong> {selectedExam.sickDays}
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Хаах</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Card>
  );
};

export default ExaminationList;