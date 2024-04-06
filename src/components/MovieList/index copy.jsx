import React from "react";
import PropTypes from "prop-types";

/**
 * 显示电影列表的组件:根据传入的电影数据，渲染到页面
 * 纯展示组件，没有状态，数据来自外部传入的props
 * @param {*} movies:传入的电影数据数组
 * @returns
 */
export default function MovieList({ movies }) {
  const movieList = movies.map((m) => <li key={m.id}>{m.original_title}</li>);
  return <ul>{movieList}</ul>;
}
MovieList.defaultProps = {
  movies: [],
};
MovieList.prototype = {
  movies: PropTypes.array.isRequired,
};
