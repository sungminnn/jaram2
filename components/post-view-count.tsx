"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

type PostViewCountProps = {
  postId: string;
  category: string;
  initialViews: number;
};

export function PostViewCount({ postId, category, initialViews }: PostViewCountProps) {
  const [views, setViews] = useState(initialViews);

  useEffect(() => {
    let isMounted = true;

    fetch(`/api/posts/${postId}/view`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ category }),
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { views?: number } | null) => {
        if (isMounted && typeof data?.views === "number") {
          setViews(data.views);
        }
      })
      .catch(() => undefined);

    return () => {
      isMounted = false;
    };
  }, [category, postId]);

  return (
    <span className="inline-flex items-center gap-2">
      <Eye size={16} aria-hidden="true" />
      {views}
    </span>
  );
}
