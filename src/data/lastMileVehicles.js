export const pickupStops = [
  "University Main Gate",
  "Library",
  "Hostel",
  "South Gate",
  "Sports Complex",
  "Main Campus Exit",
];

export const destinations = [
  "Girls Hostel",
  "Railway Station",
  "City Bus Stand",
  "Central Market",
  "Medical Centre",
];

export const lastMileVehicles = [
  { id: 1, type: "E-Rickshaw", driver: "Rahul Kumar", vehicleNumber: "PB10ER4104", pickup: "University Main Gate", destination: "Girls Hostel", fare: 30, waitingTime: 5, seats: 2, status: "Available" },
  { id: 2, type: "Auto", driver: "Amit Kumar", vehicleNumber: "PB10AU2081", pickup: "University Main Gate", destination: "Girls Hostel", fare: 50, waitingTime: 3, seats: 3, status: "Available" },
  { id: 3, type: "E-Rickshaw", driver: "Gurpreet Singh", vehicleNumber: "PB10ER7712", pickup: "University Main Gate", destination: "Girls Hostel", fare: 25, waitingTime: 9, seats: 1, status: "Available" },
  { id: 4, type: "Auto", driver: "Harjinder Singh", vehicleNumber: "PB10AU5530", pickup: "University Main Gate", destination: "Girls Hostel", fare: 45, waitingTime: 12, seats: 0, status: "Not Available" },

  { id: 5, type: "Auto", driver: "Sandeep Sharma", vehicleNumber: "PB10AU1196", pickup: "University Main Gate", destination: "Railway Station", fare: 120, waitingTime: 4, seats: 3, status: "Available" },
  { id: 6, type: "E-Rickshaw", driver: "Manjeet Singh", vehicleNumber: "PB10ER3358", pickup: "University Main Gate", destination: "Railway Station", fare: 80, waitingTime: 8, seats: 3, status: "Available" },
  { id: 7, type: "Auto", driver: "Baljit Singh", vehicleNumber: "PB10AU6647", pickup: "University Main Gate", destination: "Railway Station", fare: 110, waitingTime: 15, seats: 0, status: "Not Available" },

  { id: 8, type: "E-Rickshaw", driver: "Pawan Verma", vehicleNumber: "PB10ER2209", pickup: "University Main Gate", destination: "City Bus Stand", fare: 60, waitingTime: 6, seats: 2, status: "Available" },
  { id: 9, type: "Auto", driver: "Kuldeep Yadav", vehicleNumber: "PB10AU8841", pickup: "University Main Gate", destination: "City Bus Stand", fare: 90, waitingTime: 2, seats: 3, status: "Available" },

  { id: 10, type: "E-Rickshaw", driver: "Rajesh Kumar", vehicleNumber: "PB10ER9015", pickup: "University Main Gate", destination: "Central Market", fare: 40, waitingTime: 7, seats: 4, status: "Available" },
  { id: 11, type: "Auto", driver: "Mohan Lal", vehicleNumber: "PB10AU3302", pickup: "University Main Gate", destination: "Central Market", fare: 70, waitingTime: 5, seats: 2, status: "Available" },

  { id: 12, type: "E-Rickshaw", driver: "Deepak Gill", vehicleNumber: "PB10ER1467", pickup: "University Main Gate", destination: "Medical Centre", fare: 35, waitingTime: 4, seats: 2, status: "Available" },
  { id: 13, type: "Auto", driver: "Surinder Pal", vehicleNumber: "PB10AU7725", pickup: "University Main Gate", destination: "Medical Centre", fare: 55, waitingTime: 10, seats: 0, status: "Not Available" },

  { id: 14, type: "E-Rickshaw", driver: "Naveen Kumar", vehicleNumber: "PB10ER5581", pickup: "Library", destination: "Girls Hostel", fare: 20, waitingTime: 3, seats: 3, status: "Available" },
  { id: 15, type: "E-Rickshaw", driver: "Ajay Thakur", vehicleNumber: "PB10ER6093", pickup: "Library", destination: "Railway Station", fare: 90, waitingTime: 6, seats: 2, status: "Available" },
  { id: 16, type: "Auto", driver: "Ravinder Singh", vehicleNumber: "PB10AU4418", pickup: "Library", destination: "Railway Station", fare: 130, waitingTime: 9, seats: 3, status: "Available" },
  { id: 17, type: "E-Rickshaw", driver: "Vikram Chauhan", vehicleNumber: "PB10ER8836", pickup: "Library", destination: "Medical Centre", fare: 30, waitingTime: 5, seats: 1, status: "Available" },

  { id: 18, type: "Auto", driver: "Tarsem Lal", vehicleNumber: "PB10AU9260", pickup: "Hostel", destination: "Railway Station", fare: 125, waitingTime: 7, seats: 2, status: "Available" },
  { id: 19, type: "E-Rickshaw", driver: "Jaspal Singh", vehicleNumber: "PB10ER2774", pickup: "Hostel", destination: "Railway Station", fare: 85, waitingTime: 11, seats: 0, status: "Not Available" },
  { id: 20, type: "E-Rickshaw", driver: "Anil Kumar", vehicleNumber: "PB10ER4630", pickup: "Hostel", destination: "City Bus Stand", fare: 55, waitingTime: 4, seats: 3, status: "Available" },
  { id: 21, type: "Auto", driver: "Dinesh Kumar", vehicleNumber: "PB10AU1085", pickup: "Hostel", destination: "Central Market", fare: 65, waitingTime: 6, seats: 3, status: "Available" },

  { id: 22, type: "Auto", driver: "Lakhwinder Singh", vehicleNumber: "PB10AU3917", pickup: "South Gate", destination: "Railway Station", fare: 100, waitingTime: 3, seats: 3, status: "Available" },
  { id: 23, type: "E-Rickshaw", driver: "Sukhdev Singh", vehicleNumber: "PB10ER7059", pickup: "South Gate", destination: "Railway Station", fare: 70, waitingTime: 7, seats: 2, status: "Available" },
  { id: 24, type: "E-Rickshaw", driver: "Mukesh Kumar", vehicleNumber: "PB10ER3821", pickup: "South Gate", destination: "City Bus Stand", fare: 45, waitingTime: 5, seats: 4, status: "Available" },
  { id: 25, type: "Auto", driver: "Parminder Singh", vehicleNumber: "PB10AU6204", pickup: "South Gate", destination: "City Bus Stand", fare: 75, waitingTime: 8, seats: 0, status: "Not Available" },
  { id: 26, type: "E-Rickshaw", driver: "Rohit Sharma", vehicleNumber: "PB10ER9478", pickup: "South Gate", destination: "Central Market", fare: 35, waitingTime: 4, seats: 2, status: "Available" },

  { id: 27, type: "E-Rickshaw", driver: "Gagan Deep", vehicleNumber: "PB10ER1932", pickup: "Sports Complex", destination: "Girls Hostel", fare: 25, waitingTime: 6, seats: 2, status: "Available" },
  { id: 28, type: "Auto", driver: "Balwinder Singh", vehicleNumber: "PB10AU5046", pickup: "Sports Complex", destination: "Railway Station", fare: 115, waitingTime: 5, seats: 3, status: "Available" },

  { id: 29, type: "E-Rickshaw", driver: "Satnam Singh", vehicleNumber: "PB10ER6715", pickup: "Main Campus Exit", destination: "City Bus Stand", fare: 50, waitingTime: 4, seats: 3, status: "Available" },
  { id: 30, type: "Auto", driver: "Ramesh Kumar", vehicleNumber: "PB10AU2593", pickup: "Main Campus Exit", destination: "City Bus Stand", fare: 80, waitingTime: 2, seats: 3, status: "Available" },
  { id: 31, type: "Auto", driver: "Charanjit Singh", vehicleNumber: "PB10AU8362", pickup: "Main Campus Exit", destination: "Railway Station", fare: 105, waitingTime: 9, seats: 2, status: "Available" },

  { id: 32, type: "E-Rickshaw", driver: "Hardeep Singh", vehicleNumber: "PB10ER4421", pickup: "Library", destination: "City Bus Stand", fare: 50, waitingTime: 6, seats: 3, status: "Available" },
  { id: 33, type: "Auto", driver: "Yogesh Kumar", vehicleNumber: "PB10AU7316", pickup: "Library", destination: "Central Market", fare: 65, waitingTime: 4, seats: 2, status: "Available" },
  { id: 34, type: "E-Rickshaw", driver: "Prem Chand", vehicleNumber: "PB10ER8109", pickup: "Hostel", destination: "Girls Hostel", fare: 20, waitingTime: 3, seats: 2, status: "Available" },
  { id: 35, type: "E-Rickshaw", driver: "Bhupinder Singh", vehicleNumber: "PB10ER5267", pickup: "Hostel", destination: "Medical Centre", fare: 30, waitingTime: 8, seats: 0, status: "Not Available" },
  { id: 36, type: "E-Rickshaw", driver: "Karan Mehta", vehicleNumber: "PB10ER3045", pickup: "South Gate", destination: "Girls Hostel", fare: 25, waitingTime: 5, seats: 3, status: "Available" },
  { id: 37, type: "Auto", driver: "Inderjit Singh", vehicleNumber: "PB10AU9981", pickup: "South Gate", destination: "Medical Centre", fare: 50, waitingTime: 7, seats: 3, status: "Available" },
  { id: 38, type: "E-Rickshaw", driver: "Vishal Rana", vehicleNumber: "PB10ER6638", pickup: "Sports Complex", destination: "City Bus Stand", fare: 55, waitingTime: 6, seats: 2, status: "Available" },
  { id: 39, type: "Auto", driver: "Narinder Singh", vehicleNumber: "PB10AU4072", pickup: "Sports Complex", destination: "Central Market", fare: 75, waitingTime: 9, seats: 3, status: "Available" },
  { id: 40, type: "E-Rickshaw", driver: "Sunil Dutt", vehicleNumber: "PB10ER2850", pickup: "Sports Complex", destination: "Medical Centre", fare: 30, waitingTime: 4, seats: 1, status: "Available" },
  { id: 41, type: "E-Rickshaw", driver: "Jagdish Rai", vehicleNumber: "PB10ER9304", pickup: "Main Campus Exit", destination: "Girls Hostel", fare: 35, waitingTime: 5, seats: 2, status: "Available" },
  { id: 42, type: "Auto", driver: "Pritpal Singh", vehicleNumber: "PB10AU1659", pickup: "Main Campus Exit", destination: "Central Market", fare: 70, waitingTime: 3, seats: 3, status: "Available" },
  { id: 43, type: "E-Rickshaw", driver: "Arvind Kumar", vehicleNumber: "PB10ER7421", pickup: "Main Campus Exit", destination: "Medical Centre", fare: 40, waitingTime: 6, seats: 2, status: "Available" },
];
