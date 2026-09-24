import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Role,
  UserAccount,
  Student,
  Faculty,
  AuraRing,
  AttendanceSession,
  AttendanceRecord,
  SOSAlert,
  AuditLog,
  AcademicDepartment,
  RingStatus,
  AttendanceStatus,
  VerificationType,
  SOSTriggerType,
  GatewayLogPacket,
} from '../types';
import {
  DEMO_ACCOUNTS,
  INITIAL_STUDENTS,
  INITIAL_FACULTY,
  INITIAL_RINGS,
  INITIAL_SESSIONS,
  INITIAL_SOS_ALERTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_ACADEMIC_STRUCTURE,
  INITIAL_GATEWAY_LOGS,
} from '../data/mockData';

interface AppContextType {
  currentUser: UserAccount;
  currentRole: Role;
  switchRole: (role: Role) => void;
  switchAccount: (account: UserAccount) => void;
  currentTab: string;
  setCurrentTab: (tab: string) => void;

  // Students
  students: Student[];
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, data: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  toggleStudentStatus: (id: string) => void;

  // Faculty
  facultyList: Faculty[];
  addFaculty: (fac: Omit<Faculty, 'id'>) => void;
  updateFaculty: (id: string, data: Partial<Faculty>) => void;
  toggleFacultyStatus: (id: string) => void;

  // Rings
  rings: AuraRing[];
  addRing: (ring: Omit<AuraRing, 'lastSeen' | 'signalStrengthDbm'>) => void;
  assignRingToStudent: (ringUid: string, studentId: string) => void;
  unassignRing: (ringUid: string) => void;
  updateRingStatus: (ringUid: string, status: RingStatus) => void;

  // Academic Structure
  academicStructure: AcademicDepartment[];

  // Attendance Sessions
  sessions: AttendanceSession[];
  activeSession: AttendanceSession | null;
  createSession: (newSession: Omit<AttendanceSession, 'id' | 'records'>) => AttendanceSession;
  startSession: (newSession: Omit<AttendanceSession, 'id' | 'records'>) => AttendanceSession;
  updateSessionStatus: (sessionId: string, status: AttendanceSession['status']) => void;
  completeSession: (sessionId: string) => void;
  verifyStudentRing: (
    sessionId: string,
    ringUid: string,
    method?: VerificationType,
    skinContact?: boolean
  ) => { success: boolean; message: string; studentName?: string; isProxyDetected?: boolean };
  markStudentAttendance: (sessionId: string, studentId: string, status: AttendanceStatus, verifiedVia?: VerificationType) => void;
  updateAttendanceRecord: (sessionId: string, studentId: string, status: AttendanceStatus, verifiedVia?: VerificationType) => void;
  batchVerifyAllInSession: (sessionId: string) => void;

  // Hardware Gateway Telemetry & Jury Proof
  liveGatewayLogs: GatewayLogPacket[];
  clearGatewayLogs: () => void;
  inspectingRecord: AttendanceRecord | null;
  setInspectingRecord: (record: AttendanceRecord | null) => void;
  proofModalOpen: boolean;
  setProofModalOpen: (open: boolean) => void;

  // SOS & Safety
  sosAlerts: SOSAlert[];
  activeSOSCount: number;
  triggerSOS: (
    studentId: string,
    triggerType: SOSTriggerType,
    customLocation?: string,
    customParentPhone?: string,
    customParentName?: string,
    realGps?: { lat: number; lng: number; accuracyMeters?: number }
  ) => SOSAlert;
  acknowledgeSOS: (alertId: string, acknowledgedBy: string) => void;
  respondSOS: (alertId: string, responderTeam: string, eta: string) => void;
  resolveSOS: (alertId: string, resolutionNotes: string, safeConfirmed: boolean) => void;
  cancelSOS: (alertId: string) => void;

  // Audit Logs
  auditLogs: AuditLog[];
  logAudit: (action: string, entity: string, description: string) => void;

  // Simulation & Demo helpers
  demoGuideOpen: boolean;
  setDemoGuideOpen: (open: boolean) => void;
  ringSimulatorOpen: boolean;
  setRingSimulatorOpen: (open: boolean) => void;
  sosModalOpen: boolean;
  setSosModalOpen: (open: boolean) => void;
  lastSimulatedRing: string | null;
  triggerDemoStep: (stepNumber: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current user state
  const [currentUser, setCurrentUser] = useState<UserAccount>(DEMO_ACCOUNTS[0]);
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // Core domain states
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [facultyList, setFacultyList] = useState<Faculty[]>(INITIAL_FACULTY);
  const [rings, setRings] = useState<AuraRing[]>(INITIAL_RINGS);
  const [academicStructure] = useState<AcademicDepartment[]>(INITIAL_ACADEMIC_STRUCTURE);
  const [sessions, setSessions] = useState<AttendanceSession[]>(INITIAL_SESSIONS);
  const [sosAlerts, setSosAlerts] = useState<SOSAlert[]>(INITIAL_SOS_ALERTS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  // Demo & Simulation modals
  const [demoGuideOpen, setDemoGuideOpen] = useState(false);
  const [ringSimulatorOpen, setRingSimulatorOpen] = useState(false);
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [lastSimulatedRing, setLastSimulatedRing] = useState<string | null>(null);

  // Live Hardware Gateway Logs & Proof Modal
  const [liveGatewayLogs, setLiveGatewayLogs] = useState<GatewayLogPacket[]>(INITIAL_GATEWAY_LOGS);
  const [inspectingRecord, setInspectingRecord] = useState<AttendanceRecord | null>(null);
  const [proofModalOpen, setProofModalOpen] = useState<boolean>(false);

  const clearGatewayLogs = () => {
    setLiveGatewayLogs([]);
  };

  // Active SOS count
  const activeSOSCount = sosAlerts.filter(
    (a) => a.status === 'Triggered' || a.status === 'Acknowledged' || a.status === 'Responding'
  ).length;

  const activeSession = sessions.find((s) => s.status === 'Active') || null;

  const logAudit = (action: string, entity: string, description: string) => {
    const newLog: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: currentUser.name,
      role: currentUser.role.toUpperCase(),
      action,
      entity,
      description,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const switchRole = (role: Role) => {
    const targetAccount = DEMO_ACCOUNTS.find((acc) => acc.role === role) || DEMO_ACCOUNTS[0];
    setCurrentUser(targetAccount);
    setCurrentTab('dashboard');
  };

  const switchAccount = (account: UserAccount) => {
    setCurrentUser(account);
    setCurrentTab('dashboard');
  };

  // Student Actions
  const addStudent = (studentData: Omit<Student, 'id'>) => {
    const newId = `stu-${Date.now()}`;
    const newStudent: Student = {
      ...studentData,
      id: newId,
    };
    setStudents((prev) => [newStudent, ...prev]);

    // If a ring was specified, link it
    if (studentData.ringUid) {
      setRings((prev) =>
        prev.map((r) =>
          r.ringUid === studentData.ringUid
            ? {
                ...r,
                assignedStudentId: newId,
                assignedStudentName: newStudent.fullName,
                registerNumber: newStudent.registerNumber,
                department: newStudent.department,
                status: 'Active',
              }
            : r
        )
      );
    }

    logAudit('Student Added', `Student: ${newStudent.fullName} (${newStudent.registerNumber})`, `Enrolled in ${newStudent.department}, ${newStudent.year}`);
  };

  const updateStudent = (id: string, data: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...data } : s))
    );
    const updated = students.find((s) => s.id === id);
    if (updated) {
      logAudit('Student Updated', `Student: ${updated.fullName} (${updated.registerNumber})`, `Modified details for student record.`);
    }
  };

  const deleteStudent = (id: string) => {
    const target = students.find((s) => s.id === id);
    if (target) {
      if (target.ringUid) {
        // Free the ring
        setRings((prev) =>
          prev.map((r) =>
            r.ringUid === target.ringUid
              ? {
                  ...r,
                  assignedStudentId: undefined,
                  assignedStudentName: undefined,
                  registerNumber: undefined,
                  department: undefined,
                  status: 'Unassigned',
                }
              : r
          )
        );
      }
      setStudents((prev) => prev.filter((s) => s.id !== id));
      logAudit('Student Deleted', `Student: ${target.fullName} (${target.registerNumber})`, `Permanently removed student record and unassigned linked AURA Ring.`);
    }
  };

  const toggleStudentStatus = (id: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const newStatus = s.status === 'Active' ? 'Inactive' : 'Active';
          logAudit('Student Status Toggled', `Student: ${s.fullName}`, `Status changed to ${newStatus}`);
          return { ...s, status: newStatus };
        }
        return s;
      })
    );
  };

  // Faculty Actions
  const addFaculty = (facData: Omit<Faculty, 'id'>) => {
    const newFaculty: Faculty = {
      ...facData,
      id: `fac-${Date.now()}`,
    };
    setFacultyList((prev) => [...prev, newFaculty]);
    logAudit('Faculty Added', `Faculty: ${newFaculty.name} (${newFaculty.employeeId})`, `Appointed to ${newFaculty.department}`);
  };

  const updateFaculty = (id: string, data: Partial<Faculty>) => {
    setFacultyList((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...data } : f))
    );
  };

  const toggleFacultyStatus = (id: string) => {
    setFacultyList((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          const next = f.status === 'Active' ? 'Inactive' : 'Active';
          logAudit('Faculty Status Toggled', `Faculty: ${f.name}`, `Status set to ${next}`);
          return { ...f, status: next };
        }
        return f;
      })
    );
  };

  // Ring Actions
  const addRing = (ringData: Omit<AuraRing, 'lastSeen' | 'signalStrengthDbm'>) => {
    const newRing: AuraRing = {
      ...ringData,
      lastSeen: 'Just now (Docked)',
      signalStrengthDbm: -45,
    };
    setRings((prev) => [newRing, ...prev]);
    logAudit('Ring Registered', `AuraRing: ${newRing.ringUid}`, `Registered new ring to fleet. Status: ${newRing.status}`);
  };

  const assignRingToStudent = (ringUid: string, studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    // Detach ring from previous student if any
    setStudents((prev) =>
      prev.map((s) => (s.ringUid === ringUid ? { ...s, ringUid: undefined } : s))
    );

    // Link to new student
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, ringUid } : s))
    );

    // Update ring record
    setRings((prev) =>
      prev.map((r) =>
        r.ringUid === ringUid
          ? {
              ...r,
              assignedStudentId: student.id,
              assignedStudentName: student.fullName,
              registerNumber: student.registerNumber,
              department: student.department,
              year: student.year,
              section: student.section,
              status: 'Active',
              lastSeen: '1 min ago',
            }
          : r
      )
    );

    logAudit('Ring Assigned', `Ring: ${ringUid} ↔ ${student.fullName}`, `Paired hardware UID with student ${student.registerNumber} (${student.department} ${student.year} ${student.section})`);
  };

  const unassignRing = (ringUid: string) => {
    const ring = rings.find((r) => r.ringUid === ringUid);
    const assignedName = ring?.assignedStudentName || 'Unknown';

    setStudents((prev) =>
      prev.map((s) => (s.ringUid === ringUid ? { ...s, ringUid: undefined } : s))
    );

    setRings((prev) =>
      prev.map((r) =>
        r.ringUid === ringUid
          ? {
              ...r,
              assignedStudentId: undefined,
              assignedStudentName: undefined,
              registerNumber: undefined,
              department: undefined,
              year: undefined,
              section: undefined,
              status: 'Unassigned',
            }
          : r
      )
    );

    logAudit('Ring Unassigned', `AuraRing: ${ringUid}`, `Unlinked ring from student ${assignedName}`);
  };

  const updateRingStatus = (ringUid: string, status: RingStatus) => {
    setRings((prev) =>
      prev.map((r) => (r.ringUid === ringUid ? { ...r, status } : r))
    );
    logAudit('Ring Status Updated', `AuraRing: ${ringUid}`, `Hardware status changed to ${status}`);
  };

  // Attendance Actions
  const createSession = (newSessionData: Omit<AttendanceSession, 'id' | 'records'>) => {
    // Find students matching this department, year, section
    const enrolledStudents = students.filter(
      (s) =>
        s.department === newSessionData.department &&
        s.year === newSessionData.year &&
        s.section === newSessionData.section &&
        s.status === 'Active'
    );

    const initialRecords: AttendanceRecord[] = enrolledStudents.map((st) => ({
      studentId: st.id,
      studentName: st.fullName,
      registerNumber: st.registerNumber,
      ringUid: st.ringUid || 'NO-RING-LINKED',
      ringVerification: 'Pending',
      status: 'Absent',
      verifiedVia: 'Ring',
    }));

    const session: AttendanceSession = {
      ...newSessionData,
      id: `sess-${Date.now()}`,
      records: initialRecords,
    };

    setSessions((prev) => [session, ...prev]);
    logAudit(
      'Attendance Session Created',
      `${session.department} / ${session.year} / ${session.section}`,
      `Created session for ${session.period} by ${session.facultyName}`
    );
    return session;
  };

  const updateSessionStatus = (sessionId: string, status: AttendanceSession['status']) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, status } : s))
    );
    const target = sessions.find((s) => s.id === sessionId);
    if (target) {
      logAudit('Session Status Changed', `Session: ${target.id}`, `Updated status to ${status}`);
    }
  };

  const verifyStudentRing = (
    sessionId: string,
    ringUid: string,
    method: VerificationType = 'Ring',
    skinContact: boolean = true
  ) => {
    setLastSimulatedRing(ringUid);
    const ring = rings.find((r) => r.ringUid === ringUid);
    if (!ring || !ring.assignedStudentId) {
      return { success: false, message: `AURA Ring ${ringUid} is unassigned or not recognized.` };
    }

    const student = students.find((s) => s.id === ring.assignedStudentId);
    if (!student) {
      return { success: false, message: `Linked student not found for Ring ${ringUid}.` };
    }

    const now = new Date();
    const nowTimeWithSeconds = `${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}.${String(now.getMilliseconds()).padStart(3, '0')}`;
    const rssi = -38 - Math.floor(Math.random() * 18); // e.g. -38 to -56 dBm
    const latency = 28 + Math.floor(Math.random() * 18); // 28 to 46 ms
    const cryptoToken = `0x${Math.random().toString(16).substring(2, 8).toUpperCase()}F8A`;
    const gatewayId = 'GATEWAY-IT-LH302';

    // 1. Anti-Proxy Protection Check: Capacitive skin contact sensor on inner ring bezel
    if (!skinContact) {
      const rejectedLog: GatewayLogPacket = {
        id: `gw-rej-${Date.now()}`,
        timestamp: nowTimeWithSeconds,
        ringUid: ringUid,
        studentName: student.fullName,
        registerNumber: student.registerNumber,
        rssiDbm: rssi,
        skinContact: false,
        status: 'REJECTED_PROXY',
        gatewayId,
        latencyMs: latency,
      };

      setLiveGatewayLogs((prev) => [rejectedLog, ...prev.slice(0, 19)]);

      logAudit(
        'ANTI-PROXY ALERT: Wearable Detached',
        `Ring: ${ringUid} (Student: ${student.fullName})`,
        `Attendance rejected by gateway ${gatewayId}. Ring reported NO capacitive skin contact. Anti-buddy-punching security triggered.`
      );

      return {
        success: false,
        isProxyDetected: true,
        message: `ANTI-PROXY SECURITY ALERT: Ring ${ringUid} signal received, but wearable capacitive skin contact is disconnected! Ring must be physically worn on student's finger to register attendance.`,
        studentName: student.fullName,
      };
    }

    let foundInSession = false;

    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === sessionId) {
          const updatedRecords = s.records.map((rec) => {
            if (rec.studentId === student.id || rec.ringUid === ringUid) {
              foundInSession = true;
              return {
                ...rec,
                ringVerification: 'Verified' as const,
                status: 'Present' as const,
                markedTime: nowTimeWithSeconds,
                verifiedVia: method,
                rssiDbm: rssi,
                skinContactVerified: true,
                batteryLevel: ring.batteryLevel,
                gatewayReaderId: gatewayId,
                cryptoToken: cryptoToken,
                packetLatencyMs: latency,
              };
            }
            return rec;
          });
          return { ...s, records: updatedRecords };
        }
        return s;
      })
    );

    if (foundInSession) {
      const acceptedLog: GatewayLogPacket = {
        id: `gw-acc-${Date.now()}`,
        timestamp: nowTimeWithSeconds,
        ringUid: ringUid,
        studentName: student.fullName,
        registerNumber: student.registerNumber,
        rssiDbm: rssi,
        skinContact: true,
        status: 'ACCEPTED',
        gatewayId,
        latencyMs: latency,
      };

      setLiveGatewayLogs((prev) => [acceptedLog, ...prev.slice(0, 19)]);

      logAudit(
        'AURA Ring Cryptographic Handshake',
        `Student: ${student.fullName} (${student.registerNumber})`,
        `Ring UID: ${ringUid} verified via BLE 5.2 Gateway (${gatewayId}). RSSI: ${rssi} dBm, Skin Contact: LOCKED, Nonce: ${cryptoToken}. Status: Present.`
      );

      return {
        success: true,
        message: `VERIFIED VIA SMART RING: ${student.fullName} (UID: ${ringUid}, Signal: ${rssi} dBm, Latency: ${latency}ms) marked Present.`,
        studentName: student.fullName,
      };
    } else {
      const targetSession = sessions.find((s) => s.id === sessionId);
      const sessionLabel = targetSession ? `${targetSession.department} · ${targetSession.year} ${targetSession.section}` : "current session";

      const sectionRejLog: GatewayLogPacket = {
        id: `gw-sec-rej-${Date.now()}`,
        timestamp: nowTimeWithSeconds,
        ringUid: ringUid,
        studentName: student.fullName,
        registerNumber: student.registerNumber,
        rssiDbm: rssi,
        skinContact: true,
        status: 'REJECTED_SECTION',
        gatewayId,
        latencyMs: latency,
      };

      setLiveGatewayLogs((prev) => [sectionRejLog, ...prev.slice(0, 19)]);

      logAudit(
        'Cross-Section Tap Rejected',
        `Student: ${student.fullName} (${student.registerNumber})`,
        `Ring UID: ${ringUid} rejected. Student belongs to ${student.department} ${student.year} ${student.section}, but session is ${sessionLabel}.`
      );

      return {
        success: false,
        message: `Cross-Section Tap Rejected: Ring ${ringUid} belongs to ${student.fullName} (${student.department} · ${student.year} ${student.section}), not enrolled in ${sessionLabel}.`,
        studentName: student.fullName,
      };
    }
  };

  const markStudentAttendance = (
    sessionId: string,
    studentId: string,
    status: AttendanceStatus,
    verifiedVia: VerificationType = 'Manual'
  ) => {
    const now = new Date();
    const nowTimeWithSeconds = `${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === sessionId) {
          const updatedRecords = s.records.map((rec) => {
            if (rec.studentId === studentId) {
              return {
                ...rec,
                status,
                markedTime: status === 'Absent' ? undefined : nowTimeWithSeconds,
                ringVerification:
                  verifiedVia === 'Ring'
                    ? ('Verified' as const)
                    : ('Manual Bypass' as const),
                verifiedVia,
                rssiDbm: status === 'Absent' ? undefined : rec.rssiDbm || -45,
                skinContactVerified: status === 'Absent' ? undefined : true,
                gatewayReaderId: status === 'Absent' ? undefined : 'GATEWAY-IT-LH302',
              };
            }
            return rec;
          });
          return { ...s, records: updatedRecords };
        }
        return s;
      })
    );
  };

  const batchVerifyAllInSession = (sessionId: string) => {
    const now = new Date();
    const nowTimeWithSeconds = `${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
    const gatewayId = 'GATEWAY-IT-LH302';

    const newLogs: GatewayLogPacket[] = [];

    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === sessionId) {
          const updatedRecords = s.records.map((rec, i) => {
            const rssi = -38 - ((i * 3) % 20);
            const latency = 28 + ((i * 4) % 22);
            const token = `0x${((i + 1) * 7621).toString(16).toUpperCase()}8A`;

            if (rec.status === 'Absent' || rec.ringVerification !== 'Verified') {
              newLogs.push({
                id: `gw-batch-${Date.now()}-${i}`,
                timestamp: nowTimeWithSeconds,
                ringUid: rec.ringUid,
                studentName: rec.studentName,
                registerNumber: rec.registerNumber,
                rssiDbm: rssi,
                skinContact: true,
                status: 'ACCEPTED',
                gatewayId,
                latencyMs: latency,
              });
            }

            return {
              ...rec,
              ringVerification: 'Verified' as const,
              status: 'Present' as const,
              markedTime: rec.markedTime || nowTimeWithSeconds,
              verifiedVia: 'Ring' as const,
              rssiDbm: rec.rssiDbm || rssi,
              skinContactVerified: true,
              batteryLevel: rec.batteryLevel || (90 + (i % 8)),
              gatewayReaderId: gatewayId,
              cryptoToken: rec.cryptoToken || token,
              packetLatencyMs: rec.packetLatencyMs || latency,
            };
          });
          return { ...s, records: updatedRecords };
        }
        return s;
      })
    );

    if (newLogs.length > 0) {
      setLiveGatewayLogs((prev) => [...newLogs.slice(0, 10), ...prev].slice(0, 20));
    }

    logAudit('Classroom Sensor Gateway Scan', `Session: ${sessionId}`, `Classroom gateway ${gatewayId} received BLE beacons from all enrolled student smart rings.`);
  };

  // SOS Actions
  const triggerSOS = (
    studentId: string,
    triggerType: SOSTriggerType,
    customLocation?: string,
    customParentPhone?: string,
    customParentName?: string,
    realGps?: { lat: number; lng: number; accuracyMeters?: number }
  ) => {
    const student = students.find((s) => s.id === studentId) || students[0];
    const now = new Date();
    const nowTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const nowTimeWithSeconds = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const location = customLocation || 'Nandha Engineering College, Erode — Main Academic Quadrangle';

    // Live Device GPS calculation (Default: Nandha Engineering College, Erode: 11.2741° N, 77.6256° E)
    const gpsLat = realGps ? realGps.lat.toFixed(5) : '11.2741';
    const gpsLng = realGps ? realGps.lng.toFixed(5) : '77.6256';
    const gpsCoordinatesFormatted = `${gpsLat}° N, ${gpsLng}° E`;
    const googleMapsDirectUrl = `https://maps.google.com/?q=${gpsLat},${gpsLng}`;

    // Nearby Police Station Mapping based on Nandha Engineering College, Erode (Perundurai / Erode Jurisdiction)
    const nearbyStations = [
      {
        stationName: 'Perundurai Police Station (Erode District)',
        jurisdictionCode: 'TN-POLICE-ERD-PER-01',
        emergencyHotline: '04294-220233 / 112',
        distanceKm: 4.8,
      },
      {
        stationName: 'Thindal Police Outpost (Erode Rural)',
        jurisdictionCode: 'TN-POLICE-ERD-THN-04',
        emergencyHotline: '0424-2225100 / 100',
        distanceKm: 6.2,
      },
      {
        stationName: 'Erode Taluk Police Station',
        jurisdictionCode: 'TN-POLICE-ERD-TLK-02',
        emergencyHotline: '0424-2262100 / 112',
        distanceKm: 9.5,
      },
    ];

    const selectedPolice = nearbyStations[Math.floor(Math.random() * nearbyStations.length)];

    const guardianName = customParentName || student.emergencyContact.name;
    const guardianPhone = customParentPhone || student.emergencyContact.phone;
    
    // Clean bilingual SOS distress message (Name, Place, Emergency Alert)
    const smsMessage = `🚨 [EMERGENCY SOS / அவசர உதவி அலர்ட்] 🚨
👤 மாணவர் / Name: ${student.fullName} (${student.registerNumber})
📍 இடம் / Place: ${location}
⚠️ AURA Ring 3 முறை தட்டப்பட்டு அவசர உதவி கோரப்பட்டுள்ளது!
(AURA Ring Triple-Tapped. Immediate assistance required!)`;

    const newAlert: SOSAlert = {
      id: `sos-${Date.now()}`,
      studentId: student.id,
      studentName: student.fullName,
      registerNumber: student.registerNumber,
      ringUid: student.ringUid || 'AURA-R9-0000',
      department: student.department,
      year: student.year,
      section: student.section,
      triggerType,
      time: nowTime,
      timestamp: Date.now(),
      location,
      status: 'Triggered',
      coordinates: {
        latitude: parseFloat(gpsLat),
        longitude: parseFloat(gpsLng),
        accuracy: realGps?.accuracyMeters,
      },
      googleMapsUrl: googleMapsDirectUrl,
      emergencyContact: {
        ...student.emergencyContact,
        name: guardianName,
        phone: guardianPhone,
      },
      parentNotification: {
        sent: true,
        channel: 'SMS_GATEWAY',
        recipientNumber: guardianPhone,
        recipientName: `${guardianName} (${student.emergencyContact.relation || 'Parent/Guardian'})`,
        timestamp: nowTimeWithSeconds,
        smsBody: smsMessage,
        deliveryStatus: 'DELIVERED',
      },
      policeStationDispatch: {
        stationName: selectedPolice.stationName,
        jurisdictionCode: selectedPolice.jurisdictionCode,
        emergencyHotline: selectedPolice.emergencyHotline,
        distanceKm: selectedPolice.distanceKm,
        dispatchStatus: 'NOTIFIED',
        dispatchTimestamp: nowTimeWithSeconds,
        gpsCoordinates: gpsCoordinatesFormatted,
      },
    };

    setSosAlerts((prev) => [newAlert, ...prev]);
    logAudit(
      'Emergency SOS Ring Triple-Tap',
      `Student: ${student.fullName} (${student.registerNumber})`,
      `Distress broadcast via Ring Triple-Tap at Live GPS ${gpsCoordinatesFormatted}. Parent SMS delivered to ${guardianPhone}. Dispatched to ${selectedPolice.stationName}.`
    );
    return newAlert;
  };

  const acknowledgeSOS = (alertId: string, acknowledgedBy: string) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setSosAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? {
              ...a,
              status: 'Acknowledged',
              acknowledgedBy,
              acknowledgedAt: nowTime,
            }
          : a
      )
    );
    logAudit('SOS Acknowledged', `Alert ID: ${alertId}`, `Security officer ${acknowledgedBy} acknowledged alert. Assessing dispatch.`);
  };

  const respondSOS = (alertId: string, responderTeam: string, eta: string) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setSosAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? {
              ...a,
              status: 'Responding',
              responderTeam,
              responseEta: eta,
              respondedAt: nowTime,
            }
          : a
      )
    );
    logAudit('SOS Responding', `Alert ID: ${alertId}`, `Dispatched ${responderTeam} with ETA ${eta}`);
  };

  const resolveSOS = (alertId: string, resolutionNotes: string, safeConfirmed: boolean) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const target = sosAlerts.find((a) => a.id === alertId);

    setSosAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? {
              ...a,
              status: 'Resolved',
              resolvedBy: currentUser.name,
              resolvedAt: nowTime,
              resolutionNotes,
              studentSafeConfirmed: safeConfirmed,
            }
          : a
      )
    );

    logAudit(
      'SOS Resolved',
      `Alert ID: ${alertId} (${target?.studentName})`,
      `Resolution: ${resolutionNotes} | Student safety confirmed: ${safeConfirmed ? 'YES' : 'NO'}`
    );
  };

  const cancelSOS = (alertId: string) => {
    setSosAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'Cancelled' } : a))
    );
    logAudit('SOS Cancelled', `Alert ID: ${alertId}`, 'Alert marked as cancelled by operator.');
  };

  // Interactive Demo Story Steps
  const triggerDemoStep = (stepNumber: number) => {
    switch (stepNumber) {
      case 1: // Admin Login
        switchRole('admin');
        setCurrentTab('dashboard');
        break;
      case 2: // Students List & Details
        switchRole('admin');
        setCurrentTab('students');
        break;
      case 3: // Ring Fleet Management
        switchRole('admin');
        setCurrentTab('rings');
        break;
      case 4: // Attendance Session & Ring Verification
        switchRole('faculty');
        setCurrentTab('attendance');
        break;
      case 5: // SOS Trigger & Security Response
        switchRole('security');
        setCurrentTab('sos-active');
        break;
      case 6: // Faculty View
        switchRole('faculty');
        setCurrentTab('dashboard');
        break;
      case 7: // Student Portal
        switchRole('student');
        setCurrentTab('dashboard');
        break;
      default:
        break;
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole: currentUser.role,
        switchRole,
        switchAccount,
        currentTab,
        setCurrentTab,
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        toggleStudentStatus,
        facultyList,
        addFaculty,
        updateFaculty,
        toggleFacultyStatus,
        rings,
        addRing,
        assignRingToStudent,
        unassignRing,
        updateRingStatus,
        academicStructure,
        sessions,
        activeSession,
        createSession,
        startSession: createSession,
        updateSessionStatus,
        completeSession: (id: string) => updateSessionStatus(id, 'Completed'),
        verifyStudentRing,
        markStudentAttendance,
        updateAttendanceRecord: markStudentAttendance,
        batchVerifyAllInSession,
        liveGatewayLogs,
        clearGatewayLogs,
        inspectingRecord,
        setInspectingRecord,
        proofModalOpen,
        setProofModalOpen,
        sosAlerts,
        activeSOSCount,
        triggerSOS,
        acknowledgeSOS,
        respondSOS,
        resolveSOS,
        cancelSOS,
        auditLogs,
        logAudit,
        demoGuideOpen,
        setDemoGuideOpen,
        ringSimulatorOpen,
        setRingSimulatorOpen,
        sosModalOpen,
        setSosModalOpen,
        lastSimulatedRing,
        triggerDemoStep,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
