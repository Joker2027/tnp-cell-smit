export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'student' | 'teacher' | 'hod'
export type InternshipType = 'self_arranged' | 'tnp_arranged' | 'smit_inhouse'
export type NOCStatus = 'pending' | 'mentor_approved' | 'hod_approved' | 'rejected'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          role: UserRole
          full_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          role: UserRole
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: UserRole
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      students: {
        Row: {
          id: string
          user_id: string
          enrollment_number: string
          semester: number
          section: string
          department: string
          address: string | null
          phone: string | null
          fathers_name: string | null
          fathers_contact: string | null
          fathers_occupation: string | null
          mothers_name: string | null
          mothers_contact: string | null
          mothers_occupation: string | null
          tenth_percentage: number | null
          tenth_board: string | null
          tenth_year: number | null
          twelfth_percentage: number | null
          twelfth_board: string | null
          twelfth_year: number | null
          cgpa: number | null
          mentor_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          enrollment_number: string
          semester: number
          section: string
          department: string
          address?: string | null
          phone?: string | null
          fathers_name?: string | null
          fathers_contact?: string | null
          fathers_occupation?: string | null
          mothers_name?: string | null
          mothers_contact?: string | null
          mothers_occupation?: string | null
          tenth_percentage?: number | null
          tenth_board?: string | null
          tenth_year?: number | null
          twelfth_percentage?: number | null
          twelfth_board?: string | null
          twelfth_year?: number | null
          cgpa?: number | null
          mentor_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          enrollment_number?: string
          semester?: number
          section?: string
          department?: string
          address?: string | null
          phone?: string | null
          fathers_name?: string | null
          fathers_contact?: string | null
          fathers_occupation?: string | null
          mothers_name?: string | null
          mothers_contact?: string | null
          mothers_occupation?: string | null
          tenth_percentage?: number | null
          tenth_board?: string | null
          tenth_year?: number | null
          twelfth_percentage?: number | null
          twelfth_board?: string | null
          twelfth_year?: number | null
          cgpa?: number | null
          mentor_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      teachers: {
        Row: {
          id: string
          user_id: string
          employee_id: string
          department: string
          designation: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          employee_id: string
          department: string
          designation?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          employee_id?: string
          department?: string
          designation?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      internships: {
        Row: {
          id: string
          student_id: string
          internship_type: InternshipType
          company_name: string
          company_address: string | null
          company_website: string | null
          guide_name: string | null
          guide_email: string | null
          guide_contact: string | null
          joining_date: string | null
          completion_date: string | null
          duration_weeks: number | null
          stipend: number | null
          offer_letter_url: string | null
          completion_certificate_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          internship_type: InternshipType
          company_name: string
          company_address?: string | null
          company_website?: string | null
          guide_name?: string | null
          guide_email?: string | null
          guide_contact?: string | null
          joining_date?: string | null
          completion_date?: string | null
          duration_weeks?: number | null
          stipend?: number | null
          offer_letter_url?: string | null
          completion_certificate_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          internship_type?: InternshipType
          company_name?: string
          company_address?: string | null
          company_website?: string | null
          guide_name?: string | null
          guide_email?: string | null
          guide_contact?: string | null
          joining_date?: string | null
          completion_date?: string | null
          duration_weeks?: number | null
          stipend?: number | null
          offer_letter_url?: string | null
          completion_certificate_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      noc_applications: {
        Row: {
          id: string
          student_id: string
          internship_id: string
          purpose: string | null
          declaration_accepted: boolean
          status: NOCStatus
          mentor_remarks: string | null
          hod_remarks: string | null
          mentor_approved_at: string | null
          hod_approved_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          internship_id: string
          purpose?: string | null
          declaration_accepted?: boolean
          status?: NOCStatus
          mentor_remarks?: string | null
          hod_remarks?: string | null
          mentor_approved_at?: string | null
          hod_approved_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          internship_id?: string
          purpose?: string | null
          declaration_accepted?: boolean
          status?: NOCStatus
          mentor_remarks?: string | null
          hod_remarks?: string | null
          mentor_approved_at?: string | null
          hod_approved_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      evaluations: {
        Row: {
          id: string
          student_id: string
          internship_id: string
          evaluator_id: string
          presentation_marks: number | null
          report_marks: number | null
          viva_marks: number | null
          total_marks: number | null
          grade: string | null
          feedback: string | null
          evaluated_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          internship_id: string
          evaluator_id: string
          presentation_marks?: number | null
          report_marks?: number | null
          viva_marks?: number | null
          total_marks?: number | null
          grade?: string | null
          feedback?: string | null
          evaluated_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          internship_id?: string
          evaluator_id?: string
          presentation_marks?: number | null
          report_marks?: number | null
          viva_marks?: number | null
          total_marks?: number | null
          grade?: string | null
          feedback?: string | null
          evaluated_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
