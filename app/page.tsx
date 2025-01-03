import { fetchNowPlayingMovies } from "api/fetchNowPlayingMovies";
import HomePage from "app/home/home-page";

export default async function Page() {
  const { results: nowPlayingMovies } = await fetchNowPlayingMovies();

  return <HomePage movieList={nowPlayingMovies} />;
}
