import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PerformanceChart } from "@/components/dashboard/performance-chart"
import { AttendanceChart } from "@/components/dashboard/attendance-chart"
import { GradeDistributionChart } from "@/components/dashboard/grade-distribution-chart"
import { StudyTimeChart } from "@/components/dashboard/study-time-chart"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Performance Analytics</h2>
        <p className="text-muted-foreground">Analyze your academic performance with detailed insights</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="grades">Grades</TabsTrigger>
          <TabsTrigger value="study-time">Study Time</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Your academic performance over the semester</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <PerformanceChart />
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Attendance Overview</CardTitle>
                <CardDescription>Your attendance patterns across courses</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <AttendanceChart />
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
                <CardDescription>Distribution of your grades across courses</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <GradeDistributionChart />
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Study Time Analysis</CardTitle>
                <CardDescription>Your study time patterns and productivity</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <StudyTimeChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Patterns</CardTitle>
              <CardDescription>Detailed analysis of your attendance across courses</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <AttendanceChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grades" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Grade Analysis</CardTitle>
              <CardDescription>Detailed analysis of your grades across courses</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <GradeDistributionChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="study-time" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Study Time Patterns</CardTitle>
              <CardDescription>Detailed analysis of your study time and productivity</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <StudyTimeChart />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Performance Insights</CardTitle>
            <CardDescription>AI-generated insights based on your performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg border p-3">
                <h4 className="font-medium">Attendance Impact</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Your attendance has a strong correlation with your grades. Courses with 90%+ attendance show 15%
                  higher grades on average.
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <h4 className="font-medium">Study Pattern</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  You perform best when studying in 2-hour blocks with short breaks. Consider using the Pomodoro
                  technique for optimal results.
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <h4 className="font-medium">Quiz Performance</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Your quiz scores have improved by 12% over the last month, indicating better understanding of course
                  materials.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Improvement Areas</CardTitle>
            <CardDescription>Suggested areas for improvement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg border p-3">
                <h4 className="font-medium">Data Structures & Algorithms</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Focus on graph algorithms and dynamic programming concepts to improve your understanding.
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <h4 className="font-medium">Study Consistency</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Your study pattern shows gaps on weekends. Consider allocating at least 2 hours on Saturdays for
                  review.
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <h4 className="font-medium">Quiz Preparation</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Take more practice quizzes before actual assessments to improve your test-taking skills.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
            <CardDescription>Personalized recommendations for better performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg border p-3">
                <h4 className="font-medium">Study Resources</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Based on your learning style, we recommend visual learning resources for Database Systems.
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <h4 className="font-medium">Study Group</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Consider joining the AI study group that meets on Wednesdays at 4 PM to enhance collaborative
                  learning.
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <h4 className="font-medium">Time Management</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Try the 5-3-2 technique: 5 hours for classes, 3 hours for assignments, and 2 hours for review daily.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
