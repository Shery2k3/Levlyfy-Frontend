"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Play } from "lucide-react";
import { QuizModal } from "@/components/quiz-modal";

export default function TrainingPage() {
  const [activeVideo, setActiveVideo] = useState(0);
  const [showQuizModal, setShowQuizModal] = useState(false);

  return (
    <div style={{ padding: 32, textAlign: "center" }}>
    </div>
  );
}
