export interface Area {
  area_id: string;
  name_ko: string;
  name_en: string;
  icon_key: string;
  display_order: number;
  description: string;
  agent_count: number;
  color: string;
}

export interface InputFieldSchema {
  type: 'text' | 'textarea' | 'select';
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
}

export interface Agent {
  agent_id: string;
  area_id: string;
  name_ko: string;
  name_en: string;
  description: string;
  priority: number;
  output_type: string;
  input_schema: Record<string, InputFieldSchema>;
  prompt_template_path: string;
  review_rule_path: string;
  is_enabled: boolean;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  project_type?: string;
  status: string;
  owner_id?: string;
  created_at?: string;
}

export interface AgentRun {
  run_id: string;
  project_id?: string;
  agent_id: string;
  area_id: string;
  input_payload?: Record<string, string>;
  output_text?: string;
  output_json?: unknown;
  status: string;
  requested_at?: string;
  completed_at?: string;
}

export interface Document {
  document_id: string;
  project_id?: string;
  title: string;
  document_type?: string;
  content_markdown?: string;
  agent_run_id?: string;
  created_at?: string;
}

export interface Task {
  task_id: string;
  project_id?: string;
  title: string;
  description?: string;
  assignee?: string;
  due_date?: string;
  priority: string;
  status: string;
  source_agent_run_id?: string;
  created_at?: string;
}
