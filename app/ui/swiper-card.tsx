import { Movie } from "app/page";
import useGetGenres from "hooks/useGetGenres";
import Image from "next/image";

export default function SwiperCard({
  idx,
  movie,
  id,
}: {
  movie: Movie;
  idx: number;
  id: number;
}) {
  const { genres } = useGetGenres(id);
  const { original_title, poster_path, title, vote_average } = movie;

  return (
    <div className="relative h-dvh py-6">
      <div className="absolute left-0 top-5 w-full bg-gradient-to-t from-transparent to-black p-4 pt-5 text-6xl font-bold text-white">
        {idx + 1}.
      </div>
      <Image
        width={640}
        height={750}
        className="h-full w-full object-cover object-center"
        src={`https://image.tmdb.org/t/p/original/${poster_path}`}
        alt={`${title}(${original_title})`}
      />
      {/* MOVIE INFO CARD */}
      <div className="absolute bottom-5 left-0 w-full border-2 border-black bg-white">
        <div className="inline-block w-full border-b-2 border-black p-4 text-2xl font-bold">{`${title}(${original_title})`}</div>
        <div className="flex w-full flex-wrap p-1">
          {genres.map((genre, idx) => (
            <p
              className="m-1 rounded-full border-2 border-black bg-white p-2 px-2 py-1 text-sm text-black"
              key={idx}
            >
              {genre}
            </p>
          ))}
        </div>
        <div className="flex w-full border-t-2 border-black text-center">
          <div className="border-r-2 border-black p-2">{vote_average}</div>
          <div className="p-2">누르면 이동합니다</div>
        </div>
      </div>
    </div>
  );
}
