import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchInputForm from '../components/programSearch/SearchInputForm';
import ProgramResultCard from '../components/programSearch/ProgramResultCard';
import { MOCK_PROGRAMS } from '../data/programSearchMockData';
import type { ProgramRecommendation, SavedProgramEntry } from '../data/programSearchMockData';
import type { SearchFormData } from '../components/programSearch/SearchInputForm';

const SAVED_KEY  = 'savedPrograms';
const PAGE_SIZE  = 10;
const MAX_DISPLAY = 50;

const DATA_SOURCES = ['기업마당', 'NTIS', 'K-Startup', 'RNDGATE', '부처공고', '지자체/TP', 'IRIS'] as const;

// ── localStorage: 관심 공고 ──────────────────────────────────
function loadSavedIds(): Set<number> {
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    if (!raw) return new Set();
    return new Set((JSON.parse(raw) as ProgramRecommendation[]).map(p => p.rank));
  } catch {
    return new Set();
  }
}

// ── 중복 제거: program_name + organization + deadline 기준 ────
function deduplicatePrograms(programs: ProgramRecommendation[]): {
  deduped: ProgramRecommendation[];
  removedCount: number;
} {
  const map = new Map<string, ProgramRecommendation>();
  for (const p of programs) {
    const key = `${p.program_name}|${p.organization}|${p.deadline}`;
    const existing = map.get(key);
    if (!existing || p.fit_score > existing.fit_score) {
      map.set(key, p);
    }
  }
  const deduped = Array.from(map.values());
  return { deduped, removedCount: programs.length - deduped.length };
}

// ── 정렬: open 우선 → fit_score 내림차순 → deadline 오름차순 ─
function sortPrograms(programs: ProgramRecommendation[]): ProgramRecommendation[] {
  const statusOrder: Record<string, number> = { open: 0, upcoming: 1, closed: 2 };
  return [...programs].sort((a, b) => {
    const sd = (statusOrder[a.status] ?? 2) - (statusOrder[b.status] ?? 2);
    if (sd !== 0) return sd;
    const scoreDiff = b.fit_score - a.fit_score;
    if (scoreDiff !== 0) return scoreDiff;
    return a.deadline.localeCompare(b.deadline);
  });
}

interface SearchResult {
  programs: ProgramRecommendation[]; // dedup·filter·sort·cap 완료 목록
  totalFound: number;                // 접수 가능 공고 수 (dedup 후, closed 제외)
  duplicatesRemoved: number;
}

export default function GovernmentProgramSearch() {
  const navigate = useNavigate();
  const [isSearching, setIsSearching]       = useState(false);
  const [searchResult, setSearchResult]     = useState<SearchResult | null>(null);
  const [displayCount, setDisplayCount]     = useState(PAGE_SIZE);
  const [savedIds, setSavedIds]             = useState<Set<number>>(loadSavedIds);

  useEffect(() => { setSavedIds(loadSavedIds()); }, []);

  async function handleSearch(_formData: SearchFormData) {
    setIsSearching(true);
    setSearchResult(null);
    setDisplayCount(PAGE_SIZE);

    // mock 딜레이 (실제 API 대체)
    await new Promise(resolve => setTimeout(resolve, 1400));

    // 1. 전체 raw → 중복 제거
    const { deduped, removedCount } = deduplicatePrograms(MOCK_PROGRAMS);
    // 2. closed 제외 (접수중 + 접수예정만)
    const openPrograms = deduped.filter(p => p.status !== 'closed');
    // 3. 정렬
    const sorted = sortPrograms(openPrograms);
    // 4. 최대 50개 캡
    const capped = sorted.slice(0, MAX_DISPLAY);

    setSearchResult({ programs: capped, totalFound: openPrograms.length, duplicatesRemoved: removedCount });
    setIsSearching(false);
  }

  function handleSave(program: ProgramRecommendation) {
    try {
      const raw = localStorage.getItem(SAVED_KEY);
      const saved: SavedProgramEntry[] = raw
        ? (JSON.parse(raw) as Partial<SavedProgramEntry>[]).map(p => ({
            ...p,
            savedStatus: p.savedStatus ?? 'saved',
          } as SavedProgramEntry))
        : [];
      const isAlready = saved.some(p => p.rank === program.rank);
      const updated = isAlready
        ? saved.filter(p => p.rank !== program.rank)
        : [...saved, { ...program, savedStatus: 'saved' as const, savedAt: new Date().toISOString() }];
      localStorage.setItem(SAVED_KEY, JSON.stringify(updated));
      setSavedIds(new Set(updated.map(p => p.rank)));
    } catch {
      setSavedIds(prev => {
        const next = new Set(prev);
        if (next.has(program.rank)) next.delete(program.rank);
        else next.add(program.rank);
        return next;
      });
    }
  }

  const displayedPrograms = useMemo(
    () => searchResult?.programs.slice(0, displayCount) ?? [],
    [searchResult, displayCount]
  );

  const canLoadMore = searchResult !== null && displayCount < searchResult.programs.length;
  const remainingCount = searchResult ? Math.min(searchResult.programs.length - displayCount, PAGE_SIZE) : 0;

  return (
    <div>
      {/* 브레드크럼 + 관심 공고함 버튼 */}
      <div className="flex items-center justify-between mb-6 gap-3">
        <nav className="flex items-center gap-2 text-sm text-gray-500 min-w-0">
          <button onClick={() => navigate('/dashboard')} className="hover:text-gray-900 transition-colors flex-shrink-0">
            대시보드
          </button>
          <span>/</span>
          <span className="text-gray-600 flex-shrink-0">정부R&D 컨설턴트</span>
          <span>/</span>
          <span className="text-gray-900 font-medium flex-shrink-0">정부지원사업 탐색</span>
        </nav>
        <button
          onClick={() => navigate('/saved-programs')}
          className="flex-shrink-0 flex items-center gap-1.5 text-xs font-medium text-yellow-700 bg-yellow-50 border border-yellow-200 px-3 py-1.5 rounded-lg hover:bg-yellow-100 transition-colors"
        >
          ⭐ 관심 공고함
          {savedIds.size > 0 && (
            <span className="bg-yellow-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
              {savedIds.size}
            </span>
          )}
        </button>
      </div>

      {/* 2패널: 입력폼 | 결과 */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">

        {/* 좌측: 입력폼 */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <SearchInputForm onSearch={handleSearch} isSearching={isSearching} />
        </div>

        {/* 우측: 결과 영역 */}
        <div className="flex-1 min-w-0">

          {/* 탐색 중 */}
          {isSearching && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-20 text-center">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-5" />
              <p className="text-sm font-semibold text-gray-800">AI가 접수 가능 공고를 탐색 중입니다...</p>
              <div className="flex flex-col items-start gap-1.5 mt-4">
                {['7개 소스 데이터 수집 중', '중복 공고 제거 중', '적합도 분석 및 정렬 중'].map((step, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div
                      className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"
                      style={{ animationDelay: `${i * 200}ms` }}
                    />
                    <span className="text-xs text-gray-500">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 초기 안내 */}
          {!isSearching && searchResult === null && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center py-12 px-6 text-center">
              <div className="text-5xl mb-4">🏛️</div>
              <h3 className="text-base font-bold text-gray-900 mb-2">
                접수 가능한 정부지원사업을 찾아드립니다
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-5">
                왼쪽 폼에 기업·사업 정보를 입력하고<br />
                "정부지원사업 탐색하기"를 클릭하세요.
              </p>
              <div className="text-left space-y-2 w-full max-w-xs mb-6">
                {[
                  '필수 입력 3개 (기업 아이템·추진 목적·지역)',
                  '선택 입력으로 더 정확한 추천 가능',
                  '접수중·접수예정 공고만 표시 (마감 제외)',
                  '중복 공고 자동 제거 후 적합도순 정렬',
                  '최대 50건 · 10건씩 더보기 제공',
                  '공고문 분석 Agent와 바로 연계 가능',
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-blue-500 text-xs mt-0.5 flex-shrink-0">✓</span>
                    <span className="text-xs text-gray-600">{tip}</span>
                  </div>
                ))}
              </div>

              {/* 7개 통합 데이터 소스 */}
              <div className="w-full max-w-xs bg-blue-50 rounded-xl p-4 text-left">
                <p className="text-xs font-semibold text-blue-700 mb-1">7개 통합 데이터 소스 기반 추천</p>
                <p className="text-[11px] text-blue-600 leading-relaxed mb-3">
                  기업마당, NTIS, K-Startup, RNDGATE, 부처별 공고, 지자체·TP·진흥원, IRIS를 기준으로
                  접수 가능 공고를 탐색합니다.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {DATA_SOURCES.map(src => (
                    <span key={src} className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                      {src}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 검색 결과 */}
          {!isSearching && searchResult !== null && (
            <div>
              {/* 결과 통계 헤더 */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-sm font-bold text-gray-900">접수 가능 추천 지원사업</h2>
                  <span className="text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full">
                    관심 저장 {savedIds.size}건
                  </span>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-gray-700">
                    총{' '}
                    <span className="font-semibold text-blue-600">{searchResult.totalFound}건</span>
                    의 접수 가능 공고를 찾았습니다.
                  </p>
                  {searchResult.duplicatesRemoved > 0 && (
                    <p className="text-xs text-gray-400">
                      중복 공고 {searchResult.duplicatesRemoved}건을 제외하고 적합도순으로 정렬했습니다.
                    </p>
                  )}
                  <p className="text-xs text-gray-400">
                    현재{' '}
                    <span className="font-medium text-gray-600">{displayedPrograms.length}건</span>
                    {' '}표시 중
                    {searchResult.programs.length > displayedPrograms.length && (
                      <> / 전체 {searchResult.programs.length}건</>
                    )}
                  </p>
                </div>
                {/* 소스 뱃지 */}
                <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-gray-50">
                  {DATA_SOURCES.map(src => (
                    <span key={src} className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
                      {src}
                    </span>
                  ))}
                </div>
              </div>

              {/* 결과 카드 목록 */}
              <div className="flex flex-col gap-4">
                {displayedPrograms.map((program, index) => (
                  <ProgramResultCard
                    key={program.rank}
                    program={program}
                    displayRank={index + 1}
                    isSaved={savedIds.has(program.rank)}
                    onSave={handleSave}
                  />
                ))}
              </div>

              {/* 더보기 버튼 */}
              {canLoadMore && (
                <button
                  onClick={() =>
                    setDisplayCount(prev =>
                      Math.min(prev + PAGE_SIZE, searchResult.programs.length)
                    )
                  }
                  className="w-full mt-4 py-3 text-sm text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors font-medium"
                >
                  더보기 ({remainingCount}건 더 보기)
                </button>
              )}

              {/* 전체 표시 완료 */}
              {!canLoadMore && searchResult.programs.length > PAGE_SIZE && (
                <p className="text-center mt-4 text-xs text-gray-400">
                  전체 {searchResult.programs.length}건을 모두 표시했습니다.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
