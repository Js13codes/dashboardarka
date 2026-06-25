export interface IncomeRow {
  date: string;
  duty: string;
  patient: string;
  procedure: string;
  labFee: number;
  discount: number;
  amountPaid: number;
  percentCommission: number;
  pct: number;
  paymentTerminal: string;
  ccMerchantFee: number;
  hmo: number;
  totalGross: number;
  salaryRestricted: string;
  netTotal: number;
}

export interface ExpenseRow {
  id: number;
  date: string;
  type: string;
  description: string;
  amount: number;
}

export interface Employee {
  code: string;
  name: string;
  role: 'Dentist' | 'Assistant';
  baseSalary: number;
  commissionRate: number;
  tin?: string;
}

export interface AttendanceRecord {
  // employeeCode -> dateString -> status
  [employeeCode: string]: {
    [dateString: string]: 'present' | 'absent' | 'leave';
  };
}

export interface LeaveRecord {
  id: string;
  employeeCode: string;
  date: string;
  reason?: string;
}
