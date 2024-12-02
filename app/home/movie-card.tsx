"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Movie } from "api/fetchNowPlayingMovies";
import { fetchMovieCredits, MovieCredits } from "api/fetchMovieCredits";
import useGetGenres from "hooks/useGetGenres";
import useFormatDate from "hooks/useFormatDate";
import { FaInfoCircle } from "react-icons/fa";
import { IoStar } from "react-icons/io5";
import AnimatedOverview from "app/ui/animated-overview";
import NewWriteBtn from "app/ui/new-write-btn";
import Tooltip from "app/ui/tooltip";

export default function MovieCard({ movie }: { movie: Movie }) {
  const { id, title, original_title, release_date, vote_average, overview } =
    movie;
  const {
    genres,
    loading: genresLoading,
    error: genresError,
  } = useGetGenres(id);
  const movieDate = useFormatDate(release_date);
  const [credits, setCredits] = useState<MovieCredits | null>(null);
  const [isError, setIsError] = useState<string | null>(null);

  useEffect(() => {
    setCredits(null);

    const fetchMovieCreditsData = async (movieId: number) => {
      try {
        const result = await fetchMovieCredits(movieId);
        setCredits(result);
      } catch (error) {
        console.log(error);
        setCredits(null);
        setIsError("정보를 불러오는데 실패했습니다.");
      }
    };

    fetchMovieCreditsData(id);
  }, [id]);

  return (
    <section className="relative mx-auto w-full break-keep">
      <div className="relative rounded-xl border-2 border-black bg-white lg:border-2 lg:transition-all lg:duration-300 lg:group-hover:-translate-x-1 lg:group-hover:-translate-y-1">
        <div className="p-4">
          <h2 className="mb-2 inline-block animate-bounce rounded-lg bg-black p-1 text-xs font-bold text-white">
            추천 영화
          </h2>
          <div className="flex">
            <h1 className="text-3xl font-bold lg:text-4xl">{title}</h1>
            <div className="group/tooltip relative ml-2">
              <Link href={`/movie-details/${id}`}>
                <FaInfoCircle className="relative text-base lg:text-lg" />
              </Link>
              <Tooltip>더 자세한 정보 보기</Tooltip>
            </div>
          </div>
          <div className="ml-1 flex items-center">
            <h3 className="mr-2 text-lg text-gray-500">{`${original_title}(${release_date.slice(0, 4)})`}</h3>
          </div>
        </div>
        <ul className="flex items-center space-x-2 border-y border-black px-4 py-2 text-sm">
          {genresLoading && (
            <li className="text-xs text-gray-300 lg:text-sm">
              장르를 불러 오는 중
            </li>
          )}
          {genresError && (
            <li className="text-xs text-gray-300 lg:text-sm">
              장르 정보를 불러올 수 없습니다
            </li>
          )}
          {genres.length > 0 ? (
            genres.map((genre, idx) => (
              <li
                className="rounded-full border border-black bg-white px-2 py-1 text-xs text-black transition-colors duration-300 hover:bg-black hover:text-white active:bg-white active:text-black lg:text-sm"
                key={idx}
              >
                {genre}
              </li>
            ))
          ) : (
            <li className="text-xs text-gray-300 lg:text-sm">
              장르 정보가 없습니다
            </li>
          )}
        </ul>
        {overview && <AnimatedOverview overview={overview} />}
        <div className="flex flex-1 border-b border-black">
          <ul className="flex-1 flex-col items-center justify-center py-4 text-center text-sm">
            {credits ? (
              credits.cast
                ?.slice(0, 3)
                .map((cast) => <li key={cast.id}>{cast.name}</li>)
            ) : (
              <li>{isError}</li>
            )}
          </ul>
        </div>
        <div className="flex">
          <div className="flex-1 border-r-2 border-dotted border-gray-300">
            <div className="p-2">
              <p className="text-sm font-bold text-black">개봉일</p>
            </div>
            <p className="p-2 pb-4 text-center text-sm">{movieDate}</p>
          </div>
          <div className="flex-1 border-r-2 border-dotted border-gray-300">
            <div className="p-2">
              <p className="text-sm font-bold text-black">감독</p>
            </div>
            <ul className="p-2 pb-4 text-center text-sm">
              {credits ? (
                credits.crew
                  ?.slice(0, 3)
                  .map((crew) => <li key={crew.id}>{crew.name}</li>)
              ) : (
                <li>{isError}</li>
              )}
            </ul>
          </div>
          <div className="flex-1">
            <div className="p-2">
              <p className="text-sm font-bold text-black">평점</p>
            </div>
            <div className="flex flex-1 items-center justify-center p-2 pb-4">
              <IoStar className="mr-1" size={24} />
              <div className="text-2xl font-bold">
                {Math.round(vote_average * 10) / 10}
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full border-t border-black p-1">
          <NewWriteBtn movieId={id} />
        </div>
      </div>
      <span className="absolute left-1 top-1 -z-10 h-full w-full rounded-xl border border-black bg-gray-700 lg:transition-all lg:duration-300 lg:group-hover:translate-x-1 lg:group-hover:translate-y-1 lg:group-hover:border-gray-400 lg:group-hover:bg-gray-200" />
    </section>
  );
}