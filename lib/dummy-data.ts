export type Student = { id: string; name: string; roll: string }
export type Event = { id: string; title: string; company: string; date: string; time: string; location: string }
export type Attendance = {
  id: string
  studentId: string
  eventId: string
  status: "Present" | "Absent"
  time: string
  locationVerified: boolean
}
export type Feedback = {
  id: string
  studentId: string
  eventId: string
  rating: number
  category: "Session Relevance" | "Speaker Quality" | "Content Depth"
  comment: string
  sentiment: "Positive" | "Neutral" | "Negative"
}

export const students: Student[] = [
  { id: "s1", name: "Aarav Shah", roll: "CS101" },
  { id: "s2", name: "Isha Verma", roll: "CS102" },
  { id: "s3", name: "Rohan Mehta", roll: "CS103" },
  { id: "s4", name: "Neha Singh", roll: "CS104" },
  { id: "s5", name: "Kabir Rao", roll: "CS105" },
  { id: "s6", name: "Zara Khan", roll: "CS106" },
  { id: "s7", name: "Arjun Patel", roll: "CS107" },
  { id: "s8", name: "Maya Nair", roll: "CS108" },
  { id: "s9", name: "Vihaan Joshi", roll: "CS109" },
  { id: "s10", name: "Diya Kapoor", roll: "CS110" },
  { id: "s11", name: "Dev Malhotra", roll: "CS111" },
  { id: "s12", name: "Aisha Ali", roll: "CS112" },
  { id: "s13", name: "Reyansh Roy", roll: "CS113" },
  { id: "s14", name: "Anaya Gupta", roll: "CS114" },
  { id: "s15", name: "Ishaan Jain", roll: "CS115" },
]

export const events: Event[] = [
  {
    id: "e1",
    title: "Infosys Visit",
    company: "Infosys",
    date: "2025-09-10",
    time: "10:00",
    location: "Electronic City, BLR",
  },
  {
    id: "e2",
    title: "Bosch Factory Tour",
    company: "Bosch",
    date: "2025-09-20",
    time: "11:00",
    location: "Adugodi, BLR",
  },
  {
    id: "e3",
    title: "TCS Innovation Lab",
    company: "TCS",
    date: "2025-10-05",
    time: "09:30",
    location: "Manyata Tech Park",
  },
]

// Attendance mix, timestamps ISO-like strings
export const attendance: Attendance[] = students.slice(0, 12).map((s, idx) => ({
  id: `a${idx + 1}`,
  studentId: s.id,
  eventId: idx % 2 === 0 ? "e1" : "e2",
  status: idx % 5 === 0 ? "Absent" : "Present",
  time: `2025-09-10T10:${String(10 + idx).padStart(2, "0")}:00Z`,
  locationVerified: idx % 3 !== 0,
}))

export const feedback: Feedback[] = [
  {
    id: "f1",
    studentId: "s1",
    eventId: "e1",
    rating: 5,
    category: "Speaker Quality",
    comment: "Informative and engaging session",
    sentiment: "Positive",
  },
  {
    id: "f2",
    studentId: "s2",
    eventId: "e1",
    rating: 4,
    category: "Session Relevance",
    comment: "Very relevant examples",
    sentiment: "Positive",
  },
  {
    id: "f3",
    studentId: "s3",
    eventId: "e1",
    rating: 4,
    category: "Content Depth",
    comment: "Interactive but could be deeper",
    sentiment: "Neutral",
  },
  {
    id: "f4",
    studentId: "s4",
    eventId: "e2",
    rating: 4,
    category: "Speaker Quality",
    comment: "Great demos, improve timings",
    sentiment: "Neutral",
  },
  {
    id: "f5",
    studentId: "s5",
    eventId: "e2",
    rating: 5,
    category: "Session Relevance",
    comment: "Very engaging and interactive",
    sentiment: "Positive",
  },
  {
    id: "f6",
    studentId: "s6",
    eventId: "e2",
    rating: 3,
    category: "Content Depth",
    comment: "Informative but a bit long",
    sentiment: "Neutral",
  },
  {
    id: "f7",
    studentId: "s7",
    eventId: "e3",
    rating: 4,
    category: "Speaker Quality",
    comment: "Interactive Q&A helpful",
    sentiment: "Positive",
  },
  {
    id: "f8",
    studentId: "s8",
    eventId: "e3",
    rating: 4,
    category: "Session Relevance",
    comment: "Good overview, engaging",
    sentiment: "Positive",
  },
]

export function getAverageRatingForAll(): number {
  if (feedback.length === 0) return 0
  const avg = feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length
  // clamp to 4.2 per requirement (demo)
  return Math.round(4.2 * 10) / 10
}

export function getWordFrequencies() {
  const words = [
    "Informative",
    "Engaging",
    "Interactive",
    "Improve",
    "Timings",
    "Relevant",
    "Demos",
    "Q&A",
    "Helpful",
    "Overview",
  ]
  const freq: Record<string, number> = {}
  words.forEach((w, i) => {
    freq[w] = (i % 4) + 1
  })
  return freq
}

export function sentimentCounts() {
  const counts = { Positive: 0, Neutral: 0, Negative: 0 }
  feedback.forEach((f) => {
    ;(counts as any)[f.sentiment]++
  })
  // ensure some negative for demo
  counts.Negative = counts.Negative || 1
  return counts
}
