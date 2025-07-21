import {
  BookOpen,
  Play,
  Code,
  Settings,
  FileText,
  Edit,
  Eye,
  ArrowLeft,
} from "lucide-react";

interface HelpPageProps {
  onBack: () => void;
}

export function HelpPage({ onBack }: HelpPageProps) {
  return (
    <div className="help-page">
      <div className="help-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={16} />
          뒤로 가기
        </button>
        <h1>Flikary CMS 도움말</h1>
        <p>CMS 클라이언트 사용법을 안내합니다.</p>
      </div>

      <div className="help-content">
        <section className="help-section">
          <h2>
            <Play size={20} />
            시작하기
          </h2>
          <div className="help-steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>API 서버 실행</h3>
                <p>터미널에서 API 서버를 실행합니다:</p>
                <pre>vercel dev --listen 3000</pre>
              </div>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>CMS 클라이언트 실행</h3>
                <p>새 터미널에서 클라이언트를 실행합니다:</p>
                <pre>cd client && pnpm dev</pre>
              </div>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>브라우저 접속</h3>
                <p>브라우저에서 다음 주소로 접속합니다:</p>
                <pre>http://localhost:3001</pre>
              </div>
            </div>
          </div>
        </section>

        <section className="help-section">
          <h2>
            <FileText size={20} />
            포스트 관리
          </h2>
          <div className="feature-grid">
            <div className="feature">
              <div className="feature-icon">
                <FileText size={24} />
              </div>
              <h3>포스트 목록</h3>
              <p>왼쪽 사이드바에서 모든 포스트를 확인할 수 있습니다.</p>
            </div>

            <div className="feature">
              <div className="feature-icon">
                <Eye size={24} />
              </div>
              <h3>포스트 보기</h3>
              <p>포스트를 선택하면 상세 내용을 확인할 수 있습니다.</p>
            </div>

            <div className="feature">
              <div className="feature-icon">
                <Edit size={24} />
              </div>
              <h3>포스트 편집</h3>
              <p>편집 버튼을 클릭하여 포스트 내용을 수정할 수 있습니다.</p>
            </div>
          </div>
        </section>

        <section className="help-section">
          <h2>
            <Code size={20} />
            기술 스택
          </h2>
          <div className="tech-stack">
            <div className="tech-item">
              <h4>Frontend</h4>
              <ul>
                <li>React 18</li>
                <li>TypeScript</li>
                <li>Vite</li>
                <li>Lucide React (아이콘)</li>
              </ul>
            </div>

            <div className="tech-item">
              <h4>Backend</h4>
              <ul>
                <li>Node.js</li>
                <li>Vercel Functions</li>
                <li>MDX/MD 파싱</li>
                <li>OpenAPI 3.0</li>
              </ul>
            </div>

            <div className="tech-item">
              <h4>디자인</h4>
              <ul>
                <li>미니멀 브루탈리즘</li>
                <li>반응형 레이아웃</li>
                <li>직관적 UI/UX</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="help-section">
          <h2>
            <Settings size={20} />
            API 엔드포인트
          </h2>
          <div className="api-endpoints">
            <div className="endpoint">
              <code>GET /api/posts</code>
              <span>모든 포스트 목록</span>
            </div>
            <div className="endpoint">
              <code>GET /api/posts/:slug</code>
              <span>특정 포스트 조회</span>
            </div>
            <div className="endpoint">
              <code>GET /api/posts/:slug/html</code>
              <span>HTML 변환</span>
            </div>
            <div className="endpoint">
              <code>GET /api/posts/:slug/raw</code>
              <span>원본 MD/MDX</span>
            </div>
            <div className="endpoint">
              <code>GET /api/docs</code>
              <span>API 문서</span>
            </div>
          </div>
        </section>

        <section className="help-section">
          <h2>
            <BookOpen size={20} />
            파일 형식 지원
          </h2>
          <div className="format-support">
            <div className="format">
              <h4>MDX 파일 (.mdx)</h4>
              <ul>
                <li>커스텀 React 컴포넌트 지원</li>
                <li>HTML 태그 직접 사용</li>
                <li>수학 공식 (KaTeX)</li>
                <li>GitHub Flavored Markdown</li>
              </ul>
            </div>

            <div className="format">
              <h4>MD 파일 (.md)</h4>
              <ul>
                <li>일반 Markdown 문법</li>
                <li>HTML 태그 직접 사용</li>
                <li>GitHub Flavored Markdown</li>
                <li>코드 하이라이팅</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
