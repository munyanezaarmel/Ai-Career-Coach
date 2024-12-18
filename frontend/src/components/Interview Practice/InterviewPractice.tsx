import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Tab,
  Tabs,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import VideocamIcon from "@mui/icons-material/Videocam";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import AppButton from "../Button/AppButton";
import { toast } from "react-toastify";

interface Question {
  text: string;
  difficulty: "easy" | "medium" | "hard";
}

interface Feedback {
  overallAssessment: string;
  confidenceScore: number;
  suggestions: string[];
  keyStrengths: string[];
  areasForImprovement: string[];
}

interface InterviewResult {
  overallAssessment: string;
  confidenceScore: number;
  suggestions: string[];
  keyStrengths: string[];
  areasForImprovement: string[];
}

type InterviewMode = "text" | "voice" | "video";

const InterviewPractice: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [interviewHistory, setInterviewHistory] = useState<InterviewResult[]>(
    []
  );
  const [mode, setMode] = useState<InterviewMode>("text");
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [transcribedText, setTranscribedText] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/course/interview/question`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      setQuestions(data);
      setCurrentQuestion(data[0]);
      setCurrentQuestionIndex(0);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
    setIsLoading(false);
  };

  const goToNextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentQuestion(questions[nextIndex]);
      setCurrentQuestionIndex(nextIndex);
      // Reset user answer and feedback
      setUserAnswer("");
      setFeedback(null);
      // Reset audio/video related states
      setAudioUrl(null);
      setTranscribedText("");
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    } else {
      // All questions have been answered
      toast.info("You've completed all questions!");
    }
  };

  const submitAnswer = async () => {
    setIsSubmitting(true);
    try {
      const answer = {
        answer: userAnswer,
        mode: mode,
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/course/interview/feedback`,
        {
          method: "POST",
          body: JSON.stringify({
            question: currentQuestion?.text,
            answer: userAnswer,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Failed to submit answer");
      }

      const data = await response.json();

      setFeedback(data);

      setInterviewHistory([...interviewHistory, data]);
      toast.success("Answer submitted successfully!");
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast.error("Failed to submit answer. Please try again.");
    }
    setIsSubmitting(false);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const startRecording = async () => {
    try {
      if (isRecording) {
        await stopRecording();
      }

      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: mode === "video",
      });

      if (mode === "video" && videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setAudioUrl(null);
      setTranscribedText("");
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error("Failed to start recording. Please try again.");
    }
  };

  const stopRecording = async () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        const formData = new FormData();
        formData.append("audio", audioBlob, "audio.wav");

        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/career/transcribe`,
            {
              method: "POST",
              body: formData,
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          const data = await response.text();
          setTranscribedText(data);
          setUserAnswer(data);
        } catch (error) {
          console.error("Error transcribing audio:", error);
          toast.error("Failed to transcribe audio. Please try again.");
        }
      };

      setIsRecording(false);
    }
  };

  const playAudio = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const renderProgressChart = () => {
    const chartData = interviewHistory.map((result, index) => ({
      name: `Interview ${index + 1}`,
      score: result.confidenceScore,
    }));

    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Interview Practice
      </Typography>
      <Tabs
        value={mode}
        onChange={(_, newValue) => setMode(newValue)}
        sx={{ mb: 2 }}
      >
        <Tab label="Text" value="text" />
        <Tab label="Voice" value="voice" />
        <Tab label="Video" value="video" />
      </Tabs>
      {isLoading ? (
        <CircularProgress />
      ) : currentQuestion ? (
        <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            {currentQuestion.text}
          </Typography>
          {mode === "text" ? (
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              sx={{ mb: 2 }}
            />
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {mode === "video" && (
                <video ref={videoRef} width="400" height="300" autoPlay muted />
              )}
              <Button
                variant="contained"
                color={isRecording ? "secondary" : "primary"}
                startIcon={
                  isRecording ? (
                    <StopIcon />
                  ) : mode === "voice" ? (
                    <MicIcon />
                  ) : (
                    <VideocamIcon />
                  )
                }
                onClick={isRecording ? stopRecording : startRecording}
                sx={{ mt: 2 }}
              >
                {isRecording ? "Stop Recording" : "Start Recording"}
              </Button>
              {audioUrl && (
                <Button
                  variant="outlined"
                  startIcon={<PlayArrowIcon />}
                  onClick={playAudio}
                  sx={{ mt: 2 }}
                >
                  Play Recording
                </Button>
              )}
              {transcribedText && (
                <Button
                  variant="contained"
                  onClick={submitAnswer}
                  disabled={
                    (!userAnswer.trim() && !isRecording) || isSubmitting
                  }
                  sx={{ mt: 2 }}
                >
                  {isSubmitting ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Submit Answer"
                  )}
                </Button>
              )}
            </Box>
          )}

          {!feedback && (
            <Button
              variant="contained"
              onClick={submitAnswer}
              disabled={(!userAnswer.trim() && !isRecording) || isSubmitting}
              sx={{ mt: 2 }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Submit Answer"
              )}
            </Button>
          )}
        </Paper>
      ) : null}
      {feedback && (
        <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Feedback
          </Typography>
          <Typography>{feedback.overallAssessment}</Typography>
          <Typography variant="subtitle1" sx={{ mt: 1 }}>
            Confidence Score: {feedback.confidenceScore?.toFixed(0)}%
          </Typography>

          {/* Add Key Strengths section */}
          <Typography variant="subtitle1" sx={{ mt: 1 }}>
            Key Strengths:
          </Typography>
          <List>
            {feedback.keyStrengths.map((strength, index) => (
              <ListItem key={index}>
                <ListItemText primary={strength} />
              </ListItem>
            ))}
          </List>

          {/* Add Areas for Improvement section */}
          <Typography variant="subtitle1" sx={{ mt: 1 }}>
            Areas for Improvement:
          </Typography>
          <List>
            {feedback.areasForImprovement.map((area, index) => (
              <ListItem key={index}>
                <ListItemText primary={area} />
              </ListItem>
            ))}
          </List>

          <Typography variant="subtitle1" sx={{ mt: 1 }}>
            Suggestions:
          </Typography>
          <List>
            {feedback.suggestions.map((suggestion, index) => (
              <ListItem key={index}>
                <ListItemText primary={suggestion} />
              </ListItem>
            ))}
          </List>

          <Button variant="contained" onClick={goToNextQuestion} sx={{ mt: 2 }}>
            Next Question
          </Button>
        </Paper>
      )}
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Your Progress
        </Typography>
        {interviewHistory.length > 0 ? (
          <>
            {renderProgressChart()}
            <Typography variant="body2" sx={{ mt: 2 }}>
              Your average score:{" "}
              {(
                interviewHistory.reduce(
                  (sum, result) => sum + result.confidenceScore,
                  0
                ) / interviewHistory.length
              ).toFixed(2)}
            </Typography>
          </>
        ) : (
          <Typography>
            Complete your first interview to see your progress!
          </Typography>
        )}
      </Paper>
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Interview History
        </Typography>
        <List>
          {interviewHistory.map((item, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`${item.suggestions}: ${item}`}
                secondary={`Score: ${item.confidenceScore.toFixed(
                  2
                )} | Feedback: ${item.overallAssessment.substring(0, 50)}...`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default InterviewPractice;
