import { useState, useEffect, useRef } from 'react';

export interface SearchFormData {
  // 필수
  business_description: string;
  purpose: string;
  region: string;
  // 선택
  company_name: string;
  industry: string;
  core_technology: string;
  business_model: string;
  rd_goal: string;
  demonstration_plan: string;
  supply_plan: string;
  desired_funding: string;
  company_stage: string;
  interest_area: string;
}

const FORM_STORAGE_KEY = 'mcw_program_search_form_v1';

const INITIAL_FORM: SearchFormData = {
  business_description: '',
  purpose: '',
  region: '',
  company_name: '',
  industry: '',
  core_technology: '',
  business_model: '',
  rd_goal: '',
  demonstration_plan: '',
  supply_plan: '',
  desired_funding: '',
  company_stage: '',
  interest_area: '',
};

// localStorage 유틸
function loadFormFromStorage(): SearchFormData | null {
  try {
    const raw = localStorage.getItem(FORM_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SearchFormData;
  } catch {
    return null;
  }
}

function saveFormToStorage(data: SearchFormData): void {
  try {
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage 접근 실패 시 무시
  }
}

function clearFormFromStorage(): void {
  try {
    localStorage.removeItem(FORM_STORAGE_KEY);
  } catch {
    // 무시
  }
}

const REGIONS = [
  '전국', '서울', '경기', '인천', '부산', '대구', '광주', '대전',
  '울산', '세종', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주',
];
const INDUSTRIES = [
  'IT/소프트웨어', 'AI/데이터', '제조업', '바이오/의료',
  '에너지/환경', '농식품', '문화/콘텐츠', '서비스업', '기타',
];
const FUNDING_SIZES = ['5천만원 이하', '5천만원~1억원', '1억원~3억원', '3억원~5억원', '5억원 이상'];
const COMPANY_STAGES = ['예비창업', '창업 1년 미만', '창업 3년 미만', '창업 7년 미만', '창업 7년 이상'];
const INTEREST_AREAS = ['AI/SW', '제조/소재', '바이오/의료', '에너지/환경', '농식품', '문화/콘텐츠', '기타'];

interface Props {
  onSearch: (data: SearchFormData) => void;
  isSearching: boolean;
}

export default function SearchInputForm({ onSearch, isSearching }: Props) {
  const [formData, setFormData] = useState<SearchFormData>(INITIAL_FORM);
  const [showOptional, setShowOptional] = useState(false);
  const [error, setError] = useState('');
  const [loadedMsg, setLoadedMsg] = useState(false);
  const [resetMsg, setResetMsg] = useState(false);

  const loadedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 마운트 시 localStorage에서 이전 입력값 복원
  useEffect(() => {
    const saved = loadFormFromStorage();
    if (saved) {
      setFormData(saved);
      setLoadedMsg(true);
      loadedTimer.current = setTimeout(() => setLoadedMsg(false), 4000);
    }
    return () => {
      if (loadedTimer.current) clearTimeout(loadedTimer.current);
      if (resetTimer.current)  clearTimeout(resetTimer.current);
    };
  }, []);

  function handleChange(field: keyof SearchFormData, value: string) {
    const next = { ...formData, [field]: value };
    setFormData(next);
    saveFormToStorage(next); // 변경 즉시 자동 저장
    if (error) setError('');
  }

  function handleSubmit() {
    const missing: string[] = [];
    if (!formData.business_description.trim()) missing.push('기업/사업 아이템 설명');
    if (!formData.purpose.trim()) missing.push('추진 목적');
    if (!formData.region) missing.push('지역');
    if (missing.length > 0) {
      setError(`필수 항목을 입력해주세요: ${missing.join(', ')}`);
      return;
    }
    setError('');
    saveFormToStorage(formData); // 탐색 실행 시점에도 저장
    onSearch(formData);
  }

  function handleReset() {
    clearFormFromStorage();
    setFormData(INITIAL_FORM);
    setLoadedMsg(false);
    setError('');
    setResetMsg(true);
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setResetMsg(false), 4000);
  }

  return (
    <div className="flex flex-col gap-3">
      {/* 이전 입력값 불러옴 알림 */}
      {loadedMsg && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-xs text-green-700">
          <span>✓</span>
          <span>이전 입력값을 불러왔습니다.</span>
        </div>
      )}
      {/* 초기화 완료 알림 */}
      {resetMsg && (
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-600">
          <span>↺</span>
          <span>저장된 입력값을 초기화했습니다.</span>
        </div>
      )}

      {/* Agent 안내 */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">🔍</span>
          <div>
            <h2 className="text-sm font-bold text-gray-900">정부지원사업 탐색</h2>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              7개 통합 데이터 소스 기반 추천<br />
              기업·사업 정보를 입력하면 접수 가능 공고를 탐색합니다.
            </p>
          </div>
        </div>
      </div>

      {/* 필수 입력 */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-4">
        <h3 className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full flex-shrink-0" />
          필수 입력
        </h3>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            기업/사업 아이템 설명 <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            value={formData.business_description}
            onChange={e => handleChange('business_description', e.target.value)}
            placeholder="예) AI 기반 중소기업 업무자동화 플랫폼. 회의록 자동화, 보고서 생성, R&D 공고 분석 등 8개 업무 영역을 자동화하는 SaaS 솔루션"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            추진 목적 <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            value={formData.purpose}
            onChange={e => handleChange('purpose', e.target.value)}
            placeholder="예) AI 엔진 고도화 및 기업 고객 확보를 위한 R&D 자금 확보. 연내 베타 서비스 출시 후 유료 전환 목표"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            지역 <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.region}
            onChange={e => handleChange('region', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">지역 선택</option>
            {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {/* 선택 입력 (접기/펼치기) */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <button
          type="button"
          onClick={() => setShowOptional(prev => !prev)}
          className="w-full flex items-center justify-between text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0" />
            선택 입력
            <span className="font-normal text-gray-400">(더 정확한 추천)</span>
          </span>
          <span className="text-gray-400">{showOptional ? '▲ 접기' : '▼ 펼치기'}</span>
        </button>

        {showOptional && (
          <div className="mt-4 space-y-4 pt-4 border-t border-gray-100">
            {[
              { field: 'company_name' as const, label: '기업명', type: 'text', placeholder: '예) (주)미라클코워크' },
            ].map(({ field, label, placeholder }) => (
              <div key={field}>
                <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
                <input
                  type="text"
                  value={formData[field]}
                  onChange={e => handleChange(field, e.target.value)}
                  placeholder={placeholder}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">업종</label>
              <select
                value={formData.industry}
                onChange={e => handleChange('industry', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">업종 선택</option>
                {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>

            {[
              { field: 'core_technology'   as const, label: '보유 기술',     rows: 2, placeholder: '예) LLM API 연동, FastAPI 백엔드, React 프론트엔드, RAG 파이프라인' },
              { field: 'business_model'    as const, label: '사업모델',      rows: 2, placeholder: '예) 월정액 SaaS 구독 (기업 규모별 차등 요금)' },
              { field: 'rd_goal'           as const, label: 'R&D 목표',      rows: 2, placeholder: '예) 멀티 LLM 오케스트레이션 엔진 개발, 정확도 90% 이상 달성' },
              { field: 'demonstration_plan'as const, label: '실증 계획',     rows: 2, placeholder: '예) 협력 중소기업 5개사 파일럿 운영 후 성과 측정' },
              { field: 'supply_plan'       as const, label: '제품공급 계획', rows: 2, placeholder: '예) 2026년 하반기 베타 오픈 → 2027년 정식 출시' },
            ].map(({ field, label, rows, placeholder }) => (
              <div key={field}>
                <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
                <textarea
                  rows={rows}
                  value={formData[field]}
                  onChange={e => handleChange(field, e.target.value)}
                  placeholder={placeholder}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                />
              </div>
            ))}

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">희망 지원금 규모</label>
              <select
                value={formData.desired_funding}
                onChange={e => handleChange('desired_funding', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">규모 선택</option>
                {FUNDING_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">기업 단계</label>
              <select
                value={formData.company_stage}
                onChange={e => handleChange('company_stage', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">단계 선택</option>
                {COMPANY_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">관심 분야</label>
              <select
                value={formData.interest_area}
                onChange={e => handleChange('interest_area', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">분야 선택</option>
                {INTEREST_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* 오류 메시지 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-700">
          {error}
        </div>
      )}

      {/* 버튼 영역 */}
      <button
        onClick={handleSubmit}
        disabled={isSearching}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-3 px-4 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
      >
        {isSearching ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            탐색 중...
          </>
        ) : (
          '🔍 정부지원사업 탐색하기'
        )}
      </button>

      {/* 입력값 초기화 */}
      <button
        type="button"
        onClick={handleReset}
        disabled={isSearching}
        className="w-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 py-2 px-4 rounded-lg text-xs font-medium transition-colors"
      >
        ↺ 입력값 초기화
      </button>
    </div>
  );
}
