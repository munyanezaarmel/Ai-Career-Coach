import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  CircularProgress,
} from "@mui/material";
import AppButton from "../Button/AppButton";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
interface CoursePageProps {
  courseTitle: string;
}

interface StepType {
  title: string;
  description: string;
  content: string;
}

const CoursePage: React.FC<CoursePageProps> = ({ courseTitle }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [chatMessages, setChatMessages] = useState<
    { role: string; content: string }[]
  >([]);
  const [userInput, setUserInput] = useState("");
  const [steps, setSteps] = useState<StepType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isChatting, setIsChatting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchCourseContent = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/course/content`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ title: courseTitle }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch course content");
      }
      const data = await response.json();
      console.log("Received data:", data); // Log the received data
      if (Array.isArray(data)) {
        setSteps(data);
      } else {
        console.error("Unexpected API response structure:", data);
        setSteps([]);
      }
    } catch (error) {
      console.error("Error fetching course content:", error);
      setError(
        "An error occurred while fetching the course content. Please try again."
      );
      setSteps([]);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchCourseContent();
  }, [courseTitle]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleSendMessage = async () => {
    if (userInput.trim() === "") return;

    const newMessages = [...chatMessages, { role: "user", content: userInput }];
    setChatMessages(newMessages);

    try {
      setIsChatting(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/course/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ message: userInput, courseTitle }),
        }
      );
      const data = await response.text();
      if (!response.ok) {
        setChatMessages([
          ...newMessages,
          { role: "ai", content: "Please try again in 2M" },
        ]);
      } else {
        setChatMessages([...newMessages, { role: "ai", content: data }]);
      }
      setIsChatting(false);
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setUserInput("");
  };

  const handleRegenerateCourse = () => {
    setIsLoading(true);
    setError(null);
    fetchCourseContent();
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
          Generating your personalized course...
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          This may take a moment as we curate the best content for you.
          <br />
          Thank you for your patience!
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h5" color="error" gutterBottom>
          Oops! Something went wrong.
        </Typography>
        <Typography variant="body1" paragraph>
          {error}
        </Typography>
        <AppButton
          variant="contained"
          onClick={handleRegenerateCourse}
          sx={{ mt: 2 }}
        >
          Regenerate Course
        </AppButton>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {courseTitle}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Course Content
            </Typography>
            {steps.length > 0 ? (
              <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => (
                  <Step key={step.title}>
                    <StepLabel>{step.title}</StepLabel>
                    <StepContent>
                      <Typography>{step.description}</Typography>
                      <Box sx={{ mb: 2 }}>
                        <AppButton
                          variant="contained"
                          onClick={handleNext}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          {index === steps.length - 1 ? "Finish" : "Continue"}
                        </AppButton>
                        {index > 0 && (
                          <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                            Back
                          </Button>
                        )}
                      </Box>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            ) : (
              <Typography>No course content available.</Typography>
            )}
            {activeStep === steps.length && steps.length > 0 && (
              <Paper square elevation={0} sx={{ p: 3 }}>
                <Typography>All steps completed - you're finished</Typography>
                <AppButton onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                  Reset
                </AppButton>
              </Paper>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Course Content (Markdown)
            </Typography>
            {activeStep < steps.length && (
              <ReactMarkdown
                rehypePlugins={[rehypeRaw]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {steps[activeStep].content}
              </ReactMarkdown>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              mb: 2,
              height: "400px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" gutterBottom>
              AI Assistant
            </Typography>
            <Box sx={{ flexGrow: 1, overflowY: "auto", mb: 2 }}>
              {chatMessages.map((message, index) => (
                <Box
                  key={index}
                  sx={{
                    mb: 1,
                    textAlign: message.role === "user" ? "right" : "left",
                  }}
                >
                  <Paper
                    sx={{
                      p: 1,
                      display: "inline-block",
                      bgcolor:
                        message.role === "user"
                          ? "primary.light"
                          : "background.paper",
                    }}
                  >
                    <Typography variant="body2">{message.content}</Typography>
                  </Paper>
                </Box>
              ))}
            </Box>
            <Box sx={{ display: "flex" }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Ask a question..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <AppButton
                variant="contained"
                onClick={handleSendMessage}
                isLoading={isChatting}
                sx={{ ml: 1 }}
              >
                Send
              </AppButton>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CoursePage;
