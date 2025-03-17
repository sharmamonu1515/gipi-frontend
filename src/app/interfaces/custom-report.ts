export interface IGstDetail {
    gstin: string;
    status: string;
    state: string
}

export interface IRiskCategory {
  category: string;
  result: string;
  tags: string;
  actions: string;
}
export interface IFilingDetail {
  trrn: string;
  wage_month: string;
  date_of_credit: string;
  no_of_employees: number;
  amount: number;
}
export interface IEPFOData {
  establishment_id: string;
  establishment_name: string;
  address: string;
  city: string;
  date_of_setup: string;
  working_status: string;
  principal_business_activities: string;
  exemption_status_edli: string;
  exemption_status_pension: string;
  exemption_status_pf: string;
  no_of_employees: number;
  amount: number;
  latest_wage_month: string;
  latest_date_of_credit: string;
  filing_details: IFilingDetail[];
}
export interface ICreditRatingDetail {
  rating: string;
  action: string;
  outlook?: string | null;
  remarks?: string | null;
}
export interface ICreditRating {
  rating_date: string;
  rating_agency: string;
  rating: string;
  rating_details: ICreditRatingDetail[];
  type_of_loan: string;
  currency: string;
  amount: number;
}
export interface IFilteredRating {
  rating_agency: string;
  rating_date: string;
  rating: string;
  action: string;
  outlook?: string | null;
  type_of_loan: string;
  currency: string;
  amount: number;
}
export interface ICompany {
  cin: string;
  legal_name: string;
  paid_up_capital: number;
  sum_of_charges: number;
  incorporation_date: string;
  share_holding_percentage: number;
  city: string;
  status: string;
  active_compliance: string;
  cirp_status?: string | null;
  next_cin?: string | null;
}
export interface IEntitySection {
  type: string;
  companies: ICompany[];
}
export interface IBankCharge {
  charge_id: number;
  holder_name: string;
  amount: number;
  date: string; 
  filing_date?: string;
  status: string;
  property_particulars: string;
  creation_date?: string;
  satisfaction_date?: string;
}

export interface IKeyManagerPeron{
  companyDirectors : string,
  din: string,
  designation: string,
  appointmentDate?: string,
  cessationDate?: string,
  name?: string,
  date_of_appointment_for_current_designation?: string,
  date_of_cessation?: string
}
