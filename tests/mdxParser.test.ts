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
});
