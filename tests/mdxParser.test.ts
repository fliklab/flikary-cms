import fs from "fs";
import path from "path";
import { parseMdxFile, getAllPosts } from "@/utils/mdxParser";

describe("mdxParser", () => {
  const testDir = path.join(__dirname, "tmp-posts");
  const testFile = path.join(testDir, "test.mdx");
  const mdxContent = `---\ntitle: 테스트\ndate: 2024-01-01\ntags:\n  - test\n---\n\n본문 내용입니다.`;

  beforeAll(() => {
    fs.mkdirSync(testDir, { recursive: true });
    fs.writeFileSync(testFile, mdxContent);
  });

  afterAll(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it("mdx 파일을 올바르게 파싱한다", () => {
    const post = parseMdxFile(testFile);
    expect(post.title).toBe("테스트");
    expect(post.date).toEqual(new Date("2024-01-01T00:00:00.000Z"));
    expect(post.tags).toEqual(["test"]);
    expect(post.content).toContain("본문 내용입니다.");
  });

  it("디렉토리 내 모든 mdx 파일을 파싱한다", () => {
    const posts = getAllPosts(testDir);
    expect(posts.length).toBe(1);
    expect(posts[0].slug).toBe("test");
  });

  it("실제 content/posts 디렉토리의 파일들을 파싱한다", () => {
    const postsDir = path.join(process.cwd(), "content/posts");
    const posts = getAllPosts(postsDir);

    // 최소 4개의 포스트가 있어야 함 (샘플 파일들)
    expect(posts.length).toBeGreaterThanOrEqual(4);

    // 특정 포스트들이 존재하는지 확인
    const slugs = posts.map((post) => post.slug);
    expect(slugs).toContain("hello-world");
    expect(slugs).toContain("getting-started");
    expect(slugs).toContain("api-documentation");
    expect(slugs).toContain("advanced-features");
  });

  it("포스트의 메타데이터가 올바르게 파싱된다", () => {
    const postsDir = path.join(process.cwd(), "content/posts");
    const posts = getAllPosts(postsDir);

    const gettingStarted = posts.find(
      (post) => post.slug === "getting-started"
    );
    expect(gettingStarted).toBeDefined();
    expect(gettingStarted?.title).toBe("Getting Started with Flikary CMS");
    expect(gettingStarted?.tags).toContain("guide");
    expect(gettingStarted?.tags).toContain("tutorial");
  });
});
