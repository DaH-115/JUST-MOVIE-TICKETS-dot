"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Movie } from "./page";
import SwiperCard from "./ui/swiper-card";

export default function TicketSwiper({ movieList }: { movieList: Movie[] }) {
  return (
    <Swiper
      slidesPerView={1}
      spaceBetween={10}
      speed={600}
      loop={true}
      navigation={true}
      modules={[Navigation]}
      breakpoints={{
        // 640px
        640: {
          slidesPerView: 2,
          spaceBetween: 10,
        },
        // 768px
        768: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
        // 1024px
        1024: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
        // 1280px
        1280: {
          slidesPerView: 4,
          spaceBetween: 20,
        },
      }}
    >
      {movieList.map((movie, idx) => (
        <SwiperSlide key={movie.id}>
          <SwiperCard id={movie.id} idx={idx} movie={movie} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
