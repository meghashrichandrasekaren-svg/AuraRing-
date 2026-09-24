export type Role = 'admin' | 'principal' | 'hod' | 'faculty' | 'security' | 'student';

export interface UserAccount {
  id: string;
  role: Role;
  name: string;
  email: string;
  department?: string;
  designation?: string;
  assignedStudentId?: string;
  avatar?: string;
}

export interface Student {
  id: string;
  registerNumber: string;
  rollNumber: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  year: string;
  section: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  status: 'Active' | 'Inactive';
  ringUid?: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  bloodGroup?: string;
  joinedDate: string;
}

export interface Faculty {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  assignedSections: {
    department: string;
    year: string;
    section: string;
  }[];
  status: 'Active' | 'On Leave' | 'Inactive';
  qualification?: string;
  joinedDate?: string;
}

export type RingStatus = 'Unassigned' | 'Active' | 'Inactive' | 'Lost' | 'Blocked';

export interface AuraRing {
  ringUid: string;
  assignedStudentId?: string;
  assignedStudentName?: string;
  registerNumber?: string;
  department?: string;
  year?: string;
  section?: string;
  status: RingStatus;
  batteryLevel: number;
  firmwareVersion: string;
  lastSeen: string;
  bleAddress: string;
  signalStrengthDbm: number;
  hardwareBatch: string;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Excused';
export type VerificationType = 'Ring' | 'Manual' | 'Admin';
export type RingVerificationState = 'Verified' | 'Pending' | 'Failed' | 'Manual Bypass';

export interface AttendanceRecord {
  studentId: string;
  studentName: string;
  registerNumber: string;
  ringUid: string;
  ringVerification: RingVerificationState;
  status: AttendanceStatus;
  markedTime?: string;
  verifiedVia: VerificationType;
  // Hardware Telemetry & Proof (Demonstrates ring-based validation to Jury)
  rssiDbm?: number;              // Signal strength at classroom BLE gateway (e.g. -44 dBm)
  skinContactVerified?: boolean; // Capacitive anti-proxy sensor: true if ring is worn on finger
  batteryLevel?: number;         // Ring battery at time of verification
  gatewayReaderId?: string;      // Gateway sensor ID (e.g. "GATEWAY-IT-LH302")
  cryptoToken?: string;          // Cryptographic handshake token (SHA-256 slice)
  packetLatencyMs?: number;      // BLE handshake latency (e.g. 38ms)
}

export interface GatewayLogPacket {
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
}

export type SessionStatus = 'Scheduled' | 'Active' | 'Completed' | 'Cancelled';

export interface AttendanceSession {
  id: string;
  department: string;
  year: string;
  section: string;
  facultyId: string;
  facultyName: string;
  date: string;
  period: string;
  startTime: string;
  endTime: string;
  status: SessionStatus;
  records: AttendanceRecord[];
}

export type SOSTriggerType = 'Ring' | 'Manual' | 'System';
export type SOSAlertStatus = 'Triggered' | 'Acknowledged' | 'Responding' | 'Resolved' | 'Cancelled';

export interface SOSAlert {
  id: string;
  studentId: string;
  studentName: string;
  registerNumber: string;
  ringUid: string;
  department: string;
  year: string;
  section: string;
  triggerType: SOSTriggerType;
  time: string;
  timestamp: number;
  location: string;
  status: SOSAlertStatus;
  coordinates?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
  googleMapsUrl?: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  parentNotification?: {
    sent: boolean;
    channel: 'SMS_GATEWAY' | 'WHATSAPP_API' | 'VOICE_CALL';
    recipientNumber: string;
    recipientName: string;
    timestamp: string;
    smsBody: string;
    deliveryStatus: 'DELIVERED' | 'DISPATCHED' | 'PENDING';
  };
  policeStationDispatch?: {
    stationName: string;
    jurisdictionCode: string;
    emergencyHotline: string;
    distanceKm: number;
    dispatchStatus: 'NOTIFIED' | 'EN_ROUTE' | 'STANDBY';
    dispatchTimestamp: string;
    gpsCoordinates: string;
  };
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  responderTeam?: string;
  responseEta?: string;
  respondedAt?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  resolutionNotes?: string;
  studentSafeConfirmed?: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  entity: string;
  description: string;
  category?: string;
  performedBy?: string;
  targetEntity?: string;
}

export interface AcademicDepartment {
  id: string;
  code: string;
  name: string;
  hodName: string;
  totalStudents: number;
  totalFaculty: number;
  totalRingsAssigned: number;
  years: {
    year: string;
    sections: {
      section: string;
      advisor: string;
      studentCount: number;
    }[];
  }[];
}
