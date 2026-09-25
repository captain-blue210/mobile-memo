import { describe, expect, test } from "@jest/globals";
import { JSDOM } from "jsdom";
import {
  getCharsetFromMeta,
  getCoverUrl,
  getFaviconUrl,
  getMetaByHttpEquiv,
} from "./meta-helper";

const documentFrom = (html: string): Document =>
  new JSDOM(html).window.document;

describe("getFaviconUrl", () => {
  test.each<{
    name: string;
    html: string;
    url: string;
    expected: string;
  }>`
    name                            | html                                                                                                              | url                              | expected
    ${"absolute SVG URL"}           | ${'<link rel="icon" href="https://cdn.example.com/icon.svg">'}                                                    | ${"https://example.com/posts/1"} | ${"https://cdn.example.com/icon.svg"}
    ${"absolute PNG URL"}           | ${'<link rel="icon" href="https://cdn.example.com/favicon-hashed.png">'}                                          | ${"https://example.com/posts/1"} | ${"https://cdn.example.com/favicon-hashed.png"}
    ${"absolute ICO URL"}           | ${'<link rel="icon" href="https://cdn.example.com/favicon.ico">'}                                                 | ${"https://example.com/posts/1"} | ${"https://cdn.example.com/favicon.ico"}
    ${"icon without an extension"}  | ${'<link rel="shortcut icon" href="https://cdn.example.com/icon">'}                                               | ${"https://example.com/posts/1"} | ${"https://cdn.example.com/icon"}
    ${"missing icon"}               | ${"<title>Example</title>"}                                                                                       | ${"https://example.com/posts/1"} | ${"https://example.com/favicon.ico"}
    ${"root-relative icon"}         | ${'<link rel="icon" href="/assets/favicon.png">'}                                                                 | ${"https://example.com/posts/1"} | ${"https://example.com/assets/favicon.png"}
    ${"path-relative icon"}         | ${'<link rel="icon" href="favicon.png">'}                                                                         | ${"https://example.com/posts/1"} | ${"https://example.com/posts/favicon.png"}
    ${"document base URL"}          | ${'<base href="/assets/"><link rel="shortcut icon" href="icons/favicon.png">'}                                    | ${"https://example.com/posts/1"} | ${"https://example.com/assets/icons/favicon.png"}
    ${"preferred icon file format"} | ${'<link rel="icon" href="/favicon.ico"><link rel="icon" href="/favicon.png"><link rel="icon" href="/icon.svg">'} | ${"https://example.com/posts/1"} | ${"https://example.com/icon.svg"}
  `("resolves $name", ({ html, url, expected }) => {
    expect(getFaviconUrl(documentFrom(html), url)).toBe(expected);
  });
});

describe("getCoverUrl", () => {
  test.each<{
    name: string;
    html: string;
    url: string;
    expected: string | undefined;
  }>`
    name                             | html                                                                          | url                              | expected
    ${"absolute property URL"}       | ${'<meta property="og:image" content="https://cdn.example.com/cover.png">'}   | ${"https://example.com/posts/1"} | ${"https://cdn.example.com/cover.png"}
    ${"root-relative property URL"}  | ${'<meta property="og:image" content="/images/cover.png">'}                   | ${"https://example.com/posts/1"} | ${"https://example.com/images/cover.png"}
    ${"path-relative property URL"}  | ${'<meta property="og:image" content="images/cover.png">'}                    | ${"https://example.com/posts/1"} | ${"https://example.com/posts/images/cover.png"}
    ${"metadata declared with name"} | ${'<meta name="og:image" content="https://cdn.example.com/named-cover.png">'} | ${"https://example.com/posts/1"} | ${"https://cdn.example.com/named-cover.png"}
    ${"legacy ebook cover element"}  | ${'<img id="ebooksImgBlkFront" src="/images/book.jpg">'}                      | ${"https://example.com/books/1"} | ${"https://example.com/images/book.jpg"}
    ${"missing cover"}               | ${"<title>Example</title>"}                                                   | ${"https://example.com/posts/1"} | ${undefined}
  `("resolves $name", ({ html, url, expected }) => {
    expect(getCoverUrl(documentFrom(html), url)).toBe(expected);
  });
});

describe("getMetaByHttpEquiv", () => {
  test.each<{
    name: string;
    html: string;
    expected: { content: string } | undefined;
  }>`
    name                        | html                                                                        | expected
    ${"EUC-JP content type"}    | ${'<meta http-equiv="content-type" content="text/html; charset=EUC-JP">'}   | ${{ content: "text/html; charset=EUC-JP" }}
    ${"Shift_JIS content type"} | ${'<meta http-equiv="content-type" content="text/html;charset=shift_jis">'} | ${{ content: "text/html;charset=shift_jis" }}
    ${"different http-equiv"}   | ${'<meta http-equiv="refresh" content="30">'}                               | ${undefined}
    ${"charset metadata only"}  | ${'<meta charset="UTF-8">'}                                                 | ${undefined}
  `("returns $name", ({ html, expected }) => {
    expect(getMetaByHttpEquiv(documentFrom(html), "content-type")).toEqual(
      expected
    );
  });
});

describe("getCharsetFromMeta", () => {
  test.each<{
    name: string;
    html: string;
    expected: string | undefined;
  }>`
    name                   | html                            | expected
    ${"UTF-8 charset"}     | ${'<meta charset="UTF-8">'}     | ${"UTF-8"}
    ${"Shift_JIS charset"} | ${'<meta charset="shift_jis">'} | ${"shift_jis"}
    ${"missing charset"}   | ${"<title>Example</title>"}     | ${undefined}
  `("returns $name", ({ html, expected }) => {
    expect(getCharsetFromMeta(documentFrom(html))).toBe(expected);
  });
});
