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
  {roll:"1",name:"Abbas Tariq",gender:"girl",talent:"English",tagline:"The English champion of Class 9.",skills:[["English",100]],behaviour:[98,96,95,97],note:"Add one line about this student.",about:"Very good at English and the best in class at it. A skillful student with good behaviour.",bnote:"Good behaviour in class.",improve:["Add one thing this student needs to improve.","Add another point."]},
  {roll:"2",name:"Usaid Khattak",gender:"boy",talent:"Maths",tagline:"Maths brain. Seat grabber.",skills:[["Maths",98]],behaviour:[96,94,92,95],note:"Add one line about this student.",about:"Good at maths through his own study. Known for grabbing two students' seats.",bnote:"Behaves well in class.",improve:["Add one thing this student needs to improve.","Add another point."]},
  {roll:"3",name:"Hadi",gender:"boy",talent:"Urdu",tagline:"Silent mode: ON. Urdu expert.",skills:[["Urdu",96]],behaviour:[90,88,86,92],note:"Add one line about this student.",about:"Good at Urdu. Silent and not interested in studies, but has good behaviour. An average student.",bnote:"Silent and well behaved.",improve:["Add one thing this student needs to improve.","Add another point."]},
  {roll:"4",name:"Alamzaib",gender:"boy",talent:"Maths",tagline:"Maths master with nice manners.",skills:[["Maths",99]],behaviour:[85,84,88,82],note:"Add one line about this student.",about:"Good at maths. A good student with nice behaviour.",bnote:"Nice behaviour in class.",improve:["Add one thing this student needs to improve.","Add another point."]},
  {roll:"5",name:"Amish",gender:"boy",talent:"Chemistry",tagline:"Mixing chemistry like a pro.",skills:[["Chemistry",97]],behaviour:[80,78,82,85],note:"Add one line about this student.",about:"Good at chemistry, with good behaviour.",bnote:"Good behaviour in class.",improve:["Add one thing this student needs to improve.","Add another point."]},
  {roll:"6",name:"Ilhan",gender:"boy",talent:"All subjects",tagline:"Knows every subject. Still talks no sense.",skills:[["All subjects",92]],behaviour:[68,65,72,70],note:"Add one line about this student.",about:"Studies every subject and is good at all of them, but his behaviour is bad and he talks no sense.",bnote:"Behaviour needs work.",improve:["Add one thing this student needs to improve.","Add another point."]},
  {roll:"7",name:"Moiz",gender:"boy",talent:"Computer",tagline:"Computer mode: always on.",skills:[["Computer",95]],behaviour:[40,35,45,38],note:"Add one line about this student.",about:"Good at computers, but not interested in studies.",bnote:"Bad boy of the class. Behaviour needs a lot of work.",improve:["Add one thing this student needs to improve.","Add another point."]},
  {roll:"8",name:"Shabbi",gender:"boy",talent:"Sports",tagline:"Always smiling, never doing homework. Somehow the teacher still loves him.",skills:[["Sports",96],["Smile",100],["Homework",8]],behaviour:[94,91,90,93],note:"Smiles through every lecture.",about:"Best at sports and even better at looking innocent. Homework is a myth he has heard of once.",bnote:"Teachers still like him. Nobody knows why.",improve:["Open the homework diary.","Stop winning arguments with a smile."]},
  {roll:"9",name:"Ali",gender:"boy",talent:"Sleeping",tagline:"Professional back-bencher. Eyes open, brain offline.",skills:[["Sleeping",99],["Back bench",97],["Brain online",12]],behaviour:[80,76,75,81],note:"Present in body. Maybe.",about:"Sits at the back with his eyes open and his brain on airplane mode. Sleeping is the one subject he never fails.",bnote:"Quiet enough to look well behaved. Mostly because he is asleep.",improve:["Move one row forward.","Blink on purpose sometimes."]},
  {roll:"10",name:"Saif",gender:"boy",talent:"Jokes",tagline:"Laughs first, understands later. The class comedian.",skills:[["Jokes",95],["Laughing first",100],["Understanding later",22]],behaviour:[88,86,85,89],note:"The punchline arrives before the lesson.",about:"The class comedian. He laughs first and figures out the question in the next period.",bnote:"Keeps the room awake. The teacher is less amused.",improve:["Let someone else laugh first.","Read the question before the joke."]},
  {roll:"11",name:"Fawad",gender:"boy",talent:"General knowledge",tagline:"The walking Google. Ask him anything, get an answer (not always correct).",skills:[["General knowledge",91],["Confidence",94],["Correct answers",47]],behaviour:[84,82,81,85],note:"Has an answer ready. Accuracy sold separately.",about:"The walking Google of Class 9. Ask him anything and you will get an answer. It is not always the right one.",bnote:"Speaks up a lot. Sometimes that is the problem.",improve:["Check the fact after saying it.","Leave a little mystery sometimes."]},
  {roll:"12",name:"Server",gender:"boy",talent:"Patience",tagline:"Server down. Brain loading... please wait.",skills:[["Loading speed",5],["Patience",100],["Error 404 brain not found",90]],behaviour:[65,60,62,65],note:"Please wait. Response pending.",about:"Server down. Brain loading. Please wait. He will get there, just not this period.",bnote:"Very patient. Also very offline.",improve:["Hit refresh.","Try turning the brain off and on again."]}
];

export function ratingOf(a: number): string {
  return a >= 90 ? "Excellent" : a >= 80 ? "Very good" : "Needs improvement";
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
