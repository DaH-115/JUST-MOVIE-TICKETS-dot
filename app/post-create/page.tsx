"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { db } from "firebase-config";
import { collection, addDoc } from "firebase/firestore";
import { fetchMovieDetails } from "api/fetchMovieDetails";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { addNewReviewAlertHandler } from "store/newReviewAlertSlice";
import useGetTitle from "hooks/useGetTitle";
import BackGround from "app/ui/back-ground";
import Catchphrase from "app/ui/catchphrase";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { IoStar } from "react-icons/io5";

type PostData = {
  date: string;
  reviewTitle: string;
  rating: number;
  review: string;
};

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const movieId = searchParams.get("id");
  const userState = useAppSelector((state) => state.user.user);
  const [movieInfo, setMovieInfo] = useState({
    title: "",
    release_date: "",
    poster_path: "",
    backdrop_path: "",
    original_title: "",
    vote_average: 0,
  });
  const movieTitle = useGetTitle(movieInfo.original_title, movieInfo.title);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchMovieInfo = async () => {
      try {
        const res = await fetchMovieDetails(Number(movieId));
        if (res) {
          setMovieInfo({ ...res, backdrop_path: res.backdrop_path || "" });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchMovieInfo();
  }, [movieId]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm<PostData>({
    defaultValues: {
      reviewTitle: "",
      rating: 0,
      review: "",
    },
  });

  const [showExitConfirmation, setShowExitConfirmation] = useState(false);

  const onSubmit = async (data: PostData) => {
    try {
      const { poster_path, release_date } = movieInfo;
      const { reviewTitle, rating, review } = data;
      const { uid, displayName } = userState;

      await addDoc(collection(db, "movie-reviews"), {
        userUid: uid,
        userName: displayName,
        reviewTitle,
        rating,
        review,
        date: new Date().toLocaleDateString(),
        movieTitle,
        releaseYear: release_date.slice(0, 4),
        posterImage: poster_path,
      });

      dispatch(addNewReviewAlertHandler());
      router.push("/");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handlePageExit = useCallback(() => {
    if (isDirty) {
      setShowExitConfirmation(true);
    } else {
      router.push("/");
    }
  }, [router, isDirty]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirty) {
        event.preventDefault();
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  return (
    <>
      {movieInfo.backdrop_path && (
        <BackGround
          imageUrl={movieInfo.backdrop_path}
          movieTitle={movieTitle}
        />
      )}

      {/* POP UP */}
      {showExitConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="w-full max-w-md rounded-lg border border-black bg-white p-4 drop-shadow-xl">
            <div className="mb-4 border-b border-black">
              <span className="font-bold">Alert</span>
              <span className="ml-1">알림</span>
            </div>
            <div className="mb-6 text-lg">
              현재 내용이 사라집니다. 정말로 나가시겠습니까?
            </div>
            <div className="flex justify-end">
              <button
                className="mr-2 rounded-xl bg-gray-200 px-4 py-2 transition-all duration-300 hover:bg-gray-300"
                onClick={() => setShowExitConfirmation(false)}
              >
                아니오
              </button>
              <button
                className="rounded-xl bg-red-500 px-4 py-2 text-white transition-all duration-300 hover:bg-red-600"
                onClick={() => router.push("/")}
              >
                네
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-40 flex items-center justify-center py-16 drop-shadow-lg">
        <div className="w-1/3 rounded-xl border-2 border-black bg-white">
          <div className="w-full p-4">
            <div className="flex items-end">
              <h1 className="text-3xl font-bold">Write Your Review</h1>
            </div>
            <div className="text-gray-800">{`${movieTitle} (${movieInfo.release_date.slice(0, 4)})`}</div>
          </div>
          <div className="flex justify-between border-b border-black px-4 py-2 text-sm">
            <span>{new Date().toLocaleDateString()}</span>
            <div>
              <span>작성자</span>
              <span className="ml-1 font-bold">
                {userState ? userState.displayName : "Guest"}
              </span>
            </div>
          </div>
          <div className="w-full">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="pt-2">
                <div className="mb-2 border-b border-black px-2 pb-4">
                  <label
                    htmlFor="date"
                    className="mb-2 inline-block rounded-lg p-1 text-sm font-bold"
                  >
                    <span className="font-bold">Title</span>
                    <span className="ml-2">제목</span>
                  </label>
                  <input
                    type="text"
                    id="reviewTitle"
                    {...register("reviewTitle", {
                      required: "제목을 입력해주세요.",
                    })}
                    placeholder="리뷰 제목"
                    className="w-full rounded-lg border p-2"
                  />
                  {errors.reviewTitle && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.reviewTitle.message}
                    </p>
                  )}
                </div>

                <div className="mb-2 border-b border-black px-2 pb-4">
                  <label
                    htmlFor="rating"
                    className="mb-2 inline-block rounded-lg p-1 text-sm font-bold"
                  >
                    <span className="font-bold">Rating</span>

                    <span className="ml-2">평점</span>
                  </label>
                  <input
                    type="range"
                    id="rating"
                    {...register("rating", { valueAsNumber: true })}
                    min="0"
                    max="10"
                    step="0.5"
                    className="w-full accent-black"
                  />
                  <div className="flex items-center justify-center text-center">
                    <div>
                      <IoStar className="mr-1" size={20} />
                    </div>
                    <div className="text-lg font-bold">{watch("rating")}</div>
                    <div>/ 10</div>
                  </div>
                </div>

                <div className="mb-4 px-2">
                  <label
                    htmlFor="review"
                    className="mb-2 inline-block rounded-lg p-1 text-sm font-bold"
                  >
                    <span className="font-bold">Review</span>
                    <span className="ml-2">감상</span>
                  </label>
                  <textarea
                    id="review"
                    {...register("review", {
                      required: "내용을 입력해주세요.",
                    })}
                    placeholder="감상평을 작성해주세요."
                    className="h-32 w-full rounded-lg border p-2"
                  />
                  {errors.review && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.review.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-end border-t border-black p-2">
                <button
                  type="button"
                  className="mr-2 w-full rounded-xl bg-gray-200 py-4 transition-all duration-300 hover:bg-white"
                  onClick={handlePageExit}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="group flex w-full items-center justify-center rounded-xl bg-black p-4 text-white transition-all duration-300 hover:font-bold"
                >
                  <div>작성</div>
                  <MdDriveFileRenameOutline className="ml-1" size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Catchphrase />
    </>
  );
}
