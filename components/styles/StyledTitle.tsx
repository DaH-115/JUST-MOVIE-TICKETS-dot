import styled from 'styled-components';

export const SlideTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin-left: ${({ theme }) => theme.space.mobile};

  ${({ theme }) => theme.device.tablet} {
    font-size: 2.5rem;
    font-weight: 700;
    margin-left: ${({ theme }) => theme.space.tablet};
    /* margin-bottom: 2rem; */
  }

  ${({ theme }) => theme.device.desktop} {
    margin-left: ${({ theme }) => theme.space.desktop};
  }
`;
