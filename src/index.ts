// Definition of basic types
type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
type TimeSlot = "8:30-10:00" | "10:15-11:45" | "12:15-13:45" | "14:00-15:30" | "15:45-17:15";
type CourseType = "Lecture" | "Seminar" | "Lab" | "Practice";

// Creation of main structures
type Professor = {
    id: number;
    name: string;
    department: string;                                                                                                                          
};

type Classroom = {
    number: string;
    capacity: number;
    hasProjector: boolean;
};

type Course = {
    id: number;
    name: string;
    type: CourseType;
};

type Lesson = {
    courseId: number;
    professorId: number;
    classroomNumber: string;
    dayOfWeek: DayOfWeek;
    timeSlot: TimeSlot;
};

type ScheduleConflict = {
    type: "ProfessorConflict" | "ClassroomConflict";
    lessonDetails: Lesson;
};

// Data arrays
let professors: Professor[] = [];
let classrooms: Classroom[] = [];
let courses: Course[] = [];
let schedule: Lesson[] = [];

// Function to add a professor
function addProfessor(professor: Professor): void {
    professors.push(professor);
}

// Function to add a lesson to the schedule
function addLesson(lesson: Lesson): boolean {
    const conflict = validateLesson(lesson);
    if (conflict === null) {
        schedule.push(lesson);
        return true;
    }
    console.log(`Conflict: ${conflict.type} for lesson on ${lesson.dayOfWeek} at ${lesson.timeSlot}`);
    return false;
}

// Function to find available classrooms
function findAvailableClassrooms(timeSlot: TimeSlot, dayOfWeek: DayOfWeek): string[] {
    const occupiedClassrooms = schedule
        .filter(lesson => lesson.timeSlot === timeSlot && lesson.dayOfWeek === dayOfWeek)
        .map(lesson => lesson.classroomNumber);
    
    return classrooms
        .filter(classroom => !occupiedClassrooms.includes(classroom.number))
        .map(classroom => classroom.number);
}

// Function to get a professor's schedule
function getProfessorSchedule(professorId: number): Lesson[] {
    return schedule.filter(lesson => lesson.professorId === professorId);
}

// Function to check for conflicts
function validateLesson(lesson: Lesson): ScheduleConflict | null {
    const conflictingLesson = schedule.find(existingLesson => 
        existingLesson.timeSlot === lesson.timeSlot && 
        existingLesson.dayOfWeek === lesson.dayOfWeek &&
        (existingLesson.professorId === lesson.professorId || existingLesson.classroomNumber === lesson.classroomNumber)
    );
    
    if (conflictingLesson) {
        return conflictingLesson.professorId === lesson.professorId
            ? { type: "ProfessorConflict", lessonDetails: conflictingLesson }
            : { type: "ClassroomConflict", lessonDetails: conflictingLesson };
    }
    return null;
}

// Function to calculate classroom utilization
function getClassroomUtilization(classroomNumber: string): number {
    const totalSlots = 5 * 5; // Assuming 5 days a week, 5 slots per day
    const usedSlots = schedule.filter(lesson => lesson.classroomNumber === classroomNumber).length;
    return (usedSlots / totalSlots) * 100;
}

// Function to determine the most popular course type
function getMostPopularCourseType(): CourseType {
    const typeCount: { [key in CourseType]?: number } = {};
    
    schedule.forEach(lesson => {
        const course = courses.find(c => c.id === lesson.courseId);
        if (course) {
            typeCount[course.type] = (typeCount[course.type] || 0) + 1;
        }
    });

    return Object.keys(typeCount).reduce((a, b) => typeCount[a as CourseType]! > typeCount[b as CourseType]! ? a : b) as CourseType;
}

// Function to reassign a classroom
function reassignClassroom(lessonId: number, newClassroomNumber: string): boolean {
    const lesson = schedule.find(l => l.courseId === lessonId);
    if (!lesson) return false;

    const conflict = schedule.find(l => l.classroomNumber === newClassroomNumber && l.timeSlot === lesson.timeSlot && l.dayOfWeek === lesson.dayOfWeek);
    if (!conflict) {
        lesson.classroomNumber = newClassroomNumber;
        return true;
    }
    return false;
}

// Function to cancel a lesson
function cancelLesson(lessonId: number): void {
    const lessonIndex = schedule.findIndex(l => l.courseId === lessonId);
    if (lessonIndex !== -1) {
        schedule.splice(lessonIndex, 1);
    }
}

// Example usage
addProfessor({ id: 1, name: "Dr. Smith", department: "Math" });
addProfessor({ id: 2, name: "Dr. Johnson", department: "Physics" });

classrooms.push({ number: "101", capacity: 30, hasProjector: true });
classrooms.push({ number: "102", capacity: 25, hasProjector: false });

courses.push({ id: 1, name: "Calculus", type: "Lecture" });
courses.push({ id: 2, name: "Physics Lab", type: "Lab" });

addLesson({ courseId: 1, professorId: 1, classroomNumber: "101", dayOfWeek: "Monday", timeSlot: "8:30-10:00" });
addLesson({ courseId: 2, professorId: 2, classroomNumber: "102", dayOfWeek: "Monday", timeSlot: "10:15-11:45" });
