"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Movie } from "api/fetchNowPlayingMovies";
import {
  CastMember,
  CrewMember,
  fetchMovieCredits,
  MovieCredits,
} from "api/fetchMovieCredits";
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
  const [isError, setIsError] = useState<string | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [directors, setDirectors] = useState<CrewMember[]>([]);

  useEffect(() => {
    setCast([]);
    setDirectors([]);

    const fetchMovieCreditsData = async (movieId: number) => {
      try {
        const result = await fetchMovieCredits(movieId);

        // 배우 정보 처리
        // 중복된 배우가 있을 경우를 대비해 이름 기준으로 중복 제거
        const uniqueCast = result.cast.reduce(
          (unique: CastMember[], person) => {
            const isNameExist = unique.some((p) => p.name === person.name);
            if (!isNameExist) {
              unique.push(person);
            }
            return unique;
          },
          [],
        );
        setCast(uniqueCast);

        // 감독 정보 처리
        // job이 'Director'인 제작진만 필터링하고 중복 제거
        const uniqueDirectors = result.crew
          .filter((person) => person.job === "Director")
          .reduce((unique: CrewMember[], person) => {
            const isNameExist = unique.some((p) => p.name === person.name);
            if (!isNameExist) {
              unique.push(person);
            }
            return unique;
          }, []);
        setDirectors(uniqueDirectors);
      } catch (error) {
        setIsError("정보를 불러오는데 실패했습니다.");
      }
    };

    fetchMovieCreditsData(id);
  }, [id]);

  return (
    <section className="group relative mx-auto w-full break-keep">
      <div className="relative rounded-xl border-2 border-black bg-white p-2 lg:border-2 lg:transition-all lg:duration-300 lg:group-hover:-translate-x-1 lg:group-hover:-translate-y-1">
        <div className="p-4">
          <h2 className="mb-2 inline-block animate-bounce rounded-lg bg-[#701832] p-1 text-xs font-bold text-white">
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
        <ul className="flex items-center space-x-2 border-y-4 border-dotted border-gray-200 p-4 text-sm">
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
        <div className="flex flex-1 border-b-4 border-dotted border-gray-200">
          <ul className="flex-1 flex-col items-center justify-center py-4 text-center text-sm">
            {cast.slice(0, 3).map((actor) => (
              <li key={actor.id}>
                {actor.name}
                <span className="block text-xs text-gray-500">
                  {actor.character}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex p-2">
          <div className="flex-1 border-r-4 border-dotted border-gray-200">
            <p className="pr-2 text-sm font-bold text-black">개봉일</p>
            <p className="p-2 pb-4 text-center text-sm">{movieDate}</p>
          </div>
          <div className="flex-1 border-r-4 border-dotted border-gray-200">
            <p className="px-2 text-sm font-bold text-black">감독</p>
            <ul className="p-2 pb-4 text-center text-sm">
              {directors.map((director) => (
                <li key={`director-${director.id}`}>{director.name}</li>
              ))}
            </ul>
          </div>
          <div className="flex-1">
            <p className="px-2 text-sm font-bold text-black">평점</p>
            <div className="flex flex-1 items-center justify-center p-2 pb-4">
              <IoStar className="mr-1 text-[#D4AF37]" size={24} />
              <div className="text-2xl font-bold">
                {Math.round(vote_average * 10) / 10}
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full border-t-4 border-dotted border-gray-200 pt-4">
          <NewWriteBtn movieId={id} />
        </div>
      </div>
      <span className="absolute left-1 top-1 -z-10 h-full w-full rounded-xl bg-[#701832] lg:transition-all lg:duration-300 lg:group-hover:translate-x-1 lg:group-hover:translate-y-1" />
    </section>
  );
}
