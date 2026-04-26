"use client";

import { useEffect, useRef, useState } from "react";

type CKEditorFieldProps = {
  name: string;
  value: string;
  onChange: (value: string) => void;
};

type CKEditorInstance = {
  getData: () => string;
  setData: (value: string) => void;
  destroy: () => Promise<void>;
  model: {
    document: {
      on: (event: string, callback: () => void) => void;
    };
  };
  plugins: {
    get: (name: string) => {
      createUploadAdapter?: (loader: CKEditorLoader) => CKEditorUploadAdapter;
    };
  };
};

type CKEditorLoader = {
  file: Promise<File>;
  uploaded?: number;
  uploadTotal?: number;
};

type CKEditorUploadAdapter = {
  upload: () => Promise<{ default: string }>;
  abort: () => void;
};

declare global {
  interface Window {
    ClassicEditor?: {
      create: (element: HTMLElement, config: Record<string, unknown>) => Promise<CKEditorInstance>;
    };
  }
}

let editorScriptPromise: Promise<void> | null = null;

function loadEditorScript() {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  if (window.ClassicEditor) {
    return Promise.resolve();
  }

  if (!editorScriptPromise) {
    editorScriptPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector<HTMLScriptElement>('script[src="/assets/js/ckeditor.js"]');

      if (existingScript) {
        existingScript.addEventListener("load", () => resolve(), { once: true });
        existingScript.addEventListener("error", () => reject(new Error("CKEditor script load failed.")), { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = "/assets/js/ckeditor.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("CKEditor script load failed."));
      document.head.appendChild(script);
    });
  }

  return editorScriptPromise;
}

class UploadAdapter implements CKEditorUploadAdapter {
  private xhr?: XMLHttpRequest;

  constructor(private readonly loader: CKEditorLoader) {}

  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise<{ default: string }>((resolve, reject) => {
          this.initRequest();
          this.initListeners(resolve, reject, file);
          this.sendRequest(file);
        }),
    );
  }

  abort() {
    this.xhr?.abort();
  }

  private initRequest() {
    this.xhr = new XMLHttpRequest();
    this.xhr.open("POST", "/api/editor-images", true);
    this.xhr.responseType = "json";
  }

  private initListeners(resolve: (value: { default: string }) => void, reject: (reason?: unknown) => void, file: File) {
    const xhr = this.xhr;
    const genericErrorText = `Couldn't upload file: ${file.name}.`;

    if (!xhr) {
      reject(genericErrorText);
      return;
    }

    xhr.addEventListener("error", () => reject(genericErrorText));
    xhr.addEventListener("abort", () => reject());
    xhr.addEventListener("load", () => {
      const response = xhr.response as { url?: string; error?: { message?: string }; message?: string } | null;

      if (!response || response.error || !response.url) {
        reject(response?.error?.message ?? response?.message ?? genericErrorText);
        return;
      }

      resolve({ default: response.url });
    });

    if (xhr.upload) {
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          this.loader.uploadTotal = event.total;
          this.loader.uploaded = event.loaded;
        }
      });
    }
  }

  private sendRequest(file: File) {
    const data = new FormData();
    data.append("upload", file);
    this.xhr?.send(data);
  }
}

function uploadAdapterPlugin(editor: CKEditorInstance) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => new UploadAdapter(loader);
}

export function CKEditorField({ name, value, onChange }: CKEditorFieldProps) {
  const editorHostRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<CKEditorInstance | null>(null);
  const initialValueRef = useRef(value);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    loadEditorScript()
      .then(async () => {
        if (!isMounted || !editorHostRef.current || !window.ClassicEditor || editorRef.current) {
          return;
        }

        const editor = await window.ClassicEditor.create(editorHostRef.current, {
          extraPlugins: [uploadAdapterPlugin],
          toolbar: [
            "undo",
            "redo",
            "|",
            "bold",
            "italic",
            "underline",
            "|",
            "fontSize",
            "fontColor",
            "fontBackgroundColor",
            "highLight",
            "|",
            "link",
            "imageUpload",
            "insertTable",
            "blockQuote",
            "|",
            "bulletedList",
            "numberedList",
            "alignment",
          ],
          table: {
            contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
          },
        });

        if (!isMounted) {
          await editor.destroy();
          return;
        }

        editorRef.current = editor;
        editor.setData(initialValueRef.current);
        editor.model.document.on("change:data", () => onChange(editor.getData()));
      })
      .catch(() => setLoadError("에디터를 불러오지 못했습니다. 내용을 일반 입력창에 작성해주세요."));

    return () => {
      isMounted = false;
      const editor = editorRef.current;
      editorRef.current = null;
      void editor?.destroy();
    };
  }, []);

  return (
    <div className="grid gap-2">
      <input type="hidden" name={name} value={value} />
      <div ref={editorHostRef} />
      {loadError ? (
        <>
          <p className="rounded-xl border border-[#f2b1a8] bg-[#fff4f1] px-4 py-3 text-sm font-semibold text-[#a13a29]">
            {loadError}
          </p>
          <textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            rows={10}
            className="resize-y rounded-2xl border border-forest/12 bg-cream px-4 py-3 text-base outline-none focus:border-leaf"
          />
        </>
      ) : null}
    </div>
  );
}
