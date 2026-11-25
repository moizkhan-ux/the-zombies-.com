// ===== EDIT YOUR TEACHERS HERE =====
// name, subject, rating out of 5, known: short line on the card,
// about: longer description, loved: list. Ranked automatically by rating.

export interface Teacher {
  name: string;
  slug: string;
  subject: string;
  rating: number;
  known: string;
  about: string;
  loved: string[];
}

export const TEACHERS: Teacher[] = [
  {name:"Umer Sir",slug:"umer-sir",subject:"Urdu",rating:4.9,known:"Explains hard topics in a simple way.",about:"Write a short description of this teacher here: how long they have taught, how they teach and what makes them special.",loved:["Add one thing students love about this teacher.","Add another point."]},
  {name:"Awais Sir",slug:"awais-sir",subject:"Maths",rating:4.8,known:"Makes every experiment fun.",about:"Write a short description of this teacher here: how long they have taught, how they teach and what makes them special.",loved:["Add one thing students love about this teacher.","Add another point."]},
  {name:"Orangzaib Sir",slug:"orangzaib-sir",subject:"English",rating:4.7,known:"Helps us speak and write with confidence.",about:"Write a short description of this teacher here: how long they have taught, how they teach and what makes them special.",loved:["Add one thing students love about this teacher.","Add another point."]},
  {name:"Pata Nhi Sir",slug:"pata-nhi-sir",subject:"Computer",rating:4.6,known:"Teaches us real coding and projects.",about:"Write a short description of this teacher here: how long they have taught, how they teach and what makes them special.",loved:["Add one thing students love about this teacher.","Add another point."]}
];

export const teachersRanked: Teacher[] = [...TEACHERS].sort((a, b) => b.rating - a.rating);
