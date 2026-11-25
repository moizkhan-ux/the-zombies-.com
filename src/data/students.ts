// ===== EDIT YOUR CLASS HERE: one block per student =====
// roll: roll number | name | talent: what they are perfect at
// skills: [["Skill name", percent], ...]
// behaviour: [Respect, Discipline, Punctuality, Teamwork] each 0 to 100
// note: one line on the card | about: longer description
// bnote: note about their behaviour | improve: list of things to work on
// Overall score, rating and rank are worked out automatically.

export type Skill = [string, number];

export interface StudentInput {
  roll: string;
  name: string;
  gender: "girl" | "boy";
  talent: string;
  tagline: string;
  skills: Skill[];
  behaviour: [number, number, number, number];
  note: string;
  about: string;
  bnote: string;
  improve: string[];
}

export interface Student extends StudentInput {
  overall: number;
  rating: string;
  rank: number;
}

export const TRAITS = ["Respect", "Discipline", "Punctuality", "Teamwork"] as const;

const RAW: StudentInput[] = [
  {roll:"1",name:"Eshmil",gender:"girl",talent:"English",tagline:"The English champion of Class 9.",skills:[["English",100]],behaviour:[98,96,95,97],note:"Add one line about this student.",about:"Very good at English and the best in class at it. A skillful student with good behaviour.",bnote:"Good behaviour in class.",improve:["Add one thing this student needs to improve.","Add another point."]},
  {roll:"2",name:"Usaid Khattak",gender:"boy",talent:"Maths",tagline:"Maths brain. Seat grabber.",skills:[["Maths",98]],behaviour:[96,94,92,95],note:"Add one line about this student.",about:"Good at maths through his own study. Known for grabbing two students' seats.",bnote:"Behaves well in class.",improve:["Add one thing this student needs to improve.","Add another point."]},
  {roll:"3",name:"Hadi",gender:"boy",talent:"Urdu",tagline:"Silent mode: ON. Urdu expert.",skills:[["Urdu",96]],behaviour:[90,88,86,92],note:"Add one line about this student.",about:"Good at Urdu. Silent and not interested in studies, but has good behaviour. An average student.",bnote:"Silent and well behaved.",improve:["Add one thing this student needs to improve.","Add another point."]},
  {roll:"4",name:"Alamzaib",gender:"boy",talent:"Maths",tagline:"Maths master with nice manners.",skills:[["Maths",99]],behaviour:[85,84,88,82],note:"Add one line about this student.",about:"Good at maths. A good student with nice behaviour.",bnote:"Nice behaviour in class.",improve:["Add one thing this student needs to improve.","Add another point."]},
  {roll:"5",name:"Amish",gender:"boy",talent:"Chemistry",tagline:"Mixing chemistry like a pro.",skills:[["Chemistry",97]],behaviour:[80,78,82,85],note:"Add one line about this student.",about:"Good at chemistry, with good behaviour.",bnote:"Good behaviour in class.",improve:["Add one thing this student needs to improve.","Add another point."]},
  {roll:"6",name:"Ilhan",gender:"boy",talent:"All subjects",tagline:"Knows every subject. Still talks no sense.",skills:[["All subjects",92]],behaviour:[68,65,72,70],note:"Add one line about this student.",about:"Studies every subject and is good at all of them, but his behaviour is bad and he talks no sense.",bnote:"Behaviour needs work.",improve:["Add one thing this student needs to improve.","Add another point."]},
  {roll:"7",name:"Moiz",gender:"boy",talent:"Computer",tagline:"Computer mode: always on.",skills:[["Computer",95]],behaviour:[40,35,45,38],note:"Add one line about this student.",about:"Good at computers, but not interested in studies.",bnote:"Bad boy of the class. Behaviour needs a lot of work.",improve:["Add one thing this student needs to improve.","Add another point."]}
];

export function ratingOf(a: number): string {
  return a >= 90 ? "Excellent" : a >= 80 ? "Very good" : a >= 70 ? "Good" : "Needs improvement";
}

// Students in the original order (cards), with overall + rating filled in.
export const students: Student[] = RAW.map((s) => {
  const overall = Math.round(s.behaviour.reduce((t, v) => t + v, 0) / s.behaviour.length);
  return { ...s, overall, rating: ratingOf(overall), rank: 0 };
});

// Ranked by overall behaviour score; rank numbers are written back onto each student.
export const ranked: Student[] = [...students].sort((a, b) => b.overall - a.overall);
ranked.forEach((s, i) => (s.rank = i + 1));

export const classAverage = Math.round(students.reduce((t, s) => t + s.overall, 0) / students.length);
