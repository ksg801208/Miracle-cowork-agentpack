import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { documentsApi } from '../services/api';
import type { Document } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import RunResultViewer from '../components/RunResultViewer';
import { formatDate } from '../utils';

export default function DocumentDetail() {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  const [doc, setDoc] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!documentId) return;
    documentsApi.getById(documentId)
      .then(setDoc)
      .catch(() => navigate('/projects'))
      .finally(() => setLoading(false));
  }, [documentId, navigate]);

  if (loading) return <LoadingSpinner />;
  if (!doc) return null;

  async function handleCopy() {
    await navigator.clipboard.writeText(doc!.content_markdown ?? '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleDownload() {
    setDownloading(true);
    setError('');
    try {
      await documentsApi.download(doc!.document_id, doc!.title);
    } catch {
      setError('다운로드 중 오류가 발생했습니다.');
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="max-w-4xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
        <button onClick={() => navigate('/projects')} className="hover:text-gray-900">프로젝트</button>
        {doc.project_id && (
          <>
            <span>/</span>
            <button onClick={() => navigate(`/projects/${doc.project_id}`)} className="hover:text-gray-900">
              프로젝트 상세
            </button>
          </>
        )}
        <span>/</span>
        <span className="text-gray-900 font-medium truncate max-w-xs">{doc.title}</span>
      </nav>

      {/* 문서 헤더 */}
      <div className="card mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-gray-900 mb-2">{doc.title}</h1>
            <div className="flex items-center gap-3 flex-wrap text-xs text-gray-500">
              {doc.document_type && (
                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                  {doc.document_type}
                </span>
              )}
              {doc.area_id && (
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {doc.area_id}
                </span>
              )}
              <span>{formatDate(doc.created_at)}</span>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleCopy}
              className="btn-secondary text-xs py-1.5 px-3"
            >
              {copied ? '✓ 복사됨' : '복사'}
            </button>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"
            >
              {downloading ? (
                <>
                  <div className="w-3 h-3 border-2 border-gray-400 border-t-gray-700 rounded-full animate-spin" />
                  다운로드 중...
                </>
              ) : (
                '↓ MD 다운로드'
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
            {error}
          </div>
        )}
      </div>

      {/* 문서 본문 — Markdown 렌더링 */}
      <RunResultViewer
        content={doc.content_markdown ?? ''}
        onCopy={handleCopy}
      />

      {/* 확장 다운로드 안내 */}
      <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-500">
        <strong>다운로드 옵션:</strong> Markdown (.md) 다운로드 지원 중 · Word/PDF 다운로드는 향후 업데이트 예정
      </div>
    </div>
  );
}
