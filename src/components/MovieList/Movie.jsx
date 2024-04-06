import React from "react";
import "./Movie.css";

// TMDB 电影图片和链接地址的前缀
const IMG_Ex = "https://media.themoviedb.org/t/p/w440_and_h660_face";
const LINK_EX = "https://www.themoviedb.org/movie/";

export default function Movie(props) {
  const { movie } = props;
  return (
    <div>
      <a href={LINK_EX + movie.id} target="_blank" rel="noopener noreferrer">
        <img src={IMG_Ex + movie.backdrop_path} alt="" />
      </a>
      <a href={LINK_EX + movie.id} target="_blank" rel="noopener noreferrer">
        <p className="title">{movie.title}</p>
      </a>
      <p className="rate">Rate：{movie.vote_average.toFixed(2)}</p>
    </div>
  );
}
