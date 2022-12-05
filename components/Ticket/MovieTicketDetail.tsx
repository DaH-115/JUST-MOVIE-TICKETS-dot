import styled from 'styled-components';
import MovieTextDetail from './MovieTextDetail';
import AdmitBtn from './AdmitBtn';
import { MovieInfoProps } from 'ticketType';

const MovieTicketDetail = ({
  title,
  voteAverage,
  releaseYear,
  reviewText,
  janre,
  posterPath,
}: MovieInfoProps) => {
  return (
    <MovieDetailWrapper>
      <MovieTextDetail
        title={title}
        releaseYear={releaseYear}
        voteAverage={voteAverage}
        reviewText={reviewText}
        janre={janre}
      />

      {/* 🎈 GO TO "/write" PAGE BUTTON */}
      {!reviewText && (
        <AdmitBtn
          title={title}
          releaseYear={releaseYear}
          posterPath={posterPath}
        />
      )}
    </MovieDetailWrapper>
  );
};

export default MovieTicketDetail;

const MovieDetailWrapper = styled.div`
  position: relative;
  bottom: 3rem;
  left: 0;
  display: flex;
  width: 100%;
  height: 100%;
  color: ${({ theme }) => theme.colors.black};
  filter: drop-shadow(0px 0px 40px rgba(50, 50, 50, 0.9));
`;
