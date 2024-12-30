"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { db } from "firebase-config";
import { doc, getDoc } from "firebase/firestore";
import { useAppSelector } from "store/hooks";

interface ReviewBtnGroupProps {
  postId: string;
  movieId: string;
  onReviewDeleted: (postId: string) => void;
}

const ReviewBtnGroup = React.memo(function ReviewBtnGroup({
  postId,
  movieId,
  onReviewDeleted,
}: ReviewBtnGroupProps) {
  const userState = useAppSelector((state) => state.user.user);
  const [isOwnership, setIsOwnership] = useState(false);

  const checkOwnership = useCallback(async () => {
    if (!userState?.uid || !postId) return;

    try {
      const reviewDoc = await getDoc(doc(db, "movie-reviews", postId));
      if (reviewDoc.exists()) {
        const reviewData = reviewDoc.data();
        setIsOwnership(reviewData.userUid === userState.uid);
      }
    } catch (error) {
      setIsOwnership(false);
    }
  }, [postId, userState?.uid]);

  useEffect(() => {
    checkOwnership();
  }, [checkOwnership]);

  const handleDelete = useCallback(() => {
    onReviewDeleted(postId);
  }, [onReviewDeleted, postId]);

  return (
    <>
      {isOwnership && (
        <div className="flex items-center space-x-1 text-xs">
          <button
            onClick={handleDelete}
            className="rounded-full border-2 border-black bg-white px-2 py-1 transition-colors duration-300 hover:bg-gray-200 active:bg-black active:text-white"
          >
            삭제
          </button>
          <Link href={`/write-review/${postId}?movieId=${movieId}`}>
            <button className="rounded-full border-2 border-black bg-white px-2 py-1 transition-colors duration-300 hover:bg-gray-200 active:bg-black active:text-white">
              수정
            </button>
          </Link>
        </div>
      )}
    </>
  );
});

export default ReviewBtnGroup;
