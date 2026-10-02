import { describe, expect, test } from "@jest/globals";
import { AppHelper } from "./app-helper";
import { PostFormat } from "./settings";

const listFormat: PostFormat = { type: "list" } as any;

function createApp(content: string, headings: any[], listItems: any[] = []) {
  const write = jest.fn();
  const app = {
    vault: {
      adapter: {
        read: jest.fn().mockResolvedValue(content),
        write,
        append: jest.fn(),
      },
    },
    metadataCache: {
      getFileCache: () => ({ headings, listItems }),
    },
    workspace: {},
    commands: { commands: {}, executeCommandById: () => false },
  } as any;
  return { app, write };
}

describe("insertTextUnderSection list", () => {
  test("replaces empty dash", async () => {
    const heading = "## H";
    const content = `${heading}\n- \n`;
    const { app, write } = createApp(content, [
      {
        level: 2,
        heading: "H",
        position: { start: { offset: 0 }, end: { offset: heading.length } },
      },
    ]);
    const helper = new AppHelper(app);
    const file = { path: "test.md" } as any;
    await helper.insertTextUnderSection(
      file,
      "## H",
      "\n- 2024 msg\n",
      listFormat,
      ""
    );
    expect(write).toHaveBeenCalledWith("test.md", `${heading}\n- 2024 msg\n`);
  });

  test("inserts before delimiter", async () => {
    const heading = "## ☑️ タスク";
    const content = `${heading}\n- [ ] a\n---\n`;
    const { app, write } = createApp(content, [
      {
        level: 2,
        heading: "☑️ タスク",
        position: { start: { offset: 0 }, end: { offset: heading.length } },
      },
    ]);
    const helper = new AppHelper(app);
    const file = { path: "test.md" } as any;
    await helper.insertTextUnderSection(
      file,
      heading,
      "\n- [ ] b\n",
      listFormat,
      "---"
    );
    expect(write).toHaveBeenCalledWith(
      "test.md",
      `${heading}\n- [ ] a\n- [ ] b\n---\n`
    );
  });

  test("preserves task affix whitespace before delimiter", async () => {
    const heading = "## ☑️ タスク";
    const content = `${heading}\n- [ ] a\n---\n`;
    const { app, write } = createApp(content, [
      {
        level: 2,
        heading: "☑️ タスク",
        position: { start: { offset: 0 }, end: { offset: heading.length } },
      },
    ]);
    const helper = new AppHelper(app);
    const file = { path: "test.md" } as any;

    await helper.insertTextUnderSection(
      file,
      heading,
      "\n- [ ] task #todo  \n",
      listFormat,
      "---"
    );

    expect(write).toHaveBeenCalledWith(
      "test.md",
      `${heading}\n- [ ] a\n- [ ] task #todo  \n---\n`
    );
  });

  test("appends a missing section and task to the end", async () => {
    const content = "## H\nbody\n---\n";
    const { app, write } = createApp(content, [
      {
        level: 2,
        heading: "H",
        position: { start: { offset: 0 }, end: { offset: 4 } },
      },
    ]);
    const helper = new AppHelper(app);
    const file = { path: "test.md" } as any;
    await helper.insertTextUnderSection(
      file,
      "## ☑️ タスク",
      "\n- [ ] task\n",
      listFormat,
      "---"
    );
    expect(write).toHaveBeenCalledWith(
      "test.md",
      `${content}\n## ☑️ タスク\n\n\n- [ ] task\n`
    );
  });
});

describe("getTasks", () => {
  test("returns tasks from the entire daily note", async () => {
    const content = [
      "## ☑️ タスク",
      "- [ ] dedicated",
      "## メモ",
      "- [x] outside",
    ].join("\n");
    const dedicatedOffset = content.indexOf("- [ ] dedicated");
    const outsideOffset = content.indexOf("- [x] outside");
    const { app } = createApp(
      content,
      [],
      [
        {
          task: " ",
          position: { start: { line: 1, offset: dedicatedOffset } },
        },
        {
          task: "x",
          position: { start: { line: 3, offset: outsideOffset } },
        },
      ]
    );
    const helper = new AppHelper(app);
    const tasks = await helper.getTasks({ path: "test.md" } as any);

    expect(tasks).toEqual([
      { mark: " ", name: "dedicated", offset: dedicatedOffset },
      { mark: "x", name: "outside", offset: outsideOffset },
    ]);
  });
});

describe("insertTextUnderSection codeblock", () => {
  const block = "````fw 12:00\nfirst\n\nsecond\n````";
  test.each(["", "\n", "\n\n", "\n\n\n"])(
    "keeps one blank line before a block with existing suffix %j",
    async (suffix) => {
      const { app, write } = createApp(`## H\n\nprevious${suffix}`, [
        {
          level: 2,
          heading: "H",
          position: { start: { offset: 0 }, end: { offset: 4 } },
        },
      ]);
      await new AppHelper(app).insertTextUnderSection(
        { path: "test.md" } as any,
        "## H",
        `\n${block}\n`,
        { type: "codeblock" },
        ""
      );
      expect(write).toHaveBeenCalledWith(
        "test.md",
        `## H\n\nprevious\n\n${block}\n`
      );
    }
  );
  test("keeps one blank line before the section end delimiter", async () => {
    const { app, write } = createApp("## H\n\n---\n", [
      {
        level: 2,
        heading: "H",
        position: { start: { offset: 0 }, end: { offset: 4 } },
      },
    ]);
    await new AppHelper(app).insertTextUnderSection(
      { path: "test.md" } as any,
      "## H",
      `\n${block}\n`,
      { type: "codeblock" },
      "---"
    );
    expect(write).toHaveBeenCalledWith("test.md", `## H\n\n${block}\n\n---\n`);
  });
  test("keeps one blank line after a newly created section heading", async () => {
    const { app, write } = createApp("existing\n", []);
    await new AppHelper(app).insertTextUnderSection(
      { path: "test.md" } as any,
      "## H",
      `\n${block}\n`,
      { type: "codeblock" },
      ""
    );
    expect(write).toHaveBeenCalledWith(
      "test.md",
      `existing\n\n## H\n\n${block}\n`
    );
  });
});
