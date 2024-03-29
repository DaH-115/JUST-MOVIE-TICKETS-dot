import styled from 'styled-components';
import useGetGenres from 'hooks/useGetGenres';
import { MovieTicketProps } from 'ticketType';
import PosterImage from 'components/ticket/PosterImage';
import MovieInfoBtn from 'components/ticket/MovieInfoBtn';
import TicketDetails from 'components/ticket/TicketDetails';

const TopTenMovieTicket = ({
  movieId,
  releaseDate,
  movieIndex,
  title,
  posterPath,
  voteAverage,
}: MovieTicketProps) => {
  const genreArr = useGetGenres(movieId);
  const releaseYear = releaseDate.slice(0, 4);

  return (
    <TicketWrapper>
      <MovieIndexBar>
        <MovieRank>{`${movieIndex}.`}</MovieRank>
        <MovieInfoBtn movieId={movieId} />
      </MovieIndexBar>

      <PosterImage
        title={title}
        releaseYear={releaseYear}
        posterPath={posterPath}
      />

      <TicketDetails
        title={title}
        releaseYear={releaseYear}
        voteAverage={voteAverage}
        genres={genreArr}
        posterPath={posterPath}
        movieId={movieId}
      />
    </TicketWrapper>
  );
};

export default TopTenMovieTicket;

const TicketWrapper = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;
  margin-top: 2rem;
`;

const MovieIndexBar = styled.div`
  position: absolute;
  top: -1rem;
  left: 0;

  display: flex;
  justify-content: space-between;
  align-items: center;

  width: 100%;
  color: #fff;
  padding: 0 2rem;

  ${({ theme }) => theme.device.tablet} {
    padding: 0 1rem;
  }
`;

const MovieRank = styled.h2`
  font-size: 3rem;
  font-weight: 700;

  ${({ theme }) => theme.device.tablet} {
    font-size: 2.8rem;
  }
`;
