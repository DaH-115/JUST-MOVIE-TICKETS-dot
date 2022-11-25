import { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

import { TicketProps } from '../main/MovieTicket';
import AdmitBtn from '../ticket/AdmitBtn';
import InfoButton from '../ticket/InfoButton';
import MovieTextDetail from '../ticket/MovieTextDetail';

const SearchTicketList = ({
  title,
  releaseDate,
  movieId,
  movieIndex,
  voteAverage,
  posterPath,
  overview,
}: TicketProps) => {
  const [janre, setJanre] = useState<string[]>([]);
  const releaseYear = releaseDate.slice(0, 4);

  // 🎈 GET Genres
  useEffect(() => {
    if (movieId) {
      (async () => {
        const res = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
        );
        const data = await res.data;

        const result = data.genres.map(
          (item: { id: number; name: string }) => item.name
        );

        setJanre(result);
      })();
    }
  }, [movieId]);

  return (
    <SearchResultWrapper>
      <SearchResult>
        <TestStyled>
          <InfoButton
            title={title}
            releaseYear={releaseYear}
            janre={janre}
            voteAverage={voteAverage}
            overview={overview}
            posterPath={posterPath}
          />
        </TestStyled>
        <MovieTextDetail
          title={title}
          releaseYear={releaseYear}
          janre={janre}
          voteAverage={voteAverage}
        />
        <AdmitBtn
          title={title}
          releaseYear={releaseYear}
          posterPath={posterPath}
        />
      </SearchResult>
    </SearchResultWrapper>
  );
};

export default SearchTicketList;

const SearchResultWrapper = styled.div`
  display: flex;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.black};
  overflow-y: scroll;

  ${({ theme }) => theme.scrollbarStyle.scrollbarReset}
`;

const SearchResult = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  max-width: 600px;
  padding: 0rem 1rem;
  padding-left: 0.5rem;
  margin-bottom: 1rem;
`;

const TestStyled = styled.div`
  margin-right: 0.5rem;
  div {
    font-size: 1.2rem;
    color: #fff;
  }
`;