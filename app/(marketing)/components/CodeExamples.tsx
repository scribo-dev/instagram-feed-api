"use client";

import { useState, useEffect } from "react";
import { getHighlighter, Highlighter } from "shiki";

const codeExamples = {
  curl: {
    label: "cURL",
    code: `curl https://instagram-feed-api-gamma.vercel.app/api/scribo.dev`,
    language: "shell",
  },
  nodejs: {
    label: "Node.js",
    code: `fetch('https://instagram-feed-api-gamma.vercel.app/api/scribo.dev')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`,
    language: "typescript",
  },
  python: {
    label: "Python",
    code: `import requests

response = requests.get('https://instagram-feed-api-gamma.vercel.app/api/scribo.dev')
data = response.json()
print(data)`,
    language: "python",
  },
};

export function CodeExamples() {
  const [activeTab, setActiveTab] = useState("curl");
  const [highlighter, setHighlighter] = useState<Highlighter | null>(null);
  const [highlightedCode, setHighlightedCode] = useState("");

  useEffect(() => {
    getHighlighter({
      themes: ["github-dark"],
      langs: ["shell", "typescript", "python"],
    }).then((hl) => {
      setHighlighter(hl);
    });
  }, []);

  useEffect(() => {
    if (highlighter) {
      const example = codeExamples[activeTab as keyof typeof codeExamples];
      const highlighted = highlighter.codeToHtml(example.code, {
        lang: example.language,
        themes: {
          light: "github-dark",
          dark: "github-dark",
        },
      });
      setHighlightedCode(highlighted);
    }
  }, [highlighter, activeTab]);

  return (
    <div className="space-y-4 w-full">
      {/* Tabs */}
      <div className="flex space-x-1 rounded-lg bg-gray-100 p-1">
        {Object.entries(codeExamples).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 rounded-md py-2.5 text-sm font-medium leading-5 
              ${
                activeTab === key
                  ? "bg-white text-gray-700 shadow"
                  : "text-gray-500 hover:text-gray-700"
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Code block */}
      <div className="relative w-full">
        <div className="rounded-xl bg-gray-900 p-6 shadow-lg min-h-[200px] w-full">
          <div className="text-white font-mono text-sm">
            {highlightedCode ? (
              <div
                dangerouslySetInnerHTML={{ __html: highlightedCode }}
                className="[&>pre]:!bg-transparent [&>pre]:!p-0 [&>pre]:!m-0 [&>pre>code]:!whitespace-pre-wrap"
              />
            ) : (
              <pre className="whitespace-pre-wrap m-0">
                {codeExamples[activeTab as keyof typeof codeExamples].code}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
