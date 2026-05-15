import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Props {
  content: string;
  onCopy?: () => void;
  onSave?: () => void;
}

export default function RunResultViewer({ content, onCopy, onSave }: Props) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">생성 결과</h3>
        <div className="flex gap-2">
          {onCopy && (
            <button onClick={onCopy} className="btn-secondary text-xs py-1.5 px-3">
              복사
            </button>
          )}
          {onSave && (
            <button onClick={onSave} className="btn-primary text-xs py-1.5 px-3">
              저장
            </button>
          )}
        </div>
      </div>
      <div className="prose prose-sm max-w-none prose-table:text-sm">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            table: ({ children }) => (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg text-xs">
                  {children}
                </table>
              </div>
            ),
            th: ({ children }) => (
              <th className="px-3 py-2 bg-gray-50 text-left text-xs font-medium text-gray-600 border-b border-gray-200">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="px-3 py-2 text-gray-700 border-b border-gray-100">{children}</td>
            ),
            h1: ({ children }) => <h1 className="text-xl font-bold text-gray-900 mt-0">{children}</h1>,
            h2: ({ children }) => <h2 className="text-base font-semibold text-gray-800 mt-6 mb-2 border-b pb-1">{children}</h2>,
            h3: ({ children }) => <h3 className="text-sm font-semibold text-gray-700 mt-4 mb-1">{children}</h3>,
            code: ({ children }) => (
              <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-xs font-mono">{children}</code>
            ),
            pre: ({ children }) => (
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs font-mono">{children}</pre>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-blue-400 pl-4 italic text-gray-600 my-4">{children}</blockquote>
            ),
            ul: ({ children }) => <ul className="list-disc list-inside space-y-1 text-sm">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 text-sm">{children}</ol>,
            li: ({ children }) => <li className="text-gray-700">{children}</li>,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
