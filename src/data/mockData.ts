import {
  Student,
  Faculty,
  AuraRing,
  AttendanceSession,
  SOSAlert,
  AuditLog,
  AcademicDepartment,
  UserAccount,
  AttendanceRecord,
} from '../types';

export const DEMO_ACCOUNTS: UserAccount[] = [
  {
    id: 'user-admin',
    role: 'admin',
    name: 'Dr. Aravind Subramanian',
    email: 'admin.dean@auvexza.edu',
    designation: 'Dean of Academic Administration & Security Oversight',
  },
  {
    id: 'user-principal',
    role: 'principal',
    name: 'Dr. Meenakshi Sundaram',
    email: 'principal@apextech.edu',
    designation: 'Principal & Executive Director',
  },
  {
    id: 'user-hod-it',
    role: 'hod',
    name: 'Prof. Rajesh Kumar',
    email: 'hod.it@apextech.edu',
    department: 'Information Technology',
    designation: 'Head of Department — Information Technology',
  },
  {
    id: 'user-fac-sarah',
    role: 'faculty',
    name: 'Dr. Sarah Jenkins',
    email: 'sarah.jenkins@apextech.edu',
    department: 'Information Technology',
    designation: 'Advisor — IT 2nd Year Section A',
  },
  {
    id: 'user-sec-vikram',
    role: 'security',
    name: 'Officer Vikram Rathore',
    email: 'security.dispatch@apextech.edu',
    designation: 'Chief Campus Safety & Emergency Response Lead',
  },
  {
    id: 'user-stu-meghashri',
    role: 'student',
    name: 'Meghashri Chandrasekaran',
    email: 'meghashrichandrasekaren@gmail.com',
    department: 'Information Technology',
    designation: 'Student (2nd Year, Section A)',
    assignedStudentId: 'stu-it-2a-001',
  },
];

// Names for the 63 students of IT 2nd Year Section A
const IT_2A_NAMES = [
  'Meghashri Chandrasekaran',
  'Aditya Rao',
  'Ananya Sharma',
  'Rohan Deshmukh',
  'Pooja Iyer',
  'Mohammed Farhan',
  'Sneha Patel',
  'Vikram Reddy',
  'Priya Sundaram',
  'Karthik Narayanan',
  'Deepa Rangan',
  'Ashwin Kumar',
  'Divya Krishnan',
  'Manoj Varma',
  'Bhavana Joshi',
  'Sanjay Mehra',
  'Shreya Mukherjee',
  'Tarun Gupta',
  'Harini Balaji',
  'Rahul Verma',
  'Shalini Pillai',
  'Vivek Nair',
  'Tanvi Saxena',
  'Uday Shankar',
  'Yashaswini Rao',
  'Arvind Swaminathan',
  'Lavanya Iyer',
  'Pranav Hegde',
  'Kavya Madhavan',
  'Gautam Singhania',
  'Keerthi Suresh',
  'Sandeep Chawla',
  'Nandini Menon',
  'Siddharth Basu',
  'Meera Nambiar',
  'Rajeshwari S',
  'Chetan Anand',
  'Swati Mishra',
  'Deepak Kaushik',
  'Ritu Bansal',
  'Akhil Nair',
  'Archana Prasad',
  'Rohit Sharma',
  'Preeti Desai',
  'Varun Tej',
  'Snehal Kadam',
  'Nitin Gadkari',
  'Malavika Mohanan',
  'Suraj Venkat',
  'Ishwarya Rai',
  'Balaji Srinivasan',
  'Sowmya Ram',
  'Tejaswini Gowda',
  'Murali Vijay',
  'Nithya Ram',
  'Vignesh Shivan',
  'Pavithra Lokesh',
  // Students 58 to 63 (Unverified / Absent in initial Period 3 session)
  'Rahul Verma Jr.',
  'Shalini Pillai S.',
  'Vivek Nair V.',
  'Tanvi Saxena T.',
  'Uday Shankar M.',
  'Yashaswini Rao Y.',
];

// Guardian names for emergency contacts
const GUARDIANS = [
  { name: 'Chandrasekaran M', relation: 'Father', phone: '+91 98400 98765' },
  { name: 'Raghavan Rao', relation: 'Father', phone: '+91 98450 11234' },
  { name: 'Sunita Sharma', relation: 'Mother', phone: '+91 98452 77610' },
  { name: 'Vijay Deshmukh', relation: 'Father', phone: '+91 99800 55678' },
  { name: 'S. Iyer', relation: 'Father', phone: '+91 94481 99321' },
  { name: 'Abdul Farhan', relation: 'Father', phone: '+91 98862 33411' },
  { name: 'Ketan Patel', relation: 'Father', phone: '+91 97315 88902' },
  { name: 'Suresh Reddy', relation: 'Father', phone: '+91 98453 11223' },
  { name: 'Sundaram K', relation: 'Father', phone: '+91 94440 22334' },
  { name: 'Narayanan R', relation: 'Father', phone: '+91 98841 55667' },
];

// Generate 63 students for IT 2nd Year Section A
const GENERATED_IT_2A_STUDENTS: Student[] = IT_2A_NAMES.map((name, index) => {
  const numStr = String(index + 1).padStart(3, '0');
  const regNum = `23IT${numStr}`;
  const ringUid = `AURA-IT-2A-${numStr}`;
  const guardian = GUARDIANS[index % GUARDIANS.length];

  return {
    id: `stu-it-2a-${numStr}`,
    registerNumber: regNum,
    rollNumber: regNum,
    fullName: name,
    email: index === 0 ? 'meghashrichandrasekaren@gmail.com' : `${name.toLowerCase().replace(/[^a-z]/g, '')}.${regNum.toLowerCase()}@apextech.edu`,
    phone: `+91 9840${numStr} 123`,
    department: 'Information Technology',
    year: '2nd Year',
    section: 'Section A',
    dateOfBirth: '2005-06-15',
    gender: (index % 2 === 0 ? 'Female' : 'Male') as 'Female' | 'Male',
    status: 'Active',
    ringUid: ringUid,
    bloodGroup: index % 3 === 0 ? 'O+' : index % 3 === 1 ? 'B+' : 'A+',
    joinedDate: '2023-08-10',
    emergencyContact: {
      name: guardian.name,
      relation: guardian.relation,
      phone: guardian.phone,
    },
  };
});

// Cross-department students for Principal inspection and cross-section rejection tests
const CROSS_DEPT_STUDENTS: Student[] = [
  {
    id: 'stu-cse-3b-001',
    registerNumber: '22CS010',
    rollNumber: '22CS010',
    fullName: 'Karthik Balakrishnan',
    email: 'karthik.b.22cs@apextech.edu',
    phone: '+91 96112 55901',
    department: 'Computer Science & Eng',
    year: '3rd Year',
    section: 'Section B',
    dateOfBirth: '2004-01-19',
    gender: 'Male',
    status: 'Active',
    ringUid: 'AURA-CS-3B-001',
    bloodGroup: 'A-',
    joinedDate: '2022-08-10',
    emergencyContact: {
      name: 'B. Suresh',
      relation: 'Father',
      phone: '+91 96110 33441',
    },
  },
  {
    id: 'stu-ece-1a-001',
    registerNumber: '24EC018',
    rollNumber: '24EC018',
    fullName: 'Divya Nambiar',
    email: 'divya.n.24ec@apextech.edu',
    phone: '+91 95350 77120',
    department: 'Electronics & Comm',
    year: '1st Year',
    section: 'Section A',
    dateOfBirth: '2006-03-05',
    gender: 'Female',
    status: 'Active',
    ringUid: 'AURA-EC-1A-001',
    bloodGroup: 'O+',
    joinedDate: '2024-08-01',
    emergencyContact: {
      name: 'Narayan Nambiar',
      relation: 'Father',
      phone: '+91 95351 22900',
    },
  },
  {
    id: 'stu-mech-2a-001',
    registerNumber: '23ME005',
    rollNumber: '23ME005',
    fullName: 'Girish Kulkarni',
    email: 'girish.k.23me@apextech.edu',
    phone: '+91 97412 88201',
    department: 'Mechanical Eng',
    year: '2nd Year',
    section: 'Section A',
    dateOfBirth: '2005-09-12',
    gender: 'Male',
    status: 'Active',
    ringUid: 'AURA-ME-2A-001',
    bloodGroup: 'B+',
    joinedDate: '2023-08-12',
    emergencyContact: {
      name: 'Prakash Kulkarni',
      relation: 'Father',
      phone: '+91 97410 99881',
    },
  },
];

export const INITIAL_STUDENTS: Student[] = [
  ...GENERATED_IT_2A_STUDENTS,
  ...CROSS_DEPT_STUDENTS,
];

export const INITIAL_FACULTY: Faculty[] = [
  {
    id: 'fac-01',
    employeeId: 'FAC-IT-108',
    name: 'Dr. Sarah Jenkins',
    email: 'sarah.jenkins@apextech.edu',
    phone: '+91 98450 88200',
    department: 'Information Technology',
    designation: 'Associate Professor & Advisor — IT 2nd Year Section A',
    assignedSections: [
      { department: 'Information Technology', year: '2nd Year', section: 'Section A' },
    ],
    status: 'Active',
  },
  {
    id: 'fac-02',
    employeeId: 'FAC-IT-102',
    name: 'Prof. Rajesh Kumar',
    email: 'hod.it@apextech.edu',
    phone: '+91 98450 11999',
    department: 'Information Technology',
    designation: 'Professor & Head of Department — IT',
    assignedSections: [
      { department: 'Information Technology', year: '4th Year', section: 'Section A' },
    ],
    status: 'Active',
  },
  {
    id: 'fac-03',
    employeeId: 'FAC-CS-204',
    name: 'Dr. Arunachalam M.',
    email: 'arun.m@apextech.edu',
    phone: '+91 97410 44552',
    department: 'Computer Science & Eng',
    designation: 'Professor & Advisor — CSE 3rd Year Section B',
    assignedSections: [
      { department: 'Computer Science & Eng', year: '3rd Year', section: 'Section B' },
    ],
    status: 'Active',
  },
  {
    id: 'fac-04',
    employeeId: 'FAC-EC-311',
    name: 'Prof. Malini Venkat',
    email: 'malini.v@apextech.edu',
    phone: '+91 99801 88320',
    department: 'Electronics & Comm',
    designation: 'Assistant Professor & Advisor — ECE 1st Year Section A',
    assignedSections: [
      { department: 'Electronics & Comm', year: '1st Year', section: 'Section A' },
    ],
    status: 'Active',
  },
  {
    id: 'fac-05',
    employeeId: 'FAC-ME-402',
    name: 'Dr. Kenneth Cole',
    email: 'kenneth.cole@apextech.edu',
    phone: '+91 96112 33410',
    department: 'Mechanical Eng',
    designation: 'Associate Professor & Advisor — MECH 2nd Year Section A',
    assignedSections: [
      { department: 'Mechanical Eng', year: '2nd Year', section: 'Section A' },
    ],
    status: 'Active',
  },
];

// Generate 63 rings for IT 2nd Year Section A
const GENERATED_IT_RINGS: AuraRing[] = GENERATED_IT_2A_STUDENTS.map((st, i) => {
  const numStr = String(i + 1).padStart(3, '0');
  return {
    ringUid: st.ringUid || `AURA-IT-2A-${numStr}`,
    assignedStudentId: st.id,
    assignedStudentName: st.fullName,
    registerNumber: st.registerNumber,
    department: 'Information Technology',
    year: '2nd Year',
    section: 'Section A',
    status: 'Active',
    batteryLevel: 80 + (i % 19),
    firmwareVersion: 'v2.4.1-core',
    lastSeen: i < 57 ? '2 mins ago' : '15 mins ago',
    bleAddress: `C4:8B:2A:7E:2A:${numStr.slice(-2)}`,
    signalStrengthDbm: -50 - (i % 25),
    hardwareBatch: 'BATCH-2024-Q3',
  };
});

export const INITIAL_RINGS: AuraRing[] = [
  ...GENERATED_IT_RINGS,
  {
    ringUid: 'AURA-CS-3B-001',
    assignedStudentId: 'stu-cse-3b-001',
    assignedStudentName: 'Karthik Balakrishnan',
    registerNumber: '22CS010',
    department: 'Computer Science & Eng',
    year: '3rd Year',
    section: 'Section B',
    status: 'Active',
    batteryLevel: 92,
    firmwareVersion: 'v2.4.1-core',
    lastSeen: '5 mins ago',
    bleAddress: 'C4:8B:2A:7E:3B:01',
    signalStrengthDbm: -55,
    hardwareBatch: 'BATCH-2024-Q3',
  },
  {
    ringUid: 'AURA-EC-1A-001',
    assignedStudentId: 'stu-ece-1a-001',
    assignedStudentName: 'Divya Nambiar',
    registerNumber: '24EC018',
    department: 'Electronics & Comm',
    year: '1st Year',
    section: 'Section A',
    status: 'Active',
    batteryLevel: 88,
    firmwareVersion: 'v2.4.1-core',
    lastSeen: '10 mins ago',
    bleAddress: 'C4:8B:2A:7E:1A:01',
    signalStrengthDbm: -60,
    hardwareBatch: 'BATCH-2024-Q4',
  },
  {
    ringUid: 'AURA-ME-2A-001',
    assignedStudentId: 'stu-mech-2a-001',
    assignedStudentName: 'Girish Kulkarni',
    registerNumber: '23ME005',
    department: 'Mechanical Eng',
    year: '2nd Year',
    section: 'Section A',
    status: 'Active',
    batteryLevel: 85,
    firmwareVersion: 'v2.4.0-core',
    lastSeen: '12 mins ago',
    bleAddress: 'C4:8B:2A:7E:2M:01',
    signalStrengthDbm: -62,
    hardwareBatch: 'BATCH-2024-Q3',
  },
  {
    ringUid: 'AURA-SPARE-001',
    status: 'Unassigned',
    batteryLevel: 100,
    firmwareVersion: 'v2.4.1-core',
    lastSeen: 'Docked (Charging Bay 1)',
    bleAddress: 'C4:8B:2A:7E:99:01',
    signalStrengthDbm: -40,
    hardwareBatch: 'BATCH-2024-Q4',
  },
  {
    ringUid: 'AURA-SPARE-002',
    status: 'Unassigned',
    batteryLevel: 98,
    firmwareVersion: 'v2.4.1-core',
    lastSeen: 'Docked (Charging Bay 2)',
    bleAddress: 'C4:8B:2A:7E:99:02',
    signalStrengthDbm: -42,
    hardwareBatch: 'BATCH-2024-Q4',
  },
];

export const INITIAL_ACADEMIC_STRUCTURE: AcademicDepartment[] = [
  {
    id: 'dept-it',
    code: 'IT',
    name: 'Information Technology',
    hodName: 'Prof. Rajesh Kumar',
    totalStudents: 243,
    totalFaculty: 16,
    totalRingsAssigned: 240,
    years: [
      {
        year: '1st Year',
        sections: [
          { section: 'Section A', advisor: 'Dr. Priya S.', studentCount: 60 },
          { section: 'Section B', advisor: 'Prof. Vignesh T.', studentCount: 60 },
        ],
      },
      {
        year: '2nd Year',
        sections: [
          { section: 'Section A', advisor: 'Dr. Sarah Jenkins', studentCount: 63 },
          { section: 'Section B', advisor: 'Prof. Sandhya M.', studentCount: 60 },
        ],
      },
      {
        year: '3rd Year',
        sections: [
          { section: 'Section A', advisor: 'Dr. Harish K.', studentCount: 60 },
          { section: 'Section B', advisor: 'Prof. Divakar J.', studentCount: 60 },
        ],
      },
      {
        year: '4th Year',
        sections: [
          { section: 'Section A', advisor: 'Prof. Renuka P.', studentCount: 60 },
          { section: 'Section B', advisor: 'Prof. Rajesh Kumar', studentCount: 60 },
        ],
      },
    ],
  },
  {
    id: 'dept-cse',
    code: 'CSE',
    name: 'Computer Science & Eng',
    hodName: 'Dr. C. Ramanathan',
    totalStudents: 360,
    totalFaculty: 24,
    totalRingsAssigned: 352,
    years: [
      {
        year: '1st Year',
        sections: [
          { section: 'Section A', advisor: 'Dr. Anand Kumar', studentCount: 60 },
          { section: 'Section B', advisor: 'Prof. Lakshmi N.', studentCount: 60 },
        ],
      },
      {
        year: '2nd Year',
        sections: [
          { section: 'Section A', advisor: 'Dr. Suresh Babu', studentCount: 60 },
          { section: 'Section B', advisor: 'Prof. Geetha R.', studentCount: 60 },
        ],
      },
      {
        year: '3rd Year',
        sections: [
          { section: 'Section A', advisor: 'Dr. Arunachalam M.', studentCount: 60 },
          { section: 'Section B', advisor: 'Prof. Divakar J.', studentCount: 60 },
        ],
      },
      {
        year: '4th Year',
        sections: [
          { section: 'Section A', advisor: 'Prof. Renuka P.', studentCount: 60 },
        ],
      },
    ],
  },
  {
    id: 'dept-ece',
    code: 'ECE',
    name: 'Electronics & Comm',
    hodName: 'Dr. Vasudevan K.',
    totalStudents: 280,
    totalFaculty: 18,
    totalRingsAssigned: 275,
    years: [
      {
        year: '1st Year',
        sections: [
          { section: 'Section A', advisor: 'Prof. Malini Venkat', studentCount: 60 },
          { section: 'Section B', advisor: 'Prof. K. Swaminathan', studentCount: 60 },
        ],
      },
      {
        year: '2nd Year',
        sections: [
          { section: 'Section A', advisor: 'Dr. Rohit V.', studentCount: 60 },
        ],
      },
      {
        year: '3rd Year',
        sections: [
          { section: 'Section A', advisor: 'Prof. Lavanya S.', studentCount: 60 },
        ],
      },
    ],
  },
  {
    id: 'dept-mech',
    code: 'MECH',
    name: 'Mechanical Eng',
    hodName: 'Dr. G. Sundararaj',
    totalStudents: 220,
    totalFaculty: 14,
    totalRingsAssigned: 215,
    years: [
      {
        year: '1st Year',
        sections: [
          { section: 'Section A', advisor: 'Prof. B. Joseph', studentCount: 55 },
        ],
      },
      {
        year: '2nd Year',
        sections: [
          { section: 'Section A', advisor: 'Dr. Kenneth Cole', studentCount: 55 },
        ],
      },
    ],
  },
];

// Initial Period 3 Attendance Records for IT 2nd Year Section A
// Expected = 63. Verified = 57. Unverified / Absent = 6 (students 58 to 63)
const IT_2A_ATTENDANCE_RECORDS: AttendanceRecord[] = GENERATED_IT_2A_STUDENTS.map((st, idx) => {
  const isVerified = idx < 57; // 57 verified, 6 absent
  const ringUid = st.ringUid || `AURA-IT-2A-${String(idx + 1).padStart(3, '0')}`;
  const pseudoRssi = -38 - ((idx * 3) % 24); // e.g. -38 to -62 dBm
  const pseudoBattery = 85 + ((idx * 7) % 15); // e.g. 85% to 99%
  const pseudoLatency = 28 + ((idx * 5) % 25); // e.g. 28ms to 52ms
  const pseudoToken = `0x${((idx + 1) * 9871).toString(16).toUpperCase()}${idx % 2 === 0 ? 'F8A' : 'C3B'}9`;

  return {
    studentId: st.id,
    studentName: st.fullName,
    registerNumber: st.registerNumber,
    ringUid: ringUid,
    ringVerification: isVerified ? 'Verified' : 'Pending',
    status: isVerified ? 'Present' : 'Absent',
    markedTime: isVerified ? `11:${String((idx % 12) + 2).padStart(2, '0')}:14 AM` : undefined,
    verifiedVia: 'Ring',
    // Hardware telemetry proof
    rssiDbm: isVerified ? pseudoRssi : undefined,
    skinContactVerified: isVerified ? true : undefined,
    batteryLevel: isVerified ? pseudoBattery : undefined,
    gatewayReaderId: isVerified ? 'GATEWAY-IT-LH302' : undefined,
    cryptoToken: isVerified ? pseudoToken : undefined,
    packetLatencyMs: isVerified ? pseudoLatency : undefined,
  };
});

export const INITIAL_GATEWAY_LOGS: Array<{
  id: string;
  timestamp: string;
  ringUid: string;
  studentName: string;
  registerNumber: string;
  rssiDbm: number;
  skinContact: boolean;
  status: 'ACCEPTED' | 'REJECTED_PROXY' | 'REJECTED_SECTION';
  gatewayId: string;
  latencyMs: number;
}> = [
  {
    id: 'gw-log-01',
    timestamp: '11:02:14.382 AM',
    ringUid: 'AURA-IT-2A-001',
    studentName: 'Meghashri Chandrasekaren',
    registerNumber: '710022104001',
    rssiDbm: -41,
    skinContact: true,
    status: 'ACCEPTED',
    gatewayId: 'GATEWAY-IT-LH302',
    latencyMs: 34,
  },
  {
    id: 'gw-log-02',
    timestamp: '11:02:22.115 AM',
    ringUid: 'AURA-IT-2A-002',
    studentName: 'Aakash Sundaram',
    registerNumber: '710022104002',
    rssiDbm: -44,
    skinContact: true,
    status: 'ACCEPTED',
    gatewayId: 'GATEWAY-IT-LH302',
    latencyMs: 38,
  },
  {
    id: 'gw-log-03',
    timestamp: '11:03:05.890 AM',
    ringUid: 'AURA-IT-2A-003',
    studentName: 'Abinaya Rajan',
    registerNumber: '710022104003',
    rssiDbm: -49,
    skinContact: true,
    status: 'ACCEPTED',
    gatewayId: 'GATEWAY-IT-LH302',
    latencyMs: 41,
  },
  {
    id: 'gw-log-04',
    timestamp: '11:03:41.204 AM',
    ringUid: 'AURA-IT-2A-004',
    studentName: 'Aditya Raman',
    registerNumber: '710022104004',
    rssiDbm: -39,
    skinContact: true,
    status: 'ACCEPTED',
    gatewayId: 'GATEWAY-IT-LH302',
    latencyMs: 31,
  },
  {
    id: 'gw-log-05',
    timestamp: '11:04:18.910 AM',
    ringUid: 'AURA-IT-2A-005',
    studentName: 'Ananya Sridhar',
    registerNumber: '710022104005',
    rssiDbm: -45,
    skinContact: true,
    status: 'ACCEPTED',
    gatewayId: 'GATEWAY-IT-LH302',
    latencyMs: 36,
  },
];

export const INITIAL_SESSIONS: AttendanceSession[] = [
  {
    id: 'sess-today-it2a',
    department: 'Information Technology',
    year: '2nd Year',
    section: 'Section A',
    facultyId: 'fac-01',
    facultyName: 'Dr. Sarah Jenkins',
    date: '2026-09-23',
    period: 'Period 3 (11:00 AM - 11:50 AM)',
    startTime: '11:00 AM',
    endTime: '11:50 AM',
    status: 'Active',
    records: IT_2A_ATTENDANCE_RECORDS,
  },
  {
    id: 'sess-prev-completed-1',
    department: 'Information Technology',
    year: '2nd Year',
    section: 'Section A',
    facultyId: 'fac-01',
    facultyName: 'Dr. Sarah Jenkins',
    date: '2026-09-22',
    period: 'Period 2 (10:00 AM - 10:50 AM)',
    startTime: '10:00 AM',
    endTime: '10:50 AM',
    status: 'Completed',
    records: GENERATED_IT_2A_STUDENTS.map((st, idx) => ({
      studentId: st.id,
      studentName: st.fullName,
      registerNumber: st.registerNumber,
      ringUid: st.ringUid || `AURA-IT-2A-${String(idx + 1).padStart(3, '0')}`,
      ringVerification: idx < 60 ? 'Verified' : 'Pending',
      status: idx < 60 ? 'Present' : 'Absent',
      markedTime: idx < 60 ? '10:08 AM' : undefined,
      verifiedVia: 'Ring',
    })),
  },
  {
    id: 'sess-cse-3b-completed',
    department: 'Computer Science & Eng',
    year: '3rd Year',
    section: 'Section B',
    facultyId: 'fac-03',
    facultyName: 'Dr. Arunachalam M.',
    date: '2026-09-23',
    period: 'Period 2 (09:45 AM - 10:45 AM)',
    startTime: '09:45 AM',
    endTime: '10:45 AM',
    status: 'Completed',
    records: [
      {
        studentId: 'stu-cse-3b-001',
        studentName: 'Karthik Balakrishnan',
        registerNumber: '22CS010',
        ringUid: 'AURA-CS-3B-001',
        ringVerification: 'Verified',
        status: 'Present',
        markedTime: '09:47 AM',
        verifiedVia: 'Ring',
      },
    ],
  },
];

export const INITIAL_SOS_ALERTS: SOSAlert[] = [
  {
    id: 'sos-act-101',
    studentId: 'stu-it-2a-001',
    studentName: 'Meghashri Chandrasekaran',
    registerNumber: '23IT001',
    ringUid: 'AURA-IT-2A-001',
    department: 'Information Technology',
    year: '2nd Year',
    section: 'Section A',
    triggerType: 'Ring',
    time: '11:15 AM',
    timestamp: Date.now() - 1000 * 60 * 5, // 5 mins ago
    location: 'Nandha Engineering College, Erode — Main Academic Quadrangle',
    status: 'Triggered',
    coordinates: {
      latitude: 11.2741,
      longitude: 77.6256,
      accuracy: 15,
    },
    googleMapsUrl: 'https://maps.google.com/?q=11.2741,77.6256',
    emergencyContact: {
      name: 'Chandrasekaran M',
      relation: 'Father',
      phone: '+91 98400 98765',
    },
    parentNotification: {
      sent: true,
      channel: 'SMS_GATEWAY',
      recipientNumber: '+91 98400 98765',
      recipientName: 'Chandrasekaran M (Father)',
      timestamp: '11:15:02 AM',
      smsBody: `🚨 [EMERGENCY SOS / அவசர உதவி அலர்ட்] 🚨
👤 மாணவர் / Name: Meghashri Chandrasekaran (23IT001)
📍 இடம் / Place: Nandha Engineering College, Erode — Main Academic Quadrangle
⚠️ AURA Ring 3 முறை தட்டப்பட்டு அவசர உதவி கோரப்பட்டுள்ளது!
(AURA Ring Triple-Tapped. Immediate assistance required!)`,
      deliveryStatus: 'DELIVERED',
    },
    policeStationDispatch: {
      stationName: 'Perundurai Police Station (Erode District)',
      jurisdictionCode: 'TN-POLICE-ERD-PER-01',
      emergencyHotline: '04294-220233 / 112',
      distanceKm: 4.8,
      dispatchStatus: 'NOTIFIED',
      dispatchTimestamp: '11:15:03 AM',
      gpsCoordinates: '11.2741° N, 77.6256° E',
    },
  },
  {
    id: 'sos-prev-202',
    studentId: 'stu-it-2a-005',
    studentName: 'Pooja Iyer',
    registerNumber: '23IT005',
    ringUid: 'AURA-IT-2A-005',
    department: 'Information Technology',
    year: '2nd Year',
    section: 'Section A',
    triggerType: 'Ring',
    time: 'Yesterday 04:15 PM',
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
    location: 'Sports Ground — East Pavilion bleachers',
    status: 'Resolved',
    emergencyContact: {
      name: 'S. Iyer',
      relation: 'Father',
      phone: '+91 94481 99321',
    },
    acknowledgedBy: 'Officer Vikram Rathore',
    acknowledgedAt: '04:16 PM',
    responderTeam: 'Patrol Team Delta (Unit 2)',
    responseEta: '2 mins',
    respondedAt: '04:18 PM',
    resolvedBy: 'Officer Vikram Rathore',
    resolvedAt: '04:32 PM',
    resolutionNotes: 'Minor ankle twist during track practice. First aid administered by on-site nursing officer; student escorted to campus infirmary safely.',
    studentSafeConfirmed: true,
  },
  {
    id: 'sos-prev-201',
    studentId: 'stu-cse-3b-001',
    studentName: 'Karthik Balakrishnan',
    registerNumber: '22CS010',
    ringUid: 'AURA-CS-3B-001',
    department: 'Computer Science & Eng',
    year: '3rd Year',
    section: 'Section B',
    triggerType: 'Manual',
    time: '20 Sep 2026 02:40 PM',
    timestamp: Date.now() - 1000 * 60 * 60 * 72,
    location: 'Main Auditorium — Entrance Lobby',
    status: 'Resolved',
    emergencyContact: {
      name: 'B. Suresh',
      relation: 'Father',
      phone: '+91 96110 33441',
    },
    acknowledgedBy: 'Officer Vikram Rathore',
    acknowledgedAt: '02:41 PM',
    responderTeam: 'Station Alpha',
    responseEta: '1 min',
    respondedAt: '02:43 PM',
    resolvedBy: 'Officer Vikram Rathore',
    resolvedAt: '02:55 PM',
    resolutionNotes: 'Accidental test trigger during student orientation. Verification confirmed safe and cleared.',
    studentSafeConfirmed: true,
  },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-001',
    timestamp: '2026-09-23 11:15:20',
    user: 'AURA Ring Gateway',
    role: 'System',
    action: 'SOS Alert Triggered',
    entity: 'Student: Meghashri Chandrasekaran (23IT001)',
    description: 'Hardware triple-press emergency SOS triggered via AURA Ring UID: AURA-IT-2A-001 at Tech Park 3rd Floor.',
  },
  {
    id: 'aud-002',
    timestamp: '2026-09-23 11:04:12',
    user: 'Dr. Sarah Jenkins',
    role: 'Faculty',
    action: 'Attendance Verified via Ring',
    entity: 'Student: Meghashri Chandrasekaran (23IT001)',
    description: 'Verified via NFC/BLE reader during Period 3 attendance session. Status: Present.',
  },
  {
    id: 'aud-003',
    timestamp: '2026-09-23 11:00:00',
    user: 'Dr. Sarah Jenkins',
    role: 'Faculty',
    action: 'Attendance Session Started',
    entity: 'IT / 2nd Year / Section A',
    description: 'Launched Period 3 attendance session with 63 expected students. Automatic absent detection enabled.',
  },
  {
    id: 'aud-004',
    timestamp: '2026-09-22 17:10:44',
    user: 'Dr. Aravind Subramanian',
    role: 'Admin',
    action: 'Ring Assigned',
    entity: 'AuraRing: AURA-IT-2A-001',
    description: 'Registered and assigned ring to Meghashri Chandrasekaran (23IT001) in IT 2nd Year Section A.',
  },
  {
    id: 'aud-005',
    timestamp: '2026-09-22 16:32:00',
    user: 'Officer Vikram Rathore',
    role: 'Security',
    action: 'SOS Resolved',
    entity: 'Student: Pooja Iyer (23IT005)',
    description: 'Alert resolved after on-site checkup at Sports Ground. Student confirmed safe.',
  },
];
