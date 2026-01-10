// /mis-cursos/:slug
// Usuario que ya compró el curso, pagina para realizarlo

// Ejemplos de UI:
// https://ar.pinterest.com/pin/9218374232638071/
// https://ar.pinterest.com/pin/203084264442992501/

// Curso de coursera: https://www.coursera.org/learn/protocolo-medico/lecture/z2E7o/bienvenida

// Para lo que es mux podes usar este playerSoftwareName, y para las miniaturas tene en cuenta que lo podes hacer con urls de mux tmb:
//  <MuxPlayer
//                 playbackId={playbackId}
//                 className="w-full h-full mux-custom"
//                 metadata={{
//                   video_id: playbackId,
//                   video_title: "Video promocional del curso",
//                   viewer_user_id: user.id.toString(),
//                 }}
//                 accentColor="#20ab9f"
//               />

import { getCourseBySlug } from "@/api";
import { useAuth } from "@/hooks/useAuth";
import { ICourse } from "@/types/course.types";
import MuxPlayer from "@mux/mux-player-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Star,
  Clock,
  Play,
  Pause,
  Volume2,
  Settings,
  Maximize,
} from "lucide-react";

// Mock course data
const courses = [
  {
    id: 1,
    title: "Learning strategy: how instead of what",
    description:
      "The course discusses the next shifts and future for learning content writers that actively use language.",
    thumbnail: "/learning-strategy-illustration.jpg",
    rating: 4.5,
    students: 1200,
    duration: "2h 30m",
    difficulty: "Beginner",
    language: "English",
  },
  {
    id: 2,
    title: "English for career development",
    description:
      "Are you interested in advancing your career? This course will also give you the opportunity...",
    thumbnail: "/career-development-illustration.jpg",
    rating: 4.8,
    students: 3500,
    duration: "3h 15m",
    difficulty: "Intermediate",
    language: "English",
  },
  {
    id: 3,
    title: "First steps in Chinese",
    description:
      "This course will give you a wonderful foundation in Mandarin with reading and writing...",
    thumbnail: "/chinese-language-illustration.jpg",
    rating: 4.3,
    students: 890,
    duration: "1h 45m",
    difficulty: "Beginner",
    language: "Chinese",
  },
  {
    id: 4,
    title: "English Teaching: managing the class",
    description:
      "Managing a class of students can be difficult and classroom management rules are vital...",
    thumbnail: "/classroom-teaching-illustration.jpg",
    rating: 4.6,
    students: 2100,
    duration: "2h 00m",
    difficulty: "Advanced",
    language: "English",
  },
  {
    id: 5,
    title: "Pronunciation of American English",
    description:
      "Learn how to improve your pronunciation by practicing with native speakers...",
    thumbnail: "/pronunciation-teaching-illustration.jpg",
    rating: 4.7,
    students: 1850,
    duration: "1h 30m",
    difficulty: "Intermediate",
    language: "English",
  },
  {
    id: 6,
    title: "Exam preparation: best things to do",
    description:
      "Get ready for your language exams with our comprehensive preparation course...",
    thumbnail: "/exam-preparation-illustration.jpg",
    rating: 4.4,
    students: 1500,
    duration: "2h 45m",
    difficulty: "Advanced",
    language: "English",
  },
];

const courseLessons = [
  {
    id: 1,
    title: "Intro",
    description:
      "In this lesson we will show you are going to learn in this course",
    duration: "02:25 min",
    color: "bg-orange-400",
  },
  {
    id: 2,
    title: "Video lesson",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    duration: "04:45 min",
    color: "bg-amber-300",
  },
  {
    id: 3,
    title: "Practice",
    description: "Put your knowledge into practice with exercises",
    duration: "03:30 min",
    color: "bg-teal-400",
  },
  {
    id: 4,
    title: "Quiz",
    description: "Test your understanding with a quick quiz",
    duration: "05:00 min",
    color: "bg-blue-400",
  },
];

export default function CoursePlayer() {
  const [selectedCourse, setSelectedCourse] = useState(courses[1]);
  const [activeTab, setActiveTab] = useState("all");
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Left Sidebar - Course List */}
      <div className="w-80 border-r border-border bg-card flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <h1 className="text-xl font-bold mb-4">Courses</h1>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">
                All
              </TabsTrigger>
              <TabsTrigger value="active" className="flex-1">
                Active
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex-1">
                Completed
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Language Filters */}
          <div className="flex gap-2 mb-4 flex-wrap">
            <Badge variant="secondary" className="cursor-pointer">
              🇬🇧 English
            </Badge>
            <Badge variant="outline" className="cursor-pointer">
              🇪🇸 Spanish
            </Badge>
            <Badge variant="outline" className="cursor-pointer">
              🇫🇷 French
            </Badge>
            <Badge variant="outline" className="cursor-pointer">
              🇨🇳 Chinese
            </Badge>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search courses..." className="pl-9" />
          </div>
        </div>

        {/* Course List */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-3">
            {courses.map((course) => (
              <Card
                key={course.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedCourse.id === course.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedCourse(course)}
              >
                <CardContent className="p-3">
                  <div className="flex gap-3">
                    <img
                      src={course.thumbnail || "/placeholder.svg"}
                      alt={course.title}
                      className="w-20 h-14 rounded object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm mb-1 line-clamp-2 text-balance">
                        {course.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {course.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.floor(course.rating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-muted-foreground">
                          {course.students}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {course.duration}
                        </div>
                        <Badge variant="secondary" className="text-xs h-5">
                          {course.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Right Side - Video Player and Course Details */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1">
          <div className="p-6 max-w-5xl mx-auto">
            {/* Video Player */}
            <div className="mb-6">
              <div className="relative bg-muted rounded-lg overflow-hidden aspect-video">
                <img
                  src="/woman-teacher-video-call.jpg"
                  alt="Course video"
                  className="w-full h-full object-cover"
                />
                {/* Video Controls Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end">
                  <div className="w-full p-4">
                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="h-1 bg-white/30 rounded-full overflow-hidden">
                        <div className="h-full w-1/3 bg-white rounded-full" />
                      </div>
                    </div>
                    {/* Controls */}
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-3">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-10 w-10 text-white hover:bg-white/20"
                          onClick={() => setIsPlaying(!isPlaying)}
                        >
                          {isPlaying ? (
                            <Pause className="h-5 w-5" />
                          ) : (
                            <Play className="h-5 w-5 ml-0.5" />
                          )}
                        </Button>
                        <span className="text-sm font-medium">
                          01:35 / 05:00
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-white hover:bg-white/20"
                        >
                          <Volume2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-white hover:bg-white/20"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-white hover:bg-white/20"
                        >
                          <Maximize className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Info */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(selectedCourse.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
                <span className="text-sm text-muted-foreground">
                  {selectedCourse.rating} • {selectedCourse.students} students
                </span>
              </div>

              <h1 className="text-3xl font-bold mb-3 text-balance">
                {selectedCourse.title}
              </h1>

              <p className="text-muted-foreground mb-6 leading-relaxed text-pretty">
                In this course you will learn about the job interview process in
                the United States, while comparing and contrasting the same
                process in your home country. This course will also give you the
                opportunity to explore your global career path, while building
                your vocabulary and improving your language skills to achieve
                your professional goals.
              </p>

              {/* Instructor */}
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/teacher-avatar.png" />
                  <AvatarFallback>CM</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">Cathy Mc. Gregor</p>
                  <p className="text-sm text-muted-foreground">
                    Hi Authorized English Teacher
                  </p>
                </div>
              </div>
            </div>

            {/* Course Content */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Course's content</h2>
                <span className="text-sm text-muted-foreground">
                  12 lectures • 2 hours
                </span>
              </div>

              <div className="space-y-3">
                {courseLessons.map((lesson) => (
                  <Card
                    key={lesson.id}
                    className="cursor-pointer hover:shadow-md transition-all"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`${lesson.color} h-20 w-28 rounded-lg flex items-center justify-center flex-shrink-0`}
                        >
                          <div className="flex gap-1">
                            <div className="w-1 h-3 bg-white/80 rounded-full" />
                            <div className="w-1 h-4 bg-white/80 rounded-full" />
                            <div className="w-1 h-5 bg-white rounded-full" />
                            <div className="w-1 h-4 bg-white/80 rounded-full" />
                            <div className="w-1 h-3 bg-white/80 rounded-full" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{lesson.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {lesson.description}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {lesson.duration}
                          </div>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="flex-shrink-0"
                        >
                          <Play className="h-5 w-5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
